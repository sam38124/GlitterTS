"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Voucher = void 0;
const shopping_js_1 = require("./shopping.js");
const database_js_1 = __importDefault(require("../../modules/database.js"));
const exception_js_1 = __importDefault(require("../../modules/exception.js"));
class Voucher {
    constructor(app_name, token) {
        this.app = app_name;
        this.token = token;
    }
    async putVoucher(content) {
        try {
            const reContent = JSON.parse(content.content);
            if (reContent.type === 'product') {
                await new shopping_js_1.Shopping(this.app, this.token).postVariantsAndPriceValue(reContent);
                content.content = JSON.stringify(reContent);
            }
            content.updated_time = new Date();
            const data = await database_js_1.default.query(`update \`${this.app}\`.\`t_manager_post\`
                 SET ?
                 where 1 = 1
                   and id = ${reContent.id}`, [content]);
            return data;
        }
        catch (e) {
            throw exception_js_1.default.BadRequestError('BAD_REQUEST', 'PutVoucher Error:' + e, null);
        }
    }
}
exports.Voucher = Voucher;
//# sourceMappingURL=voucher.js.map