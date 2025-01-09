import express from 'express';
import db from '../../modules/database.js';
import { saasConfig } from '../../config.js';
import {IToken} from "../models/Auth.js";

export class UtPermission {
    public static isManager(req: express.Request) {
        return new Promise(async (resolve, reject) => {
            try {
                const appName = (req.get('g-app') as string) || req.query.appName || req.body.appName;
                console.log(`SELECT count(1) 
                    FROM ${saasConfig.SAAS_NAME}.app_config
                    WHERE 
                        (user = ${req.body.token.userID} and appName = ${db.escape(appName)})
                        OR appName in (
                            (SELECT appName FROM \`${saasConfig.SAAS_NAME}\`.app_auth_config
                            WHERE user = ${req.body.token.userID} AND status = 1 AND invited = 1 AND appName = ${db.escape(appName)})
                        );
                   `)
                const result = await db.query(
                    `SELECT count(1) 
                    FROM ${saasConfig.SAAS_NAME}.app_config
                    WHERE 
                        (user = ? and appName = ?)
                        OR appName in (
                            (SELECT appName FROM \`${saasConfig.SAAS_NAME}\`.app_auth_config
                            WHERE user = ? AND status = 1 AND invited = 1 AND appName = ?)
                        );
                    `,
                    [req.body.token.userID, appName, req.body.token.userID, appName]
                );
                resolve(result[0]['count(1)'] > 0);
            } catch (e) {
                resolve(false);
            }
        });
    }
    public static isManagerTokenCheck(app_name:string,user_id:string) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await db.query(
                    `SELECT count(1) 
                    FROM ${saasConfig.SAAS_NAME}.app_config
                    WHERE 
                        (user = ? and appName = ?)
                        OR appName in (
                            (SELECT appName FROM \`${saasConfig.SAAS_NAME}\`.app_auth_config
                            WHERE user = ? AND status = 1 AND invited = 1 AND appName = ?)
                        );
                    `,
                    [user_id, app_name, user_id, app_name]
                );
                resolve(result[0]['count(1)'] == 1);
            } catch (e) {
                resolve(false);
            }
        });
    }

    public static isAppUser(req: express.Request) {
        return new Promise(async (resolve, reject) => {
            try {
                resolve(
                    (
                        await db.query(
                            `SELECT count(1)
                             FROM \`${req.get('g-app')}\`.t_user
                             where userID = ?`,
                            [req.body.token.userID]
                        )
                    )[0]['count(1)'] == 1
                );
            } catch (e) {
                resolve(false);
            }
        });
    }
}
