import { IPaymentStrategy } from '../interface/payment-strategy-interface.js';
export declare class PaymentStrategyFactory {
    private allKeyData;
    constructor(loadedKeyData: Record<string, any>);
    createStrategyRegistry(): Map<string, IPaymentStrategy>;
}
