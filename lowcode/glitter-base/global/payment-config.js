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
            const offlinePayArray = [
                ...this.defalutOfflinePay,
                ...keyData.payment_info_custom.map((dd) => {
                    return {
                        key: dd.id,
                        name: `${Language.getLanguageCustomText(dd.name)}`,
                        custom: true,
                    };
                }),
            ].filter((dd) => {
                return all || keyData.off_line_support[dd.key];
            });
            return PaymentConfig.onlinePay
                .filter(dd => {
                return all || keyData[dd.key].toggle;
            })
                .concat(offlinePayArray);
        });
    }
}
PaymentConfig.onlinePay = [
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
        name: '高鉅信用卡支付',
        type: 'pos',
        img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAgCAMAAADZqYNOAAAALVBMVEXzmB5HcEzzmB7zmB7zmB7zmB7zmB7zmB7zmB7zmB7zmB7zmB7zmB7zmB7zmB5P11V9AAAAD3RSTlP/AEsrpvPHDhwH2XGJYTqdn/9qAAAA4UlEQVQokX3TSQLDIAgFUBBBTTT3P26BTK1a/6KDzxJFC5hoTMEzgAHGsBwL1exLdf6vkJdal7otlUk1hy7bzUF1zK1tqvLsaabbStvw3BblzrMoX/P37HG/iPt8v82V5ih+ChjndZNr5hnG6/SPZ4QlXtnzcHMkjz19tTyDpZTz7dXzSVUkYGMO+pH5Vb9m/sXOgW2j9dVq6rs7bKVVZ/SVGbTP9ZrV8Fe12hGtwdYEwU4jcAp+VysAdVo2/UFiK70D507JV66ly5eyxbR60Wavt2I6o+3JRNYiomT/Wx34AAcuBkbh8b8BAAAAAElFTkSuQmCC',
    },
];
PaymentConfig.defalutOfflinePay = [
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
];
