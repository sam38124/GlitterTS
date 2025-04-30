import { IPaymentStrategy, PaymentConfig, PaymentResult } from '../interface/payment-strategy-interface.js';
import { Cart } from '../shopping.js';
import { LinePayKeyData } from '../interface/payment-keys-interface';
export declare class LinePayStrategy implements IPaymentStrategy {
    private readonly keys;
    constructor(keys: LinePayKeyData);
    initiatePayment(orderData: Cart, config: PaymentConfig): Promise<PaymentResult>;
}
