"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const private_config_js_1 = require("../../../services/private_config.js");
class PaymentTransaction {
    constructor(app, payment_select) {
        this.app = app;
        this.payment_select = payment_select;
    }
    async createInstance() {
        var _a;
        try {
            const keyData = (await private_config_js_1.Private_config.getConfig({
                appName: this.app,
                key: 'glitter_finance',
            }))[0].value;
            this.kd = (_a = keyData[this.payment_select]) !== null && _a !== void 0 ? _a : {
                ReturnURL: '',
                NotifyURL: '',
            };
        }
        catch (error) {
            throw new Error(`Failed to create MyClass instance: ${error}`);
        }
    }
    async processPayment(carData, return_url) {
        if (!this.kd) {
            await this.createInstance();
        }
    }
}
exports.default = PaymentTransaction;
//# sourceMappingURL=handlePaymentTransaction.js.map