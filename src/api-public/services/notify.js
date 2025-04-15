"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagerNotify = void 0;
var config_js_1 = require("../../config.js");
var database_js_1 = require("../../modules/database.js");
var firebase_js_1 = require("../../modules/firebase.js");
var ses_js_1 = require("../../services/ses.js");
var process_1 = require("process");
var sms_js_1 = require("./sms.js");
var line_message_js_1 = require("./line-message.js");
var exception_js_1 = require("../../modules/exception.js");
var html = String.raw;
var ManagerNotify = /** @class */ (function () {
    function ManagerNotify(app_name) {
        this.app_name = app_name;
    }
    // 取得商家資料
    ManagerNotify.prototype.getSaasAPP = function () {
        return __awaiter(this, void 0, void 0, function () {
            var return_data, account;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_js_1.default.query("SELECT brand, user\n                 FROM `".concat(config_js_1.saasConfig.SAAS_NAME, "`.app_config\n                 WHERE appName = ?"), [this.app_name])];
                    case 1:
                        return_data = (_a.sent())[0];
                        return [4 /*yield*/, database_js_1.default.query("SELECT account, userData\n             FROM `".concat(return_data.brand, "`.t_user\n             WHERE userID = ?"), [return_data.user])];
                    case 2:
                        account = _a.sent();
                        return_data.account = account[0].account;
                        return_data.userData = account[0].userData;
                        return [2 /*return*/, return_data];
                }
            });
        });
    };
    // 取得商家通知設定
    ManagerNotify.prototype.getSaasSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var setting;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_js_1.default.query(" SELECT * FROM `".concat(this.app_name, "`.t_user_public_config \n                WHERE `key` = 'notify_setting';"), [this.app_name])];
                    case 1:
                        setting = (_a.sent())[0];
                        return [2 /*return*/, (function () {
                                try {
                                    return setting.value.data;
                                }
                                catch (e) {
                                    return [];
                                }
                            })()];
                }
            });
        });
    };
    // 取得通知狀態
    ManagerNotify.prototype.findSetting = function (settings, type, key) {
        if (settings.length == 0) {
            return false;
        }
        var setting = settings.find(function (item) { return item.type === type; });
        if (setting === undefined || setting.list === undefined || setting.list.length === 0) {
            return false;
        }
        var tag = setting.list.find(function (item) { return item.key === key; });
        if (tag === undefined) {
            return false;
        }
        return tag.status;
    };
    // 商家信件固定格式
    ManagerNotify.prototype.sendEmail = function (email, title, content, href) {
        return __awaiter(this, void 0, void 0, function () {
            var html_1, text;
            return __generator(this, function (_a) {
                try {
                    html_1 = String.raw;
                    text = html_1(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n                <table\n                    width=\"100%\"\n                    border=\"0\"\n                    cellpadding=\"0\"\n                    cellspacing=\"0\"\n                    style=\"box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%; color: rgb(65, 65, 65); font-family: sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; background-color: rgb(255, 255, 255);\"\n                    id=\"isPasted\"\n                >\n                    <tbody style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\">\n                        <tr style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\">\n                            <td style=\"box-sizing: border-box; border: 0px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px;\">\n                                <table\n                                    align=\"center\"\n                                    width=\"100%\"\n                                    border=\"0\"\n                                    cellpadding=\"0\"\n                                    cellspacing=\"0\"\n                                    style=\"box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; --bs-gutter-x: 1.5rem; --bs-gutter-y: 0; display: flex; flex-wrap: wrap; margin-top: calc(-1 * var(--bs-gutter-y)); margin-right: calc(-0.5 * var(--bs-gutter-x)); margin-left: calc(-0.5 * var(--bs-gutter-x)); border: none; empty-cells: show; max-width: 100%;\"\n                                >\n                                    <tbody\n                                        style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased; flex-shrink: 0; width: 1055.59px; max-width: 100%; padding-right: calc(var(--bs-gutter-x) * 0.5); padding-left: calc(var(--bs-gutter-x) * 0.5); margin-top: var(--bs-gutter-y);\"\n                                    >\n                                        <tr style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\">\n                                            <td style=\"box-sizing: border-box; border: 0px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px;\">\n                                                <table\n                                                    align=\"center\"\n                                                    border=\"0\"\n                                                    cellpadding=\"0\"\n                                                    cellspacing=\"0\"\n                                                    width=\"600\"\n                                                    style=\"box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%; color: rgb(0, 0, 0); width: 600px; margin: 0px auto;\"\n                                                >\n                                                    <tbody style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\">\n                                                        <tr style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\">\n                                                            <td\n                                                                width=\"100%\"\n                                                                style=\"box-sizing: border-box; border: 0px; -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;\"\n                                                            >\n                                                                <table\n                                                                    width=\"100%\"\n                                                                    border=\"0\"\n                                                                    cellpadding=\"0\"\n                                                                    cellspacing=\"0\"\n                                                                    style=\"box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%;\"\n                                                                >\n                                                                    <tbody\n                                                                        style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\"\n                                                                    >\n                                                                        <tr\n                                                                            style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\"\n                                                                        >\n                                                                            <td\n                                                                                style=\"box-sizing: border-box; border: 1px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px; width: 599px;\"\n                                                                            >\n                                                                                <div align=\"center\" style=\"box-sizing: border-box; -webkit-font-smoothing: antialiased; line-height: 10px;\">\n                                                                                    <div style=\"box-sizing: border-box; -webkit-font-smoothing: antialiased; max-width: 600px;\">\n                                                                                        <img\n                                                                                            src=\"https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1719903595261-s3s4scs3s7sfsfs7.png\"\n                                                                                            class=\"fr-fic fr-dii\"\n                                                                                            style=\"width: 100%;\"\n                                                                                        />\n                                                                                        <br />\n                                                                                    </div>\n                                                                                </div>\n                                                                            </td>\n                                                                        </tr>\n                                                                    </tbody>\n                                                                </table>\n\n                                                                <table\n                                                                    width=\"100%\"\n                                                                    border=\"0\"\n                                                                    cellpadding=\"0\"\n                                                                    cellspacing=\"0\"\n                                                                    style=\"box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%;\"\n                                                                >\n                                                                    <tbody\n                                                                        style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\"\n                                                                    >\n                                                                        <tr\n                                                                            style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\"\n                                                                        >\n                                                                            <td\n                                                                                style=\"box-sizing: border-box; border: 1px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px; padding: 60px 45px 30px; text-align: left; width: 599px;\"\n                                                                            >\n                                                                                <h1\n                                                                                    style=\"box-sizing: border-box; margin: 0px; font-weight: 700; line-height: 33.6px; color: rgb(54, 54, 54); font-size: 28px; -webkit-font-smoothing: antialiased; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; direction: ltr; font-family: Arial, Helvetica, sans-serif; text-align: left;\"\n                                                                                    id=\"isPasted\"\n                                                                                >\n                                                                                    \u8A0A\u606F\u901A\u77E5\n                                                                                </h1>\n                                                                                <br />\n                                                                                <div style=\"width: 100%;text-align: start;\">@{{text}}</div>\n                                                                                <br />\n                                                                                <br /><span\n                                                                                    style=\"color: rgb(16, 17, 18); font-family: Arial, Helvetica, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;\"\n                                                                                    ><a\n                                                                                        href=\"", "\"\n                                                                                        target=\"_blank\"\n                                                                                        style=\"box-sizing: border-box; color: rgb(255, 255, 255); text-decoration: none; -webkit-font-smoothing: antialiased; transition: color 0.2s ease-in-out 0s; user-select: auto; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 148, 2); border-width: 0px; border-style: solid; border-color: transparent; border-radius: 5px; display: inline-block; font-family: Arial, Helvetica, sans-serif; font-size: 24px; padding-bottom: 15px; padding-top: 15px; text-align: center; width: auto; word-break: keep-all;\"\n                                                                                        id=\"isPasted\"\n                                                                                        ><span\n                                                                                            style=\"box-sizing: border-box; -webkit-font-smoothing: antialiased; padding-left: 30px; padding-right: 30px; font-size: 24px; display: inline-block; letter-spacing: normal;\"\n                                                                                            ><span\n                                                                                                style=\"box-sizing: border-box; -webkit-font-smoothing: antialiased; word-break: break-word; line-height: 48px;\"\n                                                                                                ><strong style=\"box-sizing: border-box; font-weight: 700; -webkit-font-smoothing: antialiased;\"\n                                                                                                    >\u524D\u5F80\u5546\u5E97</strong\n                                                                                                ></span\n                                                                                            ></span\n                                                                                        ></a\n                                                                                    ></span\n                                                                                >\n                                                                                <br />\n                                                                            </td>\n                                                                        </tr>\n                                                                    </tbody>\n                                                                </table>\n\n                                                                <table\n                                                                    width=\"100%\"\n                                                                    border=\"0\"\n                                                                    cellpadding=\"0\"\n                                                                    cellspacing=\"0\"\n                                                                    style=\"box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%; word-break: break-word; background-color: rgb(247, 247, 247);\"\n                                                                >\n                                                                    <tbody\n                                                                        style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\"\n                                                                    >\n                                                                        <tr\n                                                                            style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\"\n                                                                        >\n                                                                            <td\n                                                                                style=\"box-sizing: border-box; border: 1px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px; padding: 28px 45px 10px;\"\n                                                                            >\n                                                                                <div\n                                                                                    style=\"box-sizing: border-box; -webkit-font-smoothing: antialiased; color: rgb(16, 17, 18); direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 16px; font-weight: 400; letter-spacing: 0px; line-height: 19.2px; text-align: left;\"\n                                                                                >\n                                                                                    <p style=\"box-sizing: border-box; margin-top: 0px; margin-bottom: 1.25rem; -webkit-font-smoothing: antialiased;\">\n                                                                                        \u5982\u679C\u60A8\u6709\u4EFB\u4F55\u7591\u554F\u6216\u9700\u8981\u5E6B\u52A9\uFF0C\u6211\u5011\u7684\u5718\u968A\u96A8\u6642\u5728\u9019\u88E1\u70BA\u60A8\u63D0\u4F9B\u652F\u6301\u3002\n                                                                                    </p>\n\n                                                                                    <p style=\"box-sizing: border-box; margin-top: 0px; margin-bottom: 1.25rem; -webkit-font-smoothing: antialiased;\">\n                                                                                        \u670D\u52D9\u96FB\u8A71\uFF1A+886 978-028-730\n                                                                                    </p>\n\n                                                                                    <p style=\"box-sizing: border-box; margin-top: 0px; margin-bottom: 1.25rem; -webkit-font-smoothing: antialiased;\">\n                                                                                        \u96FB\u5B50\u90F5\u4EF6\uFF1Amk@ncdesign.info\n                                                                                    </p>\n                                                                                </div>\n                                                                            </td>\n                                                                        </tr>\n                                                                    </tbody>\n                                                                </table>\n\n                                                                <table\n                                                                    width=\"100%\"\n                                                                    border=\"0\"\n                                                                    cellpadding=\"0\"\n                                                                    cellspacing=\"0\"\n                                                                    style=\"box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%; word-break: break-word; background-color: rgb(247, 247, 247);\"\n                                                                >\n                                                                    <tbody\n                                                                        style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\"\n                                                                    >\n                                                                        <tr\n                                                                            style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\"\n                                                                        >\n                                                                            <td\n                                                                                style=\"box-sizing: border-box; border: 1px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px; padding: 20px 10px 10px;\"\n                                                                            >\n                                                                                <div\n                                                                                    style=\"box-sizing: border-box; -webkit-font-smoothing: antialiased; color: rgb(16, 17, 18); direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 400; letter-spacing: 0px; line-height: 16.8px; text-align: center;\"\n                                                                                >\n                                                                                    <p style=\"box-sizing: border-box; margin-top: 0px; margin-bottom: 1.25rem; -webkit-font-smoothing: antialiased;\">\n                                                                                        <a\n                                                                                            href=\"https://shopnex.tw/?article=termsofservice&page=blog_detail\"\n                                                                                            target=\"_blank\"\n                                                                                            rel=\"noopener\"\n                                                                                            style=\"box-sizing: border-box; color: rgb(28, 28, 28); text-decoration: underline; -webkit-font-smoothing: antialiased; transition: color 0.2s ease-in-out 0s; user-select: auto;\"\n                                                                                            >\u670D\u52D9\u689D\u6B3E</a\n                                                                                        >\n                                                                                        <a\n                                                                                            href=\"https://shopnex.tw/?article=privacyterms&page=blog_detail\"\n                                                                                            target=\"_blank\"\n                                                                                            rel=\"noopener\"\n                                                                                            style=\"box-sizing: border-box; color: rgb(28, 28, 28); text-decoration: underline; -webkit-font-smoothing: antialiased; transition: color 0.2s ease-in-out 0s; user-select: auto;\"\n                                                                                            >\u96B1\u79C1\u689D\u6B3E</a\n                                                                                        >&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;\n                                                                                        <a\n                                                                                            href=\"https://shopnex.tw/?article=privacyterms&page=e-commerce-blog\"\n                                                                                            target=\"_blank\"\n                                                                                            rel=\"noopener\"\n                                                                                            style=\"box-sizing: border-box; color: rgb(28, 28, 28); text-decoration: underline; -webkit-font-smoothing: antialiased; transition: color 0.2s ease-in-out 0s; user-select: auto;\"\n                                                                                            >\u958B\u5E97\u6559\u5B78</a\n                                                                                        >\n                                                                                    </p>\n                                                                                </div>\n                                                                            </td>\n                                                                        </tr>\n                                                                    </tbody>\n                                                                </table>\n                                                            </td>\n                                                        </tr>\n                                                    </tbody>\n                                                </table>\n                                            </td>\n                                        </tr>\n                                    </tbody>\n                                </table>\n                            </td>\n                        </tr>\n                    </tbody>\n                </table>\n            "], ["\n                <table\n                    width=\"100%\"\n                    border=\"0\"\n                    cellpadding=\"0\"\n                    cellspacing=\"0\"\n                    style=\"box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%; color: rgb(65, 65, 65); font-family: sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; background-color: rgb(255, 255, 255);\"\n                    id=\"isPasted\"\n                >\n                    <tbody style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\">\n                        <tr style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\">\n                            <td style=\"box-sizing: border-box; border: 0px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px;\">\n                                <table\n                                    align=\"center\"\n                                    width=\"100%\"\n                                    border=\"0\"\n                                    cellpadding=\"0\"\n                                    cellspacing=\"0\"\n                                    style=\"box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; --bs-gutter-x: 1.5rem; --bs-gutter-y: 0; display: flex; flex-wrap: wrap; margin-top: calc(-1 * var(--bs-gutter-y)); margin-right: calc(-0.5 * var(--bs-gutter-x)); margin-left: calc(-0.5 * var(--bs-gutter-x)); border: none; empty-cells: show; max-width: 100%;\"\n                                >\n                                    <tbody\n                                        style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased; flex-shrink: 0; width: 1055.59px; max-width: 100%; padding-right: calc(var(--bs-gutter-x) * 0.5); padding-left: calc(var(--bs-gutter-x) * 0.5); margin-top: var(--bs-gutter-y);\"\n                                    >\n                                        <tr style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\">\n                                            <td style=\"box-sizing: border-box; border: 0px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px;\">\n                                                <table\n                                                    align=\"center\"\n                                                    border=\"0\"\n                                                    cellpadding=\"0\"\n                                                    cellspacing=\"0\"\n                                                    width=\"600\"\n                                                    style=\"box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%; color: rgb(0, 0, 0); width: 600px; margin: 0px auto;\"\n                                                >\n                                                    <tbody style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\">\n                                                        <tr style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\">\n                                                            <td\n                                                                width=\"100%\"\n                                                                style=\"box-sizing: border-box; border: 0px; -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;\"\n                                                            >\n                                                                <table\n                                                                    width=\"100%\"\n                                                                    border=\"0\"\n                                                                    cellpadding=\"0\"\n                                                                    cellspacing=\"0\"\n                                                                    style=\"box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%;\"\n                                                                >\n                                                                    <tbody\n                                                                        style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\"\n                                                                    >\n                                                                        <tr\n                                                                            style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\"\n                                                                        >\n                                                                            <td\n                                                                                style=\"box-sizing: border-box; border: 1px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px; width: 599px;\"\n                                                                            >\n                                                                                <div align=\"center\" style=\"box-sizing: border-box; -webkit-font-smoothing: antialiased; line-height: 10px;\">\n                                                                                    <div style=\"box-sizing: border-box; -webkit-font-smoothing: antialiased; max-width: 600px;\">\n                                                                                        <img\n                                                                                            src=\"https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1719903595261-s3s4scs3s7sfsfs7.png\"\n                                                                                            class=\"fr-fic fr-dii\"\n                                                                                            style=\"width: 100%;\"\n                                                                                        />\n                                                                                        <br />\n                                                                                    </div>\n                                                                                </div>\n                                                                            </td>\n                                                                        </tr>\n                                                                    </tbody>\n                                                                </table>\n\n                                                                <table\n                                                                    width=\"100%\"\n                                                                    border=\"0\"\n                                                                    cellpadding=\"0\"\n                                                                    cellspacing=\"0\"\n                                                                    style=\"box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%;\"\n                                                                >\n                                                                    <tbody\n                                                                        style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\"\n                                                                    >\n                                                                        <tr\n                                                                            style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\"\n                                                                        >\n                                                                            <td\n                                                                                style=\"box-sizing: border-box; border: 1px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px; padding: 60px 45px 30px; text-align: left; width: 599px;\"\n                                                                            >\n                                                                                <h1\n                                                                                    style=\"box-sizing: border-box; margin: 0px; font-weight: 700; line-height: 33.6px; color: rgb(54, 54, 54); font-size: 28px; -webkit-font-smoothing: antialiased; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; direction: ltr; font-family: Arial, Helvetica, sans-serif; text-align: left;\"\n                                                                                    id=\"isPasted\"\n                                                                                >\n                                                                                    \u8A0A\u606F\u901A\u77E5\n                                                                                </h1>\n                                                                                <br />\n                                                                                <div style=\"width: 100%;text-align: start;\">@{{text}}</div>\n                                                                                <br />\n                                                                                <br /><span\n                                                                                    style=\"color: rgb(16, 17, 18); font-family: Arial, Helvetica, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;\"\n                                                                                    ><a\n                                                                                        href=\"", "\"\n                                                                                        target=\"_blank\"\n                                                                                        style=\"box-sizing: border-box; color: rgb(255, 255, 255); text-decoration: none; -webkit-font-smoothing: antialiased; transition: color 0.2s ease-in-out 0s; user-select: auto; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 148, 2); border-width: 0px; border-style: solid; border-color: transparent; border-radius: 5px; display: inline-block; font-family: Arial, Helvetica, sans-serif; font-size: 24px; padding-bottom: 15px; padding-top: 15px; text-align: center; width: auto; word-break: keep-all;\"\n                                                                                        id=\"isPasted\"\n                                                                                        ><span\n                                                                                            style=\"box-sizing: border-box; -webkit-font-smoothing: antialiased; padding-left: 30px; padding-right: 30px; font-size: 24px; display: inline-block; letter-spacing: normal;\"\n                                                                                            ><span\n                                                                                                style=\"box-sizing: border-box; -webkit-font-smoothing: antialiased; word-break: break-word; line-height: 48px;\"\n                                                                                                ><strong style=\"box-sizing: border-box; font-weight: 700; -webkit-font-smoothing: antialiased;\"\n                                                                                                    >\u524D\u5F80\u5546\u5E97</strong\n                                                                                                ></span\n                                                                                            ></span\n                                                                                        ></a\n                                                                                    ></span\n                                                                                >\n                                                                                <br />\n                                                                            </td>\n                                                                        </tr>\n                                                                    </tbody>\n                                                                </table>\n\n                                                                <table\n                                                                    width=\"100%\"\n                                                                    border=\"0\"\n                                                                    cellpadding=\"0\"\n                                                                    cellspacing=\"0\"\n                                                                    style=\"box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%; word-break: break-word; background-color: rgb(247, 247, 247);\"\n                                                                >\n                                                                    <tbody\n                                                                        style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\"\n                                                                    >\n                                                                        <tr\n                                                                            style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\"\n                                                                        >\n                                                                            <td\n                                                                                style=\"box-sizing: border-box; border: 1px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px; padding: 28px 45px 10px;\"\n                                                                            >\n                                                                                <div\n                                                                                    style=\"box-sizing: border-box; -webkit-font-smoothing: antialiased; color: rgb(16, 17, 18); direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 16px; font-weight: 400; letter-spacing: 0px; line-height: 19.2px; text-align: left;\"\n                                                                                >\n                                                                                    <p style=\"box-sizing: border-box; margin-top: 0px; margin-bottom: 1.25rem; -webkit-font-smoothing: antialiased;\">\n                                                                                        \u5982\u679C\u60A8\u6709\u4EFB\u4F55\u7591\u554F\u6216\u9700\u8981\u5E6B\u52A9\uFF0C\u6211\u5011\u7684\u5718\u968A\u96A8\u6642\u5728\u9019\u88E1\u70BA\u60A8\u63D0\u4F9B\u652F\u6301\u3002\n                                                                                    </p>\n\n                                                                                    <p style=\"box-sizing: border-box; margin-top: 0px; margin-bottom: 1.25rem; -webkit-font-smoothing: antialiased;\">\n                                                                                        \u670D\u52D9\u96FB\u8A71\uFF1A+886 978-028-730\n                                                                                    </p>\n\n                                                                                    <p style=\"box-sizing: border-box; margin-top: 0px; margin-bottom: 1.25rem; -webkit-font-smoothing: antialiased;\">\n                                                                                        \u96FB\u5B50\u90F5\u4EF6\uFF1Amk@ncdesign.info\n                                                                                    </p>\n                                                                                </div>\n                                                                            </td>\n                                                                        </tr>\n                                                                    </tbody>\n                                                                </table>\n\n                                                                <table\n                                                                    width=\"100%\"\n                                                                    border=\"0\"\n                                                                    cellpadding=\"0\"\n                                                                    cellspacing=\"0\"\n                                                                    style=\"box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%; word-break: break-word; background-color: rgb(247, 247, 247);\"\n                                                                >\n                                                                    <tbody\n                                                                        style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\"\n                                                                    >\n                                                                        <tr\n                                                                            style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\"\n                                                                        >\n                                                                            <td\n                                                                                style=\"box-sizing: border-box; border: 1px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px; padding: 20px 10px 10px;\"\n                                                                            >\n                                                                                <div\n                                                                                    style=\"box-sizing: border-box; -webkit-font-smoothing: antialiased; color: rgb(16, 17, 18); direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 400; letter-spacing: 0px; line-height: 16.8px; text-align: center;\"\n                                                                                >\n                                                                                    <p style=\"box-sizing: border-box; margin-top: 0px; margin-bottom: 1.25rem; -webkit-font-smoothing: antialiased;\">\n                                                                                        <a\n                                                                                            href=\"https://shopnex.tw/?article=termsofservice&page=blog_detail\"\n                                                                                            target=\"_blank\"\n                                                                                            rel=\"noopener\"\n                                                                                            style=\"box-sizing: border-box; color: rgb(28, 28, 28); text-decoration: underline; -webkit-font-smoothing: antialiased; transition: color 0.2s ease-in-out 0s; user-select: auto;\"\n                                                                                            >\u670D\u52D9\u689D\u6B3E</a\n                                                                                        >\n                                                                                        <a\n                                                                                            href=\"https://shopnex.tw/?article=privacyterms&page=blog_detail\"\n                                                                                            target=\"_blank\"\n                                                                                            rel=\"noopener\"\n                                                                                            style=\"box-sizing: border-box; color: rgb(28, 28, 28); text-decoration: underline; -webkit-font-smoothing: antialiased; transition: color 0.2s ease-in-out 0s; user-select: auto;\"\n                                                                                            >\u96B1\u79C1\u689D\u6B3E</a\n                                                                                        >&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;\n                                                                                        <a\n                                                                                            href=\"https://shopnex.tw/?article=privacyterms&page=e-commerce-blog\"\n                                                                                            target=\"_blank\"\n                                                                                            rel=\"noopener\"\n                                                                                            style=\"box-sizing: border-box; color: rgb(28, 28, 28); text-decoration: underline; -webkit-font-smoothing: antialiased; transition: color 0.2s ease-in-out 0s; user-select: auto;\"\n                                                                                            >\u958B\u5E97\u6559\u5B78</a\n                                                                                        >\n                                                                                    </p>\n                                                                                </div>\n                                                                            </td>\n                                                                        </tr>\n                                                                    </tbody>\n                                                                </table>\n                                                            </td>\n                                                        </tr>\n                                                    </tbody>\n                                                </table>\n                                            </td>\n                                        </tr>\n                                    </tbody>\n                                </table>\n                            </td>\n                        </tr>\n                    </tbody>\n                </table>\n            "])), new URL(href, 'https://shopnex.tw'));
                    (0, ses_js_1.sendmail)("SHOPNEX <".concat(process_1.default.env.smtp, ">"), email, title, text.replace('@{{text}}', content));
                }
                catch (e) {
                    console.error(e);
                    throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'sendEmail Error:' + e, null);
                }
                return [2 /*return*/];
            });
        });
    };
    // 判斷是否進行推播通知
    ManagerNotify.prototype.checkNotify = function (tag) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, true];
            });
        });
    };
    // SHOPNEX 註冊通知事項
    ManagerNotify.prototype.saasRegister = function (cf) {
        return __awaiter(this, void 0, void 0, function () {
            var link;
            return __generator(this, function (_a) {
                link = "https://shopnex.tw/contact-us";
                new firebase_js_1.Firebase(this.app_name).sendMessage({
                    title: "\u6B61\u8FCE\u4F7F\u7528 SHOPNEX",
                    userID: cf.user_id,
                    tag: 'welcome',
                    link: link,
                    body: "\u6B61\u8FCE\u4F7F\u7528 SHOPNEX \u958B\u5E97\u5E73\u53F0\uFF0C\u7ACB\u5373\u64A5\u6253\u8AEE\u8A62\u96FB\u8A71: 0978028730\uFF0C\u63D0\u4F9B\u514D\u8CBB\u8AEE\u8A62\u670D\u52D9\u3002",
                });
                return [2 /*return*/];
            });
        });
    };
    // 商品出貨
    // 商品到貨
    // 訂單成立與付款成功
    ManagerNotify.prototype.checkout = function (cf) {
        return __awaiter(this, void 0, void 0, function () {
            var saas, link, body, settings, setKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSaasAPP()];
                    case 1:
                        saas = _a.sent();
                        link = "./index?type=editor&appName=".concat(this.app_name, "&function=backend-manger&tab=order_list");
                        body = html(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\u60A8\u6709\u4E00\u7B46\u65B0\u8A02\u55AE <br />\u300E ", " \u300F", "\uFF0C\u6D88\u8CBB\u7E3D\u91D1\u984D\uFF1A", " \u3002"], ["\u60A8\u6709\u4E00\u7B46\u65B0\u8A02\u55AE <br />\u300E ", " \u300F", "\uFF0C\u6D88\u8CBB\u7E3D\u91D1\u984D\uFF1A", " \u3002"])), cf.orderData.orderID, cf.status ? "\u5DF2\u4ED8\u6B3E" : "\u5C1A\u672A\u4ED8\u6B3E", parseInt("".concat(cf.orderData.total), 10).toLocaleString());
                        new firebase_js_1.Firebase(saas.brand).sendMessage({
                            title: "\u60A8\u6709\u65B0\u8A02\u55AE",
                            userID: saas.user,
                            tag: 'checkout',
                            link: link,
                            body: body,
                        });
                        return [4 /*yield*/, this.getSaasSettings()];
                    case 2:
                        settings = _a.sent();
                        setKey = cf.status ? 'auto-email-payment-successful' : 'auto-email-order-create';
                        if (!this.findSetting(settings, 'email', setKey)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.sendEmail(saas.userData.email, '您有一筆新的訂單', body, link)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (this.findSetting(settings, 'sms', setKey)) {
                            new sms_js_1.SMS(this.app_name).sendSNS({ data: body, phone: saas.userData.phone }, function () { });
                        }
                        if (this.findSetting(settings, 'line', setKey)) {
                            new line_message_js_1.LineMessage(saas.brand).sendLine({
                                data: {
                                    text: body,
                                    attachment: '',
                                },
                                lineID: saas.userData.lineID,
                            }, function () { });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // 訂單待核款
    ManagerNotify.prototype.uploadProof = function (cf) {
        return __awaiter(this, void 0, void 0, function () {
            var saas, link, body, settings, setKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSaasAPP()];
                    case 1:
                        saas = _a.sent();
                        link = "./index?type=editor&appName=".concat(this.app_name, "&function=backend-manger&tab=order_list");
                        body = html(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\u9867\u5BA2\u5DF2\u4E0A\u50B3\u4ED8\u6B3E\u8B49\u660E\uFF0C\u60A8\u6709\u4E00\u7B46\u65B0\u589E\u7684\u5F85\u6838\u6B3E\u8A02\u55AE\uFF0C\u8A02\u55AE\u7DE8\u865F \u300E ", " \u300F\u3002"], ["\u9867\u5BA2\u5DF2\u4E0A\u50B3\u4ED8\u6B3E\u8B49\u660E\uFF0C\u60A8\u6709\u4E00\u7B46\u65B0\u589E\u7684\u5F85\u6838\u6B3E\u8A02\u55AE\uFF0C\u8A02\u55AE\u7DE8\u865F \u300E ", " \u300F\u3002"])), cf.orderData.orderID);
                        new firebase_js_1.Firebase(saas.brand).sendMessage({
                            title: '待核款訂單',
                            userID: saas.user,
                            tag: 'checkout-upload-proof',
                            link: link,
                            body: body,
                        });
                        return [4 /*yield*/, this.getSaasSettings()];
                    case 2:
                        settings = _a.sent();
                        setKey = 'proof-purchase';
                        if (!this.findSetting(settings, 'email', setKey)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.sendEmail(saas.userData.email, '您有一筆待核款的訂單', body, link)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (this.findSetting(settings, 'sms', setKey)) {
                            new sms_js_1.SMS(this.app_name).sendSNS({ data: body, phone: saas.userData.phone }, function () { });
                        }
                        if (this.findSetting(settings, 'line', setKey)) {
                            new line_message_js_1.LineMessage(saas.brand).sendLine({
                                data: {
                                    text: body,
                                    attachment: '',
                                },
                                lineID: saas.userData.lineID,
                            }, function () { });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // 新用戶註冊
    ManagerNotify.prototype.userRegister = function (cf) {
        return __awaiter(this, void 0, void 0, function () {
            var saas, user_data, link, body, settings, setKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.app_name === 'shopnex')) return [3 /*break*/, 2];
                        this.saasRegister({
                            user_id: cf.user_id,
                        });
                        //贈送Ai-points
                        return [4 /*yield*/, database_js_1.default.query("insert into `shopnex`.t_ai_points (orderID,userID,money,status,note) values (?,?,?,?,?)", [
                                "".concat(new Date().getTime()),
                                cf.user_id,
                                500,
                                1,
                                JSON.stringify({ text: '註冊贈送500點AI Points', type: 'free' })
                            ])];
                    case 1:
                        //贈送Ai-points
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.getSaasAPP()];
                    case 3:
                        saas = _a.sent();
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n                 FROM `".concat(this.app_name, "`.t_user\n                 WHERE userID = ?"), [cf.user_id])];
                    case 4:
                        user_data = (_a.sent())[0];
                        return [4 /*yield*/, this.checkNotify('register')];
                    case 5:
                        if (!_a.sent()) return [3 /*break*/, 9];
                        link = "./index?type=editor&appName=".concat(this.app_name, "&function=backend-manger&tab=user_list");
                        body = html(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\u65B0\u7528\u6236\u300E ", " \u300F\u8A3B\u518A\u4E86\u5E33\u865F\u3002"], ["\u65B0\u7528\u6236\u300E ", " \u300F\u8A3B\u518A\u4E86\u5E33\u865F\u3002"])), user_data.userData.name || user_data.account);
                        new firebase_js_1.Firebase(saas.brand).sendMessage({
                            title: "\u5E33\u865F\u8A3B\u518A\u901A\u77E5",
                            userID: saas.user,
                            tag: 'register',
                            link: link,
                            body: body,
                        });
                        return [4 /*yield*/, this.getSaasSettings()];
                    case 6:
                        settings = _a.sent();
                        setKey = 'user-register';
                        if (!this.findSetting(settings, 'email', setKey)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.sendEmail(saas.userData.email, '帳號註冊通知', body, link)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        if (this.findSetting(settings, 'sms', setKey)) {
                            new sms_js_1.SMS(this.app_name).sendSNS({ data: body, phone: saas.userData.phone }, function () { });
                        }
                        if (this.findSetting(settings, 'line', setKey)) {
                            new line_message_js_1.LineMessage(saas.brand).sendLine({
                                data: {
                                    text: body,
                                    attachment: '',
                                },
                                lineID: saas.userData.lineID,
                            }, function () { });
                        }
                        _a.label = 9;
                    case 9: return [2 /*return*/, true];
                }
            });
        });
    };
    // 客服訊息
    ManagerNotify.prototype.customerMessager = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            var saas, link, message, lineObject, settings, setKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSaasAPP()];
                    case 1:
                        saas = _a.sent();
                        link = "./?type=editor&appName=".concat(this.app_name, "&function=backend-manger&tab=home_page&toggle-message=true");
                        message = obj.room_image
                            ? "".concat(obj.user_name, "\u50B3\u9001\u4E00\u5F35\u5716\u7247\u7D66\u4F60")
                            : "".concat(obj.user_name, "\u50B3\u9001\u4E00\u5247\u8A0A\u606F\u7D66\u4F60:\u300C").concat((function () {
                                var _a;
                                var text = (_a = obj.room_text) !== null && _a !== void 0 ? _a : '';
                                if (text.length > 25) {
                                    text = (text === null || text === void 0 ? void 0 : text.substring(0, 25)) + '...';
                                }
                                return text;
                            })(), "\u300D");
                        console.log("fireBase==>", {
                            title: "\u6536\u5230\u5BA2\u670D\u8A0A\u606F",
                            userID: saas.user,
                            tag: 'message',
                            link: link,
                            body: message,
                            pass_store: true,
                        });
                        return [4 /*yield*/, new firebase_js_1.Firebase(saas.brand).sendMessage({
                                title: "\u6536\u5230\u5BA2\u670D\u8A0A\u606F",
                                userID: saas.user,
                                tag: 'message',
                                link: link,
                                body: message,
                                pass_store: true,
                            })];
                    case 2:
                        _a.sent();
                        lineObject = {};
                        return [4 /*yield*/, this.getSaasSettings()];
                    case 3:
                        settings = _a.sent();
                        setKey = 'get-customer-message';
                        if (!this.findSetting(settings, 'email', setKey)) return [3 /*break*/, 5];
                        return [4 /*yield*/, (0, ses_js_1.sendmail)("service@ncdesign.info", saas.userData.email, obj.title, obj.content)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        if (this.findSetting(settings, 'sms', setKey)) {
                            new sms_js_1.SMS(this.app_name).sendSNS({ data: message, phone: saas.userData.phone }, function () { });
                        }
                        if (this.findSetting(settings, 'line', setKey)) {
                            if (obj.room_image) {
                                lineObject = {
                                    attachment: {
                                        type: 'image',
                                        payload: {
                                            url: obj.room_image,
                                            is_reusable: true,
                                        },
                                    },
                                    text: message,
                                };
                            }
                            else {
                                lineObject = {
                                    attachment: '',
                                    text: message,
                                };
                            }
                            new line_message_js_1.LineMessage(saas.brand).sendLine({ data: lineObject, lineID: saas.userData.lineID }, function () { });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // 商家表單收集信件
    ManagerNotify.prototype.formSubmit = function (cf) {
        return __awaiter(this, void 0, void 0, function () {
            var saas, link, user_data, body, settings, setKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSaasAPP()];
                    case 1:
                        saas = _a.sent();
                        link = "./index?type=editor&appName=".concat(this.app_name, "&function=backend-manger&tab=form_receive");
                        return [4 /*yield*/, database_js_1.default.query("SELECT *\n                 FROM `".concat(this.app_name, "`.t_user\n                 WHERE userID = ?"), [cf.user_id])];
                    case 2:
                        user_data = (_a.sent())[0];
                        body = html(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\u6536\u5230\u4F86\u81EA\u300E", "\u300F\u63D0\u4EA4\u7684\u8868\u55AE\u3002"], ["\u6536\u5230\u4F86\u81EA\u300E", "\u300F\u63D0\u4EA4\u7684\u8868\u55AE\u3002"])), user_data.userData.name);
                        new firebase_js_1.Firebase(saas.brand).sendMessage({
                            title: '您有新表單',
                            userID: saas.user,
                            tag: 'formSubmit',
                            link: link,
                            body: body,
                        });
                        return [4 /*yield*/, this.getSaasSettings()];
                    case 3:
                        settings = _a.sent();
                        setKey = 'form-receive';
                        if (!this.findSetting(settings, 'email', setKey)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.sendEmail(saas.userData.email, '您收集到一筆新的表單', body, link)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        if (this.findSetting(settings, 'sms', setKey)) {
                            new sms_js_1.SMS(this.app_name).sendSNS({ data: body, phone: saas.userData.phone }, function () { });
                        }
                        if (this.findSetting(settings, 'line', setKey)) {
                            new line_message_js_1.LineMessage(saas.brand).sendLine({
                                data: {
                                    text: body,
                                    attachment: '',
                                },
                                lineID: saas.userData.lineID,
                            }, function () { });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return ManagerNotify;
}());
exports.ManagerNotify = ManagerNotify;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
