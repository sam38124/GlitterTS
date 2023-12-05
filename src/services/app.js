"use strict";
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
const public_table_check_js_1 = require("../api-public/services/public-table-check.js");
class App {
    constructor(token) {
        this.token = token;
    }
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
        var _a, _b;
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
            await trans.execute(`insert into \`${config_1.saasConfig.SAAS_NAME}\`.app_config (user, appName, dead_line, \`config\`)
                                 values (?, ?, ?,
                                         ${database_1.default.escape(JSON.stringify((copyAppData && copyAppData.config) || {}))})`, [
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
                                                                             \`config\`, \`page_config\`)
                        values (?, ?, ?, ?, ?, ${database_1.default.escape(JSON.stringify(dd.config))},
                                ${database_1.default.escape(JSON.stringify(dd.page_config))});
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
            throw exception_1.default.BadRequestError((_b = e.code) !== null && _b !== void 0 ? _b : 'BAD_REQUEST', e, null);
        }
    }
    async getAPP(query) {
        var _a;
        try {
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
    async getAppConfig(config) {
        var _a, _b, _c, _d;
        try {
            const pluginList = (_a = ((await database_1.default.execute(`
                SELECT config
                FROM \`${config_1.saasConfig.SAAS_NAME}\`.app_config
                where appName = '${config.appName}';
            `, []))[0]['config'])) !== null && _a !== void 0 ? _a : {};
            pluginList.pagePlugin = (_b = pluginList.pagePlugin) !== null && _b !== void 0 ? _b : [];
            pluginList.eventPlugin = (_c = pluginList.eventPlugin) !== null && _c !== void 0 ? _c : [];
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
    async setAppConfig(config) {
        var _a, _b;
        try {
            const official = (await database_1.default.query(`SELECT count(1)
                                              FROM \`${config_1.saasConfig.SAAS_NAME}\`.user
                                              where userID = ?
                                                and company = ?`, [this.token.userID, 'LION']))[0]['count(1)'] == 1;
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
                               where app_name = ${database_1.default.escape(config.appName)}`, []));
        }
        catch (e) {
            throw exception_1.default.BadRequestError((_a = e.code) !== null && _a !== void 0 ? _a : 'BAD_REQUEST', e, null);
        }
    }
}
exports.App = App;
function addDays(dat, addDays) {
    var date = new Date(dat);
    date.setDate(date.getDate() + addDays);
    return date;
}
//# sourceMappingURL=app.js.map