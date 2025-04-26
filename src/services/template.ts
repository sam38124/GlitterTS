import db from '../modules/database';
import { saasConfig } from '../config';
import exception from '../modules/exception';
import { IToken } from '../models/Auth.js';
import process from 'process';
import { UtDatabase } from '../api-public/utils/ut-database.js';
import { LanguageLocation } from '../Language.js';

export class Template {
  public token?: IToken;

  public async createPage(config: {
    appName: string;
    tag: string;
    group: string;
    name: string;
    config: any;
    page_config: any;
    copy: any;
    page_type: string;
    copyApp: string;
    replace?: boolean;
  }) {
    if (config.copy) {
      const data = (
        await db.execute(
          `
              select \`${saasConfig.SAAS_NAME}\`.page_config.page_config,
                     \`${saasConfig.SAAS_NAME}\`.page_config.config
              from \`${saasConfig.SAAS_NAME}\`.page_config
              where tag = ${db.escape(config.copy)}
                and appName = ${db.escape(config.copyApp || config.appName)}
          `,
          []
        )
      )[0];
      config.page_config = data['page_config'];
      config.config = data['config'];
    }
    try {
      await db.execute(
        `
                ${config.replace ? `replace` : 'insert'} into \`${saasConfig.SAAS_NAME}\`.page_config (userID, appName, tag, \`group\`, \`name\`, config,
                                                                     page_config, page_type)
                values (?, ?, ?, ?, ?, ?, ?, ?);
            `,
        [
          this.token!.userID,
          config.appName,
          config.tag,
          config.group,
          config.name,
          config.config ?? [],
          config.page_config ?? {},
          config.page_type ?? 'page',
        ]
      );
      return true;
    } catch (e: any) {
      throw exception.BadRequestError('Forbidden', 'This page already exists.', null);
    }
  }

  public async updatePage(config: {
    appName: string;
    tag: string;
    group: string;
    name: string;
    config: any;
    page_config: any;
    id?: string;
    page_type: string;
    preview_image: string;
    favorite: number;
    updated_time: any;
    language?: LanguageLocation;
  }) {
    const page_db = (() => {
      switch (config.language) {
        case 'zh-TW':
          return 'page_config';
        case 'en-US':
          return 'page_config_en';
        case 'zh-CN':
          return 'page_config_rcn';
        default:
          return 'page_config';
      }
    })();

    //先判斷是否存在，不存在則添加
    async function checkExits() {
      const where_ = (() => {
        let sql = '';
        if (config.id) {
          sql += ` and \`id\` = ${config.id} `;
        } else {
          sql += ` and \`tag\` = ${db.escape(config.tag)}`;
        }
        sql += ` and appName = ${db.escape(config.appName)}`;
        return sql;
      })();
      let sql = `
          select count(1)
          from \`${saasConfig.SAAS_NAME}\`.${page_db}
          where 1 = 1 ${where_}
      `;
      const count = await db.query(sql, []);
      if (count[0]['count(1)'] === 0) {
        await db.query(
          `INSERT INTO \`${saasConfig.SAAS_NAME}\`.${page_db}
           SELECT *
           FROM \`${saasConfig.SAAS_NAME}\`.page_config
           where 1 = 1 ${where_};
          `,
          []
        );
      }
    }

    await checkExits();
    try {
      const params: { [props: string]: any } = {};
      config.appName && (params['appName'] = config.appName);
      config.tag && (params['tag'] = config.tag);
      config.group && (params['group'] = config.group);
      config.page_type && (params['page_type'] = config.page_type);
      config.name && (params['name'] = config.name);
      config.config && (params['config'] = JSON.stringify(config.config));
      config.preview_image && (params['preview_image'] = config.preview_image);
      config.page_config && (params['page_config'] = JSON.stringify(config.page_config));
      config.favorite && (params['favorite'] = config.favorite);
      config.updated_time = new Date();
      let sql = `
          UPDATE \`${saasConfig.SAAS_NAME}\`.${page_db}
          SET ?
          WHERE 1 = 1
      `;
      if (config.id) {
        sql += ` and \`id\` = ${config.id} `;
      } else {
        sql += ` and \`tag\` = ${db.escape(config.tag)}`;
      }
      sql += `and appName = ${db.escape(config.appName)}`;
      await db.query(sql, [params]);
      return true;
    } catch (e: any) {
      throw exception.BadRequestError('Forbidden', 'No permission.' + e, null);
    }
  }

  public async deletePage(config: { appName: string; id?: string; tag?: string }) {
    try {
      for (const b of ['page_config', 'page_config_rcn', 'page_config_en']) {
        let sql = config.id
          ? `
                    delete
                    from \`${saasConfig.SAAS_NAME}\`.${b}
                    WHERE appName = ${db.escape(config.appName)}
                      and id = ${db.escape(config.id)}`
          : `
                    delete
                    from \`${saasConfig.SAAS_NAME}\`.${b}
                    WHERE appName = ${db.escape(config.appName)}
                      and tag = ${db.escape(config.tag)}`;
        await db.execute(sql, []);
      }
      return true;
    } catch (e: any) {
      throw exception.BadRequestError('Forbidden', 'No permission.' + e, null);
    }
  }

  public async getTemplate(query: { app_name?: string; template_from: 'all' | 'me'; page?: string; limit?: string }) {
    try {
      const sql = [];
      query.template_from === 'me' && sql.push(`user = '${this.token!.userID}'`);
      query.template_from === 'me' && sql.push(`template_type in (3,2)`);
      query.template_from === 'all' && sql.push(`template_type = 2`);
      const data = await new UtDatabase(saasConfig.SAAS_NAME as string, `page_config`).querySql(
        sql,
        query as any,
        `
            id,userID,tag,\`group\`,name, page_type,  preview_image,appName,template_type,template_config
            `
      );
      return data;
    } catch (e: any) {
      throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', e, null);
    }
  }

  public async postTemplate(config: { appName: string; data: any; tag: string }) {
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
            `update \`${saasConfig.SAAS_NAME}\`.page_config
             set template_config = ?,
                 template_type=${template_type}
             where appName = ${db.escape(config.appName)}
               and tag = ?
            `,
            [config.data, config.tag]
          )
        )['changedRows'] == true
      );
    } catch (e: any) {
      throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', e, null);
    }
  }

  public static async getRealPage(query_page: string, appName: string): Promise<string> {
    query_page = query_page || 'index';
    let page = query_page;
    if (query_page.includes('#')) {
      query_page = query_page.substring(0, query_page.indexOf('#'));
    }
    if (appName === 'proshake_v2') {
      return query_page;
    }
    console.log(`query_page`, query_page);
    //判斷是APP頁面，首次預設複製首頁頁面
    if (page === 'index-app') {
      const count = await db.query(
        `select count(1)
         from \`${saasConfig.SAAS_NAME}\`.page_config
         where appName = ${db.escape(appName)}
           and tag = 'index-app'`,
        []
      );
      if (count[0]['count(1)'] === 0) {
        const copyPageData = await db.execute(
          `select *
           from \`${saasConfig.SAAS_NAME}\`.page_config
           where appName = ${db.escape(appName)}
             and tag = 'index'`,
          []
        );
        for (const dd of copyPageData) {
          await db.execute(
            `
                insert into \`${saasConfig.SAAS_NAME}\`.page_config (userID, appName, tag, \`group\`,
                                                                     \`name\`,
                                                                     \`config\`, \`page_config\`, page_type)
                values (?, ?, ?, ?, ?, ${db.escape(JSON.stringify(dd.config))},
                        ${db.escape(JSON.stringify(dd.page_config))}, ${db.escape(dd.page_type)});
            `,
            [dd.userID, appName, 'index-app', dd.group || '未分類', 'APP首頁樣式']
          );
        }
      }
    }
    //判斷是條款頁面或部落格列表頁面時
    if (
      [
        'privacy',
        'term',
        'refund',
        'delivery',
        'blogs',
        'blog_tag_setting',
        'blog_global_setting',
        'pos_setting',
        'checkout',
        'fb_live',
        'ig_live',
        'line_plus',
        'shipment_list',
        'shipment_list_archive',
        'reconciliation_area',
        'app-design',
        'auto_fcm_push',
        'auto_fcm_advertise',
        'auto_fcm_history',
        'auto_fcm_template',
        'notify_message_list',
      ].includes(query_page)
    ) {
      return 'official-router';
    }
    if (
      ['account_userinfo', 'voucher-list', 'rebate', 'order_list', 'wishlist', 'account_edit'].includes(query_page) &&
      appName !== 'cms_system'
    ) {
      return 'official-router';
    }
    //當判斷是Blog時
    if (['blogs', 'pages', 'shop', 'hidden'].includes(query_page.split('/')[0]) && query_page.split('/')[1]) {
      return 'official-router';
    }

    //當判斷是分銷連結時
    if (query_page.split('/')[0] === 'distribution' && query_page.split('/')[1]) {
      try {
        //
        const page = (
          await db.query(
            `SELECT *
             from \`${appName}\`.t_recommend_links
             where content ->>'$.link'=?`,
            [query_page.split('/')[1]]
          )
        )[0].content;
        if (page.redirect.startsWith('/products')) {
          return 'official-router';
        } else {
          return await Template.getRealPage((page.redirect as string).substring(1), appName as string);
        }
      } catch (error) {
        console.error(`distribution 路徑錯誤 code: ${query_page.split('/')[1]}`);
        page = '';
      }
    }
    //當判斷是Collection時
    if (query_page.split('/')[0] === 'collections' && query_page.split('/')[1]) {
      page = 'all-product';
    }
    //當判斷是商品頁時
    if (query_page.split('/')[0] === 'products' && query_page.split('/')[1]) {
      if (appName === '3131_shop') {
        page = 'products';
      } else {
        page = 'official-router';
      }
    }
    //當判斷是CMS頁面時
    if (query_page === 'cms') {
      page = 'index';
    }
    //當判斷是Voucher-list頁面時
    if (query_page === 'voucher-list') {
      page = 'rebate';
    }
    //當判斷是line驗證頁面
    if (query_page === 'shopnex-line-oauth') {
      page = 'official-router';
    }
    return page;
  }

  public async getPage(config: {
    appName?: string;
    tag?: string;
    group?: string;
    type?: string;
    page_type?: string;
    user_id?: string;
    me?: string;
    favorite?: string;
    preload?: boolean;
    id?: string;
    language?: LanguageLocation;
  }): Promise<any> {
    if (config.tag) {
      config.tag = await Template.getRealPage(config.tag, config.appName!);
      if (config.tag === 'official-router') {
        config.appName = 'cms_system';
      } else if (config.tag === 'all-product') {
        config.tag = 'official-router';
        config.appName = 'cms_system';
      }
    }
    try {
      const page_db = (() => {
        switch (config.language) {
          case 'zh-TW':
            return 'page_config';
          case 'en-US':
            return 'page_config_en';
          case 'zh-CN':
            return 'page_config_rcn';
          default:
            return 'page_config';
        }
      })();

      let sql = `select ${config.tag || config.id ? `*` : `id,userID,tag,\`group\`,name,page_type,preview_image,appName,page_config`}
                 from \`${saasConfig.SAAS_NAME}\`.${page_db}
                 where ${(() => {
                   let query: string[] = [`1 = 1`];
                   config.user_id && query.push(`userID=${config.user_id}`);
                   config.appName && query.push(`appName=${db.escape(config.appName)}`);
                   config.id && query.push(`id=${db.escape(config.id)}`);
                   config.tag &&
                     query.push(
                       ` tag in (${config.tag
                         .split(',')
                         .map(dd => {
                           return db.escape(dd);
                         })
                         .join(',')})`
                     );
                   config.page_type && query.push(`page_type=${db.escape(config.page_type)}`);
                   config.group &&
                     query.push(
                       `\`group\` in (${config.group
                         .split(',')
                         .map(dd => {
                           return db.escape(dd);
                         })
                         .join(',')})`
                     );
                   if (config.favorite && config.favorite === 'true') {
                     query.push(`favorite=1`);
                   }
                   if (config.me === 'true') {
                     query.push(`userID = ${this.token!.userID}`);
                   } else {
                     // let officialAccount=(process.env.OFFICIAL_ACCOUNT ?? '').split(',')
                     // query.push(`userID in (${officialAccount.map((dd)=>{
                     //     return `${db.escape(dd)}`
                     // }).join(',')})`)
                   }
                   return query.join(' and ');
                 })()}`;

      if (config.type) {
        if (config.type === 'template') {
          sql += ` and \`group\` != ${db.escape('glitter-article')}`;
        } else if (config.type === 'article') {
          sql += ` and \`group\` = 'glitter-article' `;
        }
      }
      const page_data = await db.query(sql, []);
      if (page_db !== 'page_config' && page_data.length === 0 && config.language != 'zh-TW') {
        config.language = 'zh-TW';
        return await this.getPage(config);
      } else {
        return page_data;
      }
    } catch (e: any) {
      throw exception.BadRequestError('Forbidden', 'No permission.' + e, null);
    }
  }

  constructor(token?: IToken) {
    this.token = token;
  }
}
