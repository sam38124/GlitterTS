export interface paymentInterface {
    paypal: {
        PAYPAL_CLIENT_ID: string;
        PAYPAL_SECRET: string;
        BETA: boolean;
        toggle: boolean;
    };
    ecPay: {
        MERCHANT_ID: string;
        HASH_IV: string;
        HASH_KEY: string;
        ActionURL: string;
        atm: boolean;
        c_bar_code: boolean;
        c_code: boolean;
        credit: boolean;
        web_atm: boolean;
        toggle: boolean;
    };
    newWebPay: {
        MERCHANT_ID: string;
        HASH_IV: string;
        HASH_KEY: string;
        ActionURL: string;
        atm: boolean;
        c_bar_code: boolean;
        c_code: boolean;
        credit: boolean;
        web_atm: boolean;
        toggle: boolean;
    };
    off_line_support: {
        atm: boolean;
        cash_on_delivery: boolean;
        line: boolean;
    };
    payment_info_atm: {
        bank_account: string;
        bank_code: string;
        bank_name: string;
        bank_user: string;
        text: string;
    };
    payment_info_line_pay: {
        text: string;
    };
    payment_info_custom: {
        id: string;
        name: string;
        text: string;
    }[];
}

export const onlinePayArray = [
    {key: 'newWebPay', name: '藍新金流'},
    {key: 'ecPay', name: '綠界金流'},
    {key: 'paypal', name: 'PayPal'},
    {key: 'line_pay', name: 'Line Pay'},
    {key: 'line_pay_scan', name: 'Line Pay', type: 'pos'},
    {key: 'ut_credit_card', name: '聯合信用卡', type: 'pos'},
];
