"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
function sendMessage(key, message, appName) {
    var _a;
    const messaging = (_a = (firebase_admin_1.default.apps.find((dd) => (dd === null || dd === void 0 ? void 0 : dd.name) == appName))) !== null && _a !== void 0 ? _a : firebase_admin_1.default.initializeApp({ credential: firebase_admin_1.default.credential.cert(key) }, appName);
    const postConfig = {};
    postConfig[message.type] = message.for;
    postConfig.notification = message.notification;
    (messaging).messaging().send(postConfig)
        .then((response) => {
        console.log('成功發送推播：', response);
    })
        .catch((error) => {
        console.error('發送推播時發生錯誤：', error);
    });
}
exports.sendMessage = sendMessage;
//# sourceMappingURL=message.js.map