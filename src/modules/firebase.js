"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Firebase = void 0;
const path_1 = __importDefault(require("path"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const config_1 = require("../config");
const database_1 = __importDefault(require("../modules/database"));
const web_socket_js_1 = require("../services/web-socket.js");
const caught_error_js_1 = require("./caught-error.js");
const exception_js_1 = __importDefault(require("./exception.js"));
class Firebase {
    constructor(app) {
        this.app = '';
        this.app = app;
    }
    static async initial() {
        console.log(`fireBaseInitial:${firebase_admin_1.default.credential.cert(path_1.default.resolve(config_1.ConfigSetting.config_path, `../${process.env.firebase}`))}`);
        firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.cert(path_1.default.resolve(config_1.ConfigSetting.config_path, `../${process.env.firebase}`)),
        }, 'glitter');
        firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.cert(path_1.default.resolve(config_1.ConfigSetting.config_path, `../${process.env.firebase}`)),
        });
    }
    static async appRegister(cf) {
        try {
            if (cf.type === 'ios') {
                await firebase_admin_1.default.projectManagement().createIosApp(cf.appID, cf.appName);
            }
            else {
                await firebase_admin_1.default.projectManagement().createAndroidApp(cf.appID, cf.appName);
            }
        }
        catch (e) { }
    }
    static async getConfig(cf) {
        try {
            if (cf.type === 'ios') {
                for (const b of await firebase_admin_1.default.projectManagement().listIosApps()) {
                    if ((await b.getMetadata()).bundleId === cf.appID) {
                        await b.setDisplayName(cf.appDomain);
                        return await b.getConfig();
                    }
                }
            }
            else {
                for (const b of await firebase_admin_1.default.projectManagement().listAndroidApps()) {
                    if ((await b.getMetadata()).packageName === cf.appID) {
                        await b.setDisplayName(cf.appDomain);
                        return await b.getConfig();
                    }
                }
            }
        }
        catch (e) {
            console.log(e);
            return '';
        }
    }
    async sendMessage(cf) {
        console.log('sendMessage', cf);
        cf.body = cf.body.replace(/<br\s*\/?>/gi, '\n');
        if (cf.userID) {
            web_socket_js_1.WebSocket.noticeChangeMem[cf.userID] &&
                web_socket_js_1.WebSocket.noticeChangeMem[cf.userID].map(d2 => {
                    d2.callback({
                        type: 'notice_count_change',
                    });
                });
        }
        return new Promise(async (resolve, reject) => {
            var _a;
            if (cf.userID) {
                cf.token = (await database_1.default.query(`SELECT deviceToken
                                    FROM \`${cf.app || this.app}\`.t_fcm
                                    where userID = ?;`, [cf.userID])).map((dd) => {
                    return dd.deviceToken;
                });
                console.log(`sendMessage:${cf.userID}`, `SELECT deviceToken
                                                 FROM \`${cf.app || this.app}\`.t_fcm
                                                 where userID = ${database_1.default.escape(cf.userID)};`);
                const user_cf = ((_a = (await database_1.default.query(`select \`value\`
                                           from \`${cf.app || this.app}\`.t_user_public_config
                                           where \`key\` = 'notify_setting'
                                             and user_id = ?`, [cf.userID]))[0]) !== null && _a !== void 0 ? _a : { value: {} }).value;
                if (`${user_cf[cf.tag]}` !== 'false') {
                    if (cf.userID && cf.tag && cf.title && cf.body && cf.link && !cf.pass_store) {
                        await database_1.default.query(`insert into \`${cf.app || this.app}\`.t_notice (user_id, tag, title, content, link)
                            values (?, ?, ?, ?, ?)`, [cf.userID, cf.tag, cf.title, cf.body, cf.link]);
                    }
                }
                else {
                    resolve(true);
                    return;
                }
            }
            if (typeof cf.token === 'string') {
                cf.token = [cf.token];
            }
            if (Array.isArray(cf.token)) {
                let error_token = [];
                await Promise.all(cf.token.map(token => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            firebase_admin_1.default.apps
                                .find(dd => {
                                return (dd === null || dd === void 0 ? void 0 : dd.name) === 'glitter';
                            })
                                .messaging()
                                .send({
                                notification: {
                                    title: cf.title,
                                    body: cf.body.replace(/<br>/g, ''),
                                },
                                android: {
                                    notification: {
                                        sound: 'default',
                                    },
                                },
                                apns: {
                                    payload: {
                                        aps: {
                                            sound: 'default',
                                        },
                                    },
                                },
                                data: {
                                    link: `${cf.link || ''}`,
                                },
                                token: token,
                            })
                                .then((response) => {
                                console.log(`成功發送推播：${token}`, response);
                                resolve(true);
                            })
                                .catch((error) => {
                                if (error.errorInfo.code === 'messaging/registration-token-not-registered') {
                                    error_token.push(token);
                                }
                                resolve(true);
                            });
                        }
                        catch (e) {
                            caught_error_js_1.CaughtError.warning('fcm', `firebase->74`, `${e}`);
                            resolve(true);
                        }
                    });
                }));
                if (error_token.length > 0) {
                    await database_1.default.query(`delete 
             FROM \`${cf.app || this.app}\`.t_fcm
             where userID = ? and deviceToken in (${error_token.map(d => database_1.default.escape(d)).join(',')});`, [cf.userID]);
                }
            }
            resolve(true);
        });
    }
    async postFCM(data) {
        data.msgid = '';
        try {
            if (Boolean(data.sendTime)) {
                if (isLater(data.sendTime)) {
                    return { result: false, message: '排定發送的時間需大於現在時間' };
                }
                const insertData = await database_1.default.query(`INSERT INTO \`${this.app}\`.\`t_triggers\`
           SET ?;`, [
                    {
                        tag: 'sendFCM',
                        content: JSON.stringify(data),
                        trigger_time: formatDateTime(data.sendTime),
                        status: 0,
                    },
                ]);
                this.chunkSendFcm(data, insertData.insertId, formatDateTime(data.sendTime));
            }
            else {
                const insertData = await database_1.default.query(`INSERT INTO \`${this.app}\`.\`t_triggers\`
           SET ?;`, [
                    {
                        tag: 'sendFCM',
                        content: JSON.stringify(data),
                        trigger_time: formatDateTime(),
                        status: 1,
                    },
                ]);
                this.chunkSendFcm(data, insertData.insertId);
            }
            return { result: true, message: '寄送成功' };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'postMail Error:' + e, null);
        }
    }
    async chunkSendFcm(data, id, date) {
        try {
            let msgid = '';
            for (const b of chunkArray(Array.from(new Set(data.userList.map((dd) => {
                return dd.id;
            }))), 10)) {
                let check = b.length;
                await new Promise(resolve => {
                    for (const d of b) {
                        this.sendMessage({
                            userID: d,
                            title: data.title,
                            body: data.content,
                            tag: 'promote',
                            link: data.link,
                        });
                    }
                });
            }
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'chunkSendSns Error:' + e, null);
        }
    }
    async getFCM(query) {
        var _a, _b;
        try {
            const whereList = ['1 = 1'];
            switch (query.searchType) {
                case 'email':
                    break;
                case 'name':
                    whereList.push(`(UPPER(JSON_EXTRACT(content, '$.name')) LIKE UPPER('%${(_a = query.search) !== null && _a !== void 0 ? _a : ''}%'))`);
                    break;
                case 'title':
                    whereList.push(`(UPPER(JSON_EXTRACT(content, '$.title')) LIKE UPPER('%${(_b = query.search) !== null && _b !== void 0 ? _b : ''}%'))`);
                    break;
            }
            if (query.status) {
                whereList.push(`(status in (${query.status}))`);
            }
            if (query.mailType) {
                const maiTypeString = query.mailType.replace(/[^,]+/g, "'$&'");
                whereList.push(`(JSON_EXTRACT(content, '$.type') in (${maiTypeString}))`);
            }
            const whereSQL = `(tag = 'sendFCM') AND ${whereList.join(' AND ')}`;
            const emails = await database_1.default.query(`SELECT *
         FROM \`${this.app}\`.t_triggers
         WHERE ${whereSQL}
         ORDER BY id DESC
           ${query.type === 'download' ? '' : `LIMIT ${query.page * query.limit}, ${query.limit}`};`, []);
            const total = await database_1.default.query(`SELECT count(id) as c
         FROM \`${this.app}\`.t_triggers
         WHERE ${whereSQL};`, []);
            for (const email of emails) {
                email.content.typeName = '手動發送';
            }
            return { data: emails, total: total[0].c };
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'getMail Error:' + e, null);
        }
    }
}
exports.Firebase = Firebase;
function isLater(dateTimeObj) {
    const currentDateTime = new Date();
    const { date, time } = dateTimeObj;
    const dateTimeString = `${date}T${time}:00`;
    const providedDateTime = new Date(dateTimeString);
    return currentDateTime > providedDateTime;
}
function chunkArray(array, groupSize) {
    const result = [];
    for (let i = 0; i < array.length; i += groupSize) {
        result.push(array.slice(i, i + groupSize));
    }
    return result;
}
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}
function formatDateTime(sendTime) {
    const dateTimeString = sendTime ? sendTime.date + ' ' + sendTime.time : undefined;
    const dateObject = dateTimeString ? new Date(dateTimeString) : new Date();
    return formatDate(dateObject);
}
//# sourceMappingURL=firebase.js.map