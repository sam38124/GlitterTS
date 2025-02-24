"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderEvent = void 0;
const database_js_1 = __importDefault(require("../../modules/database.js"));
const fb_api_js_1 = require("./fb-api.js");
class OrderEvent {
    static async insertOrder(obj) {
        await database_js_1.default.execute(`INSERT INTO \`${obj.app}\`.t_checkout (cart_token, status, email, orderData)
                             values (?, ?, ?, ?)`, [obj.cartData.orderID, obj.status, obj.cartData.email, obj.cartData]);
        await new fb_api_js_1.FbApi(obj.app).checkOut(obj.cartData);
    }
}
exports.OrderEvent = OrderEvent;
//# sourceMappingURL=order-event.js.map