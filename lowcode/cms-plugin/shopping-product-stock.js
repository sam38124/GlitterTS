import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { BgListComponent } from '../backend-manager/bg-list-component.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
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
    }) {
        const glitter = gvc.glitter;
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
            stockList: [],
            stockOriginList: [],
            replaceData: {},
        };
        const ListComp = new BgListComponent(gvc, vm, FilterOptions.stockFilterFrame);
        vm.filter = ListComp.getFilterObject();
        let vmi = undefined;
        function getDatalist() {
            return vm.dataList.map((dd, index) => {
                var _a, _b, _c;
                vm.stockList[index] = dd.variant_content.stock;
                return [
                    {
                        key: gvc.bindView(() => {
                            const id = gvc.glitter.getUUID();
                            return {
                                bind: id,
                                view: () => {
                                    return EditorElem.checkBoxOnly({
                                        gvc: gvc,
                                        def: !vm.dataList.find((dd) => {
                                            return !dd.checked;
                                        }),
                                        callback: (result) => {
                                            vm.dataList.map((dd) => {
                                                dd.checked = result;
                                            });
                                            vmi.data = getDatalist();
                                            vmi.callback();
                                            gvc.notifyDataChange(vm.filterId);
                                        },
                                    });
                                },
                                divCreate: {
                                    class: `check-box-item`,
                                },
                            };
                        }),
                        value: gvc.bindView(() => {
                            const id = gvc.glitter.getUUID();
                            return {
                                bind: id,
                                view: () => {
                                    return EditorElem.checkBoxOnly({
                                        gvc: gvc,
                                        def: dd.checked,
                                        callback: (result) => {
                                            dd.checked = result;
                                            vmi.data = getDatalist();
                                            gvc.glitter.recreateView('.check-box-item');
                                            gvc.notifyDataChange(vm.filterId);
                                        },
                                        style: 'height:40px;',
                                    });
                                },
                                divCreate: {
                                    class: `check-box-item`,
                                },
                            };
                        }),
                    },
                    {
                        key: '商品名稱',
                        value: html ` <div class="d-flex align-items-center gap-3">
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
                        value: `<span class="fs-7">${dd.variant_content.sku && dd.variant_content.sku.length > 0 ? dd.variant_content.sku : '沒有庫存單位'}</span>`,
                    },
                    {
                        key: '安全庫存',
                        value: `<span class="fs-7">${(_a = dd.variant_content.save_stock) !== null && _a !== void 0 ? _a : '-'}</span>`,
                    },
                    {
                        key: '庫存數量',
                        value: option.select_mode
                            ? html `<span class="fs-7">${(_b = dd.variant_content.stock) !== null && _b !== void 0 ? _b : 0}</span>`
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
                                dd.variant_content.stock = n;
                                dd.product_content.variants.map((variant) => {
                                    if (JSON.stringify(variant.spec) === JSON.stringify(dd.variant_content.spec)) {
                                        variant.stock = n;
                                    }
                                });
                                vm.dataList.map((item) => {
                                    if (item.product_id === dd.product_id) {
                                        item.product_content = dd.product_content;
                                    }
                                });
                                vm.stockList[index] = n;
                                gvc.notifyDataChange(vm.updateId);
                            })}"
                                      value="${(_c = dd.variant_content.stock) !== null && _c !== void 0 ? _c : 0}"
                                  />
                              </div>`,
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
                            <div class="d-flex w-100 align-items-center">
                                ${BgWidget.title(option.title)}
                                <div class="flex-fill"></div>
                                <div style="display: none; gap: 14px;">
                                    ${BgWidget.grayButton('匯入', gvc.event(() => {
                        console.log('匯入');
                    }))}${BgWidget.grayButton('匯出', gvc.event(() => {
                        console.log('匯出');
                    }))}
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
                                                vm.query = e.value;
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
                                                                    <div style="display: flex;">
                                                                        <div class="me-2">${filterList[2]}</div>
                                                                        ${filterList[3]}
                                                                    </div>
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
                                    return BgWidget.tableV2({
                                        gvc: gvc,
                                        getData: (vd) => {
                                            vmi = vd;
                                            const limit = 15;
                                            ApiShop.getVariants({
                                                page: vmi.page - 1,
                                                limit: limit,
                                                search: vm.query || undefined,
                                                searchType: vm.queryType || 'title',
                                                orderBy: vm.orderString || undefined,
                                                status: (() => {
                                                    if (vm.filter.status && vm.filter.status.length === 1) {
                                                        switch (vm.filter.status[0]) {
                                                            case 'active':
                                                                return 'active';
                                                            case 'draft':
                                                                return 'draft';
                                                        }
                                                    }
                                                    return undefined;
                                                })(),
                                                collection: vm.filter.collection,
                                                stockCount: vm.filter.count,
                                                accurate_search_collection: true,
                                            }).then((data) => {
                                                vmi.pageSize = Math.ceil(data.response.total / limit);
                                                vm.dataList = data.response.data.filter((data) => {
                                                    return !option.filter_variants.find((dd) => {
                                                        return dd === [data.product_id].concat(data.variant_content.spec).join('-');
                                                    });
                                                });
                                                vmi.data = getDatalist();
                                                vm.stockOriginList = vm.stockList.concat();
                                                gvc.notifyDataChange(vm.updateId);
                                                vmi.callback();
                                            });
                                        },
                                        rowClick: (data, index) => {
                                            if (option.select_mode) {
                                                vm.dataList[index].checked = !vm.dataList[index].checked;
                                                vmi.data = getDatalist();
                                                gvc.glitter.recreateView('.check-box-item');
                                                gvc.notifyDataChange(vm.filterId);
                                            }
                                            else {
                                                const product = vm.dataList[index].product_content;
                                                const variant = vm.dataList[index].variant_content;
                                                product.variants.map((dd) => {
                                                    dd.editable = JSON.stringify(variant.spec) === JSON.stringify(dd.spec);
                                                });
                                                vm.replaceData = product;
                                                vm.type = 'editSpec';
                                            }
                                        },
                                        filter: gvc.bindView(() => {
                                            return {
                                                bind: vm.filterId,
                                                view: () => {
                                                    const selCount = vm.dataList.filter((dd) => dd.checked).length;
                                                    option.select_data.splice(0, option.select_data.length);
                                                    vm.dataList
                                                        .filter((dd) => dd.checked)
                                                        .map((dd) => {
                                                        option.select_data.push(dd);
                                                    });
                                                    return BgWidget.selNavbar({
                                                        count: selCount,
                                                        buttonList: [],
                                                    });
                                                },
                                                divCreate: () => {
                                                    const display = !vm.dataList || !vm.dataList.find((dd) => dd.checked) ? 'd-none' : '';
                                                    return {
                                                        class: `d-flex align-items-center p-2 ${display}`,
                                                        style: `min-height:45px;`,
                                                    };
                                                },
                                            };
                                        }),
                                    });
                                },
                            }),
                        ].join('')),
                        BgWidget.mbContainer(240),
                        gvc.bindView({
                            bind: vm.updateId,
                            view: () => {
                                for (let i = 0; i < vm.stockList.length; i++) {
                                    const element = vm.stockList[i];
                                    if (element !== vm.stockOriginList[i]) {
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
                                                    dialog.successMessage({ text: `上傳成功` });
                                                    gvc.notifyDataChange(vm.tableId);
                                                }
                                                else {
                                                    dialog.errorMessage({ text: `上傳失敗` });
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
                        `, BgWidget.getContainerWidth());
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
                        console.log(`editSpec===>`, e);
                        return ``;
                    }
                }
                else {
                    return ``;
                }
            },
        });
    }
}
window.glitter.setModule(import.meta.url, StockList);
