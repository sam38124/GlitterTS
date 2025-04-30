"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStrategyFactory = void 0;
const ecpay_strategy_js_1 = require("../strategies/ecpay-strategy.js");
const ezpay_strategy_js_1 = require("../strategies/ezpay-strategy.js");
const paypal_strategy_js_1 = require("../strategies/paypal-strategy.js");
const linepay_strategy_js_1 = require("../strategies/linepay-strategy.js");
const jkopay_strategy_1 = require("../strategies/jkopay-strategy");
const paynow_strategy_1 = require("../strategies/paynow-strategy");
const paymentStrategyConfigurations = [
    { key: 'ecPay', strategyClass: ecpay_strategy_js_1.EcPayStrategy },
    { key: 'newWebPay', strategyClass: ezpay_strategy_js_1.EzPayStrategy },
    { key: 'paypal', strategyClass: paypal_strategy_js_1.PayPalStrategy },
    { key: 'line_pay', strategyClass: linepay_strategy_js_1.LinePayStrategy },
    { key: 'jkopay', strategyClass: jkopay_strategy_1.JkoPayStrategy },
    { key: 'paynow', strategyClass: paynow_strategy_1.PayNowStrategy },
];
class PaymentStrategyFactory {
    constructor(loadedKeyData) {
        if (!loadedKeyData) {
            throw new Error("KeyData must be provided to PaymentStrategyFactory");
        }
        this.allKeyData = loadedKeyData;
    }
    createStrategyRegistry() {
        const strategies = new Map();
        paymentStrategyConfigurations.forEach(config => {
            const specificKeyData = this.allKeyData[config.key];
            if (specificKeyData) {
                try {
                    const strategyInstance = new config.strategyClass(specificKeyData);
                    strategies.set(config.key, strategyInstance);
                    console.log(`Strategy registered for key: ${config.key}`);
                }
                catch (error) {
                    console.error(`Error instantiating strategy for key '${config.key}':`, error);
                    console.warn(`Strategy for '${config.key}' will not be available.`);
                }
            }
            else {
                console.warn(`Key data for '${config.key}' not found in provided configuration. Strategy not available.`);
            }
        });
        console.log(`PaymentStrategyFactory: Registry created with ${strategies.size} strategies.`);
        return strategies;
    }
}
exports.PaymentStrategyFactory = PaymentStrategyFactory;
//# sourceMappingURL=payment-strategy-factory.js.map