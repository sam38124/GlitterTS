import { GVC } from '../glitterBundle/GVController.js';
import { BgWidget } from './bg-widget.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { FilterOptions } from '../cms-plugin/filter-options.js';
import { StockList } from '../cms-plugin/shopping-product-stock.js';
import { ProductConfig } from '../cms-plugin/product-config.js';

const html = String.raw;

export type OptionsItem = {
  key: number | string;
  value: string;
  image: string;
  note?: string;
  content?: any;
};

type CollectionItem = {
  title: string;
  array: CollectionItem[];
};

export class BgProduct {
  static variantsSelector(obj: {
    gvc: GVC;
    title?: string;
    filter_variants: string[];
    callback: (value: any) => void;
    show_mode: 'hidden' | 'all';
  }) {
    let add_items: any = [];
    return (window.parent as any).glitter.innerDialog((gvc: GVC) => {
      return html`
        <div class="bg-white shadow rounded-3">
          <div class="px-3" style="max-height: calc(100vh - 100px);overflow-y: auto;">
            ${StockList.main(
              gvc,
              {
                title: '選擇商品',
                select_data: add_items,
                select_mode: true,
                filter_variants: obj.filter_variants,
              },
              'hidden'
            )}
          </div>
          <div class="c_dialog_bar">
            ${BgWidget.cancel(
              gvc.event(() => {
                gvc.closeDialog();
              })
            )}
            ${BgWidget.save(
              gvc.event(() => {
                obj.callback(add_items);
                gvc.closeDialog();
              }),
              '確認'
            )}
          </div>
        </div>
      `;
    }, 'variantsSelector');
  }

  static productsDialog(obj: {
    gvc: GVC;
    title?: string;
    default: (number | string)[];
    callback: (value: any) => void;
    filter?: (data: any) => boolean;
    productType?: string;
    single?: boolean;
    filter_visible?: string;
    show_product_type?: boolean;
  }) {
    const glitter = (window.parent as any).glitter;
    return (window.parent as any).glitter.innerDialog((gvc: GVC) => {
      const vm = {
        id: glitter.getUUID(),
        ids: [] as { key: string | number; id: string }[],
        loading: true,
        checkClass: BgWidget.getCheckedClass(gvc),
        def: JSON.parse(JSON.stringify(obj.default)),
        options: [] as OptionsItem[],
        query: '',
        orderString: '',
      };

      return html` <div
        class="bg-white shadow rounded-3"
        style="overflow-y: auto;${document.body.clientWidth > 768
          ? 'min-width: 400px; width: 600px;'
          : 'min-width: 90vw; max-width: 92.5vw;'}"
      >
        ${gvc.bindView({
          bind: vm.id,
          view: () => {
            if (vm.loading) {
              return html`<div class="my-5">${BgWidget.spinner()}</div>`;
            }
            return html` <div class="bg-white shadow rounded-3" style="width: 100%; overflow-y: auto;">
              <div class="w-100 d-flex align-items-center p-3 border-bottom">
                <div class="tx_700">${obj.title ?? '產品列表'}</div>
                <div class="flex-fill"></div>
                <i
                  class="fa-regular fa-circle-xmark fs-5 text-dark cursor_pointer"
                  onclick="${gvc.event(() => {
                    obj.callback(vm.def);
                    gvc.closeDialog();
                  })}"
                ></i>
              </div>
              <div class="c_dialog">
                <div class="c_dialog_body">
                  <div class="c_dialog_main" style="gap: 12px; max-height: 500px;">
                    <div class="d-flex" style="gap: 12px;">
                      ${BgWidget.searchFilter(
                        gvc.event(e => {
                          vm.query = e.value;
                          vm.loading = true;
                          gvc.notifyDataChange(vm.id);
                        }),
                        vm.query || '',
                        '搜尋'
                      )}
                      ${BgWidget.updownFilter({
                        gvc,
                        callback: (value: any) => {
                          vm.orderString = value;
                          vm.loading = true;
                          gvc.notifyDataChange(vm.id);
                        },
                        default: vm.orderString || 'default',
                        options: FilterOptions.productOrderBy,
                      })}
                    </div>
                    ${gvc
                      .map(
                        vm.options
                          .filter(dd => {
                            return !obj.filter || obj.filter(dd);
                          })
                          .map((opt, index) => {
                            const id = gvc.glitter.getUUID();
                            vm.ids.push({
                              key: opt.key,
                              id: id,
                            });

                            function call() {
                              if (obj.single) {
                                const tempArray = JSON.parse(JSON.stringify(obj.default));
                                const tempKey = tempArray[0];
                                obj.default = [];
                                vm.ids
                                  .filter(item => {
                                    return tempArray.includes(item.key);
                                  })
                                  .map(item => {
                                    gvc.notifyDataChange(item.id);
                                  });
                                if (tempKey !== opt.key) {
                                  obj.default = [opt.key];
                                }
                              } else {
                                if (obj.default.includes(opt.key)) {
                                  obj.default = obj.default.filter(item => item !== opt.key);
                                } else {
                                  obj.default.push(opt.key);
                                }
                              }
                              gvc.notifyDataChange(id);
                            }

                            return (
                              gvc.bindView(() => {
                                return {
                                  bind: id,
                                  view: () => {
                                    return html`<input
                                        class="form-check-input mt-0 ${vm.checkClass} cursor_pointer"
                                        type="checkbox"
                                        id="${opt.key}"
                                        name="radio_${vm.id}_${index}"
                                        onclick="${gvc.event(() => call())}"
                                        ${obj.default.includes(opt.key) ? 'checked' : ''}
                                      />
                                      <div class="d-flex align-items-center justify-content-between w-100">
                                        <div>
                                          <div
                                            class="d-flex align-items-center form-check-label c_updown_label gap-3"
                                            style="max-width: ${document.body.clientWidth > 768 ? 400 : 220}px;"
                                          >
                                            ${BgWidget.validImageBox({
                                              gvc: gvc,
                                              image: opt.image,
                                              width: 40,
                                              class: 'cursor_pointer',
                                              events: [
                                                {
                                                  key: 'onclick',
                                                  value: gvc.event(() => call()),
                                                },
                                              ],
                                            })}
                                            <div
                                              class="tx_normal ${opt.note ? 'mb-1' : ''} d-flex gap-2 cursor_pointer"
                                              style="text-wrap: auto;"
                                              onclick="${gvc.event(() => call())}"
                                            >
                                              ${obj.show_product_type
                                                ? BgWidget.infoInsignia(ProductConfig.getName(opt.content))
                                                : ''}${opt.value}
                                            </div>
                                          </div>
                                          ${(() => {
                                            const collections = opt.content?.collection
                                              ?.filter(Boolean)
                                              .map((col: string) => BgWidget.normalInsignia(col, { size: 'sm' }))
                                              .join('');
                                            return collections
                                              ? html`<div class="d-flex flex-wrap gap-1 mt-2">${collections}</div>`
                                              : '';
                                          })()}
                                        </div>
                                        <div class="text-end">
                                          <div class="tx_normal_14">
                                            $${parseInt(
                                              `${
                                                opt.content[vm.orderString || 'min_price'] ??
                                                opt.content.variants[0].sale_price
                                              }`,
                                              10
                                            ).toLocaleString()}
                                          </div>
                                          ${opt.note ? html` <div class="tx_gray_12">${opt.note}</div> ` : ''}
                                        </div>
                                      </div>`;
                                  },
                                  divCreate: {
                                    class: 'd-flex align-items-center',
                                    style: 'gap: 24px',
                                  },
                                };
                              }) + BgWidget.horizontalLine({ margin: 0.15 })
                            );
                          })
                      )
                      .trim() ||
                    html`<div class="w-100 d-flex align-items-center justify-content-center">
                      尚未加入任何商品，請前往管理中心加入商品。
                    </div>`}
                  </div>
                  <div class="c_dialog_bar">
                    ${BgWidget.cancel(
                      gvc.event(() => {
                        obj.callback([]);
                        gvc.closeDialog();
                      }),
                      '清除全部'
                    )}
                    ${BgWidget.cancel(
                      gvc.event(() => {
                        obj.callback(vm.def);
                        gvc.closeDialog();
                      })
                    )}
                    ${BgWidget.save(
                      gvc.event(() => {
                        obj.callback(
                          obj.default.filter(item => {
                            return vm.options.find((opt: OptionsItem) => opt.key === item);
                          })
                        );
                        gvc.closeDialog();
                      }),
                      '確認'
                    )}
                  </div>
                </div>
              </div>
            </div>`;
          },
          onCreate: () => {
            if (vm.loading) {
              ApiShop.getProduct({
                page: 0,
                limit: 99999,
                search: vm.query,
                orderBy: (() => {
                  switch (vm.orderString) {
                    case 'max_price':
                    case 'min_price':
                      return vm.orderString;
                    default:
                      return '';
                  }
                })(),
                productType: obj.productType,
                filter_visible: obj.filter_visible,
                status: 'inRange',
              }).then(data => {
                vm.options = data.response.data.map(
                  (product: { content: { id: number; title: string; preview_image: string[] } }) => {
                    return {
                      key: product.content.id,
                      value: product.content.title,
                      content: product.content,
                      image: product.content.preview_image[0] ?? BgWidget.noImageURL,
                    };
                  }
                );
                vm.loading = false;
                gvc.notifyDataChange(vm.id);
              });
            }
          },
        })}
      </div>`;
    }, 'productsDialog');
  }

  static getProductOpts = (
    def: (number | string)[],
    productType?: 'product' | 'addProduct' | 'giveaway'
  ): Promise<OptionsItem[]> => {
    return new Promise<OptionsItem[]>(resolve => {
      if (!def || def.length === 0) {
        resolve([]);
        return;
      }

      const idList = def.map(String).join(',');
      ApiShop.getProduct({
        page: 0,
        limit: 99999,
        productType: productType,
        id_list: idList,
        status: 'inRange',
      }).then(data => {
        const options = data.response.data.map(
          (product: { content: { id: number; title: string; preview_image: string[] } }) => ({
            key: product.content.id,
            value: product.content.title,
            image: product.content.preview_image[0] ?? BgWidget.noImageURL,
          })
        );
        resolve(options);
      });
    });
  };

  static collectionsDialog(obj: {
    gvc: GVC;
    title?: string;
    default: (number | string)[];
    callback: (value: any) => void;
  }) {
    return obj.gvc.glitter.innerDialog((gvc: GVC) => {
      const vm = {
        id: obj.gvc.glitter.getUUID(),
        loading: true,
        checkClass: BgWidget.getCheckedClass(obj.gvc),
        def: JSON.parse(JSON.stringify(obj.default)),
        options: [] as OptionsItem[],
        query: '',
        orderString: '',
      };

      return html` <div
        class="bg-white shadow rounded-3"
        style="overflow-y: auto;${document.body.clientWidth > 768
          ? 'min-width: 400px; width: 600px;'
          : 'min-width: 90vw; max-width: 92.5vw;'}"
      >
        ${obj.gvc.bindView({
          bind: vm.id,
          view: () => {
            if (vm.loading) {
              return BgWidget.spinner({
                container: { style: 'margin: 3rem 0;' },
              });
            }
            return html` <div class="bg-white shadow rounded-3" style="width: 100%; overflow-y: auto;">
              <div class="w-100 d-flex align-items-center p-3 border-bottom">
                <div class="tx_700">${obj.title ?? '商品分類'}</div>
                <div class="flex-fill"></div>
                <i
                  class="fa-regular fa-circle-xmark fs-5 text-dark cursor_pointer"
                  onclick="${gvc.event(() => {
                    obj.callback(vm.def);
                    gvc.closeDialog();
                  })}"
                ></i>
              </div>
              <div class="c_dialog">
                <div class="c_dialog_body">
                  <div class="c_dialog_main" style="gap: 24px; max-height: 500px;">
                    <div class="d-flex" style="gap: 12px;">
                      ${BgWidget.searchFilter(
                        gvc.event((e, event) => {
                          vm.query = e.value;
                          vm.loading = true;
                          obj.gvc.notifyDataChange(vm.id);
                        }),
                        vm.query || '',
                        '搜尋'
                      )}
                    </div>
                    ${obj.gvc.map(
                      vm.options.map((opt: OptionsItem) => {
                        function call() {
                          if (obj.default.includes(opt.key)) {
                            obj.default = obj.default.filter(item => item !== opt.key);
                          } else {
                            obj.default.push(opt.key);
                          }
                          obj.gvc.notifyDataChange(vm.id);
                        }

                        return html` <div class="d-flex align-items-center" style="gap: 24px">
                          <input
                            class="form-check-input mt-0 ${vm.checkClass}"
                            type="checkbox"
                            id="${opt.key}"
                            name="radio_${vm.id}"
                            onclick="${obj.gvc.event(() => call())}"
                            ${obj.default.includes(opt.key) ? 'checked' : ''}
                          />
                          <div
                            class="d-flex align-items-center form-check-label c_updown_label cursor_pointer gap-3"
                            onclick="${obj.gvc.event(() => call())}"
                          >
                            <div class="tx_normal ${opt.note ? 'mb-1' : ''}">${opt.value}</div>
                            ${opt.note ? html` <div class="tx_gray_12">${opt.note}</div> ` : ''}
                          </div>
                        </div>`;
                      })
                    )}
                  </div>
                  <div class="c_dialog_bar">
                    ${BgWidget.cancel(
                      obj.gvc.event(() => {
                        obj.callback([]);
                        gvc.closeDialog();
                      }),
                      '清除全部'
                    )}
                    ${BgWidget.cancel(
                      obj.gvc.event(() => {
                        obj.callback(vm.def);
                        gvc.closeDialog();
                      })
                    )}
                    ${BgWidget.save(
                      obj.gvc.event(() => {
                        obj.callback(
                          obj.default.filter(item => {
                            return vm.options.find((opt: OptionsItem) => opt.key === item);
                          })
                        );
                        gvc.closeDialog();
                      }),
                      '確認'
                    )}
                  </div>
                </div>
              </div>
            </div>`;
          },
          onCreate: () => {
            if (vm.loading) {
              this.getCollectionAllOpts(vm.options, () => {
                vm.loading = false;
                obj.gvc.notifyDataChange(vm.id);
              });
            }
          },
        })}
      </div>`;
    }, 'collectionsDialog');
  }

  static getCollectionAllOpts = (options: OptionsItem[], callback: () => void) => {
    function cc(cols: CollectionItem, pre: string) {
      const str = pre.length > 0 ? pre + ' / ' + cols.title : cols.title;
      options.push({ key: str, value: BgProduct.replaceAngle(str), image: BgWidget.noImageURL });
      for (const col of cols.array ?? []) {
        cc(col, str);
      }
    }

    ApiShop.getCollection().then(data => {
      for (const value of data.response.value) {
        cc(value, '');
      }
      callback();
    });
  };

  static getCollectiosOpts = (def: (number | string)[]) => {
    const opts: OptionsItem[] = [];

    function cc(cols: CollectionItem, pre: string) {
      const str = pre.length > 0 ? pre + ' / ' + cols.title : cols.title;
      def.includes(str) && opts.push({ key: str, value: BgProduct.replaceAngle(str), image: BgWidget.noImageURL });
      for (const col of cols.array ?? []) {
        cc(col, str);
      }
    }

    return new Promise<OptionsItem[]>(resolve => {
      ApiShop.getCollection().then(data => {
        for (const value of data.response.value) {
          cc(value, '');
        }
        resolve(opts);
      });
    });
  };

  static replaceAngle(text: string) {
    return text.replace(/\//g, html`<i class="fa-solid fa-angle-right mx-1"></i>`);
  }

  static getWidthHeigth(isDesktop: boolean): [string, string, string] {
    return isDesktop
      ? ['800px', '600px', 'calc(600px - 120px) !important']
      : ['95vw', '70vh', 'calc(70vh - 120px) !important'];
  }

  static setMemberPriceSetting(obj: { gvc: GVC; postData: string[]; callback: (data: string[]) => void }) {
    const { gvc, postData, callback } = obj;
    const isDesktop = document.body.clientWidth > 768;
    const [baseWidth, baseHeight, mainHeight] = this.getWidthHeigth(isDesktop);

    const vm = {
      dataList: [] as { key: string; name: string }[],
      postData: [...postData],
      loading: true,
    };

    return gvc.glitter.innerDialog(gvc => {
      const id = gvc.glitter.getUUID();

      ApiUser.getUserGroupList('level').then(r => {
        if (r.result && Array.isArray(r.response?.data)) {
          vm.dataList = r.response.data.map((d: { tag: string; title: string }) => ({
            key: d.tag || 'default',
            name: d.title.replace('會員等級 - ', ''),
          }));
        }
        vm.loading = false;
        gvc.notifyDataChange(id);
      });

      return gvc.bindView({
        bind: id,
        view: () =>
          html` <div
            class="bg-white shadow ${isDesktop ? 'rounded-3' : ''}"
            style="overflow-y: auto; width: ${baseWidth}; height: ${baseHeight};"
          >
            <div class="h-100">
              ${vm.loading
                ? html`<div class="h-100 d-flex">${BgWidget.spinner()}</div>`
                : html` <div
                    class="bg-white shadow rounded-3"
                    style="width: 100%; max-height: 100%; overflow-y: auto; position: relative;"
                  >
                    <div
                      class="w-100 d-flex align-items-center p-3 border-bottom"
                      style="position: sticky; top: 0; z-index: 2; background: #fff;"
                    >
                      <div class="tx_700">會員專屬價格設定</div>
                      <div class="flex-fill"></div>
                      <i
                        class="fa-regular fa-circle-xmark fs-5 text-dark cursor_pointer"
                        onclick="${gvc.event(() => gvc.closeDialog())}"
                      ></i>
                    </div>
                    <div class="c_dialog h-100">
                      <div class="c_dialog_body h-100">
                        <div class="c_dialog_main h-100" style="min-height: ${mainHeight}; padding: 20px; gap: 0;">
                          ${BgWidget.tripletCheckboxContainer(
                            gvc,
                            '會員階級',
                            (() => {
                              if (vm.postData.length === 0) return -1;
                              return vm.postData.length === vm.dataList.length ? 1 : 0;
                            })(),
                            r => {
                              vm.postData = r === 1 ? vm.dataList.map(({ key }) => key) : [];
                              gvc.notifyDataChange(id);
                            }
                          )}
                          ${BgWidget.horizontalLine()}
                          ${BgWidget.multiCheckboxContainer(gvc, vm.dataList, vm.postData, text => {
                            vm.postData = text;
                            gvc.notifyDataChange(id);
                          })}
                          ${BgWidget.grayNote('※只有被選取的會員才能設置專屬價格，其餘依售價計算', 'margin-top: 12px;')}
                        </div>
                        <div class="c_dialog_bar" style="z-index: 2;">
                          ${BgWidget.cancel(gvc.event(() => gvc.closeDialog()))}
                          ${BgWidget.save(
                            gvc.event(() => {
                              callback(vm.postData);
                              gvc.closeDialog();
                            }),
                            '確認'
                          )}
                        </div>
                      </div>
                    </div>
                  </div>`}
            </div>
          </div>`,
        divCreate: {},
      });
    }, 'setMemberPriceSetting');
  }

  static setStorePriceSetting(obj: { gvc: GVC; postData: string[]; callback: (data: string[]) => void }) {
    const { gvc, postData, callback } = obj;
    const isDesktop = document.body.clientWidth > 768;
    const [baseWidth, baseHeight, mainHeight] = this.getWidthHeigth(isDesktop);

    const vm = {
      dataList: [] as { key: string; name: string }[],
      postData: [...postData],
      loading: true,
    };

    return gvc.glitter.innerDialog(gvc => {
      const id = gvc.glitter.getUUID();

      ApiUser.getPublicConfig('store_manager', 'manager').then((r: any) => {
        if (r.result && Array.isArray(r.response.value.list)) {
          vm.dataList = r.response.value.list
            .filter((d: { is_shop: boolean }) => d.is_shop)
            .map((d: { id: string; name: string }) => ({
              key: d.id,
              name: d.name,
            }));
        }
        vm.loading = false;
        gvc.notifyDataChange(id);
      });

      return gvc.bindView({
        bind: id,
        view: () =>
          html` <div
            class="bg-white shadow ${isDesktop ? 'rounded-3' : ''}"
            style="overflow-y: auto; width: ${baseWidth}; height: ${baseHeight};"
          >
            <div class="h-100">
              ${vm.loading
                ? html`<div class="h-100 d-flex">${BgWidget.spinner()}</div>`
                : html` <div
                    class="bg-white shadow rounded-3"
                    style="width: 100%; max-height: 100%; overflow-y: auto; position: relative;"
                  >
                    <div
                      class="w-100 d-flex align-items-center p-3 border-bottom"
                      style="position: sticky; top: 0; z-index: 2; background: #fff;"
                    >
                      <div class="tx_700">門市專屬價格設定</div>
                      <div class="flex-fill"></div>
                      <i
                        class="fa-regular fa-circle-xmark fs-5 text-dark cursor_pointer"
                        onclick="${gvc.event(() => gvc.closeDialog())}"
                      ></i>
                    </div>
                    <div class="c_dialog h-100">
                      <div class="c_dialog_body h-100">
                        <div class="c_dialog_main h-100" style="min-height: ${mainHeight}; padding: 20px; gap: 0;">
                          <div class="d-none gap-2 mb-3">
                            <div class="textbox textbox-uncheck">依照門市</div>
                            <div class="textbox textbox-checked">依照門市標籤</div>
                          </div>
                          ${BgWidget.tripletCheckboxContainer(
                            gvc,
                            '門市名稱',
                            (() => {
                              if (vm.postData.length === 0) return -1;
                              return vm.postData.length === vm.dataList.length ? 1 : 0;
                            })(),
                            r => {
                              vm.postData = r === 1 ? vm.dataList.map(({ key }) => key) : [];
                              gvc.notifyDataChange(id);
                            }
                          )}
                          ${BgWidget.horizontalLine()}
                          ${BgWidget.multiCheckboxContainer(gvc, vm.dataList, vm.postData, text => {
                            vm.postData = text;
                            gvc.notifyDataChange(id);
                          })}
                          ${BgWidget.grayNote(
                            '※只有被選取的門市/標籤才能設置專屬價格，其餘依售價計算',
                            'margin-top: 12px;'
                          )}
                        </div>
                        <div class="c_dialog_bar" style="z-index: 2;">
                          ${BgWidget.cancel(gvc.event(() => gvc.closeDialog()))}
                          ${BgWidget.save(
                            gvc.event(() => {
                              callback(vm.postData);
                              gvc.closeDialog();
                            }),
                            '確認'
                          )}
                        </div>
                      </div>
                    </div>
                  </div>`}
            </div>
          </div>`,
        divCreate: {},
      });
    }, 'setMemberPriceSetting');
  }

  static setUserTagPriceSetting(obj: { gvc: GVC; postData: string[]; callback: (data: string[]) => void }) {
    const { gvc, postData, callback } = obj;
    const isDesktop = document.body.clientWidth > 768;
    const [baseWidth, baseHeight, mainHeight] = this.getWidthHeigth(isDesktop);

    const vm = {
      dataList: [] as { key: string; name: string }[],
      postData: [...postData],
      loading: true,
    };

    return gvc.glitter.innerDialog(gvc => {
      const id = gvc.glitter.getUUID();

      ApiUser.getPublicConfig('user_general_tags', 'manager').then((r: any) => {
        if (r.result && Array.isArray(r.response.value.list)) {
          vm.dataList = r.response.value.list.map((tag: string) => ({ key: tag, name: tag }));
        }
        vm.loading = false;
        gvc.notifyDataChange(id);
      });

      return gvc.bindView({
        bind: id,
        view: () =>
          html` <div
            class="bg-white shadow ${isDesktop ? 'rounded-3' : ''}"
            style="overflow-y: auto; width: ${baseWidth}; height: ${baseHeight};"
          >
            <div class="h-100">
              ${vm.loading
                ? html`<div class="h-100 d-flex">${BgWidget.spinner()}</div>`
                : html` <div
                    class="bg-white shadow rounded-3"
                    style="width: 100%; max-height: 100%; overflow-y: auto; position: relative;"
                  >
                    <div
                      class="w-100 d-flex align-items-center p-3 border-bottom"
                      style="position: sticky; top: 0; z-index: 2; background: #fff;"
                    >
                      <div class="tx_700">顧客標籤價格設定</div>
                      <div class="flex-fill"></div>
                      <i
                        class="fa-regular fa-circle-xmark fs-5 text-dark cursor_pointer"
                        onclick="${gvc.event(() => gvc.closeDialog())}"
                      ></i>
                    </div>
                    <div class="c_dialog h-100">
                      <div class="c_dialog_body h-100">
                        <div class="c_dialog_main h-100" style="min-height: ${mainHeight}; padding: 20px; gap: 0;">
                          ${BgWidget.tripletCheckboxContainer(
                            gvc,
                            '顧客標籤',
                            (() => {
                              if (vm.postData.length === 0) return -1;
                              return vm.postData.length === vm.dataList.length ? 1 : 0;
                            })(),
                            r => {
                              vm.postData = r === 1 ? vm.dataList.map(({ key }) => key) : [];
                              gvc.notifyDataChange(id);
                            }
                          )}
                          ${BgWidget.horizontalLine()}
                          ${BgWidget.multiCheckboxContainer(gvc, vm.dataList, vm.postData, text => {
                            vm.postData = text;
                            gvc.notifyDataChange(id);
                          })}
                          ${BgWidget.grayNote('※只有被選取的會員才能設置專屬價格，其餘依售價計算', 'margin-top: 12px;')}
                        </div>
                        <div class="c_dialog_bar" style="z-index: 2;">
                          ${BgWidget.cancel(gvc.event(() => gvc.closeDialog()))}
                          ${BgWidget.save(
                            gvc.event(() => {
                              callback(vm.postData);
                              gvc.closeDialog();
                            }),
                            '確認'
                          )}
                        </div>
                      </div>
                    </div>
                  </div>`}
            </div>
          </div>`,
        divCreate: {},
      });
    }, 'setUserTagPriceSetting');
  }
}
