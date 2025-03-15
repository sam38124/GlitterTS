"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reconciliation = void 0;
const database_1 = __importDefault(require("../../modules/database"));
function convertTimeZone(date) {
    return `CONVERT_TZ(${date}, '+00:00', '+08:00')`;
}
class Reconciliation {
    constructor(app) {
        this.app_name = app;
    }
    async summary(filter_date, start_date, end_date) {
        let result = {
            total: 0,
            total_received: 0,
            offset_amount: 0,
            expected_received: 0,
            order_count: 0,
            short_total_amount: 0,
            over_total_amount: 0,
        };
        const dayOffset = (() => {
            if (['week', '1m', 'year'].includes(filter_date)) {
                return `DATE(${convertTimeZone('created_time')}) > DATE_SUB(${convertTimeZone(`DATE(NOW())`)}, INTERVAL ${[7, 30, 365][['week', '1m', 'year'].indexOf(filter_date)]} DAY)`;
            }
            else {
                return `created_time>='${start_date}' and created_time<='${end_date}'`;
            }
        })();
        (await database_1.default.query(`select total, total_received, offset_amount
         from \`${this.app_name}\`.t_checkout
         WHERE ${dayOffset}
        `, [])).map((item) => {
            if (item.total) {
                result.total += item.total;
                result.total_received += ((item.total_received || 0) + item.offset_amount);
                result.offset_amount += item.offset_amount || 0;
                if (item.total_received !== null) {
                    if (item.total_received > item.total) {
                        result.over_total_amount += item.total_received - item.total + item.offset_amount;
                    }
                    if (item.total > item.total_received) {
                        result.short_total_amount += item.total - item.total_received - item.offset_amount;
                    }
                }
                result.order_count += 1;
            }
        });
        result.expected_received = result.total - result.total_received;
        result.offset_amount = Math.abs(result.over_total_amount) + Math.abs(result.short_total_amount);
        return result;
    }
    async putReconciliation(obj) {
        console.log(`obj.update`, obj.update);
        if (obj.update.reconciliation_date) {
            obj.update.reconciliation_date = new Date(obj.update.reconciliation_date);
        }
        return await database_1.default.query(`update \`${this.app_name}\`.t_checkout
       set ?
       where cart_token = ?`, [obj.update, obj.order_id]);
    }
}
exports.Reconciliation = Reconciliation;
//# sourceMappingURL=reconciliation.js.map