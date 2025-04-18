"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = __importDefault(require("process"));
const financial_service_js_1 = __importStar(require("../financial-service.js"));
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
        const id = 'redirect_' + tool_js_1.default.randomString(6);
        switch (this.payment_select) {
            case 'ecPay':
            case 'newWebPay':
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
            case 'line_pay':
                this.kd.ReturnURL = `${process_1.default.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${this.app}&return=${id}&type=${carData.customer_info.payment_select}`;
                this.kd.NotifyURL = `${process_1.default.env.DOMAIN}/api-public/v1/ec/notify?g-app=${this.app}&type=${carData.customer_info.payment_select}`;
                return await new financial_service_js_1.LinePay(this.app, this.kd).createOrder(carData);
        }
    }
}
exports.default = PaymentTransaction;
//# sourceMappingURL=handlePaymentTransaction.js.map