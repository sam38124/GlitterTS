import db from '../../modules/database';
import exception from '../../modules/exception';
import tool, { getUUID } from '../../services/tool';
import UserUtil from '../../utils/UserUtil';
import config from '../../config.js';
import { sendmail } from '../../services/ses.js';
import App from '../../app.js';
import redis from '../../modules/redis.js';
import Tool from '../../modules/tool.js';
import process from 'process';
import { UtDatabase } from '../utils/ut-database.js';
import { CustomCode } from './custom-code.js';
import { IToken } from '../models/Auth.js';
import axios from 'axios';
import { AutoSendEmail } from './auto-send-email.js';
import qs from 'qs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

interface UserQuery {
    page?: number;
    limit?: number;
    id?: string;
    search?: string;
    searchType?: string;
    order_string?: string;
    created_time?: string;
    birth?: string;
    rank?: string;
    rebate?: string;
    total_amount?: string;
}

export class User {
    public app: string;

    public token?: IToken;

    public async createUser(account: string, pwd: string, userData: any, req: any) {
        try {
            const login_config = await this.getConfigV2({
                key: 'login_config',
                user_id: 'manager',
            });
            const userID = generateUserID();
            if (userData.verify_code) {
                if (userData.verify_code !== (await redis.getValue(`verify-${account}`))) {
                    throw exception.BadRequestError('BAD_REQUEST', 'Verify code error.', null);
                }
            } else if (login_config.email_verify) {
                await db.execute(
                    `delete
                                  from \`${this.app}\`.\`t_user\`
                                  where account = ${db.escape(account)}
                                    and status = 0`,
                    []
                );
                const data = await AutoSendEmail.getDefCompare(this.app, 'auto-email-verify');
                const code = Tool.randomNumber(6);
                await redis.setValue(`verify-${account}`, code);
                data.content = data.content.replace(`@{{code}}`, code);
                sendmail(`${data.name} <${process.env.smtp}>`, account, data.title, data.content);
                return {
                    verify: 'mail',
                };
            }
            const data = await AutoSendEmail.getDefCompare(this.app, 'auto-email-welcome');
            if (data.toggle) {
                sendmail(`${data.name} <${process.env.smtp}>`, account, data.title, data.content);
            }

            await db.execute(
                `INSERT INTO \`${this.app}\`.\`t_user\` (\`userID\`, \`account\`, \`pwd\`, \`userData\`, \`status\`)
                              VALUES (?, ?, ?, ?, ?);`,
                [userID, account, await tool.hashPwd(pwd), userData ?? {}, 1]
            );

            const usData: any = await this.getUserData(userID, 'userID');
            usData.pwd = undefined;
            usData.token = await UserUtil.generateToken({
                user_id: usData['userID'],
                account: usData['account'],
                userData: {},
            });
            return usData;
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'Register Error:' + e, null);
        }
    }

    public async updateAccount(account: string, userID: string): Promise<any> {
        try {
            const configAd = await App.getAdConfig(this.app, 'glitter_loginConfig');
            switch (configAd.verify) {
                case 'mail':
                    const checkToken = getUUID();
                    const url = `<h1>${configAd.name}</h1><p>
<a href="${config.domain}/api-public/v1/user/checkMail/updateAccount?g-app=${this.app}&token=${checkToken}">點我前往認證您的信箱</a>
</p>`;
                    await sendmail(`service@ncdesign.info`, account, `信箱認證`, url);
                    return {
                        type: 'mail',
                        mailVerify: checkToken,
                        updateAccount: account,
                    };
                default:
                    return {
                        type: '',
                    };
            }
        } catch (e) {
            console.error(e);
            throw exception.BadRequestError('BAD_REQUEST', 'SendMail Error:' + e, null);
        }
    }

    public async login(account: string, pwd: string) {
        try {
            const data: any = (
                (await db.execute(
                    `select *
                                                 from \`${this.app}\`.t_user
                                                 where account = ?
                                                   and status = 1`,
                    [account]
                )) as any
            )[0];
            if (await tool.compareHash(pwd, data.pwd)) {
                data.pwd = undefined;
                data.token = await UserUtil.generateToken({
                    user_id: data['userID'],
                    account: data['account'],
                    userData: {},
                });
                return data;
            } else {
                throw exception.BadRequestError('BAD_REQUEST', 'Auth failed', null);
            }
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'Login Error:' + e, null);
        }
    }

    public async loginWithFb(token: string) {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://graph.facebook.com/v19.0/me?access_token=${token}&__cppo=1&debug=all&fields=id%2Cname%2Cemail&format=json&method=get&origin_graph_explorer=1&pretty=0&suppress_http_code=1&transport=cors`,
            headers: {
                Cookie: 'sb=UysEY1hZJvSZxgxk_g316pK-',
            },
        };
        const fbResponse: any = await new Promise((resolve, reject) => {
            axios
                .request(config)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    throw exception.BadRequestError('BAD_REQUEST', 'Login Error:' + error, null);
                });
        });
        if (
            (
                await db.query(
                    `select count(1)
                             from \`${this.app}\`.t_user
                             where account = ?`,
                    [fbResponse.email]
                )
            )[0]['count(1)'] == 0
        ) {
            const userID = generateUserID();
            await db.execute(
                `INSERT INTO \`${this.app}\`.\`t_user\` (\`userID\`, \`account\`, \`pwd\`, \`userData\`, \`status\`)
                              VALUES (?, ?, ?, ?, ?);`,
                [
                    userID,
                    fbResponse.email,
                    await tool.hashPwd(generateUserID()),
                    {
                        name: fbResponse.name,
                        fb_id: fbResponse.id,
                        email: fbResponse.email,
                    },
                    1,
                ]
            );
        }
        const data: any = (
            (await db.execute(
                `select *
                                             from \`${this.app}\`.t_user
                                             where account = ?
                                               and status = 1`,
                [fbResponse.email]
            )) as any
        )[0];
        const usData: any = await this.getUserData(data.userID, 'userID');
        usData.pwd = undefined;
        usData.token = await UserUtil.generateToken({
            user_id: usData['userID'],
            account: usData['account'],
            userData: {},
        });
        return usData;
    }

    public async loginWithLine(code: string, redirect: string) {
        try {
            const lineData = await this.getConfigV2({
                key: 'login_line_setting',
                user_id: 'manager',
            });
            const lineResponse: any = await new Promise((resolve, reject) => {
                axios
                    .request({
                        method: 'post',
                        maxBodyLength: Infinity,
                        url: 'https://api.line.me/oauth2/v2.1/token',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        data: qs.stringify({
                            code: code,
                            client_id: lineData.id,
                            client_secret: lineData.secret,
                            grant_type: 'authorization_code',
                            redirect_uri: redirect,
                        }),
                    })
                    .then((response) => {
                        resolve(response.data);
                    })
                    .catch((error) => {
                        resolve(false);
                    });
            });
            if (!lineResponse) {
                throw exception.BadRequestError('BAD_REQUEST', 'Line Register Error', null);
            }
            const userData = jwt.decode(lineResponse.id_token);
            if (
                (
                    await db.query(
                        `select count(1)
                             from \`${this.app}\`.t_user
                             where userData->>'$.lineID'=?`,
                        [(userData as any).sub]
                    )
                )[0]['count(1)'] == 0
            ) {
                const userID = generateUserID();
                await db.execute(
                    `INSERT INTO \`${this.app}\`.\`t_user\` (\`userID\`, \`account\`, \`pwd\`, \`userData\`, \`status\`)
                              VALUES (?, ?, ?, ?, ?);`,
                    [
                        userID,
                        (userData as any).sub,
                        await tool.hashPwd(generateUserID()),
                        {
                            name: (userData as any).name || '未命名',
                            lineID: (userData as any).sub,
                        },
                        1,
                    ]
                );
            }
            const data: any = (
                (await db.execute(
                    `select *
                                             from \`${this.app}\`.t_user
                                             where userData->>'$.lineID'=?`,
                    [(userData as any).sub]
                )) as any
            )[0];
            const usData: any = await this.getUserData(data.userID, 'userID');
            usData.pwd = undefined;
            usData.token = await UserUtil.generateToken({
                user_id: usData['userID'],
                account: usData['account'],
                userData: {},
            });
            return usData;
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', e as any, null);
        }
    }

    public async loginWithGoogle(code: string, redirect: string) {
        try {
            const config = await this.getConfigV2({
                key: 'login_google_setting',
                user_id: 'manager',
            });
            const oauth2Client = new OAuth2Client(config.id, config.secret, redirect);
            // 使用授权码交换令牌
            const { tokens } = await oauth2Client.getToken(code);
            oauth2Client.setCredentials(tokens);

            // 验证 ID 令牌
            const ticket = await oauth2Client.verifyIdToken({
                idToken: tokens.id_token as any,
                audience: config.id,
            });

            const payload = ticket.getPayload();
            if (
                (
                    await db.query(
                        `select count(1)
                             from \`${this.app}\`.t_user
                             where account = ?`,
                        [payload?.email]
                    )
                )[0]['count(1)'] == 0
            ) {
                const userID = generateUserID();
                await db.execute(
                    `INSERT INTO \`${this.app}\`.\`t_user\` (\`userID\`, \`account\`, \`pwd\`, \`userData\`, \`status\`)
                              VALUES (?, ?, ?, ?, ?);`,
                    [
                        userID,
                        payload?.email,
                        await tool.hashPwd(generateUserID()),
                        {
                            name: payload?.given_name,
                            email: payload?.email,
                        },
                        1,
                    ]
                );
            }
            const data: any = (
                (await db.execute(
                    `select *
                                             from \`${this.app}\`.t_user
                                             where account = ?
                                               and status = 1`,
                    [payload?.email]
                )) as any
            )[0];
            const usData: any = await this.getUserData(data.userID, 'userID');
            usData.pwd = undefined;
            usData.token = await UserUtil.generateToken({
                user_id: usData['userID'],
                account: usData['account'],
                userData: {},
            });
            return usData;
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', e as any, null);
        }
    }

    public async getUserData(query: string, type: 'userID' | 'account' = 'userID') {
        try {
            const sql = `select *
                         from \`${this.app}\`.t_user
                         where ${(() => {
                             let query2 = [`1=1`];
                             if (type === 'userID') {
                                 query2.push(`userID=${db.escape(query)}`);
                             } else {
                                 query2.push(`account=${db.escape(query)}`);
                             }
                             return query2.join(` and `);
                         })()}`;
            const data: any = ((await db.execute(sql, [])) as any)[0];
            let cf = {
                userData: data,
            };
            await new CustomCode(this.app).loginHook(cf);
            if (data) {
                data.pwd = undefined;
                data.member = await this.refreshMember(data);
                // await this.checkRebate(data.userID);
            }
            return data;
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'GET USER DATA Error:' + e, null);
        }
    }


    public async refreshMember(userData: any) {
        //分級配置檔案
        const member_list =
            (
                await this.getConfigV2({
                    key: 'member_level_config',
                    user_id: 'manager',
                })
            ).levels || [];
        //用戶訂單
        const order_list = (
            await db.query(
                `SELECT orderData ->> '$.total' as total, created_time
                                            FROM \`${this.app}\`.t_checkout
                                            where email = ${db.escape(userData.account)}
                                              and status = 1
                                            order by id desc`,
                []
            )
        ).map((dd: any) => {
            return { total_amount: dd.total, date: dd.created_time };
        });
        //會員等級取得
        const member = member_list.reverse().map(
            (dd: {
                id: string;
                tag_name: string;
                condition: {
                    type: 'total' | 'single';
                    value: string;
                };
                duration: {
                    type: 'noLimit' | 'day';
                    value: number;
                };
                dead_line: {
                    type: 'noLimit' | 'date';
                    value: number;
                };
            }) => {
                if (dd.condition.type === 'single') {
                    const time = order_list.find((d1: any) => {
                        return d1.total_amount >= parseInt(dd.condition.value, 10);
                    });
                    if (time) {
                        let dead_line = new Date(time.created_time);
                        if (dd.dead_line.type === 'noLimit') {
                            dead_line.setDate(dead_line.getDate() + 365 * 10);
                            return {
                                id: dd.id,
                                trigger: true,
                                tag_name: dd.tag_name,
                                dead_line: dead_line,
                                og: dd,
                            };
                        } else {
                            dead_line.setDate(dead_line.getDate() + dd.dead_line.value);
                            return {
                                id: dd.id,
                                trigger: true,
                                tag_name: dd.tag_name,
                                dead_line: dead_line,
                                og: dd,
                            };
                        }
                    } else {
                        let leak = parseInt(dd.condition.value, 10);
                        return {
                            id: dd.id,
                            tag_name: dd.tag_name,
                            dead_line: '',
                            trigger: leak === 0,
                            og: dd,
                            leak: leak,
                        };
                    }
                } else {
                    const date = this.find30DayPeriodWith3000Spent(order_list, parseInt(dd.condition.value, 10), dd.duration.type === 'noLimit' ? 365 * 10 : dd.duration.value, 365 * 10);
                    if (date) {
                        const latest = new Date(date.end_date);
                        if (dd.dead_line.type === 'noLimit') {
                            latest.setDate(latest.getDate() + 365 * 10);
                            return {
                                id: dd.id,
                                trigger: true,
                                tag_name: dd.tag_name,
                                dead_line: latest,
                                og: dd,
                            };
                        } else {
                            latest.setDate(latest.getDate() + dd.dead_line.value);
                            return {
                                id: dd.id,
                                trigger: true,
                                tag_name: dd.tag_name,
                                dead_line: latest,
                                og: dd,
                            };
                        }
                    } else {
                        let leak = parseInt(dd.condition.value, 10);
                        let sum = 0;
                        const compareDate = new Date();
                        compareDate.setDate(compareDate.getDate() - (dd.duration.type === 'noLimit' ? 365 * 10 : dd.duration.value));
                        order_list.map((dd: any) => {
                            if (new Date().getTime() > compareDate.getTime()) {
                                leak = leak - dd.total_amount;
                                sum += dd.total_amount;
                            }
                        });

                        return {
                            id: dd.id,
                            tag_name: dd.tag_name,
                            dead_line: '',
                            trigger: leak === 0,
                            leak: leak,
                            sum: sum,
                            og: dd,
                        };
                    }
                }
            }
        );
        return member;
    }

    public find30DayPeriodWith3000Spent(
        transactions: {
            total_amount: number;
            date: string;
        }[],
        total: number,
        duration: number,
        dead_line: number
    ) {
        const ONE_YEAR_MS = dead_line * 24 * 60 * 60 * 1000;
        const THIRTY_DAYS_MS = duration * 24 * 60 * 60 * 1000;
        const NOW = new Date().getTime();
        // 過濾出過去一年內的交易
        const recentTransactions = transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.date);
            return NOW - transactionDate.getTime() <= ONE_YEAR_MS;
        });

        // 將交易按照日期排序
        recentTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // 滑動窗口檢查是否存在連續30天內消費達3000元
        for (let i = 0; i < recentTransactions.length; i++) {
            let sum = 0;
            for (let j = i; j < recentTransactions.length; j++) {
                const dateI = new Date(recentTransactions[i].date);
                const dateJ = new Date(recentTransactions[j].date);

                // 檢查日期差是否在30天以內
                if (dateI.getTime() - dateJ.getTime() <= THIRTY_DAYS_MS) {
                    sum += recentTransactions[j].total_amount;
                    if (sum >= total) {
                        return {
                            start_date: recentTransactions[j].date,
                            end_date: recentTransactions[i].date,
                        };
                    }
                } else {
                    break;
                }
            }
        }

        return null;
    }

    getUserAndOrderSQL(obj: { select: string; where: string[]; orderBy: string; page?: number; limit?: number }) {
        const sql = `
            SELECT ${obj.select}
            FROM 
                (SELECT 
                    email, 
                    COUNT(*) AS order_count, 
                    SUM(CAST(JSON_EXTRACT(orderData, '$.total') AS DECIMAL(10, 2))) AS total_amount
                FROM 
                    \`${this.app}\`.t_checkout
                WHERE status = 1
                GROUP BY email) as o
            RIGHT JOIN 
                \`${this.app}\`.t_user u ON o.email = u.account
            WHERE
                (${obj.where.filter((str) => str.length > 0).join(' AND ')})
            ORDER BY ${(() => {
                switch (obj.orderBy) {
                    case 'order_total_desc':
                        return 'o.total_amount DESC';
                    case 'order_total_asc':
                        return 'o.total_amount';
                    case 'order_count_desc':
                        return 'o.order_count DESC';
                    case 'order_count_asc':
                        return 'o.order_count';
                    case 'name':
                        return 'JSON_EXTRACT(u.userData, "$.name")';
                    case 'created_time_desc':
                        return 'u.created_time DESC';
                    case 'created_time_asc':
                        return 'u.created_time';
                    default:
                        return 'u.id DESC';
                }
            })()} 
            ${obj.page !== undefined && obj.limit !== undefined ? `LIMIT ${obj.page * obj.limit}, ${obj.limit}` : ''};
        `;
        // console.log(sql);
        return sql;
    }

    public async getUserList(query: UserQuery) {
        try {
            const querySql: string[] = ['1=1'];
            query.page = query.page ?? 0;
            query.limit = query.limit ?? 50;

            if (query.created_time) {
                const created_time = query.created_time.split(',');
                if (created_time.length > 1) {
                    querySql.push(`
                        (u.created_time BETWEEN ${db.escape(`${created_time[0]} 00:00:00`)} 
                        AND ${db.escape(`${created_time[1]} 23:59:59`)})
                    `);
                }
            }

            if (query.birth && query.birth.length > 0) {
                const birth = query.birth.split(',');
                const birthMap = birth.map((month) => parseInt(`${month}`, 10));
                if (birthMap.every((n) => typeof n === 'number' && !isNaN(n))) {
                    querySql.push(`(MONTH(JSON_EXTRACT(u.userData, '$.birth')) IN (${birthMap.join(',')}))`);
                }
            }

            // if (query.rank && query.rank.length > 0) {
            // }

            // if (query.rebate && query.rebate.length > 0) {
            // }

            if (query.total_amount) {
                const totalAmount = query.total_amount.split(',');
                if (totalAmount.length > 1) {
                    if (totalAmount[0] === 'lessThan') {
                        querySql.push(`(o.total_amount < ${totalAmount[1]} OR o.total_amount is null)`);
                    }
                    if (totalAmount[0] === 'moreThan') {
                        querySql.push(`(o.total_amount > ${totalAmount[1]})`);
                    }
                }
            }

            if (query.search) {
                querySql.push(
                    [
                        `(UPPER(JSON_UNQUOTE(JSON_EXTRACT(u.userData, '$.name')) LIKE UPPER('%${query.search}%')))`,
                        `(JSON_UNQUOTE(JSON_EXTRACT(u.userData, '$.email')) LIKE '%${query.search}%')`,
                        `(UPPER(JSON_UNQUOTE(JSON_EXTRACT(u.userData, '$.phone')) LIKE UPPER('%${query.search}%')))`,
                    ]
                        .filter((text) => {
                            if (query.searchType === undefined) return true;
                            if (text.includes(`$.${query.searchType}`)) return true;
                            return false;
                        })
                        .join(` || `)
                );
            }

            const dataSQL = this.getUserAndOrderSQL({
                select: 'o.email, o.order_count, o.total_amount, u.*',
                where: querySql,
                orderBy: query.order_string ?? '',
                page: query.page,
                limit: query.limit,
            });
            const countSQL = this.getUserAndOrderSQL({
                select: 'count(1)',
                where: querySql,
                orderBy: query.order_string ?? '',
            });
            return {
                data: (await db.query(dataSQL, [])).map((dd: any) => {
                    dd.pwd = undefined;
                    return dd;
                }),
                total: (await db.query(countSQL, []))[0]['count(1)'],
            };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'Login Error:' + e, null);
        }
    }

    public async subscribe(email: string, tag: string) {
        try {
            await db.queryLambada(
                {
                    database: this.app,
                },
                async (sql) => {
                    await sql.query(
                        `replace
                into t_subscribe (email,tag) values (?,?)`,
                        [email, tag]
                    );
                }
            );
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'Subscribe Error:' + e, null);
        }
    }

    public async registerFcm(userID: string, deviceToken: string) {
        try {
            await db.queryLambada(
                {
                    database: this.app,
                },
                async (sql) => {
                    await sql.query(
                        `replace
                into t_fcm (userID,deviceToken) values (?,?)`,
                        [userID, deviceToken]
                    );
                }
            );
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'RegisterFcm Error:' + e, null);
        }
    }

    public async deleteSubscribe(email: string) {
        try {
            await db.query(
                `delete
                            FROM \`${this.app}\`.t_subscribe
                            where email in (?)`,
                [email.split(',')]
            );
            return {
                result: true,
            };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'Delete Subscribe Error:' + e, null);
        }
    }

    public async getSubScribe(query: any) {
        try {
            query.page = query.page ?? 0;
            query.limit = query.limit ?? 50;
            const querySql: any = [];
            query.search && querySql.push([`(email LIKE '%${query.search}%') && (tag != ${db.escape(query.search)})`, `(tag = ${db.escape(query.search)})`].join(` || `));
            const data = await new UtDatabase(this.app, `t_subscribe`).querySql(querySql, query as any);
            data.data.map((dd: any) => {
                dd.pwd = undefined;
            });
            return data;
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'Login Error:' + e, null);
        }
    }

    public async getFCM(query: any) {
        try {
            query.page = query.page ?? 0;
            query.limit = query.limit ?? 50;
            const querySql: any = [];
            //'%${query.search}%'
            query.search &&
                querySql.push([`(userID in (select userID from \`${this.app}\`.t_user where (UPPER(JSON_UNQUOTE(JSON_EXTRACT(userData, '$.name')) LIKE UPPER('%${query.search}%')))))`].join(` || `));
            const data = await new UtDatabase(this.app, `t_fcm`).querySql(querySql, query as any);
            for (const b of data.data) {
                let userData = (
                    await db.query(
                        `select userData
                                                from \`${this.app}\`.t_user
                                                where userID = ?`,
                        [b.userID]
                    )
                )[0];
                b.userData = userData && userData.userData;
            }
            return data;
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'Login Error:' + e, null);
        }
    }

    public async deleteUser(query: { id: string }) {
        try {
            await db.query(
                `delete
                            FROM \`${this.app}\`.t_user
                            where id in (?)`,
                [query.id.split(',')]
            );
            return {
                result: true,
            };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'Delete User Error:' + e, null);
        }
    }

    public async updateUserData(userID: string, par: any, manager: boolean = false) {
        try {
            const userData = (
                await db.query(
                    `select *
                                              from \`${this.app}\`.\`t_user\`
                                              where userID = ${db.escape(userID)}`,
                    []
                )
            )[0];
            const configAd = await App.getAdConfig(this.app, 'glitter_loginConfig');
            //信箱更新

            if (
                !manager &&
                par.userData.email &&
                par.userData.email !== userData.account &&
                (!par.userData.verify_code || par.userData.verify_code !== (await redis.getValue(`verify-${par.userData.email}`)))
            ) {
                if (!par.userData.verify_code) {
                    const code = Tool.randomNumber(6);
                    await redis.setValue(`verify-${par.userData.email}`, code);
                    sendmail(`${configAd.name} <${process.env.smtp}>`, par.userData.email, '信箱驗證', `請輸入驗證碼「 ${code} 」。並於1分鐘內輸入並完成驗證。`);
                    return {
                        data: 'emailVerify',
                    };
                } else {
                    throw exception.BadRequestError('AUTH_ERROR', 'Check email error.', null);
                }
            } else if (par.userData.email) {
                await db.query(
                    `update \`${this.app}\`.t_checkout
                                set email=?
                                where id > 0
                                  and email = ?`,
                    [par.userData.email, userData.account]
                );
                userData.account = par.userData.email;
            }
            par.userData = await this.checkUpdate({
                updateUserData: par.userData,
                userID: userID,
                manager: manager,
            });
            delete par.userData.verify_code;
            par = {
                account: userData.account,
                userData: JSON.stringify(par.userData),
            };
            if (!par.account) {
                delete par.account;
            }
            return {
                data: (await db.query(
                    `update \`${this.app}\`.t_user
                                       SET ?
                                       WHERE 1 = 1
                                         and userID = ?`,
                    [par, userID]
                )) as any,
            };
        } catch (e) {
            throw exception.BadRequestError((e as any).code || 'BAD_REQUEST', (e as any).message, null);
        }
    }

    public async checkUpdate(cf: { updateUserData: any; manager: boolean; userID: string }) {
        let config = await App.getAdConfig(this.app, 'glitterUserForm');
        let originUserData = (
            await db.query(
                `select userData
                                              from \`${this.app}\`.\`t_user\`
                                              where userID = ${db.escape(cf.userID)}`,
                []
            )
        )[0]['userData'];
        if (typeof originUserData !== 'object') {
            originUserData = {};
        }
        if (!Array.isArray(config)) {
            config = [];
        }

        function mapUserData(userData: any, originUserData: any) {
            Object.keys(userData).map((dd) => {
                if (
                    cf.manager ||
                    config.find((d2: any) => {
                        return d2.key === dd && d2.auth !== 'manager';
                    }) ||
                    dd === 'fcmToken'
                ) {
                    originUserData[dd] = userData[dd];
                }
            });
        }

        mapUserData(cf.updateUserData, originUserData);

        return originUserData;
    }

    public async resetPwd(userID: string, newPwd: string) {
        try {
            const result = (await db.query(
                `update \`${this.app}\`.t_user
                                            SET ?
                                            WHERE 1 = 1
                                              and userID = ?`,
                [
                    {
                        pwd: await tool.hashPwd(newPwd),
                    },
                    userID,
                ]
            )) as any;
            return {
                result: true,
            };
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'Login Error:' + e, null);
        }
    }

    public async resetPwdNeedCheck(userID: string, pwd: string, newPwd: string) {
        try {
            const data: any = (
                (await db.execute(
                    `select *
                                                 from \`${this.app}\`.t_user
                                                 where userID = ?
                                                   and status = 1`,
                    [userID]
                )) as any
            )[0];
            if (await tool.compareHash(pwd, data.pwd)) {
                const result = (await db.query(
                    `update \`${this.app}\`.t_user
                                                SET ?
                                                WHERE 1 = 1
                                                  and userID = ?`,
                    [
                        {
                            pwd: await tool.hashPwd(newPwd),
                        },
                        userID,
                    ]
                )) as any;
                return {
                    result: true,
                };
            } else {
                throw exception.BadRequestError('BAD_REQUEST', 'Auth failed', null);
            }
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'Login Error:' + e, null);
        }
    }

    public async updateAccountBack(token: string) {
        try {
            const sql = `select userData
                         from \`${this.app}\`.t_user
                         where JSON_EXTRACT(userData, '$.mailVerify') = ${db.escape(token)}`;
            const userData = (await db.query(sql, []))[0]['userData'];
            await db.execute(
                `update \`${this.app}\`.t_user
                              set account=${db.escape(userData.updateAccount)}
                              where JSON_EXTRACT(userData, '$.mailVerify') = ?`,
                [token]
            );
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'updateAccountBack Error:' + e, null);
        }
    }

    public async verifyPASS(token: string) {
        try {
            const par = {
                status: 1,
            };
            return (await db.query(
                `update \`${this.app}\`.t_user
                                    SET ?
                                    WHERE 1 = 1
                                      and JSON_EXTRACT(userData, '$.mailVerify') = ?`,
                [par, token]
            )) as any;
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'Verify Error:' + e, null);
        }
    }

    public async checkUserExists(account: string) {
        try {
            return (
                (
                    (await db.execute(
                        `select count(1)
                                      from \`${this.app}\`.t_user
                                      where account = ?
                                        and status!=0`,
                        [account]
                    )) as any
                )[0]['count(1)'] == 1
            );
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'CheckUserExists Error:' + e, null);
        }
    }

    public async checkUserIdExists(id: number) {
        try {
            const count = (await db.query(`select count(1) from \`${this.app}\`.t_user where userID = ?`, [id]))[0]['count(1)'];
            return count;
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'CheckUserExists Error:' + e, null);
        }
    }

    public async setConfig(config: { key: string; value: any; user_id?: string }) {
        try {
            if (typeof config.value !== 'string') {
                config.value = JSON.stringify(config.value);
            }
            if (
                (
                    await db.query(
                        `select count(1)
                                 from \`${this.app}\`.t_user_public_config
                                 where \`key\` = ? and user_id=? `,
                        [config.key, config.user_id ?? this.token!.userID]
                    )
                )[0]['count(1)'] === 1
            ) {
                await db.query(
                    `update \`${this.app}\`.t_user_public_config
                                set value=?
                                where \`key\` = ? and user_id=?`,
                    [config.value, config.key, config.user_id ?? this.token!.userID]
                );
            } else {
                await db.query(
                    `insert
                                into \`${this.app}\`.t_user_public_config (\`user_id\`, \`key\`, \`value\`, updated_at)
                                values (?, ?, ?, ?)
                `,
                    [config.user_id ?? this.token!.userID, config.key, config.value, new Date()]
                );
            }
        } catch (e) {
            console.error(e);
            throw exception.BadRequestError('ERROR', 'ERROR.' + e, null);
        }
    }

    public async getConfig(config: { key: string; user_id: string }) {
        try {
            return await db.execute(
                `select *
                                     from \`${this.app}\`.t_user_public_config
                                     where \`key\` = ${db.escape(config.key)}
                                       and user_id = ${db.escape(config.user_id)}
            `,
                []
            );
        } catch (e) {
            console.error(e);
            throw exception.BadRequestError('ERROR', 'ERROR.' + e, null);
        }
    }

    public async getConfigV2(config: { key: string; user_id: string }) {
        try {
            const data = await db.execute(
                `select *
                                           from \`${this.app}\`.t_user_public_config
                                           where \`key\` = ${db.escape(config.key)}
                                             and user_id = ${db.escape(config.user_id)}
            `,
                []
            );
            return (data[0] && data[0].value) || {};
        } catch (e) {
            console.error(e);
            throw exception.BadRequestError('ERROR', 'ERROR.' + e, null);
        }
    }

    public async checkEmailExists(email: string) {
        try {
            const count = (await db.query(`select count(1) from \`${this.app}\`.t_user where account=?`, [email]))[0]['count(1)'];
            return count;
        } catch (e) {
            throw exception.BadRequestError('ERROR', 'ERROR.' + e, null);
        }
    }

    public async getUnreadCount() {
        try {
            const last_read_time = await db.query(
                `SELECT value
                                                   FROM \`${this.app}\`.t_user_public_config
                                                   where \`key\` = 'notice_last_read'
                                                     and user_id = ?;`,
                [this.token?.userID]
            );
            const date = !last_read_time[0] ? new Date('2022-01-29') : new Date(last_read_time[0].value.time);
            const count = (
                await db.query(
                    `select count(1)
                                           from \`${this.app}\`.t_notice
                                           where user_id = ?
                                             and created_time > ?`,
                    [this.token?.userID, date]
                )
            )[0]['count(1)'];
            return {
                count: count,
            };
        } catch (e) {
            throw exception.BadRequestError('ERROR', 'ERROR.' + e, null);
        }
    }

    public async getNotice(cf: { query: any }) {
        try {
            const query = [`user_id=${this.token?.userID}`];
            let last_time_read = 0;
            const last_read_time = await db.query(
                `SELECT value
                                                   FROM \`${this.app}\`.t_user_public_config
                                                   where \`key\` = 'notice_last_read'
                                                     and user_id = ?;`,
                [this.token?.userID]
            );
            if (!last_read_time[0]) {
                await db.query(
                    `insert into \`${this.app}\`.t_user_public_config (user_id, \`key\`, value, updated_at)
                                values (?, ?, ?, ?)`,
                    [this.token?.userID, 'notice_last_read', JSON.stringify({ time: new Date() }), new Date()]
                );
            } else {
                last_time_read = new Date(last_read_time[0].value.time).getTime();
                await db.query(
                    `update \`${this.app}\`.t_user_public_config
                                set \`value\`=?
                                where user_id = ?
                                  and \`key\` = ?`,
                    [JSON.stringify({ time: new Date() }), `${this.token?.userID}`, 'notice_last_read']
                );
            }
            const response: any = await new UtDatabase(this.app, `t_notice`).querySql(query, cf.query);
            response.last_time_read = last_time_read;
            return response;
        } catch (e) {
            console.error(e);
            throw exception.BadRequestError('ERROR', 'ERROR.' + e, null);
        }
    }

    constructor(app: string, token?: IToken) {
        this.app = app;
        this.token = token;
    }
}

function generateUserID() {
    let userID = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
        userID += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    userID = `${'123456789'.charAt(Math.floor(Math.random() * charactersLength))}${userID}`;
    return userID;
}
