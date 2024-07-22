"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const database_1 = __importDefault(require("../../modules/database"));
const exception_1 = __importDefault(require("../../modules/exception"));
const tool_1 = __importStar(require("../../services/tool"));
const UserUtil_1 = __importDefault(require("../../utils/UserUtil"));
const config_js_1 = __importDefault(require("../../config.js"));
const ses_js_1 = require("../../services/ses.js");
const app_js_1 = __importDefault(require("../../app.js"));
const redis_js_1 = __importDefault(require("../../modules/redis.js"));
const tool_js_1 = __importDefault(require("../../modules/tool.js"));
const process_1 = __importDefault(require("process"));
const ut_database_js_1 = require("../utils/ut-database.js");
const custom_code_js_1 = require("./custom-code.js");
const axios_1 = __importDefault(require("axios"));
const auto_send_email_js_1 = require("./auto-send-email.js");
const qs_1 = __importDefault(require("qs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
const rebate_js_1 = require("./rebate.js");
const moment_1 = __importDefault(require("moment"));
const notify_js_1 = require("./notify.js");
class User {
    async createUser(account, pwd, userData, req, pass_verify) {
        try {
            const login_config = await this.getConfigV2({
                key: 'login_config',
                user_id: 'manager',
            });
            const userID = generateUserID();
            if (!pass_verify) {
                if (userData.verify_code) {
                    if (userData.verify_code !== (await redis_js_1.default.getValue(`verify-${account}`))) {
                        throw exception_1.default.BadRequestError('BAD_REQUEST', 'Verify code error.', null);
                    }
                }
                else if (login_config.email_verify) {
                    await database_1.default.execute(`delete
                     from \`${this.app}\`.\`t_user\`
                     where account = ${database_1.default.escape(account)}
                       and status = 0`, []);
                    const data = await auto_send_email_js_1.AutoSendEmail.getDefCompare(this.app, 'auto-email-verify');
                    const code = tool_js_1.default.randomNumber(6);
                    await redis_js_1.default.setValue(`verify-${account}`, code);
                    data.content = data.content.replace(`@{{code}}`, code);
                    (0, ses_js_1.sendmail)(`${data.name} <${process_1.default.env.smtp}>`, account, data.title, data.content);
                    return {
                        verify: 'mail',
                    };
                }
            }
            await database_1.default.execute(`INSERT INTO \`${this.app}\`.\`t_user\` (\`userID\`, \`account\`, \`pwd\`, \`userData\`, \`status\`)
                 VALUES (?, ?, ?, ?, ?);`, [userID, account, await tool_1.default.hashPwd(pwd), userData !== null && userData !== void 0 ? userData : {}, 1]);
            await this.createUserHook(userID);
            const usData = await this.getUserData(userID, 'userID');
            usData.pwd = undefined;
            usData.token = await UserUtil_1.default.generateToken({
                user_id: usData['userID'],
                account: usData['account'],
                userData: {},
            });
            return usData;
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Register Error:' + e, null);
        }
    }
    async createUserHook(userID) {
        var _a;
        const usData = await this.getUserData(userID, 'userID');
        const data = await auto_send_email_js_1.AutoSendEmail.getDefCompare(this.app, 'auto-email-welcome');
        if (data.toggle) {
            (0, ses_js_1.sendmail)(`${data.name} <${process_1.default.env.smtp}>`, usData.account, data.title, data.content);
        }
        const getRS = await this.getConfig({ key: 'rebate_setting', user_id: 'manager' });
        const rgs = getRS[0] && getRS[0].value.register ? getRS[0].value.register : {};
        if (rgs && rgs.switch) {
            await new rebate_js_1.Rebate(this.app).insertRebate(userID, (_a = rgs.value) !== null && _a !== void 0 ? _a : 0, '新加入會員', {
                type: 'first_regiser',
                deadTime: rgs.unlimited ? undefined : (0, moment_1.default)().add(rgs.date, 'd').format('YYYY-MM-DD HH:mm:ss'),
            });
        }
        const manager = new notify_js_1.ManagerNotify(this.app);
        manager.userRegister({ user_id: userID });
    }
    async updateAccount(account, userID) {
        try {
            const configAd = await app_js_1.default.getAdConfig(this.app, 'glitter_loginConfig');
            switch (configAd.verify) {
                case 'mail':
                    const checkToken = (0, tool_1.getUUID)();
                    const url = `<h1>${configAd.name}</h1><p>
<a href="${config_js_1.default.domain}/api-public/v1/user/checkMail/updateAccount?g-app=${this.app}&token=${checkToken}">點我前往認證您的信箱</a>
</p>`;
                    await (0, ses_js_1.sendmail)(`service@ncdesign.info`, account, `信箱認證`, url);
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
        }
        catch (e) {
            console.error(e);
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'SendMail Error:' + e, null);
        }
    }
    async login(account, pwd) {
        try {
            const data = (await database_1.default.execute(`select *
                     from \`${this.app}\`.t_user
                     where account = ?
                       and status = 1`, [account]))[0];
            if (await tool_1.default.compareHash(pwd, data.pwd)) {
                data.pwd = undefined;
                data.token = await UserUtil_1.default.generateToken({
                    user_id: data['userID'],
                    account: data['account'],
                    userData: {},
                });
                return data;
            }
            else {
                throw exception_1.default.BadRequestError('BAD_REQUEST', 'Auth failed', null);
            }
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Login Error:' + e, null);
        }
    }
    async loginWithFb(token) {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://graph.facebook.com/v19.0/me?access_token=${token}&__cppo=1&debug=all&fields=id%2Cname%2Cemail&format=json&method=get&origin_graph_explorer=1&pretty=0&suppress_http_code=1&transport=cors`,
            headers: {
                Cookie: 'sb=UysEY1hZJvSZxgxk_g316pK-',
            },
        };
        const fbResponse = await new Promise((resolve, reject) => {
            axios_1.default
                .request(config)
                .then((response) => {
                resolve(response.data);
            })
                .catch((error) => {
                throw exception_1.default.BadRequestError('BAD_REQUEST', 'Login Error:' + error, null);
            });
        });
        if ((await database_1.default.query(`select count(1)
                     from \`${this.app}\`.t_user
                     where account = ?`, [fbResponse.email]))[0]['count(1)'] == 0) {
            const userID = generateUserID();
            await database_1.default.execute(`INSERT INTO \`${this.app}\`.\`t_user\` (\`userID\`, \`account\`, \`pwd\`, \`userData\`, \`status\`)
                 VALUES (?, ?, ?, ?, ?);`, [
                userID,
                fbResponse.email,
                await tool_1.default.hashPwd(generateUserID()),
                {
                    name: fbResponse.name,
                    fb_id: fbResponse.id,
                    email: fbResponse.email,
                },
                1,
            ]);
            await this.createUserHook(userID);
        }
        const data = (await database_1.default.execute(`select *
                 from \`${this.app}\`.t_user
                 where account = ?
                   and status = 1`, [fbResponse.email]))[0];
        const usData = await this.getUserData(data.userID, 'userID');
        usData.pwd = undefined;
        usData.token = await UserUtil_1.default.generateToken({
            user_id: usData['userID'],
            account: usData['account'],
            userData: {},
        });
        return usData;
    }
    async loginWithLine(code, redirect) {
        try {
            const lineData = await this.getConfigV2({
                key: 'login_line_setting',
                user_id: 'manager',
            });
            const lineResponse = await new Promise((resolve, reject) => {
                axios_1.default
                    .request({
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://api.line.me/oauth2/v2.1/token',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    data: qs_1.default.stringify({
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
                throw exception_1.default.BadRequestError('BAD_REQUEST', 'Line Register Error', null);
            }
            const userData = jsonwebtoken_1.default.decode(lineResponse.id_token);
            if ((await database_1.default.query(`select count(1)
                         from \`${this.app}\`.t_user
                         where userData ->>'$.lineID'=?`, [userData.sub]))[0]['count(1)'] == 0) {
                const userID = generateUserID();
                await database_1.default.execute(`INSERT INTO \`${this.app}\`.\`t_user\` (\`userID\`, \`account\`, \`pwd\`, \`userData\`, \`status\`)
                     VALUES (?, ?, ?, ?, ?);`, [
                    userID,
                    userData.sub,
                    await tool_1.default.hashPwd(generateUserID()),
                    {
                        name: userData.name || '未命名',
                        lineID: userData.sub,
                    },
                    1,
                ]);
                await this.createUserHook(userID);
            }
            const data = (await database_1.default.execute(`select *
                     from \`${this.app}\`.t_user
                     where userData ->>'$.lineID'=?`, [userData.sub]))[0];
            const usData = await this.getUserData(data.userID, 'userID');
            usData.pwd = undefined;
            usData.token = await UserUtil_1.default.generateToken({
                user_id: usData['userID'],
                account: usData['account'],
                userData: {},
            });
            return usData;
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', e, null);
        }
    }
    async loginWithGoogle(code, redirect) {
        try {
            const config = await this.getConfigV2({
                key: 'login_google_setting',
                user_id: 'manager',
            });
            const oauth2Client = new google_auth_library_1.OAuth2Client(config.id, config.secret, redirect);
            const { tokens } = await oauth2Client.getToken(code);
            oauth2Client.setCredentials(tokens);
            const ticket = await oauth2Client.verifyIdToken({
                idToken: tokens.id_token,
                audience: config.id,
            });
            const payload = ticket.getPayload();
            if ((await database_1.default.query(`select count(1)
                         from \`${this.app}\`.t_user
                         where account = ?`, [payload === null || payload === void 0 ? void 0 : payload.email]))[0]['count(1)'] == 0) {
                const userID = generateUserID();
                await database_1.default.execute(`INSERT INTO \`${this.app}\`.\`t_user\` (\`userID\`, \`account\`, \`pwd\`, \`userData\`, \`status\`)
                     VALUES (?, ?, ?, ?, ?);`, [
                    userID,
                    payload === null || payload === void 0 ? void 0 : payload.email,
                    await tool_1.default.hashPwd(generateUserID()),
                    {
                        name: payload === null || payload === void 0 ? void 0 : payload.given_name,
                        email: payload === null || payload === void 0 ? void 0 : payload.email,
                    },
                    1,
                ]);
                await this.createUserHook(userID);
            }
            const data = (await database_1.default.execute(`select *
                     from \`${this.app}\`.t_user
                     where account = ?
                       and status = 1`, [payload === null || payload === void 0 ? void 0 : payload.email]))[0];
            const usData = await this.getUserData(data.userID, 'userID');
            usData.pwd = undefined;
            usData.token = await UserUtil_1.default.generateToken({
                user_id: usData['userID'],
                account: usData['account'],
                userData: {},
            });
            return usData;
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', e, null);
        }
    }
    async getUserData(query, type = 'userID') {
        try {
            const sql = `select *
                         from \`${this.app}\`.t_user
                         where ${(() => {
                let query2 = [`1=1`];
                if (type === 'userID') {
                    query2.push(`userID=${database_1.default.escape(query)}`);
                }
                else {
                    query2.push(`account=${database_1.default.escape(query)}`);
                }
                return query2.join(` and `);
            })()}`;
            const data = (await database_1.default.execute(sql, []))[0];
            let cf = {
                userData: data,
            };
            await new custom_code_js_1.CustomCode(this.app).loginHook(cf);
            if (data) {
                data.pwd = undefined;
                data.member = await this.refreshMember(data);
            }
            return data;
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'GET USER DATA Error:' + e, null);
        }
    }
    async refreshMember(userData) {
        const member_update = await this.getConfigV2({
            key: 'member_update',
            user_id: userData.userID,
        });
        member_update.time = member_update.time || new Date('1997-01-29').toISOString();
        const update_time = new Date(member_update.time);
        if (update_time.getTime() < new Date().getTime() - 1000 * 600) {
            const member_list = (await this.getConfigV2({
                key: 'member_level_config',
                user_id: 'manager',
            })).levels || [];
            const order_list = (await database_1.default.query(`SELECT orderData ->> '$.total' as total, created_time
                 FROM \`${this.app}\`.t_checkout
                 where email = ${database_1.default.escape(userData.account)}
                   and status = 1
                 order by id desc`, [])).map((dd) => {
                return { total_amount: parseInt(`${dd.total}`, 10), date: dd.created_time };
            });
            let pass_level = true;
            const member = member_list.map((dd) => {
                if (dd.condition.type === 'single') {
                    const time = order_list.find((d1) => {
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
                        }
                        else {
                            dead_line.setDate(dead_line.getDate() + dd.dead_line.value);
                            return {
                                id: dd.id,
                                trigger: pass_level,
                                tag_name: dd.tag_name,
                                dead_line: dead_line,
                                og: dd,
                            };
                        }
                    }
                    else {
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
                }
                else {
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
                        }
                        else {
                            latest.setDate(latest.getDate() + dd.dead_line.value);
                            return {
                                id: dd.id,
                                trigger: pass_level,
                                tag_name: dd.tag_name,
                                dead_line: latest,
                                og: dd,
                            };
                        }
                    }
                    else {
                        let leak = parseInt(dd.condition.value, 10);
                        let sum = 0;
                        const compareDate = new Date();
                        compareDate.setDate(compareDate.getDate() - (dd.duration.type === 'noLimit' ? 365 * 10 : dd.duration.value));
                        order_list.map((dd) => {
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
            });
            member_update.value = member.reverse();
            member_update.time = new Date();
            await this.setConfig({
                key: 'member_update',
                user_id: userData.userID,
                value: member_update,
            });
            return member.reverse();
        }
        else {
            return member_update.value;
        }
    }
    find30DayPeriodWith3000Spent(transactions, total, duration, dead_line) {
        const ONE_YEAR_MS = dead_line * 24 * 60 * 60 * 1000;
        const THIRTY_DAYS_MS = duration * 24 * 60 * 60 * 1000;
        const NOW = new Date().getTime();
        const recentTransactions = transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.date);
            return NOW - transactionDate.getTime() <= ONE_YEAR_MS;
        });
        recentTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        for (let i = 0; i < recentTransactions.length; i++) {
            let sum = 0;
            for (let j = i; j < recentTransactions.length; j++) {
                const dateI = new Date(recentTransactions[i].date);
                const dateJ = new Date(recentTransactions[j].date);
                if (dateI.getTime() - dateJ.getTime() <= THIRTY_DAYS_MS) {
                    sum += recentTransactions[j].total_amount;
                    if (sum >= total) {
                        return {
                            start_date: recentTransactions[j].date,
                            end_date: recentTransactions[i].date,
                        };
                    }
                }
                else {
                    break;
                }
            }
        }
        return null;
    }
    getUserAndOrderSQL(obj) {
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
    async getUserList(query) {
        var _a, _b, _c, _d;
        try {
            const querySql = ['1=1'];
            query.page = (_a = query.page) !== null && _a !== void 0 ? _a : 0;
            query.limit = (_b = query.limit) !== null && _b !== void 0 ? _b : 50;
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
                        : users.map((item) => item.userID);
                    query.id = ids.join(',');
                }
            }
            if (query.id && query.id.length > 1) {
                querySql.push(`(u.userID in (${query.id}))`);
            }
            if (query.created_time) {
                const created_time = query.created_time.split(',');
                if (created_time.length > 1) {
                    querySql.push(`
                        (u.created_time BETWEEN ${database_1.default.escape(`${created_time[0]} 00:00:00`)} 
                        AND ${database_1.default.escape(`${created_time[1]} 23:59:59`)})
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
                querySql.push([
                    `(UPPER(JSON_UNQUOTE(JSON_EXTRACT(u.userData, '$.name'))) LIKE UPPER('%${query.search}%'))`,
                    `(JSON_UNQUOTE(JSON_EXTRACT(u.userData, '$.email')) LIKE '%${query.search}%')`,
                    `(UPPER(JSON_UNQUOTE(JSON_EXTRACT(u.userData, '$.phone')) LIKE UPPER('%${query.search}%')))`,
                ]
                    .filter((text) => {
                    if (query.searchType === undefined)
                        return true;
                    if (text.includes(`$.${query.searchType}`))
                        return true;
                    return false;
                })
                    .join(` || `));
            }
            const dataSQL = this.getUserAndOrderSQL({
                select: 'o.email, o.order_count, o.total_amount, u.*',
                where: querySql,
                orderBy: (_c = query.order_string) !== null && _c !== void 0 ? _c : '',
                page: query.page,
                limit: query.limit,
            });
            const countSQL = this.getUserAndOrderSQL({
                select: 'count(1)',
                where: querySql,
                orderBy: (_d = query.order_string) !== null && _d !== void 0 ? _d : '',
            });
            return {
                data: (await database_1.default.query(dataSQL, [])).map((dd) => {
                    dd.pwd = undefined;
                    return dd;
                }),
                total: (await database_1.default.query(countSQL, []))[0]['count(1)'],
            };
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'getUserList Error:' + e, null);
        }
    }
    async getUserGroups(type, tag) {
        try {
            const pass = (text) => type === undefined || type.includes(text);
            let dataList = [];
            if (pass('subscriber')) {
                const subscriberList = await database_1.default.query(`SELECT DISTINCT u.userID, s.email
                    FROM
                        \`${this.app}\`.t_subscribe AS s JOIN
                        \`${this.app}\`.t_user AS u ON s.email = JSON_EXTRACT(u.userData, '$.email');`, []);
                dataList.push({ type: 'subscriber', title: '電子郵件訂閱者', users: subscriberList });
            }
            if (pass('neverBuying') || pass('usuallyBuying')) {
                const buyingList = [];
                const buyingData = await database_1.default.query(`SELECT u.userID, c.email, JSON_UNQUOTE(JSON_EXTRACT(c.orderData, '$.email')) AS order_email
                    FROM
                        \`${this.app}\`.t_checkout AS c JOIN
                        \`${this.app}\`.t_user AS u ON c.email = JSON_EXTRACT(u.userData, '$.email')
                    WHERE c.status = 1;`, []);
                buyingData.map((item1) => {
                    const index = buyingList.findIndex((item2) => item2.userID === item1.userID);
                    if (index === -1) {
                        buyingList.push({ userID: item1.userID, email: item1.email, count: 1 });
                    }
                    else {
                        buyingList[index].count++;
                    }
                });
                const usuallyBuyingStandard = 4.5;
                const usuallyBuyingList = buyingList.filter((item) => item.count > usuallyBuyingStandard);
                const neverBuyingData = await database_1.default.query(`SELECT userID, JSON_UNQUOTE(JSON_EXTRACT(userData, '$.email')) AS email
                    FROM \`${this.app}\`.t_user
                    WHERE userID not in (${buyingList.map((item) => item.userID).concat([-1312]).join(',')})`, []);
                dataList = dataList.concat([
                    { type: 'neverBuying', title: '尚未購買過的顧客', users: neverBuyingData },
                    { type: 'usuallyBuying', title: '已購買多次的顧客', users: usuallyBuyingList },
                ]);
            }
            if (pass('level')) {
                const levelData = await this.getConfigV2({ key: 'member_level_config', user_id: 'manager' });
                const levels = levelData.levels
                    .map((item) => {
                    return { id: item.id, name: item.tag_name };
                })
                    .filter((item) => {
                    return tag ? item.id === tag : true;
                });
                const memberUpdates = await database_1.default.query(`SELECT * FROM \`${this.app}\`.t_user_public_config 
                        WHERE \`key\` = 'member_update';`, []);
                for (const level of levels) {
                    const ids = [];
                    for (const member of memberUpdates) {
                        const member_level = member.value.value.find((v) => v.trigger);
                        if (member_level && member_level.id === level.id) {
                            ids.push(member.user_id);
                        }
                    }
                    if (ids.length > 0) {
                        const levelList = await database_1.default.query(`SELECT userID, JSON_UNQUOTE(JSON_EXTRACT(userData, '$.email')) AS email
                            FROM \`${this.app}\`.t_user
                            WHERE userID in (${ids.join(',')})`, []);
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
        }
        catch (e) {
            console.error(e);
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'getUserGroups Error:' + e, null);
        }
    }
    async subscribe(email, tag) {
        try {
            await database_1.default.queryLambada({
                database: this.app,
            }, async (sql) => {
                await sql.query(`replace
                        into t_subscribe (email,tag) values (?,?)`, [email, tag]);
            });
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Subscribe Error:' + e, null);
        }
    }
    async registerFcm(userID, deviceToken) {
        try {
            await database_1.default.queryLambada({
                database: this.app,
            }, async (sql) => {
                await sql.query(`replace
                        into t_fcm (userID,deviceToken) values (?,?)`, [userID, deviceToken]);
            });
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'RegisterFcm Error:' + e, null);
        }
    }
    async deleteSubscribe(email) {
        try {
            await database_1.default.query(`delete
                 FROM \`${this.app}\`.t_subscribe
                 where email in (?)`, [email.split(',')]);
            return {
                result: true,
            };
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Delete Subscribe Error:' + e, null);
        }
    }
    async getSubScribe(query) {
        var _a, _b;
        try {
            query.page = (_a = query.page) !== null && _a !== void 0 ? _a : 0;
            query.limit = (_b = query.limit) !== null && _b !== void 0 ? _b : 50;
            const querySql = [];
            query.search && querySql.push([`(email LIKE '%${query.search}%') && (tag != ${database_1.default.escape(query.search)})`, `(tag = ${database_1.default.escape(query.search)})`].join(` || `));
            const data = await new ut_database_js_1.UtDatabase(this.app, `t_subscribe`).querySql(querySql, query);
            data.data.map((dd) => {
                dd.pwd = undefined;
            });
            return data;
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Login Error:' + e, null);
        }
    }
    async getFCM(query) {
        var _a, _b;
        try {
            query.page = (_a = query.page) !== null && _a !== void 0 ? _a : 0;
            query.limit = (_b = query.limit) !== null && _b !== void 0 ? _b : 50;
            const querySql = [];
            query.search &&
                querySql.push([`(userID in (select userID from \`${this.app}\`.t_user where (UPPER(JSON_UNQUOTE(JSON_EXTRACT(userData, '$.name')) LIKE UPPER('%${query.search}%')))))`].join(` || `));
            const data = await new ut_database_js_1.UtDatabase(this.app, `t_fcm`).querySql(querySql, query);
            for (const b of data.data) {
                let userData = (await database_1.default.query(`select userData
                         from \`${this.app}\`.t_user
                         where userID = ?`, [b.userID]))[0];
                b.userData = userData && userData.userData;
            }
            return data;
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Login Error:' + e, null);
        }
    }
    async deleteUser(query) {
        try {
            await database_1.default.query(`delete
                 FROM \`${this.app}\`.t_user
                 where id in (?)`, [query.id.split(',')]);
            return {
                result: true,
            };
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Delete User Error:' + e, null);
        }
    }
    async updateUserData(userID, par, manager = false) {
        try {
            const userData = (await database_1.default.query(`select *
                     from \`${this.app}\`.\`t_user\`
                     where userID = ${database_1.default.escape(userID)}`, []))[0];
            const configAd = await app_js_1.default.getAdConfig(this.app, 'glitter_loginConfig');
            if (!manager &&
                par.userData.email &&
                par.userData.email !== userData.account &&
                (!par.userData.verify_code || par.userData.verify_code !== (await redis_js_1.default.getValue(`verify-${par.userData.email}`)))) {
                if (!par.userData.verify_code) {
                    const code = tool_js_1.default.randomNumber(6);
                    await redis_js_1.default.setValue(`verify-${par.userData.email}`, code);
                    (0, ses_js_1.sendmail)(`${configAd.name} <${process_1.default.env.smtp}>`, par.userData.email, '信箱驗證', `請輸入驗證碼「 ${code} 」。並於1分鐘內輸入並完成驗證。`);
                    return {
                        data: 'emailVerify',
                    };
                }
                else {
                    throw exception_1.default.BadRequestError('AUTH_ERROR', 'Check email error.', null);
                }
            }
            else if (par.userData.email) {
                await database_1.default.query(`update \`${this.app}\`.t_checkout
                     set email=?
                     where id > 0
                       and email = ?`, [par.userData.email, userData.account]);
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
                data: (await database_1.default.query(`update \`${this.app}\`.t_user
                     SET ?
                     WHERE 1 = 1
                       and userID = ?`, [par, userID])),
            };
        }
        catch (e) {
            throw exception_1.default.BadRequestError(e.code || 'BAD_REQUEST', e.message, null);
        }
    }
    async checkUpdate(cf) {
        let config = await app_js_1.default.getAdConfig(this.app, 'glitterUserForm');
        let originUserData = (await database_1.default.query(`select userData
                 from \`${this.app}\`.\`t_user\`
                 where userID = ${database_1.default.escape(cf.userID)}`, []))[0]['userData'];
        if (typeof originUserData !== 'object') {
            originUserData = {};
        }
        if (!Array.isArray(config)) {
            config = [];
        }
        function mapUserData(userData, originUserData) {
            Object.keys(userData).map((dd) => {
                if (cf.manager ||
                    config.find((d2) => {
                        return d2.key === dd && d2.auth !== 'manager';
                    }) ||
                    dd === 'fcmToken') {
                    originUserData[dd] = userData[dd];
                }
            });
        }
        mapUserData(cf.updateUserData, originUserData);
        return originUserData;
    }
    async resetPwd(user_id_and_account, newPwd) {
        try {
            const result = (await database_1.default.query(`update \`${this.app}\`.t_user
                 SET ?
                 WHERE 1 = 1
                   and ( (account = ?))`, [
                {
                    pwd: await tool_1.default.hashPwd(newPwd),
                },
                user_id_and_account,
            ]));
            return {
                result: true,
            };
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Login Error:' + e, null);
        }
    }
    async resetPwdNeedCheck(userID, pwd, newPwd) {
        try {
            const data = (await database_1.default.execute(`select *
                     from \`${this.app}\`.t_user
                     where userID = ?
                       and status = 1`, [userID]))[0];
            if (await tool_1.default.compareHash(pwd, data.pwd)) {
                const result = (await database_1.default.query(`update \`${this.app}\`.t_user
                     SET ?
                     WHERE 1 = 1
                       and userID = ?`, [
                    {
                        pwd: await tool_1.default.hashPwd(newPwd),
                    },
                    userID,
                ]));
                return {
                    result: true,
                };
            }
            else {
                throw exception_1.default.BadRequestError('BAD_REQUEST', 'Auth failed', null);
            }
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Login Error:' + e, null);
        }
    }
    async updateAccountBack(token) {
        try {
            const sql = `select userData
                         from \`${this.app}\`.t_user
                         where JSON_EXTRACT(userData, '$.mailVerify') = ${database_1.default.escape(token)}`;
            const userData = (await database_1.default.query(sql, []))[0]['userData'];
            await database_1.default.execute(`update \`${this.app}\`.t_user
                 set account=${database_1.default.escape(userData.updateAccount)}
                 where JSON_EXTRACT(userData, '$.mailVerify') = ?`, [token]);
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'updateAccountBack Error:' + e, null);
        }
    }
    async verifyPASS(token) {
        try {
            const par = {
                status: 1,
            };
            return (await database_1.default.query(`update \`${this.app}\`.t_user
                 SET ?
                 WHERE 1 = 1
                   and JSON_EXTRACT(userData, '$.mailVerify') = ?`, [par, token]));
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'Verify Error:' + e, null);
        }
    }
    async checkUserExists(account) {
        try {
            return ((await database_1.default.execute(`select count(1)
                         from \`${this.app}\`.t_user
                         where account = ?
                           and status!=0`, [account]))[0]['count(1)'] == 1);
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'CheckUserExists Error:' + e, null);
        }
    }
    async checkUserIdExists(id) {
        try {
            const count = (await database_1.default.query(`select count(1)
                                           from \`${this.app}\`.t_user
                                           where userID = ?`, [id]))[0]['count(1)'];
            return count;
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'CheckUserExists Error:' + e, null);
        }
    }
    async setConfig(config) {
        var _a, _b, _c;
        try {
            if (typeof config.value !== 'string') {
                config.value = JSON.stringify(config.value);
            }
            if ((await database_1.default.query(`select count(1)
                         from \`${this.app}\`.t_user_public_config
                         where \`key\` = ?
                           and user_id = ? `, [config.key, (_a = config.user_id) !== null && _a !== void 0 ? _a : this.token.userID]))[0]['count(1)'] === 1) {
                await database_1.default.query(`update \`${this.app}\`.t_user_public_config
                     set value=? , updated_at=?
                     where \`key\` = ?
                       and user_id = ?`, [config.value, new Date(), config.key, (_b = config.user_id) !== null && _b !== void 0 ? _b : this.token.userID]);
            }
            else {
                await database_1.default.query(`insert
                     into \`${this.app}\`.t_user_public_config (\`user_id\`, \`key\`, \`value\`, updated_at)
                     values (?, ?, ?, ?)
                    `, [(_c = config.user_id) !== null && _c !== void 0 ? _c : this.token.userID, config.key, config.value, new Date()]);
            }
        }
        catch (e) {
            console.error(e);
            throw exception_1.default.BadRequestError('ERROR', 'ERROR.' + e, null);
        }
    }
    async getConfig(config) {
        try {
            return await database_1.default.execute(`select *
                 from \`${this.app}\`.t_user_public_config
                 where \`key\` = ${database_1.default.escape(config.key)}
                   and user_id = ${database_1.default.escape(config.user_id)}
                `, []);
        }
        catch (e) {
            console.error(e);
            throw exception_1.default.BadRequestError('ERROR', 'ERROR.' + e, null);
        }
    }
    async getConfigV2(config) {
        try {
            const data = await database_1.default.execute(`select *
                 from \`${this.app}\`.t_user_public_config
                 where \`key\` = ${database_1.default.escape(config.key)}
                   and user_id = ${database_1.default.escape(config.user_id)}
                `, []);
            return (data[0] && data[0].value) || {};
        }
        catch (e) {
            console.error(e);
            throw exception_1.default.BadRequestError('ERROR', 'ERROR.' + e, null);
        }
    }
    async checkEmailExists(email) {
        try {
            const count = (await database_1.default.query(`select count(1)
                                           from \`${this.app}\`.t_user
                                           where account = ?`, [email]))[0]['count(1)'];
            return count;
        }
        catch (e) {
            throw exception_1.default.BadRequestError('ERROR', 'ERROR.' + e, null);
        }
    }
    async getUnreadCount() {
        var _a, _b;
        try {
            const last_read_time = await database_1.default.query(`SELECT value
                 FROM \`${this.app}\`.t_user_public_config
                 where \`key\` = 'notice_last_read'
                   and user_id = ?;`, [(_a = this.token) === null || _a === void 0 ? void 0 : _a.userID]);
            const date = !last_read_time[0] ? new Date('2022-01-29') : new Date(last_read_time[0].value.time);
            const count = (await database_1.default.query(`select count(1)
                     from \`${this.app}\`.t_notice
                     where user_id = ?
                       and created_time > ?`, [(_b = this.token) === null || _b === void 0 ? void 0 : _b.userID, date]))[0]['count(1)'];
            return {
                count: count,
            };
        }
        catch (e) {
            throw exception_1.default.BadRequestError('ERROR', 'ERROR.' + e, null);
        }
    }
    async getNotice(cf) {
        var _a, _b, _c, _d;
        try {
            const query = [`user_id=${(_a = this.token) === null || _a === void 0 ? void 0 : _a.userID}`];
            let last_time_read = 0;
            const last_read_time = await database_1.default.query(`SELECT value
                 FROM \`${this.app}\`.t_user_public_config
                 where \`key\` = 'notice_last_read'
                   and user_id = ?;`, [(_b = this.token) === null || _b === void 0 ? void 0 : _b.userID]);
            if (!last_read_time[0]) {
                await database_1.default.query(`insert into \`${this.app}\`.t_user_public_config (user_id, \`key\`, value, updated_at)
                     values (?, ?, ?, ?)`, [(_c = this.token) === null || _c === void 0 ? void 0 : _c.userID, 'notice_last_read', JSON.stringify({ time: new Date() }), new Date()]);
            }
            else {
                last_time_read = new Date(last_read_time[0].value.time).getTime();
                await database_1.default.query(`update \`${this.app}\`.t_user_public_config
                     set \`value\`=?
                     where user_id = ?
                       and \`key\` = ?`, [JSON.stringify({ time: new Date() }), `${(_d = this.token) === null || _d === void 0 ? void 0 : _d.userID}`, 'notice_last_read']);
            }
            const response = await new ut_database_js_1.UtDatabase(this.app, `t_notice`).querySql(query, cf.query);
            response.last_time_read = last_time_read;
            return response;
        }
        catch (e) {
            console.error(e);
            throw exception_1.default.BadRequestError('ERROR', 'ERROR.' + e, null);
        }
    }
    async forgetPassword(email) {
        const data = await auto_send_email_js_1.AutoSendEmail.getDefCompare(this.app, 'auto-email-forget');
        const code = tool_js_1.default.randomNumber(6);
        await redis_js_1.default.setValue(`forget-${email}`, code);
        await redis_js_1.default.setValue(`forget-count-${email}`, '0');
        (0, ses_js_1.sendmail)(`${data.name} <${process_1.default.env.smtp}>`, email, data.title, data.content.replace('@{{code}}', code));
    }
    constructor(app, token) {
        this.app = app;
        this.token = token;
    }
}
exports.User = User;
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
//# sourceMappingURL=user.js.map