import * as core from "express-serve-static-core";
import express from 'express';
import * as fs from "fs";
export function setUP(express: core.Express, rout: { rout: string, path: string ,seoManager:(map:any)=>string}[]){
    rout.map((dd) =>
        express.use(dd.rout,  (req: express.Request, resp: express.Response) => {
            if ((dd.path + req.path).indexOf('index.html') !== -1) {
                let fullPath = dd.path + req.path
                const data = fs.readFileSync(fullPath, 'utf8');
                resp.header('Content-Type', 'text/html; charset=UTF-8')
                return resp.send(data.replace('<%HEAD%>',dd.seoManager((()=>{
                    try {
                        let sPageURL = req.path.substring(req.path.indexOf('?')+1),
                            sURLVariables = sPageURL.split('&'),
                            sParameterName,
                            i;
                        let mapData:any={}
                        for (i = 0; i < sURLVariables.length; i++) {
                            sParameterName = sURLVariables[i].split('=');
                            mapData[sParameterName[0]]=sParameterName[1]
                        }
                        return mapData;
                    }catch (e){
                        return {}
                    }
                })())))
            } else {
                return resp.sendFile(decodeURI((dd.path + req.path)))
            }
        })
    )
}