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
class Firebase {
    constructor(app) {
        this.app = '';
        this.app = app;
    }
    static async initial() {
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
                    if ((await b.getMetadata()).projectId === cf.appID) {
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
        return new Promise(async (resolve, reject) => {
            if (cf.userID) {
                cf.token = (await database_1.default.query(`SELECT deviceToken FROM \`${this.app}\`.t_fcm;`, []))[0]['deviceToken'];
            }
            firebase_admin_1.default.apps.find((dd) => {
                return (dd === null || dd === void 0 ? void 0 : dd.name) === 'glitter';
            }).messaging().send({
                notification: {
                    title: cf.title,
                    body: cf.body
                },
                "token": cf.token
            }).then((response) => {
                resolve(true);
                console.log('成功發送推播：', response);
            }).catch((error) => {
                resolve(false);
                console.error('發送推播時發生錯誤：', error);
            });
        });
    }
}
exports.Firebase = Firebase;
//# sourceMappingURL=firebase.js.map