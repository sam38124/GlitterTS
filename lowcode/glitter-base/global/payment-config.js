var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Language } from './language.js';
export class PaymentConfig {
    static getSupportPayment(all = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const saasConfig = window.parent.saasConfig;
            const data = yield saasConfig.api.getPrivateConfig(saasConfig.config.appName, 'glitter_finance');
            let keyData = {};
            if (data.response.result[0]) {
                keyData = Object.assign(Object.assign({}, keyData), data.response.result[0].value);
            }
            console.log(`keyDatakeyData=>`, keyData);
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
                    name: `<div class="d-flex flex-wrap align-items-center" style="gap:5px;">
貨到付款
</div>`,
                    img: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/images.png',
                },
                ...keyData.payment_info_custom.map((dd) => {
                    return {
                        key: dd.id,
                        name: `${Language.getLanguageCustomText(dd.name)}`,
                        custom: true,
                    };
                }),
            ].filter((dd) => {
                if (all) {
                    return true;
                }
                return keyData.off_line_support[dd.key];
            });
            return PaymentConfig.onlinePay.filter(dd => {
                if (all) {
                    return true;
                }
                return keyData[dd.key].toggle;
            }).concat(offlinePayArray);
        });
    }
}
PaymentConfig.onlinePay = [
    { key: 'newWebPay', name: '藍新金流', img: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/logo.jpg' },
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
    { key: 'paypal', name: 'PayPal', img: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/174861.png' },
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
