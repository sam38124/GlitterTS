import { IPaymentStrategy, PaymentConfig, PaymentResult } from '../interface/payment-strategy-interface.js';
import { Cart } from '../shopping.js';
import { EcPayV2, KeyData, PayPalV2 } from '../financial-serviceV2.js';
import { PayPalKeyData } from '../interface/payment-keys-interface';

export class PayPalStrategy implements IPaymentStrategy {
  private readonly keys: PayPalKeyData;

  // **** 建構子接收 EcPayKeyData ****
  constructor(keys: PayPalKeyData) {
    this.keys = keys;
  }
  async initiatePayment(orderData: Cart, config: PaymentConfig): Promise<PaymentResult> {
    const payPalConfig = {
      NotifyURL: `${config.domain}/api-public/v1/ec/notify?g-app=${config.app}&type=PayPal`,
      ReturnURL: `${config.domain}/api-public/v1/ec/redirect?g-app=${config.app}&return=${config.id}`,
      PAYPAL_CLIENT_ID: this.keys.PAYPAL_CLIENT_ID as string,
      PAYPAL_SECRET: this.keys.PAYPAL_SECRET as string,
      TYPE: 'PayPal',
      BETA: this.keys?.BETA?.toString()  ?? 'false',
    };

    const payPalInstance = new PayPalV2(config.app , payPalConfig);

    const returnData = await payPalInstance.checkout(orderData);
    return {
      orderId: returnData.orderId,
      approveLink: returnData.approveLink,
    };
  }
}
