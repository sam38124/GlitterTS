"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const index_1 = require("./index");
const config_1 = require("./config");
config_1.ConfigSetting.setConfig(path_1.default.resolve(`/Users/jianzhi.wang/Desktop/square_studio/APP檔案/Glitter星澄基地/backend_default/environments/staging.env`));
(0, index_1.initial)(4000).then(async () => { });
//# sourceMappingURL=run.js.map