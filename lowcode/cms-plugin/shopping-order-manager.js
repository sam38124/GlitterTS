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
import { ShareDialog } from '../dialog/ShareDialog.js';
import { BgListComponent } from '../backend-manager/bg-list-component.js';
import { FilterOptions } from './filter-options.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { UserList } from './user-list.js';
const html = String.raw;
export class ShoppingOrderManager {
    static main(gvc) {
        const filterID = gvc.glitter.getUUID();
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
        };
        const ListComp = new BgListComponent(gvc, vm, FilterOptions.orderFilterFrame);
        vm.filter = ListComp.getFilterObject();
        return gvc.bindView(() => {
            const id = glitter.getUUID();
            return {
                bind: vm.id,
                dataList: [{ obj: vm, key: 'type' }],
                view: () => {
                    if (vm.type === 'list') {
                        return BgWidget.container(html `
                                <div class="d-flex w-100 align-items-center mb-3 ">
                                    ${BgWidget.title('訂單管理')}
                                    <div class="flex-fill"></div>
                                    <button
                                        class="btn btn-primary-c d-none"
                                        style="height:45px;font-size: 14px;"
                                        onclick="${gvc.event(() => {
                            vm.type = 'add';
                        })}"
                                    >
                                        新增訂單
                                    </button>
                                </div>
                                ${BgWidget.table({
                            gvc: gvc,
                            getData: (vmi) => {
                                ApiShop.getOrder({
                                    page: vmi.page - 1,
                                    limit: 20,
                                    search: vm.query || undefined,
                                    searchType: vm.queryType || 'name',
                                    orderString: vm.orderString,
                                    filter: vm.filter,
                                }).then((data) => {
                                    vmi.pageSize = Math.ceil(data.response.total / 20);
                                    vm.dataList = data.response.data;
                                    function getDatalist() {
                                        return data.response.data.map((dd) => {
                                            return [
                                                {
                                                    key: EditorElem.checkBoxOnly({
                                                        gvc: gvc,
                                                        def: !data.response.data.find((dd) => {
                                                            return !dd.checked;
                                                        }),
                                                        callback: (result) => {
                                                            data.response.data.map((dd) => {
                                                                dd.checked = result;
                                                            });
                                                            vmi.data = getDatalist();
                                                            vmi.callback();
                                                            gvc.notifyDataChange(filterID);
                                                        },
                                                    }),
                                                    value: EditorElem.checkBoxOnly({
                                                        gvc: gvc,
                                                        def: dd.checked,
                                                        callback: (result) => {
                                                            dd.checked = result;
                                                            vmi.data = getDatalist();
                                                            vmi.callback();
                                                            gvc.notifyDataChange(filterID);
                                                        },
                                                        style: 'height:40px;',
                                                    }),
                                                },
                                                {
                                                    key: '訂單編號',
                                                    value: dd.cart_token,
                                                },
                                                {
                                                    key: '訂單日期',
                                                    value: glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd hh:mm:ss'),
                                                },
                                                {
                                                    key: '訂購人',
                                                    value: dd.orderData.user_info ? dd.orderData.user_info.name : `匿名`,
                                                },
                                                {
                                                    key: '訂單金額',
                                                    value: dd.orderData.total,
                                                },
                                                {
                                                    key: '付款狀態',
                                                    value: (() => {
                                                        switch (dd.status) {
                                                            case 0:
                                                                return `<div class="badge" style="border-radius: 7px;background: #FFD5D0;height: 22px;padding: 4px 6px;font-size: 14px;color:#393939;">未付款</div>`;
                                                            case 1:
                                                                return `<div class="badge" style="border-radius: 7px;background: #D8ECDA;height: 22px;padding: 4px 6px;font-size: 14px;color:#393939;">已付款</div>`;
                                                            case -1:
                                                                return `<div class="badge" style="border-radius: 7px;background: #FFD5D0;height: 22px;padding: 4px 6px;font-size: 14px;color:#393939;">付款失敗</div>`;
                                                            case -2:
                                                                return `<div class="badge" style="border-radius: 7px;background: #FFD5D0;height: 22px;padding: 4px 6px;font-size: 14px;color:#393939;">已退款</div>`;
                                                        }
                                                    })(),
                                                },
                                                {
                                                    key: '出貨狀態',
                                                    value: (() => {
                                                        var _a;
                                                        switch ((_a = dd.orderData.progress) !== null && _a !== void 0 ? _a : 'wait') {
                                                            case 'wait':
                                                                return `<div class="badge" style="border-radius: 7px;background: #FFD5D0;height: 22px;padding: 4px 6px;font-size: 14px;color:#393939;">未出貨</div>`;
                                                            case 'shipping':
                                                                return `<div class="badge" style="border-radius: 7px;background: #FFE9B2;height: 22px;padding: 4px 6px;font-size: 14px;color:#393939;">已出貨</div>`;
                                                            case 'finish':
                                                                return `<div class="badge" style="border-radius: 7px;background: #D8ECDA;height: 22px;padding: 4px 6px;font-size: 14px;color:#393939;">已取貨</div>`;
                                                            case 'arrived':
                                                                return `<div class="badge" style="border-radius: 7px;background: #FFE9B2;height: 22px;padding: 4px 6px;font-size: 14px;color:#393939;">已送達</div>`;
                                                            case 'returns':
                                                                return `<div class="badge" style="border-radius: 7px;background: #FFD5D0;height: 22px;padding: 4px 6px;font-size: 14px;color:#393939;">已退貨</div>`;
                                                        }
                                                    })(),
                                                },
                                                {
                                                    key: '訂單狀態',
                                                    value: (() => {
                                                        var _a;
                                                        switch ((_a = dd.orderData.orderStatus) !== null && _a !== void 0 ? _a : '0') {
                                                            case '-1':
                                                                return `<div class="badge  " style="font-size: 14px;color:#393939;height: 22px;padding: 4px 6px;border-radius: 7px;background: #FFD5D0;">已取消</div>`;
                                                            case '0':
                                                                return `<div class="badge" style="font-size: 14px;color:#393939;height: 22px;padding: 4px 6px;border-radius: 7px;background: #FFE9B2;">處理中</div>`;
                                                            case '1':
                                                                return `<div class="badge " style="font-size: 14px;color:#393939;border-radius: 7px;background: #D8ECDA;height: 22px;padding: 4px 6px;">已完成</div>`;
                                                        }
                                                    })(),
                                                },
                                            ].map((dd) => {
                                                dd.value = `<div style="line-height:40px;">${dd.value}</div>`;
                                                return dd;
                                            });
                                        });
                                    }
                                    vmi.data = getDatalist();
                                    vmi.loading = false;
                                    vmi.callback();
                                });
                            },
                            rowClick: (data, index) => {
                                vm.data = vm.dataList[index];
                                vm.type = 'replace';
                            },
                            filter: html `
                                        <div>
                                            <div style="display: flex; align-items: center; gap: 10px;">
                                                ${BgWidget.selectFilter({
                                gvc,
                                callback: (value) => {
                                    vm.queryType = value;
                                    gvc.notifyDataChange(vm.id);
                                },
                                default: vm.queryType || 'name',
                                options: FilterOptions.orderSelect,
                            })}
                                                ${BgWidget.searchFilter(gvc.event((e, event) => {
                                vm.query = e.value;
                                gvc.notifyDataChange(vm.id);
                            }), vm.query || '', '搜尋所有訂單')}
                                                ${BgWidget.funnelFilter({
                                gvc,
                                callback: () => ListComp.showRightMenu(FilterOptions.orderFunnel),
                            })}
                                                ${BgWidget.updownFilter({
                                gvc,
                                callback: (value) => {
                                    vm.orderString = value;
                                    gvc.notifyDataChange(vm.id);
                                },
                                default: vm.orderString || 'default',
                                options: FilterOptions.orderOrderBy,
                            })}
                                            </div>
                                            <div>${ListComp.getFilterTags(FilterOptions.orderFunnel)}</div>
                                        </div>
                                        ${gvc.bindView(() => {
                                return {
                                    bind: vm.filterId,
                                    view: () => {
                                        return [
                                            html `<span class="fs-7 fw-bold">操作選項</span>
                                                            <button
                                                                class="btn btn-danger fs-7 px-2"
                                                                style="height: 30px; border: none;"
                                                                onclick="${gvc.event(() => {
                                                const dialog = new ShareDialog(gvc.glitter);
                                                dialog.checkYesOrNot({
                                                    text: '是否確認移除所選項目?',
                                                    callback: (response) => {
                                                        if (response) {
                                                            dialog.dataLoading({ visible: true });
                                                            ApiUser.deleteUser({
                                                                id: vm.dataList
                                                                    .filter((dd) => {
                                                                    return dd.checked;
                                                                })
                                                                    .map((dd) => {
                                                                    return dd.id;
                                                                })
                                                                    .join(`,`),
                                                            }).then((res) => {
                                                                dialog.dataLoading({ visible: false });
                                                                if (res.result) {
                                                                    vm.dataList = undefined;
                                                                    gvc.notifyDataChange(vm.id);
                                                                }
                                                                else {
                                                                    dialog.errorMessage({ text: '刪除失敗' });
                                                                }
                                                            });
                                                        }
                                                    },
                                                });
                                            })}"
                                                            >
                                                                批量移除
                                                            </button>`,
                                        ].join(``);
                                    },
                                    divCreate: () => {
                                        return {
                                            class: `d-flex align-items-center p-2 py-3 ${!vm.dataList ||
                                                !vm.dataList.find((dd) => {
                                                    return dd.checked;
                                                })
                                                ? `d-none`
                                                : ``}`,
                                            style: `height: 40px; gap: 10px; margin-top: 10px;`,
                                        };
                                    },
                                };
                            })}
                                    `,
                        })}
                            `, 1200);
                    }
                    else if (vm.type == 'replace') {
                        return this.replaceOrder(gvc, vm, id);
                    }
                    else {
                        return ``;
                    }
                },
            };
        });
    }
    static replaceOrder(gvc, vm, id) {
        var _a, _b;
        const glitter = gvc.glitter;
        const origData = JSON.parse(JSON.stringify(vm.data));
        const orderData = (_a = vm.data) !== null && _a !== void 0 ? _a : {
            id: 3469,
            cart_token: '1699540611634',
            status: 1,
            email: 'sam38124@gmail.com',
            orderData: {
                email: 'sam38124@gmail.com',
                total: 99000,
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
        };
        let userData = {};
        const mainViewID = gvc.glitter.getUUID();
        orderData.orderData.progress = (_b = orderData.orderData.progress) !== null && _b !== void 0 ? _b : 'wait';
        gvc.addStyle(`
            .bg-warning {
                background: #ffef9d !important;
                color: black !important;
            }
        `);
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
            }
        }
        const vt = {
            paymentBadge: () => {
                if (orderData.status === 0) {
                    return drawBadge('red', '未付款');
                }
                else if (orderData.status === 1) {
                    return drawBadge('green', '已付款');
                }
                else if (orderData.status === -2) {
                    return drawBadge('red', '已退款');
                }
                else {
                    return drawBadge('red', '付款失敗');
                }
            },
            outShipBadge: () => {
                if (orderData.orderData.progress === 'finish') {
                    return drawBadge('green', '已出貨');
                }
                else if (orderData.orderData.progress === 'shipping') {
                    return drawBadge('yellow', '配送中');
                }
                else {
                    return drawBadge('red', '未出貨');
                }
            },
            orderStatusBadge: () => {
                if (orderData.orderData.orderStatus === '1') {
                    return drawBadge('green', '已完成');
                }
                else if (orderData.orderData.orderStatus === '0') {
                    return drawBadge('yellow', '處理中');
                }
                else {
                    return drawBadge('red', '已取消');
                }
            },
        };
        ApiUser.getUsersDataWithEmail(orderData.email).then((res) => {
            console.log('userData -- ', res);
            userData = res.response;
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
                var _a, _b, _c, _d, _e, _f;
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
                        <div class="d-flex flex-column" style="padding-bottom:48px;">
                            ${BgWidget.container(html `
                                    <div class="d-flex w-100 align-items-center mb-3 ">
                                        ${BgWidget.goBack(gvc.event(() => {
                    vm.type = 'list';
                }))}
                                        ${BgWidget.title(html ` <div class="d-flex align-items-center">
                                            <div class="d-flex flex-column">
                                                <div class="align-items-center" style="gap:10px;color: #393939;font-size: 24px;font-weight: 700;">#${orderData.cart_token}</div>
                                                <div class="d-flex align-items-center" style="color: #8D8D8D;font-size: 16px;font-weight: 400;gap:10px;">
                                                    訂單成立時間 :
                                                    ${glitter.ut.dateFormat(new Date(orderData.created_time), 'yyyy-MM-dd hh:mm')}${vt.paymentBadge()}${vt.outShipBadge()}${vt.orderStatusBadge()}
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
                    writeEdit(origData, orderData);
                    const dialog = new ShareDialog(gvc.glitter);
                    dialog.dataLoading({ text: '上傳中', visible: true });
                    ApiShop.putOrder({
                        id: `${orderData.id}`,
                        order_data: orderData.orderData,
                        status: orderData.status,
                    }).then((response) => {
                        dialog.dataLoading({ text: '上傳中', visible: false });
                        if (response.result) {
                            dialog.successMessage({ text: '更新成功!' });
                            gvc.notifyDataChange(id);
                        }
                        else {
                            dialog.errorMessage({ text: '更新異常!' });
                        }
                    });
                })}"
                                        >
                                            儲存並更改
                                        </button>
                                    </div>
                                    <div class="d-flex flex-column flex-column-reverse  flex-md-row" style="gap:10px;">
                                        <div style="width:900px;max-width:100%;gap:10px;" class="d-flex flex-column">
                                            ${BgWidget.card([
                    html `
                                                        <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;align-self: stretch;">
                                                            <div style="color:#393939;font-size: 16px;font-weight: 700;">訂單狀態</div>
                                                            <div class="ms-auto w-100" style="">
                                                                ${EditorElem.select({
                        title: ``,
                        gvc: gvc,
                        def: orderData.orderData.orderStatus,
                        array: [
                            {
                                title: '變更訂單狀態',
                                value: '',
                            },
                        ].concat(ApiShop.getOrderStatusArray()),
                        callback: (text) => {
                            orderData.orderData.orderStatus = orderData.orderData.orderStatus || '0';
                            if (text && text !== orderData.orderData.orderStatus) {
                                orderData.orderData.orderStatus = text;
                            }
                        },
                    })}
                                                            </div>
                                                        </div>
                                                        <div style="color:#393939;font-size: 16px;font-weight: 700;margin: 18px 0px;">訂單明細</div>
                                                        <div class="w-100" style="height: 1px;background-color: #DDD;margin-bottom: 18px;"></div>
                                                        <div class="d-flex flex-column" style="gap: 18px;">
                                                            ${orderData.orderData.lineItems
                        .map((dd) => {
                        return `${gvc.bindView(() => {
                            return {
                                bind: glitter.getUUID(),
                                view: () => {
                                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                        var _a;
                                        resolve(html `<img
                                                                                            src="${dd.preview_image || 'https://jmva.or.jp/wp-content/uploads/2018/07/noimage.png'}"
                                                                                            class="border rounded"
                                                                                            style="width:60px;height:60px;margin-right:12px;"
                                                                                        />
                                                                                        <div class="d-flex flex-column" style="gap:2px;">
                                                                                            <div class="fw-bold" style="color: #393939;font-size: 16px;font-weight: 400;">${dd.title}</div>
                                                                                            <div class="d-flex">
                                                                                                ${dd.spec.map((dd) => {
                                            return `<div class="" style="color: #8D8D8D;font-size: 16px;font-weight: 400;">${dd}</div>`;
                                        })}
                                                                                            </div>
                                                                                            <div class="" style="color: #8D8D8D;font-size: 14px;font-weight: 400;">
                                                                                                存貨單位 (SKU)：${(_a = dd.sku) !== null && _a !== void 0 ? _a : '--'}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div class="flex-fill"></div>
                                                                                        <div class="" style="color: #393939;font-size: 16px;font-weight: 400;">
                                                                                            $${dd.sale_price.toLocaleString()} × ${dd.count}
                                                                                        </div>
                                                                                        <div
                                                                                            class=""
                                                                                            style="color: #393939;font-size: 16px;font-weight: 400;width: 114px;display: flex;justify-content: end;"
                                                                                        >
                                                                                            $${dd.sale_price.toLocaleString()}
                                                                                        </div>`);
                                    }));
                                },
                                divCreate: {
                                    class: `d-flex align-items-center`,
                                    style: ``,
                                },
                            };
                        })}
`;
                    })
                        .join('<div class="w-100 bgf6" style="height:1px;"></div>')}
                                                            <div class="w-100" style="height: 1px;background-color: #DDD;margin-bottom: 18px;"></div>
                                                            ${[
                        {
                            title: '小計',
                            description: `${orderData.orderData.lineItems
                                .map((dd) => {
                                return parseInt(dd.count, 10);
                            })
                                .reduce((accumulator, currentValue) => accumulator + currentValue, 0)} 件商品`,
                            total: `$${(orderData.orderData.total +
                                orderData.orderData.discount -
                                orderData.orderData.shipment_fee +
                                orderData.orderData.use_rebate).toLocaleString()}`,
                        },
                        {
                            title: '運送',
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
                            if (orderData.orderData.use_wallet) {
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
                            return {
                                title: '折扣',
                                description: `<div style="max-width:200px;white-space:nowrap;text-overflow:ellipsis;">${dd.title}</div>`,
                                total: `- $${orderData.orderData.discount.toLocaleString()}`,
                            };
                        }),
                        {
                            title: `<span class="" style="font-weight: 700;">總金額</span>`,
                            description: '',
                            total: `<span class="" style="font-weight: 700;">$${orderData.orderData.total.toLocaleString()}</span>`,
                        },
                    ]
                        .map((dd) => {
                        return html ` <div class="d-flex align-items-center justify-content-end">
                                                                        <div class="d-flex" style="color: #393939;text-align: right;font-size: 16px;font-weight: 400;">${dd.title}</div>
                                                                        <div class="" style="width: 114px;display: flex;justify-content: end;">${dd.total}</div>
                                                                    </div>`;
                    })
                        .join('')}
                                                        </div>
                                                    `,
                ].join('<div class="my-2"></div>'))}
                                            ${BgWidget.card(html `
                                                <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;align-self: stretch;">
                                                    <div style="color:#393939;font-size: 16px;font-weight: 700;">付款狀態</div>
                                                    <div class="ms-auto w-100" style="">
                                                        ${EditorElem.select({
                    title: ``,
                    gvc: gvc,
                    def: `${orderData.status}`,
                    array: [
                        { title: '變更付款狀態', value: '' },
                        { title: '已付款', value: '1' },
                        { title: '未付款', value: '0' },
                        { title: '已退款', value: '-2' },
                    ],
                    callback: (text) => {
                        if (text && text !== `${orderData.status}`) {
                            orderData.status = parseInt(text, 10);
                        }
                    },
                })}
                                                    </div>
                                                </div>
                                                <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;align-self: stretch;">
                                                    <div style="color:#393939;font-size: 16px;font-weight: 700;margin-top: 18px;">付款方式</div>
                                                    <div style="color: #393939;font-size: 16px;font-weight: 400; line-height: 140%;">
                                                        ${(() => {
                    let payMethod = {
                        credit: '信用卡付款',
                    };
                    return payMethod[orderData.orderData.method];
                })()}
                                                    </div>
                                                </div>
                                            `)}
                                            ${BgWidget.card(html `
                                                <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;align-self: stretch;">
                                                    <div style="color:#393939;font-size: 16px;font-weight: 700;">配送狀態</div>
                                                    <div class="ms-auto w-100" style="">
                                                        ${EditorElem.select({
                    title: ``,
                    gvc: gvc,
                    def: `${orderData.orderData.progress}`,
                    array: [
                        { title: '配送狀態', value: '' },
                        { title: '配送中', value: 'shipping' },
                        { title: '未出貨', value: 'wait' },
                        { title: '已取貨', value: 'finish' },
                        { title: '已退貨', value: 'returns' },
                        { title: '已到貨', value: 'arrived' },
                    ],
                    callback: (text) => {
                        if (text && text !== `${orderData.orderData.progress}`) {
                            orderData.orderData.progress = text;
                        }
                    },
                })}
                                                    </div>
                                                </div>
                                                <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;align-self: stretch;">
                                                    <div style="color:#393939;font-size: 16px;font-weight: 700;margin-top: 18px;">配送方式</div>
                                                    <div style="color: #393939;font-size: 16px;font-weight: 400; line-height: 140%;">
                                                        ${(() => {
                    let shipment = {
                        normal: '宅配',
                        UNIMARTC2C: '7-11店到店',
                        FAMIC2C: '全家店到店',
                        OKMARTC2C: 'OK店到店',
                        HILIFEC2C: '萊爾富店到店',
                    };
                    return shipment[orderData.orderData.user_info.shipment];
                })()}
                                                    </div>
                                                </div>
                                                <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;align-self: stretch;">
                                                    <div style="color:#393939;font-size: 16px;font-weight: 700;margin-top: 18px;">配送資訊</div>
                                                    <div class="d-flex flex-column" style="color: #393939;font-size: 16px;font-weight: 400; line-height: 140%;gap: 4px;">
                                                        ${(() => {
                    if (orderData.orderData.user_info.shipment == 'normal') {
                        return orderData.orderData.user_info.address;
                    }
                    else {
                        return html `
                                                                    <div class="d-flex">門市名稱: ${orderData.orderData.user_info.CVSStoreName}</div>
                                                                    <div class="d-flex">門市店號: ${orderData.orderData.user_info.CVSStoreID}</div>
                                                                    <div class="d-flex">地址: ${orderData.orderData.user_info.CVSAddress}</div>
                                                                `;
                    }
                    let shipment = {
                        normal: '宅配',
                        UNIMARTC2C: '7-11店到店',
                        FAMIC2C: '全家店到店',
                        OKMARTC2C: 'OK店到店',
                        HILIFEC2C: '萊爾富店到店',
                    };
                    return shipment[orderData.orderData.user_info.shipment];
                })()}
                                                    </div>
                                                </div>
                                            `)}
                                            ${BgWidget.card(html `
                                                <div style="color:#393939;font-size: 16px;font-weight: 700;margin-bottom: 18px">訂單備註</div>
                                                <div style="position: relative;">
                                                    ${EditorElem.editeText({
                    gvc: gvc,
                    title: '',
                    default: orderData.orderData.order_note,
                    placeHolder: '',
                    callback: (text) => {
                        orderData.orderData.order_note = text;
                    },
                })}
                                                </div>
                                            `)}
                                            ${BgWidget.card(html `
                                                <div style="color:#393939;font-size: 16px;font-weight: 700;margin-bottom: 18px">訂單記錄</div>
                                                <div class="d-flex flex-column" style="gap: 8px">
                                                    ${(() => {
                    var _a;
                    let returnHTML = ``;
                    if (!((_a = orderData.orderData) === null || _a === void 0 ? void 0 : _a.editRecord)) {
                        return ``;
                    }
                    orderData.orderData.editRecord.map((record) => {
                        returnHTML =
                            `
                                                    <div class="d-flex " style="gap: 42px">
                                                        <div>${formatDateString(record.time)}</div>
                                                        <div>${record.record}</div>
                                                    </div>
                                                    ` + returnHTML;
                    });
                    return returnHTML;
                })()}
                                                    <div class="d-flex " style="gap: 42px">
                                                        <div>${formatDateString(orderData.created_time)}</div>
                                                        <div>訂單成立</div>
                                                    </div>
                                                </div>
                                            `)}
                                        </div>
                                        <div style="width:380px;max-width:100%;">
                                            ${BgWidget.card(html `
                                                <div class="p-2" style="color: #393939;font-size: 16px;">
                                                    <div class="d-flex align-items-center">
                                                        <div class="" style="font-size: 16px;font-weight: 700;">顧客資料</div>
                                                        <div class="flex-fill"></div>
                                                    </div>
                                                    <div class="w-100 d-flex flex-column mt-2" style="gap:12px;">
                                                        ${[
                    `<div class="d-flex flex-column" style="gap:8px;">
                                            <div class="d-flex align-items-center" style="color: #4D86DB;font-weight: 400; gap:8px;cursor:pointer;" onclick="${gvc.event(() => {
                        child_vm.userID = userData.userID;
                        child_vm.type = 'user';
                    })}">${(_b = (_a = userData === null || userData === void 0 ? void 0 : userData.userData) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : '訪客'}
                                                <div class="d-flex align-items-center justify-content-center" style="padding: 4px 6px;border-radius: 7px;background: #393939;color: #FFF;">高級會員</div>
                                            </div>
                                            <div class="" style="color: #393939;font-weight: 400;">${(_d = (_c = userData === null || userData === void 0 ? void 0 : userData.userData) === null || _c === void 0 ? void 0 : _c.phone) !== null && _d !== void 0 ? _d : orderData.orderData.user_info.phone}</div>
                                            <div class="" style="color: #393939;font-weight: 400;">${(_f = (_e = userData === null || userData === void 0 ? void 0 : userData.userData) === null || _e === void 0 ? void 0 : _e.email) !== null && _f !== void 0 ? _f : orderData.orderData.user_info.email}</div>
                                        </div>`,
                    `<div class="bgf6" style="height: 1px;margin: 8px 0"></div>`,
                    `<div class="" style="font-size: 16px;font-weight: 700;">收件人資料</div>`,
                    `<div class="d-flex flex-column" style="gap:8px;">
                                            <div class="" style="color: #4D86DB;font-weight: 400;">${orderData.orderData.user_info.name}</div>
                                            <div class="" style="color: #393939;font-weight: 400;">${orderData.orderData.user_info.phone || '電話未填'}</div>
<!--                                            <div class="fw-normal fs-6">Email:${orderData.orderData.user_info.email}</div>-->
                                        </div>`,
                    `<div class="" style="font-size: 16px;font-weight: 700;">付款方式</div>`,
                    `<div style="">${(() => {
                        let payMethod = {
                            credit: '信用卡付款',
                        };
                        return payMethod[orderData.orderData.method];
                    })()}</div>`,
                    `<div class="" style="font-size: 16px;font-weight: 700;">配送方式</div>`,
                    `<div class="" style="color: #393939;line-height: 140%; ">${(() => {
                        switch (orderData.orderData.user_info.shipment) {
                            case 'FAMIC2C':
                                return '全家店到店';
                            case 'HILIFEC2C':
                                return '萊爾富店到店';
                            case 'normal':
                                return '宅配到府';
                            case 'OKMARTC2C':
                                return 'OK超商店到店';
                            case 'UNIMARTC2C':
                                return '7-ELEVEN超商交貨便';
                            default:
                                return '宅配到府';
                        }
                    })()}</div>`,
                    `<div class="" style="font-size: 16px;font-weight: 700;">配送資訊</div>`,
                    (() => {
                        switch (orderData.orderData.user_info.shipment) {
                            case 'FAMIC2C':
                            case 'HILIFEC2C':
                            case 'OKMARTC2C':
                            case 'UNIMARTC2C':
                                return [
                                    `<div class="fw-normal fs-6">名稱:${orderData.orderData.user_info.CVSStoreName}</div>`,
                                    `<div class="fw-normal fs-6">代號:${orderData.orderData.user_info.CVSStoreID}</div>`,
                                    `<div class="fw-normal fs-6">地址:${orderData.orderData.user_info.CVSAddress}</div>`,
                                    `<div class="my-2 bgf6" style="height: 1px;"></div>`,
                                ].join('');
                            case 'normal':
                            default:
                                return [
                                    `<div class="fw-bold fs-6">配送地址</div>`,
                                    `<div class="fw-normal fs-6" style="white-space: normal;">${orderData.orderData.user_info.address}</div>`,
                                    `<div class="my-2 bgf6" style="height: 1px;"></div>`,
                                ].join('');
                        }
                    })(),
                    gvc.bindView(() => {
                        const id = glitter.getUUID();
                        const vm = {
                            mode: 'read',
                        };
                        return {
                            bind: id,
                            view: () => {
                                var _a;
                                return html `
                                                                            <div class="d-flex align-items-center ">
                                                                                <div class="fw-bold fs-6">用戶備註</div>
                                                                                <div class="flex-fill"></div>
                                                                                <i
                                                                                    class="fa-solid fa-pencil d-none"
                                                                                    style="cursor:pointer;"
                                                                                    onclick="${gvc.event(() => {
                                    vm.mode = vm.mode === 'edit' ? 'read' : 'edit';
                                    gvc.notifyDataChange(id);
                                })}"
                                                                                ></i>
                                                                            </div>
                                                                            <div class="fs-6 w-100 mt-2  lh-lg fw-normal" style="word-break: break-all;white-space:normal;">
                                                                                ${((_a = orderData.orderData.user_info.note) !== null && _a !== void 0 ? _a : '尚未填寫').replace(/\n/g, `<br>`)}
                                                                            </div>
                                                                        `;
                            },
                            divCreate: {
                                class: `p-2 fw-normal`,
                            },
                        };
                    }),
                ].join('')}
                                                    </div>
                                                </div>
                                            `)}

                                            <div class="mt-2"></div>
                                            ${BgWidget.card(gvc.bindView(() => {
                    const id = glitter.getUUID();
                    const vm = {
                        mode: 'read',
                    };
                    return {
                        bind: id,
                        view: () => {
                            var _a;
                            return html `
                                                                <div class="d-flex align-items-center ">
                                                                    <div class="fw-bold fs-6">訂單備註</div>
                                                                    <div class="flex-fill"></div>
                                                                </div>
                                                                <div class="fs-6 w-100 mt-2  lh-lg fw-normal" style="word-break: break-all;white-space:normal;">
                                                                    ${((_a = orderData.orderData.order_note) !== null && _a !== void 0 ? _a : '尚未填寫').replace(/\n/g, `<br>`)}
                                                                </div>
                                                            `;
                        },
                        divCreate: {
                            class: `p-2 fw-normal`,
                        },
                    };
                }))}
                                            <div class="mt-2"></div>
                                            ${BgWidget.card(html `
                                                <div class="p-2">
                                                    <div class="d-flex align-items-center">
                                                        <div class="fw-bold fs-6">預計送達日期</div>
                                                        <div class="flex-fill"></div>
                                                    </div>
                                                    <div class="w-100 d-flex flex-column mt-2" style="gap:5px;">
                                                        ${[
                    EditorElem.editeInput({
                        gvc: gvc,
                        title: '',
                        default: orderData.orderData.expectDate,
                        placeHolder: '',
                        callback: (text) => {
                            orderData.orderData.expectDate = text;
                        },
                        type: 'date',
                    }),
                ].join('')}
                                                    </div>
                                                </div>
                                            `)}
                                            <div class="mt-2"></div>
                                        </div>
                                    </div>
                                `, 1200)}
                            <div
                                class="testLine d-flex align-items-center justify-content-end"
                                style="gap:14px;max-height:48px; position:fixed;bottom:0;right:0;width: 100%;height:50px;background: #FFF;box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.15);padding: 14px 16px 14px 0;"
                            >
                                <button
                                    style="padding: 6px 18px;border-radius: 10px;border: 1px solid #DDD;background: #FFF;font-size: 16px;font-weight: 700;color:#393939;"
                                    onclick="${gvc.event(() => {
                    vm.type = 'list';
                })}"
                                >
                                    取消
                                </button>
                                <button
                                    class="btn btn-primary-c"
                                    style="color: #FFF;font-size: 16px;font-weight: 700;padding: 6px 18px;align-items: center;gap: 8px;"
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
                    writeEdit(origData, orderData);
                    const dialog = new ShareDialog(gvc.glitter);
                    dialog.dataLoading({ text: '上傳中', visible: true });
                    ApiShop.putOrder({
                        id: `${orderData.id}`,
                        order_data: orderData.orderData,
                        status: orderData.status,
                    }).then((response) => {
                        dialog.dataLoading({ text: '上傳中', visible: false });
                        if (response.result) {
                            dialog.successMessage({ text: '更新成功!' });
                            gvc.notifyDataChange(id);
                        }
                        else {
                            dialog.errorMessage({ text: '更新異常!' });
                        }
                    });
                })}"
                                >
                                    送出
                                </button>
                            </div>
                        </div>
                    `, 1200);
            },
            divCreate: {},
        });
    }
}
window.glitter.setModule(import.meta.url, ShoppingOrderManager);
