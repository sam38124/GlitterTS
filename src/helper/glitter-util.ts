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
                    return resp.send(data.replace(data.substring(data.indexOf(`<head>`) + 6, data.indexOf(`</head>`)), seo))
                } else {
                    return resp.sendFile(decodeURI((dd.path + path)))
                }
            })
        }
    }

    public static async set_frontend_v2(express: core.Express, rout: { app_name: string, rout: string, path: string, root_path: string, seoManager: (req: express.Request, resp: express.Response) => Promise<string>, sitemap: (req: express.Request, resp: express.Response) => Promise<string> ,
        sitemap_list: (req: express.Request, resp: express.Response) => Promise<string>
        robots:(req: express.Request, resp: express.Response) => Promise<string>,
        tw_shop:(req: express.Request, resp: express.Response) => Promise<string>
    }[]) {
        for (const dd of rout) {
            express.use(dd.rout, async (req: express.Request, resp: express.Response, next) => {
                //判斷是檔案路徑則直接返回檔案
                const fileURL = (() => {
                    if (req.baseUrl.startsWith(dd.root_path)) {
                        return dd.path + '/' + req.baseUrl.replace(dd.root_path, '');
                    } else {
                        return dd.path + '/' + req.baseUrl.replace(`/${dd.app_name}/`, '')
                    }
                })()

                 if(req.baseUrl.replace(`/${dd.app_name}/`, '') === 'robots.txt'){
                    resp.set('Content-Type', 'plan/text');
                    return resp.send(await dd.robots(req, resp))
                }else  if(req.baseUrl.replace(`/${dd.app_name}/`, '') === 'twshop.xml'){
                     resp.set('Content-Type', 'plan/text');
                     return resp.send(await dd.tw_shop(req, resp))
                 }else if (req.baseUrl.replace(`/${dd.app_name}/`, '') === 'sitemap.xml') {
                    resp.set('Content-Type', 'application/xml');
                    return resp.send(await dd.sitemap(req, resp))
                } else if (req.baseUrl.replace(`/${dd.app_name}/`, '') === 'sitemap_detail.xml') {
                    resp.set('Content-Type', 'application/xml');
                    return resp.send(await dd.sitemap(req, resp))
                } else if (!fs.existsSync(fileURL)) {
                    if (req.baseUrl.startsWith(dd.root_path)) {
                        req.query.page = req.baseUrl.replace(dd.root_path, '');
                    }
                    const seo = await dd.seoManager(req, resp)
                    let fullPath = dd.path + "/index.html"
                    const data = fs.readFileSync(fullPath, 'utf8');
                    resp.header('Content-Type', 'text/html; charset=UTF-8')
                    return resp.send(data.replace(data.substring(data.indexOf(`<head>`), data.indexOf(`</head>`) + 7), `
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-touch-fullscreen" content="yes">
<meta http-equiv="content-type" content="text/html;charset=UTF-8">
${(req.query._preview_width && req.query._preview_scale) ? `
<meta name="viewport" content="width=${req.query._preview_width}, initial-scale=${req.query._preview_scale}, maximum-scale=${req.query._preview_scale}, user-scalable=no">
`:`
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no">
`}
${(req.body) ? `<script>window.post_body=${(typeof req.body==='string') ? req.body:`${JSON.stringify(req.body)}`};</script>`:``}
                    `+seo))
                } else {
                    return resp.sendFile(decodeURI(fileURL))
                }
            })
        }
    }

}