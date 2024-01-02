import * as core from "express-serve-static-core";
import fs from "fs";
import express from 'express';

export class GlitterUtil {
    public static async set_frontend(express: core.Express, rout: { rout: string, path: string, seoManager: (req: express.Request, resp: express.Response) => Promise<string> }[]) {
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

}