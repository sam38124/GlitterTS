"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcPayStrategy = void 0;
const financial_serviceV2_js_1 = require("../financial-serviceV2.js");
class EcPayStrategy {
    constructor(keys) {
        this.keys = keys;
    }
    async initiatePayment(orderData, config) {
        const ecPayConfig = {
            HASH_IV: this.keys.HASH_IV,
            HASH_KEY: this.keys.HASH_KEY,
            ActionURL: this.keys.ActionURL,
            NotifyURL: `${config.domain}/api-public/v1/ec/notify?g-app=${config.app}&type=ecPay`,
            ReturnURL: `${config.domain}/api-public/v1/ec/redirect?g-app=${config.app}&return=${config.id}`,
            MERCHANT_ID: this.keys.MERCHANT_ID,
            TYPE: 'ecPay',
        };
        console.log("ecPayConfig -- ", ecPayConfig);
        const ecpayInstance = new financial_serviceV2_js_1.EcPayV2(config.app, ecPayConfig);
        const formHtml = await ecpayInstance.executePayment(orderData);
        return { form: formHtml };
    }
}
exports.EcPayStrategy = EcPayStrategy;
//# sourceMappingURL=ecpay-strategy.js.map