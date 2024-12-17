import { BgWidget } from '../backend-manager/bg-widget.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { BgListComponent } from '../backend-manager/bg-list-component.js';
import { FilterOptions } from './filter-options.js';
const html = String.raw;
export class ShoppingAllowanceManager {
    static main(gvc, query) {
        const glitter = gvc.glitter;
        const dialog = new ShareDialog(gvc.glitter);
        query.isArchived = Boolean(query.isArchived);
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
            filter_type: query.isPOS ? 'pos' : 'normal',
        };
        const ListComp = new BgListComponent(gvc, vm, FilterOptions.invoiceFilterFrame);
        vm.filter = ListComp.getFilterObject();
        gvc.addMtScript([{ src: 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js' }], () => {
        }, () => {
        });
        function exportDataTo(firstRow, data) {
            if (window.XLSX) {
                let XLSX = window.XLSX;
                const worksheet = XLSX.utils.json_to_sheet(data);
                XLSX.utils.sheet_add_aoa(worksheet, [firstRow], { origin: 'A1' });
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
                const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
                function s2ab(s) {
                    const buf = new ArrayBuffer(s.length);
                    const view = new Uint8Array(buf);
                    for (let i = 0; i < s.length; i++) {
                        view[i] = s.charCodeAt(i) & 0xff;
                    }
                    return buf;
                }
                const saasConfig = window.saasConfig;
                const fileName = `訂單列表_${glitter.ut.dateFormat(new Date(), 'yyyyMMddhhmmss')}.xlsx`;
                saasConfig.api.uploadFile(fileName).then((data) => {
                    const blobData = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
                    const data1 = data.response;
                    dialog.dataLoading({ visible: true });
                    $.ajax({
                        url: data1.url,
                        type: 'put',
                        data: blobData,
                        processData: false,
                        headers: {
                            'Content-Type': data1.type,
                        },
                        crossDomain: true,
                        success: () => {
                            dialog.dataLoading({ visible: false });
                            const link = document.createElement('a');
                            link.href = data1.fullUrl;
                            link.download = fileName;
                            link.click();
                        },
                        error: () => {
                            dialog.dataLoading({ visible: false });
                            dialog.errorMessage({ text: '上傳失敗' });
                        },
                    });
                });
            }
        }
        return gvc.bindView({
            bind: vm.id,
            dataList: [{ obj: vm, key: 'type' }],
            view: () => {
                if (vm.type === 'list') {
                    return BgWidget.container(html `
                            <div class="title-container">
                                ${BgWidget.title('折讓單列表')}
                                <div class="flex-fill"></div>
                                <div style="display: flex; gap: 14px;">
                                    ${BgWidget.grayButton('匯出', gvc.event(() => {
                        let dialog = new ShareDialog(glitter);
                        dialog.warningMessage({
                            text: `系統將以目前列表搜尋的訂單結果匯出<br />最多匯出1000筆資料，是否匯出？`,
                            callback: (bool) => {
                                if (bool) {
                                    dialog.dataLoading({ visible: true });
                                    ApiShop.getInvoice({
                                        page: 0,
                                        limit: 1000,
                                        search: vm.query || undefined,
                                        searchType: vm.queryType || 'cart_token',
                                        orderString: vm.orderString,
                                        filter: vm.filter,
                                    }).then((res) => {
                                        dialog.dataLoading({ visible: false });
                                        if (!res.result) {
                                            dialog.errorMessage({ text: '訂單資料讀取錯誤' });
                                        }
                                        const exportData = [];
                                        const firstRow = [
                                            '訂單編號',
                                            '訂單來源',
                                            '訂單建立時間',
                                            '會員信箱',
                                            '訂單處理狀態',
                                            '付款狀態',
                                            '出貨狀態',
                                            '訂單小計',
                                            '訂單運費',
                                            '訂單使用優惠券',
                                            '訂單折扣',
                                            '訂單使用購物金',
                                            '訂單總計',
                                            '商品名稱',
                                            '商品規格',
                                            '商品SKU',
                                            '商品購買數量',
                                            '商品價格',
                                            '商品折扣',
                                            '顧客姓名',
                                            '顧客手機',
                                            '顧客信箱',
                                            '收件人姓名',
                                            '收件人手機',
                                            '收件人信箱',
                                            '備註',
                                        ];
                                        res.response.data.map((order) => {
                                            const orderData = order.orderData;
                                            orderData.lineItems.map((item) => {
                                                var _a, _b, _c;
                                                exportData.push({
                                                    訂單編號: order.cart_token,
                                                    訂單來源: orderData.orderSource === 'POS' ? 'POS' : '手動',
                                                    訂單建立時間: glitter.ut.dateFormat(new Date(order.created_time), 'yyyy-MM-dd hh:mm:ss'),
                                                    會員信箱: (_a = order.email) !== null && _a !== void 0 ? _a : 'no-email',
                                                    訂單處理狀態: (() => {
                                                        var _a;
                                                        switch ((_a = orderData.orderStatus) !== null && _a !== void 0 ? _a : '0') {
                                                            case '-1':
                                                                return '已取消';
                                                            case '1':
                                                                return '已完成';
                                                            case '0':
                                                            default:
                                                                return '處理中';
                                                        }
                                                    })(),
                                                    付款狀態: (() => {
                                                        var _a;
                                                        switch ((_a = order.status) !== null && _a !== void 0 ? _a : 0) {
                                                            case 1:
                                                                return '已付款';
                                                            case -1:
                                                                return '付款失敗';
                                                            case -2:
                                                                return '已退款';
                                                            case 0:
                                                            default:
                                                                return '未付款';
                                                        }
                                                    })(),
                                                    出貨狀態: (() => {
                                                        var _a;
                                                        switch ((_a = orderData.progress) !== null && _a !== void 0 ? _a : 'wait') {
                                                            case 'shipping':
                                                                return '已出貨';
                                                            case 'finish':
                                                                return '已取貨';
                                                            case 'arrived':
                                                                return '已送達';
                                                            case 'returns':
                                                                return '已退貨';
                                                            case 'wait':
                                                            default:
                                                                return '未出貨';
                                                        }
                                                    })(),
                                                    訂單小計: orderData.total + orderData.discount - orderData.shipment_fee + orderData.use_rebate,
                                                    訂單運費: orderData.shipment_fee,
                                                    訂單使用優惠券: orderData.voucherList.map((voucher) => voucher.title).join(', '),
                                                    訂單折扣: orderData.discount,
                                                    訂單使用購物金: orderData.use_rebate,
                                                    訂單總計: orderData.total,
                                                    商品名稱: item.title,
                                                    商品規格: item.spec.length > 0 ? item.spec.join(' / ') : '單一規格',
                                                    商品SKU: (_b = item.sku) !== null && _b !== void 0 ? _b : '',
                                                    商品購買數量: item.count,
                                                    商品價格: item.sale_price,
                                                    商品折扣: item.discount_price,
                                                    顧客姓名: orderData.customer_info.name,
                                                    顧客手機: orderData.customer_info.phone,
                                                    顧客信箱: orderData.customer_info.email,
                                                    收件人姓名: orderData.user_info.name,
                                                    收件人手機: orderData.user_info.phone,
                                                    收件人信箱: orderData.user_info.email,
                                                    備註: (_c = orderData.user_info.note) !== null && _c !== void 0 ? _c : '',
                                                });
                                            });
                                        });
                                        exportDataTo(firstRow, exportData);
                                    });
                                }
                            },
                        });
                    }))}
                                    ${BgWidget.darkButton('手動開立折讓單', gvc.event(() => {
                        vm.type = 'add';
                    }))}
                                </div>
                            </div>
                            <div style="margin-top: 24px;"></div>
                            ${BgWidget.mainCard([
                        (() => {
                            const id = glitter.getUUID();
                            return gvc.bindView({
                                bind: id,
                                view: () => {
                                    const filterList = [
                                        BgWidget.selectFilter({
                                            gvc,
                                            callback: (value) => {
                                                vm.queryType = value;
                                                gvc.notifyDataChange(vm.id);
                                            },
                                            default: vm.queryType || 'order_id',
                                            options: FilterOptions.allowanceSelect,
                                        }),
                                        BgWidget.searchFilter(gvc.event((e) => {
                                            vm.query = e.value;
                                            gvc.notifyDataChange(vm.id);
                                        }), vm.query || '', '搜尋折讓單'),
                                        BgWidget.funnelFilter({
                                            gvc,
                                            callback: () => {
                                                ListComp.showRightMenu(FilterOptions.allowanceFunnel);
                                            },
                                        }),
                                        BgWidget.updownFilter({
                                            gvc,
                                            callback: (value) => {
                                                vm.orderString = value;
                                                gvc.notifyDataChange(vm.id);
                                            },
                                            default: vm.orderString || 'created_time_desc',
                                            options: FilterOptions.allowanceOrderBy,
                                        }),
                                    ];
                                    const filterTags = ListComp.getFilterTags(FilterOptions.invoiceFunnel);
                                    if (document.body.clientWidth < 768) {
                                        return html `
                                                            <div style="display: flex; align-items: center; gap: 10px; width: 100%; justify-content: space-between">
                                                                <div>${filterList[0]}</div>
                                                                <div style="display: flex;">
                                                                    <div class="me-2">${filterList[2]}</div>
                                                                    ${filterList[3]}
                                                                </div>
                                                            </div>
                                                            <div style="display: flex; margin-top: 8px;">
                                                                ${filterList[1]}
                                                            </div>
                                                            <div>${filterTags}</div>`;
                                    }
                                    else {
                                        return html `
                                                            <div style="display: flex; align-items: center; gap: 10px;">
                                                                ${filterList.join('')}
                                                            </div>
                                                            <div>${filterTags}</div>`;
                                    }
                                },
                            });
                        })(),
                        BgWidget.tableV3({
                            gvc: gvc,
                            getData: (vmi) => {
                                const limit = 20;
                                ApiShop.getAllowance({
                                    page: vmi.page - 1,
                                    limit: limit,
                                    search: (vm === null || vm === void 0 ? void 0 : vm.query) || "",
                                    searchType: (vm === null || vm === void 0 ? void 0 : vm.queryType) || 'order_id',
                                    orderString: vm.orderString,
                                    filter: vm.filter,
                                }).then((data) => {
                                    function getDatalist() {
                                        return data.response.data.map((dd) => {
                                            var _a;
                                            return [
                                                {
                                                    key: '折讓單編號',
                                                    value: dd.allowance_no,
                                                },
                                                {
                                                    key: '原發票編號',
                                                    value: dd.invoice_no,
                                                },
                                                {
                                                    key: '原訂單編號',
                                                    value: dd.order_id,
                                                },
                                                {
                                                    key: '<div class="text-center">折讓金額</div>',
                                                    value: html `
                                                                        <div class="text-center" style="">
                                                                            ${(_a = dd.allowance_data.invoiceAmount) !== null && _a !== void 0 ? _a : 0}
                                                                        </div>`,
                                                },
                                                {
                                                    key: '發票日期',
                                                    value: glitter.ut.dateFormat(new Date(dd.create_date), 'yyyy-MM-dd'),
                                                },
                                                {
                                                    key: '折讓狀態',
                                                    value: (() => {
                                                        var _a;
                                                        switch ((_a = dd.status) !== null && _a !== void 0 ? _a : '0') {
                                                            case -1:
                                                                return BgWidget.notifyInsignia('已作廢');
                                                            case 0:
                                                                return BgWidget.warningInsignia('處理中');
                                                            case 1:
                                                                return BgWidget.infoInsignia('已開立');
                                                            case 2:
                                                                return BgWidget.notifyInsignia('已作廢');
                                                        }
                                                    })(),
                                                },
                                            ].map((dd) => {
                                                dd.value = html `
                                                                    <div style="line-height:40px;">${dd.value}</div>`;
                                                return dd;
                                            });
                                        });
                                    }
                                    console.log(data.response);
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
                            filter: [],
                        }),
                    ].join(''))}
                            ${BgWidget.mbContainer(240)}
                        `);
                }
                else if (vm.type == 'replace') {
                    return this.replaceOrder(gvc, vm);
                }
                else if (vm.type == 'add') {
                    return this.createOrder(gvc, vm);
                }
                return '';
            },
        });
    }
    static replaceOrder(gvc, vm) {
        const glitter = gvc.glitter;
        const origData = JSON.parse(JSON.stringify(vm.data));
        const allowanceData = (vm.type == 'replace') ? vm.data : vm.allowanceData;
        let orderData;
        const mainViewID = gvc.glitter.getUUID();
        let dataLoading = true;
        ApiShop.getOrder({
            page: 0,
            limit: 100,
            search: vm.data.order_id,
            searchType: 'cart_token',
            archived: `false`,
            returnSearch: 'true',
        }).then((response) => {
            orderData = response.response;
            dataLoading = false;
            gvc.notifyDataChange([mainViewID, 'invoiceContent']);
        });
        const vt = {
            paymentBadge: () => {
                if (allowanceData.status === 0) {
                    return BgWidget.notifyInsignia('待審核');
                }
                else if (allowanceData.status === 1) {
                    return BgWidget.infoInsignia('已折讓');
                }
                else if (allowanceData.status === 0) {
                    return BgWidget.notifyInsignia('待審核');
                }
                else {
                    return BgWidget.notifyInsignia('已作廢');
                }
            },
        };
        return gvc.bindView({
            bind: mainViewID,
            view: () => {
                try {
                    function getBadgeList() {
                        return html `
                            <div style="display:flex; gap:10px;">${vt.paymentBadge()}</div>`;
                    }
                    if (dataLoading) {
                        return BgWidget.spinner();
                    }
                    return BgWidget.container(html `
                            <div class="title-container">
                                ${BgWidget.goBack(gvc.event(() => {
                        if ((vm.type == 'replace')) {
                            vm.type = 'list';
                        }
                        else {
                            vm.type = 'replace';
                        }
                    }))}
                                <div class="d-flex flex-column">
                                    <div class="align-items-center"
                                         style="gap:10px;color: #393939;font-size: 24px;font-weight: 700;">
                                            #${allowanceData.order_id}
                                    </div>
                                    <div style="height: 22px;">
                                        ${BgWidget.grayNote(`折讓時間 : ${glitter.ut.dateFormat(new Date(allowanceData.create_date), 'yyyy-MM-dd hh:mm')}`, `font-size: 16px;`)}
                                    </div>
                                </div>
                                <div class="h-100 d-flex align-items-end" style="margin-left: 10px;">
                                    ${document.body.clientWidth > 768 ? getBadgeList() : ''}
                                </div>
                            </div>
                            <div style="margin-top: 24px;"></div>
                            ${gvc.bindView({
                        bind: 'invoiceContent',
                        view: () => {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
                            if (orderData) {
                                return [BgWidget.mainCard(html `
                                            <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 18px;align-self: stretch;color:#393939;font-size: 16px;font-weight: 400;">
                                                <div style="font-weight: 700;">折讓單內容</div>
                                                <div class="w-100"
                                                     style="display: flex;align-items: flex-start;gap: 18px;">
                                                    ${BgWidget.editeInput({
                                        gvc: gvc,
                                        title: '折讓單編號',
                                        default: (_a = allowanceData.allowance_no) !== null && _a !== void 0 ? _a : "",
                                        readonly: true,
                                        placeHolder: '發票編號',
                                        callback: (data) => {
                                        },
                                        divStyle: 'width:50%;'
                                    })}
                                                    ${BgWidget.editeInput({
                                        gvc: gvc,
                                        title: '原發票編號',
                                        default: (_b = allowanceData.invoice_no) !== null && _b !== void 0 ? _b : "",
                                        readonly: true,
                                        placeHolder: '原發票編號',
                                        callback: (data) => {
                                        },
                                        divStyle: 'width:50%;'
                                    })}
                                                </div>
                                                <div class="w-100"
                                                     style="display: flex;align-items: flex-start;gap: 18px;">
                                                    ${BgWidget.editeInput({
                                        gvc: gvc,
                                        title: '原訂單編號',
                                        default: (_c = allowanceData.order_id) !== null && _c !== void 0 ? _c : "",
                                        readonly: true,
                                        placeHolder: '原訂單編號',
                                        callback: (data) => {
                                        },
                                        divStyle: 'width:50%;'
                                    })}
                                                    ${BgWidget.editeInput({
                                        gvc: gvc,
                                        title: '買受人姓名',
                                        default: (((_e = (_d = orderData.orderData) === null || _d === void 0 ? void 0 : _d.user_info) === null || _e === void 0 ? void 0 : _e.email) == "no-email") ? "紙本發票無姓名" : (_h = (_g = (_f = orderData.orderData) === null || _f === void 0 ? void 0 : _f.user_info) === null || _g === void 0 ? void 0 : _g.name) !== null && _h !== void 0 ? _h : "",
                                        readonly: true,
                                        placeHolder: '請輸入買受人姓名',
                                        callback: (data) => {
                                        },
                                        divStyle: 'width:50%;'
                                    })}
                                                </div>
                                                <div class="w-100"
                                                     style="display: flex;align-items: flex-start;gap: 18px;">
                                                    ${BgWidget.editeInput({
                                        gvc: gvc,
                                        title: '買受人電話',
                                        default: (((_k = (_j = orderData.orderData) === null || _j === void 0 ? void 0 : _j.user_info) === null || _k === void 0 ? void 0 : _k.email) == "no-email") ? "紙本發票無電話" : (_o = (_m = (_l = orderData.orderData) === null || _l === void 0 ? void 0 : _l.user_info) === null || _m === void 0 ? void 0 : _m.phone) !== null && _o !== void 0 ? _o : "",
                                        placeHolder: '請輸入買受人電話',
                                        readonly: true,
                                        callback: (data) => {
                                        },
                                        divStyle: 'width:50%;'
                                    })}
                                                    ${BgWidget.editeInput({
                                        gvc: gvc,
                                        title: '買受人地址',
                                        default: (((_q = (_p = orderData.orderData) === null || _p === void 0 ? void 0 : _p.user_info) === null || _q === void 0 ? void 0 : _q.email) == "no-email") ? "紙本發票無地址" : (_t = (_s = (_r = orderData.orderData) === null || _r === void 0 ? void 0 : _r.user_info) === null || _s === void 0 ? void 0 : _s.phone) !== null && _t !== void 0 ? _t : "",
                                        placeHolder: '請輸入買受人地址',
                                        readonly: true,
                                        callback: (data) => {
                                        },
                                        divStyle: 'width:50%;'
                                    })}
                                                </div>
                                                <div class="w-100"
                                                     style="display: flex;align-items: flex-start;gap: 18px;">
                                                    ${BgWidget.editeInput({
                                        gvc: gvc,
                                        title: '買受人電子信箱',
                                        default: (((_v = (_u = orderData.orderData) === null || _u === void 0 ? void 0 : _u.user_info) === null || _v === void 0 ? void 0 : _v.email) == "no-email") ? "紙本發票無電子信箱" : (_y = (_x = (_w = orderData.orderData) === null || _w === void 0 ? void 0 : _w.user_info) === null || _x === void 0 ? void 0 : _x.email) !== null && _y !== void 0 ? _y : "",
                                        placeHolder: '請輸入買受人電子信箱',
                                        readonly: true,
                                        callback: (data) => {
                                        },
                                        divStyle: 'width:100%;'
                                    })}
                                                </div>
                                                <div class="w-100"
                                                     style="display: flex;align-items: flex-start;gap: 18px;">
                                                    <div class="d-flex flex-column w-50" style="gap:8px;">
                                                        <div>折讓日期</div>
                                                        <input type="date"
                                                               style="padding: 9px 18px;border-radius: 10px;border: 1px solid #dddddd"
                                                               value="${new Date(allowanceData.create_date).toISOString().split('T')[0]}"
                                                               readonly disabled
                                                               onchange="${gvc.event((e) => {
                                    })}">
                                                    </div>
                                                    ${BgWidget.editeInput({
                                        gvc: gvc,
                                        title: '折讓時間',
                                        default: new Date(allowanceData.create_date).toISOString().split('T')[1].slice(0, 5),
                                        readonly: true,
                                        placeHolder: '請輸入發票時間',
                                        type: 'time',
                                        callback: (data) => {
                                        },
                                        divStyle: 'width:50%;'
                                    })}
                                                </div>

                                                <div class="w-100"
                                                     style="display: flex;align-items: flex-start;gap: 18px;">
                                                    ${BgWidget.editeInput({
                                        gvc: gvc,
                                        title: '課稅別',
                                        default: "應稅",
                                        placeHolder: '請輸入課稅別',
                                        readonly: true,
                                        callback: (data) => {
                                        },
                                        divStyle: 'width:50%;'
                                    })}
                                                    ${BgWidget.editeInput({
                                        gvc: gvc,
                                        title: '折讓金額',
                                        default: (_z = `${allowanceData.allowance_data.invoiceAmount}`) !== null && _z !== void 0 ? _z : "",
                                        placeHolder: '請輸入折讓金額',
                                        readonly: true,
                                        callback: (data) => {
                                        },
                                        divStyle: 'width:50%;'
                                    })}
                                                </div>
                                            </div>
                                        `),
                                    html `
                                                <div style="margin-top: 24px;"></div>`,
                                    BgWidget.mainCard(html `
                                                <div style="font-size: 16px;font-weight: 700;margin-bottom:18px;">
                                                    折讓列表
                                                </div>
                                                <div class="d-flex w-100 align-items-center">
                                                    <div class="col-7 ">商品名稱</div>
                                                    <div class="col-2 text-center">規格</div>
                                                    <div class="col-1 text-center">單價</div>
                                                    <div class="col-1 text-center">數量</div>
                                                    <div class="col-1 text-end">小計</div>
                                                </div>
                                                <div style="width: 100%;height: 1px;margin-top: 12px;margin-bottom: 18px;background-color: #DDD"></div>
                                                ${(() => {
                                        let itemArray = allowanceData.allowance_data.invoiceArray;
                                        return itemArray.map((item) => {
                                            var _a;
                                            let target = orderData.orderData.lineItems.find((lineItem) => { return lineItem.title == item.ItemName.split('/')[0]; });
                                            return html `
                                                            <div class="d-flex w-100 align-items-center" style="">
                                                                <div class="col-7 d-flex align-items-center">
                                                                    <img src="${target.preview_image}"
                                                                         style="width: 40px;height: 40px;border-radius: 5px;margin-right:12px;">
                                                                    ${item.ItemName}
                                                                </div>
                                                                <div class="col-2 text-center">
                                                                    ${(_a = target.spec.join(',')) !== null && _a !== void 0 ? _a : "單一規格"}
                                                                </div>
                                                                <div class="col-1 text-center">${item.ItemPrice}</div>
                                                                <div class="col-1 text-center">${Number(item.ItemCount)}</div>
                                                                <div class="col-1 text-end">${Number(item.ItemCount) * item.ItemPrice}
                                                                </div>
                                                            </div>
                                                        `;
                                        });
                                    })()}
                                                <div style="width: 100%;height: 1px;margin-top: 18px;margin-bottom: 18px;background-color: #DDD"></div>
                                                <div class="d-flex flex-row-reverse" style="width: 100%;">
                                                    <div class="col-1 text-end" style="font-weight: 700;">
                                                        ${allowanceData.allowance_data.invoiceAmount}
                                                    </div>
                                                    <div class="col-1"></div>
                                                    <div class="col-1 text-end" style="font-weight: 700;">總金額</div>
                                                </div>`),
                                    html `
                                                <div class="w-100 " style="margin-top: 24px;"></div>`,
                                    BgWidget.mainCard(html `
                                                <div style="margin-bottom: 12px;">折讓原因</div>
                                                <textarea
                                                        style="width: 100%; border-radius: 10px;border: 1px solid #DDD;padding: 5px;"
                                                        rows="3"
                                                        disabled>${(_0 = allowanceData.allowance_data.allowanceReason) !== null && _0 !== void 0 ? _0 : ""}</textarea>
                                                <div style="margin-top: 18px;margin-bottom: 12px;">折讓備註</div>
                                                <textarea
                                                        style="width: 100%; border-radius: 10px;border: 1px solid #DDD;padding: 5px;"
                                                        rows="3"
                                                        disabled>${(_1 = allowanceData.allowance_data.remark) !== null && _1 !== void 0 ? _1 : ""}</textarea>
                                                <div class="${(allowanceData.status == 2) ? '' : 'd-none'}" style="margin-top: 18px;margin-bottom: 12px;">作廢原因</div>
                                                <textarea
                                                        class="${(allowanceData.status == 2) ? '' : 'd-none'}"
                                                        style="width: 100%; border-radius: 10px;border: 1px solid #DDD;padding: 5px;"
                                                        rows="3"
                                                        disabled>${(_2 = allowanceData.allowance_data.voidReason) !== null && _2 !== void 0 ? _2 : ""}</textarea>
                                            `),
                                    html `
                                                <div style="margin-top: 240px;"></div>
                                            `,
                                    html `
                                                <div class="update-bar-container">
                                                        <!--
                                                    ${BgWidget.grayButton('列印收執聯', gvc.event(() => {
                                    }))}
                                                    ${BgWidget.grayButton('補寄發票', gvc.event(() => {
                                    }))}
                                                    ${BgWidget.grayButton('補發簡訊', gvc.event(() => {
                                    }))}
                                                    ${BgWidget.grayButton('寄送紙本', gvc.event(() => {
                                    }))}
                                                    -->
                                                    ${BgWidget.danger(gvc.event(() => {
                                        glitter.innerDialog((gvc) => {
                                            let step = 1;
                                            let reason = "";
                                            return gvc.bindView({
                                                bind: "voidDialog",
                                                view: () => {
                                                    return html `
                                                                        <div class="d-flex align-items-center justify-content-center"
                                                                             style="width: 100vw;height: 100vw;"
                                                                             onclick="${gvc.event(() => {
                                                        glitter.closeDiaLog();
                                                    })}">
                                                                            ${(() => {
                                                        var _a;
                                                        switch (step) {
                                                            case 2:
                                                                return html `
                                                                                            <div class="d-flex flex-column"
                                                                                                 style="width: 532px;height: 409px;flex-shrink: 0;border-radius: 10px;background: #FFF;position: relative;padding: 36px 64px;gap: 24px;"
                                                                                                 onclick="${gvc.event(() => {
                                                                    event.stopPropagation();
                                                                })}">
                                                                                                <div style="position: absolute;right: 20px;top: 17px;">
                                                                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                                                                         width="14" height="14"
                                                                                                         viewBox="0 0 14 14" fill="none">
                                                                                                        <path d="M1 1L13 13" stroke="#393939"
                                                                                                              stroke-linecap="round"/>
                                                                                                        <path d="M13 1L1 13" stroke="#393939"
                                                                                                              stroke-linecap="round"/>
                                                                                                    </svg>
                                                                                                </div>
                                                                                                <div class="w-100 d-flex align-items-center justify-content-center"
                                                                                                     style="">
                                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="76" height="75" viewBox="0 0 76 75" fill="none">
                                                                                                        <g clip-path="url(#clip0_14571_27453)">
                                                                                                            <path d="M38 7.03125C46.0808 7.03125 53.8307 10.2413 59.5447 15.9553C65.2587 21.6693 68.4688 29.4192 68.4688 37.5C68.4688 45.5808 65.2587 53.3307 59.5447 59.0447C53.8307 64.7587 46.0808 67.9688 38 67.9688C29.9192 67.9688 22.1693 64.7587 16.4553 59.0447C10.7413 53.3307 7.53125 45.5808 7.53125 37.5C7.53125 29.4192 10.7413 21.6693 16.4553 15.9553C22.1693 10.2413 29.9192 7.03125 38 7.03125ZM38 75C47.9456 75 57.4839 71.0491 64.5165 64.0165C71.5491 56.9839 75.5 47.4456 75.5 37.5C75.5 27.5544 71.5491 18.0161 64.5165 10.9835C57.4839 3.95088 47.9456 0 38 0C28.0544 0 18.5161 3.95088 11.4835 10.9835C4.45088 18.0161 0.5 27.5544 0.5 37.5C0.5 47.4456 4.45088 56.9839 11.4835 64.0165C18.5161 71.0491 28.0544 75 38 75ZM38 18.75C36.0518 18.75 34.4844 20.3174 34.4844 22.2656V38.6719C34.4844 40.6201 36.0518 42.1875 38 42.1875C39.9482 42.1875 41.5156 40.6201 41.5156 38.6719V22.2656C41.5156 20.3174 39.9482 18.75 38 18.75ZM42.6875 51.5625C42.6875 50.3193 42.1936 49.127 41.3146 48.2479C40.4355 47.3689 39.2432 46.875 38 46.875C36.7568 46.875 35.5645 47.3689 34.6854 48.2479C33.8064 49.127 33.3125 50.3193 33.3125 51.5625C33.3125 52.8057 33.8064 53.998 34.6854 54.8771C35.5645 55.7561 36.7568 56.25 38 56.25C39.2432 56.25 40.4355 55.7561 41.3146 54.8771C42.1936 53.998 42.6875 52.8057 42.6875 51.5625Z" fill="#393939"/>
                                                                                                        </g>
                                                                                                        <defs>
                                                                                                            <clipPath id="clip0_14571_27453">
                                                                                                                <rect width="75" height="75" fill="white" transform="translate(0.5)"/>
                                                                                                            </clipPath>
                                                                                                        </defs>
                                                                                                    </svg>
                                                                                                </div>
                                                                                                <div class="w-100"
                                                                                                     style="text-align: center;font-size: 16px;">
                                                                                                    <div>確定要將此折讓單作廢嗎？<br>
                                                                                                        作廢後，相關交易和記錄將無法恢復。
                                                                                                    </div>
                                                                                                    <div style="display: flex;padding: 11px 18px;align-items: center;border-radius: 10px;background: #F7F7F7;margin: 8px 0;">
                                                                                                        <div class="d-flex flex-column" style="font-size: 14px;">
                                                                                                            <div class="d-flex">
                                                                                                                <div style="margin-right: 41px;">折讓單號碼</div>
                                                                                                                <div>${allowanceData.allowance_no}</div>
                                                                                                            </div>
                                                                                                            <div class="d-flex">
                                                                                                                <div style="margin-right: 18px;">總金額(不含稅)</div>
                                                                                                                <div>${(_a = allowanceData.allowance_data.invoiceAmount) !== null && _a !== void 0 ? _a : 0}</div>
                                                                                                            </div>
                                                                                                            <div class="d-flex">
                                                                                                                <div style="margin-right: 55px;">作廢原因</div>
                                                                                                                <div>${reason}</div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div style="color: #8D8D8D;text-align: center;font-size: 13px;line-height: 160%; ">
                                                                                                        ※提醒您，請務必將已印出的折讓單銷毀，以免引起混淆或誤用。
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div class="d-flex align-items-center justify-content-center w-100"
                                                                                                     style="gap: 14px;">
                                                                                                    <div class="btn btn-white"
                                                                                                         style="padding: 6px 18px;border-radius: 10px;border: 1px solid #DDD;font-size: 16px;font-weight: 700;color: #393939;"
                                                                                                         onclick="${gvc.event(() => {
                                                                    step = 1;
                                                                    gvc.notifyDataChange(`voidDialog`);
                                                                })}">
                                                                                                        上一步
                                                                                                    </div>
                                                                                                    <div class="btn btn-red"
                                                                                                         style="padding: 6px 18px;border-radius: 10px;border: 1px solid #DDD;font-weight: 700;"
                                                                                                         onclick="${gvc.event(() => {
                                                                    ApiShop.voidAllowance(allowanceData.invoice_no, allowanceData.allowance_no, reason).then(r => {
                                                                        vm.type = "list";
                                                                        glitter.closeDiaLog();
                                                                    });
                                                                })}">
                                                                                                        作廢
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        `;
                                                            default:
                                                                return html `
                                                                                            <div class="d-flex flex-column"
                                                                                                 style="width: 532px;height: 270px;flex-shrink: 0;border-radius: 10px;background: #FFF;position: relative;padding: 36px 64px;gap: 24px;"
                                                                                                 onclick="${gvc.event(() => {
                                                                    event.stopPropagation();
                                                                })}">
                                                                                                <div style="position: absolute;right: 20px;top: 17px;">
                                                                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                                                                         width="14" height="14"
                                                                                                         viewBox="0 0 14 14" fill="none">
                                                                                                        <path d="M1 1L13 13" stroke="#393939"
                                                                                                              stroke-linecap="round"/>
                                                                                                        <path d="M13 1L1 13" stroke="#393939"
                                                                                                              stroke-linecap="round"/>
                                                                                                    </svg>
                                                                                                </div>
                                                                                                <div class="w-100 d-flex flex-column"
                                                                                                     style="text-align: center;font-size: 16px;gap:12px;">
                                                                                                    <div>請填寫作廢原因</div>
                                                                                                    <textarea style="display: flex;height: 100px;padding: 5px 18px;justify-content: center;align-items: center;gap: 10px;align-self: stretch;border-radius: 10px;border: 1px solid #DDD;" onchange="${gvc.event((e) => {
                                                                    reason = e.value;
                                                                })}">${reason}</textarea>
                                                                                                </div>
                                                                                                <div class="d-flex align-items-center justify-content-center w-100"
                                                                                                     style="gap: 14px;">
                                                                                                    <div class="btn btn-white"
                                                                                                         style="padding: 6px 18px;border-radius: 10px;border: 1px solid #DDD;font-size: 16px;font-weight: 700;color: #393939;"
                                                                                                         onclick="${gvc.event(() => {
                                                                    glitter.closeDiaLog();
                                                                })}">
                                                                                                        取消
                                                                                                    </div>
                                                                                                    <div class="btn btn-red"
                                                                                                         style="padding: 6px 18px;border-radius: 10px;border: 1px solid #DDD;font-weight: 700;"
                                                                                                         onclick="${gvc.event(() => {
                                                                    step = 2;
                                                                    gvc.notifyDataChange('voidDialog');
                                                                })}">
                                                                                                        下一步
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        `;
                                                        }
                                                    })()}
                                                                            
                                                                        </div>
                                                                    `;
                                                }, divCreate: {}
                                            });
                                        }, 'voidWarning');
                                    }), "折讓單作廢")}

                                                </div>`
                                ].join('');
                            }
                            return ``;
                        }, divCreate: {}
                    })}
                        `);
                }
                catch (e) {
                    console.error(e);
                    return BgWidget.maintenance();
                }
            },
            divCreate: {},
            onCreate: () => {
                $('.pos-footer-menu').hide();
            },
            onDestroy: () => {
                $('.pos-footer-menu').show();
            },
        });
    }
    static createOrder(gvc, vm) {
        let viewModel = {
            searchOrder: 'VF10008513',
            searchData: '',
            orderData: {},
            errorReport: '',
            allowanceData: {},
            allowanceInvoiceTotalAmount: 0,
            invoiceData: {
                getPaper: "Y",
                date: '',
                time: '',
                category: '應稅'
            },
            customerInfo: {}
        };
        const dialog = new ShareDialog(gvc.glitter);
        let loading = false;
        gvc.addStyle(html `
            input[type="number"]::-webkit-outer-spin-button,
            input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
            }

            /* 適用於 Firefox */
            input[type="number"] {
            -moz-appearance: textfield;
            }
        `);
        return BgWidget.container(html `
                <!-- 標頭 --- 新增訂單標題和返回 -->
                <div class="title-container">
                    ${BgWidget.goBack(gvc.event(() => {
            vm.type = 'list';
        }))}
                    ${BgWidget.title('手動開立折讓單')}
                </div>
                <div style="margin-top: 24px;"></div>
                ${BgWidget.mainCard(html `
                    <div style="display: flex;padding: 20px;flex-direction: column;align-items: flex-start;gap: 12px;align-self: stretch;">
                        <div style="font-size: 16px;font-weight: 700;">發票編號*</div>
                        <input
                                style="display: flex;height: 40px;padding: 9px 18px;align-items: flex-start;gap: 10px;align-self: stretch;border-radius: 10px;border: 1px solid #DDD;font-size: 16px;font-weight: 400;"
                                placeholder="請輸入發票編號"
                                value="${viewModel.searchOrder}"
                                onchange="${gvc.event((e) => {
            viewModel.searchOrder = e.value;
        })}"
                        />
                        <div
                                style="display: flex;padding: 6px 18px;justify-content: center;align-items: center;gap: 8px;border-radius: 10px;background: #EAEAEA;font-weight: 700;cursor: pointer;"
                                onclick="${gvc.event(() => {
            loading = true;
            gvc.notifyDataChange(['notFind', 'allowanceContent']);
            if (viewModel.searchOrder == '') {
                return;
            }
            dialog.dataLoading({ visible: true });
            ApiShop.getInvoice({
                page: 0,
                limit: 100,
                search: viewModel.searchOrder,
                searchType: 'invoice_number',
            }).then((response) => {
                dialog.dataLoading({ visible: false });
                if (response.response.length == 0) {
                    viewModel.errorReport = '查無發票';
                    loading = false;
                    gvc.notifyDataChange(['notFind', 'allowanceContent']);
                }
                if (response.response && response.response.data.length > 0) {
                    dialog.dataLoading({ visible: true });
                    viewModel.searchData = response.response.data[0];
                    viewModel.searchData.invoice_data.original_data.Items.forEach((item) => {
                        item.ItemCount = 0;
                    });
                    ApiShop.getOrder({
                        page: 0,
                        limit: 100,
                        search: viewModel.searchData.invoice_data.original_data.RelateNumber,
                        searchType: 'cart_token',
                        archived: `false`,
                        returnSearch: 'true',
                    }).then((response) => {
                        viewModel.orderData = response.response.orderData;
                        loading = false;
                        dialog.dataLoading({ visible: false });
                        gvc.notifyDataChange(['notFind', 'allowanceContent']);
                    });
                }
                gvc.notifyDataChange(['notFind', 'invoiceContent']);
            });
        })}"
                        >
                            查詢發票
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
            bind: 'allowanceContent',
            view: () => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
                const dialog = new ShareDialog(gvc.glitter);
                if (viewModel.searchData) {
                    dialog.dataLoading({ visible: false });
                    function getNextPeriod15th(date) {
                        const nextPeriodDate = new Date(date);
                        const currentMonth = date.getMonth() + 1;
                        if (currentMonth % 2 === 1) {
                            nextPeriodDate.setMonth(currentMonth + 1);
                        }
                        else {
                            nextPeriodDate.setMonth(currentMonth + 2);
                        }
                        nextPeriodDate.setDate(15);
                        return nextPeriodDate;
                    }
                    const dbDate = new Date(`${(_b = (_a = viewModel.searchData) === null || _a === void 0 ? void 0 : _a.invoice_data) === null || _b === void 0 ? void 0 : _b.response.InvoiceDate.split('+')[0]}`);
                    const minDateStr = dbDate.toISOString().split('T')[0];
                    const maxDateStr = getNextPeriod15th(dbDate).toISOString().split('T')[0];
                    viewModel.allowanceData.date = new Date().toISOString().split('T')[0];
                    let orderData = viewModel.searchData.invoice_data.original_data;
                    let gui_number = viewModel.orderData.user_info.gui_number;
                    let itemArray = viewModel.orderData.lineItems;
                    let invoiceArray = viewModel.searchData.invoice_data.original_data.Items;
                    return [
                        BgWidget.mainCard(html `
                                    <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 18px;align-self: stretch;color:#393939;font-size: 16px;font-weight: 400;">
                                        <div style="font-weight: 700;">發票內容</div>
                                        <div class="w-100"
                                             style="display: flex;flex-direction: column;align-items: flex-start;gap: 8px;">
                                            <div class="w-100"
                                                 style="display: flex;align-items: flex-start;gap: 18px;">
                                                ${BgWidget.editeInput({
                            gvc: gvc,
                            title: '發票編號',
                            default: viewModel.searchData.invoice_no,
                            readonly: true,
                            placeHolder: '',
                            callback: (data) => {
                            },
                            divStyle: 'width:50%;'
                        })}
                                                <div class="d-flex flex-column w-50" style="gap:8px;">
                                                    <div>發票日期</div>
                                                    <input type="date"
                                                           style="padding: 9px 18px;border-radius: 10px;border: 1px solid #dddddd"
                                                           value="${(_e = (_d = (_c = viewModel.searchData) === null || _c === void 0 ? void 0 : _c.invoice_data) === null || _d === void 0 ? void 0 : _d.response.InvoiceDate.split('+')[0]) !== null && _e !== void 0 ? _e : ``}"
                                                           readonly disabled
                                                           onchange="${gvc.event((e) => {
                        })}">
                                                </div>
                                            </div>
                                            <div class="w-100"
                                                 style="display: flex;align-items: flex-start;gap: 18px;">
                                                ${BgWidget.editeInput({
                            gvc: gvc,
                            title: '訂單編號',
                            default: viewModel.searchData.order_id,
                            readonly: true,
                            placeHolder: '',
                            callback: (data) => {
                            },
                            divStyle: 'width:50%;'
                        })}
                                                <div class="d-flex flex-column w-50" style="gap:8px;">
                                                    <div>發票日期</div>
                                                    <input type="date"
                                                           style="padding: 9px 18px;border-radius: 10px;border: 1px solid #dddddd"
                                                           value="${(_h = (_g = (_f = viewModel.searchData) === null || _f === void 0 ? void 0 : _f.invoice_data) === null || _g === void 0 ? void 0 : _g.response.InvoiceDate.split('+')[0]) !== null && _h !== void 0 ? _h : ``}"
                                                           min="${minDateStr}" max="${maxDateStr}"
                                                           onchange="${gvc.event((e) => {
                            viewModel.allowanceData.date = e.value;
                        })}">
                                                </div>
                                            </div>
                                            <div class="w-100" style="display: flex;align-items: flex-start;gap: 18px;">
                                                ${BgWidget.editeInput({
                            gvc: gvc,
                            title: '買受人姓名',
                            default: (_l = (_k = (_j = viewModel.orderData) === null || _j === void 0 ? void 0 : _j.user_info) === null || _k === void 0 ? void 0 : _k.name) !== null && _l !== void 0 ? _l : "",
                            placeHolder: '請輸入買受人姓名',
                            readonly: true,
                            callback: (data) => {
                            },
                            divStyle: 'width:50%;'
                        })}
                                                ${BgWidget.editeInput({
                            gvc: gvc,
                            title: '買受人電話',
                            default: (_p = (_o = (_m = viewModel.orderData) === null || _m === void 0 ? void 0 : _m.user_info) === null || _o === void 0 ? void 0 : _o.phone) !== null && _p !== void 0 ? _p : "",
                            placeHolder: '',
                            readonly: true,
                            callback: (data) => {
                            },
                            divStyle: 'width:50%;'
                        })}
                                            </div>
                                            <div class="w-100" style="display: flex;align-items: flex-start;gap: 18px;">
                                                ${BgWidget.editeInput({
                            gvc: gvc,
                            title: '買受人地址',
                            default: (_s = (_r = (_q = viewModel.orderData) === null || _q === void 0 ? void 0 : _q.user_info) === null || _r === void 0 ? void 0 : _r.address) !== null && _s !== void 0 ? _s : "",
                            readonly: true,
                            placeHolder: '請輸入買受人地址',
                            callback: (data) => {
                            },
                            divStyle: 'width:50%;'
                        })}
                                                ${BgWidget.editeInput({
                            gvc: gvc,
                            title: '買受人電子信箱',
                            default: (_v = (_u = (_t = viewModel.orderData) === null || _t === void 0 ? void 0 : _t.user_info) === null || _u === void 0 ? void 0 : _u.email) !== null && _v !== void 0 ? _v : "",
                            readonly: true,
                            placeHolder: '請輸入買受人電子信箱',
                            callback: (data) => {
                            },
                            divStyle: 'width:50%;'
                        })}
                                            </div>
                                        </div>
                                    </div>
                                `),
                        html `
                                    <div style="margin-top: 24px;"></div>`,
                        BgWidget.mainCard(html `
                                    <div style="font-size: 16px;font-weight: 700;margin-bottom:18px;">需折讓商品列表</div>
                                    <div class="d-flex w-100 align-items-center">
                                        <div class="col-6 ">商品名稱</div>
                                        <div class="col-2 text-center">規格</div>
                                        <div class="col-1 text-center">單位</div>
                                        <div class="col-1 text-center">折讓單價</div>
                                        <div class="col-1 text-center">折讓數量</div>
                                        <div class="col-1 text-center">小計</div>
                                    </div>
                                    <div style="width: 100%;height: 1px;margin-top: 12px;margin-bottom: 18px;background-color: #DDD"></div>
                                    ${gvc.bindView({
                            bind: 'itemList',
                            view: () => {
                                viewModel.allowanceInvoiceTotalAmount = 0;
                                return html `
                                                ${itemArray.map((item) => {
                                    var _a;
                                    let invoiceItem = invoiceArray.find((item2) => item2.ItemName.split('/')[0] === item.title);
                                    invoiceItem.ItemAmount = invoiceItem.ItemCount * invoiceItem.ItemPrice;
                                    viewModel.allowanceInvoiceTotalAmount += invoiceItem.ItemAmount;
                                    return html `
                                                        <div class="d-flex w-100 align-items-center" style="">
                                                            <div class="col-6 d-flex align-items-center">
                                                                <img src="${item.preview_image}"
                                                                     style="width: 40px;height: 40px;border-radius: 5px;margin-right:12px;">
                                                                ${item.title}
                                                            </div>
                                                            <div class="col-2 text-center">
                                                                ${(_a = item.spec.join(',')) !== null && _a !== void 0 ? _a : "單一規格"}
                                                            </div>
                                                            <div class="col-1 text-center">${invoiceItem.ItemWord}</div>
                                                            <div class="col-1 text-center px-1">
                                                                <input type="number" class="w-100 text-center" min="0"
                                                                       max="${item.sale_price}" value="${invoiceItem.ItemPrice}"
                                                                       style="border-radius: 10px;border: 1px solid #DDD;"
                                                                       onchange="${gvc.event((e) => {
                                        if (e.value > item.sale_price) {
                                            e.value = item.sale_price;
                                        }
                                        if (e.value < 0) {
                                            e.value = 0;
                                        }
                                        invoiceItem.ItemPrice = e.value;
                                        gvc.notifyDataChange(['itemList']);
                                    })}">
                                                            </div>
                                                            <div class="col-1 text-center px-2">
                                                                <input type="number" class="w-100 text-center" min="0"
                                                                       max="${item.count}" value="${invoiceItem.ItemCount}"
                                                                       style="border-radius: 10px;border: 1px solid #DDD;"
                                                                       onchange="${gvc.event((e) => {
                                        if (e.value > item.count) {
                                            e.value = item.count;
                                        }
                                        if (e.value < 0) {
                                            e.value = 0;
                                        }
                                        invoiceItem.ItemCount = e.value;
                                        gvc.notifyDataChange(['itemList']);
                                    })}">
                                                            </div>
                                                            <div class="col-1 text-center">
                                                                ${viewModel.allowanceInvoiceTotalAmount}
                                                            </div>
                                                        </div>
                                                    `;
                                }).join(' ')}
                                                
                                                <div style="width: 100%;height: 1px;margin-top: 18px;margin-bottom: 18px;background-color: #DDD"></div>

                                                <div class="d-flex flex-row-reverse" style="width: 100%;">
                                                    <div class="col-1 text-end" style="font-weight: 700;">
                                                        ${viewModel.allowanceInvoiceTotalAmount}
                                                    </div>
                                                    <div class="col-1"></div>
                                                    <div class="col-1 text-center " style="font-weight: 700; ">總金額
                                                    </div>
                                                </div>
                                            `;
                            }, divCreate: {}
                        })}`),
                        html `
                                    <div style="margin-top: 24px;"></div>`,
                        BgWidget.mainCard(html `
                                    <div style="margin-bottom: 12px;">折讓原因</div>
                                    <textarea
                                            style="width: 100%; border-radius: 10px;border: 1px solid #DDD;padding: 5px;"
                                            rows="3" onchange="${gvc.event((e) => {
                            viewModel.allowanceData.allowanceReason = e.value;
                        })}"></textarea>
                                    <div style="margin-top: 18px;margin-bottom: 12px;">折讓備註</div>
                                    <textarea
                                            style="width: 100%; border-radius: 10px;border: 1px solid #DDD;padding: 5px;"
                                            rows="3" onchange="${gvc.event((e) => {
                            viewModel.allowanceData.remark = e.value;
                        })}"></textarea>
                                `),
                        html `
                                    <div style="margin-top: 240px;"></div>
                                `,
                        html `
                                    <div class="update-bar-container">
                                        ${BgWidget.cancel(gvc.event(() => {
                            vm.type = 'list';
                        }))}
                                        ${BgWidget.save(gvc.event(() => {
                            viewModel.allowanceData.invoiceArray = invoiceArray;
                            viewModel.allowanceData.invoiceAmount = viewModel.allowanceInvoiceTotalAmount;
                            let passData = {
                                invoiceID: viewModel.searchData.invoice_no,
                                allowanceData: viewModel.allowanceData,
                                orderID: viewModel.searchData.order_id,
                                orderData: viewModel.searchData,
                                allowanceInvoiceTotalAmount: viewModel.allowanceInvoiceTotalAmount,
                                itemList: viewModel.orderData.lineItems,
                                invoiceDate: viewModel.searchData.invoice_data.response.InvoiceDate,
                            };
                            const dialog = new ShareDialog(gvc.glitter);
                            console.log("passData -- ", passData);
                            if (viewModel.allowanceInvoiceTotalAmount == 0) {
                                dialog.infoMessage({
                                    text: "折讓金額不得為0"
                                });
                            }
                            else {
                                dialog.dataLoading({
                                    visible: true
                                });
                                ApiShop.postAllowance(passData).then(r => {
                                    dialog.dataLoading({
                                        visible: false
                                    });
                                    if (r.response.RtnCode == "1") {
                                        dialog.infoMessage({
                                            text: html `折讓單建立完成<br>可折讓金額剩餘${r.response.IA_Remain_Allowance_Amt}`
                                        });
                                    }
                                    else {
                                        dialog.warningMessage({
                                            callback: () => { },
                                            text: html `此發票已無可用折讓餘額`
                                        });
                                    }
                                });
                            }
                        }), '開立')}
                                    </div>`
                    ].join('');
                }
                if (loading) {
                    return ``;
                }
                return ``;
            }, divCreate: {}
        })}
            `);
    }
}
window.glitter.setModule(import.meta.url, ShoppingAllowanceManager);
