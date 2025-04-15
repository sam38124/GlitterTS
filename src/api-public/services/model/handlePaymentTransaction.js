"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = __importDefault(require("process"));
const financial_service_js_1 = __importDefault(require("../financial-service.js"));
const private_config_js_1 = require("../../../services/private_config.js");
const tool_js_1 = __importDefault(require("../../../modules/tool.js"));
const mime = require('mime');
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
    async processPayment(carData) {
        if (!this.kd) {
            await this.createInstance();
        }
        switch (this.payment_select) {
            case 'ecPay':
            case 'newWebPay':
                const id = 'redirect_' + tool_js_1.default.randomString(6);
                const subMitData = await new financial_service_js_1.default(this.app, {
                    HASH_IV: this.kd.HASH_IV,
                    HASH_KEY: this.kd.HASH_KEY,
                    ActionURL: this.kd.ActionURL,
                    NotifyURL: `${process_1.default.env.DOMAIN}/api-public/v1/ec/notify?g-app=${this.app}&type=${carData.customer_info.payment_select}`,
                    ReturnURL: `${process_1.default.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}`,
                    MERCHANT_ID: this.kd.MERCHANT_ID,
                    TYPE: this.payment_select,
                }).createOrderPage(carData);
                return { form: subMitData };
        }
    }
}
exports.default = PaymentTransaction;
//# sourceMappingURL=handlePaymentTransaction.js.map