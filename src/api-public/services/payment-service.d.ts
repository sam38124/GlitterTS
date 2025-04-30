import { IPaymentStrategy, PaymentResult } from './interface/payment-strategy-interface.js';
import { Cart } from './shopping.js';
export declare class PaymentService {
    private paymentStrategies;
    private kd;
    private app;
    private domain;
    private payment_select;
    constructor(paymentStrategies: Map<string, IPaymentStrategy>, appName: string, payment_select: string);
    private createInstance;
    processPayment(carData: Cart, return_url: string, payment_select: string): Promise<PaymentResult>;
}
