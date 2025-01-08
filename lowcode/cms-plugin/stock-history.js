var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { BgListComponent } from '../backend-manager/bg-list-component.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { FilterOptions } from './filter-options.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { ApiStock } from '../glitter-base/route/stock.js';
import { StockStores } from './stock-stores.js';
import { StockVendors } from './stock-vendors.js';
import { CheckInput } from '../modules/checkInput.js';
import { Tool } from '../modules/tool.js';
import { BgProduct } from '../backend-manager/bg-product.js';
const html = String.raw;
const typeConfig = {
    restocking: {
        name: '進貨',
        status: {
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
        },
    },
    transfer: {
        name: '調撥',
        status: {
            0: {
                title: '已完成',
                badge: 'info',
            },
            1: {
                title: '已補貨',
                badge: 'info',
            },
            2: {
                title: '待調撥',
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
        },
    },
    checking: {
        name: '盤點',
        status: {
            0: {
                title: '已完成',
                badge: 'info',
            },
            1: {
                title: '已修正',
                badge: 'info',
            },
            2: {
                title: '待盤點',
                badge: 'warning',
            },
            3: {
                title: '盤點中',
                badge: 'warning',
            },
            4: {
                title: '已暫停',
                badge: 'normal',
            },
            5: {
                title: '異常',
                badge: 'notify',
            },
            6: {
                title: '已取消',
                badge: 'notify',
            },
        },
    },
};
const productSelect = [
    { title: '全部商品', value: 'all' },
    { title: '特定分類', value: 'collection' },
    { title: '特定商品', value: 'product' },
];
export class StockHistory {
    static main(gvc, type) {
        const glitter = gvc.glitter;
        const emptyData = () => {
            return {
                id: '',
                type: type,
                status: 2,
                order_id: '',
                created_time: '',
                content: {
                    vendor: '',
                    store_in: '',
                    store_out: '',
                    check_member: '',
                    check_according: '',
                    note: '',
                    product_list: [],
                    changeLogs: [],
                },
            };
        };
        const vm = {
            id: glitter.getUUID(),
            tableId: glitter.getUUID(),
            type: type,
            view: 'mainList',
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
                if (vm.view === 'mainList') {
                    return this.mainList(gvc, vm);
                }
                if (vm.view === 'checkList') {
                    return this.checkList(gvc, vm);
                }
                if (vm.view === 'replace') {
                    const glitter = gvc.glitter;
                    const dialog = new ShareDialog(glitter);
                    dialog.dataLoading({ visible: true });
                    return new Promise((resolve) => {
                        ApiStock.getStockHistory({
                            page: 0,
                            limit: 1,
                            order_id: vm.data.order_id,
                            search: '',
                            type: vm.data.type,
                        }).then((r) => {
                            if (r.result && r.response.data[0]) {
                                resolve(r.response.data[0]);
                            }
                            else {
                                resolve(emptyData());
                            }
                        });
                    }).then((data) => {
                        dialog.dataLoading({ visible: false });
                        vm.data = data;
                        return this.replaceOrder(gvc, vm);
                    });
                }
                if (vm.view === 'create') {
                    vm.data = emptyData();
                    return this.createOrder(gvc, vm);
                }
                return '';
            },
        });
    }
    static mainList(gvc, vm) {
        const ListComp = new BgListComponent(gvc, vm, FilterOptions.stockHistoryFilterFrame);
        const typeData = typeConfig[vm.type];
        vm.filter = ListComp.getFilterObject();
        let vmi = undefined;
        function getDatalist() {
            return vm.dataList.map((dd) => {
                switch (dd.type) {
                    case 'restocking':
                        return [
                            {
                                key: `${typeData.name}單編號`,
                                value: `<span class="fs-7">${dd.order_id}</span>`,
                            },
                            {
                                key: `${typeData.name}日期`,
                                value: `<span class="fs-7">${dd.created_time}</span>`,
                            },
                            {
                                key: '庫存點名稱',
                                value: html `<span class="fs-7"
                                    >${(() => {
                                    const store = vm.storeList.find((s) => s.id === dd.content.store_in);
                                    return store ? store.name : '';
                                })()}</span
                                >`,
                            },
                            {
                                key: '總金額',
                                value: `<span class="fs-7">$ ${(dd.content.total_price || 0).toLocaleString()}</span>`,
                            },
                            {
                                key: '供應商',
                                value: html `<span class="fs-7"
                                    >${(() => {
                                    const vendor = vm.vendorList.find((v) => v.id === dd.content.vendor);
                                    return vendor ? vendor.name : '';
                                })()}</span
                                >`,
                            },
                            {
                                key: `${typeData.name}狀態`,
                                value: `<span class="fs-7">${StockHistory.getStatusBadge(dd.type, dd.status)}</span>`,
                            },
                        ];
                    case 'transfer':
                        return [
                            {
                                key: `${typeData.name}單編號`,
                                value: `<span class="fs-7">${dd.order_id}</span>`,
                            },
                            {
                                key: `${typeData.name}日期`,
                                value: `<span class="fs-7">${dd.created_time}</span>`,
                            },
                            {
                                key: '調出庫存點',
                                value: html `<span class="fs-7"
                                    >${(() => {
                                    const store = vm.storeList.find((s) => s.id === dd.content.store_out);
                                    return store ? store.name : '';
                                })()}</span
                                >`,
                            },
                            {
                                key: '調入庫存點',
                                value: html `<span class="fs-7"
                                    >${(() => {
                                    const store = vm.storeList.find((s) => s.id === dd.content.store_in);
                                    return store ? store.name : '';
                                })()}</span
                                >`,
                            },
                            {
                                key: '備註',
                                value: `<span class="fs-7">${Tool.truncateString(dd.content.note, 5)}</span>`,
                            },
                            {
                                key: `${typeData.name}狀態`,
                                value: `<span class="fs-7">${StockHistory.getStatusBadge(dd.type, dd.status)}</span>`,
                            },
                        ];
                    case 'checking':
                        return [
                            {
                                key: `${typeData.name}單編號`,
                                value: `<span class="fs-7">${dd.order_id}</span>`,
                            },
                            {
                                key: `${typeData.name}日期`,
                                value: `<span class="fs-7">${dd.created_time}</span>`,
                            },
                            {
                                key: '盤點範圍',
                                value: html `<span class="fs-7"
                                    >${(() => {
                                    const range = productSelect.find((ps) => ps.value === dd.content.check_according);
                                    return range ? range.title : '';
                                })()}</span
                                >`,
                            },
                            {
                                key: '庫存點',
                                value: html `<span class="fs-7"
                                    >${(() => {
                                    const store = vm.storeList.find((s) => s.id === dd.content.store_out);
                                    return store ? store.name : '';
                                })()}</span
                                >`,
                            },
                            {
                                key: '異常數量',
                                value: (() => {
                                    const count = dd.content.product_list.reduce((sum, item) => {
                                        if (item.recent_count === undefined) {
                                            return sum;
                                        }
                                        const n = item.recent_count - item.transfer_count;
                                        return sum + n;
                                    }, 0);
                                    return StockHistory.integerColorComponent(count, count, 0);
                                })(),
                            },
                            {
                                key: '備註',
                                value: `<span class="fs-7">${Tool.truncateString(dd.content.note, 5)}</span>`,
                            },
                            {
                                key: `${typeData.name}狀態`,
                                value: `<span class="fs-7">${StockHistory.getStatusBadge(dd.type, dd.status)}</span>`,
                            },
                        ];
                }
            });
        }
        return BgWidget.container(html ` <div class="title-container">
                    ${BgWidget.title(`${typeData.name}單列表`)}
                    <div class="flex-fill"></div>
                    ${BgWidget.grayButton(`新增${typeData.name}單`, gvc.event(() => {
            vm.view = 'create';
        }))}
                </div>
                ${BgWidget.container(BgWidget.mainCard([
            (() => {
                const id = gvc.glitter.getUUID();
                return gvc.bindView({
                    bind: id,
                    view: () => {
                        var _a;
                        const filterList = [
                            BgWidget.selectFilter({
                                gvc,
                                callback: (value) => {
                                    vm.queryType = value;
                                    gvc.notifyDataChange(vm.tableId);
                                    gvc.notifyDataChange(id);
                                },
                                default: vm.queryType || 'order_id',
                                options: FilterOptions.stockHistorySelect.map((item) => {
                                    item.value = item.value.replace(/xxx/g, typeData.name);
                                    return item;
                                }),
                            }),
                            BgWidget.searchFilter(gvc.event((e) => {
                                vm.query = `${e.value}`.trim();
                                gvc.notifyDataChange(vm.tableId);
                                gvc.notifyDataChange(id);
                            }), vm.query || '', '搜尋'),
                        ];
                        const filterTags = ListComp.getFilterTags(FilterOptions.stockHistoryFunnel);
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
                            ]).then((dataArray) => {
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
        ].join('')))}`);
    }
    static checkList(gvc, vm) {
        const glitter = gvc.glitter;
        const ListComp = new BgListComponent(gvc, vm, FilterOptions.stockHistoryFilterFrame);
        const typeData = typeConfig[vm.type];
        vm.filter = ListComp.getFilterObject();
        let vmi = undefined;
        const cvm = {
            id: glitter.getUUID(),
            buttonsId: glitter.getUUID(),
            iconId: glitter.getUUID(),
            type: 'all',
        };
        function checkSpecTable(page, limit) {
            console.log('checkSpecTable(has icon)');
            const x = (page - 1) * limit;
            const specs = vm.data.content.product_list.slice(x, x + limit);
            return specs.map((dd, index) => {
                var _a, _b, _c, _d, _e, _f, _g;
                const realData = vm.data.content.product_list[x + index];
                const startArr = [
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
                        key: '商品條碼',
                        value: `<span class="fs-7">${dd.sku || '－'}</span>`,
                    },
                ];
                const noteArr = [
                    {
                        key: '備註',
                        value: html ` <div style="width: 120px" onclick="${gvc.event((e, event) => event.stopPropagation())}">
                            <input
                                class="form-control"
                                type="text"
                                style="border-radius: 10px; border: 1px solid #DDD; padding-left: 18px;"
                                onchange="${gvc.event((e) => {
                            realData.note = e.value;
                        })}"
                                value="${(_a = dd.note) !== null && _a !== void 0 ? _a : ''}"
                            />
                        </div>`,
                    },
                ];
                switch (vm.data.type) {
                    case 'restocking':
                        return [
                            ...startArr,
                            {
                                key: '原定進貨數量',
                                value: `<span class="fs-7">${(_b = dd.transfer_count) !== null && _b !== void 0 ? _b : 0}</span>`,
                            },
                            {
                                key: '實際到貨數量',
                                value: html ` <div style="width: 100px" onclick="${gvc.event((e, event) => event.stopPropagation())}">
                                    <input
                                        class="form-control"
                                        type="number"
                                        min="0"
                                        style="border-radius: 10px; border: 1px solid #DDD; padding-left: 18px;"
                                        onchange="${gvc.event((e) => {
                                    let n = parseInt(e.value, 10);
                                    if (n < 0) {
                                        n = 0;
                                        e.value = n;
                                    }
                                    realData.recent_count = isNaN(n) ? undefined : n;
                                    gvc.notifyDataChange(cvm.buttonsId);
                                    gvc.notifyDataChange(`${cvm.iconId}${index}`);
                                })}"
                                        value="${(_c = dd.recent_count) !== null && _c !== void 0 ? _c : ''}"
                                    />
                                </div>`,
                            },
                            ...noteArr,
                            {
                                key: html `<p class="mx-3"></p>`,
                                value: gvc.bindView({
                                    bind: `${cvm.iconId}${index}`,
                                    view: () => {
                                        if (realData.recent_count === undefined) {
                                            return '';
                                        }
                                        if (realData.transfer_count > realData.recent_count) {
                                            return html `<i class="fa-light fa-circle-exclamation"></i>`;
                                        }
                                        return html `<i class="fa-solid fa-circle-check"></i>`;
                                    },
                                }),
                            },
                        ];
                    case 'transfer':
                        return [
                            ...startArr,
                            {
                                key: '原定調入數量',
                                value: `<span class="fs-7">${(_d = dd.transfer_count) !== null && _d !== void 0 ? _d : 0}</span>`,
                            },
                            {
                                key: '實際調入數量',
                                value: html ` <div style="width: 100px" onclick="${gvc.event((e, event) => event.stopPropagation())}">
                                    <input
                                        class="form-control"
                                        type="number"
                                        min="0"
                                        style="border-radius: 10px; border: 1px solid #DDD; padding-left: 18px;"
                                        onchange="${gvc.event((e) => {
                                    let n = parseInt(e.value, 10);
                                    if (n < 0) {
                                        n = 0;
                                        e.value = n;
                                    }
                                    realData.recent_count = isNaN(n) ? undefined : n;
                                    gvc.notifyDataChange(cvm.buttonsId);
                                    gvc.notifyDataChange(`${cvm.iconId}${index}`);
                                })}"
                                        value="${(_e = dd.recent_count) !== null && _e !== void 0 ? _e : ''}"
                                    />
                                </div>`,
                            },
                            ...noteArr,
                            {
                                key: html `<p class="mx-3"></p>`,
                                value: gvc.bindView({
                                    bind: `${cvm.iconId}${index}`,
                                    view: () => {
                                        if (realData.recent_count === undefined) {
                                            return '';
                                        }
                                        if (realData.transfer_count > realData.recent_count) {
                                            return html `<i class="fa-light fa-circle-exclamation"></i>`;
                                        }
                                        return html `<i class="fa-solid fa-circle-check"></i>`;
                                    },
                                }),
                            },
                        ];
                    case 'checking':
                        return [
                            ...startArr,
                            {
                                key: '庫存數量',
                                value: `<span class="fs-7">${(_f = dd.transfer_count) !== null && _f !== void 0 ? _f : 0}</span>`,
                            },
                            {
                                key: '盤點數量',
                                value: html ` <div style="width: 100px" onclick="${gvc.event((e, event) => event.stopPropagation())}">
                                    <input
                                        class="form-control"
                                        type="number"
                                        min="0"
                                        style="border-radius: 10px; border: 1px solid #DDD; padding-left: 18px;"
                                        onchange="${gvc.event((e) => {
                                    let n = parseInt(e.value, 10);
                                    if (n < 0) {
                                        n = 0;
                                        e.value = n;
                                    }
                                    realData.recent_count = isNaN(n) ? undefined : n;
                                    gvc.notifyDataChange(cvm.buttonsId);
                                    gvc.notifyDataChange(`${cvm.iconId}${index}`);
                                })}"
                                        value="${(_g = dd.recent_count) !== null && _g !== void 0 ? _g : ''}"
                                    />
                                </div>`,
                            },
                            ...noteArr,
                            {
                                key: html `<p class="mx-3"></p>`,
                                value: gvc.bindView({
                                    bind: `${cvm.iconId}${index}`,
                                    view: () => {
                                        if (realData.recent_count === undefined) {
                                            return '';
                                        }
                                        if (realData.transfer_count !== realData.recent_count) {
                                            return html `<i class="fa-light fa-circle-exclamation"></i>`;
                                        }
                                        return html `<i class="fa-solid fa-circle-check"></i>`;
                                    },
                                }),
                            },
                        ];
                }
            });
        }
        return BgWidget.container(html `
                <div class="title-container">
                    ${BgWidget.goBack(gvc.event(() => {
            vm.view = 'replace';
        }))}${BgWidget.title(`${typeData.name}核對`)}
                    <div class="flex-fill"></div>
                </div>
                <div class="title-container">
                    ${BgWidget.tab([
            {
                title: '全部',
                key: 'all',
            },
            {
                title: '待補貨',
                key: 'pending',
            },
            {
                title: '未核對',
                key: 'notChecked',
            },
            {
                title: '已核對',
                key: 'checked',
            },
        ], gvc, cvm.type, (text) => {
            cvm.type = text;
            gvc.notifyDataChange(vm.id);
        }, 'margin: 24px 0 0 0;')}
                </div>
                ${BgWidget.container(BgWidget.mainCard([
            (() => {
                const id = gvc.glitter.getUUID();
                return gvc.bindView({
                    bind: id,
                    view: () => {
                        var _a;
                        const filterList = [
                            BgWidget.selectFilter({
                                gvc,
                                callback: (value) => {
                                    vm.queryType = value;
                                    gvc.notifyDataChange(vm.tableId);
                                    gvc.notifyDataChange(id);
                                },
                                default: vm.queryType || 'name',
                                options: FilterOptions.userSelect,
                            }),
                            BgWidget.searchFilter(gvc.event((e) => {
                                vm.query = `${e.value}`.trim();
                                gvc.notifyDataChange(vm.tableId);
                                gvc.notifyDataChange(id);
                            }), vm.query || '', '搜尋所有用戶'),
                        ];
                        const filterTags = ListComp.getFilterTags(FilterOptions.userFunnel);
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
                });
            })(),
            BgWidget.tableV3({
                gvc: gvc,
                getData: (vd) => {
                    vmi = vd;
                    const limit = 99999;
                    const ids = vm.data.content.product_list.map((item) => {
                        return `${item.variant_id}`;
                    });
                    new Promise((resolve) => {
                        ApiStock.getStoreProductList({
                            page: 0,
                            limit: 99999,
                            search: vm.data.content.store_out,
                            variant_id_list: ids,
                        }).then((r) => {
                            if (r.result && r.response.data) {
                                resolve(r.response.data);
                            }
                            else {
                                resolve([]);
                            }
                        });
                    }).then((variants) => {
                        this.setVariantList(ids, vm.data, (response) => {
                            vm.data.content.product_list = response;
                            vm.data.content.product_list.map((item1) => {
                                const variant = variants.find((item2) => item1.variant_id === item2.id);
                                item1.stock = variant ? variant.count : 0;
                                return item1;
                            });
                            vmi.pageSize = Math.ceil(response.length / limit);
                            vmi.originalData = response;
                            vmi.tableData = checkSpecTable(vmi.page, limit);
                            vmi.loading = false;
                            vmi.callback();
                        });
                    });
                },
                rowClick: () => { },
                filter: [],
                hiddenPageSplit: true,
            }),
        ].join('')))}
                ${BgWidget.mbContainer(240)}
                ${gvc.bindView({
            bind: cvm.buttonsId,
            view: () => {
                return this.getButtonBar(gvc, vm);
            },
            divCreate: {
                class: 'update-bar-container',
            },
        })}
            `);
    }
    static getFormStructure(gvc, vm, dvm) {
        const glitter = gvc.glitter;
        switch (vm.type) {
            case 'restocking':
                return [
                    html `<div class="row">
                        <div class="col-12 col-md-6">
                            <div class="tx_normal">供應商</div>
                            ${BgWidget.mbContainer(8)}
                            ${gvc.bindView((() => {
                        const id = glitter.getUUID();
                        let dataList = [];
                        let loading = true;
                        return {
                            bind: id,
                            view: () => {
                                var _a;
                                if (loading) {
                                    return BgWidget.spinner({
                                        container: { style: 'margin-top: 0;' },
                                        circle: { visible: false },
                                    });
                                }
                                else {
                                    return BgWidget.selectOptionAndClickEvent({
                                        gvc: gvc,
                                        default: (_a = vm.data.content.vendor) !== null && _a !== void 0 ? _a : '',
                                        options: dataList.map((item) => {
                                            return {
                                                key: item.id,
                                                value: item.name,
                                                note: item.address,
                                            };
                                        }),
                                        showNote: BgWidget.grayNote((() => {
                                            const d = dataList.find((item) => {
                                                return item.id === vm.data.content.vendor;
                                            });
                                            return d ? d.address : '';
                                        })(), 'margin: 0 4px;'),
                                        callback: (data) => {
                                            vm.data.content.vendor = data ? data.key : '';
                                            gvc.notifyDataChange(id);
                                        },
                                        clickElement: {
                                            html: html `<div>新增供應商</div>
                                                            <div>
                                                                <i class="fa-solid fa-plus ps-2" style="font-size: 16px; height: 14px; width: 14px;"></i>
                                                            </div>`,
                                            event: (gvc2) => {
                                                const newVendorData = StockVendors.emptyData();
                                                BgWidget.settingDialog({
                                                    gvc: gvc2,
                                                    title: '新增供應點',
                                                    innerHTML: (gvc2) => {
                                                        return StockHistory.vendorForm(gvc2, newVendorData);
                                                    },
                                                    footer_html: (gvc2) => {
                                                        return `${BgWidget.cancel(gvc2.event(() => {
                                                            gvc2.closeDialog();
                                                        }))}
                                                            ${BgWidget.save(gvc2.event(() => {
                                                            StockVendors.verifyStoreForm(glitter, 'create', newVendorData, (response) => {
                                                                gvc2.closeDialog();
                                                                vm.data.content.vendor = response.id;
                                                                loading = true;
                                                                gvc.notifyDataChange(id);
                                                            });
                                                        }), '完成')}`;
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
                                    ApiUser.getPublicConfig('vendor_manager', 'manager').then((dd) => {
                                        if (dd.result && dd.response.value) {
                                            dataList = dd.response.value.list;
                                        }
                                        loading = false;
                                        gvc.notifyDataChange(id);
                                    });
                                }
                            },
                        };
                    })())}
                        </div>
                        <div class="col-12 col-md-6">
                            <div class="tx_normal">庫存點</div>
                            ${BgWidget.mbContainer(8)}
                            ${gvc.bindView((() => {
                        const id = glitter.getUUID();
                        let dataList = [];
                        let loading = true;
                        return {
                            bind: id,
                            view: () => {
                                var _a;
                                if (loading) {
                                    return BgWidget.spinner({
                                        container: { style: 'margin-top: 0;' },
                                        circle: { visible: false },
                                    });
                                }
                                else {
                                    return BgWidget.selectOptionAndClickEvent({
                                        gvc: gvc,
                                        default: (_a = vm.data.content.store_in) !== null && _a !== void 0 ? _a : '',
                                        options: dataList.map((item) => {
                                            return {
                                                key: item.id,
                                                value: item.name,
                                                note: item.address,
                                            };
                                        }),
                                        showNote: BgWidget.grayNote((() => {
                                            const d = dataList.find((item) => {
                                                return item.id === vm.data.content.store_in;
                                            });
                                            return d ? d.address : '';
                                        })(), 'margin: 0 4px;'),
                                        callback: (data) => {
                                            vm.data.content.store_in = data ? data.key : '';
                                            gvc.notifyDataChange(id);
                                        },
                                        clickElement: {
                                            html: html `<div>新增庫存點</div>
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
                                                        return `${BgWidget.cancel(gvc2.event(() => {
                                                            gvc2.closeDialog();
                                                        }))}
                                                            ${BgWidget.save(gvc2.event(() => {
                                                            StockStores.verifyStoreForm(glitter, 'create', newStoreData, (response) => {
                                                                gvc2.closeDialog();
                                                                vm.data.content.store_in = response.id;
                                                                loading = true;
                                                                gvc.notifyDataChange(id);
                                                            });
                                                        }), '完成')}`;
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
                                    ApiUser.getPublicConfig('store_manager', 'manager').then((dd) => {
                                        if (dd.result && dd.response.value) {
                                            dataList = dd.response.value.list;
                                        }
                                        loading = false;
                                        gvc.notifyDataChange(id);
                                    });
                                }
                            },
                        };
                    })())}
                        </div>
                    </div> `,
                ];
            case 'transfer':
                return [
                    html `<div class="row">
                        <div class="col-12 col-md-6">
                            <div class="tx_normal">調出庫存點</div>
                            ${BgWidget.mbContainer(8)}
                            ${gvc.bindView((() => {
                        const id = glitter.getUUID();
                        let dataList = [];
                        let loading = true;
                        return {
                            bind: id,
                            view: () => {
                                var _a;
                                if (loading) {
                                    return BgWidget.spinner({
                                        container: { style: 'margin-top: 0;' },
                                        circle: { visible: false },
                                    });
                                }
                                else {
                                    return BgWidget.selectOptionAndClickEvent({
                                        gvc: gvc,
                                        default: (_a = vm.data.content.store_out) !== null && _a !== void 0 ? _a : '',
                                        options: dataList.map((item) => {
                                            return {
                                                key: item.id,
                                                value: item.name,
                                                note: item.address,
                                            };
                                        }),
                                        showNote: BgWidget.grayNote((() => {
                                            const d = dataList.find((item) => {
                                                return item.id === vm.data.content.store_out;
                                            });
                                            return d ? d.address : '';
                                        })(), 'margin: 0 4px;'),
                                        callback: (data) => {
                                            vm.data.content.store_out = data ? data.key : '';
                                            gvc.notifyDataChange(id);
                                        },
                                    });
                                }
                            },
                            divCreate: {},
                            onCreate: () => {
                                if (loading) {
                                    ApiUser.getPublicConfig('store_manager', 'manager').then((dd) => {
                                        if (dd.result && dd.response.value) {
                                            dataList = dd.response.value.list;
                                        }
                                        loading = false;
                                        gvc.notifyDataChange(id);
                                    });
                                }
                            },
                        };
                    })())}
                        </div>
                        <div class="col-12 col-md-6">
                            <div class="tx_normal">調入庫存點</div>
                            ${BgWidget.mbContainer(8)}
                            ${gvc.bindView((() => {
                        const id = glitter.getUUID();
                        let dataList = [];
                        let loading = true;
                        return {
                            bind: id,
                            view: () => {
                                var _a;
                                if (loading) {
                                    return BgWidget.spinner({
                                        container: { style: 'margin-top: 0;' },
                                        circle: { visible: false },
                                    });
                                }
                                else {
                                    return BgWidget.selectOptionAndClickEvent({
                                        gvc: gvc,
                                        default: (_a = vm.data.content.store_in) !== null && _a !== void 0 ? _a : '',
                                        options: dataList.map((item) => {
                                            return {
                                                key: item.id,
                                                value: item.name,
                                                note: item.address,
                                            };
                                        }),
                                        showNote: BgWidget.grayNote((() => {
                                            const d = dataList.find((item) => {
                                                return item.id === vm.data.content.store_in;
                                            });
                                            return d ? d.address : '';
                                        })(), 'margin: 0 4px;'),
                                        callback: (data) => {
                                            vm.data.content.store_in = data ? data.key : '';
                                            gvc.notifyDataChange(id);
                                        },
                                    });
                                }
                            },
                            divCreate: {},
                            onCreate: () => {
                                if (loading) {
                                    ApiUser.getPublicConfig('store_manager', 'manager').then((dd) => {
                                        if (dd.result && dd.response.value) {
                                            dataList = dd.response.value.list;
                                        }
                                        loading = false;
                                        gvc.notifyDataChange(id);
                                    });
                                }
                            },
                        };
                    })())}
                        </div>
                    </div> `,
                ];
            case 'checking':
                return [
                    html `<div class="row">
                        <div class="col-12 col-md-6">
                            <div class="tx_normal">盤點庫存點</div>
                            ${BgWidget.mbContainer(8)}
                            ${gvc.bindView((() => {
                        const id = glitter.getUUID();
                        let dataList = [];
                        let loading = true;
                        return {
                            bind: id,
                            view: () => {
                                var _a;
                                if (loading) {
                                    return BgWidget.spinner({
                                        container: { style: 'margin-top: 0;' },
                                        circle: { visible: false },
                                    });
                                }
                                else {
                                    return BgWidget.selectOptionAndClickEvent({
                                        gvc: gvc,
                                        default: (_a = vm.data.content.store_out) !== null && _a !== void 0 ? _a : '',
                                        options: dataList.map((item) => {
                                            return {
                                                key: item.id,
                                                value: item.name,
                                                note: item.address,
                                            };
                                        }),
                                        showNote: BgWidget.grayNote((() => {
                                            const d = dataList.find((item) => {
                                                return item.id === vm.data.content.store_out;
                                            });
                                            return d ? d.address : '';
                                        })(), 'margin: 0 4px;'),
                                        callback: (data) => {
                                            vm.data.content.store_out = data ? data.key : '';
                                            gvc.notifyDataChange(id);
                                            vm.data.content.check_according = '';
                                            gvc.notifyDataChange(dvm.tableId);
                                        },
                                    });
                                }
                            },
                            divCreate: {},
                            onCreate: () => {
                                if (loading) {
                                    ApiUser.getPublicConfig('store_manager', 'manager').then((dd) => {
                                        if (dd.result && dd.response.value) {
                                            dataList = dd.response.value.list;
                                        }
                                        loading = false;
                                        gvc.notifyDataChange(id);
                                    });
                                }
                            },
                        };
                    })())}
                        </div>
                    </div> `,
                ];
        }
    }
    static createOrder(gvc, vm) {
        const glitter = gvc.glitter;
        const dialog = new ShareDialog(glitter);
        const typeData = typeConfig[vm.type];
        const dvm = {
            id: glitter.getUUID(),
            tableId: glitter.getUUID(),
            totalId: glitter.getUUID(),
            radioCompId: glitter.getUUID(),
            variantIds: [],
            tableLoading: true,
        };
        function specDatalist(page, limit) {
            const x = (page - 1) * limit;
            const specs = vm.data.content.product_list.slice(x, x + limit);
            return specs.map((dd, index) => {
                var _a, _b, _c, _d;
                const realData = vm.data.content.product_list[x + index];
                const startArr = [
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
                ];
                const endArr = [
                    {
                        key: '備註',
                        value: html ` <div style="width: 120px" onclick="${gvc.event((e, event) => event.stopPropagation())}">
                            <input
                                class="form-control"
                                type="text"
                                style="border-radius: 10px; border: 1px solid #DDD; padding-left: 18px;"
                                onchange="${gvc.event((e) => {
                            realData.note = e.value;
                        })}"
                                value="${(_a = dd.note) !== null && _a !== void 0 ? _a : ''}"
                            />
                        </div>`,
                    },
                ];
                switch (vm.data.type) {
                    case 'restocking':
                        return [
                            ...startArr,
                            {
                                key: '進貨成本',
                                value: html ` <div style="width: 100px" onclick="${gvc.event((e, event) => event.stopPropagation())}">
                                    <input
                                        class="form-control"
                                        type="number"
                                        min="0"
                                        style="border-radius: 10px; border: 1px solid #DDD; padding-left: 18px;"
                                        onchange="${gvc.event((e) => {
                                    let n = parseInt(e.value, 10);
                                    if (n < 0) {
                                        n = 0;
                                        e.value = n;
                                    }
                                    realData.cost = n;
                                    gvc.notifyDataChange(`subtotoal_${index}`);
                                })}"
                                        value="${(_b = dd.cost) !== null && _b !== void 0 ? _b : 0}"
                                    />
                                </div>`,
                            },
                            {
                                key: '數量',
                                value: html ` <div style="width: 100px" onclick="${gvc.event((e, event) => event.stopPropagation())}">
                                    <input
                                        class="form-control"
                                        type="number"
                                        min="0"
                                        style="border-radius: 10px; border: 1px solid #DDD; padding-left: 18px;"
                                        onchange="${gvc.event((e) => {
                                    let n = parseInt(e.value, 10);
                                    if (n < 0) {
                                        n = 0;
                                        e.value = n;
                                    }
                                    realData.transfer_count = n;
                                    gvc.notifyDataChange(`subtotoal_${index}`);
                                })}"
                                        value="${(_c = dd.transfer_count) !== null && _c !== void 0 ? _c : 0}"
                                    />
                                </div>`,
                            },
                            {
                                key: '小計',
                                value: gvc.bindView({
                                    bind: `subtotoal_${index}`,
                                    view: () => {
                                        const subtotal = dd.cost * dd.transfer_count;
                                        return html `<span class="fs-7">$ ${subtotal.toLocaleString()}</span>`;
                                    },
                                    onCreate: () => {
                                        gvc.notifyDataChange(dvm.totalId);
                                    },
                                }),
                            },
                            ...endArr,
                        ];
                    case 'transfer':
                        return [
                            ...startArr,
                            {
                                key: '來源庫存數量',
                                value: `<span class="fs-7">${dd.stock || 0}</span>`,
                            },
                            {
                                key: '調入數量',
                                value: html ` <div style="width: 100px" onclick="${gvc.event((e, event) => event.stopPropagation())}">
                                    <input
                                        class="form-control"
                                        type="number"
                                        min="0"
                                        style="border-radius: 10px; border: 1px solid #DDD; padding-left: 18px;"
                                        onchange="${gvc.event((e) => {
                                    let n = parseInt(e.value, 10);
                                    if (n < 0) {
                                        n = 0;
                                        e.value = n;
                                    }
                                    if (dd.stock && n > dd.stock) {
                                        n = dd.stock;
                                        e.value = n;
                                    }
                                    realData.transfer_count = n;
                                    gvc.notifyDataChange(`subtotoal_${index}`);
                                })}"
                                        value="${(_d = dd.transfer_count) !== null && _d !== void 0 ? _d : 0}"
                                    />
                                </div>`,
                            },
                            ...endArr,
                        ];
                    case 'checking':
                        return [
                            ...startArr,
                            {
                                key: '商品條碼',
                                value: `<span class="fs-7">${dd.sku || '－'}</span>`,
                            },
                            {
                                key: '庫存數量',
                                value: `<span class="fs-7">${dd.transfer_count || 0}</span>`,
                            },
                        ];
                }
            });
        }
        return BgWidget.container([
            html ` <div class="title-container">
                        ${BgWidget.goBack(gvc.event(() => {
                vm.view = 'mainList';
            }))}
                        <div>${BgWidget.title(`新增${typeData.name}單`)}</div>
                    </div>
                    <div class="flex-fill"></div>`,
            html ` <div class="d-flex justify-content-center ${document.body.clientWidth < 768 ? 'flex-column' : ''}" style="gap: 24px">
                    ${BgWidget.container(gvc.bindView(() => {
                let vmi = undefined;
                return {
                    bind: dvm.id,
                    view: () => {
                        var _a, _b;
                        return [
                            BgWidget.mainCard([
                                html ` <div class="tx_700">${typeData.name}單資料</div>`,
                                html ` <div class="row">
                                                    <div class="col-12 col-md-6">
                                                        <div class="tx_normal">${typeData.name}編號</div>
                                                        ${BgWidget.mbContainer(8)}
                                                        ${BgWidget.editeInput({
                                    gvc: gvc,
                                    title: '',
                                    default: vm.data.order_id || '系統將自動產生流水號',
                                    placeHolder: '',
                                    callback: () => { },
                                    readonly: true,
                                })}
                                                    </div>
                                                    ${document.body.clientWidth > 768 ? '' : BgWidget.mbContainer(18)}
                                                    <div class="col-12 col-md-6">
                                                        <div class="tx_normal">${typeData.name}日期</div>
                                                        ${BgWidget.mbContainer(8)}
                                                        ${BgWidget.editeInput({
                                    gvc: gvc,
                                    title: '',
                                    type: 'date',
                                    default: (_a = vm.data.created_time) !== null && _a !== void 0 ? _a : '',
                                    placeHolder: `請輸入${typeData.name}日期`,
                                    callback: (text) => {
                                        vm.data.created_time = text;
                                    },
                                })}
                                                    </div>
                                                </div>`,
                                ...this.getFormStructure(gvc, vm, dvm),
                                html ` <div class="tx_normal">備註</div>
                                                    ${EditorElem.editeText({
                                    gvc: gvc,
                                    title: '',
                                    default: (_b = vm.data.content.note) !== null && _b !== void 0 ? _b : '',
                                    placeHolder: '請輸入備註',
                                    callback: (text) => {
                                        vm.data.content.note = text;
                                    },
                                })}`,
                            ].join(BgWidget.mbContainer(18))),
                            BgWidget.mainCard([
                                html `
                                                    <div class="tx_700">${typeData.name}商品</div>
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
                                        switch (vm.data.type) {
                                            case 'restocking':
                                                return [
                                                    BgWidget.tableV3({
                                                        gvc: gvc,
                                                        getData: (vd) => {
                                                            vmi = vd;
                                                            const limit = 99999;
                                                            this.setVariantList(dvm.variantIds, vm.data, (response) => {
                                                                vm.data.content.product_list = response;
                                                                vmi.pageSize = Math.ceil(response.length / limit);
                                                                vmi.originalData = response;
                                                                vmi.tableData = specDatalist(vmi.page, limit);
                                                                vmi.loading = false;
                                                                vmi.callback();
                                                            });
                                                        },
                                                        rowClick: () => { },
                                                        filter: [],
                                                        hiddenPageSplit: true,
                                                    }),
                                                    html `<div
                                                                            class="w-100 d-flex align-items-center justify-content-center cursor_pointer"
                                                                            style="color: #36B; font-size: 16px; font-weight: 400;"
                                                                            onclick="${gvc.event(() => {
                                                        BgWidget.variantDialog({
                                                            gvc,
                                                            title: '搜尋商品',
                                                            default: dvm.variantIds,
                                                            callback: (resultData) => {
                                                                dvm.variantIds = resultData;
                                                                gvc.notifyDataChange(dvm.tableId);
                                                            },
                                                        });
                                                    })}"
                                                                        >
                                                                            <div>新增${typeData.name}商品</div>
                                                                            <div>
                                                                                <i class="fa-solid fa-plus ps-2" style="font-size: 16px; height: 14px; width: 14px;"></i>
                                                                            </div>
                                                                        </div>`,
                                                    BgWidget.horizontalLine({ margin: 1.75 }),
                                                    gvc.bindView({
                                                        bind: dvm.totalId,
                                                        view: () => {
                                                            const total = vm.data.content.product_list.reduce((sum, item) => {
                                                                return sum + item.cost * item.transfer_count;
                                                            }, 0);
                                                            return html ` <div class="flex-fill"></div>
                                                                                    <div class="d-flex justify-content-between tx_700" style="width: 200px;">
                                                                                        <div>進貨總成本</div>
                                                                                        <div>$ ${total.toLocaleString()}</div>
                                                                                    </div>`;
                                                        },
                                                        divCreate: { class: 'd-flex w-100' },
                                                    }),
                                                ].join('');
                                            case 'transfer':
                                                return [
                                                    BgWidget.tableV3({
                                                        gvc: gvc,
                                                        getData: (vd) => {
                                                            vmi = vd;
                                                            const limit = 99999;
                                                            new Promise((resolve) => {
                                                                ApiStock.getStoreProductList({
                                                                    page: 0,
                                                                    limit: 99999,
                                                                    search: vm.data.content.store_out,
                                                                    variant_id_list: dvm.variantIds,
                                                                }).then((r) => {
                                                                    if (r.result && r.response.data) {
                                                                        resolve(r.response.data);
                                                                    }
                                                                    else {
                                                                        resolve([]);
                                                                    }
                                                                });
                                                            }).then((responseArray) => {
                                                                this.setVariantList(dvm.variantIds, vm.data, (response) => {
                                                                    response.map((item1) => {
                                                                        const stockData = responseArray.find((item2) => item1.variant_id === item2.id);
                                                                        item1.stock = stockData ? stockData.count : 0;
                                                                        return item1;
                                                                    });
                                                                    vm.data.content.product_list = response;
                                                                    vmi.pageSize = Math.ceil(response.length / limit);
                                                                    vmi.originalData = response;
                                                                    vmi.tableData = specDatalist(vmi.page, limit);
                                                                    vmi.loading = false;
                                                                    vmi.callback();
                                                                });
                                                            });
                                                        },
                                                        rowClick: () => { },
                                                        filter: [],
                                                        hiddenPageSplit: true,
                                                    }),
                                                    html `<div
                                                                            class="w-100 d-flex align-items-center justify-content-center cursor_pointer"
                                                                            style="color: #36B; font-size: 16px; font-weight: 400;"
                                                                            onclick="${gvc.event(() => {
                                                        if (CheckInput.isEmpty(vm.data.content.store_out)) {
                                                            dialog.errorMessage({ text: '請先選擇「調出庫存點」' });
                                                            return;
                                                        }
                                                        BgWidget.storeStockDialog({
                                                            gvc,
                                                            title: '搜尋商品',
                                                            default: dvm.variantIds,
                                                            store_id: vm.data.content.store_out,
                                                            callback: (resultData) => {
                                                                dvm.variantIds = resultData;
                                                                gvc.notifyDataChange(dvm.tableId);
                                                            },
                                                        });
                                                    })}"
                                                                        >
                                                                            <div>新增${typeData.name}商品</div>
                                                                            <div>
                                                                                <i class="fa-solid fa-plus ps-2" style="font-size: 16px; height: 14px; width: 14px;"></i>
                                                                            </div>
                                                                        </div>`,
                                                ].join('');
                                            case 'checking':
                                                return [
                                                    EditorElem.radio({
                                                        gvc: gvc,
                                                        title: '',
                                                        def: vm.data.content.check_according,
                                                        array: productSelect,
                                                        callback: (text) => {
                                                            vm.data.content.check_according = text;
                                                            gvc.notifyDataChange(dvm.radioCompId);
                                                        },
                                                    }),
                                                    gvc.bindView({
                                                        bind: dvm.radioCompId,
                                                        view: () => {
                                                            switch (vm.data.content.check_according) {
                                                                case 'collection':
                                                                    return gvc.bindView(() => {
                                                                        const subVM = {
                                                                            id: gvc.glitter.getUUID(),
                                                                            loading: true,
                                                                            def: [],
                                                                            dataList: [],
                                                                        };
                                                                        return {
                                                                            bind: subVM.id,
                                                                            view: () => {
                                                                                if (subVM.loading) {
                                                                                    return BgWidget.spinner();
                                                                                }
                                                                                return html `
                                                                                                        <div class="d-flex flex-column p-2" style="gap: 18px;">
                                                                                                            <div
                                                                                                                class="d-flex align-items-center justify-content-between gray-bottom-line-18"
                                                                                                                style="gap: 24px;"
                                                                                                            >
                                                                                                                <div class="form-check-label c_updown_label">
                                                                                                                    <div class="tx_normal">分類列表</div>
                                                                                                                </div>
                                                                                                                ${BgWidget.grayButton('選擇分類', gvc.event(() => {
                                                                                    var _a;
                                                                                    if (CheckInput.isEmpty(vm.data.content.store_out)) {
                                                                                        dialog.errorMessage({ text: '請先選擇「盤點庫存點」' });
                                                                                        return;
                                                                                    }
                                                                                    BgProduct.collectionsDialog({
                                                                                        gvc: gvc,
                                                                                        default: (_a = subVM.def) !== null && _a !== void 0 ? _a : [],
                                                                                        callback: (value) => __awaiter(this, void 0, void 0, function* () {
                                                                                            dialog.dataLoading({ visible: true });
                                                                                            subVM.def = value;
                                                                                            subVM.dataList = yield BgProduct.getCollectiosOpts(value);
                                                                                            subVM.loading = true;
                                                                                            function call() {
                                                                                                dialog.dataLoading({ visible: false });
                                                                                                gvc.notifyDataChange(subVM.id);
                                                                                            }
                                                                                            ApiShop.getCollectionProductVariants({
                                                                                                tagString: subVM.def.length > 0 ? subVM.def.join(',') : '',
                                                                                            }).then((r1) => {
                                                                                                if (r1.result && r1.response && r1.response.length > 0) {
                                                                                                    dvm.variantIds = r1.response.map((item) => item.id);
                                                                                                    const limit = 99999;
                                                                                                    ApiStock.getStoreProductList({
                                                                                                        page: 0,
                                                                                                        limit: limit,
                                                                                                        search: vm.data.content.store_out,
                                                                                                        variant_id_list: dvm.variantIds,
                                                                                                    }).then((r2) => {
                                                                                                        if (r2.result && r2.response.data) {
                                                                                                            const responseArray = r2.response.data;
                                                                                                            this.setVariantList(dvm.variantIds, vm.data, (response) => {
                                                                                                                response.map((item1) => {
                                                                                                                    const stockData = responseArray.find((item2) => item1.variant_id === item2.id);
                                                                                                                    item1.transfer_count = stockData
                                                                                                                        ? stockData.count
                                                                                                                        : 0;
                                                                                                                    return item1;
                                                                                                                });
                                                                                                                vm.data.content.product_list = response;
                                                                                                                call();
                                                                                                            });
                                                                                                        }
                                                                                                        else {
                                                                                                            call();
                                                                                                        }
                                                                                                    });
                                                                                                }
                                                                                                else {
                                                                                                    call();
                                                                                                }
                                                                                            });
                                                                                        }),
                                                                                    });
                                                                                }), { textStyle: 'font-weight: 400;' })}
                                                                                                            </div>
                                                                                                            ${gvc.map(subVM.dataList.map((opt, index) => {
                                                                                    return html ` <div
                                                                                                                        class="d-flex align-items-center form-check-label c_updown_label gap-3"
                                                                                                                    >
                                                                                                                        <span class="tx_normal">${index + 1} . ${opt.value}</span>
                                                                                                                        ${opt.note ? html ` <span class="tx_gray_12 ms-2">${opt.note}</span> ` : ''}
                                                                                                                    </div>`;
                                                                                }))}
                                                                                                        </div>
                                                                                                    `;
                                                                            },
                                                                            onCreate: () => {
                                                                                if (subVM.loading) {
                                                                                    if (subVM.def.length === 0) {
                                                                                        setTimeout(() => {
                                                                                            subVM.dataList = [];
                                                                                            subVM.loading = false;
                                                                                            gvc.notifyDataChange(subVM.id);
                                                                                        }, 200);
                                                                                    }
                                                                                    else {
                                                                                        new Promise((resolve) => {
                                                                                            resolve(BgProduct.getCollectiosOpts(subVM.def));
                                                                                        }).then((data) => {
                                                                                            subVM.dataList = data;
                                                                                            subVM.loading = false;
                                                                                            gvc.notifyDataChange(subVM.id);
                                                                                        });
                                                                                    }
                                                                                }
                                                                            },
                                                                        };
                                                                    });
                                                                case 'product':
                                                                    return gvc.bindView(() => {
                                                                        const subVM = {
                                                                            id: gvc.glitter.getUUID(),
                                                                        };
                                                                        return {
                                                                            bind: subVM.id,
                                                                            view: () => {
                                                                                return html `
                                                                                                        <div class="d-flex flex-column p-2" style="gap: 18px;">
                                                                                                            <div
                                                                                                                class="d-flex align-items-center justify-content-between gray-bottom-line-18"
                                                                                                                style="gap: 24px;"
                                                                                                            >
                                                                                                                <div class="form-check-label c_updown_label">
                                                                                                                    <div class="tx_normal">商品列表</div>
                                                                                                                </div>
                                                                                                                ${BgWidget.grayButton('選擇商品', gvc.event(() => {
                                                                                    if (CheckInput.isEmpty(vm.data.content.store_out)) {
                                                                                        dialog.errorMessage({ text: '請先選擇「盤點庫存點」' });
                                                                                        return;
                                                                                    }
                                                                                    BgWidget.storeStockDialog({
                                                                                        gvc,
                                                                                        title: '搜尋商品',
                                                                                        default: dvm.variantIds,
                                                                                        store_id: vm.data.content.store_out,
                                                                                        callback: (resultData) => {
                                                                                            dvm.variantIds = resultData;
                                                                                            gvc.notifyDataChange(subVM.id);
                                                                                        },
                                                                                    });
                                                                                }), { textStyle: 'font-weight: 400;' })}
                                                                                                            </div>
                                                                                                            ${BgWidget.tableV3({
                                                                                    gvc: gvc,
                                                                                    getData: (vd) => {
                                                                                        vmi = vd;
                                                                                        const limit = 99999;
                                                                                        new Promise((resolve) => {
                                                                                            ApiStock.getStoreProductList({
                                                                                                page: 0,
                                                                                                limit: 99999,
                                                                                                search: vm.data.content.store_out,
                                                                                                variant_id_list: dvm.variantIds,
                                                                                            }).then((r) => {
                                                                                                if (r.result && r.response.data) {
                                                                                                    resolve(r.response.data);
                                                                                                }
                                                                                                else {
                                                                                                    resolve([]);
                                                                                                }
                                                                                            });
                                                                                        }).then((responseArray) => {
                                                                                            this.setVariantList(dvm.variantIds, vm.data, (response) => {
                                                                                                response.map((item1) => {
                                                                                                    const stockData = responseArray.find((item2) => item1.variant_id === item2.id);
                                                                                                    item1.transfer_count = stockData ? stockData.count : 0;
                                                                                                    return item1;
                                                                                                });
                                                                                                vm.data.content.product_list = response;
                                                                                                vmi.pageSize = Math.ceil(response.length / limit);
                                                                                                vmi.originalData = response;
                                                                                                vmi.tableData = specDatalist(vmi.page, limit);
                                                                                                vmi.loading = false;
                                                                                                vmi.callback();
                                                                                            });
                                                                                        });
                                                                                    },
                                                                                    rowClick: () => { },
                                                                                    filter: [],
                                                                                    hiddenPageSplit: true,
                                                                                })}
                                                                                                        </div>
                                                                                                    `;
                                                                            },
                                                                        };
                                                                    });
                                                                case 'all':
                                                                    ApiStock.getStoreProductList({
                                                                        page: 0,
                                                                        limit: 99999,
                                                                        search: vm.data.content.store_out,
                                                                    }).then((r) => {
                                                                        if (r.result && r.response.data) {
                                                                            const responseArray = r.response.data;
                                                                            dvm.variantIds = responseArray.map((item) => `${item.id}`);
                                                                            this.setVariantList(dvm.variantIds, vm.data, (response) => {
                                                                                response.map((item1) => {
                                                                                    const stockData = responseArray.find((item2) => item1.variant_id === item2.id);
                                                                                    item1.transfer_count = stockData ? stockData.count : 0;
                                                                                    return item1;
                                                                                });
                                                                                vm.data.content.product_list = response;
                                                                            });
                                                                        }
                                                                    });
                                                                    return '';
                                                                default:
                                                                    return '';
                                                            }
                                                        },
                                                        divCreate: {
                                                            class: 'mt-2',
                                                        },
                                                    }),
                                                ].join('');
                                        }
                                    },
                                })}
                                                `,
                            ].join(BgWidget.mbContainer(18))),
                        ].join(BgWidget.mbContainer(18));
                    },
                    divCreate: { class: 'p-0' },
                };
            }))}
                </div>`,
            BgWidget.mbContainer(240),
            html ` <div class="update-bar-container">
                    ${BgWidget.cancel(gvc.event(() => {
                vm.view = 'mainList';
            }))}
                    ${BgWidget.save(gvc.event(() => {
                if (CheckInput.isEmpty(vm.data.created_time)) {
                    dialog.errorMessage({ text: `請輸入${typeData.name}時間` });
                    return;
                }
                if (vm.data.type === 'restocking') {
                    if (CheckInput.isEmpty(vm.data.content.vendor)) {
                        dialog.errorMessage({ text: '請輸入供應商' });
                        return;
                    }
                    if (CheckInput.isEmpty(vm.data.content.store_in)) {
                        dialog.errorMessage({ text: '請輸入庫存點' });
                        return;
                    }
                }
                if (vm.data.type === 'transfer') {
                    if (CheckInput.isEmpty(vm.data.content.store_out)) {
                        dialog.errorMessage({ text: '請輸入調出庫存點' });
                        return;
                    }
                    if (CheckInput.isEmpty(vm.data.content.store_in)) {
                        dialog.errorMessage({ text: '請輸入調入庫存點' });
                        return;
                    }
                    if (vm.data.content.store_in === vm.data.content.store_out) {
                        dialog.errorMessage({ text: '調出與調入的庫存點不可相同' });
                        return;
                    }
                }
                if (vm.data.type === 'checking') {
                    if (CheckInput.isEmpty(vm.data.content.store_out)) {
                        dialog.errorMessage({ text: '請輸入盤點庫存點' });
                        return;
                    }
                    if (CheckInput.isEmpty(vm.data.content.check_according)) {
                        dialog.errorMessage({ text: '請選擇盤點範圍' });
                        return;
                    }
                }
                if (vm.data.content.product_list.length === 0) {
                    dialog.errorMessage({ text: `請新增${typeData.name}商品` });
                    return;
                }
                if (vm.data.type !== 'checking' && vm.data.content.product_list.find((item) => item.transfer_count === 0)) {
                    dialog.errorMessage({ text: `商品${typeData.name}的數量不可為0` });
                    return;
                }
                if (vm.data.order_id !== '') {
                    dialog.errorMessage({ text: `${typeData.name}單已存在` });
                    return;
                }
                dialog.dataLoading({ visible: true });
                ApiStock.postStockHistory(vm.data).then((r) => {
                    dialog.dataLoading({ visible: false });
                    if (r.result && r.response.data) {
                        if (vm.data.type === 'checking') {
                            vm.data.order_id = r.response.data.order_id;
                            vm.view = 'checkList';
                        }
                        else {
                            dialog.successMessage({ text: '新增成功' });
                            vm.view = 'mainList';
                        }
                    }
                    else {
                        dialog.successMessage({ text: '新增失敗' });
                    }
                });
            }), vm.data.type === 'checking' ? '開始盤點' : '送出')}
                </div>`,
        ].join('<div class="my-2"></div>'));
    }
    static integerColorComponent(n, leftNumber, rightNumber) {
        if (n === 0) {
            return html `<span class="fs-7">0</span>`;
        }
        if (n < 0) {
            return html `<span class="fs-7 tc_danger">${n}</span>`;
        }
        if (leftNumber !== undefined && leftNumber > rightNumber) {
            return html `<span class="fs-7 tc_success">+${n}</span>`;
        }
        return '數值有誤';
    }
    static restockingDetailTable(json) {
        const x = (json.page - 1) * json.limit;
        return json.list.slice(x, x + json.limit).map((dd) => {
            var _a, _b, _c;
            const startArr = [
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
            ];
            const endArr = [
                {
                    key: '備註',
                    value: `<span class="fs-7">${dd.note || '－'}</span>`,
                },
            ];
            switch (json.type) {
                case 'nonDetails':
                    return [
                        ...startArr,
                        {
                            key: '進貨成本',
                            value: `<span class="fs-7">${dd.cost || '－'}</span>`,
                        },
                        {
                            key: '數量',
                            value: `<span class="fs-7">${dd.transfer_count || '－'}</span>`,
                        },
                        {
                            key: '小計',
                            value: (() => {
                                const subtotal = dd.cost * dd.transfer_count;
                                return html `<span class="fs-7">$ ${subtotal.toLocaleString()}</span>`;
                            })(),
                        },
                        ...endArr,
                    ];
                case 'details':
                    return [
                        ...startArr,
                        {
                            key: '進貨成本',
                            value: `<span class="fs-7">${dd.cost || '－'}</span>`,
                        },
                        {
                            key: '原訂數量',
                            value: `<span class="fs-7">${dd.transfer_count || '－'}</span>`,
                        },
                        {
                            key: '到貨數量',
                            value: `<span class="fs-7">${dd.recent_count || '－'}</span>`,
                        },
                        {
                            key: '差異數量',
                            value: (() => {
                                if (dd.recent_count === undefined) {
                                    return html `<span class="fs-7">－</span>`;
                                }
                                const n = dd.recent_count - dd.transfer_count;
                                return this.integerColorComponent(n, dd.recent_count, dd.transfer_count);
                            })(),
                        },
                        {
                            key: '原訂小計',
                            value: (() => {
                                const subtotal = dd.cost * dd.transfer_count;
                                return html `<span class="fs-7">$ ${subtotal.toLocaleString()}</span>`;
                            })(),
                        },
                        {
                            key: '實際小計',
                            value: (() => {
                                if (dd.recent_count === undefined) {
                                    return html `<span class="fs-7">－</span>`;
                                }
                                const subtotal = dd.cost * dd.recent_count;
                                return html `<span class="fs-7">$ ${subtotal.toLocaleString()}</span>`;
                            })(),
                        },
                        ...endArr,
                    ];
                case 'logs':
                    return [
                        ...startArr,
                        {
                            key: `原訂進貨數量`,
                            value: `<span class="fs-7">${dd.transfer_count || '－'}</span>`,
                        },
                        {
                            key: '實際進貨數量',
                            value: `<span class="fs-7">${((_a = dd.recent_count) !== null && _a !== void 0 ? _a : 0) - ((_b = dd.replenishment_count) !== null && _b !== void 0 ? _b : 0)}</span>`,
                        },
                        {
                            key: '差異數量',
                            value: (() => {
                                var _a;
                                if (dd.recent_count === undefined) {
                                    return html `<span class="fs-7">－</span>`;
                                }
                                const n = dd.recent_count - dd.transfer_count - ((_a = dd.replenishment_count) !== null && _a !== void 0 ? _a : 0);
                                return this.integerColorComponent(n, dd.recent_count, dd.transfer_count);
                            })(),
                        },
                        {
                            key: '此次補貨數量',
                            value: dd.replenishment_count ? html `<span class="fs-7 tc_success">+${(_c = dd.replenishment_count) !== null && _c !== void 0 ? _c : 0}</span>` : html `<span class="fs-7">－</span>`,
                        },
                        ...endArr,
                    ];
            }
        });
    }
    static transferDetailTable(json) {
        const x = (json.page - 1) * json.limit;
        return json.list.slice(x, x + json.limit).map((dd) => {
            var _a, _b, _c, _d, _e;
            const startArr = [
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
            ];
            const endArr = [
                {
                    key: '備註',
                    value: `<span class="fs-7">${dd.note || '－'}</span>`,
                },
            ];
            switch (json.type) {
                case 'nonDetails':
                    return [
                        ...startArr,
                        {
                            key: '來源庫存數量',
                            value: `<span class="fs-7">${(_a = dd.stock) !== null && _a !== void 0 ? _a : 0}</span>`,
                        },
                        {
                            key: '預計調入數量',
                            value: `<span class="fs-7">${dd.transfer_count || '－'}</span>`,
                        },
                        ...endArr,
                    ];
                case 'details':
                    return [
                        ...startArr,
                        {
                            key: '來源庫存數量',
                            value: `<span class="fs-7">${(_b = dd.stock) !== null && _b !== void 0 ? _b : 0}</span>`,
                        },
                        {
                            key: '原訂調入數量',
                            value: `<span class="fs-7">${dd.transfer_count || '－'}</span>`,
                        },
                        {
                            key: '實際調入數量',
                            value: `<span class="fs-7">${dd.recent_count || '－'}</span>`,
                        },
                        {
                            key: '差異數量',
                            value: (() => {
                                if (dd.recent_count === undefined) {
                                    return html `<span class="fs-7">－</span>`;
                                }
                                const n = dd.recent_count - dd.transfer_count;
                                return this.integerColorComponent(n, dd.recent_count, dd.transfer_count);
                            })(),
                        },
                        ...endArr,
                    ];
                case 'logs':
                    return [
                        ...startArr,
                        {
                            key: '原訂調入數量',
                            value: `<span class="fs-7">${dd.transfer_count || '－'}</span>`,
                        },
                        {
                            key: '實際調入數量',
                            value: `<span class="fs-7">${((_c = dd.recent_count) !== null && _c !== void 0 ? _c : 0) - ((_d = dd.replenishment_count) !== null && _d !== void 0 ? _d : 0)}</span>`,
                        },
                        {
                            key: '差異數量',
                            value: (() => {
                                var _a;
                                if (dd.recent_count === undefined) {
                                    return html `<span class="fs-7">－</span>`;
                                }
                                const n = dd.recent_count - dd.transfer_count - ((_a = dd.replenishment_count) !== null && _a !== void 0 ? _a : 0);
                                return this.integerColorComponent(n, dd.recent_count, dd.transfer_count);
                            })(),
                        },
                        {
                            key: '此次補貨數量',
                            value: dd.replenishment_count ? html `<span class="fs-7 tc_success">+${(_e = dd.replenishment_count) !== null && _e !== void 0 ? _e : 0}</span>` : html `<span class="fs-7">－</span>`,
                        },
                        ...endArr,
                    ];
            }
        });
    }
    static checkingDetailTable(json) {
        console.log('checkingDetailTable(no icon)');
        const x = (json.page - 1) * json.limit;
        return json.list.slice(x, x + json.limit).map((dd) => {
            const startArr = [
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
                    key: '商品條碼',
                    value: `<span class="fs-7">${dd.sku || '－'}</span>`,
                },
                {
                    key: '庫存數量',
                    value: `<span class="fs-7">${dd.transfer_count}</span>`,
                },
                {
                    key: '盤點數量',
                    value: `<span class="fs-7">${dd.recent_count || '－'}</span>`,
                },
            ];
            if (json.type === 'logs' && [0, 1].includes(json.status)) {
                return [
                    ...startArr,
                    {
                        key: '修正數量',
                        value: (() => {
                            if (dd.recent_count === undefined) {
                                return html `<span class="fs-7">－</span>`;
                            }
                            const n = dd.recent_count - dd.transfer_count;
                            if (n === 0) {
                                return html `<span class="fs-7">0</span>`;
                            }
                            else if (n < 0) {
                                return html `<span class="fs-7 tc_danger">${n}</span>`;
                            }
                            else if (dd.recent_count > dd.transfer_count) {
                                return html `<span class="fs-7 tc_success">+${n}</span>`;
                            }
                        })(),
                    },
                ];
            }
            return [
                ...startArr,
                {
                    key: '差異數量',
                    value: (() => {
                        if (dd.recent_count === undefined) {
                            return html `<span class="fs-7">－</span>`;
                        }
                        const n = dd.recent_count - dd.transfer_count;
                        return this.integerColorComponent(n, dd.recent_count, dd.transfer_count);
                    })(),
                },
                {
                    key: '備註',
                    value: `<span class="fs-7">${dd.note || '－'}</span>`,
                },
            ];
        });
    }
    static replaceOrder(gvc, vm) {
        const typeData = typeConfig[vm.type];
        let vmi = undefined;
        const transfer_total = vm.data.content.product_list.reduce((sum, item) => {
            return sum + item.cost * item.transfer_count;
        }, 0);
        const recent_total = vm.data.content.product_list.reduce((sum, item) => {
            var _a;
            return sum + item.cost * ((_a = item.recent_count) !== null && _a !== void 0 ? _a : 0);
        }, 0);
        return BgWidget.container([
            html ` <div class="title-container">
                        ${BgWidget.goBack(gvc.event(() => {
                vm.view = 'mainList';
            }))}
                        <div>${BgWidget.title(vm.data.order_id)}</div>
                        <span class="mt-1 ms-2 fs-7">${StockHistory.getStatusBadge(vm.data.type, vm.data.status)}</span>
                    </div>
                    <div class="flex-fill"></div>`,
            html ` <div class="d-flex justify-content-center ${document.body.clientWidth < 768 ? 'flex-column' : ''}" style="gap: 24px">
                    ${BgWidget.container([
                BgWidget.mainCard([
                    html ` <div class="tx_700">${typeData.name}單資料</div>`,
                    BgWidget.horizontalLine({ margin: 0 }),
                    html `
                                        <div class="d-flex flex-wrap" style="gap: 18px 0;">
                                            ${this.getContentHTML(gvc, vm.data, {
                        transfer_total,
                        recent_total,
                    })}
                                        </div>
                                    `,
                ].join(BgWidget.mbContainer(18))),
                BgWidget.mainCard([
                    html `
                                        <div class="tx_700">${typeData.name}商品</div>
                                        ${BgWidget.mbContainer(18)}
                                        ${[
                        BgWidget.tableV3({
                            gvc: gvc,
                            getData: (vd) => {
                                vmi = vd;
                                const limit = 99999;
                                this.setVariantList(vm.data.content.product_list.map((item) => {
                                    return `${item.variant_id}`;
                                }), vm.data, (response) => {
                                    vm.data.content.product_list = response;
                                    vmi.pageSize = Math.ceil(response.length / limit);
                                    vmi.originalData = response;
                                    new Promise((resolve) => {
                                        if (vm.data.type === 'transfer') {
                                            ApiStock.getStoreProductList({
                                                page: 0,
                                                limit: 99999,
                                                search: vm.data.content.store_out,
                                                variant_id_list: vm.data.content.product_list.map((item) => item.variant_id),
                                            }).then((r) => {
                                                if (r.result && r.response.data) {
                                                    resolve(r.response.data);
                                                }
                                                else {
                                                    resolve([]);
                                                }
                                            });
                                        }
                                        else {
                                            resolve([]);
                                        }
                                    }).then((responseArray) => {
                                        switch (vm.data.type) {
                                            case 'restocking':
                                                if ([0, 1, 2].includes(vm.data.status)) {
                                                    vmi.tableData = this.restockingDetailTable({
                                                        type: 'nonDetails',
                                                        list: vm.data.content.product_list,
                                                        page: vmi.page,
                                                        limit,
                                                    });
                                                }
                                                else {
                                                    vmi.tableData = this.restockingDetailTable({
                                                        type: 'details',
                                                        list: vm.data.content.product_list,
                                                        page: vmi.page,
                                                        limit,
                                                    });
                                                }
                                                break;
                                            case 'transfer':
                                                vm.data.content.product_list.map((item1) => {
                                                    const stockData = responseArray.find((item2) => item1.variant_id === item2.id);
                                                    item1.stock = stockData ? stockData.count : 0;
                                                    return item1;
                                                });
                                                if ([0, 1, 2].includes(vm.data.status)) {
                                                    vmi.tableData = this.transferDetailTable({
                                                        type: 'nonDetails',
                                                        list: vm.data.content.product_list,
                                                        page: vmi.page,
                                                        limit,
                                                    });
                                                }
                                                else {
                                                    vmi.tableData = this.transferDetailTable({
                                                        type: 'details',
                                                        list: vm.data.content.product_list,
                                                        page: vmi.page,
                                                        limit,
                                                    });
                                                }
                                                break;
                                            case 'checking':
                                                vm.data.content.product_list.map((item1) => {
                                                    const stockData = responseArray.find((item2) => item1.variant_id === item2.id);
                                                    item1.stock = stockData ? stockData.count : 0;
                                                    return item1;
                                                });
                                                vmi.tableData = this.checkingDetailTable({
                                                    type: 'details',
                                                    status: vm.data.status,
                                                    list: vm.data.content.product_list,
                                                    page: vmi.page,
                                                    limit,
                                                });
                                                break;
                                        }
                                        vmi.loading = false;
                                        vmi.callback();
                                    });
                                });
                            },
                            rowClick: () => { },
                            filter: [],
                            hiddenPageSplit: true,
                        }),
                        (() => {
                            if (vm.data.type !== 'restocking') {
                                return '';
                            }
                            const priceHTML = (obj) => {
                                var _a, _b;
                                return html `<div class="d-flex w-100 mb-2">
                                                        <div class="flex-fill"></div>
                                                        <div class="d-flex justify-content-between" style="width: 250px;">
                                                            <div class="${(_a = obj.className) !== null && _a !== void 0 ? _a : ''}">${obj.name}</div>
                                                            ${obj.incompletion
                                    ? html `<div style="color: #8D8D8D">商品尚未核對完成</div>`
                                    : html `<div class="${(_b = obj.className) !== null && _b !== void 0 ? _b : ''}">$ ${obj.price.toLocaleString()}</div>`}
                                                        </div>
                                                    </div>`;
                            };
                            return [
                                BgWidget.horizontalLine({ margin: 1.75 }),
                                priceHTML({
                                    name: '原訂總成本',
                                    price: transfer_total,
                                }),
                                priceHTML({
                                    name: '實際總成本',
                                    price: recent_total,
                                    className: 'tx_700',
                                    incompletion: vm.data.status === 4,
                                }),
                                priceHTML({
                                    name: '差異金額',
                                    price: transfer_total - recent_total,
                                    className: 'tx_700',
                                    incompletion: vm.data.status === 4,
                                }),
                            ].join('');
                        })(),
                    ].join('')}
                                    `,
                ].join(BgWidget.mbContainer(18))),
                BgWidget.mainCard([
                    html ` <div class="tx_700">${typeData.name}紀錄</div>`,
                    vm.data.content.changeLogs
                        .sort((a, b) => {
                        return a.time > b.time ? -1 : 1;
                    })
                        .map((log) => {
                        return html `<div class="d-flex justify-content-between align-items-center mt-2">
                                                <div class="d-flex align-items-center">
                                                    <div class="me-3">${log.time}</div>
                                                    <div class="me-1">${log.text}</div>
                                                    ${log.status === 1 || log.status === 5
                            ? html `<i
                                                              class="fa-thin fa-square-list cursor_pointer"
                                                              onclick="${gvc.event(() => {
                                BgWidget.dialog({
                                    gvc,
                                    title: `${typeData.name}紀錄`,
                                    width: 1000,
                                    innerHTML: (gvc) => {
                                        return BgWidget.tableV3({
                                            gvc: gvc,
                                            getData: (vd) => {
                                                var _a;
                                                vmi = vd;
                                                const limit = 99999;
                                                this.getVariantInfo((_a = log.product_list) !== null && _a !== void 0 ? _a : [], (response) => {
                                                    vmi.pageSize = Math.ceil(response.length / limit);
                                                    vmi.originalData = response;
                                                    switch (vm.data.type) {
                                                        case 'restocking':
                                                            vmi.tableData = this.restockingDetailTable({
                                                                type: 'logs',
                                                                list: response,
                                                                page: vmi.page,
                                                                limit,
                                                            });
                                                            break;
                                                        case 'transfer':
                                                            vmi.tableData = this.transferDetailTable({
                                                                type: 'logs',
                                                                list: response,
                                                                page: vmi.page,
                                                                limit,
                                                            });
                                                            break;
                                                        case 'checking':
                                                            vmi.tableData = this.checkingDetailTable({
                                                                type: 'logs',
                                                                status: vm.data.status,
                                                                list: response,
                                                                page: vmi.page,
                                                                limit,
                                                            });
                                                            break;
                                                    }
                                                    vmi.loading = false;
                                                    vmi.callback();
                                                });
                                            },
                                            rowClick: () => { },
                                            filter: [],
                                            hiddenPageSplit: true,
                                        });
                                    },
                                });
                            })}"
                                                          ></i>`
                            : ''}
                                                </div>
                                                <div>${log.user && log.user_name ? `${log.user_name}編輯` : '系統自動變更'}</div>
                                            </div>`;
                    })
                        .join(''),
                ].join(BgWidget.mbContainer(18))),
            ].join(BgWidget.mbContainer(18)))}
                </div>`,
            BgWidget.mbContainer(240),
            html ` <div class="update-bar-container">${this.getButtonBar(gvc, vm)}</div>`,
        ].join('<div class="my-2"></div>'));
    }
    static vendorForm(gvc, data) {
        var _a, _b, _c, _d, _e;
        return html `<div class="row">
            ${[
            html `<div class="tx_normal">供應商名稱</div>
                    ${BgWidget.mbContainer(4)}
                    ${BgWidget.editeInput({
                gvc: gvc,
                title: '',
                default: (_a = data.name) !== null && _a !== void 0 ? _a : '',
                placeHolder: '請輸入庫存點名稱',
                callback: (text) => {
                    data.name = text;
                },
            })}`,
            html `<div class="tx_normal">供應商地址</div>
                    ${BgWidget.mbContainer(4)}
                    ${BgWidget.editeInput({
                gvc: gvc,
                title: '',
                default: (_b = data.address) !== null && _b !== void 0 ? _b : '',
                placeHolder: '請輸入庫存點地址',
                callback: (text) => {
                    data.address = text;
                },
            })}`,
            html `<div class="tx_normal">聯絡人姓名</div>
                    ${BgWidget.mbContainer(4)}
                    ${BgWidget.editeInput({
                gvc: gvc,
                title: '',
                default: (_c = data.manager_name) !== null && _c !== void 0 ? _c : '',
                placeHolder: '請輸入聯絡人姓名',
                callback: (text) => {
                    data.manager_name = text;
                },
            })}`,
            html `<div class="tx_normal">電話</div>
                    ${BgWidget.mbContainer(4)}
                    ${BgWidget.editeInput({
                gvc: gvc,
                title: '',
                default: (_d = data.manager_phone) !== null && _d !== void 0 ? _d : '',
                placeHolder: '請輸入電話',
                callback: (text) => {
                    data.manager_phone = text;
                },
            })}`,
            html `
                    <div class="tx_normal">備註</div>
                    <div class="px-3">
                        ${EditorElem.editeText({
                gvc: gvc,
                title: '',
                default: (_e = data.note) !== null && _e !== void 0 ? _e : '',
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
    static storeForm(gvc, data) {
        var _a, _b, _c, _d, _e;
        return html `<div class="row">
            ${[
            html `<div class="tx_normal">庫存點名稱</div>
                    ${BgWidget.mbContainer(4)}
                    ${BgWidget.editeInput({
                gvc: gvc,
                title: '',
                default: (_a = data.name) !== null && _a !== void 0 ? _a : '',
                placeHolder: '請輸入庫存點名稱',
                callback: (text) => {
                    data.name = text;
                },
            })}`,
            html `<div class="tx_normal">庫存點地址</div>
                    ${BgWidget.mbContainer(4)}
                    ${BgWidget.editeInput({
                gvc: gvc,
                title: '',
                default: (_b = data.address) !== null && _b !== void 0 ? _b : '',
                placeHolder: '請輸入庫存點地址',
                callback: (text) => {
                    data.address = text;
                },
            })}`,
            html `<div class="tx_normal">聯絡人姓名</div>
                    ${BgWidget.mbContainer(4)}
                    ${BgWidget.editeInput({
                gvc: gvc,
                title: '',
                default: (_c = data.manager_name) !== null && _c !== void 0 ? _c : '',
                placeHolder: '請輸入聯絡人姓名',
                callback: (text) => {
                    data.manager_name = text;
                },
            })}`,
            html `<div class="tx_normal">電話</div>
                    ${BgWidget.mbContainer(4)}
                    ${BgWidget.editeInput({
                gvc: gvc,
                title: '',
                default: (_d = data.manager_phone) !== null && _d !== void 0 ? _d : '',
                placeHolder: '請輸入電話',
                callback: (text) => {
                    data.manager_phone = text;
                },
            })}`,
            html `
                    <div class="tx_normal">備註</div>
                    <div class="px-3">
                        ${EditorElem.editeText({
                gvc: gvc,
                title: '',
                default: (_e = data.note) !== null && _e !== void 0 ? _e : '',
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
    static getStatusBadge(type, status) {
        const statusData = typeConfig[type].status[status];
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
    }
    static getContentHTML(gvc, data, obj) {
        const glitter = gvc.glitter;
        const vm = {
            id: glitter.getUUID(),
            loading: true,
            data: data,
            storeList: [],
            vendorList: [],
        };
        const typeData = typeConfig[data.type];
        return gvc.bindView({
            bind: vm.id,
            view: () => {
                var _a;
                if (vm.loading) {
                    return BgWidget.spinner({
                        container: { style: 'margin-top: 0;' },
                        circle: { visible: false },
                    });
                }
                else {
                    const vendor = vm.vendorList.find((v) => v.id === vm.data.content.vendor);
                    const storeIn = vm.storeList.find((s) => s.id === vm.data.content.store_in);
                    const storeOut = vm.storeList.find((s) => s.id === vm.data.content.store_out);
                    const startArr = [
                        {
                            title: `${typeData.name}單編號`,
                            value: vm.data.order_id,
                        },
                        {
                            title: `${typeData.name}日期`,
                            value: vm.data.created_time,
                        },
                        {
                            title: `${typeData.name}單狀態`,
                            value: typeConfig[vm.data.type].status[vm.data.status].title,
                        },
                    ];
                    const endArr = [
                        {
                            title: '備註',
                            value: (_a = vm.data.content.note) !== null && _a !== void 0 ? _a : '',
                            width: 40,
                        },
                    ];
                    const arr = (() => {
                        switch (data.type) {
                            case 'restocking':
                                return [
                                    ...startArr,
                                    {
                                        title: '供應商',
                                        value: vendor ? vendor.name : '',
                                    },
                                    {
                                        title: '庫存點',
                                        value: storeIn ? storeIn.name : '',
                                    },
                                    {
                                        title: '原定總成本 / 實際總成本',
                                        value: `$${obj.transfer_total.toLocaleString()} / $${obj.recent_total.toLocaleString()}`,
                                    },
                                    {
                                        title: '差異金額',
                                        value: `$${(obj.transfer_total - obj.recent_total).toLocaleString()}`,
                                    },
                                    ...endArr,
                                ];
                            case 'transfer':
                                return [
                                    ...startArr,
                                    {
                                        title: '調出庫存點',
                                        value: storeOut ? storeOut.name : '',
                                    },
                                    {
                                        title: '調出庫入點',
                                        value: storeIn ? storeIn.name : '',
                                    },
                                    ...endArr,
                                ];
                            case 'checking':
                                return [...startArr, ...endArr];
                        }
                    })();
                    return arr
                        .map((item) => {
                        var _a;
                        return html `<div style="${document.body.clientWidth > 768 ? `width: ${(_a = item.width) !== null && _a !== void 0 ? _a : 20}%;` : ''}">
                                <div class="tx_700" style="margin-bottom: 8px;">${item.title}</div>
                                <div class="tx_normal">${item.value}</div>
                            </div>`;
                    })
                        .join('');
                }
            },
            divCreate: {
                class: 'd-flex flex-wrap w-100',
                style: 'gap: 18px 0;',
            },
            onCreate: () => {
                if (vm.loading) {
                    Promise.all([StockStores.getPublicData(), StockVendors.getPublicData()]).then((dataArray) => {
                        if (dataArray[0].list && dataArray[0].list.length > 0) {
                            vm.storeList = dataArray[0].list;
                        }
                        if (dataArray[1].list && dataArray[1].list.length > 0) {
                            vm.vendorList = dataArray[1].list;
                        }
                        vm.loading = false;
                        gvc.notifyDataChange(vm.id);
                    });
                }
            },
        });
    }
    static verifyCurrentStock(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const ids = data.content.product_list.map((item) => {
                return `${item.variant_id}`;
            });
            return new Promise((resolve) => {
                ApiStock.getStoreProductList({
                    page: 0,
                    limit: 99999,
                    search: data.content.store_out,
                    variant_id_list: ids,
                }).then((r) => {
                    if (r.result && r.response.data) {
                        resolve(r.response.data);
                    }
                    else {
                        resolve([]);
                    }
                });
            }).then((variants) => {
                const diffVariants = data.content.product_list.filter((item1) => {
                    const variant = variants.find((item2) => item1.variant_id === item2.id);
                    if (variant && variant.count !== item1.transfer_count) {
                        item1.stock = variant.count;
                        return true;
                    }
                    return false;
                });
                return diffVariants;
            });
        });
    }
    static getButtonBar(gvc, vm) {
        const glitter = gvc.glitter;
        const dialog = new ShareDialog(glitter);
        const typeData = typeConfig[vm.data.type];
        const buttonList = [
            BgWidget.cancel(gvc.event(() => {
                if (vm.view === 'replace') {
                    vm.view = 'mainList';
                }
                if (vm.view === 'checkList') {
                    vm.view = 'replace';
                }
            }), '返回'),
        ];
        function updateData(status, warningText) {
            dialog.warningMessage({
                callback: (bool) => {
                    if (bool) {
                        vm.data.status = status;
                        ApiStock.putStockHistory(vm.data).then((r) => {
                            dialog.dataLoading({ visible: false });
                            if (r.result && r.response) {
                                dialog.successMessage({ text: '更新成功' });
                                setTimeout(() => {
                                    vm.view = 'replace';
                                }, 700);
                            }
                            else {
                                dialog.successMessage({ text: '更新失敗' });
                            }
                        });
                    }
                },
                text: warningText && warningText.length > 0 ? warningText : `確定要更新此${typeData.name}單？`,
            });
        }
        function deleteData() {
            dialog.warningMessage({
                callback: (bool) => {
                    if (bool) {
                        ApiStock.deleteStockHistory(vm.data).then((r) => {
                            dialog.dataLoading({ visible: false });
                            if (r.result && r.response) {
                                dialog.successMessage({ text: '刪除成功' });
                                setTimeout(() => {
                                    vm.view = 'mainList';
                                }, 700);
                            }
                            else {
                                dialog.successMessage({ text: '刪除失敗' });
                            }
                        });
                    }
                },
                text: (() => {
                    switch (vm.data.type) {
                        case 'restocking':
                            return html `
                                <div class="my-2">
                                    <div class="tx_normal">刪除${typeData.name}單後將無法復原，${typeData.name}記錄將被移除，且不會</div>
                                    <div class="tx_normal">對現有庫存數量產生影響。確定要刪除此${typeData.name}單嗎？</div>
                                    ${BgWidget.mbContainer(8)}
                                    <div class="tx_gray_14">※提醒您，請確認${typeData.name}單貨品是否已到貨，若已到貨，請先進</div>
                                    <div class="tx_gray_14">行核對，確保庫存正確，避免退貨單扣除尚未新增的庫存。</div>
                                </div>
                            `;
                        case 'transfer':
                            return html `
                                <div class="my-2">
                                    <div class="tx_normal">刪除調撥單後將無法復原，調撥記錄將被移除，且不會</div>
                                    <div class="tx_normal">對現有庫存數量產生影響。確定要刪除此調撥單嗎？</div>
                                    ${BgWidget.mbContainer(8)}
                                    <div class="tx_gray_14">※提醒您，請確認調撥單貨品是否已到貨，若已到貨，請先進</div>
                                    <div class="tx_gray_14">行核對，避免退還原庫存點時，扣除尚未新增的庫存。</div>
                                </div>
                            `;
                        case 'checking':
                            return html `
                                <div class="my-2">
                                    <div class="tx_normal">刪除盤點單後將無法復原，確定要刪除此調撥單嗎？</div>
                                </div>
                            `;
                    }
                })(),
            });
        }
        if (vm.view === 'replace') {
            if ([2].includes(vm.data.status)) {
                buttonList.push(BgWidget.danger(gvc.event(() => {
                    deleteData();
                }), `刪除${typeData.name}單`));
            }
            if (vm.data.type !== 'checking' && [5].includes(vm.data.status)) {
                buttonList.push(BgWidget.grayButton(`完成${typeData.name}`, gvc.event(() => {
                    updateData(0, (() => {
                        switch (vm.data.type) {
                            case 'restocking':
                                return html `
                                                <div class="my-2">
                                                    <div class="tx_normal">目前${typeData.name}的商品數量與原訂數量存在差異，</div>
                                                    <div class="tx_normal">確定要完成${typeData.name}嗎？</div>
                                                    ${BgWidget.mbContainer(8)}
                                                    <div class="tx_gray_14">※完成${typeData.name}後，此${typeData.name}單將被標記為已完成，</div>
                                                    <div class="tx_gray_14">後續無法再進行補貨操作。</div>
                                                </div>
                                            `;
                            case 'transfer':
                                return html `
                                                <div class="my-2">
                                                    <div class="tx_normal">目前調撥的商品數量與原訂數量存在差異，</div>
                                                    <div class="tx_normal">確定要完成調撥嗎？</div>
                                                    ${BgWidget.mbContainer(8)}
                                                    <div class="tx_gray_14">※完成調撥後，此調撥單將被標記為已完成，</div>
                                                    <div class="tx_gray_14">後續無法再進行補貨操作。</div>
                                                </div>
                                            `;
                        }
                    })());
                })));
            }
            if ([0, 1, 4, 5].includes(vm.data.status)) {
                const text = (() => {
                    switch (vm.data.status) {
                        case 4:
                            switch (vm.data.type) {
                                case 'restocking':
                                case 'transfer':
                                    return html `
                                        <div class="my-2">
                                            <div class="tx_normal">${typeData.name}單目前處於「已暫停」狀態，請完成所有商品數量的</div>
                                            <div class="tx_normal">核對，確認庫存數據無誤後再進行取消操作。</div>
                                        </div>
                                    `;
                                case 'checking':
                                    return '';
                            }
                        case 5:
                            switch (vm.data.type) {
                                case 'restocking':
                                    return html `
                                        <div class="my-2">
                                            <div class="tx_normal">取消後將無法再修正，確定要取消此${typeData.name}單嗎？</div>
                                            ${BgWidget.mbContainer(8)}
                                            <div class="tx_gray_14">※請確認商品是否已補貨，若已補貨但尚未核對，</div>
                                            <div class="tx_gray_14">取消${typeData.name}單可能會導致庫存數據不正確。</div>
                                            ${BgWidget.mbContainer(8)}
                                            <div class="tx_gray_14">※取消後請新增「${typeData.name}退回單」，並退還商品與發票。</div>
                                        </div>
                                    `;
                                case 'transfer':
                                    return html `
                                        <div class="my-2">
                                            <div class="tx_normal">取消後將無法再修正，確定要取消此${typeData.name}單嗎？</div>
                                            ${BgWidget.mbContainer(8)}
                                            <div class="tx_gray_14">※請確認商品是否已補貨，若已補貨但尚未核對，</div>
                                            <div class="tx_gray_14">取消${typeData.name}單可能會導致庫存數據不正確。</div>
                                            ${BgWidget.mbContainer(8)}
                                            <div class="tx_gray_14">※取消後請新增全新的「調撥單」，並退還商品。</div>
                                        </div>
                                    `;
                                case 'checking':
                                    return html `
                                        <div class="my-2">
                                            <div class="tx_normal">取消後將無法再修正，確定要取消此${typeData.name}單嗎？</div>
                                            ${BgWidget.mbContainer(8)}
                                            <div class="tx_gray_14">※提醒您，此盤點單存在數量差異，請確認該差異是否無需更新至庫存。</div>
                                        </div>
                                    `;
                            }
                        default:
                            switch (vm.data.type) {
                                case 'restocking':
                                    return html `
                                        <div class="my-2">
                                            <div class="tx_normal">取消後將無法復原，確定要取消此${typeData.name}單嗎？</div>
                                            ${BgWidget.mbContainer(8)}
                                            <div class="tx_gray_14">※提醒您，取消${typeData.name}單後，請新增「${typeData.name}退回單」並將</div>
                                            <div class="tx_gray_14">商品及發票一併退還給供應商，確保退貨流程完整。</div>
                                        </div>
                                    `;
                                case 'transfer':
                                    return html `
                                        <div class="my-2">
                                            <div class="tx_normal">取消後將無法復原，確定要取消此${typeData.name}單嗎？</div>
                                            ${BgWidget.mbContainer(8)}
                                            <div class="tx_gray_14">※提醒您，取消後請新增一張全新的「調撥單」，將商</div>
                                            <div class="tx_gray_14">品調回原庫存點，以確保庫存準確且流程完整。</div>
                                        </div>
                                    `;
                                case 'checking':
                                    return html `
                                        <div class="my-2">
                                            <div class="tx_normal">取消後將無法復原，確定要取消此${typeData.name}單嗎？</div>
                                            ${BgWidget.mbContainer(8)}
                                            <div class="tx_gray_14">※提醒您，若盤點單已提交且存在數量差異，系統將回</div>
                                            <div class="tx_gray_14">復至調整前的庫存狀態。</div>
                                        </div>
                                    `;
                            }
                    }
                })();
                buttonList.push(BgWidget.danger(gvc.event(() => {
                    updateData(6, text);
                }), `取消${typeData.name}單`));
            }
            if (vm.data.type === 'checking' && [5].includes(vm.data.status)) {
                buttonList.push(BgWidget.save(gvc.event(() => __awaiter(this, void 0, void 0, function* () {
                    const warningText = '確定要更新庫存嗎？';
                    const diffVariants = yield this.verifyCurrentStock(vm.data);
                    if (diffVariants.length === 0) {
                        updateData(1, warningText);
                        return;
                    }
                    const diffVM = {
                        dataList: [],
                    };
                    function changeStockTable() {
                        return diffVM.dataList.map((dd) => {
                            var _a;
                            const n = ((_a = dd.stock) !== null && _a !== void 0 ? _a : 0) - dd.transfer_count;
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
                                    key: '商品條碼',
                                    value: `<span class="fs-7">${dd.sku || '－'}</span>`,
                                },
                                {
                                    key: '庫存變動數量',
                                    value: StockHistory.integerColorComponent(n, dd.stock, dd.transfer_count),
                                },
                                {
                                    key: '原盤點數量',
                                    value: `<span class="fs-7">${dd.recent_count || '－'}</span>`,
                                },
                                {
                                    key: '最終盤點數量',
                                    value: html `<span class="fs-7"
                                                >${(() => {
                                        if (dd.recent_count === undefined) {
                                            return 0;
                                        }
                                        return dd.recent_count + n;
                                    })()}</span
                                            >`,
                                },
                            ];
                        });
                    }
                    BgWidget.settingDialog({
                        gvc,
                        title: '庫存變動通知',
                        width: 1000,
                        innerHTML: (gvc) => {
                            let vmi = undefined;
                            return [
                                BgWidget.grayNote(html `以下商品在盤點期間內有銷售等變動，導致實際庫存已發生變化。<br />
                                                最終庫存數量將依此公式調整：原盤點數量 + 庫存變動數量`),
                                BgWidget.tableV3({
                                    gvc: gvc,
                                    getData: (vd) => {
                                        vmi = vd;
                                        const limit = 99999;
                                        this.setVariantList(diffVariants.map((item) => {
                                            return `${item.variant_id}`;
                                        }), vm.data, (response) => {
                                            diffVM.dataList = response;
                                            vmi.pageSize = Math.ceil(response.length / limit);
                                            vmi.originalData = response;
                                            vmi.tableData = changeStockTable();
                                            vmi.loading = false;
                                            vmi.callback();
                                        });
                                    },
                                    rowClick: () => { },
                                    filter: [],
                                    hiddenPageSplit: true,
                                }),
                            ].join('');
                        },
                        footer_html: (gvc) => {
                            return [
                                BgWidget.cancel(gvc.event(() => {
                                    gvc.closeDialog();
                                }), '關閉'),
                                BgWidget.save(gvc.event(() => {
                                    dialog.warningMessage({
                                        callback: (bool) => {
                                            if (bool) {
                                                vm.data.status = 1;
                                                vm.data.content.product_list.map((item) => {
                                                    var _a;
                                                    const variant = diffVariants.find((v) => v.variant_id === item.variant_id);
                                                    if (!variant) {
                                                        return item;
                                                    }
                                                    const n = ((_a = variant.stock) !== null && _a !== void 0 ? _a : 0) - item.transfer_count;
                                                    item.transfer_count += n;
                                                    if (item.recent_count) {
                                                        item.recent_count += n;
                                                    }
                                                    return item;
                                                });
                                                ApiStock.putStockHistory(vm.data).then((r) => {
                                                    dialog.dataLoading({ visible: false });
                                                    if (r.result && r.response) {
                                                        dialog.successMessage({ text: '更新成功' });
                                                        gvc.closeDialog();
                                                        setTimeout(() => {
                                                            vm.view = 'replace';
                                                        }, 700);
                                                    }
                                                    else {
                                                        dialog.successMessage({ text: '更新失敗' });
                                                    }
                                                });
                                            }
                                        },
                                        text: warningText,
                                    });
                                }), '確認'),
                            ].join('');
                        },
                    });
                })), '修正庫存'));
            }
            if ([2, 4, 5].includes(vm.data.status)) {
                buttonList.push(BgWidget.save(gvc.event(() => {
                    vm.view = 'checkList';
                }), `${typeData.name}核對`));
            }
        }
        if (vm.view === 'checkList') {
            const isFill = vm.data.content.product_list.every((item) => {
                return typeof item.recent_count === 'number' && !isNaN(item.recent_count);
            });
            const isEqual = vm.data.content.product_list.every((item) => {
                if (typeof item.recent_count === 'number' && !isNaN(item.recent_count)) {
                    if (vm.data.type === 'checking') {
                        return item.recent_count === item.transfer_count;
                    }
                    return item.recent_count >= item.transfer_count;
                }
                return false;
            });
            buttonList.push(BgWidget.cancel(gvc.event(() => __awaiter(this, void 0, void 0, function* () {
                if (isEqual) {
                    if (vm.data.status === 2 || vm.data.status === 4) {
                        updateData(0);
                    }
                    if (vm.data.status === 5) {
                        if (vm.data.type === 'checking') {
                            const diffs = yield this.verifyCurrentStock(vm.data);
                            if (diffs.length > 0) {
                                updateData(5);
                            }
                            else {
                                updateData(0);
                            }
                        }
                        else {
                            updateData(1);
                        }
                    }
                }
                else if (isFill) {
                    updateData(5);
                }
                else {
                    if (vm.data.status === 2 || vm.data.status === 4) {
                        updateData(4);
                    }
                    if (vm.data.status === 5) {
                        updateData(5);
                    }
                }
            })), '保存並退出'));
            if (isFill) {
                buttonList.push(BgWidget.save(gvc.event(() => __awaiter(this, void 0, void 0, function* () {
                    if (isEqual) {
                        if (vm.data.status === 2 || vm.data.status === 4) {
                            updateData(0);
                        }
                        if (vm.data.status === 5) {
                            if (vm.data.type === 'checking') {
                                const diffs = yield this.verifyCurrentStock(vm.data);
                                if (diffs.length > 0) {
                                    updateData(5);
                                }
                                else {
                                    updateData(0);
                                }
                            }
                            else {
                                updateData(1);
                            }
                        }
                    }
                    else {
                        updateData(5);
                    }
                })), '核對完成'));
            }
            else {
                buttonList.push(BgWidget.disableButton('核對完成'));
            }
        }
        return buttonList.join('');
    }
    static setVariantList(ids, data, callback) {
        let product_list = data.content.product_list;
        if (ids.length === 0) {
            callback(product_list);
            return;
        }
        ApiShop.getVariants({
            page: 0,
            limit: 99999,
            id_list: ids.join(','),
            productType: 'all',
        }).then((r) => {
            const origins = product_list.slice();
            product_list = [];
            if (r.result && r.response.data) {
                r.response.data.forEach((item) => {
                    const origin = origins.find((o) => {
                        return o.variant_id === item.id;
                    });
                    const title = item.product_content.title;
                    const spec = item.variant_content.spec;
                    const sku = item.variant_content.sku;
                    product_list.push(Object.assign(Object.assign({ variant_id: item.id, cost: 0, note: '', transfer_count: 0, check_count: 0 }, (origin !== null && origin !== void 0 ? origin : {})), { title: title, spec: spec && spec.length > 0 ? spec.join('/') : '單一規格', sku: sku !== null && sku !== void 0 ? sku : '' }));
                });
            }
            callback(product_list);
        });
    }
    static getVariantInfo(dataList, callback) {
        ApiShop.getVariants({
            page: 0,
            limit: 99999,
            id_list: dataList.map((item) => item.variant_id).join(','),
            productType: 'all',
        }).then((r) => {
            let product_list = [];
            if (r.result && r.response.data) {
                r.response.data.forEach((item) => {
                    const origin = dataList.find((o) => {
                        return o.variant_id === item.id;
                    });
                    const title = item.product_content.title;
                    const spec = item.variant_content.spec;
                    const sku = item.variant_content.sku;
                    if (origin) {
                        product_list.push(Object.assign(Object.assign({}, origin), { title: title, spec: spec && spec.length > 0 ? spec.join('/') : '單一規格', sku: sku !== null && sku !== void 0 ? sku : '' }));
                    }
                });
            }
            callback(product_list);
        });
    }
}
window.glitter.setModule(import.meta.url, StockHistory);
