"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayNowStrategy = void 0;
const financial_serviceV2_js_1 = require("../financial-serviceV2.js");
class PayNowStrategy {
    constructor(keys) {
        this.keys = keys;
    }
    async initiatePayment(orderData, config) {
        const payNowConfig = {
            ReturnURL: `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${config.app}&return=${config.id}&type=paynow&paynow=true`,
            NotifyURL: `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${config.app}&paynow=true&type=paynow`,
            PrivateKey: this.keys.PrivateKey,
            PublicKey: this.keys.PublicKey,
            BETA: this.keys.BETA,
            TYPE: 'paynow',
        };
        const payNowInstance = new financial_serviceV2_js_1.PayNowV2(config.app, payNowConfig);
        const returnData = await payNowInstance.executePayment(orderData);
        return {
            responseData: returnData,
        };
    }
}
exports.PayNowStrategy = PayNowStrategy;
//# sourceMappingURL=paynow-strategy.js.map