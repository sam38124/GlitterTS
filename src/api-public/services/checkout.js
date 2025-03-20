"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutService = void 0;
const database_js_1 = __importDefault(require("../../modules/database.js"));
class CheckoutService {
    static async updateAndMigrateToTableColumn(obj) {
        var _a, _b, _c;
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
        update_object.total = json.total || 0;
        if (!obj.no_shipment_number) {
            if (json.user_info.shipment_number) {
                update_object.shipment_number = json.user_info.shipment_number;
            }
            else {
                update_object.shipment_number = null;
            }
        }
        update_object.order_source = json.orderSource || null;
        update_object.archived = json.archived;
        if (json.customer_info) {
            update_object.customer_name = json.customer_info.name;
            update_object.customer_phone = json.customer_info.phone;
            update_object.customer_email = json.customer_info.email;
        }
        if (json.user_info) {
            update_object.shipment_name = json.user_info.name;
            update_object.shipment_phone = json.user_info.phone;
            update_object.shipment_email = json.user_info.email;
            update_object.shipment_address = [json.user_info.city, json.user_info.area, json.user_info.address].filter((dd) => {
                return dd;
            }).join('');
        }
        await database_js_1.default.query(`update \`${obj.app_name}\`.t_checkout
       set ?
       where id = ${obj.id}`, [update_object]);
        try {
            await database_js_1.default.query(`delete
                      from \`${obj.app_name}\`.t_products_sold_history
                      where order_id = ? and id>0`, [obj.orderData.orderID]);
            for (const b of obj.orderData.lineItems) {
                await database_js_1.default.query(`insert into \`${obj.app_name}\`.t_products_sold_history
                        set ?`, [
                    {
                        product_id: (_c = b.id) !== null && _c !== void 0 ? _c : -1,
                        order_id: obj.orderData.orderID,
                        spec: (b.spec || []).join('-'),
                        count: b.count
                    },
                ]);
            }
        }
        catch (e) {
            console.error(`insert-history-error: ${e}`);
        }
    }
}
exports.CheckoutService = CheckoutService;
//# sourceMappingURL=checkout.js.map