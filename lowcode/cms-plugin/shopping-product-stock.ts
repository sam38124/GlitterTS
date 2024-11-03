import { GVC } from '../glitterBundle/GVController.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { BgListComponent } from '../backend-manager/bg-list-component.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { FilterOptions } from './filter-options.js';
import { BgProduct, OptionsItem } from '../backend-manager/bg-product.js';
import { ShoppingProductSetting } from './shopping-product-setting.js';
import { Tool } from '../modules/tool.js';

const html = String.raw;

interface ViewModel {
    id: string;
    filterId: string;
    tableId: string;
    updateId: string;
    type: 'list' | 'editSpec';
    data: any;
    dataList: any;
    query?: string;
    queryType?: string;
    orderString?: string;
    filter?: any;
    stockList: number[];
    stockOriginList: number[];
    replaceData?: any;
}

export class StockList {
    public static main(
        gvc: GVC,
        option: {
            title: string;
            select_mode: boolean;
            select_data: { variant:any,product_id:string }[];
            filter_variants: string[];
        } = {
            title: '庫存管理',
            select_data: [],
            select_mode: false,
            filter_variants: []
        },
        productType:'product' | 'addProduct' | 'giveaway' | 'hidden' | 'all' ='all'
    ) {
        const glitter = gvc.glitter;

        const vm: ViewModel = {
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
            stockList: [] as number[],
            stockOriginList: [] as number[],
            replaceData: {},
        };

        const ListComp = new BgListComponent(gvc, vm, FilterOptions.stockFilterFrame);
        vm.filter = ListComp.getFilterObject();
        let vmi: any = undefined;

        function getDatalist() {
            return vm.dataList.map((dd: any, index: number) => {
                vm.stockList[index] = dd.variant_content.stock;
                return [
                    {
                        key: '商品名稱',
                        value: html` <div class="d-flex align-items-center gap-3">
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
                        value: `<span class="fs-7">${dd.variant_content.save_stock ?? '-'}</span>`,
                    },
                    {
                        key: '庫存數量',
                        value: option.select_mode
                            ? html`<span class="fs-7">${dd.variant_content.stock ?? 0}</span>`
                            : html` <div
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

                                          dd.product_content.variants.map((variant: { spec: string[]; stock: number }) => {
                                              if (JSON.stringify(variant.spec) === JSON.stringify(dd.variant_content.spec)) {
                                                  variant.stock = n;
                                              }
                                          });

                                          vm.dataList.map((item: any) => {
                                              if (item.product_id === dd.product_id) {
                                                  item.product_content = dd.product_content;
                                              }
                                          });

                                          vm.stockList[index] = n;
                                          gvc.notifyDataChange(vm.updateId);
                                      })}"
                                      value="${dd.variant_content.stock ?? 0}"
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
                    return BgWidget.container(
                        html`
                            <div class="title-container">
                                ${BgWidget.title(option.title)}
                                <div class="flex-fill"></div>
                                <div style="display: none; gap: 14px;">
                                    ${BgWidget.grayButton(
                                        '匯入',
                                        gvc.event(() => {})
                                    )}${BgWidget.grayButton(
                                        '匯出',
                                        gvc.event(() => {})
                                    )}
                                </div>
                            </div>
                            ${BgWidget.container(
                                [
                                    BgWidget.mainCard(
                                        [
                                            (() => {
                                                const vmlist = {
                                                    id: glitter.getUUID(),
                                                    loading: true,
                                                    collections: [] as OptionsItem[],
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
                                                                callback: (value: any) => {
                                                                    vm.queryType = value;
                                                                    gvc.notifyDataChange(vm.tableId);
                                                                    gvc.notifyDataChange(vmlist.id);
                                                                },
                                                                default: vm.queryType || 'name',
                                                                options: FilterOptions.stockSelect,
                                                            }),
                                                            BgWidget.searchFilter(
                                                                gvc.event((e) => {
                                                                    vm.query = e.value;
                                                                    gvc.notifyDataChange(vm.tableId);
                                                                    gvc.notifyDataChange(vmlist.id);
                                                                }),
                                                                vm.query || '',
                                                                '搜尋商品'
                                                            ),
                                                            BgWidget.funnelFilter({
                                                                gvc,
                                                                callback: () => ListComp.showRightMenu(FilterOptions.stockFunnel),
                                                            }),
                                                            BgWidget.updownFilter({
                                                                gvc,
                                                                callback: (value: any) => {
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
                                                            // 手機版
                                                            return html` <div style="display: flex; align-items: center; gap: 10px; width: 100%; justify-content: space-between">
                                                                    <div>${filterList[0]}</div>
                                                                    <div style="display: flex;">
                                                                        <div class="me-2">${filterList[2]}</div>
                                                                        ${filterList[3]}
                                                                    </div>
                                                                </div>
                                                                <div style="display: flex; margin-top: 8px;">${filterList[1]}</div>
                                                                <div>${filterTags}</div>`;
                                                        } else {
                                                            // 電腦版
                                                            return html` <div style="display: flex; align-items: center; gap: 10px;">${filterList.join('')}</div>
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
                                                                    productType:productType
                                                                }).then((data) => {
                                                                    data.response.data=data.response.data.filter((dd:any)=>{
                                                                        return  !option.filter_variants.includes([dd.product_id].concat(dd.variant_content.spec).join('-'))
                                                                    })
                                                                    vm.dataList = data.response.data;
                                                                    vmi.pageSize = Math.ceil(data.response.total / limit);
                                                                    vmi.originalData = vm.dataList;
                                                                    vmi.tableData = getDatalist();
                                                                    vm.stockOriginList = vm.stockList.concat();
                                                                    gvc.notifyDataChange(vm.updateId);
                                                                    vmi.loading = false;
                                                                    vmi.callback();
                                                                });
                                                            },
                                                            item_select:()=>{
                                                                console.log(vm.dataList)
                                                                while (option.select_data.length > 0) {
                                                                    option.select_data.shift();
                                                                }
                                                                for (const  b of  vm.dataList){
                                                                    if(b.checked){
                                                                        option.select_data.push({
                                                                            variant:b.variant_content,
                                                                            product_id:b.product_id
                                                                        })
                                                                    }
                                                                }
                                                                // if(vm.dataList[index].checked){
                                                                //     option.select_data.push({
                                                                //         variant:vm.dataList[index].variant,
                                                                //         product_id:vm.dataList[index].product_content.id
                                                                //     })
                                                                //     console.log(vm.dataList[index])
                                                                // }
                                                                // vmi.data = getDatalist();
                                                                // gvc.glitter.recreateView('.check-box-item');
                                                                // gvc.notifyDataChange(vm.filterId);
                                                            },
                                                            rowClick: (data, index) => {
                                                                const product = vm.dataList[index].product_content;
                                                                const variant = vm.dataList[index].variant_content;
                                                                product.variants.map((dd: any) => {
                                                                    dd.editable = JSON.stringify(variant.spec) === JSON.stringify(dd.spec);
                                                                });
                                                                vm.replaceData = product;
                                                                vm.type = 'editSpec';
                                                            },
                                                            filter:(option.select_mode)  ? [
                                                                {
                                                                    name: '選擇項目',
                                                                    event: (checkedData) => {
                                                                     
                                                                    },
                                                                },
                                                            ]:[],
                                                        });
                                                    }catch (e) {
                                                        console.log(e)
                                                        return  `${e}`
                                                    }
                                                  
                                                },
                                            }),
                                        ].join('')
                                    ),
                                    // 空白容器
                                    BgWidget.mbContainer(240),
                                    // 儲存資料
                                    gvc.bindView({
                                        bind: vm.updateId,
                                        view: () => {
                                            for (let i = 0; i < vm.stockList.length; i++) {
                                                const element = vm.stockList[i];
                                                if (element !== vm.stockOriginList[i]) {
                                                    return html` <div class="update-bar-container">
                                                        ${BgWidget.cancel(
                                                            gvc.event(() => {
                                                                gvc.notifyDataChange(vm.tableId);
                                                            })
                                                        )}
                                                        ${BgWidget.save(
                                                            gvc.event(() => {
                                                                const dialog = new ShareDialog(gvc.glitter);
                                                                dialog.dataLoading({
                                                                    text: '更新庫存中',
                                                                    visible: true,
                                                                });
                                                                ApiShop.putVariants({
                                                                    data: vm.dataList,
                                                                    token: (window.parent as any).config.token,
                                                                }).then((re) => {
                                                                    dialog.dataLoading({ visible: false });
                                                                    if (re.result) {
                                                                        dialog.successMessage({ text: '更新成功' });
                                                                        gvc.notifyDataChange(vm.tableId);
                                                                    } else {
                                                                        dialog.errorMessage({ text: '更新失敗' });
                                                                    }
                                                                });
                                                            })
                                                        )}
                                                    </div>`;
                                                }
                                            }
                                            return '';
                                        },
                                    }),
                                ].join('')
                            )}
                        `
                    );
                } else if (vm.type === 'editSpec') {
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
                                        token: (window.parent as any).config.token,
                                    }).then((re) => {
                                        dialog.dataLoading({ visible: false });
                                        if (re.result) {
                                            dialog.successMessage({ text: `更改成功` });
                                            vm.type = 'list';
                                        } else {
                                            dialog.errorMessage({ text: `上傳失敗` });
                                        }
                                    });
                                },
                                cancel: () => {
                                    vm.type = 'list';
                                },
                            },
                        });
                    } catch (e) {
                        console.error('editProductSpec error', e);
                        return '';
                    }
                } else {
                    return '';
                }
            },
        });
    }
}

(window as any).glitter.setModule(import.meta.url, StockList);
