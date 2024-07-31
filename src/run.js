"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const index_1 = require("./index");
const config_1 = require("./config");
const wangPath = `/Users/jianzhi.wang/Desktop/square_studio/APP檔案/Glitter星澄基地/backend_default/environments/staging.env`;
const danielPath = `/Users/daniellin/Desktop/GlitterEnv/staging.env`;
const zackPath = `/Users/wangjianzhi/Desktop/CODENEX/staging.env`;
if (fs_1.default.existsSync(path_1.default.resolve(wangPath))) {
    console.log('使用 Wang 路徑環境');
    config_1.ConfigSetting.runSchedule = false;
    config_1.ConfigSetting.setConfig(wangPath);
}
if (fs_1.default.existsSync(path_1.default.resolve(danielPath))) {
    console.log('使用 Daniel 路徑環境');
    config_1.ConfigSetting.runSchedule = false;
    config_1.ConfigSetting.setConfig(danielPath);
}
if (fs_1.default.existsSync(path_1.default.resolve(zackPath))) {
    console.log('使用 Zack 路徑環境');
    config_1.ConfigSetting.runSchedule = false;
    config_1.ConfigSetting.setConfig(zackPath);
}
config_1.ConfigSetting.is_local = true;
(0, index_1.initial)(4000).then(async () => {
});
const dataList = [
    {
        tag: 'auto-email-shipment-arrival',
        tag_name: '商品到貨',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 已到達',
        content: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 已到達',
        toggle: true,
    },
    {
        tag: 'auto-email-shipment',
        tag_name: '商品出貨',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 出貨中',
        content: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 出貨中',
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
        tag: 'auto-email-order-create',
        tag_name: '訂單成立',
        name: '@{{app_name}}',
        title: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已成立',
        content: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已成立',
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
        content: '',
        toggle: true,
    },
];
console.log(dataList.map((item) => item.tag));
//# sourceMappingURL=run.js.map