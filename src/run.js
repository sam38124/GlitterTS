"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDanielEnv = void 0;
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
    config_1.ConfigSetting.runSchedule = true;
    config_1.ConfigSetting.setConfig(danielPath);
}
if (fs_1.default.existsSync(path_1.default.resolve(zackPath))) {
    console.log('使用 Zack 路徑環境');
    config_1.ConfigSetting.runSchedule = false;
    config_1.ConfigSetting.setConfig(zackPath);
}
function isDanielEnv() {
    return fs_1.default.existsSync(path_1.default.resolve(danielPath));
}
exports.isDanielEnv = isDanielEnv;
(0, index_1.initial)(4000).then(async () => {
});
//# sourceMappingURL=run.js.map