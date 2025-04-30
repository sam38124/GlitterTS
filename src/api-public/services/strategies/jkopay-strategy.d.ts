import { IPaymentStrategy, PaymentConfig, PaymentResult } from '../interface/payment-strategy-interface.js';
import { Cart } from '../shopping.js';
import { JkoPayKeyData } from '../interface/payment-keys-interface';
export declare class JkoPayStrategy implements IPaymentStrategy {
    private readonly keys;
    constructor(keys: JkoPayKeyData);
    initiatePayment(orderData: Cart, config: PaymentConfig): Promise<PaymentResult>;
}
