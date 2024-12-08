import { GVC } from '../../glitterBundle/GVController.js';
import { UmClass } from './um-class.js';
import { ApiWallet } from '../../glitter-base/route/wallet.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { UMVoucher } from './um-voucher.js';
import { CheckInput } from '../../modules/checkInput.js';
import { Language } from '../../glitter-base/global/language.js';

const html = String.raw;
const css = String.raw;

interface Order {
    id: number;
    cart_token: string;
    status: number;
    email: string;
    orderData: OrderData;
    created_time: string;
}

interface OrderData {
    email: string;
    total: number;
    method: string;
    rebate: number;
    orderID: string;
    discount: number;
    give_away: any[];
    lineItems: LineItem[];
    user_info: UserInfo;
    code_array: any[];
    use_rebate: number;
    use_wallet: number;
    user_email: string;
    orderSource: string;
    voucherList: any[];
    shipment_fee: number;
    customer_info: CustomerInfo;
    shipment_info: string;
    useRebateInfo: RebateInfo;
    payment_setting: PaymentSetting[];
    user_rebate_sum: number;
    custom_form_data: Record<string, string>;
    off_line_support: OfflineSupport;
    payment_info_atm: ATMInfo;
    shipment_support: string[];
    distribution_info: DistributionInfo;
    shipment_selector: ShipmentSelector[];
    custom_form_format: CustomForm[];
    payment_info_line_pay: Record<string, string>;
}

interface LineItem {
    id: number;
    sku: string;
    spec: string[];
    count: number;
    specs: Spec[];
    title: string;
    rebate: number;
    collection: string[];
    sale_price: number;
    shipment_obj: ShipmentObj;
    language_data: LanguageData;
    preview_image: string;
    discount_price: number;
}

interface Spec {
    title: string;
    option: Option[];
    language_title: LanguageTitle;
}

interface Option {
    title: string;
    expand: boolean;
    language_title: LanguageTitle;
}

interface LanguageTitle {
    'en-US': string;
    'zh-TW': string;
}

interface ShipmentObj {
    type: string;
    value: number;
}

interface LanguageData {
    'en-US': LanguageContent;
    'zh-CN': LanguageContent;
    'zh-TW': LanguageContent;
}

interface LanguageContent {
    seo: SEO;
    title: string;
    content: string;
    content_json: ContentJson[];
    content_array?: string[];
}

interface SEO {
    title: string;
    domain: string;
    content: string;
    keywords: string;
}

interface ContentJson {
    id: string;
    list: ContentJsonList[];
}

interface ContentJsonList {
    key: string;
    value: string;
}

interface UserInfo {
    name: string;
    email: string;
    phone: string;
    address: string;
    shipment: string;
    send_type: string;
    invoice_type: string;
    invoice_method: string;
    custom_form_delivery: Record<string, any>;
}

interface CustomerInfo {
    name: string;
    email: string;
    phone: string;
    payment_select: string;
}

interface RebateInfo {
    limit: number;
    point: number;
}

interface PaymentSetting {
    key: string;
    name: string;
}

interface OfflineSupport {
    atm: boolean;
    line: boolean;
    cash_on_delivery: boolean;
}

interface ATMInfo {
    text: string;
    bank_code: string;
    bank_name: string;
    bank_user: string;
    bank_account: string;
}

interface DistributionInfo {
    code: string;
    link: string;
    title: string;
    status: boolean;
    voucher: number;
    redirect: string;
    relative: string;
    condition: number;
    startDate: string;
    startTime: string;
    share_type: string;
    share_value: number;
    relative_data: any[];
    recommend_user: RecommendUser;
    voucher_status: string;
    recommend_medium: any[];
    recommend_status: string;
}

interface RecommendUser {
    id: number;
    name: string;
    email: string;
    phone: string;
}

interface ShipmentSelector {
    name: string;
    value: string;
}

interface CustomForm {
    col: string;
    key: string;
    page: string;
    type: string;
    group: string;
    title: string;
    col_sm: string;
    toggle: boolean;
    appName: string;
    require: string;
    readonly: string;
    formFormat: string;
    style_data: StyleData;
    form_config: FormConfig;
}

interface StyleData {
    input: StyleVersion;
    label: StyleVersion;
    container: StyleVersion;
}

interface StyleVersion {
    list: any[];
    class: string;
    style: string;
    version: string;
}

interface FormConfig {
    type: string;
    title: string;
    input_style: StyleVersion;
    title_style: StyleVersion;
    place_holder: string;
}

export class UMOrder {
    static addStyle(gvc: GVC) {
        gvc.addStyle(`
        .o-h1{
            text-align: center;
            font-weight: 700;
            letter-spacing: 4px;
            color: #393939;
            font-size: 40px;
            margin: 20px 0;
        }
        .o-title{

        }
        .o-content{

        }
        .o-card{
            border-radius: 10px;
            border: 1px solid #DDD;
            background: #FFF;
            width: 100%;
            max-width: 1100px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            margin: 20px;
        }
            .go-back-text {
                color: #1e1e1e;
                font-family: 'Open Sans', sans-serif;
                cursor: pointer;
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                letter-spacing: 1px;
            }
        `);
    }
    static main(gvc: GVC, widget: any, subData: any) {
        this.addStyle(gvc);
        const glitter = gvc.glitter;
        const ids = {
            view: glitter.getUUID(),
        };
        const loadings = {
            view: true,
        };
        const vm = {
            data: {} as Order,
        };
        return gvc.bindView({
            bind: ids.view,
            view: () => {
                if (loadings.view) {
                    return UmClass.spinner();
                } else {
                    console.log(vm.data.orderData);
                    return html`<div class="container py-5">
                        <div class="d-flex align-items-center justify-content-center gap-3 flex-column">
                            <section class="o-h1">訂單編號<br />#${vm.data.cart_token}</section>
                            <section class="o-card">
                                <h3>訂單明細</h3>
                            </section>
                            <section class="border border-1 w-100">
                                <h3>付款資訊</h3>
                            </section>
                            <section class="border border-1 w-100">
                                <h3>訂單資訊</h3>
                            </section>
                        </div>
                        <div class="m-auto d-flex align-items-center justify-content-center mt-5" style="cursor: pointer;">
                            <img class="me-2" src="https://ui.homee.ai/htmlExtension/shopify/order/img/back.svg" />
                            <span class="go-back-text">返回訂單列表</span>
                        </div>
                    </div>`;
                }
            },
            divCreate: {},
            onCreate: () => {
                if (loadings.view) {
                    ApiShop.getOrder({
                        limit: 1,
                        page: 0,
                        data_from: 'user',
                        search: glitter.getUrlParameter('cart_token'),
                        searchType: 'cart_token',
                    }).then((res: any) => {
                        if (res.result && res.response.data) {
                            vm.data = res.response.data[0];
                        } else {
                            vm.data = {} as any;
                        }
                        loadings.view = false;
                        gvc.notifyDataChange(ids.view);
                    });
                }
            },
        });
    }
}

(window as any).glitter.setModule(import.meta.url, UMOrder);
