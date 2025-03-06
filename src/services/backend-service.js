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
exports.BackendService = void 0;
const database_js_1 = __importDefault(require("../modules/database.js"));
const config_js_1 = __importStar(require("../config.js"));
const exception_js_1 = __importDefault(require("../modules/exception.js"));
const create_instance_js_1 = require("./create-instance.js");
const ssh_js_1 = require("../modules/ssh.js");
const path_1 = __importDefault(require("path"));
const release_js_1 = require("./release.js");
const fs_1 = __importDefault(require("fs"));
const ut_database_js_1 = require("../api-public/utils/ut-database.js");
const nginx_conf_1 = require("nginx-conf");
const axios_1 = __importDefault(require("axios"));
const public_table_check_js_1 = require("../api-public/services/public-table-check.js");
class BackendService {
    constructor(appName) {
        this.appName = appName;
        public_table_check_js_1.ApiPublic.createScheme(this.appName).then(() => {
        });
    }
    async getDataBaseInfo() {
        try {
            const info = (await database_js_1.default.execute(`
                select *
                from \`${config_js_1.saasConfig.SAAS_NAME}\`.app_config
                where appName = ?
            `, [this.appName]))[0];
            info.sql_ip = config_js_1.default.DB_URL;
            return info;
        }
        catch (e) {
            console.log(e);
            throw exception_js_1.default.BadRequestError("ERROR", "ERROR." + e, null);
        }
    }
    async getApiList(query) {
        var _a, _b;
        try {
            const exInfo = await this.serverInfo();
            query.page = (_a = query.page) !== null && _a !== void 0 ? _a : 0;
            query.limit = (_b = query.limit) !== null && _b !== void 0 ? _b : 50;
            const querySql = [];
            query.search && querySql.push([
                `(UPPER(name) LIKE UPPER('%${query.search}%')))`,
            ].join(` || `));
            const resp = await new ut_database_js_1.UtDatabase(this.appName, `t_api_router`).querySql(querySql, query);
            for (const b of resp.data) {
                b.health = await new Promise((resolve, reject) => {
                    let config = {
                        method: 'get',
                        maxBodyLength: Infinity,
                        url: `http://${exInfo.ip}:${b.port}`,
                        headers: {}
                    };
                    axios_1.default.request(config)
                        .then((response) => {
                        resolve(true);
                    })
                        .catch((error) => {
                        if (error.response) {
                            resolve(true);
                        }
                        else {
                            resolve(false);
                        }
                    });
                });
            }
            resp.data.map((dd) => {
                dd.ipAddress = exInfo.ip;
                return dd;
            });
            return resp;
        }
        catch (e) {
            console.log(e);
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getApiList Error:' + e, null);
        }
    }
    async getApiRouter(query) {
        try {
            const ip = await this.serverInfo();
            const qu = (await database_js_1.default.query(`SELECT *
                                        FROM \`${this.appName}\`.t_domain_setting
                                        where port = ?`, [query.port]))[0];
            return {
                url: (qu && `https://${qu.domain}`) || `http://${ip.ip}:${query.port}`
            };
        }
        catch (e) {
        }
    }
    async getDomainList(query) {
        var _a, _b;
        try {
            query.page = (_a = query.page) !== null && _a !== void 0 ? _a : 0;
            query.limit = (_b = query.limit) !== null && _b !== void 0 ? _b : 50;
            const querySql = [];
            query.search && querySql.push([
                `(UPPER(domain) LIKE UPPER('%${query.search}%')))`,
            ].join(` || `));
            const resp = await new ut_database_js_1.UtDatabase(this.appName, `t_domain_setting`).querySql(querySql, query);
            return resp;
        }
        catch (e) {
            console.log(e);
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getApiList Error:' + e, null);
        }
    }
    async serverID() {
        try {
            const ec2_id = (await database_js_1.default.execute(`
                select *
                from \`${config_js_1.saasConfig.SAAS_NAME}\`.app_config
                where appName = ?
            `, [this.appName]))[0]['ec2_id'];
            return ec2_id;
        }
        catch (e) {
            console.log(e);
            throw exception_js_1.default.BadRequestError("ERROR", "ERROR." + e, null);
        }
    }
    async serverInfo() {
        try {
            const ec2_id = (await database_js_1.default.execute(`
                select *
                from \`${config_js_1.saasConfig.SAAS_NAME}\`.app_config
                where appName = ?
            `, [this.appName]))[0]['ec2_id'];
            if (ec2_id) {
                const ec2INFO = await (0, create_instance_js_1.getEC2INFO)(ec2_id);
                return {
                    id: ec2_id,
                    ip: ec2INFO && ec2INFO.ipAddress,
                    type: ec2INFO && ec2INFO.type
                };
            }
            return {
                id: ec2_id,
                ip: ''
            };
        }
        catch (e) {
            console.log(e);
            throw exception_js_1.default.BadRequestError("ERROR", "ERROR." + e, null);
        }
    }
    async postApi(conf) {
        try {
            const serverInfo = await this.serverInfo();
            if (await this.postProjectToEc2(serverInfo.ip, conf.name, conf.file, conf.port)) {
                (await database_js_1.default.query(`
                    replace
                    into \`${this.appName}\`.t_api_router
                    SET ?
                `, [conf]));
                return {
                    result: true
                };
            }
            else {
                return {
                    result: false
                };
            }
        }
        catch (e) {
            console.log(e);
            throw exception_js_1.default.BadRequestError("ERROR", "ERROR." + e, null);
        }
    }
    async shutdown(conf) {
        try {
            const serverInfo = await this.serverInfo();
            if (await this.stopEc2Project(serverInfo.ip, conf.port)) {
                return {
                    result: true
                };
            }
            else {
                return {
                    result: false
                };
            }
        }
        catch (e) {
            console.log(e);
            throw exception_js_1.default.BadRequestError("ERROR", "ERROR." + e, null);
        }
    }
    async deleteAPI(conf) {
        try {
            const serverInfo = await this.serverInfo();
            await database_js_1.default.execute(`delete
                              from \`${this.appName}\`.t_api_router
                              where port = ?`, [conf.port]);
            if (await this.stopEc2Project(serverInfo.ip, conf.port)) {
                return {
                    result: true
                };
            }
            else {
                return {
                    result: false
                };
            }
        }
        catch (e) {
            console.log(e);
            throw exception_js_1.default.BadRequestError("ERROR", "ERROR." + e, null);
        }
    }
    async putDomain(config) {
        var _a;
        try {
            const ip = (await this.serverInfo()).ip;
            const data = await ssh_js_1.Ssh.readFile('/etc/nginx/sites-enabled/default', ip);
            let result = await new Promise((resolve, reject) => {
                nginx_conf_1.NginxConfFile.createFromSource(data, (err, conf) => {
                    const server = [];
                    try {
                        for (const b of conf.nginx.server) {
                            if (b.server_name.toString().indexOf(config.domain) === -1) {
                                console.log(b.server_name.toString());
                                server.push(b);
                            }
                        }
                    }
                    catch (e) {
                    }
                    conf.nginx.server = server;
                    resolve(conf.toString());
                });
            });
            result += `\n\nserver {
       server_name ${config.domain};
    location / {
       proxy_pass http://127.0.0.1:${config.port};
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $http_x_forwarded_proto;
    }
}`;
            const url = await ssh_js_1.Ssh.uploadFile(result, new Date().getTime().toString(), 'data');
            const response = await new Promise((resolve, reject) => {
                ssh_js_1.Ssh.exec([
                    `sudo curl -o /etc/nginx/sites-enabled/default ${url}`,
                    `sudo certbot --nginx -d ${config.domain} --non-interactive --agree-tos -m sam38124@gmail.com`,
                    `sudo nginx -s reload`
                ], ip).then((res) => {
                    resolve(res && res.join('').indexOf('Successfully') !== -1);
                });
            });
            if (!response) {
                throw exception_js_1.default.BadRequestError('BAD_REQUEST', '網域驗證失敗', null);
            }
            await database_js_1.default.query(`replace
            into \`${this.appName}\`.t_domain_setting  set ?`, [
                {
                    domain: config.domain,
                    port: parseInt(config.port, 10)
                }
            ]);
            return true;
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError((_a = e.code) !== null && _a !== void 0 ? _a : 'BAD_REQUEST', e, null);
        }
    }
    async deleteDomain(config) {
        var _a;
        try {
            const ip = (await this.serverInfo()).ip;
            const data = await ssh_js_1.Ssh.readFile('/etc/nginx/sites-enabled/default', ip);
            let result = await new Promise((resolve, reject) => {
                nginx_conf_1.NginxConfFile.createFromSource(data, (err, conf) => {
                    const server = [];
                    try {
                        for (const b of conf.nginx.server) {
                            if (b.server_name.toString().indexOf(config.domain) === -1) {
                                server.push(b);
                            }
                        }
                    }
                    catch (e) {
                    }
                    conf.nginx.server = server;
                    resolve(conf.toString());
                });
            });
            const url = await ssh_js_1.Ssh.uploadFile(result, new Date().getTime().toString(), 'data');
            const response = await new Promise((resolve, reject) => {
                ssh_js_1.Ssh.exec([
                    `sudo curl -o /etc/nginx/sites-enabled/default ${url}`,
                    `sudo nginx -s reload`
                ], ip).then((res) => {
                    resolve(res && res.join('').indexOf('Successfully') !== -1);
                });
            });
            await database_js_1.default.query(`delete
                            from \`${this.appName}\`.t_domain_setting
                            where domain =?`, [
                config.domain
            ]);
            return true;
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError((_a = e.code) !== null && _a !== void 0 ? _a : 'BAD_REQUEST', e, null);
        }
    }
    async getSampleProject() {
        try {
            const serverInfo = await this.serverInfo();
            const dbInfo = await this.getDataBaseInfo();
            const file = new Date().getTime();
            const copyFile = path_1.default.resolve(__filename, `../../app-project/work-space/${file}`);
            release_js_1.Release.copyFolderSync(path_1.default.resolve(__filename, '../../app-project/serverless'), copyFile);
            fs_1.default.writeFileSync(path_1.default.resolve(__filename, `../../app-project/work-space/${file}/env/server.env`), `DB_URL=${dbInfo.sql_ip}
DB_PORT=3306
DB_USER=${dbInfo.sql_admin}
DB_PWD=${dbInfo.sql_pwd}
REDIS_URL=${serverInfo.ip}
REDIS_PORT=6379
REDIS_PWD=hdseasa
PORT=8000`);
            await release_js_1.Release.compressFiles(copyFile, `${copyFile}.zip`);
            const url = await release_js_1.Release.uploadFile(`${copyFile}.zip`, `${file}/serverless.zip`);
            release_js_1.Release.deleteFile(`${copyFile}.zip`);
            release_js_1.Release.deleteFolder(`${copyFile}`);
            return {
                result: url
            };
        }
        catch (e) {
            console.log(e);
            throw exception_js_1.default.BadRequestError("ERROR", "ERROR." + e, null);
        }
    }
    async postProjectToEc2(ip, name, file, port) {
        return await ssh_js_1.Ssh.exec([
            `sudo mkdir /home/project`,
            `sudo rm -rf /home/project/${name}`,
            `sudo mkdir /home/project/${name}`,
            `sudo rm -f ${name}.zip`,
            `sudo curl -o /home/project/${name}/${name}.zip "${file}"`,
            `cd /home/project/${name} && sudo unzip -o /home/project/${name}/${name}.zip`,
            `sudo rm -f /home/project/${name}/${name}.zip`,
            `sudo docker system prune -f`,
            `cd /home/project/${name} && sudo docker build . -t ${name}`,
            `sudo docker stop $(sudo docker ps --filter "expose=${port}" --format "{{.ID}}")`,
            `sudo docker run --restart=always --log-opt max-size=50m  -d -p ${port}:${port} -t  ${name}`
        ], ip);
    }
    async stopEc2Project(ip, port) {
        return await ssh_js_1.Ssh.exec([
            `sudo docker stop $(sudo docker ps --filter "expose=${port}" --format "{{.ID}}")`,
        ], ip);
    }
    async startServer() {
        try {
            const ec2_id = (await database_js_1.default.execute(`
                select *
                from \`${config_js_1.saasConfig.SAAS_NAME}\`.app_config
                where appName = ?
            `, [this.appName]))[0]['ec2_id'];
            if (ec2_id) {
                throw exception_js_1.default.BadRequestError("ERROR", "THE SERVER ALREADY CREATED.", null);
            }
            else {
                console.log(`this.appName`, this.appName);
                const ec2ID = await (0, create_instance_js_1.createEC2Instance)();
                await database_js_1.default.execute(`update \`${config_js_1.saasConfig.SAAS_NAME}\`.app_config
                                  set ec2_id=?
                                  where appName = ?`, [ec2ID, this.appName]);
                return true;
            }
        }
        catch (e) {
            console.log(e);
            throw exception_js_1.default.BadRequestError("ERROR", "ERROR." + e, null);
        }
    }
    async stopServer() {
        try {
            const ec2_id = (await database_js_1.default.execute(`
                select *
                from \`${config_js_1.saasConfig.SAAS_NAME}\`.app_config
                where appName = ?
            `, [this.appName]))[0]['ec2_id'];
            if (await (0, create_instance_js_1.terminateInstances)(ec2_id)) {
                await database_js_1.default.execute(`update \`${config_js_1.saasConfig.SAAS_NAME}\`.app_config
                                  set ec2_id=?
                                  where appName = ?`, ['', this.appName]);
                return true;
            }
            else {
                return false;
            }
        }
        catch (e) {
            console.log(e);
            throw exception_js_1.default.BadRequestError("ERROR", "ERROR." + e, null);
        }
    }
}
exports.BackendService = BackendService;
//# sourceMappingURL=backend-service.js.map