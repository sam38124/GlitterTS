"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JkoPayStrategy = void 0;
const financial_serviceV2_js_1 = require("../financial-serviceV2.js");
class JkoPayStrategy {
    constructor(keys) {
        this.keys = keys;
    }
    async initiatePayment(orderData, config) {
        const jkoPayConfig = {
            ReturnURL: `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${config.app}&return=${config.id}&type=jkopay`,
            NotifyURL: `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${config.app}&type=jkopay`,
            API_KEY: this.keys.API_KEY,
            SECRET_KEY: this.keys.SECRET_KEY,
            STORE_ID: this.keys.STORE_ID,
            TYPE: 'jkopay',
        };
        const jkoPayInstance = new financial_serviceV2_js_1.JKOV2(config.app, {
            API_KEY: jkoPayConfig.API_KEY,
            NotifyURL: jkoPayConfig.NotifyURL,
            ReturnURL: jkoPayConfig.ReturnURL,
            SECRET_KEY: jkoPayConfig.SECRET_KEY,
            STORE_ID: jkoPayConfig.STORE_ID,
        });
        const returnData = await jkoPayInstance.executePayment(orderData);
        return {
            responseData: returnData,
        };
    }
}
exports.JkoPayStrategy = JkoPayStrategy;
//# sourceMappingURL=jkopay-strategy.js.map