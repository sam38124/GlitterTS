import * as core from "express-serve-static-core";
import express from 'express';
import * as fs from "fs";
import {initial, app} from "./src/index";
import {ConfigSetting} from "./src/config";
import path from "path";
import {Post} from "./src/api-public/services/post";
import db from './src/modules/database'
import config from "./src/config";
import {lambda} from "./src/lambda/interface";

export async function set_frontend(express: core.Express, rout: { rout: string, path: string, seoManager: (req: express.Request, resp: express.Response) => Promise<string> }[]) {
    for (const dd of rout) {
        express.use(dd.rout, async (req: express.Request, resp: express.Response, next) => {
            let path = req.path
            if (path === '/') {
                path = "/index.html"
            }
            if ((dd.path + path).indexOf('index.html') !== -1) {
                const seo = await dd.seoManager(req, resp)
                let fullPath = dd.path + "/index.html"
                const data = fs.readFileSync(fullPath, 'utf8');
                resp.header('Content-Type', 'text/html; charset=UTF-8')
                return resp.send(data.replace(data.substring(data.indexOf(`<head>`), data.indexOf(`</head>`)), seo))
            } else {
                return resp.sendFile(decodeURI((dd.path + path)))
            }
        })
    }
}

export async function set_backend_editor(envPath: string, serverPort: number = 3090): Promise<core.Express> {
    ConfigSetting.setConfig(envPath)
    await initial(serverPort);
    return app
}

export const api_public: {
    addPostObserver: (callback: (data: any,app: string) => void) => void
    db: typeof db,
    getAdConfig: (appName: string, key: string) => Promise<any>,
    lambda:typeof lambda
} = {
    get db() {
        return db
    },
    getAdConfig: (appName: string, key: string) => {
        return new Promise<any>(async (resolve, reject) => {
            const data = await db.query(`select \`value\`
                                         from \`${config.DB_NAME}\`.private_config
                                         where app_name = '${appName}'
                                           and \`key\` = ${db.escape(key)}`, [])
            resolve((data[0]) ? data[0]['value'] : {})
        })
    },
    addPostObserver: (callback: (data: any, app: string) => void) => {
        Post.addPostObserver(callback)
    },
    lambda:lambda
}




