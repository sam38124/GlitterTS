import { GVC } from '../../glitterBundle/GVController.js';
import { UmClass } from './um-class.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { ApiCart } from '../../glitter-base/route/api-cart.js';
import { Ad } from '../public/ad.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { FormWidget } from '../../official_view_component/official/form.js';

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
    payment_info_text: string;
    proof_purchase: string;
    orderStatus: string;
    progress: string;
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
    note: string;
    invoice_type: string;
    invoice_method: string;
    custom_form_delivery: Record<string, any>;
    CVSAddress: string;
    CVSOutSide: string;
    CVSStoreID: string;
    CVSStoreName: string;
    LogisticsSubType: string;
    MerchantID: string;
    MerchantTradeNo: string;
    shipment_info?: string;
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
    form: any;
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
            .o-h1 {
                text-align: center;
                font-weight: 700;
                letter-spacing: 2px;
                color: #393939;
                font-size: 36px;
                margin: 20px 0;
            }
            .o-h2 {
                text-align: center;
                font-weight: 700;
                letter-spacing: 2px;
                color: #393939;
                font-size: 28px;
                margin: 20px 0;
            }
            .o-title-container {
                display: flex;
                align-items: center;
                min-height: 36px;
            }
            .o-title {
                color: #393939;
                font-size: 16px;
                font-weight: 400;
            }
            .o-card {
                border-radius: 10px;
                border: 1px solid #ddd;
                background: #fff;
                width: 100%;
                max-width: 1100px;
                padding: 20px;
                display: flex;
                flex-direction: column;
                margin: 0 30px;
            }
            .o-card-row {
                border-radius: 10px;
                border: 1px solid #ddd;
                background: #fff;
                width: 100%;
                max-width: 1100px;
                padding: 20px;
                display: flex;
                flex-wrap: wrap;
                margin: 0 30px;
            }
            .o-line-item {
                display: flex;
                width: 100%;
                padding: 1.25rem 1rem;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid #dddddd;
            }
            .o-item-title {
                font-size: 16px;
                font-weight: 500;
                color: #fe5541;
                margin-bottom: 0.25rem;
            }
            .o-item-spec {
                font-size: 16px;
                font-weight: 400;
                color: #858585;
                margin-bottom: 0;
            }
            .o-total-container {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 10px;
                margin-top: 1.25rem;
                margin-right: 1rem;
            }
            .o-total-item {
                display: flex;
                width: 100%;
                max-width: 350px;
                justify-content: space-between;
            }
            .o-subtotal {
                min-width: 80px;
                text-align: end;
            }
            .o-total {
                min-width: 80px;
                text-align: end;
                font-weight: 700;
            }
            .o-total-text {
                font-weight: 700;
            }
            .o-button {
                border-radius: 10px;
                background: #393939;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                padding: 14px 0;
                cursor: pointer;
                height: 48px;
            }
            .o-button:hover {
                background: #656565;
            }
            .o-button-text {
                color: #fff;
                text-align: center;
                font-size: 16px;
                font-weight: 700;
                letter-spacing: 0.64px;
            }
            .o-gray-line {
                border-bottom: 1px solid #dddddd;
                padding-bottom: 6px;
                margin-bottom: 12px;
            }
            .o-gray-text {
                white-space: normal;
                word-break: break-all;
                color: #8d8d8d;
                font-size: 14px;
                font-weight: 400;
                letter-spacing: 1px;
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
            .go-to-checkout {
                height: 32px;
                padding: 6px 14px;
                background: #393939;
                border-radius: 10px;
                justify-content: center;
                align-items: center;
                display: inline-flex;
                cursor: pointer;
            }
            .go-to-checkout-text {
                text-align: center;
                color: white;
                font-size: 14px;
                font-weight: 400;
                letter-spacing: 0.56px;
            }
        `);
    }

    static repay(gvc: GVC, id: string) {
        const dialog = new ShareDialog(gvc.glitter);
        dialog.dataLoading({ visible: true, text: '取得結帳連結中' });

        const redirect = gvc.glitter.root_path + 'order_detail' + location.search;
        const l = new URL(redirect as any, location.href);

        return new Promise(() => {
            ApiShop.repay(id, l.href).then((res) => {
                dialog.dataLoading({ visible: false });
                const id = gvc.glitter.getUUID();
                $('body').append(`<div id="${id}" style="display: none;">${res.response.form}</div>`);
                (document.querySelector(`#${id} #submit`) as any).click();
                ApiCart.clearCart();
            });
        });
    }

    static atmFormList = [
        {
            col: '12',
            key: 'pay-date',
            page: 'input',
            type: 'form_plugin_v2',
            group: '',
            title: '付款時間*',
            col_sm: '12',
            appName: 'cms_system',
            require: 'true',
            readonly: 'write',
            formFormat: '{}',
            moduleName: '輸入框',
            style_data: {
                input: {
                    list: [],
                    class: '',
                    style: '',
                    version: 'v2',
                },
                label: {
                    list: [],
                    class: 'form-label fs-base ',
                    style: '',
                    version: 'v2',
                },
                container: {
                    list: [],
                    class: '',
                    style: '',
                    version: 'v2',
                },
            },
            form_config: {
                type: 'date',
                title: '',
                input_style: {},
                title_style: {},
                place_holder: '請輸入付款時間',
            },
        },
        {
            col: '12',
            key: 'bank_name',
            page: 'input',
            type: 'form_plugin_v2',
            group: '',
            title: '我的銀行名稱*',
            col_sm: '12',
            appName: 'cms_system',
            require: 'true',
            readonly: 'write',
            formFormat: '{}',
            moduleName: '輸入框',
            style_data: {
                input: {
                    list: [],
                    class: '',
                    style: '',
                    version: 'v2',
                },
                label: {
                    list: [],
                    class: 'form-label fs-base ',
                    style: '',
                    version: 'v2',
                },
                container: {
                    list: [],
                    class: '',
                    style: '',
                    version: 'v2',
                },
            },
            form_config: {
                type: 'name',
                title: '',
                input_style: {},
                title_style: {},
                place_holder: '請輸入我的銀行名稱',
            },
        },
        {
            col: '12',
            key: 'bank_account',
            page: 'input',
            type: 'form_plugin_v2',
            group: '',
            title: '我的銀行戶名*',
            col_sm: '12',
            appName: 'cms_system',
            require: 'true',
            readonly: 'write',
            formFormat: '{}',
            moduleName: '輸入框',
            style_data: {
                input: {
                    list: [],
                    class: '',
                    style: '',
                    version: 'v2',
                },
                label: {
                    list: [],
                    class: 'form-label fs-base ',
                    style: '',
                    version: 'v2',
                },
                container: {
                    list: [],
                    class: '',
                    style: '',
                    version: 'v2',
                },
            },
            form_config: {
                type: 'name',
                title: '',
                input_style: {},
                title_style: {},
                place_holder: '請輸入我的銀行戶名',
            },
        },
        {
            col: '12',
            key: 'trasaction_code',
            page: 'input',
            type: 'form_plugin_v2',
            group: '',
            title: '銀行帳號後五碼*',
            col_sm: '12',
            appName: 'cms_system',
            require: 'true',
            readonly: 'write',
            formFormat: '{}',
            moduleName: '輸入框',
            style_data: {
                input: {
                    list: [],
                    class: '',
                    style: '',
                    version: 'v2',
                },
                label: {
                    list: [],
                    class: 'form-label fs-base ',
                    style: '',
                    version: 'v2',
                },
                container: {
                    list: [],
                    class: '',
                    style: '',
                    version: 'v2',
                },
            },
            form_config: {
                type: 'name',
                title: '',
                input_style: {},
                title_style: {},
                place_holder: '請輸入銀行帳號後五碼',
            },
        },
    ];

    static lineFormList = [
        {
            col: '12',
            key: 'image',
            page: 'image_uploader_widget',
            type: 'form_plugin_v2',
            group: '',
            title: '',
            col_sm: '12',
            appName: 'cms_system',
            require: 'true',
            readonly: 'write',
            formFormat: '{}',
            moduleName: '檔案上傳',
            style_data: {
                input: {
                    list: [],
                    class: '',
                    style: '',
                    version: 'v2',
                },
                label: {
                    list: [],
                    class: 'form-label fs-base ',
                    style: '',
                    version: 'v2',
                },
                container: {
                    list: [],
                    class: '',
                    style: '',
                    version: 'v2',
                },
            },
            form_config: {
                type: 'image/*',
                title: '',
                input_style: {},
                title_style: {},
                place_holder: '請輸入銀行帳號後五碼',
            },
        },
    ];

    static main(gvc: GVC, widget: any, subData: any) {
        this.addStyle(gvc);
        UmClass.addStyle(gvc);
        const glitter = gvc.glitter;
        const dialog = new ShareDialog(gvc.glitter);
        const ids = {
            view: glitter.getUUID(),
        };
        const loadings = {
            view: true,
        };
        const vm = {
            data: {} as Order,
            type: '',
        };
        return html`<div class="container py-4">
            ${gvc.bindView({
                bind: ids.view,
                dataList: [{ obj: vm, key: 'type' }],
                view: () => {
                    if (loadings.view) {
                        return UmClass.spinner({
                            container: {
                                style: 'height: 100%;',
                            },
                        });
                    }

                    if (!vm.data || !vm.data.orderData || !vm.data.cart_token) {
                        return html` <section class="o-h2">查無此訂單</section> `;
                    }

                    const orderData = vm.data.orderData;

                    function payInfo() {
                        let arr = [];
                        if (orderData.customer_info.payment_select === 'atm') {
                            arr = [
                                {
                                    title: '銀行名稱',
                                    value: orderData.payment_info_atm.bank_name,
                                },
                                {
                                    title: '銀行代碼',
                                    value: orderData.payment_info_atm.bank_code,
                                },
                                {
                                    title: '匯款戶名',
                                    value: orderData.payment_info_atm.bank_user,
                                },
                                {
                                    title: '匯款帳號',
                                    value: orderData.payment_info_atm.bank_code,
                                },
                                {
                                    title: '匯款金額',
                                    value: orderData.total.toLocaleString(),
                                },
                                {
                                    title: '付款說明',
                                    value: orderData.payment_info_atm.text,
                                },
                            ];
                        } else if (orderData.customer_info.payment_select === 'line') {
                            arr = [
                                {
                                    title: '付款說明',
                                    value: orderData.payment_info_line_pay.text,
                                },
                            ];
                        } else {
                            arr = [
                                {
                                    title: '付款說明',
                                    value: orderData.payment_info_text,
                                },
                            ];
                        }
                        return gvc.map(
                            arr.map((item) => {
                                return html`
                                    <div class="o-title-container ${item.title === '付款說明' ? 'align-items-start mt-2' : ''}">
                                        <div class="o-title me-1">${item.title}：</div>
                                        <div class="o-title">${item.value}</div>
                                    </div>
                                `;
                            })
                        );
                    }

                    function validateForm(data: any) {
                        const paymentTime = data['pay-date'];
                        const bankName = data.bank_name;
                        const accountName = data.bank_account;
                        const accountLastFive = data.trasaction_code;

                        let isValid = true;
                        let errorMessage = '';

                        // 檢查付款時間
                        if (!paymentTime) {
                            isValid = false;
                            errorMessage += '付款時間未填寫<br/>';
                        }

                        // 檢查銀行名稱
                        if (!bankName) {
                            isValid = false;
                            errorMessage += '銀行名稱未填寫<br/>';
                        }

                        // 檢查銀行戶名
                        if (!accountName) {
                            isValid = false;
                            errorMessage += '銀行戶名未填寫<br/>';
                        }

                        // 檢查銀行帳號後五碼
                        if (!/^\d{5}$/.test(accountLastFive)) {
                            isValid = false;
                            errorMessage += '銀行帳號後五碼需為五位數字<br/>';
                        }

                        // 顯示錯誤訊息或提交表單
                        if (!isValid) {
                            dialog.errorMessage({ text: html`<div class="text-center">${errorMessage}</div>` });
                        }

                        return isValid; // 若驗證成功，返回 true；失敗則返回 false
                    }

                    if (vm.type === 'upload') {
                        let formData = {};
                        return html`
                            <section class="o-h1">訂單編號<br />#${vm.data.cart_token}</section>
                            <section class="o-card-row" style="max-width: 100%;">
                                <div class="col-12 col-md-6 px-2">
                                    <h3 class="mb-3 text-center">付款資訊</h3>
                                    <div class="o-gray-line"></div>
                                    ${payInfo()}
                                </div>
                                <div class="col-12 col-md-6 px-2">
                                    <h3 class="mb-3 text-center">付款證明</h3>
                                    <div class="o-gray-line"></div>
                                    <span class="o-gray-text"
                                        >${(() => {
                                            if (orderData.customer_info.payment_select === 'atm') {
                                                return html`＊請確認您的匯款銀行帳戶資料是否正確，以確保付款順利完成`;
                                            } else if (orderData.customer_info.payment_select === 'line') {
                                                return html`＊請上傳截圖，以便我們進行核款。`;
                                            }
                                            return html`＊請確認您的匯款銀行帳戶資料是否正確，以確保付款順利完成<br />＊請上傳截圖或輸入轉帳證明，例如:帳號末五碼，與付款人資訊。`;
                                        })()}</span
                                    >
                                    ${gvc.bindView(
                                        (() => {
                                            const id = glitter.getUUID();
                                            return {
                                                bind: id,
                                                view: () => {
                                                    return FormWidget.editorView({
                                                        gvc: gvc,
                                                        array: (() => {
                                                            if (orderData.customer_info.payment_select === 'line') {
                                                                return UMOrder.lineFormList;
                                                            }
                                                            if (orderData.customer_info.payment_select === 'atm') {
                                                                return UMOrder.atmFormList;
                                                            }
                                                            return [];
                                                        })(),
                                                        refresh: () => {
                                                            setTimeout(() => {
                                                                gvc.notifyDataChange(id);
                                                            });
                                                        },
                                                        formData: formData,
                                                    });
                                                },
                                                divCreate: {
                                                    class: 'mt-2 mb-3',
                                                },
                                            };
                                        })()
                                    )}
                                    <div
                                        class="o-button mx-2"
                                        onclick="${gvc.event(() => {
                                            if (!validateForm(formData)) {
                                                return;
                                            }
                                            dialog.dataLoading({ visible: true, text: '資料送出中' });
                                            ApiShop.proofPurchase(vm.data.cart_token, formData).then((result) => {
                                                dialog.dataLoading({ visible: false });
                                                location.reload();
                                            });
                                        })}"
                                    >
                                        <span class="o-button-text">確認送出</span>
                                    </div>
                                </div>
                            </section>
                            <section
                                class="m-auto d-flex align-items-center justify-content-center my-5"
                                style="cursor: pointer;"
                                onclick="${gvc.event(() => {
                                    setTimeout(() => {
                                        $('html').scrollTop(0);
                                    }, 100);
                                    vm.type = '';
                                })}"
                            >
                                <img class="me-2" src="https://ui.homee.ai/htmlExtension/shopify/order/img/back.svg" />
                                <span class="go-back-text">返回訂單詳情</span>
                            </section>
                        `;
                    }

                    return html`
                        <section class="o-h1">訂單編號<br />#${vm.data.cart_token}</section>
                        <section class="o-card">
                            <h3 class="mb-3">訂單明細</h3>
                            ${gvc.map(
                                orderData.lineItems.map((item) => {
                                    return html`
                                        <div class="o-line-item">
                                            <div class="d-flex gap-3">
                                                <div>
                                                    ${UmClass.validImageBox({
                                                        gvc,
                                                        image: item.preview_image,
                                                        width: 60,
                                                        style: 'border-radius: 10px;',
                                                    })}
                                                </div>
                                                <div>
                                                    <p class="o-item-title">${item.title}</p>
                                                    <p class="o-item-spec">${item.spec.length > 0 ? `規格：${item.spec.join(' / ')}` : '單一規格'}</p>
                                                </div>
                                            </div>
                                            <div class="d-flex">
                                                <span class="me-3">$ ${item.sale_price.toLocaleString()} × ${item.count}</span>
                                                <span class="o-subtotal">NT$ ${(item.sale_price * item.count).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    `;
                                })
                            )}
                            <div class="o-total-container">
                                <div class="o-total-item">
                                    <span>小計總額(合計)</span>
                                    <span class="o-subtotal">NT$ ${(orderData.total - orderData.shipment_fee + orderData.discount + orderData.use_rebate).toLocaleString()}</span>
                                </div>
                                <div class="o-total-item">
                                    <span>回饋金折抵</span>
                                    <span class="o-subtotal">− NT$ ${orderData.use_rebate.toLocaleString()}</span>
                                </div>
                                <div class="o-total-item">
                                    <span>優惠折扣</span>
                                    <span class="o-subtotal">− NT$ ${orderData.discount.toLocaleString()}</span>
                                </div>
                                <div class="o-total-item">
                                    <span>運費</span>
                                    <span class="o-subtotal">NT$ ${orderData.shipment_fee.toLocaleString()}</span>
                                </div>
                                <div class="o-total-item">
                                    <span class="o-total-text">總付款金額</span>
                                    <span class="o-total">NT$ ${orderData.total.toLocaleString()}</span>
                                </div>
                            </div>
                        </section>
                        ${orderData.method === 'off_line' && orderData.customer_info.payment_select !== 'cash_on_delivery'
                            ? html`<section class="o-card">
                                  <h3 class="mb-3">付款資訊</h3>
                                  ${payInfo()}
                                  <div
                                      class="o-button"
                                      onclick="${gvc.event(() => {
                                          setTimeout(() => {
                                              $('html').scrollTop(0);
                                          }, 100);
                                          vm.type = 'upload';
                                      })}"
                                  >
                                      <span class="o-button-text">${orderData.proof_purchase ? '重新上傳結帳證明' : '上傳結帳證明'}</span>
                                  </div>
                              </section>`
                            : ''}
                        <section class="o-card-row">
                            <div class="col-12 col-md-6 mb-3 px-0">
                                <h3 class="mb-3">訂單資訊</h3>
                                ${(() => {
                                    function checkAndRemoveURLParameter() {
                                        // 獲取當前 URL
                                        let key = 'EndCheckout';
                                        let url = window.location.href;

                                        // 解析 URL，獲取參數部分
                                        let urlParts = url.split('?');

                                        if (urlParts.length >= 2) {
                                            // 獲取參數部分
                                            let params = urlParts[1].split('&');

                                            // 檢查參數是否存在並移除
                                            let existParams = params.find((param) => {
                                                return param.split('=')[0] === key;
                                            });

                                            // 檢查參數是否存在並移除
                                            let updatedParams = params.filter((param) => {
                                                return param.split('=')[0] !== key;
                                            });

                                            // 重新構建 URL
                                            url = urlParts[0] + (updatedParams.length > 0 ? '?' + updatedParams.join('&') : '');

                                            // 替換當前瀏覽器歷史記錄，不會導致頁面重新加載
                                            window.history.replaceState({}, document.title, url);

                                            if (existParams && vm.data.status) {
                                                Ad.gtagEvent('purchase', {
                                                    transaction_id: vm.data.cart_token,
                                                    value: orderData.total,
                                                    shipping: orderData.shipment_fee,
                                                    currency: 'TWD',
                                                    coupon: orderData.voucherList && orderData.voucherList.length > 0 ? orderData.voucherList[0].title : '',
                                                    items: orderData.lineItems.map((item: any, index: number) => {
                                                        return {
                                                            item_id: item.id,
                                                            item_name: item.title,
                                                            discount: item.discount_price,
                                                            index: index,
                                                            item_variant: item.spec.join('-'),
                                                            price: item.sale_price,
                                                            quantity: item.count,
                                                        };
                                                    }),
                                                });
                                            }
                                        }
                                    }

                                    checkAndRemoveURLParameter();

                                    const arr = [
                                        {
                                            title: '訂單號碼',
                                            value: vm.data.cart_token,
                                        },
                                        {
                                            title: '訂單日期',
                                            value: gvc.glitter.ut.dateFormat(new Date(vm.data.created_time), 'yyyy-MM-dd'),
                                        },
                                        {
                                            title: '訂單狀態',
                                            value: (() => {
                                                switch (orderData.orderStatus) {
                                                    case '-1':
                                                        return '已取消';
                                                    case '1':
                                                        return '已完成';
                                                    case '-99':
                                                        return '已刪除';
                                                    default:
                                                        return '處理中';
                                                }
                                            })(),
                                        },
                                        {
                                            title: '付款狀態',
                                            value: (() => {
                                                if (orderData.customer_info.payment_select === 'cash_on_delivery') {
                                                    return '貨到付款';
                                                }
                                                switch (vm.data.status) {
                                                    case 0:
                                                        return orderData.proof_purchase
                                                            ? '等待核款'
                                                            : `尚未付款${
                                                                  orderData.method === 'off_line'
                                                                      ? ''
                                                                      : html`<div
                                                                            class="go-to-checkout ms-3"
                                                                            onclick="${gvc.event(() => {
                                                                                UMOrder.repay(gvc, vm.data.cart_token);
                                                                            })}"
                                                                        >
                                                                            <div class="go-to-checkout-text">前往結帳</div>
                                                                        </div>`
                                                              }`;
                                                    case 1:
                                                        return '已付款';
                                                    case -1:
                                                        return '付款失敗';
                                                    case -2:
                                                        return '已退款';
                                                }
                                            })(),
                                        },
                                    ];

                                    return gvc.map(
                                        arr.map((item) => {
                                            return html`
                                                <div class="o-title-container">
                                                    <div class="o-title me-1">${item.title}：</div>
                                                    <div class="o-title">${item.value}</div>
                                                </div>
                                            `;
                                        })
                                    );
                                })()}
                            </div>
                            <div class="col-12 col-md-6 mb-3 px-0">
                                <h3 class="mb-3">顧客資訊</h3>
                                ${(() => {
                                    const arr = [
                                        {
                                            title: '姓名',
                                            value: orderData.customer_info.name,
                                        },
                                        {
                                            title: '電話',
                                            value: orderData.customer_info.phone,
                                        },
                                        {
                                            title: '信箱',
                                            value: orderData.customer_info.email,
                                        },
                                    ].concat(
                                        (orderData.custom_form_format ?? [])
                                            .map((dd) => {
                                                return {
                                                    title: dd.title,
                                                    value: orderData.custom_form_data[dd.key],
                                                };
                                            })
                                            .filter((d1) => {
                                                return d1.value;
                                            })
                                    );

                                    return gvc.map(
                                        arr.map((item) => {
                                            return html`
                                                <div class="o-title-container">
                                                    <div class="o-title me-1">${item.title}：</div>
                                                    <div class="o-title">${item.value}</div>
                                                </div>
                                            `;
                                        })
                                    );
                                })()}
                            </div>
                            <div class="col-12 col-md-6 mb-3 px-0">
                                <h3 class="mb-3">配送資訊</h3>
                                ${(() => {
                                    const selector = orderData.shipment_selector.find((dd) => {
                                        return dd.value === orderData.user_info.shipment;
                                    });
                                    let arr = [
                                        {
                                            title: '配送方式',
                                            value: (() => {
                                                if (selector) {
                                                    return selector.name;
                                                }
                                                switch (orderData.user_info.shipment) {
                                                    case 'FAMIC2C':
                                                        return '全家店到店';
                                                    case 'HILIFEC2C':
                                                        return '萊爾富店到店';
                                                    case 'normal':
                                                        return '宅配到府';
                                                    case 'OKMARTC2C':
                                                        return 'OK超商店到店';
                                                    case 'UNIMARTC2C':
                                                        return '7-ELEVEN超商交貨便';
                                                    case 'shop':
                                                        return '實體門市取貨';
                                                    default:
                                                        return '宅配到府';
                                                }
                                            })(),
                                        },
                                    ];
                                    if (
                                        ['FAMIC2C', 'HILIFEC2C', 'OKMARTC2C', 'UNIMARTC2C'].find((dd) => {
                                            return dd === orderData.user_info.shipment;
                                        })
                                    ) {
                                        arr = [
                                            ...arr,
                                            ...[
                                                { title: '門市店號', value: decodeURI(orderData.user_info.CVSStoreID) },
                                                { title: '門市名稱', value: decodeURI(orderData.user_info.CVSStoreName) },
                                                { title: '門市地址', value: decodeURI(orderData.user_info.CVSAddress) },
                                            ],
                                        ];
                                    } else if (orderData.user_info.address) {
                                        arr.push({ title: '收件地址', value: orderData.user_info.address });
                                    }
                                    arr.push({
                                        title: '配送狀態',
                                        value: (() => {
                                            switch (orderData.progress) {
                                                case 'shipping':
                                                    return '已出貨';
                                                case 'finish':
                                                    return '已取貨';
                                                case 'arrived':
                                                    return '已送達';
                                                case 'returns':
                                                    return '已退貨';
                                                default:
                                                    return '揀貨中';
                                            }
                                        })(),
                                    });
                                    if (orderData.user_info.shipment_info) {
                                        arr.push({ title: '配送說明', value: orderData.user_info.shipment_info });
                                    }
                                    arr = [
                                        ...arr,
                                        ...[
                                            { title: '收件人姓名', value: orderData.user_info.name },
                                            { title: '收件人信箱', value: orderData.user_info.email },
                                            { title: '收件人電話', value: orderData.user_info.phone },
                                        ],
                                    ];
                                    if (selector && selector.form) {
                                        arr = arr.concat(
                                            selector.form.map((dd: any) => {
                                                return {
                                                    title: dd.title,
                                                    value: orderData.user_info.custom_form_delivery[dd.key],
                                                };
                                            })
                                        );
                                    }
                                    if (orderData.user_info.note) {
                                        arr.push({ title: '配送備註', value: orderData.user_info.note });
                                    }
                                    return gvc.map(
                                        arr.map((item) => {
                                            return html`
                                                <div class="o-title-container">
                                                    <div class="o-title me-1">${item.title}：</div>
                                                    <div class="o-title">${item.value}</div>
                                                </div>
                                            `;
                                        })
                                    );
                                })()}
                            </div>
                        </section>
                        <section
                            class="m-auto d-flex align-items-center justify-content-center my-5"
                            style="cursor: pointer;"
                            onclick="${gvc.event(() => {
                                location.href = './order_list';
                            })}"
                        >
                            <img class="me-2" src="https://ui.homee.ai/htmlExtension/shopify/order/img/back.svg" />
                            <span class="go-back-text">返回訂單列表</span>
                        </section>
                    `;
                },
                divCreate: {
                    class: 'd-flex align-items-center justify-content-center gap-3 flex-column',
                    style: 'min-height: 50vh;',
                },
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
            })}
        </div>`;
    }
}

(window as any).glitter.setModule(import.meta.url, UMOrder);
