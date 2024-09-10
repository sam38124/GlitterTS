import db from '../../modules/database';
import { IToken } from '../../models/Auth.js';
import exception from '../../modules/exception.js';
import { saasConfig } from '../../config';
import redis from '../../modules/redis.js';
import jwt from 'jsonwebtoken';
import config from '../../config.js';

type AppPermission = {
    userId: string;
    appName: string;
    iat?: number;
    exp?: number;
};

export class SharePermission {
    appName: string;
    token: IToken;

    constructor(appName: string, token: IToken) {
        this.appName = appName;
        this.token = token;
    }

    async getBaseData() {
        try {
            const appData = (
                await db.query(
                    `SELECT domain, brand FROM \`${saasConfig.SAAS_NAME}\`.app_config WHERE appName = ? AND user = ?;
                `,
                    [this.appName, this.token.userID]
                )
            )[0];

            return appData === undefined
                ? undefined
                : {
                      saas: saasConfig.SAAS_NAME, // glitter
                      brand: appData.brand, // shopnex
                      domain: appData.domain, // domain
                      app: this.appName, // app name
                  };
        } catch (e) {
            throw exception.BadRequestError('ERROR', 'getBaseData ERROR: ' + e, null);
        }
    }

    async getPermission(data: { email?: string }) {
        try {
            const base = await this.getBaseData();
            if (!base) return [];

            const querySQL = ['1=1'];

            if (data.email) {
                const userData = await db.query(
                    `SELECT userID FROM \`${base.brand}\`.t_user WHERE account in (${data.email
                        .split(',')
                        .map((email) => `"${email}"`)
                        .join(',')});
                    `,
                    []
                );
                if (userData.length === 0) return [];

                querySQL.push(`user in (${userData.map((user: { userID: number }) => user.userID).join(',')})`);
            }

            const authData = await db.query(
                `SELECT * FROM \`${saasConfig.SAAS_NAME}\`.app_auth_config
                    WHERE appName = ? AND ${querySQL.join(' AND ')};
                `,
                [base.app]
            );
            return authData;
        } catch (e) {
            throw exception.BadRequestError('ERROR', 'getPermission ERROR: ' + e, null);
        }
    }

    async setPermission(data: { email: string; config: any }) {
        try {
            const base = await this.getBaseData();
            if (!base) {
                return { result: false };
            }

            const userData = (
                await db.query(
                    `SELECT userID FROM \`${base.brand}\`.t_user WHERE account = ?;
                `,
                    [data.email]
                )
            )[0];
            if (userData === undefined) {
                return { result: false };
            }

            const authData = (
                await db.query(
                    `SELECT * FROM \`${saasConfig.SAAS_NAME}\`.app_auth_config WHERE user = ? AND appName = ?;
                `,
                    [userData.userID, base.app]
                )
            )[0];

            let redirect_url = undefined;
            if (authData) {
                await db.query(
                    `UPDATE \`${saasConfig.SAAS_NAME}\`.app_auth_config
                        SET ?
                        WHERE id = ?`,
                    [
                        {
                            config: JSON.stringify(data.config),
                            updated_time: new Date(),
                        },
                        authData.id,
                    ]
                );
            } else {
                await db.query(`INSERT INTO \`${saasConfig.SAAS_NAME}\`.app_auth_config SET ?`, [
                    {
                        user: userData.userID,
                        appName: base.app,
                        config: JSON.stringify(data.config),
                    },
                ]);
                const keyValue = await SharePermission.generateToken({
                    userId: userData.userID,
                    appName: base.app,
                });
                redirect_url = new URL(`https://${base.domain}/api-public/v1/user/permission/redirect`);
                redirect_url.searchParams.set('key', keyValue);
                redirect_url.searchParams.set('g-app', base.app);
            }

            return {
                result: true,
                ...base,
                ...data,
                redirect_url,
            };
        } catch (e) {
            throw exception.BadRequestError('ERROR', 'setPermission ERROR: ' + e, null);
        }
    }

    async deletePermission(email: string) {
        try {
            const base = await this.getBaseData();
            if (!base) {
                return { result: false };
            }

            const userData = (
                await db.query(
                    `SELECT userID FROM \`${base.brand}\`.t_user WHERE account = ?;
                `,
                    [email]
                )
            )[0];
            if (userData === undefined) {
                return { result: false };
            }

            await db.query(
                `DELETE FROM \`${saasConfig.SAAS_NAME}\`.app_auth_config WHERE user = ? AND appName = ?;
                `,
                [userData.userID, base.app]
            );

            return {
                result: true,
                ...base,
                email,
            };
        } catch (e) {
            throw exception.BadRequestError('ERROR', 'setPermission ERROR: ' + e, null);
        }
    }

    async toggleStatus(email: string) {
        try {
            const base = await this.getBaseData();

            if (!base) {
                return { result: false };
            }

            const userData = (
                await db.query(
                    `SELECT userID FROM \`${base.brand}\`.t_user WHERE account = ?;
                    `,
                    [email]
                )
            )[0];
            if (userData === undefined) {
                return { result: false };
            }

            const authData = (
                await db.query(
                    `SELECT * FROM \`${saasConfig.SAAS_NAME}\`.app_auth_config WHERE user = ? AND appName = ?;
                    `,
                    [userData.userID, base.app]
                )
            )[0];
            if (authData) {
                const bool = (authData.status - 1) * -1;
                await db.query(
                    `UPDATE \`${saasConfig.SAAS_NAME}\`.app_auth_config
                        SET ?
                        WHERE id = ?`,
                    [
                        {
                            status: bool,
                            updated_time: new Date(),
                        },
                        authData.id,
                    ]
                );
                return {
                    result: true,
                    ...base,
                    email: email,
                    status: bool,
                };
            }
            return { result: false };
        } catch (e) {
            throw exception.BadRequestError('ERROR', 'toggleStatus ERROR: ' + e, null);
        }
    }

    async triggerInvited(email: string) {
        try {
            const base = await this.getBaseData();
            if (!base) {
                return { result: false };
            }

            const userData = (
                await db.query(
                    `SELECT userID FROM \`${base.brand}\`.t_user WHERE account = ?;
                    `,
                    [email]
                )
            )[0];
            if (userData === undefined) {
                return { result: false };
            }

            const authData = (
                await db.query(
                    `SELECT * FROM \`${saasConfig.SAAS_NAME}\`.app_auth_config WHERE user = ? AND appName = ?;
                    `,
                    [userData.userID, base.app]
                )
            )[0];
            if (authData) {
                const bool = 1;
                await db.query(
                    `UPDATE \`${saasConfig.SAAS_NAME}\`.app_auth_config
                        SET ?
                        WHERE id = ?`,
                    [
                        {
                            invited: bool,
                            updated_time: new Date(),
                        },
                        authData.id,
                    ]
                );
                return {
                    result: true,
                    ...base,
                    email: email,
                    invited: bool,
                };
            }
            return { result: false };
        } catch (e) {
            throw exception.BadRequestError('ERROR', 'triggerInvited ERROR: ' + e, null);
        }
    }

    static async generateToken(userObj: AppPermission): Promise<string> {
        const iat = Math.floor(Date.now() / 1000);
        const expTime = 3 * 24 * 60 * 60; // 3 days
        const payload: AppPermission = {
            userId: userObj.userId,
            appName: userObj.appName,
            iat: iat,
            exp: iat + expTime,
        };
        const signedToken = jwt.sign(payload, config.SECRET_KEY);
        await redis.setValue(signedToken, String(iat));
        return signedToken;
    }

    static async redirectHTML(token: string) {
        const appPermission = jwt.verify(token, config.SECRET_KEY) as AppPermission;

        const authData = (
            await db.query(
                `SELECT * FROM \`${saasConfig.SAAS_NAME}\`.app_auth_config WHERE user = ? AND appName = ?;
                `,
                [appPermission.userId, appPermission.appName]
            )
        )[0];

        if (authData) {
            await db.query(
                `UPDATE \`${saasConfig.SAAS_NAME}\`.app_auth_config
                    SET ?
                    WHERE id = ?`,
                [
                    {
                        invited: 1,
                        updated_time: new Date(),
                    },
                    authData.id,
                ]
            );
        }

        const html = String.raw;
        return html`<!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <title>Title</title>
                </head>
                <body>
                    <script>
                        try {
                            window.webkit.messageHandlers.addJsInterFace.postMessage(
                                JSON.stringify({
                                    functionName: 'closeWebView',
                                    callBackId: 0,
                                    data: {
                                        redirect: 'https://shopnex.cc/login',
                                    },
                                })
                            );
                        } catch (e) {}
                        location.href = 'https://shopnex.cc/login';
                    </script>
                </body>
            </html> `;
    }
}
