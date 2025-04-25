import { GVC } from '../glitterBundle/GVController.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { Currency } from '../glitter-base/global/currency.js';
import { LanguageBackend } from './language-backend.js';
import { GlobalUser } from '../glitter-base/global/global-user.js';
import { InformationModule, ViewModel } from './information/information-module.js';

const html = String.raw;

export class ShoppingInformation {
  static saveArray: (() => Promise<boolean>)[] = [];

  static main(gvc: GVC) {
    const glitter = gvc.glitter;
    const dialog = new ShareDialog(gvc.glitter);

    const vm: ViewModel = {
      id: glitter.getUUID(),
      tableId: glitter.getUUID(),
      filterId: glitter.getUUID(),
      type: 'basic',
      data: {
        ubn: '',
        email: '',
        phone: '',
        address: '',
        category: '',
        pos_type: 'retails',
        ai_search: false,
        shop_name: '',
        support_pos_payment: ['cash', 'creditCard', 'line'],
      },
      SEOData: {
        seo: {
          code: '',
          type: 'custom',
          image: '',
          logo: '',
          title: '',
          content: '',
          keywords: '',
        },
        list: [],
        version: 'v2',
        formData: {},
        formFormat: [],
        resource_from: 'global',
        globalStyleTag: [],
        support_editor: 'true',
      },
      domain: {},
      dataList: undefined,
      query: '',
      mainLoading: true,
      SEOLoading: true,
      domainLoading: true,
      save_info: async () => {
        return ApiUser.setPublicConfig({
          key: 'store-information',
          value: vm.data,
          user_id: 'manager',
        }).then(() => {
          (window.parent as any).store_info.web_type = vm.data.web_type;
          return true;
        });
      },
    };

    const shopCategory = [
      '寵物用品',
      '服飾販售',
      '珠寶販售',
      '雜貨店',
      '電子產品',
      '藥局',
      '書店',
      '家具店',
      '玩具店',
      '運動用品店',
      '五金店',
      '超市',
      '百貨公司',
      '美妝店',
      '鞋店',
      '眼鏡店',
      '香水店',
      '文具店',
      '家電店',
      '自行車店',
      '音樂器材店',
      '建材店',
      '農產品店',
      '咖啡店',
      '甜品店',
      '鮮花店',
      '餐具店',
      '床上用品店',
      '汽車配件店',
      '影視產品店',
      '二手店',
      '酒品店',
      '蔬果店',
      '冰淇淋店',
      '烘焙店',
      '肉品店',
      '海鮮店',
      '奶製品店',
      '文創商品店',
      '紀念品店',
      '花藝店',
      '園藝用品店',
      '玩具收藏店',
      '手工藝品店',
      '茶葉店',
      '香氛店',
      '健康食品店',
      '巧克力店',
      '盆栽店',
      '其他',
    ];

    return gvc.bindView({
      bind: vm.id,
      dataList: [{ obj: vm, key: 'type' }],
      view: () => {
        if (vm.mainLoading) {
          ApiUser.getPublicConfig('store-information', 'manager').then((response: any) => {
            const data = response.response.value;

            // 初始化 vm.data
            vm.data = {
              ubn: '',
              email: '',
              phone: '',
              address: '',
              category: '',
              pos_type: 'retails',
              ai_search: false,
              wishlist: true,
              shop_name: '',
              support_pos_payment: ['cash', 'creditCard', 'line'],
              web_type: ['shop'],
              currency_code: 'TWD',
              ...data,
            };

            vm.mainLoading = false;
            gvc.notifyDataChange(vm.id);
          });
        }

        const infoModule = new InformationModule(gvc, vm, ShoppingInformation);

        function createSection(title: string, description?: string) {
          return html`
            <div style="color: #393939; font-size: 16px;">${title}</div>
            ${description
              ? html` <div style="color: #8D8D8D; font-size: 13px; padding-right: 10px;">${description}</div>`
              : ''}
          `;
        }

        function createToggle(title: string, description: string, key: keyof typeof vm.data) {
          return createRow(
            title,
            description,
            html` <div class="cursor_pointer form-check form-switch m-0 p-0" style="min-width: 50px;">
              <input
                class="form-check-input m-0"
                type="checkbox"
                onchange="${gvc.event(() => (vm.data[key] = !vm.data[key]))}"
                ${vm.data[key] ? 'checked' : ''}
              />
            </div>`
          );
        }

        function createSelect(title: string, description: string, key: keyof typeof vm.data) {
          return createRow(
            title,
            description,
            html` <div class="d-flex align-items-center justify-content-center" style="min-width: 150px;">
              ${BgWidget.select({
                gvc,
                callback: text => {
                  vm.data[key] = text;
                },
                default: vm.data[key],
                options: Currency.code.map(dd => ({
                  key: dd.currency_code,
                  value: dd.currency_title,
                })),
              })}
            </div>`
          );
        }

        function createRow(title: string, description: string, elem: string) {
          return html`
            ${BgWidget.horizontalLine({ margin: 0.5 })}
            <div class="d-flex align-items-center justify-content-between">
              <div class="d-flex flex-column" style="gap:8px;">${createSection(title, description)}</div>
              ${elem}
            </div>
          `;
        }

        function createPickUpModeDialog(title: string, description: string) {
          return createRow(
            title,
            description,
            BgWidget.customButton({
              button: { color: 'snow', size: 'md' },
              text: { name: '編輯' },
              event: infoModule.pickUpMode(title),
            })
          );
        }

        function createCheckoutModeDialog(title: string, description: string) {
          return createRow(
            title,
            description,
            BgWidget.customButton({
              button: { color: 'snow', size: 'md' },
              text: { name: '編輯' },
              event: infoModule.checkoutMode(title),
            })
          );
        }

        function createInvoiceModeDialog(title: string, description: string) {
          return createRow(
            title,
            description,
            BgWidget.customButton({
              button: { color: 'snow', size: 'md' },
              text: { name: '編輯' },
              event: infoModule.invoiceMode(title),
            })
          );
        }

        const typeMap: Record<string, () => string> = {
          basic: () => {
            return html`
              ${gvc.bindView({
                bind: 'basic',
                view: () => {
                  const createInput = (title: string, key: keyof typeof vm.data, placeHolder: string) => {
                    return html` <div class="col-12 col-md-6">
                      ${BgWidget.editeInput({
                        gvc,
                        title,
                        default: vm.data[key] ?? '',
                        callback: text => (vm.data[key] = text),
                        placeHolder,
                        divStyle: 'width:100%;',
                      })}
                    </div>`;
                  };

                  return BgWidget.mainCard(
                    html`
                      <div class="d-flex flex-column" style="gap:18px;">
                        <div class="tx_normal fw-bold">關於商店</div>
                        <div class="row guide6-3">
                          ${createInput('商店名稱', 'shop_name', '請輸入商店名稱')}
                          <div class="col-12 col-md-6">
                            <div class="tx_normal fw-normal">商店類別</div>
                            ${BgWidget.select({
                              gvc,
                              default: vm.data.category ?? '',
                              callback: key => {
                                vm.data.category = key;
                              },
                              options: [...new Set(shopCategory)].map(item => ({ key: item, value: item })),
                              style: 'width: 100%; margin: 8px 0;',
                            })}
                          </div>
                          ${createInput('電子信箱', 'email', '請輸入電子信箱')}
                          ${createInput('聯絡電話', 'phone', '請輸入聯絡電話')}
                          ${createInput('店家地址', 'address', '請輸入店家地址')}
                          ${createInput('統一編號', 'ubn', '請輸入統一編號')}
                        </div>
                      </div>
                    `,
                    ''
                  );
                },
              })}
              <div style="margin-top: 24px;"></div>
              ${gvc.bindView(() => {
                const editorVM = (window.parent as any).glitter.share.editorViewModel;
                const isShopnex = editorVM.domain.includes('shopnex.tw');
                let domainType: string | string[] = isShopnex ? 'free' : 'custom';
                let domainText = editorVM.domain.replace('.shopnex.tw', '');

                const updateDomain = (text: string) => {
                  domainText = text;
                };

                const applyDomain = () => {
                  if (!domainText) return dialog.errorMessage({ text: '請輸入網域名稱' });
                  if (editorVM.domain === domainText) return dialog.errorMessage({ text: '此網域已部署完成' });

                  dialog.dataLoading({ visible: true });
                  const { appName, saasConfig } = window.parent as any;
                  const apiMethod = domainType === 'custom' ? saasConfig.api.setDomain : saasConfig.api.setSubDomain;
                  const payload =
                    domainType === 'custom'
                      ? { domain: domainText, app_name: appName }
                      : { sub_domain: domainText, app_name: appName };

                  apiMethod({ ...payload, token: saasConfig.config.token }).then((res: any) => {
                    dialog.dataLoading({ visible: false });
                    if (res.result) {
                      dialog.successMessage({ text: '網域部署成功' });
                      editorVM.domain = domainType === 'custom' ? domainText : `${domainText}.shopnex.tw`;
                    } else {
                      dialog.errorMessage({ text: '網域部署失敗' });
                    }
                  });
                };

                return {
                  bind: 'domain',
                  view: () =>
                    BgWidget.mainCard(
                      html`
                        <div class="d-flex flex-column" style="gap: 8px">
                          <div class="tx_normal fw-bold">網域設定</div>
                          <div class="d-flex align-items-center" style="gap:8px;">
                            ${BgWidget.inlineCheckBox({
                              gvc,
                              title: '',
                              def: domainType,
                              array: [
                                { title: '子網域', value: 'free' },
                                { title: '獨立網域', value: 'custom' },
                              ],
                              callback: text => {
                                domainType = text;
                                domainText =
                                  isShopnex === (text === 'free') ? editorVM.domain.replace('.shopnex.tw', '') : '';
                                gvc.notifyDataChange('domain');
                              },
                            })}
                            ${this.goDaddyDoc(gvc)}
                          </div>
                          <div class="d-flex w-100" style="border:1px solid #DDD;border-radius:10px;overflow:hidden;">
                            <div style="padding: 9px 10px; background: #EAEAEA; border-radius: 10px 0 0 10px;">
                              https://
                            </div>
                            <input
                              class="flex-fill border-0 px-2"
                              value="${domainText}"
                              onchange="${gvc.event(e => updateDomain(e.value))}"
                            />
                            <div
                              class="${domainType === 'custom' ? 'd-none' : ''}"
                              style="padding: 9px 10px; background: #EAEAEA; border-radius: 0 10px 10px 0;"
                            >
                              .shopnex.tw
                            </div>
                          </div>
                          <div class="d-flex justify-content-end">${BgWidget.save(gvc.event(applyDomain), '申請')}</div>
                        </div>
                      `,
                      'guide6-5'
                    ),
                };
              })}
              <div style="margin-top: 24px;"></div>
              ${BgWidget.card(
                [
                  html` <div class="d-flex align-items-center">
                    <div class="d-flex flex-column">
                      <div class="tx_normal fw-bold">301轉址</div>
                      <div style="color: #8D8D8D; font-size: 13px; padding-right: 10px;">
                        設定301轉址，將舊有連結導向至新連結
                      </div>
                    </div>
                    <div class="flex-fill"></div>
                    ${BgWidget.customButton({
                      button: { color: 'snow', size: 'md' },
                      text: { name: '設定' },
                      event: gvc.event(async () => {
                        let domain_301 =
                          (await ApiUser.getPublicConfig('domain_301', 'manager')).response.value.list ?? [];

                        function plusEvent() {
                          const plus_data = {
                            legacy_url: '',
                            new_url: '',
                          };
                          BgWidget.settingDialog({
                            gvc,
                            title: '新增網址',
                            width: 600,
                            innerHTML: gvc => {
                              return [
                                BgWidget.editeInput({
                                  gvc: gvc,
                                  title: '舊網址',
                                  default: plus_data.legacy_url || '',
                                  placeHolder: '請輸入相對路徑(例如:/blogs/sample-page)',
                                  callback: text => {
                                    plus_data.legacy_url = text;
                                  },
                                }),
                                BgWidget.editeInput({
                                  gvc: gvc,
                                  title: '新網址',
                                  default: plus_data.new_url || '',
                                  placeHolder: '請輸入相對路徑(例如:/blogs/sample-page)',
                                  callback: text => {
                                    plus_data.new_url = text;
                                  },
                                }),
                              ].join('');
                            },
                            footer_html: gvc => {
                              return [
                                BgWidget.cancel(
                                  gvc.event(() => {
                                    gvc.closeDialog();
                                  })
                                ),
                                BgWidget.save(
                                  gvc.event(async () => {
                                    if (
                                      domain_301.find(
                                        (dd: any) =>
                                          dd.legacy_url === plus_data.legacy_url || dd.new_url === plus_data.new_url
                                      )
                                    ) {
                                      dialog.errorMessage({ text: '此網址已設定過' });
                                      return;
                                    }
                                    if (!plus_data.legacy_url) {
                                      dialog.errorMessage({ text: '請輸入原先網址' });
                                      return;
                                    }
                                    if (!plus_data.new_url) {
                                      dialog.errorMessage({ text: '請輸入新網址' });
                                      return;
                                    }

                                    if (plus_data.legacy_url === plus_data.new_url) {
                                      dialog.errorMessage({ text: '網址不可相同' });
                                      return;
                                    }

                                    dialog.dataLoading({ visible: true });
                                    ApiUser.setPublicConfig({
                                      key: 'domain_301',
                                      user_id: 'manager',
                                      value: {
                                        list: [
                                          {
                                            new_url: plus_data.new_url,
                                            legacy_url: plus_data.legacy_url,
                                          },
                                          ...domain_301,
                                        ],
                                      },
                                    }).then(res => {
                                      dialog.dataLoading({ visible: false });
                                      dialog.successMessage({ text: '設定成功' });
                                      gvc.closeDialog();
                                    });
                                  }),
                                  '新增'
                                ),
                              ].join('');
                            },
                          });
                        }

                        BgWidget.settingDialog({
                          gvc,
                          title: '301轉址設定',
                          width: 600,
                          innerHTML: gvc => {
                            if (domain_301.length) {
                              return BgWidget.tableV3({
                                gvc: gvc,
                                getData: vd => {
                                  vd.pageSize = 1;
                                  vd.originalData = domain_301;
                                  vd.tableData = domain_301.map((dd: any) => {
                                    return [
                                      { key: '舊網址', value: `${dd.legacy_url ?? ''}` },
                                      { key: '新網址', value: `${dd.new_url ?? ''}` },
                                    ];
                                  });
                                  setTimeout(() => {
                                    vd.callback();
                                  });
                                },
                                rowClick: (data, index) => {},
                                filter: [
                                  {
                                    name: '批量移除',
                                    event: checkedData => {
                                      dialog.checkYesOrNot({
                                        text: '是否確認移除?',
                                        callback: response => {
                                          dialog.dataLoading({ visible: true });
                                          domain_301 = domain_301.filter((dd: any) => {
                                            return !checkedData.find((d1: any) => {
                                              return d1.legacy_url === dd.legacy_url || d1.new_url === dd.new_url;
                                            });
                                          });
                                          ApiUser.setPublicConfig({
                                            key: 'domain_301',
                                            user_id: 'manager',
                                            value: {
                                              list: domain_301,
                                            },
                                          }).then(res => {
                                            dialog.dataLoading({ visible: false });
                                            dialog.successMessage({ text: '設定成功' });
                                            gvc.recreateView();
                                          });
                                        },
                                      });
                                    },
                                  },
                                ],
                              });
                            } else {
                              return BgWidget.warningInsignia('尚未新增轉址連結，點擊右下角新增');
                            }
                          },
                          footer_html: gvc => {
                            return [
                              BgWidget.cancel(
                                gvc.event(() => {
                                  gvc.closeDialog();
                                })
                              ),
                              BgWidget.save(
                                gvc.event(async () => {
                                  plusEvent();
                                }),
                                '新增'
                              ),
                            ].join('');
                          },
                        });
                      }),
                    })}
                  </div>`,
                ].join(`<div class="mt-2"></div>`)
              )}
            `;
          },
          function: () => {
            return BgWidget.mainCard(html`
              <div class="d-flex flex-column gap-2">
                ${createSection('網站功能', '系統將根據您勾選的項目，開放相對應的功能')}
                ${BgWidget.inlineCheckBox({
                  title: '',
                  gvc,
                  def: vm.data.web_type,
                  array: [
                    { title: '零售購物', value: 'shop' },
                    { title: '授課網站', value: 'teaching' },
                    { title: '預約系統', value: 'reserve' },
                    { title: '餐飲組合', value: 'kitchen' },
                    { title: '秤重交易', value: 'weighing' },
                  ],
                  callback: (array: any) => {
                    vm.data.web_type = array;
                  },
                  type: 'multiple',
                })}
                ${createToggle('啟用 AI 選品', '透過 AI 選品功能，用戶可以使用自然語言描述找到所需商品', 'ai_search')}
                ${GlobalUser.getPlan().id > 0
                  ? createToggle(
                      '啟用聊聊功能',
                      '啟用聊聊功能，方便客戶直接於官網前台與您聯繫，並詢問商品詳細內容',
                      'chat_toggle'
                    )
                  : ''}
                ${createToggle(
                  '啟用心願單功能',
                  '方便客戶收藏並管理喜愛的商品清單，隨時查看心儀商品，提升購物體驗與轉換率',
                  'wishlist'
                )}
                ${createToggle('啟用顧客評論功能', '顧客可以對您的商品進行評論', 'customer_comment')}
                ${createToggle(
                  '啟用 Cookie 聲明',
                  '如需使用廣告追蹤行為，必須啟用 Cookie 聲明，才可發送廣告',
                  'cookie_check'
                )}
                ${createToggle('顯示商品剩餘庫存', '啟用此功能，顧客會在商品頁面看到此商品剩餘的庫存數', 'stock_view')}
                ${createToggle(
                  '線上商店開放預購商品',
                  '啟用此功能，顧客可以在線上商店的商品無庫存時，進行預購',
                  'pre_order_status'
                )}
                ${createToggle(
                  '商品卡片顯示區間價格',
                  '啟用後，若商品有多個規格、不同價位，前台商品卡片將會使用價格區間來顯示，關閉則顯示該商品規格中最低價者',
                  'interval_price_card'
                )}
                ${createToggle(
                  '單獨顯示商品特價',
                  '啟用此功能，會將含有特價的商品價格或區間，單獨使用紅字顯示，關閉則採用刪改線的方式呈現特價',
                  'independent_special_price'
                )}
                ${createPickUpModeDialog(
                  '取貨號碼',
                  '針對特店取貨功能，開啟取貨號碼功能消費者需告知商家取貨號碼並前往特店取貨'
                )}
                ${createCheckoutModeDialog(
                  '訂單結算模式',
                  '設定訂單結算模式，可調整顧客累積消費金額、會員等級、數據分析的統計機制'
                )}
                ${createInvoiceModeDialog(
                  '發票開立時機',
                  '設定發票開立的時機，可在商家想要的時間點，開立並發送訂單發票'
                )}
              </div>
            `);
          },
          global: () => {
            return BgWidget.mainCard(html`
              ${gvc.bindView(() => {
                const id = gvc.glitter.getUUID();
                const allLanguages = ['en-US', 'zh-CN', 'zh-TW'];
                const { language_setting } = (window.parent as any).store_info;
                vm.data.language_setting = language_setting;

                function refreshLanguage() {
                  gvc.notifyDataChange([id, 'SEO']);
                }

                function renderLanguageOptions() {
                  return language_setting.support
                    .map((langKey: string) => {
                      const langMap: Record<string, string> = {
                        'en-US': '英文',
                        'zh-CN': '簡體中文',
                        'zh-TW': '繁體中文',
                      };
                      const isDefault = langKey === language_setting.def;

                      return html`
                        <div
                          class="px-3 py-1 text-white position-relative d-flex align-items-center justify-content-center"
                          style="border-radius: 20px; background: #393939; cursor: pointer; width: 100px;"
                          onclick="${gvc.event(() => {
                            BgWidget.settingDialog({
                              gvc,
                              title: '語系設定',
                              innerHTML: gvc => html`
                                <div class="w-100 d-flex align-items-center justify-content-end" style="gap:10px;">
                                  ${BgWidget.danger(
                                    gvc.event(() => {
                                      vm.data.language_setting.support = vm.data.language_setting.support.filter(
                                        (d: any) => d !== langKey
                                      );
                                      refreshLanguage();
                                      gvc.closeDialog();
                                    }),
                                    '刪除語系'
                                  )}
                                  ${BgWidget.save(
                                    gvc.event(() => {
                                      vm.data.language_setting.def = langKey;
                                      refreshLanguage();
                                      gvc.closeDialog();
                                    }),
                                    '設為預設語系'
                                  )}
                                </div>
                              `,
                              footer_html: () => '',
                              width: 400,
                            });
                          })}"
                        >
                          ${langMap[langKey]}
                          ${isDefault
                            ? html` <div
                                class="position-absolute text-white rounded-2 px-2"
                                style="top: -12px; right: -10px; height:20px; font-size: 11px; background: #ff6c02;"
                              >
                                預設
                              </div>`
                            : ''}
                        </div>
                      `;
                    })
                    .join('');
                }

                function createMultiLanguage() {
                  return html`
                    <div class="d-flex flex-column mb-2" style="gap:8px;">
                      <div style="color: #393939;font-size: 16px;">
                        多國語言<span
                          class="cursor_pointer ms-1"
                          style="font-size: 13px;color:#36B;"
                          onclick="${gvc.event(() => {
                            BgWidget.selectLanguage({});
                          })}"
                        >
                          管理語言包
                        </span>
                      </div>
                      <div style="color: #8D8D8D;font-size: 13px;">初次載入時優先預設為用戶裝置所設定的語言</div>
                      <div class="d-flex mt-3" style="gap:15px;">
                        ${renderLanguageOptions()}
                        ${allLanguages.length !== language_setting.support.length
                          ? html`
                              <div
                                class="d-flex align-items-center justify-content-center cursor_pointer"
                                style="color: #36B; font-size: 16px; font-weight: 400;"
                                onclick="${gvc.event(() => {
                                  let add = '';
                                  BgWidget.settingDialog({
                                    gvc,
                                    title: '新增語系',
                                    innerHTML: gvc => {
                                      const availableLanguages = [
                                        { key: 'en-US', value: '英文' },
                                        { key: 'zh-CN', value: '簡體中文' },
                                        { key: 'zh-TW', value: '繁體中文' },
                                      ].filter(lang => !language_setting.support.includes(lang.key));

                                      add = availableLanguages[0].key;
                                      return BgWidget.select({
                                        gvc,
                                        default: add,
                                        options: availableLanguages,
                                        callback: text => (add = text),
                                      });
                                    },
                                    footer_html: (gvc: GVC) =>
                                      BgWidget.save(
                                        gvc.event(() => {
                                          vm.data.language_setting.support.push(add);
                                          gvc.closeDialog();
                                          setTimeout(refreshLanguage, 100);
                                        }),
                                        '新增'
                                      ),
                                    width: 300,
                                  });
                                })}"
                              >
                                <div>新增語系</div>
                                <div class="d-flex align-items-center justify-content-center p-2">
                                  <i class="fa-solid fa-plus fs-6" style="font-size: 16px;" aria-hidden="true"></i>
                                </div>
                              </div>
                            `
                          : ''}
                      </div>
                    </div>
                  `;
                }

                return {
                  bind: id,
                  view: () => {
                    return html` <div class="d-flex flex-column gap-2">
                      ${[
                        createMultiLanguage(),
                        createSelect('商店貨幣', '統一設定商品幣別，前台將依據商品幣別進行換算顯示', 'currency_code'),
                        createToggle(
                          '啟用多國貨幣',
                          '啟用多國貨幣功能，將自動根據用戶 IP 所在地區進行幣值轉換',
                          'multi_currency'
                        ),
                        vm.data.multi_currency
                          ? createToggle('啟用貨幣切換', '是否開放用戶於前台自行切換幣別進行顯示', 'switch_currency')
                          : '',
                        createSelect(
                          '預設顯示幣別',
                          '當查無相關幣別支援國家，前台將預設使用此幣別進行顯示',
                          'currency_code_f_def'
                        ),
                      ]
                        .filter(item => item.length > 0)
                        .join('')}
                    </div>`;
                  },
                };
              })}
            `);
          },
        };

        return BgWidget.container(html`
          <div class="title-container">${BgWidget.title('全站設定')}</div>
          ${BgWidget.tab(
            [
              { title: '商店訊息', key: 'basic' },
              { title: '功能管理', key: 'function' },
              { title: '跨境電商', key: 'global' },
            ],
            gvc,
            vm.type,
            text => {
              vm.type = text as any;
            }
          )}
          ${typeMap[vm.type] ? typeMap[vm.type]() : ''}
          <div style="margin-top: 300px;"></div>
          <div class="update-bar-container">
            ${BgWidget.save(
              gvc.event(async () => {
                dialog.dataLoading({ visible: true });
                await vm.save_info();
                await Promise.all(ShoppingInformation.saveArray.map(dd => dd()));
                ShoppingInformation.saveArray = [];
                dialog.dataLoading({ visible: false });
                dialog.successMessage({ text: '儲存成功' });
              }),
              '儲存',
              'guide3-5'
            )}
          </div>
        `);
      },
      divCreate: {
        style: 'color: #393939; font-size: 14px;',
      },
    });
  }

  static goDaddyDoc = (gvc: GVC): string => {
    return BgWidget.questionButton(
      gvc.event(() => {
        BgWidget.settingDialog({
          gvc: gvc,
          title: 'DNS 設定指南',
          innerHTML: gvc => {
            gvc.addStyle(`
              .gddoc-container {
                word-break: break-all;
                white-space: normal;
                max-width: 100%;
              }
              .gddoc-h4 {
                margin-bottom: 10px;
                font-weight: 500;
              }
              .gddoc-blue-text {
                color: #4d86db;
                font-size: 14px;
                font-weight: 400;
                cursor: pointer;
                overflow-wrap: break-word;
              }
            `);
            return html` <div class="gddoc-container">
              <div class="tx_title text-center mb-4 fs-3">GoDaddy DNS 設定指南</div>
              <h4 class="gddoc-h4" class="gddoc-h4">步驟 1：登錄 GoDaddy 帳戶</h4>
              <ol>
                <li>
                  訪問
                  <a
                    class="gddoc-blue-text"
                    onclick="${gvc.event(() => (window.parent as any).glitter.openNewTab('https://www.godaddy.com'))}"
                    >GoDaddy 官方網站</a
                  >。
                </li>
                <li>使用您的帳號和密碼登錄到 GoDaddy 控制台。</li>
              </ol>
              <h4 class="gddoc-h4">步驟 2：訪問您的域名管理區</h4>
              <ol>
                <li>前往「我的產品」：登錄後，點擊右上角的「我的帳戶」，然後選擇「我的產品」。</li>
                <li>選擇您的域名：在「我的產品」頁面中找到您要設置的域名，點擊該域名旁邊的「DNS」按鈕。</li>
              </ol>
              <h4 class="gddoc-h4">步驟 3：設置 DNS 記錄</h4>
              <ol>
                <li>進入 DNS 管理頁面：點擊「DNS」後，會進入域名的 DNS 管理頁面。</li>
                <li>
                  添加 A 記錄：
                  <ul>
                    <li>
                      在「記錄」區域，找到「A 記錄」，如果已有一個 A
                      記錄指向根域名（@），可以編輯它。如果沒有，點擊「添加」。
                    </li>
                    <li>
                      設定如下：
                      <ul>
                        <li><code>名稱（Name）: @</code></li>
                        <li><code>類型（Type）: A</code></li>
                        <li><code>值（Value）: 34.81.28.192</code></li>
                        <li><code>TTL: 600</code></li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li>保存記錄：確保記錄設置正確後，點擊「保存」按鈕。</li>
              </ol>
              <h4 class="gddoc-h4">步驟 4：設置 WWW 子域名（選填）</h4>
              <ol>
                <li>
                  添加 CNAME 記錄（如需將 <code>www</code> 子域名指向根域名）：
                  <ul>
                    <li>點擊「添加」按鈕。</li>
                    <li>
                      設定如下：
                      <ul>
                        <li><code>名稱（Name）: @</code></li>
                        <li><code>類型（Type）: CNAME</code></li>
                        <li><code>值（Value）: 34.81.28.192</code></li>
                        <li><code>TTL: 600</code></li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li>保存記錄：確保記錄設置正確後，點擊「保存」按鈕。</li>
              </ol>
              <h4 class="gddoc-h4">步驟 5：確認 DNS 設置</h4>
              <ol>
                <li>等待生效：DNS 設置通常需要一些時間才會生效，通常在 24 到 48 小時內。</li>
              </ol>
              ${BgWidget.mbContainer(100)}
            </div>`;
          },
          footer_html: (gvc: GVC) => {
            return '';
          },
        });
      })
    );
  };

  static policy(gvc: GVC) {
    const id = gvc.glitter.getUUID();
    const dialog = new ShareDialog(gvc.glitter);
    const vm2 = {
      language: (window.parent as any).store_info.language_setting.def,
    };

    return BgWidget.container(
      gvc.bindView(() => {
        return {
          bind: id,
          view: () => {
            return [
              html` <div class="title-container mb-4">
                ${BgWidget.title(`商店條款`)}
                <div class="flex-fill"></div>
                ${LanguageBackend.switchBtn({
                  gvc: gvc,
                  language: vm2.language,
                  callback: language => {
                    vm2.language = language;
                    gvc.notifyDataChange(id);
                  },
                })}
              </div>`,
              gvc.bindView(() => {
                return {
                  bind: gvc.glitter.getUUID(),
                  view: () => {
                    return BgWidget.mainCard(
                      html` <div class="d-flex flex-column">
                        ${[
                          ...[
                            {
                              key: 'privacy',
                              title: '隱私權政策',
                            },
                            {
                              key: 'term',
                              title: '服務條款',
                            },
                            {
                              key: 'refund',
                              title: '退換貨政策',
                            },
                            {
                              key: 'delivery',
                              title: '購買與配送須知',
                            },
                          ].map(dd => {
                            const openURL = `https://${(window.parent as any).glitter.share.editorViewModel.domain}/${dd.key}`;
                            return html`
                              <div style="color: #393939;font-size: 16px;">${dd.title}</div>
                              <div
                                style="color: #36B;font-size:13px;cursor:pointer;"
                                onclick="${gvc.event(() => {
                                  (window.parent as any).glitter.openNewTab(openURL);
                                })}"
                              >
                                ${openURL}
                              </div>
                              ${gvc.bindView(() => {
                                const key = dd.key;
                                const vm: {
                                  id: string;
                                  loading: boolean;
                                  data: any;
                                } = {
                                  id: gvc.glitter.getUUID(),
                                  loading: true,
                                  data: {},
                                };
                                ApiUser.getPublicConfig(`terms-related-${key}-${vm2.language}`, 'manager').then(dd => {
                                  if (dd.response.value) {
                                    vm.data = dd.response.value;
                                  }
                                  vm.loading = false;
                                  gvc.notifyDataChange(vm.id);
                                });
                                return {
                                  bind: vm.id,
                                  view: () => {
                                    if (vm.loading) {
                                      return html` <div class="w-100 d-flex align-items-center justify-content-center">
                                        ${BgWidget.spinner()}
                                      </div>`;
                                    }
                                    return BgWidget.richTextEditor({
                                      gvc: gvc,
                                      content: vm.data.text || '',
                                      callback: content => {
                                        vm.data.text = content;
                                        ShoppingInformation.saveArray.push(() => {
                                          return new Promise(async (resolve, reject) => {
                                            await ApiUser.setPublicConfig({
                                              key: `terms-related-${key}-${vm2.language}`,
                                              user_id: 'manager',
                                              value: vm.data,
                                            });
                                            resolve(true);
                                          });
                                        });
                                      },
                                      title: dd.title,
                                    });
                                  },
                                  divCreate: {
                                    class: `w-100 mt-2`,
                                  },
                                };
                              })}
                            `;
                          }),
                        ].join('<div class="my-1"></div>')}
                        <div
                          class="shadow"
                          style="width: 100%;padding: 14px 16px;background: #FFF; display: flex;justify-content: end;position: fixed;bottom: 0;right: 0;z-index:1;gap:14px;"
                        >
                          ${BgWidget.save(
                            gvc.event(async () => {
                              dialog.dataLoading({ visible: true });
                              await Promise.all(ShoppingInformation.saveArray.map(dd => dd()));
                              ShoppingInformation.saveArray = [];
                              dialog.dataLoading({ visible: false });
                              dialog.successMessage({ text: '儲存成功' });
                            }),
                            '儲存'
                          )}
                        </div>
                      </div>`
                    );
                  },
                  divCreate: {
                    class: 'mt-3',
                  },
                };
              }),
              html` <div style="margin-top: 300px;"></div>`,
            ].join('');
          },
        };
      })
    );
  }
}

(window as any).glitter.setModule(import.meta.url, ShoppingInformation);
