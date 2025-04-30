import { IPaymentStrategy, PaymentConfig, PaymentResult } from '../interface/payment-strategy-interface.js';
import { Cart } from '../shopping.js';
import { EcEzPayKeyData } from '../interface/payment-keys-interface';
export declare class EcPayStrategy implements IPaymentStrategy {
    private readonly keys;
    constructor(keys: EcEzPayKeyData);
    initiatePayment(orderData: Cart, config: PaymentConfig): Promise<PaymentResult>;
}
