import express from "express";
import db from "../../modules/database.js";
import {saasConfig} from "../../config.js";

export class UtPermission{
    public static isManager(req: express.Request){
        return new Promise(async (resolve, reject)=>{
            try {
                resolve((await db.query(`SELECT count(1)
                             FROM ${saasConfig.SAAS_NAME}.app_config
                             where user = ?
                               and appName = ?`, [req.body.token.userID, req.get('g-app') as string]))[0]['count(1)'] == 1)
            }catch (e){
                resolve(false)
            }
        })
    }

    public static isAppUser(req: express.Request){
        return new Promise(async (resolve, reject)=>{
            resolve((await db.query(`SELECT count(1)
                             FROM \`${req.get('g-app')}\`.t_user
                             where userID = ?`, [req.body.token.userID]))[0]['count(1)'] == 1)
        })
    }
}