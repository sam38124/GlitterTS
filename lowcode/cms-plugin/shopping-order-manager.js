var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BgWidget } from '../backend-manager/bg-widget.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { BgListComponent } from '../backend-manager/bg-list-component.js';
import { FilterOptions } from './filter-options.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { UserList } from './user-list.js';
import { CheckInput } from '../modules/checkInput.js';
import { ApiDelivery } from '../glitter-base/route/delivery.js';
import { ShoppingInvoiceManager } from './shopping-invoice-manager.js';
import { BgRecommend } from '../backend-manager/bg-recommend.js';
import { ApiRecommend } from '../glitter-base/route/recommend.js';
import { DeliveryHTML } from './module/delivery-html.js';
import { ApiPageConfig } from '../api/pageConfig.js';
import { Language } from '../glitter-base/global/language.js';
import { OrderSetting } from './module/order-setting.js';
import { CountryTw } from '../modules/country-language/country-tw.js';
import { OrderExcel } from './module/order-excel.js';
import { PaymentPage } from './pos-pages/payment-page.js';
import { ShipmentConfig } from '../glitter-base/global/shipment-config.js';
import { PaymentConfig } from '../glitter-base/global/payment-config.js';
import { ListHeaderOption } from './list-header-option.js';
import { Tool } from '../modules/tool.js';
const html = String.raw;
export class ShoppingOrderManager {
    static main(gvc, query) {
        const glitter = gvc.glitter;
        const dialog = new ShareDialog(gvc.glitter);
        query.isArchived = Boolean(query.isArchived);
        const vm = {
            id: glitter.getUUID(),
            loading: true,
            type: 'list',
            data: {},
            invoiceData: {},
            dataList: undefined,
            query: '',
            queryType: '',
            orderData: undefined,
            orderString: '',
            distributionData: {},
            filter: {},
            filterId: glitter.getUUID(),
            filter_type: query.isPOS ? 'pos' : 'normal',
            return_order: false,
            apiJSON: {},
            checkedData: [],
            headerConfig: [],
        };
        const ListComp = new BgListComponent(gvc, vm, FilterOptions.orderFilterFrame);
        vm.filter = ListComp.getFilterObject();
        gvc.addMtScript([{ src: 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js' }], () => { }, () => { });
        if (window.parent.glitter.getUrlParameter('orderID')) {
            vm.type = 'replace';
            vm.data = {
                cart_token: window.parent.glitter.getUrlParameter('orderID'),
            };
        }
        return gvc.bindView({
            bind: vm.id,
            dataList: [{ obj: vm, key: 'type' }],
            view: () => {
                if (vm.loading) {
                    return '';
                }
                if (vm.type === 'list') {
                    if (vm.return_order) {
                        vm.return_order = false;
                        vm.data = {
                            cart_token: window.parent.glitter.getUrlParameter('orderID'),
                        };
                        setTimeout(() => {
                            vm.type = 'replace';
                        }, 10);
                    }
                    const url = window.parent.location.href;
                    const urlParams = new URLSearchParams(new URL(url).search);
                    [
                        'MerchantID',
                        'MerchantTradeNo',
                        'LogisticsSubType',
                        'CVSStoreID',
                        'CVSAddress',
                        'CVSTelephone',
                        'CVSOutSide',
                        'CVSStoreName',
                    ].forEach(key => {
                        const value = urlParams.get(key);
                        if (value) {
                            vm.type = 'add';
                        }
                    });
                    return BgWidget.container(html `
            <div class="title-container">
              ${BgWidget.title((() => {
                        if (query.isShipment && query.isArchived) {
                            return `已封存出貨單`;
                        }
                        else if (query.isShipment) {
                            return `出貨單列表`;
                        }
                        else if (query.isArchived) {
                            return `已封存訂單`;
                        }
                        else {
                            return `訂單列表`;
                        }
                    })())}
              <div class="flex-fill"></div>
              <div class="d-flex" style="gap: 14px;">
                ${query.isShipment
                        ? BgWidget.grayButton('匯入', gvc.event(() => {
                            OrderExcel.importDialog(gvc, query, () => gvc.notifyDataChange(vm.id));
                        }))
                        : ''}
                ${BgWidget.grayButton('匯出', gvc.event(() => {
                        OrderExcel.exportDialog(gvc, vm.apiJSON, vm.checkedData);
                    }))}
                ${query.isArchived || query.isShipment
                        ? ''
                        : BgWidget.darkButton('新增', gvc.event(() => {
                            vm.type = 'add';
                        }))}
              </div>
            </div>
            <div class="${query.isShipment ? `` : 'd-none'} mb-3"></div>
            <div class="title-container ${query.isShipment ? `d-none` : ''}">
              ${BgWidget.tab(query.isPOS
                        ? [
                            { title: 'POS訂單', key: 'pos' },
                            { title: '線上訂單', key: 'normal' },
                        ]
                        : [
                            { title: '線上訂單', key: 'normal' },
                            { title: 'POS訂單', key: 'pos' },
                        ], gvc, vm.filter_type, text => {
                        vm.filter_type = text;
                        gvc.notifyDataChange(vm.id);
                    })}
            </div>
            ${BgWidget.mainCard([
                        (() => {
                            const id = glitter.getUUID();
                            return gvc.bindView({
                                bind: id,
                                view: () => __awaiter(this, void 0, void 0, function* () {
                                    const orderFunnel = yield FilterOptions.getOrderFunnel();
                                    const filterList = [
                                        BgWidget.selectFilter({
                                            gvc,
                                            callback: (value) => {
                                                vm.queryType = value;
                                                gvc.notifyDataChange(vm.id);
                                            },
                                            default: vm.queryType || 'cart_token',
                                            options: FilterOptions.orderSelect,
                                        }),
                                        BgWidget.searchFilter(gvc.event(e => {
                                            vm.query = `${e.value}`.trim();
                                            gvc.notifyDataChange(vm.id);
                                        }), vm.query || '', '搜尋訂單'),
                                        BgWidget.funnelFilter({
                                            gvc,
                                            callback: () => {
                                                ListComp.showRightMenu(orderFunnel);
                                            },
                                        }),
                                        BgWidget.updownFilter({
                                            gvc,
                                            callback: (value) => {
                                                vm.orderString = value;
                                                gvc.notifyDataChange(vm.id);
                                            },
                                            default: vm.orderString || 'created_time_desc',
                                            options: FilterOptions.orderOrderBy,
                                        }),
                                        query.isShipment
                                            ? ''
                                            : BgWidget.columnFilter({
                                                gvc,
                                                callback: () => BgListComponent.rightMenu({
                                                    menuTitle: '表格設定',
                                                    items: ListHeaderOption.orderListItems,
                                                    frame: ListHeaderOption.orderListFrame,
                                                    default: {
                                                        headerColumn: vm.headerConfig,
                                                    },
                                                    cancelType: 'default',
                                                    save: data => {
                                                        if (data.headerColumn) {
                                                            dialog.dataLoading({ visible: true });
                                                            ApiUser.getPublicConfig('list-header-view', 'manager').then((dd) => {
                                                                ApiUser.setPublicConfig({
                                                                    key: 'list-header-view',
                                                                    value: Object.assign(Object.assign({}, dd.response.value), { 'order-list': data.headerColumn }),
                                                                    user_id: 'manager',
                                                                }).then(() => {
                                                                    dialog.dataLoading({ visible: false });
                                                                    vm.loading = true;
                                                                    gvc.notifyDataChange(vm.id);
                                                                });
                                                            });
                                                        }
                                                    },
                                                }),
                                            }),
                                    ];
                                    const filterTags = ListComp.getFilterTags(yield FilterOptions.getOrderFunnel());
                                    return BgListComponent.listBarRWD(filterList, filterTags);
                                }),
                            });
                        })(),
                        BgWidget.tableV3({
                            gvc: gvc,
                            defPage: ShoppingOrderManager.vm.page,
                            getData: vmi => {
                                ShoppingOrderManager.vm.page = vmi.page;
                                const limit = 20;
                                vm.apiJSON = {
                                    page: vmi.page - 1,
                                    limit: limit,
                                    search: vm.query || undefined,
                                    searchType: vm.queryType || 'cart_token',
                                    orderString: vm.orderString,
                                    filter: vm.filter,
                                    archived: `${query.isArchived}`,
                                    is_pos: vm.filter_type === 'pos',
                                    is_shipment: query.isShipment,
                                };
                                ApiShop.getOrder(vm.apiJSON).then(data => {
                                    function getDatalist() {
                                        return data.response.data.map((dd) => {
                                            var _a;
                                            dd.orderData.total = dd.orderData.total || 0;
                                            dd.orderData.customer_info = (_a = dd.orderData.customer_info) !== null && _a !== void 0 ? _a : {};
                                            if (query.isShipment) {
                                                return [
                                                    {
                                                        key: '訂單編號',
                                                        value: html ` <div class="d-flex align-items-center gap-2" style="min-width: 200px;">
                                  ${dd.cart_token}${(() => {
                                                            switch (dd.orderData.orderSource) {
                                                                case 'manual':
                                                                    return BgWidget.primaryInsignia('手動', 'border');
                                                                case 'combine':
                                                                    return BgWidget.warningInsignia('合併', 'border');
                                                                default:
                                                                    return '';
                                                            }
                                                        })()}
                                </div>`,
                                                    },
                                                    {
                                                        key: '出貨日期',
                                                        value: dd.orderData.user_info.shipment_date
                                                            ? glitter.ut.dateFormat(new Date(dd.orderData.user_info.shipment_date), 'yyyy-MM-dd hh:mm')
                                                            : '尚未設定',
                                                    },
                                                    {
                                                        key: '訂購人',
                                                        value: dd.orderData.user_info ? dd.orderData.user_info.name || '未填寫' : `匿名`,
                                                    },
                                                    {
                                                        key: '出貨狀態',
                                                        value: (() => {
                                                            var _a;
                                                            switch ((_a = dd.orderData.progress) !== null && _a !== void 0 ? _a : 'wait') {
                                                                case 'pre_order':
                                                                    return BgWidget.notifyInsignia('待預購');
                                                                case 'wait':
                                                                    if (dd.orderData.user_info.shipment_number) {
                                                                        return BgWidget.secondaryInsignia('備貨中');
                                                                    }
                                                                    else {
                                                                        return BgWidget.notifyInsignia('未出貨');
                                                                    }
                                                                case 'shipping':
                                                                    return BgWidget.warningInsignia('已出貨');
                                                                case 'finish':
                                                                    return BgWidget.infoInsignia('已取貨');
                                                                case 'arrived':
                                                                    return BgWidget.warningInsignia('已送達');
                                                                case 'returns':
                                                                    return BgWidget.dangerInsignia('已退貨');
                                                            }
                                                        })(),
                                                    },
                                                    {
                                                        key: '出貨單號碼',
                                                        value: dd.orderData.user_info.shipment_number,
                                                    },
                                                ].map((dd) => {
                                                    dd.value = html ` <div style="line-height:40px;">${dd.value}</div>`;
                                                    return dd;
                                                });
                                            }
                                            else {
                                                return [
                                                    {
                                                        key: '訂單編號',
                                                        value: html ` <div class="d-flex align-items-center gap-2" style="min-width: 200px;">
                                  ${dd.cart_token}${(() => {
                                                            switch (dd.orderData.orderSource) {
                                                                case 'manual':
                                                                    return BgWidget.primaryInsignia('手動', 'border');
                                                                case 'combine':
                                                                    return BgWidget.warningInsignia('合併', 'border');
                                                                default:
                                                                    return '';
                                                            }
                                                        })()}
                                </div>`,
                                                    },
                                                    {
                                                        key: '訂單日期',
                                                        value: glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd hh:mm:ss'),
                                                    },
                                                    {
                                                        key: '訂購人',
                                                        value: dd.orderData.user_info ? dd.orderData.user_info.name || '未填寫' : `匿名`,
                                                    },
                                                    {
                                                        key: '訂單金額',
                                                        value: dd.orderData.total.toLocaleString(),
                                                    },
                                                    {
                                                        key: '付款狀態',
                                                        value: (() => {
                                                            switch (dd.status) {
                                                                case 0:
                                                                    if (dd.orderData.proof_purchase) {
                                                                        return BgWidget.warningInsignia('待核款');
                                                                    }
                                                                    if (dd.orderData.customer_info.payment_select == 'cash_on_delivery') {
                                                                        return BgWidget.warningInsignia('貨到付款');
                                                                    }
                                                                    return BgWidget.notifyInsignia('未付款');
                                                                case 3:
                                                                    return BgWidget.warningInsignia('部分付款');
                                                                case 1:
                                                                    return BgWidget.infoInsignia('已付款');
                                                                case -1:
                                                                    return BgWidget.notifyInsignia('付款失敗');
                                                                case -2:
                                                                    return BgWidget.notifyInsignia('已退款');
                                                            }
                                                        })(),
                                                    },
                                                    {
                                                        key: '出貨狀態',
                                                        value: (() => {
                                                            var _a;
                                                            switch ((_a = dd.orderData.progress) !== null && _a !== void 0 ? _a : 'wait') {
                                                                case 'pre_order':
                                                                    return BgWidget.notifyInsignia('待預購');
                                                                case 'wait':
                                                                    if (dd.orderData.user_info.shipment_number) {
                                                                        return BgWidget.secondaryInsignia('備貨中');
                                                                    }
                                                                    else {
                                                                        return BgWidget.notifyInsignia('未出貨');
                                                                    }
                                                                case 'shipping':
                                                                    return BgWidget.warningInsignia('已出貨');
                                                                case 'finish':
                                                                    return BgWidget.infoInsignia('已取貨');
                                                                case 'arrived':
                                                                    return BgWidget.warningInsignia('已送達');
                                                                case 'returns':
                                                                    return BgWidget.dangerInsignia('已退貨');
                                                            }
                                                        })(),
                                                    },
                                                    {
                                                        key: '訂單狀態',
                                                        value: (() => {
                                                            var _a;
                                                            switch ((_a = dd.orderData.orderStatus) !== null && _a !== void 0 ? _a : '0') {
                                                                case '-1':
                                                                    return BgWidget.notifyInsignia('已取消');
                                                                case '0':
                                                                    return BgWidget.warningInsignia('處理中');
                                                                case '1':
                                                                    return BgWidget.infoInsignia('已完成');
                                                            }
                                                        })(),
                                                    },
                                                ]
                                                    .filter(item => {
                                                    return vm.headerConfig.includes(item.key);
                                                })
                                                    .map((dd) => {
                                                    dd.value = html ` <div style="line-height:40px;">${dd.value}</div>`;
                                                    return dd;
                                                });
                                            }
                                        });
                                    }
                                    vm.dataList = data.response.data;
                                    vmi.pageSize = Math.ceil(data.response.total / limit);
                                    vmi.originalData = vm.dataList;
                                    vmi.tableData = getDatalist();
                                    vmi.loading = false;
                                    if (vmi.pageSize != 0 && vmi.page > vmi.pageSize) {
                                        ShoppingOrderManager.vm.page = 1;
                                        gvc.notifyDataChange(vm.id);
                                    }
                                    vmi.callback();
                                });
                            },
                            rowClick: (_, index) => {
                                vm.data = vm.dataList[index];
                                vm.type = 'replace';
                            },
                            filter: (() => {
                                function updateOrders(orders) {
                                    return __awaiter(this, void 0, void 0, function* () {
                                        dialog.dataLoading({ visible: true });
                                        Promise.all(orders.map(order => {
                                            return new Promise((resolve, reject) => {
                                                ApiShop.putOrder({
                                                    id: `${order.id}`,
                                                    order_data: order.orderData,
                                                    status: order.status,
                                                }).then(response => {
                                                    response.result ? resolve() : reject();
                                                });
                                            });
                                        }))
                                            .then(() => {
                                            dialog.dataLoading({ visible: false });
                                            dialog.successMessage({ text: '更新成功' });
                                            gvc.notifyDataChange(vm.id);
                                        })
                                            .catch(() => {
                                            dialog.dataLoading({ visible: false });
                                            dialog.errorMessage({ text: '更新失敗' });
                                        });
                                    });
                                }
                                const normalArray = [
                                    {
                                        name: '合併訂單',
                                        option: true,
                                        event: (checkArray) => {
                                            return OrderSetting.combineOrders(gvc, checkArray, () => gvc.notifyDataChange(vm.id));
                                        },
                                    },
                                    {
                                        name: '自動生成出貨單',
                                        option: true,
                                        event: (checkArray) => {
                                            const strArray = checkArray.map((dd) => {
                                                try {
                                                    return dd.orderData.user_info.shipment;
                                                }
                                                catch (error) {
                                                    return undefined;
                                                }
                                            });
                                            const allEqual = strArray.every((val) => val && val === strArray[0]);
                                            if (!allEqual) {
                                                dialog.errorMessage({ text: '配送的方式必須相同' });
                                                return;
                                            }
                                            if (checkArray.find((dd) => dd.orderData.user_info.shipment_number)) {
                                                dialog.errorMessage({ text: `已取號訂單無法再次取號` });
                                                return;
                                            }
                                            this.printStoreOrderInfo({
                                                gvc,
                                                cart_token: checkArray.map((dd) => dd.cart_token).join(','),
                                                print: false,
                                                callback: () => gvc.notifyDataChange(vm.id),
                                            });
                                        },
                                    },
                                    {
                                        name: '手動生成出貨單',
                                        option: true,
                                        event: (checkArray) => {
                                            if (checkArray.find((dd) => dd.orderData.user_info.shipment_number)) {
                                                dialog.errorMessage({ text: `已取號訂單無法再次取號` });
                                                return;
                                            }
                                            if (checkArray.find((dd) => { var _a; return !['', 'wait'].includes((_a = dd.orderData.progress) !== null && _a !== void 0 ? _a : ''); })) {
                                                dialog.errorMessage({ text: `未出貨的訂單才可以進行取號` });
                                                return;
                                            }
                                            dialog.checkYesOrNot({
                                                text: '系統將自動生成配號並產生出貨單',
                                                callback: response => {
                                                    if (response) {
                                                        let shipment_date = gvc.glitter.ut.dateFormat(new Date(), 'yyyy-MM-dd');
                                                        let shipment_time = gvc.glitter.ut.dateFormat(new Date(), 'hh:mm');
                                                        function next() {
                                                            return __awaiter(this, void 0, void 0, function* () {
                                                                dialog.dataLoading({
                                                                    visible: true,
                                                                });
                                                                let index_number = 0;
                                                                yield Promise.all(checkArray.map((orderData) => {
                                                                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                                                        orderData.orderData.user_info.shipment_number = `${new Date().getTime()}${index_number++}`;
                                                                        orderData.orderData.user_info.shipment_date = new Date(`${shipment_date} ${shipment_time}:00`).toISOString();
                                                                        ApiShop.putOrder({
                                                                            id: `${orderData.id}`,
                                                                            order_data: orderData.orderData,
                                                                        }).then(response => {
                                                                            resolve(true);
                                                                        });
                                                                    }));
                                                                }));
                                                                dialog.dataLoading({
                                                                    visible: false,
                                                                });
                                                                gvc.notifyDataChange(vm.id);
                                                            });
                                                        }
                                                        BgWidget.settingDialog({
                                                            gvc: gvc,
                                                            title: '設定出貨日期',
                                                            innerHTML: (gvc) => {
                                                                return [
                                                                    BgWidget.editeInput({
                                                                        gvc: gvc,
                                                                        title: '出貨日期',
                                                                        default: shipment_date,
                                                                        callback: text => {
                                                                            shipment_date = text;
                                                                        },
                                                                        type: 'date',
                                                                        placeHolder: '請輸入出貨日期',
                                                                    }),
                                                                    BgWidget.editeInput({
                                                                        gvc: gvc,
                                                                        title: '出貨時間',
                                                                        default: shipment_time,
                                                                        callback: text => {
                                                                            shipment_time = text;
                                                                        },
                                                                        type: 'time',
                                                                        placeHolder: '請輸入出貨時間',
                                                                    }),
                                                                ].join('');
                                                            },
                                                            footer_html: (gvc) => {
                                                                return [
                                                                    BgWidget.cancel(gvc.event(() => {
                                                                        gvc.closeDialog();
                                                                    }), '取消'),
                                                                    BgWidget.save(gvc.event(() => {
                                                                        gvc.closeDialog();
                                                                        next();
                                                                    }), '儲存'),
                                                                ].join('');
                                                            },
                                                            width: 350,
                                                        });
                                                    }
                                                },
                                            });
                                        },
                                    },
                                    {
                                        name: '更改訂單狀態',
                                        option: true,
                                        event: (checkArray) => {
                                            function showDialog(orders) {
                                                let orderStatus = '';
                                                BgWidget.settingDialog({
                                                    gvc: gvc,
                                                    title: '批量更改訂單狀態',
                                                    innerHTML: (gvc) => {
                                                        return html `<div>
                                  <div class="tx_700 mb-2">更改為</div>
                                  ${BgWidget.select({
                                                            gvc,
                                                            callback: (value) => {
                                                                orderStatus = value;
                                                            },
                                                            default: orderStatus,
                                                            options: [{ title: '變更訂單狀態', value: '' }]
                                                                .concat(ApiShop.getOrderStatusArray())
                                                                .map(item => {
                                                                return {
                                                                    key: item.value,
                                                                    value: item.title,
                                                                };
                                                            }),
                                                        })}
                                </div>`;
                                                    },
                                                    footer_html: (gvc) => {
                                                        return [
                                                            BgWidget.cancel(gvc.event(() => {
                                                                gvc.closeDialog();
                                                            }), '取消'),
                                                            BgWidget.save(gvc.event(() => {
                                                                if (orderStatus === '') {
                                                                    dialog.infoMessage({ text: '請選擇欲更改的訂單狀態' });
                                                                    return;
                                                                }
                                                                gvc.closeDialog();
                                                                orders.forEach(order => {
                                                                    order.orderData.orderStatus = orderStatus;
                                                                });
                                                                updateOrders(orders);
                                                            }), '儲存'),
                                                        ].join('');
                                                    },
                                                    width: 350,
                                                });
                                            }
                                            function main() {
                                                dialog.dataLoading({ visible: true });
                                                ApiShop.getOrder({
                                                    page: 0,
                                                    limit: 1000,
                                                    id_list: checkArray.map((data) => data.id).join(','),
                                                }).then(d => {
                                                    dialog.dataLoading({ visible: false });
                                                    if (d.result && Array.isArray(d.response.data)) {
                                                        showDialog(d.response.data);
                                                    }
                                                    else {
                                                        dialog.errorMessage({ text: '取得訂單資料錯誤' });
                                                    }
                                                });
                                            }
                                            main();
                                        },
                                    },
                                    {
                                        name: '更改付款狀態',
                                        option: true,
                                        event: (checkArray) => {
                                            function showDialog(orders) {
                                                let status = '';
                                                BgWidget.settingDialog({
                                                    gvc: gvc,
                                                    title: '批量更改付款狀態',
                                                    innerHTML: (gvc) => {
                                                        return html `<div>
                                  <div class="tx_700 mb-2">更改為</div>
                                  ${BgWidget.select({
                                                            gvc,
                                                            callback: (value) => {
                                                                status = value;
                                                            },
                                                            default: status,
                                                            options: [
                                                                { title: '變更付款狀態', value: '' },
                                                                { title: '已付款', value: '1' },
                                                                { title: '部分付款', value: '3' },
                                                                { title: '待核款 / 貨到付款 / 未付款', value: '0' },
                                                                { title: '已退款', value: '-2' },
                                                            ].map(item => {
                                                                return {
                                                                    key: item.value,
                                                                    value: item.title,
                                                                };
                                                            }),
                                                        })}
                                </div>`;
                                                    },
                                                    footer_html: (gvc) => {
                                                        return [
                                                            BgWidget.cancel(gvc.event(() => {
                                                                gvc.closeDialog();
                                                            }), '取消'),
                                                            BgWidget.save(gvc.event(() => {
                                                                if (status === '') {
                                                                    dialog.infoMessage({ text: '請選擇欲更改的付款狀態' });
                                                                    return;
                                                                }
                                                                gvc.closeDialog();
                                                                orders.forEach(order => {
                                                                    order.status = Number(status);
                                                                });
                                                                updateOrders(orders);
                                                            }), '儲存'),
                                                        ].join('');
                                                    },
                                                    width: 350,
                                                });
                                            }
                                            function main() {
                                                dialog.dataLoading({ visible: true });
                                                ApiShop.getOrder({
                                                    page: 0,
                                                    limit: 1000,
                                                    id_list: checkArray.map((data) => data.id).join(','),
                                                }).then(d => {
                                                    dialog.dataLoading({ visible: false });
                                                    if (d.result && Array.isArray(d.response.data)) {
                                                        showDialog(d.response.data);
                                                    }
                                                    else {
                                                        dialog.errorMessage({ text: '取得訂單資料錯誤' });
                                                    }
                                                });
                                            }
                                            main();
                                        },
                                    },
                                ];
                                const shipmentArray = [
                                    {
                                        name: '取消配號/出貨',
                                        option: true,
                                        event: (checkArray) => __awaiter(this, void 0, void 0, function* () {
                                            if (checkArray.find((dd) => dd.progress !== 'wait')) {
                                                dialog.errorMessage({
                                                    text: '未出貨訂單才能取消配號與出貨'
                                                });
                                                return;
                                            }
                                            dialog.dataLoading({ visible: true });
                                            yield Promise.all(checkArray.map((orderData) => {
                                                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                                    ApiDelivery.cancelOrder({
                                                        cart_token: orderData.cart_token,
                                                        logistic_number: orderData.orderData.user_info.shipment_number,
                                                        total_amount: orderData.orderData.total,
                                                    })
                                                        .then(res => {
                                                        resolve(true);
                                                    })
                                                        .catch(err => {
                                                        resolve(true);
                                                    });
                                                }));
                                            }));
                                            dialog.dataLoading({ visible: false });
                                            gvc.recreateView();
                                        }),
                                    },
                                    {
                                        name: '列印托運單',
                                        option: true,
                                        event: (checkArray) => {
                                            const strArray = checkArray.map((dd) => {
                                                try {
                                                    return dd.orderData.user_info.shipment;
                                                }
                                                catch (error) {
                                                    return undefined;
                                                }
                                            });
                                            if (strArray.includes(undefined)) {
                                                dialog.errorMessage({
                                                    text: html ` <div class="text-center">
                                已勾選訂單中不可含有<br />非超商店到店的配送方式
                              </div>`,
                                                });
                                                return;
                                            }
                                            const allEqual = strArray.every((val) => val && val === strArray[0]);
                                            if (!allEqual) {
                                                dialog.errorMessage({ text: '配送的方式必須相同' });
                                                return;
                                            }
                                            if (strArray.includes('HILIFEC2C') && strArray.length > 1) {
                                                dialog.errorMessage({ text: '萊爾富不支援一次列印多張托運單' });
                                                return;
                                            }
                                            return this.printStoreOrderInfo({
                                                gvc,
                                                cart_token: checkArray.map((dd) => dd.cart_token).join(','),
                                                print: true,
                                            });
                                        },
                                    },
                                    {
                                        name: '更改出貨狀態',
                                        option: true,
                                        event: (checkArray) => {
                                            function showDialog(orders) {
                                                let progress = '';
                                                BgWidget.settingDialog({
                                                    gvc: gvc,
                                                    title: '批量更改出貨狀態',
                                                    innerHTML: (gvc) => {
                                                        return html `<div>
                                  <div class="tx_700 mb-2">更改為</div>
                                  ${BgWidget.select({
                                                            gvc,
                                                            callback: (value) => {
                                                                progress = value;
                                                            },
                                                            default: progress,
                                                            options: [
                                                                { title: '變更出貨狀態', value: '' },
                                                                { title: '已出貨', value: 'shipping' },
                                                                { title: '備貨中', value: 'wait' },
                                                                { title: '已取貨', value: 'finish' },
                                                                { title: '已退貨', value: 'returns' },
                                                                { title: '已到貨', value: 'arrived' },
                                                            ].map(item => {
                                                                return {
                                                                    key: item.value,
                                                                    value: item.title,
                                                                };
                                                            }),
                                                        })}
                                </div>`;
                                                    },
                                                    footer_html: (gvc) => {
                                                        return [
                                                            BgWidget.cancel(gvc.event(() => {
                                                                gvc.closeDialog();
                                                            }), '取消'),
                                                            BgWidget.save(gvc.event(() => {
                                                                if (progress === '') {
                                                                    dialog.infoMessage({ text: '請選擇欲更改的出貨狀態' });
                                                                    return;
                                                                }
                                                                gvc.closeDialog();
                                                                orders.forEach(order => {
                                                                    order.orderData.progress = progress;
                                                                });
                                                                updateOrders(orders);
                                                            }), '儲存'),
                                                        ].join('');
                                                    },
                                                    width: 350,
                                                });
                                            }
                                            function main() {
                                                dialog.dataLoading({ visible: true });
                                                ApiShop.getOrder({
                                                    page: 0,
                                                    limit: 1000,
                                                    id_list: checkArray.map((data) => data.id).join(','),
                                                }).then(d => {
                                                    dialog.dataLoading({ visible: false });
                                                    if (d.result && Array.isArray(d.response.data)) {
                                                        const orders = d.response.data;
                                                        const hasPaynowShipping = orders.find(order => {
                                                            try {
                                                                return order.orderData.user_info.shipment_refer === 'paynow';
                                                            }
                                                            catch (error) {
                                                                return false;
                                                            }
                                                        });
                                                        if (hasPaynowShipping) {
                                                            dialog.infoMessage({
                                                                text: `自動物流追蹤之出貨單，不可手動更改<br/>（訂單編號：${hasPaynowShipping.cart_token}）`,
                                                            });
                                                        }
                                                        else {
                                                            showDialog(d.response.data);
                                                        }
                                                    }
                                                    else {
                                                        dialog.errorMessage({ text: '取得訂單資料錯誤' });
                                                    }
                                                });
                                            }
                                            main();
                                        },
                                    },
                                ];
                                const defaultArray = [
                                    {
                                        name: query.isArchived ? '解除封存' : '批量封存',
                                        event: (checkArray) => {
                                            const action_with = ['order_list', 'order_list_archive'].includes(window.glitter.getUrlParameter('page'))
                                                ? '出貨單'
                                                : '訂單';
                                            dialog.checkYesOrNot({
                                                text: html `<div class="d-flex flex-column" style="gap:5px;">
                              是否確認${query.isArchived ? '解除封存' : '封存'}所選項目?
                              ${BgWidget.grayNote(`**請注意**  將連同${action_with}一併${query.isArchived ? '解除封存' : '封存'}`)}
                            </div>`,
                                                callback: (response) => {
                                                    if (response) {
                                                        dialog.dataLoading({ visible: true });
                                                        new Promise(resolve => {
                                                            let n = 0;
                                                            for (const b of checkArray) {
                                                                b.orderData.archived = `${!query.isArchived}`;
                                                                ApiShop.putOrder({
                                                                    id: `${b.id}`,
                                                                    order_data: b.orderData,
                                                                }).then(resp => {
                                                                    if (resp.result) {
                                                                        if (++n == checkArray.length) {
                                                                            resolve();
                                                                        }
                                                                    }
                                                                });
                                                            }
                                                        }).then(() => {
                                                            dialog.dataLoading({ visible: false });
                                                            gvc.notifyDataChange(vm.id);
                                                        });
                                                    }
                                                },
                                            });
                                        },
                                    },
                                    {
                                        name: '列印出貨明細',
                                        option: true,
                                        event: (checkArray) => {
                                            DeliveryHTML.print(gvc, checkArray, 'shipment');
                                        },
                                    },
                                    {
                                        name: '列印地址貼條',
                                        option: true,
                                        event: (checkArray) => {
                                            DeliveryHTML.print(gvc, checkArray, 'address');
                                        },
                                    },
                                ];
                                return [...defaultArray, ...(query.isShipment ? shipmentArray : normalArray)];
                            })(),
                            filterCallback: (dataArray) => {
                                vm.checkedData = dataArray;
                            },
                        }),
                    ].join(''))}
            ${BgWidget.mbContainer(240)}
          `);
                }
                else if (vm.type == 'replace') {
                    return this.replaceOrder(gvc, vm, vm.data.cart_token);
                }
                else if (vm.type == 'add') {
                    return this.createOrder(gvc, vm);
                }
                else if (vm.type == 'createInvoice') {
                    vm.return_order = true;
                    return ShoppingInvoiceManager.createOrder(gvc, vm, vm.tempOrder);
                }
                else if (vm.type == 'recommend') {
                    return BgRecommend.editorLink({
                        gvc: gvc,
                        data: vm.distributionData.data[0],
                        callback: () => {
                            vm.type = 'replace';
                        },
                        vm,
                    });
                }
                else if (vm.type == 'viewInvoice') {
                    vm.return_order = true;
                    return ShoppingInvoiceManager.replaceOrder(gvc, vm, vm.invoiceData);
                }
                return '';
            },
            onCreate: () => {
                if (vm.loading) {
                    ApiUser.getPublicConfig('list-header-view', 'manager').then((dd) => {
                        vm.headerConfig = dd.response.value['order-list'];
                        vm.loading = false;
                        gvc.notifyDataChange(vm.id);
                    });
                }
            },
        });
    }
    static supportShipmentMethod() {
        return ShipmentConfig.list.map(dd => {
            return {
                name: dd.title,
                value: dd.value,
            };
        });
    }
    static formatRecord(gvc, vm, orderID, record) {
        const orderNumbers = record.match(/{{order=(\d+)}}/g) || [];
        orderNumbers.map((order) => {
            const pureOrder = order.replace(/{{order=|}}/g, '');
            record = record.replace(order, BgWidget.blueNote(`#${pureOrder}`, gvc.event(() => {
                vm.data.cart_token = pureOrder;
                vm.type = 'replace';
            })));
        });
        const shipmentNumbers = record.match(/{{shipment=(\d+)}}/g) || [];
        shipmentNumbers.map((order) => {
            const pureOrder = order.replace(/{{shipment=|}}/g, '');
            record = record.replace(order, BgWidget.blueNote(`#${pureOrder}`, gvc.event(() => {
                window.glitter.setUrlParameter('page', 'shipment_list');
                window.glitter.setUrlParameter('orderID', orderID);
                gvc.recreateView();
            })));
        });
        return record;
    }
    static replaceOrder(gvc, vm, passOrderData, backCallback) {
        let is_shipment = ['shipment_list_archive', 'shipment_list'].includes(window.glitter.getUrlParameter('page'));
        return gvc.bindView(() => {
            return {
                bind: 'orderDetailRefresh',
                view: () => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    try {
                        const glitter = gvc.glitter;
                        let orderData = {};
                        const cart_token = (() => {
                            var _a;
                            if (typeof passOrderData === 'string') {
                                return passOrderData;
                            }
                            else {
                                return JSON.parse(JSON.stringify((_a = passOrderData !== null && passOrderData !== void 0 ? passOrderData : vm.data) !== null && _a !== void 0 ? _a : {
                                    id: 3469,
                                    cart_token: '1699540611634',
                                    status: 1,
                                    email: 'sam38124@gmail.com',
                                    orderData: {
                                        email: 'sam38124@gmail.com',
                                        total: 99000,
                                        customer_info: { name: '', phone: '', email: '' },
                                        lineItems: [
                                            {
                                                id: 291,
                                                spec: ['A', '140 * 230 cm'],
                                                count: '9',
                                                sale_price: 11000,
                                            },
                                        ],
                                        user_info: {
                                            name: '王建智',
                                            email: 'sam38124@gmail.com',
                                            phone: '0978028730',
                                            address: '台中市潭子區昌平路三段150巷15弄12號',
                                        },
                                        progress: 'wait',
                                        note: `用戶備註: 我的餐椅是要亞麻灰的，可是到後面頁面都會跳成米白！再麻煩幫我送亞麻灰的 麻煩12月中旬過後再幫我送貨，確切時間再提千跟我聯繫，謝謝！！ 訂單來源裝置: app 金流來源與編號: 藍新金流 / 2311110375 11/8 告知 chloe及 PM 此請技術排查，並讓 chloe 向供應商說明緣由。`,
                                    },
                                    created_time: '2023-11-09T06:36:51.000Z',
                                })).cart_token;
                            }
                        })();
                        window.parent.glitter.setUrlParameter('orderID', cart_token);
                        let origData = undefined;
                        if (cart_token) {
                            const orderDataNew = yield ApiShop.getOrder({
                                page: 0,
                                limit: 1,
                                data_from: 'manager',
                                search: cart_token,
                                searchType: 'cart_token',
                            });
                            orderData = JSON.parse(JSON.stringify(orderDataNew.response.data[0]));
                            origData = JSON.parse(JSON.stringify(orderDataNew.response.data[0]));
                        }
                        window.parent.glitter.setUrlParameter(cart_token);
                        let userData = {};
                        const mainViewID = gvc.glitter.getUUID();
                        orderData.orderData.progress = (_a = orderData.orderData.progress) !== null && _a !== void 0 ? _a : 'wait';
                        if (orderData.orderData.shipment_selector &&
                            !orderData.orderData.shipment_selector.find(dd => {
                                return dd.value === 'now';
                            })) {
                            orderData.orderData.shipment_selector.push({
                                name: '立即取貨',
                                value: 'now',
                                form: undefined,
                            });
                        }
                        let userDataLoading = true;
                        const saasConfig = window.parent.saasConfig;
                        const vt = OrderSetting.getAllStatusBadge(orderData);
                        ApiUser.getUsersDataWithEmailOrPhone(orderData.email).then(res => {
                            userData = res.response;
                            userDataLoading = false;
                            gvc.notifyDataChange(mainViewID);
                        });
                        const child_vm = {
                            type: 'order',
                            userID: '',
                        };
                        let invoiceData = {};
                        let invoiceLoading = true;
                        let storeList = [];
                        let storeLoading = true;
                        let productData = [];
                        let productLoading = true;
                        ApiShop.getInvoice({
                            page: 0,
                            limit: 1000,
                            search: orderData.cart_token,
                            searchType: 'order_number',
                        }).then((data) => {
                            invoiceData = data.response.data[0];
                            invoiceLoading = false;
                            gvc.notifyDataChange('invoiceView');
                        });
                        ApiShop.getProduct({
                            limit: 99,
                            page: 0,
                            productType: 'all',
                            id_list: orderData.orderData.lineItems.map((dd) => {
                                return dd.id;
                            }),
                        }).then(r => {
                            productLoading = false;
                            productData = r.response.data;
                            gvc.notifyDataChange(mainViewID);
                        });
                        function saveEvent() {
                            const dialog = new ShareDialog(gvc.glitter);
                            dialog.dataLoading({ text: '上傳中', visible: true });
                            ApiShop.putOrder({
                                id: `${orderData.id}`,
                                order_data: orderData.orderData,
                                status: orderData.status,
                            }).then(response => {
                                dialog.dataLoading({ text: '上傳中', visible: false });
                                if (response.result) {
                                    if (orderData.orderData.method && origData.status == 0 && orderData.status == 1) {
                                        dialog.successMessage({
                                            text: html ` <div class="text-center">訂單付款完成！<br />若需要可透過下方按鈕手動建立發票</div>`,
                                        });
                                    }
                                    else {
                                        dialog.successMessage({ text: '更新成功' });
                                    }
                                    gvc.notifyDataChange('orderDetailRefresh');
                                }
                                else {
                                    dialog.errorMessage({ text: '更新異常' });
                                }
                            });
                        }
                        if (!['CVSStoreID', 'CVSStoreName', 'CVSAddress'].find(dd => {
                            return !window.parent.glitter.getUrlParameter(dd);
                        })) {
                            yield new Promise((resolve, reject) => {
                                const dialog = new ShareDialog(gvc.glitter);
                                dialog.checkYesOrNot({
                                    text: '是否確認更換門市?',
                                    callback: response => {
                                        if (response) {
                                            ['CVSStoreID', 'CVSStoreName', 'CVSAddress'].map(dd => {
                                                orderData.orderData.user_info[dd] = window.parent.glitter.getUrlParameter(dd);
                                                window.parent.glitter.setUrlParameter(dd);
                                            });
                                            saveEvent();
                                        }
                                        else {
                                            ['CVSStoreID', 'CVSStoreName', 'CVSAddress'].map(dd => {
                                                window.parent.glitter.setUrlParameter(dd);
                                            });
                                            resolve(false);
                                        }
                                    },
                                });
                            });
                        }
                        return gvc.bindView({
                            bind: mainViewID,
                            dataList: [{ obj: child_vm, key: 'type' }],
                            view: () => {
                                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                                try {
                                    if (userDataLoading || productLoading) {
                                        return BgWidget.spinner();
                                    }
                                    if (child_vm.type === 'user') {
                                        return UserList.userInformationDetail({
                                            userID: child_vm.userID,
                                            callback: () => {
                                                child_vm.type = 'order';
                                            },
                                            gvc: gvc,
                                        });
                                    }
                                    function getBadgeList() {
                                        return html ` <div style="display:flex; gap:10px; justify-content:flex-end;">
                      ${vt.archivedBadge()} ${vt.paymentBadge()}${vt.outShipBadge()}${vt.orderStatusBadge()}
                    </div>`;
                                    }
                                    const shipment_card = BgWidget.mainCard((() => {
                                        let loading = true;
                                        let deliveryConfig = {};
                                        const vm = {
                                            mode: 'read',
                                        };
                                        return gvc.bindView({
                                            bind: 'Edit',
                                            dataList: [{ obj: vm, key: 'mode' }],
                                            view: () => {
                                                if (loading) {
                                                    return '';
                                                }
                                                return [
                                                    is_shipment
                                                        ? html `
                                  <div class="tx_700 d-flex align-items-center" style="gap:5px;">訂單號碼</div>
                                  ${BgWidget.mbContainer(12)}
                                  <div
                                    style="color: #4D86DB; cursor: pointer;"
                                    onclick="${gvc.event(() => {
                                                            is_shipment = false;
                                                            gvc.notifyDataChange('orderDetailRefresh');
                                                        })}"
                                  >
                                    ${orderData.orderData.combineOrderID ||
                                                            orderData.orderData.orderID}
                                  </div>
                                `
                                                        : ``,
                                                    is_shipment ? `` : html ` <div class="tx_700">配送 / 出貨單資訊</div>`,
                                                    html ` <div class="tx_700 d-flex align-items-center flex-wrap" style="gap:10px;">
                                出貨狀態
                                ${orderData.orderData.user_info.shipment_refer === 'paynow'
                                                        ? BgWidget.warningInsignia('已啟用物流追蹤將自動追蹤出貨狀態')
                                                        : ``}
                              </div>
                              ${BgWidget.mbContainer(12)}
                              <div class="ms-auto w-100">
                                ${EditorElem.select({
                                                        title: ``,
                                                        gvc: gvc,
                                                        def: `${orderData.orderData.progress}`,
                                                        array: ApiShop.getProgressArray(orderData.orderData.user_info.shipment_number),
                                                        readonly: orderData.orderData.user_info.shipment_refer === 'paynow' || is_archive,
                                                        callback: text => {
                                                            function next() {
                                                                if (text && text !== `${orderData.orderData.progress}`) {
                                                                    orderData.orderData.progress = text;
                                                                }
                                                            }
                                                            if (['', 'wait'].includes(orderData.orderData.progress) &&
                                                                !orderData.orderData.user_info.shipment_number &&
                                                                text !== 'pre_order') {
                                                                const dialog = new ShareDialog(gvc.glitter);
                                                                dialog.checkYesOrNot({
                                                                    text: '尚未新增出貨單，是否隨機取號並變更出貨狀態?',
                                                                    callback: response => {
                                                                        if (response) {
                                                                            orderData.orderData.user_info.shipment_number =
                                                                                new Date().getTime();
                                                                            next();
                                                                            saveEvent();
                                                                        }
                                                                        gvc.notifyDataChange('Edit');
                                                                    },
                                                                });
                                                            }
                                                            else {
                                                                next();
                                                            }
                                                        },
                                                    })}
                              </div>`,
                                                    html ` <div class="tx_700">配送方式</div>
                              ${BgWidget.mbContainer(12)}
                              <div class="d-flex w-100 align-items-center gap-2">
                                <div style="tx_normal">
                                  ${Language.getLanguageCustomText(((orderData.orderData.shipment_selector ||
                                                        ShoppingOrderManager.supportShipmentMethod()).find((dd) => {
                                                        return dd.value === orderData.orderData.user_info.shipment;
                                                    }) || { name: '門市取貨' }).name)}
                                </div>
                                ${BgWidget.customButton({
                                                        button: {
                                                            color: 'gray',
                                                            size: 'sm',
                                                        },
                                                        text: { name: '列印出貨明細' },
                                                        event: gvc.event(() => {
                                                            DeliveryHTML.print(gvc, [orderData], 'shipment');
                                                        }),
                                                    })}
                              </div>`,
                                                    html `<div class="tx_700 d-flex align-items-center" style="gap:5px;">出貨單號碼</div>
                              ${is_shipment ? `` : BgWidget.grayNote('取號後將自動生成出貨單，於出貨單列表單中。')}
                              ${BgWidget.mbContainer(12)}
                              <div class="d-flex align-items-center" style="gap:10px;">
                                ${orderData.orderData.user_info.shipment_number || '尚未取號'}
                                ${ShipmentConfig.supportPrintList.includes(orderData.orderData.user_info.shipment) &&
                                                        !(orderData.orderData.user_info.shipment_number &&
                                                            orderData.orderData.user_info.shipment_refer !== 'paynow')
                                                        ? BgWidget.customButton({
                                                            button: {
                                                                color: 'gray',
                                                                size: 'sm',
                                                            },
                                                            text: {
                                                                name: orderData.orderData.user_info.shipment_number
                                                                    ? '列印出貨單'
                                                                    : '出貨單取號',
                                                            },
                                                            event: gvc.event(() => {
                                                                return this.printStoreOrderInfo({
                                                                    gvc,
                                                                    cart_token: orderData.cart_token,
                                                                    print: !!orderData.orderData.user_info.shipment_number,
                                                                });
                                                            }),
                                                        })
                                                        : ''}
                                ${BgWidget.customButton({
                                                        button: {
                                                            color: 'gray',
                                                            size: 'sm',
                                                        },
                                                        text: {
                                                            name: orderData.orderData.user_info.shipment_number &&
                                                                orderData.orderData.user_info.shipment_refer === 'paynow'
                                                                ? '取消配號'
                                                                : '手動輸入',
                                                        },
                                                        event: gvc.event(() => {
                                                            var _a;
                                                            if (orderData.orderData.user_info.shipment_number &&
                                                                orderData.orderData.user_info.shipment_refer === 'paynow') {
                                                                const dialog = new ShareDialog(gvc.glitter);
                                                                dialog.checkYesOrNot({
                                                                    text: '是否確認取消配號?',
                                                                    callback: response => {
                                                                        if (response) {
                                                                            const dialog = new ShareDialog(gvc.glitter);
                                                                            dialog.dataLoading({
                                                                                visible: true,
                                                                            });
                                                                            ApiDelivery.cancelOrder({
                                                                                cart_token: orderData.cart_token,
                                                                                logistic_number: orderData.orderData.user_info.shipment_number,
                                                                                total_amount: orderData.orderData.total,
                                                                            }).then(res => {
                                                                                dialog.dataLoading({
                                                                                    visible: false,
                                                                                });
                                                                                if (res.result && res.response.data.includes('F,')) {
                                                                                    dialog.errorMessage({
                                                                                        text: res.response.data.replace('F,', ''),
                                                                                    });
                                                                                }
                                                                                else {
                                                                                    dialog.successMessage({
                                                                                        text: '已成功取消配號',
                                                                                    });
                                                                                }
                                                                                gvc.notifyDataChange('orderDetailRefresh');
                                                                            });
                                                                        }
                                                                    },
                                                                });
                                                            }
                                                            else {
                                                                let shipnumber = (_a = orderData.orderData.user_info.shipment_number) !== null && _a !== void 0 ? _a : '';
                                                                BgWidget.settingDialog({
                                                                    gvc: gvc,
                                                                    title: '手動出貨',
                                                                    innerHTML: (gvc) => {
                                                                        return [
                                                                            BgWidget.editeInput({
                                                                                gvc: gvc,
                                                                                title: '出貨單號碼',
                                                                                default: shipnumber !== null && shipnumber !== void 0 ? shipnumber : '',
                                                                                callback: text => {
                                                                                    shipnumber = text;
                                                                                },
                                                                                placeHolder: '請輸入托運單號碼',
                                                                            }),
                                                                        ].join('');
                                                                    },
                                                                    footer_html: (gvc) => {
                                                                        return [
                                                                            BgWidget.cancel(gvc.event(() => {
                                                                                gvc.closeDialog();
                                                                            }), '取消'),
                                                                            BgWidget.save(gvc.event(() => {
                                                                                orderData.orderData.user_info.shipment_number = shipnumber;
                                                                                gvc.closeDialog();
                                                                                saveEvent();
                                                                            }), '儲存'),
                                                                        ].join('');
                                                                    },
                                                                    width: 350,
                                                                });
                                                            }
                                                        }),
                                                    })}
                              </div>

                              ${(() => {
                                                        var _a, _b;
                                                        try {
                                                            if (ShipmentConfig.supportPrintList.includes(orderData.orderData.user_info.shipment) &&
                                                                orderData.orderData.user_info.shipment_number &&
                                                                orderData.orderData.user_info.shipment_refer === 'paynow') {
                                                                return html `
                                      ${BgWidget.mbContainer(12)}
                                      <div class="tx_700 d-flex align-items-end" style="gap:5px;">物流追蹤</div>
                                      ${BgWidget.mbContainer(12)}
                                      ${[
                                                                    `狀態: ${(_a = orderData.orderData.user_info.shipment_detail.Detail_Status_Description) !== null && _a !== void 0 ? _a : '追蹤異常'}`,
                                                                    `追蹤碼: ${(_b = orderData.orderData.user_info.shipment_detail.paymentno) !== null && _b !== void 0 ? _b : '尚未生成'}`,
                                                                ].join(`<div class="w-100  my-1"></div>`)}
                                    `;
                                                            }
                                                            else {
                                                                return ``;
                                                            }
                                                        }
                                                        catch (e) {
                                                            console.error(e);
                                                            return `${e}`;
                                                        }
                                                    })()} `,
                                                    orderData.orderData.user_info.shipment_number
                                                        ? html `
                                  <div class="tx_700 d-flex align-items-center" style="gap:5px;">出貨日期</div>
                                  ${BgWidget.mbContainer(12)}
                                  <div class="d-flex" style="gap:5px;">
                                    ${orderData.orderData.user_info.shipment_date
                                                            ? gvc.glitter.ut.dateFormat(new Date(orderData.orderData.user_info.shipment_date), 'yyyy-MM-dd hh:mm')
                                                            : '尚未設定'}
                                    ${BgWidget.customButton({
                                                            button: {
                                                                color: 'gray',
                                                                size: 'sm',
                                                            },
                                                            text: { name: '設定出貨日期' },
                                                            event: gvc.event(() => {
                                                                let shipment_date = orderData.orderData.user_info.shipment_date
                                                                    ? gvc.glitter.ut.dateFormat(new Date(orderData.orderData.user_info.shipment_date), 'yyyy-MM-dd')
                                                                    : gvc.glitter.ut.dateFormat(new Date(), 'yyyy-MM-dd');
                                                                let shipment_time = orderData.orderData.user_info.shipment_date
                                                                    ? gvc.glitter.ut.dateFormat(new Date(orderData.orderData.user_info.shipment_date), 'hh:mm')
                                                                    : gvc.glitter.ut.dateFormat(new Date(), 'hh:mm');
                                                                BgWidget.settingDialog({
                                                                    gvc: gvc,
                                                                    title: '設定出貨日期',
                                                                    innerHTML: (gvc) => {
                                                                        return [
                                                                            BgWidget.editeInput({
                                                                                gvc: gvc,
                                                                                title: '出貨日期',
                                                                                default: shipment_date,
                                                                                callback: text => {
                                                                                    shipment_date = text;
                                                                                },
                                                                                type: 'date',
                                                                                placeHolder: '請輸入出貨日期',
                                                                            }),
                                                                            BgWidget.editeInput({
                                                                                gvc: gvc,
                                                                                title: '出貨時間',
                                                                                default: shipment_time,
                                                                                callback: text => {
                                                                                    shipment_time = text;
                                                                                },
                                                                                type: 'time',
                                                                                placeHolder: '請輸入出貨時間',
                                                                            }),
                                                                        ].join('');
                                                                    },
                                                                    footer_html: (gvc) => {
                                                                        return [
                                                                            BgWidget.cancel(gvc.event(() => {
                                                                                gvc.closeDialog();
                                                                            }), '取消'),
                                                                            BgWidget.save(gvc.event(() => {
                                                                                orderData.orderData.user_info.shipment_date = new Date(`${shipment_date} ${shipment_time}:00`).toISOString();
                                                                                gvc.closeDialog();
                                                                                saveEvent();
                                                                            }), '儲存'),
                                                                        ].join('');
                                                                    },
                                                                    width: 350,
                                                                });
                                                            }),
                                                        })}
                                  </div>
                                `
                                                        : ``,
                                                    html `${[
                                                        'UNIMARTC2C',
                                                        'FAMIC2C',
                                                        'OKMARTC2C',
                                                        'HILIFEC2C',
                                                        'normal',
                                                        'UNIMARTFREEZE',
                                                        'black_cat',
                                                        'black_cat_freezing',
                                                    ].includes(orderData.orderData.user_info.shipment)
                                                        ? html ` <div class="tx_700 d-flex align-items-end" style="gap:5px;">
                                      配送資訊
                                      <div
                                        style="cursor:pointer;color:#4D86DB;font-size: 14px;"
                                        class="${ShipmentConfig.supermarketList.includes(orderData.orderData.user_info.shipment)
                                                            ? ``
                                                            : `d-none`} fw-500"
                                        onclick="${gvc.event(() => {
                                                            const dialog = new ShareDialog(gvc.glitter);
                                                            if (orderData.orderData.user_info.shipment_number) {
                                                                dialog.errorMessage({ text: '請先取消配號' });
                                                                return;
                                                            }
                                                            const url = new URL(window.parent.location.href);
                                                            url.searchParams.set('orderID', orderData.cart_token);
                                                            ApiDelivery.storeMaps({
                                                                returnURL: url.href,
                                                                logistics: orderData.orderData.user_info.shipment,
                                                            }).then((res) => __awaiter(this, void 0, void 0, function* () {
                                                                let newDiv = document.createElement('div');
                                                                newDiv.innerHTML = res.response.form;
                                                                window.parent.document.body.appendChild(newDiv);
                                                                window.parent.document.querySelector('#submit').click();
                                                            }));
                                                        })}"
                                      >
                                        更換門市
                                      </div>
                                    </div>
                                    ${BgWidget.mbContainer(12)}`
                                                        : ``}
                              <div class="d-flex flex-column tx_normal" style="gap: 4px;">
                                ${(() => {
                                                        var _a, _b;
                                                        if (['normal', 'black_cat', 'global_express', 'black_cat_freezing'].includes(orderData.orderData.user_info.shipment)) {
                                                            let map = [];
                                                            if ((_a = CountryTw.find(dd => {
                                                                return dd.countryCode === orderData.orderData.user_info.country;
                                                            })) === null || _a === void 0 ? void 0 : _a.countryName) {
                                                                map.push(`國家 : ${(_b = CountryTw.find(dd => {
                                                                    return dd.countryCode === orderData.orderData.user_info.country;
                                                                })) === null || _b === void 0 ? void 0 : _b.countryName}`);
                                                            }
                                                            if (orderData.orderData.user_info.city) {
                                                                map.push(`城市 : ${orderData.orderData.user_info.city}`);
                                                            }
                                                            if (orderData.orderData.user_info.state) {
                                                                map.push(`州/省 : ${orderData.orderData.user_info.state}`);
                                                            }
                                                            if (orderData.orderData.user_info.postal_code) {
                                                                map.push(`郵遞區號 : ${orderData.orderData.user_info.postal_code}`);
                                                            }
                                                            if (orderData.orderData.user_info.address) {
                                                                map.push(`地址 : ${orderData.orderData.user_info.address}`);
                                                            }
                                                            return map.join('<div class="w-100 border-top my-1"></div>');
                                                        }
                                                        const formData = (orderData.orderData.shipment_selector ||
                                                            ShoppingOrderManager.supportShipmentMethod()).find(dd => {
                                                            return dd.value === orderData.orderData.user_info.shipment;
                                                        });
                                                        if (['UNIMARTC2C', 'FAMIC2C', 'OKMARTC2C', 'HILIFEC2C', 'UNIMARTFREEZE'].includes(orderData.orderData.user_info.shipment)) {
                                                            return html `
                                      <div class="d-flex flex-wrap">
                                        <span class="me-2">門市名稱:</span>
                                        <div style="white-space: normal;word-break: break-all;">
                                          ${orderData.orderData.user_info.CVSStoreName}
                                        </div>
                                      </div>
                                      <div class="d-flex">門市店號: ${orderData.orderData.user_info.CVSStoreID}</div>
                                      <div class="d-flex" style="white-space: normal;word-break: break-all;">
                                        地址: ${orderData.orderData.user_info.CVSAddress}
                                      </div>
                                    `;
                                                        }
                                                        else if (formData.form) {
                                                            return formData.form
                                                                .map((dd) => {
                                                                return html ` <div class="d-flex flex-wrap">
                                          <span class="me-2">${Language.getLanguageCustomText(dd.title)} :</span>
                                          <div style="white-space: normal;word-break: break-all;">
                                            ${Language.getLanguageCustomText(orderData.orderData.user_info.custom_form_delivery[dd.key])}
                                          </div>
                                        </div>`;
                                                            })
                                                                .join('');
                                                        }
                                                        return '';
                                                    })()}
                              </div>`,
                                                    html ` <div class="d-flex w-100 align-items-center gap-2">
                                <div class="tx_700">收件人資訊</div>
                                ${vm.mode === 'edit'
                                                        ? BgWidget.customButton({
                                                            button: {
                                                                color: 'black',
                                                                size: 'sm',
                                                            },
                                                            text: {
                                                                name: '確認',
                                                            },
                                                            event: gvc.event(() => {
                                                                gvc.notifyDataChange('user_info');
                                                                vm.mode = 'read';
                                                            }),
                                                        })
                                                        : BgWidget.customButton({
                                                            button: {
                                                                color: 'gray',
                                                                size: 'sm',
                                                            },
                                                            text: {
                                                                name: '編輯',
                                                            },
                                                            event: gvc.event(() => {
                                                                vm.mode = 'edit';
                                                            }),
                                                        })}
                              </div>
                              ${BgWidget.mbContainer(8)}
                              <div class="tx_normal">
                                ${(() => {
                                                        let viewModel = [
                                                            ['姓名', 'name'],
                                                            ['電話', 'phone'],
                                                            ['信箱', 'email'],
                                                        ];
                                                        if (vm.mode == 'read') {
                                                            return viewModel
                                                                .map(item => {
                                                                return html ` <div>
                                            ${item[0]} : ${orderData.orderData.user_info[item[1]] || '未填寫'}
                                          </div>
                                          ${BgWidget.mbContainer(4)}`;
                                                            })
                                                                .join('');
                                                        }
                                                        else {
                                                            return viewModel
                                                                .map(item => {
                                                                return html `
                                          <div class="d-flex flex-column w-100" style="gap:8px;">
                                            <div style="${item[0] == '姓名' ? '' : 'margin-top:12px;'}">${item[0]}</div>
                                            <input
                                              style="display: flex;padding: 9px 18px;align-items: flex-start;gap: 10px;flex: 1 0 0;border-radius: 10px;border: 1px solid #DDD;"
                                              value="${orderData.orderData.user_info[item[1]]}"
                                              onchange="${gvc.event(e => {
                                                                    orderData.orderData.user_info[item[1]] = e.value;
                                                                })}"
                                            />
                                          </div>
                                        `;
                                                            })
                                                                .join('');
                                                        }
                                                    })()}
                              </div>`,
                                                    (() => {
                                                        if (orderData.orderData.custom_receipt_form &&
                                                            orderData.orderData.custom_receipt_form.filter((dd) => {
                                                                return orderData.orderData.user_info[dd.key];
                                                            }).length > 0) {
                                                            return html ` <div class="tx_700">自訂配送資訊表單</div>
                                  ${BgWidget.mbContainer(8)}
                                  <div class="tx_normal" style="color: #393939;font-size: 16px;">
                                    ${orderData.orderData.custom_receipt_form
                                                                .filter((dd) => {
                                                                return orderData.orderData.user_info[dd.key];
                                                            })
                                                                .map((dd) => {
                                                                return html ` <div>
                                          ${Language.getLanguageCustomText(dd.title)} :
                                          ${orderData.orderData.user_info[dd.key]}
                                        </div>`;
                                                            })
                                                                .join('')}
                                  </div>`;
                                                        }
                                                        else {
                                                            return ``;
                                                        }
                                                    })(),
                                                    (() => {
                                                        if (orderData.orderData.custom_form_format &&
                                                            orderData.orderData.custom_form_format.filter((dd) => {
                                                                return orderData.orderData.custom_form_data[dd.key];
                                                            }).length > 0) {
                                                            return html ` <div class="tx_700">自訂顧客資料表單</div>
                                  ${BgWidget.mbContainer(8)}
                                  <div class="tx_normal" style="color: #393939;font-size: 16px;">
                                    ${orderData.orderData.custom_form_format
                                                                .filter((dd) => {
                                                                return orderData.orderData.custom_form_data[dd.key];
                                                            })
                                                                .map((dd) => {
                                                                return html `
                                          <div>
                                            ${Language.getLanguageCustomText(dd.title)} :
                                            ${orderData.orderData.custom_form_data[dd.key]}
                                          </div>
                                        `;
                                                            })
                                                                .join('')}
                                  </div>`;
                                                        }
                                                        else {
                                                            return ``;
                                                        }
                                                    })(),
                                                    (() => {
                                                        let map = [];
                                                        if (orderData.orderData.user_info.invoice_method) {
                                                            map.push(`<div class="tx_700">
                                                                                            發票開立資訊
                                                                                        </div>`);
                                                            map.push(`開立時機: ${(() => {
                                                                switch (orderData.orderData.user_info.invoice_method) {
                                                                    case 'nouse':
                                                                        return '不開立發票';
                                                                    case 'off_line':
                                                                        return '線下自行開立';
                                                                    default:
                                                                        return `付款時開立`;
                                                                }
                                                            })()}`);
                                                        }
                                                        if (orderData.orderData.user_info.invoice_method &&
                                                            orderData.orderData.user_info.invoice_method !== 'nouse') {
                                                            map.push(`開立對象: ${(() => {
                                                                switch (orderData.orderData.user_info.invoice_type) {
                                                                    case 'donate':
                                                                        return '捐贈';
                                                                    case 'company':
                                                                        return '公司';
                                                                    default:
                                                                        return '個人';
                                                                }
                                                            })()}`);
                                                            map.push(`${(() => {
                                                                switch (orderData.orderData.user_info.invoice_type) {
                                                                    case 'donate':
                                                                        return '發票捐贈單位: ' + orderData.orderData.user_info.love_code;
                                                                    case 'company':
                                                                        return [
                                                                            `公司抬頭: ${orderData.orderData.user_info.company}`,
                                                                            `統編號碼: ${orderData.orderData.user_info.gui_number}`,
                                                                            `發票寄送信箱: ${orderData.orderData.user_info.email || '未填寫'}`,
                                                                        ]
                                                                            .map(dd => {
                                                                            return `<div>${dd}</div>`;
                                                                        })
                                                                            .join(BgWidget.mbContainer(8));
                                                                    default:
                                                                        return [
                                                                            `發票寄送信箱: ${orderData.orderData.user_info.email || '未填寫'}`,
                                                                        ]
                                                                            .map(dd => {
                                                                            return `<div>${dd}</div>`;
                                                                        })
                                                                            .join(BgWidget.mbContainer(8));
                                                                }
                                                            })()}`);
                                                        }
                                                        return map
                                                            .map(dd => {
                                                            return `<div>${dd}</div>`;
                                                        })
                                                            .join(BgWidget.mbContainer(8));
                                                    })(),
                                                ]
                                                    .filter(dd => {
                                                    return dd;
                                                })
                                                    .join(BgWidget.mbContainer(18));
                                            },
                                            divCreate: { class: 'd-flex flex-column' },
                                            onCreate: () => {
                                                if (loading) {
                                                    ApiPageConfig.getPrivateConfig(window.parent.appName, 'glitter_delivery').then(res => {
                                                        deliveryConfig = (() => {
                                                            try {
                                                                return res.response.result[0].value;
                                                            }
                                                            catch (error) {
                                                                return {};
                                                            }
                                                        })();
                                                        loading = false;
                                                        gvc.notifyDataChange('Edit');
                                                    });
                                                }
                                            },
                                        });
                                    })());
                                    const is_archive = orderData.orderData.archived === 'true';
                                    return BgWidget.container(html ` <div class="title-container">
                        ${BgWidget.goBack(gvc.event(() => {
                                        if (!is_shipment && window.glitter.getUrlParameter('page') === 'shipment_list') {
                                            is_shipment = true;
                                            gvc.notifyDataChange('orderDetailRefresh');
                                            return;
                                        }
                                        if (backCallback) {
                                            backCallback();
                                        }
                                        else {
                                            vm.type = 'list';
                                        }
                                    }))}
                        <div class="d-flex flex-column">
                          <div
                            class="align-items-center"
                            style="gap:10px;color: #393939;font-size: 24px;font-weight: 700;"
                          >
                            #${is_shipment ? orderData.orderData.user_info.shipment_number : orderData.cart_token}
                          </div>
                          ${BgWidget.grayNote(`訂單成立時間 : ${Tool.formatDateTime(orderData.created_time)}`)}
                        </div>
                        <div class="flex-fill"></div>
                        ${document.body.clientWidth > 768 ? getBadgeList() : ''}
                      </div>
                      ${document.body.clientWidth > 768 ? '' : html ` <div class="mt-1 mb-3">${getBadgeList()}</div>`}
                      ${BgWidget.container1x2({
                                        html: [
                                            !is_shipment ? `` : shipment_card,
                                            BgWidget.mainCard(html `
                              <div
                                style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;align-self: stretch;"
                              >
                                <div class="tx_700">訂單狀態</div>
                                <div class="ms-auto w-100">
                                  ${is_shipment
                                                ? (_a = [
                                                    {
                                                        title: '變更訂單狀態',
                                                        value: '',
                                                    },
                                                ]
                                                    .concat(ApiShop.getOrderStatusArray())
                                                    .find(dd => {
                                                    var _a;
                                                    return dd.value == ((_a = orderData.orderData.orderStatus) !== null && _a !== void 0 ? _a : '0');
                                                })) === null || _a === void 0 ? void 0 : _a.title
                                                : EditorElem.select({
                                                    title: ``,
                                                    gvc: gvc,
                                                    def: (_b = orderData.orderData.orderStatus) !== null && _b !== void 0 ? _b : '0',
                                                    array: [
                                                        {
                                                            title: '變更訂單狀態',
                                                            value: '',
                                                        },
                                                    ].concat(ApiShop.getOrderStatusArray()),
                                                    callback: text => {
                                                        orderData.orderData.orderStatus = orderData.orderData.orderStatus || '0';
                                                        if (text && text !== orderData.orderData.orderStatus) {
                                                            orderData.orderData.orderStatus = text;
                                                        }
                                                    },
                                                    readonly: is_shipment || is_archive,
                                                })}
                                </div>
                              </div>
                              <div class="tx_700 my-3">訂單明細</div>
                              ${BgWidget.horizontalLine()}
                              <div class="d-flex flex-column">
                                ${orderData.orderData.lineItems
                                                .map((dd) => {
                                                return gvc.bindView({
                                                    bind: glitter.getUUID(),
                                                    view: () => {
                                                        function showTag(color, text) {
                                                            return html `
                                            <div
                                              style="background:${color};display: flex;height: 22px;padding: 4px 6px;justify-content: center;align-items: center;gap: 10px;border-radius: 7px;font-size: 14px;font-style: normal;font-weight: 400;white-space: nowrap;"
                                            >
                                              ${text}
                                            </div>
                                          `;
                                                        }
                                                        return html ` <div
                                            class="d-flex flex-column align-items-center justify-content-center"
                                            style="gap:5px;margin-right:12px;"
                                          >
                                            ${BgWidget.validImageBox({
                                                            gvc,
                                                            image: dd.preview_image,
                                                            width: 60,
                                                            class: 'border rounded',
                                                            style: '',
                                                        })}
                                          </div>
                                          <div class="d-flex flex-column">
                                            ${dd.is_hidden
                                                            ? `<div style="width:auto;">${BgWidget.secondaryInsignia('隱形商品')}</div>`
                                                            : ``}
                                            <div class="tx_700 d-flex align-items-center" style="gap:4px;">
                                              <div>${dd.title}</div>
                                              ${dd.is_gift ? `<div class="">${showTag('#FFE9B2', '贈品')}</div>` : ``}
                                              ${dd.is_add_on_items
                                                            ? `<div class="">${showTag('#D8E7EC', '加購品')}</div>`
                                                            : ``}
                                              ${dd.pre_order ? `<div class="">${showTag('#D8E7EC', '預購')}</div>` : ``}
                                            </div>
                                            ${dd.spec.length > 0 ? BgWidget.grayNote(dd.spec.join(', ')) : ''}
                                            ${BgWidget.grayNote(`存貨單位 (SKU)：${dd.sku && dd.sku.length > 0 ? dd.sku : '無'}`)}
                                          </div>
                                          <div class="flex-fill"></div>
                                          <div
                                            class="tx_normal_16 d-none d-lg-flex justify-content-end"
                                            style="min-width: 80px;"
                                          >
                                            ${dd.origin_price && dd.origin_price > dd.sale_price
                                                            ? html ` <div style="margin-right: 8px; text-decoration: line-through;">
                                                  $${dd.origin_price.toLocaleString()}
                                                </div>`
                                                            : ''}
                                            <div>$${dd.sale_price.toLocaleString()} × ${dd.count}</div>
                                          </div>
                                          <div
                                            class="tx_normal d-sm-none d-flex flex-column"
                                            style="display: flex;justify-content: end;${document.body.clientWidth > 800
                                                            ? `width: 110px`
                                                            : `width: 140px;`}"
                                          >
                                            ${dd.origin_price && dd.origin_price > dd.sale_price
                                                            ? html ` <div style="margin-right: 6px; text-decoration: line-through;">
                                                  $${dd.origin_price.toLocaleString()}
                                                </div>`
                                                            : ''}
                                            <div>$${dd.sale_price.toLocaleString()} × ${dd.count}</div>
                                          </div>

                                          <div
                                            class="tx_normal d-none d-sm-flex"
                                            style="display: flex;justify-content: end;${document.body.clientWidth > 800
                                                            ? `width: 110px`
                                                            : ``}"
                                          >
                                            $${(dd.sale_price * dd.count).toLocaleString()}
                                          </div>`;
                                                    },
                                                    divCreate: { class: `d-flex align-items-center gap-1` },
                                                });
                                            })
                                                .join(html ` <div style="margin-top: 12px;"></div>`)}
                                ${BgWidget.horizontalLine()}
                                ${[
                                                {
                                                    title: '小計',
                                                    description: `${orderData.orderData.lineItems
                                                        .map(dd => {
                                                        return parseInt(dd.count, 10);
                                                    })
                                                        .reduce((accumulator, currentValue) => accumulator + currentValue, 0)} 件商品`,
                                                    total: `$${(orderData.orderData.total +
                                                        orderData.orderData.discount -
                                                        orderData.orderData.shipment_fee +
                                                        orderData.orderData.use_rebate).toLocaleString()}`,
                                                },
                                                {
                                                    title: '運費',
                                                    description: '',
                                                    total: `$${orderData.orderData.shipment_fee.toLocaleString()}`,
                                                },
                                                ...(() => {
                                                    if (orderData.orderData.use_rebate) {
                                                        return [
                                                            {
                                                                title: '回饋金',
                                                                description: ``,
                                                                total: `- $${orderData.orderData.use_rebate.toLocaleString()}`,
                                                            },
                                                        ];
                                                    }
                                                    else {
                                                        return [];
                                                    }
                                                })(),
                                                ...(() => {
                                                    if (orderData.orderData.use_wallet && `${orderData.orderData.use_wallet}` !== '0') {
                                                        return [
                                                            {
                                                                title: '錢包',
                                                                description: `使用錢包扣款`,
                                                                total: `- $${orderData.orderData.use_wallet.toLocaleString()}`,
                                                            },
                                                        ];
                                                    }
                                                    else {
                                                        return [];
                                                    }
                                                })(),
                                                ...orderData.orderData.voucherList.map((dd) => {
                                                    var _a;
                                                    const descHTML = html ` <div
                                      style="color: #8D8D8D; font-size: 14px; white-space: nowrap; text-overflow: ellipsis;"
                                    >
                                      ${dd.title}
                                    </div>`;
                                                    const localString = dd.discount_total.toLocaleString();
                                                    const rebackMaps = {
                                                        add_on_items: {
                                                            title: '加購優惠',
                                                            description: descHTML,
                                                            total: '－',
                                                        },
                                                        giveaway: {
                                                            title: '滿額贈送',
                                                            description: descHTML,
                                                            total: '－',
                                                        },
                                                        rebate: {
                                                            title: '回饋購物金',
                                                            description: descHTML,
                                                            total: `${localString} 點`,
                                                        },
                                                        default: {
                                                            title: '折扣',
                                                            description: descHTML,
                                                            total: `- $${localString}`,
                                                        },
                                                    };
                                                    return (_a = rebackMaps[dd.reBackType]) !== null && _a !== void 0 ? _a : rebackMaps.default;
                                                }),
                                                {
                                                    title: html `<span class="tx_700">總金額</span>`,
                                                    description: '',
                                                    total: html `<span class="tx_700"
                                      >$${orderData.orderData.total.toLocaleString()}</span
                                    >`,
                                                },
                                            ]
                                                .map(dd => {
                                                var _a;
                                                return html ` <div class="d-flex align-items-center justify-content-end">
                                      <div class="tx_normal_16 " style="text-align: end;">
                                        ${dd.title} ${(_a = dd.description) !== null && _a !== void 0 ? _a : ''}
                                      </div>
                                      <div class="tx_normal" style="width: 114px;display: flex;justify-content: end;">
                                        ${dd.total}
                                      </div>
                                    </div>`;
                                            })
                                                .join(BgWidget.mbContainer(18))}
                              </div>
                            `),
                                            orderData.orderData.lineItems.find((dd) => {
                                                return dd.deduction_log;
                                            })
                                                ? BgWidget.mainCard(html `
                                  <div
                                    style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;align-self: stretch;"
                                  >
                                    <div class="w-100 d-flex tx_700 align-items-center justify-content-between">
                                      <div class="">分倉出貨</div>
                                      <div
                                        class="${is_shipment ? `d-none` : ``}"
                                        style="display: flex;padding: 6px 18px;justify-content: center;align-items: center;gap: 8px;border-radius: 10px;border: 1px solid #DDD;background: #FFF;cursor: pointer;"
                                        onclick="${gvc.event(() => {
                                                    OrderSetting.showEditShip({
                                                        gvc: gvc,
                                                        postMD: orderData.orderData.lineItems,
                                                        productData: productData,
                                                        callback: () => {
                                                            gvc.notifyDataChange('storehouseList');
                                                        },
                                                    });
                                                })}"
                                      >
                                        編輯
                                      </div>
                                    </div>
                                    ${gvc.bindView({
                                                    bind: 'storehouseList',
                                                    view: () => {
                                                        try {
                                                            if (storeLoading) {
                                                                ApiUser.getPublicConfig('store_manager', 'manager').then((dd) => {
                                                                    if (dd.result && dd.response.value) {
                                                                        storeList = dd.response.value.list;
                                                                        storeLoading = false;
                                                                        gvc.notifyDataChange('storehouseList');
                                                                    }
                                                                    else {
                                                                    }
                                                                });
                                                                return html `讀取中...`;
                                                            }
                                                            else {
                                                                if (storeList.length == 0) {
                                                                    return html `倉儲資訊錯誤`;
                                                                }
                                                                return storeList
                                                                    .map((store) => {
                                                                    let returnHtml = ``;
                                                                    orderData.orderData.lineItems.map((item) => {
                                                                        try {
                                                                            if (item.deduction_log[store.id]) {
                                                                                returnHtml += html `
                                                        <div
                                                          class="d-flex justify-content-between"
                                                          style="font-size: 16px;font-weight: 400;"
                                                        >
                                                          <div>${item.title} - ${item.spec.join(',')}</div>
                                                          <div>${item.deduction_log[store.id]}</div>
                                                        </div>
                                                      `;
                                                                            }
                                                                        }
                                                                        catch (e) {
                                                                            return ``;
                                                                        }
                                                                    });
                                                                    if (returnHtml) {
                                                                        return html `
                                                    <div
                                                      class="d-flex flex-column w-100"
                                                      style="gap:8px;padding: 18px;border-radius: 10px;border: 1px solid #DDD;"
                                                    >
                                                      <div class="d-flex w-100 align-items-center" style="gap:8px;">
                                                        出貨地點
                                                        <div
                                                          style="font-size: 14px;color:#333;border-radius: 7px;background: rgba(221, 221, 221, 0.87);padding: 4px 6px;"
                                                        >
                                                          ${store.name}
                                                        </div>
                                                      </div>
                                                      <div
                                                        class="w-100"
                                                        style="background-color: #DDD;height: 1px;"
                                                      ></div>
                                                      <div class="d-flex flex-column">${returnHtml}</div>
                                                    </div>
                                                  `;
                                                                    }
                                                                    else {
                                                                        return ``;
                                                                    }
                                                                })
                                                                    .join('');
                                                            }
                                                        }
                                                        catch (e) {
                                                            console.error(e);
                                                            return `error-${e}`;
                                                        }
                                                    },
                                                    divCreate: {
                                                        class: `w-100 d-flex flex-column`,
                                                        style: `gap:18px;`,
                                                    },
                                                })}
                                  </div>
                                `)
                                                : ``,
                                            is_shipment
                                                ? ``
                                                : BgWidget.mainCard([
                                                    html ` <div
                                      style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;align-self: stretch;"
                                    >
                                      <div class="tx_700">付款狀態</div>
                                      <div class="ms-auto w-100">
                                        ${is_shipment || is_archive
                                                        ? (_c = [
                                                            {
                                                                title: '變更付款狀態',
                                                                value: '',
                                                            },
                                                        ]
                                                            .concat(ApiShop.getStatusArray(orderData.orderData.proof_purchase))
                                                            .find(dd => {
                                                            return dd.value === `${orderData.status}`;
                                                        })) === null || _c === void 0 ? void 0 : _c.title
                                                        : EditorElem.select({
                                                            title: ``,
                                                            gvc: gvc,
                                                            def: `${orderData.status}`,
                                                            array: [
                                                                {
                                                                    title: '變更付款狀態',
                                                                    value: '',
                                                                },
                                                            ].concat(ApiShop.getStatusArray(orderData.orderData.proof_purchase)),
                                                            callback: text => {
                                                                const dialog = new ShareDialog(gvc.glitter);
                                                                dialog.checkYesOrNot({
                                                                    text: '是否確認變更付款狀態?',
                                                                    callback: response => {
                                                                        if (response) {
                                                                            if (text && text !== `${orderData.status}`) {
                                                                                orderData.status = parseInt(text, 10);
                                                                                saveEvent();
                                                                            }
                                                                        }
                                                                        else {
                                                                            gvc.notifyDataChange(mainViewID);
                                                                        }
                                                                    },
                                                                });
                                                            },
                                                        })}
                                      </div>
                                    </div>`,
                                                    html ` <div
                                      style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;align-self: stretch;"
                                    >
                                      <div class="tx_700">付款方式</div>
                                      <div class="tx_normal">
                                        ${ShoppingOrderManager.getPaymentMethodText(orderData.orderData.method, orderData.orderData, gvc)}
                                      </div>
                                      ${ShoppingOrderManager.getProofPurchaseString(orderData.orderData, gvc)}
                                    </div>`,
                                                    (() => {
                                                        var _a, _b;
                                                        if (orderData.orderData.customer_info.payment_select === 'ecPay') {
                                                            const cash_flow = orderData.orderData.cash_flow;
                                                            return html ` <div
                                          style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;align-self: stretch;"
                                        >
                                          <div class="tx_700">金流對帳</div>
                                          <div>
                                            ${(cash_flow.TradeStatus === '1'
                                                                ? [
                                                                    `<div class="d-flex align-items-center">
金流交易結果: ${(cash_flow.credit_receipt && cash_flow.credit_receipt.status) || '已付款'}  <button class="btn btn-gray rounded-2 ms-2 ${cash_flow.PaymentType.toLowerCase().includes('credit') && cash_flow.credit_receipt && cash_flow.credit_receipt.status === '已授權' ? `` : `d-none`}" type="button" style="height:22px;" onclick="${gvc.event(() => {
                                                                        const doalog = new ShareDialog(gvc.glitter);
                                                                        doalog.checkYesOrNot({
                                                                            text: '是否確認退刷交易?',
                                                                            callback: response => {
                                                                                if (response) {
                                                                                    doalog.dataLoading({ visible: true });
                                                                                    ApiShop.ecPayBrushOrders({
                                                                                        tradNo: cash_flow.TradeNo,
                                                                                        orderID: orderData.cart_token,
                                                                                        total: cash_flow.TradeAmt,
                                                                                    }).then(res => {
                                                                                        doalog.dataLoading({ visible: false });
                                                                                        orderData.status = -2;
                                                                                        saveEvent();
                                                                                    });
                                                                                }
                                                                            },
                                                                        });
                                                                    })}">
                <span class=" tx_700" style="font-size:13px;">退刷</span>
            </button>
</div>`,
                                                                    `金流交易方式: ${(_a = [
                                                                        {
                                                                            title: 'WebATM',
                                                                            key: 'WebATM',
                                                                        },
                                                                        {
                                                                            title: 'ATM',
                                                                            key: 'ATM',
                                                                        },
                                                                        {
                                                                            title: '超商代碼',
                                                                            key: 'CVS',
                                                                        },
                                                                        {
                                                                            title: '超商條碼',
                                                                            key: 'BARCODE',
                                                                        },
                                                                        {
                                                                            title: '信用卡',
                                                                            key: 'Credit',
                                                                        },
                                                                        {
                                                                            title: '未知付款方式',
                                                                            key: '',
                                                                        },
                                                                    ].find(dd => {
                                                                        return cash_flow.PaymentType.toLowerCase().includes(dd.key.toLowerCase());
                                                                    })) === null || _a === void 0 ? void 0 : _a.title}`,
                                                                    `交易手續費: ${cash_flow.HandlingCharge}`,
                                                                    `交易總金額: ${cash_flow.TradeAmt}`,
                                                                    `交易時間: ${cash_flow.PaymentDate}`,
                                                                ]
                                                                : [`金流交易結果: 未付款`]).join(`<div class="my-2"></div>`)}
                                          </div>
                                        </div>`;
                                                        }
                                                        else if (orderData.orderData.customer_info.payment_select === 'paynow') {
                                                            const cash_flow = orderData.orderData.cash_flow;
                                                            return html `
                                          <div
                                            style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;align-self: stretch;"
                                          >
                                            <div class="tx_700">金流對帳</div>
                                            <div>
                                              ${(cash_flow.status === 'success'
                                                                ? [
                                                                    html ` <div class="d-flex align-items-center">
                                                      金流交易結果: 已付款
                                                    </div>`,
                                                                    html `金流交易方式:
                                                    ${(_b = [
                                                                        {
                                                                            title: 'ATM',
                                                                            key: 'ATM',
                                                                        },
                                                                        {
                                                                            title: '信用卡',
                                                                            key: 'CreditCard',
                                                                        },
                                                                        {
                                                                            title: '超商代碼',
                                                                            key: 'ConvenienceStore',
                                                                        },
                                                                    ].find(dd => {
                                                                        return cash_flow.payment.paymentMethod === dd.key;
                                                                    })) === null || _b === void 0 ? void 0 : _b.title}`,
                                                                    `交易總金額: ${cash_flow.amount}`,
                                                                    `交易時間: ${gvc.glitter.ut.dateFormat(new Date(cash_flow.payment.paidAt), 'yyyy-MM-dd hh:mm:ss')}`,
                                                                ]
                                                                : [`金流交易結果: 未付款`]).join(`<div class="my-2"></div>`)}
                                            </div>
                                          </div>
                                        `;
                                                        }
                                                        else {
                                                            return ``;
                                                        }
                                                    })(),
                                                ]
                                                    .filter(dd => {
                                                    return dd;
                                                })
                                                    .join(BgWidget.mbContainer(18))),
                                            is_shipment ? `` : shipment_card,
                                            BgWidget.mainCard(gvc.bindView(() => {
                                                const vm = {
                                                    edit_mode: false,
                                                    id: gvc.glitter.getUUID(),
                                                };
                                                return {
                                                    bind: vm.id,
                                                    view: () => {
                                                        return html `
                                      <div class="w-100 d-flex tx_700 align-items-center justify-content-between">
                                        <div class="">顧客備註</div>
                                        <div
                                          class=""
                                          style="display: flex;padding: 6px 18px;justify-content: center;align-items: center;gap: 8px;border-radius: 10px;border: 1px solid #DDD;background: #FFF;cursor: pointer;"
                                          onclick="${gvc.event(() => {
                                                            vm.edit_mode = !vm.edit_mode;
                                                            gvc.notifyDataChange(vm.id);
                                                        })}"
                                        >
                                          ${vm.edit_mode ? `取消編輯` : `編輯`}
                                        </div>
                                      </div>
                                      ${BgWidget.mbContainer(18)}
                                      <div style="position: relative;">
                                        ${vm.edit_mode
                                                            ? EditorElem.editeText({
                                                                gvc: gvc,
                                                                title: '',
                                                                default: orderData.orderData.user_info.note || '',
                                                                placeHolder: '',
                                                                callback: text => {
                                                                    orderData.orderData.user_info.note = text;
                                                                },
                                                            })
                                                            : orderData.orderData.user_info.note || '尚未填寫顧客備註'}
                                      </div>
                                    `;
                                                    },
                                                };
                                            })),
                                            BgWidget.mainCard(gvc.bindView(() => {
                                                const vm = {
                                                    edit_mode: false,
                                                    id: gvc.glitter.getUUID(),
                                                };
                                                return {
                                                    bind: vm.id,
                                                    view: () => {
                                                        return html `
                                      <div class="w-100 d-flex tx_700 align-items-center justify-content-between">
                                        <div class="">商家備註</div>
                                        <div
                                          class=""
                                          style="display: flex;padding: 6px 18px;justify-content: center;align-items: center;gap: 8px;border-radius: 10px;border: 1px solid #DDD;background: #FFF;cursor: pointer;"
                                          onclick="${gvc.event(() => {
                                                            vm.edit_mode = !vm.edit_mode;
                                                            gvc.notifyDataChange(vm.id);
                                                        })}"
                                        >
                                          ${vm.edit_mode ? `取消編輯` : `編輯`}
                                        </div>
                                      </div>
                                      ${BgWidget.mbContainer(18)}
                                      <div style="position: relative;">
                                        ${vm.edit_mode
                                                            ? EditorElem.editeText({
                                                                gvc: gvc,
                                                                title: '',
                                                                default: orderData.orderData.order_note || '',
                                                                placeHolder: '',
                                                                callback: text => {
                                                                    orderData.orderData.order_note = text;
                                                                },
                                                            })
                                                            : orderData.orderData.order_note || '尚未填寫商家備註'}
                                      </div>
                                    `;
                                                    },
                                                };
                                            })),
                                            gvc.bindView({
                                                bind: 'invoiceView',
                                                view: () => {
                                                    var _a;
                                                    const dialog = new ShareDialog(gvc.glitter);
                                                    if (invoiceLoading) {
                                                        dialog.dataLoading({ visible: true });
                                                        return '';
                                                    }
                                                    dialog.dataLoading({ visible: false });
                                                    if (!invoiceData) {
                                                        return '';
                                                    }
                                                    return BgWidget.mainCard(html `
                                  <div class="tx_700">發票資訊</div>
                                  ${BgWidget.mbContainer(18)}
                                  <div class="d-flex" style="margin-bottom: 12px;">
                                    <div class="col-3">開立日期</div>
                                    <div class="col-3 text-center">發票單號</div>
                                    <div class="col-3 text-center">發票金額</div>
                                    <div class="col-2 text-center">狀態</div>
                                  </div>
                                  <div class="d-flex">
                                    <div class="col-3 d-flex align-items-center ">
                                      ${invoiceData.create_date.split('T')[0]}
                                    </div>
                                    <div
                                      class="col-3 text-center d-flex align-items-center justify-content-center"
                                      style="color: #4D86DB;"
                                    >
                                      ${invoiceData.invoice_no}
                                    </div>
                                    <div class="col-3 text-center d-flex align-items-center justify-content-center">
                                      ${(_a = invoiceData.invoice_data.invoiceAmount) !== null && _a !== void 0 ? _a : orderData.orderData.total}
                                    </div>
                                    <div class="col-2 text-center d-flex align-items-center justify-content-center">
                                      ${invoiceData.status == 1
                                                        ? html ` <div class="" style="color:#10931D">已完成</div>`
                                                        : html ` <div class="" style="color:#DA1313">已作廢</div>`}
                                    </div>
                                    <div class="flex-fill d-flex justify-content-end align-items-center">
                                      <div style="margin-right: 14px;">
                                        ${BgWidget.grayButton('查閱', gvc.event(() => {
                                                        vm.invoiceData = invoiceData;
                                                        vm.type = 'viewInvoice';
                                                    }), { textStyle: `` })}
                                      </div>
                                    </div>
                                  </div>
                                `);
                                                },
                                                divCreate: {},
                                            }),
                                            BgWidget.mainCard(html `
                              <div class="tx_700">訂單記錄</div>
                              ${BgWidget.mbContainer(18)}
                              <div class="d-flex flex-column" style="gap: 8px">
                                ${((_d = orderData.orderData) === null || _d === void 0 ? void 0 : _d.editRecord)
                                                ? gvc.map(orderData.orderData.editRecord
                                                    .sort((a, b) => {
                                                    return Tool.formatDateTime(a.time, true) < Tool.formatDateTime(b.time, true)
                                                        ? 1
                                                        : -1;
                                                })
                                                    .map((r) => {
                                                    const record = this.formatRecord(gvc, vm, orderData.orderData.orderID, structuredClone(r.record));
                                                    return html `
                                            <div class="d-flex" style="gap: 42px">
                                              <div>${Tool.formatDateTime(r.time, true)}</div>
                                              <div>${record.replace(/\\n/g, '<br/>')}</div>
                                            </div>
                                          `;
                                                }))
                                                : ''}
                                <div class="d-flex" style="gap: 42px">
                                  <div>${Tool.formatDateTime(orderData.created_time, true)}</div>
                                  <div>訂單成立</div>
                                </div>
                              </div>
                            `),
                                        ]
                                            .filter(Boolean)
                                            .join(BgWidget.mbContainer(24)),
                                        ratio: 75,
                                    }, {
                                        html: html ` <div class="summary-card">
                            ${[
                                            BgWidget.mainCard(html `
                                <div class="" style="font-size: 16px;font-weight: 700;">訂單來源</div>
                                <div>
                                  ${(() => {
                                                var _a;
                                                if (!orderData.orderData.orderSource) {
                                                    return '線上';
                                                }
                                                const source = {
                                                    pos: 'POS',
                                                    combine: '合併訂單',
                                                };
                                                return (_a = source[orderData.orderData.orderSource]) !== null && _a !== void 0 ? _a : '線上';
                                            })()}
                                </div>
                              `),
                                            BgWidget.mainCard(html `
                                <div style="color: #393939;font-size: 16px;">
                                  <div class="d-flex align-items-center mb-3">
                                    <div class="tx_700">訂購人資料</div>
                                    <div class="flex-fill"></div>
                                  </div>
                                  <div class="w-100 d-flex flex-column mt-2" style="gap:12px;">
                                    ${[
                                                html ` <div class="d-flex flex-column" style="gap:8px;">
                                        <div
                                          class="d-flex align-items-center"
                                          style="font-weight: 700; gap:8px;cursor:pointer;"
                                          onclick="${gvc.event(() => {
                                                    if (userData.userID) {
                                                        child_vm.userID = userData.userID;
                                                        child_vm.type = 'user';
                                                    }
                                                })}"
                                        >
                                          ${(() => {
                                                    var _a;
                                                    const name = (_a = userData === null || userData === void 0 ? void 0 : userData.userData) === null || _a === void 0 ? void 0 : _a.name;
                                                    if (name) {
                                                        return html `<span style="color: #4D86DB;">${name}</span>`;
                                                    }
                                                    return html `<span style="color: #393939;">訪客</span>`;
                                                })()}
                                          ${(() => {
                                                    if (userDataLoading) {
                                                        return BgWidget.secondaryInsignia('讀取中');
                                                    }
                                                    if (userData.member == undefined) {
                                                        return BgWidget.secondaryInsignia('訪客');
                                                    }
                                                    if ((userData === null || userData === void 0 ? void 0 : userData.member.length) > 0) {
                                                        for (let i = 0; i < userData.member.length; i++) {
                                                            if (userData.member[i].trigger) {
                                                                return BgWidget.primaryInsignia(userData.member[i].tag_name);
                                                            }
                                                        }
                                                        return BgWidget.primaryInsignia('一般會員');
                                                    }
                                                    return BgWidget.secondaryInsignia('訪客');
                                                })()}
                                        </div>
                                        <div style="color: #393939;font-weight: 400;">
                                          ${(_g = (_f = (_e = userData === null || userData === void 0 ? void 0 : userData.userData) === null || _e === void 0 ? void 0 : _e.phone) !== null && _f !== void 0 ? _f : orderData.orderData.user_info.phone) !== null && _g !== void 0 ? _g : '此會員未填手機'}
                                        </div>
                                        <div style="color: #393939;font-weight: 400;word-break:break-all;">
                                          ${(_k = (_j = (_h = userData === null || userData === void 0 ? void 0 : userData.userData) === null || _h === void 0 ? void 0 : _h.email) !== null && _j !== void 0 ? _j : orderData.orderData.user_info.email) !== null && _k !== void 0 ? _k : ''}
                                        </div>
                                      </div>`,
                                                BgWidget.horizontalLine(),
                                                gvc.bindView({
                                                    bind: `user_info`,
                                                    view: () => {
                                                        var _a, _b;
                                                        let view = [];
                                                        if (orderData.orderData.user_info.shipment !== 'now') {
                                                            view.push(html ` <div style="font-size: 16px;font-weight: 700;color:#393939">
                                                  收件人資料
                                                </div>
                                                <div class="d-flex flex-column" style="gap:8px;">
                                                  <div style="color: #4D86DB;font-weight: 400;">
                                                    ${orderData.orderData.user_info.name}
                                                  </div>
                                                  <div style="color: #393939;font-weight: 400;">
                                                    ${orderData.orderData.user_info.phone || '電話未填'}
                                                  </div>
                                                </div>`);
                                                        }
                                                        view.push(html `
                                            <div class="tx_700">付款方式</div>
                                            <div>
                                              ${ShoppingOrderManager.getPaymentMethodText(orderData.orderData.method, orderData.orderData, gvc)}
                                            </div>
                                            <div class="tx_700">配送方式</div>
                                            <div class="tx_normal" style="line-height: 140%;">
                                              ${Language.getLanguageCustomText((_b = (_a = (orderData.orderData.shipment_selector ||
                                                            ShoppingOrderManager.supportShipmentMethod()).find(dd => {
                                                            return dd.value === orderData.orderData.user_info.shipment;
                                                        })) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : '')}
                                            </div>
                                            ${(() => {
                                                            switch (orderData.orderData.user_info.shipment) {
                                                                case 'FAMIC2C':
                                                                case 'HILIFEC2C':
                                                                case 'OKMARTC2C':
                                                                case 'UNIMARTC2C':
                                                                case 'UNIMARTFREEZE':
                                                                    return [
                                                                        html ` <div class="d-flex flex-wrap w-100">
                                                      <span class="me-2 fw-normal fs-6">門市名稱:</span>
                                                      <div
                                                        class="fw-normal fs-6"
                                                        style="white-space: normal;word-break: break-all;"
                                                      >
                                                        ${decodeURI(orderData.orderData.user_info.CVSStoreName)}
                                                      </div>
                                                    </div>`,
                                                                        html ` <div class="fw-normal fs-6">
                                                      代號: ${orderData.orderData.user_info.CVSStoreID}
                                                    </div>`,
                                                                        html ` <div
                                                      class="fw-normal fs-6 w-100"
                                                      style="white-space: normal;word-break: break-all;"
                                                    >
                                                      地址: ${orderData.orderData.user_info.CVSAddress}
                                                    </div>`,
                                                                    ].join('');
                                                                case 'global_express':
                                                                case 'black_cat_freezing':
                                                                case 'normal':
                                                                default:
                                                                    const mapView = [];
                                                                    if (orderData.orderData.user_info.address) {
                                                                        mapView.push(html ` <div class="tx_700">配送地址</div>
                                                        <div class="fw-normal fs-6" style="white-space: normal;">
                                                          ${[
                                                                            orderData.orderData.user_info.city,
                                                                            orderData.orderData.user_info.area,
                                                                            orderData.orderData.user_info.address,
                                                                        ]
                                                                            .filter(dd => {
                                                                            return dd;
                                                                        })
                                                                            .join('')}
                                                        </div>`);
                                                                    }
                                                                    const formData = (orderData.orderData.shipment_selector ||
                                                                        ShoppingOrderManager.supportShipmentMethod()).find(dd => {
                                                                        return dd.value === orderData.orderData.user_info.shipment;
                                                                    });
                                                                    if (formData.form) {
                                                                        mapView.push(formData.form
                                                                            .map((dd) => {
                                                                            return `<div class="d-flex flex-wrap w-100">
                                                                                <span class="me-2 fw-normal fs-6">${Language.getLanguageCustomText(dd.title)}:</span>
                                                                                <div class="fw-normal fs-6" style="white-space: normal;word-break: break-all;">
                                                                                    ${Language.getLanguageCustomText(orderData.orderData.user_info.custom_form_delivery[dd.key])}
                                                                                </div>
                                                                            </div>`;
                                                                        })
                                                                            .join(''));
                                                                    }
                                                                    else {
                                                                        mapView.push(``);
                                                                    }
                                                                    return mapView.join('');
                                                            }
                                                        })()}
                                            ${orderData.orderData.orderSource === 'POS'
                                                            ? `
                                                                                        <div class="tx_700">
                                                                                                結帳人員
                                                                                            </div>
                                                                                            <div class="tx_normal" style="line-height: 140%;">
                                                                                                ${orderData.orderData
                                                                .pos_info.who.config
                                                                .name === 'manager'
                                                                ? `店長`
                                                                : [
                                                                    orderData
                                                                        .orderData
                                                                        .pos_info.who
                                                                        .config.title,
                                                                    orderData
                                                                        .orderData
                                                                        .pos_info.who
                                                                        .config.name,
                                                                    orderData
                                                                        .orderData
                                                                        .pos_info.who
                                                                        .config
                                                                        .member_id,
                                                                ].join(' / ')}
                                                                                            </div>
                                                                                             <div class="tx_700">
                                                                                                結帳門市
                                                                                            </div>
                                                                                            ${gvc.bindView(() => {
                                                                return {
                                                                    bind: gvc.glitter.getUUID(),
                                                                    view: () => __awaiter(this, void 0, void 0, function* () {
                                                                        return (yield ApiUser.getPublicConfig('store_manager', 'manager')).response.value.list.find((dd) => {
                                                                            return (dd.id ===
                                                                                orderData
                                                                                    .orderData
                                                                                    .pos_info.where_store);
                                                                        }).name;
                                                                    }),
                                                                };
                                                            })}
                                                                                        `
                                                            : ``}
                                          `);
                                                        return view.join(`<div class="my-2"></div>`);
                                                    },
                                                    divCreate: {
                                                        style: 'gap:8px;',
                                                        class: 'd-flex flex-column',
                                                    },
                                                }),
                                            ].join('')}
                                  </div>
                                </div>
                              `),
                                            gvc.bindView({
                                                bind: 'distribution_info',
                                                view: () => {
                                                    var _a, _b, _c;
                                                    if (orderData.orderData.distribution_info &&
                                                        Object.keys(orderData.orderData.distribution_info).length > 0) {
                                                        let viewArray = [
                                                            {
                                                                title: '分銷代碼',
                                                                value: (_b = (_a = orderData.orderData.distribution_info) === null || _a === void 0 ? void 0 : _a.code) !== null && _b !== void 0 ? _b : '',
                                                            },
                                                            {
                                                                title: '分銷連結名稱',
                                                                value: (_c = html ` <div
                                            style="color: #006621; font-weight: 400; cursor:pointer; overflow-wrap: break-word; text-decoration: underline; "
                                            onclick="${gvc.event(() => {
                                                                    var _a;
                                                                    const dialog = new ShareDialog(glitter);
                                                                    dialog.dataLoading({
                                                                        visible: true,
                                                                    });
                                                                    ApiRecommend.getList({
                                                                        data: {},
                                                                        limit: 25,
                                                                        page: 0,
                                                                        code: (_a = orderData.orderData.distribution_info) === null || _a === void 0 ? void 0 : _a.code,
                                                                        token: window.parent.config.token,
                                                                    }).then(r => {
                                                                        vm.distributionData = r.response;
                                                                        dialog.dataLoading({
                                                                            visible: false,
                                                                        });
                                                                        vm.orderData = JSON.parse(JSON.stringify(orderData));
                                                                        vm.type = 'recommend';
                                                                    });
                                                                })}"
                                          >
                                            ${orderData.orderData.distribution_info.title}
                                          </div>`) !== null && _c !== void 0 ? _c : '',
                                                            },
                                                        ];
                                                        return BgWidget.mainCard(html `
                                      <div class="d-flex flex-column" style="gap:12px">
                                        ${viewArray
                                                            .map(data => {
                                                            var _a;
                                                            return html `
                                              <div
                                                style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;align-self: stretch;color:#393939;"
                                              >
                                                <div class="tx_700">${data.title}</div>
                                                <div
                                                  style="color:#393939;font-size: 16px;font-weight: 400;line-height: 140%;"
                                                >
                                                  ${(_a = data.value) !== null && _a !== void 0 ? _a : ''}
                                                </div>
                                              </div>
                                            `;
                                                        })
                                                            .join('')}
                                      </div>
                                    `);
                                                    }
                                                    else {
                                                        return ``;
                                                    }
                                                },
                                                divCreate: {},
                                            }),
                                        ]
                                            .filter(dd => {
                                            return dd;
                                        })
                                            .join(BgWidget.mbContainer(24))}
                          </div>`,
                                        ratio: 25,
                                    })}
                      ${BgWidget.mbContainer(240)}
                      <div class="update-bar-container">
                        <div class="">
                          ${gvc.bindView(() => {
                                        const id = gvc.glitter.getUUID();
                                        const vc = {
                                            data: {},
                                        };
                                        return {
                                            bind: id,
                                            view: () => {
                                                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                                    const data = yield saasConfig.api.getPrivateConfig(saasConfig.config.appName, `invoice_setting`);
                                                    if (data.response.result[0]) {
                                                        vc.data = data.response.result[0].value;
                                                    }
                                                    resolve(gvc.bindView(() => {
                                                        var _a;
                                                        vc.data.fincial = (_a = vc.data.fincial) !== null && _a !== void 0 ? _a : 'ezpay';
                                                        const id = gvc.glitter.getUUID();
                                                        return {
                                                            bind: id,
                                                            view: () => {
                                                                if (vc.data.fincial == 'ezpay' || vc.data.fincial == 'ecpay') {
                                                                    return BgWidget.grayButton('開立發票', gvc.event(() => {
                                                                        vm.tempOrder = orderData.cart_token;
                                                                        vm.type = 'createInvoice';
                                                                    }));
                                                                }
                                                                return ``;
                                                            },
                                                            divCreate: {
                                                                style: ``,
                                                                class: ``,
                                                            },
                                                        };
                                                    }));
                                                }));
                                            },
                                            divCreate: {
                                                class: 'd-flex flex-column flex-column-reverse flex-md-row px-0',
                                                style: 'gap:10px;',
                                            },
                                        };
                                    })}
                        </div>
                        ${orderData.orderData.archived === 'true'
                                        ? BgWidget.redButton('刪除', gvc.event(() => {
                                            const dialog = new ShareDialog(gvc.glitter);
                                            function deleteOrder() {
                                                orderData.orderData.orderStatus = '-99';
                                                dialog.dataLoading({
                                                    text: '刪除中',
                                                    visible: true,
                                                });
                                                ApiShop.putOrder({
                                                    id: `${orderData.id}`,
                                                    order_data: orderData.orderData,
                                                    status: orderData.status,
                                                }).then(response => {
                                                    dialog.dataLoading({
                                                        text: '刪除中',
                                                        visible: false,
                                                    });
                                                    if (response.result) {
                                                        dialog.infoMessage({
                                                            text: '刪除成功',
                                                        });
                                                        vm.type = 'list';
                                                    }
                                                    else {
                                                        dialog.errorMessage({ text: '刪除異常' });
                                                    }
                                                });
                                            }
                                            dialog.checkYesOrNot({
                                                callback: response => {
                                                    if (response) {
                                                        deleteOrder();
                                                    }
                                                },
                                                text: '是否要刪除訂單',
                                            });
                                        }))
                                        : ``}
                        ${BgWidget.cancel(gvc.event(() => {
                                        vm.type = 'list';
                                    }))}
                        ${BgWidget.save(gvc.event(() => {
                                        saveEvent();
                                    }))}
                      </div>`);
                                }
                                catch (e) {
                                    console.error(e);
                                    return BgWidget.maintenance();
                                }
                            },
                            divCreate: {},
                            onCreate: () => { },
                            onDestroy: () => { },
                        });
                    }
                    catch (e) {
                        console.error(e);
                        return `error`;
                    }
                }),
                divCreate: {
                    class: `w-100`,
                },
            };
        });
    }
    static createOrder(gvc, vm) {
        const glitter = gvc.glitter;
        class OrderDetail {
            constructor(subtotal, shipment) {
                this.subtotal = subtotal;
                this.discount = 0;
                this.rebate = 0;
                this.shipment = shipment;
                this.cart_token = '';
                this.lineItems = [];
                this.voucher = newVoucher;
                this.tag = 'manual';
                this.user_info = {
                    CVSAddress: '',
                    CVSStoreID: '',
                    CVSStoreName: '',
                    CVSTelephone: '',
                    MerchantTradeNo: '',
                    address: '',
                    email: '',
                    name: '',
                    note: '',
                    phone: '',
                    shipment: 'normal',
                };
                this.customer_info = {
                    name: '',
                    phone: '',
                    email: '',
                };
                this.pay_status = 1;
                this.total = 0;
            }
        }
        let newVoucher;
        let shipmentFree = false;
        let newOrder = {
            id: glitter.getUUID(),
            productArray: [],
            productCheck: [],
            productTemp: [],
            orderProductArray: [],
            orderString: '',
            query: '',
        };
        newVoucher = {
            id: 0,
            discount_total: 0,
            end_ISO_Date: '',
            for: 'all',
            forKey: [],
            method: 'fixed',
            overlay: false,
            reBackType: 'rebate',
            rebate_total: 0,
            rule: 'min_price',
            ruleValue: 0,
            startDate: '',
            startTime: '',
            start_ISO_Date: '',
            status: 1,
            target: '',
            targetList: [],
            title: '',
            trigger: 'auto',
            type: 'voucher',
            value: 0,
        };
        let orderDetail = new OrderDetail(0, 0);
        let showDiscountEdit = true;
        let showArray = [
            {
                value: 'discount',
                text: '折扣活動',
                method: 'percent',
            },
            {
                value: 'rebate',
                text: '購物金活動',
                method: 'percent',
            },
            {
                value: 'shipment_free',
                text: '免運費活動',
            },
        ];
        let tempData = {
            title: '',
            reBackType: 'discount',
            method: 'percent',
            value: '',
            discount: 0,
        };
        const url = window.parent.location.href;
        const urlParams = new URLSearchParams(new URL(url).search);
        let CVSCheck = false;
        [
            'MerchantID',
            'MerchantTradeNo',
            'LogisticsSubType',
            'CVSStoreID',
            'CVSAddress',
            'CVSTelephone',
            'CVSOutSide',
            'CVSStoreName',
        ].forEach(key => {
            var _a, _b;
            const value = urlParams.get(key);
            if (value) {
                if (!CVSCheck) {
                    const localData1 = JSON.parse((_a = localStorage.getItem('orderDetail')) !== null && _a !== void 0 ? _a : '');
                    newOrder = JSON.parse((_b = localStorage.getItem('newOrder')) !== null && _b !== void 0 ? _b : '');
                    orderDetail = localData1;
                }
                CVSCheck = true;
                orderDetail.user_info[key] = decodeURIComponent(value);
            }
            urlParams.delete(key);
        });
        if (CVSCheck) {
            const newUrl = window.parent.location.origin +
                window.parent.location.pathname +
                (urlParams.toString() ? '?' + urlParams.toString() : '');
            window.parent.window.history.replaceState(null, '', newUrl);
        }
        let customerData = {
            sameCustomer: false,
            pageType: 'none',
            type: 'auto',
            customer: [],
            info: {},
            receiver: {},
        };
        let tempUserData = {
            auto: {},
            manual: {},
        };
        let orderDetailRefresh = false;
        function selectCVS(cvsCode) {
            ApiDelivery.storeMaps({
                returnURL: window.parent.location.href,
                logistics: cvsCode,
            }).then((res) => __awaiter(this, void 0, void 0, function* () {
                let newDiv = document.createElement('div');
                localStorage.setItem('orderDetail', JSON.stringify(orderDetail));
                localStorage.setItem('newOrder', JSON.stringify(newOrder));
                newDiv.innerHTML = res.response.form;
                window.parent.document.body.appendChild(newDiv);
                window.parent.document.querySelector('#submit').click();
            }));
        }
        function showOrderDetail() {
            function showDiscount() {
                shipmentFree = false;
                let leftHTML = newVoucher.title
                    ? html `
              <div>折扣</div>
              <div style="font-size: 14px;color:#8D8D8D;font-weight: 400;">${newVoucher.title}</div>
            `
                    : `折扣`;
                let rightTitle = '新增折扣';
                shipmentFree = newVoucher.reBackType == 'shipment_free';
                if (newVoucher.value) {
                    if (newVoucher.reBackType == 'discount') {
                        if (newVoucher.method == 'percent') {
                            newVoucher.discount_total = Math.round(orderDetail.subtotal * newVoucher.value * 0.01);
                        }
                        else {
                            newVoucher.discount_total = Math.min(orderDetail.subtotal, newVoucher.value);
                        }
                        orderDetail.rebate = 0;
                        newVoucher.rebate_total = 0;
                        orderDetail.discount = newVoucher.discount_total;
                        rightTitle = `-${orderDetail.discount.toLocaleString()}`;
                    }
                    if (newVoucher.reBackType == 'rebate') {
                        rightTitle = `獲得購物金`;
                        if (newVoucher.method == 'fixed') {
                            orderDetail.rebate = Math.min(newVoucher.value, orderDetail.subtotal);
                            newVoucher.rebate_total = Number(orderDetail.rebate);
                            orderDetail.rebate = newVoucher.value;
                        }
                        else {
                            newVoucher.rebate_total = Math.round(orderDetail.subtotal * newVoucher.value * 0.01);
                        }
                        newVoucher.discount_total = 0;
                        orderDetail.discount = 0;
                        orderDetail.rebate = newVoucher.rebate_total;
                    }
                }
                let rightHTML = html `
          <div style="color: #4D86DB;position: relative;">
            <div
              class=" "
              style="cursor: pointer;width:158px;text-align: right"
              onclick="${gvc.event(() => {
                    showDiscountEdit = !showDiscountEdit;
                    gvc.notifyDataChange('orderDetail');
                })}"
            >
              ${rightTitle}
            </div>
            <!-- 新增折扣點擊後展開位子 -->
            ${showDiscountEdit
                    ? ``
                    : gvc.bindView({
                        bind: `editDiscount`,
                        view: () => {
                            var _a;
                            let discountHTML = ``;
                            let checkBox = html ` <div
                      style="margin-right:6px;display: flex;width: 16px;height: 16px;justify-content: center;align-items: center;border-radius: 20px;border: 4px solid #393939"
                    ></div>`;
                            let uncheckBox = html ` <div
                      style="margin-right:6px;width: 16px;height: 16px;border-radius: 20px;border: 1px solid #DDD;"
                    ></div>`;
                            showArray.map((rowData, index) => {
                                if (rowData.select) {
                                    function drawVoucherDetail(rowData) {
                                        switch (rowData.value) {
                                            case 'rebate':
                                            case 'discount': {
                                                return html ` <div class="w-100 d-flex" style="padding-left: 8px;margin-top: 8px;">
                                <div style="height: 100%;width:1px;background-color: #E5E5E5;margin-right: 14px;"></div>
                                <div
                                  style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;flex: 1 0 0;"
                                >
                                  <div
                                    style="display: flex;flex-direction: column;align-items: flex-start;gap: 8px;align-self: stretch;"
                                  >
                                    <div
                                      style="display: flex;align-items: center;gap: 6px;"
                                      onclick="${gvc.event(() => {
                                                    rowData.method = 'percent';
                                                    tempData.method = 'percent';
                                                    gvc.notifyDataChange('editDiscount');
                                                })}"
                                    >
                                      ${rowData.method == 'percent' ? checkBox : uncheckBox} 百分比
                                    </div>
                                    <div
                                      style="${rowData.method == 'percent'
                                                    ? 'display: flex'
                                                    : 'display: none'};padding-left: 8px;align-items: center;gap: 14px;align-self: stretch;position:relative;"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="2"
                                        height="40"
                                        viewBox="0 0 2 40"
                                        fill="none"
                                      >
                                        <path d="M1 0V40" stroke="#E5E5E5" />
                                      </svg>
                                      <input
                                        class="w-100"
                                        style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px;"
                                        type="number"
                                        max="100"
                                        min="1"
                                        value="${rowData.discount}"
                                        onchange="${gvc.event(e => {
                                                    e.value = Math.min(e.value, 100);
                                                    rowData.discount = e.value;
                                                    tempData.discount = e.value;
                                                })}"
                                      />
                                      <div
                                        class="h-100 d-flex align-items-center"
                                        style="color: #8D8D8D;font-size: 16px;font-style: normal;font-weight: 400;position: absolute;top:0;right:18px;"
                                      >
                                        %
                                      </div>
                                    </div>
                                  </div>
                                  <div style="display: flex;gap: 6px;flex-direction: column;width: 100%;">
                                    <div
                                      style="display: flex;align-items: center;gap: 6px;"
                                      onclick="${gvc.event(() => {
                                                    rowData.method = 'fixed';
                                                    tempData.method = 'fixed';
                                                    gvc.notifyDataChange('editDiscount');
                                                })}"
                                    >
                                      ${rowData.method == 'fixed' ? checkBox : uncheckBox} 固定金額
                                    </div>
                                    <div
                                      style="${rowData.method == 'fixed'
                                                    ? 'display: flex'
                                                    : 'display: none'};padding-left: 8px;align-items: center;gap: 14px;align-self: stretch;position:relative;"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="2"
                                        height="40"
                                        viewBox="0 0 2 40"
                                        fill="none"
                                      >
                                        <path d="M1 0V40" stroke="#E5E5E5" />
                                      </svg>
                                      <input
                                        class="w-100"
                                        style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px;"
                                        type="number"
                                        value="${rowData.discount}"
                                        min="1"
                                        onchange="${gvc.event(e => {
                                                    rowData.discount = e.value;
                                                    tempData.discount = e.value;
                                                })}"
                                      />
                                      <div
                                        class="h-100 d-flex align-items-center"
                                        style="color: #8D8D8D;font-size: 16px;font-style: normal;font-weight: 400;position: absolute;top:0;right:18px;"
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              </div>`;
                                            }
                                            default:
                                                return ``;
                                        }
                                    }
                                    tempData.reBackType = rowData.value;
                                    discountHTML += html `
                          <div class="w-100 d-flex align-items-center flex-wrap" style="color:#393939">
                            ${checkBox}
                            <div>${rowData.text}</div>
                            ${drawVoucherDetail(rowData)}
                          </div>
                        `;
                                }
                                else {
                                    discountHTML += html `
                          <div
                            class="w-100 d-flex align-items-center"
                            style="color:#393939;cursor: pointer;"
                            onclick="${gvc.event(() => {
                                        showArray = [
                                            {
                                                value: 'discount',
                                                text: '折扣活動',
                                                method: 'percent',
                                            },
                                            {
                                                value: 'rebate',
                                                text: '購物金活動',
                                                method: 'percent',
                                            },
                                            {
                                                value: 'shipment_free',
                                                text: '免運費活動',
                                            },
                                        ];
                                        showArray[index].select = true;
                                        gvc.notifyDataChange('editDiscount');
                                    })}"
                          >
                            ${uncheckBox}
                            <div>${rowData.text}</div>
                          </div>
                        `;
                                }
                            });
                            return html `
                      <div class="d-flex flex-column " style="font-weight: 700;">
                        折扣名稱
                        <input
                          class="w-100"
                          style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px;margin-top:12px;"
                          value="${(_a = tempData.title) !== null && _a !== void 0 ? _a : ''}"
                          onchange="${gvc.event(e => {
                                tempData.title = e.value;
                            })}"
                        />
                      </div>
                      <div class="d-flex flex-column" style="font-weight: 700;gap:8px;">折扣方式 ${discountHTML}</div>
                      <div class="d-flex w-100 justify-content-end" style="gap:14px;">
                        ${BgWidget.cancel(gvc.event(() => {
                                showDiscountEdit = !showDiscountEdit;
                                gvc.notifyDataChange('orderDetail');
                            }))}
                        ${BgWidget.save(gvc.event(() => {
                                showDiscountEdit = !showDiscountEdit;
                                newVoucher.reBackType = tempData.reBackType;
                                newVoucher.method = tempData.method;
                                newVoucher.value = tempData.discount;
                                newVoucher.title = tempData.title;
                                gvc.notifyDataChange('orderDetail');
                            }), '確定')}
                      </div>
                    `;
                        },
                        divCreate: {
                            style: `display: flex;color:#393939;text-align: left;width: 348px;padding: 24px;flex-direction: column;gap: 18px;border-radius: 10px;background: #FFF;box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.15);position:absolute;right:0;top:33px;gap:18px;z-index:3;`,
                        },
                    })}
          </div>
        `;
                return {
                    left: leftHTML,
                    right: rightHTML,
                };
            }
            return gvc.bindView({
                bind: 'orderDetail',
                view: () => {
                    var _a;
                    orderDetail.subtotal = 0;
                    orderDetail.lineItems = [];
                    newOrder.productCheck.map((data, index) => {
                        var _a, _b, _c, _d, _e;
                        orderDetail.lineItems.push({
                            id: data.id,
                            spec: data.content.variants[parseInt((_a = data.selectIndex) !== null && _a !== void 0 ? _a : 0)].spec,
                            count: (_c = data.content.variants[parseInt((_b = data.selectIndex) !== null && _b !== void 0 ? _b : 0)].qty) !== null && _c !== void 0 ? _c : 1,
                            sale_price: data.content.variants[parseInt((_d = data.selectIndex) !== null && _d !== void 0 ? _d : 0)].sale_price,
                            sku: data.content.variants[parseInt((_e = data.selectIndex) !== null && _e !== void 0 ? _e : 0)].sku,
                        });
                        orderDetail.subtotal += orderDetail.lineItems[index].count * orderDetail.lineItems[index].sale_price;
                    });
                    if (orderDetailRefresh) {
                        const dialog = new ShareDialog(gvc.glitter);
                        dialog.dataLoading({
                            text: '計算中',
                            visible: true,
                        });
                        ApiShop.getManualCheckout({
                            line_items: orderDetail.lineItems,
                            user_info: orderDetail.user_info,
                        }).then(r => {
                            dialog.dataLoading({
                                visible: false,
                            });
                            if (r.result) {
                                orderDetailRefresh = false;
                                orderDetail.shipment = r.response.data.shipment_fee;
                                gvc.notifyDataChange('orderDetail');
                            }
                        });
                    }
                    if (newVoucher.reBackType == 'shipment_free') {
                        orderDetail.shipment = 0;
                    }
                    orderDetail.total = orderDetail.subtotal + orderDetail.shipment - orderDetail.discount;
                    let returnHTML = ``;
                    let showArray = [
                        {
                            left: '小計總額',
                            right: orderDetail.subtotal,
                        },
                        {
                            left: '運費',
                            right: orderDetail.shipment,
                        },
                        showDiscount(),
                        {
                            left: '總金額',
                            right: (_a = orderDetail.total) !== null && _a !== void 0 ? _a : orderDetail.subtotal + orderDetail.shipment - orderDetail.discount,
                        },
                    ];
                    showArray.map(rowData => {
                        returnHTML += html `
              <div class="w-100 d-flex align-items-center justify-content-end" style="min-height: 21px;">
                <div style="text-align: right;">${rowData.left}</div>
                <div style="width:158px;text-align: right">
                  ${rowData.left === '折扣' ? rowData.right : `$${rowData.right.toLocaleString()}`}
                </div>
              </div>
            `;
                    });
                    return returnHTML;
                },
                divCreate: { class: `d-flex flex-column w-100`, style: `gap:12px;` },
            });
        }
        function checkOrderEmpty(passData) {
            const dialog = new ShareDialog(glitter);
            if (passData.lineItems.length < 1) {
                dialog.infoMessage({ text: '請添加商品' });
                return false;
            }
            if (!passData.customer_info.name || !passData.customer_info.email) {
                dialog.infoMessage({ text: '「顧客資料」尚未填寫完畢' });
                return false;
            }
            if (!CheckInput.isEmail(passData.customer_info.email)) {
                dialog.infoMessage({ text: '「顧客資料」信箱格式錯誤' });
                return false;
            }
            if (!passData.user_info.name || !passData.user_info.email) {
                dialog.infoMessage({ text: '「收件人資料」尚未填寫完畢' });
                return false;
            }
            if (CheckInput.isEmpty(passData.user_info.phone) && !CheckInput.isTaiwanPhone(passData.user_info.phone)) {
                dialog.infoMessage({ text: BgWidget.taiwanPhoneAlert('「收件人資料」電話格式有誤或未填') });
                return false;
            }
            if (!CheckInput.isEmail(passData.user_info.email)) {
                dialog.infoMessage({ text: '「收件人資料」信箱格式錯誤' });
                return false;
            }
            if (passData.user_info.shipment == 'normal' && !passData.user_info.address) {
                dialog.infoMessage({ text: '「收件人資料」請填寫宅配地址' });
                return false;
            }
            if (passData.user_info.shipment != 'normal' && !passData.user_info.CVSAddress) {
                dialog.infoMessage({ text: '「收件人資料」請選擇取貨門市' });
                return false;
            }
            return true;
        }
        return BgWidget.container(html `
      <!-- 標頭 --- 新增訂單標題和返回 -->
      <div class="title-container mb-4">
        ${BgWidget.goBack(gvc.event(() => {
            vm.type = 'list';
        }))}
        ${BgWidget.title('新增訂單')}
      </div>
      <!-- 訂單內容 --- 商品資訊 -->
      <div
        style="color: #393939;width: 100%;display: flex;padding: 20px;flex-direction: column;align-items: flex-start;gap: 18px;align-self: stretch;border-radius: 10px;background: #FFF;box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.08);"
      >
        <div class="tx_700">訂單內容</div>
        <div style="width: 100%;display: flex;align-items: center;padding-right: 20px;">
          <div class="flex-fill d-flex align-items-center col-5 tx_700">商品</div>
          <div class="col-3 pe-lg-3" style="display: flex;align-items: flex-start;font-size: 16px;font-weight: 700;">
            單價
          </div>
          <div class="col-2 tx_700">數量</div>
          <div class="tx_700" style="width: 50px; text-align: right;">小計</div>
        </div>
        ${gvc.bindView({
            bind: 'listProduct',
            view: () => {
                let returnHTML = '';
                gvc.notifyDataChange('orderDetail');
                if (newOrder.productCheck.length) {
                    newOrder.productCheck.map((product, index) => {
                        var _a;
                        let selectVariant = product.content.variants[parseInt((_a = product.selectIndex) !== null && _a !== void 0 ? _a : 0)];
                        let productIMG = typeof selectVariant.preview_image == 'string'
                            ? selectVariant.preview_image
                            : selectVariant.preview_image[0];
                        productIMG = productIMG
                            ? productIMG
                            : product.content.preview_image[0]
                                ? product.content.preview_image[0]
                                : BgWidget.noImageURL;
                        selectVariant.qty = selectVariant.qty || 1;
                        returnHTML += html `
                  <div style="width: 100%;display: flex;align-items: center;position: relative;padding-right: 20px;">
                    <div
                      class="flex-fill d-flex align-items-center col-5"
                      style="font-size: 16px;font-weight: 700;gap: 12px;"
                    >
                      <div
                        style="width: 54px;height: 54px; background: url('${productIMG}') lightgray 50% / cover no-repeat;"
                      ></div>
                      <div
                        style="display: flex;flex-direction: column;align-items: flex-start;gap: 4px;width: calc(100% - 54px);padding-right: 15px;"
                      >
                        <div style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;width: 100%;">
                          ${product.content.title}
                        </div>
                        <div class="d-flex" style="gap:8px;font-weight: 400;">
                          ${(() => {
                            if (selectVariant.spec.length > 0) {
                                let tempHTML = ``;
                                selectVariant.spec.map((spec) => {
                                    tempHTML += html ` <div
                                  style="display: flex;height: 22px;padding: 4px 6px;justify-content: center;align-items: center;gap: 10px;border-radius: 7px;background: #EAEAEA;"
                                >
                                  ${spec}
                                </div>`;
                                });
                                return tempHTML;
                            }
                            else {
                                return html `
                                <div
                                  style="display: flex;height: 22px;padding: 4px 6px;justify-content: center;align-items: center;gap: 10px;border-radius: 7px;background: #EAEAEA;"
                                >
                                  單一規格
                                </div>
                              `;
                            }
                        })()}
                        </div>
                        <div style="color: #8D8D8D;font-size: 14px;font-weight: 400;">
                          存貨單位 (SKU): ${selectVariant.sku.length ? selectVariant.sku : 'sku未指定'}
                        </div>
                      </div>
                    </div>
                    <div
                      class="col-3"
                      style="display: flex;padding-right: 40px;align-items: flex-start;font-size: 16px;font-weight: 400;"
                    >
                      $${(() => {
                            const price = parseInt(`${selectVariant.sale_price}`, 10);
                            return isNaN(price) ? 0 : price.toLocaleString();
                        })()}
                    </div>
                    <div class="tx_700" style="width:15%">
                      <input
                        type="number"
                        value="${selectVariant.qty}"
                        style="width: 80px;transform: translateX(-16px);text-align: center;display: flex;padding: 9px 18px;align-items: center;gap: 32px;border-radius: 10px;border: 1px solid #DDD;"
                        min="0"
                        onchange="${gvc.event(e => {
                            if (e.value < 1) {
                                const dialog = new ShareDialog(glitter);
                                dialog.warningMessage({
                                    text: '更改數量為 0 將會刪除該商品。<br />確定要刪除此商品嗎？',
                                    callback: response => {
                                        if (response) {
                                            newOrder.productCheck.splice(index, 1);
                                            orderDetailRefresh = true;
                                            gvc.notifyDataChange(['listProduct', 'orderDetail']);
                                        }
                                        else {
                                            e.value = 1;
                                        }
                                    },
                                });
                            }
                            else {
                                selectVariant.qty = parseInt(e.value, 10);
                                orderDetailRefresh = true;
                                gvc.notifyDataChange(['listProduct', 'orderDetail']);
                            }
                        })}"
                      />
                    </div>
                    <div style="min-width: 6%;font-size: 16px;font-weight: 400;width: 50px;text-align: right;">
                      <span>$${(selectVariant.sale_price * selectVariant.qty).toLocaleString()}</span>
                      <div
                        class="d-flex align-items-center cursor_pointer"
                        style="position: absolute;right:0;top:50%;transform: translateY(-50%)"
                        onclick="${gvc.event(() => {
                            newOrder.productCheck.splice(index, 1);
                            gvc.notifyDataChange('listProduct');
                        })}"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="10" viewBox="0 0 11 10" fill="none">
                          <path
                            d="M1.51367 9.24219L9.99895 0.756906"
                            stroke="#DDDDDD"
                            stroke-width="1.3"
                            stroke-linecap="round"
                          />
                          <path
                            d="M9.99805 9.24219L1.51276 0.756907"
                            stroke="#DDDDDD"
                            stroke-width="1.3"
                            stroke-linecap="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                `;
                    });
                }
                return returnHTML;
            },
            divCreate: {
                style: `display: flex;flex-direction: column;align-items: flex-start;gap: 18px;align-self: stretch;`,
                class: ``,
            },
        })}
        ${gvc.bindView({
            bind: 'addProduct',
            view: () => {
                return html `
              <div
                class="w-100 d-flex justify-content-center align-items-center"
                style="color: #36B;"
                onclick="${gvc.event(() => {
                    let confirm = true;
                    window.parent.glitter.innerDialog((gvc) => {
                        newOrder.query = '';
                        newOrder.search = '';
                        newOrder.productArray = [];
                        return gvc.bindView({
                            bind: 'addDialog',
                            view: () => {
                                var _a;
                                let width = window.innerWidth > 1000 ? 690 : 350;
                                let searchLoading = false;
                                return html ` <div
                            style="display: flex;width: ${width}px;flex-direction: column;align-items: flex-start;gap: 18px;border-radius: 10px;background: #FFF;"
                          >
                            <div
                              class="w-100"
                              style="display: flex;height: 46px;padding: 20px 20px 12px;align-items: center;align-self: stretch;color: #393939;font-size: 16px;font-weight: 700;"
                            >
                              搜尋商品
                            </div>
                            <div
                              class="w-100"
                              style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;"
                            >
                              <div
                                class="w-100"
                                style="display: flex;padding: 0px 24px;flex-direction: column;align-items: center;gap: 18px;"
                              >
                                <div
                                  style="display: flex;justify-content: center;align-items: flex-start;gap: 12px;align-self: stretch;"
                                >
                                  <div class="w-100 position-relative">
                                    <i
                                      class="fa-regular fa-magnifying-glass"
                                      style="font-size: 18px; color: #A0A0A0; position: absolute; left: 18px; top: 50%; transform: translateY(-50%);"
                                      aria-hidden="true"
                                    ></i>
                                    <input
                                      class="form-control h-100"
                                      style="border-radius: 10px; border: 1px solid #DDD; padding-left: 50px;"
                                      placeholder="輸入商品名稱或商品貨號"
                                      oninput="${gvc.event(e => {
                                    searchLoading = false;
                                    newOrder.query = e.value;
                                    newOrder.productArray = [];
                                    gvc.notifyDataChange('productArray');
                                })}"
                                      value="${(_a = newOrder.query) !== null && _a !== void 0 ? _a : ''}"
                                    />
                                  </div>

                                  ${BgWidget.updownFilter({
                                    gvc,
                                    callback: (value) => {
                                        searchLoading = false;
                                        newOrder.orderString = value;
                                        newOrder.productArray = [];
                                        gvc.notifyDataChange('productArray');
                                    },
                                    default: newOrder.orderString || 'default',
                                    options: FilterOptions.productOrderBy,
                                })}
                                </div>
                                <div
                                  style="height:350px;display: flex;justify-content: center;align-items: flex-start;padding-right: 24px;align-self: stretch;overflow-y: scroll;"
                                >
                                  ${gvc.bindView({
                                    bind: 'productArray',
                                    view: () => {
                                        if (!searchLoading) {
                                            ApiShop.getProduct({
                                                page: 0,
                                                limit: 20,
                                                search: newOrder.query,
                                                orderBy: newOrder.orderString,
                                            }).then(data => {
                                                searchLoading = true;
                                                newOrder.productArray = data.response.data;
                                                gvc.notifyDataChange('productArray');
                                            });
                                            return BgWidget.spinner();
                                        }
                                        if (newOrder.productArray.length == 0) {
                                            return html ` <div
                                          class="w-100 h-100 d-flex align-items-center justify-content-center"
                                          style="color:#8D8D8D;"
                                        >
                                          查無此商品
                                        </div>`;
                                        }
                                        return newOrder.productArray
                                            .map((product, productIndex) => {
                                            return gvc.bindView({
                                                bind: `product${productIndex}`,
                                                view: () => {
                                                    return html `
                                                ${(() => {
                                                        if (product.select) {
                                                            return html ` <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      width="16"
                                                      height="16"
                                                      viewBox="0 0 16 16"
                                                      fill="none"
                                                      onclick="${gvc.event(() => {
                                                                product.select = false;
                                                                gvc.notifyDataChange(`product${productIndex}`);
                                                            })}"
                                                    >
                                                      <rect width="16" height="16" rx="3" fill="#393939" />
                                                      <path
                                                        d="M4.5 8.5L7 11L11.5 5"
                                                        stroke="white"
                                                        stroke-width="2"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                      />
                                                    </svg>`;
                                                        }
                                                        else {
                                                            return html `
                                                      <div
                                                        style="display: flex;align-items: center;justify-content: center;height: 60px;width: 16px;cursor: pointer;"
                                                        onclick="${gvc.event(() => {
                                                                product.select = true;
                                                                if (product.content.variants.length > 1) {
                                                                    product.selectIndex = window.parent.document.querySelector('.varitantSelect').value;
                                                                }
                                                                gvc.notifyDataChange(`product${productIndex}`);
                                                            })}"
                                                      >
                                                        <div
                                                          style="width: 16px;height: 16px;border-radius: 3px;border: 1px solid #DDD;cursor: pointer;"
                                                        ></div>
                                                      </div>
                                                    `;
                                                        }
                                                    })()}
                                                <div
                                                  style="width: 50px;height: 50px;border-radius: 5px;background: url('${product
                                                        .content.preview_image[0]}') lightgray 50% / cover no-repeat;"
                                                ></div>
                                                <div class="flex-fill d-flex flex-column">
                                                  <div
                                                    style="color:#393939;font-size: 14px;font-weight: 400;margin-bottom: 4px;"
                                                  >
                                                    ${product.content.title}
                                                  </div>
                                                  ${(() => {
                                                        if (product.content.variants.length > 1) {
                                                            return html `
                                                        <select
                                                          class="w-100 d-flex align-items-center form-select varitantSelect"
                                                          style="border-radius: 10px;border: 1px solid #DDD;padding: 6px 18px;"
                                                          onchange="${gvc.event(e => {
                                                                product.selectIndex = e.value;
                                                            })}"
                                                        >
                                                          ${(() => {
                                                                let optionHTML = ``;
                                                                product.content.variants.map((variant, index) => {
                                                                    optionHTML += html `
                                                                  <option
                                                                    value="${index}"
                                                                    ${(() => {
                                                                        if (product.selectIndex == index)
                                                                            return `selected`;
                                                                        else
                                                                            return ``;
                                                                    })()}
                                                                  >
                                                                    ${variant.spec.join(', ')}
                                                                  </option>
                                                                `;
                                                                });
                                                                return optionHTML;
                                                            })()}
                                                        </select>
                                                      `;
                                                        }
                                                        else {
                                                            return `<div class="d-flex align-items-center" style="height: 34px;color: #8D8D8D;font-size: 14px;font-weight: 400;">單一規格</div>`;
                                                        }
                                                    })()}
                                                </div>
                                              `;
                                                },
                                                divCreate: {
                                                    style: `display: flex;padding: 0px 12px;align-items: center;gap: 18px;align-self: stretch;`,
                                                },
                                            });
                                        })
                                            .join('');
                                    },
                                    divCreate: {
                                        class: `d-flex flex-column h-100`,
                                        style: `gap: 18px;width:100%;`,
                                    },
                                })}
                                </div>
                              </div>
                              <div
                                class="w-100"
                                style="display: flex;padding: 12px 20px;align-items: center;justify-content: end;gap: 10px;"
                              >
                                ${BgWidget.cancel(gvc.event(() => {
                                    confirm = false;
                                    gvc.closeDialog();
                                }))}
                                ${BgWidget.save(gvc.event(() => {
                                    confirm = true;
                                    newOrder.productTemp = [];
                                    newOrder.productArray.map((product) => {
                                        if (product.select) {
                                            newOrder.productTemp.push(product);
                                        }
                                    });
                                    gvc.closeDialog();
                                }))}
                              </div>
                            </div>
                          </div>`;
                            },
                            divCreate: {},
                        });
                    }, 'addProduct', {
                        dismiss: () => {
                            if (confirm) {
                                orderDetailRefresh = true;
                                if (newOrder.productCheck.length > 0) {
                                    const updateProductCheck = (tempData) => {
                                        var _a;
                                        const productData = newOrder.productCheck.find((p) => {
                                            return p.id === tempData.id && p.selectIndex === tempData.selectIndex;
                                        });
                                        if (productData) {
                                            const index = parseInt((_a = productData.selectIndex) !== null && _a !== void 0 ? _a : '0', 10);
                                            productData.content.variants[index].qty++;
                                            tempData.add = true;
                                        }
                                        else {
                                            newOrder.productCheck.push(tempData);
                                        }
                                    };
                                    newOrder.productTemp.forEach(updateProductCheck);
                                }
                                else {
                                    newOrder.productCheck = newOrder.productTemp;
                                }
                                gvc.notifyDataChange(['listProduct', 'addProduct']);
                            }
                        },
                    });
                })}"
              >
                新增一個商品
                <svg
                  style="margin-left: 5px;"
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <path
                    d="M1.5 7.23926H12.5"
                    stroke="#3366BB"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M6.76172 1.5L6.76172 12.5"
                    stroke="#3366BB"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            `;
            },
            divCreate: {
                style: `width: 100%;display: flex;align-items: center;margin:24px 0;cursor: pointer;`,
                class: ``,
            },
        })}
        ${BgWidget.horizontalLine()} ${showOrderDetail()}
      </div>
      <!-- 選擇顧客 --- 顧客資料填寫 -->
      <div style="margin-top: 24px"></div>
      ${BgWidget.mainCard(gvc.bindView({
            bind: 'userBlock',
            dataList: [{ obj: customerData, key: 'type' }],
            view: () => {
                var _a, _b, _c, _d, _e;
                customerData.info.searchable = true;
                let checkBox = html ` <div
              style="display: flex;width: 16px;height: 16px;justify-content: center;align-items: center;border-radius: 20px;border: solid 4px #393939"
            ></div>`;
                let uncheckBox = html ` <div
              style="width: 16px;height: 16px;border-radius: 20px;border: 1px solid #DDD;"
            ></div>`;
                function syncUserData() {
                    if (CVSCheck) {
                        return;
                    }
                    orderDetail.user_info.name = tempUserData[customerData.type].name;
                    orderDetail.user_info.phone = tempUserData[customerData.type].phone;
                    orderDetail.user_info.email = tempUserData[customerData.type].email;
                }
                syncUserData();
                return html `
              <div class="tx_700">顧客資料</div>
              <div class="d-flex flex-column">
                ${customerData.type == 'auto'
                    ? html `
                      <div class="d-flex align-items-center" style="cursor: pointer;">
                        ${checkBox}
                        <div style="margin-left: 6px">現有的顧客</div>
                      </div>
                      <div
                        class="d-flex align-items-center position-relative"
                        style="min-height:40px;padding-left: 22px;margin-top: 8px;"
                      >
                        <div
                          style="height: 100%;width:1px;background-color: #E5E5E5;position: absolute;left: 8px;top: 0;"
                        ></div>
                        <div class="position-relative w-100 d-flex flex-column">
                          <input
                            class="w-100 searchInput"
                            placeholder="搜尋現有顧客"
                            value="${(_b = (_a = orderDetail.customer_info.email) !== null && _a !== void 0 ? _a : customerData.info.search) !== null && _b !== void 0 ? _b : ''}"
                            style="padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;"
                            onkeyup="${gvc.event(e => {
                        if (customerData.info.searchable) {
                            customerData.info.searchable = false;
                            customerData.info.search = e.value;
                            ApiUser.getUserList({
                                limit: 100,
                                page: 0,
                                search: e.value,
                            }).then((r) => {
                                customerData.info.searchResponse = r;
                                customerData.pageType = 'select';
                            });
                            setTimeout(() => {
                                customerData.info.searchable = true;
                            }, 100);
                        }
                    })}"
                          />
                          ${gvc.bindView({
                        bind: `accountSelect`,
                        dataList: [{ obj: customerData, key: 'pageType' }],
                        view: () => {
                            var _a, _b, _c;
                            switch (customerData.pageType) {
                                case 'select': {
                                    let rowData = undefined;
                                    if (customerData.info.searchResponse) {
                                        rowData = customerData.info.searchResponse.response.data;
                                    }
                                    else {
                                        return ``;
                                    }
                                    let selectHTML = ``;
                                    rowData.map((data) => {
                                        var _a, _b;
                                        selectHTML += html `
                                      <div
                                        class="w-100"
                                        style="cursor: pointer;"
                                        onclick="${gvc.event(() => {
                                            var _a, _b, _c, _d, _e;
                                            tempUserData[customerData.type] = data;
                                            orderDetail.customer_info.name = (_a = data.userData.name) !== null && _a !== void 0 ? _a : '';
                                            orderDetail.customer_info.phone = (_b = data.phone) !== null && _b !== void 0 ? _b : '';
                                            orderDetail.customer_info.email = (_c = data.account) !== null && _c !== void 0 ? _c : '';
                                            customerData.pageType = 'check';
                                            document.querySelector(`.searchInput`).value =
                                                `${(_d = data.userData.name) !== null && _d !== void 0 ? _d : 'uname'}(${(_e = data.account) !== null && _e !== void 0 ? _e : 'unknown email'})`;
                                        })}"
                                      >
                                        ${(_a = data.userData.name) !== null && _a !== void 0 ? _a : 'uname'} (${(_b = data.account) !== null && _b !== void 0 ? _b : 'unknown email'} )
                                      </div>
                                    `;
                                    });
                                    return html `
                                    <div
                                      class="w-100 d-flex flex-column"
                                      style="gap:12px;position: absolute;right: 0; top: calc(100% + 12px);background-color: white;padding: 24px;flex-direction: column;justify-content: center;align-items: flex-start;border-radius: 10px;border: 1px solid #DDD;box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.15);"
                                    >
                                      ${selectHTML}
                                    </div>
                                  `;
                                }
                                case 'check': {
                                    return html `
                                    <div>姓名</div>
                                    <div
                                      class="w-100"
                                      style="border-radius: 10px;border: 1px solid #DDD;background: #F7F7F7;padding: 9px 18px;"
                                    >
                                      ${(_a = tempUserData[customerData.type].userData.name) !== null && _a !== void 0 ? _a : 'uname'}
                                    </div>
                                    <div>電子信箱</div>
                                    <div
                                      class="w-100"
                                      style="border-radius: 10px;border: 1px solid #DDD;background: #F7F7F7;padding: 9px 18px;"
                                    >
                                      ${(_b = tempUserData[customerData.type].account) !== null && _b !== void 0 ? _b : 'unknown email'}
                                    </div>
                                    <div>電話</div>
                                    <div
                                      class="w-100"
                                      style="min-height:45px;border-radius: 10px;border: 1px solid #DDD;background: #F7F7F7;padding: 9px 18px;"
                                    >
                                      ${(_c = tempUserData[customerData.type].phone) !== null && _c !== void 0 ? _c : ''}
                                    </div>
                                  `;
                                }
                                case undefined:
                                case 'none': {
                                    return ``;
                                }
                            }
                            return ``;
                        },
                        divCreate: {},
                    })}
                        </div>
                      </div>
                    `
                    : html ` <div
                      class="d-flex align-items-center"
                      style="margin-bottom: 12px;cursor: pointer;"
                      onclick="${gvc.event(() => {
                        if (customerData.type == 'manual') {
                            orderDetail.user_info = {
                                CVSAddress: '',
                                CVSStoreID: '',
                                CVSStoreName: '',
                                CVSTelephone: '',
                                MerchantTradeNo: '',
                                address: '',
                                email: '',
                                name: '',
                                note: '',
                                phone: '',
                                shipment: 'normal',
                            };
                        }
                        customerData.type = 'auto';
                        customerData.sameCustomer = false;
                        gvc.notifyDataChange('setLogistics');
                    })}"
                    >
                      ${uncheckBox}
                      <div style="margin-left: 6px">現有的顧客</div>
                    </div>`}
                ${customerData.type == 'manual'
                    ? html `
                      <div class="d-flex align-items-center" style="cursor: pointer;">
                        ${checkBox}
                        <div style="margin-left: 6px">手動加入顧客</div>
                      </div>
                      <div
                        class="d-flex align-items-center position-relative"
                        style="min-height:40px;padding-left: 22px;margin-top: 8px;"
                      >
                        <div
                          style="height: 100%;width:1px;background-color: #E5E5E5;position: absolute;left: 8px;top: 0;"
                        ></div>
                        <div class="position-relative w-100 d-flex flex-column" style="gap:8px;">
                          <div>姓名</div>
                          <input
                            class="w-100"
                            value="${(_c = orderDetail.user_info.name) !== null && _c !== void 0 ? _c : ''}"
                            style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px;"
                            placeholder="請輸入姓名"
                            onchange="${gvc.event(e => {
                        tempUserData[customerData.type].name = e.value;
                        orderDetail.user_info.name = e.value;
                    })}"
                          />
                          <div>電話</div>
                          <input
                            class="w-100"
                            value="${(_d = orderDetail.user_info.phone) !== null && _d !== void 0 ? _d : ''}"
                            style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px;"
                            placeholder="請輸入電話"
                            onchange="${gvc.event(e => {
                        tempUserData[customerData.type].phone = e.value;
                        orderDetail.user_info.phone = e.value;
                    })}"
                          />
                          <div>電子信箱</div>
                          <input
                            class="w-100"
                            value="${(_e = orderDetail.user_info.email) !== null && _e !== void 0 ? _e : ''}"
                            style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px;"
                            placeholder="請輸入電子信箱，同時會註冊暫時會員"
                            onchange="${gvc.event(e => {
                        tempUserData[customerData.type].email = e.value;
                        ApiUser.getEmailCount(e.value).then(r => {
                            if (r.response.result) {
                                const dialog = new ShareDialog(glitter);
                                dialog.errorMessage({ text: '此信箱已經被註冊' });
                                orderDetail.user_info.email = '';
                                e.value = '';
                            }
                        });
                        orderDetail.user_info.email = e.value;
                    })}"
                          />
                        </div>
                      </div>
                    `
                    : html ` <div
                      class="d-flex align-items-center"
                      style="margin-top: 12px;cursor: pointer;"
                      onclick="${gvc.event(() => {
                        if (customerData.type == 'auto') {
                            orderDetail.user_info = {
                                CVSAddress: '',
                                CVSStoreID: '',
                                CVSStoreName: '',
                                CVSTelephone: '',
                                MerchantTradeNo: '',
                                address: '',
                                email: '',
                                name: '',
                                note: '',
                                phone: '',
                                shipment: 'normal',
                            };
                        }
                        customerData.type = 'manual';
                        customerData.sameCustomer = false;
                        gvc.notifyDataChange(['setLogistics']);
                    })}"
                    >
                      ${uncheckBox}
                      <div style="margin-left: 6px;">手動加入顧客</div>
                    </div>`}
              </div>
            `;
            },
            divCreate: { class: `d-flex flex-column`, style: `gap:18px;` },
        }))}
      <!-- 設定金物流 --- 顧客運送資料和付款方式 -->
      <div style="margin-top: 24px"></div>
      ${BgWidget.mainCard(gvc.bindView({
            bind: 'setLogistics',
            view: () => {
                var _a, _b, _c;
                return html `
              <div class="tx_700">設定金物流</div>
              <div class="d-flex flex-column" style="gap: 18px">
                <div class="d-flex align-items-center w-100" style="gap:18px;">
                  <div class="d-flex flex-column flex-fill" style="gap: 8px;">
                    <div>付款方式 / 付款狀態</div>
                    <select
                      class="form-select"
                      style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px;"
                      onchange="${gvc.event(e => {
                    orderDetail.pay_status = e.value;
                })}"
                    >
                      <option value="1" ${orderDetail.pay_status == 1 ? 'selected' : ''}>線下付款-已付款</option>
                      <option value="0" ${orderDetail.pay_status == 0 ? 'selected' : ''}>線下付款-未付款</option>
                    </select>
                  </div>
                  <div class="d-flex flex-column flex-fill" style="gap: 8px;">
                    <div>運送方法</div>
                    <select
                      class="form-select"
                      style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px;"
                      onchange="${gvc.event(e => {
                    orderDetail.user_info.shipment = e.value;
                    orderDetailRefresh = true;
                    gvc.notifyDataChange(['listProduct', 'orderDetail']);
                })}"
                    >
                      <option value="normal" ${orderDetail.user_info.shipment == 'normal' ? 'selected' : ''}>
                        宅配
                      </option>
                      <option value="UNIMARTC2C" ${orderDetail.user_info.shipment == 'UNIMARTC2C' ? 'selected' : ''}>
                        7-11店到店
                      </option>
                      <option value="FAMIC2C" ${orderDetail.user_info.shipment == 'FAMIC2C' ? 'selected' : ''}>
                        全家店到店
                      </option>
                      <option value="OKMARTC2C" ${orderDetail.user_info.shipment == 'OKMARTC2C' ? 'selected' : ''}>
                        OK店到店
                      </option>
                      <option value="HILIFEC2C" ${orderDetail.user_info.shipment == 'HILIFEC2C' ? 'selected' : ''}>
                        萊爾富店到店
                      </option>
                    </select>
                  </div>
                </div>

                <div class="tx_700">收件人資料</div>
                <div
                  class="d-flex align-items-center"
                  style="gap:6px;cursor: pointer;"
                  onclick="${gvc.event(() => {
                    var _a;
                    customerData.sameCustomer = !customerData.sameCustomer;
                    if (customerData.sameCustomer && !((_a = orderDetail.customer_info) === null || _a === void 0 ? void 0 : _a.email)) {
                        const dialog = new ShareDialog(glitter);
                        dialog.errorMessage({ text: '請填寫顧客資料' });
                        customerData.sameCustomer = !customerData.sameCustomer;
                    }
                    if (customerData.sameCustomer) {
                        orderDetail.user_info.name = orderDetail.customer_info.name;
                        orderDetail.user_info.phone = orderDetail.customer_info.phone;
                        orderDetail.user_info.email = orderDetail.customer_info.email;
                    }
                    gvc.notifyDataChange('setLogistics');
                })}"
                >
                  ${customerData.sameCustomer
                    ? html ` <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <rect width="16" height="16" rx="3" fill="#393939" />
                        <path
                          d="M4.5 8.5L7 11L11.5 5"
                          stroke="white"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>`
                    : html ` <div style="width: 16px;height: 16px;border-radius: 3px;border: 1px solid #DDD;"></div>`}
                  同顧客資料
                </div>
                <div class="d-flex flex-column" style="gap: 8px">
                  <div>姓名</div>
                  <input
                    style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px;"
                    value="${(_a = orderDetail.user_info.name) !== null && _a !== void 0 ? _a : ''}"
                    placeholder="請輸入姓名"
                    onchange="${gvc.event(e => {
                    orderDetail.user_info.name = e.value;
                })}"
                    ${customerData.sameCustomer ? 'disabled' : ''}
                  />
                </div>
                <div class="d-flex flex-column" style="gap: 8px">
                  <div>電話</div>
                  <input
                    style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px;"
                    value="${(_b = orderDetail.user_info.phone) !== null && _b !== void 0 ? _b : ''}"
                    placeholder="請輸入電話"
                    onchange="${gvc.event(e => {
                    orderDetail.user_info.phone = e.value;
                })}"
                  />
                </div>
                <div class="d-flex flex-column" style="gap: 8px">
                  <div>電子信箱</div>
                  <input
                    style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px;"
                    value="${(_c = orderDetail.customer_info.email) !== null && _c !== void 0 ? _c : ''}"
                    placeholder="請輸入電子信箱"
                    onchange="${gvc.event(e => {
                    orderDetail.customer_info.email = e.value;
                })}"
                    ${customerData.sameCustomer ? 'disabled' : ''}
                  />
                </div>
                <div class="d-flex flex-column" style="gap: 8px">
                  ${gvc.bindView({
                    bind: 'CVSStore',
                    dataList: [{ obj: orderDetail.user_info, key: 'shipment' }],
                    view: () => {
                        var _a, _b;
                        switch ((_a = orderDetail.user_info) === null || _a === void 0 ? void 0 : _a.shipment) {
                            case 'normal': {
                                return html `
                            <div>宅配地址</div>
                            <input
                              style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px;margin-top:8px;width: 100%;"
                              value="${(_b = orderDetail.user_info.address) !== null && _b !== void 0 ? _b : ''}"
                              placeholder="請輸入宅配地址"
                              onchange="${gvc.event(e => {
                                    orderDetail.user_info.address = e.value;
                                })}"
                            />
                          `;
                            }
                            default: {
                                let returnHTML = ``;
                                if (orderDetail.user_info.CVSStoreID) {
                                    let icon = {
                                        UNIMARTC2C: `https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716734544575-34f72af5b441738b1f65a0597c28d9cf%20(1).png`,
                                        FAMIC2C: `https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716734396302-e970be63c9acb23e41cf80c77b7ca35b.jpeg`,
                                        HILIFEC2C: `https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716734423037-6e2664ad52332c40b4106868ada74646.png`,
                                        OKMARTC2C: `https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716734510490-beb1c70f9e168b7bab198ea2bf226148.png`,
                                    };
                                    returnHTML = html `
                              <div class="d-flex flex-column">
                                <div class="d-flex align-items-center">
                                  <img
                                    style="width: 32px;height: 32px;margin-right: 8px;"
                                    src="${icon[orderDetail.user_info.shipment]}"
                                    alt="icon"
                                  />
                                  <div
                                    style="color:#4D86DB"
                                    onclick="${gvc.event(() => {
                                        selectCVS(orderDetail.user_info.shipment);
                                    })}"
                                  >
                                    點擊更換門市
                                  </div>
                                </div>
                                <div class="d-flex">門市名稱: ${orderDetail.user_info.CVSStoreName}</div>
                                <div class="d-flex">門市店號: ${orderDetail.user_info.CVSStoreID}</div>
                                <div class="d-flex">門市地址: ${orderDetail.user_info.CVSAddress}</div>
                              </div>
                            `;
                                    return html `
                              <div>配送門市</div>
                              ${returnHTML}
                            `;
                                }
                                else {
                                    return html `
                              <div>配送門市</div>
                              <div
                                style="color: #4D86DB;cursor: pointer;margin-top:8px;cursor: pointer"
                                onclick="${gvc.event(() => {
                                        selectCVS(orderDetail.user_info.shipment);
                                    })}"
                              >
                                請選擇配送門市
                              </div>
                            `;
                                }
                            }
                        }
                    },
                    divCreate: {},
                })}
                </div>
              </div>
            `;
            },
            divCreate: { class: `d-flex flex-column`, style: `color:#393939;gap:18px;` },
        }))}
      <div style="margin-top: 24px"></div>
      ${BgWidget.mainCard(html `
        <div class="d-flex flex-column" style="gap: 8px">
          <div class="tx_700">訂單備註</div>
          <textarea
            style="cursor: pointer;height: 80px;padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;"
            onchange="${gvc.event(e => {
            orderDetail.user_info.note = e.value;
        })}"
          ></textarea>
        </div>
      `)}
      ${BgWidget.mbContainer(240)}
      <div class="update-bar-container">
        ${BgWidget.cancel(gvc.event(() => {
            vm.type = 'list';
        }))}
        ${BgWidget.save(gvc.event(() => {
            let passData = JSON.parse(JSON.stringify(orderDetail));
            passData.total = orderDetail.total;
            passData.orderStatus = 1;
            delete passData.tag;
            const dialog = new ShareDialog(glitter);
            passData.line_items = passData.lineItems;
            dialog.dataLoading({ visible: true });
            if (checkOrderEmpty(passData)) {
                ApiShop.toManualCheckout(passData).then(r => {
                    dialog.dataLoading({ visible: false });
                    window.parent.glitter.innerDialog((gvc) => {
                        return html `
                      <div
                        style="position: relative;width: 492px;height: 223px;border-radius: 10px;background: #FFF;display: flex;flex-direction: column;align-items: center;justify-content: center;"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          style="position: absolute;top: 12px;right: 12px;cursor: pointer;"
                          onclick="${gvc.event(() => {
                            gvc.glitter.closeDiaLog();
                        })}"
                        >
                          <path d="M1 1L13 13" stroke="#393939" stroke-linecap="round" />
                          <path d="M13 1L1 13" stroke="#393939" stroke-linecap="round" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 75 75" fill="none">
                          <g clip-path="url(#clip0_9850_171427)">
                            <path
                              d="M37.5 7.03125C45.5808 7.03125 53.3307 10.2413 59.0447 15.9553C64.7587 21.6693 67.9688 29.4192 67.9688 37.5C67.9688 45.5808 64.7587 53.3307 59.0447 59.0447C53.3307 64.7587 45.5808 67.9688 37.5 67.9688C29.4192 67.9688 21.6693 64.7587 15.9553 59.0447C10.2413 53.3307 7.03125 45.5808 7.03125 37.5C7.03125 29.4192 10.2413 21.6693 15.9553 15.9553C21.6693 10.2413 29.4192 7.03125 37.5 7.03125ZM37.5 75C47.4456 75 56.9839 71.0491 64.0165 64.0165C71.0491 56.9839 75 47.4456 75 37.5C75 27.5544 71.0491 18.0161 64.0165 10.9835C56.9839 3.95088 47.4456 0 37.5 0C27.5544 0 18.0161 3.95088 10.9835 10.9835C3.95088 18.0161 0 27.5544 0 37.5C0 47.4456 3.95088 56.9839 10.9835 64.0165C18.0161 71.0491 27.5544 75 37.5 75ZM54.0527 30.6152C55.4297 29.2383 55.4297 27.0117 54.0527 25.6494C52.6758 24.2871 50.4492 24.2725 49.0869 25.6494L32.8271 41.9092L25.9424 35.0244C24.5654 33.6475 22.3389 33.6475 20.9766 35.0244C19.6143 36.4014 19.5996 38.6279 20.9766 39.9902L30.3516 49.3652C31.7285 50.7422 33.9551 50.7422 35.3174 49.3652L54.0527 30.6152Z"
                              fill="#393939"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_9850_171427">
                              <rect width="75" height="75" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                        <div
                          style="text-align: center;color: #393939;font-size: 16px;font-weight: 400;line-height: 160%;margin-top: 24px;"
                        >
                          訂單新增成功！<br />
                          已將訂單明細發送至顧客信箱
                        </div>
                      </div>
                    `;
                    }, 'orderFinish', {
                        dismiss: () => {
                            vm.type = 'list';
                        },
                    });
                });
            }
            else {
                dialog.dataLoading({ visible: false });
            }
        }))}
      </div>
    `);
    }
    static getPaymentMethodText(key, orderData, gvc) {
        if (orderData.orderSource === 'POS') {
            return `${(() => {
                if (typeof orderData.pos_info.payment === 'string') {
                    return `門市『 ${(() => {
                        switch (orderData.pos_info.payment) {
                            case 'creditCard':
                                return '信用卡';
                            case 'line':
                                return 'Line Pay';
                            case 'cash':
                                return '現金';
                        }
                    })()} 』付款`;
                }
                else {
                    const pay_total = orderData.pos_info.payment
                        .map((dd) => {
                        return dd.total;
                    })
                        .reduce((acc, val) => acc + val, 0);
                    let map_ = orderData.pos_info.payment.map((dd) => {
                        return `${(() => {
                            switch (dd.method) {
                                case 'creditCard':
                                    return '信用卡';
                                case 'line':
                                    return 'Line Pay';
                                case 'cash':
                                    return '現金';
                            }
                        })()}付款<span class="fw-500" style="color:#E85757;"> $${dd.total.toLocaleString()}</span>`;
                    });
                    if (pay_total < orderData.total) {
                        map_.push(html ` <div class="d-flex align-items-center">
                <span class="fw-500 text-danger">付款金額不足</span>
                <div class="mx-1"></div>
                <span class="fw-500"> $${(orderData.total - pay_total).toLocaleString()}</span>
                <div class="mx-1"></div>
                ${BgWidget.customButton({
                            button: {
                                color: 'gray',
                                size: 'sm',
                            },
                            text: {
                                name: '前往結帳',
                            },
                            event: gvc.event(() => {
                                PaymentPage.storeHistory(orderData);
                                gvc.closeDialog();
                                localStorage.setItem('show_pos_page', 'payment');
                                gvc.glitter.share.reloadPosPage();
                            }),
                        })}
              </div>`);
                    }
                    return map_.join('<div class="w-100"></div>');
                }
            })()}
            `;
        }
        return gvc.bindView(() => {
            return {
                bind: gvc.glitter.getUUID(),
                view: () => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    return (((_a = (yield PaymentConfig.getSupportPayment()).find(dd => {
                        return dd.key === orderData.customer_info.payment_select;
                    })) === null || _a === void 0 ? void 0 : _a.name) || '線下付款');
                }),
            };
        });
    }
    static getProofPurchaseString(orderData, gvc) {
        if (orderData.method !== 'off_line' || orderData.customer_info.payment_select === 'cash_on_delivery') {
            return '';
        }
        return html ` <div class="tx_700">付款證明回傳</div>
      <div class="border rounded-3 w-100 p-3 tx_normal">
        ${(() => {
            var _a;
            const array = [];
            if (orderData.customer_info.payment_select === 'cash_on_delivery') {
                return '貨到付款';
            }
            if (orderData.customer_info.payment_select === 'atm') {
                ['pay-date', 'bank_name', 'bank_account', 'trasaction_code'].map((dd, index) => {
                    if (orderData.proof_purchase && orderData.proof_purchase[dd]) {
                        array.push(`${['交易時間', '銀行名稱', '銀行戶名', '銀行帳號後五碼'][index]} : ${orderData.proof_purchase[dd]}`);
                    }
                });
            }
            if (orderData.customer_info.payment_select === 'line') {
                ['image'].map(dd => {
                    if (orderData.proof_purchase && orderData.proof_purchase[dd]) {
                        array.push(BgWidget.imageDialog({
                            gvc,
                            image: orderData.proof_purchase[dd],
                            width: 400,
                            height: 250,
                            read: () => { },
                        }));
                    }
                });
            }
            if (!['atm', 'line'].includes(orderData.customer_info.payment_select)) {
                if (orderData.proof_purchase === undefined || orderData.proof_purchase.paymentForm === undefined) {
                    return '尚未回傳付款證明';
                }
                const paymentFormList = (_a = orderData.proof_purchase.paymentForm.list) !== null && _a !== void 0 ? _a : [];
                paymentFormList.map((item) => {
                    array.push(`${item.title} : ${orderData.proof_purchase[item.key]}`);
                });
            }
            return array.join(BgWidget.mbContainer(8)) || '尚未回傳付款證明';
        })()}
      </div>`;
    }
    static printStoreOrderInfo(obj) {
        const gvc = obj.gvc;
        const glitter = gvc.glitter;
        const dialog = new ShareDialog(gvc.glitter);
        let shipment_date = gvc.glitter.ut.dateFormat(new Date(), 'yyyy-MM-dd');
        let shipment_time = gvc.glitter.ut.dateFormat(new Date(), 'hh:mm');
        function next() {
            dialog.dataLoading({ visible: true, text: '處理中...' });
            ApiDelivery.getOrderInfo({
                order_id: obj.cart_token,
                shipment_date: obj.print ? undefined : new Date(`${shipment_date} ${shipment_time}:00`).toISOString(),
            }).then((res) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                gvc.notifyDataChange('orderDetailRefresh');
                dialog.dataLoading({ visible: false });
                if (!obj.print) {
                    (_a = obj.callback) === null || _a === void 0 ? void 0 : _a.call(obj);
                    return;
                }
                if (res.result && res.response.data) {
                    const data = res.response.data;
                    if (data.result) {
                        if (data.link) {
                            if (window.parent.glitter.share.PayConfig.posType === 'SUNMI') {
                                glitter.runJsInterFace('print-web-view', {
                                    url: data.link,
                                }, () => { });
                            }
                            else {
                                glitter.openNewTab(data.link);
                            }
                        }
                        else if (data.id) {
                            const url = ApiDelivery.getFormURL(data.id);
                            if (window.parent.glitter.share.PayConfig.posType === 'SUNMI') {
                                glitter.runJsInterFace('print-web-view', {
                                    url: url,
                                }, () => { });
                            }
                            else {
                                glitter.openNewTab(url);
                            }
                        }
                        else {
                            dialog.errorMessage({ text: '列印失敗' });
                        }
                    }
                    else {
                        dialog.errorMessage({ text: (_b = data.message) !== null && _b !== void 0 ? _b : '發生錯誤' });
                    }
                }
                else {
                    dialog.errorMessage({ text: '列印失敗' });
                }
            }));
        }
        if (!obj.print) {
            BgWidget.settingDialog({
                gvc: gvc,
                title: '設定出貨日期',
                innerHTML: (gvc) => {
                    return [
                        BgWidget.editeInput({
                            gvc: gvc,
                            title: '出貨日期',
                            default: shipment_date,
                            callback: text => {
                                shipment_date = text;
                            },
                            type: 'date',
                            placeHolder: '請輸入出貨日期',
                        }),
                        BgWidget.editeInput({
                            gvc: gvc,
                            title: '出貨時間',
                            default: shipment_time,
                            callback: text => {
                                shipment_time = text;
                            },
                            type: 'time',
                            placeHolder: '請輸入出貨時間',
                        }),
                    ].join('');
                },
                footer_html: (gvc) => {
                    return [
                        BgWidget.cancel(gvc.event(() => {
                            gvc.closeDialog();
                        }), '取消'),
                        BgWidget.save(gvc.event(() => {
                            gvc.closeDialog();
                            next();
                        }), '儲存'),
                    ].join('');
                },
                width: 350,
            });
        }
        else {
            next();
        }
        return;
    }
}
ShoppingOrderManager.vm = {
    page: 1,
};
window.glitter.setModule(import.meta.url, ShoppingOrderManager);
