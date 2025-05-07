import { GVC } from '../glitterBundle/GVController.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { Currency } from '../glitter-base/global/currency.js';
import { FilterOptions } from './filter-options.js';
import { GlobalUser } from '../glitter-base/global/global-user.js';
import { LanguageBackend } from './language-backend.js';
import { ShoppingFinanceSetting } from './shopping-finance-setting.js';

const html = String.raw;

export class PosConfigSetting {
  static saveArray: (() => Promise<boolean>)[] = [];

  static main(gvc: GVC) {
    const glitter = gvc.glitter;
    const dialog = new ShareDialog(gvc.glitter);

    const vm: {
      id: string;
      tableId: string;
      filterId: string;
      type: 'basic' | 'function' | 'global';
      data: any;
      SEOData: any;
      domain: any;
      dataList: any;
      query?: string;
      mainLoading: boolean;
      SEOLoading: boolean;
      domainLoading: boolean;
      save_info: () => Promise<any>;
    } = {
      id: glitter.getUUID(),
      tableId: glitter.getUUID(),
      filterId: glitter.getUUID(),
      type: 'function',
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

        function createPickUpModeDialog(title: string, description: string) {
          vm.data.pos_support_finction = vm.data.pos_support_finction ?? [];
          return createRow(
            title,
            description,
            BgWidget.customButton({
              button: { color: 'snow', size: 'md' },
              text: { name: '編輯' },
              event: gvc.event(() => {
                BgWidget.settingDialog({
                  gvc,
                  title,
                  width: 600,
                  innerHTML: gvc => {
                    return `<div class="d-flex flex-column" style="gap:5px;">${[
                      html` <div class="d-flex align-items-center" style="gap:10px;">
                        <div style="color: #393939; font-size: 16px;">啟用功能</div>
                        <div class="cursor_pointer form-check form-switch m-0 p-0" style="min-width: 50px;">
                          <input
                            class="form-check-input m-0"
                            type="checkbox"
                            onchange="${gvc.event(() => {
                              if (vm.data.pos_support_finction.includes('order_sort')) {
                                vm.data.pos_support_finction = vm.data.pos_support_finction.filter(
                                  (dd: any) => dd != 'order_sort'
                                );
                              } else {
                                vm.data.pos_support_finction.push('order_sort');
                              }
                              gvc.recreateView();
                            })}"
                            ${vm.data.pos_support_finction.includes('order_sort') ? `checked` : ''}
                          />
                        </div>
                        ${vm.data.pos_support_finction.includes('order_sort')
                          ? `<div class="fw-bold fs-6 d-flex align-items-center">當前號碼 : ${vm.data.pickup_now || vm.data.pickup_start || 0}
<div class="mx-2"></div>
${BgWidget.customButton({
  button: {
    color: 'snow',
    size: 'sm',
  },
  text: {
    name: '重置號碼',
  },
  event: gvc.event(() => {
    const dialog = new ShareDialog(gvc.glitter);
    dialog.checkYesOrNot({
      text: '是否確認重置號碼?',
      callback: response => {
        if (response) {
          vm.data.pickup_now = vm.data.pickup_start || '0';
          gvc.recreateView();
        }
      },
    });
  }),
})}
</div>`
                          : ``}
                      </div>`,
                      ...(() => {
                        if (vm.data.pos_support_finction.includes('order_sort')) {
                          return [
                            BgWidget.editeInput({
                              gvc: gvc,
                              title: '初始號碼',
                              default: vm.data.pickup_start || '0',
                              callback: text => {
                                vm.data.pickup_start = text;
                              },
                              placeHolder: '請輸入初始號碼',
                              type: 'number',
                            }),
                            BgWidget.editeInput({
                              gvc: gvc,
                              title: html` <div class="d-flex flex-column">
                                ${['結束號碼', BgWidget.grayNote('輸入零則無上限')].join('')}
                              </div>`,
                              default: vm.data.pickup_end || '0',
                              callback: text => {
                                vm.data.pickup_end = text;
                              },
                              placeHolder: '請輸入結束號碼',
                              type: 'number',
                            }),
                          ];
                        } else {
                          return [];
                        }
                      })(),
                    ].join(BgWidget.horizontalLine())}</div>`;
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
                          dialog.dataLoading({ visible: true });
                          await vm.save_info();
                          await Promise.all(PosConfigSetting.saveArray.map(dd => dd()));
                          PosConfigSetting.saveArray = [];
                          dialog.dataLoading({ visible: false });
                          dialog.successMessage({ text: '儲存成功' });
                          gvc.closeDialog();
                        })
                      ),
                    ].join('');
                  },
                });
              }),
            })
          );
        }

        function createProductCardLayout(title: string, description: string) {
          vm.data.pos_support_finction = vm.data.pos_support_finction ?? [];
          return createRow(
            title,
            description,
            BgWidget.customButton({
              button: { color: 'snow', size: 'md' },
              text: { name: '編輯' },
              event: gvc.event(() => {
                vm.data.prdouct_card_layout=vm.data.prdouct_card_layout??'16:9'
                BgWidget.settingDialog({
                  gvc,
                  title,
                  width: 600,
                  innerHTML: gvc => {
                    return  BgWidget.editeInput({
                      gvc: gvc,

                      title: '卡片比例',
                      default: vm.data.prdouct_card_layout,
                      placeHolder: '請輸入卡片比例，範例: 16:9',
                      callback: (text) => {
                        if(text.split(':').map((dd)=>{
                          return Number.isFinite(Number(dd))
                        }).length===2){
                          vm.data.prdouct_card_layout=text
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
                        gvc.event(async () => {
                          dialog.dataLoading({ visible: true });
                          await vm.save_info();
                          dialog.dataLoading({ visible: false });
                          dialog.successMessage({ text: '儲存成功' });
                          gvc.closeDialog();
                        })
                      ),
                    ].join('');
                  },
                });
              }),
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
              event: gvc.event(() => {
                const originData = structuredClone(vm.data);
                BgWidget.settingDialog({
                  gvc,
                  title,
                  width: 600,
                  innerHTML: gvc => {
                    const modes = vm.data.checkout_mode;
                    const arr = [
                      {
                        key: 'orderStatus',
                        name: '訂單狀態',
                        data: FilterOptions.orderStatusOptions,
                      },
                      {
                        key: 'payload',
                        name: '付款狀態',
                        data: FilterOptions.payloadStatusOptions,
                      },
                      {
                        key: 'progress',
                        name: '出貨狀況',
                        data: FilterOptions.progressOptions,
                      },
                    ];

                    return html`${BgWidget.grayNote('提示：勾選項目後，該項目將會作為訂單累積與分析數據的篩選條件')}
                      <div class="d-flex flex-column gap-1">
                        ${arr
                          .map(obj => {
                            return BgWidget.inlineCheckBox({
                              gvc,
                              title: obj.name,
                              def: modes[obj.key],
                              array: obj.data.map(item => ({ title: item.name, value: item.key })),
                              callback: (array: any) => {
                                modes[obj.key] = array;
                              },
                              type: 'multiple',
                            });
                          })
                          .join(BgWidget.mbContainer(12))}
                      </div>`;
                  },
                  footer_html: gvc => {
                    return [
                      BgWidget.cancel(
                        gvc.event(() => {
                          vm.data = originData;
                          gvc.closeDialog();
                        })
                      ),
                      BgWidget.save(
                        gvc.event(async () => {
                          dialog.dataLoading({ visible: true });
                          await vm.save_info();
                          await Promise.all(PosConfigSetting.saveArray.map(dd => dd()));
                          PosConfigSetting.saveArray = [];
                          dialog.dataLoading({ visible: false });
                          dialog.successMessage({ text: '儲存成功' });
                          gvc.closeDialog();
                        })
                      ),
                    ].join('');
                  },
                });
              }),
            })
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

        vm.data.pos_support_finction = vm.data.pos_support_finction ?? [];
        const typeMap: Record<string, () => string> = {
          function: () => {
            return [
              BgWidget.mainCard(html`
                <div class="d-flex flex-column gap-2">
                  ${createSection('POS功能', '系統將根據您勾選的項目，開放相對應的功能')}
                  ${BgWidget.inlineCheckBox({
                    title: '',
                    gvc,
                    def: vm.data.pos_support_finction ?? [],
                    array: [
                      { title: '列印明細', value: 'print_order_detail' },
                      { title: '列印留存聯', value: 'print_order_receipt' },
                      { title: '發票開立', value: 'print_invoice' },
                      { title: '桌號設定', value: 'table_select' },
                    ],
                    callback: (array: any) => {
                      vm.data.pos_support_finction = array;
                    },
                    type: 'multiple',
                  })}
                  ${createPickUpModeDialog('叫號取餐', `針對特店取餐功能，會自動遞增取餐號碼。`)}
                  ${createProductCardLayout('商品比例', `設定POS商品卡片顯示比例。`)}
                </div>
              `),
            ].join('');
          },
          finance: () => {
            return ShoppingFinanceSetting.main(gvc, true);
          },
        };

        return BgWidget.container(html`
          <div class="title-container">${BgWidget.title('全站設定')}</div>
          ${BgWidget.tab(
            [
              // { title: '商店訊息', key: 'basic' },
              { title: '功能管理', key: 'function' },
              { title: '金流設定', key: 'finance' },
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
                await Promise.all(PosConfigSetting.saveArray.map(dd => dd()));
                PosConfigSetting.saveArray = [];
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
                                        PosConfigSetting.saveArray.push(() => {
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
                              await Promise.all(PosConfigSetting.saveArray.map(dd => dd()));
                              PosConfigSetting.saveArray = [];
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

(window as any).glitter.setModule(import.meta.url, PosConfigSetting);
