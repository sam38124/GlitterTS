import { BgWidget } from '../backend-manager/bg-widget.js';
import { BgListComponent } from '../backend-manager/bg-list-component.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { FilterOptions } from './filter-options.js';
import { BgProduct } from '../backend-manager/bg-product.js';
import { ShoppingProductSetting } from './shopping-product-setting.js';
import { Tool } from '../modules/tool.js';
const html = String.raw;
export class StockList {
    static main(gvc, option = {
        title: '庫存管理',
        select_data: [],
        select_mode: false,
        filter_variants: [],
    }, productType = 'all') {
        const glitter = gvc.glitter;
        const defaultNull = '－';
        const vm = {
            id: glitter.getUUID(),
            type: 'list',
            data: {},
            dataList: undefined,
            query: '',
            queryType: '',
            orderString: '',
            filter: {},
            filterId: glitter.getUUID(),
            tableId: glitter.getUUID(),
            updateId: glitter.getUUID(),
            stockArray: [],
            stockOriginArray: [],
            replaceData: {},
            stockStores: [],
        };
        const ListComp = new BgListComponent(gvc, vm, FilterOptions.stockFilterFrame);
        vm.filter = ListComp.getFilterObject();
        let vmi = undefined;
        function getDatalist() {
            return vm.dataList.map((dd, index) => {
                var _a;
                dd.variant_content.stockList = vm.stockStores.map((store, index) => {
                    var _a;
                    if (!dd.variant_content.stockList) {
                        return {
                            id: store.id,
                            value: index === 0 ? dd.variant_content.stock : 0,
                        };
                    }
                    const st = (_a = dd.variant_content.stockList) === null || _a === void 0 ? void 0 : _a.find((item) => item.id === store.id);
                    return {
                        id: store.id,
                        value: st ? st.value : 0,
                    };
                });
                vm.stockArray[index] = dd.variant_content.stockList;
                return [
                    {
                        key: '商品名稱',
                        value: html ` <div class="d-flex align-items-center gap-3" style="min-width: 250px;">
                            ${BgWidget.validImageBox({
                            gvc,
                            image: dd.product_content.preview_image[0],
                            width: 40,
                            class: 'rounded border ms-1',
                        })}
                            <div class="d-flex flex-column">
                                <span class="tx_normal">${Tool.truncateString(dd.product_content.title)}</span>
                                ${BgWidget.grayNote(Tool.truncateString(dd.variant_content.spec.length > 0 ? dd.variant_content.spec.join(' / ') : '單一規格', 25), 'font-size: 16px;')}
                            </div>
                        </div>`,
                    },
                    {
                        key: '庫存單位（SKU）',
                        value: html `<span class="fs-7">${dd.variant_content.sku && dd.variant_content.sku.length > 0 ? dd.variant_content.sku : '沒有庫存單位'}</span>`,
                    },
                    {
                        key: '成本',
                        value: html `<div class="fs-7" style="min-width: 100px;">${dd.variant_content.cost ? `$${parseInt(`${dd.variant_content.cost}`, 10).toLocaleString()}` : defaultNull}</div>`,
                    },
                    {
                        key: '安全庫存',
                        value: html `<span class="fs-7">${(_a = dd.variant_content.save_stock) !== null && _a !== void 0 ? _a : defaultNull}</span>`,
                    },
                    ...vm.stockStores.map((store) => {
                        var _a, _b;
                        const stockData = dd.variant_content.stockList.find((stock) => stock.id === store.id);
                        return {
                            key: store.name,
                            value: dd.variant_content.show_understocking === 'true'
                                ? option.select_mode
                                    ? html `<span class="fs-7">${(_a = stockData.value) !== null && _a !== void 0 ? _a : 0}</span>`
                                    : html ` <div
                                              style="width: 95px"
                                              onclick="${gvc.event((e, event) => {
                                        event.stopPropagation();
                                    })}"
                                          >
                                              <input
                                                  class="form-control"
                                                  type="number"
                                                  min="0"
                                                  style="border-radius: 10px; border: 1px solid #DDD; padding-left: 18px;"
                                                  placeholder="請輸入數值"
                                                  onchange="${gvc.event((e) => {
                                        let n = parseInt(e.value, 10);
                                        if (n < 0) {
                                            e.value = 0;
                                            n = 0;
                                        }
                                        stockData.value = n;
                                        dd.product_content.variants.map((variant) => {
                                            if (JSON.stringify(variant.spec) === JSON.stringify(dd.variant_content.spec)) {
                                                variant.stock = dd.variant_content.stockList.reduce((sum, item) => {
                                                    return sum + item.value;
                                                }, 0);
                                            }
                                        });
                                        vm.dataList.map((item) => {
                                            if (item.product_id === dd.product_id) {
                                                item.product_content = dd.product_content;
                                            }
                                        });
                                        gvc.notifyDataChange(vm.updateId);
                                    })}"
                                                  value="${(_b = stockData.value) !== null && _b !== void 0 ? _b : 0}"
                                              />
                                          </div>`
                                : html `<span class="fs-7">${defaultNull}</div>`,
                        };
                    }),
                    {
                        key: '商品種類',
                        value: html `<div class="fs-7" style="min-width: 120px;">${ShoppingProductSetting.getProductTypeString(dd.product_content)}</div>`,
                    },
                    {
                        key: '商品狀態',
                        value: ShoppingProductSetting.getOnboardStatus(dd.product_content),
                    },
                ];
            });
        }
        return gvc.bindView({
            bind: vm.id,
            dataList: [{ obj: vm, key: 'type' }],
            view: () => {
                if (vm.type === 'list') {
                    return BgWidget.container(html `
                            <div class="title-container">
                                ${BgWidget.title(option.title)}
                                <div class="flex-fill"></div>
                                <div style="display: none; gap: 14px;">
                                    ${BgWidget.grayButton('匯入', gvc.event(() => { }))}${BgWidget.grayButton('匯出', gvc.event(() => { }))}
                                </div>
                            </div>
                            ${BgWidget.container([
                        BgWidget.mainCard([
                            (() => {
                                const vmlist = {
                                    id: glitter.getUUID(),
                                    loading: true,
                                    collections: [],
                                };
                                return gvc.bindView({
                                    bind: vmlist.id,
                                    view: () => {
                                        var _a;
                                        if (vmlist.loading) {
                                            return '';
                                        }
                                        if (FilterOptions.stockFunnel.findIndex((item) => item.key === 'collection') === -1) {
                                            FilterOptions.stockFunnel.splice(1, 0, {
                                                key: 'collection',
                                                type: 'multi_checkbox',
                                                name: '商品分類',
                                                data: vmlist.collections.map((item) => {
                                                    return {
                                                        key: `${item.key}`,
                                                        name: item.value,
                                                    };
                                                }),
                                            });
                                        }
                                        const filterList = [
                                            BgWidget.selectFilter({
                                                gvc,
                                                callback: (value) => {
                                                    vm.queryType = value;
                                                    gvc.notifyDataChange(vm.tableId);
                                                    gvc.notifyDataChange(vmlist.id);
                                                },
                                                default: vm.queryType || 'name',
                                                options: FilterOptions.stockSelect,
                                            }),
                                            BgWidget.searchFilter(gvc.event((e) => {
                                                vm.query = `${e.value}`.trim();
                                                gvc.notifyDataChange(vm.tableId);
                                                gvc.notifyDataChange(vmlist.id);
                                            }), vm.query || '', '搜尋商品'),
                                            BgWidget.funnelFilter({
                                                gvc,
                                                callback: () => ListComp.showRightMenu(FilterOptions.stockFunnel),
                                            }),
                                            BgWidget.updownFilter({
                                                gvc,
                                                callback: (value) => {
                                                    vm.orderString = value;
                                                    gvc.notifyDataChange(vm.tableId);
                                                    gvc.notifyDataChange(vmlist.id);
                                                },
                                                default: vm.orderString || 'default',
                                                options: FilterOptions.stockOrderBy,
                                            }),
                                        ];
                                        const filterTags = ListComp.getFilterTags(FilterOptions.stockFunnel).replace(/多少/g, '');
                                        if (document.body.clientWidth < 768) {
                                            return html ` <div style="display: flex; align-items: center; gap: 10px; width: 100%; justify-content: space-between">
                                                                    <div>${filterList[0]}</div>
                                                                    <div style="display: flex;">${filterList[2] ? `<div class="me-2">${filterList[2]}</div>` : ''} ${(_a = filterList[3]) !== null && _a !== void 0 ? _a : ''}</div>
                                                                </div>
                                                                <div style="display: flex; margin-top: 8px;">${filterList[1]}</div>
                                                                <div>${filterTags}</div>`;
                                        }
                                        else {
                                            return html ` <div style="display: flex; align-items: center; gap: 10px;">${filterList.join('')}</div>
                                                                <div>${filterTags}</div>`;
                                        }
                                    },
                                    onCreate: () => {
                                        if (vmlist.loading) {
                                            BgProduct.getCollectionAllOpts(vmlist.collections, () => {
                                                vmlist.loading = false;
                                                gvc.notifyDataChange(vmlist.id);
                                            });
                                        }
                                    },
                                });
                            })(),
                            gvc.bindView({
                                bind: vm.tableId,
                                view: () => {
                                    try {
                                        return BgWidget.tableV3({
                                            gvc: gvc,
                                            getData: (vd) => {
                                                vmi = vd;
                                                const limit = 15;
                                                Promise.all([
                                                    new Promise((resolve, reject) => {
                                                        ApiUser.getPublicConfig('store_manager', 'manager').then((dd) => {
                                                            if (dd.result && dd.response.value && dd.response.value.list) {
                                                                resolve(dd.response.value.list);
                                                            }
                                                            else {
                                                                resolve({});
                                                            }
                                                        });
                                                    }),
                                                    new Promise((resolve, reject) => {
                                                        ApiShop.getVariants({
                                                            page: vmi.page - 1,
                                                            limit: limit,
                                                            search: vm.query || undefined,
                                                            searchType: vm.queryType || 'title',
                                                            orderBy: vm.orderString || undefined,
                                                            status: (() => {
                                                                if (vm.filter.status && vm.filter.status.length > 0) {
                                                                    return vm.filter.status.join(',');
                                                                }
                                                                return undefined;
                                                            })(),
                                                            collection: vm.filter.collection,
                                                            stockCount: vm.filter.count,
                                                            accurate_search_collection: true,
                                                            productType: productType,
                                                        }).then((data) => {
                                                            resolve(data);
                                                        });
                                                    }),
                                                ]).then((dataArray) => {
                                                    vm.stockStores = dataArray[0];
                                                    const data = dataArray[1];
                                                    data.response.data = data.response.data.filter((dd) => {
                                                        return !option.filter_variants.includes([dd.product_id].concat(dd.variant_content.spec).join('-'));
                                                    });
                                                    vm.dataList = data.response.data;
                                                    vmi.pageSize = Math.ceil(data.response.total / limit);
                                                    vmi.originalData = vm.dataList;
                                                    vmi.tableData = getDatalist();
                                                    vm.stockOriginArray = JSON.parse(JSON.stringify(vm.stockArray));
                                                    gvc.notifyDataChange(vm.updateId);
                                                    vmi.loading = false;
                                                    vmi.callback();
                                                });
                                            },
                                            itemSelect: () => {
                                                while (option.select_data.length > 0) {
                                                    option.select_data.shift();
                                                }
                                                for (const b of vm.dataList) {
                                                    if (b.checked) {
                                                        option.select_data.push({
                                                            variant: b.variant_content,
                                                            product_id: b.product_id,
                                                        });
                                                    }
                                                }
                                            },
                                            rowClick: (data, index) => {
                                                if (option.select_mode) {
                                                    return;
                                                }
                                                const product = vm.dataList[index].product_content;
                                                const variant = vm.dataList[index].variant_content;
                                                product.variants.map((dd) => {
                                                    dd.editable = JSON.stringify(variant.spec) === JSON.stringify(dd.spec);
                                                });
                                                vm.replaceData = product;
                                                vm.type = 'editSpec';
                                            },
                                            filter: option.select_mode
                                                ? [
                                                    {
                                                        name: '選擇項目',
                                                        event: () => { },
                                                    },
                                                ]
                                                : [],
                                        });
                                    }
                                    catch (e) {
                                        console.error(e);
                                        return `${e}`;
                                    }
                                },
                            }),
                        ].join('')),
                        BgWidget.mbContainer(240),
                        gvc.bindView({
                            bind: vm.updateId,
                            view: () => {
                                function areArraysEqual(arr1, arr2) {
                                    if (arr1.length !== arr2.length)
                                        return false;
                                    return arr1.every((item, index) => {
                                        const otherItem = arr2[index];
                                        return JSON.stringify(item) === JSON.stringify(otherItem);
                                    });
                                }
                                for (let i = 0; i < vm.stockArray.length; i++) {
                                    if (!areArraysEqual(vm.stockArray[i], vm.stockOriginArray[i])) {
                                        return html ` <div class="update-bar-container">
                                                        ${BgWidget.cancel(gvc.event(() => {
                                            gvc.notifyDataChange(vm.tableId);
                                        }))}
                                                        ${BgWidget.save(gvc.event(() => {
                                            const dialog = new ShareDialog(gvc.glitter);
                                            dialog.dataLoading({
                                                text: '更新庫存中',
                                                visible: true,
                                            });
                                            ApiShop.putVariants({
                                                data: vm.dataList,
                                                token: window.parent.config.token,
                                            }).then((re) => {
                                                dialog.dataLoading({ visible: false });
                                                if (re.result) {
                                                    dialog.successMessage({ text: '更新成功' });
                                                    gvc.notifyDataChange(vm.tableId);
                                                }
                                                else {
                                                    dialog.errorMessage({ text: '更新失敗' });
                                                }
                                            });
                                        }))}
                                                    </div>`;
                                    }
                                }
                                return '';
                            },
                        }),
                    ].join(''))}
                        `);
                }
                else if (vm.type === 'editSpec') {
                    try {
                        return ShoppingProductSetting.editProductSpec({
                            vm: vm,
                            gvc: gvc,
                            defData: vm.replaceData,
                            goBackEvent: {
                                save: (postMD) => {
                                    const dialog = new ShareDialog(gvc.glitter);
                                    ApiShop.putProduct({
                                        data: postMD,
                                        token: window.parent.config.token,
                                    }).then((re) => {
                                        dialog.dataLoading({ visible: false });
                                        if (re.result) {
                                            dialog.successMessage({ text: `更改成功` });
                                            vm.type = 'list';
                                        }
                                        else {
                                            dialog.errorMessage({ text: `上傳失敗` });
                                        }
                                    });
                                },
                                cancel: () => {
                                    vm.type = 'list';
                                },
                            },
                        });
                    }
                    catch (e) {
                        console.error('editProductSpec error', e);
                        return '';
                    }
                }
                else {
                    return '';
                }
            },
        });
    }
}
window.glitter.setModule(import.meta.url, StockList);
