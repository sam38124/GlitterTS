import { IPaymentStrategy, PaymentConfig, PaymentResult } from '../interface/payment-strategy-interface.js';
import { Cart } from '../shopping.js';
import { EcPayV2, JKOV2, KeyData, LinePayV2, PayNowV2, PayPalV2 } from '../financial-serviceV2.js';
import { JkoPayKeyData, PayNowKeyData } from '../interface/payment-keys-interface';

export class PayNowStrategy implements IPaymentStrategy {
  private readonly keys: PayNowKeyData; // 持有 EcPay 專屬金鑰

  // **** 建構子接收 EcPayKeyData ****
  constructor(keys: PayNowKeyData) {
    this.keys = keys;
  }
  async initiatePayment(orderData: Cart, config: PaymentConfig): Promise<PaymentResult> {
    const payNowConfig = {
      ReturnURL : `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${config.app}&return=${config.id}&type=paynow&paynow=true`,
      NotifyURL : `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${config.app}&paynow=true&type=paynow`,

      PrivateKey:this.keys.PrivateKey,
      PublicKey:this.keys.PublicKey,
      BETA:this.keys.BETA,
      TYPE: 'paynow',
    };
    const payNowInstance = new PayNowV2(config.app, payNowConfig);
    const returnData = await payNowInstance.executePayment(orderData);
    return {
      responseData: returnData,
    };
  }
}
