"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const redis_js_1 = __importDefault(require("../../modules/redis.js"));
const tool_js_1 = __importDefault(require("../../modules/tool.js"));
const private_config_1 = require("../../services/private_config");
class PaymentService {
    constructor(paymentStrategies, appName, payment_select) {
        this.paymentStrategies = paymentStrategies;
        this.paymentStrategies = paymentStrategies;
        this.app = appName;
        this.domain = process.env.DOMAIN || '';
        this.payment_select = payment_select;
        if (!process.env.DOMAIN)
            console.warn('DOMAIN environment variable is not set! Using default.');
    }
    async createInstance() {
        var _a;
        console.info('執行 createInstance 載入金流資料...');
        const keyData = (await private_config_1.Private_config.getConfig({
            appName: this.app,
            key: 'glitter_finance',
        }))[0].value;
        if (keyData) {
            this.kd = (_a = keyData[this.payment_select]) !== null && _a !== void 0 ? _a : {
                ReturnURL: '',
                NotifyURL: '',
            };
            console.log('金流資料載入完成 。');
        }
        else {
            console.log('金流資料載入錯誤 。');
        }
    }
    async processPayment(carData, return_url, payment_select) {
        if (!this.kd) {
            await this.createInstance();
        }
        if (!this.kd) {
            console.error('無法載入支付金鑰資料 (keyData)。');
            return { error: '無法載入支付金鑰資料，請聯繫管理員。' };
        }
        const id = 'redirect_' + tool_js_1.default.randomString(6);
        const redirect_url = new URL(return_url);
        redirect_url.searchParams.set('cart_token', carData.orderID);
        await redis_js_1.default.setValue(id, redirect_url.href);
        const strategy = this.paymentStrategies.get(payment_select);
        if (!strategy) {
            console.warn(`找不到支付方式 "${payment_select}" 的處理策略，將使用預設線下處理。`);
            const offlineStrategy = this.paymentStrategies.get('off_line');
            if (offlineStrategy) {
                const offlineConfig = {
                    app: this.app,
                    id: id,
                    domain: this.domain,
                };
                return await offlineStrategy.initiatePayment(carData, offlineConfig);
            }
            else {
                console.error(`不支援的支付方式: ${payment_select}，且找不到預設處理方式。`);
                return { error: `不支援的支付方式: ${payment_select}` };
            }
        }
        const config = {
            app: this.app,
            id: id,
            domain: this.domain,
        };
        try {
            return await strategy.initiatePayment(carData, config);
        }
        catch (paymentError) {
            console.error(`支付方式 "${payment_select}" 處理失敗:`, paymentError);
            const errorMessage = paymentError instanceof Error ? paymentError.message : String(paymentError);
            return { error: `支付處理失敗: ${errorMessage}` };
        }
    }
}
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment-service.js.map