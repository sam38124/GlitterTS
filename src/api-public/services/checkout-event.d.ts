import { IToken } from '../models/Auth.js';
import { Shopping } from './shopping.js';
type CheckoutInsertType = 'add' | 'preview' | 'manual' | 'manual-preview' | 'POS' | 'split';
export type CartItem = {
    id: string;
    spec: string[];
    count: number;
    sale_price: number;
    is_gift?: boolean;
    collection: string[];
    title: string;
    preview_image: string;
    shipment_obj: {
        type: string;
        value: number;
    };
    discount_price?: number;
    weight: number;
    rebate: number;
    designated_logistics: {
        type: 'all' | 'designated';
        list: string[];
    };
    deduction_log?: {
        [p: string]: number;
    };
    min_qty?: number;
    max_qty?: number;
    buy_history_count?: number;
    sku: string;
    stock: number;
    show_understocking: 'true' | 'false';
    is_add_on_items: CartItem | boolean;
    pre_order: boolean;
    is_hidden: boolean;
};
export declare class CheckoutEvent {
    app: string;
    token?: IToken;
    shopping: Shopping;
    constructor(app: string, token?: IToken);
    getPaymentSetting(): any;
    toCheckout(data: {
        line_items: CartItem[];
        customer_info?: any;
        email?: string;
        return_url: string;
        order_id?: string;
        user_info: any;
        code?: string;
        use_rebate?: number;
        use_wallet?: number;
        checkOutType?: 'manual' | 'auto' | 'POS' | 'group_buy';
        pos_store?: string;
        voucher?: any;
        discount?: number;
        total?: number;
        pay_status?: number;
        custom_form_format?: any;
        custom_form_data?: any;
        custom_receipt_form?: any;
        distribution_code?: string;
        code_array: string[];
        give_away?: {
            id: number;
            spec: string[];
            count: number;
            voucher_id: string;
        }[];
        language?: 'en-US' | 'zh-CN' | 'zh-TW';
        pos_info?: any;
        invoice_select?: string;
        pre_order?: boolean;
        voucherList?: any;
        isExhibition?: boolean;
        client_ip_address?: string;
        fbc?: string;
        fbp?: string;
        temp_cart_id?: string;
    }, type?: CheckoutInsertType, replace_order_id?: string): Promise<any>;
    setPaymentSetting(obj: {
        carData: any;
        keyData: any;
        checkoutPayment: string;
    }): Promise<void>;
    getCartFormulaPass(carData: any, keyData: {
        cartSetting?: {
            minimumTotal: number;
            maximumTotal: number;
            orderFormula?: string[];
        };
    }): boolean;
}
export {};
