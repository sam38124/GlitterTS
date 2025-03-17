var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { ShipmentConfig } from '../../glitter-base/global/shipment-config.js';
import { PaymentConfig } from '../../glitter-base/global/payment-config.js';
import { BgWidget } from '../../backend-manager/bg-widget.js';
import { Tool } from '../../modules/tool.js';
import { Excel } from './excel.js';
import { ApiReconciliation } from '../../glitter-base/route/api-reconciliation.js';
import { ApiUser } from '../../glitter-base/route/user.js';
import { GlobalUser } from '../../glitter-base/global/global-user.js';
const html = String.raw;
export class OrderExcel {
    static optionsView(gvc, callback) {
        let columnList = new Set();
        const randomString = BgWidget.getCheckedClass(gvc);
        const checkbox = (checked, name, toggle) => html `
      <div class="form-check">
        <input
          class="form-check-input cursor_pointer ${randomString}"
          type="checkbox"
          id="${name}"
          style="margin-top: 0.35rem;"
          ${checked ? 'checked' : ''}
          onclick="${gvc.event(toggle)}"
        />
        <label
          class="form-check-label cursor_pointer"
          for="${name}"
          style="padding-top: 2px; font-size: 16px; color: #393939;"
        >
          ${name}
        </label>
      </div>
    `;
        const checkboxContainer = (items) => html `
      <div class="row w-100">
        ${Object.entries(items)
            .map(([category, fields]) => {
            const bindId = Tool.randomString(5);
            return gvc.bindView({
                bind: bindId,
                view: () => {
                    const allChecked = fields.every(item => columnList.has(item));
                    return html `
                  ${checkbox(allChecked, category, () => {
                        if (allChecked) {
                            fields.forEach(item => columnList.delete(item));
                        }
                        else {
                            fields.forEach(item => columnList.add(item));
                        }
                        callback(Array.from(columnList));
                        gvc.notifyDataChange(bindId);
                    })}
                  <div class="d-flex position-relative my-2">
                    ${BgWidget.leftLineBar()}
                    <div class="ms-4 w-100 flex-fill">
                      ${fields
                        .map(item => checkbox(columnList.has(item), item, () => {
                        columnList.has(item) ? columnList.delete(item) : columnList.add(item);
                        callback(Array.from(columnList));
                        gvc.notifyDataChange(bindId);
                    }))
                        .join('')}
                    </div>
                  </div>
                `;
                },
                divCreate: { class: 'col-12 col-md-4 mb-3' },
            });
        })
            .join('')}
      </div>
    `;
        return checkboxContainer(this.headerColumn);
    }
    static export(gvc, apiJSON, column) {
        return __awaiter(this, void 0, void 0, function* () {
            const dialog = new ShareDialog(gvc.glitter);
            if (column.length === 0) {
                dialog.infoMessage({ text: '請至少勾選一個匯出欄位' });
                return;
            }
            const XLSX = yield Excel.loadXLSX(gvc);
            const [shipment_methods, payment_methods] = yield Promise.all([
                ShipmentConfig.allShipmentMethod(),
                PaymentConfig.getSupportPayment(true),
            ]);
            const showLineItems = this.headerColumn['商品'].some(a => column.includes(a));
            const formatDate = (date) => date ? gvc.glitter.ut.dateFormat(new Date(date), 'yyyy-MM-dd hh:mm') : '';
            const getStatusLabel = (status, mapping, defaultLabel = '未知') => { var _a, _b; return (_b = mapping[(_a = status === null || status === void 0 ? void 0 : status.toString()) !== null && _a !== void 0 ? _a : '']) !== null && _b !== void 0 ? _b : defaultLabel; };
            const findMethodName = (key, methods) => { var _a, _b; return (_b = (_a = methods.find(m => m.key === key)) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : '未知'; };
            const formatJSON = (obj) => Object.fromEntries(Object.entries(obj).filter(([key]) => column.includes(key)));
            const getOrderJSON = (order, orderData) => {
                var _a, _b, _c, _d, _e, _f;
                return formatJSON({
                    訂單編號: order.cart_token,
                    訂單來源: orderData.orderSource === 'POS' ? 'POS' : '手動',
                    訂單建立時間: formatDate(order.created_time),
                    會員信箱: (_a = order.email) !== null && _a !== void 0 ? _a : 'no-email',
                    訂單處理狀態: getStatusLabel(orderData.orderStatus, { '-1': '已取消', '1': '已完成', '0': '處理中' }, '處理中'),
                    付款狀態: getStatusLabel(order.status, { '1': '已付款', '-1': '付款失敗', '-2': '已退款', '0': '未付款' }, '未付款'),
                    出貨狀態: getStatusLabel(orderData.progress, {
                        pre_order: '待預購',
                        shipping: '已出貨',
                        finish: '已取貨',
                        arrived: '已送達',
                        returns: '已退貨',
                        wait: orderData.user_info.shipment_number ? '備貨中' : '未出貨',
                    }, '未出貨'),
                    訂單小計: orderData.total + orderData.discount - orderData.shipment_fee + orderData.use_rebate,
                    訂單運費: orderData.shipment_fee,
                    訂單使用優惠券: ((_b = orderData.voucherList) === null || _b === void 0 ? void 0 : _b.map((v) => v.title).join(', ')) || '無',
                    訂單折扣: orderData.discount,
                    訂單使用購物金: orderData.use_rebate,
                    訂單總計: orderData.total,
                    分銷連結代碼: (_d = (_c = orderData.distribution_info) === null || _c === void 0 ? void 0 : _c.code) !== null && _d !== void 0 ? _d : '',
                    分銷連結名稱: (_f = (_e = orderData.distribution_info) === null || _e === void 0 ? void 0 : _e.title) !== null && _f !== void 0 ? _f : '',
                });
            };
            const getProductJSON = (item) => {
                var _a;
                return formatJSON({
                    商品名稱: item.title,
                    商品規格: item.spec.length > 0 ? item.spec.join(' / ') : '單一規格',
                    商品SKU: (_a = item.sku) !== null && _a !== void 0 ? _a : '',
                    商品購買數量: item.count,
                    商品價格: item.sale_price,
                    商品折扣: item.discount_price,
                });
            };
            const getUserJSON = (order, orderData) => {
                var _a, _b, _c, _d, _e, _f;
                return formatJSON({
                    顧客姓名: orderData.customer_info.name,
                    顧客手機: orderData.customer_info.phone,
                    顧客信箱: orderData.customer_info.email,
                    收件人姓名: orderData.user_info.name,
                    收件人手機: orderData.user_info.phone,
                    收件人信箱: orderData.user_info.email,
                    付款方式: findMethodName(orderData.customer_info.payment_select, payment_methods),
                    配送方式: findMethodName(orderData.user_info.shipment, shipment_methods),
                    收貨地址: [orderData.user_info.city, orderData.user_info.area, orderData.user_info.address]
                        .filter(Boolean)
                        .join(''),
                    代收金額: orderData.customer_info.payment_select === 'cash_on_delivery' ? orderData.total : 0,
                    出貨單號碼: (_a = orderData.user_info.shipment_number) !== null && _a !== void 0 ? _a : '',
                    出貨單日期: formatDate(orderData.user_info.shipment_date),
                    發票號碼: (_b = order.invoice_number) !== null && _b !== void 0 ? _b : '',
                    會員等級: (_e = (_d = (_c = order.user_data) === null || _c === void 0 ? void 0 : _c.member_level) === null || _d === void 0 ? void 0 : _d.tag_name) !== null && _e !== void 0 ? _e : '',
                    備註: (_f = orderData.user_info.note) !== null && _f !== void 0 ? _f : '無備註',
                });
            };
            const getReconciliation = (dd, orderData) => {
                var _a;
                return formatJSON({
                    '對帳狀態': (() => {
                        var _a;
                        const received_c = ((_a = dd.total_received) !== null && _a !== void 0 ? _a : 0) + dd.offset_amount;
                        if (dd.total_received === null || dd.total_received === undefined) {
                            return '待入帳';
                        }
                        else if (dd.total_received === dd.total) {
                            return '已入帳';
                        }
                        else if (dd.total_received > dd.total && received_c === dd.total) {
                            return '已退款';
                        }
                        else if (dd.total_received < dd.total && received_c === dd.total) {
                            return '已沖帳';
                        }
                        else if (received_c < dd.total) {
                            return '待沖帳';
                        }
                        else if (received_c > dd.total) {
                            return '待退款';
                        }
                    })(),
                    '入帳金額': `$${((dd.total_received || 0) + (dd.offset_amount || 0)).toLocaleString()}`,
                    '入帳日期': dd.reconciliation_date
                        ? gvc.glitter.ut.dateFormat(new Date(dd.reconciliation_date), 'yyyy-MM-dd')
                        : '-',
                    '應沖金額': (() => {
                        if (dd.total_received === dd.total ||
                            dd.total_received === null ||
                            dd.total_received === undefined) {
                            return '-';
                        }
                        else {
                            return `$${dd.orderData.total - (dd.total_received + (dd.offset_amount || 0))}`;
                        }
                    })(),
                    '沖帳原因': (_a = dd.offset_reason) !== null && _a !== void 0 ? _a : '-'
                });
            };
            function exportOrdersToExcel(dataArray) {
                if (!dataArray.length) {
                    dialog.errorMessage({ text: '無訂單資料可以匯出' });
                    return;
                }
                const printArray = dataArray.flatMap(order => {
                    const orderData = order.orderData;
                    return showLineItems
                        ? orderData.lineItems.map((item) => (Object.assign(Object.assign(Object.assign(Object.assign({}, getOrderJSON(order, orderData)), getProductJSON(item)), getUserJSON(order, orderData)), getReconciliation(order, orderData))))
                        : [Object.assign(Object.assign(Object.assign({}, getOrderJSON(order, orderData)), getUserJSON(order, orderData)), getReconciliation(order, orderData))];
                });
                const worksheet = XLSX.utils.json_to_sheet(printArray);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, '訂單列表');
                const fileName = `訂單列表_${gvc.glitter.ut.dateFormat(new Date(), 'yyyyMMddhhmmss')}.xlsx`;
                XLSX.writeFile(workbook, fileName);
            }
            function fetchOrders(limit) {
                var _a;
                return __awaiter(this, void 0, void 0, function* () {
                    dialog.dataLoading({ visible: true });
                    try {
                        const response = yield ApiShop.getOrder(Object.assign(Object.assign({}, apiJSON), { page: 0, limit: limit }));
                        dialog.dataLoading({ visible: false });
                        if (((_a = response === null || response === void 0 ? void 0 : response.response) === null || _a === void 0 ? void 0 : _a.total) > 0) {
                            exportOrdersToExcel(response.response.data);
                        }
                        else {
                            dialog.errorMessage({ text: '匯出檔案發生錯誤' });
                        }
                    }
                    catch (error) {
                        dialog.dataLoading({ visible: false });
                        dialog.errorMessage({ text: '無法取得訂單資料' });
                    }
                });
            }
            const limit = 1000;
            dialog.checkYesOrNot({
                text: `系統將會依條件匯出資料，最多匯出${limit}筆<br/>確定要匯出嗎？`,
                callback: bool => bool && fetchOrders(limit),
            });
        });
    }
    static exportDialog(gvc, apiJSON, dataArray) {
        const vm = {
            select: 'all',
            column: [],
        };
        const pageType = (() => {
            const isArchived = apiJSON.archived === 'true';
            const isShipment = apiJSON.is_shipment;
            const isPOS = apiJSON.is_pos;
            const isReconciliation = apiJSON.is_reconciliation;
            if (isShipment && isArchived)
                return '已封存出貨單';
            if (isShipment)
                return '出貨單';
            if (isArchived && isPOS)
                return '已封存POS訂單';
            if (isArchived)
                return '已封存訂單';
            if (isPOS)
                return 'POS訂單';
            if (isReconciliation)
                return '對帳單';
            return '訂單';
        })();
        BgWidget.settingDialog({
            gvc,
            title: '匯出' + pageType,
            width: 700,
            innerHTML: gvc2 => {
                return html `<div class="d-flex flex-column align-items-start gap-2">
          <div class="tx_700 mb-2">匯出範圍</div>
          ${BgWidget.multiCheckboxContainer(gvc2, [
                    { key: 'all', name: `全部${pageType}` },
                    { key: 'search', name: '目前搜尋與篩選的結果' },
                    { key: 'checked', name: `勾選的 ${dataArray.length} 個訂單` },
                ], [vm.select], (res) => {
                    vm.select = res[0];
                }, { single: true })}
          <div class="tx_700 mb-2">
            匯出欄位 ${BgWidget.grayNote('＊若勾選商品系列的欄位，將會以訂單商品作為資料列匯出 Excel', 'margin: 4px;')}
          </div>
          ${this.optionsView(gvc2, cols => {
                    vm.column = cols;
                })}
        </div>`;
            },
            footer_html: gvc2 => {
                return [
                    BgWidget.cancel(gvc2.event(() => {
                        gvc2.glitter.closeDiaLog();
                    })),
                    BgWidget.save(gvc2.event(() => {
                        const dialog = new ShareDialog(gvc.glitter);
                        if (vm.select === 'checked' && dataArray.length === 0) {
                            dialog.infoMessage({ text: '請勾選至少一個以上的訂單' });
                            return;
                        }
                        const dataMap = {
                            search: apiJSON,
                            checked: Object.assign(Object.assign({}, apiJSON), { id_list: dataArray.map(data => data.id).join(',') }),
                            all: {
                                is_reconciliation: apiJSON.is_reconciliation,
                                is_shipment: apiJSON.is_shipment,
                                archived: apiJSON.archived,
                                is_pos: apiJSON.is_pos
                            },
                        };
                        this.export(gvc, dataMap[vm.select], vm.column);
                    }), '匯出'),
                ].join('');
            },
        });
    }
    static importWithShipment(gvc, target, callback) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const dialog = new ShareDialog(gvc.glitter);
            function errorMsg(text) {
                dialog.dataLoading({ visible: false });
                dialog.errorMessage({ text: text });
            }
            if ((_a = target.files) === null || _a === void 0 ? void 0 : _a.length) {
                try {
                    dialog.dataLoading({ visible: true, text: '上傳檔案中' });
                    const jsonData = yield Excel.parseExcelToJson(gvc, target.files[0]);
                    const importMap = new Map();
                    for (let i = 0; i < jsonData.length; i++) {
                        const order = jsonData[i];
                        if ((order['出貨單號碼'] && !order['訂單編號']) || (!order['出貨單號碼'] && order['訂單編號'])) {
                            errorMsg('每個訂單編號必須與出貨單號碼成對');
                            return;
                        }
                        importMap.set(`${order['訂單編號']}`, `${order['出貨單號碼']}`);
                    }
                    const cartTokens = [...importMap.keys()];
                    const getOrders = yield ApiShop.getOrder({
                        page: 0,
                        limit: 1000,
                        searchType: 'cart_token',
                        id_list: cartTokens.join(','),
                    });
                    if (!getOrders.result) {
                        errorMsg('訂單資料取得失敗');
                        return;
                    }
                    const orders = getOrders.response.data;
                    const orderMap = new Map(orders.map((order) => [order.cart_token, true]));
                    const importKey = cartTokens.find(key => !orderMap.has(key));
                    if (importKey) {
                        errorMsg(`訂單編號 #${importKey} 不存在`);
                        return;
                    }
                    for (const order of orders) {
                        try {
                            if (order.orderData.user_info.shipment_number) {
                                errorMsg(`出貨單號碼不可覆寫<br/>（訂單編號: ${order.cart_token}）`);
                                return;
                            }
                            if (order.orderData.progress && order.orderData.progress !== 'wait') {
                                errorMsg(`訂單出貨狀態必須為「未出貨」<br/>（訂單編號: ${order.cart_token}）`);
                                return;
                            }
                            order.orderData.user_info.shipment_number = importMap.get(order.cart_token);
                        }
                        catch (error) {
                            errorMsg('訂單資料有誤');
                        }
                    }
                    const saveEvent = (order, setShipping) => {
                        var _a;
                        const orderData = order.orderData;
                        const temps = [
                            {
                                time: Tool.formatDateTime(),
                                record: `建立出貨單號碼 #${orderData.user_info.shipment_number}`,
                            },
                        ];
                        if (setShipping) {
                            orderData.progress = 'shipping';
                            temps.push({
                                time: Tool.formatDateTime(),
                                record: '訂單已出貨',
                            });
                        }
                        orderData.editRecord = [...((_a = orderData.editRecord) !== null && _a !== void 0 ? _a : []), ...temps];
                        return ApiShop.putOrder({ id: `${order.id}`, order_data: orderData });
                    };
                    dialog.dataLoading({ visible: false });
                    dialog.checkYesOrNot({
                        text: '匯入的出貨單資料，是否要將出貨狀態改成「已出貨」？',
                        yesString: '是',
                        notString: '否',
                        callback: (bool) => __awaiter(this, void 0, void 0, function* () {
                            try {
                                dialog.dataLoading({ visible: true });
                                const responses = yield Promise.all(orders.map((order) => {
                                    return saveEvent(order, bool);
                                }));
                                const failedResponse = responses.find(res => !res.result);
                                dialog.dataLoading({ visible: false });
                                if (failedResponse) {
                                    console.error('匯入失敗:', failedResponse);
                                    dialog.errorMessage({ text: '匯入失敗' });
                                }
                                else {
                                    dialog.successMessage({ text: '匯入成功' });
                                    setTimeout(() => callback(), 300);
                                }
                            }
                            catch (error) {
                                dialog.dataLoading({ visible: false });
                                console.error('批次出貨更新錯誤:', error);
                                dialog.errorMessage({ text: '系統錯誤，請稍後再試' });
                            }
                        }),
                    });
                }
                catch (error) {
                    console.error('Order Excel 解析失敗', error);
                }
            }
        });
    }
    static importWithReconciliation(gvc, target, callback) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const dialog = new ShareDialog(gvc.glitter);
            function errorMsg(text) {
                dialog.dataLoading({ visible: false });
                dialog.errorMessage({ text: text });
            }
            if ((_a = target.files) === null || _a === void 0 ? void 0 : _a.length) {
                try {
                    dialog.dataLoading({ visible: true, text: '上傳檔案中' });
                    const jsonData = yield Excel.parseExcelToJson(gvc, target.files[0]);
                    const importMap = new Map();
                    for (let i = 0; i < jsonData.length; i++) {
                        const order = jsonData[i];
                        if ((!order['訂單編號']) || (!order['操作選項']) || (!order['入帳/沖帳日期']) || (!order['入帳/沖帳金額'])) {
                            (!order['訂單編號']) && errorMsg('請輸入訂單編號');
                            (!order['操作選項']) && errorMsg('請輸入操作選項');
                            (!order['入帳/沖帳日期']) && errorMsg('請輸入入帳/沖帳日期');
                            (!order['入帳/沖帳金額']) && errorMsg('請輸入入帳/沖帳金額');
                            return;
                        }
                        importMap.set(`${order['訂單編號']}`, order);
                    }
                    const cartTokens = [...importMap.keys()];
                    const getOrders = yield ApiShop.getOrder({
                        page: 0,
                        limit: 1000,
                        searchType: 'cart_token',
                        id_list: cartTokens.join(','),
                    });
                    if (!getOrders.result) {
                        errorMsg('訂單資料取得失敗');
                        return;
                    }
                    const orders = getOrders.response.data;
                    const orderMap = new Map(orders.map((order) => [order.cart_token, true]));
                    const importKey = cartTokens.find(key => !orderMap.has(key));
                    if (importKey) {
                        errorMsg(`訂單編號 #${importKey} 不存在`);
                        return;
                    }
                    for (const order of orders) {
                        try {
                            const compare = importMap.get(order.cart_token);
                            if ((compare['操作選項'] === '入帳') && (order.reconciliation_date)) {
                                errorMsg(`已入帳訂單不可再次入帳<br/>（訂單編號: ${order.cart_token}）`);
                                return;
                            }
                        }
                        catch (error) {
                            errorMsg('訂單資料有誤');
                        }
                    }
                    const auth = yield ApiUser.getPermission({
                        page: 0,
                        limit: 100,
                    }).then(res => {
                        return res.response.data.find((dd) => {
                            return `${dd.user}` === `${GlobalUser.parseJWT(GlobalUser.saas_token).payload.userID}`;
                        });
                    });
                    const saveEvent = (order) => {
                        var _a;
                        const compare = importMap.get(order.cart_token);
                        const money = parseInt(compare['入帳/沖帳金額'], 10);
                        if (compare['操作選項'] === '入帳') {
                            return ApiReconciliation.putReconciliation({
                                order_id: order.cart_token,
                                update: {
                                    reconciliation_date: new Date(compare['入帳/沖帳日期']).toISOString(),
                                    total_received: money,
                                },
                            });
                        }
                        else {
                            order.offset_records = (_a = order.offset_records) !== null && _a !== void 0 ? _a : [];
                            return ApiReconciliation.putReconciliation({
                                order_id: order.cart_token,
                                update: {
                                    offset_amount: order.offset_amount + money,
                                    offset_reason: compare['沖帳原因'],
                                    offset_records: JSON.stringify(JSON.parse(JSON.stringify(order.offset_records)).concat([
                                        {
                                            offset_amount: money,
                                            offset_reason: compare['沖帳原因'],
                                            offset_date: new Date(compare['入帳/沖帳日期']).toISOString(),
                                            offset_note: compare['沖帳備註'],
                                            user: auth.config
                                        },
                                    ])),
                                },
                            });
                        }
                    };
                    try {
                        dialog.dataLoading({ visible: true });
                        const responses = yield Promise.all(orders.map((order) => {
                            return saveEvent(order);
                        }));
                        const failedResponse = responses.find(res => !res.result);
                        dialog.dataLoading({ visible: false });
                        if (failedResponse) {
                            console.error('匯入失敗:', failedResponse);
                            dialog.errorMessage({ text: '匯入失敗' });
                        }
                        else {
                            dialog.successMessage({ text: '匯入成功' });
                            setTimeout(() => callback(), 300);
                        }
                    }
                    catch (error) {
                        dialog.dataLoading({ visible: false });
                        console.error('批次更新錯誤:', error);
                        dialog.errorMessage({ text: '系統錯誤，請稍後再試' });
                    }
                }
                catch (error) {
                    console.error('Order Excel 解析失敗', error);
                }
            }
        });
    }
    static importDialog(gvc, query, callback) {
        const dialog = new ShareDialog(gvc.glitter);
        const vm = {
            id: 'importDialog',
            fileInput: {},
            type: '',
            orderTitle: (() => {
                if (query.isShipment)
                    return '出貨單';
                if (query.isArchived)
                    return '已封存訂單';
                if (query.is_reconciliation)
                    return '對帳單';
                return '訂單';
            })(),
        };
        gvc.glitter.innerDialog((gvc) => {
            return gvc.bindView({
                bind: vm.id,
                view: () => {
                    const viewData = {
                        title: `匯入${vm.orderTitle}`,
                        category: {
                            title: `匯入${vm.orderTitle}類型`,
                            options: [],
                        },
                        example: {
                            event: () => {
                                Excel.downloadExcel(gvc, (() => {
                                    if (query.isShipment)
                                        return OrderExcel.importShipmentExample;
                                    if (query.is_reconciliation)
                                        return OrderExcel.importReconciliation;
                                    if (query.isArchived)
                                        return [];
                                    return [];
                                })(), `範例_${vm.orderTitle}列表_${gvc.glitter.ut.dateFormat(new Date(), 'yyyyMMddhhmmss')}.xlsx`, `範例${vm.orderTitle}列表`);
                            },
                        },
                        import: {
                            event: () => {
                                if (query.isShipment) {
                                    return this.importWithShipment(gvc, vm.fileInput, () => {
                                        gvc.glitter.closeDiaLog();
                                        callback();
                                    });
                                }
                                if (query.is_reconciliation) {
                                    return this.importWithReconciliation(gvc, vm.fileInput, () => {
                                        gvc.glitter.closeDiaLog();
                                        callback();
                                    });
                                }
                                if (query.isArchived) {
                                }
                            },
                        },
                    };
                    return html `
            <div
              class="d-flex align-items-center w-100 tx_700"
              style="padding: 12px 0 12px 20px; align-items: center; border-radius: 10px 10px 0px 0px; background: #F2F2F2;"
            >
              ${viewData.title}
            </div>
            ${viewData.category.options.length > 0
                        ? html `<div class="d-flex flex-column align-items-start gap-2" style="padding: 20px 20px 0px;">
                  <div class="tx_700">${viewData.category.title}</div>
                  ${BgWidget.multiCheckboxContainer(gvc, viewData.category.options, [vm.type], res => {
                            vm.type = res[0];
                        }, { single: true })}
                </div>`
                        : ''}
            <div class="d-flex flex-column w-100 align-items-start gap-3" style="padding: 20px">
              <div class="d-flex align-items-center gap-2">
                <div class="tx_700">透過XLSX檔案匯入${query.isShipment ? `出貨單` : ``}</div>
                ${BgWidget.blueNote('下載範例', gvc.event(viewData.example.event))}
              </div>
              <input
                class="d-none"
                type="file"
                id="upload-excel"
                onchange="${gvc.event((_, event) => {
                        vm.fileInput = event.target;
                        gvc.notifyDataChange(vm.id);
                    })}"
              />
              <div
                class="d-flex flex-column w-100 justify-content-center align-items-center gap-3"
                style="border: 1px solid #DDD; border-radius: 10px; min-height: 180px;"
              >
                ${(() => {
                        if (vm.fileInput.files && vm.fileInput.files.length > 0) {
                            return html `
                      ${BgWidget.customButton({
                                button: { color: 'snow', size: 'md' },
                                text: { name: '更換檔案' },
                                event: gvc.event(() => {
                                    document.querySelector('#upload-excel').click();
                                }),
                            })}
                      ${BgWidget.grayNote(vm.fileInput.files[0].name)}
                    `;
                        }
                        else {
                            return BgWidget.customButton({
                                button: { color: 'snow', size: 'md' },
                                text: { name: '新增檔案' },
                                event: gvc.event(() => {
                                    document.querySelector('#upload-excel').click();
                                }),
                            });
                        }
                    })()}
              </div>
            </div>
            <div class="d-flex justify-content-end gap-3" style="padding-right: 20px; padding-bottom: 20px;">
              ${BgWidget.cancel(gvc.event(() => {
                        gvc.glitter.closeDiaLog();
                    }))}
              ${BgWidget.save(gvc.event(() => {
                        if (vm.fileInput.files && vm.fileInput.files.length > 0) {
                            viewData.import.event();
                        }
                        else {
                            dialog.infoMessage({ text: '尚未上傳檔案' });
                        }
                    }), '匯入')}
            </div>
          `;
                },
                divCreate: {
                    style: 'border-radius: 10px; background: #FFF; width: 570px; min-height: 360px; max-width: 90%;',
                },
            });
        }, vm.id);
    }
}
OrderExcel.importShipmentExample = [
    {
        訂單編號: '1241770010001',
        出貨單號碼: '1249900602345',
    },
];
OrderExcel.importReconciliation = [
    {
        "訂單編號": '1241770010001',
        "操作選項": '入帳',
        '入帳/沖帳日期': '2025-01-01',
        '入帳/沖帳金額': '2000',
        "沖帳原因": '',
        "沖帳備註": ''
    },
    {
        "訂單編號": '1241770010002',
        "操作選項": '沖帳',
        '入帳/沖帳日期': '2025-01-02',
        '入帳/沖帳金額': '-1000',
        "沖帳原因": '支付金額異常',
        "沖帳備註": '於玉山銀行進行查帳只有收到'
    },
];
OrderExcel.headerColumn = {
    訂單: [
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
        '分銷連結代碼',
        '分銷連結名稱',
    ],
    商品: ['商品名稱', '商品規格', '商品SKU', '商品購買數量', '商品價格', '商品折扣'],
    顧客: [
        '顧客姓名',
        '顧客手機',
        '顧客信箱',
        '收件人姓名',
        '收件人手機',
        '收件人信箱',
        '付款方式',
        '配送方式',
        '收貨地址',
        '代收金額',
        '出貨單號碼',
        '出貨單日期',
        '發票號碼',
        '會員等級',
        '備註',
    ],
    對帳資訊: [
        '對帳狀態',
        '入帳金額',
        '入帳日期',
        '應沖金額',
        '沖帳原因'
    ]
};
