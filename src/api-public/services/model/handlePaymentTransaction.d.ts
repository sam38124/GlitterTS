declare class PaymentTransaction {
    private readonly app;
    private kd;
    private readonly payment_select;
    constructor(app: string, payment_select: string);
    createInstance(): Promise<void>;
    processPayment(carData: any): Promise<any>;
}
export default PaymentTransaction;
