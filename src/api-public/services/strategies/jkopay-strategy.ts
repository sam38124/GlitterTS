import { IPaymentStrategy, PaymentConfig, PaymentResult } from '../interface/payment-strategy-interface.js';
import { Cart } from '../shopping.js';
import { EcPayV2, JKOV2, KeyData, LinePayV2, PayPalV2 } from '../financial-serviceV2.js';
import { JkoPayKeyData } from '../interface/payment-keys-interface';

export class JkoPayStrategy implements IPaymentStrategy {
  private readonly keys: JkoPayKeyData; // 持有 EcPay 專屬金鑰

  // **** 建構子接收 EcPayKeyData ****
  constructor(keys: JkoPayKeyData) {
    this.keys = keys;
  }
  async initiatePayment(orderData: Cart, config: PaymentConfig): Promise<PaymentResult> {
    const jkoPayConfig = {
      ReturnURL: `${process.env.DOMAIN}/api-public/v1/ec/redirect?g-app=${config.app}&return=${config.id}&type=jkopay`,
      NotifyURL: `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${config.app}&type=jkopay`,
      API_KEY: this.keys.API_KEY as string,
      SECRET_KEY: this.keys.SECRET_KEY as string,
      STORE_ID:this.keys.STORE_ID,
      TYPE: 'jkopay',
    };

    const jkoPayInstance = new JKOV2(config.app, {
      API_KEY: jkoPayConfig.API_KEY,
      NotifyURL: jkoPayConfig.NotifyURL,
      ReturnURL: jkoPayConfig.ReturnURL,
      SECRET_KEY: jkoPayConfig.SECRET_KEY,
      STORE_ID: jkoPayConfig.STORE_ID,
    });

    const returnData = await jkoPayInstance.executePayment(orderData);
    return {
      responseData: returnData,
    };
  }
}
