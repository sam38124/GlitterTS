import { GVC } from '../glitterBundle/GVController.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { CheckInput } from '../modules/checkInput.js';
import { Tool } from '../modules/tool.js';
import { imageLibrary } from '../modules/image-library.js';
import { LanguageBackend } from './language-backend.js';
import { ProductAi } from './ai-generator/product-ai.js';
import { ApiPageConfig } from '../api/pageConfig.js';
import { Language } from '../glitter-base/global/language.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { PaymentConfig } from '../glitter-base/global/payment-config.js';
import { ShipmentConfig } from '../glitter-base/global/shipment-config.js';
import { ShoppingShipmentSetting } from './shopping-shipment-setting.js';

type CustomFinance = {
  name: string;
  id: string;
  text: string;
  shipmentSupport: string[];
};

type ShipmentGroupData = {
  key: string;
  name: string;
  list: string[];
};

const html = String.raw;

export class ShoppingFinanceSetting {
  static main(gvc: GVC, pos?: boolean) {
    pos = `${pos}` === 'true';
    const dialog = new ShareDialog(gvc.glitter);
    const saasConfig: { config: any; api: any } = (window.parent as any).saasConfig;

    const vm: {
      id: string;
      onBoxId: string;
      posBoxId: string;
      offBoxId: string;
      loading: boolean;
      page: 'online' | 'offline' | 'pos';
    } = {
      id: gvc.glitter.getUUID(),
      onBoxId: gvc.glitter.getUUID(),
      posBoxId: gvc.glitter.getUUID(),
      offBoxId: gvc.glitter.getUUID(),
      loading: true,
      page: pos ? 'pos' : 'online',
    };

    let keyData: any = { payment_info_custom: [] };

    function refresh() {
      gvc.notifyDataChange(vm.id);
    }

    function saveData() {
      saasConfig.api.setPrivateConfig(saasConfig.config.appName, 'glitter_finance', keyData).then(() => {
        vm.loading = true;
        refresh();
      });
    }

    // 自訂金流設定
    function updateCustomFinance(obj: { function: 'replace' | 'plus'; data?: CustomFinance }) {
      const custom_finance: CustomFinance = structuredClone(
        obj.data || {
          id: gvc.glitter.getUUID(),
          name: '',
          text: '',
          shipmentSupport: [],
        }
      );
      let form: any = undefined;

      BgWidget.settingDialog({
        gvc: gvc,
        title: obj.function === 'replace' ? '修改金流設定' : '新增自訂金流',
        width: 800,
        innerHTML: gvc => {
          const id = gvc.glitter.getUUID();
          form = BgWidget.customForm(gvc, [
            {
              title: html` <div class="tx_normal fw-bolder mt-2 d-flex flex-column" style="margin-bottom: 12px;">
                自訂線下金流表單
                <span style="color: #8D8D8D; font-size: 12px;">當客戶選擇此付款方式時，所需上傳的付款證明</span>
              </div>`,
              key: `form_finance_${custom_finance.id}`,
              no_padding: true,
            },
          ]);

          return gvc.bindView({
            bind: id,
            view: () => {
              const setting = {
                title: '金流設定',
                key: 'setting',
                html: [
                  BgWidget.editeInput({
                    gvc: gvc,
                    title: '自訂金流名稱',
                    default: custom_finance.name,
                    callback: text => {
                      custom_finance.name = text;
                    },
                    placeHolder: '請輸入自訂金流名稱',
                    global_language: true,
                  }),
                  form.view,
                ].join(''),
              };

              const note = {
                title: '付款說明',
                key: 'note',
                html: [
                  html` <div class="d-flex justify-content-between mb-3">
                    <div class="tx_normal">付款說明</div>
                  </div>`,
                  BgWidget.richTextEditor({
                    gvc: gvc,
                    content: custom_finance.text,
                    callback: content => {
                      custom_finance.text = content;
                    },
                    title: '付款說明',
                  }),
                ].join(''),
              };

              const shipment = {
                key: 'shipment',
                title: '指定物流',
                html: gvc.bindView({
                  bind: gvc.glitter.getUUID(),
                  view: () => ShoppingFinanceSetting.setShipmentSupport(gvc, custom_finance),
                }),
              };

              const cartSetting = {
                key: 'cartSetting',
                title: '購物車設定',
                html: gvc.bindView({
                  bind: gvc.glitter.getUUID(),
                  view: () => ShoppingFinanceSetting.setCartSetting(gvc, custom_finance),
                }),
              };

              return ShoppingFinanceSetting.tabView(gvc, [setting, note, shipment, cartSetting]);
            },
          });
        },
        footer_html: gvc => {
          const saveButton = BgWidget.save(
            gvc.event(() => {
              return new Promise<boolean>(async () => {
                if (!custom_finance.name) {
                  dialog.errorMessage({ text: '請輸入金流名稱' });
                  return;
                }

                keyData.payment_info_custom = keyData.payment_info_custom ?? [];

                if (obj.function === 'plus') {
                  const newFinance = JSON.parse(JSON.stringify(custom_finance));
                  keyData.payment_info_custom.push(newFinance);
                } else {
                  const index = keyData.payment_info_custom.findIndex((d1: any) => d1.id === custom_finance.id);
                  if (index !== -1) {
                    keyData.payment_info_custom[index] = custom_finance;
                  } else {
                    console.error('找不到對應的金流設定 ID:', custom_finance.id);
                    return;
                  }
                }

                dialog.dataLoading({ visible: true });

                try {
                  await form.save();
                  await saasConfig.api.setPrivateConfig(saasConfig.config.appName, 'glitter_finance', keyData);

                  dialog.successMessage({ text: '設定成功' });
                } catch (error) {
                  console.error('更新金流設定失敗:', error);
                  dialog.errorMessage({ text: '設定失敗，請稍後再試' });
                } finally {
                  dialog.dataLoading({ visible: false });
                }

                gvc.closeDialog();
                refresh();
              });
            })
          );

          if (obj.function === 'plus') {
            return saveButton;
          }

          return [
            BgWidget.danger(
              gvc.event(() => {
                dialog.checkYesOrNot({
                  text: '是否確認刪除？',
                  callback: response => {
                    if (response) {
                      keyData.payment_info_custom = keyData.payment_info_custom.filter((d1: any) => {
                        return obj.data!.id !== d1.id;
                      });
                      dialog.dataLoading({ visible: true });
                      saasConfig.api.setPrivateConfig(saasConfig.config.appName, 'glitter_finance', keyData);
                      dialog.dataLoading({ visible: false });
                      gvc.closeDialog();
                      refresh();
                    }
                  },
                });
              })
            ),
            saveButton,
          ].join('');
        },
      });
    }

    return BgWidget.container(
      html`
        ${[
          html` <div class="title-container ${pos ? `d-none` : ''}">
            ${BgWidget.title('金流設定')}
            <div class="flex-fill"></div>
          </div>`,
          gvc.bindView({
            bind: vm.id,
            view: () => {
              if (vm.loading) {
                return BgWidget.spinner();
              }

              try {
                keyData.off_line_support = keyData.off_line_support ?? {
                  line: false,
                  atm: false,
                  cash_on_delivery: false,
                  ...keyData.payment_info_custom.map((dd: any) => {
                    return {
                      [dd.id]: false,
                    };
                  }),
                };

                Object.keys(keyData.off_line_support).map(key => {
                  if (
                    ['line', 'atm', 'cash_on_delivery'].includes(key) ||
                    keyData.payment_info_custom.some((item: any) => item.id === key)
                  ) {
                    return;
                  }
                  delete keyData.off_line_support[key];
                });

                let h = '';
                const cloneData = structuredClone(keyData);

                // 線上金流
                if (vm.page === 'online') {
                  h = html` <div class="px-md-0 px-2 mb-2">
                      ${BgWidget.normalInsignia('透過線上金流，消費者可於線上進行結帳付款')}
                    </div>
                    <div class="row">
                      ${PaymentConfig.onlinePay
                        .filter(item => item.type !== 'pos')
                        .map(dd => {
                          keyData[dd.key] = keyData[dd.key] ?? {};
                          return html` <div class="col-12 col-lg-3 col-md-4 p-0 p-md-2">
                            <div
                              class="w-100 position-relative main-card"
                              style=" background: white; overflow: hidden; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 10px; display: inline-flex;"
                            >
                             
                              <div
                                style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 28px; display: inline-flex"
                              >
                                <div style="min-width: 46px;max-width: 46px;">
                                  <img src="${dd.img || BgWidget.noImageURL}" />
                                </div>
                                <div
                                  style="flex-direction: column; justify-content: center; align-items: flex-start; gap: 4px; display: inline-flex"
                                >
                                  <div class="tx_normal">${dd.name}</div>
                                  <div class="d-flex align-items-center" style="gap:4px;">
                                    <div class="tx_normal">${keyData[dd.key].toggle ? `開啟` : `關閉`}</div>
                                    <div class="cursor_pointer form-check form-switch" style="margin-top: 10px;">
                                      <input
                                        class="form-check-input"
                                        type="checkbox"
                                        onchange="${gvc.event((e, event) => {
                                          keyData[dd.key].toggle = !keyData[dd.key].toggle;
                                          saveData();
                                        })}"
                                        ${keyData[dd.key].toggle ? `checked` : ''}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="border-top w-100"></div>
                              <div class="w-100 d-flex align-items-center justify-content-end fw-500" style="">
                                ${BgWidget.customButton({
                                  button: {
                                    color: 'gray',
                                    size: 'sm',
                                  },
                                  text: {
                                    name: '金流設定',
                                  },
                                  event: gvc.event(() => {
                                    const payData = dd;
                                    const key_d = structuredClone(keyData[payData.key]);

                                    BgWidget.settingDialog({
                                      gvc: gvc,
                                      title: '金流設定',
                                      width: 800,
                                      innerHTML: (gvc: GVC) => {
                                        try {
                                          const setting = {
                                            key: 'setting',
                                            title: '基本設定',
                                            html: html` ${BgWidget.editeInput({
                                              gvc: gvc,
                                              title: html`<div>
                                                  自訂金流名稱 ${BgWidget.grayNote('未輸入則參照預設')}
                                                </div>`,
                                              default: key_d.custome_name,
                                              callback: text => {
                                                key_d.custome_name = text;
                                              },
                                              placeHolder: '請輸入自訂顯示名稱',
                                              global_language: true,
                                            })}
                                              <div style="margin-top: 8px;">
                                                ${(() => {
                                              switch (payData.key) {
                                                case 'newWebPay':
                                                case 'ecPay':
                                                  return [
                                                    BgWidget.inlineCheckBox({
                                                      title: '串接路徑',
                                                      gvc: gvc,
                                                      def: key_d.ActionURL,
                                                      array: (() => {
                                                        if (payData.key === 'newWebPay') {
                                                          return [
                                                            {
                                                              title: '正式站',
                                                              value: 'https://core.newebpay.com/MPG/mpg_gateway',
                                                            },
                                                            {
                                                              title: '測試站',
                                                              value: 'https://ccore.newebpay.com/MPG/mpg_gateway',
                                                            },
                                                          ];
                                                        } else {
                                                          return [
                                                            {
                                                              title: '正式站',
                                                              value:
                                                                'https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5',
                                                            },
                                                            {
                                                              title: '測試站',
                                                              value:
                                                                'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5',
                                                            },
                                                          ];
                                                        }
                                                      })(),
                                                      callback: (text: any) => {
                                                        key_d.ActionURL = text;
                                                      },
                                                    }),
                                                    BgWidget.inlineCheckBox({
                                                      title: '開通付款方式',
                                                      gvc: gvc,
                                                      def: [
                                                        'credit',
                                                        'atm',
                                                        'web_atm',
                                                        'c_code',
                                                        'c_bar_code',
                                                      ].filter(dd => {
                                                        return (key_d as any)[dd];
                                                      }),
                                                      array: [
                                                        {
                                                          title: '信用卡',
                                                          value: 'credit',
                                                        },
                                                        {
                                                          title: '一般 ATM',
                                                          value: 'atm',
                                                        },
                                                        {
                                                          title: '網路 ATM',
                                                          value: 'web_atm',
                                                        },
                                                        {
                                                          title: '超商代碼',
                                                          value: 'c_code',
                                                        },
                                                        {
                                                          title: '超商條碼',
                                                          value: 'c_bar_code',
                                                        },
                                                      ],
                                                      callback: (array: any) => {
                                                        ['credit', 'atm', 'web_atm', 'c_code', 'c_bar_code'].map(
                                                          dd => {
                                                            (key_d as any)[dd] = !!array.find((d1: string) => {
                                                              return d1 === dd;
                                                            });
                                                          }
                                                        );
                                                      },
                                                      type: 'multiple',
                                                    }),
                                                    BgWidget.editeInput({
                                                      gvc: gvc,
                                                      title: '特店編號',
                                                      default: key_d.MERCHANT_ID,
                                                      callback: text => {
                                                        key_d.MERCHANT_ID = text;
                                                      },
                                                      placeHolder: '請輸入特店編號',
                                                    }),
                                                    BgWidget.editeInput({
                                                      gvc: gvc,
                                                      title: 'HASH_KEY',
                                                      default: key_d.HASH_KEY,
                                                      callback: text => {
                                                        key_d.HASH_KEY = text;
                                                      },
                                                      placeHolder: '請輸入HASH_KEY',
                                                    }),
                                                    BgWidget.editeInput({
                                                      gvc: gvc,
                                                      title: 'HASH_IV',
                                                      default: key_d.HASH_IV,
                                                      callback: text => {
                                                        key_d.HASH_IV = text;
                                                      },
                                                      placeHolder: '請輸入HASH_IV',
                                                    }),
                                                    BgWidget.editeInput({
                                                      gvc: gvc,
                                                      title: '信用卡授權檢查碼',
                                                      default: key_d.CreditCheckCode,
                                                      callback: text => {
                                                        key_d.CreditCheckCode = text;
                                                      },
                                                      placeHolder: '請輸入信用卡檢查碼',
                                                    }),
                                                  ].join('');
                                                case 'paypal':
                                                  return [
                                                    BgWidget.inlineCheckBox({
                                                      title: '串接路徑',
                                                      gvc: gvc,
                                                      def: `${key_d.BETA}`,
                                                      array: [
                                                        {
                                                          title: '正式站',
                                                          value: `false`,
                                                        },
                                                        {
                                                          title: '測試站',
                                                          value: `true`,
                                                        },
                                                      ],
                                                      callback: (text: any) => {
                                                        key_d.BETA = text;
                                                      },
                                                    }),
                                                    BgWidget.editeInput({
                                                      gvc: gvc,
                                                      title: 'CLIENT_ID',
                                                      default: key_d.PAYPAL_CLIENT_ID,
                                                      callback: text => {
                                                        key_d.PAYPAL_CLIENT_ID = text;
                                                      },
                                                      placeHolder: '請輸入CLIENT_ID',
                                                    }),
                                                    BgWidget.editeInput({
                                                      gvc: gvc,
                                                      title: 'SECRET',
                                                      default: key_d.PAYPAL_SECRET,
                                                      callback: text => {
                                                        key_d.PAYPAL_SECRET = text;
                                                      },
                                                      placeHolder: '請輸入SECRET',
                                                    }),
                                                  ].join('');
                                                case 'line_pay':
                                                  return [
                                                    BgWidget.inlineCheckBox({
                                                      title: '串接路徑',
                                                      gvc: gvc,
                                                      def: `${key_d.BETA}`,
                                                      array: [
                                                        {
                                                          title: '正式站',
                                                          value: `false`,
                                                        },
                                                        {
                                                          title: '測試站',
                                                          value: `true`,
                                                        },
                                                      ],
                                                      callback: (text: any) => {
                                                        key_d.BETA = text;
                                                      },
                                                    }),
                                                    BgWidget.editeInput({
                                                      gvc: gvc,
                                                      title: 'CLIENT_ID',
                                                      default: key_d.CLIENT_ID,
                                                      callback: text => {
                                                        key_d.CLIENT_ID = text;
                                                      },
                                                      placeHolder: '請輸入CLIENT_ID',
                                                    }),
                                                    BgWidget.editeInput({
                                                      gvc: gvc,
                                                      title: 'SECRET',
                                                      default: key_d.SECRET,
                                                      callback: text => {
                                                        key_d.SECRET = text;
                                                      },
                                                      placeHolder: '請輸入SECRET',
                                                    }),
                                                  ].join('');
                                                case 'jkopay':
                                                  return [
                                                    BgWidget.editeInput({
                                                      gvc: gvc,
                                                      title: 'STORE_ID',
                                                      default: key_d.STORE_ID,
                                                      callback: text => {
                                                        key_d.STORE_ID = text;
                                                      },
                                                      placeHolder: '請輸入STORE_ID',
                                                    }),
                                                  ].join('');
                                                case 'paynow':
                                                  return [
                                                    BgWidget.inlineCheckBox({
                                                      title: '串接路徑',
                                                      gvc: gvc,
                                                      def: `${key_d.BETA}`,
                                                      array: [
                                                        {
                                                          title: '正式站',
                                                          value: `false`,
                                                        },
                                                        {
                                                          title: '測試站',
                                                          value: `true`,
                                                        },
                                                      ],
                                                      callback: (text: any) => {
                                                        key_d.BETA = text;
                                                      },
                                                    }),
                                                    BgWidget.editeInput({
                                                      gvc: gvc,
                                                      title: '串接帳號',
                                                      default: key_d.account,
                                                      callback: text => {
                                                        key_d.account = text;
                                                      },
                                                      placeHolder: '請輸入串接帳號',
                                                    }),
                                                    BgWidget.editeInput({
                                                      gvc: gvc,
                                                      title: '串接密碼',
                                                      default: key_d.pwd,
                                                      callback: text => {
                                                        key_d.pwd = text;
                                                      },
                                                      placeHolder: '請輸入串接密碼',
                                                    }),
                                                  ].join('');
                                              }
                                              return '';
                                            })()}
                                              </div>`,
                                          };

                                          const shipment = {
                                            key: 'shipment',
                                            title: '指定物流',
                                            html: gvc.bindView({
                                              bind: gvc.glitter.getUUID(),
                                              view: () => ShoppingFinanceSetting.setShipmentSupport(gvc, key_d),
                                            }),
                                          };

                                          const cartSetting = {
                                            key: 'cartSetting',
                                            title: '購物車設定',
                                            html: gvc.bindView({
                                              bind: gvc.glitter.getUUID(),
                                              view: () => ShoppingFinanceSetting.setCartSetting(gvc, key_d),
                                            }),
                                          };

                                          return ShoppingFinanceSetting.tabView(gvc, [setting, shipment, cartSetting]);
                                        } catch (e) {
                                          console.error(e);
                                          return `${e}`;
                                        }
                                      },
                                      footer_html: gvc => {
                                        return [
                                          BgWidget.cancel(
                                            gvc.event(() => {
                                              keyData = cloneData;
                                              gvc.closeDialog();
                                            })
                                          ),
                                          BgWidget.save(
                                            gvc.event(() => {
                                              //綠界支付的測試版切換
                                              if (
                                                payData.key == 'ecPay' &&
                                                key_d.ActionURL ==
                                                'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5'
                                              ) {
                                                key_d.MERCHANT_ID = '3002607';
                                                key_d.HASH_KEY = 'pwFHCqoQZGmho4w6';
                                                key_d.HASH_IV = 'EkRm7iFT261dpevs';
                                              }
                                              keyData[payData.key] = key_d;
                                              saveData();
                                              gvc.closeDialog();
                                            })
                                          ),
                                        ].join('');
                                      },
                                      closeCallback: () => {
                                        keyData = cloneData;
                                      },
                                    });
                                  }),
                                })}
                              </div>
                            </div>
                           
                          </div>`;
                        })
                        .join('')}
                    </div>`;
                }

                // 線下金流
                if (vm.page === 'offline') {
                  const offlinePayArray = [
                    // 系統線下金流
                    ...PaymentConfig.defalutOfflinePay,
                    // 自訂線下金流
                    ...keyData.payment_info_custom.map((dd: any) => {
                      return {
                        key: dd.id,
                        name: html`${Language.getLanguageCustomText(dd.name)}`,
                        custom: true,
                      };
                    }),
                  ];

                  h = html` <div class="px-md-0 px-2 mb-2">
                      ${BgWidget.normalInsignia(
                        '透過設定線下金流，結帳後訂單將進入手動核款的流程，亦可使用超商取貨付款'
                      )}
                    </div>
                    <div class="row">
                      ${offlinePayArray
                        .map((dd: any) => {
                          return html` <div class="col-12 col-lg-3 col-md-4 p-0 p-md-2">
                            <div
                              class="w-100 position-relative main-card"
                              style=" background: white; overflow: hidden; flex-direction: column; justify-content: flex-start; align-items: flex-start;gap:10px;  display: inline-flex;"
                            >
                              <div
                                style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 28px; display: inline-flex"
                              >
                                <div style="min-width: 46px;max-width: 46px;">
                                  ${dd.img
                                    ? html`<img class="rounded-2" src="${dd.img}" />`
                                    : html`<i class="fa-regular fa-puzzle-piece-simple fs-4" aria-hidden="true"></i>`}
                                </div>
                                <div
                                  style="flex-direction: column; justify-content: center; align-items: flex-start; gap: 4px; display: inline-flex"
                                >
                                  <div class="tx_normal">${dd.name}</div>
                                  <div class="d-flex align-items-center" style="gap:4px;">
                                    <div class="tx_normal">
                                      ${(keyData.off_line_support as any)[dd.key] ? `開啟` : `關閉`}
                                    </div>
                                    <div class="cursor_pointer form-check form-switch" style="margin-top: 10px;">
                                      <input
                                        class="form-check-input"
                                        type="checkbox"
                                        onchange="${gvc.event((e, event) => {
                                          (keyData.off_line_support as any)[dd.key] = !(
                                            keyData.off_line_support as any
                                          )[dd.key];
                                          saveData();
                                        })}"
                                        ${(keyData.off_line_support as any)[dd.key] ? `checked` : ''}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="border-top w-100"></div>
                              <div
                                class=" w-100 d-flex align-items-center justify-content-end fw-500 ${dd.hide_setting ? `d-none` : ''}"
                                style=""
                              >
                                ${BgWidget.customButton({
                                  button: {
                                    color: 'gray',
                                    size: 'sm',
                                  },
                                  text: {
                                    name: '金流設定',
                                  },
                                  event: gvc.event(() => {
                                    if (dd.custom) {
                                      updateCustomFinance({
                                        function: 'replace',
                                        data: keyData.payment_info_custom.find((d1: any) => dd.key === d1.id),
                                      });
                                      return;
                                    }

                                    BgWidget.settingDialog({
                                      gvc: gvc,
                                      title: '金流設定',
                                      width: 800,
                                      innerHTML: gvc => {
                                        const keyMap: Record<string, string> = {
                                          atm: this.atm(gvc, keyData),
                                          line: this.lineIPassMoney(gvc, keyData),
                                          cash_on_delivery: this.cashOnDelivery(gvc, keyData),
                                        };
                                        return html`<div>${keyMap[dd.key] || ''}</div>`;
                                      },
                                      footer_html: gvc => {
                                        return [
                                          BgWidget.cancel(
                                            gvc.event(() => {
                                              keyData = cloneData;
                                              gvc.closeDialog();
                                            })
                                          ),
                                          BgWidget.save(
                                            gvc.event(() => {
                                              saveData();
                                              gvc.closeDialog();
                                            })
                                          ),
                                        ].join('');
                                      },
                                      closeCallback: () => {
                                        keyData = cloneData;
                                      },
                                    });
                                  }),
                                })}
                              </div>
                            </div>
                          </div>`;
                        })
                        .join('')}
                      <div
                        class="col-12 col-lg-3 col-md-4 p-0 p-md-2"
                        style="cursor: pointer;"
                        onclick="${gvc.event(() => {
                          updateCustomFinance({ function: 'plus' });
                        })}"
                      >
                        <div
                          class="w-100 main-card"
                          style="min-height:119.09px;padding: 24px; background: white; overflow: hidden; flex-direction: column; justify-content: center; align-items: center; gap: 18px; display: inline-flex"
                        >
                          <div
                            class="fw-bold"
                            style="align-self: stretch; justify-content: center; align-items: center; gap: 14px; display: inline-flex;color:#4D86DB;"
                          >
                            <i class="fa-regular fa-circle-plus fs-5"></i>
                            <div class="fs-5">新增自訂付款</div>
                          </div>
                        </div>
                      </div>
                    </div>`;
                }

                // POS
                if (vm.page === 'pos') {
                  h = html`<div class="px-md-0 px-2 mb-2">
                      ${BgWidget.normalInsignia('設定實體店面所需串接的付款方式')}
                    </div>
                    <div class="row">
                      ${PaymentConfig.onlinePay
                        .filter(item => item.type === 'pos')
                        .map(dd => {
                          return html` <div class="col-12 col-lg-3 col-md-4 p-0 p-md-2">
                            <div
                              class="w-100 position-relative main-card"
                              style=" background: white; overflow: hidden; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 10px; display: inline-flex;"
                            >
                              <div
                                style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 28px; display: inline-flex"
                              >
                                <div style="min-width: 46px;max-width: 46px;">
                                  <img src="${dd.img || BgWidget.noImageURL}" />
                                </div>
                                <div
                                  style="flex-direction: column; justify-content: center; align-items: flex-start; gap: 4px; display: inline-flex"
                                >
                                  <div class="tx_normal">${dd.name}</div>
                                  <div class="d-flex align-items-center" style="gap:4px;">
                                    <div class="tx_normal">${keyData[dd.key].toggle ? `開啟` : `關閉`}</div>
                                    <div class="cursor_pointer form-check form-switch" style="margin-top: 10px;">
                                      <input
                                        class="form-check-input"
                                        type="checkbox"
                                        onchange="${gvc.event(() => {
                                          keyData[dd.key].toggle = !keyData[dd.key].toggle;
                                          saveData();
                                        })}"
                                        ${keyData[dd.key].toggle ? `checked` : ''}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="border-top w-100"></div>
                              <div class="w-100 d-flex align-items-center justify-content-end fw-500" style="cursor:pointer;">
                                ${BgWidget.customButton({
                                  button: {
                                    color: 'gray',
                                    size: 'sm',
                                  },
                                  text: {
                                    name: '金流設定',
                                  },
                                  event: gvc.event(() => {
                                    const payData = dd;
                                    const key_d = structuredClone(keyData[payData.key]);
                                    BgWidget.settingDialog({
                                      gvc: gvc,
                                      title: '金流設定',
                                      width: 800,
                                      innerHTML: (gvc: GVC) => {
                                        try {
                                          return html`<div>
                                            ${(() => {
                                            switch (payData.key) {
                                              case 'line_pay_scan':
                                                return this.linePayScan(gvc, key_d);
                                              case 'ut_credit_card':
                                                return this.utCreditCard(gvc, key_d);
                                            }
                                            return '';
                                          })()}
                                          </div>`;
                                        } catch (error) {
                                          console.error(error);
                                          return '';
                                        }
                                      },
                                      footer_html: gvc => {
                                        return [
                                          BgWidget.cancel(
                                            gvc.event(() => {
                                              keyData = cloneData;
                                              gvc.closeDialog();
                                            })
                                          ),
                                          BgWidget.save(
                                            gvc.event(() => {
                                              keyData[payData.key] = key_d;
                                              saveData();
                                              gvc.closeDialog();
                                            })
                                          ),
                                        ].join('');
                                      },
                                      closeCallback: () => {
                                        keyData = cloneData;
                                      },
                                    });
                                  }),
                                })}
                              </div>
                            </div>
                          </div>`;
                        })
                        .join('')}
                    </div>`;
                }

                return [
                  pos
                    ? ''
                    : BgWidget.tab(
                        [
                          { key: 'online', title: '線上金流' },
                          { key: 'offline', title: '線下金流' },
                        ],
                        gvc,
                        vm.page,
                        (key: any) => {
                          vm.page = key;
                          gvc.notifyDataChange(vm.id);
                        }
                      ),
                  h,
                ].join('');
              } catch (e) {
                console.error(e);
                return `${e}`;
              }
            },
            onCreate: () => {
              if (vm.loading) {
                return new Promise<void>(async resolve => {
                  const data = await saasConfig.api.getPrivateConfig(saasConfig.config.appName, 'glitter_finance');
                  if (data.response.result[0]) {
                    keyData = {
                      ...keyData,
                      ...data.response.result[0].value,
                    };
                  }
                  resolve();
                }).then(() => {
                  vm.loading = false;
                  gvc.notifyDataChange(vm.id);
                });
              } else {
                const handleBeforeUnload = (e: any) => {
                  e.preventDefault();
                  e.returnValue = '您確定要離開金流設定嗎？您將會失去未儲存的更改';
                };
                (window.parent as any).document.addEventListener('beforeunload', handleBeforeUnload);
              }
            },
          }),
        ].join('')}
        ${pos ? '' : BgWidget.mbContainer(240)}
      `,
      {
        style: pos ? `margin-top: 0px !important;` : '',
      }
    );
  }

  // 分頁模組
  static tabView(gvc: GVC, viewList: { key: string; title: string; html: string }[]) {
    const vm = {
      id: gvc.glitter.getUUID(),
      key: (viewList[0].key ?? '') as string,
    };

    return gvc.bindView({
      bind: vm.id,
      view: () => {
        const page = viewList.find(view => view.key === vm.key)?.html ?? '';
        return [
          BgWidget.tab(
            viewList,
            gvc,
            vm.key,
            res => {
              vm.key = res;
              gvc.notifyDataChange(vm.id);
            },
            'margin-bottom: 0px; margin-top: -10px;'
          ),
          page,
        ].join(BgWidget.mbContainer(12));
      },
    });
  }

  // 自訂物流設定
  static async setShipmentSupport(gvc: GVC, data: Record<string, any>) {
    const id = gvc.glitter.getUUID();

    const saasConfig: { config: any; api: any } = (window.parent as any).saasConfig;
    const logiData = await saasConfig.api.getPrivateConfig(saasConfig.config.appName, 'logistics_setting');
    const custom_delivery: any[] = (() => {
      try {
        return logiData?.response?.result[0]?.value?.custom_delivery || [];
      } catch (error) {
        console.error(error);
        return [];
      }
    })();

    const allDelivery = ShipmentConfig.list.concat(
      custom_delivery.map((dd: any) => {
        return {
          title: Language.getLanguageCustomText(dd.name),
          value: dd.id,
          custom: true,
          type: 'font_awesome',
          src: html`<i class="fa-regular fa-puzzle-piece-simple fs-4"></i>`,
        };
      })
    );

    return html`<div class="w-100">
      <div class="d-flex align-items-center mt-2 gap-2">
        ${BgWidget.customButton({
          button: {
            color: 'snow',
            size: 'sm',
          },
          text: {
            name: '全部開啟',
          },
          event: gvc.event(() => {
            data.shipmentSupport = allDelivery.map(d => d.value);
            gvc.notifyDataChange(id);
          }),
        })}
        ${BgWidget.customButton({
          button: {
            color: 'snow',
            size: 'sm',
          },
          text: {
            name: '全部關閉',
          },
          event: gvc.event(() => {
            data.shipmentSupport = [];
            gvc.notifyDataChange(id);
          }),
        })}
        ${BgWidget.questionButton(
          gvc.event(() => {
            BgWidget.quesDialog({
              gvc,
              innerHTML: () => {
                return html`<div class="tx_normal text-wrap text-white">
                  此設定將於顧客結帳頁面，選擇該金流後，限制選擇已開啟的物流配送選項
                </div>`;
              },
            });
          })
        )}
      </div>
      ${gvc.bindView({
        bind: id,
        view: () => {
          try {
            if (!(data && Array.isArray(data.shipmentSupport))) {
              data.shipmentSupport = [];
            }

            return allDelivery
              .map(dd => {
                const trigger = data.shipmentSupport.find((d1: any) => dd.value === d1);
                return html`
                  <div class="col-lg-6 col-12 p-0 p-md-2">
                    <div
                      class="w-100 position-relative main-card shadow"
                      style="padding: 24px 32px; background: white; overflow: hidden; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 18px; display: inline-flex;"
                    >
                      <div
                        style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 28px; display: inline-flex"
                      >
                        <div style="min-width: 46px;max-width: 46px;">
                          ${dd.type === 'font_awesome' ? dd.src : html` <img src="${dd.src}" />`}
                        </div>
                        <div
                          style="flex-direction: column; justify-content: center; align-items: flex-start; gap: 4px; display: inline-flex"
                        >
                          <div class="tx_normal">${dd.title}</div>
                          <div class="d-flex align-items-center" style="gap:4px;">
                            <div class="tx_normal">${trigger ? '開啟' : '關閉'}</div>
                            <div class="cursor_pointer form-check form-switch" style="margin-top: 10px;">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                onchange="${gvc.event(() => {
                                  if (trigger) {
                                    data.shipmentSupport = data.shipmentSupport.filter((d1: any) => dd.value !== d1);
                                  } else {
                                    data.shipmentSupport.push(dd.value);
                                  }
                                  gvc.notifyDataChange(id);
                                })}"
                                ${trigger ? 'checked' : ''}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  ${document.body.clientWidth > 768 ? '' : BgWidget.mbContainer(8)}
                `;
              })
              .join('');
          } catch (error) {
            console.error('cashSupport error' + error);
            return '支援物流選項發生錯誤';
          }
        },
        divCreate: {
          class: 'row guide3-3 mt-3 px-1',
        },
      })}
    </div>`;
  }

  // 自訂購物車設定
  static setCartSetting(gvc: GVC, data: Record<string, any>, type: 'cashflow' | 'shipment' = 'cashflow') {
    const id = gvc.glitter.getUUID();
    const dialog = new ShareDialog(gvc.glitter);
    const t = type === 'cashflow' ? '金' : '物';

    data.cartSetting = {
      minimumTotal: 0,
      maximumTotal: 0,
      freeShipmnetTarget: 0,
      orderFormula: [],
      ...(data.cartSetting ?? {}),
    };

    function questionDialog(text: string) {
      return BgWidget.questionButton(
        gvc.event(() => {
          BgWidget.quesDialog({
            gvc,
            innerHTML: () => html`<div class="tx_normal text-wrap text-white">${text}</div>`,
          });
        })
      );
    }

    function checkTotalNumber(text: string, type: 'min' | 'max' | 'freeShipmnet') {
      const n = parseInt(`${text}`, 10);
      if (isNaN(n) || n < 0) {
        dialog.errorMessage({ text: '請輸入正整數' });
        gvc.notifyDataChange(id);
      }

      if (type === 'freeShipmnet') {
        data.cartSetting.freeShipmnetTarget = n;
      }

      if (type === 'min') {
        if (data.cartSetting.maximumTotal !== 0 && n > data.cartSetting.maximumTotal) {
          dialog.errorMessage({ text: '數值需小於最高消費金額' });
          gvc.notifyDataChange(id);
        } else {
          data.cartSetting.minimumTotal = n;
        }
      }

      if (type === 'max') {
        if (data.cartSetting.minimumTotal !== 0 && n < data.cartSetting.minimumTotal) {
          dialog.errorMessage({ text: '數值需大於最低消費金額' });
          gvc.notifyDataChange(id);
        } else {
          data.cartSetting.maximumTotal = n;
        }
      }
    }

    return gvc.bindView({
      bind: id,
      view: () => {
        return [
          html`<div class="d-flex align-items-center mt-2 gap-2 mb-2">
            <div class="tx_700">是否啟用此${t}流的計算公式包含</div>
            ${questionDialog(
              html`<div style="white-space: normal;">
                  訂單總金額的公式為：<br />
                  「總金額(T) = 所有商品小計(A) - 購物金折抵(B) - 優惠券折抵(C) + 運費(D)」
                </div>
                ${BgWidget.mbContainer(12)}
                <div style="white-space: normal;">勾選的項目會列為「限制使用此${t}流」的公式判斷</div>
                ${BgWidget.mbContainer(12)}
                <div style="white-space: normal;">
                  範例：僅勾選「運費」，顧客購物車消費的總金額依然是 A-B-C+D<br />
                  但此${t}流是否能使用的公式會是 A+D
                </div>
                ${BgWidget.mbContainer(12)}
                <div style="white-space: normal;">
                  若 A+D 有在最低和最高消費金額的區間內<br />
                  則顧客可以使用此${t}流進行結帳
                </div>`
            )}
          </div>`,
          BgWidget.multiCheckboxContainer(
            gvc,
            [
              {
                key: 'use_rebate',
                name: '購物金折抵',
              },
              {
                key: 'discount',
                name: '優惠券折抵',
              },
              {
                key: 'shipment_fee',
                name: '運費',
              },
            ],
            data.cartSetting.orderFormula,
            result => {
              data.cartSetting.orderFormula = result;
            },
            { single: false }
          ),
          BgWidget.editeInput({
            gvc: gvc,
            title: html`<div class="d-flex align-items-center mt-2 gap-2">
              最低消費金額（輸入0則沒有限制） ${questionDialog(`顧客的購物車必須要消費到這個金額，才能啟用此${t}流`)}
            </div>`,
            default: `${data.cartSetting.minimumTotal}`,
            type: 'number',
            callback: text => {
              checkTotalNumber(text, 'min');
            },
            placeHolder: '請輸入金額',
          }),
          BgWidget.editeInput({
            gvc: gvc,
            title: html`<div class="d-flex align-items-center mt-2 gap-2">
              最高消費金額（輸入0則沒有限制） ${questionDialog(`顧客的購物車不可超出這個金額，才能啟用此${t}流`)}
            </div>`,
            default: `${data.cartSetting.maximumTotal}`,
            type: 'number',
            callback: text => {
              checkTotalNumber(text, 'max');
            },
            placeHolder: '請輸入金額',
          }),
          BgWidget.horizontalLine(),
          BgWidget.editeInput({
            gvc: gvc,
            title: html`<div class="d-flex align-items-center mt-2 gap-2">
              <div style="white-space: break-spaces;">達指定消費金額，訂單免運費（輸入0則不設定此功能）</div>
              ${questionDialog(html`訂單中「所有商品小計(A)」若達到輸入的指定值，使用此物流則免運`)}
            </div>`,
            default: `${data.cartSetting.freeShipmnetTarget}`,
            type: 'number',
            callback: text => {
              checkTotalNumber(text, 'freeShipmnet');
            },
            placeHolder: '請輸入金額',
          }),
        ].join('');
      },
    });
  }

  // 彈窗: 貨到付款 (線下)
  static cashOnDelivery(gvc: GVC, keyData: any) {
    keyData.cash_on_delivery = keyData.cash_on_delivery ?? { shipmentSupport: [] };

    const shipment = {
      key: 'shipment',
      title: '指定物流',
      html: gvc.bindView({
        bind: gvc.glitter.getUUID(),
        view: () => ShoppingFinanceSetting.setShipmentSupport(gvc, keyData.cash_on_delivery),
      }),
    };

    const cartSetting = {
      key: 'cartSetting',
      title: '購物車設定',
      html: gvc.bindView({
        bind: gvc.glitter.getUUID(),
        view: () => ShoppingFinanceSetting.setCartSetting(gvc, keyData.cash_on_delivery),
      }),
    };

    return this.tabView(gvc, [shipment, cartSetting]);
  }

  // 彈窗: Line Pay 一卡通 (線下)
  static lineIPassMoney(gvc: GVC, keyData: any) {
    keyData.payment_info_line_pay = keyData.payment_info_line_pay ?? { text: '' };

    const cashflow = {
      key: 'cashflow',
      title: '基本設定',
      html: (() => {
        const id = gvc.glitter.getUUID();
        const defText = html`<p>
            您選擇了線下Line
            Pay付款。請完成付款後，提供證明截圖(圖一)，或是照著(圖二)的流程擷取『付款詳細資訊』並上傳，以便我們核款。&nbsp;
          </p>
          <p>
            <br /><img
              src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722924978722-Frame%205078.png"
              class="fr-fic fr-dii"
              style="width: 215px;"
            />&nbsp;<img
              src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722924973580-Frame%205058.png"
              class="fr-fic fr-dii"
              style="width: 545px;"
            />
          </p>
          <p>
            <br />
          </p>`;

        return gvc.bindView({
          bind: id,
          view: () => {
            return [
              html` <div class="d-flex justify-content-between mb-3">
                <div class="tx_normal">付款說明</div>
                ${BgWidget.blueNote(
                  '返回預設',
                  gvc.event(() => {
                    keyData.payment_info_line_pay.text = defText;
                    gvc.notifyDataChange(id);
                  })
                )}
              </div>`,
              BgWidget.richTextEditor({
                gvc: gvc,
                content: keyData.payment_info_line_pay!.text ?? '',
                callback: content => {
                  keyData.payment_info_line_pay!.text = content;
                },
                title: '付款說明',
              }),
            ].join('');
          },
        });
      })(),
    };

    const shipment = {
      key: 'shipment',
      title: '指定物流',
      html: gvc.bindView({
        bind: gvc.glitter.getUUID(),
        view: () => ShoppingFinanceSetting.setShipmentSupport(gvc, keyData.payment_info_line_pay),
      }),
    };

    const cartSetting = {
      key: 'cartSetting',
      title: '購物車設定',
      html: gvc.bindView({
        bind: gvc.glitter.getUUID(),
        view: () => ShoppingFinanceSetting.setCartSetting(gvc, keyData.payment_info_line_pay),
      }),
    };

    return this.tabView(gvc, [cashflow, shipment, cartSetting]);
  }

  // 彈窗: ATM 轉帳 (線下)
  static atm(gvc: GVC, keyData: any) {
    keyData.payment_info_atm = keyData.payment_info_atm ?? {
      bank_account: '',
      bank_code: '',
      bank_name: '',
      bank_user: '',
    };

    const cashflow = {
      key: 'cashflow',
      title: '基本設定',
      html: (() => {
        const id = gvc.glitter.getUUID();
        const defText = html`<p>當日下單匯款，隔日出貨，後天到貨。</p>
          <p>若有需要統一編號 請提早告知</p>
          <p>------------------------------------------------------------------</p>
          <p>＊採臨櫃匯款者，電匯單上匯款人姓名與聯絡電話請務必填寫。</p> `;

        return gvc.bindView({
          bind: id,
          view: () => {
            return [
              html` <div class="row w-100">
                ${[
                  {
                    key: 'bank_code',
                    title: '銀行代號',
                  },
                  {
                    key: 'bank_name',
                    title: '銀行名稱',
                  },
                  {
                    key: 'bank_user',
                    title: '銀行戶名',
                  },
                  {
                    key: 'bank_account',
                    title: '銀行帳號',
                  },
                ]
                  .map(dd => {
                    return html` <div class="col-12 col-md-6 mb-2 pe-0 pe-md-2">
                      <div class="w-100 mb-1">
                        <span
                          style="color: #393939; font-size: 16px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word"
                          >${dd.title}</span
                        >
                        <span
                          style="color: #E80000; font-size: 16px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word"
                          >*</span
                        >
                      </div>
                      <input
                        class="form-control w-100"
                        placeholder="請輸入${dd.title}"
                        value="${keyData.payment_info_atm[dd.key]}"
                        onchange="${gvc.event(e => {
                          keyData.payment_info_atm[dd.key] = e.value;
                        })}"
                      />
                    </div>`;
                  })
                  .join('')}
              </div>`,
              html` <div class="my-2 px-1" style="display:flex;justify-content: space-between;">
                <div class="tx_normal">付款說明</div>
                ${BgWidget.blueNote(
                  '返回預設',
                  gvc.event(() => {
                    keyData.payment_info_atm.text = defText;
                    gvc.notifyDataChange(id);
                  })
                )}
              </div>`,
              BgWidget.richTextEditor({
                gvc: gvc,
                content: keyData.payment_info_atm?.text ?? '',
                callback: content => {
                  keyData.payment_info_atm!.text = content;
                  gvc.notifyDataChange(id);
                },
                title: '付款說明',
              }),
            ].join('');
          },
          divCreate: { class: 'guide2-5' },
        });
      })(),
    };

    const shipment = {
      key: 'shipment',
      title: '指定物流',
      html: gvc.bindView({
        bind: gvc.glitter.getUUID(),
        view: () => ShoppingFinanceSetting.setShipmentSupport(gvc, keyData.payment_info_atm),
      }),
    };

    const cartSetting = {
      key: 'cartSetting',
      title: '購物車設定',
      html: gvc.bindView({
        bind: gvc.glitter.getUUID(),
        view: () => ShoppingFinanceSetting.setCartSetting(gvc, keyData.payment_info_atm),
      }),
    };

    return this.tabView(gvc, [cashflow, shipment, cartSetting]);
  }

  // 彈窗: Line Pay (POS)
  static linePayScan(gvc: GVC, data: any) {
    const cashflow = {
      key: 'cashflow',
      title: '基本設定',
      html: html` ${[
        BgWidget.inlineCheckBox({
          title: '串接路徑',
          gvc: gvc,
          def: `${data.BETA}`,
          array: [
            {
              title: '正式站',
              value: `false`,
            },
            {
              title: '測試站',
              value: `true`,
            },
          ],
          callback: (text: any) => {
            data.BETA = text;
          },
        }),
        BgWidget.editeInput({
          gvc: gvc,
          title: 'CLIENT_ID',
          default: data.CLIENT_ID,
          callback: text => {
            data.CLIENT_ID = text;
          },
          placeHolder: '請輸入CLIENT_ID',
        }),
        BgWidget.editeInput({
          gvc: gvc,
          title: 'SECRET',
          default: data.SECRET,
          callback: text => {
            data.SECRET = text;
          },
          placeHolder: '請輸入SECRET',
        }),
      ].join('')}`,
    };

    const shipment = {
      key: 'shipment',
      title: '指定物流',
      html: gvc.bindView({
        bind: gvc.glitter.getUUID(),
        view: () => ShoppingFinanceSetting.setShipmentSupport(gvc, data),
      }),
    };

    const cartSetting = {
      key: 'cartSetting',
      title: '購物車設定',
      html: gvc.bindView({
        bind: gvc.glitter.getUUID(),
        view: () => ShoppingFinanceSetting.setCartSetting(gvc, data),
      }),
    };

    return this.tabView(gvc, [cashflow, shipment, cartSetting]);
  }

  // 彈窗: 聯合信用卡 (POS)
  static utCreditCard(gvc: GVC, data: any) {
    const cashflow = {
      key: 'cashflow',
      title: '基本設定',
      html: BgWidget.editeInput({
        gvc: gvc,
        title: '商家ID',
        default: data.pwd,
        callback: text => {
          data.pwd = text;
        },
        placeHolder: '請輸入商家ID',
      }),
    };

    const shipment = {
      key: 'shipment',
      title: '指定物流',
      html: gvc.bindView({
        bind: gvc.glitter.getUUID(),
        view: () => ShoppingFinanceSetting.setShipmentSupport(gvc, data),
      }),
    };

    const cartSetting = {
      key: 'cartSetting',
      title: '購物車設定',
      html: gvc.bindView({
        bind: gvc.glitter.getUUID(),
        view: () => ShoppingFinanceSetting.setCartSetting(gvc, data),
      }),
    };

    return this.tabView(gvc, [cashflow, shipment, cartSetting]);
  }

  // 彈窗: MyPay高鉅科技 (POS)
  static myPayPos(gvc: GVC, data: any) {
    const cashflow = {
      key: 'cashflow',
      title: '基本設定',
      html: BgWidget.editeInput({
        gvc: gvc,
        title: '刷卡機密碼',
        default: data.pwd,
        callback: text => {
          data.pwd = text;
        },
        placeHolder: '請輸入刷卡機密碼',
      }),
    };

    const shipment = {
      key: 'shipment',
      title: '指定物流',
      html: gvc.bindView({
        bind: gvc.glitter.getUUID(),
        view: () => ShoppingFinanceSetting.setShipmentSupport(gvc, data),
      }),
    };

    const cartSetting = {
      key: 'cartSetting',
      title: '購物車設定',
      html: gvc.bindView({
        bind: gvc.glitter.getUUID(),
        view: () => ShoppingFinanceSetting.setCartSetting(gvc, data),
      }),
    };

    return this.tabView(gvc, [cashflow, shipment, cartSetting]);
  }

  static customerText(gvc: GVC, keyData: any, id: string) {
    const fi_ = keyData.payment_info_custom.find((id_: string) => id_ === id);
    keyData[keyData.findIndex(fi_)] = {
      text: '',
      ...keyData[keyData.findIndex(fi_)],
    };
    return gvc.bindView(() => {
      const view_id = gvc.glitter.getUUID();
      return {
        bind: view_id,
        view: () => {
          return [
            html` <div class="d-flex justify-content-between mb-3">
              <div class="tx_normal">付款說明</div>
            </div>`,
            BgWidget.richTextEditor({
              gvc: gvc,
              content: fi_.text,
              callback: content => {
                fi_.text = content;
              },
              title: '付款說明',
            }),
          ].join('');
        },
      };
    });
  }

  static logistics_setting(gvc: GVC, widget: any) {
    const dialog = new ShareDialog(gvc.glitter);
    const saasConfig: {
      config: any;
      api: any;
    } = (window.parent as any).saasConfig;
    const vm: {
      id: string;
      loading: boolean;
      data: any;
      delivery: any;
      language: any;
      page: 'delivery_setting' | 'delivery_track' | 'delivery_note';
    } = {
      id: gvc.glitter.getUUID(),
      loading: true,
      data: {},
      delivery: {
        ec_pay: {
          Action: 'test',
          toggle: 'false',
          HASH_IV: '',
          HASH_KEY: '',
          SenderName: '',
          MERCHANT_ID: '',
          SenderCellPhone: '',
          SenderAddress: '',
        },
        pay_now: {
          Action: 'test',
          toggle: 'false',
          account: '',
          pwd: '',
        },
      },
      language: (window.parent as any).store_info.language_setting.def,
      page: 'delivery_setting',
    };
    saasConfig.api
      .getPrivateConfig(saasConfig.config.appName, 'logistics_setting')
      .then((r: { response: any; result: boolean }) => {
        if (r.response.result[0]) {
          vm.data = r.response.result[0].value;
        }
        vm.loading = false;
        if (!vm.data.language_data) {
          vm.data.language_data = {
            'en-US': { info: '' },
            'zh-CN': { info: '' },
            'zh-TW': { info: vm.data.info || '' },
          };
        }
        gvc.notifyDataChange(vm.id);
      });

    function save() {
      saasConfig.api.setPrivateConfig(saasConfig.config.appName, 'logistics_setting', vm.data);
    }

    return gvc.bindView(() => {
      return {
        bind: vm.id,
        view: () => {
          if (vm.loading) {
            return BgWidget.spinner();
          }
          vm.data.support = vm.data.support || [];
          const language_data = vm.data.language_data[vm.language];
          vm.data.info = vm.data.info || '';
          vm.data.form = vm.data.form || [];
          let view = [
            html`<div class="title-container">
              ${BgWidget.title('物流設定')}
              <div class="flex-fill"></div>
            </div>`,
            BgWidget.tab(
              [
                { title: '基本設定', key: 'delivery_setting' },
                { title: '物流追蹤', key: 'delivery_track' },
                { title: '物流群組', key: 'delivery_group' },
                { title: '配送備註', key: 'delivery_note' },
              ],
              gvc,
              vm.page,
              text => {
                vm.page = text as any;
                gvc.notifyDataChange(vm.id);
              },
              'margin-bottom:0px;'
            ),
          ];
          if (vm.page === 'delivery_setting') {
            view = view.concat([
              html`<div class="px-md-0 px-2">
                ${BgWidget.normalInsignia(
                  '設定支援的配送方式，供消費者於前臺自行選擇合適的物流，另外可於商品頁面設定特定商品支援的配送'
                )}
              </div>`,
              gvc.bindView(() => {
                const id = gvc.glitter.getUUID();

                function refresh() {
                  gvc.notifyDataChange(id);
                }

                //設定自訂物流
                function updateCustomShipment(obj: {
                  function: 'replace' | 'plus';
                  data?: {
                    name: string;
                    id: string;
                  };
                }) {
                  const custom_delivery: {
                    name: string;
                    id: string;
                  } = JSON.parse(
                    JSON.stringify(
                      obj.data || {
                        name: '',
                        id: gvc.glitter.getUUID(),
                      }
                    )
                  );
                  let form: any = undefined;
                  BgWidget.settingDialog({
                    gvc: gvc,
                    title: custom_delivery.name ? `「${custom_delivery.name}」自訂表單設定` : '新增自訂物流',
                    innerHTML: gvc => {
                      form = BgWidget.customForm(gvc, [
                        {
                          title: html` <div
                            class="tx_normal fw-bolder mt-2 d-flex flex-column"
                            style="margin-bottom: 12px;"
                          >
                            自訂物流表單
                            <span style="color:#8D8D8D;font-size: 12px;">當客戶選擇此物流時所需填寫的額外資料</span>
                          </div>`,
                          key: `form_delivery_${custom_delivery.id}`,
                          no_padding: true,
                        },
                      ]);
                      return gvc.bindView(
                        (() => {
                          const id = gvc.glitter.getUUID();
                          (custom_delivery as any).system_form = (custom_delivery as any).system_form ?? [];
                          return {
                            bind: id,
                            view: () => {
                              return [
                                BgWidget.editeInput({
                                  gvc: gvc,
                                  title: '自訂物流名稱',
                                  default: custom_delivery.name,
                                  callback: text => {
                                    custom_delivery.name = text;
                                  },
                                  placeHolder: '請輸入自訂物流名稱',
                                  global_language: true,
                                }),
                                html`<div
                                  class="tx_normal fw-bolder mt-2 d-flex flex-column"
                                  style="margin-bottom: 12px;"
                                >
                                  預設系統對應表單
                                  <span style="color:#8D8D8D;font-size: 12px;"
                                    >此為預設系統表單，將對應系統特定欄位</span
                                  >
                                  ${BgWidget.inlineCheckBox({
                                    title: '',
                                    gvc,
                                    def: (custom_delivery as any).system_form,
                                    array: [
                                      { title: '國際縣市地址選擇', value: 'global-address-selector' },
                                      { title: '台灣縣市地址選擇', value: 'tw-address-selector' },
                                    ],
                                    callback: (array: any) => {
                                      (custom_delivery as any).system_form = array;
                                    },
                                    type: 'multiple',
                                  })}
                                </div>`,
                                html`<div class="w-100 border-top"></div>`,
                                form.view,
                              ].join(BgWidget.mbContainer(12));
                            },
                          };
                        })()
                      );
                    },
                    footer_html: gvc => {
                      let array = [
                        BgWidget.save(
                          gvc.event(() => {
                            return new Promise<boolean>(async () => {
                              if (!custom_delivery.name) {
                                dialog.errorMessage({ text: `請輸入物流名稱` });
                                return;
                              }
                              vm.data.custom_delivery = vm.data.custom_delivery ?? [];
                              if (obj.function === 'plus') {
                                vm.data.custom_delivery.push(custom_delivery);
                              } else {
                                vm.data.custom_delivery[
                                  vm.data.custom_delivery.findIndex((d1: any) => {
                                    return d1.id === custom_delivery.id;
                                  })
                                ] = custom_delivery;
                              }

                              dialog.dataLoading({ visible: true });
                              await form.save();
                              await saasConfig.api.setPrivateConfig(
                                saasConfig.config.appName,
                                'logistics_setting',
                                vm.data
                              );
                              dialog.dataLoading({ visible: false });
                              dialog.successMessage({ text: '設定成功' });
                              gvc.closeDialog();
                              refresh();
                            });
                          })
                        ),
                      ];
                      if (obj.function === 'replace') {
                        array = [
                          BgWidget.danger(
                            gvc.event(() => {
                              dialog.checkYesOrNot({
                                text: '是否確認刪除?',
                                callback: async response => {
                                  if (response) {
                                    vm.data.custom_delivery = vm.data.custom_delivery.filter((d1: any) => {
                                      return obj.data!.id !== d1.id;
                                    });
                                    dialog.dataLoading({ visible: true });
                                    await saasConfig.api.setPrivateConfig(
                                      saasConfig.config.appName,
                                      'logistics_setting',
                                      vm.data
                                    );
                                    dialog.dataLoading({ visible: false });
                                    refresh();
                                    gvc.closeDialog();
                                  }
                                },
                              });
                            })
                          ),
                        ].concat(array);
                      }
                      return array.join('');
                    },
                  });
                }

                return {
                  bind: id,
                  view: () => {
                    return ShipmentConfig.list
                      .concat(
                        (vm.data.custom_delivery ?? []).map((dd: any) => {
                          return {
                            title: Language.getLanguageCustomText(dd.name),
                            value: dd.id,
                            custom: true,
                            type: 'font_awesome',
                            src: html`<i class="fa-regular fa-puzzle-piece-simple fs-4"></i>`,
                          };
                        })
                      )
                      .map(dd => {
                        return html`
                          <div class="col-12 col-lg-4 col-md-6 p-0 p-md-2">
                            <div
                              class="w-100 position-relative main-card"
                              style="padding: 24px; background: white; overflow: hidden; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 18px; display: inline-flex;"
                            >
                              <div
                                style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 28px; display: inline-flex;"
                              >
                                <div style="min-width: 46px;max-width: 46px;">
                                  ${dd.type === 'font_awesome' ? dd.src : html` <img src="${dd.src}" />`}
                                </div>
                                <div
                                  style="flex-direction: column; justify-content: center; align-items: flex-start; gap: 4px; display: inline-flex"
                                >
                                  <div class="tx_normal">${dd.title}</div>
                                  <div class="d-flex align-items-center" style="gap:4px;">
                                    <div class="tx_normal">
                                      ${vm.data.support.find((d1: any) => dd.value === d1) ? `開啟` : `關閉`}
                                    </div>
                                    <div class="cursor_pointer form-check form-switch" style="margin-top: 10px;">
                                      <input
                                        class="form-check-input"
                                        type="checkbox"
                                        onchange="${gvc.event(() => {
                                          if (
                                            vm.data.support.find((d1: any) => {
                                              return dd.value === d1;
                                            })
                                          ) {
                                            vm.data.support = vm.data.support.filter((d1: any) => {
                                              return dd.value !== d1;
                                            });
                                          } else {
                                            vm.data.support.push(dd.value);
                                          }
                                          save();
                                          gvc.notifyDataChange(id);
                                        })}"
                                        ${vm.data.support.find((d1: any) => {
                                          return dd.value === d1;
                                        })
                                          ? `checked`
                                          : ''}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="w-100 border-top pt-3 mt-n2">
                                ${(() => {
                                  let button_action: string[] = [
                                    BgWidget.customButton({
                                      button: {
                                        color: 'gray',
                                        size: 'sm',
                                      },
                                      text: {
                                        name: html`<i class="fa-regular fa-gear me-1"></i>配送`,
                                      },
                                      event: gvc.event(async () => {
                                        const log_config = (
                                          await ApiUser.getPublicConfig(
                                            'shipment_config_' + dd.value,
                                            'manager',
                                            saasConfig.config.appName
                                          )
                                        ).response.value;
                                        BgWidget.settingDialog({
                                          gvc: gvc,
                                          title: `「${dd.title}」配送設定`,
                                          innerHTML: gvc => {
                                            const view: string[] = [];
                                            if (
                                              ['UNIMARTC2C', 'UNIMARTFREEZE', 'FAMIC2C', 'FAMIC2CFREEZE'].includes(
                                                dd.value
                                              )
                                            ) {
                                              view.push(
                                                html`<div class="d-flex flex-column w-100">
                                                  ${[
                                                    html`<div
                                                      style="flex-direction: column; justify-content: center; align-items: flex-start; gap: 4px; display: inline-flex"
                                                    >
                                                      <div class="tx_normal">大宗配送</div>
                                                      <div class="d-flex align-items-center" style="gap:4px;">
                                                        <div class="tx_normal">
                                                          ${log_config.bulk ? `開啟` : `關閉`}
                                                        </div>
                                                        <div
                                                          class="cursor_pointer form-check form-switch"
                                                          style="margin-top: 10px;"
                                                        >
                                                          <input
                                                            class="form-check-input"
                                                            type="checkbox"
                                                            onchange="${gvc.event(() => {
                                                              log_config.bulk = !log_config.bulk;
                                                              gvc.recreateView();
                                                            })}"
                                                            ${log_config.bulk ? `checked` : ''}
                                                          />
                                                        </div>
                                                      </div>
                                                    </div> `,
                                                  ].join('')}
                                                </div>`
                                              );
                                            }
                                            view.push(
                                              html` <div class="d-flex flex-column" style="gap:5px;">
                                                ${[
                                                  html`<div class="tx_normal">物流配送說明</div>`,
                                                  BgWidget.richTextEditor({
                                                    gvc: gvc,
                                                    content: log_config.content ?? '',
                                                    callback: data => {
                                                      log_config.content = data;
                                                    },
                                                    title: '物流配送說明',
                                                  }),
                                                ].join('')}
                                              </div>`
                                            );
                                            return html`<div class="w-100 d-flex flex-column" style="gap:5px;">
                                              ${view.join(html`<div class="w-100 border-bottom my-2"></div>`)}
                                            </div>`;
                                          },
                                          footer_html: gvc => {
                                            let array = [
                                              BgWidget.cancel(
                                                gvc.event(() => {
                                                  gvc.closeDialog();
                                                })
                                              ),
                                              BgWidget.save(
                                                gvc.event(() => {
                                                  dialog.dataLoading({ visible: true });
                                                  ApiUser.setPublicConfig({
                                                    user_id: 'manager',
                                                    key: 'shipment_config_' + dd.value,
                                                    value: log_config,
                                                  }).then(() => {
                                                    dialog.dataLoading({ visible: false });
                                                    dialog.successMessage({ text: '設定成功' });
                                                    gvc.closeDialog();
                                                  });
                                                })
                                              ),
                                            ];
                                            return array.join('');
                                          },
                                        });
                                      }),
                                    }),
                                    BgWidget.customButton({
                                      button: {
                                        color: 'gray',
                                        size: 'sm',
                                      },
                                      text: {
                                        name: html`<i class="fa-regular fa-gear me-1"></i>購物車`,
                                      },
                                      event: gvc.event(async () => {
                                        const vm = {
                                          id: gvc.glitter.getUUID(),
                                          loading: true,
                                          config: {},
                                        };

                                        BgWidget.settingDialog({
                                          gvc: gvc,
                                          title: `「${dd.title}」購物車設定`,
                                          innerHTML: gvc => {
                                            return gvc.bindView({
                                              bind: id,
                                              view: () => {
                                                if (vm.loading) {
                                                  return BgWidget.spinner();
                                                } else {
                                                  return ShoppingFinanceSetting.setCartSetting(
                                                    gvc,
                                                    vm.config,
                                                    'shipment'
                                                  );
                                                }
                                              },
                                              onCreate: async () => {
                                                if (vm.loading) {
                                                  const r = await ApiUser.getPublicConfig(
                                                    'shipment_config_' + dd.value,
                                                    'manager',
                                                    saasConfig.config.appName
                                                  );
                                                  vm.config = r.response.value;
                                                  vm.loading = false;
                                                  gvc.notifyDataChange(id);
                                                }
                                              },
                                            });
                                          },
                                          footer_html: gvc => {
                                            return [
                                              BgWidget.cancel(
                                                gvc.event(() => {
                                                  gvc.closeDialog();
                                                })
                                              ),
                                              BgWidget.save(
                                                gvc.event(() => {
                                                  dialog.dataLoading({ visible: true });
                                                  ApiUser.setPublicConfig({
                                                    user_id: 'manager',
                                                    key: 'shipment_config_' + dd.value,
                                                    value: vm.config,
                                                  }).then(() => {
                                                    dialog.dataLoading({ visible: false });
                                                    dialog.successMessage({ text: '設定成功' });
                                                    gvc.closeDialog();
                                                  });
                                                })
                                              ),
                                            ].join('');
                                          },
                                        });
                                      }),
                                    }),
                                  ];

                                  const shipment_fee = () => {
                                    return BgWidget.customButton({
                                      button: {
                                        color: 'gray',
                                        size: 'sm',
                                      },
                                      text: {
                                        name: html`<i class="fa-regular fa-gear me-1"></i>運費`,
                                      },
                                      event: gvc.event(() => {
                                        const vm = {
                                          gvc: gvc,
                                          key: dd.value,
                                          save_event: () => {
                                            return new Promise(resolve => resolve(true));
                                          },
                                        };
                                        BgWidget.settingDialog({
                                          gvc: gvc,
                                          width: 1200,
                                          height: document.body.clientHeight - 100,
                                          title: `「${dd.title}」運費設定`,
                                          d_main_style:
                                            document.body.clientWidth < 768 ? 'padding:0px !important;' : '',
                                          innerHTML: (gvc: GVC) => {
                                            vm.gvc = gvc;
                                            return ShoppingShipmentSetting.main(vm);
                                          },
                                          footer_html: gvc => {
                                            return [
                                              BgWidget.cancel(
                                                gvc.event(() => {
                                                  gvc.closeDialog();
                                                })
                                              ),
                                              BgWidget.save(
                                                gvc.event(() => {
                                                  vm.save_event().then(() => {});
                                                })
                                              ),
                                            ].join('');
                                          },
                                        });
                                      }),
                                    });
                                  };

                                  if ((dd as any).custom) {
                                    button_action = button_action.concat([
                                      shipment_fee(),
                                      BgWidget.customButton({
                                        button: {
                                          color: 'gray',
                                          size: 'sm',
                                        },
                                        text: {
                                          name: html`<i class="fa-regular fa-gear me-1"></i>自訂表單`,
                                        },
                                        event: gvc.event(() => {
                                          updateCustomShipment({
                                            function: 'replace',
                                            data: vm.data.custom_delivery.find((d1: any) => dd.value === d1.id),
                                          });
                                        }),
                                      }),
                                    ]);
                                    return html`
                                      <div class="d-flex flex-wrap justify-content-end gap-1 cursor_pointer">
                                        <div class="flex-fill"></div>
                                        ${button_action.join('')}
                                      </div>
                                    `;
                                  } else {
                                    button_action = button_action.concat([shipment_fee()]);
                                    return html` <div class="d-flex flex-wrap justify-content-end gap-1 cursor_pointer">
                                      <div class="flex-fill"></div>
                                      ${button_action.join('')}
                                    </div>`;
                                  }
                                })()}
                              </div>
                            </div>
                          </div>
                          ${document.body.clientWidth > 768 ? '' : BgWidget.mbContainer(8)}
                        `;
                      })
                      .concat([
                        html` <div
                          class="col-12 col-lg-4 col-md-6 p-0 p-md-2"
                          style="cursor: pointer;"
                          onclick="${gvc.event(() => {
                            updateCustomShipment({ function: 'plus' });
                          })}"
                        >
                          <div
                            class="w-100 main-card"
                            style="min-height:173.59px;padding: 24px; background: white; overflow: hidden; flex-direction: column; justify-content: center; align-items: center; gap: 18px; display: inline-flex"
                          >
                            <div
                              class="fw-bold"
                              style="align-self: stretch; justify-content: center; align-items: center; gap: 14px; display: inline-flex;color:#4D86DB;"
                            >
                              <i class="fa-regular fa-circle-plus fs-5"></i>
                              <div class="fs-5">新增自訂物流</div>
                            </div>
                          </div>
                        </div>`,
                      ])
                      .join('');
                  },
                  divCreate: {
                    class: 'row guide3-3 mt-3 px-1 mx-0',
                  },
                };
              }),
            ]);
          } else if (vm.page === 'delivery_note') {
            view.push(
              [
                html` <div class="px-md-0 px-2">
                  ${BgWidget.normalInsignia('於結帳頁面中顯示，告知顧客配送所需要注意的事項')}
                </div>`,
                BgWidget.mainCard(
                  [
                    html` <div class="title-container px-0">
                      <div class="d-flex align-items-center gap-1">
                        <div class="tx_700">配送說明</div>
                        ${BgWidget.languageInsignia(vm.language, 'margin-left:5px;')}
                      </div>
                      <div class="flex-fill"></div>
                      ${LanguageBackend.switchBtn({
                        gvc: gvc,
                        language: vm.language,
                        callback: language => {
                          vm.language = language;
                          gvc.notifyDataChange(vm.id);
                        },
                      })}
                    </div>`,
                    ,
                    BgWidget.mbContainer(18),
                    html` <div class="guide3-4">
                      ${gvc.bindView(
                        (() => {
                          const id = gvc.glitter.getUUID();
                          return {
                            bind: id,
                            view: () => {
                              return html` <div
                                class="d-flex justify-content-between align-items-center gap-3 mb-1"
                                style="cursor: pointer;"
                                onclick="${gvc.event(() => {
                                  const originContent = `${language_data.info}`;
                                  BgWidget.fullDialog({
                                    gvc: gvc,
                                    title: gvc2 => {
                                      return html`<div class="d-flex align-items-center" style="gap:10px;">
                                        ${'配送資訊' +
                                        BgWidget.aiChatButton({
                                          gvc: gvc2,
                                          select: 'writer',
                                          click: () => {
                                            ProductAi.generateRichText(gvc, text => {
                                              language_data.info += text;
                                              gvc.notifyDataChange(vm.id);
                                              gvc2.recreateView();
                                            });
                                          },
                                        })}
                                      </div>`;
                                    },
                                    innerHTML: gvc2 => {
                                      return html` <div>
                                        ${EditorElem.richText({
                                          gvc: gvc2,
                                          def: language_data.info,
                                          setHeight: '100vh',
                                          hiddenBorder: true,
                                          insertImageEvent: editor => {
                                            const mark = `{{${Tool.randomString(8)}}}`;
                                            editor.selection.setAtEnd(editor.$el.get(0));
                                            editor.html.insert(mark);
                                            editor.undo.saveStep();
                                            imageLibrary.selectImageLibrary(
                                              gvc,
                                              urlArray => {
                                                if (urlArray.length > 0) {
                                                  const imgHTML = urlArray
                                                    .map(url => {
                                                      return html` <img src="${url.data}" />`;
                                                    })
                                                    .join('');
                                                  editor.html.set(
                                                    editor.html
                                                      .get(0)
                                                      .replace(
                                                        mark,
                                                        html` <div class="d-flex flex-column">${imgHTML}</div>`
                                                      )
                                                  );
                                                  editor.undo.saveStep();
                                                } else {
                                                  dialog.errorMessage({ text: '請選擇至少一張圖片' });
                                                }
                                              },
                                              html` <div
                                                class="d-flex flex-column"
                                                style="border-radius: 10px 10px 0px 0px;background: #F2F2F2;"
                                              >
                                                圖片庫
                                              </div>`,
                                              {
                                                mul: true,
                                                cancelEvent: () => {
                                                  editor.html.set(editor.html.get(0).replace(mark, ''));
                                                  editor.undo.saveStep();
                                                },
                                              }
                                            );
                                          },
                                          callback: text => {
                                            language_data.info = text;
                                          },
                                          rich_height: `calc(${(window.parent as any).innerHeight}px - 70px - 58px - 49px - 64px - 40px + ${
                                            document.body.clientWidth < 800 ? `70` : `0`
                                          }px)`,
                                        })}
                                      </div>`;
                                    },
                                    footer_html: (gvc2: GVC) => {
                                      return [
                                        BgWidget.cancel(
                                          gvc2.event(() => {
                                            language_data.info = originContent;
                                            gvc2.closeDialog();
                                          })
                                        ),
                                        BgWidget.save(
                                          gvc2.event(() => {
                                            gvc2.closeDialog();
                                            gvc.notifyDataChange(id);
                                            save();
                                          })
                                        ),
                                      ].join('');
                                    },
                                    closeCallback: () => {
                                      language_data.info = originContent;
                                    },
                                  });
                                })}"
                              >
                                ${(() => {
                                  const text = gvc.glitter.utText.removeTag(language_data.info);
                                  return BgWidget.richTextView(Tool.truncateString(text, 100));
                                })()}
                              </div>`;
                            },
                          };
                        })()
                      )}
                    </div>`,
                  ].join('')
                ),
              ].join(BgWidget.mbContainer(24))
            );
          } else if (vm.page === 'delivery_track') {
            view = view.concat([
              html` <div class="px-md-0 px-2">
                ${BgWidget.normalInsignia('透過設定物流追蹤，可直接列印托運單進行出貨，並自動追蹤貨態')}
              </div>`,
              gvc.bindView(() => {
                const id = gvc.glitter.getUUID();

                ApiPageConfig.getPrivateConfig((window.parent as any).appName, 'glitter_delivery').then(res => {
                  vm.delivery = (() => {
                    try {
                      return res.response.result[0].value;
                    } catch (error) {
                      return vm.delivery;
                    }
                  })();
                  gvc.notifyDataChange(id);
                });

                async function saveDelivery() {
                  await ApiPageConfig.setPrivateConfigV2({
                    key: 'glitter_delivery',
                    value: JSON.stringify(vm.delivery),
                    appName: saasConfig.config.appName,
                  });
                }

                return {
                  bind: id,
                  view: () => {
                    return [
                      // {
                      //   title: html`<div class="d-flex flex-column">
                      //     綠界物流追蹤 ${BgWidget.greenNote('支援四大超商/黑貓/中華郵政')}
                      //   </div>`,
                      //   value: 'ec_pay',
                      //   src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/52415944_122858408.428215.png',
                      // },
                      {
                        title: html`<div class="d-flex flex-column">
                          PayNow物流追蹤 ${BgWidget.greenNote('支援四大超商/黑貓')}
                        </div>`,
                        value: 'pay_now',
                        src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/download.png',
                      },
                    ]
                      .map(dd => {
                        return html`
                          <div class="col-12 col-lg-3 col-md-4 p-0 p-md-2">
                            <div
                              class="w-100 position-relative main-card"
                              style="padding: 24px 32px; background: white; overflow: hidden; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 18px; display: inline-flex;"
                            >
                              ${(() => {
                                return html` <div
                                  class="position-absolute fw-500"
                                  style="cursor:pointer;right:15px;top:15px;"
                                >
                                  ${BgWidget.customButton({
                                    button: {
                                      color: 'gray',
                                      size: 'sm',
                                    },
                                    text: {
                                      name: `串接設定`,
                                    },
                                    event: gvc.event(() => {
                                      if (dd.value === 'ec_pay') {
                                        BgWidget.dialog({
                                          gvc: gvc,
                                          title: '物流追蹤設定',
                                          innerHTML: (gvc: GVC) => {
                                            return gvc.bindView(
                                              (() => {
                                                const id = gvc.glitter.getUUID();
                                                return {
                                                  bind: id,
                                                  view: () => {
                                                    return [
                                                      ...(() => {
                                                        let array: any = [
                                                          BgWidget.inlineCheckBox({
                                                            title: '串接路徑',
                                                            gvc: gvc,
                                                            def: vm.delivery[dd.value].Action ?? 'test',
                                                            array: [
                                                              {
                                                                title: '正式站',
                                                                value: 'main',
                                                              },
                                                              {
                                                                title: '測試站',
                                                                value: 'test',
                                                              },
                                                            ],
                                                            callback: (text: any) => {
                                                              vm.delivery[dd.value].Action = text;
                                                            },
                                                            type: 'single',
                                                          }),
                                                          BgWidget.editeInput({
                                                            gvc: gvc,
                                                            title: '寄件人名稱',
                                                            default: vm.delivery[dd.value].SenderName ?? '',
                                                            callback: text => {
                                                              vm.delivery[dd.value].SenderName = text;
                                                            },
                                                            placeHolder: '請輸入寄件人名稱 / 您的商家名稱',
                                                          }),
                                                          BgWidget.editeInput({
                                                            gvc: gvc,
                                                            title: '寄件人手機',
                                                            default: vm.delivery[dd.value].SenderCellPhone ?? '',
                                                            callback: text => {
                                                              vm.delivery[dd.value].SenderCellPhone = text;
                                                            },
                                                            placeHolder: '請輸入寄件人手機 / 您的手機',
                                                          }),
                                                          BgWidget.editeInput({
                                                            gvc: gvc,
                                                            title: '寄件人地址',
                                                            default: vm.delivery[dd.value].SenderAddress ?? '',
                                                            callback: text => {
                                                              vm.delivery[dd.value].SenderAddress = text;
                                                            },
                                                            placeHolder: '請輸入寄件人地址 / 商家地址',
                                                          }),
                                                          BgWidget.editeInput({
                                                            gvc: gvc,
                                                            title: '特店編號',
                                                            default: vm.delivery[dd.value].MERCHANT_ID ?? '',
                                                            callback: text => {
                                                              vm.delivery[dd.value].MERCHANT_ID = text;
                                                            },
                                                            placeHolder: '請輸入特店編號',
                                                          }),
                                                          BgWidget.editeInput({
                                                            gvc: gvc,
                                                            title: 'HASH KEY',
                                                            default: vm.delivery[dd.value].HASH_KEY ?? '',
                                                            callback: text => {
                                                              vm.delivery[dd.value].HASH_KEY = text;
                                                            },
                                                            placeHolder: '請輸入 HASH KEY',
                                                          }),
                                                          BgWidget.editeInput({
                                                            gvc: gvc,
                                                            title: 'HASH IV',
                                                            default: vm.delivery[dd.value].HASH_IV ?? '',
                                                            callback: text => {
                                                              vm.delivery[dd.value].HASH_IV = text;
                                                            },
                                                            placeHolder: '請輸入 HASH IV',
                                                          }),
                                                        ];
                                                        return array;
                                                      })(),
                                                    ].join(BgWidget.mbContainer(12));
                                                  },
                                                };
                                              })()
                                            );
                                          },
                                          save: {
                                            text: '儲存',
                                            event: () => {
                                              return new Promise<boolean>(resolve => {
                                                function checkSenderPattern(input: string) {
                                                  const senderPattern = /^[\u4e00-\u9fa5]{2,5}|[a-zA-Z]{4,10}$/;
                                                  return senderPattern.test(input);
                                                }

                                                function checkPhonePattern(input: string) {
                                                  const phonePattern = /^09\d{8}$/;
                                                  return phonePattern.test(input);
                                                }

                                                function checkAddressPattern(input: any) {
                                                  const addressPattern = /^.{6,60}$/;
                                                  return addressPattern.test(input);
                                                }

                                                if (
                                                  CheckInput.isEmpty(vm.delivery[dd.value].SenderName) ||
                                                  !checkSenderPattern(vm.delivery[dd.value].SenderName)
                                                ) {
                                                  dialog.infoMessage({
                                                    text: html` <div class="text-center">
                                                      寄件人名稱請設定最多10字元<br />（中文5個字, 英文10個字,<br />不得含指定特殊符號）
                                                    </div>`,
                                                  });
                                                  resolve(false);
                                                  return;
                                                }

                                                if (
                                                  CheckInput.isEmpty(vm.delivery[dd.value].SenderCellPhone) ||
                                                  !checkPhonePattern(vm.delivery[dd.value].SenderCellPhone)
                                                ) {
                                                  dialog.infoMessage({ text: '寄件人手機應為09開頭的手機格式' });
                                                  resolve(false);
                                                  return;
                                                }

                                                if (
                                                  !vm.delivery[dd.value].SenderAddress ||
                                                  !checkAddressPattern(vm.delivery[dd.value].SenderAddress)
                                                ) {
                                                  dialog.infoMessage({
                                                    text: html` <div class="text-center">
                                                      請輸入正確的寄件人地址<br />（中文6~60個字）
                                                    </div>`,
                                                  });
                                                  resolve(false);
                                                  return;
                                                }

                                                ApiPageConfig.setPrivateConfigV2({
                                                  key: 'glitter_delivery',
                                                  value: JSON.stringify(vm.delivery),
                                                  appName: saasConfig.config.appName,
                                                }).then((r: { response: any; result: boolean }) => {
                                                  dialog.dataLoading({ visible: false });
                                                  if (r.response) {
                                                    dialog.successMessage({ text: '設定成功' });
                                                  } else {
                                                    dialog.errorMessage({ text: '設定失敗' });
                                                  }
                                                  resolve(true);
                                                });
                                              });
                                            },
                                          },
                                          cancel: {},
                                        });
                                      } else if (dd.value === 'pay_now') {
                                        BgWidget.dialog({
                                          gvc: gvc,
                                          title: '物流追蹤設定',
                                          innerHTML: (gvc: GVC) => {
                                            return gvc.bindView(
                                              (() => {
                                                const id = gvc.glitter.getUUID();
                                                return {
                                                  bind: id,
                                                  view: () => {
                                                    return [
                                                      BgWidget.openBoxContainer({
                                                        gvc,
                                                        tag: 'delivery_alert_info',
                                                        title: '注意事項',
                                                        insideHTML: html` <div
                                                          class="mt-2"
                                                          style="white-space: normal;"
                                                        >
                                                          ${BgWidget.alertInfo('', [
                                                            '1. 支援四大超商（7-ELEVEN、全家、萊爾富、OK超商）與黑貓',
                                                            '2. 寄件人名稱請設定最多10字元（中文5個字, 英文10個字, 不得含指定特殊符號）',
                                                            '3. 寄件人手機應為09開頭的格式',
                                                          ])}
                                                        </div>`,
                                                        height: document.body.clientWidth > 768 ? 300 : 385,
                                                      }),
                                                      ...(() => {
                                                        let array: any = [
                                                          BgWidget.inlineCheckBox({
                                                            title: '串接路徑',
                                                            gvc: gvc,
                                                            def: vm.delivery[dd.value].Action ?? 'test',
                                                            array: [
                                                              {
                                                                title: '正式站',
                                                                value: 'main',
                                                              },
                                                              {
                                                                title: '測試站',
                                                                value: 'test',
                                                              },
                                                            ],
                                                            callback: (text: any) => {
                                                              vm.delivery[dd.value].Action = text;
                                                            },
                                                            type: 'single',
                                                          }),
                                                          html` <div
                                                            onclick="${gvc.event(() => {
                                                              (window.parent as any).navigator.clipboard.writeText(
                                                                (window.parent as any).saasConfig.config.url +
                                                                  `/api-public/v1/delivery/notify?g-app=${(window.parent as any).appName}`
                                                              );
                                                              dialog.successMessage({ text: '已複製至剪貼簿' });
                                                            })}"
                                                          >
                                                            ${BgWidget.editeInput({
                                                              readonly: true,
                                                              gvc: gvc,
                                                              title: html` <div
                                                                class="d-flex flex-column"
                                                                style="gap:5px;"
                                                              >
                                                                物流追蹤通知
                                                                ${BgWidget.grayNote(
                                                                  '點擊複製此連結至PAYNOW後台的貨態回傳網址'
                                                                )}
                                                              </div>`,
                                                              default:
                                                                (window.parent as any).saasConfig.config.url +
                                                                `/api-public/v1/delivery/notify?g-app=${(window.parent as any).appName}`,
                                                              placeHolder: '',
                                                              callback: text => {},
                                                            })}
                                                          </div>`,
                                                          BgWidget.editeInput({
                                                            gvc: gvc,
                                                            title: '串接帳號',
                                                            default: vm.delivery[dd.value].account ?? '',
                                                            callback: text => {
                                                              vm.delivery[dd.value].account = text;
                                                            },
                                                            placeHolder: '請輸入串接帳號',
                                                          }),
                                                          BgWidget.editeInput({
                                                            gvc: gvc,
                                                            title: '串接密碼',
                                                            default: vm.delivery[dd.value].pwd ?? '',
                                                            callback: text => {
                                                              vm.delivery[dd.value].pwd = text;
                                                            },
                                                            placeHolder: '請輸入串接密碼',
                                                          }),
                                                          BgWidget.editeInput({
                                                            gvc: gvc,
                                                            title: '寄件人名稱',
                                                            default: vm.delivery[dd.value].SenderName ?? '',
                                                            callback: text => {
                                                              vm.delivery[dd.value].SenderName = text;
                                                            },
                                                            placeHolder: '請輸入寄件人名稱 / 您的商家名稱',
                                                          }),
                                                          BgWidget.editeInput({
                                                            gvc: gvc,
                                                            title: '寄件人手機',
                                                            default: vm.delivery[dd.value].SenderCellPhone ?? '',
                                                            callback: text => {
                                                              vm.delivery[dd.value].SenderCellPhone = text;
                                                            },
                                                            placeHolder: '請輸入寄件人手機 / 您的手機',
                                                          }),
                                                          BgWidget.editeInput({
                                                            gvc: gvc,
                                                            title: '寄件人地址',
                                                            default: vm.delivery[dd.value].SenderAddress ?? '',
                                                            callback: text => {
                                                              vm.delivery[dd.value].SenderAddress = text;
                                                            },
                                                            placeHolder: '請輸入寄件人地址 / 商家地址',
                                                          }),
                                                          BgWidget.editeInput({
                                                            gvc: gvc,
                                                            title: '寄件人信箱',
                                                            default: vm.delivery[dd.value].SenderEmail ?? '',
                                                            callback: text => {
                                                              vm.delivery[dd.value].SenderEmail = text;
                                                            },
                                                            placeHolder: '請輸入寄件人信箱',
                                                          }),
                                                        ];
                                                        return array;
                                                      })(),
                                                    ].join(BgWidget.mbContainer(12));
                                                  },
                                                };
                                              })()
                                            );
                                          },
                                          save: {
                                            text: '儲存',
                                            event: () => {
                                              return new Promise<boolean>(resolve => {
                                                ApiPageConfig.setPrivateConfigV2({
                                                  key: 'glitter_delivery',
                                                  value: JSON.stringify(vm.delivery),
                                                  appName: saasConfig.config.appName,
                                                }).then((r: { response: any; result: boolean }) => {
                                                  dialog.dataLoading({ visible: false });
                                                  if (r.response) {
                                                    dialog.successMessage({ text: '設定成功' });
                                                  } else {
                                                    dialog.errorMessage({ text: '設定失敗' });
                                                  }
                                                  resolve(true);
                                                });
                                              });
                                            },
                                          },
                                          cancel: {},
                                        });
                                      }
                                    }),
                                  })}
                                </div>`;
                              })()}
                              <div
                                style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 28px; display: inline-flex"
                              >
                                <div style="min-width: 46px;max-width: 46px;">
                                  <img src="${dd.src}" />
                                </div>
                                <div
                                  style="flex-direction: column; justify-content: center; align-items: flex-start; gap: 4px; display: inline-flex"
                                >
                                  <div class="tx_normal">${dd.title}</div>
                                  <div class="d-flex align-items-center" style="gap:4px;">
                                    <div class="tx_normal">${vm.delivery[dd.value].toggle ? `開啟` : `關閉`}</div>
                                    <div class="cursor_pointer form-check form-switch" style="margin-top: 10px;">
                                      <input
                                        class="form-check-input"
                                        type="checkbox"
                                        onchange="${gvc.event((e, event) => {
                                          vm.delivery[dd.value].toggle = !vm.delivery[dd.value].toggle;
                                          saveDelivery();
                                          gvc.notifyDataChange(id);
                                        })}"
                                        ${vm.delivery[dd.value].toggle ? `checked` : ''}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          ${document.body.clientWidth > 768 ? '' : BgWidget.mbContainer(8)}
                        `;
                      })
                      .join('');
                  },
                  divCreate: {
                    class: 'row guide3-3 mt-3 px-1',
                  },
                };
              }),
            ]);
          } else if (vm.page === 'delivery_group') {
            const dvm = {
              id: gvc.glitter.getUUID(),
              loading: true,
              dataList: [] as ShipmentGroupData[],
            };

            function updateGroup(dialogGVC: GVC) {
              dialog.dataLoading({ visible: true });
              setTimeout(() => {
                ApiUser.setPublicConfig({
                  user_id: 'manager',
                  key: 'logistics_group',
                  value: dvm.dataList,
                }).then(() => {
                  dialog.dataLoading({ visible: false });
                  dialog.successMessage({ text: '設定成功' });
                  dialogGVC.closeDialog();

                  dvm.loading = true;
                  gvc.notifyDataChange(dvm.id);
                });
              }, 100);
            }

            function deleteProductLogisticGroup(group: string | undefined, callback: () => void) {
              if (group) {
                ApiShop.deleteProductLogistic({ group }).then(() => callback());
              }
            }

            function editGroupDialog(item?: ShipmentGroupData) {
              const cloneData = structuredClone(item);
              const postData = item
                ? structuredClone(item)
                : {
                    key: Tool.randomString(8),
                    name: '',
                    list: [],
                  };

              return BgWidget.settingDialog({
                gvc,
                title: '設定群組',
                innerHTML: iGVC => {
                  const id = iGVC.glitter.getUUID();
                  let loading = true;
                  let dataList: any = [];

                  return iGVC.bindView({
                    bind: id,
                    view: () => {
                      if (loading) {
                        return BgWidget.spinner();
                      }
                      return [
                        html`<div class="tx_700">群組名稱</div>`,
                        BgWidget.editeInput({
                          gvc: iGVC,
                          title: '',
                          default: postData.name,
                          placeHolder: '請輸入群組名稱',
                          callback: value => {
                            postData.name = value;
                          },
                        }),
                        html`<div class="tx_700">包含的物流</div>`,
                        BgWidget.multiCheckboxContainer(
                          iGVC,
                          dataList,
                          postData.list,
                          text => {
                            postData.list = text;
                          },
                          { single: false }
                        ),
                      ].join(BgWidget.mbContainer(12));
                    },
                    onCreate: () => {
                      if (loading) {
                        ApiPageConfig.getPrivateConfig((window.parent as any).appName, 'logistics_setting').then(
                          (dd: any) => {
                            if (dd.result && dd.response.result[0]) {
                              const shipment_setting = dd.response.result[0].value;

                              // 合併 ShipmentConfig.list 和 shipment_setting.custom_delivery
                              const combinedList = [
                                ...ShipmentConfig.list.map(dd => ({
                                  name: dd.title,
                                  value: dd.value,
                                })),
                                ...(shipment_setting.custom_delivery ?? []).map((dd: any) => ({
                                  form: dd.form,
                                  name: dd.name,
                                  value: dd.id,
                                })),
                              ];

                              // 過濾出 shipment_setting.support 中支援的項目
                              const supportedList = combinedList.filter(d1 =>
                                shipment_setting.support.some((d2: any) => d2 === d1.value)
                              );

                              // 轉換為 dataList 所需的格式
                              dataList = supportedList.map(data => ({
                                key: data.value,
                                name: data.name,
                              }));
                            }

                            // 更新狀態並通知資料變更
                            loading = false;
                            iGVC.notifyDataChange(id);
                          }
                        );
                      }
                    },
                  });
                },
                footer_html: fGVC => {
                  return [
                    item
                      ? BgWidget.danger(
                          fGVC.event(() => {
                            dialog.checkYesOrNot({
                              text: '若刪除此群組，有使用到此群組的商品將會改成全部物流皆可使用，確定要刪除此物流群組？',
                              callback: bool => {
                                if (bool) {
                                  dvm.dataList = dvm.dataList.filter(data => data.key !== item?.key);
                                  deleteProductLogisticGroup(item?.key, () => updateGroup(fGVC));
                                }
                              },
                            });
                          })
                        )
                      : '',
                    BgWidget.cancel(
                      fGVC.event(() => {
                        if (item) {
                          item = cloneData;
                        }
                        fGVC.closeDialog();
                      })
                    ),
                    BgWidget.save(
                      fGVC.event(() => {
                        for (const data of dvm.dataList) {
                          if (data.key !== postData.key) {
                            if (data.name === postData.name) {
                              dialog.infoMessage({ text: `群組名「${postData.name}」已經存在` });
                              return;
                            }

                            if (Tool.ObjCompare(postData.list, data.list)) {
                              dialog.infoMessage({ text: '此群組的物流組合已經存在，請調整您點選的物流' });
                              return;
                            }

                            if (postData.list.length === 0) {
                              dialog.infoMessage({ text: '請勾選至少一種物流的組合' });
                              return;
                            }
                          }
                        }

                        if (item) {
                          const target = dvm.dataList.find(data => data.key === item?.key);
                          target && Object.assign(target, postData);
                        } else {
                          dvm.dataList.push(postData);
                        }

                        updateGroup(fGVC);
                      })
                    ),
                  ].join('');
                },
              });
            }

            view = view.concat([
              html` <div class="px-md-0 px-2">
                ${BgWidget.normalInsignia('可以將多個物流設定成一個群組集中，在商品設定頁可以一次管理物流方式')}
              </div>`,
              gvc.bindView(() => {
                return {
                  bind: dvm.id,
                  view: () => {
                    if (dvm.loading) {
                      return BgWidget.spinner();
                    }
                    return dvm.dataList
                      .map(item => {
                        const dd = {
                          title: item.name,
                          value: item.key,
                          list: item.list,
                          type: 'font_awesome',
                          src: html`<i class="fa-solid fa-object-group fs-4"></i>`,
                        };

                        return html`
                          <div class="col-12 col-md-4 p-0 p-md-2">
                            <div
                              class="w-100 position-relative main-card"
                              style="padding: 24px; background: white; overflow: hidden; justify-content: space-between; align-items: center; gap: 18px; display: inline-flex;"
                            >
                              <div
                                style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 28px; display: inline-flex;"
                              >
                                <div>${dd.type === 'font_awesome' ? dd.src : html` <img src="${dd.src}" />`}</div>
                                <div
                                  style="flex-direction: column; justify-content: center; align-items: flex-start; gap: 4px; display: inline-flex"
                                >
                                  <div class="tx_normal">${dd.title}</div>
                                </div>
                              </div>
                              <div>
                                ${BgWidget.customButton({
                                  button: { color: 'gray', size: 'sm' },
                                  text: { name: '設定群組' },
                                  event: gvc.event(() => editGroupDialog(item)),
                                })}
                              </div>
                            </div>
                          </div>
                          ${document.body.clientWidth > 768 ? '' : BgWidget.mbContainer(8)}
                        `;
                      })
                      .concat([
                        html` <div
                          class="col-12 col-md-4 p-0 p-md-2"
                          style="cursor: pointer;"
                          onclick="${gvc.event(() => editGroupDialog())}"
                        >
                          <div
                            class="w-100 main-card"
                            style="max-height:73.59px;padding: 24px; background: white; overflow: hidden; flex-direction: column; justify-content: center; align-items: center; gap: 18px; display: inline-flex"
                          >
                            <div
                              class="fw-bold"
                              style="align-self: stretch; justify-content: center; align-items: center; gap: 14px; display: inline-flex;color:#4D86DB;"
                            >
                              <i class="fa-regular fa-circle-plus fs-5"></i>
                              <div class="fs-5">新增物流群組</div>
                            </div>
                          </div>
                        </div>`,
                      ])
                      .join('');
                  },
                  divCreate: {
                    class: 'row guide3-3 mt-3 px-1',
                  },
                  onCreate: () => {
                    if (dvm.loading) {
                      ApiUser.getPublicConfig('logistics_group', 'manager').then(r => {
                        if (r.result) {
                          dvm.dataList = r.response.value ?? [];
                        }
                        setTimeout(() => {
                          dvm.loading = false;
                          gvc.notifyDataChange(dvm.id);
                        }, 100);
                      });
                    }
                  },
                };
              }),
            ]);
          }

          view.push(BgWidget.mbContainer(240));
          return BgWidget.container(view.join(''));
        },
        divCreate: {
          class: `d-flex justify-content-center w-100 flex-column align-items-center `,
        },
      };
    });
  }

  static invoice_setting_v2(gvc: GVC, widget: any) {
    const dialog = new ShareDialog(gvc.glitter);
    const saasConfig: {
      config: any;
      api: any;
    } = (window.parent as any).saasConfig;
    const glitter = (window as any).glitter;
    const vm: {
      id: string;
      loading: boolean;
      data: any;
    } = {
      id: glitter.getUUID(),
      loading: true,
      data: {},
    };

    function save(next: () => void) {
      widget.event('loading', { visible: true, title: '請稍候...' });
      saasConfig.api
        .setPrivateConfig(saasConfig.config.appName, `invoice_setting`, vm.data)
        .then((r: { response: any; result: boolean }) => {
          setTimeout(() => {
            widget.event('loading', { visible: false, title: '請稍候...' });
            if (r.response) {
              next();
            } else {
              widget.event('error', { title: '設定失敗' });
            }
          }, 1000);
        });
    }

    return gvc.bindView({
      bind: vm.id,
      view: () => {
        return BgWidget.container(html`
          <div class="title-container">
            ${BgWidget.title('發票設定')}
            <div class="flex-fill"></div>
          </div>
          ${BgWidget.container(
            [
              BgWidget.mainCard(
                gvc.bindView(() => {
                  const id = gvc.glitter.getUUID();
                  return {
                    bind: id,
                    view: () => {
                      return new Promise(async resolve => {
                        const data = await saasConfig.api.getPrivateConfig(
                          saasConfig.config.appName,
                          `invoice_setting`
                        );
                        if (data.response.result[0]) {
                          vm.data = data.response.result[0].value;
                        }
                        if (vm.data.point === 'beta') {
                          vm.data.whiteList = vm.data.whiteList ?? [];
                          vm.data.whiteListExpand = vm.data.whiteListExpand ?? {};
                        }
                        resolve(
                          gvc.bindView(() => {
                            vm.data.fincial = vm.data.fincial ?? 'ezpay';
                            vm.data.point = vm.data.point ?? 'beta';
                            const id = gvc.glitter.getUUID();
                            return {
                              bind: id,
                              view: () => {
                                return html`
                                  <div class="d-flex flex-column" style="gap:18px;">
                                    <div class="tx_normal fw-bold">服務商選擇</div>
                                    ${[
                                      // {
                                      //   title: html` <div class="d-flex flex-column">
                                      //     藍新發票
                                      //     <span style="color:#8D8D8D;font-size: 12px;"
                                      //       >透過藍新服務商串接，於商品購買時，自動開立電子發票</span
                                      //     >
                                      //   </div>`,
                                      //   value: 'ezpay',
                                      // },
                                      {
                                        title: html` <div class="d-flex flex-column">
                                          綠界發票
                                          <span style="color:#8D8D8D;font-size: 12px;"
                                            >透過綠界服務商串接，於商品購買時，自動開立電子發票</span
                                          >
                                        </div>`,
                                        value: 'ecpay',
                                      },
                                      {
                                        title: html` <div class="d-flex flex-column">
                                          線下開立
                                          <span style="color:#8D8D8D;font-size: 12px;"
                                            >顧客需填寫發票資訊，由店家自行開立發票</span
                                          >
                                        </div>`,
                                        value: 'off_line',
                                      },
                                      {
                                        title: html` <div class="d-flex flex-column">
                                          不開立電子發票
                                          <span style="color:#8D8D8D;font-size: 12px;"
                                            >顧客不需填寫發票資訊，不需開立電子發票</span
                                          >
                                        </div>`,
                                        value: 'nouse',
                                      },
                                    ]
                                      .map(dd => {
                                        return html` <div>
                                          ${[
                                            html` <div
                                              class="d-flex align-items-center cursor_pointer"
                                              style="gap:8px;"
                                              onclick="${gvc.event(() => {
                                                vm.data.fincial = dd.value;
                                                gvc.notifyDataChange(id);
                                              })}"
                                            >
                                              ${vm.data.fincial === dd.value
                                                ? html`<i class="fa-sharp fa-solid fa-circle-dot color39"></i>`
                                                : html`<div class="c_39_checkbox"></div>`}
                                              <div class="tx_normal fw-normal">${dd.title}</div>
                                            </div>`,
                                            html` <div class="d-flex position-relative mt-2">
                                              <div
                                                class="ms-2 border-end position-absolute h-100"
                                                style="left: 0px;"
                                              ></div>
                                              <div class="flex-fill" style="margin-left:30px;max-width: 518px;">
                                                ${(() => {
                                                  if (
                                                    vm.data.fincial === 'nouse' ||
                                                    vm.data.fincial === 'off_line' ||
                                                    vm.data.fincial !== dd.value
                                                  ) {
                                                    return [].join('');
                                                  } else {
                                                    return [
                                                      BgWidget.inlineCheckBox({
                                                        title: '站點',
                                                        gvc: gvc,
                                                        def: vm.data.point,
                                                        array: [
                                                          {
                                                            title: '測試區',
                                                            value: 'beta',
                                                          },
                                                          {
                                                            title: '正式區',
                                                            value: 'official',
                                                          },
                                                        ],
                                                        callback: text => {
                                                          vm.data.point = text;
                                                          if (vm.data.point == 'beta') {
                                                            vm.data.hashkey = vm.data.bhashkey;
                                                            vm.data.hashiv = vm.data.bhashiv;
                                                          } else {
                                                            vm.data.hashkey = vm.data.ohashkey;
                                                            vm.data.hashiv = vm.data.ohashiv;
                                                          }
                                                          gvc.notifyDataChange(id);
                                                        },
                                                      }),
                                                      BgWidget.editeInput({
                                                        gvc: gvc,
                                                        title: '特店編號',
                                                        default: vm.data.merchNO ?? '',
                                                        type: 'text',
                                                        placeHolder: '請輸入特店編號',
                                                        callback: text => {
                                                          vm.data.merchNO = text;
                                                        },
                                                      }),
                                                      BgWidget.editeInput({
                                                        gvc: gvc,
                                                        title: 'HashKey',
                                                        default: vm.data.hashkey ?? '',
                                                        type: 'text',
                                                        placeHolder: '請輸入HashKey',
                                                        callback: text => {
                                                          vm.data.hashkey = text;
                                                          if (vm.data.point == 'beta') {
                                                            vm.data.bhashkey = text;
                                                          } else {
                                                            vm.data.ohashkey = text;
                                                          }
                                                        },
                                                      }),
                                                      BgWidget.editeInput({
                                                        gvc: gvc,
                                                        title: 'HashIV',
                                                        default: vm.data.hashiv ?? '',
                                                        type: 'text',
                                                        placeHolder: '請輸入HashIV',
                                                        callback: text => {
                                                          vm.data.hashiv = text;
                                                          if (vm.data.point == 'beta') {
                                                            vm.data.bhashiv = text;
                                                          } else {
                                                            vm.data.ohashiv = text;
                                                          }
                                                        },
                                                      }),
                                                    ].join(BgWidget.mbContainer(12));
                                                  }
                                                })()}
                                              </div>
                                            </div>`,
                                          ].join('')}
                                        </div>`;
                                      })
                                      .join('')}
                                  </div>
                                `;
                              },
                              divCreate: {
                                class: 'w-100',
                              },
                            };
                          })
                        );
                      });
                    },
                    divCreate: {
                      class: 'd-flex flex-column flex-column-reverse flex-md-row px-0',
                      style: 'gap:10px;',
                    },
                  };
                })
              ),
              BgWidget.mbContainer(240),
              html` <div class="update-bar-container">
                ${BgWidget.save(
                  gvc.event(() => {
                    save(() => {
                      dialog.successMessage({ text: '設定成功' });
                    });
                  })
                )}
              </div>`,
            ].join('')
          )}
        `);
      },
    });
  }
}

(window as any).glitter.setModule(import.meta.url, ShoppingFinanceSetting);
