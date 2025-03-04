"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerSessions = void 0;
const exception_js_1 = __importDefault(require("../../modules/exception.js"));
const database_js_1 = __importDefault(require("../../modules/database.js"));
const mime = require('mime');
class CustomerSessions {
    constructor(app, token) {
        this.app = app;
        this.token = token;
    }
    async createScheduled(data) {
        try {
            const content = {
                platform: data.platform,
                item_list: data.item_list,
                stock: data.stock,
                discount_set: data.discount_set,
            };
            const queryData = await database_js_1.default.query(`INSERT INTO \`${this.app}\`.\`t_live_purchase_interactions\`
                           SET ?;`, [{
                    type: data.type,
                    stream_name: data.stream_name,
                    streamer: data.streamer,
                    status: "1",
                    content: JSON.stringify(content)
                }]);
            console.log("queryData -- ", queryData);
            return queryData.insertId;
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'createScheduled Error:' + e, null);
        }
    }
    async listenChatRoom() {
    }
}
exports.CustomerSessions = CustomerSessions;
//# sourceMappingURL=customer-sessions.js.map