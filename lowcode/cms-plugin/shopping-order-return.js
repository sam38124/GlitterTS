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
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { BgListComponent } from '../backend-manager/bg-list-component.js';
import { FilterOptions } from './filter-options.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { UserList } from './user-list.js';
const html = String.raw;
export class ShoppingReturnOrderManager {
    static main(gvc) {
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
            filter_type: 'normal',
        };
        const ListComp = new BgListComponent(gvc, vm, FilterOptions.returnOrderFilterFrame);
        vm.filter = ListComp.getFilterObject();
        gvc.addMtScript([{ src: 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js' }], () => { }, () => { });
        return gvc.bindView(() => {
            const id = glitter.getUUID();
            return {
                bind: vm.id,
                dataList: [{ obj: vm, key: 'type' }],
                view: () => {
                    if (vm.type === 'list') {
                        return BgWidget.container(html `
                                <div class="title-container">
                                    ${BgWidget.title('退貨單列表')}
                                    <div class="flex-fill"></div>
                                    ${BgWidget.darkButton('新增', gvc.event(() => {
                            vm.type = 'addSearch';
                        }))}
                                </div>
                                <div class="title-container">
                                    ${BgWidget.tab([
                            {
                                title: '一般列表',
                                key: 'normal',
                            },
                        ], gvc, vm.filter_type, (text) => {
                            vm.filter_type = text;
                            gvc.notifyDataChange(vm.id);
                        })}
                                </div>
                                ${BgWidget.mainCard([
                            html `<div>
                                            <div style="display: flex; align-items: center; gap: 10px;">
                                                ${BgWidget.selectFilter({
                                gvc,
                                callback: (value) => {
                                    vm.queryType = value;
                                    gvc.notifyDataChange(vm.id);
                                },
                                default: vm.queryType || 'name',
                                options: FilterOptions.returnOrderSelect,
                            })}
                                                ${BgWidget.searchFilter(gvc.event((e, event) => {
                                vm.query = `${e.value}`.trim();
                                gvc.notifyDataChange(vm.id);
                            }), vm.query || '', '搜尋所有訂單 按下Enter後執行')}
                                                ${BgWidget.funnelFilter({
                                gvc,
                                callback: () => ListComp.showRightMenu(FilterOptions.returnOrderFunnel),
                            })}
                                                ${BgWidget.updownFilter({
                                gvc,
                                callback: (value) => {
                                    vm.orderString = value;
                                    gvc.notifyDataChange(vm.id);
                                },
                                default: vm.orderString || 'created_time_desc',
                                options: FilterOptions.returnOrderOrderBy,
                            })}
                                            </div>
                                            <div>${ListComp.getFilterTags(FilterOptions.returnOrderFunnel)}</div>
                                        </div>`,
                            BgWidget.tableV3({
                                gvc: gvc,
                                getData: (vmi) => {
                                    var _a, _b;
                                    const limit = 20;
                                    ApiShop.getSearchReturnOrder({
                                        page: vmi.page - 1,
                                        limit: limit,
                                        search: (_a = vm.query) !== null && _a !== void 0 ? _a : '',
                                        searchType: vm.queryType || 'name',
                                        orderString: (_b = vm.orderString) !== null && _b !== void 0 ? _b : '',
                                        filter: vm.filter,
                                        archived: vm.filter_type === 'normal' ? `false` : `true`,
                                    }).then((data) => {
                                        function getDatalist() {
                                            return data.response.data.map((dd) => {
                                                return [
                                                    {
                                                        key: '退貨單編號',
                                                        value: dd.return_order_id,
                                                    },
                                                    {
                                                        key: '訂單編號',
                                                        value: dd.order_id,
                                                    },
                                                    {
                                                        key: '申請日期',
                                                        value: glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd hh:mm:ss'),
                                                    },
                                                    {
                                                        key: '申請人',
                                                        value: dd.orderData.user_info ? dd.orderData.user_info.name : `匿名`,
                                                    },
                                                    {
                                                        key: '退貨狀態',
                                                        value: (() => {
                                                            var _a;
                                                            switch ((_a = dd.orderData.returnProgress) !== null && _a !== void 0 ? _a : '1') {
                                                                case '0':
                                                                    return `<div class="badge" style="font-size: 14px;color:#393939;height: 22px;padding: 4px 6px;border-radius: 7px;background: #FFE9B2;">退貨中</div>`;
                                                                case '-1':
                                                                    return `<div class="badge" style="font-size: 14px;border-radius: 7px;background: #D8ECDA;height: 22px;padding: 4px 6px;color:#393939;">已退貨</div>`;
                                                                default:
                                                                    return `<div class="badge" style="font-size: 14px;color:#393939;height: 22px;padding: 4px 6px;border-radius: 7px;background: #FFE9B2;">處理中</div>`;
                                                            }
                                                        })(),
                                                    },
                                                    {
                                                        key: '退款狀態',
                                                        value: (() => {
                                                            var _a;
                                                            switch ((_a = dd.status) !== null && _a !== void 0 ? _a : 0) {
                                                                case 1:
                                                                    return `<div class="badge " style="font-size: 14px;color:#393939;border-radius: 7px;background: #D8ECDA;height: 22px;padding: 4px 6px;">已退款</div>`;
                                                                default:
                                                                    return `<div class="badge" style="font-size: 14px;color:#393939;height: 22px;padding: 4px 6px;border-radius: 7px;background: #FFE9B2;">退款中</div>`;
                                                            }
                                                        })(),
                                                    },
                                                ].map((dd) => {
                                                    dd.value = `<div style="line-height:40px;">${dd.value}</div>`;
                                                    return dd;
                                                });
                                            });
                                        }
                                        vm.dataList = data.response.data;
                                        vmi.pageSize = Math.ceil(data.response.total / limit);
                                        vmi.originalData = vm.dataList;
                                        vmi.tableData = getDatalist();
                                        vmi.loading = false;
                                        vmi.callback();
                                    });
                                },
                                rowClick: (data, index) => {
                                    vm.data = vm.dataList[index];
                                    vm.type = 'replace';
                                },
                                filter: [
                                    {
                                        name: vm.filter_type === 'normal' ? `批量封存` : `解除封存`,
                                        option: true,
                                        event: () => {
                                            const dialog = new ShareDialog(gvc.glitter);
                                            const action_text = vm.filter_type === 'normal' ? `封存` : `解除封存`;
                                            dialog.checkYesOrNot({
                                                text: `是否確認${action_text}所選項目?
                                                            `,
                                                callback: (response) => __awaiter(this, void 0, void 0, function* () {
                                                    if (response) {
                                                        dialog.dataLoading({ visible: true });
                                                        const check = vm.dataList.filter((dd) => {
                                                            return dd.checked;
                                                        });
                                                        for (const b of check) {
                                                            b.orderData.archived = vm.filter_type === 'normal' ? `true` : `false`;
                                                            yield ApiShop.putReturnOrder({
                                                                id: `${b.id}`,
                                                                data: b,
                                                            });
                                                        }
                                                        setTimeout(() => {
                                                            dialog.dataLoading({ visible: false });
                                                            gvc.notifyDataChange(vm.id);
                                                        }, 100);
                                                    }
                                                }),
                                            });
                                        },
                                    },
                                    {
                                        name: vm.filter_type === 'void' ? `批量作廢` : `解除作廢`,
                                        option: true,
                                        event: () => {
                                            const dialog = new ShareDialog(gvc.glitter);
                                            dialog.checkYesOrNot({
                                                text: `是否確認${vm.filter_type === 'void' ? `解除作廢` : `作廢`}所選項目?`,
                                                callback: (response) => __awaiter(this, void 0, void 0, function* () {
                                                    if (response) {
                                                        dialog.dataLoading({ visible: true });
                                                        const check = vm.dataList.filter((dd) => {
                                                            return dd.checked;
                                                        });
                                                        for (const b of check) {
                                                            b.orderData.void = vm.filter_type === 'void' ? `false` : `true`;
                                                            yield ApiShop.putReturnOrder({
                                                                id: `${b.id}`,
                                                                data: b,
                                                            });
                                                        }
                                                        setTimeout(() => {
                                                            dialog.dataLoading({ visible: false });
                                                            gvc.notifyDataChange(vm.id);
                                                        }, 100);
                                                    }
                                                }),
                                            });
                                        },
                                    },
                                ],
                            }),
                        ].join(''))}
                            `);
                    }
                    else if (vm.type == 'replace') {
                        return this.replaceOrder(gvc, vm);
                    }
                    else if (vm.type == 'addSearch') {
                        return this.searchOrder(gvc, vm);
                    }
                    else {
                        return '';
                    }
                },
            };
        });
    }
    static replaceOrder(gvc, vm) {
        const glitter = gvc.glitter;
        const orderData = vm.data;
        let userData = {};
        const mainViewID = gvc.glitter.getUUID();
        gvc.addStyle(`
            .bg-warning {
                background: #ffef9d !important;
                color: black !important;
            }
        `);
        let userDataLoading = true;
        function formatDateString(isoDate) {
            const date = isoDate ? new Date(isoDate) : new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}`;
        }
        function drawBadge(color, text) {
            switch (color) {
                case 'green':
                    return `<div class="badge  fs-6" style="background:#D8ECDA;color: #393939;max-height:34px;border-radius: 7px;">${text}</div>`;
                case 'red':
                    return `<div class="badge fs-6" style="border-radius: 7px;background: #FFD5D0;color: #393939;max-height:34px;">${text}</div>`;
                case 'yellow':
                    return `<div class="badge fs-6" style="max-height:34px;border-radius: 7px;color: #393939;background: #FFE9B2;">${text}</div>`;
                default:
                    return `<div class="badge fs-6" style="max-height:34px;border-radius: 7px;color: #393939;background: ${color};">${text}</div>`;
            }
        }
        function drawInputRow(text, value, readonly, style) {
            return html `
                <div class=" d-flex flex-column" style="gap:8px;flex:1;${style ? style : ''}">
                    <div style="font-size: 16px;font-weight: 400;">${text}</div>
                    ${(() => {
                if (readonly) {
                    return html `
                                <div class="w-100" style="display: flex;height: 40px;padding: 9px 18px;align-items: center;border-radius: 10px;border: 1px solid #DDD;background: #F7F7F7;">
                                    ${value}
                                </div>
                            `;
                }
                else {
                    return html `
                                <input
                                    class="w-100"
                                    style="display: flex;height: 40px;padding: 9px 18px;align-items: center;border-radius: 10px;border: 1px solid #DDD;"
                                    value="${value}"
                                    onchange="${gvc.event((e) => {
                        value = e.value;
                    })}"
                                />
                            `;
                }
            })()}
                </div>
            `;
        }
        const vt = {
            paymentBadge: () => {
                if (orderData.status === 0) {
                    return drawBadge('red', '尚未退款');
                }
                else if (orderData.status === 1) {
                    return drawBadge('green', '已退款');
                }
            },
            outShipBadge: () => {
                var _a;
                switch ((_a = orderData.orderData.returnProgress) !== null && _a !== void 0 ? _a : '1') {
                    case '1':
                        return drawBadge('#FFD5D0', '申請中');
                    case '0':
                        return drawBadge('#FFD5D0', '退貨中');
                    case '-1':
                        return drawBadge('#D8ECDA', '已退貨');
                }
            },
        };
        ApiUser.getUsersDataWithEmail(orderData.email).then((res) => {
            userData = res.response;
            userDataLoading = false;
            gvc.notifyDataChange(mainViewID);
        });
        const child_vm = {
            type: 'order',
            userID: '',
        };
        return gvc.bindView({
            bind: mainViewID,
            dataList: [
                {
                    obj: child_vm,
                    key: 'type',
                },
            ],
            view: () => {
                var _a, _b;
                try {
                    if (child_vm.type === 'user') {
                        return UserList.userInformationDetail({
                            userID: child_vm.userID,
                            callback: () => {
                                child_vm.type = 'order';
                            },
                            gvc: gvc,
                        });
                    }
                    return BgWidget.container(html `
                            <div class="d-flex flex-column" style="">
                                ${BgWidget.container(html `
                                        <div class="title-container">
                                            ${BgWidget.goBack(gvc.event(() => {
                        vm.type = 'list';
                    }))}
                                            ${BgWidget.title(html ` <div class="d-flex align-items-center">
                                                <div class="d-flex flex-column">
                                                    <div class="align-items-center" style="gap:10px;color: #393939;font-size: 24px;font-weight: 700;">#${orderData.return_order_id}</div>
                                                    <div class="d-flex align-items-center" style="color: #8D8D8D;font-size: 16px;font-weight: 400;gap:10px;">
                                                        訂單成立時間 : ${glitter.ut.dateFormat(new Date(orderData.created_time), 'yyyy-MM-dd hh:mm')}${vt.paymentBadge()}${vt.outShipBadge()}
                                                    </div>
                                                </div>
                                            </div>`)}
                                            <div class="flex-fill"></div>
                                            <button
                                                class="btn btn-primary-c d-none"
                                                style="height:38px;font-size: 14px;"
                                                onclick="${gvc.event(() => {
                        const now = new Date();
                        function writeEdit(origData, orderData) {
                            var _a;
                            let editArray = [];
                            let temp = {};
                            if (orderData.status != origData.status) {
                                let text = {
                                    '1': '付款成功',
                                    '-2': '退款成功',
                                    '0': '修改為未付款',
                                };
                                editArray.push({
                                    time: formatDateString(),
                                    record: text[orderData.status],
                                });
                            }
                            if (orderData.orderData.orderStatus != origData.orderData.orderStatus) {
                                let text = {
                                    '1': '訂單完成',
                                    '0': '訂單改為處理中',
                                    '-1': '訂單已取消',
                                };
                                editArray.push({
                                    time: formatDateString(),
                                    record: text[orderData.orderData.orderStatus],
                                });
                            }
                            if (orderData.orderData.progress != origData.orderData.progress) {
                                let text = {
                                    shipping: '訂單完成',
                                    wait: '訂單改為處理中',
                                    finish: '商品已取貨',
                                    returns: '商品已退貨',
                                    arrived: '商品已到貨',
                                };
                                editArray.push({
                                    time: formatDateString(),
                                    record: text[orderData.orderData.progress],
                                });
                            }
                            if ((_a = orderData.orderData) === null || _a === void 0 ? void 0 : _a.editRecord) {
                                editArray.length && orderData.orderData.editRecord.push(...editArray);
                            }
                            else {
                                editArray.length && (orderData.orderData.editRecord = editArray);
                            }
                        }
                        const dialog = new ShareDialog(gvc.glitter);
                        dialog.dataLoading({ text: '上傳中', visible: true });
                        ApiShop.putOrder({
                            id: `${orderData.id}`,
                            order_data: orderData.orderData,
                            status: orderData.status,
                        }).then((response) => {
                            dialog.dataLoading({ text: '上傳中', visible: false });
                            if (response.result) {
                                dialog.successMessage({ text: '更新成功' });
                                vm.type = 'list';
                            }
                            else {
                                dialog.errorMessage({ text: '更新異常' });
                            }
                        });
                    })}"
                                            >
                                                儲存並更改
                                            </button>
                                        </div>
                                        <div class="d-flex flex-column" style="gap:20px;">
                                            ${BgWidget.mainCard(html `
                                                <div class="d-flex flex-column" style="gap:18px;">
                                                    <div class="d-flex flex-column" style="gap: 12px;">
                                                        <div style="color:#393939;font-size: 16px;font-weight: 700;">退貨狀態</div>
                                                        <select
                                                            class="form-select"
                                                            style="width: 100%;display: flex;padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;font-size: 16px;"
                                                            onchange="${gvc.event((e) => {
                        orderData.orderData.returnProgress = e.value;
                    })}"
                                                            ${orderData.orderData.returnProgress == '-1' ? 'disabled' : ''}
                                                        >
                                                            ${(() => {
                        var _a;
                        let dataArray = [
                            ['申請中', '1'],
                            ['退貨中', '0'],
                            ['已退貨', '-1'],
                        ];
                        orderData.orderData.returnProgress = (_a = orderData.orderData.returnProgress) !== null && _a !== void 0 ? _a : '1';
                        return dataArray.map((data) => {
                            return html ` <option value="${data[1]}" ${orderData.orderData.returnProgress == data[1] ? `selected` : ``}>${data[0]}</option> `;
                        });
                    })()}
                                                        </select>
                                                    </div>
                                                    <div class="d-flex" style="gap:18px;">
                                                        ${drawInputRow('退貨單編號', orderData.return_order_id, true)} ${drawInputRow('原訂單編號', orderData.order_id, true)}
                                                    </div>
                                                </div>
                                            `)}
                                            ${BgWidget.mainCard(html `
                                                <div
                                                    style="width:100%;display: flex;flex-direction: column;align-items: flex-start;gap: 18px;align-self: stretch;color:#393939;font-size: 16px;font-weight: 400;"
                                                >
                                                    <div style="font-weight: 700;">收件人資訊</div>
                                                    ${(() => {
                        return [
                            ['姓名', 'name'],
                            ['電話', 'phone'],
                            ['電子信箱', 'email'],
                        ]
                            .map((data) => {
                            return drawInputRow(data[0], orderData.orderData.user_info[data[1]], false, 'width:100%;');
                        })
                            .join('');
                    })()}
                                                </div>
                                            `)}
                                            ${BgWidget.mainCard(html `
                                                <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 18px;align-self: stretch;color:#393939;font-size: 16px;font-weight: 400;">
                                                    <div style="font-weight: 700;">退貨明細</div>
                                                    <div
                                                        style="display: flex;height: 34px;padding-right: 12px;align-items: center;gap: 18px;border-bottom: 1px solid #DDD;background: #FFF;width: 100%"
                                                    >
                                                        <div style="flex:1 0 0">商品名稱</div>
                                                        <div style="width:13%;text-align: center;margin-right: 20px;">退貨原因</div>
                                                        <div style="width:5%;">單價</div>
                                                        <div style="width:10%;text-align: center;">退貨數量</div>
                                                        <div style="width:10%;text-align: center;">退回庫存數量</div>
                                                        <div style="width:50px;text-align: right;">小計</div>
                                                    </div>
                                                </div>

                                                ${(() => {
                        return orderData.orderData.lineItems
                            .map((data, index) => {
                            return gvc.bindView({
                                bind: `lineItem${index}`,
                                view: () => {
                                    var _a, _b;
                                    gvc.addStyle(`
                                                        input[type=number]::-webkit-outer-spin-button,
                                                        input[type=number]::-webkit-inner-spin-button {
                                                            -webkit-appearance: none;
                                                            margin: 0;
                                                        }
                                                        
                                                        /* Firefox */
                                                        input[type=number] {
                                                            -moz-appearance: textfield;
                                                        }
                                                    `);
                                    return html ` <div style="flex:1 0 0;display: flex;align-items: center;gap: 12px;">
                                                                            <img style="width: 54px;height: 54px;" src="${data.preview_image}" />
                                                                            <div class="d-flex justify-content-center flex-column" style="gap: 4px;">
                                                                                <div style="color:#393939;font-weight: 400;">${data.title}</div>
                                                                                <div class="d-flex " style="gap:4px;">
                                                                                    ${(() => {
                                        function isBlankString(input) {
                                            if (input === null || input === undefined || input === '' || input.length == 0) {
                                                return true;
                                            }
                                            return /^\s*$/.test(input);
                                        }
                                        if (data.spec.length == 0 || isBlankString(data.spec[0])) {
                                            return html `
                                                                                                <div
                                                                                                    style="border-radius: 7px;background: #EAEAEA;display: flex;height: 22px;padding: 4px 6px;justify-content: center;align-items: center;gap: 10px;color:#393939;font-weight: 400;"
                                                                                                >
                                                                                                    單一規格
                                                                                                </div>
                                                                                            `;
                                        }
                                        return data.spec
                                            .map((spec) => {
                                            var _a;
                                            data.return_count = (_a = data.return_count) !== null && _a !== void 0 ? _a : data.count;
                                            return html ` <div
                                                                                                    style="border-radius: 7px;background: #EAEAEA;display: flex;height: 22px;padding: 4px 6px;justify-content: center;align-items: center;gap: 10px;color:#393939;font-weight: 400;"
                                                                                                >
                                                                                                    ${spec}
                                                                                                </div>`;
                                        })
                                            .join();
                                    })()}
                                                                                </div>
                                                                                <div style="color: #8D8D8D;font-size: 14px;font-weight: 400;">存貨單位 (SKU): ${(_a = data.sku) !== null && _a !== void 0 ? _a : ''}</div>
                                                                            </div>
                                                                        </div>
                                                                        <div style="width:13%;margin-right: 20px;" class="d-flex align-items-center justify-content-center">
                                                                            ${(() => {
                                        let options = [
                                            {
                                                value: 'not_as_described',
                                                text: '商品不符合',
                                            },
                                            {
                                                value: 'damaged_in_shipping',
                                                text: '運送中毀損',
                                            },
                                            {
                                                value: 'not_as_described',
                                                text: '商品有瑕疵',
                                            },
                                            {
                                                value: 'not_as_described',
                                                text: '訂單有誤',
                                            },
                                        ];
                                        return html `
                                                                                    <div style="font-size: 16px;font-weight: 400;">
                                                                                        ${options.filter((data2) => data2.value == data.return_reason)[0].text}
                                                                                    </div>
                                                                                `;
                                    })()}
                                                                        </div>
                                                                        <div style="width:5%;">${data.sale_price}</div>
                                                                        <div style="width:10%;" class="d-flex align-items-center justify-content-center">
                                                                            <div style="font-size: 16px;font-weight: 400;">${data.return_count}</div>
                                                                        </div>
                                                                        <div style="width:10%;" class="d-flex align-items-center justify-content-center">
                                                                            <input
                                                                                type="number"
                                                                                style="text-align: center;width:94px;border-radius: 10px;border: 1px solid #DDD;display: flex;padding: 9px 18px;"
                                                                                value="${(_b = data.return_stock) !== null && _b !== void 0 ? _b : 0}"
                                                                                max="${data.return_count}"
                                                                                min="0"
                                                                                onchange="${gvc.event((e) => {
                                        data.return_stock = e.value;
                                        gvc.notifyDataChange(`lineItem${index}`);
                                    })}"
                                                                            />
                                                                        </div>
                                                                        <div style="width:50px;text-align: right;">${data.return_count * data.sale_price}</div>`;
                                },
                                divCreate: {
                                    style: `display: flex;padding: 0px 4px 12px 0px;align-items: center;gap: 18px;background: #FFF;width: 100%;padding-right:12px;`,
                                },
                            });
                        })
                            .join('');
                    })()}
                                                <div style="width: 100%;height: 1px;background-color: #DDD;margin-bottom:18px;"></div>
                                                ${gvc.bindView({
                        bind: `checkout`,
                        view: () => {
                            var _a, _b;
                            let subTotal = 0;
                            function showDetail(lineItem, type) {
                                let dict = {
                                    運費: 'shipment_fee',
                                    折扣: 'discount_price',
                                    購物金: 'rebate',
                                };
                                gvc.glitter.innerDialog((gvc) => {
                                    return html ` <div style="width: 912px;height: 450px;border-radius: 10px;background: #FFF;color: #393939;" class="d-flex flex-column ">
                                                                    <div
                                                                        class="d-flex align-items-center"
                                                                        style="border-radius: 10px 10px 0 0 ;background: #F2F2F2;padding: 12px 20px;font-size: 16px;font-weight: 700;"
                                                                    >
                                                                        ${type}明細
                                                                        <svg
                                                                            class="ms-auto"
                                                                            style="cursor: pointer;"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="14"
                                                                            height="14"
                                                                            viewBox="0 0 14 14"
                                                                            fill="none"
                                                                            onclick="${gvc.event(() => {
                                        gvc.glitter.closeDiaLog();
                                    })}"
                                                                        >
                                                                            <path d="M1 1L13 13" stroke="#393939" stroke-linecap="round" />
                                                                            <path d="M13 1L1 13" stroke="#393939" stroke-linecap="round" />
                                                                        </svg>
                                                                    </div>
                                                                    <div class="d-flex" style="padding: 24px 24px 12px;">
                                                                        <div>商品名稱</div>
                                                                        <div class="ms-auto d-flex">
                                                                            <div class="d-flex align-items-center justify-content-center" style="width: 60px;">運費</div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="" style="width: 872px;height:1px;background-color: #DDD;margin: 0 20px;"></div>
                                                                    <div class="d-flex flex-column" style="width: 100%;padding: 17px 24px;gap:12px;">
                                                                        ${(() => {
                                        return lineItem
                                            .map((data) => {
                                            var _a;
                                            return html `
                                                                                        <div class="d-flex" style="padding: ">
                                                                                            <div class="d-flex align-items-center" style="gap:12px;">
                                                                                                <img style="width: 54px;height: 54px;" src="${data.preview_image}" />
                                                                                                <div class="d-flex justify-content-center flex-column" style="gap: 4px;">
                                                                                                    <div
                                                                                                        style="color:#393939;font-weight: 400;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;width: 250px;"
                                                                                                    >
                                                                                                        ${data.title}
                                                                                                    </div>
                                                                                                    <div class="d-flex " style="gap:4px;">
                                                                                                        ${(() => {
                                                var _a;
                                                data.return_count = (_a = data.return_count) !== null && _a !== void 0 ? _a : data.count;
                                                function isBlankString(input) {
                                                    if (input === null || input === undefined || input === '' || input.length == 0) {
                                                        return true;
                                                    }
                                                    return /^\s*$/.test(input);
                                                }
                                                if (data.spec.length == 0 || isBlankString(data.spec[0])) {
                                                    return html `
                                                                                                                    <div
                                                                                                                        style="border-radius: 7px;background: #EAEAEA;display: flex;height: 22px;padding: 4px 6px;justify-content: center;align-items: center;gap: 10px;color:#393939;font-weight: 400;"
                                                                                                                    >
                                                                                                                        單一規格
                                                                                                                    </div>
                                                                                                                `;
                                                }
                                                return data.spec
                                                    .map((spec) => {
                                                    return html ` <div
                                                                                                                        style="border-radius: 7px;background: #EAEAEA;display: flex;height: 22px;padding: 4px 6px;justify-content: center;align-items: center;gap: 10px;color:#393939;font-weight: 400;"
                                                                                                                    >
                                                                                                                        ${spec}
                                                                                                                    </div>`;
                                                })
                                                    .join('');
                                            })()}
                                                                                                    </div>
                                                                                                    <div style="color: #8D8D8D;font-size: 14px;font-weight: 400;">
                                                                                                        存貨單位 (SKU): ${(_a = data.sku) !== null && _a !== void 0 ? _a : ''}
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div class="ms-auto d-flex">
                                                                                                <div class="d-flex align-items-center justify-content-center" style="width: 128px;">-</div>
                                                                                                <div class="d-flex align-items-center justify-content-center" style="width: 60px;">
                                                                                                    ${data[dict[type]]}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    `;
                                        })
                                            .join('');
                                    })()}
                                                                    </div>
                                                                </div>`;
                                }, 'show');
                            }
                            orderData.orderData.lineItems.map((data, index) => {
                                subTotal += data.sale_price * data.return_count;
                            });
                            orderData.orderData.return_rebate = (_a = orderData.orderData.return_rebate) !== null && _a !== void 0 ? _a : '0';
                            orderData.orderData.return_discount = (_b = orderData.orderData.return_discount) !== null && _b !== void 0 ? _b : '0';
                            let returnTotal = ((subTotal + orderData.orderData.return_rebate) + orderData.orderData.return_discount);
                            return html `
                                                            ${(() => {
                                return [
                                    ['小計總額', subTotal],
                                    ['運費', orderData.orderData.shipment_fee],
                                    ['折抵購物金', orderData.orderData.use_rebate],
                                ]
                                    .map((data) => {
                                    return html `
                                                                            <div class="d-flex" style="gap: 24px;">
                                                                                <div style="font-size: 16px;font-weight: 400;">${data[0]}</div>
                                                                                <div style="width:158px;text-align: right;">${data[1]}</div>
                                                                            </div>
                                                                        `;
                                })
                                    .join('');
                            })()}
                                                            ${(() => {
                                let des = orderData.orderData.voucherList
                                    .filter((orderitem) => orderitem.reBackType == 'rebate')
                                    .map((orderitem) => {
                                    return orderitem.title;
                                })
                                    .join(' , ');
                                return [['折扣', orderData.orderData.return_inf.discount]]
                                    .map((item, index) => {
                                    des = des !== null && des !== void 0 ? des : '';
                                    return html `
                                                                            <div class="d-flex" style="gap: 70px;">
                                                                                <div class="d-flex flex-column justify-content-center " style="font-size: 16px;font-weight: 400;">
                                                                                    <div style="text-align: right;">${item[0]}</div>
                                                                                </div>

                                                                                <div class="d-flex " style="width: 112px;height: 100%">
                                                                                    <div
                                                                                        style="text-align: right;width: 112px;color: #4D86DB;text-decoration-line: underline;cursor: pointer"
                                                                                        onclick="${gvc.event(() => {
                                        showDetail(orderData.orderData.lineItems, item[0]);
                                    })}"
                                                                                    >
                                                                                        ${item[1] > 0 ? `-${item[1]}` : 0}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        `;
                                })
                                    .join('');
                            })()}
                                                            <div class="d-flex" style="gap: 24px;color:#393939;font-size: 16px;font-weight: 700;">
                                                                <div style="">退款總金額</div>
                                                                <div style="width:158px;text-align: right;">${orderData.orderData.return_inf.subTotal}</div>
                                                            </div>
                                                        `;
                        },
                        divCreate: { style: `display: flex;flex-direction: column;gap: 12px;width:100%;justify-content: center;align-items: end` },
                    })}
                                            `)}
                                            ${BgWidget.mainCard(html `
                                                    <div class="d-flex flex-column"
                                                         style="color: #393939;font-size: 16px;font-weight: 400;gap: 8px;">
                                                        <div style="font-weight: 700;">退貨備註</div>
                                                        <textarea
                                                                style="height: 102px;border-radius: 10px;border: 1px solid #DDD;padding: 15px;"
                                                            ">${(_b = (_a = orderData.orderData) === null || _a === void 0 ? void 0 : _a.return_order_remark) !== null && _b !== void 0 ? _b : ''}</textarea>
                                                    </div>
                                                `)} ${BgWidget.mainCard(html `
                                                <div
                                                    style="width:100%;display: flex;flex-direction: column;align-items: flex-start;gap: 18px;align-self: stretch;color:#393939;font-size: 16px;font-weight: 400;"
                                                >
                                                    <div style="font-weight: 700;">訂購人資訊</div>
                                                    ${(() => {
                        return [
                            ['姓名', 'name'],
                            ['電話', 'phone'],
                            ['電子信箱', 'email'],
                        ]
                            .map((data) => {
                            return drawInputRow(data[0], orderData.orderData.user_info[data[1]], true, 'width:100%;');
                        })
                            .join('');
                    })()}
                                                    ${gvc.bindView({
                        bind: 'inputRebate',
                        view: () => {
                            return html `
                                                                <div style="font-weight: 700;margin-bottom: 4px;">退貨後購物金增減</div>
                                                                <input
                                                                    class="w-100"
                                                                    style="height: 40px;padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;"
                                                                    value="${orderData.orderData.rebateChange}"
                                                                    type="number"
                                                                    disabled
                                                                />
                                                            `;
                        },
                        divCreate: { class: `d-flex flex-column w-100` },
                    })}
                                                </div>
                                            `)}
                                            ${BgWidget.mainCard(html `
                                                <div class="d-flex flex-column" style="color: #393939;font-size: 16px;font-weight: 700;gap: 12px;">
                                                    ${gvc.bindView({
                        bind: `refundTime`,
                        view: () => {
                            var _a;
                            return html ` <div class="d-flex flex-column w-50" style="gap: 12px;">
                                                                    <div>退款狀態</div>
                                                                    <select
                                                                        class="form-select"
                                                                        style="font-size: 16px;padding: 11px 12px;border-radius: 10px;border: 1px solid #DDD;"
                                                                        onchange="${gvc.event((e) => {
                                orderData.status = e.value;
                                if (e.value == '0') {
                                    orderData.orderData.refundTime = '';
                                }
                                gvc.notifyDataChange('refundTime');
                            })}"
                                                                        ${orderData.status == 1 ? 'disabled' : ''}
                                                                    >
                                                                        ${(() => {
                                let dataArray = [
                                    ['未退款', '0'],
                                    ['已退款', '1'],
                                ];
                                return dataArray.map((data) => {
                                    return html ` <option value="${data[1]}" ${data[1] == `${orderData.status}` ? 'selected' : ''}>${data[0]}</option> `;
                                });
                            })()}
                                                                    </select>
                                                                </div>
                                                                <div class="d-flex flex-column w-50" style="gap: 12px;">
                                                                    <div style="">退款時間</div>
                                                                    <input
                                                                        type="date"
                                                                        id="datetime"
                                                                        name="datetime"
                                                                        ${orderData.status == 1 ? '' : 'disabled'}
                                                                        value="${(_a = orderData.orderData.refundTime) !== null && _a !== void 0 ? _a : ''}"
                                                                        style="font-size: 16px;padding: 11px 12px;border-radius: 10px;border: 1px solid #DDD;"
                                                                        onchange="${gvc.event((e) => {
                                orderData.orderData.refundTime = e.value;
                            })}"
                                                                    />
                                                                </div>`;
                        },
                        divCreate: { class: `d-flex`, style: `gap: 18px;` },
                    })}
                                                    ${gvc.bindView({
                        bind: `inputReturn`,
                        view: () => {
                            var _a;
                            return html `
                                                                <div style="">實際退款金額</div>
                                                                <input
                                                                    style="width: 100%;height: 40px;padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;"
                                                                    value="${(_a = orderData.orderData.return_inf.subTotal) !== null && _a !== void 0 ? _a : 0}"
                                                                    onchange="${gvc.event((e) => {
                                orderData.orderData.return_inf.subTotal = e.value;
                            })}"
                                                                    disabled
                                                                />
                                                            `;
                        },
                        divCreate: {
                            class: `d-flex flex-column`,
                            style: `color: #393939;font-size: 16px;font-weight: 700;gap: 18px;margin-bottom:18px;`,
                        },
                    })}

                                                    <div style="margin-top: 12px;">退款銀行帳號</div>
                                                    ${gvc.bindView({
                        bind: 'return_Info',
                        view: () => {
                            var _a;
                            let dateArray = [
                                ['銀行代碼:', 'bankCode'],
                                ['銀行名稱:', 'bankName'],
                                ['銀行分行:', 'bankBranch'],
                                ['銀行戶名:', 'bankAccountName'],
                                ['銀行帳號:', 'bankAccountNumber'],
                            ];
                            orderData.orderData.bank_info = (_a = orderData.orderData.bank_info) !== null && _a !== void 0 ? _a : {
                                bankCode: '8321',
                                bankName: '萊恩銀行',
                                bankBranch: '台中分行',
                                bankAccountName: '王萊恩',
                                bankAccountNumber: '1234432112344321',
                            };
                            return dateArray
                                .map((data) => {
                                return html `
                                                                        <div class="d-flex flex-column" style="gap:8px;width: calc(50% - 10px);">
                                                                            <div style="text-align: left;">${data[0]}</div>
                                                                            <input
                                                                                class=" "
                                                                                value="${orderData.orderData.bank_info[data[1]]}"
                                                                                style="display: flex;height: 44px;padding: 11px 12px;align-items: center;gap: 21px;border-radius: 10px;border: 1px solid #DDD;"
                                                                                placeholder=""
                                                                                disabled
                                                                                onchange="${gvc.event((e) => {
                                    orderData.orderData.bank_info[data[1]] = e.value;
                                })}"
                                                                            />
                                                                        </div>
                                                                    `;
                            })
                                .join('');
                        },
                        divCreate: {
                            class: `d-flex  `,
                            style: `font-weight: 400;flex-wrap: wrap;gap:18px;`,
                        },
                    })}
                                                </div>
                                            `)}
                                        </div>
                                    `)}
                                ${BgWidget.mbContainer(240)}
                                <div class="update-bar-container">
                                    ${BgWidget.danger(gvc.event(() => {
                        vm.type = 'list';
                    }), '作廢')}
                                    ${BgWidget.cancel(gvc.event(() => {
                        vm.type = 'list';
                    }))}
                                    ${BgWidget.save(gvc.event(() => {
                        let passData = {
                            id: orderData.id,
                            status: orderData.status,
                            data: orderData.orderData,
                        };
                        ApiShop.putReturnOrder(passData).then((response) => {
                            let dialog = new ShareDialog(gvc.glitter);
                            dialog.dataLoading({ text: '上傳中', visible: false });
                            if (response.result) {
                                dialog.successMessage({ text: '更新成功' });
                                vm.type = 'list';
                            }
                            else {
                                dialog.errorMessage({ text: '更新異常' });
                            }
                        });
                    }), '送出')}
                                </div>
                            </div>
                        `);
                }
                catch (e) {
                    console.error(e);
                    return ``;
                }
            },
            divCreate: {},
        });
    }
    static searchOrder(gvc, vm) {
        let viewModel = {
            searchOrder: '',
            searchData: '',
            errorReport: '',
        };
        let checkList = [];
        let rebate = 0;
        let rebateOverflow = false;
        let rebateLoading = false;
        let detailShow = false;
        let detail2Show = false;
        return BgWidget.container(html `
                <div class="title-container">
                    ${BgWidget.goBack(gvc.event(() => {
            vm.type = 'list';
        }))}
                    ${BgWidget.title('新增退貨單')}
                </div>
                <div style="margin-top: 24px;"></div>
                ${BgWidget.mainCard(html `
                    <div style="display: flex;padding: 20px;flex-direction: column;align-items: flex-start;gap: 12px;align-self: stretch;">
                        <div style="font-size: 16px;font-weight: 700;">訂單編號*</div>
                        <input
                            style="display: flex;height: 40px;padding: 9px 18px;align-items: flex-start;gap: 10px;align-self: stretch;border-radius: 10px;border: 1px solid #DDD;font-size: 16px;font-weight: 400;"
                            placeholder="請輸入訂單編號"
                            value="${viewModel.searchOrder}"
                            onchange="${gvc.event((e) => {
            viewModel.searchOrder = e.value;
        })}"
                        />
                        <div
                            style="display: flex;padding: 6px 18px;justify-content: center;align-items: center;gap: 8px;border-radius: 10px;background: #EAEAEA;font-weight: 700;cursor: pointer;"
                            onclick="${gvc.event(() => {
            if (viewModel.searchOrder == '') {
                return;
            }
            ApiShop.getOrder({
                page: 0,
                limit: 100,
                search: viewModel.searchOrder,
                searchType: 'cart_token',
                archived: `false`,
                returnSearch: 'true',
            }).then((response) => {
                if (response.response.length == 0) {
                    viewModel.errorReport = '查無此訂單';
                }
                if (response.response.orderData.lineItems.length > 0) {
                    viewModel.searchData = response.response;
                }
                else {
                    viewModel.errorReport = '此訂單已無商品可退貨';
                }
                gvc.notifyDataChange(['notFind', 'orderDetail']);
            });
        })}"
                        >
                            查詢訂單
                        </div>

                        ${gvc.bindView({
            bind: 'notFind',
            view: () => {
                if (viewModel.searchOrder.length > 0 && !viewModel.searchData) {
                    return html `
                                        <div style="display: flex;padding: 24px 0px;justify-content: center;align-items: center;gap: 10px;align-self: stretch;color:#8D8D8D;">
                                            ${viewModel.errorReport}
                                        </div>
                                    `;
                }
                else {
                    return ``;
                }
            },
            divCreate: { style: `width:100%` },
        })}
                    </div>
                `)}
                <div style="margin-top: 24px;"></div>
                ${gvc.bindView({
            bind: 'orderDetail',
            view: () => {
                var _a;
                if (viewModel.searchData) {
                    let orderData = viewModel.searchData.orderData;
                    let lineItems = orderData.lineItems;
                    let origShipment = orderData.shipment_fee;
                    ApiUser.getUserRebate({ email: orderData.customer_info.email }).then((r) => {
                        rebate = r.response.data.point;
                        rebateLoading = true;
                        gvc.notifyDataChange(['inputRebate', 'inputReturn']);
                    });
                    return html `
                                <div style="display: flex;flex-direction: column;gap: 24px">
                                    ${BgWidget.mainCard(html `
                                        <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 18px;align-self: stretch;color:#393939;font-size: 16px;font-weight: 400;">
                                            <div style="font-weight: 700;">收件人資訊</div>
                                            ${(() => {
                        return [
                            ['姓名', 'name'],
                            ['電話', 'phone'],
                            ['電子信箱', 'email'],
                        ]
                            .map((data) => {
                            var _a;
                            return html `
                                                            <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 8px;width:100%">
                                                                <div>${data[0]}</div>
                                                                <input
                                                                    style="width: 100%;height: 40px;padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;"
                                                                    value="${(_a = orderData.user_info[data[1]]) !== null && _a !== void 0 ? _a : ''}"
                                                                    onchange="${gvc.event((e) => {
                                orderData.user_info[data[1]] = e.value;
                            })}"
                                                                />
                                                            </div>
                                                        `;
                        })
                            .join('');
                    })()}
                                        </div>
                                    `)}
                                    ${BgWidget.mainCard(html `
                                        <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 18px;align-self: stretch;color:#393939;font-size: 16px;font-weight: 400;">
                                            <div style="font-weight: 700;">退貨明細</div>
                                            <div style="display: flex;height: 34px;padding-right: 12px;align-items: center;gap: 18px;border-bottom: 1px solid #DDD;background: #FFF;width: 100%">
                                                <div style="flex:1 0 0">商品名稱</div>
                                                <div style="width:13%;text-align: center;margin-right: 20px;">退貨原因</div>
                                                <div style="width:5%;">單價</div>
                                                <div style="width:10%;text-align: center;">退貨數量</div>
                                                <div style="width:10%;text-align: center;">退回庫存數量</div>
                                                <div style="width:50px;text-align: right;">小計</div>
                                            </div>
                                        </div>

                                        ${(() => {
                        return lineItems
                            .map((data, index) => {
                            return gvc.bindView({
                                bind: `lineItem${index}`,
                                view: () => {
                                    var _a, _b, _c, _d;
                                    gvc.addStyle(`
                                                        input[type=number]::-webkit-outer-spin-button,
                                                        input[type=number]::-webkit-inner-spin-button {
                                                            -webkit-appearance: none;
                                                            margin: 0;
                                                        }
                                                        
                                                        /* Firefox */
                                                        input[type=number] {
                                                            -moz-appearance: textfield;
                                                        }
                                                    `);
                                    data.select = (_a = data.select) !== null && _a !== void 0 ? _a : true;
                                    let select = html ` <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" style="cursor: pointer;">
                                                                <rect width="16" height="16" rx="3" fill="#393939" />
                                                                <path d="M4.5 8.5L7 11L11.5 5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                            </svg>`;
                                    let unselect = html ` <div style="width: 16px;height: 16px;border-radius: 3px;border: 1px solid #DDD;cursor: pointer;"></div>`;
                                    return html ` <div
                                                                    onclick="${gvc.event(() => {
                                        data.select = !data.select;
                                        gvc.notifyDataChange([`lineItem${index}`, 'checkout']);
                                    })}"
                                                                >
                                                                    ${data.select ? select : unselect}
                                                                </div>
                                                                <div style="flex:1 0 0;display: flex;align-items: center;gap: 12px;">
                                                                    <img style="width: 54px;height: 54px;" src="${data.preview_image}" />
                                                                    <div class="d-flex justify-content-center flex-column" style="gap: 4px;">
                                                                        <div style="color:#393939;font-weight: 400;">${data.title}</div>
                                                                        <div class="d-flex " style="gap:4px;">
                                                                            ${(() => {
                                        var _a;
                                        data.return_count = (_a = data.return_count) !== null && _a !== void 0 ? _a : data.count;
                                        function isBlankString(input) {
                                            if (input === null || input === undefined || input === '' || input.length == 0) {
                                                return true;
                                            }
                                            return /^\s*$/.test(input);
                                        }
                                        if (data.spec.length == 0 || isBlankString(data.spec[0])) {
                                            return html `
                                                                                        <div
                                                                                            style="border-radius: 7px;background: #EAEAEA;display: flex;height: 22px;padding: 4px 6px;justify-content: center;align-items: center;gap: 10px;color:#393939;font-weight: 400;"
                                                                                        >
                                                                                            單一規格
                                                                                        </div>
                                                                                    `;
                                        }
                                        return data.spec
                                            .map((spec) => {
                                            return html ` <div
                                                                                            style="border-radius: 7px;background: #EAEAEA;display: flex;height: 22px;padding: 4px 6px;justify-content: center;align-items: center;gap: 10px;color:#393939;font-weight: 400;"
                                                                                        >
                                                                                            ${spec}
                                                                                        </div>`;
                                        })
                                            .join('');
                                    })()}
                                                                        </div>
                                                                        <div style="color: #8D8D8D;font-size: 14px;font-weight: 400;">存貨單位 (SKU): ${(_b = data.sku) !== null && _b !== void 0 ? _b : ''}</div>
                                                                    </div>
                                                                </div>
                                                                <div style="width:13%;margin-right: 20px;" class="d-flex align-items-center justify-content-center">
                                                                    <select
                                                                        class="form-select"
                                                                        style="width:80%;padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;"
                                                                        ${data.select ? `` : `disabled`}
                                                                        onchange="${gvc.event((e) => {
                                        data.return_reason = e.value;
                                        gvc.notifyDataChange([`lineItem${index}`, 'checkout']);
                                    })}"
                                                                    >
                                                                        ${(() => {
                                        var _a;
                                        let options = [
                                            {
                                                value: 'not_as_described',
                                                text: '商品不符合',
                                            },
                                            {
                                                value: 'damaged_in_shipping',
                                                text: '運送中毀損',
                                            },
                                            {
                                                value: 'not_as_described',
                                                text: '商品有瑕疵',
                                            },
                                            {
                                                value: 'not_as_described',
                                                text: '訂單有誤',
                                            },
                                        ];
                                        data.return_reason = (_a = data.return_reason) !== null && _a !== void 0 ? _a : 'not_as_described';
                                        return options.map((option) => {
                                            return html `
                                                                                    <option value="${option.value}" ${data.return_reason == option.value ? 'selected' : ''}>${option.text}</option>
                                                                                `;
                                        });
                                    })()}
                                                                    </select>
                                                                </div>
                                                                <div style="width:5%;">${data.sale_price}</div>
                                                                <div style="width:10%;" class="d-flex align-items-center justify-content-center">
                                                                    <input
                                                                        type="number"
                                                                        style="text-align: center;width:94px;border-radius: 10px;border: 1px solid #DDD;display: flex;padding: 9px 18px;${data.select
                                        ? ``
                                        : `text-decoration-line: strikethrough;`}"
                                                                        value="${(_c = data.return_count) !== null && _c !== void 0 ? _c : data.count}"
                                                                        min="0"
                                                                        max="${data.count}"
                                                                        ${data.select ? `` : `disabled`}
                                                                        onchange="${gvc.event((e) => {
                                        e.value = e.value > data.count ? data.count : e.value;
                                        e.value = e.value < 0 ? 0 : e.value;
                                        data.return_count = e.value;
                                        gvc.notifyDataChange([`lineItem${index}`, 'checkout']);
                                    })}"
                                                                    />
                                                                </div>
                                                                <div style="width:10%;" class="d-flex align-items-center justify-content-center">
                                                                    <input
                                                                        type="number"
                                                                        style="text-align: center;width:94px;border-radius: 10px;border: 1px solid #DDD;display: flex;padding: 9px 18px;${data.select
                                        ? ``
                                        : `text-decoration-line: strikethrough;`}"
                                                                        value="${(_d = data.return_stock) !== null && _d !== void 0 ? _d : 0}"
                                                                        max=${data.return_count}
                                                                        min="0"
                                                                        ${data.select ? `` : `disabled`}
                                                                        onchange="${gvc.event((e) => {
                                        e.value = e.value > data.return_count ? e.value : data.return_count;
                                        e.value = e.value < 0 ? 0 : e.value;
                                        data.return_stock = e.value;
                                        gvc.notifyDataChange([`lineItem${index}`, 'checkout']);
                                    })}"
                                                                    />
                                                                </div>
                                                                <div style="width:50px;text-align: right;">${data.return_count * data.sale_price}</div>`;
                                },
                                divCreate: { style: `display: flex;padding: 0px 4px 12px 0px;align-items: center;gap: 18px;background: #FFF;width: 100%` },
                            });
                        })
                            .join('');
                    })()}
                                        <div style="width: 100%;height: 1px;background-color: #DDD;margin-bottom:18px;"></div>
                                        ${gvc.bindView({
                        bind: `checkout`,
                        view: () => {
                            let subTotal = 0;
                            let returnDiscount = 0;
                            let returnRebate = 0;
                            let productTotal = 0;
                            checkList = [];
                            orderData.return_inf = {};
                            lineItems.map((data, index) => {
                                var _a, _b;
                                productTotal += data.sale_price * data.count;
                                if (data.select) {
                                    checkList.push(data);
                                    subTotal += data.sale_price * data.return_count;
                                    returnDiscount += ((_a = data.discount_price) !== null && _a !== void 0 ? _a : 0) * data.return_count;
                                    returnRebate += ((_b = data.rebate) !== null && _b !== void 0 ? _b : 0) * data.return_count;
                                }
                            });
                            orderData.shipment_fee = Math.round((origShipment * subTotal) / productTotal);
                            orderData.return_inf = {
                                subTotal: subTotal + orderData.shipment_fee - returnDiscount - orderData.use_rebate,
                                discount: returnDiscount,
                                rebate: returnRebate,
                            };
                            gvc.notifyDataChange([`inputReturn`, 'inputRebate']);
                            function showDetail(lineItem, type) {
                                let dict = {
                                    運費: 'shipment_fee',
                                    折扣: 'discount_price',
                                    購物金: 'rebate',
                                };
                                gvc.glitter.innerDialog((gvc) => {
                                    return html ` <div style="width: 912px;height: 450px;border-radius: 10px;background: #FFF;color: #393939;" class="d-flex flex-column ">
                                                            <div
                                                                class="d-flex align-items-center"
                                                                style="border-radius: 10px 10px 0 0 ;background: #F2F2F2;padding: 12px 20px;font-size: 16px;font-weight: 700;"
                                                            >
                                                                ${type}明細
                                                                <svg
                                                                    class="ms-auto"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="14"
                                                                    height="14"
                                                                    viewBox="0 0 14 14"
                                                                    fill="none"
                                                                    onclick="${gvc.event(() => {
                                        gvc.glitter.closeDiaLog();
                                    })}"
                                                                >
                                                                    <path d="M1 1L13 13" stroke="#393939" stroke-linecap="round" />
                                                                    <path d="M13 1L1 13" stroke="#393939" stroke-linecap="round" />
                                                                </svg>
                                                            </div>
                                                            <div class="d-flex" style="padding: 24px 24px 12px;">
                                                                <div>商品名稱</div>
                                                                <div class="ms-auto d-flex">
                                                                    <div class="d-flex align-items-center justify-content-center" style="width: 60px;">運費</div>
                                                                </div>
                                                            </div>
                                                            <div class="" style="width: 872px;height:1px;background-color: #DDD;margin: 0 20px;"></div>
                                                            <div class="d-flex flex-column" style="width: 100%;padding: 17px 24px;gap:12px;">
                                                                ${(() => {
                                        return lineItem
                                            .map((data) => {
                                            var _a;
                                            return html `
                                                                                <div class="d-flex" style="padding: ">
                                                                                    <div class="d-flex align-items-center" style="gap:12px;">
                                                                                        <img style="width: 54px;height: 54px;" src="${data.preview_image}" />
                                                                                        <div class="d-flex justify-content-center flex-column" style="gap: 4px;">
                                                                                            <div
                                                                                                style="color:#393939;font-weight: 400;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;width: 250px;"
                                                                                            >
                                                                                                ${data.title}
                                                                                            </div>
                                                                                            <div class="d-flex " style="gap:4px;">
                                                                                                ${(() => {
                                                var _a;
                                                data.return_count = (_a = data.return_count) !== null && _a !== void 0 ? _a : data.count;
                                                function isBlankString(input) {
                                                    if (input === null || input === undefined || input === '' || input.length == 0) {
                                                        return true;
                                                    }
                                                    return /^\s*$/.test(input);
                                                }
                                                if (data.spec.length == 0 || isBlankString(data.spec[0])) {
                                                    return html `
                                                                                                            <div
                                                                                                                style="border-radius: 7px;background: #EAEAEA;display: flex;height: 22px;padding: 4px 6px;justify-content: center;align-items: center;gap: 10px;color:#393939;font-weight: 400;"
                                                                                                            >
                                                                                                                單一規格
                                                                                                            </div>
                                                                                                        `;
                                                }
                                                return data.spec
                                                    .map((spec) => {
                                                    return html ` <div
                                                                                                                style="border-radius: 7px;background: #EAEAEA;display: flex;height: 22px;padding: 4px 6px;justify-content: center;align-items: center;gap: 10px;color:#393939;font-weight: 400;"
                                                                                                            >
                                                                                                                ${spec}
                                                                                                            </div>`;
                                                })
                                                    .join('');
                                            })()}
                                                                                            </div>
                                                                                            <div style="color: #8D8D8D;font-size: 14px;font-weight: 400;">存貨單位 (SKU): ${(_a = data.sku) !== null && _a !== void 0 ? _a : ''}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class="ms-auto d-flex">
                                                                                        <div class="d-flex align-items-center justify-content-center" style="width: 128px;">-</div>
                                                                                        <div class="d-flex align-items-center justify-content-center" style="width: 60px;">${data[dict[type]]}</div>
                                                                                    </div>
                                                                                </div>
                                                                            `;
                                        })
                                            .join('');
                                    })()}
                                                            </div>
                                                        </div>`;
                                }, 'show');
                            }
                            return html `
                                                    ${(() => {
                                return [
                                    ['小計總額', subTotal],
                                    ['運費', orderData.shipment_fee],
                                    ['折抵購物金', orderData.use_rebate],
                                ]
                                    .map((data) => {
                                    return html `
                                                                    <div class="d-flex" style="gap: 24px;">
                                                                        <div style="font-size: 16px;font-weight: 400;">${data[0]}</div>
                                                                        <div style="width:158px;text-align: right;">${data[1]}</div>
                                                                    </div>
                                                                `;
                                })
                                    .join('');
                            })()}
                                                    ${(() => {
                                let des = orderData.voucherList
                                    .filter((orderitem) => orderitem.reBackType == 'rebate')
                                    .map((orderitem) => {
                                    return orderitem.title;
                                })
                                    .join(' , ');
                                return [['折扣', orderData.return_inf.discount]]
                                    .map((item, index) => {
                                    des = des !== null && des !== void 0 ? des : '';
                                    return html `
                                                                    <div class="d-flex" style="gap: 70px;">
                                                                        <div class="d-flex flex-column justify-content-center " style="font-size: 16px;font-weight: 400;">
                                                                            <div style="text-align: right;">${item[0]}</div>
                                                                        </div>

                                                                        <div class="d-flex " style="width: 112px;height: 100%">
                                                                            <div
                                                                                style="text-align: right;width: 112px;color: #4D86DB;text-decoration-line: underline;cursor: pointer"
                                                                                onclick="${gvc.event(() => {
                                        showDetail(checkList, item[0]);
                                    })}"
                                                                            >
                                                                                ${item[1] > 0 ? `-${item[1]}` : 0}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                `;
                                })
                                    .join('');
                            })()}
                                                    <div class="d-flex" style="gap: 24px;color:#393939;font-size: 16px;font-weight: 700;">
                                                        <div style="">退款總金額</div>
                                                        <div style="width:158px;text-align: right;">${orderData.return_inf.subTotal}</div>
                                                    </div>
                                                `;
                        },
                        divCreate: { style: `display: flex;flex-direction: column;gap: 12px;width:100%;justify-content: center;align-items: end` },
                    })}
                                    `)}
                                    ${BgWidget.mainCard(html `
                                        <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 18px;align-self: stretch;color:#393939;font-size: 16px;font-weight: 400;">
                                            <div style="font-weight: 700;">訂購人資訊</div>
                                            ${(() => {
                        return [
                            ['姓名', 'name'],
                            ['電話', 'phone'],
                            ['電子信箱', 'email'],
                        ]
                            .map((data) => {
                            var _a;
                            return html `
                                                            <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 8px;width:100%">
                                                                <div>${data[0]}</div>
                                                                <input
                                                                    style="width: 100%;height: 40px;padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;"
                                                                    disabled
                                                                    value="${(_a = orderData.customer_info[data[1]]) !== null && _a !== void 0 ? _a : ''}"
                                                                    onchange="${gvc.event((e) => {
                                orderData.customer_info[data[1]] = e.value;
                            })}"
                                                                />
                                                            </div>
                                                        `;
                        })
                            .join('');
                    })()}
                                            ${gvc.bindView({
                        bind: 'inputRebate',
                        view: () => {
                            let rebateDiff = orderData.use_rebate - orderData.return_inf.rebate;
                            orderData.rebateChange = rebateDiff;
                            if (rebate + rebateDiff < 0) {
                                orderData.rebateChange = -rebate;
                                rebateOverflow = true;
                            }
                            return html `
                                                    <div style="font-weight: 700;margin-bottom: 12px;">持有購物金
                                                    </div>
                                                    <div style="margin-bottom: 18px;">${rebate}</div>
                                                    </div>
                                                    <div style="font-weight: 700;margin-bottom: 4px;">退貨後購物金增減
                                                    </div>
                                                    <input class="w-100"
                                                           style="height: 40px;padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;"
                                                           value="${orderData.rebateChange}"
                                                           max="${orderData.use_rebate}"
                                                           min="${-rebate}"
                                                           type="number"
                                                           onchange="${gvc.event((e) => {
                                orderData.rebateChange = e.value;
                            })}">
                                                    ${gvc.bindView({
                                bind: 'rebateHint',
                                view: () => {
                                    if (rebate + rebateDiff >= 0) {
                                        return ``;
                                    }
                                    return html ` <div class="d-flex align-items-center" style="margin-top: 8px;">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                                                    <path
                                                                        d="M8 2C9.72391 2 11.3772 2.68482 12.5962 3.90381C13.8152 5.12279 14.5 6.77609 14.5 8.5C14.5 10.2239 13.8152 11.8772 12.5962 13.0962C11.3772 14.3152 9.72391 15 8 15C6.27609 15 4.62279 14.3152 3.40381 13.0962C2.18482 11.8772 1.5 10.2239 1.5 8.5C1.5 6.77609 2.18482 5.12279 3.40381 3.90381C4.62279 2.68482 6.27609 2 8 2ZM8 16.5C10.1217 16.5 12.1566 15.6571 13.6569 14.1569C15.1571 12.6566 16 10.6217 16 8.5C16 6.37827 15.1571 4.34344 13.6569 2.84315C12.1566 1.34285 10.1217 0.5 8 0.5C5.87827 0.5 3.84344 1.34285 2.34315 2.84315C0.842855 4.34344 0 6.37827 0 8.5C0 10.6217 0.842855 12.6566 2.34315 14.1569C3.84344 15.6571 5.87827 16.5 8 16.5ZM8 4.5C7.58437 4.5 7.25 4.83437 7.25 5.25V8.75C7.25 9.16562 7.58437 9.5 8 9.5C8.41562 9.5 8.75 9.16562 8.75 8.75V5.25C8.75 4.83437 8.41562 4.5 8 4.5ZM9 11.5C9 11.2348 8.89464 10.9804 8.70711 10.7929C8.51957 10.6054 8.26522 10.5 8 10.5C7.73478 10.5 7.48043 10.6054 7.29289 10.7929C7.10536 10.9804 7 11.2348 7 11.5C7 11.7652 7.10536 12.0196 7.29289 12.2071C7.48043 12.3946 7.73478 12.5 8 12.5C8.26522 12.5 8.51957 12.3946 8.70711 12.2071C8.89464 12.0196 9 11.7652 9 11.5Z"
                                                                        fill="#393939"
                                                                    />
                                                                </svg>
                                                                <div style="font-size: 14px;font-weight: 400;margin-left: 4px;margin-right: 6px;">減額不可超過顧客持有的購物金</div>
                                                                <div
                                                                    style="font-size: 14px;font-style: normal;font-weight: 400;color: #4D86DB;text-decoration-line: underline;cursor: help;position: relative;"
                                                                    onmouseenter="${gvc.event(() => {
                                        detailShow = true;
                                        gvc.notifyDataChange('rebateHintDetail');
                                    })}"
                                                                >
                                                                    詳細說明
                                                                    ${gvc.bindView({
                                        bind: 'rebateHintDetail',
                                        view: () => {
                                            if (!detailShow) {
                                                return ``;
                                            }
                                            return html `
                                                                                <div
                                                                                    class="hintView"
                                                                                    style="cursor: default;"
                                                                                    onmouseleave="${gvc.event(() => {
                                                detailShow = false;
                                                gvc.notifyDataChange('rebateHintDetail');
                                            })}"
                                                                                >
                                                                                    顧客使用的購物金 - 此筆訂單獲得的購物金 = 退貨後應增減的購物金
                                                                                    <br />
                                                                                    ${orderData.use_rebate} - ${orderData.return_inf.rebate} = ${orderData.use_rebate - orderData.return_inf.rebate}
                                                                                    <br />
                                                                                    <br />
                                                                                    由於顧客購物金不足${orderData.use_rebate - orderData.return_inf.rebate + rebate}
                                                                                    ，建議手動調整退款金額來彌補，並說明退款金額變更的原因
                                                                                </div>
                                                                            `;
                                        },
                                        divCreate: () => {
                                            const css = String.raw;
                                            return {
                                                style: css `
                                                                                    width: 645px;
                                                                                    padding: 10px;
                                                                                    border-radius: 10px;
                                                                                    background: #393939;
                                                                                    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.08);
                                                                                    position: absolute;
                                                                                    top: 28px;
                                                                                    left: -6px;
                                                                                    color: #fff;
                                                                                    font-size: 16px;
                                                                                    font-weight: 400;
                                                                                    ${!detailShow ? `display:none;` : ``}
                                                                                `,
                                                class: ``,
                                            };
                                        },
                                    })}
                                                                </div>
                                                            </div>`;
                                },
                                divCreate: {},
                            })}
                                                `;
                        },
                        divCreate: { class: `d-flex flex-column w-100` },
                    })}
                                        </div>
                                    `)}
                                    ${BgWidget.mainCard(html `
                                        <div class="d-flex flex-column" style="color: #393939;font-size: 16px;font-weight: 400;gap: 8px;">
                                            <div style="font-weight: 700;">退貨備註</div>
                                            <textarea
                                                style="height: 102px;border-radius: 10px;border: 1px solid #DDD;padding: 15px;"
                                                onchange="${gvc.event((e) => {
                        orderData.return_order_remark = e.value;
                    })}"
                                            >
${(_a = orderData === null || orderData === void 0 ? void 0 : orderData.return_order_remark) !== null && _a !== void 0 ? _a : ''}</textarea
                                            >
                                        </div>
                                    `)}
                                    ${BgWidget.mainCard(html `
                                        ${gvc.bindView({
                        bind: `inputReturn`,
                        view: () => {
                            var _a, _b;
                            return html `
                                                    <div style="">實際退款金額</div>
                                                    <input
                                                        style="width: 100%;height: 40px;padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;"
                                                        value="${(_b = (_a = orderData === null || orderData === void 0 ? void 0 : orderData.return_inf) === null || _a === void 0 ? void 0 : _a.subTotal) !== null && _b !== void 0 ? _b : 0}"
                                                        onchange="${gvc.event((e) => {
                                orderData.return_inf.subTotal = e.value;
                            })}"
                                                    />
                                                    <div class="d-flex" style="gap: 4px;">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                                            <path
                                                                d="M8 2C9.72391 2 11.3772 2.68482 12.5962 3.90381C13.8152 5.12279 14.5 6.77609 14.5 8.5C14.5 10.2239 13.8152 11.8772 12.5962 13.0962C11.3772 14.3152 9.72391 15 8 15C6.27609 15 4.62279 14.3152 3.40381 13.0962C2.18482 11.8772 1.5 10.2239 1.5 8.5C1.5 6.77609 2.18482 5.12279 3.40381 3.90381C4.62279 2.68482 6.27609 2 8 2ZM8 16.5C10.1217 16.5 12.1566 15.6571 13.6569 14.1569C15.1571 12.6566 16 10.6217 16 8.5C16 6.37827 15.1571 4.34344 13.6569 2.84315C12.1566 1.34285 10.1217 0.5 8 0.5C5.87827 0.5 3.84344 1.34285 2.34315 2.84315C0.842855 4.34344 0 6.37827 0 8.5C0 10.6217 0.842855 12.6566 2.34315 14.1569C3.84344 15.6571 5.87827 16.5 8 16.5ZM8 4.5C7.58437 4.5 7.25 4.83437 7.25 5.25V8.75C7.25 9.16562 7.58437 9.5 8 9.5C8.41562 9.5 8.75 9.16562 8.75 8.75V5.25C8.75 4.83437 8.41562 4.5 8 4.5ZM9 11.5C9 11.2348 8.89464 10.9804 8.70711 10.7929C8.51957 10.6054 8.26522 10.5 8 10.5C7.73478 10.5 7.48043 10.6054 7.29289 10.7929C7.10536 10.9804 7 11.2348 7 11.5C7 11.7652 7.10536 12.0196 7.29289 12.2071C7.48043 12.3946 7.73478 12.5 8 12.5C8.26522 12.5 8.51957 12.3946 8.70711 12.2071C8.89464 12.0196 9 11.7652 9 11.5Z"
                                                                fill="#393939"
                                                            />
                                                        </svg>
                                                        <div style="font-size: 14px;font-style: normal;font-weight: 400;color:#393939;">
                                                            由於顧客購物金不足
                                                            <span
                                                                style="color: #4D86DB;text-decoration-line: underline;cursor: help;position: relative"
                                                                onmouseenter="${gvc.event(() => {
                                if (!detail2Show) {
                                    detail2Show = true;
                                    gvc.notifyDataChange('inputReturn');
                                }
                            })}"
                                                                >${-(orderData.use_rebate - orderData.return_inf.rebate + rebate)}
                                                                <div
                                                                    style="width: 455px;font-size: 16px;;position: absolute;left: 0;top: 30px;display: ${detail2Show
                                ? 'inline-flex'
                                : 'none'};padding: 10px;flex-direction: column;justify-content: center;gap: 10px;border-radius: 10px;background:#393939;box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.08);rgba(255, 255, 255, 1);color:white;cursor: default;"
                                                                    onmouseleave="${gvc.event(() => {
                                detail2Show = false;
                                gvc.notifyDataChange('inputReturn');
                            })}"
                                                                >
                                                                    持有購物金 + 退貨後應增減的購物金 = 顧客不足的購物金金額<br />
                                                                    ${rebate} + (${orderData.use_rebate - orderData.return_inf.rebate} ) =
                                                                    ${orderData.use_rebate - orderData.return_inf.rebate + rebate}
                                                                </div> </span
                                                            >，建議手動調整退款金額來彌補，並說明退款金額變更的原因
                                                        </div>
                                                    </div>
                                                `;
                        },
                        divCreate: {
                            class: `d-flex flex-column`,
                            style: `color: #393939;font-size: 16px;font-weight: 700;gap: 18px;margin-bottom:18px;`,
                        },
                    })}
                                        <div class="d-flex flex-column" style="color: #393939;font-size: 16px;font-weight: 700;gap: 18px;">
                                            <div style="">退款銀行帳號</div>
                                            ${gvc.bindView({
                        bind: 'return_Info',
                        view: () => {
                            var _a;
                            let dateArray = [
                                ['銀行代碼:', 'bankCode'],
                                ['銀行名稱:', 'bankName'],
                                ['銀行分行:', 'bankBranch'],
                                ['銀行戶名:', 'bankAccountName'],
                                ['銀行帳號:', 'bankAccountNumber'],
                            ];
                            orderData.bank_info = (_a = orderData.bank_info) !== null && _a !== void 0 ? _a : {
                                bankCode: '8321',
                                bankName: '萊恩銀行',
                                bankBranch: '台中分行',
                                bankAccountName: '王萊恩',
                                bankAccountNumber: '1234432112344321',
                            };
                            return dateArray
                                .map((data) => {
                                return html `
                                                        <div class="d-flex flex-column"
                                                             style="gap:8px;width: calc(50% - 9px)">
                                                            <div style=text-align:left;">${data[0]}</div>
                                                            <input class=""
                                                                   value="${orderData.bank_info[data[1]]}"
                                                                   style="display: flex;height: 44px;padding: 11px 12px;align-items: center;gap: 21px;border-radius: 10px;border: 1px solid #DDD;background: #FFF;"
                                                                   placeholder="" onchange="${gvc.event((e) => {
                                    orderData.bank_info[data[1]] = e.value;
                                })}">
                                                        </div>
                                                    `;
                            })
                                .join('');
                        },
                        divCreate: {
                            class: `d-flex d-flex flex-wrap `,
                            style: `gap:18px;font-weight: 400;`,
                        },
                    })}
                                        </div>
                                    `)}
                                    ${BgWidget.mbContainer(240)}
                                    <div class="update-bar-container">
                                        ${BgWidget.cancel(gvc.event(() => {
                        vm.type = 'list';
                    }))}
                                        ${BgWidget.save(gvc.event(() => {
                        viewModel.searchData.orderData.returnProgress = '1';
                        viewModel.searchData.orderData.lineItems = checkList;
                        function checkPass() {
                            if (viewModel.searchData.orderData.return_inf.subTotal < 1) {
                                return false;
                            }
                            return true;
                        }
                        if (checkPass()) {
                            const dialog = new ShareDialog(gvc.glitter);
                            dialog.dataLoading({ visible: true });
                            ApiShop.postReturnOrder(viewModel.searchData).then((r) => {
                                dialog.dataLoading({ visible: false });
                                vm.type = 'list';
                            });
                        }
                    }))}
                                    </div>
                                </div>
                            `;
                }
                return ``;
            },
            divCreate: {},
        })}
            `);
    }
}
window.glitter.setModule(import.meta.url, ShoppingReturnOrderManager);
