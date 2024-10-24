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
class Firebase {
    constructor(app) {
        this.app = '';
        this.app = app;
    }
    static async initial() {
        console.log(`fireBaseInitial:${firebase_admin_1.default.credential.cert(path_1.default.resolve(config_1.ConfigSetting.config_path, `../${process.env.firebase}`))}`);
        firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.cert(path_1.default.resolve(config_1.ConfigSetting.config_path, `../${process.env.firebase}`))
        }, 'glitter');
        firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.cert(path_1.default.resolve(config_1.ConfigSetting.config_path, `../${process.env.firebase}`))
        });
    }
    static async appRegister(cf) {
        try {
            if (cf.type === 'ios') {
                await firebase_admin_1.default
                    .projectManagement().createIosApp(cf.appID, cf.appName);
            }
            else {
                await firebase_admin_1.default
                    .projectManagement().createAndroidApp(cf.appID, cf.appName);
            }
        }
        catch (e) {
        }
    }
    static async getConfig(cf) {
        try {
            if (cf.type === 'ios') {
                for (const b of (await (firebase_admin_1.default
                    .projectManagement().listIosApps()))) {
                    if ((await b.getMetadata()).bundleId === cf.appID) {
                        await b.setDisplayName(cf.appDomain);
                        return (await b.getConfig());
                    }
                }
            }
            else {
                for (const b of (await (firebase_admin_1.default
                    .projectManagement().listAndroidApps()))) {
                    if ((await b.getMetadata()).packageName === cf.appID) {
                        await b.setDisplayName(cf.appDomain);
                        return (await b.getConfig());
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
        cf.body = cf.body.replace(/<br\s*\/?>/gi, '\n');
        if (cf.userID) {
            web_socket_js_1.WebSocket.noticeChangeMem[cf.userID] && web_socket_js_1.WebSocket.noticeChangeMem[cf.userID].map((d2) => {
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
                const user_cf = ((_a = ((await database_1.default.query(`select \`value\`
                                                   from \`${cf.app || this.app}\`.t_user_public_config
                                                   where \`key\` ='notify_setting' and user_id=?`, [cf.userID]))[0])) !== null && _a !== void 0 ? _a : { value: {} }).value;
                if (`${user_cf[cf.tag]}` !== 'false') {
                    if (cf.userID && cf.tag && cf.title && cf.body && cf.link && !cf.pass_store) {
                        await database_1.default.query(`insert into \`${cf.app || this.app}\`.t_notice (user_id, tag, title, content, link)
                                        values (?, ?, ?, ?, ?)`, [
                            cf.userID,
                            cf.tag,
                            cf.title,
                            cf.body,
                            cf.link
                        ]);
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
                for (const token of cf.token) {
                    firebase_admin_1.default.apps.find((dd) => {
                        return (dd === null || dd === void 0 ? void 0 : dd.name) === 'glitter';
                    }).messaging().send({
                        notification: {
                            title: cf.title,
                            body: cf.body.replace(/<br>/g, ''),
                        },
                        android: {
                            notification: {
                                sound: 'default'
                            },
                        },
                        apns: {
                            payload: {
                                aps: {
                                    sound: 'default'
                                },
                            },
                        },
                        data: {
                            link: cf.link
                        },
                        "token": token
                    }).then((response) => {
                        console.log('成功發送推播：', response);
                    }).catch((error) => {
                        console.error('發送推播時發生錯誤：', error);
                    });
                }
            }
            resolve(true);
        });
    }
}
exports.Firebase = Firebase;
//# sourceMappingURL=firebase.js.map