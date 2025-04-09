import db from "../modules/database.js";
import config, {saasConfig} from "../config.js";
import moment from "moment";
import exception from "../modules/exception.js";
import {createEC2Instance, getEC2INFO, terminateInstances} from "./create-instance.js";
import {Ssh} from "../modules/ssh.js";
import path from "path";
import {Release} from "./release.js";
import fs from "fs";
import {UtDatabase} from "../api-public/utils/ut-database.js";
import {NginxConfFile} from "nginx-conf";
import axios from "axios";
import {ApiPublic} from "../api-public/services/public-table-check.js";
import AWS from "aws-sdk";
import {App} from "./app.js";

export class BackendService {
    public appName: string

    constructor(appName: string) {
        this.appName = appName;
        ApiPublic.createScheme(this.appName).then(() => {
        })
    }

    public async getDataBaseInfo() {
        try {
            const info: {
                sql_ip: string,
                sql_pwd: string,
                sql_admin: string
            } = (await db.execute(`
                select *
                from \`${saasConfig.SAAS_NAME}\`.app_config
                where appName = ?
            `, [this.appName]))[0];
            info.sql_ip = config.DB_URL as string
            return info
        } catch (e) {
            console.log(e);
            throw exception.BadRequestError("ERROR", "ERROR." + e, null);
        }
    }

    public async getApiList(query: { page?: number, limit?: number, id?: string, search?: string }) {
        try {
            const exInfo = await this.serverInfo()
            query.page = query.page ?? 0
            query.limit = query.limit ?? 50
            const querySql: any = []
            query.search && querySql.push(
                [
                    `(UPPER(name) LIKE UPPER('%${query.search}%')))`,
                ].join(` || `)
            )
            const resp = await new UtDatabase(this.appName, `t_api_router`).querySql(querySql, query as any)
            for (const b of resp.data) {
                b.health = await new Promise((resolve, reject) => {
                    let config = {
                        method: 'get',
                        maxBodyLength: Infinity,
                        url: `http://${exInfo.ip}:${b.port}`,
                        headers: {}
                    };
                    axios.request(config)
                        .then((response) => {
                            resolve(true)
                        })
                        .catch((error) => {
                            if (error.response) {
                                resolve(true)
                            } else {
                                resolve(false)
                            }
                        });
                })
            }
            resp.data.map((dd: any) => {
                dd.ipAddress = exInfo.ip;
                return dd
            })
            return resp
        } catch (e) {
            console.log(e)
            throw exception.BadRequestError('BAD_REQUEST', 'getApiList Error:' + e, null);
        }
    }

    public async getApiRouter(query: { port: string }) {
        try {
            const ip = await this.serverInfo()
            const qu = (await db.query(`SELECT *
                                        FROM \`${this.appName}\`.t_domain_setting
                                        where port = ?`, [query.port]))[0]

            return {
                url: (qu && `https://${qu.domain}`) || `http://${ip.ip}:${query.port}`
            }
        } catch (e) {

        }
    }

    public async getDomainList(query: { page?: number, limit?: number, id?: string, search?: string }) {
        try {
            query.page = query.page ?? 0
            query.limit = query.limit ?? 50
            const querySql: any = []
            query.search && querySql.push(
                [
                    `(UPPER(domain) LIKE UPPER('%${query.search}%')))`,
                ].join(` || `)
            )
            const resp = await new UtDatabase(this.appName, `t_domain_setting`).querySql(querySql, query as any)
            return resp
        } catch (e) {
            console.log(e)
            throw exception.BadRequestError('BAD_REQUEST', 'getApiList Error:' + e, null);
        }
    }

    public async serverID() {
        try {
            const ec2_id = (await db.execute(`
                select *
                from \`${saasConfig.SAAS_NAME}\`.app_config
                where appName = ?
            `, [this.appName]))[0]['ec2_id']

            return ec2_id
        } catch (e) {
            console.log(e);
            throw exception.BadRequestError("ERROR", "ERROR." + e, null);
        }
    }

    public async serverInfo() {
        try {
            const ec2_id = (await db.execute(`
                select *
                from \`${saasConfig.SAAS_NAME}\`.app_config
                where appName = ?
            `, [this.appName]))[0]['ec2_id']
            if (ec2_id) {
                const ec2INFO: any = await getEC2INFO(ec2_id)
                return {
                    id: ec2_id,
                    ip: ec2INFO && ec2INFO.ipAddress,
                    type: ec2INFO && ec2INFO.type
                }
            }

            return {
                id: ec2_id,
                ip: ''
            }
        } catch (e) {
            console.log(e);
            throw exception.BadRequestError("ERROR", "ERROR." + e, null);
        }
    }

    public async postApi(conf: {
        name: string,
        version: string,
        port: number,
        file: string
    }) {
        try {
            const serverInfo = await this.serverInfo();
            if (await this.postProjectToEc2(serverInfo.ip, conf.name, conf.file, conf.port)) {
                (await db.query(`
                    replace
                    into \`${this.appName}\`.t_api_router
                    SET ?
                `, [conf]))
                return {
                    result: true
                }
            } else {
                return {
                    result: false
                }
            }
        } catch (e) {
            console.log(e);
            throw exception.BadRequestError("ERROR", "ERROR." + e, null);
        }
    }

    public async shutdown(conf: {
        port: number
    }) {
        try {
            const serverInfo = await this.serverInfo();
            if (await this.stopEc2Project(serverInfo.ip, conf.port)) {
                return {
                    result: true
                }
            } else {
                return {
                    result: false
                }
            }
        } catch (e) {
            console.log(e);
            throw exception.BadRequestError("ERROR", "ERROR." + e, null);
        }
    }

    public async deleteAPI(conf: {
        port: number
    }) {
        try {
            const serverInfo = await this.serverInfo();
            await db.execute(`delete
                              from \`${this.appName}\`.t_api_router
                              where port = ?`, [conf.port])
            if (await this.stopEc2Project(serverInfo.ip, conf.port)) {
                return {
                    result: true
                }
            } else {
                return {
                    result: false
                }
            }
        } catch (e) {
            console.log(e);
            throw exception.BadRequestError("ERROR", "ERROR." + e, null);
        }
    }


    public async putDomain(config: {
        domain: string,
        port: string
    }) {
        try {
            const ip = (await this.serverInfo()).ip
            const data = await Ssh.readFile('/etc/nginx/sites-enabled/default', ip)
            let result: string = await new Promise((resolve, reject) => {
                NginxConfFile.createFromSource(data as string, (err, conf) => {
                    const server: any = []
                    try {
                        for (const b of conf!.nginx.server as any) {
                            if (b.server_name.toString().indexOf(config.domain.replace('www.','')) === -1) {
                                console.log(b.server_name.toString())
                                server.push(b)
                            }
                        }
                    } catch (e) {

                    }
                    conf!.nginx.server = server
                    resolve(conf!.toString())
                })
            })
            result += `\n\nserver {
       server_name ${config.domain};
    location / {
       proxy_pass http://127.0.0.1:${config.port};
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $http_x_forwarded_proto;
    }
}`
            if(config.domain.startsWith('www.')){
                result += `\n\nserver {
    listen 80;
    server_name ${config.domain.replace('www.','')};
    # 自動重定向 HTTP 到 HTTPS
    return 301 https://www.$host$request_uri;
}`
            }
            const url = await Ssh.uploadFile(result, new Date().getTime().toString(), 'data')

            const response = await new Promise((resolve, reject) => {
                Ssh.exec([
                    `sudo curl -o /etc/nginx/sites-enabled/default ${url}`,
                    `sudo certbot --nginx -d ${config.domain} --non-interactive --agree-tos -m sam38124@gmail.com`,
                    ...(()=>{
                        if(config.domain.startsWith('www.')){
                            return [`sudo certbot --nginx -d ${config.domain.replace('www.','')} --non-interactive --agree-tos -m sam38124@gmail.com`]
                        }else{
                            return []
                        }
                    })(),
                    `sudo nginx -s reload`
                ], ip).then((res: any) => {
                    resolve(res && res.join('').indexOf('Successfully') !== -1)
                })
            });
            if (!response) {
                throw exception.BadRequestError('BAD_REQUEST', '網域驗證失敗', null);
            }
            await db.query(`replace
            into \`${this.appName}\`.t_domain_setting  set ?`, [
                {
                    domain: config.domain,
                    port: parseInt(config.port, 10)
                }
            ])
            return true
        } catch (e: any) {
            throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', e, null);
        }
    }

    public async deleteDomain(config: {
        domain: string
    }) {
        try {
            const ip = (await this.serverInfo()).ip
            const data = await Ssh.readFile('/etc/nginx/sites-enabled/default', ip)
            let result: string = await new Promise((resolve, reject) => {
                NginxConfFile.createFromSource(data as string, (err, conf) => {
                    const server: any = []
                    try {
                        for (const b of conf!.nginx.server as any) {
                            if (b.server_name.toString().indexOf(config.domain) === -1) {
                                server.push(b)
                            }
                        }
                    } catch (e) {

                    }
                    conf!.nginx.server = server
                    resolve(conf!.toString())
                })
            })

            const url = await Ssh.uploadFile(result, new Date().getTime().toString(), 'data')
            const response = await new Promise((resolve, reject) => {
                Ssh.exec([
                    `sudo curl -o /etc/nginx/sites-enabled/default ${url}`,
                    `sudo nginx -s reload`
                ], ip).then((res: any) => {
                    resolve(res && res.join('').indexOf('Successfully') !== -1)
                })
            });
            await db.query(`delete
                            from \`${this.appName}\`.t_domain_setting
                            where domain =?`, [
                config.domain
            ])
            return true
        } catch (e: any) {
            throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', e, null);
        }
    }

    public async getSampleProject() {
        try {
            const serverInfo = await this.serverInfo();
            const dbInfo = await this.getDataBaseInfo();
            const file = new Date().getTime()
            const copyFile = path.resolve(__filename, `../../app-project/work-space/${file}`)
            Release.copyFolderSync(path.resolve(__filename, '../../app-project/serverless'), copyFile)
            fs.writeFileSync(path.resolve(__filename, `../../app-project/work-space/${file}/env/server.env`), `DB_URL=${dbInfo.sql_ip}
DB_PORT=3306
DB_USER=${dbInfo.sql_admin}
DB_PWD=${dbInfo.sql_pwd}
REDIS_URL=${serverInfo.ip}
REDIS_PORT=6379
REDIS_PWD=hdseasa
PORT=8000`)
            await Release.compressFiles(copyFile, `${copyFile}.zip`)
            const url = await Release.uploadFile(`${copyFile}.zip`, `${file}/serverless.zip`)
            Release.deleteFile(`${copyFile}.zip`)
            Release.deleteFolder(`${copyFile}`)
            return {
                result: url
            }
        } catch (e) {
            console.log(e);
            throw exception.BadRequestError("ERROR", "ERROR." + e, null);
        }
    }

    public async postProjectToEc2(ip: string, name: string, file: string, port: number) {
        //Post project to ec2.
        return await Ssh.exec([
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

    public async stopEc2Project(ip: string, port: number) {
        //Post project to ec2.
        return await Ssh.exec([
            `sudo docker stop $(sudo docker ps --filter "expose=${port}" --format "{{.ID}}")`,
        ], ip);
    }

    public async startServer() {
        try {
            const ec2_id = (await db.execute(`
                select *
                from \`${saasConfig.SAAS_NAME}\`.app_config
                where appName = ?
            `, [this.appName]))[0]['ec2_id']
            if (ec2_id) {
                throw exception.BadRequestError("ERROR", "THE SERVER ALREADY CREATED.", null);
            } else {
                console.log(`this.appName`, this.appName)
                const ec2ID = await createEC2Instance()
                await db.execute(`update \`${saasConfig.SAAS_NAME}\`.app_config
                                  set ec2_id=?
                                  where appName = ?`, [ec2ID, this.appName])
                return true
            }
        } catch (e) {
            console.log(e);
            throw exception.BadRequestError("ERROR", "ERROR." + e, null);
        }
    }

    public async stopServer() {
        try {
            const ec2_id = (await db.execute(`
                select *
                from \`${saasConfig.SAAS_NAME}\`.app_config
                where appName = ?
            `, [this.appName]))[0]['ec2_id']
            if (await terminateInstances(ec2_id)) {
                await db.execute(`update \`${saasConfig.SAAS_NAME}\`.app_config
                                  set ec2_id=?
                                  where appName = ?`, ['', this.appName])
                return true;
            } else {
                return false;
            }
        } catch (e) {
            console.log(e);
            throw exception.BadRequestError("ERROR", "ERROR." + e, null);
        }
    }
}