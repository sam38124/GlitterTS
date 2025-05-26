import { IPaymentStrategy, PaymentConfig, PaymentResult } from '../interface/payment-strategy-interface.js';
import { Cart } from '../shopping.js';
import { EzPayV2, KeyData } from '../financial-serviceV2.js';
import { EcEzPayKeyData } from '../interface/payment-keys-interface';
//藍新金流
//測試信用卡 4000 2211 1111 1111 驗證碼123
export class EzPayStrategy implements IPaymentStrategy {
  private readonly keys: EcEzPayKeyData;

  // **** 建構子接收 EcPayKeyData ****
  constructor(keys: EcEzPayKeyData) {
    this.keys = keys;
  }
  async initiatePayment(orderData: Cart, config: PaymentConfig): Promise<PaymentResult> {
    const ezPayConfig: KeyData = {
      HASH_IV: this.keys.HASH_IV,
      HASH_KEY: this.keys.HASH_KEY,
      ActionURL: this.keys.ActionURL,
      NotifyURL: `${config.domain}/api-public/v1/ec/notify?g-app=${config.app}&type=newWebPay`,
      ReturnURL: `${config.domain}/api-public/v1/ec/redirect?g-app=${config.app}&return=${config.id}`,
      MERCHANT_ID: this.keys.MERCHANT_ID,
      TYPE: 'newWebPay',
    };
    const ezpayInstance = new EzPayV2(config.app, ezPayConfig);
    const formHtml = await ezpayInstance.executePayment(orderData);
    return { form: formHtml };
  }
}
