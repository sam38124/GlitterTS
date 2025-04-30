import { IPaymentStrategy, PaymentConfig, PaymentResult } from '../interface/payment-strategy-interface.js';
import { Cart } from '../shopping.js';
import { EcPayV2, KeyData, LinePayV2, PayPalV2 } from '../financial-serviceV2.js';
import { EcEzPayKeyData, LinePayKeyData } from '../interface/payment-keys-interface';

export class LinePayStrategy implements IPaymentStrategy {
  private readonly keys: LinePayKeyData; // 持有 EcPay 專屬金鑰

  // **** 建構子接收 EcPayKeyData ****
  constructor(keys: LinePayKeyData) {
    this.keys = keys;
  }
  async initiatePayment(orderData: Cart, config: PaymentConfig): Promise<PaymentResult> {
    const linePayConfig = {
      ReturnURL: `${process.env.DOMAIN}/api-public/v1/ec/repay_redirect?g-app=${config.app}&return=${config.id}&type=LinePay`,
      NotifyURL: `${process.env.DOMAIN}/api-public/v1/ec/notify?g-app=${config.app}&type=LinePay`,
      LinePay_CLIENT_ID: this.keys.CLIENT_ID as string,
      LinePay_SECRET: this.keys.SECRET as string,
      TYPE: 'line_pay',
      BETA: this.keys?.BETA?.toString() ?? 'false',
    };
    const linePayInstance = new LinePayV2(config.app, {
      BETA: linePayConfig.BETA,
      LinePay_CLIENT_ID: linePayConfig.LinePay_CLIENT_ID,
      LinePay_SECRET: linePayConfig.LinePay_SECRET,
      ReturnURL: linePayConfig.ReturnURL,

    });

    const returnData = await linePayInstance.executePayment(orderData);
    return {
      responseData: returnData,
    };
  }
}
