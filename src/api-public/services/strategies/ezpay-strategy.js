"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EzPayStrategy = void 0;
const financial_serviceV2_js_1 = require("../financial-serviceV2.js");
class EzPayStrategy {
    constructor(keys) {
        this.keys = keys;
    }
    async initiatePayment(orderData, config) {
        const ezPayConfig = {
            HASH_IV: this.keys.HASH_IV,
            HASH_KEY: this.keys.HASH_KEY,
            ActionURL: this.keys.ActionURL,
            NotifyURL: `${config.domain}/api-public/v1/ec/notify?g-app=${config.app}&type=newWebPay`,
            ReturnURL: `${config.domain}/api-public/v1/ec/redirect?g-app=${config.app}&return=${config.id}`,
            MERCHANT_ID: this.keys.MERCHANT_ID,
            TYPE: 'newWebPay',
        };
        const ezpayInstance = new financial_serviceV2_js_1.EzPayV2(config.app, ezPayConfig);
        const formHtml = await ezpayInstance.executePayment(orderData);
        return { form: formHtml };
    }
}
exports.EzPayStrategy = EzPayStrategy;
//# sourceMappingURL=ezpay-strategy.js.map