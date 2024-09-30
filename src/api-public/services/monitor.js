"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Monitor = void 0;
const tool_js_1 = __importDefault(require("../../modules/tool.js"));
const database_1 = __importDefault(require("../../modules/database"));
const config_js_1 = require("../../config.js");
class Monitor {
    static async insertHistory(obj) {
        var _a;
        const req = obj.req;
        let mac_address = req.cookies.mac_address;
        if (!mac_address) {
            mac_address = tool_js_1.default.randomString(10);
            (_a = req.res) === null || _a === void 0 ? void 0 : _a.cookie('mac_address', mac_address);
        }
        await database_1.default.query(`insert into \`${config_js_1.saasConfig.SAAS_NAME}\`.t_monitor set ?`, [
            {
                ip: req.ip,
                app_name: req.get('g-app') || 'unknown',
                user_id: obj.token ? obj.token.userID : 'guest',
                mac_address: req.get('mac_address') || mac_address,
                base_url: req.baseUrl,
                req_type: obj.req_type
            }
        ]);
        console.log(`訪客IP:${req.ip}-用戶ID:${obj.token && obj.token.userID}-請求APP:${req.get('g-app')}-請求路徑:${req.baseUrl}-請求類型:${obj.req_type}-MacAddress:${req.get('mac_address') || req.sessionID}`);
    }
}
exports.Monitor = Monitor;
//# sourceMappingURL=monitor.js.map