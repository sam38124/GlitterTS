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
import { Rebate } from './rebate.js';
import moment from 'moment';
import { ManagerNotify } from './notify.js';

interface UserQuery {
    page?: number;
    limit?: number;
    id?: string;
    search?: string;
    searchType?: string;
    order_string?: string;
    created_time?: string;
    birth?: string;
    level?: string;
    rebate?: string;
    total_amount?: string;
    groupType?: string;
    groupTag?: string;
}

interface GroupUserItem {
    userID: number;
    email: string;
    count: number;
}

interface GroupsItem {
    type: string;
    title: string;
    count?: number;
    tag?: string;
    users: GroupUserItem[];
}

export class User {
    public app: string;

    public token?: IToken;

    public async createUser(account: string, pwd: string, userData: any, req: any, pass_verify?: boolean) {
        try {
            const login_config = await this.getConfigV2({
                key: 'login_config',
                user_id: 'manager',
            });
            const userID = generateUserID();
            if (!pass_verify) {
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
            }
            await db.execute(
                `INSERT INTO \`${this.app}\`.\`t_user\` (\`userID\`, \`account\`, \`pwd\`, \`userData\`, \`status\`)
                 VALUES (?, ?, ?, ?, ?);`,
                [userID, account, await tool.hashPwd(pwd), userData ?? {}, 1]
            );

            await this.createUserHook(userID);

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

    // 用戶初次建立的initial函式
    public async createUserHook(userID: string) {
        //發送歡迎信件
        const usData: any = await this.getUserData(userID, 'userID');
        const data = await AutoSendEmail.getDefCompare(this.app, 'auto-email-welcome');
        if (data.toggle) {
            sendmail(`${data.name} <${process.env.smtp}>`, usData.account, data.title, data.content);
        }

        //發送購物金
        const getRS = await this.getConfig({ key: 'rebate_setting', user_id: 'manager' });
        const rgs = getRS[0] && getRS[0].value.register ? getRS[0].value.register : {};
        if (rgs && rgs.switch && rgs.value) {
            await new Rebate(this.app).insertRebate(userID, rgs.value, '新加入會員', {
                type: 'first_regiser',
                deadTime: rgs.unlimited ? undefined : moment().add(rgs.date, 'd').format('YYYY-MM-DD HH:mm:ss'),
            });
        }

        //發送用戶註冊通知
        const manager = new ManagerNotify(this.app);
        manager.userRegister({ user_id: userID });
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
            await this.createUserHook(userID);
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
                         where userData ->>'$.lineID'=?`,
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
                await this.createUserHook(userID);
            }
            const data: any = (
                (await db.execute(
                    `select *
                     from \`${this.app}\`.t_user
                     where userData ->>'$.lineID'=?`,
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
                await this.createUserHook(userID);
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
        const member_update = await this.getConfigV2({
            key: 'member_update',
            user_id: userData.userID,
        });
        member_update.time = member_update.time || new Date('1997-01-29').toISOString();
        //上次更新時間(每10分鐘更新一次會級資料)
        const update_time = new Date(member_update.time);
        if (update_time.getTime() < new Date().getTime() - 1000 * 600) {
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
                return { total_amount: parseInt(`${dd.total}`, 10), date: dd.created_time };
            });
            // 判斷是否符合上個等級
            let pass_level = true;
            const member = member_list.map(
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
                                    trigger: pass_level,
                                    tag_name: dd.tag_name,
                                    dead_line: dead_line,
                                    og: dd,
                                };
                            } else {
                                dead_line.setDate(dead_line.getDate() + dd.dead_line.value);
                                return {
                                    id: dd.id,
                                    trigger: pass_level,
                                    tag_name: dd.tag_name,
                                    dead_line: dead_line,
                                    og: dd,
                                };
                            }
                        } else {
                            let leak = parseInt(dd.condition.value, 10);
                            if (leak !== 0) {
                                pass_level = false;
                            }
                            return {
                                id: dd.id,
                                tag_name: dd.tag_name,
                                dead_line: '',
                                trigger: leak === 0 && pass_level,
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
                                    trigger: pass_level,
                                    tag_name: dd.tag_name,
                                    dead_line: latest,
                                    og: dd,
                                };
                            } else {
                                latest.setDate(latest.getDate() + dd.dead_line.value);
                                return {
                                    id: dd.id,
                                    trigger: pass_level,
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
                            if (leak !== 0) {
                                pass_level = false;
                            }
                            return {
                                id: dd.id,
                                tag_name: dd.tag_name,
                                dead_line: '',
                                trigger: leak === 0 && pass_level,
                                leak: leak,
                                sum: sum,
                                og: dd,
                            };
                        }
                    }
                }
            );
            member_update.value = member.reverse();
            member_update.time = new Date();
            await this.setConfig({
                key: 'member_update',
                user_id: userData.userID,
                value: member_update,
            });
            return member.reverse();
        } else {
            return member_update.value;
        }
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
            FROM (SELECT email,
                         COUNT(*)                                                        AS order_count,
                         SUM(CAST(JSON_EXTRACT(orderData, '$.total') AS DECIMAL(10, 2))) AS total_amount
                  FROM \`${this.app}\`.t_checkout
                  WHERE status = 1
                  GROUP BY email) as o
                     RIGHT JOIN
                 \`${this.app}\`.t_user u ON o.email = u.account
            WHERE (${obj.where.filter((str) => str.length > 0).join(' AND ')})
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
            })()} ${obj.page !== undefined && obj.limit !== undefined ? `LIMIT ${obj.page * obj.limit}, ${obj.limit}` : ''};
        `;

        return sql;
    }

    public async getUserList(query: UserQuery) {
        try {
            const querySql: string[] = ['1=1'];
            query.page = query.page ?? 0;
            query.limit = query.limit ?? 50;

            if (query.groupType) {
                const getGroup = await this.getUserGroups(query.groupType.split(','), query.groupTag);
                if (getGroup.result && getGroup.data[0]) {
                    const users = getGroup.data[0].users;
                    const ids = query.id
                        ? query.id.split(',').filter((id) => {
                              return users.find((item) => {
                                  return item.userID === parseInt(`${id}`, 10);
                              });
                          })
                        : users.map((item: { userID: number }) => item.userID);
                    query.id = ids.join(',');
                } else {
                    query.id = '0,0';
                }
            }

            if (query.rebate && query.rebate.length > 0) {
                const r = query.rebate.split(',');
                const rebateData = await new Rebate(this.app).getRebateList({
                    page: 0,
                    limit: 0,
                    search: '',
                    type: 'download',
                    low: r[0] === 'moreThan' ? parseInt(r[1], 10) : undefined,
                    high: r[0] === 'lessThan' ? parseInt(r[1], 10) : undefined,
                });
                if (rebateData && rebateData.total > 0) {
                    const ids = query.id
                        ? query.id.split(',').filter((id) => {
                              return rebateData.data.find((item) => {
                                  return item.user_id === parseInt(`${id}`, 10);
                              });
                          })
                        : rebateData.data.map((item) => item.user_id);
                    query.id = ids.join(',');
                } else {
                    query.id = '0,0';
                }
            }

            if (query.level && query.level.length > 0) {
                const levels = query.level.split(',');
                const levelGroup = await this.getUserGroups(['level']);
                if (levelGroup.result) {
                    let levelIds: number[] = [];
                    levelGroup.data.map((item) => {
                        if (item.tag && levels.includes(item.tag)) {
                            levelIds = levelIds.concat(item.users.map((user) => user.userID));
                        }
                    });
                    if (levelIds.length > 0) {
                        const ids = query.id
                            ? query.id.split(',').filter((id) => {
                                  return levelIds.find((item) => {
                                      return item === parseInt(`${id}`, 10);
                                  });
                              })
                            : levelIds;
                        query.id = ids.join(',');
                    } else {
                        query.id = '0,0';
                    }
                }
            }

            if (query.id && query.id.length > 1) {
                querySql.push(`(u.userID in (${query.id}))`);
            }

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
                        `(UPPER(JSON_UNQUOTE(JSON_EXTRACT(u.userData, '$.name'))) LIKE UPPER('%${query.search}%'))`,
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
            throw exception.BadRequestError('BAD_REQUEST', 'getUserList Error:' + e, null);
        }
    }

    public async getUserGroups(type?: string[], tag?: string): Promise<{ result: false } | { result: true; data: GroupsItem[] }> {
        try {
            const pass = (text: string) => type === undefined || type.includes(text);
            let dataList: GroupsItem[] = [];

            // 訂閱者清單
            if (pass('subscriber')) {
                const subscriberList = await db.query(
                    `SELECT DISTINCT u.userID, s.email
                    FROM
                        \`${this.app}\`.t_subscribe AS s JOIN
                        \`${this.app}\`.t_user AS u ON s.email = JSON_EXTRACT(u.userData, '$.email');`,
                    []
                );
                dataList.push({ type: 'subscriber', title: '電子郵件訂閱者', users: subscriberList });
            }

            // 購買者清單
            if (pass('neverBuying') || pass('usuallyBuying')) {
                const buyingList = [] as GroupUserItem[];
                const buyingData = await db.query(
                    `SELECT u.userID, c.email, JSON_UNQUOTE(JSON_EXTRACT(c.orderData, '$.email')) AS order_email
                    FROM
                        \`${this.app}\`.t_checkout AS c JOIN
                        \`${this.app}\`.t_user AS u ON c.email = JSON_EXTRACT(u.userData, '$.email')
                    WHERE c.status = 1;`,
                    []
                );
                buyingData.map((item1: { userID: number; email: string }) => {
                    const index = buyingList.findIndex((item2) => item2.userID === item1.userID);
                    if (index === -1) {
                        buyingList.push({ userID: item1.userID, email: item1.email, count: 1 });
                    } else {
                        buyingList[index].count++;
                    }
                });

                // 經常購買者清單
                const usuallyBuyingStandard = 4.5;
                const usuallyBuyingList = buyingList.filter((item) => item.count > usuallyBuyingStandard);
                // 從未購買者清單(Join時要確保至少包含一個值，不然sql會報錯。)
                const neverBuyingData = await db.query(
                    `SELECT userID, JSON_UNQUOTE(JSON_EXTRACT(userData, '$.email')) AS email
                    FROM \`${this.app}\`.t_user
                    WHERE userID not in (${buyingList
                        .map((item) => item.userID)
                        .concat([-1312])
                        .join(',')})`,
                    []
                );

                dataList = dataList.concat([
                    { type: 'neverBuying', title: '尚未購買過的顧客', users: neverBuyingData },
                    { type: 'usuallyBuying', title: '已購買多次的顧客', users: usuallyBuyingList },
                ]);
            }

            // 會員等級
            if (pass('level')) {
                const levelData = await this.getConfigV2({ key: 'member_level_config', user_id: 'manager' });
                const levels = levelData.levels
                    .map((item: any) => {
                        return { id: item.id, name: item.tag_name };
                    })
                    .filter((item: any) => {
                        return tag ? item.id === tag : true;
                    });
                const memberUpdates = await db.query(
                    `SELECT * FROM \`${this.app}\`.t_user_public_config 
                        WHERE \`key\` = 'member_update';`,
                    []
                );
                for (const level of levels) {
                    const ids = [];
                    for (const member of memberUpdates) {
                        const member_level = member.value.value.find((v: { trigger: boolean }) => v.trigger);
                        if (member_level && member_level.id === level.id) {
                            ids.push(member.user_id);
                        }
                    }
                    if (ids.length > 0) {
                        const levelList = await db.query(
                            `SELECT userID, JSON_UNQUOTE(JSON_EXTRACT(userData, '$.email')) AS email
                            FROM \`${this.app}\`.t_user
                            WHERE userID in (${ids.join(',')})`,
                            []
                        );
                        dataList.push({ type: 'level', title: `會員等級 - ${level.name}`, tag: level.id, users: levelList });
                    }
                }
            }

            if (type) {
                dataList = dataList.filter((item) => type.includes(item.type));
            }

            return {
                result: dataList.length > 0,
                data: dataList.map((data) => {
                    data.count = data.users.length;
                    return data;
                }),
            };
        } catch (e) {
            console.error(e);
            throw exception.BadRequestError('BAD_REQUEST', 'getUserGroups Error:' + e, null);
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

    public async resetPwd(user_id_and_account: string, newPwd: string) {
        try {
            const result = (await db.query(
                `update \`${this.app}\`.t_user
                 SET ?
                 WHERE 1 = 1
                   and ( (account = ?))`,
                [
                    {
                        pwd: await tool.hashPwd(newPwd),
                    },
                    user_id_and_account,
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
            const count = (
                await db.query(
                    `select count(1)
                                           from \`${this.app}\`.t_user
                                           where userID = ?`,
                    [id]
                )
            )[0]['count(1)'];
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
                         where \`key\` = ?
                           and user_id = ? `,
                        [config.key, config.user_id ?? this.token!.userID]
                    )
                )[0]['count(1)'] === 1
            ) {
                await db.query(
                    `update \`${this.app}\`.t_user_public_config
                     set value=? , updated_at=?
                     where \`key\` = ?
                       and user_id = ?`,
                    [config.value, new Date(), config.key, config.user_id ?? this.token!.userID]
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
            const count = (
                await db.query(
                    `select count(1)
                                           from \`${this.app}\`.t_user
                                           where account = ?`,
                    [email]
                )
            )[0]['count(1)'];
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

    public async forgetPassword(email: string) {
        const data = await AutoSendEmail.getDefCompare(this.app, 'auto-email-forget');
        const code = Tool.randomNumber(6);
        await redis.setValue(`forget-${email}`, code);
        await redis.setValue(`forget-count-${email}`, '0');
        sendmail(`${data.name} <${process.env.smtp}>`, email, data.title, data.content.replace('@{{code}}', code));
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
