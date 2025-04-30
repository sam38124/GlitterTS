import { IPaymentStrategy, PaymentConfig, PaymentResult } from '../interface/payment-strategy-interface.js';
import { Cart } from '../shopping.js';
import { EcPayV2, KeyData } from '../financial-serviceV2.js';
import { EcEzPayKeyData } from '../interface/payment-keys-interface';

export class EcPayStrategy implements IPaymentStrategy {
  private readonly keys: EcEzPayKeyData; // 持有 EcPay 專屬金鑰

  //測試信用卡  4311-9511-1111-1111 驗證碼隨便
  constructor(keys: EcEzPayKeyData) {
    this.keys = keys;
  }
  async initiatePayment(orderData: Cart, config: PaymentConfig): Promise<PaymentResult> {
    const ecPayConfig:KeyData = {
      HASH_IV: this.keys.HASH_IV,
      HASH_KEY: this.keys.HASH_KEY,
      ActionURL: this.keys.ActionURL,
      NotifyURL: `${config.domain}/api-public/v1/ec/notify?g-app=${config.app}&type=ecPay`,
      ReturnURL: `${config.domain}/api-public/v1/ec/redirect?g-app=${config.app}&return=${config.id}`,
      MERCHANT_ID: this.keys.MERCHANT_ID,
      TYPE: 'ecPay' ,
    };
    console.log("ecPayConfig -- " , ecPayConfig);
    const ecpayInstance = new EcPayV2(config.app, ecPayConfig);
    // 注意：原始的 createOrderPage 可能需要更完整的 orderData，這裡直接傳入
    // 您可能需要根據 EcPay 類別的實際需要調整傳遞給 createOrderPage 的參數
    const formHtml = await ecpayInstance.executePayment(orderData);
    return { form: formHtml };
  }
}