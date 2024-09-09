import db from '../../modules/database';
import { IToken } from '../../models/Auth.js';
import exception from '../../modules/exception.js';
import { saasConfig } from '../../config';

export class SharePermission {
    public appName: string;
    public token: IToken;

    constructor(appName: string, token: IToken) {
        this.appName = appName;
        this.token = token;
    }

    public async getBaseData() {
        try {
            const appData = (
                await db.query(
                    `SELECT brand FROM \`${saasConfig.SAAS_NAME}\`.app_config WHERE appName = ? AND user = ?;
                `,
                    [this.appName, this.token.userID]
                )
            )[0];

            return appData === undefined
                ? undefined
                : {
                      saas: saasConfig.SAAS_NAME, // glitter
                      brand: appData.brand, // shopnex
                      app: this.appName, // app name
                  };
        } catch (e) {
            throw exception.BadRequestError('ERROR', 'getBaseData ERROR: ' + e, null);
        }
    }

    public async getPermission(data: { email?: string }) {
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

    public async setPermission(data: { email: string; config: any }) {
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
            }

            return {
                result: true,
                ...base,
                ...data,
            };
        } catch (e) {
            throw exception.BadRequestError('ERROR', 'setPermission ERROR: ' + e, null);
        }
    }

    public async deletePermission(email: string) {
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

    public async toggleStatus(email: string) {
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

    public async triggerInvited(email: string) {
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
}
