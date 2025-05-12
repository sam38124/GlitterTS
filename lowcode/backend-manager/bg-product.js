var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BgWidget } from './bg-widget.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { FilterOptions } from '../cms-plugin/filter-options.js';
import { StockList } from '../cms-plugin/shopping-product-stock.js';
import { ProductConfig } from '../cms-plugin/product-config.js';
const html = String.raw;
export class BgProduct {
    static variantsSelector(obj) {
        let add_items = [];
        return window.parent.glitter.innerDialog((gvc) => {
            return html `
        <div class="bg-white shadow rounded-3">
          <div class="px-3" style="max-height: calc(100vh - 100px); overflow-y: auto;">
            ${StockList.main(gvc, {
                title: '選擇商品',
                select_data: add_items,
                select_mode: true,
                filter_variants: obj.filter_variants,
            }, 'hidden')}
          </div>
          <div class="c_dialog_bar">
            ${BgWidget.cancel(gvc.event(() => {
                gvc.closeDialog();
            }))}
            ${BgWidget.save(gvc.event(() => {
                obj.callback(add_items);
                gvc.closeDialog();
            }), '確認')}
          </div>
        </div>
      `;
        }, 'variantsSelector');
    }
    static productsDialog(obj) {
        const glitter = window.parent.glitter;
        return window.parent.glitter.innerDialog((gvc) => {
            const vm = {
                id: glitter.getUUID(),
                ids: [],
                loading: true,
                checkClass: BgWidget.getCheckedClass(gvc),
                def: JSON.parse(JSON.stringify(obj.default)),
                options: [],
                query: '',
                queryType: 'title',
                orderString: '',
                manager_tag: [],
            };
            gvc.addStyle(`
        .bg-product-main {
          gap: 12px;
          min-height: 480px;
          max-height: 500px;
          border: ${document.body.clientWidth > 800 ? 16 : 8}px solid #fff;
        }
        .bg-product-topbar {
          gap: 6px;
          position: sticky;
          top: 0px;
          background-color: #fff;
        }
      `);
            return html ` <div
        class="bg-white shadow rounded-3"
        style="overflow-y: auto; ${document.body.clientWidth > 768
                ? 'min-width: 500px; width: 700px;'
                : 'min-width: 90vw; max-width: 92.5vw;'}"
      >
        ${gvc.bindView({
                bind: vm.id,
                view: () => {
                    var _a;
                    if (vm.loading) {
                        return html `<div class="my-5">${BgWidget.spinner()}</div>`;
                    }
                    function selectBar() {
                        return BgWidget.selectFilter({
                            gvc,
                            callback: (value) => {
                                vm.queryType = value;
                                gvc.notifyDataChange(vm.id);
                            },
                            default: vm.queryType || 'title',
                            options: FilterOptions.productSelect,
                            style: 'min-width: 120px;',
                        });
                    }
                    function searchBar() {
                        return gvc.bindView({
                            bind: gvc.glitter.getUUID(),
                            dataList: [{ obj: vm, key: 'queryType' }],
                            view: () => {
                                if (vm.queryType === 'customize_tag') {
                                    return BgWidget.searchTagsFilter(gvc, vm.manager_tag, tagArray => {
                                        vm.query = '';
                                        vm.manager_tag = tagArray;
                                        vm.loading = true;
                                        gvc.notifyDataChange(vm.id);
                                    }, '搜尋');
                                }
                                else {
                                    return BgWidget.searchFilter(gvc.event(e => {
                                        vm.query = e.value;
                                        vm.manager_tag = [];
                                        vm.loading = true;
                                        gvc.notifyDataChange(vm.id);
                                    }), vm.query || '', '搜尋');
                                }
                            },
                            divCreate: {
                                class: 'w-100 position-relative',
                            },
                        });
                    }
                    function updownButton() {
                        return BgWidget.updownFilter({
                            gvc,
                            callback: (value) => {
                                vm.orderString = value;
                                vm.loading = true;
                                gvc.notifyDataChange(vm.id);
                            },
                            default: vm.orderString || 'default',
                            options: FilterOptions.productOrderBy,
                        });
                    }
                    return html ` <div class="bg-white shadow rounded-3" style="width: 100%; overflow-y: auto;">
              <div class="w-100 d-flex align-items-center p-3 border-bottom">
                <div class="tx_700">${(_a = obj.title) !== null && _a !== void 0 ? _a : '產品列表'}</div>
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
                  <div class="c_dialog_main p-0 bg-product-main">
                    ${document.body.clientWidth > 768
                        ? html ` <div class="d-flex pb-2 px-1 bg-product-topbar">
                          ${selectBar()} ${searchBar()} ${updownButton()}
                        </div>`
                        : html `<div class="pb-2 px-1 bg-product-topbar">
                          <div class="d-flex align-items-center justify-content-between w-100 mb-1">
                            ${selectBar()} ${updownButton()}
                          </div>
                          <div>${searchBar()}</div>
                        </div> `}
                    ${gvc
                        .map(vm.options
                        .filter(dd => {
                        return !obj.filter || obj.filter(dd);
                    })
                        .map((opt, index) => {
                        const id = `ProductsDialog${index}`;
                        vm.ids.push({ key: opt.key, id: id });
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
                            }
                            else {
                                if (obj.default.includes(opt.key)) {
                                    obj.default = obj.default.filter(item => item !== opt.key);
                                }
                                else {
                                    obj.default.push(opt.key);
                                }
                            }
                            gvc.notifyDataChange(id);
                        }
                        return (gvc.bindView({
                            bind: id,
                            view: () => {
                                return html `<input
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
                                          style="max-width: ${document.body.clientWidth > 768 ? 500 : 220}px;"
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
                                          <div class="d-flex flex-column">
                                            <div
                                              class="tx_normal ${opt.note ? 'mb-1' : ''} d-flex gap-2 cursor_pointer"
                                              style="text-wrap: auto;"
                                              onclick="${gvc.event(() => call())}"
                                            >
                                              ${opt.value}
                                            </div>
                                            ${opt.sub_title
                                    ? html `
                                                  <div class="fw-500" style="color: grey; font-size: 13px;">
                                                    ${opt.sub_title}
                                                  </div>
                                                `
                                    : ''}
                                          </div>
                                        </div>
                                        ${(() => {
                                    var _a, _b;
                                    const isVisibleProduct = opt.content.visible === 'false' && !obj.show_product_type
                                        ? BgWidget.warningInsignia('隱形商品', { size: 'sm' })
                                        : '';
                                    const productCategory = obj.show_product_type
                                        ? BgWidget.infoInsignia(ProductConfig.getName(opt.content), {
                                            size: 'sm',
                                        })
                                        : '';
                                    const collections = (_b = (_a = opt.content) === null || _a === void 0 ? void 0 : _a.collection) === null || _b === void 0 ? void 0 : _b.filter(Boolean).map((col) => BgWidget.normalInsignia(col, { size: 'sm' })).join('');
                                    const renderString = `${isVisibleProduct}${productCategory}${collections}`;
                                    return renderString
                                        ? html `<div class="d-flex flex-wrap gap-1 mt-2">${renderString}</div>`
                                        : '';
                                })()}
                                      </div>
                                      <div class="text-end">
                                        <div class="tx_normal_14">
                                          ${(() => {
                                    const contentMap = {
                                        price: () => {
                                            var _a, _b;
                                            return html `$${parseInt(`${(_a = opt.content[vm.orderString || 'min_price']) !== null && _a !== void 0 ? _a : opt.content.variants[(_b = opt.variant_index) !== null && _b !== void 0 ? _b : 0].sale_price}`, 10).toLocaleString()}`;
                                        },
                                        stock: () => {
                                            var _a, _b;
                                            const variant = opt.content.variants[(_a = opt.variant_index) !== null && _a !== void 0 ? _a : 0];
                                            if (variant.show_understocking === 'false') {
                                                return '不追蹤庫存';
                                            }
                                            const n = Number(opt.content.variants[(_b = opt.variant_index) !== null && _b !== void 0 ? _b : 0].stock);
                                            return html `庫存 ${(isNaN(n) ? 0 : n).toLocaleString()} 個`;
                                        },
                                    };
                                    return (obj.right_element_type
                                        ? contentMap[obj.right_element_type]
                                        : contentMap.price)();
                                })()}
                                        </div>
                                        ${opt.note ? html ` <div class="tx_gray_12">${opt.note}</div> ` : ''}
                                      </div>
                                    </div>`;
                            },
                            divCreate: {
                                class: 'd-flex align-items-center',
                                style: `gap: ${document.body.clientWidth > 800 ? 24 : 12}px`,
                            },
                        }) + BgWidget.horizontalLine({ margin: 0.15 }));
                    }))
                        .trim() ||
                        html `<div class="w-100 d-flex align-items-center justify-content-center">
                      尚未加入任何商品，請前往「商品管理」加入商品
                    </div>`}
                  </div>
                  <div class="c_dialog_bar">
                    ${BgWidget.cancel(gvc.event(() => {
                        obj.callback([]);
                        gvc.closeDialog();
                    }), '清除全部')}
                    ${BgWidget.cancel(gvc.event(() => {
                        obj.callback(vm.def);
                        gvc.closeDialog();
                    }))}
                    ${BgWidget.save(gvc.event(() => {
                        obj.callback(obj.default.filter(item => {
                            return vm.options.find((opt) => opt.key === item);
                        }));
                        gvc.closeDialog();
                    }), '確認')}
                  </div>
                </div>
              </div>
            </div>`;
                },
                onCreate: () => {
                    if (vm.loading) {
                        const apiJSON = {
                            page: 0,
                            limit: 99999,
                            search: vm.query,
                            searchType: vm.queryType || undefined,
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
                            manager_tag: vm.manager_tag.join(','),
                        };
                        ApiShop.getProduct(apiJSON).then(data => {
                            vm.options = [];
                            data.response.data.map((product) => {
                                var _a;
                                const image = (_a = product.content.preview_image[0]) !== null && _a !== void 0 ? _a : BgWidget.noImageURL;
                                const title = product.content.title;
                                if (obj.with_variants) {
                                    product.content.variants.map((variant, index) => {
                                        vm.options.push({
                                            key: `${product.content.id}-${variant.spec.join('-')}`,
                                            sub_title: variant.spec.join('-') ? `規格:${variant.spec.join('-')}` : '',
                                            variant_index: index,
                                            value: title,
                                            content: product.content,
                                            image: image,
                                        });
                                    });
                                }
                                else {
                                    vm.options.push({
                                        key: product.content.id,
                                        value: title,
                                        content: product.content,
                                        image: image,
                                    });
                                }
                            });
                            vm.loading = false;
                            gvc.notifyDataChange(vm.id);
                        });
                    }
                },
            })}
      </div>`;
        }, 'productsDialog');
    }
    static collectionsDialog(obj) {
        return obj.gvc.glitter.innerDialog((gvc) => {
            const vm = {
                id: obj.gvc.glitter.getUUID(),
                loading: true,
                checkClass: BgWidget.getCheckedClass(obj.gvc),
                def: JSON.parse(JSON.stringify(obj.default)),
                options: [],
                query: '',
                orderString: '',
            };
            return html ` <div
        class="bg-white shadow rounded-3"
        style="overflow-y: auto;${document.body.clientWidth > 768
                ? 'min-width: 400px; width: 600px;'
                : 'min-width: 90vw; max-width: 92.5vw;'}"
      >
        ${obj.gvc.bindView({
                bind: vm.id,
                view: () => {
                    var _a;
                    if (vm.loading) {
                        return BgWidget.spinner({
                            container: { style: 'margin: 3rem 0;' },
                        });
                    }
                    return html ` <div class="bg-white shadow rounded-3" style="width: 100%; overflow-y: auto;">
              <div class="w-100 d-flex align-items-center p-3 border-bottom">
                <div class="tx_700">${(_a = obj.title) !== null && _a !== void 0 ? _a : '商品分類'}</div>
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
                  <div class="c_dialog_main" style="gap: 18px; max-height: 500px;">
                    <div class="position-sticky px-1" style="top: 0; background-color: #fff;">
                      ${BgWidget.searchFilter(gvc.event((e, event) => {
                        vm.query = e.value;
                        vm.loading = true;
                        obj.gvc.notifyDataChange(vm.id);
                    }), vm.query || '', '搜尋')}
                    </div>
                    ${obj.gvc.map(vm.options.map((opt) => {
                        function call() {
                            if (obj.default.includes(opt.key)) {
                                obj.default = obj.default.filter(item => item !== opt.key);
                            }
                            else {
                                obj.default.push(opt.key);
                            }
                            obj.gvc.notifyDataChange(vm.id);
                        }
                        return html ` <div class="d-flex align-items-center" style="gap: 24px">
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
                            ${opt.note ? html ` <div class="tx_gray_12">${opt.note}</div> ` : ''}
                          </div>
                        </div>`;
                    }))}
                  </div>
                  <div class="c_dialog_bar">
                    ${BgWidget.cancel(obj.gvc.event(() => {
                        obj.callback([]);
                        gvc.closeDialog();
                    }), '清除全部')}
                    ${BgWidget.cancel(obj.gvc.event(() => {
                        obj.callback(vm.def);
                        gvc.closeDialog();
                    }))}
                    ${BgWidget.save(obj.gvc.event(() => {
                        obj.callback(obj.default.filter(item => {
                            return vm.options.find((opt) => opt.key === item);
                        }));
                        gvc.closeDialog();
                    }), '確認')}
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
    static replaceAngle(text) {
        return text.replace(/\//g, html `<i class="fa-solid fa-angle-right mx-1"></i>`);
    }
    static getWidthHeigth(isDesktop) {
        return isDesktop
            ? ['800px', '600px', 'calc(600px - 120px) !important']
            : ['95vw', '70vh', 'calc(70vh - 120px) !important'];
    }
    static setMemberPriceSetting(obj) {
        const { gvc, postData, callback } = obj;
        const isDesktop = document.body.clientWidth > 768;
        const [baseWidth, baseHeight, mainHeight] = this.getWidthHeigth(isDesktop);
        const vm = {
            dataList: [],
            postData: [...postData],
            loading: true,
        };
        return gvc.glitter.innerDialog(gvc => {
            const id = gvc.glitter.getUUID();
            ApiUser.getUserGroupList('level').then(r => {
                var _a;
                if (r.result && Array.isArray((_a = r.response) === null || _a === void 0 ? void 0 : _a.data)) {
                    vm.dataList = r.response.data.map((d) => ({
                        key: d.tag || 'default',
                        name: d.title.replace('會員等級 - ', ''),
                    }));
                }
                vm.loading = false;
                gvc.notifyDataChange(id);
            });
            function checkboxList() {
                return [
                    BgWidget.tripletCheckboxContainer(gvc, '會員階級', (() => {
                        if (vm.postData.length === 0)
                            return -1;
                        return vm.postData.length === vm.dataList.length ? 1 : 0;
                    })(), r => {
                        vm.postData = r === 1 ? vm.dataList.map(({ key }) => key) : [];
                        gvc.notifyDataChange(id);
                    }),
                    BgWidget.horizontalLine(),
                    BgWidget.grayNote('※只有被選取的會員才能設置專屬價格，其餘依售價計算', 'margin-bottom: 12px;'),
                    BgWidget.multiCheckboxContainer(gvc, vm.dataList, vm.postData, text => {
                        vm.postData = text;
                        gvc.notifyDataChange(id);
                    }),
                ].join('');
            }
            return gvc.bindView({
                bind: id,
                view: () => html ` <div
            class="bg-white shadow ${isDesktop ? 'rounded-3' : ''}"
            style="overflow-y: auto; width: ${baseWidth}; height: ${baseHeight};"
          >
            <div class="h-100">
              ${vm.loading
                    ? html `<div class="h-100 d-flex">${BgWidget.spinner()}</div>`
                    : html ` <div
                    class="bg-white shadow rounded-3"
                    style="width: 100%; max-height: 100%; overflow-y: auto; position: relative;"
                  >
                    <div
                      class="w-100 d-flex align-items-center p-3 border-bottom"
                      style="position: sticky; top: 0; z-index: 2; background: #fff;"
                    >
                      <div class="tx_700">會員等級價格設定</div>
                      <div class="flex-fill"></div>
                      <i
                        class="fa-regular fa-circle-xmark fs-5 text-dark cursor_pointer"
                        onclick="${gvc.event(() => gvc.closeDialog())}"
                      ></i>
                    </div>
                    <div class="c_dialog h-100">
                      <div class="c_dialog_body h-100">
                        <div class="c_dialog_main h-100" style="min-height: ${mainHeight}; padding: 20px; gap: 0;">
                          ${vm.dataList.length > 0
                        ? checkboxList()
                        : '尚未建立會員等級，請至「顧客管理」>「會員等級」新增'}
                        </div>
                        <div class="c_dialog_bar" style="z-index: 2;">
                          ${BgWidget.cancel(gvc.event(() => gvc.closeDialog()))}
                          ${BgWidget.save(gvc.event(() => {
                        callback(vm.postData);
                        gvc.closeDialog();
                    }), '確認')}
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
    static setStorePriceSetting(obj) {
        const { gvc, postData, callback } = obj;
        const isDesktop = document.body.clientWidth > 768;
        const [baseWidth, baseHeight, mainHeight] = this.getWidthHeigth(isDesktop);
        const vm = {
            dataList: [],
            postData: [...postData],
            loading: true,
        };
        return gvc.glitter.innerDialog(gvc => {
            const id = gvc.glitter.getUUID();
            ApiUser.getPublicConfig('store_manager', 'manager').then((r) => {
                if (r.result && Array.isArray(r.response.value.list)) {
                    vm.dataList = r.response.value.list
                        .filter((d) => d.is_shop)
                        .map((d) => ({
                        key: d.id,
                        name: d.name,
                    }));
                }
                vm.loading = false;
                gvc.notifyDataChange(id);
            });
            function checkboxList() {
                return [
                    html ` <div class="d-none gap-2 mb-3">
            <div class="textbox textbox-uncheck">依照門市</div>
            <div class="textbox textbox-checked">依照門市標籤</div>
          </div>`,
                    BgWidget.tripletCheckboxContainer(gvc, '門市名稱', (() => {
                        if (vm.postData.length === 0)
                            return -1;
                        return vm.postData.length === vm.dataList.length ? 1 : 0;
                    })(), r => {
                        vm.postData = r === 1 ? vm.dataList.map(({ key }) => key) : [];
                        gvc.notifyDataChange(id);
                    }),
                    BgWidget.horizontalLine(),
                    BgWidget.grayNote('※只有被選取的門市/標籤才能設置專屬價格，其餘依售價計算', 'margin-bottom: 12px;'),
                    BgWidget.multiCheckboxContainer(gvc, vm.dataList, vm.postData, text => {
                        vm.postData = text;
                        gvc.notifyDataChange(id);
                    }),
                ].join('');
            }
            return gvc.bindView({
                bind: id,
                view: () => html ` <div
            class="bg-white shadow ${isDesktop ? 'rounded-3' : ''}"
            style="overflow-y: auto; width: ${baseWidth}; height: ${baseHeight};"
          >
            <div class="h-100">
              ${vm.loading
                    ? html `<div class="h-100 d-flex">${BgWidget.spinner()}</div>`
                    : html ` <div
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
                          ${vm.dataList.length > 0
                        ? checkboxList()
                        : '尚未建立門市，請至「庫存管理」>「庫存點管理」新增'}
                        </div>
                        <div class="c_dialog_bar" style="z-index: 2;">
                          ${BgWidget.cancel(gvc.event(() => gvc.closeDialog()))}
                          ${BgWidget.save(gvc.event(() => {
                        callback(vm.postData);
                        gvc.closeDialog();
                    }), '確認')}
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
    static setUserTagPriceSetting(obj) {
        const { gvc, postData, callback } = obj;
        const isDesktop = document.body.clientWidth > 768;
        const [baseWidth, baseHeight, mainHeight] = this.getWidthHeigth(isDesktop);
        const vm = {
            dataList: [],
            postData: [...postData],
            loading: true,
        };
        return gvc.glitter.innerDialog(gvc => {
            const id = gvc.glitter.getUUID();
            ApiUser.getPublicConfig('user_general_tags', 'manager').then((r) => {
                if (r.result && Array.isArray(r.response.value.list)) {
                    vm.dataList = r.response.value.list.map((tag) => ({ key: tag, name: tag }));
                }
                vm.loading = false;
                gvc.notifyDataChange(id);
            });
            function checkboxList() {
                return [
                    BgWidget.tripletCheckboxContainer(gvc, '顧客標籤', (() => {
                        if (vm.postData.length === 0)
                            return -1;
                        return vm.postData.length === vm.dataList.length ? 1 : 0;
                    })(), r => {
                        vm.postData = r === 1 ? vm.dataList.map(({ key }) => key) : [];
                        gvc.notifyDataChange(id);
                    }),
                    BgWidget.horizontalLine(),
                    BgWidget.grayNote('※只有被選取的會員才能設置專屬價格，其餘依售價計算', 'margin-bottom: 12px;'),
                    BgWidget.multiCheckboxContainer(gvc, vm.dataList, vm.postData, text => {
                        vm.postData = text;
                        gvc.notifyDataChange(id);
                    }),
                ].join('');
            }
            return gvc.bindView({
                bind: id,
                view: () => html ` <div
            class="bg-white shadow ${isDesktop ? 'rounded-3' : ''}"
            style="overflow-y: auto; width: ${baseWidth}; height: ${baseHeight};"
          >
            <div class="h-100">
              ${vm.loading
                    ? html `<div class="h-100 d-flex">${BgWidget.spinner()}</div>`
                    : html ` <div
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
                          ${vm.dataList.length > 0
                        ? checkboxList()
                        : '尚未建立顧客標籤，請編輯任一顧客的「顧客標籤」欄位'}
                        </div>
                        <div class="c_dialog_bar" style="z-index: 2;">
                          ${BgWidget.cancel(gvc.event(() => gvc.closeDialog()))}
                          ${BgWidget.save(gvc.event(() => {
                        callback(vm.postData);
                        gvc.closeDialog();
                    }), '確認')}
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
    static useProductTags(obj) {
        const gvc = obj.gvc;
        const vmt = {
            id: gvc.glitter.getUUID(),
            loading: true,
            search: '',
            dataList: [],
            postData: obj.def,
        };
        return BgWidget.settingDialog({
            gvc,
            title: '使用現有標籤',
            innerHTML: gvc2 => {
                return gvc2.bindView({
                    bind: vmt.id,
                    view: () => {
                        if (vmt.loading) {
                            return BgWidget.spinner();
                        }
                        else {
                            return [
                                html `<div class="position-sticky px-1" style="top: 0; background-color: #fff;">
                  ${BgWidget.searchPlace(gvc2.event(e => {
                                    vmt.search = e.value;
                                    vmt.loading = true;
                                    gvc2.notifyDataChange(vmt.id);
                                }), vmt.search, '搜尋標籤', '0', '0')}
                </div>`,
                                BgWidget.renderOptions(gvc2, vmt),
                            ].join(BgWidget.mbContainer(18));
                        }
                    },
                    divCreate: {},
                    onCreate: () => {
                        if (vmt.loading) {
                            ApiUser.getPublicConfig(obj.config_key, 'manager').then((dd) => {
                                var _a, _b;
                                if (dd.result && ((_b = (_a = dd.response) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.list)) {
                                    const responseList = obj.config_lang
                                        ? dd.response.value.list[obj.config_lang]
                                        : dd.response.value.list;
                                    const list = [...new Set([...responseList, ...obj.def])];
                                    vmt.dataList = list.filter((item) => item.includes(vmt.search));
                                }
                                vmt.loading = false;
                                gvc2.notifyDataChange(vmt.id);
                            });
                        }
                    },
                });
            },
            footer_html: gvc2 => {
                return [
                    html `<div
            style="color: #393939; text-decoration-line: underline; cursor: pointer"
            onclick="${gvc2.event(() => {
                        vmt.postData = [];
                        vmt.loading = true;
                        gvc2.notifyDataChange(vmt.id);
                    })}"
          >
            清除全部
          </div>`,
                    BgWidget.cancel(gvc2.event(() => {
                        gvc2.closeDialog();
                    })),
                    BgWidget.save(gvc2.event(() => {
                        obj.callback(vmt.postData);
                        gvc2.closeDialog();
                    })),
                ].join('');
            },
        });
    }
    static getProductGeneralTag() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ApiUser.getPublicConfig('product_general_tags', 'manager').then((dd) => {
                var _a, _b, _c, _d, _e, _f;
                if (dd.result && ((_b = (_a = dd.response) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.list)) {
                    const defaultLanguage = (_f = (_e = (_d = (_c = window.parent) === null || _c === void 0 ? void 0 : _c.store_info) === null || _d === void 0 ? void 0 : _d.language_setting) === null || _e === void 0 ? void 0 : _e.def) !== null && _f !== void 0 ? _f : 'zh-TW';
                    const result = [];
                    for (const [lang, tags] of Object.entries(dd.response.value.list)) {
                        tags.forEach(tag => {
                            result.push({
                                lang: lang,
                                tag,
                            });
                        });
                    }
                    return result
                        .filter(item => item.tag && item.lang === defaultLanguage)
                        .map(item => {
                        return {
                            key: item.tag,
                            name: `#${item.tag}`,
                        };
                    });
                }
                return [];
            });
        });
    }
    static getProductManagerTag() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ApiUser.getPublicConfig('product_manager_tags', 'manager').then((dd) => {
                var _a, _b;
                if (dd.result && ((_b = (_a = dd.response) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.list)) {
                    return dd.response.value.list.filter(Boolean).map((item) => {
                        return {
                            key: item,
                            name: `#${item}`,
                        };
                    });
                }
                return [];
            });
        });
    }
    static getCollectonCheckData() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                try {
                    let collections = [];
                    this.getCollectionAllOpts(collections, () => {
                        resolve(collections.map(item => {
                            return {
                                key: `${item.key}`,
                                name: item.value,
                            };
                        }));
                    });
                }
                catch (error) {
                    console.error(error);
                }
            });
        });
    }
}
BgProduct.getProductOpts = (def, productType) => {
    return new Promise(resolve => {
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
            const options = data.response.data.map((product) => {
                var _a;
                return ({
                    key: product.content.id,
                    value: product.content.title,
                    image: (_a = product.content.preview_image[0]) !== null && _a !== void 0 ? _a : BgWidget.noImageURL,
                });
            });
            resolve(options);
        });
    });
};
BgProduct.getCollectionAllOpts = (options, callback) => {
    function cc(cols, pre) {
        var _a;
        const str = pre.length > 0 ? pre + ' / ' + cols.title : cols.title;
        options.push({ key: str, value: BgProduct.replaceAngle(str), image: BgWidget.noImageURL });
        for (const col of (_a = cols.array) !== null && _a !== void 0 ? _a : []) {
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
BgProduct.getCollectiosOpts = (def) => {
    const opts = [];
    function cc(cols, pre) {
        var _a;
        const str = pre.length > 0 ? pre + ' / ' + cols.title : cols.title;
        def.includes(str) && opts.push({ key: str, value: BgProduct.replaceAngle(str), image: BgWidget.noImageURL });
        for (const col of (_a = cols.array) !== null && _a !== void 0 ? _a : []) {
            cc(col, str);
        }
    }
    return new Promise(resolve => {
        ApiShop.getCollection().then(data => {
            for (const value of data.response.value) {
                cc(value, '');
            }
            resolve(opts);
        });
    });
};
