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
import { ApiDelivery } from '../glitter-base/route/delivery.js';
import { Tool } from '../modules/tool.js';
const html = String.raw;
export class ShoppingInvoiceManager {
    static supportShipmentMethod() {
        return [
            {
                title: '門市立即取貨',
                value: 'now',
                name: '',
            },
            {
                title: '一般宅配',
                value: 'normal',
                name: '',
            },
            {
                title: '全家店到店',
                value: 'FAMIC2C',
                name: '',
            },
            {
                title: '萊爾富店到店',
                value: 'HILIFEC2C',
                name: '',
            },
            {
                title: 'OK超商店到店',
                value: 'OKMARTC2C',
                name: '',
            },
            {
                title: '7-ELEVEN超商交貨便',
                value: 'UNIMARTC2C',
                name: '',
            },
            {
                title: '實體門市取貨',
                value: 'shop',
                name: '',
            },
        ].map((dd) => {
            dd.name = dd.title;
            return dd;
        });
    }
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
        gvc.addMtScript([{ src: 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js' }], () => { }, () => { });
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
                                ${BgWidget.title('發票列表')}
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
                                    ${query.isArchived
                        ? ''
                        : BgWidget.darkButton('手動開立發票', gvc.event(() => {
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
                                            default: vm.queryType || 'order_number',
                                            options: FilterOptions.invoiceSelect,
                                        }),
                                        BgWidget.searchFilter(gvc.event((e) => {
                                            vm.query = e.value;
                                            gvc.notifyDataChange(vm.id);
                                        }), vm.query || '', '搜尋發票'),
                                        BgWidget.funnelFilter({
                                            gvc,
                                            callback: () => {
                                                ListComp.showRightMenu(FilterOptions.invoiceFunnel);
                                            },
                                        }),
                                        BgWidget.updownFilter({
                                            gvc,
                                            callback: (value) => {
                                                vm.orderString = value;
                                                gvc.notifyDataChange(vm.id);
                                            },
                                            default: vm.orderString || 'created_time_desc',
                                            options: FilterOptions.invoiceOrderBy,
                                        }),
                                    ];
                                    const filterTags = ListComp.getFilterTags(FilterOptions.invoiceFunnel);
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
                            });
                        })(),
                        BgWidget.tableV3({
                            gvc: gvc,
                            getData: (vmi) => {
                                const limit = 20;
                                ApiShop.getInvoice({
                                    page: vmi.page - 1,
                                    limit: limit,
                                    search: vm.query || "",
                                    searchType: vm.queryType || 'invoice_no',
                                    orderString: vm.orderString,
                                    filter: vm.filter,
                                }).then((data) => {
                                    function getDatalist() {
                                        console.log("data -- ", data);
                                        return data.response.data.map((dd) => {
                                            return [
                                                {
                                                    key: '發票號碼',
                                                    value: dd.invoice_no,
                                                },
                                                {
                                                    key: '訂單編號',
                                                    value: dd.order_id,
                                                },
                                                {
                                                    key: '含稅總計',
                                                    value: html `<div style="padding-left: 5px;">${dd.invoice_data.original_data.SalesAmount}</div>`,
                                                },
                                                {
                                                    key: '買受人',
                                                    value: html `<div style="padding-left: 5px;">${dd.invoice_data.original_data.CustomerName}</div>`,
                                                },
                                                {
                                                    key: '發票日期',
                                                    value: glitter.ut.dateFormat(new Date(dd.create_date), 'yyyy-MM-dd hh:mm:ss'),
                                                },
                                                {
                                                    key: '發票種類',
                                                    value: (() => {
                                                        var _a;
                                                        switch ((_a = dd.progress) !== null && _a !== void 0 ? _a : 'B2B') {
                                                            case 'B2B':
                                                                return BgWidget.notifyInsignia('B2B');
                                                            case 'B2C':
                                                                return BgWidget.warningInsignia('B2C');
                                                        }
                                                    })(),
                                                },
                                                {
                                                    key: '開立方式',
                                                    value: (() => {
                                                        var _a;
                                                        switch ((_a = dd.status) !== null && _a !== void 0 ? _a : '0') {
                                                            case 1:
                                                                return html `<div style="padding-left: 5px;">自動</div>`;
                                                            case 0:
                                                                return html `<div style="padding-left: 5px;">手動</div>`;
                                                        }
                                                    })(),
                                                },
                                                {
                                                    key: '發票狀態',
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
                                                                return BgWidget.infoInsignia('已折讓');
                                                        }
                                                    })(),
                                                },
                                            ].map((dd) => {
                                                dd.value = html ` <div style="line-height:40px;">${dd.value}</div>`;
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
        };
        let userData = {};
        const mainViewID = gvc.glitter.getUUID();
        orderData.orderData.progress = (_b = orderData.orderData.progress) !== null && _b !== void 0 ? _b : 'wait';
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
        const vt = {
            paymentBadge: () => {
                if (orderData.status === 0) {
                    if (orderData.orderData.proof_purchase) {
                        return BgWidget.warningInsignia('待核款');
                    }
                    return BgWidget.notifyInsignia('未付款');
                }
                else if (orderData.status === 1) {
                    return BgWidget.infoInsignia('已付款');
                }
                else if (orderData.status === -2) {
                    return BgWidget.notifyInsignia('已退款');
                }
                else {
                    return BgWidget.notifyInsignia('付款失敗');
                }
            },
            outShipBadge: () => {
                var _a;
                switch ((_a = orderData.orderData.progress) !== null && _a !== void 0 ? _a : 'wait') {
                    case 'finish':
                        return BgWidget.infoInsignia('已取貨');
                    case 'shipping':
                        return BgWidget.warningInsignia('已出貨');
                    case 'arrived':
                        return BgWidget.warningInsignia('已送達');
                    case 'wait':
                        return BgWidget.notifyInsignia('未出貨');
                    case 'returns':
                        return BgWidget.notifyInsignia('已退貨');
                }
            },
            orderStatusBadge: () => {
                if (orderData.orderData.orderStatus === '1') {
                    return BgWidget.infoInsignia('已完成');
                }
                else if (orderData.orderData.orderStatus === '0') {
                    return BgWidget.warningInsignia('處理中');
                }
                return BgWidget.notifyInsignia('已取消');
            },
            archivedBadge: () => {
                if (orderData.orderData.archived === 'true') {
                    return BgWidget.secondaryInsignia('已封存');
                }
                return '';
            },
        };
        ApiUser.getUsersDataWithEmailOrPhone(orderData.email).then((res) => {
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
            dataList: [{ obj: child_vm, key: 'type' }],
            view: () => {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                try {
                    if (userDataLoading) {
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
                        return html ` <div style="display:flex; gap:10px; justify-content:flex-end;">${vt.archivedBadge()} ${vt.paymentBadge()}${vt.outShipBadge()}${vt.orderStatusBadge()}</div>`;
                    }
                    return BgWidget.container(html `<div class="title-container">
                                ${BgWidget.goBack(gvc.event(() => {
                        vm.type = 'list';
                    }))}
                                <div class="d-flex flex-column">
                                    <div class="align-items-center" style="gap:10px;color: #393939;font-size: 24px;font-weight: 700;">#${orderData.cart_token}</div>
                                    ${BgWidget.grayNote(`訂單成立時間 : ${glitter.ut.dateFormat(new Date(orderData.created_time), 'yyyy-MM-dd hh:mm')}`)}
                                </div>
                                <div class="flex-fill"></div>
                                ${document.body.clientWidth > 768 ? getBadgeList() : ''}
                            </div>
                            ${document.body.clientWidth > 768 ? '' : html ` <div class="mt-1 mb-3">${getBadgeList()}</div>`}
                            ${BgWidget.container1x2({
                        html: [
                            BgWidget.mainCard(html `
                                                <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;align-self: stretch;">
                                                    <div class="tx_700">訂單狀態</div>
                                                    <div class="ms-auto w-100">
                                                        ${EditorElem.select({
                                title: ``,
                                gvc: gvc,
                                def: (_a = orderData.orderData.orderStatus) !== null && _a !== void 0 ? _a : '0',
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
                                                <div class="tx_700 my-3">訂單明細</div>
                                                ${BgWidget.horizontalLine()}
                                                <div class="d-flex flex-column">
                                                    ${orderData.orderData.lineItems
                                .map((dd) => {
                                return gvc.bindView({
                                    bind: glitter.getUUID(),
                                    view: () => {
                                        return html ` <div class="d-flex flex-column align-items-center justify-content-center" style="gap:5px;margin-right:12px;">
                                                                            ${BgWidget.validImageBox({
                                            gvc,
                                            image: dd.preview_image,
                                            width: 60,
                                            class: 'border rounded',
                                            style: '',
                                        })}
                                                                            ${dd.is_add_on_items ? `<div class="">${BgWidget.warningInsignia('加購品')}</div>` : ``}
                                                                        </div>
                                                                        <div class="d-flex flex-column" style="gap:2px;">
                                                                            <div class="tx_700">${dd.title}</div>
                                                                            ${dd.spec.length > 0 ? BgWidget.grayNote(dd.spec.join(', ')) : ''}
                                                                            ${BgWidget.grayNote(`存貨單位 (SKU)：${dd.sku && dd.sku.length > 0 ? dd.sku : '無'}`)}
                                                                        </div>
                                                                        <div class="flex-fill"></div>
                                                                        <div class="tx_normal_14">$${dd.sale_price.toLocaleString()} × ${dd.count}</div>
                                                                        <div class="tx_normal" style="display: flex;justify-content: end;width: 110px;">$${dd.sale_price.toLocaleString()}</div>`;
                                    },
                                    divCreate: { class: `d-flex align-items-center` },
                                });
                            })
                                .join(BgWidget.horizontalLine({ color: '#f6f6f6' }))}
                                                    ${BgWidget.horizontalLine()}
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
                                        description: `<div style="color: #8D8D8D;font-size: 14px;white-space:nowrap;text-overflow:ellipsis;">${dd.title}</div>`,
                                        total: `- $${orderData.orderData.discount.toLocaleString()}`,
                                    };
                                }),
                                {
                                    title: html `<span class="tx_700">總金額</span>`,
                                    description: '',
                                    total: html `<span class="tx_700">$${orderData.orderData.total.toLocaleString()}</span>`,
                                },
                            ]
                                .map((dd) => {
                                var _a;
                                return html ` <div class="d-flex align-items-center justify-content-end">
                                                                <div class="tx_normal_14">${dd.title} ${(_a = dd.description) !== null && _a !== void 0 ? _a : ''}</div>
                                                                <div class="tx_normal" style="width: 114px;display: flex;justify-content: end;">${dd.total}</div>
                                                            </div>`;
                            })
                                .join(BgWidget.mbContainer(18))}
                                                </div>
                                            `),
                            BgWidget.mainCard(html `
                                            <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;align-self: stretch;">
                                                <div class="tx_700">付款狀態</div>
                                                <div class="ms-auto w-100">
                                                    ${EditorElem.select({
                                title: ``,
                                gvc: gvc,
                                def: `${orderData.status}`,
                                array: [
                                    {
                                        title: '變更付款狀態',
                                        value: '',
                                    },
                                    {
                                        title: '已付款',
                                        value: '1',
                                    },
                                    {
                                        title: orderData.orderData.proof_purchase ? `待核款` : `未付款`,
                                        value: '0',
                                    },
                                    {
                                        title: '已退款',
                                        value: '-2',
                                    },
                                ],
                                callback: (text) => {
                                    if (text && text !== `${orderData.status}`) {
                                        orderData.status = parseInt(text, 10);
                                    }
                                },
                            })}
                                                </div>
                                            </div>
                                            ${BgWidget.mbContainer(18)}
                                        `),
                            BgWidget.mainCard(gvc.bindView(() => {
                                const vm = {
                                    mode: 'read',
                                };
                                return {
                                    bind: 'Edit',
                                    dataList: [{ obj: vm, key: 'mode' }],
                                    view: () => {
                                        return [
                                            html ` <div class="tx_700">配送 / 收件人資訊</div>`,
                                            html ` <div class="tx_700">配送狀態</div>
                                                                ${BgWidget.mbContainer(12)}
                                                                <div class="ms-auto w-100">
                                                                    ${EditorElem.select({
                                                title: ``,
                                                gvc: gvc,
                                                def: `${orderData.orderData.progress}`,
                                                array: [
                                                    { title: '配送狀態', value: '' },
                                                    { title: '已出貨', value: 'shipping' },
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
                                                                </div>`,
                                            html ` <div class="tx_700">配送方式</div>
                                                                ${BgWidget.mbContainer(12)}
                                                                <div class="d-flex w-100 align-items-center gap-2">
                                                                
                                                                    ${['FAMIC2C', 'UNIMARTC2C', 'HILIFEC2C', 'OKMARTC2C'].includes(orderData.orderData.user_info.shipment)
                                                ? BgWidget.customButton({
                                                    button: {
                                                        color: 'gray',
                                                        size: 'sm',
                                                    },
                                                    text: {
                                                        name: '列印托運單',
                                                    },
                                                    event: gvc.event(() => {
                                                        const delivery = orderData.orderData.deliveryData;
                                                        if (!delivery || !delivery.LogisticsSubType) {
                                                            const dialog = new ShareDialog(gvc.glitter);
                                                            dialog.errorMessage({ text: '無法列印此托運單' });
                                                            return '';
                                                        }
                                                        return this.printStoreOrderInfo({
                                                            gvc,
                                                            store: delivery.LogisticsSubType,
                                                            deliverys: [
                                                                {
                                                                    AllPayLogisticsID: delivery.AllPayLogisticsID,
                                                                    CVSPaymentNo: delivery.CVSPaymentNo,
                                                                    CVSValidationNo: delivery.CVSValidationNo,
                                                                },
                                                            ],
                                                        });
                                                    }),
                                                })
                                                : ''}
                                                                </div>`,
                                            html ` ${['UNIMARTC2C', 'FAMIC2C', 'OKMARTC2C', 'HILIFEC2C', 'normal'].includes(orderData.orderData.user_info.shipment)
                                                ? html ` <div class="tx_700">配送資訊</div>
                                                                          ${BgWidget.mbContainer(12)}`
                                                : ``}
                                                                <div class="d-flex flex-column tx_normal" style="gap: 4px;">
                                                                    ${(() => {
                                                if (orderData.orderData.user_info.shipment == 'normal') {
                                                    return orderData.orderData.user_info.address;
                                                }
                                                const formData = (orderData.orderData.shipment_selector || ShoppingInvoiceManager.supportShipmentMethod()).find((dd) => {
                                                    return dd.value === orderData.orderData.user_info.shipment;
                                                });
                                                if (['UNIMARTC2C', 'FAMIC2C', 'OKMARTC2C', 'HILIFEC2C'].includes(orderData.orderData.user_info.shipment)) {
                                                    return html `
                                                                                <div class="d-flex flex-wrap">
                                                                                    <span class="me-2">門市名稱:</span>
                                                                                    <div style="white-space: normal;word-break: break-all;">${orderData.orderData.user_info.CVSStoreName}</div>
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
                                                                                        <span class="me-2">${dd.title}:</span>
                                                                                        <div style="white-space: normal;word-break: break-all;">
                                                                                            ${orderData.orderData.user_info.custom_form_delivery[dd.key]}
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
                                                        .map((item) => {
                                                        return html ` <div>${item[0]}: ${orderData.orderData.user_info[item[1]] || '未填寫'}</div>
                                                                                        ${BgWidget.mbContainer(4)}`;
                                                    })
                                                        .join('');
                                                }
                                                else {
                                                    return viewModel
                                                        .map((item) => {
                                                        return html `
                                                                                        <div class="d-flex flex-column w-100" style="gap:8px;">
                                                                                            <div style="${item[0] == '姓名' ? '' : 'margin-top:12px;'}">${item[0]}</div>
                                                                                            <input
                                                                                                style="display: flex;padding: 9px 18px;align-items: flex-start;gap: 10px;flex: 1 0 0;border-radius: 10px;border: 1px solid #DDD;"
                                                                                                value="${orderData.orderData.user_info[item[1]]}"
                                                                                                onchange="${gvc.event((e) => {
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
                                        ].join(BgWidget.mbContainer(18));
                                    },
                                    divCreate: { class: 'd-flex flex-column' },
                                };
                            })),
                            BgWidget.mainCard(html `
                                            <div class="tx_700">訂單備註</div>
                                            ${BgWidget.mbContainer(18)}
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
                                        `),
                            BgWidget.mainCard(html `
                                            <div class="tx_700">訂單記錄</div>
                                            ${BgWidget.mbContainer(18)}
                                            <div class="d-flex flex-column" style="gap: 8px">
                                                ${(() => {
                                var _a;
                                if (!((_a = orderData.orderData) === null || _a === void 0 ? void 0 : _a.editRecord)) {
                                    return '';
                                }
                                let returnHTML = '';
                                orderData.orderData.editRecord.map((record) => {
                                    returnHTML += html `
                                                            <div class="d-flex" style="gap: 42px">
                                                                <div>${formatDateString(record.time)}</div>
                                                                <div>${record.record}</div>
                                                            </div>
                                                        `;
                                });
                                return returnHTML;
                            })()}
                                                <div class="d-flex " style="gap: 42px">
                                                    <div>${formatDateString(orderData.created_time)}</div>
                                                    <div>訂單成立</div>
                                                </div>
                                            </div>
                                        `),
                        ].join(BgWidget.mbContainer(24)),
                        ratio: 75,
                    }, {
                        html: html `<div class="summary-card">
                                        ${[
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
                                                                        style="color: #4D86DB;font-weight: 400; gap:8px;cursor:pointer;"
                                                                        onclick="${gvc.event(() => {
                                    child_vm.userID = userData.userID;
                                    child_vm.type = 'user';
                                })}"
                                                                    >
                                                                        ${(_c = (_b = userData === null || userData === void 0 ? void 0 : userData.userData) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : '訪客'}
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
                                                                        ${(_f = (_e = (_d = userData === null || userData === void 0 ? void 0 : userData.userData) === null || _d === void 0 ? void 0 : _d.phone) !== null && _e !== void 0 ? _e : orderData.orderData.user_info.phone) !== null && _f !== void 0 ? _f : '此會員未填手機'}
                                                                    </div>
                                                                    <div style="color: #393939;font-weight: 400;">${(_h = (_g = userData === null || userData === void 0 ? void 0 : userData.userData) === null || _g === void 0 ? void 0 : _g.email) !== null && _h !== void 0 ? _h : orderData.orderData.user_info.email}</div>
                                                                </div>`,
                                BgWidget.horizontalLine(),
                                gvc.bindView({
                                    bind: `user_info`,
                                    view: () => {
                                        var _a;
                                        return html `
                                                                            <div style="font-size: 16px;font-weight: 700;color:#393939">收件人資料</div>
                                                                            <div class="d-flex flex-column" style="gap:8px;">
                                                                                <div style="color: #4D86DB;font-weight: 400;">${orderData.orderData.user_info.name}</div>
                                                                                <div style="color: #393939;font-weight: 400;">${orderData.orderData.user_info.phone || '電話未填'}</div>
                                                                            </div>
                                                                            <div class="tx_700 mt-2">付款方式</div>
                                                                            <div class="tx_700">配送方式</div>
                                                                            <div class="tx_normal" style="line-height: 140%;">
                                                                                ${(_a = (orderData.orderData.shipment_selector || ShoppingInvoiceManager.supportShipmentMethod()).find((dd) => {
                                            return dd.value === orderData.orderData.user_info.shipment;
                                        })) === null || _a === void 0 ? void 0 : _a.name}
                                                                            </div>
                                                                            ${(() => {
                                            switch (orderData.orderData.user_info.shipment) {
                                                case 'FAMIC2C':
                                                case 'HILIFEC2C':
                                                case 'OKMARTC2C':
                                                case 'UNIMARTC2C':
                                                    return [
                                                        html ` <div class="d-flex flex-wrap w-100">
                                                                                                <span class="me-2 fw-normal fs-6">門市名稱:</span>
                                                                                                <div class="fw-normal fs-6" style="white-space: normal;word-break: break-all;">
                                                                                                    ${decodeURI(orderData.orderData.user_info.CVSStoreName)}
                                                                                                </div>
                                                                                            </div>`,
                                                        html ` <div class="fw-normal fs-6">代號: ${orderData.orderData.user_info.CVSStoreID}</div>`,
                                                        html ` <div class="fw-normal fs-6 w-100" style="white-space: normal;word-break: break-all;">
                                                                                                地址: ${orderData.orderData.user_info.CVSAddress}
                                                                                            </div>`,
                                                    ].join('');
                                                case 'normal':
                                                    return [
                                                        html ` <div class="fw-normal fs-6" style="white-space: normal;">
                                                                                                ${orderData.orderData.user_info.address}
                                                                                            </div>`,
                                                    ].join('');
                                                default:
                                                    const formData = (orderData.orderData.shipment_selector || ShoppingInvoiceManager.supportShipmentMethod()).find((dd) => {
                                                        return dd.value === orderData.orderData.user_info.shipment;
                                                    });
                                                    if (formData.form) {
                                                        return formData.form
                                                            .map((dd) => {
                                                            return `<div class="d-flex flex-wrap w-100">
                                                                                <span class="me-2 fw-normal fs-6">${dd.title}:</span>
                                                                                <div class="fw-normal fs-6" style="white-space: normal;word-break: break-all;">
                                                                                    ${orderData.orderData.user_info.custom_form_delivery[dd.key]}
                                                                                </div>
                                                                            </div>`;
                                                        })
                                                            .join('');
                                                    }
                                                    else {
                                                        return ``;
                                                    }
                                            }
                                        })()}
                                                                        `;
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
                            BgWidget.mainCard(gvc.bindView(() => {
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
                                                                    <div class="tx_700">用戶備註</div>
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
                                                                    ${(((_a = orderData.orderData.user_info.note) !== null && _a !== void 0 ? _a : '') + (orderData.orderData.user_info.code_note || '') || '尚未填寫').replace(/\n/g, `<br>`)}
                                                                </div>
                                                            `;
                                    },
                                    divCreate: {
                                        class: ` fw-normal`,
                                    },
                                };
                            })),
                            BgWidget.mainCard(html `
                                                <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;align-self: stretch;color:#393939;">
                                                    <div class="tx_700">訂單備註</div>
                                                    <div style="color:#8D8D8D;font-size: 16px;font-weight: 400;line-height: 140%;">
                                                        ${orderData.orderData.order_note ? orderData.orderData.order_note : '尚未輸入文字'}
                                                    </div>
                                                </div>
                                            `),
                            (() => {
                                if (orderData.orderData.custom_form_format &&
                                    orderData.orderData.custom_form_format.filter((dd) => {
                                        return orderData.orderData.custom_form_data[dd.key];
                                    }).length > 0) {
                                    return (html ` <div style="margin-top: 24px;"></div>` +
                                        BgWidget.mainCard(html `
                                                            <div class="p-2" style="color: #393939;font-size: 16px;">
                                                                ${orderData.orderData.custom_form_format
                                            .filter((dd) => {
                                            return orderData.orderData.custom_form_data[dd.key];
                                        })
                                            .map((dd) => {
                                            return html ` <div class="d-flex align-items-center">
                                                                                <div class="tx_700">${dd.title}</div>
                                                                                <div class="flex-fill"></div>
                                                                            </div>
                                                                            <div style="color: #393939;font-weight: 400;">${orderData.orderData.custom_form_data[dd.key]}</div>`;
                                        })
                                            .join('')}
                                                            </div>
                                                        `));
                                }
                                else {
                                    return ``;
                                }
                            })(),
                        ].join(BgWidget.mbContainer(24))}
                                    </div>`,
                        ratio: 25,
                    })}
                            ${BgWidget.mbContainer(240)}
                            <div class="update-bar-container">
                                ${BgWidget.cancel(gvc.event(() => {
                        vm.type = 'list';
                    }))}
                                ${BgWidget.save(gvc.event(() => {
                        function writeEdit(origData, orderData) {
                            var _a;
                            let editArray = [];
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
                                gvc.notifyDataChange(mainViewID);
                            }
                            else {
                                dialog.errorMessage({ text: '更新異常!' });
                            }
                        });
                    }))}
                            </div>`);
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
            }
            get total() {
                return this.subtotal + this.shipment - this.discount;
            }
        }
        let newVoucher;
        let viewModel = {
            searchOrder: '17308733946',
            searchData: '',
            errorReport: '',
        };
        return BgWidget.container(html `
                <!-- 標頭 --- 新增訂單標題和返回 -->
                <div class="title-container">
                    ${BgWidget.goBack(gvc.event(() => {
            vm.type = 'list';
        }))}
                    ${BgWidget.title('手動開立發票')}
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
                console.log("viewModel.searchData -- ", response);
                if (response.response.orderData.lineItems.length > 0) {
                    viewModel.searchData = response.response;
                    console.log("viewModel.searchData -- ", viewModel.searchData);
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
            `);
    }
    static printStoreOrderInfo(obj) {
        const gvc = obj.gvc;
        const glitter = gvc.glitter;
        const className = Tool.randomString(7);
        const dialog = new ShareDialog(gvc.glitter);
        return BgWidget.dialog({
            gvc,
            title: '列印托運單',
            width: 800,
            height: 650,
            innerHTML: (gvc) => {
                return gvc.bindView((() => {
                    const id = glitter.getUUID();
                    return {
                        bind: id,
                        view: () => {
                            return html ` <iframe class="outer${className}" style="height: 650px;"></iframe>`;
                        },
                        onCreate: () => {
                            ApiDelivery.getOrderInfo({
                                brand: obj.store,
                                logisticsId: obj.deliverys.map((item) => item.AllPayLogisticsID).join(','),
                                paymentNo: obj.deliverys.map((item) => item.CVSPaymentNo).join(','),
                                validationNo: obj.deliverys.map((item) => item.CVSValidationNo).join(','),
                            }).then((res) => __awaiter(this, void 0, void 0, function* () {
                                const outerIframe = document.querySelector(`iframe.outer${className}`);
                                const outerIframeWindow = outerIframe.contentWindow;
                                const outerIframeDocument = outerIframeWindow === null || outerIframeWindow === void 0 ? void 0 : outerIframeWindow.document;
                                outerIframeDocument === null || outerIframeDocument === void 0 ? void 0 : outerIframeDocument.body.insertAdjacentHTML('beforeend', html ` <iframe class="inner${className}" style="width: 100%; height: 100%; border-width: 0 !important;"></iframe>`);
                                if (outerIframeDocument) {
                                    const si = setInterval(() => {
                                        const innerIframe = outerIframeDocument.querySelector(`iframe.inner${className}`);
                                        if (innerIframe) {
                                            const innerIframeWindow = innerIframe.contentWindow;
                                            const innerIframeDocument = innerIframeWindow === null || innerIframeWindow === void 0 ? void 0 : innerIframeWindow.document;
                                            if (innerIframeDocument) {
                                                const innerDiv = innerIframeDocument.createElement('div');
                                                innerDiv.innerHTML = res.response.form;
                                                const form = innerDiv.querySelector('form');
                                                if (form) {
                                                    innerIframeDocument.body.appendChild(form);
                                                    const myForm = innerIframeDocument === null || innerIframeDocument === void 0 ? void 0 : innerIframeDocument.getElementById('submit');
                                                    myForm === null || myForm === void 0 ? void 0 : myForm.click();
                                                }
                                                clearInterval(si);
                                            }
                                        }
                                    }, 200);
                                }
                            }));
                        },
                    };
                })());
            },
            save: {
                text: '列印',
                event: () => {
                    return new Promise((resolve) => {
                        const iframe = document.querySelector(`iframe.outer${className}`);
                        const iframeWindow = iframe.contentWindow;
                        iframeWindow === null || iframeWindow === void 0 ? void 0 : iframeWindow.print();
                        resolve(false);
                    });
                },
            },
        });
    }
}
window.glitter.setModule(import.meta.url, ShoppingInvoiceManager);
