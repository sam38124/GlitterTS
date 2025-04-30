import { IPaymentStrategy, PaymentConfig, PaymentResult } from '../interface/payment-strategy-interface.js';
import { Cart } from '../shopping.js';
import { PayPalKeyData } from '../interface/payment-keys-interface';
export declare class PayPalStrategy implements IPaymentStrategy {
    private readonly keys;
    constructor(keys: PayPalKeyData);
    initiatePayment(orderData: Cart, config: PaymentConfig): Promise<PaymentResult>;
}
