import db from '../modules/database';
import exception from '../modules/exception';
import { saasConfig } from '../config';
import { createAPP } from '../index.js';
import AWS from 'aws-sdk';
import { IToken } from '../models/Auth.js';
import config from '../config.js';
import fs from 'fs';
import { Ssh } from '../modules/ssh.js';
import { NginxConfFile } from 'nginx-conf';
import * as process from 'process';
import { ApiPublic } from '../api-public/services/public-table-check.js';
import { BackendService } from './backend-service.js';
import { Template } from './template.js';
import Tool from './tool';
import path from 'path';
import { AppInitial } from './app-initial.js';
import { User } from '../api-public/services/user.js';
import { LanguageLocation } from '../Language.js';
import express from 'express';

export class App {
  public token?: IToken;

  public static getAdConfig(app: string, key: string) {
    return new Promise<any>(async (resolve, reject) => {
      const data = await db.query(
        `select \`value\`
                 from \`${config.DB_NAME}\`.private_config
                 where app_name = '${app}'
                   and \`key\` = ${db.escape(key)}`,
        []
      );
      resolve(data[0] ? data[0]['value'] : {});
    });
  }

  public async checkVersion(libraryName: string) {
    // 获取当前工作目录
    const currentDir = process.cwd();

    // 获取 package.json 文件的路径
    const packageJsonPath = path.join(currentDir, 'package.json');

    // 读取 package.json 文件内容
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

      // 在 dependencies 和 devDependencies 中查找库的版本号
      const dependencies = packageJson.dependencies || {};
      const devDependencies = packageJson.devDependencies || {};

      if (dependencies[libraryName]) {
        return dependencies[libraryName];
      } else if (devDependencies[libraryName]) {
        return devDependencies[libraryName];
      } else {
        throw new Error(`Library ${libraryName} is not listed in dependencies or devDependencies`);
      }
    } else {
      throw new Error('package.json not found in the current directory');
    }
  }

  public async createApp(cf: {
    appName: string;
    copyApp: string;
    copyWith: string[];
    brand: string;
    name?: string;
    theme?: string;
    sub_domain: string;
  }) {
    try {
      cf.copyWith = cf.copyWith ?? [];
      cf.sub_domain = cf.sub_domain.replace(/\./g, '');
      const count = await db.execute(
        `
                    select count(1)
                    from \`${saasConfig.SAAS_NAME}\`.app_config
                    where appName = ${db.escape(cf.appName)}
                `,
        []
      );
      if (count[0]['count(1)'] === 1) {
        throw exception.BadRequestError('HAVE_APP', 'This app already be used.', null);
      }
      const domain_count = await db.execute(
        `
                    select count(1)
                    from \`${saasConfig.SAAS_NAME}\`.app_config
                    where domain = ${db.escape(`${cf.sub_domain}.${config.HostedDomain}`)}
                `,
        []
      );
      if (domain_count[0]['count(1)'] === 1) {
        throw exception.BadRequestError('HAVE_DOMAIN', 'This domain already be used.', null);
      }

      let copyAppData: any = undefined;
      let copyPageData: any = undefined;
      let privateConfig: any = undefined;
      if (cf.copyApp) {
        await ApiPublic.createScheme(cf.copyApp);
        copyAppData = (
          await db.execute(
            `select *
                         from \`${saasConfig.SAAS_NAME}\`.app_config
                         where appName = ${db.escape(cf.copyApp)}`,
            []
          )
        )[0];
        copyPageData = await db.execute(
          `select *
                     from \`${saasConfig.SAAS_NAME}\`.page_config
                     where appName = ${db.escape(cf.copyApp)}`,
          []
        );
        privateConfig = await db.execute(
          `select *
                     from \`${saasConfig.SAAS_NAME}\`.private_config
                     where app_name = ${db.escape(cf.copyApp)} `,
          []
        );
      }

      await db.execute(
        `insert into \`${saasConfig.SAAS_NAME}\`.app_config (user, appName, dead_line, \`config\`,
                                                                     brand, theme_config, refer_app,
                                                                     template_config)
                 values (?, ?, ?, ${db.escape(JSON.stringify((copyAppData && copyAppData.config) || {}))},
                         ${db.escape(cf.brand ?? saasConfig.SAAS_NAME)},
                         ${db.escape(
                           JSON.stringify(
                             (copyAppData && copyAppData.theme_config) ?? {
                               name:
                                 (copyAppData && copyAppData.template_config && copyAppData.template_config.name) ||
                                 cf.name,
                             }
                           )
                         )},
                         ${cf.theme ? db.escape(cf.theme) : 'null'},
                         ${db.escape(JSON.stringify((copyAppData && copyAppData.template_config) || {}))})`,
        [this.token!.userID, cf.appName, addDays(new Date(), saasConfig.DEF_DEADLINE)]
      );

      await this.putSubDomain({
        app_name: cf.appName,
        name: cf.sub_domain,
      });
      await ApiPublic.createScheme(cf.appName);
      const trans = await db.Transaction.build();
      if (cf.copyWith.indexOf('manager_post') !== -1) {
        for (const dd of await db.query(
          `SELECT *
                     FROM \`${cf.copyApp}\`.t_manager_post`,
          []
        )) {
          dd.content = dd.content && JSON.stringify(dd.content);
          dd.userID = this.token!.userID;
          await trans.execute(
            `
                            insert into \`${cf.appName}\`.t_manager_post
                            SET ?;
                        `,
            [dd]
          );
        }
      }
      if (cf.copyWith.indexOf('user_post') !== -1) {
        for (const dd of await db.query(
          `SELECT *
                     FROM \`${cf.copyApp}\`.t_post`,
          []
        )) {
          dd.content = dd.content && JSON.stringify(dd.content);
          await trans.execute(
            `
                            insert into \`${cf.appName}\`.t_post
                            SET ?;
                        `,
            [dd]
          );
        }
      }
      for (const dd of await db.query(
        `SELECT *
                 FROM \`${cf.copyApp}\`.t_global_event`,
        []
      )) {
        dd.json = dd.json && JSON.stringify(dd.json);
        await trans.execute(
          `
                        insert into \`${cf.appName}\`.t_global_event
                        SET ?;
                    `,
          [dd]
        );
      }
      if (cf.copyWith.indexOf('public_config') !== -1) {
        for (const dd of await db.query(
          `SELECT *
                     FROM \`${cf.copyApp}\`.public_config`,
          []
        )) {
          dd.value = dd.value && JSON.stringify(dd.value);
          if (!['editorGuide', 'guideable', 'guide'].includes(dd.key)) {
            await trans.execute(
              `
                                insert into \`${cf.appName}\`.public_config
                                SET ?;
                            `,
              [dd]
            );
          }
        }
        for (const dd of await db.query(
          `SELECT *
                     FROM \`${cf.copyApp}\`.t_user_public_config`,
          []
        )) {
          dd.value = dd.value && JSON.stringify(dd.value);
          if (
            dd.userID !== 'manager' &&
            ![
              'custom_form_checkout',
              'custom_form_register',
              'customer_form_user_setting',
              'robot_auto_reply',
              'image-manager',
              'message_setting',
            ].includes(dd.key)
          ) {
            await trans.execute(
              `
                                insert
                                ignore into \`${cf.appName}\`.t_user_public_config
                                SET ?;
                            `,
              [dd]
            );
          }
        }
      }
      if (privateConfig) {
        for (const dd of privateConfig) {
          if (dd.key === 'logistics_setting') {
            dd.value = {
              form: [],
              info: '<p style=\'box-sizing: border-box; margin: 0px; text-align: left; font-size: 14px; font-weight: 700; letter-spacing: 1.2px; color: rgb(254, 85, 65); font-family: "Open Sans", sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\' id="isPasted">感謝您在 SHOPNEX 購買商品，商品的包裝與配送</p><p style=\'box-sizing: border-box; margin: 0px; text-align: left; font-size: 14px; font-weight: 700; letter-spacing: 1.2px; color: rgb(254, 85, 65); font-family: "Open Sans", sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\'>預計花費約 3 到 6 週，煩請耐心等候！</p><p style=\'box-sizing: border-box; margin: 0px; text-align: left; font-size: 14px; font-weight: 700; letter-spacing: 1.2px; color: rgb(254, 85, 65); font-family: "Open Sans", sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\'>若約定配送日當天未能聯繫到你，因而無法完成配送</p><p style=\'box-sizing: border-box; margin: 0px; text-align: left; font-size: 14px; font-weight: 700; letter-spacing: 1.2px; color: rgb(254, 85, 65); font-family: "Open Sans", sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\'>商家會約定再次配送的時間，您將支付額外的運費。</p>',
              support: ['OKMARTC2C', 'shop', 'FAMIC2C', 'UNIMARTC2C'],
              custom_delivery: [],
              whiteListExpand: {},
            };
          }
          if (dd.key === 'glitter_shipment') {
            dd.value = {
              volume: [],
              weight: [],
              selectCalc: 'volume',
            };
          }
          await trans.execute(
            `
                            insert into \`${saasConfig.SAAS_NAME}\`.private_config (\`app_name\`, \`key\`, \`value\`, updated_at)
                            values (?, ?, ?, ?);
                        `,
            [cf.appName, dd.key, JSON.stringify(dd.value), new Date()]
          );
        }
      }
      if (copyPageData) {
        for (const dd of copyPageData) {
          if (dd.tag !== 'index-app') {
            await trans.execute(
              `
                            insert into \`${saasConfig.SAAS_NAME}\`.page_config (userID, appName, tag, \`group\`,
                                                                                 \`name\`,
                                                                                 \`config\`, \`page_config\`, page_type)
                            values (?, ?, ?, ?, ?, ${db.escape(JSON.stringify(dd.config))},
                                    ${db.escape(JSON.stringify(dd.page_config))}, ${db.escape(dd.page_type)});
                        `,
              [this.token!.userID, cf.appName, dd.tag, dd.group || '未分類', dd.name]
            );
          }
        }
      } else {
        await trans.execute(
          `
                        insert into \`${saasConfig.SAAS_NAME}\`.page_config (userID, appName, tag, \`group\`, \`name\`,
                                                                             \`config\`, \`page_config\`)
                        values (?, ?, ?, ?, ?, ${db.escape(JSON.stringify({}))}, ${db.escape(JSON.stringify({}))});
                    `,
          [this.token!.userID, cf.appName, 'index', '', '首頁']
        );
      }
      await trans.commit();
      const store_information = (
        await db.query(
          `select *
                     from \`${cf.appName}\`.t_user_public_config
                     where \`key\` = ? `,
          [`store-information`]
        )
      )[0];
      if (store_information) {
        await db.query(
          `delete
                     from \`${cf.appName}\`.t_user_public_config
                     where \`key\` = ?
                       and id > 0`,
          ['store-information']
        );
      }
      for (const b of AppInitial.main(cf.appName)) {
        await db.query(b.sql, [b.obj]);
      }
      await db.query(
        `insert into \`${cf.appName}\`.t_user_public_config
                 set ?`,
        [
          {
            key: 'store-information',
            user_id: 'manager',
            updated_at: new Date(),
            value: JSON.stringify({
              shop_name: cf.name,
            }),
          },
        ]
      );
      await createAPP(cf);
      return true;
    } catch (e: any) {
      await db.query(
        `delete
                 from \`${saasConfig.SAAS_NAME}\`.app_config
                 where appName = ?`,
        [cf.appName]
      );
      console.log(e);
      throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', e, null);
    }
  }

  public async updateThemeConfig(body: { theme: string; config: any }) {
    try {
      await db.query(
        `update \`${saasConfig.SAAS_NAME}\`.app_config
                 set theme_config=?
                 where appName = ?`,
        [JSON.stringify(body.config), body.theme]
      );
      return true;
    } catch (e: any) {
      throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', e, null);
    }
  }

  public async changeTheme(config: { app_name: string; theme: string }) {
    try {
      const temp_app_name = Tool.randomString(4) + new Date().getTime();
      const temp_app_theme = Tool.randomString(4) + new Date().getTime();
      const tran = await db.Transaction.build();

      const cf_app = (
        await db.query(
          `select \`domain\`, \`dead_line\`, \`plan\`
                     from \`${saasConfig.SAAS_NAME}\`.app_config
                     where appName = ${db.escape(config.app_name)}`,
          []
        )
      )[0];
      /*
       * 交換APP和theme的資料
       * */
      await tran.execute(
        `update \`${saasConfig.SAAS_NAME}\`.app_config
                 set appName=${db.escape(temp_app_name)},
                     refer_app=${db.escape(config.app_name)},
                     domain=null
                 where appName = ${db.escape(config.app_name)}
                   and user = ?`,
        [this.token?.userID]
      );
      await tran.execute(
        `update \`${saasConfig.SAAS_NAME}\`.app_config
                 set appName=${db.escape(temp_app_theme)},
                     refer_app=null,
                     domain=${cf_app['domain'] ? db.escape(cf_app['domain']) : 'null'},
                     dead_line=${cf_app['dead_line'] ? db.escape(cf_app['dead_line']) : 'null'},
                     plan=${cf_app['plan'] ? db.escape(cf_app['plan']) : 'null'}
                 where appName = ${db.escape(config.theme)}
                   and user = ?`,
        [this.token?.userID]
      );
      /*
       * 將APP name 寫回去
       * */
      await tran.execute(
        `update \`${saasConfig.SAAS_NAME}\`.app_config
                 set appName=${db.escape(config.app_name)}
                 where appName = ${db.escape(temp_app_theme)}
                   and user = ?`,
        [this.token?.userID]
      );
      await tran.execute(
        `update \`${saasConfig.SAAS_NAME}\`.app_config
                 set appName=${db.escape(config.theme)}
                 where appName = ${db.escape(temp_app_name)}
                   and user = ?`,
        [this.token?.userID]
      );
      /*
       * 交換PageConfig
       * */
      await tran.execute(
        `update \`${saasConfig.SAAS_NAME}\`.page_config
                 set appName=${db.escape(temp_app_name)}
                 where appName = ${db.escape(config.app_name)}
                `,
        []
      );
      await tran.execute(
        `update \`${saasConfig.SAAS_NAME}\`.page_config
                 set appName=${db.escape(temp_app_theme)}
                 where appName = ${db.escape(config.theme)}
                `,
        []
      );

      await tran.execute(
        `update \`${saasConfig.SAAS_NAME}\`.page_config
                 set appName=${db.escape(config.app_name)}
                 where appName = ${db.escape(temp_app_theme)}
                `,
        []
      );
      await tran.execute(
        `update \`${saasConfig.SAAS_NAME}\`.page_config
                 set appName=${db.escape(config.theme)}
                 where appName = ${db.escape(temp_app_name)}
                `,
        []
      );
      await tran.commit();
      await tran.release();
      return true;
    } catch (e: any) {
      console.log(`error-->`, e);
      throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', e, null);
    }
  }

  public async getAPP(query: { app_name?: string; theme?: string }) {
    try {
      const empStores = await db.query(
        `SELECT *
                 FROM \`${saasConfig.SAAS_NAME}\`.app_auth_config
                 WHERE user = '${this.token!.userID}'
                   AND status = 1
                   AND invited = 1;`,
        []
      );
      const allStores = await db.query(
        `SELECT *
                 FROM \`${saasConfig.SAAS_NAME}\`.app_config
                 WHERE ${(() => {
                   const sql = [
                     `(user = '${this.token!.userID}' OR appName = 
                            (SELECT appName FROM \`${saasConfig.SAAS_NAME}\`.app_auth_config
                            WHERE user = '${this.token!.userID}' AND status = 1 AND invited = 1)
                        )`,
                   ];
                   if (query.app_name) {
                     sql.push(` appName='${query.app_name}' `);
                   } else if (query.theme) {
                     sql.push(` refer_app='${query.theme}' `);
                   } else {
                     sql.push(` refer_app is null `);
                   }
                   return sql.join(' and ');
                 })()};
                `,
        []
      );
      return allStores.map((store: any) => {
        const type = empStores.find((st: any) => st.appName === store.appName);
        store.store_permission_title = type ? 'employee' : 'owner';
        return store;
      });
    } catch (e: any) {
      throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', e, null);
    }
  }

  public async getTemplate(query: { app_name?: string; template_from: 'all' | 'me' }) {
    try {
      return await db.execute(
        `
                    SELECT user, appName, created_time, dead_line, brand, template_config, template_type, domain
                    FROM \`${saasConfig.SAAS_NAME}\`.app_config
                    where ${(() => {
                      const sql = [];
                      query.template_from === 'me' && sql.push(`user = '${this.token!.userID}'`);
                      query.template_from === 'me' && sql.push(`template_type in (3,2)`);
                      query.template_from === 'all' && sql.push(`template_type = 2`);
                      return sql
                        .map(dd => {
                          return `(${dd})`;
                        })
                        .join(' and ');
                    })()};
                `,
        []
      );
    } catch (e: any) {
      throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', e, null);
    }
  }

  public async getAppConfig(config: { appName: string }) {
    try {
      const data = (
        await db.execute(
          `
                        SELECT config, \`dead_line\`, \`template_config\`, \`template_type\`
                        FROM \`${saasConfig.SAAS_NAME}\`.app_config
                        where appName = ${db.escape(config.appName)};
                    `,
          []
        )
      )[0];
      const pluginList = data['config'] ?? {};
      pluginList.dead_line = data.dead_line;
      pluginList.pagePlugin = pluginList.pagePlugin ?? [];
      pluginList.eventPlugin = pluginList.eventPlugin ?? [];
      pluginList.template_config = data.template_config;
      pluginList.template_type = data.template_type;
      return pluginList;
    } catch (e: any) {
      throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', e, null);
    }
  }

  public async getOfficialPlugin() {
    try {
      return await db.execute(
        `
                    SELECT *
                    FROM \`${saasConfig.SAAS_NAME}\`.official_component;
                `,
        []
      );
    } catch (e: any) {
      throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', e, null);
    }
  }

  public static async checkBrandAndMemberType(app: string) {
    try {
      // 單次查詢取得 app 相關資訊（避免兩次 db.query）
      const appConfig = (
        await db.query(
          `SELECT brand, domain, plan, user as userId
                     FROM \`${saasConfig.SAAS_NAME}\`.app_config
                     WHERE appName = ?`,
          [app]
        )
      )[0];

      if (!appConfig) {
        throw new Error(`App "${app}" not found in app_config`);
      }

      // 查詢使用者資料
      const userData = (
        await db.query(
          `SELECT userData
                     FROM \`${appConfig.brand}\`.t_user
                     WHERE userID = ?`,
          [appConfig.userId]
        )
      )[0];
      //試用版本是企業方案
      appConfig.plan = appConfig.plan || 'app-year';
      return {
        memberType: userData?.userData?.menber_type ?? null, // 避免 userData 為 undefined
        brand: appConfig.brand,
        userData: userData?.userData ?? {},
        domain: appConfig.domain,
        plan: appConfig.plan,
        user_id: appConfig.userId,
      };
    } catch (error) {
      console.error(error);
      throw exception.BadRequestError('ERROR', 'checkBrandAndMemberType error' + error, null);
    }
  }

  public static async preloadPageData(appName: string, refer_page: string, language: LanguageLocation,req:express.Request) {
    const start = new Date().getTime();
    const page = await Template.getRealPage(refer_page, appName,req);
    console.log(`preload-0==>`, (new Date().getTime() - start) / 1000);
    const app = new App();
    const preloadData: {
      component: any;
      appConfig: any;
      event: any;
    } = {
      component: [],
      appConfig: await app.getAppConfig({
        appName: appName,
      }),
      event: [],
    };
    const pageData = (
      await new Template(undefined).getPage({
        appName: appName,
        tag: page,
        language: language,
        req:req
      })
    )[0];
    const event_list = fs.readFileSync(path.resolve(__dirname, '../../lowcode/official_event/event.js'), 'utf8');
    const index = `TriggerEvent.create(import.meta.url,`;
    const str = `(${event_list.substring(event_list.indexOf(index) + index.length)}`;
    // 定义正则表达式
    const regex = /TriggerEvent\.setEventRouter\(import\.meta\.url,\s*['"](.+?)['"]\)/g;
    let str2 = str;
    // 使用正则表达式匹配字符串
    const matches = [];
    let match;
    while ((match = regex.exec(str)) !== null) {
      matches.push(match[0]); // 将整个匹配的字符串加入数组
    }
    for (const b of matches) {
      str2 = str2.replace(b, `"${b}"`);
    }
    const event_ = eval(str2);
    if (!pageData) {
      return {};
    }
    preloadData.component.push(pageData);
    let checkPass = 0;
    await new Promise(async (resolve, reject) => {
      function loop(array: any) {
        for (const dd of array) {
          if (dd.type === 'container') {
            loop(dd.data.setting);
          } else if (dd.type === 'component') {
            checkPass++;
            new Promise(async (resolve, reject) => {
              const pageData = (
                await new Template(undefined).getPage({
                  appName: dd.data.refer_app || appName,
                  tag: dd.data.tag,
                  language: language,
                  req:req
                })
              )[0];
              if (pageData && pageData.config) {
                preloadData.component.push(pageData);
                loop(pageData.config ?? []);
              }
              resolve(true);
            }).then(() => {
              checkPass--;
              if (checkPass === 0) {
                resolve(true);
              }
            });
          }
        }
      }

      loop(pageData && pageData.config);
      if (checkPass === 0) {
        resolve(true);
      }
    });
    console.log(`preload-2==>`, (new Date().getTime() - start) / 1000);
    let mapPush: any = {};
    mapPush['getPlugin'] = {
      callback: [],
      data: { response: { data: preloadData.appConfig, result: true } },
      isRunning: true,
    };
    preloadData.component.map((dd: any) => {
      mapPush[`getPageData-${dd.appName}-${dd.tag}`] = {
        callback: [],
        isRunning: true,
        data: { response: { result: [dd] } },
      };
    });

    let eval_code_hash: any = {};
    console.log(`preload-3==>`, (new Date().getTime() - start) / 1000);
    // 查找匹配的字串
    const match1 = JSON.stringify(preloadData.component).match(
      /\{"src":"\.\/official_event\/[^"]+\.js","route":"[^"]+"}/g
    );
    const code: any = JSON.stringify(preloadData.component).match(/\{"code":"[^"]+","/g);
    (code || []).map((dd: any) => {
      try {
        const code = JSON.parse(dd.substring(0, dd.length - 2) + '}');
        eval_code_hash[Tool.checksum(code.code) as any] = code.code;
      } catch (e) {
        console.log(`error->`, dd);
      }
    });
    console.log(`preload-4==>`, (new Date().getTime() - start) / 1000);
    // 輸出結果
    if (match1) {
      match1.map(d1 => {
        if (
          !preloadData.event.find((dd: any) => {
            return event_[JSON.parse(d1)['route']] === dd;
          })
        ) {
          preloadData.event.push(event_[JSON.parse(d1)['route']]);
        }
      });
    } else {
      console.log('未找到匹配的字串');
    }
    console.log(`preload-5==>`, (new Date().getTime() - start) / 1000);
    mapPush.eval_code_hash = eval_code_hash;
    mapPush.event = preloadData.event;
    return mapPush;
  }

  public async setAppConfig(config: { appName: string; data: any }) {
    try {
      const official =
        (
          await db.query(
            `SELECT count(1)
                         FROM \`${saasConfig.SAAS_NAME}\`.t_user
                         where userID = ?`,
            [this.token!.userID, 'LION']
          )
        )[0]['count(1)'] == 1;
      if (official) {
        const trans = await db.Transaction.build();
        await trans.execute(
          `delete
                     from \`${saasConfig.SAAS_NAME}\`.official_component
                     where app_name = ?`,
          [config.appName]
        );
        for (const b of config.data.lambdaView ?? []) {
          await trans.execute(
            `insert into \`${saasConfig.SAAS_NAME}\`.official_component
                         set ?`,
            [
              {
                key: b.key,
                group: b.name,
                userID: this.token!.userID,
                app_name: config.appName,
                url: b.path,
              },
            ]
          );
        }
        await trans.commit();
      }

      return (
        (
          await db.execute(
            `update \`${saasConfig.SAAS_NAME}\`.app_config
                         set config=?,
                             update_time=?
                         where appName = ${db.escape(config.appName)}
                           and user = '${this.token!.userID}'
                        `,
            [config.data, new Date()]
          )
        )['changedRows'] == true
      );
    } catch (e: any) {
      throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', e, null);
    }
  }

  public async postTemplate(config: { appName: string; data: any }) {
    try {
      let template_type = '0';
      if (config.data.post_to === 'all') {
        let officialAccount = (process.env.OFFICIAL_ACCOUNT ?? '').split(',');
        if (officialAccount.indexOf(`${this.token!.userID}`) !== -1) {
          template_type = '2';
        } else {
          template_type = '1';
        }
      } else if (config.data.post_to === 'me') {
        template_type = '3';
      }
      return (
        (
          await db.execute(
            `update \`${saasConfig.SAAS_NAME}\`.app_config
                         set template_config = ?,
                             template_type=${template_type}
                         where appName = ${db.escape(config.appName)}
                           and user = '${this.token!.userID}'
                        `,
            [config.data]
          )
        )['changedRows'] == true
      );
    } catch (e: any) {
      throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', e, null);
    }
  }

  public async putSubDomain(cf: { app_name: string; name: string }) {
    const domain_name = `${cf.name}.${config.HostedDomain}`;
    if (
      (
        await db.query(
          `SELECT count(1)
                     FROM \`${saasConfig.SAAS_NAME}\`.app_config
                     where domain =${db.escape(domain_name)}`,
          []
        )
      )[0]['count(1)'] === 0
    ) {
      const result = await this.addDNSRecord(domain_name);
      await this.setSubDomain({
        original_domain: (
          await db.query(
            `SELECT domain
                         FROM \`${saasConfig.SAAS_NAME}\`.app_config
                         where appName=?;`,
            [cf.app_name]
          )
        )[0]['domain'],
        appName: cf.app_name,
        domain: domain_name,
      });
      return true;
    } else {
      throw exception.BadRequestError('ERROR', 'ERROR.THIS DOMAIN ALREADY USED.', null);
    }
  }

  public addDNSRecord(domain: string) {
    console.log(`addDNSRecord->${domain}`);
    return new Promise((resolve, reject) => {
      const route53 = new AWS.Route53();
      const params: any = {
        ChangeBatch: {
          Changes: [
            {
              Action: 'CREATE', // 或 'UPSERT' 如果記錄已存在
              ResourceRecordSet: {
                Name: domain, // 您的域名
                Type: 'A',
                TTL: 600, // 時間以秒為單位，TTL 的數值
                ResourceRecords: [
                  {
                    Value: config.sshIP, // 目標 IP 地址
                  },
                ],
              },
            },
          ],
          Comment: 'Adding A record for example.com',
        },
        HostedZoneId: config.AWS_HostedZoneId, // 您的托管區域 ID
      };
      route53.changeResourceRecordSets(params, function (err, data) {
        resolve(true);
      });
    });
  }

  public async setSubDomain(config: { original_domain: string; appName: string; domain: string }) {
    let checkExists =
      (
        await db.query(
          `select count(1)
                     from \`${saasConfig.SAAS_NAME}\`.app_config
                     where domain =?
                       and user !=?`,
          [config.domain, this.token!.userID]
        )
      )['count(1)'] > 0;
    if (
      checkExists ||
      config.domain.split('.').find(dd => {
        return !dd;
      })
    ) {
      throw exception.BadRequestError('BAD_REQUEST', 'this domain already on use.', null);
    }
    try {
      //             const data = await Ssh.readFile(`/etc/nginx/sites-enabled/default.conf`);
      //             let result: string = await new Promise((resolve, reject) => {
      //                 NginxConfFile.createFromSource(data as string, (err, conf) => {
      //                     const server: any = [];
      //                     for (const b of conf!.nginx.server as any) {
      //                         if (!b.server_name.toString().includes(`server_name ${config.domain};`) && !b.server_name.toString().includes(`server_name ${config.original_domain};`)) {
      //                             server.push(b);
      //                         }
      //                     }
      //                     conf!.nginx.server = server;
      //                     resolve(conf!.toString());
      //                 });
      //             });
      //             result += `\n\nserver {
      //     server_name ${config.domain};
      //     location / {
      //        proxy_pass http://127.0.0.1:3080/${config.appName}/;
      //        proxy_set_header X-Real-IP $remote_addr;
      //        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      //        proxy_set_header X-Forwarded-Proto $http_x_forwarded_proto;
      //     }
      //     listen 443 ssl;
      //     ssl_certificate ${process.env.ssl_certificate};
      //     ssl_certificate_key ${process.env.ssl_certificate_key};
      // }
      // server {
      //     if ($host = ${config.domain}) {
      //         return 301 https://$host$request_uri;
      //     }
      //     server_name ${config.domain};
      //     listen 80;
      //     return 404;
      // }
      // `;
      //             fs.writeFileSync('/nginx.config', result);
      //             const response = await new Promise((resolve, reject) => {
      //                 Ssh.exec([`sudo docker cp $(sudo docker ps --filter "expose=3080" --format "{{.ID}}"):/nginx.config /etc/nginx/sites-enabled/default.conf`, `sudo nginx -s reload`]).then(
      //                     (res: any) => {
      //                         resolve(res && res.join('').indexOf('Successfully') !== -1);
      //                     }
      //                 );
      //             });
      await db.execute(
        `
                    update \`${saasConfig.SAAS_NAME}\`.app_config
                    set domain=?
                    where domain = ?
                `,
        [null, config.domain]
      );
      return await db.execute(
        `
                    update \`${saasConfig.SAAS_NAME}\`.app_config
                    set domain=?
                    where appName = ?
                `,
        [config.domain, config.appName]
      );
    } catch (e: any) {
      throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', e, null);
    }
  }

  public async setDomain(config: { original_domain: string; appName: string; domain: string }) {
    let checkExists =
      (
        await db.query(
          `select count(1)
                     from \`${saasConfig.SAAS_NAME}\`.app_config
                     where domain =?
                       and user !=?`,
          [config.domain, this.token!.userID]
        )
      )['count(1)'] > 0;
    if (checkExists) {
      throw exception.BadRequestError('BAD_REQUEST', 'this domain already on use.', null);
    }
    try {
      const data = await Ssh.readFile('/etc/nginx/sites-enabled/default.conf');
      let result: string = await new Promise((resolve, reject) => {
        NginxConfFile.createFromSource(data as string, (err, conf) => {
          const server: any = [];
          for (const b of conf!.nginx.server as any) {
            if (
              !b.server_name ||
              (!b.server_name.toString().includes(`server_name ${config.domain};`) &&
                !b.server_name.toString().includes(`server_name ${config.original_domain};`))
            ) {
              if (
                !config.domain.startsWith('www.') ||
                !b.server_name ||
                (!b.server_name.toString().includes(`server_name ${config.domain.replace('www.', '')};`) &&
                  !b.server_name.toString().includes(`server_name ${config.original_domain};`))
              ) {
                server.push(b);
              }
            }
          }
          conf!.nginx.server = server;
          resolve(conf!.toString());
        });
      });

      result += `\n\nserver {
       server_name ${config.domain};
          location /api-public/v1/ {
                                      proxy_pass http://127.0.0.1:3080;
                                      proxy_set_header X-Real-IP $remote_addr;
                                      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                                      proxy_set_header X-Forwarded-Proto $http_x_forwarded_proto;
                              }
         location /api/v1/ {
                  proxy_pass http://127.0.0.1:3080;
                  proxy_set_header X-Real-IP $remote_addr;
                  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                  proxy_set_header X-Forwarded-Proto $http_x_forwarded_proto;
          }

            location /websocket {
                  proxy_pass http://127.0.0.1:9003;
                  proxy_http_version 1.1;
                  proxy_set_header Upgrade $http_upgrade;
                  proxy_set_header Connection "Upgrade";
              }
    location / {
       proxy_pass http://127.0.0.1:3080/${config.appName}/;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $http_x_forwarded_proto;
    }
}`;
      if (config.domain.startsWith('www.')) {
        result += `\n\nserver {
    listen 80;
    server_name ${config.domain.replace('www.', '')};
    # 自動重定向 HTTP 到 HTTPS
    return 301 https://www.$host$request_uri;
}`;
      }
      fs.writeFileSync('/nginx.config', result);
      const response = await new Promise((resolve, reject) => {
        Ssh.exec([
          `sudo docker cp $(sudo docker ps --filter "expose=3080" --format "{{.ID}}"):/nginx.config /etc/nginx/sites-enabled/default.conf`,
          `sudo certbot --nginx -d ${config.domain} --non-interactive --agree-tos -m sam38124@gmail.com`,
          ...(() => {
            if (config.domain.startsWith('www.')) {
              return [
                `sudo certbot --nginx -d ${config.domain.replace('www.', '')} --non-interactive --agree-tos -m sam38124@gmail.com`,
              ];
            } else {
              return [];
            }
          })(),
          `sudo nginx -s reload`,
        ]).then((res: any) => {
          console.log(`response-ssh->`, res && res.join(''));
          resolve(res && res.join('').toLowerCase().includes('successfully'));
        });
      });
      if (!response) {
        throw exception.BadRequestError('BAD_REQUEST', '網域驗證失敗', null);
      }
      await db.execute(
        `
                    update \`${saasConfig.SAAS_NAME}\`.app_config
                    set domain=?
                    where domain = ?
                `,
        [null, config.domain]
      );
      return await db.execute(
        `
                    update \`${saasConfig.SAAS_NAME}\`.app_config
                    set domain=?
                    where appName = ?
                `,
        [config.domain, config.appName]
      );
    } catch (e: any) {
      console.log(`error`, e);
      throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', e, null);
    }
  }

  public async deleteAPP(config: { appName: string }) {
    try {
      try {
        await new BackendService(config.appName).stopServer();
      } catch (e) {}
      await db.execute(
        `delete
                 from \`${saasConfig.SAAS_NAME}\`.app_config
                 where appName = ${db.escape(config.appName)}
                   and user = '${this.token!.userID}'`,
        []
      );
      await db.execute(
        `delete
                 from \`${saasConfig.SAAS_NAME}\`.page_config
                 where appName = ${db.escape(config.appName)}
                   and userID = '${this.token!.userID}'`,
        []
      );
      await db.execute(
        `delete
                 from \`${saasConfig.SAAS_NAME}\`.private_config
                 where app_name = ${db.escape(config.appName)}
                `,
        []
      );
    } catch (e: any) {
      throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', e, null);
    }
  }

  constructor(token?: IToken) {
    this.token = token;
  }

  public static async getSupportLanguage(appName: string) {
    let store_info = await new User(appName).getConfigV2({
      key: 'store-information',
      user_id: 'manager',
    });
    return store_info.language_setting.support;
  }

  public static async getDefLanguage(appName: string) {
    let store_info = await new User(appName).getConfigV2({
      key: 'store-information',
      user_id: 'manager',
    });
    return store_info.language_setting.def;
  }
}

function addDays(dat: Date, addDays: number) {
  var date = new Date(dat);
  date.setDate(date.getDate() + addDays);
  return date;
}
