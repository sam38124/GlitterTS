var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UmClass } from './um-class.js';
import { ApiUser } from '../../glitter-base/route/user.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { Ad } from '../public/ad.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { FormWidget } from '../../official_view_component/official/form.js';
import { Language } from '../../glitter-base/global/language.js';
import { CheckInput } from '../../modules/checkInput.js';
import { ShipmentConfig } from '../../glitter-base/global/shipment-config.js';
import { Animation } from '../../glitterBundle/module/Animation.js';
import { BgWidget } from '../../backend-manager/bg-widget.js';
import { GlobalUser } from '../../glitter-base/global/global-user.js';
const html = String.raw;
const css = String.raw;
export class UMOrder {
    static addStyle(gvc) {
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
        cursor: pointer;
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
      .customer-btn {
        height: 32px;
        padding: 6px 14px;
        background: #393939;
        border-radius: 10px;
        justify-content: center;
        align-items: center;
        display: inline-flex;
        cursor: pointer;
      }
      .customer-btn-text {
        line-height: normal;
        text-align: center;
        color: white;
        font-size: 14px;
        font-weight: 400;
        letter-spacing: 0.56px;
      }

      .payment-section {
        border: 1px solid #ccc;
        padding: 10px;
        margin-bottom: 20px;
      }
      #repay-button {
        height: 32px;

        background-color: #4caf50;
        color: white;
        border-radius: 10px;
        padding: 6px 14px;
        border: none;
        cursor: pointer;
      }

      #repay-button:hover {
        background-color: #45a049;
      }
    `);
    }
    static executePayment(gvc, payment_method, res) {
        var _a, _b, _c, _d;
        const dialog = new ShareDialog(gvc.glitter);
        function showPayError() {
            dialog.infoMessage({
                text: '系統處理您的付款時遇到一些問題，導致交易未能完成。請聯繫我們的客服團隊以取得進一步的協助',
            });
        }
        if (res.result == false) {
            showPayError();
            return;
        }
        switch (payment_method) {
            case 'line_pay':
                if (gvc.glitter.share.is_application) {
                    gvc.glitter.runJsInterFace('intent_url', {
                        url: res.response.responseData.info.paymentUrl.app,
                    }, () => { });
                }
                else {
                    location.href = res.response.info.paymentUrl.web;
                }
                break;
            case 'paypal': {
                if (res.response.approveLink) {
                    location.href = res.response.approveLink;
                }
                showPayError();
                break;
            }
            case 'jkopay': {
                if (gvc.glitter.share.is_application) {
                    gvc.glitter.runJsInterFace('intent_url', {
                        url: res.response.result_object.payment_url,
                    }, () => { });
                }
                else {
                    location.href = res.response.result_object.payment_url;
                }
                break;
            }
            case 'paynow': {
                if (!((_d = (_c = (_b = (_a = res.response) === null || _a === void 0 ? void 0 : _a.responseData) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.result) === null || _d === void 0 ? void 0 : _d.secret)) {
                    return 'paynow API失敗';
                }
                gvc.glitter.innerDialog((gvc) => {
                    document.body.style.setProperty('overflow-y', 'hidden', 'important');
                    gvc.addStyle(css `
              .button-bgr {
                width: 100%;
                border: 0;
                border-radius: 0.375rem;
                height: 40px;
                background: #393939;
                padding: 0 24px;
                margin: 18px 0;
              }

              .button-text {
                color: #fff;
                font-size: 16px;
              }
            `);
                    return gvc.bindView({
                        bind: `paynow`,
                        view: () => {
                            return html ` <div class="w-100 h-100 d-flex align-items-center justify-content-center">
                  ${document.body.clientWidth < 800
                                ? html `
                        <div
                          class="bg-white position-relative vw-100"
                          style="height: ${window.innerHeight}px;overflow-y: auto; padding-top:${50 +
                                    gvc.glitter.share.top_inset}px;"
                        ></div>
                      `
                                : html ` <div
                        class="p-3  bg-white position-relative"
                        style="max-height: calc(100vh - 90px);overflow-y:auto;"
                      ></div>`}
                  <div
                    style="position: absolute; right: 15px;top:${15 + gvc.glitter.share.top_inset}px;z-index:1;"
                    onclick="${gvc.event(() => {
                                gvc.closeDialog();
                            })}"
                  >
                    <i class="fa-regular fa-circle-xmark fs-5 text-dark cursor_pointer"></i>
                  </div>
                  <div id="paynow-container">
                    <div style="width:200px;height:200px;">loading...</div>
                  </div>
                  <div class="px-3 px-sm-0 w-100">
                    <button
                      class="button-bgr"
                      id="checkoutButton"
                      onclick="${gvc.event(() => {
                                const PayNow = window.PayNow;
                                dialog.dataLoading({ visible: true });
                                PayNow.checkout().then((response) => {
                                    dialog.dataLoading({ visible: false });
                                    if (response.error) {
                                        dialog.errorMessage({
                                            text: response.error.message,
                                        });
                                    }
                                });
                            })}"
                    >
                      <span class="button-text">確認結帳</span>
                    </button>
                  </div>
                </div>`;
                        },
                        divCreate: {
                            class: `h-100 d-flex align-items-center justify-content-center`,
                            style: `max-width: 100vw; ${document.body.clientWidth < 800 ? 'width: 100%;' : 'width: 400px;'}`,
                        },
                        onCreate: () => {
                            var _a, _b;
                            const publicKey = (_a = res.response) === null || _a === void 0 ? void 0 : _a.responseData.publicKey;
                            const secret = (_b = res.response) === null || _b === void 0 ? void 0 : _b.responseData.data.result.secret;
                            const env = res.response.responseData.BETA == 'true' ? 'sandbox' : 'production';
                            const PayNow = window.PayNow;
                            PayNow.createPayment({
                                publicKey: publicKey,
                                secret: secret,
                                env: env,
                            });
                            PayNow.mount('#paynow-container', {
                                locale: 'zh_tw',
                                appearance: {
                                    variables: {
                                        fontFamily: 'monospace',
                                        colorPrimary: '#0078ab',
                                        colorDefault: '#0a0a0a',
                                        colorBorder: '#cccccc',
                                        colorPlaceholder: '#eeeeee',
                                        borderRadius: '.3rem',
                                        colorDanger: '#ff3d3d',
                                    },
                                },
                            });
                        },
                    });
                }, 'paynow', {
                    animation: document.body.clientWidth > 800 ? Animation.fade : Animation.popup,
                    dismiss: () => {
                        document.body.style.setProperty('overflow-y', 'auto');
                    },
                });
                break;
            }
            default: {
                const id = gvc.glitter.getUUID();
                $('body').append(html ` <div id="${id}" style="display: none;">${res.response.form}</div>`);
                document.querySelector(`#${id} #submit`).click();
            }
        }
    }
    static repay(gvc, orderData) {
        const id = orderData.cart_token;
        const dialog = new ShareDialog(gvc.glitter);
        const redirect = gvc.glitter.root_path + 'order_detail' + location.search;
        const url = new URL(redirect, location.href);
        dialog.dataLoading({
            visible: true,
            text: Language.text('loading'),
        });
        return new Promise(() => {
            ApiShop.repay(id, url.href).then(res => {
                dialog.dataLoading({ visible: false });
                orderData.payment_method;
                this.executePayment(gvc, orderData.payment_method, res);
                dialog.dataLoading({ visible: false });
                return;
            });
        });
    }
    static cancelOrder(gvc, id) {
        const dialog = new ShareDialog(gvc.glitter);
        dialog.checkYesOrNot({
            text: Language.text('c_cancel_order'),
            callback: (bool) => {
                if (bool) {
                    dialog.dataLoading({ visible: true, text: Language.text('loading') });
                    return new Promise(() => {
                        ApiShop.cancelOrder(id).then(() => {
                            dialog.dataLoading({ visible: false });
                            dialog.successMessage({ text: Language.text('s_cancel_order') });
                            gvc.recreateView();
                        });
                    });
                }
            },
        });
    }
    static main(gvc, widget, subData) {
        const glitter = gvc.glitter;
        const dialog = new ShareDialog(glitter);
        const ids = {
            view: glitter.getUUID(),
        };
        const loadings = {
            view: true,
        };
        const vm = {
            data: {},
            type: '',
            formList: [],
            passport: false,
            verify_code: '',
            buyer_name: '',
            buyer_phone: '',
        };
        this.addStyle(gvc);
        gvc.addMtScript([
            {
                src: `https://js.paynow.com.tw/sdk/v2/index.js?v=20250430`,
            },
        ], () => { }, () => { });
        UmClass.addStyle(gvc);
        let changePage = (index, type, subData) => { };
        gvc.glitter.getModule(new URL('./official_event/page/change-page.js', gvc.glitter.root_path).href, cl => {
            changePage = cl.changePage;
        });
        const repayArray = ['ecPay', 'newWebPay', 'paypal', 'jkopay', 'paynow', 'line_pay'];
        function loadOrderData() {
            ApiShop.getOrder({
                limit: 1,
                page: 0,
                data_from: 'user',
                search: glitter.getUrlParameter('cart_token'),
                searchType: 'cart_token',
                buyer_name: vm.buyer_name,
                buyer_phone: vm.buyer_phone
            }).then((res) => {
                if (res.result && res.response.data && res.response.data[0]) {
                    vm.data = res.response.data[0];
                    loadings.view = false;
                    gvc.notifyDataChange(ids.view);
                }
                else {
                    dialog.errorMessage({
                        text: Language.text('order_not_found'),
                    });
                    guestCheckView();
                }
            });
        }
        function guestCheckView() {
            BgWidget.settingDialog({
                gvc: gvc,
                title: Language.text('find_order'),
                innerHTML: () => {
                    return html ` <div class="p-3">
            ${[
                        Language.text('if_buyer_no_account').replace('#login', gvc.event(() => {
                            gvc.closeDialog();
                            gvc.glitter.href = '/login';
                        })),
                        `<div class="border-top w-100 my-3"></div>`,
                        BgWidget.editeInput({
                            gvc,
                            title: Language.text('order_number'),
                            default: glitter.getUrlParameter('cart_token'),
                            placeHolder: `${Language.text('please_enter')} ${Language.text('order_number')}`,
                            callback: value => {
                                glitter.setUrlParameter('cart_token', value);
                            },
                        }),
                        BgWidget.editeInput({
                            gvc,
                            title: Language.text('customer_name'),
                            default: vm.buyer_name,
                            placeHolder: `${Language.text('please_enter')} ${Language.text('customer_name')}`,
                            callback: value => {
                                vm.buyer_name = value;
                            },
                        }),
                        BgWidget.editeInput({
                            gvc,
                            title: Language.text('customer_phone'),
                            default: vm.buyer_phone,
                            placeHolder: `${Language.text('please_enter')} ${Language.text('customer_phone')}`,
                            callback: value => {
                                vm.buyer_phone = value;
                            },
                        }),
                    ].join('')}
          </div>`;
                },
                footer_html: (gvc) => {
                    return `<div class="w-100 d-flex border-top mt-0 py-2 px-3">
<div class="flex-fill"></div>
${[
                        `  <button
                                class="customer-btn-text "
                                style=" height: 32px;
        padding: 6px 14px;
        background: #393939;
        border-radius: 10px;
        justify-content: center;
        align-items: center;
        display: inline-flex;
        cursor: pointer;"
                                id=""
                                onclick="${gvc.event(() => {
                            loadOrderData();
                            gvc.closeDialog();
                        })}"
                              >
                                查詢
                              </button>`,
                    ].join('')}
</div>`;
                },
            });
        }
        return html ` <div class="container py-4">
      ${gvc.bindView({
            bind: ids.view,
            dataList: [{ obj: vm, key: 'type' }],
            view: () => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (loadings.view) {
                        return UmClass.spinner({
                            container: {
                                style: 'height: 100%;',
                            },
                        });
                    }
                    if (!vm.data || !vm.data.orderData || !vm.data.cart_token) {
                        return html ` <section class="o-h2">${Language.text('order_not_found')}</section> `;
                    }
                    const orderData = vm.data.orderData;
                    if (window.store_info.pickup_mode) {
                        dialog.infoMessage({
                            text: html `取貨時請核對您的取貨號碼，您的取貨號碼為<br />
                  <div class="fw-bold fs-5 text-danger">『 ${vm.data.shipment_number} 號 』</div>`,
                        });
                    }
                    const showUploadProof = orderData.method === 'off_line' &&
                        orderData.customer_info.payment_select !== 'cash_on_delivery' &&
                        `${orderData.orderStatus}` != '-1';
                    function payInfo() {
                        const id = glitter.getUUID();
                        return gvc.bindView({
                            bind: id,
                            view: () => __awaiter(this, void 0, void 0, function* () {
                                let arr = [];
                                if (orderData.customer_info.payment_select === 'atm') {
                                    arr = [
                                        {
                                            title: Language.text('bank_name'),
                                            value: orderData.payment_info_atm.bank_name,
                                        },
                                        {
                                            title: Language.text('bank_code'),
                                            value: orderData.payment_info_atm.bank_code,
                                        },
                                        {
                                            title: Language.text('remittance_account_name'),
                                            value: orderData.payment_info_atm.bank_user,
                                        },
                                        {
                                            title: Language.text('remittance_account_number'),
                                            value: orderData.payment_info_atm.bank_account,
                                        },
                                        {
                                            title: Language.text('remittance_amount'),
                                            value: orderData.total.toLocaleString(),
                                        },
                                        {
                                            title: Language.text('payment_instructions'),
                                            value: orderData.payment_info_atm.text,
                                        },
                                    ];
                                }
                                else if (orderData.customer_info.payment_select === 'line') {
                                    arr = [
                                        {
                                            title: Language.text('payment_instructions'),
                                            value: orderData.payment_info_line_pay.text,
                                        },
                                    ];
                                }
                                else {
                                    yield new Promise(resolve => {
                                        ApiShop.getOrderPaymentMethod().then(data => {
                                            if (data.result && data.response) {
                                                const customer = data.response.payment_info_custom.find((item) => {
                                                    return item.id === orderData.customer_info.payment_select;
                                                });
                                                if (customer) {
                                                    resolve([
                                                        {
                                                            title: Language.text('payment_instructions'),
                                                            value: customer.text,
                                                        },
                                                    ]);
                                                }
                                                else {
                                                    resolve([]);
                                                }
                                            }
                                        });
                                    }).then(finalArr => {
                                        arr = finalArr;
                                    });
                                }
                                return gvc.map(arr.map((item) => {
                                    return html `
                        <div
                          class="o-title-container ${item.title === Language.text('payment_instructions')
                                        ? 'align-items-start mt-2'
                                        : ''}"
                        >
                          <div class="o-title me-1" style="white-space: nowrap;">${item.title}：</div>
                          <div class="o-title fr-view">${item.value}</div>
                        </div>
                      `;
                                }));
                            }),
                        });
                    }
                    function validateForm(data) {
                        if (orderData.customer_info.payment_select === 'line') {
                            if (CheckInput.isEmpty(data.image)) {
                                dialog.errorMessage({ text: Language.text('upload_screenshot_for_verification') });
                                return false;
                            }
                            return true;
                        }
                        if (vm.formList.length > 0) {
                            for (const item of vm.formList) {
                                if (item.require === 'true' && CheckInput.isEmpty(data[item.key])) {
                                    dialog.errorMessage({ text: `${Language.text('please_enter')}「${item.title}」` });
                                    return false;
                                }
                            }
                            return true;
                        }
                        const paymentTime = data['pay-date'];
                        const bankName = data.bank_name;
                        const accountName = data.bank_account;
                        const accountLastFive = data.trasaction_code;
                        if (!paymentTime) {
                            dialog.errorMessage({ text: Language.text('payment_time_not_filled') });
                            return false;
                        }
                        if (!bankName) {
                            dialog.errorMessage({ text: Language.text('bank_name_not_filled') });
                            return false;
                        }
                        if (!accountName) {
                            dialog.errorMessage({ text: Language.text('bank_account_name_not_filled') });
                            return false;
                        }
                        if (!/^\d{5}$/.test(accountLastFive)) {
                            dialog.errorMessage({ text: Language.text('last_five_digits_five_digits') });
                            return false;
                        }
                        return true;
                    }
                    if (vm.type === 'upload') {
                        let formData = {};
                        return html `
                <section class="o-h1">${Language.text('order_number')}<br />#${vm.data.cart_token}</section>
                <section class="o-card-row" style="max-width: 100%;">
                  <div class="col-12 col-md-6 px-2">
                    <h3 class="mb-3 text-center">${Language.text('payment_info')}</h3>
                    <div class="o-gray-line"></div>
                    ${payInfo()}
                  </div>
                  <div class="col-12 col-md-6 px-2">
                    <h3 class="mb-3 text-center">${Language.text('payment_proof')}</h3>
                    <div class="o-gray-line"></div>
                    <span class="o-gray-text"
                      >${(() => {
                            if (orderData.customer_info.payment_select === 'atm') {
                                return html `＊${Language.text('please_confirm_bank_account_details')}`;
                            }
                            if (orderData.customer_info.payment_select === 'line') {
                                return html `＊${Language.text('upload_screenshot_for_verification')}`;
                            }
                            if (orderData.customer_info.payment_select === 'cash_on_delivery') {
                                return html `＊${Language.text('please_confirm_bank_account_details')} <br />＊${Language.text('upload_screenshot_or_transfer_proof')}`;
                            }
                            return '';
                        })()}</span
                    >
                    ${gvc.bindView((() => {
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
                                            const from = orderData.payment_customer_form.find((item) => {
                                                return item.id === orderData.customer_info.payment_select;
                                            });
                                            formData.paymentForm = from;
                                            if (from === undefined || from.list.length === 0) {
                                                return [];
                                            }
                                            vm.formList = from.list;
                                            return from.list;
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
                        })())}
                    <div
                      class="o-button mx-2"
                      onclick="${gvc.event(() => {
                            if (!validateForm(formData)) {
                                return;
                            }
                            dialog.dataLoading({
                                visible: true,
                                text: Language.text('data_submitting'),
                            });
                            ApiShop.proofPurchase(vm.data.cart_token, formData).then(() => {
                                dialog.dataLoading({ visible: false });
                                location.reload();
                            });
                        })}"
                    >
                      <span class="o-button-text">${Language.text('confirm')}</span>
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
                  <span class="go-back-text">${Language.text('return_to_order_details')}</span>
                </section>
              `;
                    }
                    return html `
              <section class="o-h1">${Language.text('order_number')}<br />#${vm.data.cart_token}</section>
              <section class="o-card">
                <h3 class="mb-3">${Language.text('order_details')}</h3>
                ${gvc.map(orderData.lineItems.map(item => {
                        return html `
                      <div class="o-line-item ${document.body.clientWidth < 800 ? 'p-2' : ''}">
                        <div class="d-flex gap-3 align-items-center">
                          <div>
                            ${UmClass.validImageBox({
                            gvc,
                            image: item.preview_image,
                            width: 60,
                            style: 'border-radius: 10px;',
                        })}
                          </div>
                          <div>
                            <p
                              class="o-item-title"
                              onclick="${gvc.event(() => {
                            dialog.dataLoading({
                                visible: true,
                                text: Language.text('loading'),
                            });
                            ApiShop.getProduct({
                                page: 0,
                                limit: 1,
                                id: `${item.id}`,
                            }).then(data => {
                                dialog.dataLoading({ visible: false });
                                try {
                                    if (data.result && data.response.data) {
                                        gvc.glitter.href = `/products/${data.response.data.content.seo.domain}`;
                                    }
                                }
                                catch (error) {
                                    dialog.errorMessage({ text: Language.text('product_not_found') });
                                }
                            });
                        })}"
                            >
                              ${(item.language_data && item.language_data[Language.getLanguage()].title) ||
                            item.title}
                            </p>
                            <p class="o-item-spec">
                              ${item.spec.length > 0
                            ? `${Language.text('specification')}：${(() => {
                                const spec = (() => {
                                    if (item.spec) {
                                        return item.spec.map((dd, index) => {
                                            try {
                                                return (item.specs[index].option.find((d1) => {
                                                    return d1.title === dd;
                                                }).language_title[Language.getLanguage()] || dd);
                                            }
                                            catch (e) {
                                                return dd;
                                            }
                                        });
                                    }
                                    else {
                                        return [];
                                    }
                                })();
                                return spec.join(' / ');
                            })()}`
                            : Language.text('single_specification')}
                            </p>
                            <span class="me-3 d-sm-none">NT ${item.sale_price.toLocaleString()} × ${item.count}</span>
                          </div>
                        </div>
                        <div class="d-none d-sm-flex">
                          <span class="me-3 d-none d-sm-block"
                            >$ ${item.sale_price.toLocaleString()} × ${item.count}</span
                          >
                          <span class="o-subtotal">NT$ ${(item.sale_price * item.count).toLocaleString()}</span>
                        </div>
                      </div>
                    `;
                    }))}
                <div class="o-total-container">
                  <div class="o-total-item">
                    <span>${Language.text('subtotal_amount')}</span>
                    <span class="o-subtotal"
                      >NT$
                      ${(orderData.total -
                        orderData.shipment_fee +
                        orderData.discount +
                        orderData.use_rebate).toLocaleString()}</span
                    >
                  </div>
                  <div class="o-total-item">
                    <span>${Language.text('shopping_credit_offset')}</span>
                    <span class="o-subtotal">− NT$ ${orderData.use_rebate.toLocaleString()}</span>
                  </div>
                  <div class="o-total-item">
                    <span>${Language.text('discount_coupon')}</span>
                    <span class="o-subtotal">− NT$ ${orderData.discount.toLocaleString()}</span>
                  </div>
                  <div class="o-total-item">
                    <span>${Language.text('shipping_fee')}</span>
                    <span class="o-subtotal">NT$ ${orderData.shipment_fee.toLocaleString()}</span>
                  </div>
                  <div class="o-total-item">
                    <span class="o-total-text">${Language.text('total_amount')}</span>
                    <span class="o-total">NT$ ${orderData.total.toLocaleString()}</span>
                  </div>
                </div>
              </section>
              ${showUploadProof
                        ? html ` <section class="o-card">
                    <h3 class="mb-3">${Language.text('payment_info')}</h3>
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
                      <span class="o-button-text"
                        >${orderData.proof_purchase
                            ? Language.text('reupload_checkout_proof')
                            : Language.text('upload_checkout_proof')}</span
                      >
                    </div>
                  </section>`
                        : ''}
              <section class="o-card-row">
                <div class="col-12 col-md-6 mb-3 px-0">
                  <h3 class="mb-3">${Language.text('order_information')}</h3>
                  ${(() => {
                        function checkAndRemoveURLParameter() {
                            if (glitter.getUrlParameter('EndCheckout')) {
                                glitter.setUrlParameter('EndCheckout', undefined);
                                if (showUploadProof && !orderData.proof_purchase) {
                                    dialog.infoMessage({
                                        text: `您已完成訂單，請於「付款資訊」了解付款說明後，儘速上傳結帳證明，以完成付款程序`,
                                    });
                                }
                                Ad.fbqEvent('Purchase', {
                                    value: orderData.total,
                                    currency: 'TWD',
                                    contents: orderData.lineItems.map((item) => {
                                        return {
                                            id: item.sku || item.id,
                                            quantity: item.count,
                                        };
                                    }),
                                    content_type: 'product',
                                    eventID: orderData.orderID,
                                });
                                Ad.gtagEvent('purchase', {
                                    transaction_id: vm.data.cart_token,
                                    value: orderData.total,
                                    shipping: orderData.shipment_fee,
                                    currency: 'TWD',
                                    coupon: orderData.voucherList && orderData.voucherList.length > 0
                                        ? orderData.voucherList[0].title
                                        : '',
                                    items: orderData.lineItems.map((item, index) => {
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
                        function customerCancelOrder() {
                            const origin = vm.data;
                            const proofPurchase = orderData.proof_purchase === undefined;
                            const paymentStatus = origin.status === undefined || origin.status === 0 || origin.status === -1;
                            const progressStatus = orderData.progress === undefined || orderData.progress === 'wait';
                            const orderStatus = orderData.orderStatus === undefined || `${orderData.orderStatus}` === '0';
                            if (!(proofPurchase && paymentStatus && progressStatus && orderStatus)) {
                                return '';
                            }
                            const id = glitter.getUUID();
                            let loading = true;
                            let allow = false;
                            return gvc.bindView({
                                bind: id,
                                view: () => {
                                    return !loading && allow
                                        ? html `
                                <div
                                  class="customer-btn ms-3"
                                  onclick="${gvc.event(() => UMOrder.cancelOrder(gvc, vm.data.cart_token))}"
                                >
                                  <div class="customer-btn-text">${Language.text('cancel_order')}</div>
                                </div>
                              `
                                        : '';
                                },
                                divCreate: {
                                    elem: 'span',
                                },
                                onCreate: () => {
                                    if (loading) {
                                        ApiUser.getPublicConfig('login_config', 'manager').then(data => {
                                            var _a, _b;
                                            loading = false;
                                            allow = Boolean(data.result && ((_b = (_a = data.response) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.customer_cancel_order));
                                            gvc.notifyDataChange(id);
                                        });
                                    }
                                },
                            });
                        }
                        checkAndRemoveURLParameter();
                        const arr = [
                            {
                                title: Language.text('order_number'),
                                value: vm.data.cart_token,
                            },
                            {
                                title: Language.text('order_date'),
                                value: gvc.glitter.ut.dateFormat(new Date(vm.data.created_time), 'yyyy-MM-dd'),
                            },
                            {
                                title: Language.text('order_status'),
                                value: (() => {
                                    switch (orderData.orderStatus) {
                                        case '-1':
                                            return html ` <div class="text-danger">${Language.text('cancelled')}</div>`;
                                        case '1':
                                            return Language.text('completed');
                                        case '-99':
                                            return Language.text('deleted');
                                        default:
                                            return Language.text('processing') + customerCancelOrder();
                                    }
                                })(),
                            },
                            {
                                title: Language.text('payment_method'),
                                value: Language.text(orderData.customer_info.payment_select),
                            },
                            {
                                title: Language.text('payment_status'),
                                value: (() => {
                                    var _a, _b, _c, _d;
                                    if (orderData.customer_info.payment_select === 'cash_on_delivery') {
                                        return Language.text('cash_on_delivery');
                                    }
                                    const repayBtn = () => {
                                        return html ` <span class="payment-actions ">
                              <button
                                class="customer-btn-text ms-3"
                                id="repay-button"
                                onclick="${gvc.event(() => {
                                            UMOrder.repay(gvc, vm.data).then(r => { });
                                        })}"
                              >
                                重新付款
                              </button>
                            </span>`;
                                    };
                                    switch (vm.data.status) {
                                        case 0:
                                            if (repayArray.includes((_b = (_a = vm.data) === null || _a === void 0 ? void 0 : _a.payment_method) !== null && _b !== void 0 ? _b : '')) {
                                                const repayBtn = () => {
                                                    return html ` <span class="payment-actions d-none">
                                    <button
                                      class="customer-btn-text ms-3"
                                      id="repay-button"
                                      onclick="${gvc.event(() => {
                                                        UMOrder.repay(gvc, vm.data).then(r => { });
                                                    })}"
                                    >
                                      重新付款
                                    </button>
                                  </span>`;
                                                };
                                                return Language.text('unpaid') + repayBtn();
                                            }
                                            return orderData.proof_purchase
                                                ? Language.text('awaiting_verification')
                                                : `${Language.text('unpaid')}`;
                                        case 1:
                                            return Language.text('paid');
                                        case -1:
                                            if (repayArray.includes((_d = (_c = vm.data) === null || _c === void 0 ? void 0 : _c.payment_method) !== null && _d !== void 0 ? _d : '')) {
                                                return Language.text('payment_failed') + repayBtn();
                                            }
                                            return Language.text('payment_failed');
                                        case -2:
                                            return Language.text('refunded');
                                    }
                                })(),
                            },
                        ];
                        return gvc.map(arr.map(item => {
                            return html `
                          <div class="o-title-container">
                            <div class="o-title me-1">${item.title}：</div>
                            <div class="o-title">${item.value}</div>
                          </div>
                        `;
                        }));
                    })()}
                </div>
                <div class="col-12 col-md-6 mb-3 px-0">
                  <h3 class="mb-3">${Language.text('customer_information')}</h3>
                  ${(() => {
                        var _a;
                        const arr = [
                            {
                                title: Language.text('name'),
                                value: orderData.customer_info.name,
                            },
                            {
                                title: Language.text('contact_number'),
                                value: orderData.customer_info.phone,
                            },
                            ...(orderData.customer_info.email
                                ? [
                                    {
                                        title: Language.text('email'),
                                        value: orderData.customer_info.email,
                                    },
                                ]
                                : []),
                        ].concat(((_a = orderData.custom_form_format) !== null && _a !== void 0 ? _a : [])
                            .map(dd => {
                            return {
                                title: Language.getLanguageCustomText(dd.title),
                                value: orderData.custom_form_data[dd.key],
                            };
                        })
                            .filter(d1 => {
                            return d1.value;
                        }));
                        return gvc.map(arr.map(item => {
                            return html `
                          <div class="o-title-container">
                            <div class="o-title me-1">${item.title}：</div>
                            <div class="o-title">${item.value}</div>
                          </div>
                        `;
                        }));
                    })()}
                </div>
                <div class="col-12 col-md-6 mb-3 px-0">
                  <h3 class="mb-3">${Language.text('shipping_information')}</h3>
                  ${(() => {
                        var _a;
                        const selector = orderData.shipment_selector.find(dd => {
                            return dd.value === orderData.user_info.shipment;
                        });
                        let arr = [
                            {
                                title: Language.text('shipping_method'),
                                value: (() => {
                                    switch (orderData.user_info.shipment) {
                                        case 'FAMIC2C':
                                            return Language.text('ship_FAMIC2C');
                                        case 'HILIFEC2C':
                                            return Language.text('ship_HILIFEC2C');
                                        case 'OKMARTC2C':
                                            return Language.text('ship_OKMARTC2C');
                                        case 'UNIMARTC2C':
                                            return Language.text('ship_UNIMARTC2C');
                                        case 'shop':
                                            return Language.text('ship_shop');
                                        case 'global_express':
                                            return Language.text('ship_global_express');
                                        default:
                                            if (selector) {
                                                return Language.getLanguageCustomText(selector.name);
                                            }
                                            else {
                                                return Language.text('ship_normal');
                                            }
                                    }
                                })(),
                            },
                        ];
                        if (vm.data.invoice_number) {
                            arr.push({
                                title: Language.text('invoice_number'),
                                value: vm.data.invoice_number,
                            });
                        }
                        if (vm.data.orderData.user_info.shipment_number) {
                            arr.push({
                                title: window.store_info.pickup_mode ? `取貨號碼` : Language.text('shipment_number'),
                                value: vm.data.orderData.user_info.shipment_number,
                            });
                        }
                        if (vm.data.orderData.user_info.shipment_date) {
                            arr.push({
                                title: Language.text('shipment_date'),
                                value: gvc.glitter.ut.dateFormat(new Date(vm.data.orderData.user_info.shipment_date), 'yyyy-MM-dd hh:mm'),
                            });
                        }
                        if (vm.data.orderData.user_info.shipment_detail &&
                            vm.data.orderData.user_info.shipment_detail.paymentno) {
                            arr.push({
                                title: Language.text('track_number'),
                                value: vm.data.orderData.user_info.shipment_detail.paymentno,
                            });
                        }
                        if (['UNIMARTC2C', 'UNIMARTFREEZE', 'FAMIC2C', 'FAMIC2CFREEZE', 'OKMARTC2C', 'HILIFEC2C'].find(dd => {
                            return dd === orderData.user_info.shipment;
                        })) {
                            arr = [
                                ...arr,
                                ...[
                                    {
                                        title: Language.text('store_number'),
                                        value: decodeURI(orderData.user_info.CVSStoreID),
                                    },
                                    {
                                        title: Language.text('store_name'),
                                        value: decodeURI(orderData.user_info.CVSStoreName),
                                    },
                                    {
                                        title: Language.text('store_address'),
                                        value: decodeURI(orderData.user_info.CVSAddress),
                                    },
                                ],
                            ];
                        }
                        else if (orderData.user_info.address) {
                            arr.push({
                                title: Language.text('receiving_address'),
                                value: [
                                    orderData.user_info.city,
                                    orderData.user_info.area,
                                    orderData.user_info.address,
                                ]
                                    .filter(Boolean)
                                    .join(''),
                            });
                        }
                        arr.push({
                            title: Language.text('shipping_status'),
                            value: (() => {
                                switch (orderData.progress) {
                                    case 'shipping':
                                        return Language.text('shipped');
                                    case 'finish':
                                        return Language.text('picked_up');
                                    case 'arrived':
                                        if (ShipmentConfig.supermarketList.includes(orderData.user_info.shipment)) {
                                            return Language.text('delivered_stored');
                                        }
                                        else {
                                            return Language.text('delivered');
                                        }
                                    case 'returns':
                                        return Language.text('returned');
                                    default:
                                        return Language.text('not_yet_shipped');
                                }
                            })(),
                        });
                        if (orderData.user_info.shipment_info) {
                            arr.push({
                                title: Language.text('shipping_instructions'),
                                value: orderData.user_info.shipment_info,
                            });
                        }
                        arr = [
                            ...arr,
                            ...[
                                {
                                    title: Language.text('recipient_name'),
                                    value: orderData.user_info.name,
                                },
                                ...(orderData.user_info.phone
                                    ? [
                                        {
                                            title: Language.text('recipient_phone'),
                                            value: orderData.user_info.phone,
                                        },
                                    ]
                                    : []),
                                ...(orderData.user_info.email
                                    ? [
                                        {
                                            title: Language.text('recipient_email'),
                                            value: orderData.user_info.email,
                                        },
                                    ]
                                    : []),
                            ],
                        ];
                        if (selector && selector.form) {
                            arr = arr.concat(selector.form.map((dd) => {
                                return {
                                    title: Language.getLanguageCustomText(dd.title),
                                    value: Language.getLanguageCustomText(orderData.user_info.custom_form_delivery[dd.key]),
                                };
                            }));
                        }
                        if (orderData.custom_receipt_form) {
                            arr = arr.concat(((_a = orderData.custom_receipt_form) !== null && _a !== void 0 ? _a : [])
                                .map(dd => {
                                return {
                                    title: Language.getLanguageCustomText(dd.title),
                                    value: orderData.user_info[dd.key],
                                };
                            })
                                .filter(d1 => {
                                return d1.value;
                            }));
                        }
                        if (orderData.user_info.note) {
                            arr.push({
                                title: Language.text('shipping_notes'),
                                value: orderData.user_info.note,
                            });
                        }
                        return gvc.map(arr.map(item => {
                            return html `
                          <div class="o-title-container">
                            <div class="o-title me-1" style="white-space: nowrap;">${item.title}：</div>
                            <div class="o-title">${item.value}</div>
                          </div>
                        `;
                        }));
                    })()}
                </div>
              </section>
              <section
                class="m-auto d-flex align-items-center justify-content-center my-5"
                style="cursor: pointer;"
                onclick="${gvc.event(() => {
                        gvc.glitter.href = `/order_list`;
                    })}"
              >
                <img class="me-2" src="https://ui.homee.ai/htmlExtension/shopify/order/img/back.svg" />
                <span class="go-back-text">${Language.text('return_to_order_list')}</span>
              </section>
            `;
                }
                catch (e) {
                    console.error(e);
                    return '';
                }
            }),
            divCreate: {
                class: 'd-flex align-items-center justify-content-center gap-3 flex-column',
                style: 'min-height: 50vh;',
            },
            onCreate: () => __awaiter(this, void 0, void 0, function* () {
                if (loadings.view) {
                    vm.passport = glitter.share.GlobalUser.token ? Boolean(yield UmClass.getUserData(gvc)) : vm.passport;
                    if (GlobalUser.token) {
                        loadOrderData();
                    }
                    else {
                        guestCheckView();
                    }
                }
            }),
        })}
    </div>`;
    }
}
UMOrder.atmFormList = [
    {
        col: '12',
        key: 'pay-date',
        page: 'input',
        type: 'form_plugin_v2',
        group: '',
        title: Language.text('payment_time'),
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
            place_holder: '',
        },
    },
    {
        col: '12',
        key: 'bank_name',
        page: 'input',
        type: 'form_plugin_v2',
        group: '',
        title: Language.text('my_bank_name'),
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
            place_holder: Language.text('enter_your_bank_name'),
        },
    },
    {
        col: '12',
        key: 'bank_account',
        page: 'input',
        type: 'form_plugin_v2',
        group: '',
        title: Language.text('my_bank_account_name'),
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
            place_holder: Language.text('enter_your_bank_account_name'),
        },
    },
    {
        col: '12',
        key: 'trasaction_code',
        page: 'input',
        type: 'form_plugin_v2',
        group: '',
        title: Language.text('last_five_digits_of_bank_account'),
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
            place_holder: Language.text('enter_five_digits'),
        },
    },
];
UMOrder.lineFormList = [
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
        moduleName: Language.text('file_upload'),
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
            place_holder: '',
        },
    },
];
window.glitter.setModule(import.meta.url, UMOrder);
