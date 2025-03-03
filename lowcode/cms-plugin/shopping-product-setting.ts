import {ShareDialog} from '../glitterBundle/dialog/ShareDialog.js';
import {BgWidget} from '../backend-manager/bg-widget.js';
import {GVC} from '../glitterBundle/GVController.js';
import {ApiShop} from '../glitter-base/route/shopping.js';
import {ApiPost} from '../glitter-base/route/post.js';
import {ApiUser} from '../glitter-base/route/user.js';
import {BgProduct, OptionsItem} from '../backend-manager/bg-product.js';
import {FilterOptions} from './filter-options.js';
import {BgListComponent} from '../backend-manager/bg-list-component.js';
import {Tool} from '../modules/tool.js';
import {imageLibrary} from '../modules/image-library.js';
import {ProductExcel, RowInitData} from './module/product-excel.js';
import {ProductService} from './product-service.js';
import {LanguageBackend} from './language-backend.js';
import {ProductConfig} from './product-config.js';
import {ShoppingSettingBasic} from "./shopping-setting-basic.js";
import {ShoppingSettingAdvance} from "./shopping-setting-advance.js";
import {ActiveSchedule, Product, ProductInitial} from "../public-models/product.js";
import {PayConfig} from "./pos-pages/pay-config.js";
import {IminModule} from "./pos-pages/imin-module.js";

const html = String.raw;

export class ShoppingProductSetting {
    public static select_language = (window.parent as any).store_info.language_setting.def;
    public static select_product_type: 'course' | 'commodity' = 'commodity'
    public static select_page_index = 0

    public static getSupportProductCategory() {
        const support_pd = [
            {
                key: 'course',
                value: '課程販售',
                compare: 'teaching'
            },
            {
                key: 'commodity',
                value: '零售商品',
                compare: 'shop'
            },
            {
                key: 'kitchen',
                value: '餐飲組合',
                compare: 'kitchen'
            }
        ].filter((dd) => {
            return ((window.parent as any).store_info.web_type || []).includes(dd.compare)
        })
        return support_pd
    }

    public static main(gvc: GVC, type: 'product' | 'addProduct' | 'giveaway' | 'hidden' = 'product') {
        const glitter = gvc.glitter;
        const dialog = new ShareDialog(glitter);
        const excelHeader = ProductExcel.exampleHeader();

        const vm: {
            id: string;
            tableId: string;
            type: 'list' | 'add' | 'replace' | 'editSpec' | 'ai-initial';
            dataList: any;
            query: string;
            last_scroll: number;
            queryType: string;
            orderString: string;
            filter?: any;
            replaceData: any;
            ai_initial: any;
        } = {
            id: glitter.getUUID(),
            tableId: glitter.getUUID(),
            type: 'list',
            dataList: undefined,
            query: '',
            last_scroll: 0,
            queryType: 'title',
            orderString: '',
            filter: {},
            replaceData: '',
            ai_initial: {},
        };

        const rowInitData: RowInitData = {
            name: '',
            status: '',
            category: '',
            productType: ``,
            img: '',
            SEO_domain: '',
            SEO_title: '',
            SEO_desc: '',
            spec1: '',
            spec1Value: '',
            spec2: '',
            spec2Value: '',
            spec3: '',
            spec3Value: '',
            sku: '',
            cost: '',
            sale_price: '',
            compare_price: '',
            benefit: '',
            shipment_type: '',
            length: '',
            width: '',
            height: '',
            weight: '',
            weightUnit: '',
            stockPolicy: '',
            stock: '',
            save_stock: '',
            barcode: '',
        };

        const excel = new ProductExcel(
            gvc,
            excelHeader.filter((item) => item !== '商品ID'),
            Object.keys(rowInitData)
        );

        const ListComp = new BgListComponent(gvc, vm, FilterOptions.productFilterFrame);
        vm.filter = ListComp.getFilterObject();

        //AI快速生成
        if (localStorage.getItem('add_product')) {
            vm.ai_initial = JSON.parse(localStorage.getItem('add_product') as string);
            vm.type = 'ai-initial';
            localStorage.removeItem('add_product');
        }
        return gvc.bindView(() => {
            return {
                dataList: [{obj: vm, key: 'type'}],
                bind: vm.id,
                view: () => {
                    gvc.addStyle(`
                        input[type='number']::-webkit-outer-spin-button,
                        input[type='number']::-webkit-inner-spin-button {
                            -webkit-appearance: none;
                            margin: 0;
                        }
                        input[type='number'] {
                            -moz-appearance: textfield;
                        }
                    `);
                    switch (vm.type) {
                        case 'ai-initial':
                            return ShoppingProductSetting.editProduct({
                                vm: vm,
                                gvc: gvc,
                                type: 'add',
                                product_type: type,
                                initial_data: vm.ai_initial,
                            });
                        case 'add':
                            return ShoppingProductSetting.editProduct({
                                vm: vm,
                                gvc: gvc,
                                type: 'add',
                                product_type: type,
                            });
                        case 'list':
                            (window.parent as any).glitter.share.checkData = () => true;
                            vm.tableId = gvc.glitter.getUUID();
                            vm.dataList = [];
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
                                    } else {
                                        let importInput: any = {};
                                        if (FilterOptions.productFunnel.findIndex((item) => item.key === 'collection') === -1) {
                                            FilterOptions.productFunnel.push({
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
                                        return BgWidget.container(
                                            html`
                                                <div class="title-container">
                                                    ${BgWidget.title(
                                                            (() => {
                                                                switch (type) {
                                                                    case 'addProduct':
                                                                        return '加購品';
                                                                    case 'giveaway':
                                                                        return '贈品';
                                                                    case 'product':
                                                                        return '商品列表';
                                                                    case 'hidden':
                                                                        return '隱形賣場商品';
                                                                }
                                                            })()
                                                    )}
                                                    <div class="flex-fill"></div>
                                                    <div style="display: flex; gap: 10px;">
                                                        ${[
                                                            BgWidget.grayButton(
                                                                    '匯入',
                                                                    gvc.event(() => {
                                                                        gvc.glitter.innerDialog((gvc: GVC) => {
                                                                            let support_=ShoppingProductSetting.getSupportProductCategory()[0].key
                                                                            return gvc.bindView({
                                                                                bind: 'importView',
                                                                                view: () => {
                                                                                    return html`
                                                                                        <div
                                                                                                style="display: flex;width:100%;padding: 12px 0 12px 20px;align-items: center;border-radius: 10px 10px 0px 0px;background: #F2F2F2;color:#393939;font-size: 16px;font-weight: 700;"
                                                                                        >
                                                                                            匯入商品
                                                                                        </div>
                                                                                        <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 16px;align-items: flex-start;padding: 20px 20px 0px;">
                                                                                            <div>匯入的商品類型</div>
                                                                                            ${BgWidget.multiCheckboxContainer(
                                                                                                    gvc,
                                                                                                    ShoppingProductSetting.getSupportProductCategory().map((dd) => {
                                                                                                        return {
                                                                                                            key: dd.key,
                                                                                                            name: dd.value,
                                                                                                        }
                                                                                                    })
                                                                                                    ,
                                                                                                    [support_],
                                                                                                    (res: any) => {
                                                                                                        support_ = res[0];
                                                                                                    },
                                                                                                    {single: true}
                                                                                            )}
                                                                                        </div>
                                                                                        <div style="display: flex;width: 100%;align-items: flex-start;gap: 16px;padding:20px;flex-direction: column">
                                                                                            <div style="display: flex;align-items: baseline;gap: 12px;align-self: stretch;">
                                                                                                <div style="color:#393939;font-size: 16px;font-weight: 400;">
                                                                                                    透過XLSX檔案匯入商品
                                                                                                </div>
                                                                                                <div
                                                                                                        class="cursor_pointer"
                                                                                                        style="color: #36B; font-size: 14px; font-style: normal; font-weight: 400; line-height: normal; text-decoration-line: underline;"
                                                                                                        onclick="${gvc.event(() => {
                                                                                                            excel.exportData(ProductExcel.exampleSheet(), `範例_商品詳細列表_${ProductExcel.getFileTime()}`);
                                                                                                        })}"
                                                                                                >
                                                                                                    下載範例
                                                                                                </div>
                                                                                            </div>
                                                                                            <input
                                                                                                    class="d-none"
                                                                                                    type="file"
                                                                                                    id="upload-excel"
                                                                                                    onchange="${gvc.event((e, event) => {
                                                                                                        importInput = event.target;
                                                                                                        gvc.notifyDataChange('importView');
                                                                                                    })}"
                                                                                            />
                                                                                            <div
                                                                                                    style="display: flex;justify-content: center;padding: 59px 0px 58px 0px;align-items: center;flex-direction: column;gap: 10px;width: 100%;border-radius: 10px;border: 1px solid #DDD;background: #FFF;"
                                                                                            >
                                                                                                ${(() => {
                                                                                                    if (importInput.files && importInput.files.length > 0) {
                                                                                                        return html`
                                                                                                            <div
                                                                                                                    class="cursor_pointer"
                                                                                                                    style="display: flex;padding: 10px;justify-content: center;align-items: center;gap: 10px;border-radius: 10px;background: #FFF;box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10);color: #393939;font-size: 16px;font-weight: 400;"
                                                                                                                    onclick="${gvc.event(() => {
                                                                                                                        (document.querySelector('#upload-excel') as HTMLInputElement)!.click();
                                                                                                                    })}"
                                                                                                            >
                                                                                                                更換檔案
                                                                                                            </div>
                                                                                                            <div style="color:#8D8D8D;">
                                                                                                                ${importInput.files[0].name}
                                                                                                            </div>
                                                                                                        `;
                                                                                                    } else {
                                                                                                        return html`
                                                                                                            <div
                                                                                                                    class="cursor_pointer"
                                                                                                                    style="display: flex;padding: 10px;justify-content: center;align-items: center;gap: 10px;border-radius: 10px;background: #FFF;box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10);color: #393939;font-size: 16px;font-weight: 400;"
                                                                                                                    onclick="${gvc.event(() => {
                                                                                                                        (document.querySelector('#upload-excel') as HTMLInputElement)!.click();
                                                                                                                    })}"
                                                                                                            >
                                                                                                                新增檔案
                                                                                                            </div>
                                                                                                            <div style="color:#8D8D8D;"></div>
                                                                                                        `;
                                                                                                    }
                                                                                                })()}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div style="display: flex;justify-content: end;padding-right: 20px;padding-bottom: 20px;gap: 14px;">
                                                                                            ${BgWidget.cancel(
                                                                                                    gvc.event(() => {
                                                                                                        gvc.glitter.closeDiaLog();
                                                                                                    })
                                                                                            )}
                                                                                            ${BgWidget.save(
                                                                                                    gvc.event(() => {
                                                                                                        if (importInput.files && importInput.files.length > 0) {
                                                                                                            vm.dataList = undefined;
                                                                                                            excel.importData(vm.tableId, importInput.files[0],support_ as any);
                                                                                                        } else {
                                                                                                            dialog.infoMessage({text: '尚未上傳檔案'});
                                                                                                        }
                                                                                                    }),
                                                                                                    '匯入'
                                                                                            )}
                                                                                        </div>
                                                                                    `;
                                                                                },
                                                                                divCreate: {style: `border-radius: 10px;background: #FFF;width: 569px;min-height: 368px;max-width: 90%;`},
                                                                            });
                                                                        }, 'import');
                                                                        return ``;
                                                                    })
                                                            ),
                                                            BgWidget.grayButton(
                                                                    '匯出',
                                                                    gvc.event(() => {

                                                                        gvc.glitter.innerDialog((gvc) => {
                                                                            let support_ = ShoppingProductSetting.getSupportProductCategory()[0].key;
                                                                            const check = {
                                                                                select: 'all',
                                                                                file: 'excel',
                                                                            };
                                                                            return html`
                                                                                <div
                                                                                        style="width: 569px; max-width: calc(100% - 20px);min-height: 408px;border-radius: 10px;background: #FFF;display: flex;flex-direction: column;color: #393939;"
                                                                                >

                                                                                    <div
                                                                                            class="w-100"
                                                                                            style="padding: 12px 20px;display: flex;align-items: center;font-size: 16px;font-weight: 700;border-radius: 10px 10px 0px 0px;background: #F2F2F2;"
                                                                                    >
                                                                                        匯出商品
                                                                                    </div>

                                                                                    <div class="w-100"
                                                                                         style="display: flex;flex-direction: column;align-items: flex-start;gap: 24px;padding: 20px;">
                                                                                        <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 16px;align-items: flex-start">
                                                                                            <div>匯出的商品類型</div>
                                                                                            ${BgWidget.multiCheckboxContainer(
                                                                                                    gvc,
                                                                                                    ShoppingProductSetting.getSupportProductCategory().map((dd) => {
                                                                                                        return {
                                                                                                            key: dd.key,
                                                                                                            name: dd.value,
                                                                                                        }
                                                                                                    })
                                                                                                    ,
                                                                                                    [support_],
                                                                                                    (res: any) => {
                                                                                                        support_ = res[0];
                                                                                                    },
                                                                                                    {single: true}
                                                                                            )}
                                                                                        </div>
                                                                                        <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 16px;align-items: flex-start">
                                                                                            <div>匯出的範圍</div>
                                                                                            ${BgWidget.multiCheckboxContainer(
                                                                                                    gvc,
                                                                                                    [
                                                                                                        {
                                                                                                            key: 'all',
                                                                                                            name: '全部商品',
                                                                                                        },
                                                                                                        {
                                                                                                            key: 'search',
                                                                                                            name: '目前搜尋與篩選的結果',
                                                                                                        },
                                                                                                        {
                                                                                                            key: 'check',
                                                                                                            name: `勾選的 ${vm.dataList.filter((item: any) => item.checked).length} 件商品`,
                                                                                                        },

                                                                                                    ]
                                                                                                    ,
                                                                                                    [check.select],
                                                                                                    (res: any) => {
                                                                                                        check.select = res[0];
                                                                                                    },
                                                                                                    {single: true}
                                                                                            )}
                                                                                        </div>
                                                                                        <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 16px;align-self: stretch;">
                                                                                            <div>匯出為</div>
                                                                                            ${BgWidget.multiCheckboxContainer(
                                                                                                    gvc,
                                                                                                    [
                                                                                                        {
                                                                                                            key: 'excel',
                                                                                                            name: 'Excel檔案',
                                                                                                        },
                                                                                                    ],
                                                                                                    [check.file],
                                                                                                    (res: any) => {
                                                                                                        check.file = res[0];
                                                                                                    },
                                                                                                    {single: true}
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div style="display: flex;justify-content: flex-end;align-items: flex-start;gap: 14px;padding: 20px">
                                                                                        ${BgWidget.cancel(
                                                                                                gvc.event(() => {
                                                                                                    gvc.glitter.closeDiaLog();
                                                                                                })
                                                                                        )}
                                                                                        ${BgWidget.save(
                                                                                                gvc.event(() => {
                                                                                                    if (check.select === 'check' && vm.dataList.filter((item: any) => item.checked).length === 0) {
                                                                                                        dialog.infoMessage({text: '請勾選至少一件以上的商品'});
                                                                                                        return;
                                                                                                    }
                                                                                                    dialog.dataLoading({visible: true});

                                                                                                    let getFormData: any = (() => {
                                                                                                        switch (check.select) {
                                                                                                            case 'search':
                                                                                                                return {
                                                                                                                    page: 0,
                                                                                                                    limit: 1000,
                                                                                                                    search: vm.query ?? '',
                                                                                                                    searchType: vm.queryType ?? '',
                                                                                                                    orderBy: vm.orderString ?? '',
                                                                                                                    status: (() => {
                                                                                                                        if (vm.filter.status && vm.filter.status.length > 0) {
                                                                                                                            return vm.filter.status.join(',');
                                                                                                                        }
                                                                                                                        return undefined;
                                                                                                                    })(),
                                                                                                                    collection: vm.filter.collection,
                                                                                                                    accurate_search_collection: true,
                                                                                                                    productType: type,
                                                                                                                };
                                                                                                            case 'check':
                                                                                                                return {
                                                                                                                    page: 0,
                                                                                                                    limit: 1000,
                                                                                                                    id_list: vm.dataList
                                                                                                                            .filter((item: any) => item.checked)
                                                                                                                            .map((item: {
                                                                                                                                id: number
                                                                                                                            }) => item.id),
                                                                                                                    productType: type,
                                                                                                                };
                                                                                                            case 'all':
                                                                                                            default:
                                                                                                                return {
                                                                                                                    page: 0,
                                                                                                                    limit: 1000,
                                                                                                                    productType: type,
                                                                                                                };
                                                                                                        }
                                                                                                    })();

                                                                                                    getFormData.product_category = support_;
                                                                                                    if(['course','commodity'].includes(support_)){
                                                                                                        ProductExcel.exportCommodity(getFormData,gvc)
                                                                                                    }else if(support_==='kitchen'){
                                                                                                        ProductExcel.exportKitchen(getFormData,gvc)
                                                                                                    }
                                                                                                  
                                                                                                }),
                                                                                                '匯出'
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            `;
                                                                        }, 'export');
                                                                        return;
                                                                    })
                                                            ),
                                                            BgWidget.darkButton(
                                                                    '新增',
                                                                    gvc.event(() => {
                                                                        ShoppingProductSetting.select_language = ((window.parent as any).store_info.language_setting.def);
                                                                        const support_pd = ShoppingProductSetting.getSupportProductCategory()
                                                                        if (support_pd.length <= 1) {
                                                                            (ShoppingProductSetting.select_product_type as any) = (support_pd[0] && support_pd[0].key) || ''
                                                                            vm.type = 'add'
                                                                            return
                                                                        }
                                                                        (ShoppingProductSetting.select_product_type as any) = support_pd[0].key;
                                                                        BgWidget.settingDialog({
                                                                            gvc: gvc,
                                                                            title: '選擇商品類型',
                                                                            innerHTML: (gvc: GVC) => {
                                                                                (ShoppingProductSetting.select_product_type as any) = support_pd[0].key
                                                                                return html`
                                                                                    <div class="d-flex align-items-center">
                                                                                        ${BgWidget.select({
                                                                                            gvc: gvc,
                                                                                            callback: (data) => {
                                                                                                (ShoppingProductSetting.select_product_type as any) = data;
                                                                                            },
                                                                                            options: support_pd,
                                                                                            default: ShoppingProductSetting.select_product_type
                                                                                        })}
                                                                                    </div>
                                                                                `
                                                                            },
                                                                            footer_html: (gvc: GVC) => {
                                                                                return [
                                                                                    BgWidget.save(gvc.event(() => {
                                                                                        vm.type = 'add';
                                                                                        gvc.closeDialog();
                                                                                    }), '下一步')
                                                                                ].join('');
                                                                            },
                                                                            width: 300,
                                                                        });
                                                                    }),
                                                                    {
                                                                        class: `guide5-3`,
                                                                    }
                                                            ),
                                                        ].join('')}
                                                    </div>
                                                </div>
                                                ${BgWidget.container(
                                                        BgWidget.mainCard(
                                                                [
                                                                    (() => {
                                                                        const id = gvc.glitter.getUUID();
                                                                        return gvc.bindView({
                                                                            bind: id,
                                                                            view: () => {
                                                                                const filterList = [
                                                                                    BgWidget.selectFilter({
                                                                                        gvc,
                                                                                        callback: (value: any) => {
                                                                                            vm.queryType = value;
                                                                                            gvc.notifyDataChange(vm.tableId);
                                                                                            gvc.notifyDataChange(id);
                                                                                        },
                                                                                        default: vm.queryType || 'title',
                                                                                        options: FilterOptions.productSelect,
                                                                                        style: 'min-width: 160px;',
                                                                                    }),
                                                                                    BgWidget.searchFilter(
                                                                                            gvc.event((e) => {
                                                                                                vm.query = `${e.value}`.trim();
                                                                                                gvc.notifyDataChange(vm.tableId);
                                                                                                gvc.notifyDataChange(id);
                                                                                            }),
                                                                                            vm.query || '',
                                                                                            '搜尋'
                                                                                    ),
                                                                                    BgWidget.funnelFilter({
                                                                                        gvc,
                                                                                        callback: () => ListComp.showRightMenu(FilterOptions.productFunnel),
                                                                                    }),
                                                                                    BgWidget.updownFilter({
                                                                                        gvc,
                                                                                        callback: (value: any) => {
                                                                                            vm.orderString = value;
                                                                                            gvc.notifyDataChange(vm.tableId);
                                                                                            gvc.notifyDataChange(id);
                                                                                        },
                                                                                        default: vm.orderString || 'default',
                                                                                        options: FilterOptions.productListOrderBy,
                                                                                    }),
                                                                                ];

                                                                                const filterTags = ListComp.getFilterTags(FilterOptions.productFunnel);

                                                                                if (document.body.clientWidth < 768) {
                                                                                    // 手機版
                                                                                    return html`
                                                                                        <div style="display: flex; align-items: center; gap: 10px; width: 100%; justify-content: space-between">
                                                                                            <div>${filterList[0]}</div>
                                                                                            <div style="display: flex;">
                                                                                                <div class="me-2">
                                                                                                    ${filterList[2]}
                                                                                                </div>
                                                                                                ${filterList[3] ?? ''}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div style="display: flex; margin-top: 8px;">
                                                                                            ${filterList[1]}
                                                                                        </div>
                                                                                        <div>${filterTags}</div>`;
                                                                                } else {
                                                                                    // 電腦版
                                                                                    return html`
                                                                                        <div style="display: flex; align-items: center; gap: 10px;">
                                                                                            ${filterList.join('')}
                                                                                        </div>
                                                                                        <div>${filterTags}</div>`;
                                                                                }
                                                                            },
                                                                        });
                                                                    })(),
                                                                    gvc.bindView({
                                                                        bind: vm.tableId,
                                                                        view: () => {
                                                                            const limit = 20;
                                                                            return BgWidget.tableV3({
                                                                                gvc: gvc,
                                                                                getData: (vmi) => {
                                                                                    function loop() {
                                                                                        ApiShop.getProduct({
                                                                                            page: vmi.page - 1,
                                                                                            limit: limit,
                                                                                            search: vm.query || undefined,
                                                                                            searchType: vm.queryType || undefined,
                                                                                            orderBy: vm.orderString || undefined,
                                                                                            status: (() => {
                                                                                                if (vm.filter.status && vm.filter.status.length > 0) {
                                                                                                    return vm.filter.status.join(',');
                                                                                                }
                                                                                                return undefined;
                                                                                            })(),
                                                                                            channel: (() => {
                                                                                                if (vm.filter.channel && vm.filter.channel.length > 0) {
                                                                                                    return vm.filter.channel.join(',');
                                                                                                }
                                                                                                return undefined;
                                                                                            })(),
                                                                                            filter_visible: `${type !== 'hidden'}`,
                                                                                            collection: vm.filter.collection,
                                                                                            accurate_search_collection: true,
                                                                                            productType: type === 'hidden' ? 'product' : type,
                                                                                        }).then((data) => {
                                                                                            function getDatalist() {
                                                                                                return data.response.data.map((dd: any) => {
                                                                                                    return [
                                                                                                        {
                                                                                                            key: '商品',
                                                                                                            value: html`
                                                                                                                <div class="d-flex align-items-center">
                                                                                                                    ${BgWidget.validImageBox({
                                                                                                                        gvc: gvc,
                                                                                                                        image: dd.content.preview_image[0],
                                                                                                                        width: 40,
                                                                                                                        class: 'rounded border me-4',
                                                                                                                    })}
                                                                                                                    <div class="d-flex flex-column"
                                                                                                                         style="">
                                                                                                                        ${(dd.content.shopee_id) ? `<div style="margin-bottom: -10px;"><div class="insignia" style="background: orangered;color: white;">蝦皮</div></div>
                                                                                                                ` : ``}
                                                                                                                        <div>
                                                                                                                            ${Tool.truncateString(dd.content.title)}
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>`,
                                                                                                        },
                                                                                                        {
                                                                                                            key: '售價',
                                                                                                            value: (() => {
                                                                                                                const numArray = (dd.content.variants ?? [])
                                                                                                                        .map((dd: any) => {
                                                                                                                            return parseInt(`${dd.sale_price}`, 10);
                                                                                                                        })
                                                                                                                        .filter((dd: any) => {
                                                                                                                            return !isNaN(dd);
                                                                                                                        });
                                                                                                                if (numArray.length == 0) {
                                                                                                                    return '尚未設定';
                                                                                                                }
                                                                                                                return `$ ${Math.min(...numArray).toLocaleString()}`;
                                                                                                            })(),
                                                                                                        },
                                                                                                        {
                                                                                                            key: '庫存',
                                                                                                            value: (() => {
                                                                                                                let sum = 0;
                                                                                                                let countStock = 0;
                                                                                                                dd.content.variants.forEach((variant: any) => {
                                                                                                                    if (variant.show_understocking == "true") {
                                                                                                                        countStock++;
                                                                                                                        sum += variant.stock;
                                                                                                                    }
                                                                                                                })
                                                                                                                // const sum = dd.content.variants.reduce((acc: any, curr: any) => acc + curr.stock, 0);
                                                                                                                if (countStock == 0) {
                                                                                                                    return html`
                                                                                                                        無追蹤庫存
                                                                                                                    `
                                                                                                                }
                                                                                                                return html`${countStock}個子類 ${sum > 1
                                                                                                                        ? `有${sum}件庫存`
                                                                                                                        : html`
                                                                                                                            <span style="color:#8E0E2B">有${sum} 件庫存</span>`}`;
                                                                                                            })(),
                                                                                                        },
                                                                                                        {
                                                                                                            key: '已售出',
                                                                                                            value: (dd.total_sales ?? '0').toLocaleString(),
                                                                                                        },
                                                                                                        {
                                                                                                            key: '狀態',
                                                                                                            value: gvc.bindView(() => {
                                                                                                                const id = gvc.glitter.getUUID();
                                                                                                                return {
                                                                                                                    bind: id,
                                                                                                                    view: () => {
                                                                                                                        return ShoppingProductSetting.getOnboardStatus(dd.content)
                                                                                                                    },
                                                                                                                    divCreate: {
                                                                                                                        style: 'min-width: 60px;',
                                                                                                                        option: [
                                                                                                                            {
                                                                                                                                key: 'onclick',
                                                                                                                                value: gvc.event((e, event) => {
                                                                                                                                    event.stopPropagation();
                                                                                                                                }),
                                                                                                                            },
                                                                                                                        ],
                                                                                                                    },
                                                                                                                };
                                                                                                            }),
                                                                                                        },
                                                                                                    ].map((dd) => {
                                                                                                        dd.value = html`
                                                                                                            <div style="line-height:40px;">
                                                                                                                ${dd.value}
                                                                                                            </div>`;
                                                                                                        return dd;
                                                                                                    });
                                                                                                });
                                                                                            }

                                                                                            vm.dataList = data.response.data;
                                                                                            vmi.pageSize = Math.ceil(data.response.total / limit);
                                                                                            vmi.originalData = vm.dataList;
                                                                                            vmi.tableData = getDatalist();
                                                                                            vmi.loading = false;
                                                                                            if ((ShoppingProductSetting.select_page_index !== (vmi.page - 1)) && ShoppingProductSetting.select_page_index <= vmi.pageSize) {
                                                                                                vmi.page = ShoppingProductSetting.select_page_index + 1
                                                                                                loop()
                                                                                            } else {
                                                                                                ShoppingProductSetting.select_page_index = (vmi.page - 1)
                                                                                                vmi.callback();
                                                                                            }
                                                                                        });
                                                                                    }

                                                                                    loop()
                                                                                },
                                                                                rowClick: (data, index) => {
                                                                                    vm.replaceData = vm.dataList[index].content;
                                                                                    ShoppingProductSetting.select_language = ((window.parent as any).store_info.language_setting.def);
                                                                                    vm.type = 'replace';
                                                                                },
                                                                                tab_click: (vmi) => {
                                                                                    ShoppingProductSetting.select_page_index = vmi.page - 1
                                                                                },
                                                                                filter: [
                                                                                    {
                                                                                        name: '上架',
                                                                                        event: (checkedData) => {
                                                                                            const selCount = checkedData.length;
                                                                                            dialog.dataLoading({visible: true});
                                                                                            new Promise<void>((resolve) => {
                                                                                                let n = 0;
                                                                                                checkedData.map((dd: any) => {
                                                                                                    dd.content.active_schedule = this.getActiveDatetime();
                                                                                                    dd.content.status = 'active';

                                                                                                    async function run() {
                                                                                                        return ApiPost.put({
                                                                                                            postData: dd.content,
                                                                                                            token: (window.parent as any).config.token,
                                                                                                            type: 'manager',
                                                                                                        }).then((res) => {
                                                                                                            res.result ? n++ : run();
                                                                                                        });
                                                                                                    }

                                                                                                    run();
                                                                                                });
                                                                                                setInterval(() => {
                                                                                                    n === selCount && setTimeout(() => resolve(), 200);
                                                                                                }, 500);
                                                                                            }).then(() => {
                                                                                                dialog.dataLoading({visible: false});
                                                                                                gvc.notifyDataChange(vm.id);
                                                                                            });
                                                                                        },
                                                                                        option: true,
                                                                                    },
                                                                                    {
                                                                                        name: '下架',
                                                                                        event: (checkedData) => {
                                                                                            const selCount = checkedData.length;
                                                                                            dialog.dataLoading({visible: true});
                                                                                            new Promise<void>((resolve) => {
                                                                                                let n = 0;
                                                                                                checkedData.map((dd: any) => {
                                                                                                    dd.content.active_schedule = this.getInactiveDatetime();
                                                                                                    dd.content.status = 'active';

                                                                                                    async function run() {
                                                                                                        return ApiPost.put({
                                                                                                            postData: dd.content,
                                                                                                            token: (window.parent as any).config.token,
                                                                                                            type: 'manager',
                                                                                                        }).then((res) => {
                                                                                                            res.result ? n++ : run();
                                                                                                        });
                                                                                                    }

                                                                                                    run();
                                                                                                });
                                                                                                setInterval(() => {
                                                                                                    n === selCount && setTimeout(() => resolve(), 200);
                                                                                                }, 500);
                                                                                            }).then(() => {
                                                                                                dialog.dataLoading({visible: false});
                                                                                                gvc.notifyDataChange(vm.id);
                                                                                            });
                                                                                        },
                                                                                        option: true,
                                                                                    },
                                                                                    {
                                                                                        name: '刪除',
                                                                                        event: (checkedData) => {
                                                                                            dialog.checkYesOrNot({
                                                                                                text: '是否確認刪除所選項目？',
                                                                                                callback: (response) => {
                                                                                                    if (response) {
                                                                                                        dialog.dataLoading({visible: true});
                                                                                                        ApiShop.delete({
                                                                                                            id: checkedData
                                                                                                                    .map((dd: any) => {
                                                                                                                        return dd.id;
                                                                                                                    })
                                                                                                                    .join(`,`),
                                                                                                        }).then((res) => {
                                                                                                            dialog.dataLoading({visible: false});
                                                                                                            if (res.result) {
                                                                                                                vm.dataList = undefined;
                                                                                                                gvc.notifyDataChange(vm.id);
                                                                                                            } else {
                                                                                                                dialog.errorMessage({
                                                                                                                    text: '刪除失敗',
                                                                                                                });
                                                                                                            }
                                                                                                        });
                                                                                                    }
                                                                                                },
                                                                                            });
                                                                                        },
                                                                                    },
                                                                                ],
                                                                            });
                                                                        },
                                                                    }),
                                                                ].join('')
                                                        )
                                                )}
                                                ${BgWidget.mbContainer(240)}
                                            `
                                        );
                                    }
                                },
                                divCreate: {},
                                onCreate: () => {
                                    if (vmlist.loading) {
                                        BgProduct.getCollectionAllOpts(vmlist.collections, () => {
                                            vmlist.loading = false;
                                            gvc.notifyDataChange(vmlist.id);
                                        });
                                    }
                                },
                            });
                        case 'replace':
                            setTimeout(() => {
                                document.querySelector('.pd-w-c')!.scrollTop = vm.last_scroll;
                                vm.last_scroll = 0;
                            }, 200);
                            dialog.dataLoading({visible: true});
                            return ShoppingProductSetting.editProduct({
                                vm: vm,
                                gvc: gvc,
                                type: 'replace',
                                defData: vm.replaceData,
                            });
                        case 'editSpec':
                            vm.last_scroll = document.querySelector('.pd-w-c')!.scrollTop;
                            return ShoppingProductSetting.editProductSpec({
                                vm: vm,
                                gvc: gvc,
                                defData: vm.replaceData,
                            });
                    }
                },
                divCreate: {
                    class: `w-100 h-100`,
                },
                onCreate: () => {
                },
            };
        });
    }

    public static editProductSpec(obj: {
        vm: any;
        gvc: GVC;
        defData: any;
        single?: boolean;
        goBackEvent?: {
            save: (data: any) => void;
            cancel: () => void;
        };
    }) {
        const gvc = obj.gvc;
        const stockId = gvc.glitter.getUUID();
        let postMD: any = obj.defData;
        let variant: any = {};
        let orignData: any = {};
        let index: number = 0;
        let stockList: any = []


        postMD.variants.map((data: any, ind: number) => {
            if (data.editable) {
                index = ind;
                variant = obj.single ? data : JSON.parse(JSON.stringify(data));
                orignData = data;
            }
        });

        setTimeout(() => {
            orignData = JSON.parse(JSON.stringify(variant))
        }, 200)

        function checkStore(next: () => void, cancel?: () => void) {
            const dialog = new ShareDialog(gvc.glitter);
            if (JSON.stringify(orignData) !== JSON.stringify(variant)) {
                dialog.checkYesOrNot({
                    text: '內容已變更是否儲存?',
                    callback: (response) => {

                        if (obj && obj.goBackEvent) {
                            if (response) {
                                orignData = JSON.parse(JSON.stringify(variant))
                                obj.goBackEvent.save(postMD);
                            } else {
                                obj.goBackEvent.cancel();
                                next();
                            }
                        } else {
                            if (response) {
                                (postMD.variants as any)[index] = variant;
                                next();
                            }
                            if (cancel) {
                                cancel();
                                next();
                                return;
                            }
                        }
                    }
                });
            } else {
                next();
            }
        }

        function getStockStore() {
            if (Object.entries(stockList).length == 0) {
                ApiUser.getPublicConfig('store_manager',
                    'manager'
                ).then((storeData: any) => {
                    if (storeData.result) {
                        stockList = storeData.response.value.list;
                        gvc.notifyDataChange(stockId);
                    }
                })
            }

        }

        getStockStore()
        document.querySelector('.pd-w-c')!.scrollTop = 0;

        function getDefImg() {
            const dd = postMD
            return (dd.language_data
                    &&
                    dd.language_data[((window.parent as any).store_info.language_setting.def)].preview_image
                    &&
                    dd.language_data[((window.parent as any).store_info.language_setting.def)].preview_image[0])
                || dd.preview_image[0]
        }

        return html`
            <div class="d-flex"
                 style="font-size: 16px;color:#393939;font-weight: 400;position: relative;padding:0;padding-bottom: ${obj.single ? `0px` : `80px`};">
                ${BgWidget.container(
                        html`
                            <div class="title-container ${obj.single ? 'd-none' : ''}">
                                ${BgWidget.goBack(
                                        obj.gvc.event(() => {
                                            checkStore(
                                                    obj && obj.goBackEvent
                                                            ? obj.goBackEvent.cancel
                                                            : () => {
                                                                obj.vm.type = 'replace';
                                                            }
                                            );
                                        })
                                )}
                                ${BgWidget.title(variant.spec.length > 0 ? variant.spec.join(' / ') : '單一規格')}
                                <div class="flex-fill"></div>
                            </div>
                            <div class="d-flex flex-column ${obj.single ? `flex-column-reverse` : `flex-sm-row mt-4`} w-100 p-0"
                                 style="gap: 24px;">
                                <div class="leftBigArea d-flex flex-column flex-fill" style="gap: 18px;">
                                    ${!obj.single
                                            ? BgWidget.mainCard(
                                                    gvc.bindView(() => {
                                                        const id = gvc.glitter.getUUID();
                                                        return {
                                                            bind: id,
                                                            view: () => {

                                                                try {
                                                                    variant[`preview_image_${ShoppingProductSetting.select_language}`] = variant[`preview_image_${ShoppingProductSetting.select_language}`] || variant.preview_image || getDefImg();
                                                                    let pre_ciew = variant[`preview_image_${ShoppingProductSetting.select_language}`]
                                                                    if ((pre_ciew === BgWidget.noImageURL) || !pre_ciew) {
                                                                        pre_ciew = getDefImg()
                                                                    }
                                                                    return html`
                                                                        <div style="font-weight: 700;">規格</div>
                                                                        <div>
                                                                            ${variant.spec.length > 0 ? variant.spec.join(' / ') : '單一規格'}
                                                                        </div>
                                                                        <div style="font-weight: 700;gap:5px;"
                                                                             class="d-flex align-items-center">規格圖片
                                                                            ${BgWidget.languageInsignia(ShoppingProductSetting.select_language as any)}
                                                                        </div>
                                                                        <div
                                                                                class="d-flex align-items-center justify-content-center rounded-3 shadow"
                                                                                style="min-width:135px;135px;height:135px;cursor:pointer;background: 50%/cover url('${pre_ciew}');"
                                                                        >
                                                                            <div
                                                                                    class="w-100 h-100 d-flex align-items-center justify-content-center rounded-3 p-hover-image"
                                                                                    style="opacity:0;background: rgba(0,0,0,0.5);gap:20px;color:white;font-size:22px;"
                                                                            >
                                                                                <i
                                                                                        class="fa-regular fa-eye"
                                                                                        onclick="${obj.gvc.event(() => {
                                                                                            (window.parent as any).glitter.openDiaLog(
                                                                                                    new URL('../dialog/image-preview.js', import.meta.url).href,
                                                                                                    'preview',
                                                                                                    variant[`preview_image_${ShoppingProductSetting.select_language}`] || BgWidget.noImageURL
                                                                                            );
                                                                                        })}"
                                                                                ></i>
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                                style="width: 136px;text-align: center;color: #36B;cursor: pointer;"
                                                                                onclick="${obj.gvc.event(() => {
                                                                                    const language_data: any = (postMD.language_data as any)[ShoppingProductSetting.select_language];
                                                                                    imageLibrary.selectImageFromArray(language_data.preview_image, {
                                                                                        gvc: gvc,
                                                                                        title: html`
                                                                                            <div class="d-flex flex-column"
                                                                                                 style="border-radius: 10px 10px 0px 0px;background: #F2F2F2;">
                                                                                                圖片庫
                                                                                            </div>`,
                                                                                        getSelect: (imageUrl) => {
                                                                                            variant[`preview_image_${ShoppingProductSetting.select_language}`] = imageUrl;
                                                                                            gvc.notifyDataChange(id);
                                                                                        },
                                                                                    });
                                                                                    // imageLibrary.selectImageLibrary(
                                                                                    //         gvc,
                                                                                    //         (urlArray) => {
                                                                                    //             if (urlArray.length > 0) {
                                                                                    //                 variant.preview_image = urlArray[0].data;
                                                                                    //                 gvc.notifyDataChange(id);
                                                                                    //             } else {
                                                                                    //                 const dialog = new ShareDialog(gvc.glitter);
                                                                                    //                 dialog.errorMessage({text: '請選擇至少一張圖片'});
                                                                                    //             }
                                                                                    //         },
                                                                                    //         html`
                                                                                    //             <div class="d-flex flex-column"
                                                                                    //                  style="border-radius: 10px 10px 0px 0px;background: #F2F2F2;">
                                                                                    //                 圖片庫
                                                                                    //             </div>`,
                                                                                    //         {mul: false}
                                                                                    // );
                                                                                })}"
                                                                        >
                                                                            變更
                                                                        </div>
                                                                    `;
                                                                } catch (e) {
                                                                    console.log(e)
                                                                    return `${e}`
                                                                }

                                                            },
                                                            divCreate: {
                                                                style: `display: flex;flex-direction: column;align-items: flex-start;gap: 18px;align-self: stretch;`,
                                                            },
                                                        };
                                                    })
                                            )
                                            : ''}
                                    ${(() => {
                                        let map_: string[] = [
                                            BgWidget.mainCard(html`
                                                <div class="w-100"
                                                     style="display: flex;gap: 18px;flex-direction: column;">
                                                    <div style="font-weight: 700;">定價</div>
                                                    <div class="d-flex w-100" style="gap:18px;">
                                                        <div class="d-flex w-50 flex-column guide5-5" style="gap: 8px;">
                                                            <div>售價*</div>
                                                            <input
                                                                    style="width: 100%;border-radius: 10px;border: 1px solid #DDD;height: 40px;padding: 0px 18px;"
                                                                    placeholder="請輸入售價"
                                                                    onchange="${gvc.event((e) => {
                                                                        variant.sale_price = e.value;
                                                                    })}"
                                                                    min="0"
                                                                    value="${variant.sale_price || '0'}"
                                                                    type="number"
                                                            />
                                                        </div>
                                                        <div class="d-flex w-50 flex-column" style="gap: 8px;">
                                                            <div>原價</div>
                                                            <input
                                                                    style="width: 100%;border-radius: 10px;border: 1px solid #DDD;height: 40px;padding: 0px 18px;"
                                                                    placeholder="請輸入原價"
                                                                    min="0"
                                                                    onchange="${gvc.event((e) => {
                                                                        variant.compare_price = e.value;
                                                                    })}"
                                                                    value="${variant.compare_price || '0'}"
                                                                    type="number"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div class="d-flex w-100" style="gap:18px;">
                                                        <div class="d-flex w-50 flex-column" style="gap: 8px;">
                                                            <div>成本</div>
                                                            <input
                                                                    style="width: 100%;border-radius: 10px;border: 1px solid #DDD;height: 40px;padding: 0px 18px;"
                                                                    placeholder="請輸入成本"
                                                                    min="0"
                                                                    onchange="${gvc.event((e) => {
                                                                        variant.cost = e.value;
                                                                    })}"
                                                                    value="${variant.cost || 0}"
                                                                    type="number"
                                                            />
                                                        </div>
                                                        <div class="d-flex w-50 flex-column" style="gap: 8px;">
                                                            <div>利潤</div>
                                                            <input
                                                                    style="width: 100%;border-radius: 10px;border: 1px solid #DDD;height: 40px;padding: 0px 18px;"
                                                                    min="0"
                                                                    onchange="${gvc.event((e) => {
                                                                        variant.profit = e.value;
                                                                    })}"
                                                                    placeholder="-"
                                                                    value="${variant.profit}"
                                                                    type="number"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            `),
                                        ]
                                        postMD.product_category = postMD.product_category || 'commodity'
                                        if (postMD.product_category === 'commodity') {
                                            map_.push(BgWidget.mainCard(gvc.bindView(() => {
                                                const vm = {
                                                    id: gvc.glitter.getUUID(),
                                                };
                                                return {
                                                    bind: vm.id,
                                                    view: () => {
                                                        return html`
                                                            <div style="font-weight: 700;margin-bottom: 6px;">運費計算
                                                            </div>
                                                            ${BgWidget.multiCheckboxContainer(
                                                                    gvc,
                                                                    [
                                                                        {
                                                                            key: 'volume',
                                                                            name: '依材積計算',
                                                                            customerClass: 'guide5-6',
                                                                        },
                                                                        {
                                                                            key: 'weight',
                                                                            name: '依重量計算',
                                                                        },
                                                                        {
                                                                            key: 'none',
                                                                            name: '不計算運費',
                                                                        },
                                                                    ],
                                                                    [variant.shipment_type],
                                                                    (data) => {
                                                                        variant.shipment_type = data[0];
                                                                        gvc.notifyDataChange(vm.id);
                                                                    },
                                                                    {single: true}
                                                            )}`;
                                                    },
                                                    divCreate: {
                                                        class: `d-flex flex-column `,
                                                        style: `gap:12px;`,
                                                    },
                                                };
                                            })))
                                            map_.push(BgWidget.mainCard(html`
                                                <div class="d-flex flex-column " style="gap:18px;">
                                                    <div class="d-flex flex-column guide5-7" style="gap:18px;">
                                                        <div style="font-weight: 700;">商品材積</div>
                                                        <div class="row">
                                                            ${[
                                                                {
                                                                    title: '長度',
                                                                    value: 'v_length',
                                                                    unit: '公分',
                                                                },
                                                                {
                                                                    title: '寬度',
                                                                    value: 'v_width',
                                                                    unit: '公分',
                                                                },
                                                                {
                                                                    title: '高度',
                                                                    value: 'v_height',
                                                                    unit: '公分',
                                                                },
                                                            ]
                                                                    .map((dd) => {
                                                                        return html`
                                                                            <div style="display: flex;justify-content: center;align-items: center;gap: 10px;position: relative;"
                                                                                 class=" col-12 col-sm-4 mb-2">
                                                                                <div style="white-space: nowrap;">
                                                                                    ${dd.title}
                                                                                </div>
                                                                                <input
                                                                                        class="ps-3"
                                                                                        style="border-radius: 10px;border: 1px solid #DDD;height: 40px;width: calc(100% - 50px);"
                                                                                        type="number"
                                                                                        onchange="${gvc.event((e) => {
                                                                                            variant[dd.value] = e.value;
                                                                                        })}"
                                                                                        value="${variant[dd.value]}"
                                                                                />
                                                                                <div style="color: #8D8D8D;position: absolute;right: 25px;top: 7px;">
                                                                                    ${dd.unit}
                                                                                </div>
                                                                            </div>`;
                                                                    })
                                                                    .join('')}
                                                        </div>
                                                    </div>
                                                    <div style="font-weight: 700;">商品重量</div>
                                                    <div class="w-100 row m-0" style="color:#393939;">
                                                        <input
                                                                class="col-6"
                                                                style="display: flex;height: 40px;padding: 10px 18px;align-items: center;gap: 10px;border-radius: 10px;border: 1px solid #DDD;"
                                                                placeholder="請輸入商品重量"
                                                                value="${variant.weight || 0}"
                                                                onchange="${gvc.event((e) => {
                                                                    variant.weight = e.value;
                                                                })}"
                                                        />
                                                        <div class="col-6"
                                                             style="display: flex;align-items: center;gap: 10px;">
                                                            <div style="white-space: nowrap;">單位</div>
                                                            <select class="form-select d-flex align-items-center flex-fill"
                                                                    style="border-radius: 10px;border: 1px solid #DDD;padding-left: 18px;">
                                                                <option value="kg">公斤</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            `))
                                        }
                                        map_.push(BgWidget.mainCard(html`
                                            <div class="d-flex flex-column" style="gap: 18px;">
                                                <div style="font-weight: 700;">庫存政策</div>
                                                ${gvc.bindView(() => {
                                                    const id = gvc.glitter.getUUID();
                                                    return {
                                                        bind: stockId,
                                                        view: () => {
                                                            function showStockView() {
                                                                function initStockList() {
                                                                    let newList: any = {};
                                                                    //用於原本的陣列轉object
                                                                    if (variant.stockList && Object.entries(variant.stockList).length > 0) {
                                                                        variant.stockList.forEach((stock: {
                                                                            id: string,
                                                                            value: number
                                                                        }) => {
                                                                            newList[stock.id] = {
                                                                                count: stock.value
                                                                            };
                                                                        })
                                                                    } else {
                                                                        stockList.forEach((stock: {
                                                                            id: string,
                                                                            value: number
                                                                        }) => {
                                                                            newList[stock.id] = {
                                                                                count: 0
                                                                            };
                                                                        })
                                                                    }


                                                                    variant.stockList = newList;
                                                                }

                                                                // 把variant的stockList 從陣列改成object
                                                                if (Array.isArray(variant.stockList) && variant.stockList.length > 0) {
                                                                    initStockList()
                                                                }
                                                                // 庫存倉庫超過一個
                                                                if (stockList.length > 1) {

                                                                    //先確認商品資訊是否有被正確記錄，沒有的話先初始化，或是先從陣列轉為object
                                                                    if (!variant.stockList || Object.entries(variant.stockList).length == 0) {
                                                                        initStockList();
                                                                    }

                                                                    return html`
                                                                        <div
                                                                                class="w-100 align-items-center"
                                                                                style="display: flex;padding-left: 8px;align-items: flex-start;gap: 14px;align-self: stretch;margin-top: 8px;"
                                                                        >
                                                                            <div class="flex-fill d-flex flex-column"
                                                                                 style="gap: 8px;border-left:solid 1px #E5E5E5;padding-left:14px;">
                                                                                <div class="w-100"
                                                                                     style="font-size: 14px;font-weight: 400;color: #8D8D8D;">
                                                                                    ${postMD.shopee_id ? `
                                                                                    此商品來源為蝦皮電商平台，更改將自動同步蝦皮庫存，蝦皮商品僅支援單一庫存點。
                                                                                    ` : `線上販售的商品將優先從庫存量較多的庫存點中扣除`}
                                                                                </div>
                                                                                ${(() => {
                                                                                    return stockList.map((stockSpot: any, index: number) => {
                                                                                        if (postMD.shopee_id && index > 0) {
                                                                                            return ``
                                                                                        }
                                                                                        variant.stockList = variant.stockList ?? {}
                                                                                        variant.stockList[stockSpot.id] = variant.stockList[stockSpot.id] ?? {count: 0}
                                                                                        return html`
                                                                                            <div>
                                                                                                ${postMD.shopee_id ? `蝦皮庫存` : stockSpot.name}
                                                                                            </div>
                                                                                            <input
                                                                                                    class="w-100"
                                                                                                    value="${variant.stockList[stockSpot.id].count ?? 0}"
                                                                                                    type="number"
                                                                                                    style="padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;"
                                                                                                    placeholder="請輸入該庫存點庫存數量"
                                                                                                    onchange="${gvc.event((e) => {
                                                                                                        // variant.stock = e.value;
                                                                                                        // const target = data.find(item => item.id === 'any');
                                                                                                        const inputValue = parseInt(e.value, 10) || 0;
                                                                                                        variant.stockList[stockSpot.id].count = inputValue;
                                                                                                        variant.stock += inputValue;
                                                                                                        console.log("variant.stock -- ", variant.stock)
                                                                                                    })}"
                                                                                            />
                                                                                        `
                                                                                    }).join(``)
                                                                                })()}
                                                                            </div>

                                                                        </div>`
                                                                } else {
                                                                    return html`
                                                                        <div
                                                                                class="w-100 align-items-center"
                                                                                style="display: flex;padding-left: 8px;align-items: flex-start;gap: 14px;align-self: stretch;margin-top: 8px;"
                                                                        >
                                                                            <div style="background-color: #E5E5E5;height: 80px;width: 1px;"></div>
                                                                            <div class="flex-fill d-flex flex-column"
                                                                                 style="gap: 8px">
                                                                                <div>庫存數量</div>
                                                                                <div class="w-100 ${(postMD as any).shopee_id ? `` : `d-none`}"
                                                                                     style="font-size: 14px;font-weight: 400;color: #8D8D8D;">
                                                                                    此商品來源為蝦皮電商平台，將自動同步蝦皮庫存
                                                                                </div>
                                                                                <input
                                                                                        class="w-100"
                                                                                        type="number"
                                                                                        value="${variant.stock ?? '0'}"
                                                                                        style="padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;"
                                                                                        placeholder="請輸入庫存數量"
                                                                                        onchange="${gvc.event((e) => {
                                                                                            // alert(JSON.stringify(stockList))
                                                                                            // stockList[0].id
                                                                                            // variant.stock = e.value;
                                                                                            variant.stockList[stockList[0].id].count = e.value;
                                                                                        })}"
                                                                                />
                                                                            </div>

                                                                        </div>`
                                                                }
                                                            }

                                                            return html`
                                                                <div class="d-flex flex-column w-100">
                                                                    <div
                                                                            class="d-flex align-items-center"
                                                                            style="gap:6px;cursor: pointer;"
                                                                            onclick="${gvc.event(() => {
                                                                                variant.show_understocking = 'true';
                                                                                gvc.notifyDataChange(stockId);
                                                                            })}"
                                                                    >
                                                                        ${variant.show_understocking != 'false'
                                                                                ? html`
                                                                                    <div style="width: 16px;height: 16px;border-radius: 20px;border: 4px solid #393939;"></div>`
                                                                                : html`
                                                                                    <div style="width: 16px;height: 16px;border-radius: 20px;border: 1px solid #DDD;"></div>`}
                                                                        追蹤庫存
                                                                    </div>
                                                                    ${variant.show_understocking != 'false'
                                                                            ? showStockView()
                                                                            : ``}
                                                                </div>
                                                                <div
                                                                        class="d-flex align-items-center"
                                                                        style="gap:6px;cursor: pointer;"
                                                                        onclick="${gvc.event(() => {
                                                                            variant.show_understocking = 'false';
                                                                            gvc.notifyDataChange(stockId);
                                                                        })}"
                                                                >
                                                                    ${variant.show_understocking == 'false'
                                                                            ? html`
                                                                                <div style="width: 16px;height: 16px;border-radius: 20px;border: 4px solid #393939;"></div>`
                                                                            : html`
                                                                                <div style="width: 16px;height: 16px;border-radius: 20px;border: 1px solid #DDD;"></div>`}
                                                                    不追蹤庫存
                                                                </div>
                                                                <div style="width:100%;height:1px;backgound:#DDDDDD;"></div>
                                                                ${
                                                                        variant.show_understocking == 'false' ? '' : html`
                                                                            <div class="flex-fill d-flex flex-column"
                                                                                 style="gap: 8px;font-size: 16px;font-weight: 700;">
                                                                                <div>庫存警示</div>
                                                                                <div class="w-100"
                                                                                     style="font-size: 14px;font-weight: 400;color: #8D8D8D;">
                                                                                    當庫存低於此數量，會自動寄送警示通知。
                                                                                </div>
                                                                                <input
                                                                                        class="w-100"
                                                                                        value="${variant.save_stock ?? '0'}"
                                                                                        style="padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;"
                                                                                        placeholder="請輸入安全庫存"
                                                                                        onchange="${gvc.event((e) => {
                                                                                            variant.save_stock = e.value;
                                                                                        })}"
                                                                                />
                                                                            </div>`
                                                                }
                                                            `;
                                                        },
                                                        divCreate: {style: `display: flex;flex-direction: column;align-items: flex-start;gap: 12px;align-self: stretch;`},
                                                    };
                                                })}
                                            </div>
                                        `))
                                        if (postMD.product_category === 'commodity') {
                                            map_.push(BgWidget.mainCard(html`
                                                <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 18px;">
                                                    <div class="title-container px-0">
                                                        <div style="color:#393939;font-weight: 700;">商品管理</div>
                                                        <div class="flex-fill"></div>
                                                        ${(() => {
                                                            const ba = [];
                                                            if ((window.parent as any).glitter.share.PayConfig.deviceType === 'pos') {
                                                                ba.push(BgWidget.grayButton(
                                                                        '條碼列印',
                                                                        gvc.event(() => {
                                                                            IminModule.printCode(`variants-` + variant.barcode)
                                                                        }),
                                                                        {icon: `fa-solid fa-rectangle-barcode`}
                                                                ))
                                                            }
                                                            ba.push(BgWidget.grayButton(
                                                                    '商品條碼',
                                                                    gvc.event(() => {
                                                                        const dialog = new ShareDialog(gvc.glitter);
                                                                        if (!variant.barcode) {
                                                                            dialog.errorMessage({text: '請先設定商品條碼'});
                                                                            return;
                                                                        }
                                                                        (window.parent as any).glitter.addMtScript(
                                                                                [
                                                                                    {
                                                                                        src: 'https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js',
                                                                                    },
                                                                                ],
                                                                                () => {
                                                                                    (window.parent as any).QRCode.toDataURL(
                                                                                            `variants-` + variant.barcode,
                                                                                            {
                                                                                                width: 200,
                                                                                                margin: 2,
                                                                                            },
                                                                                            function (err: any, url: any) {
                                                                                                if (err) {
                                                                                                    console.error(err);
                                                                                                    return;
                                                                                                }
                                                                                                (window.parent as any).glitter.openDiaLog(new URL('../dialog/image-preview.js', import.meta.url).href, 'preview', url);
                                                                                            }
                                                                                    );
                                                                                },
                                                                                () => {
                                                                                }
                                                                        );
                                                                    }),
                                                                    {icon: `fa-regular fa-eye`}
                                                            ))
                                                            return ba.join(`<div class="mx-2"></div>`)
                                                        })()}
                                                    </div>
                                                    <div style="display: flex;width: 100%;height: 70px;flex-direction: column;justify-content: center;align-items: flex-start;gap: 8px;">
                                                        <div style="font-weight: 400;font-size: 16px;">存貨單位 (SKU)
                                                        </div>
                                                        <input
                                                                style="width:100%;border-radius: 10px;border: 1px solid #DDD;height: 40px;padding: 0px 18px;"
                                                                placeholder="請輸入存貨單位"
                                                                value="${variant.sku ?? ''}"
                                                                onchange="${gvc.event((e) => {
                                                                    variant.sku = e.value;
                                                                })}"
                                                        />
                                                    </div>
                                                    <div style="display: flex;width: 100%;height: 70px;flex-direction: column;justify-content: center;align-items: flex-start;gap: 8px;">
                                                        <div style="font-weight: 400;font-size: 16px;">商品條碼
                                                            (ISBN、UPC、GTIN等)
                                                        </div>
                                                        <input
                                                                style="width:100%;border-radius: 10px;border: 1px solid #DDD;height: 40px;padding: 0px 18px;"
                                                                placeholder="請輸入商品條碼"
                                                                value="${variant.barcode ?? ''}"
                                                                onchange="${gvc.event((e) => {
                                                                    // 正则表达式检查是否只包含英文字母和数字
                                                                    const regex = /^[a-zA-Z0-9]+$/;
                                                                    // 测试字符串是否匹配正则表达式
                                                                    if (!regex.test(e.value)) {
                                                                        e.value = '';
                                                                        const dialog = new ShareDialog(gvc.glitter);
                                                                        dialog.errorMessage({text: '條碼僅能輸入英數字'});
                                                                    } else {
                                                                        variant.barcode = e.value;
                                                                    }
                                                                })}"
                                                        />
                                                    </div>
                                                </div>
                                            `))
                                        }
                                        return map_.join('')
                                    })()}
                                    ${document.body.clientWidth > 768 && obj.single === undefined ? BgWidget.mbContainer(120) : ''}
                                </div>
                                <div class="${obj.single ? `d-none` : ``}" style="min-width:300px; max-width:100%;">
                                    ${BgWidget.summaryCard(
                                            gvc.bindView({
                                                bind: 'right',
                                                view: () => {
                                                    let rightHTML = postMD.variants
                                                            .map((data: any) => {
                                                                data[`preview_image_${ShoppingProductSetting.select_language}`] = data[`preview_image_${ShoppingProductSetting.select_language}`] || data.preview_image || getDefImg();
                                                                let pre_ciew = data[`preview_image_${ShoppingProductSetting.select_language}`]
                                                                if ((pre_ciew === BgWidget.noImageURL) || !pre_ciew) {
                                                                    pre_ciew = getDefImg()
                                                                }
                                                                if (!data.editable) {
                                                                    return html`
                                                                        <div
                                                                                class="d-flex align-items-center"
                                                                                style="gap: 10px;cursor: pointer"
                                                                                onmouseover="${gvc.event((e) => {
                                                                                    e.style.background = '#F7F7F7';
                                                                                })}"
                                                                                onmouseout="${gvc.event((e) => {
                                                                                    e.style.background = '#FFFFFF';
                                                                                })}"
                                                                                onclick="${gvc.event(() => {
                                                                                    checkStore(
                                                                                            () => {
                                                                                                postMD.variants.map((dd: any) => {
                                                                                                    dd.editable = false;
                                                                                                });
                                                                                                data.editable = true;
                                                                                                obj.vm.type = 'editSpec';
                                                                                            },
                                                                                            () => {
                                                                                            }
                                                                                    );
                                                                                })}"
                                                                        >
                                                                            ${BgWidget.validImageBox({
                                                                                gvc,
                                                                                image: pre_ciew,
                                                                                width: 40,
                                                                                style: 'border-radius: 10px',
                                                                            })}
                                                                            <div>${data.spec.join(' / ')}</div>
                                                                        </div>
                                                                    `;
                                                                } else {
                                                                    return ``;
                                                                }
                                                            })
                                                            .join('');

                                                    return html`
                                                        <div style="font-weight: 700;">其他規格</div>
                                                        <div class="d-flex flex-column mt-3" style="gap:16px">
                                                            ${rightHTML}
                                                        </div>
                                                    `;
                                                },
                                            })
                                    )}
                                </div>
                                ${obj.single ? '' : BgWidget.mbContainer(240)}
                            </div>
                        `,
                        {
                            style: obj.vm.type === 'editSpec' ? '' : 'margin-top: 0 !important;',
                        }
                )}
                <div class="update-bar-container ${obj.single ? `d-none` : ``}">
                    ${BgWidget.cancel(
                            obj.gvc.event(() => {
                                checkStore(
                                        obj && obj.goBackEvent
                                                ? obj.goBackEvent.cancel
                                                : () => {
                                                    variant = orignData;
                                                    obj.vm.type = 'replace';
                                                }
                                );
                            })
                    )}
                    ${BgWidget.save(
                            obj.gvc.event(() => {
                                let checkPass = true;
                                if (checkPass) {
                                    postMD.variants[index] = variant;
                                    if (obj && obj.goBackEvent) {
                                        obj.goBackEvent.save(postMD);
                                    } else {
                                        obj.vm.type = 'replace';
                                    }
                                }
                            })
                    )}
                </div>
            </div>`;
    }

    static getActiveDatetime = (): ActiveSchedule => {
        return {
            startDate: this.getDateTime().date,
            startTime: '00:00',
            endDate: undefined,
            endTime: undefined,
        };
    };

    static getInactiveDatetime = (): ActiveSchedule => {
        return {
            startDate: this.getDateTime(-1).date,
            startTime: '00:00',
            endDate: this.getDateTime(-1).date,
            endTime: '00:00',
        };
    };

    static getTimeState(jsonData: {
        startDate?: string;
        startTime?: string;
        endDate?: string;
        endTime?: string
    }): 'beforeStart' | 'inRange' | 'afterEnd' | 'draft' {
        const now = new Date();
        const {startDate, startTime, endDate, endTime} = jsonData;

        // 將日期和時間組合為完整的時間點
        const start = startDate && startTime ? new Date(`${startDate}T${startTime}`) : null;
        const end = endDate && endTime ? new Date(`${endDate}T${endTime}`) : null;

        if (!start) return 'draft';

        if (start && now < start) {
            return 'beforeStart'; // 待上架
        }
        if (end && now > end) {
            return 'afterEnd'; // 下架
        }
        if (start && now >= start && (!end || now <= end)) {
            return 'inRange'; // 上架
        }

        // 如果 start 或 end 沒有設定且 data 不符合條件
        return 'draft';
    }

    static getDateTime = (n = 0) => {
        const now = new Date();
        now.setDate(now.getDate() + n);
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        const timeStr = `${hours}:00`;
        return {date: dateStr, time: timeStr};
    };

    public static async editProduct(obj: {
        vm: any;
        gvc: GVC;
        type?: 'add' | 'replace';
        defData?: any;
        initial_data?: any;
        product_type?: 'product' | 'addProduct' | 'giveaway' | 'hidden'
    }) {
        let postMD: Product = obj.initial_data || ProductConfig.getInitial(obj);
        let stockList: any = [];

        function setProductType() {
            switch (obj.product_type) {
                case 'product':
                    postMD.visible = 'true';
                    postMD.productType = {product: true, addProduct: false, giveaway: false};
                    break;
                case 'addProduct':
                    postMD.visible = 'true';
                    postMD.productType = {product: false, addProduct: true, giveaway: false};
                    break;
                case 'giveaway':
                    postMD.visible = 'true';
                    postMD.productType = {product: false, addProduct: false, giveaway: true};
                    break;
                case 'hidden':
                    postMD.visible = 'false';
                    postMD.productType = {product: true, addProduct: false, giveaway: false};
                    break;
            }
        }

        function getStockStore() {
            if (stockList.length == 0) {
                ApiUser.getPublicConfig('store_manager',
                    'manager'
                ).then((storeData: any) => {
                    if (storeData.result) {
                        stockList = storeData.response.value.list;
                        gvc.notifyDataChange('selectFunRow');
                    }
                })
            }
        }

        getStockStore();
        setProductType();
        postMD.content_array = postMD.content_array ?? [];
        postMD.content_json = postMD.content_json ?? [];
        if (obj.type === 'replace') {
            postMD = {
                ...postMD,
                ...obj.defData,
            };
        } else {
            obj.vm.replaceData = postMD;
            postMD.product_category = ShoppingProductSetting.select_product_type
        }
        let origin_data = JSON.stringify(postMD);
        setTimeout(() => {
            origin_data = JSON.stringify(postMD);
        }, 1000);
        (window.parent as any).glitter.share.checkData = () => origin_data === JSON.stringify(postMD);
        const gvc = obj.gvc;
        const dialog = new ShareDialog(gvc.glitter);
        const saasConfig: { config: any; api: any } = (window.parent as any).saasConfig;
        let shipment_config: any = await saasConfig.api.getPrivateConfig(saasConfig.config.appName, `glitter_shipment`);
        if (shipment_config.response.result[0]) {
            shipment_config = shipment_config.response.result[0].value || {};
        } else {
            shipment_config = {};
        }
        gvc.addStyle(`
            .specInput:focus {
                outline: none;
            }
        `);
        const vm: {
            id: string,
            language: any,
            content_detail: any,
            show_page: 'normal' | 'advance'
        } = {
            id: gvc.glitter.getUUID(),
            language: ShoppingProductSetting.select_language,
            content_detail: undefined,
            show_page: 'normal'
        };


        function refreshProductPage() {
            gvc.notifyDataChange(vm.id);
        }

        ProductInitial.initial(postMD)
        postMD.product_category = postMD.product_category || 'commodity'
        return gvc.bindView(() => {
            return {
                bind: vm.id,
                view: () => {
                    //如果沒有塞入預設值
                    const language_data: any = (postMD.language_data as any)[vm.language];

                    language_data.title = language_data.title && language_data.title.trim() ? language_data.title : postMD?.title || "Default Title";
                    language_data.content = language_data.content ?? postMD.content;
                    language_data.content_array = language_data.content_array ?? postMD.content_array;
                    language_data.content_json = language_data.content_json ?? postMD.content_json;
                    language_data.preview_image = language_data.preview_image ?? JSON.parse(JSON.stringify((postMD.preview_image || [])));
                    ShoppingProductSetting.select_language = vm.language;
                    postMD.variants.map((variant: any) => {
                        variant.preview_image = variant[`preview_image_${ShoppingProductSetting.select_language}`] || variant.preview_image || BgWidget.noImageURL
                    })

                    const cat_title = (() => {
                        switch (postMD.product_category) {
                            case "commodity":
                                return '商品'
                            case 'course':
                                return '課程'
                            default:
                                return '商品'
                        }
                    })()
                    return [
                        BgWidget.container(
                            html`
                                <div class="title-container flex-column flex-sm-row" style="">
                                    <div class="d-flex align-items-center w-100">
                                        ${BgWidget.goBack(
                                                obj.gvc.event(() => {
                                                    if ((window.parent as any).glitter.share.checkData && !(window.parent as any).glitter.share.checkData()) {
                                                        dialog.checkYesOrNot({
                                                            text: '尚未儲存內容，是否確認跳轉?',
                                                            callback: (response) => {
                                                                if (response) {
                                                                    (window.parent as any).glitter.share.checkData = () => {
                                                                        return true;
                                                                    };
                                                                    obj.vm.type = 'list';
                                                                }
                                                            },
                                                        });
                                                    } else {
                                                        obj.vm.type = 'list';
                                                    }
                                                })
                                        )}
                                        <div class="d-flex align-items-center ">
                                            <h3 class="mb-0 me-2 tx_title">
                                                ${obj.type === 'replace' ? postMD.title || '編輯' + cat_title : `新增${cat_title}`}</h3>
                                        </div>
                                        <div class="flex-fill"></div>
                                    </div>
                                    <div class="flex-fill"></div>
                                    <div class="d-flex align-items-center justify-content-end w-100 mt-2">
                                        <div class="me-2 ">
                                            ${LanguageBackend.switchBtn({
                                                gvc: gvc,
                                                language: vm.language,
                                                callback: (language) => {
                                                    vm.language = language;
                                                    refreshProductPage();
                                                },
                                            })}
                                        </div>
                                        ${[
                                            obj.type === 'replace'
                                                    ? ''
                                                    : BgWidget.grayButton(
                                                            '代入現有商品',
                                                            gvc.event(() => {
                                                                BgProduct.productsDialog({
                                                                    gvc: gvc,
                                                                    default: [],
                                                                    single: true,
                                                                    callback: (value) => {
                                                                        const dialog = new ShareDialog(gvc.glitter);
                                                                        dialog.dataLoading({visible: true});
                                                                        ApiShop.getProduct({
                                                                            page: 0,
                                                                            limit: 1,
                                                                            id: value[0],
                                                                        }).then((data) => {
                                                                            dialog.dataLoading({visible: false});
                                                                            if (data.result && data.response.data && data.response.data.content) {
                                                                                const copy = data.response.data.content;
                                                                                postMD = {
                                                                                    ...postMD,
                                                                                    ...copy,
                                                                                };
                                                                                if (!copy.language_data) {
                                                                                    const language_data: any = postMD.language_data['zh-TW'];
                                                                                    language_data.title = copy.title;
                                                                                    language_data.content = copy.content;
                                                                                    language_data.content_array = copy.content_array;
                                                                                    language_data.content_json = copy.content_json;
                                                                                }
                                                                                postMD.id = undefined;
                                                                                setProductType();
                                                                                gvc.notifyDataChange(vm.id);
                                                                            }
                                                                        });
                                                                    },
                                                                    show_product_type: true,
                                                                });
                                                            }),
                                                            {}
                                                    ),
                                            postMD.id
                                                    ? BgWidget.grayButton(
                                                            document.body.clientWidth > 768 ? '預覽商品' : '預覽',
                                                            gvc.event(() => {
                                                                const href = `https://${(window.parent as any).glitter.share.editorViewModel.domain}/products/${language_data.seo.domain}`;
                                                                (window.parent as any).glitter.openNewTab(href);
                                                            }),
                                                            {icon: document.body.clientWidth > 768 ? 'fa-regular fa-eye' : undefined}
                                                    )
                                                    : '',
                                        ]
                                                .filter((str) => str.length > 0)
                                                .join(html`
                                                    <div class="mx-1"></div>`)}
                                    </div>
                                </div>
                                ${BgWidget.tab(
                                        [
                                            {
                                                title: '基本設定',
                                                key: 'normal',
                                            },
                                            {
                                                title: '進階設定',
                                                key: 'advance',
                                            },
                                        ],
                                        gvc,
                                        vm.show_page,
                                        (text) => {
                                            vm.show_page = text as any;
                                            gvc.notifyDataChange(vm.id);
                                        },
                                        'margin-bottom: 0px;'
                                )}
                                ${(vm.show_page === 'normal') ? ShoppingSettingBasic.main({
                                    gvc: gvc,
                                    vm2: vm,
                                    vm: obj.vm,
                                    reload: () => {
                                        refreshProductPage();
                                    },
                                    language_data: language_data,
                                    postMD: postMD,
                                    shipment_config: shipment_config
                                }) : ShoppingSettingAdvance.main({
                                    gvc: gvc,
                                    vm2: vm,
                                    vm: obj.vm,
                                    reload: () => {
                                        refreshProductPage();
                                    },
                                    language_data: language_data,
                                    postMD: postMD,
                                    shipment_config: shipment_config
                                })}
                            `
                        ),
                        html`
                            <div class="update-bar-container">
                                ${obj.type === 'replace'
                                        ? BgWidget.danger(
                                                obj.gvc.event(() => {
                                                    const dialog = new ShareDialog(obj.gvc.glitter);
                                                    dialog.checkYesOrNot({
                                                        text: '是否確認刪除商品?',
                                                        callback: (response) => {
                                                            if (response) {
                                                                dialog.dataLoading({visible: true});
                                                                ApiShop.delete({
                                                                    id: postMD.id!,
                                                                }).then((res) => {
                                                                    dialog.dataLoading({visible: false});
                                                                    if (res.result) {
                                                                        obj.vm.type = 'list';
                                                                    } else {
                                                                        dialog.errorMessage({text: '刪除失敗'});
                                                                    }
                                                                });
                                                            }
                                                        },
                                                    });
                                                }),
                                                '刪除商品'
                                        )
                                        : ''}
                                ${BgWidget.cancel(
                                        obj.gvc.event(() => {
                                            obj.vm.type = 'list';
                                        })
                                )}
                                ${BgWidget.save(
                                        obj.gvc.event(() => {
                                            setTimeout(() => {
                                                postMD.variants.forEach((variant) => {
                                                    if (Object.keys(variant.stockList).length > 0) {
                                                        variant.stock = 0;
                                                        Object.values(variant.stockList).forEach((data: any) => {
                                                            variant.stock += parseInt(data.count)
                                                        })
                                                    }
                                                })
                                                ProductService.checkData(postMD, obj, vm, () => {
                                                    refreshProductPage();
                                                });
                                            }, 500);
                                        }),
                                        '儲存',
                                        'guide5-8'
                                )}
                            </div>`,
                    ].join('');
                },
                divCreate: {
                    class: `d-flex`,
                    style: `font-size: 16px;color:#393939;position: relative;padding-bottom:240px;`,
                },
                onCreate: () => {
                    dialog.dataLoading({visible: false});
                }
            };
        });
    }

    public static specInput(
        gvc: GVC,
        temp: any,
        cb: {
            cancel: () => void;
            save: () => void;
        }
    ) {
        const vm = {
            viewId: Tool.randomString(7),
            enterId: Tool.randomString(7),
        };
        let keyboard = '';
        let saveKeyEvent: any = undefined
        return html`
            <div class="bg-white w-100">
                ${[
                    html`
                        <div class="w-100"
                             style="background-color:white !important;display: flex;gap: 8px;flex-direction: column;">
                            <div style="background-color:white !important;width: 70px">規格種類</div>
                            <input
                                    class="w-100"
                                    style="background-color:white !important;height: 40px;padding: 0px 18px;border-radius: 10px;border: 1px solid #DDD;"
                                    placeholder="例如 : 顏色、大小"
                                    value="${temp.title}"
                                    onchange="${gvc.event((e) => {
                                        temp.title = e?.value ?? '';
                                    })}"
                            />
                        </div>`,
                    gvc.bindView(
                            () => {

                                return {
                                    bind: vm.viewId,
                                    view: () => {
                                        return html`
                                            <div class="w-100"
                                                 style="background-color:white !important;margin-top: 8px;">選項
                                                (輸入完請按enter)
                                            </div>
                                            <div
                                                    class="w-100 d-flex align-items-center position-relative"
                                                    style="background-color:white !important;line-height: 40px;min-height: 40px;padding: 10px 18px;border-radius: 10px;border: 1px solid #DDD;gap: 10px; flex-wrap: wrap;"
                                            >
                                                <div class="d-flex align-items-center"
                                                     style="gap: 10px; flex-wrap: wrap;background-color:white !important;">
                                                    ${(() => {
                                                        const tempHTML = [];
                                                        temp.option.map((data: any, index: number) => {
                                                            tempHTML.push(
                                                                    html`
                                                                        <div
                                                                                class="d-flex align-items-center"
                                                                                style="height: 24px;border-radius: 5px;background: #F2F2F2;display: flex;padding: 1px 6px;justify-content: center;align-items: center;gap: 4px;"
                                                                        >
                                                                            ${data.title}<i
                                                                                class="fa-solid fa-xmark ms-1 fs-5"
                                                                                style="font-size: 12px;cursor: pointer;"
                                                                                onclick="${gvc.event(() => {
                                                                                    temp.option.splice(index, 1);
                                                                                    gvc.notifyDataChange(vm.viewId);
                                                                                })}"
                                                                        ></i>
                                                                        </div>
                                                                    `
                                                            );
                                                        });
                                                        tempHTML.push(html`<input
                                                                id="${vm.enterId}"
                                                                class="flex-fill d-flex align-items-center border specInput-${vm.enterId} h-100 p-2"
                                                                value=""
                                                                style="background-color:white !important;"
                                                                placeholder="${temp.option.length > 0 ? '請繼續輸入' : ''}"
                                                        />`);
                                                        return tempHTML.join('');
                                                    })()}
                                                </div>
                                                <div
                                                        class="d-flex align-items-center ${temp.option.length > 0 ? 'd-none' : ''} ps-2"
                                                        style="color: #8D8D8D;width: 100%;height:100%;position: absolute;left: 18px;top: 0;"
                                                        onclick="${gvc.event((e) => {
                                                            e.classList.add('d-none');
                                                            setTimeout(() => {
                                                                (document.querySelector(`.specInput-${vm.enterId}`) as HTMLButtonElement)!.focus();
                                                            }, 100);
                                                        })}"
                                                >
                                                    例如 : 黑色、S號
                                                </div>
                                            </div>
                                        `;
                                    },
                                    divCreate: {
                                        class: 'w-100 bg-white',
                                        style: 'display: flex;gap: 8px;flex-direction: column;',
                                    },
                                    onCreate: () => {
                                        let enterPass = true;
                                        const inputElement = document.getElementById(vm.enterId) as any;
                                        gvc.glitter.share.keyDownEvent = gvc.glitter.share.keyDownEvent ?? {};

                                        keyboard === 'Enter' && inputElement && inputElement.focus();

                                        inputElement.addEventListener('compositionupdate', function () {
                                            enterPass = false;
                                        });

                                        inputElement.addEventListener('compositionend', function () {
                                            enterPass = true;
                                        });

                                        saveKeyEvent = () => {
                                            return new Promise((resolve, reject) => {
                                                setTimeout(() => {
                                                    if (!inputElement.value) {
                                                        resolve(true);
                                                        return
                                                    }
                                                    temp.option.push({
                                                        title: inputElement.value,
                                                    });
                                                    inputElement.value = '';
                                                    temp.option = temp.option.reduce(
                                                            (
                                                                    acc: { title: string }[],
                                                                    current: {
                                                                        title: string;
                                                                    }
                                                            ) => {
                                                                const isTitleExist = acc.find((item) => item.title === current.title);
                                                                if (!isTitleExist) {
                                                                    acc.push(current);
                                                                }
                                                                return acc;
                                                            },
                                                            []
                                                    );
                                                    resolve(true)
                                                    gvc.notifyDataChange(vm.viewId);
                                                }, 30);
                                            })

                                        }
                                        document.removeEventListener('keydown', gvc.glitter.share.keyDownEvent[vm.enterId]);


                                        gvc.glitter.share.keyDownEvent[vm.enterId] = (event: any) => {
                                            keyboard = event.key;
                                            if (enterPass && inputElement && inputElement.value.length > 0 && event.key === 'Enter') {
                                                saveKeyEvent()
                                            }
                                        };

                                        document.addEventListener('keydown', gvc.glitter.share.keyDownEvent[vm.enterId]);
                                    },
                                }
                            }),
                    html`
                        <div class="d-flex w-100 justify-content-end align-items-center w-100 bg-white"
                             style="gap:14px; margin-top: 12px;">
                            ${BgWidget.cancel(
                                    gvc.event(() => {
                                        cb.cancel();
                                    })
                            )}
                            ${BgWidget.save(
                                    gvc.event(() => {
                                        saveKeyEvent().then(() => {
                                            cb.save();
                                        });
                                    }),
                                    '完成'
                            )}
                        </div>`,
                ].join('')}
            </div>`;
    }

    public static putEvent(postMD: any, gvc: GVC, vm: any) {
        const dialog = new ShareDialog(gvc.glitter);
        dialog.dataLoading({text: '商品上傳中...', visible: true});
        postMD.type = 'product';
        postMD.variants.map((dd: any) => {
            dd.checked = undefined;
            return dd;
        });
        ApiShop.putProduct({
            data: postMD,
            token: (window.parent as any).config.token,
        }).then((re) => {
            dialog.dataLoading({visible: false});
            if (re.result) {
                dialog.successMessage({text: `更改成功`});
                vm.type = 'list';
            } else if (re.response.data.code === '733') {
                dialog.errorMessage({text: `此網域已被使用`});
            } else {
                dialog.errorMessage({text: `上傳失敗`});
            }
        });
    }

    public static postEvent(postMD: any, gvc: GVC, vm: any) {
        const dialog = new ShareDialog(gvc.glitter);
        dialog.dataLoading({text: '商品上傳中...', visible: true});
        postMD.type = 'product';
        postMD.variants.map((dd: any) => {
            dd.checked = undefined;
            return dd;
        });

        ApiShop.postProduct({
            data: postMD,
            token: (window.parent as any).config.token,
        }).then((re) => {
            dialog.dataLoading({visible: false});
            if (re.result) {
                dialog.successMessage({text: `上傳成功`});
                vm.type = 'list';
            } else if (re.response.data.code === '733') {
                dialog.errorMessage({text: `此網域已被使用`});
            } else {
                dialog.errorMessage({text: `上傳失敗`});
            }
        });
    }

    public static getProductTypeString(product: any) {
        product.productType = product.productType ?? {
            product: true,
            addProduct: false,
            giveaway: false,
        };
        if (product.productType['product']) {
            if ((product.visible || 'true') === 'false') {
                return '隱形賣場';
            } else {
                return '前台商品';
            }
        } else if (product.productType['addProduct']) {
            return '加購品';
        } else if (product.productType['giveaway']) {
            return '贈品';
        }
        return '未知';
    }

    static getOnboardStatus(content: any) {
        if (content.status === 'draft') {
            return BgWidget.secondaryInsignia('草稿');
        }
        if (!content.active_schedule) {
            return BgWidget.infoInsignia('上架');
        }
        const state = ShoppingProductSetting.getTimeState(content.active_schedule);
        switch (state) {
            case 'afterEnd':
                return BgWidget.secondaryInsignia('下架');
            case 'beforeStart':
                return BgWidget.warningInsignia('待上架');
            case 'inRange':
                return BgWidget.infoInsignia('上架');
            default:
                return BgWidget.secondaryInsignia('草稿');
        }
    }
}

(window as any).glitter.setModule(import.meta.url, ShoppingProductSetting);
