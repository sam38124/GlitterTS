import { Cart } from '../shopping.js';
export interface PaymentResult {
    form?: string;
    orderId?: string;
    approveLink?: string;
    responseData?: any;
    off_line?: boolean;
    error?: string;
}
export interface PaymentConfig {
    app: string;
    id: string;
    domain: string;
}
export interface IPaymentStrategy {
    initiatePayment(orderData: Cart, config: PaymentConfig): Promise<PaymentResult>;
}
