import { Language } from './language.js';

export class PaymentConfig {
  public static onlinePay = [
    {
      key: 'newWebPay',
      name: '藍新金流',
      img: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/logo.jpg',
    },
    {
      key: 'ecPay',
      name: '綠界金流',
      img: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/52415944_122858408.428215.png',
    },
    {
      key: 'paynow',
      name: 'PayNow 立吉富',
      img: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/download.png',
    },
    {
      key: 'paypal',
      name: 'PayPal',
      img: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/174861.png',
    },
    {
      key: 'line_pay',
      name: 'Line Pay',
      img: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/tw-11134207-7r98t-ltrond04grjj74.jpeg',
    },
    {
      key: 'jkopay',
      name: '街口支付',
      img: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/1200x630waw.png',
    },
    {
      key: 'line_pay_scan',
      name: 'Line Pay',
      type: 'pos',
      img: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/tw-11134207-7r98t-ltrond04grjj74.jpeg',
    },
    {
      key: 'ut_credit_card',
      name: '聯合信用卡',
      type: 'pos',
      img: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/unnamed (1) copy.jpg',
    },
  ];

  public static async getSupportPayment(all: boolean = false) {
    const saasConfig: { config: any; api: any } = (window.parent as any).saasConfig;
    const data = await saasConfig.api.getPrivateConfig(saasConfig.config.appName, 'glitter_finance');
    let keyData: any = {};
    if (data.response.result[0]) {
      keyData = {
        ...keyData,
        ...data.response.result[0].value,
      };
    }
    const offlinePayArray = [
      {
        key: 'atm',
        name: 'ATM銀行轉帳',
        customerClass: 'guide2-3',
        img: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/20200804163522idfs9.jpg',
      },
      {
        key: 'line',
        name: 'LINE 轉帳',
        img: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/unnamed.webp',
      },
      {
        key: 'cash_on_delivery',
        name: '貨到付款',
        img: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/images.png',
      },
      ...keyData.payment_info_custom.map((dd: any) => {
        return {
          key: dd.id,
          name: `${Language.getLanguageCustomText(dd.name)}`,
          custom: true,
        };
      }),
    ].filter((dd: any) => {
      return all || keyData.off_line_support[dd.key];
    });

    return PaymentConfig.onlinePay
      .filter(dd => {
        return all || (keyData as any)[dd.key].toggle;
      })
      .concat(offlinePayArray);
  }
}
