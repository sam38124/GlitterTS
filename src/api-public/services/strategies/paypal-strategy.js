"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayPalStrategy = void 0;
const financial_serviceV2_js_1 = require("../financial-serviceV2.js");
class PayPalStrategy {
    constructor(keys) {
        this.keys = keys;
    }
    async initiatePayment(orderData, config) {
        var _a, _b, _c;
        const payPalConfig = {
            NotifyURL: `${config.domain}/api-public/v1/ec/notify?g-app=${config.app}&type=PayPal`,
            ReturnURL: `${config.domain}/api-public/v1/ec/redirect?g-app=${config.app}&return=${config.id}`,
            PAYPAL_CLIENT_ID: this.keys.PAYPAL_CLIENT_ID,
            PAYPAL_SECRET: this.keys.PAYPAL_SECRET,
            TYPE: 'PayPal',
            BETA: (_c = (_b = (_a = this.keys) === null || _a === void 0 ? void 0 : _a.BETA) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _c !== void 0 ? _c : 'false',
        };
        const payPalInstance = new financial_serviceV2_js_1.PayPalV2(config.app, payPalConfig);
        const returnData = await payPalInstance.checkout(orderData);
        return {
            orderId: returnData.orderId,
            approveLink: returnData.approveLink,
        };
    }
}
exports.PayPalStrategy = PayPalStrategy;
//# sourceMappingURL=paypal-strategy.js.map