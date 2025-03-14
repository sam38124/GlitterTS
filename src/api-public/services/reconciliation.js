"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reconciliation = void 0;
const database_1 = __importDefault(require("../../modules/database"));
class Reconciliation {
    constructor(app) {
        this.app_name = app;
    }
    async summary() {
        let result = {
            total: 0,
            total_received: 0,
            offset_amount: 0,
        };
        (await database_1.default.query(`select total, total_received, offset_amount
                    from \`${this.app_name}\`.t_checkout `, [])).map((item) => {
            if (item.total) {
                result.total += item.total;
                result.total_received += item.total_received || 0;
                result.offset_amount += item.offset_amount || 0;
                if (item.total_received !== null) {
                }
            }
        });
    }
}
exports.Reconciliation = Reconciliation;
//# sourceMappingURL=reconciliation.js.map