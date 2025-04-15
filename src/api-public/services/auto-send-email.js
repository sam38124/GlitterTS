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
exports.AutoSendEmail = void 0;
var user_js_1 = require("../services/user.js");
var mail_js_1 = require("../services/mail.js");
var app_js_1 = require("../../services/app.js");
var database_js_1 = require("../../modules/database.js");
var exception_js_1 = require("../../modules/exception.js");
var AutoSendEmail = /** @class */ (function () {
    function AutoSendEmail() {
    }
    AutoSendEmail.getDefCompare = function (app, tag, language) {
        return __awaiter(this, void 0, void 0, function () {
            var dataList, keyData, appData, b, c;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        dataList = [
                            {
                                tag: 'auto-email-shipment',
                                tag_name: '商品出貨',
                                name: '@{{app_name}}',
                                title: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 出貨中',
                                content: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 出貨中',
                                toggle: true,
                            },
                            {
                                tag: 'auto-sns-shipment',
                                tag_name: '簡訊通知商品出貨',
                                name: '@{{app_name}}',
                                title: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 出貨中',
                                content: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 出貨中',
                                toggle: true,
                            },
                            {
                                tag: 'auto-line-shipment',
                                tag_name: 'line訊息通知商品出貨',
                                name: '@{{app_name}}',
                                title: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 出貨中',
                                content: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 出貨中',
                                toggle: true,
                            },
                            {
                                tag: 'auto-fb-shipment',
                                tag_name: 'fb訊息通知商品出貨',
                                name: '@{{app_name}}',
                                title: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 出貨中',
                                content: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 出貨中',
                                toggle: true,
                            },
                            {
                                tag: 'auto-email-shipment-arrival',
                                tag_name: '商品到貨',
                                name: '@{{app_name}}',
                                title: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 已到達',
                                content: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 已到達',
                                toggle: true,
                            },
                            {
                                tag: 'auto-sns-shipment-arrival',
                                tag_name: '簡訊通知商品到貨',
                                name: '@{{app_name}}',
                                title: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 已到達',
                                content: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 已到達',
                                toggle: true,
                            },
                            {
                                tag: 'auto-line-shipment-arrival',
                                tag_name: 'line訊息通知商品到貨',
                                name: '@{{app_name}}',
                                title: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 已到達',
                                content: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 已到達',
                                toggle: true,
                            },
                            {
                                tag: 'auto-fb-shipment-arrival',
                                tag_name: 'fb訊息通知商品到貨',
                                name: '@{{app_name}}',
                                title: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 已到達',
                                content: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 已到達',
                                toggle: true,
                            },
                            {
                                tag: 'auto-email-order-create',
                                tag_name: '訂單成立',
                                name: '@{{app_name}}',
                                title: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已成立',
                                content: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已成立',
                                toggle: true,
                            },
                            {
                                tag: 'auto-sns-order-create',
                                tag_name: '簡訊通知訂單成立',
                                name: '@{{app_name}}',
                                title: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已成立',
                                content: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已成立',
                                toggle: true,
                            },
                            {
                                tag: 'auto-line-order-create',
                                tag_name: 'ling通知訂單成立',
                                name: '@{{app_name}}',
                                title: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已成立',
                                content: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已成立',
                                toggle: true,
                            },
                            {
                                tag: 'auto-fb-order-create',
                                tag_name: 'fb通知訂單成立',
                                name: '@{{app_name}}',
                                title: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已成立',
                                content: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已成立',
                                toggle: true,
                            },
                            {
                                tag: 'auto-email-payment-successful',
                                tag_name: '訂單付款成功',
                                name: '@{{app_name}}',
                                title: '[@{{app_name}}] #@{{訂單號碼}} 付款狀態 更新為: 已付款',
                                content: '[@{{app_name}}] #@{{訂單號碼}} 付款狀態 更新為: 已付款',
                                toggle: true,
                            },
                            {
                                tag: 'auto-sns-payment-successful',
                                tag_name: '簡訊通知訂單付款成功',
                                name: '@{{app_name}}',
                                title: '[@{{app_name}}] #@{{訂單號碼}} 付款狀態 更新為: 已付款',
                                content: '[@{{app_name}}] #@{{訂單號碼}} 付款狀態 更新為: 已付款',
                                toggle: true,
                            },
                            {
                                tag: 'auto-line-payment-successful',
                                tag_name: 'line訊息通知訂單付款成功',
                                name: '@{{app_name}}',
                                title: '[@{{app_name}}] #@{{訂單號碼}} 付款狀態 更新為: 已付款',
                                content: '[@{{app_name}}] #@{{訂單號碼}} 付款狀態 更新為: 已付款',
                                toggle: true,
                            },
                            {
                                tag: 'auto-fb-payment-successful',
                                tag_name: 'fb訊息通知訂單付款成功',
                                name: '@{{app_name}}',
                                title: '[@{{app_name}}] #@{{訂單號碼}} 付款狀態 更新為: 已付款',
                                content: '[@{{app_name}}] #@{{訂單號碼}} 付款狀態 更新為: 已付款',
                                toggle: true,
                            },
                            {
                                tag: 'proof-purchase',
                                tag_name: '訂單待核款',
                                name: '@{{app_name}}',
                                title: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已進入待核款',
                                content: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已進入待核款',
                                toggle: true,
                            },
                            {
                                tag: 'sns-proof-purchase',
                                tag_name: '簡訊通知訂單待核款',
                                name: '@{{app_name}}',
                                title: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已進入待核款',
                                content: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已進入待核款',
                                toggle: true,
                            },
                            {
                                tag: 'line-proof-purchase',
                                tag_name: 'line訊息通知訂單待核款',
                                name: '@{{app_name}}',
                                title: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已進入待核款',
                                content: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已進入待核款',
                                toggle: true,
                            },
                            {
                                tag: 'fb-proof-purchase',
                                tag_name: 'fb訊息通知訂單待核款',
                                name: '@{{app_name}}',
                                title: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已進入待核款',
                                content: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已進入待核款',
                                toggle: true,
                            },
                            {
                                tag: 'auto-email-order-cancel-success',
                                tag_name: '取消訂單成功',
                                name: '@{{app_name}}',
                                title: '[@{{app_name}}] 您已成功取消訂單 #@{{訂單號碼}}',
                                content: '[@{{app_name}}] 您已成功取消訂單 #@{{訂單號碼}}',
                                toggle: true,
                            },
                            {
                                tag: 'auto-email-order-cancel-false',
                                tag_name: '取消訂單失敗',
                                name: '@{{app_name}}',
                                title: '[@{{app_name}}] 取消訂單申請 #@{{訂單號碼}} 已失敗',
                                content: '[@{{app_name}}] 取消訂單申請 #@{{訂單號碼}} 已失敗',
                                toggle: true,
                            },
                            {
                                tag: 'auto-email-birthday',
                                tag_name: '生日祝福',
                                name: '@{{app_name}}',
                                title: '[@{{app_name}}] [@{{user_name}}] 今天是您一年一度的大日子！祝您生日快樂！',
                                content: '[@{{app_name}}] [@{{user_name}}] 今天是您一年一度的大日子！祝您生日快樂！',
                                toggle: true,
                            },
                            {
                                tag: 'auto-sns-birthday',
                                tag_name: '簡訊通知生日祝福',
                                name: '@{{app_name}}',
                                title: '[@{{app_name}}] [@{{user_name}}] 今天是您一年一度的大日子！祝您生日快樂！',
                                content: '[@{{app_name}}] [@{{user_name}}] 今天是您一年一度的大日子！祝您生日快樂！',
                                toggle: true,
                            },
                            {
                                tag: 'auto-line-birthday',
                                tag_name: 'line訊息通知生日祝福',
                                name: '@{{app_name}}',
                                title: '[@{{app_name}}] [@{{user_name}}] 今天是您一年一度的大日子！祝您生日快樂！',
                                content: '[@{{app_name}}] [@{{user_name}}] 今天是您一年一度的大日子！祝您生日快樂！',
                                toggle: true,
                            },
                            {
                                tag: 'auto-email-welcome',
                                tag_name: '歡迎信件',
                                name: '@{{app_name}}',
                                title: '[@{{app_name}}] 歡迎您加入@{{app_name}}！ 最豐富的選品商店',
                                content: '[@{{app_name}}] 歡迎您加入@{{app_name}}！ 最豐富的選品商店',
                                toggle: true,
                            },
                            {
                                tag: 'auto-email-verify',
                                tag_name: '信箱驗證',
                                name: '@{{app_name}}',
                                title: '[@{{app_name}}] 帳號認證通知',
                                content: '嗨！歡迎加入 @{{app_name}}，請輸入驗證碼「 @{{code}} 」。請於一分鐘內輸入並完成驗證。',
                                toggle: true,
                            },
                            {
                                tag: 'auto-email-verify-update',
                                tag_name: '信箱驗證',
                                name: '@{{app_name}}',
                                title: '[@{{app_name}}] 信箱認證通知',
                                content: '請輸入驗證碼「 @{{code}} 」。請於五分鐘內輸入並完成驗證。',
                                toggle: true,
                            },
                            {
                                tag: 'auto-phone-verify-update',
                                tag_name: '電話認證',
                                name: '@{{app_name}}',
                                title: '[@{{app_name}}] 帳號認證通知',
                                content: '請輸入驗證碼「 @{{code}} 」。請於五分鐘內輸入並完成驗證。',
                                toggle: true,
                            },
                            {
                                tag: 'auto-phone-verify',
                                tag_name: '電話認證',
                                name: '@{{app_name}}',
                                title: '[@{{app_name}}] 帳號認證通知',
                                content: '嗨！歡迎加入 @{{app_name}}，請輸入驗證碼「 @{{code}} 」。請於一分鐘內輸入並完成驗證。',
                                toggle: true,
                            },
                            {
                                tag: 'auto-email-forget',
                                tag_name: '忘記密碼',
                                name: '@{{app_name}}',
                                title: '[@{{app_name}}] 重設密碼',
                                content: '[@{{app_name}}]，請輸入驗證碼「 @{{code}} 」。請於一分鐘內輸入並完成驗證。',
                                toggle: true,
                            },
                            {
                                tag: 'get-customer-message',
                                tag_name: '客服訊息',
                                name: '@{{app_name}}',
                                title: '[@{{app_name}}] 收到客服訊息',
                                content: this.getCustomerMessageHTML(),
                                toggle: true,
                            },
                        ];
                        return [4 /*yield*/, new user_js_1.User(app).getConfigV2({
                                key: tag,
                                user_id: 'manager',
                            })];
                    case 1:
                        keyData = _b.sent();
                        return [4 /*yield*/, new user_js_1.User(app).getConfigV2({
                                key: 'store-information',
                                user_id: 'manager',
                            })];
                    case 2:
                        appData = _b.sent();
                        b = dataList.find(function (dd) {
                            return dd.tag === tag;
                        });
                        if (b) {
                            if (keyData) {
                                c = keyData[language] || keyData;
                                b.title = c.title || b.title;
                                b.toggle = (_a = keyData.toggle) !== null && _a !== void 0 ? _a : true;
                                b.content = c.content || b.content;
                                b.name = c.name || b.name;
                                b.updated_time = new Date(keyData.updated_time);
                            }
                            Object.keys(b).map(function (dd) {
                                if (typeof b[dd] === 'string') {
                                    b[dd] = b[dd].replace(/@\{\{app_name\}\}/g, (appData && appData.shop_name) || '商店名稱');
                                }
                            });
                            return [2 /*return*/, b];
                        }
                        return [2 /*return*/, {}];
                }
            });
        });
    };
    AutoSendEmail.getCustomerMessageHTML = function () {
        var html = String.raw;
        return html(templateObject_1 || (templateObject_1 = __makeTemplateObject([" <table\n            width=\"100%\"\n            border=\"0\"\n            cellpadding=\"0\"\n            cellspacing=\"0\"\n            style=\"box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%; color: rgb(65, 65, 65); font-family: sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; background-color: rgb(255, 255, 255);\"\n            id=\"isPasted\"\n        >\n            <tbody style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\">\n                <tr style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\">\n                    <td style=\"box-sizing: border-box; border: 0px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px;\">\n                        <table\n                            align=\"center\"\n                            width=\"100%\"\n                            border=\"0\"\n                            cellpadding=\"0\"\n                            cellspacing=\"0\"\n                            style=\"box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; --bs-gutter-x: 1.5rem; --bs-gutter-y: 0; display: flex; flex-wrap: wrap; margin-top: calc(-1 * var(--bs-gutter-y)); margin-right: calc(-0.5 * var(--bs-gutter-x)); margin-left: calc(-0.5 * var(--bs-gutter-x)); border: none; empty-cells: show; max-width: 100%;\"\n                        >\n                            <tbody\n                                style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased; flex-shrink: 0; width: 1055.59px; max-width: 100%; padding-right: calc(var(--bs-gutter-x) * 0.5); padding-left: calc(var(--bs-gutter-x) * 0.5); margin-top: var(--bs-gutter-y);\"\n                            >\n                                <tr style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\">\n                                    <td style=\"box-sizing: border-box; border: 0px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px;\">\n                                        <table\n                                            align=\"center\"\n                                            border=\"0\"\n                                            cellpadding=\"0\"\n                                            cellspacing=\"0\"\n                                            width=\"600\"\n                                            style=\"box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%; color: rgb(0, 0, 0); width: 600px; margin: 0px auto;\"\n                                        >\n                                            <tbody style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\">\n                                                <tr style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\">\n                                                    <td\n                                                        width=\"100%\"\n                                                        style=\"box-sizing: border-box; border: 0px; -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;\"\n                                                    >\n                                                        <table\n                                                            width=\"100%\"\n                                                            border=\"0\"\n                                                            cellpadding=\"0\"\n                                                            cellspacing=\"0\"\n                                                            style=\"box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%;\"\n                                                        >\n                                                            <tbody style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\">\n                                                                <tr style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\">\n                                                                    <td\n                                                                        style=\"box-sizing: border-box; border: 1px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px; width: 599px;\"\n                                                                    >\n                                                                        <div align=\"center\" style=\"box-sizing: border-box; -webkit-font-smoothing: antialiased; line-height: 10px;\">\n                                                                            <div style=\"box-sizing: border-box; -webkit-font-smoothing: antialiased; max-width: 600px;\">\n                                                                                <img\n                                                                                    src=\"https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1719903595261-s3s4scs3s7sfsfs7.png\"\n                                                                                    class=\"fr-fic fr-dii\"\n                                                                                    style=\"width: 100%;\"\n                                                                                />\n                                                                                <br />\n                                                                            </div>\n                                                                        </div>\n                                                                    </td>\n                                                                </tr>\n                                                            </tbody>\n                                                        </table>\n\n                                                        <table\n                                                            width=\"100%\"\n                                                            border=\"0\"\n                                                            cellpadding=\"0\"\n                                                            cellspacing=\"0\"\n                                                            style=\"box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%;\"\n                                                        >\n                                                            <tbody style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\">\n                                                                <tr style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\">\n                                                                    <td\n                                                                        style=\"box-sizing: border-box; border: 1px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px; padding: 60px 45px 30px; text-align: left; width: 599px;\"\n                                                                    >\n                                                                        <h1\n                                                                            style=\"box-sizing: border-box; margin: 0px; font-weight: 700; line-height: 33.6px; color: rgb(54, 54, 54); font-size: 28px; -webkit-font-smoothing: antialiased; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; direction: ltr; font-family: Arial, Helvetica, sans-serif; text-align: left;\"\n                                                                            id=\"isPasted\"\n                                                                        >\n                                                                            \u5BA2\u670D\u8A0A\u606F\n                                                                        </h1>\n                                                                        <br />\n                                                                        <div style=\"width: 100%;text-align: start;\">@{{text}}</div>\n                                                                        <br />\n                                                                        <br /><span\n                                                                            style=\"color: rgb(16, 17, 18); font-family: Arial, Helvetica, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;\"\n                                                                            ><a\n                                                                                href=\"@{{link}}\"\n                                                                                target=\"_blank\"\n                                                                                style=\"box-sizing: border-box; color: rgb(255, 255, 255); text-decoration: none; -webkit-font-smoothing: antialiased; transition: color 0.2s ease-in-out 0s; user-select: auto; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 148, 2); border-width: 0px; border-style: solid; border-color: transparent; border-radius: 5px; display: inline-block; font-family: Arial, Helvetica, sans-serif; font-size: 24px; padding-bottom: 15px; padding-top: 15px; text-align: center; width: auto; word-break: keep-all;\"\n                                                                                id=\"isPasted\"\n                                                                                ><span\n                                                                                    style=\"box-sizing: border-box; -webkit-font-smoothing: antialiased; padding-left: 30px; padding-right: 30px; font-size: 24px; display: inline-block; letter-spacing: normal;\"\n                                                                                    ><span\n                                                                                        style=\"box-sizing: border-box; -webkit-font-smoothing: antialiased; word-break: break-word; line-height: 48px;\"\n                                                                                        ><strong style=\"box-sizing: border-box; font-weight: 700; -webkit-font-smoothing: antialiased;\"\n                                                                                            >\u524D\u5F80\u5546\u5E97</strong\n                                                                                        ></span\n                                                                                    ></span\n                                                                                ></a\n                                                                            ></span\n                                                                        >\n                                                                        <br />\n                                                                    </td>\n                                                                </tr>\n                                                            </tbody>\n                                                        </table>\n\n                                                        <table\n                                                            width=\"100%\"\n                                                            border=\"0\"\n                                                            cellpadding=\"0\"\n                                                            cellspacing=\"0\"\n                                                            style=\"box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%; word-break: break-word; background-color: rgb(247, 247, 247);\"\n                                                        >\n                                                            <tbody style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\">\n                                                                <tr style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\">\n                                                                    <td\n                                                                        style=\"box-sizing: border-box; border: 1px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px; padding: 28px 45px 10px;\"\n                                                                    >\n                                                                        <div\n                                                                            style=\"box-sizing: border-box; -webkit-font-smoothing: antialiased; color: rgb(16, 17, 18); direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 16px; font-weight: 400; letter-spacing: 0px; line-height: 19.2px; text-align: left;\"\n                                                                        >\n                                                                            <p style=\"box-sizing: border-box; margin-top: 0px; margin-bottom: 1.25rem; -webkit-font-smoothing: antialiased;\">\n                                                                                \u5982\u679C\u60A8\u6709\u4EFB\u4F55\u7591\u554F\u6216\u9700\u8981\u5E6B\u52A9\uFF0C\u6211\u5011\u7684\u5718\u968A\u96A8\u6642\u5728\u9019\u88E1\u70BA\u60A8\u63D0\u4F9B\u652F\u6301\u3002\n                                                                            </p>\n\n                                                                            <p style=\"box-sizing: border-box; margin-top: 0px; margin-bottom: 1.25rem; -webkit-font-smoothing: antialiased;\">\n                                                                                \u670D\u52D9\u96FB\u8A71\uFF1A+886 978-028-730\n                                                                            </p>\n\n                                                                            <p style=\"box-sizing: border-box; margin-top: 0px; margin-bottom: 1.25rem; -webkit-font-smoothing: antialiased;\">\n                                                                                \u96FB\u5B50\u90F5\u4EF6\uFF1Amk@ncdesign.info\n                                                                            </p>\n                                                                        </div>\n                                                                    </td>\n                                                                </tr>\n                                                            </tbody>\n                                                        </table>\n\n                                                        <table\n                                                            width=\"100%\"\n                                                            border=\"0\"\n                                                            cellpadding=\"0\"\n                                                            cellspacing=\"0\"\n                                                            style=\"box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%; word-break: break-word; background-color: rgb(247, 247, 247);\"\n                                                        >\n                                                            <tbody style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\">\n                                                                <tr style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\">\n                                                                    <td\n                                                                        style=\"box-sizing: border-box; border: 1px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px; padding: 20px 10px 10px;\"\n                                                                    >\n                                                                        <div\n                                                                            style=\"box-sizing: border-box; -webkit-font-smoothing: antialiased; color: rgb(16, 17, 18); direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 400; letter-spacing: 0px; line-height: 16.8px; text-align: center;\"\n                                                                        >\n                                                                            <p style=\"box-sizing: border-box; margin-top: 0px; margin-bottom: 1.25rem; -webkit-font-smoothing: antialiased;\">\n                                                                                <a\n                                                                                    href=\"https://shopnex.tw/?article=termsofservice&page=blog_detail\"\n                                                                                    target=\"_blank\"\n                                                                                    rel=\"noopener\"\n                                                                                    style=\"box-sizing: border-box; color: rgb(28, 28, 28); text-decoration: underline; -webkit-font-smoothing: antialiased; transition: color 0.2s ease-in-out 0s; user-select: auto;\"\n                                                                                    >\u670D\u52D9\u689D\u6B3E</a\n                                                                                >&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;\n                                                                                <a\n                                                                                    href=\"https://shopnex.tw/?article=privacyterms&page=blog_detail\"\n                                                                                    target=\"_blank\"\n                                                                                    rel=\"noopener\"\n                                                                                    style=\"box-sizing: border-box; color: rgb(28, 28, 28); text-decoration: underline; -webkit-font-smoothing: antialiased; transition: color 0.2s ease-in-out 0s; user-select: auto;\"\n                                                                                    >\u96B1\u79C1\u689D\u6B3E</a\n                                                                                >&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;\n                                                                                <a\n                                                                                    href=\"https://shopnex.tw/?article=privacyterms&page=e-commerce-blog\"\n                                                                                    target=\"_blank\"\n                                                                                    rel=\"noopener\"\n                                                                                    style=\"box-sizing: border-box; color: rgb(28, 28, 28); text-decoration: underline; -webkit-font-smoothing: antialiased; transition: color 0.2s ease-in-out 0s; user-select: auto;\"\n                                                                                    >\u958B\u5E97\u6559\u5B78</a\n                                                                                >\n                                                                            </p>\n                                                                        </div>\n                                                                    </td>\n                                                                </tr>\n                                                            </tbody>\n                                                        </table>\n                                                    </td>\n                                                </tr>\n                                            </tbody>\n                                        </table>\n                                    </td>\n                                </tr>\n                            </tbody>\n                        </table>\n                    </td>\n                </tr>\n            </tbody>\n        </table>"], [" <table\n            width=\"100%\"\n            border=\"0\"\n            cellpadding=\"0\"\n            cellspacing=\"0\"\n            style=\"box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%; color: rgb(65, 65, 65); font-family: sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; background-color: rgb(255, 255, 255);\"\n            id=\"isPasted\"\n        >\n            <tbody style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\">\n                <tr style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\">\n                    <td style=\"box-sizing: border-box; border: 0px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px;\">\n                        <table\n                            align=\"center\"\n                            width=\"100%\"\n                            border=\"0\"\n                            cellpadding=\"0\"\n                            cellspacing=\"0\"\n                            style=\"box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; --bs-gutter-x: 1.5rem; --bs-gutter-y: 0; display: flex; flex-wrap: wrap; margin-top: calc(-1 * var(--bs-gutter-y)); margin-right: calc(-0.5 * var(--bs-gutter-x)); margin-left: calc(-0.5 * var(--bs-gutter-x)); border: none; empty-cells: show; max-width: 100%;\"\n                        >\n                            <tbody\n                                style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased; flex-shrink: 0; width: 1055.59px; max-width: 100%; padding-right: calc(var(--bs-gutter-x) * 0.5); padding-left: calc(var(--bs-gutter-x) * 0.5); margin-top: var(--bs-gutter-y);\"\n                            >\n                                <tr style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\">\n                                    <td style=\"box-sizing: border-box; border: 0px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px;\">\n                                        <table\n                                            align=\"center\"\n                                            border=\"0\"\n                                            cellpadding=\"0\"\n                                            cellspacing=\"0\"\n                                            width=\"600\"\n                                            style=\"box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%; color: rgb(0, 0, 0); width: 600px; margin: 0px auto;\"\n                                        >\n                                            <tbody style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\">\n                                                <tr style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\">\n                                                    <td\n                                                        width=\"100%\"\n                                                        style=\"box-sizing: border-box; border: 0px; -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;\"\n                                                    >\n                                                        <table\n                                                            width=\"100%\"\n                                                            border=\"0\"\n                                                            cellpadding=\"0\"\n                                                            cellspacing=\"0\"\n                                                            style=\"box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%;\"\n                                                        >\n                                                            <tbody style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\">\n                                                                <tr style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\">\n                                                                    <td\n                                                                        style=\"box-sizing: border-box; border: 1px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px; width: 599px;\"\n                                                                    >\n                                                                        <div align=\"center\" style=\"box-sizing: border-box; -webkit-font-smoothing: antialiased; line-height: 10px;\">\n                                                                            <div style=\"box-sizing: border-box; -webkit-font-smoothing: antialiased; max-width: 600px;\">\n                                                                                <img\n                                                                                    src=\"https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1719903595261-s3s4scs3s7sfsfs7.png\"\n                                                                                    class=\"fr-fic fr-dii\"\n                                                                                    style=\"width: 100%;\"\n                                                                                />\n                                                                                <br />\n                                                                            </div>\n                                                                        </div>\n                                                                    </td>\n                                                                </tr>\n                                                            </tbody>\n                                                        </table>\n\n                                                        <table\n                                                            width=\"100%\"\n                                                            border=\"0\"\n                                                            cellpadding=\"0\"\n                                                            cellspacing=\"0\"\n                                                            style=\"box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%;\"\n                                                        >\n                                                            <tbody style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\">\n                                                                <tr style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\">\n                                                                    <td\n                                                                        style=\"box-sizing: border-box; border: 1px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px; padding: 60px 45px 30px; text-align: left; width: 599px;\"\n                                                                    >\n                                                                        <h1\n                                                                            style=\"box-sizing: border-box; margin: 0px; font-weight: 700; line-height: 33.6px; color: rgb(54, 54, 54); font-size: 28px; -webkit-font-smoothing: antialiased; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; direction: ltr; font-family: Arial, Helvetica, sans-serif; text-align: left;\"\n                                                                            id=\"isPasted\"\n                                                                        >\n                                                                            \u5BA2\u670D\u8A0A\u606F\n                                                                        </h1>\n                                                                        <br />\n                                                                        <div style=\"width: 100%;text-align: start;\">@{{text}}</div>\n                                                                        <br />\n                                                                        <br /><span\n                                                                            style=\"color: rgb(16, 17, 18); font-family: Arial, Helvetica, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;\"\n                                                                            ><a\n                                                                                href=\"@{{link}}\"\n                                                                                target=\"_blank\"\n                                                                                style=\"box-sizing: border-box; color: rgb(255, 255, 255); text-decoration: none; -webkit-font-smoothing: antialiased; transition: color 0.2s ease-in-out 0s; user-select: auto; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 148, 2); border-width: 0px; border-style: solid; border-color: transparent; border-radius: 5px; display: inline-block; font-family: Arial, Helvetica, sans-serif; font-size: 24px; padding-bottom: 15px; padding-top: 15px; text-align: center; width: auto; word-break: keep-all;\"\n                                                                                id=\"isPasted\"\n                                                                                ><span\n                                                                                    style=\"box-sizing: border-box; -webkit-font-smoothing: antialiased; padding-left: 30px; padding-right: 30px; font-size: 24px; display: inline-block; letter-spacing: normal;\"\n                                                                                    ><span\n                                                                                        style=\"box-sizing: border-box; -webkit-font-smoothing: antialiased; word-break: break-word; line-height: 48px;\"\n                                                                                        ><strong style=\"box-sizing: border-box; font-weight: 700; -webkit-font-smoothing: antialiased;\"\n                                                                                            >\u524D\u5F80\u5546\u5E97</strong\n                                                                                        ></span\n                                                                                    ></span\n                                                                                ></a\n                                                                            ></span\n                                                                        >\n                                                                        <br />\n                                                                    </td>\n                                                                </tr>\n                                                            </tbody>\n                                                        </table>\n\n                                                        <table\n                                                            width=\"100%\"\n                                                            border=\"0\"\n                                                            cellpadding=\"0\"\n                                                            cellspacing=\"0\"\n                                                            style=\"box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%; word-break: break-word; background-color: rgb(247, 247, 247);\"\n                                                        >\n                                                            <tbody style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\">\n                                                                <tr style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\">\n                                                                    <td\n                                                                        style=\"box-sizing: border-box; border: 1px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px; padding: 28px 45px 10px;\"\n                                                                    >\n                                                                        <div\n                                                                            style=\"box-sizing: border-box; -webkit-font-smoothing: antialiased; color: rgb(16, 17, 18); direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 16px; font-weight: 400; letter-spacing: 0px; line-height: 19.2px; text-align: left;\"\n                                                                        >\n                                                                            <p style=\"box-sizing: border-box; margin-top: 0px; margin-bottom: 1.25rem; -webkit-font-smoothing: antialiased;\">\n                                                                                \u5982\u679C\u60A8\u6709\u4EFB\u4F55\u7591\u554F\u6216\u9700\u8981\u5E6B\u52A9\uFF0C\u6211\u5011\u7684\u5718\u968A\u96A8\u6642\u5728\u9019\u88E1\u70BA\u60A8\u63D0\u4F9B\u652F\u6301\u3002\n                                                                            </p>\n\n                                                                            <p style=\"box-sizing: border-box; margin-top: 0px; margin-bottom: 1.25rem; -webkit-font-smoothing: antialiased;\">\n                                                                                \u670D\u52D9\u96FB\u8A71\uFF1A+886 978-028-730\n                                                                            </p>\n\n                                                                            <p style=\"box-sizing: border-box; margin-top: 0px; margin-bottom: 1.25rem; -webkit-font-smoothing: antialiased;\">\n                                                                                \u96FB\u5B50\u90F5\u4EF6\uFF1Amk@ncdesign.info\n                                                                            </p>\n                                                                        </div>\n                                                                    </td>\n                                                                </tr>\n                                                            </tbody>\n                                                        </table>\n\n                                                        <table\n                                                            width=\"100%\"\n                                                            border=\"0\"\n                                                            cellpadding=\"0\"\n                                                            cellspacing=\"0\"\n                                                            style=\"box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%; word-break: break-word; background-color: rgb(247, 247, 247);\"\n                                                        >\n                                                            <tbody style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\">\n                                                                <tr style=\"box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;\">\n                                                                    <td\n                                                                        style=\"box-sizing: border-box; border: 1px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px; padding: 20px 10px 10px;\"\n                                                                    >\n                                                                        <div\n                                                                            style=\"box-sizing: border-box; -webkit-font-smoothing: antialiased; color: rgb(16, 17, 18); direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 400; letter-spacing: 0px; line-height: 16.8px; text-align: center;\"\n                                                                        >\n                                                                            <p style=\"box-sizing: border-box; margin-top: 0px; margin-bottom: 1.25rem; -webkit-font-smoothing: antialiased;\">\n                                                                                <a\n                                                                                    href=\"https://shopnex.tw/?article=termsofservice&page=blog_detail\"\n                                                                                    target=\"_blank\"\n                                                                                    rel=\"noopener\"\n                                                                                    style=\"box-sizing: border-box; color: rgb(28, 28, 28); text-decoration: underline; -webkit-font-smoothing: antialiased; transition: color 0.2s ease-in-out 0s; user-select: auto;\"\n                                                                                    >\u670D\u52D9\u689D\u6B3E</a\n                                                                                >&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;\n                                                                                <a\n                                                                                    href=\"https://shopnex.tw/?article=privacyterms&page=blog_detail\"\n                                                                                    target=\"_blank\"\n                                                                                    rel=\"noopener\"\n                                                                                    style=\"box-sizing: border-box; color: rgb(28, 28, 28); text-decoration: underline; -webkit-font-smoothing: antialiased; transition: color 0.2s ease-in-out 0s; user-select: auto;\"\n                                                                                    >\u96B1\u79C1\u689D\u6B3E</a\n                                                                                >&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;\n                                                                                <a\n                                                                                    href=\"https://shopnex.tw/?article=privacyterms&page=e-commerce-blog\"\n                                                                                    target=\"_blank\"\n                                                                                    rel=\"noopener\"\n                                                                                    style=\"box-sizing: border-box; color: rgb(28, 28, 28); text-decoration: underline; -webkit-font-smoothing: antialiased; transition: color 0.2s ease-in-out 0s; user-select: auto;\"\n                                                                                    >\u958B\u5E97\u6559\u5B78</a\n                                                                                >\n                                                                            </p>\n                                                                        </div>\n                                                                    </td>\n                                                                </tr>\n                                                            </tbody>\n                                                        </table>\n                                                    </td>\n                                                </tr>\n                                            </tbody>\n                                        </table>\n                                    </td>\n                                </tr>\n                            </tbody>\n                        </table>\n                    </td>\n                </tr>\n            </tbody>\n        </table>"])));
    };
    AutoSendEmail.customerOrder = function (app, tag, order_id, email, language) {
        return __awaiter(this, void 0, void 0, function () {
            var customerMail, brandAndMemberType, order, order_data, error_1;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.getDefCompare(app, tag, language)];
                    case 1:
                        customerMail = _e.sent();
                        return [4 /*yield*/, app_js_1.App.checkBrandAndMemberType(app)];
                    case 2:
                        brandAndMemberType = _e.sent();
                        return [4 /*yield*/, database_js_1.default.query("SELECT * FROM `".concat(app, "`.t_checkout WHERE cart_token = ?\n                "), [order_id])];
                    case 3:
                        order = _e.sent();
                        if (!order[0]) return [3 /*break*/, 5];
                        order_data = order[0]['orderData'];
                        if (!customerMail.toggle) return [3 /*break*/, 5];
                        return [4 /*yield*/, new mail_js_1.Mail(app).postMail({
                                name: customerMail.name,
                                title: customerMail.title.replace(/@\{\{訂單號碼\}\}/g, order_id),
                                content: customerMail.content
                                    .replace(/@\{\{訂單號碼\}\}/g, "<a href=\"https://".concat(brandAndMemberType.domain, "/order_detail?cart_token=").concat(order_id, "\">").concat(order_id, "</a>"))
                                    .replace(/@\{\{訂單金額\}\}/g, order_data.total)
                                    .replace(/@\{\{姓名\}\}/g, (_a = order_data.customer_info.name) !== null && _a !== void 0 ? _a : '')
                                    .replace(/@\{\{電話\}\}/g, (_b = order_data.customer_info.phone) !== null && _b !== void 0 ? _b : '')
                                    .replace(/@\{\{地址\}\}/g, (_c = order_data.user_info.address) !== null && _c !== void 0 ? _c : '')
                                    .replace(/@\{\{信箱\}\}/g, (_d = order_data.customer_info.email) !== null && _d !== void 0 ? _d : ''),
                                email: [email],
                                type: tag,
                            })];
                    case 4:
                        _e.sent();
                        _e.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_1 = _e.sent();
                        console.error(error_1);
                        throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'customerOrder Error:' + error_1, null);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return AutoSendEmail;
}());
exports.AutoSendEmail = AutoSendEmail;
var templateObject_1;
