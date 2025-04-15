"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderEvent = void 0;
const database_js_1 = __importDefault(require("../../modules/database.js"));
const shopping_js_1 = require("./shopping.js");
const fb_api_js_1 = require("./fb-api.js");
const user_js_1 = require("./user.js");
class OrderEvent {
    static async insertOrder(obj) {
        const { orderID, email } = obj.cartData;
        const store_info = await new user_js_1.User(obj.app).getConfigV2({
            key: 'store-information',
            user_id: 'manager',
        });
        console.log(`store_info.pickup_mode=>`, store_info.pickup_mode);
        if (store_info.pickup_mode) {
            obj.cartData.user_info.shipment_number = parseInt(store_info.pickup_now || '0', 10) + 1;
            if (obj.cartData.user_info.shipment_number < parseInt(store_info.pickup_start || '0', 10)) {
                obj.cartData.user_info.shipment_number = parseInt(store_info.pickup_start || '0', 10);
            }
            if (obj.cartData.user_info.shipment_number > parseInt(store_info.pickup_end || '0', 10)) {
                obj.cartData.user_info.shipment_number = parseInt(store_info.pickup_start || '0', 10);
            }
            store_info.pickup_now = obj.cartData.user_info.shipment_number;
            await new user_js_1.User(obj.app).setConfig({
                key: 'store-information',
                value: store_info,
                user_id: 'manager'
            });
        }
        await database_js_1.default.execute(`REPLACE INTO \`${obj.app}\`.t_checkout (cart_token, status, email, orderData) VALUES (?, ?, ?, ?)
      `, [orderID, obj.status, email, obj.cartData]);
        await new shopping_js_1.Shopping(obj.app).putOrder({
            cart_token: orderID,
            status: undefined,
            orderData: obj.cartData,
        });
        await new fb_api_js_1.FbApi(obj.app).checkOut(obj.cartData);
    }
}
exports.OrderEvent = OrderEvent;
//# sourceMappingURL=order-event.js.map