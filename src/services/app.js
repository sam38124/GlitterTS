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
const config_js_1 = __importDefault(require("../config.js"));
const fs_1 = __importDefault(require("fs"));
const ssh_js_1 = require("../modules/ssh.js");
const nginx_conf_1 = require("nginx-conf");
const process = __importStar(require("process"));
const public_table_check_js_1 = require("../api-public/services/public-table-check.js");
const backend_service_js_1 = require("./backend-service.js");
const template_js_1 = require("./template.js");
class App {
    static getAdConfig(app, key) {
        return new Promise(async (resolve, reject) => {
            const data = await database_1.default.query(`select \`value\`
                                         from \`${config_js_1.default.DB_NAME}\`.private_config
                                         where app_name = '${app}'
                                           and \`key\` = ${database_1.default.escape(key)}`, []);
            resolve((data[0]) ? data[0]['value'] : {});
        });
    }
    async createApp(config) {
        var _a, _b, _c;
        try {
            config.copyWith = (_a = config.copyWith) !== null && _a !== void 0 ? _a : [];
            const count = await database_1.default.execute(`
                select count(1)
                from \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                where appName = ${database_1.default.escape(config.appName)}
            `, []);
            if (count[0]["count(1)"] === 1) {
                throw exception_1.default.BadRequestError('Forbidden', 'This app already be used.', null);
            }
            let copyAppData = undefined;
            let copyPageData = undefined;
            let privateConfig = undefined;
            if (config.copyApp) {
                await public_table_check_js_1.ApiPublic.createScheme(config.copyApp);
                copyAppData = (await database_1.default.execute(`select *
                                                 from \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                                                 where appName = ${database_1.default.escape(config.copyApp)}`, []))[0];
                copyPageData = (await database_1.default.execute(`select *
                                                  from \`${config_1.saasConfig.SAAS_NAME}\`.page_config
                                                  where appName = ${database_1.default.escape(config.copyApp)}`, []));
                privateConfig = (await database_1.default.execute(`select *
                                                   from \`${config_1.saasConfig.SAAS_NAME}\`.private_config
                                                   where app_name = ${database_1.default.escape(config.copyApp)} `, []));
            }
            await public_table_check_js_1.ApiPublic.createScheme(config.appName);
            const trans = await database_1.default.Transaction.build();
            await trans.execute(`insert into \`${config_1.saasConfig.SAAS_NAME}\`.app_config (user, appName, dead_line, \`config\`, brand)
                                 values (?, ?, ?,
                                         ${database_1.default.escape(JSON.stringify((copyAppData && copyAppData.config) || {}))},
                                         ${database_1.default.escape((_b = config.brand) !== null && _b !== void 0 ? _b : config_1.saasConfig.SAAS_NAME)})`, [
                this.token.userID,
                config.appName,
                addDays(new Date(), config_1.saasConfig.DEF_DEADLINE)
            ]);
            if (config.copyWith.indexOf('checkout') !== -1) {
                for (const dd of (await database_1.default.query(`SELECT *
                                                  FROM \`${config.copyApp}\`.t_checkout`, []))) {
                    dd.orderData = dd.orderData && JSON.stringify(dd.orderData);
                    await trans.execute(`
                        insert into \`${config.appName}\`.t_checkout
                        SET ?;
                    `, [
                        dd
                    ]);
                }
            }
            if (config.copyWith.indexOf('manager_post') !== -1) {
                for (const dd of (await database_1.default.query(`SELECT *
                                                  FROM \`${config.copyApp}\`.t_manager_post`, []))) {
                    dd.content = dd.content && JSON.stringify(dd.content);
                    dd.userID = this.token.userID;
                    await trans.execute(`
                        insert into \`${config.appName}\`.t_manager_post
                        SET ?;
                    `, [
                        dd
                    ]);
                }
            }
            if (config.copyWith.indexOf('user_post') !== -1) {
                for (const dd of (await database_1.default.query(`SELECT *
                                                  FROM \`${config.copyApp}\`.t_post`, []))) {
                    dd.content = dd.content && JSON.stringify(dd.content);
                    await trans.execute(`
                        insert into \`${config.appName}\`.t_post
                        SET ?;
                    `, [
                        dd
                    ]);
                }
            }
            if (config.copyWith.indexOf('user') !== -1) {
                for (const dd of (await database_1.default.query(`SELECT *
                                                  FROM \`${config.copyApp}\`.t_user`, []))) {
                    dd.userData = dd.userData && JSON.stringify(dd.userData);
                    await trans.execute(`
                        insert into \`${config.appName}\`.t_user
                        SET ?;
                    `, [
                        dd
                    ]);
                }
            }
            for (const dd of (await database_1.default.query(`SELECT *
                                              FROM \`${config.copyApp}\`.t_global_event`, []))) {
                dd.json = dd.json && JSON.stringify(dd.json);
                await trans.execute(`
                    insert into \`${config.appName}\`.t_global_event
                    SET ?;
                `, [
                    dd
                ]);
            }
            if (config.copyWith.indexOf('public_config') !== -1) {
                for (const dd of (await database_1.default.query(`SELECT *
                                                  FROM \`${config.copyApp}\`.public_config`, []))) {
                    dd.value = dd.value && JSON.stringify(dd.value);
                    await trans.execute(`
                        insert into \`${config.appName}\`.public_config
                        SET ?;
                    `, [
                        dd
                    ]);
                }
                for (const dd of (await database_1.default.query(`SELECT *
                                                  FROM \`${config.copyApp}\`.t_user_public_config`, []))) {
                    dd.value = dd.value && JSON.stringify(dd.value);
                    await trans.execute(`
                        insert into \`${config.appName}\`.t_user_public_config
                        SET ?;
                    `, [
                        dd
                    ]);
                }
            }
            if (privateConfig) {
                for (const dd of privateConfig) {
                    await trans.execute(`
                        insert into \`${config_1.saasConfig.SAAS_NAME}\`.private_config (\`app_name\`, \`key\`, \`value\`, updated_at)
                        values (?, ?, ?, ?);
                    `, [
                        config.appName,
                        dd.key,
                        JSON.stringify(dd.value),
                        new Date()
                    ]);
                }
            }
            if (copyPageData) {
                for (const dd of copyPageData) {
                    await trans.execute(`
                        insert into \`${config_1.saasConfig.SAAS_NAME}\`.page_config (userID, appName, tag, \`group\`, \`name\`,
                                                                             \`config\`, \`page_config\`, page_type)
                        values (?, ?, ?, ?, ?, ${database_1.default.escape(JSON.stringify(dd.config))},
                                ${database_1.default.escape(JSON.stringify(dd.page_config))}, ${database_1.default.escape(dd.page_type)});
                    `, [
                        this.token.userID,
                        config.appName,
                        dd.tag,
                        dd.group || '未分類',
                        dd.name
                    ]);
                }
            }
            else {
                await trans.execute(`
                    insert into \`${config_1.saasConfig.SAAS_NAME}\`.page_config (userID, appName, tag, \`group\`, \`name\`,
                                                                         \`config\`, \`page_config\`)
                    values (?, ?, ?, ?, ?, ${database_1.default.escape(JSON.stringify({}))}, ${database_1.default.escape(JSON.stringify({}))});
                `, [
                    this.token.userID,
                    config.appName,
                    'index',
                    '',
                    '首頁',
                ]);
            }
            await trans.commit();
            await (0, index_js_1.createAPP)(config);
            return true;
        }
        catch (e) {
            console.log(JSON.stringify(e));
            throw exception_1.default.BadRequestError((_c = e.code) !== null && _c !== void 0 ? _c : 'BAD_REQUEST', e, null);
        }
    }
    async getAPP(query) {
        var _a;
        try {
            console.log(`
                SELECT *
                FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                where ${(() => {
                const sql = [`user = '${this.token.userID}'`];
                if (query.app_name) {
                    sql.push(` appName='${query.app_name}' `);
                }
                return sql.join(' and ');
            })()};
            `);
            return (await database_1.default.execute(`
                SELECT *
                FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                where ${(() => {
                const sql = [`user = '${this.token.userID}'`];
                if (query.app_name) {
                    sql.push(` appName='${query.app_name}' `);
                }
                return sql.join(' and ');
            })()};
            `, []));
        }
        catch (e) {
            throw exception_1.default.BadRequestError((_a = e.code) !== null && _a !== void 0 ? _a : 'BAD_REQUEST', e, null);
        }
    }
    async getTemplate(query) {
        var _a;
        try {
            return (await database_1.default.execute(`
                SELECT user, appName, created_time, dead_line, brand, template_config, template_type
                FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                where ${(() => {
                const sql = [];
                query.template_from === 'me' && sql.push(`user = '${this.token.userID}'`);
                query.template_from === 'me' && sql.push(`template_type in (3,2)`);
                query.template_from === 'all' && sql.push(`template_type = 2`);
                return sql.map((dd) => {
                    return `(${dd})`;
                }).join(' and ');
            })()};
            `, []));
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
            return ((await database_1.default.execute(`
                SELECT *
                FROM \`${config_1.saasConfig.SAAS_NAME}\`.official_component;
            `, [])));
        }
        catch (e) {
            throw exception_1.default.BadRequestError((_a = e.code) !== null && _a !== void 0 ? _a : 'BAD_REQUEST', e, null);
        }
    }
    static async checkBrandAndMemberType(app) {
        let brand = (await database_1.default.query(`SELECT brand
                                     FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                                     where appName = ? `, [app]))[0]['brand'];
        console.log(`brand-->`, brand);
        const userID = (await database_1.default.query(`SELECT user
                                        FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                                        where appName = ?`, [app]))[0]['user'];
        const userData = (await database_1.default.query(`SELECT userData
                                          FROM \`${brand}\`.t_user
                                          where userID = ? `, [userID]))[0];
        return {
            memberType: userData.userData.menber_type,
            brand: brand,
            userData: userData.userData
        };
    }
    static async preloadPageData(appName, page) {
        const app = new App();
        const preloadData = {
            component: [],
            appConfig: (await app.getAppConfig({
                appName: appName
            }))
        };
        const pageData = (await (new template_js_1.Template(undefined).getPage({
            appName: appName,
            tag: page
        })))[0];
        preloadData.component.push(pageData);
        async function loop(array) {
            var _a;
            for (const dd of array) {
                if (dd.type === 'container') {
                    await loop(dd.data.setting);
                }
                else if (dd.type === 'component') {
                    const pageData = (await (new template_js_1.Template(undefined).getPage({
                        appName: appName,
                        tag: dd.data.tag
                    })))[0];
                    if (pageData && pageData.config) {
                        preloadData.component.push(pageData);
                        await loop((_a = pageData.config) !== null && _a !== void 0 ? _a : []);
                    }
                }
            }
        }
        (await loop(pageData.config));
        let mapPush = {};
        mapPush['getPlugin'] = { callback: [], data: { response: { data: preloadData.appConfig, result: true } }, isRunning: true };
        preloadData.component.map((dd) => {
            mapPush['getPageData-' + dd.tag] = { callback: [], isRunning: true, data: { response: { result: [dd] } } };
        });
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
                for (const b of ((_a = config.data.lambdaView) !== null && _a !== void 0 ? _a : [])) {
                    await trans.execute(`insert into \`${config_1.saasConfig.SAAS_NAME}\`.official_component
                                         set ?`, [
                        {
                            key: b.key,
                            group: b.name,
                            userID: this.token.userID,
                            app_name: config.appName,
                            url: b.path,
                        }
                    ]);
                }
                await trans.commit();
            }
            return (await database_1.default.execute(`update \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                                      set config=?
                                      where appName = ${database_1.default.escape(config.appName)}
                                        and user = '${this.token.userID}'
            `, [config.data]))['changedRows'] == true;
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
            return (await database_1.default.execute(`update \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                                      set template_config = ?,
                                          template_type=${template_type}
                                      where appName = ${database_1.default.escape(config.appName)}
                                        and user = '${this.token.userID}'
            `, [config.data]))['changedRows'] == true;
        }
        catch (e) {
            throw exception_1.default.BadRequestError((_b = e.code) !== null && _b !== void 0 ? _b : 'BAD_REQUEST', e, null);
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
                        if (b.server_name.toString().indexOf(config.domain) === -1) {
                            console.log(b.server_name.toString());
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
                    `sudo nginx -s reload`
                ]).then((res) => {
                    resolve(res && res.join('').indexOf('Successfully') !== -1);
                });
            });
            if (!response) {
                throw exception_1.default.BadRequestError('BAD_REQUEST', '網域驗證失敗!', null);
            }
            ((await database_1.default.execute(`
                update \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                set domain=?
                where domain = ?
            `, [null, config.domain])));
            return ((await database_1.default.execute(`
                update \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                set domain=?
                where appName = ?
            `, [config.domain, config.appName])));
        }
        catch (e) {
            throw exception_1.default.BadRequestError((_a = e.code) !== null && _a !== void 0 ? _a : 'BAD_REQUEST', e, null);
        }
    }
    async deleteAPP(config) {
        var _a;
        try {
            try {
                await (new backend_service_js_1.BackendService(config.appName).stopServer());
            }
            catch (e) {
            }
            (await database_1.default.execute(`delete
                               from \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                               where appName = ${database_1.default.escape(config.appName)}
                                 and user = '${this.token.userID}'`, []));
            (await database_1.default.execute(`delete
                               from \`${config_1.saasConfig.SAAS_NAME}\`.page_config
                               where appName = ${database_1.default.escape(config.appName)}
                                 and userID = '${this.token.userID}'`, []));
            (await database_1.default.execute(`delete
                               from \`${config_1.saasConfig.SAAS_NAME}\`.private_config
                               where app_name = ${database_1.default.escape(config.appName)}
            `, []));
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