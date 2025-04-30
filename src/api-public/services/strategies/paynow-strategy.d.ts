import { IPaymentStrategy, PaymentConfig, PaymentResult } from '../interface/payment-strategy-interface.js';
import { Cart } from '../shopping.js';
import { PayNowKeyData } from '../interface/payment-keys-interface';
export declare class PayNowStrategy implements IPaymentStrategy {
    private readonly keys;
    constructor(keys: PayNowKeyData);
    initiatePayment(orderData: Cart, config: PaymentConfig): Promise<PaymentResult>;
}
