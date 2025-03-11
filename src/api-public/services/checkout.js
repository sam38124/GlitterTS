"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutService = void 0;
const database_js_1 = __importDefault(require("../../modules/database.js"));
class CheckoutService {
    static async updateAndMigrateToTableColumn(obj) {
        var _a, _b;
        const update_object = {};
        const json = obj.orderData;
        json.progress = (_a = json.progress) !== null && _a !== void 0 ? _a : 'wait';
        update_object.progress = json.progress;
        json.orderStatus = (_b = json.orderStatus) !== null && _b !== void 0 ? _b : '0';
        update_object.order_status = json.orderStatus;
        if (json.customer_info && json.customer_info.payment_select) {
            update_object.payment_method = json.customer_info.payment_select;
        }
        if (json.pos_info && json.pos_info.payment && Array.isArray(json.pos_info.payment)) {
            update_object.payment_method = json.pos_info.payment
                .map((item) => {
                return item.method;
            })
                .sort()
                .join('|');
        }
        update_object.shipment_method = json.user_info.shipment;
        if (json.user_info.shipment_date) {
            update_object.shipment_date = new Date(json.user_info.shipment_date);
        }
        else {
            update_object.shipment_date = null;
        }
        update_object.total = json.total;
        if (!obj.no_shipment_number) {
            if (json.user_info.shipment_number) {
                update_object.shipment_number = json.user_info.shipment_number;
            }
            else {
                update_object.shipment_number = null;
            }
        }
        await database_js_1.default.query(`update \`${obj.app_name}\`.t_checkout
       set ?
       where id = ${obj.id}`, [update_object]);
    }
}
exports.CheckoutService = CheckoutService;
//# sourceMappingURL=checkout.js.map