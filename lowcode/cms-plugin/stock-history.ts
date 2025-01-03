import { GVC } from '../glitterBundle/GVController.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { BgListComponent } from '../backend-manager/bg-list-component.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { FilterOptions } from './filter-options.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { ApiStock, StockHistoryType, StockHistoryData, ContentProduct } from '../glitter-base/route/stock.js';
import { StockStores, StoreData } from './stock-stores.js';
import { StockVendors, VendorData } from './stock-vendors.js';
import { CheckInput } from '../modules/checkInput.js';
import { Tool } from '../modules/tool.js';

const html = String.raw;

type VM = {
    id: string;
    tableId: string;
    type: StockHistoryType;
    view: 'list' | 'create' | 'replace';
    data: StockHistoryData;
    dataList: StockHistoryData[];
    storeList: StoreData[];
    vendorList: VendorData[];
    filter: any;
    query: string;
    queryType: string;
    orderString: string;
};

const typeConfig: {
    [key in StockHistoryType]: {
        name: string;
    };
} = {
    restocking: {
        name: '進貨',
    },
    transfer: {
        name: '調撥',
    },
    checking: {
        name: '盤點',
    },
};

const statusConfig: {
    [key in number]: {
        title: string;
        badge: string;
    };
} = {
    0: {
        title: '已完成',
        badge: 'info',
    },
    1: {
        title: '已補貨',
        badge: 'info',
    },
    2: {
        title: '待進貨',
        badge: 'warning',
    },
    3: {
        title: '核對中',
        badge: 'warning',
    },
    4: {
        title: '已暫停',
        badge: 'normal',
    },
    5: {
        title: '待補貨',
        badge: 'notify',
    },
    6: {
        title: '已取消',
        badge: 'notify',
    },
};

export class StockHistory {
    static main(gvc: GVC, type: StockHistoryType) {
        const glitter = gvc.glitter;

        const emptyData = (): StockHistoryData => {
            return {
                id: '',
                type: type,
                status: 2, // 新建立的訂單送出時，狀態為「待進貨」
                order_id: '',
                created_time: '',
                content: {
                    vendor: '',
                    store_in: '',
                    store_out: '',
                    check_member: '',
                    check_according: 'all',
                    note: '',
                    product_list: [],
                },
            };
        };

        const vm: VM = {
            id: glitter.getUUID(),
            tableId: glitter.getUUID(),
            type: type,
            view: 'list',
            data: emptyData(),
            dataList: [],
            storeList: [],
            vendorList: [],
            query: '',
            queryType: '',
            filter: {},
            orderString: '',
        };

        return gvc.bindView({
            bind: vm.id,
            dataList: [{ obj: vm, key: 'view' }],
            view: () => {
                if (vm.view === 'list') {
                    return this.list(gvc, vm);
                }

                if (vm.view === 'replace') {
                    return this.detailPage(gvc, vm, 'replace');
                }

                if (vm.view === 'create') {
                    vm.data = emptyData();
                    return this.detailPage(gvc, vm, 'create');
                }

                return '';
            },
        });
    }

    static list(gvc: GVC, vm: VM) {
        const ListComp = new BgListComponent(gvc, vm, FilterOptions.stockHistoryFilterFrame);
        const typeData = typeConfig[vm.type];
        vm.filter = ListComp.getFilterObject();
        let vmi: any = undefined;

        function getDatalist() {
            return vm.dataList.map((dd: StockHistoryData) => {
                return [
                    {
                        key: '進貨單編號',
                        value: `<span class="fs-7">${dd.order_id}</span>`,
                    },
                    {
                        key: '進貨日期',
                        value: `<span class="fs-7">${dd.created_time}</span>`,
                    },
                    {
                        key: '庫存點名稱',
                        value: `<span class="fs-7">${(() => {
                            const store = vm.storeList.find((s) => s.id === dd.content.store_in);
                            return store ? store.name : '';
                        })()}</span>`,
                    },
                    {
                        key: '總金額',
                        value: `<span class="fs-7">$ ${(dd.content.total_price || 0).toLocaleString()}</span>`,
                    },
                    {
                        key: '供應商',
                        value: `<span class="fs-7">${(() => {
                            const vendor = vm.vendorList.find((v) => v.id === dd.content.vendor);
                            return vendor ? vendor.name : '';
                        })()}</span>`,
                    },
                    {
                        key: '進貨狀態',
                        value: `<span class="fs-7">${(() => {
                            const statusData = statusConfig[dd.status];
                            switch (statusData.badge) {
                                case 'info':
                                    return BgWidget.infoInsignia(statusData.title);
                                case 'warning':
                                    return BgWidget.warningInsignia(statusData.title);
                                case 'normal':
                                    return BgWidget.normalInsignia(statusData.title);
                                case 'notify':
                                    return BgWidget.notifyInsignia(statusData.title);
                                default:
                                    return statusData.title;
                            }
                        })()}</span>`,
                    },
                ];
            });
        }

        return BgWidget.container(
            html` <div class="title-container">
                    ${BgWidget.title(`${typeData.name}單列表`)}
                    <div class="flex-fill"></div>
                    ${BgWidget.grayButton(
                        `新增${typeData.name}單`,
                        gvc.event(() => {
                            vm.view = 'create';
                        })
                    )}
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
                                                default: vm.queryType || 'order_id',
                                                options: FilterOptions.stockHistorySelect,
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
                                            // BgWidget.funnelFilter({
                                            //     gvc,
                                            //     callback: () => ListComp.showRightMenu(FilterOptions.stockHistoryFunnel),
                                            // }),
                                            // BgWidget.updownFilter({
                                            //     gvc,
                                            //     callback: (value: any) => {
                                            //         vm.orderString = value;
                                            //         gvc.notifyDataChange(vm.tableId);
                                            //         gvc.notifyDataChange(id);
                                            //     },
                                            //     default: vm.orderString || 'default',
                                            //     options: FilterOptions.stockHistoryOrderBy,
                                            // }),
                                        ];

                                        const filterTags = ListComp.getFilterTags(FilterOptions.stockHistoryFunnel);

                                        if (document.body.clientWidth < 768) {
                                            // 手機版
                                            return html` <div style="display: flex; align-items: center; gap: 10px; width: 100%; justify-content: space-between">
                                                    <div>${filterList[0]}</div>
                                                    <div style="display: flex;">${filterList[2] ? `<div class="me-2">${filterList[2]}</div>` : ''} ${filterList[3] ?? ''}</div>
                                                </div>
                                                <div style="display: flex; margin-top: 8px;">${filterList[1]}</div>
                                                <div>${filterTags}</div>`;
                                        } else {
                                            // 電腦版
                                            return html` <div style="display: flex; align-items: center; gap: 10px;">${filterList.join('')}</div>
                                                <div>${filterTags}</div>`;
                                        }
                                    },
                                });
                            })(),
                            gvc.bindView({
                                bind: vm.tableId,
                                view: () => {
                                    return BgWidget.tableV3({
                                        gvc: gvc,
                                        getData: (vd) => {
                                            vmi = vd;
                                            const limit = 100;
                                            Promise.all([
                                                ApiStock.getStockHistory({
                                                    page: vmi.page - 1,
                                                    limit: limit,
                                                    search: vm.query,
                                                    type: vm.type,
                                                    queryType: vm.queryType,
                                                }),
                                                StockStores.getPublicData(),
                                                StockVendors.getPublicData(),
                                            ]).then((dataArray: any) => {
                                                if (dataArray[1].list && dataArray[1].list.length > 0) {
                                                    vm.storeList = dataArray[1].list;
                                                }

                                                if (dataArray[2].list && dataArray[2].list.length > 0) {
                                                    vm.vendorList = dataArray[2].list;
                                                }

                                                const r = dataArray[0];
                                                if (r.result && r.response) {
                                                    vm.dataList = r.response.data;
                                                    vmi.pageSize = Math.ceil(r.response.total / limit);
                                                    vmi.originalData = vm.dataList;
                                                    vmi.tableData = getDatalist();
                                                }

                                                vmi.loading = false;
                                                vmi.callback();
                                            });
                                        },
                                        rowClick: (data, index) => {
                                            vm.data = vm.dataList[index];
                                            vm.view = 'replace';
                                        },
                                        filter: [],
                                    });
                                },
                            }),
                        ].join('')
                    )
                )}`
        );
    }

    static detailPage(gvc: GVC, vm: VM, type: 'create' | 'replace') {
        const glitter = gvc.glitter;
        const dialog = new ShareDialog(glitter);
        const typeData = typeConfig[vm.type];
        const dvm = {
            id: glitter.getUUID(),
            tableId: glitter.getUUID(),
            totalId: glitter.getUUID(),
            variantIds: [] as string[],
            tableLoading: true,
        };

        function getFormStructure() {
            switch (vm.type) {
                case 'restocking':
                    return [
                        html` <div class="row">
                            <div class="col-12 col-md-6">
                                <div class="tx_normal">進貨單編號</div>
                                ${BgWidget.mbContainer(8)}
                                ${BgWidget.editeInput({
                                    gvc: gvc,
                                    title: '',
                                    default: vm.data.order_id || '系統將自動產生流水號',
                                    placeHolder: '',
                                    callback: () => {},
                                    readonly: true,
                                })}
                            </div>
                            ${document.body.clientWidth > 768 ? '' : BgWidget.mbContainer(18)}
                            <div class="col-12 col-md-6">
                                <div class="tx_normal">進貨日期</div>
                                ${BgWidget.mbContainer(8)}
                                ${BgWidget.editeInput({
                                    gvc: gvc,
                                    title: '',
                                    type: 'date',
                                    default: vm.data.created_time ?? '',
                                    placeHolder: '請輸入進貨日期',
                                    callback: (text) => {
                                        vm.data.created_time = text;
                                    },
                                })}
                            </div>
                        </div>`,
                        html`<div class="row">
                            <div class="col-12 col-md-6">
                                <div class="tx_normal">供應商</div>
                                ${BgWidget.mbContainer(8)}
                                ${gvc.bindView(
                                    (() => {
                                        const id = glitter.getUUID();
                                        let dataList: any[] = [];
                                        let loading = true;
                                        return {
                                            bind: id,
                                            view: () => {
                                                if (loading) {
                                                    return BgWidget.spinner({
                                                        container: { style: 'margin-top: 0' },
                                                        circle: { visible: false },
                                                    });
                                                } else {
                                                    return BgWidget.selectOptionAndClickEvent({
                                                        gvc: gvc,
                                                        default: vm.data.content.vendor ?? '',
                                                        options: dataList.map((item) => {
                                                            return {
                                                                key: item.id,
                                                                value: item.name,
                                                                note: item.address,
                                                            };
                                                        }),
                                                        showNote: BgWidget.grayNote(
                                                            (() => {
                                                                const d = dataList.find((item) => {
                                                                    return item.id === vm.data.content.vendor;
                                                                });
                                                                return d ? d.address : '';
                                                            })(),
                                                            'margin: 0 4px;'
                                                        ),
                                                        callback: (data) => {
                                                            vm.data.content.vendor = data ? data.key : '';
                                                            gvc.notifyDataChange(id);
                                                        },
                                                        clickElement: {
                                                            html: html`<div>新增供應商</div>
                                                                <div>
                                                                    <i class="fa-solid fa-plus ps-2" style="font-size: 16px; height: 14px; width: 14px;"></i>
                                                                </div>`,
                                                            event: (gvc2) => {
                                                                const newVendorData = StockVendors.emptyData();
                                                                BgWidget.settingDialog({
                                                                    gvc: gvc2,
                                                                    title: '新增庫存點',
                                                                    innerHTML: (gvc2) => {
                                                                        return StockHistory.vendorForm(gvc2, newVendorData);
                                                                    },
                                                                    footer_html: (gvc2) => {
                                                                        return `${BgWidget.cancel(
                                                                            gvc2.event(() => {
                                                                                gvc2.closeDialog();
                                                                            })
                                                                        )}
                                                                        ${BgWidget.save(
                                                                            gvc2.event(() => {
                                                                                StockVendors.verifyStoreForm(glitter, 'create', newVendorData, (response) => {
                                                                                    gvc2.closeDialog();
                                                                                    vm.data.content.vendor = response.id;
                                                                                    loading = true;
                                                                                    gvc.notifyDataChange(id);
                                                                                });
                                                                            }),
                                                                            '送出'
                                                                        )}`;
                                                                    },
                                                                });
                                                            },
                                                        },
                                                    });
                                                }
                                            },
                                            divCreate: {},
                                            onCreate: () => {
                                                if (loading) {
                                                    ApiUser.getPublicConfig('vendor_manager', 'manager').then((dd: any) => {
                                                        if (dd.result && dd.response.value) {
                                                            dataList = dd.response.value.list;
                                                        }
                                                        loading = false;
                                                        gvc.notifyDataChange(id);
                                                    });
                                                }
                                            },
                                        };
                                    })()
                                )}
                            </div>
                            <div class="col-12 col-md-6">
                                <div class="tx_normal">庫存點</div>
                                ${BgWidget.mbContainer(8)}
                                ${gvc.bindView(
                                    (() => {
                                        const id = glitter.getUUID();
                                        let dataList: any[] = [];
                                        let loading = true;
                                        return {
                                            bind: id,
                                            view: () => {
                                                if (loading) {
                                                    return BgWidget.spinner({
                                                        container: { style: 'margin-top: 0' },
                                                        circle: { visible: false },
                                                    });
                                                } else {
                                                    return BgWidget.selectOptionAndClickEvent({
                                                        gvc: gvc,
                                                        default: vm.data.content.store_in ?? '',
                                                        options: dataList.map((item) => {
                                                            return {
                                                                key: item.id,
                                                                value: item.name,
                                                                note: item.address,
                                                            };
                                                        }),
                                                        showNote: BgWidget.grayNote(
                                                            (() => {
                                                                const d = dataList.find((item) => {
                                                                    return item.id === vm.data.content.store_in;
                                                                });
                                                                return d ? d.address : '';
                                                            })(),
                                                            'margin: 0 4px;'
                                                        ),
                                                        callback: (data) => {
                                                            vm.data.content.store_in = data ? data.key : '';
                                                            gvc.notifyDataChange(id);
                                                        },
                                                        clickElement: {
                                                            html: html`<div>新增庫存點</div>
                                                                <div>
                                                                    <i class="fa-solid fa-plus ps-2" style="font-size: 16px; height: 14px; width: 14px;"></i>
                                                                </div>`,
                                                            event: (gvc2) => {
                                                                const newStoreData = StockStores.emptyData();
                                                                BgWidget.settingDialog({
                                                                    gvc: gvc2,
                                                                    title: '新增庫存點',
                                                                    innerHTML: (gvc2) => {
                                                                        return StockHistory.storeForm(gvc2, newStoreData);
                                                                    },
                                                                    footer_html: (gvc2) => {
                                                                        return `${BgWidget.cancel(
                                                                            gvc2.event(() => {
                                                                                gvc2.closeDialog();
                                                                            })
                                                                        )}
                                                                        ${BgWidget.save(
                                                                            gvc2.event(() => {
                                                                                StockStores.verifyStoreForm(glitter, 'create', newStoreData, (response) => {
                                                                                    gvc2.closeDialog();
                                                                                    vm.data.content.store_in = response.id;
                                                                                    loading = true;
                                                                                    gvc.notifyDataChange(id);
                                                                                });
                                                                            }),
                                                                            '送出'
                                                                        )}`;
                                                                    },
                                                                });
                                                            },
                                                        },
                                                    });
                                                }
                                            },
                                            divCreate: {},
                                            onCreate: () => {
                                                if (loading) {
                                                    ApiUser.getPublicConfig('store_manager', 'manager').then((dd: any) => {
                                                        if (dd.result && dd.response.value) {
                                                            dataList = dd.response.value.list;
                                                        }
                                                        loading = false;
                                                        gvc.notifyDataChange(id);
                                                    });
                                                }
                                            },
                                        };
                                    })()
                                )}
                            </div>
                        </div> `,
                    ];
                case 'transfer':
                    return [];
                case 'checking':
                    return [];
            }
        }

        function setVariantList(ids: string[], callback: () => void) {
            if (ids.length === 0) {
                callback();
                return;
            }

            ApiShop.getVariants({
                page: 0,
                limit: 99999,
                id_list: ids.join(','),
                productType: 'all'
            }).then((r) => {
                const origins = vm.data.content.product_list.slice();
                vm.data.content.product_list = [];
                if (r.result && r.response.data) {
                    r.response.data.forEach((item: any) => {
                        const origin = origins.find((o) => {
                            return o.variant_id === item.id;
                        });
                        const title = item.product_content.title;
                        const spec = item.variant_content.spec;
                        const sku = item.variant_content.sku;
                        vm.data.content.product_list.push({
                            variant_id: item.id,
                            cost: 0,
                            note: '',
                            transfer_count: 0,
                            recent_count: 0,
                            check_count: 0,
                            ...(origin ?? {}),
                            title: title,
                            spec: spec && spec.length > 0 ? spec.join('/') : '單一規格',
                            sku: sku ?? '',
                        });
                    });
                }
                callback();
            });
        }

        function specDatalist(page: number, limit: number) {
            const x = (page - 1) * limit;
            return vm.data.content.product_list.slice(x, x + limit).map((dd: ContentProduct, index: number) => {
                const realData = vm.data.content.product_list[x + index];
                return [
                    {
                        key: '商品',
                        value: `<span class="fs-7">${dd.title || '－'}</span>`,
                    },
                    {
                        key: '規格',
                        value: `<span class="fs-7">${dd.spec}</span>`,
                    },
                    {
                        key: '存貨單位(SKU)',
                        value: `<span class="fs-7">${dd.sku || '－'}</span>`,
                    },
                    {
                        key: '進貨成本',
                        value: html` <div style="width: 100px" onclick="${gvc.event((e, event) => event.stopPropagation())}">
                            <input
                                class="form-control"
                                type="number"
                                min="0"
                                style="border-radius: 10px; border: 1px solid #DDD; padding-left: 18px;"
                                onchange="${gvc.event((e) => {
                                    let n = parseInt(e.value, 10);
                                    if (n < 0) {
                                        n = 0;
                                    }
                                    realData.cost = n;
                                    gvc.notifyDataChange(`subtotoal_${index}`);
                                })}"
                                value="${dd.cost ?? 0}"
                            />
                        </div>`,
                    },
                    {
                        key: '數量',
                        value: html` <div style="width: 100px" onclick="${gvc.event((e, event) => event.stopPropagation())}">
                            <input
                                class="form-control"
                                type="number"
                                min="0"
                                style="border-radius: 10px; border: 1px solid #DDD; padding-left: 18px;"
                                onchange="${gvc.event((e) => {
                                    let n = parseInt(e.value, 10);
                                    if (n < 0) {
                                        n = 0;
                                    }
                                    realData.transfer_count = n;
                                    gvc.notifyDataChange(`subtotoal_${index}`);
                                })}"
                                value="${dd.transfer_count ?? 0}"
                            />
                        </div>`,
                    },
                    {
                        key: '小計',
                        value: gvc.bindView({
                            bind: `subtotoal_${index}`,
                            view: () => {
                                const subtotal = dd.cost * dd.transfer_count;
                                return html`<span class="fs-7">$ ${subtotal.toLocaleString()}</span>`;
                            },
                            onCreate: () => {
                                gvc.notifyDataChange(dvm.totalId);
                            },
                        }),
                    },
                    {
                        key: '備註',
                        value: html` <div style="width: 120px" onclick="${gvc.event((e, event) => event.stopPropagation())}">
                            <input
                                class="form-control"
                                type="number"
                                min="0"
                                style="border-radius: 10px; border: 1px solid #DDD; padding-left: 18px;"
                                onchange="${gvc.event((e) => {
                                    realData.note = e.value;
                                })}"
                                value="${dd.note ?? ''}"
                            />
                        </div>`,
                    },
                ];
            });
        }

        return BgWidget.container(
            [
                html` <div class="title-container">
                        <div class="mt-1">
                            ${BgWidget.goBack(
                                gvc.event(() => {
                                    vm.view = 'list';
                                })
                            )}
                        </div>
                        <div>${BgWidget.title(`${type === 'create' ? '新增' : '編輯'}${typeData.name}單`)}</div>
                    </div>
                    <div class="flex-fill"></div>`,
                html` <div class="d-flex justify-content-center ${document.body.clientWidth < 768 ? 'flex-column' : ''}" style="gap: 24px">
                    ${BgWidget.container(
                        gvc.bindView(() => {
                            let vmi: any = undefined;
                            return {
                                bind: dvm.id,
                                view: () => {
                                    return [
                                        BgWidget.mainCard(
                                            [
                                                html` <div class="tx_700">${typeData.name}單資料</div>`,
                                                ...getFormStructure(),
                                                html` <div class="tx_normal">備註</div>
                                                    ${EditorElem.editeText({
                                                        gvc: gvc,
                                                        title: '',
                                                        default: vm.data.content.note ?? '',
                                                        placeHolder: '請輸入備註',
                                                        callback: (text) => {
                                                            vm.data.content.note = text;
                                                        },
                                                    })}`,
                                            ].join(BgWidget.mbContainer(18))
                                        ),
                                        BgWidget.mainCard(
                                            [
                                                html`
                                                    <div class="tx_700">進貨商品</div>
                                                    ${BgWidget.mbContainer(18)}
                                                    ${gvc.bindView({
                                                        bind: dvm.tableId,
                                                        view: () => {
                                                            if (dvm.tableLoading) {
                                                                dvm.variantIds = vm.data.content.product_list.map((product) => {
                                                                    return `${product.variant_id}`;
                                                                });
                                                                dvm.tableLoading = false;
                                                            }

                                                            return [
                                                                BgWidget.tableV3({
                                                                    gvc: gvc,
                                                                    getData: (vd) => {
                                                                        vmi = vd;
                                                                        const limit = 99999;
                                                                        setVariantList(dvm.variantIds, () => {
                                                                            vmi.pageSize = Math.ceil(vm.data.content.product_list.length / limit);
                                                                            vmi.originalData = vm.data.content.product_list;
                                                                            vmi.tableData = specDatalist(vmi.page, limit);
                                                                            vmi.loading = false;
                                                                            vmi.callback();
                                                                        });
                                                                    },
                                                                    rowClick: () => {},
                                                                    filter: [],
                                                                    hiddenPageSplit: true,
                                                                }),
                                                                type === 'create'
                                                                    ? html`<div
                                                                          class="w-100 d-flex align-items-center justify-content-center cursor_pointer"
                                                                          style="color: #36B; font-size: 16px; font-weight: 400;"
                                                                          onclick="${gvc.event(() => {
                                                                              BgWidget.variantDialog({
                                                                                  gvc,
                                                                                  title: '新增商品規格',
                                                                                  default: dvm.variantIds,
                                                                                  callback: (resultData) => {
                                                                                      dvm.variantIds = resultData;
                                                                                      gvc.notifyDataChange(dvm.tableId);
                                                                                  },
                                                                              });
                                                                          })}"
                                                                      >
                                                                          <div>新增進貨商品</div>
                                                                          <div>
                                                                              <i class="fa-solid fa-plus ps-2" style="font-size: 16px; height: 14px; width: 14px;"></i>
                                                                          </div>
                                                                      </div>`
                                                                    : '',
                                                                BgWidget.horizontalLine({ margin: 2 }),
                                                                gvc.bindView({
                                                                    bind: dvm.totalId,
                                                                    view: () => {
                                                                        const total = vm.data.content.product_list.reduce((sum, item) => {
                                                                            return sum + item.cost * item.transfer_count;
                                                                        }, 0);

                                                                        return html` <div class="flex-fill"></div>
                                                                            <div class="d-flex justify-content-between tx_700" style="width: 200px;">
                                                                                <div>進貨總成本</div>
                                                                                <div>$ ${total.toLocaleString()}</div>
                                                                            </div>`;
                                                                    },
                                                                    divCreate: { class: 'd-flex w-100' },
                                                                }),
                                                            ].join('');
                                                        },
                                                    })}
                                                `,
                                            ].join(BgWidget.mbContainer(18))
                                        ),
                                    ].join(BgWidget.mbContainer(18));
                                },
                                divCreate: { class: 'p-0' },
                            };
                        })
                    )}
                </div>`,
                BgWidget.mbContainer(240),
                html` <div class="update-bar-container">
                    ${type === 'replace'
                        ? BgWidget.danger(
                              gvc.event(() => {
                                  dialog.checkYesOrNot({
                                      text: `確定要刪除此${typeData.name}單嗎？`,
                                      callback: (bool) => {
                                          if (bool) {
                                              dialog.dataLoading({ visible: true });
                                          }
                                      },
                                  });
                              })
                          )
                        : ''}
                    ${BgWidget.cancel(
                        gvc.event(() => {
                            vm.view = 'list';
                        })
                    )}
                    ${BgWidget.save(
                        gvc.event(() => {
                            dialog.dataLoading({ visible: true });
                            if (vm.data.id === '') {
                                ApiStock.postStockHistory(vm.data).then((r) => {
                                    dialog.dataLoading({ visible: false });
                                    if (r.result && r.response) {
                                        dialog.successMessage({ text: '新增成功' });
                                        vm.view = 'list';
                                    } else {
                                        dialog.successMessage({ text: '新增失敗' });
                                    }
                                });
                            } else {
                                ApiStock.putStockHistory(vm.data).then((r) => {
                                    dialog.dataLoading({ visible: false });
                                    if (r.result && r.response) {
                                        dialog.successMessage({ text: '更新成功' });
                                        vm.view = 'list';
                                    } else {
                                        dialog.successMessage({ text: '更新失敗' });
                                    }
                                });
                            }
                        }),
                        '送出'
                    )}
                </div>`,
            ].join('<div class="my-2"></div>')
        );
    }

    static vendorForm(gvc: GVC, data: StoreData) {
        return html`<div class="row">
            ${[
                html`<div class="tx_normal">供應商名稱</div>
                    ${BgWidget.mbContainer(4)}
                    ${BgWidget.editeInput({
                        gvc: gvc,
                        title: '',
                        default: data.name ?? '',
                        placeHolder: '請輸入庫存點名稱',
                        callback: (text) => {
                            data.name = text;
                        },
                    })}`,
                html`<div class="tx_normal">供應商地址</div>
                    ${BgWidget.mbContainer(4)}
                    ${BgWidget.editeInput({
                        gvc: gvc,
                        title: '',
                        default: data.address ?? '',
                        placeHolder: '請輸入庫存點地址',
                        callback: (text) => {
                            data.address = text;
                        },
                    })}`,
                html`<div class="tx_normal">聯絡人姓名</div>
                    ${BgWidget.mbContainer(4)}
                    ${BgWidget.editeInput({
                        gvc: gvc,
                        title: '',
                        default: data.manager_name ?? '',
                        placeHolder: '請輸入聯絡人姓名',
                        callback: (text) => {
                            data.manager_name = text;
                        },
                    })}`,
                html`<div class="tx_normal">電話</div>
                    ${BgWidget.mbContainer(4)}
                    ${BgWidget.editeInput({
                        gvc: gvc,
                        title: '',
                        default: data.manager_phone ?? '',
                        placeHolder: '請輸入電話',
                        callback: (text) => {
                            data.manager_phone = text;
                        },
                    })}`,
                html`
                    <div class="tx_normal">備註</div>
                    <div class="px-3">
                        ${EditorElem.editeText({
                            gvc: gvc,
                            title: '',
                            default: data.note ?? '',
                            placeHolder: '請輸入備註',
                            callback: (text) => {
                                data.note = text;
                            },
                        })}
                    </div>
                `,
            ].join('')}
        </div>`;
    }

    static storeForm(gvc: GVC, data: StoreData) {
        return html`<div class="row">
            ${[
                html`<div class="tx_normal">庫存點名稱</div>
                    ${BgWidget.mbContainer(4)}
                    ${BgWidget.editeInput({
                        gvc: gvc,
                        title: '',
                        default: data.name ?? '',
                        placeHolder: '請輸入庫存點名稱',
                        callback: (text) => {
                            data.name = text;
                        },
                    })}`,
                html`<div class="tx_normal">庫存點地址</div>
                    ${BgWidget.mbContainer(4)}
                    ${BgWidget.editeInput({
                        gvc: gvc,
                        title: '',
                        default: data.address ?? '',
                        placeHolder: '請輸入庫存點地址',
                        callback: (text) => {
                            data.address = text;
                        },
                    })}`,
                html`<div class="tx_normal">聯絡人姓名</div>
                    ${BgWidget.mbContainer(4)}
                    ${BgWidget.editeInput({
                        gvc: gvc,
                        title: '',
                        default: data.manager_name ?? '',
                        placeHolder: '請輸入聯絡人姓名',
                        callback: (text) => {
                            data.manager_name = text;
                        },
                    })}`,
                html`<div class="tx_normal">電話</div>
                    ${BgWidget.mbContainer(4)}
                    ${BgWidget.editeInput({
                        gvc: gvc,
                        title: '',
                        default: data.manager_phone ?? '',
                        placeHolder: '請輸入電話',
                        callback: (text) => {
                            data.manager_phone = text;
                        },
                    })}`,
                html`
                    <div class="tx_normal">備註</div>
                    <div class="px-3">
                        ${EditorElem.editeText({
                            gvc: gvc,
                            title: '',
                            default: data.note ?? '',
                            placeHolder: '請輸入備註',
                            callback: (text) => {
                                data.note = text;
                            },
                        })}
                    </div>
                `,
            ].join('')}
        </div>`;
    }
}

(window as any).glitter.setModule(import.meta.url, StockHistory);
