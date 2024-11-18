"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const database_1 = __importDefault(require("../modules/database"));
const exception_1 = __importDefault(require("../modules/exception"));
const config_1 = require("../config");
const index_js_1 = require("../index.js");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const config_js_1 = __importDefault(require("../config.js"));
const fs_1 = __importDefault(require("fs"));
const ssh_js_1 = require("../modules/ssh.js");
const nginx_conf_1 = require("nginx-conf");
const process = __importStar(require("process"));
const public_table_check_js_1 = require("../api-public/services/public-table-check.js");
const backend_service_js_1 = require("./backend-service.js");
const template_js_1 = require("./template.js");
const tool_1 = __importDefault(require("./tool"));
const path_1 = __importDefault(require("path"));
const app_initial_js_1 = require("./app-initial.js");
class App {
    static getAdConfig(app, key) {
        return new Promise(async (resolve, reject) => {
            const data = await database_1.default.query(`select \`value\`
                 from \`${config_js_1.default.DB_NAME}\`.private_config
                 where app_name = '${app}'
                   and \`key\` = ${database_1.default.escape(key)}`, []);
            resolve(data[0] ? data[0]['value'] : {});
        });
    }
    async checkVersion(libraryName) {
        const currentDir = process.cwd();
        const packageJsonPath = path_1.default.join(currentDir, 'package.json');
        if (fs_1.default.existsSync(packageJsonPath)) {
            const packageJson = JSON.parse(fs_1.default.readFileSync(packageJsonPath, 'utf-8'));
            const dependencies = packageJson.dependencies || {};
            const devDependencies = packageJson.devDependencies || {};
            if (dependencies[libraryName]) {
                return dependencies[libraryName];
            }
            else if (devDependencies[libraryName]) {
                return devDependencies[libraryName];
            }
            else {
                throw new Error(`Library ${libraryName} is not listed in dependencies or devDependencies`);
            }
        }
        else {
            throw new Error('package.json not found in the current directory');
        }
    }
    async createApp(cf) {
        var _a, _b, _c, _d;
        try {
            cf.copyWith = (_a = cf.copyWith) !== null && _a !== void 0 ? _a : [];
            cf.sub_domain = cf.sub_domain.replace(/\./g, '');
            const count = await database_1.default.execute(`
                    select count(1)
                    from \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                    where appName = ${database_1.default.escape(cf.appName)}
                `, []);
            if (count[0]['count(1)'] === 1) {
                throw exception_1.default.BadRequestError('HAVE_APP', 'This app already be used.', null);
            }
            const domain_count = await database_1.default.execute(`
                    select count(1)
                    from \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                    where domain = ${database_1.default.escape(`${cf.sub_domain}.${config_js_1.default.HostedDomain}`)}
                `, []);
            if (domain_count[0]['count(1)'] === 1) {
                throw exception_1.default.BadRequestError('HAVE_DOMAIN', 'This domain already be used.', null);
            }
            let copyAppData = undefined;
            let copyPageData = undefined;
            let privateConfig = undefined;
            if (cf.copyApp) {
                await public_table_check_js_1.ApiPublic.createScheme(cf.copyApp);
                copyAppData = (await database_1.default.execute(`select *
                         from \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                         where appName = ${database_1.default.escape(cf.copyApp)}`, []))[0];
                copyPageData = await database_1.default.execute(`select *
                     from \`${config_1.saasConfig.SAAS_NAME}\`.page_config
                     where appName = ${database_1.default.escape(cf.copyApp)}`, []);
                privateConfig = await database_1.default.execute(`select *
                     from \`${config_1.saasConfig.SAAS_NAME}\`.private_config
                     where app_name = ${database_1.default.escape(cf.copyApp)} `, []);
            }
            await database_1.default.execute(`insert into \`${config_1.saasConfig.SAAS_NAME}\`.app_config (user, appName, dead_line, \`config\`,
                                                                     brand, theme_config, refer_app,
                                                                     template_config)
                 values (?, ?, ?, ${database_1.default.escape(JSON.stringify((copyAppData && copyAppData.config) || {}))},
                         ${database_1.default.escape((_b = cf.brand) !== null && _b !== void 0 ? _b : config_1.saasConfig.SAAS_NAME)},
                         ${database_1.default.escape(JSON.stringify((_c = (copyAppData && copyAppData.theme_config)) !== null && _c !== void 0 ? _c : { name: (copyAppData && copyAppData.template_config && copyAppData.template_config.name) || cf.name }))},
                         ${cf.theme ? database_1.default.escape(cf.theme) : 'null'},
                         ${database_1.default.escape(JSON.stringify((copyAppData && copyAppData.template_config) || {}))})`, [this.token.userID, cf.appName, addDays(new Date(), config_1.saasConfig.DEF_DEADLINE)]);
            await this.putSubDomain({
                app_name: cf.appName,
                name: cf.sub_domain,
            });
            await public_table_check_js_1.ApiPublic.createScheme(cf.appName);
            const trans = await database_1.default.Transaction.build();
            if (cf.copyWith.indexOf('manager_post') !== -1) {
                for (const dd of await database_1.default.query(`SELECT *
                     FROM \`${cf.copyApp}\`.t_manager_post`, [])) {
                    dd.content = dd.content && JSON.stringify(dd.content);
                    dd.userID = this.token.userID;
                    await trans.execute(`
                            insert into \`${cf.appName}\`.t_manager_post
                            SET ?;
                        `, [dd]);
                }
            }
            if (cf.copyWith.indexOf('user_post') !== -1) {
                for (const dd of await database_1.default.query(`SELECT *
                     FROM \`${cf.copyApp}\`.t_post`, [])) {
                    dd.content = dd.content && JSON.stringify(dd.content);
                    await trans.execute(`
                            insert into \`${cf.appName}\`.t_post
                            SET ?;
                        `, [dd]);
                }
            }
            for (const dd of await database_1.default.query(`SELECT *
                 FROM \`${cf.copyApp}\`.t_global_event`, [])) {
                dd.json = dd.json && JSON.stringify(dd.json);
                await trans.execute(`
                        insert into \`${cf.appName}\`.t_global_event
                        SET ?;
                    `, [dd]);
            }
            if (cf.copyWith.indexOf('public_config') !== -1) {
                for (const dd of await database_1.default.query(`SELECT *
                     FROM \`${cf.copyApp}\`.public_config`, [])) {
                    dd.value = dd.value && JSON.stringify(dd.value);
                    if (!['editorGuide', 'guideable', 'guide'].includes(dd.key)) {
                        await trans.execute(`
                                insert into \`${cf.appName}\`.public_config
                                SET ?;
                            `, [dd]);
                    }
                }
                for (const dd of await database_1.default.query(`SELECT *
                     FROM \`${cf.copyApp}\`.t_user_public_config`, [])) {
                    dd.value = dd.value && JSON.stringify(dd.value);
                    if ((dd.userID !== 'manager') && (!['robot_auto_reply', 'image-manager', 'message_setting'].includes(dd.key))) {
                        await trans.execute(`
                                insert into \`${cf.appName}\`.t_user_public_config
                                SET ?;
                            `, [dd]);
                    }
                }
            }
            if (privateConfig) {
                for (const dd of privateConfig) {
                    await trans.execute(`
                            insert into \`${config_1.saasConfig.SAAS_NAME}\`.private_config (\`app_name\`, \`key\`, \`value\`, updated_at)
                            values (?, ?, ?, ?);
                        `, [cf.appName, dd.key, JSON.stringify(dd.value), new Date()]);
                }
            }
            if (copyPageData) {
                for (const dd of copyPageData) {
                    await trans.execute(`
                            insert into \`${config_1.saasConfig.SAAS_NAME}\`.page_config (userID, appName, tag, \`group\`,
                                                                                 \`name\`,
                                                                                 \`config\`, \`page_config\`, page_type)
                            values (?, ?, ?, ?, ?, ${database_1.default.escape(JSON.stringify(dd.config))},
                                    ${database_1.default.escape(JSON.stringify(dd.page_config))}, ${database_1.default.escape(dd.page_type)});
                        `, [this.token.userID, cf.appName, dd.tag, dd.group || '未分類', dd.name]);
                }
            }
            else {
                await trans.execute(`
                        insert into \`${config_1.saasConfig.SAAS_NAME}\`.page_config (userID, appName, tag, \`group\`, \`name\`,
                                                                             \`config\`, \`page_config\`)
                        values (?, ?, ?, ?, ?, ${database_1.default.escape(JSON.stringify({}))}, ${database_1.default.escape(JSON.stringify({}))});
                    `, [this.token.userID, cf.appName, 'index', '', '首頁']);
            }
            await trans.commit();
            const store_information = (await database_1.default.query(`select *
                     from \`${cf.appName}\`.t_user_public_config
                     where \`key\` = ? `, [`store-information`]))[0];
            if (store_information) {
                await database_1.default.query(`delete
                                from \`${cf.appName}\`.t_user_public_config
                                where \`key\` = ?
                                  and id > 0`, ['store-information']);
            }
            for (const b of app_initial_js_1.AppInitial.main(cf.appName)) {
                await database_1.default.query(b.sql, [b.obj]);
            }
            await database_1.default.query(`insert into \`${cf.appName}\`.t_user_public_config
                            set ?`, [{
                    key: 'store-information',
                    user_id: 'manager',
                    updated_at: new Date(),
                    value: JSON.stringify({
                        shop_name: cf.name
                    })
                }]);
            await (0, index_js_1.createAPP)(cf);
            return true;
        }
        catch (e) {
            await database_1.default.query(`delete
                 from \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                 where appName = ?`, [cf.appName]);
            console.log(e);
            throw exception_1.default.BadRequestError((_d = e.code) !== null && _d !== void 0 ? _d : 'BAD_REQUEST', e, null);
        }
    }
    async updateThemeConfig(body) {
        var _a;
        try {
            await database_1.default.query(`update \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                 set theme_config=?
                 where appName = ?`, [JSON.stringify(body.config), body.theme]);
            return true;
        }
        catch (e) {
            throw exception_1.default.BadRequestError((_a = e.code) !== null && _a !== void 0 ? _a : 'BAD_REQUEST', e, null);
        }
    }
    async changeTheme(config) {
        var _a, _b, _c, _d, _e;
        try {
            const temp_app_name = tool_1.default.randomString(4) + new Date().getTime();
            const temp_app_theme = tool_1.default.randomString(4) + new Date().getTime();
            const tran = await database_1.default.Transaction.build();
            const cf_app = (await database_1.default.query(`select \`domain\`, \`dead_line\`, \`plan\`
                     from \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                     where appName = ${database_1.default.escape(config.app_name)}`, []))[0];
            await tran.execute(`update \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                 set appName=${database_1.default.escape(temp_app_name)},
                     refer_app=${database_1.default.escape(config.app_name)},
                     domain=null
                 where appName = ${database_1.default.escape(config.app_name)}
                   and user = ?`, [(_a = this.token) === null || _a === void 0 ? void 0 : _a.userID]);
            await tran.execute(`update \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                 set appName=${database_1.default.escape(temp_app_theme)},
                     refer_app=null,
                     domain=${cf_app['domain'] ? database_1.default.escape(cf_app['domain']) : 'null'},
                     dead_line=${cf_app['dead_line'] ? database_1.default.escape(cf_app['dead_line']) : 'null'},
                     plan=${cf_app['plan'] ? database_1.default.escape(cf_app['plan']) : 'null'}
                 where appName = ${database_1.default.escape(config.theme)}
                   and user = ?`, [(_b = this.token) === null || _b === void 0 ? void 0 : _b.userID]);
            await tran.execute(`update \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                 set appName=${database_1.default.escape(config.app_name)}
                 where appName = ${database_1.default.escape(temp_app_theme)}
                   and user = ?`, [(_c = this.token) === null || _c === void 0 ? void 0 : _c.userID]);
            await tran.execute(`update \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                 set appName=${database_1.default.escape(config.theme)}
                 where appName = ${database_1.default.escape(temp_app_name)}
                   and user = ?`, [(_d = this.token) === null || _d === void 0 ? void 0 : _d.userID]);
            await tran.execute(`update \`${config_1.saasConfig.SAAS_NAME}\`.page_config
                 set appName=${database_1.default.escape(temp_app_name)}
                 where appName = ${database_1.default.escape(config.app_name)}
                `, []);
            await tran.execute(`update \`${config_1.saasConfig.SAAS_NAME}\`.page_config
                 set appName=${database_1.default.escape(temp_app_theme)}
                 where appName = ${database_1.default.escape(config.theme)}
                `, []);
            await tran.execute(`update \`${config_1.saasConfig.SAAS_NAME}\`.page_config
                 set appName=${database_1.default.escape(config.app_name)}
                 where appName = ${database_1.default.escape(temp_app_theme)}
                `, []);
            await tran.execute(`update \`${config_1.saasConfig.SAAS_NAME}\`.page_config
                 set appName=${database_1.default.escape(config.theme)}
                 where appName = ${database_1.default.escape(temp_app_name)}
                `, []);
            await tran.commit();
            await tran.release();
            return true;
        }
        catch (e) {
            console.log(`error-->`, e);
            throw exception_1.default.BadRequestError((_e = e.code) !== null && _e !== void 0 ? _e : 'BAD_REQUEST', e, null);
        }
    }
    async getAPP(query) {
        var _a;
        try {
            const empStores = await database_1.default.query(`SELECT *
                 FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_auth_config
                 WHERE user = '${this.token.userID}'
                   AND status = 1
                   AND invited = 1;`, []);
            const allStores = await database_1.default.query(`SELECT *
                 FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                 WHERE ${(() => {
                const sql = [
                    `(user = '${this.token.userID}' OR appName = 
                            (SELECT appName FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_auth_config
                            WHERE user = '${this.token.userID}' AND status = 1 AND invited = 1)
                        )`,
                ];
                if (query.app_name) {
                    sql.push(` appName='${query.app_name}' `);
                }
                else if (query.theme) {
                    sql.push(` refer_app='${query.theme}' `);
                }
                else {
                    sql.push(` refer_app is null `);
                }
                return sql.join(' and ');
            })()};
                `, []);
            return allStores.map((store) => {
                const type = empStores.find((st) => st.appName === store.appName);
                store.store_permission_title = type ? 'employee' : 'owner';
                return store;
            });
        }
        catch (e) {
            throw exception_1.default.BadRequestError((_a = e.code) !== null && _a !== void 0 ? _a : 'BAD_REQUEST', e, null);
        }
    }
    async getTemplate(query) {
        var _a;
        try {
            return await database_1.default.execute(`
                    SELECT user, appName, created_time, dead_line, brand, template_config, template_type, domain
                    FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                    where ${(() => {
                const sql = [];
                query.template_from === 'me' && sql.push(`user = '${this.token.userID}'`);
                query.template_from === 'me' && sql.push(`template_type in (3,2)`);
                query.template_from === 'all' && sql.push(`template_type = 2`);
                return sql
                    .map((dd) => {
                    return `(${dd})`;
                })
                    .join(' and ');
            })()};
                `, []);
        }
        catch (e) {
            throw exception_1.default.BadRequestError((_a = e.code) !== null && _a !== void 0 ? _a : 'BAD_REQUEST', e, null);
        }
    }
    async getAppConfig(config) {
        var _a, _b, _c, _d;
        try {
            const data = (await database_1.default.execute(`
                        SELECT config, \`dead_line\`, \`template_config\`, \`template_type\`
                        FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                        where appName = ${database_1.default.escape(config.appName)};
                    `, []))[0];
            const pluginList = (_a = data['config']) !== null && _a !== void 0 ? _a : {};
            pluginList.dead_line = data.dead_line;
            pluginList.pagePlugin = (_b = pluginList.pagePlugin) !== null && _b !== void 0 ? _b : [];
            pluginList.eventPlugin = (_c = pluginList.eventPlugin) !== null && _c !== void 0 ? _c : [];
            pluginList.template_config = data.template_config;
            pluginList.template_type = data.template_type;
            return pluginList;
        }
        catch (e) {
            throw exception_1.default.BadRequestError((_d = e.code) !== null && _d !== void 0 ? _d : 'BAD_REQUEST', e, null);
        }
    }
    async getOfficialPlugin() {
        var _a;
        try {
            return await database_1.default.execute(`
                    SELECT *
                    FROM \`${config_1.saasConfig.SAAS_NAME}\`.official_component;
                `, []);
        }
        catch (e) {
            throw exception_1.default.BadRequestError((_a = e.code) !== null && _a !== void 0 ? _a : 'BAD_REQUEST', e, null);
        }
    }
    static async checkBrandAndMemberType(app) {
        let base = (await database_1.default.query(`SELECT brand, domain
                 FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                 where appName = ? `, [app]))[0];
        const userID = (await database_1.default.query(`SELECT user
                 FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                 where appName = ?`, [app]))[0]['user'];
        const userData = (await database_1.default.query(`SELECT userData
                 FROM \`${base.brand}\`.t_user
                 where userID = ? `, [userID]))[0];
        return {
            memberType: userData.userData.menber_type,
            brand: base.brand,
            userData: userData.userData,
            domain: base.domain,
            user_id: userID
        };
    }
    static async preloadPageData(appName, refer_page) {
        const start = (new Date()).getTime();
        const page = await template_js_1.Template.getRealPage(refer_page, appName);
        console.log(`preload-0==>`, (new Date().getTime() - start) / 1000);
        const app = new App();
        const preloadData = {
            component: [],
            appConfig: await app.getAppConfig({
                appName: appName,
            }),
            event: [],
        };
        const pageData = (await new template_js_1.Template(undefined).getPage({
            appName: appName,
            tag: page,
        }))[0];
        const event_list = fs_1.default.readFileSync(path_1.default.resolve(__dirname, '../../lowcode/official_event/event.js'), 'utf8');
        const index = `TriggerEvent.create(import.meta.url,`;
        const str = `(${event_list.substring(event_list.indexOf(index) + index.length)}`;
        const regex = /TriggerEvent\.setEventRouter\(import\.meta\.url,\s*['"](.+?)['"]\)/g;
        let str2 = str;
        const matches = [];
        let match;
        while ((match = regex.exec(str)) !== null) {
            matches.push(match[0]);
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
            function loop(array) {
                for (const dd of array) {
                    if (dd.type === 'container') {
                        loop(dd.data.setting);
                    }
                    else if (dd.type === 'component') {
                        checkPass++;
                        new Promise(async (resolve, reject) => {
                            var _a;
                            const pageData = (await new template_js_1.Template(undefined).getPage({
                                appName: dd.data.refer_app || appName,
                                tag: dd.data.tag,
                            }))[0];
                            if (pageData && pageData.config) {
                                preloadData.component.push(pageData);
                                loop((_a = pageData.config) !== null && _a !== void 0 ? _a : []);
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
        let mapPush = {};
        mapPush['getPlugin'] = {
            callback: [],
            data: { response: { data: preloadData.appConfig, result: true } },
            isRunning: true,
        };
        preloadData.component.map((dd) => {
            mapPush[`getPageData-${dd.appName}-${dd.tag}`] = {
                callback: [],
                isRunning: true,
                data: { response: { result: [dd] } },
            };
        });
        let eval_code_hash = {};
        console.log(`preload-3==>`, (new Date().getTime() - start) / 1000);
        const match1 = JSON.stringify(preloadData.component).match(/\{"src":"\.\/official_event\/[^"]+\.js","route":"[^"]+"}/g);
        const code = JSON.stringify(preloadData.component).match(/\{"code":"[^"]+","/g);
        (code || []).map((dd) => {
            try {
                const code = JSON.parse(dd.substring(0, dd.length - 2) + '}');
                eval_code_hash[tool_1.default.checksum(code.code)] = code.code;
            }
            catch (e) {
                console.log(`error->`, dd);
            }
        });
        console.log(`preload-4==>`, (new Date().getTime() - start) / 1000);
        if (match1) {
            match1.map((d1) => {
                if (!preloadData.event.find((dd) => {
                    return event_[JSON.parse(d1)['route']] === dd;
                })) {
                    preloadData.event.push(event_[JSON.parse(d1)['route']]);
                }
            });
        }
        else {
            console.log('未找到匹配的字串');
        }
        console.log(`preload-5==>`, (new Date().getTime() - start) / 1000);
        mapPush.eval_code_hash = eval_code_hash;
        mapPush.event = preloadData.event;
        return mapPush;
    }
    async setAppConfig(config) {
        var _a, _b;
        try {
            const official = (await database_1.default.query(`SELECT count(1)
                         FROM \`${config_1.saasConfig.SAAS_NAME}\`.t_user
                         where userID = ?`, [this.token.userID, 'LION']))[0]['count(1)'] == 1;
            if (official) {
                const trans = await database_1.default.Transaction.build();
                await trans.execute(`delete
                     from \`${config_1.saasConfig.SAAS_NAME}\`.official_component
                     where app_name = ?`, [config.appName]);
                for (const b of (_a = config.data.lambdaView) !== null && _a !== void 0 ? _a : []) {
                    await trans.execute(`insert into \`${config_1.saasConfig.SAAS_NAME}\`.official_component
                         set ?`, [
                        {
                            key: b.key,
                            group: b.name,
                            userID: this.token.userID,
                            app_name: config.appName,
                            url: b.path,
                        },
                    ]);
                }
                await trans.commit();
            }
            return ((await database_1.default.execute(`update \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                         set config=?,
                             update_time=?
                         where appName = ${database_1.default.escape(config.appName)}
                           and user = '${this.token.userID}'
                        `, [config.data, new Date()]))['changedRows'] == true);
        }
        catch (e) {
            throw exception_1.default.BadRequestError((_b = e.code) !== null && _b !== void 0 ? _b : 'BAD_REQUEST', e, null);
        }
    }
    async postTemplate(config) {
        var _a, _b;
        try {
            let template_type = '0';
            if (config.data.post_to === 'all') {
                let officialAccount = ((_a = process.env.OFFICIAL_ACCOUNT) !== null && _a !== void 0 ? _a : '').split(',');
                if (officialAccount.indexOf(`${this.token.userID}`) !== -1) {
                    template_type = '2';
                }
                else {
                    template_type = '1';
                }
            }
            else if (config.data.post_to === 'me') {
                template_type = '3';
            }
            return ((await database_1.default.execute(`update \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                         set template_config = ?,
                             template_type=${template_type}
                         where appName = ${database_1.default.escape(config.appName)}
                           and user = '${this.token.userID}'
                        `, [config.data]))['changedRows'] == true);
        }
        catch (e) {
            throw exception_1.default.BadRequestError((_b = e.code) !== null && _b !== void 0 ? _b : 'BAD_REQUEST', e, null);
        }
    }
    async putSubDomain(cf) {
        const domain_name = `${cf.name}.${config_js_1.default.HostedDomain}`;
        if ((await database_1.default.query(`SELECT count(1)
                     FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                     where domain =${database_1.default.escape(domain_name)}`, []))[0]['count(1)'] === 0) {
            const result = await this.addDNSRecord(domain_name);
            await this.setSubDomain({
                original_domain: (await database_1.default.query(`SELECT domain
                                                  FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                                                  where appName=?;`, [cf.app_name]))[0]['domain'],
                appName: cf.app_name,
                domain: domain_name,
            });
            return true;
        }
        else {
            throw exception_1.default.BadRequestError('ERROR', 'ERROR.THIS DOMAIN ALREADY USED.', null);
        }
    }
    addDNSRecord(domain) {
        console.log(`addDNSRecord->${domain}`);
        return new Promise((resolve, reject) => {
            const route53 = new aws_sdk_1.default.Route53();
            const params = {
                ChangeBatch: {
                    Changes: [
                        {
                            Action: 'CREATE',
                            ResourceRecordSet: {
                                Name: domain,
                                Type: 'A',
                                TTL: 1,
                                ResourceRecords: [
                                    {
                                        Value: config_js_1.default.sshIP,
                                    },
                                ],
                            },
                        },
                    ],
                    Comment: 'Adding A record for example.com',
                },
                HostedZoneId: config_js_1.default.AWS_HostedZoneId,
            };
            route53.changeResourceRecordSets(params, function (err, data) {
                resolve(true);
            });
        });
    }
    async setSubDomain(config) {
        var _a;
        let checkExists = (await database_1.default.query(`select count(1)
                     from \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                     where domain =?
                       and user !=?`, [config.domain, this.token.userID]))['count(1)'] > 0;
        if (checkExists ||
            config.domain.split('.').find((dd) => {
                return !dd;
            })) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'this domain already on use.', null);
        }
        try {
            const data = await ssh_js_1.Ssh.readFile(`/etc/nginx/sites-enabled/default.conf`);
            let result = await new Promise((resolve, reject) => {
                nginx_conf_1.NginxConfFile.createFromSource(data, (err, conf) => {
                    const server = [];
                    for (const b of conf.nginx.server) {
                        if (!b.server_name.toString().includes(`server_name ${config.domain};`) && !b.server_name.toString().includes(`server_name ${config.original_domain};`)) {
                            server.push(b);
                        }
                    }
                    conf.nginx.server = server;
                    resolve(conf.toString());
                });
            });
            result += `\n\nserver {
    server_name ${config.domain};
    location / {
       proxy_pass http://127.0.0.1:3080/${config.appName}/;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $http_x_forwarded_proto;
    }
    listen 443 ssl;
    ssl_certificate ${process.env.ssl_certificate};
    ssl_certificate_key ${process.env.ssl_certificate_key};
}
server {
    if ($host = ${config.domain}) {
        return 301 https://$host$request_uri;
    }
    server_name ${config.domain};
    listen 80;
    return 404;
}
`;
            fs_1.default.writeFileSync('/nginx.config', result);
            const response = await new Promise((resolve, reject) => {
                ssh_js_1.Ssh.exec([`sudo docker cp $(sudo docker ps --filter "expose=3080" --format "{{.ID}}"):/nginx.config /etc/nginx/sites-enabled/default.conf`, `sudo nginx -s reload`]).then((res) => {
                    resolve(res && res.join('').indexOf('Successfully') !== -1);
                });
            });
            await database_1.default.execute(`
                    update \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                    set domain=?
                    where domain = ?
                `, [null, config.domain]);
            return await database_1.default.execute(`
                    update \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                    set domain=?
                    where appName = ?
                `, [config.domain, config.appName]);
        }
        catch (e) {
            throw exception_1.default.BadRequestError((_a = e.code) !== null && _a !== void 0 ? _a : 'BAD_REQUEST', e, null);
        }
    }
    async setDomain(config) {
        var _a;
        let checkExists = (await database_1.default.query(`select count(1)
                     from \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                     where domain =?
                       and user !=?`, [config.domain, this.token.userID]))['count(1)'] > 0;
        if (checkExists) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'this domain already on use.', null);
        }
        try {
            const data = await ssh_js_1.Ssh.readFile('/etc/nginx/sites-enabled/default.conf');
            let result = await new Promise((resolve, reject) => {
                nginx_conf_1.NginxConfFile.createFromSource(data, (err, conf) => {
                    const server = [];
                    for (const b of conf.nginx.server) {
                        if (!b.server_name.toString().includes(`server_name ${config.domain};`) && !b.server_name.toString().includes(`server_name ${config.original_domain};`)) {
                            server.push(b);
                        }
                    }
                    conf.nginx.server = server;
                    resolve(conf.toString());
                });
            });
            result += `\n\nserver {
       server_name ${config.domain};
    location / {
       proxy_pass http://127.0.0.1:3080/${config.appName}/;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $http_x_forwarded_proto;
    }
}`;
            fs_1.default.writeFileSync('/nginx.config', result);
            const response = await new Promise((resolve, reject) => {
                ssh_js_1.Ssh.exec([
                    `sudo docker cp $(sudo docker ps --filter "expose=3080" --format "{{.ID}}"):/nginx.config /etc/nginx/sites-enabled/default.conf`,
                    `sudo certbot --nginx -d ${config.domain} --non-interactive --agree-tos -m sam38124@gmail.com`,
                    `sudo nginx -s reload`,
                ]).then((res) => {
                    resolve(res && res.join('').indexOf('Successfully') !== -1);
                });
            });
            if (!response) {
                throw exception_1.default.BadRequestError('BAD_REQUEST', '網域驗證失敗!', null);
            }
            await database_1.default.execute(`
                    update \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                    set domain=?
                    where domain = ?
                `, [null, config.domain]);
            return await database_1.default.execute(`
                    update \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                    set domain=?
                    where appName = ?
                `, [config.domain, config.appName]);
        }
        catch (e) {
            throw exception_1.default.BadRequestError((_a = e.code) !== null && _a !== void 0 ? _a : 'BAD_REQUEST', e, null);
        }
    }
    async deleteAPP(config) {
        var _a;
        try {
            try {
                await new backend_service_js_1.BackendService(config.appName).stopServer();
            }
            catch (e) {
            }
            await database_1.default.execute(`delete
                 from \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                 where appName = ${database_1.default.escape(config.appName)}
                   and user = '${this.token.userID}'`, []);
            await database_1.default.execute(`delete
                 from \`${config_1.saasConfig.SAAS_NAME}\`.page_config
                 where appName = ${database_1.default.escape(config.appName)}
                   and userID = '${this.token.userID}'`, []);
            await database_1.default.execute(`delete
                 from \`${config_1.saasConfig.SAAS_NAME}\`.private_config
                 where app_name = ${database_1.default.escape(config.appName)}
                `, []);
        }
        catch (e) {
            throw exception_1.default.BadRequestError((_a = e.code) !== null && _a !== void 0 ? _a : 'BAD_REQUEST', e, null);
        }
    }
    constructor(token) {
        this.token = token;
    }
}
exports.App = App;
function addDays(dat, addDays) {
    var date = new Date(dat);
    date.setDate(date.getDate() + addDays);
    return date;
}
//# sourceMappingURL=app.js.map