import db from '../../modules/database';
import { IToken } from '../../models/Auth.js';
import exception from '../../modules/exception.js';
import { saasConfig } from '../../config';
import redis from '../../modules/redis.js';
import jwt from 'jsonwebtoken';
import config from '../../config.js';
import { User } from './user';
import { sendmail } from '../../services/ses.js';

interface PermissionItem {
    id: number;
    user: string;
    appName: string;
    config: {
        auth: any;
        name: string;
        phone: string;
        title: string;
        verifyEmail?: string;
    };
    created_time: string;
    updated_time: string;
    status: number;
    invited: number;
    email: string;
    online_time: string;
}

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

    async getStoreAuth() {
        try {
            const appData = (
                await db.query(
                    `SELECT * FROM \`${saasConfig.SAAS_NAME}\`.app_auth_config WHERE appName = ? AND user = ?;
                `,
                    [this.appName, this.token.userID]
                )
            )[0];

            return appData;
        } catch (e) {
            throw exception.BadRequestError('ERROR', 'getBaseData ERROR: ' + e, null);
        }
    }

    async getPermission(json: { page: number; limit: number; email?: string; orderBy?: string; queryType?: string; query?: string; status?: string }) {
        try {
            const base = await this.getBaseData();
            if (!base) {
                const authConfig = await this.getStoreAuth();
                if (authConfig) {
                    return {
                        result: true,
                        store_permission_title: 'employee',
                        data: [authConfig],
                    };
                }
                return [];
            }

            const page = json.page ?? 0;
            const limit = json.limit ?? 20;
            const start = page * limit;
            const end = page * limit + limit;
            const querySQL = ['1=1'];

            if (json.email) {
                const selectEmails = await db.query(
                    `SELECT userID FROM \`${base.brand}\`.t_user WHERE account in (${json.email
                        .split(',')
                        .map((email) => `"${email}"`)
                        .join(',')});
                    `,
                    []
                );
                if (selectEmails.length === 0) return [];

                querySQL.push(`user in (${selectEmails.map((user: { userID: number }) => user.userID).join(',')})`);
            }

            const auths = await db.query(
                `SELECT * FROM \`${saasConfig.SAAS_NAME}\`.app_auth_config
                    WHERE appName = ? AND ${querySQL.join(' AND ')};
                `,
                [base.app]
            );

            if (auths.length === 0) {
                return {
                    data: [],
                    total: 0,
                    store_permission_title: 'owner',
                };
            }

            const users = await db.query(
                `SELECT * FROM \`${base.brand}\`.t_user WHERE userID in (${auths
                    .map((item: { user: string }) => {
                        return item.user;
                    })
                    .join(',')});
                `,
                []
            );

            let authDataList: PermissionItem[] = auths.map((item: any) => {
                const data = users.find((u: any) => u.userID == item.user);
                if (data) {
                    item.email = data.account;
                    item.online_time = data.online_time;
                }
                return item;
            });

            function statusFilter(data: PermissionItem[], query: 'yes' | 'no'): PermissionItem[] {
                return data.filter((item) => {
                    if (query === 'yes') {
                        return item.status === 1;
                    }
                    if (query === 'no') {
                        return item.status === 0;
                    }
                    return true;
                });
            }

            if (json.status === 'yes' || json.status === 'no') {
                authDataList = statusFilter(authDataList, json.status);
            }

            function searchFilter(data: PermissionItem[], field: string, query: string): PermissionItem[] {
                return data.filter((item) => {
                    if (field === 'name') {
                        return item.config.name.toLowerCase().includes(query.toLowerCase());
                    }
                    if (field === 'email') {
                        return item.email.toLowerCase().includes(query.toLowerCase());
                    }
                    if (field === 'phone') {
                        return item.config.phone.includes(query);
                    }
                    return true;
                });
            }

            if (json.queryType && json.query) {
                authDataList = searchFilter(authDataList, json.queryType, json.query);
            }

            function sortByName(data: PermissionItem[]): void {
                data.sort((a: any, b: any) => a.config.name.localeCompare(b.config.name));
            }

            function sortByOnlineTime(data: PermissionItem[], order: 'asc' | 'desc'): void {
                data.sort((a, b) => {
                    if (order === 'asc') {
                        return new Date(a.online_time).getTime() - new Date(b.online_time).getTime();
                    } else if (order === 'desc') {
                        return new Date(b.online_time).getTime() - new Date(a.online_time).getTime();
                    }
                    return 0;
                });
            }

            switch (json.orderBy) {
                case 'name':
                    sortByName(authDataList);
                    break;
                case 'online_time_asc':
                    sortByOnlineTime(authDataList, 'asc');
                    break;
                case 'online_time_desc':
                    sortByOnlineTime(authDataList, 'desc');
                    break;
                default:
                    break;
            }

            return {
                data: authDataList.slice(start, end),
                total: authDataList.length,
                store_permission_title: 'owner',
            };
        } catch (e) {
            throw exception.BadRequestError('ERROR', 'getPermission ERROR: ' + e, null);
        }
    }

    async setPermission(data: { email: string; config: any; status?: number }) {
        try {
            const base = await this.getBaseData();
            if (!base) {
                return { result: false };
            }

            let userData = (
                await db.query(
                    `SELECT userID FROM \`${base.brand}\`.t_user WHERE account = ?;
                `,
                    [data.email]
                )
            )[0];
            if (userData === undefined) {
                const findAuth = (
                    await db.query(
                        `SELECT * FROM \`${saasConfig.SAAS_NAME}\`.app_auth_config 
                        WHERE JSON_EXTRACT(config, '$.verifyEmail') = ?;
                        `,
                        [data.email]
                    )
                )[0];
                if (findAuth) {
                    userData = { userID: findAuth.user };
                } else {
                    userData = { userID: User.generateUserID() };
                    data.config.verifyEmail = data.email;
                }
            }
            if (userData.userID === this.token.userID) {
                return { result: false };
            }

            const authData = (
                await db.query(
                    `SELECT * FROM \`${saasConfig.SAAS_NAME}\`.app_auth_config WHERE user = ? AND appName = ?;
                `,
                    [userData.userID, base.app]
                )
            )[0];

            let redirect_url: any = undefined;
            if (authData) {
                await db.query(
                    `UPDATE \`${saasConfig.SAAS_NAME}\`.app_auth_config
                        SET ?
                        WHERE id = ?`,
                    [
                        {
                            config: JSON.stringify(data.config),
                            updated_time: new Date(),
                            status: data.status === 1 ? 1 : 0,
                        },
                        authData.id,
                    ]
                );
            } else {
                const storeData = (
                    await db.query(
                        `SELECT * FROM \`${base.app}\`.t_user_public_config WHERE \`key\` = 'store-information' AND user_id = 'manager';
                        `,
                        []
                    )
                )[0];
                if (!storeData || !storeData.value.shop_name) {
                    return { result: false, message: '請先至「商店訊息」<br />新增你的商店名稱' };
                }

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
                redirect_url = new URL(`${process.env.DOMAIN}/api-public/v1/user/permission/redirect`);
                redirect_url.searchParams.set('key', keyValue);
                redirect_url.searchParams.set('g-app', base.app);

                await sendmail('service@ncdesign.info', data.email, '商店權限分享邀請信', `「${storeData.value.shop_name}」邀請你加入他的商店，點擊此連結即可開啟權限：${redirect_url}`);
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
