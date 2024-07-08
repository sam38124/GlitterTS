var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import path from "path";
import admin from "firebase-admin";
import { ConfigSetting } from "../config";
import db from "../modules/database";
export class Firebase {
    constructor(app) {
        this.app = '';
        this.app = app;
    }
    static initial() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`fireBaseInitial:${admin.credential.cert(path.resolve(ConfigSetting.config_path, `../${process.env.firebase}`))}`);
            admin.initializeApp({
                credential: admin.credential.cert(path.resolve(ConfigSetting.config_path, `../${process.env.firebase}`))
            }, 'glitter');
            admin.initializeApp({
                credential: admin.credential.cert(path.resolve(ConfigSetting.config_path, `../${process.env.firebase}`))
            });
        });
    }
    static appRegister(cf) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (cf.type === 'ios') {
                    yield admin
                        .projectManagement().createIosApp(cf.appID, cf.appName);
                }
                else {
                    yield admin
                        .projectManagement().createAndroidApp(cf.appID, cf.appName);
                }
            }
            catch (e) {
            }
        });
    }
    static getConfig(cf) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (cf.type === 'ios') {
                    for (const b of (yield (admin
                        .projectManagement().listIosApps()))) {
                        if ((yield b.getMetadata()).bundleId === cf.appID) {
                            yield b.setDisplayName(cf.appDomain);
                            return (yield b.getConfig());
                        }
                    }
                }
                else {
                    for (const b of (yield (admin
                        .projectManagement().listAndroidApps()))) {
                        if ((yield b.getMetadata()).packageName === cf.appID) {
                            yield b.setDisplayName(cf.appDomain);
                            return (yield b.getConfig());
                        }
                    }
                }
            }
            catch (e) {
                console.log(e);
                return '';
            }
        });
    }
    sendMessage(cf) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                if (cf.userID) {
                    cf.token = (yield db.query(`SELECT deviceToken
                                            FROM \`${cf.app || this.app}\`.t_fcm
                                            where userID = ?;`, [cf.userID])).map((dd) => {
                        return dd.deviceToken;
                    });
                    const user_cf = ((_a = ((yield db.query(`select \`value\`
                                                   from \`${cf.app || this.app}\`.t_user_public_config
                                                   where \`key\` ='notify_setting' and user_id=?`, [cf.userID]))[0])) !== null && _a !== void 0 ? _a : { value: {} }).value;
                    if (`${user_cf[cf.tag]}` !== 'false') {
                        if (cf.userID && cf.tag && cf.title && cf.body && cf.link) {
                            yield db.query(`insert into \`${cf.app || this.app}\`.t_notice (user_id, tag, title, content, link)
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
                        admin.apps.find((dd) => {
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
                            resolve(true);
                            console.log('成功發送推播：', response);
                        }).catch((error) => {
                            resolve(false);
                            console.error('發送推播時發生錯誤：', error);
                        });
                    }
                }
            }));
        });
    }
}
