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
const html = String.raw;
export class ShoppingOrderManager {
    static main(gvc) {
        const filterID = gvc.glitter.getUUID();
        const glitter = gvc.glitter;
        const vm = {
            type: 'list',
            data: undefined,
            dataList: undefined,
            query: undefined,
        };
        return gvc.bindView(() => {
            const id = glitter.getUUID();
            return {
                bind: id,
                dataList: [{ obj: vm, key: 'type' }],
                view: () => {
                    if (vm.type === 'list') {
                        return BgWidget.container(html `
                            <div class="d-flex w-100 align-items-center mb-3 ">
                                ${BgWidget.title('訂單管理2')}
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
                                                    key: '訂單',
                                                    value: dd.cart_token,
                                                },
                                                {
                                                    key: '日期',
                                                    value: glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd hh:mm:ss'),
                                                },
                                                {
                                                    key: '顧客名稱',
                                                    value: dd.orderData.user_info ? dd.orderData.user_info.name : `匿名`,
                                                },
                                                {
                                                    key: '信箱',
                                                    value: dd.email || '未知',
                                                },
                                                {
                                                    key: '總計',
                                                    value: dd.orderData.total,
                                                },
                                                {
                                                    key: '付款狀態',
                                                    value: (() => {
                                                        switch (dd.status) {
                                                            case 0:
                                                                return `<div class="badge  fs-7 " style="color:black;background:#ffd6a4;">付款待處理</div>`;
                                                            case 1:
                                                                return `<div class="badge fs-7" style="background:#0000000f;color:black;">已付款</div>`;
                                                            case -1:
                                                                return `<div class="badge bg-danger fs-7" style="">付款失敗</div>`;
                                                            case -2:
                                                                return `<div class="badge bg-danger fs-7" style="">已退款</div>`;
                                                        }
                                                    })(),
                                                },
                                                {
                                                    key: '出貨狀態',
                                                    value: (() => {
                                                        var _a;
                                                        switch ((_a = dd.orderData.progress) !== null && _a !== void 0 ? _a : 'wait') {
                                                            case 'wait':
                                                                return `<div class="badge bg-warning fs-7 " style="color:black;">尚未出貨</div>`;
                                                            case 'shipping':
                                                                return `<div class="badge bg-info fs-7" style="max-height:34px;">配送中</div>`;
                                                            case 'finish':
                                                                return `<div class="badge  fs-7" style="background:#0000000f;color:black;">已出貨</div>`;
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
                            filter: html ` ${BgWidget.searchPlace(gvc.event((e, event) => {
                                vm.query = e.value;
                                gvc.notifyDataChange(id);
                            }), vm.query || '', '搜尋所有訂單')}
                                ${gvc.bindView(() => {
                                return {
                                    bind: filterID,
                                    view: () => {
                                        if (!vm.dataList ||
                                            !vm.dataList.find((dd) => {
                                                return dd.checked;
                                            })) {
                                            return ``;
                                        }
                                        else {
                                            return [
                                                `<span class="fs-7 fw-bold">操作選項</span>`,
                                                `<button class="btn btn-danger fs-7 px-2" style="height:30px;border:none;" onclick="${gvc.event(() => {
                                                    const dialog = new ShareDialog(gvc.glitter);
                                                    dialog.checkYesOrNot({
                                                        text: '是否確認移除所選項目?',
                                                        callback: (response) => {
                                                            if (response) {
                                                                dialog.dataLoading({ visible: true });
                                                                ApiShop.deleteOrders({
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
                                                                        gvc.notifyDataChange(id);
                                                                    }
                                                                    else {
                                                                        dialog.errorMessage({ text: '刪除失敗' });
                                                                    }
                                                                });
                                                            }
                                                        },
                                                    });
                                                })}">批量移除</button>`,
                                            ].join(``);
                                        }
                                    },
                                    divCreate: () => {
                                        return {
                                            class: `d-flex align-items-center p-2 py-3 ${!vm.dataList ||
                                                !vm.dataList.find((dd) => {
                                                    return dd.checked;
                                                })
                                                ? `d-none`
                                                : ``}`,
                                            style: `height:40px;gap:10px;margin-top:10px;`,
                                        };
                                    },
                                };
                            })}`,
                        })}
                        `);
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
        orderData.orderData.progress = (_b = orderData.orderData.progress) !== null && _b !== void 0 ? _b : 'wait';
        gvc.addStyle(`
            .bg-warning {
                background: #ffef9d !important;
                color: black !important;
            }
        `);
        const vt = {
            paymentBadge: () => {
                if (orderData.status === 0) {
                    return `<div class="badge bg-warning fs-6" style="max-height:34px;">未付款</div>`;
                }
                else if (orderData.status === 1) {
                    return `<div class="badge  fs-6" style="background:#0000000f;color:black;max-height:34px;">已付款</div>`;
                }
                else if (orderData.status === -2) {
                    return `<div class="badge bg-danger fs-6" style="max-height:34px;">已退款</div>`;
                }
                else {
                    return `<div class="badge bg-danger fs-6" style="max-height:34px;">付款失敗</div>`;
                }
            },
            outShipBadge: () => {
                if (orderData.orderData.progress === 'finish') {
                    return `<div class="badge  fs-6" style="background:#0000000f;color:black;max-height:34px;">已出貨</div>`;
                }
                else if (orderData.orderData.progress === 'shipping') {
                    return `<div class="badge bg-info fs-6" style="max-height:34px;">配送中</div>`;
                }
                else {
                    return `<div class="badge bg-warning fs-6" style="max-height:34px;">未出貨</div>`;
                }
            },
        };
        return BgWidget.container(html `
                <div class="d-flex">
                    ${BgWidget.container(html `<div class="d-flex w-100 align-items-center mb-3 ">
                                ${BgWidget.goBack(gvc.event(() => {
            vm.type = 'list';
        }))}
                                ${BgWidget.title(html `<div class="d-flex align-items-center">
                                    <div class="d-flex flex-column">
                                        <div class="fs-5 text-black fw-bold d-flex align-items-center" style="gap:10px;">${orderData.cart_token}${vt.paymentBadge()}${vt.outShipBadge()}</div>
                                        <div class="fs-6 fw-500">${glitter.ut.dateFormat(new Date(orderData.created_time), 'yyyy-MM-dd hh:mm')}</div>
                                    </div>
                                </div>`)}
                                <div class="flex-fill"></div>
                                <button
                                    class="btn btn-primary-c"
                                    style="height:38px;font-size: 14px;"
                                    onclick="${gvc.event(() => {
            const dialog = new ShareDialog(gvc.glitter);
            dialog.dataLoading({ text: '上傳中', visible: true });
            ApiShop.putOrder({
                id: `${orderData.id}`,
                order_data: orderData.orderData,
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
            html `<div class="d-flex mb-2 align-items-center">
                                                    ${vt.outShipBadge()}
                                                    <div class="ms-auto" style="width:150px;">
                                                        ${EditorElem.select({
                title: ``,
                gvc: gvc,
                def: '',
                array: [{ title: '變更出貨狀態', value: '' }].concat(ApiShop.getShippingStatusArray()),
                callback: (text) => {
                    orderData.orderData.progress = orderData.orderData.progress || 'wait';
                    if (text && text !== orderData.orderData.progress) {
                        const dialog = new ShareDialog(gvc.glitter);
                        const copy = JSON.parse(JSON.stringify(orderData.orderData));
                        copy.progress = text;
                        dialog.dataLoading({ text: '上傳中', visible: true });
                        ApiShop.putOrder({
                            id: `${orderData.id}`,
                            order_data: copy,
                        }).then((response) => {
                            dialog.dataLoading({ text: '上傳中', visible: false });
                            if (response.result) {
                                dialog.successMessage({ text: '更新成功!' });
                                orderData.orderData = copy;
                                gvc.notifyDataChange(id);
                            }
                            else {
                                dialog.errorMessage({ text: '更新異常!' });
                            }
                        });
                    }
                },
            })}
                                                    </div>
                                                </div>
                                                <div class="border rounded">
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
                                                                                    style="width:60px;height:60px;"
                                                                                />
                                                                                <div class="d-flex flex-column" style="gap:5px;">
                                                                                    <a class="fw-bold" style="color:#005bd3;">${dd.title}</a>
                                                                                    <div class="d-flex">
                                                                                        ${dd.spec
                                    .map((dd) => {
                                    return `<div class="bg-secondary badge fs-6">${dd}</div>`;
                                })
                                    .join('<div class="mx-1"></div>')}
                                                                                    </div>
                                                                                    <p class="text-dark fs-6">存貨單位 (SKU)：${(_a = dd.sku) !== null && _a !== void 0 ? _a : '--'}</p>
                                                                                </div>
                                                                                <div class="flex-fill"></div>
                                                                                <p class="text-dark fs-6">$${dd.sale_price.toLocaleString()} × ${dd.count}</p>
                                                                                <p class="text-dark fs-6">$${(dd.sale_price * parseInt(dd.count, 10)).toLocaleString()}</p>`);
                            }));
                        },
                        divCreate: {
                            class: `d-flex align-items-center p-2`,
                            style: `gap:20px;`,
                        },
                    };
                })}
`;
            })
                .join('<div class="w-100 bgf6" style="height:1px;"></div>')}
                                                </div> `,
        ].join('<div class="my-2"></div>'))}
                                    ${BgWidget.card(html `
                                        <div class="d-flex mb-2 align-items-center">
                                            ${vt.paymentBadge()}
                                            <div class="ms-auto" style="width:150px;">
                                                ${EditorElem.select({
            title: ``,
            gvc: gvc,
            def: '',
            array: [
                { title: '變更付款狀態', value: '' },
                { title: '已付款', value: '1' },
                { title: '未付款', value: '0' },
                { title: '已退款', value: '-2' },
            ],
            callback: (text) => {
                if (text && text !== `${orderData.status}`) {
                    const dialog = new ShareDialog(gvc.glitter);
                    dialog.dataLoading({ text: '上傳中', visible: true });
                    ApiShop.putOrder({
                        id: `${orderData.id}`,
                        order_data: orderData.orderData,
                        status: text,
                    }).then((response) => {
                        dialog.dataLoading({ text: '上傳中', visible: false });
                        if (response.result) {
                            orderData.status = parseInt(text, 10);
                            dialog.successMessage({ text: '更新成功!' });
                            gvc.notifyDataChange(id);
                        }
                        else {
                            dialog.errorMessage({ text: '更新異常!' });
                        }
                    });
                }
            },
        })}
                                            </div>
                                        </div>
                                        <div class="border rounded p-3 d-flex flex-column" style="gap:10px;">
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
                title: '總計',
                description: '',
                total: `<span class="fw-bold">$${orderData.orderData.total.toLocaleString()}</span>`,
            },
        ]
            .map((dd) => {
            return html ` <div class="d-flex align-items-center ">
                                                        <div class="fs-6 fw-bold">${dd.title}</div>
                                                        <div class="ms-5 fs-6">${dd.description}</div>
                                                        <div class="flex-fill"></div>
                                                        <div class="ms-5 fs-6">${dd.total}</div>
                                                    </div>`;
        })
            .join('')}
                                        </div>
                                    `)}
                                </div>
                                <div style="width:380px;max-width:100%;">
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
                                                            <div class="fw-bold fs-6">用戶備註</div>
                                                            <div class="flex-fill"></div>
                                                            <i
                                                                class="fa-solid fa-pencil"
                                                                style="cursor:pointer;"
                                                                onclick="${gvc.event(() => {
                        vm.mode = vm.mode === 'edit' ? 'read' : 'edit';
                        gvc.notifyDataChange(id);
                    })}"
                                                            ></i>
                                                        </div>
                                                        ${vm.mode == 'read'
                        ? html `
                                                                  <div class="fs-6 w-100 mt-2  lh-lg fw-normal" style="word-break: break-all;white-space:normal;">
                                                                      ${((_a = orderData.orderData.user_info.note) !== null && _a !== void 0 ? _a : '尚未填寫').replace(/\n/g, `<br>`)}
                                                                  </div>
                                                              `
                        : EditorElem.editeText({
                            gvc: gvc,
                            title: '',
                            default: orderData.orderData.user_info.note,
                            placeHolder: '',
                            callback: (text) => {
                                orderData.orderData.user_info.note = text;
                            },
                        })}
                                                    `;
                },
                divCreate: {
                    class: `p-2 fw-normal`,
                },
            };
        }))}
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
                                                            <i
                                                                class="fa-solid fa-pencil"
                                                                style="cursor:pointer;"
                                                                onclick="${gvc.event(() => {
                        vm.mode = vm.mode === 'edit' ? 'read' : 'edit';
                        gvc.notifyDataChange(id);
                    })}"
                                                            ></i>
                                                        </div>
                                                        ${vm.mode == 'read'
                        ? html `
                                                                  <div class="fs-6 w-100 mt-2  lh-lg fw-normal" style="word-break: break-all;white-space:normal;">
                                                                      ${((_a = orderData.orderData.order_note) !== null && _a !== void 0 ? _a : '尚未填寫').replace(/\n/g, `<br>`)}
                                                                  </div>
                                                              `
                        : EditorElem.editeText({
                            gvc: gvc,
                            title: '',
                            default: orderData.orderData.order_note,
                            placeHolder: '',
                            callback: (text) => {
                                orderData.orderData.order_note = text;
                            },
                        })}
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
                                    ${BgWidget.card(html `
                                        <div class="p-2">
                                            <div class="d-flex align-items-center">
                                                <div class="fw-bold fs-6">客戶</div>
                                                <div class="flex-fill"></div>
                                            </div>
                                            <div class="w-100 d-flex flex-column mt-2" style="gap:5px;">
                                                ${[
            `<div class="fw-500 fs-6 text-primary">${orderData.orderData.user_info.name}</div>`,
            `<div class="my-2 bgf6" style="height: 1px;"></div>`,
            `<div class="fw-bold fs-6">聯絡資訊</div>`,
            `<div class="fw-normal fs-6">Email:${orderData.orderData.user_info.email}</div>`,
            `<div class="fw-normal fs-6">Phone:${orderData.orderData.user_info.phone}</div>`,
            `<div class="my-2 bgf6" style="height: 1px;"></div>`,
            `<div class="fw-bold fs-6">配送方式</div>`,
            `<div class="fw-normal fs-6">${(() => {
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
            `<div class="my-2 bgf6" style="height: 1px;"></div>`,
            (() => {
                switch (orderData.orderData.user_info.shipment) {
                    case 'FAMIC2C':
                    case 'HILIFEC2C':
                    case 'OKMARTC2C':
                    case 'UNIMARTC2C':
                        return [
                            `<div class="fw-bold fs-6">配送門市</div>`,
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
        ].join('')}
                                            </div>
                                        </div>
                                    `)}
                                </div>
                            </div> `, 1200)}
                </div>
            `, 1200);
    }
}
window.glitter.setModule(import.meta.url, ShoppingOrderManager);
