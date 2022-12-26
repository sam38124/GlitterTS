import * as core from "express-serve-static-core";
import express from 'express';
import * as fs from "fs";
export function setUP(express: core.Express, rout: { rout: string, path: string }[]){
    rout.map((dd) =>
        express.use(dd.rout,  (req: express.Request, resp: express.Response) => {
            if ((dd.path + req.path).indexOf('index.html') !== -1) {
                let fullPath = dd.path + req.path
                const data = fs.readFileSync(fullPath, 'utf8');
                const seoPath = fs.readFileSync(fullPath.substring(0, fullPath.indexOf('/index.html')) + '/SEOManager.js'
                    , 'utf8');
                const headerString = eval(`${(seoPath)}(header["${req.query["page"]}"] ?? header["default"])();`)
                resp.header('Content-Type', 'text/html; charset=UTF-8')
                return resp.send(data.replace('<%HEAD%>', headerString))
            } else {
                return resp.sendFile((dd.path + req.path.replace(/%20/g," ")))
            }

        })
    )
}