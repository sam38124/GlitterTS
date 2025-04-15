import { GVC } from '../../glitterBundle/GVController.js';
import { UmClass } from './um-class.js';
import { ApiUser } from '../../glitter-base/route/user.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { ApiCart } from '../../glitter-base/route/api-cart.js';
import { Ad } from '../public/ad.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { FormWidget } from '../../official_view_component/official/form.js';
import { Language } from '../../glitter-base/global/language.js';
import { CheckInput } from '../../modules/checkInput.js';
import { ShipmentConfig } from '../../glitter-base/global/shipment-config.js';

const html = String.raw;
const css = String.raw;

interface Order {
  payment_method?: string;
  id: number;
  cart_token: string;
  status: number;
  email: string;
  orderData: OrderData;
  created_time: string;
}

interface OrderData {
  payment_method: string;
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
  payment_customer_form: {
    id: string;
    list: any[];
  }[];
  custom_receipt_form?: any[];
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
        line-height:normal;
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
        height:32px;
        
        background-color: #4caf50;
        color: white;
        border-radius:10px;
        padding: 6px 14px;
        border: none;
        cursor: pointer;
      }
      
      #repay-button:hover {
        background-color: #45a049;
      }
    `);
  }

  static repay(gvc: GVC, id: string) {
    const dialog = new ShareDialog(gvc.glitter);
    dialog.dataLoading({ visible: true, text: Language.text('loading') });

    const redirect = gvc.glitter.root_path + 'order_detail' + location.search;
    const l = new URL(redirect as any, location.href);

    return new Promise(() => {
      ApiShop.repay(id, l.href).then(res => {
        dialog.dataLoading({ visible: false });
        const id = gvc.glitter.getUUID();
        $('body').append(`<div id="${id}" style="display: none;">${res.response.form}</div>`);
        (document.querySelector(`#${id} #submit`) as any).click();
        new ApiCart().clearCart();
      });
    });
  }

  static cancelOrder(gvc: GVC, id: string) {
    const dialog = new ShareDialog(gvc.glitter);
    dialog.checkYesOrNot({
      text: Language.text('c_cancel_order'),
      callback: (bool: boolean) => {
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

  static atmFormList = [
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
      formList: [] as any,
    };
    //判定可以重新付款的付款方式
    const repayArray = ['ecPay', 'newWebPay', 'paypal', 'jkopay', 'paynow', 'line_pay'];

    return html` <div class="container py-4">
      ${gvc.bindView({
        bind: ids.view,
        dataList: [{ obj: vm, key: 'type' }],
        view: () => {
          try {
            if (loadings.view) {
              return UmClass.spinner({
                container: {
                  style: 'height: 100%;',
                },
              });
            }

            if (!vm.data || !vm.data.orderData || !vm.data.cart_token) {
              return html` <section class="o-h2">${Language.text('order_not_found')}</section> `;
            }

            const orderData = vm.data.orderData;

            const showUploadProof =
              orderData.method === 'off_line' &&
              orderData.customer_info.payment_select !== 'cash_on_delivery' &&
              `${orderData.orderStatus}` != '-1';

            function payInfo() {
              const id = glitter.getUUID();
              return gvc.bindView({
                bind: id,
                view: async () => {
                  let arr = [] as any;
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
                  } else if (orderData.customer_info.payment_select === 'line') {
                    arr = [
                      {
                        title: Language.text('payment_instructions'),
                        value: orderData.payment_info_line_pay.text,
                      },
                    ];
                  } else {
                    await new Promise<any[]>(resolve => {
                      ApiShop.getOrderPaymentMethod().then(data => {
                        if (data.result && data.response) {
                          const customer = data.response.payment_info_custom.find((item: any) => {
                            return item.id === orderData.customer_info.payment_select;
                          });
                          if (customer) {
                            resolve([
                              {
                                title: Language.text('payment_instructions'),
                                value: customer.text,
                              },
                            ]);
                          } else {
                            resolve([]);
                          }
                        }
                      });
                    }).then(finalArr => {
                      arr = finalArr;
                    });
                  }
                  return gvc.map(
                    arr.map((item: any) => {
                      return html`
                        <div
                          class="o-title-container ${item.title === Language.text('payment_instructions')
                            ? 'align-items-start mt-2'
                            : ''}"
                          style=""
                        >
                          <div class="o-title me-1" style="white-space: nowrap;">${item.title}：</div>
                          <div class="o-title fr-view">${item.value}</div>
                        </div>
                      `;
                    })
                  );
                },
              });
            }

            function validateForm(data: any) {
              // 1. 檢查LINE轉帳是否上傳圖片
              if (orderData.customer_info.payment_select === 'line') {
                if (CheckInput.isEmpty(data.image)) {
                  dialog.errorMessage({ text: Language.text('upload_screenshot_for_verification') });
                  return false;
                }
                return true;
              }

              // 2. 自訂表單驗證
              if (vm.formList.length > 0) {
                for (const item of vm.formList) {
                  if (item.require === 'true' && CheckInput.isEmpty(data[item.key])) {
                    dialog.errorMessage({ text: `${Language.text('please_enter')}「${item.title}」` });
                    return false;
                  }
                }
                return true;
              }

              // 3. 銀行轉帳驗證
              const paymentTime = data['pay-date'];
              const bankName = data.bank_name;
              const accountName = data.bank_account;
              const accountLastFive = data.trasaction_code;

              // 檢查付款時間
              if (!paymentTime) {
                dialog.errorMessage({ text: Language.text('payment_time_not_filled') });
                return false;
              }

              // 檢查銀行名稱
              if (!bankName) {
                dialog.errorMessage({ text: Language.text('bank_name_not_filled') });
                return false;
              }

              // 檢查銀行戶名
              if (!accountName) {
                dialog.errorMessage({ text: Language.text('bank_account_name_not_filled') });
                return false;
              }

              // 檢查銀行帳號後五碼
              if (!/^\d{5}$/.test(accountLastFive)) {
                dialog.errorMessage({ text: Language.text('last_five_digits_five_digits') });
                return false;
              }

              return true;
            }

            if (vm.type === 'upload') {
              let formData = {} as any;
              return html`
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
                          return html`＊${Language.text('please_confirm_bank_account_details')}`;
                        }
                        if (orderData.customer_info.payment_select === 'line') {
                          return html`＊${Language.text('upload_screenshot_for_verification')}`;
                        }
                        if (orderData.customer_info.payment_select === 'cash_on_delivery') {
                          return html`＊${Language.text('please_confirm_bank_account_details')} <br />＊${Language.text(
                              'upload_screenshot_or_transfer_proof'
                            )}`;
                        }
                        return '';
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

                                const from = orderData.payment_customer_form.find((item: any) => {
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
                      })()
                    )}
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
            return html`
              <section class="o-h1">${Language.text('order_number')}<br />#${vm.data.cart_token}</section>
              <section class="o-card">
                <h3 class="mb-3">${Language.text('order_details')}</h3>
                ${gvc.map(
                  orderData.lineItems.map(item => {
                    return html`
                      <div class="o-line-item ${document.body.clientWidth < 800 ? `p-2` : ``}">
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
                                  } catch (error) {
                                    dialog.errorMessage({ text: Language.text('product_not_found') });
                                  }
                                });
                              })}"
                            >
                              ${(() => {
                                const title =
                                  (item.language_data && (item as any).language_data[Language.getLanguage()].title) ||
                                  item.title;
                                return title;
                              })()}
                            </p>
                            <p class="o-item-spec">
                              ${item.spec.length > 0
                                ? `${Language.text('specification')}：${(() => {
                                    const spec: any = (() => {
                                      if (item.spec) {
                                        return item.spec.map((dd: string, index: number) => {
                                          try {
                                            return (
                                              (item.specs[index] as any).option.find((d1: any) => {
                                                return d1.title === dd;
                                              }).language_title[Language.getLanguage()] || dd
                                            );
                                          } catch (e) {
                                            return dd;
                                          }
                                        });
                                      } else {
                                        return [];
                                      }
                                    })();
                                    return spec.join(' / ');
                                  })()}`
                                : Language.text('single_specification')}
                            </p>
                            <span class="me-3  d-sm-none">NT ${item.sale_price.toLocaleString()} × ${item.count}</span>
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
                  })
                )}
                <div class="o-total-container">
                  <div class="o-total-item">
                    <span>${Language.text('subtotal_amount')}</span>
                    <span class="o-subtotal"
                      >NT$
                      ${(
                        orderData.total -
                        orderData.shipment_fee +
                        orderData.discount +
                        orderData.use_rebate
                      ).toLocaleString()}</span
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
                ? html` <section class="o-card">
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

                        Ad.gtagEvent('purchase', {
                          transaction_id: vm.data.cart_token,
                          value: orderData.total,
                          shipping: orderData.shipment_fee,
                          currency: 'TWD',
                          coupon:
                            orderData.voucherList && orderData.voucherList.length > 0
                              ? orderData.voucherList[0].title
                              : '',
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
                            ? html`
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
                              loading = false;
                              allow = Boolean(data.result && data.response?.value?.customer_cancel_order);
                              gvc.notifyDataChange(id);
                            });
                          }
                        },
                      });
                    }

                    function gotoCheckout() {
                      const isOffLine = orderData.method === 'off_line';
                      if (isOffLine) {
                        return '';
                      }
                      return html` <div
                        class="customer-btn ms-3 d-none"
                        onclick="${gvc.event(() => {
                          UMOrder.repay(gvc, vm.data.cart_token);
                        })}"
                      >
                        <div class="customer-btn-text">${Language.text('proceed_to_checkout')}</div>
                      </div>`;
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
                              return `<div class="text-danger">${Language.text('cancelled')}</div>`;
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
                        title: Language.text('payment_status'),
                        value: (() => {
                          if (orderData.customer_info.payment_select === 'cash_on_delivery') {
                            return Language.text('cash_on_delivery');
                          }
                          switch (vm.data.status) {
                            case 0:
                              if (repayArray.includes(vm.data?.payment_method ?? '')) {
                                const repayBtn = () => {
                                  return html` 
                                  <span class="payment-actions">
                                    <button class="customer-btn-text ms-3" id="repay-button" onclick="${gvc.event(()=>{
                                      UMOrder.repay(gvc, vm.data.cart_token).then(r => {
                                       
                                      });
                                    })}">重新付款</button>
                                  </span>`;
                                };
                                return Language.text('awaiting_verification') + repayBtn();
                              }
                              return orderData.proof_purchase
                                ? Language.text('awaiting_verification')
                                : `${Language.text('unpaid')}${gotoCheckout()}`;
                            case 1:
                              return Language.text('paid');
                            case -1:
                              return Language.text('payment_failed');
                            case -2:
                              return Language.text('refunded');
                          }
                        })(),
                      },
                    ];

                    return gvc.map(
                      arr.map(item => {
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
                  <h3 class="mb-3">${Language.text('customer_information')}</h3>
                  ${(() => {
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
                    ].concat(
                      (orderData.custom_form_format ?? [])
                        .map(dd => {
                          return {
                            title: Language.getLanguageCustomText(dd.title),
                            value: orderData.custom_form_data[dd.key],
                          };
                        })
                        .filter(d1 => {
                          return d1.value;
                        })
                    );

                    return gvc.map(
                      arr.map(item => {
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
                  <h3 class="mb-3">${Language.text('shipping_information')}</h3>
                  ${(() => {
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
                              } else {
                                return Language.text('ship_normal');
                              }
                          }
                        })(),
                      },
                    ];
                    if ((vm.data as any).invoice_number) {
                      arr.push({
                        title: Language.text('invoice_number'),
                        value: (vm.data as any).invoice_number,
                      });
                    }

                    if ((vm.data as any).orderData.user_info.shipment_number) {
                      arr.push({
                        title: Language.text('shipment_number'),
                        value: (vm.data as any).orderData.user_info.shipment_number,
                      });
                    }

                    if ((vm.data as any).orderData.user_info.shipment_date) {
                      arr.push({
                        title: Language.text('shipment_date'),
                        value: gvc.glitter.ut.dateFormat(
                          new Date((vm.data as any).orderData.user_info.shipment_date),
                          'yyyy-MM-dd hh:mm'
                        ),
                      });
                    }
                    if (
                      (vm.data as any).orderData.user_info.shipment_detail &&
                      (vm.data as any).orderData.user_info.shipment_detail.paymentno
                    ) {
                      arr.push({
                        title: Language.text('track_number'),
                        value: (vm.data as any).orderData.user_info.shipment_detail.paymentno,
                      });
                    }

                    if (
                      ['FAMIC2C', 'HILIFEC2C', 'OKMARTC2C', 'UNIMARTC2C'].find(dd => {
                        return dd === orderData.user_info.shipment;
                      })
                    ) {
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
                    } else if (orderData.user_info.address) {
                      arr.push({
                        title: Language.text('receiving_address'),
                        value: [
                          (orderData.user_info as any).city,
                          (orderData.user_info as any).area,
                          orderData.user_info.address,
                        ]
                          .filter(dd => {
                            return dd;
                          })
                          .join(','),
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
                            } else {
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
                      arr = arr.concat(
                        selector.form.map((dd: any) => {
                          return {
                            title: Language.getLanguageCustomText(dd.title),
                            value: Language.getLanguageCustomText(orderData.user_info.custom_form_delivery[dd.key]),
                          };
                        })
                      );
                    }
                    if ((orderData as any).custom_receipt_form) {
                      arr = arr.concat(
                        (orderData.custom_receipt_form ?? [])
                          .map(dd => {
                            return {
                              title: Language.getLanguageCustomText(dd.title),
                              value: (orderData.user_info as any)[dd.key],
                            };
                          })
                          .filter(d1 => {
                            return d1.value;
                          })
                      );
                    }
                    if (orderData.user_info.note) {
                      arr.push({
                        title: Language.text('shipping_notes'),
                        value: orderData.user_info.note,
                      });
                    }
                    return gvc.map(
                      arr.map(item => {
                        return html`
                          <div class="o-title-container">
                            <div class="o-title me-1" style="white-space: nowrap;">${item.title}：</div>
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
                  gvc.glitter.href = `/order_list`;
                })}"
              >
                <img class="me-2" src="https://ui.homee.ai/htmlExtension/shopify/order/img/back.svg" />
                <span class="go-back-text">${Language.text('return_to_order_list')}</span>
              </section>
            `;
          } catch (e) {
            console.error(e);
            return ``;
          }
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
