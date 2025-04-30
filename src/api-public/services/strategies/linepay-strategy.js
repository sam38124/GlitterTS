"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinePayStrategy = void 0;
const financial_serviceV2_js_1 = require("../financial-serviceV2.js");
class LinePayStrategy {
    constructor(keys) {
        this.keys = keys;
    }
    async initiatePayment(orderData, config) {
        var _a, _b, _c;
        const linePayConfig = {
            ReturnURL: `${process.env.DOMAIN}/api-public/v1/ec/repay_redirect?g-app=${config.app}&return=${config.id}&type=LinePay`,
            NotifyURL: `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${config.app}&type=LinePay`,
            LinePay_CLIENT_ID: this.keys.CLIENT_ID,
            LinePay_SECRET: this.keys.SECRET,
            TYPE: 'line_pay',
            BETA: (_c = (_b = (_a = this.keys) === null || _a === void 0 ? void 0 : _a.BETA) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _c !== void 0 ? _c : 'false',
        };
        const linePayInstance = new financial_serviceV2_js_1.LinePayV2(config.app, {
            BETA: linePayConfig.BETA,
            LinePay_CLIENT_ID: linePayConfig.LinePay_CLIENT_ID,
            LinePay_SECRET: linePayConfig.LinePay_SECRET,
            ReturnURL: linePayConfig.ReturnURL,
        });
        const returnData = await linePayInstance.executePayment(orderData);
        return {
            responseData: returnData,
        };
    }
}
exports.LinePayStrategy = LinePayStrategy;
//# sourceMappingURL=linepay-strategy.js.map