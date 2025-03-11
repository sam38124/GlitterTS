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
                    出貨單號碼: (_a = orderData.user_info.shipment_number) !== null && _a !== void 0 ? _a : '',
                    出貨單日期: formatDate(orderData.user_info.shipment_date),
                    發票號碼: (_b = order.invoice_number) !== null && _b !== void 0 ? _b : '',
                    會員等級: (_e = (_d = (_c = order.user_data) === null || _c === void 0 ? void 0 : _c.member_level) === null || _d === void 0 ? void 0 : _d.tag_name) !== null && _e !== void 0 ? _e : '',
                    備註: (_f = orderData.user_info.note) !== null && _f !== void 0 ? _f : '無備註',
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
            function exportOrdersToExcel(dataArray) {
                if (!dataArray.length) {
                    dialog.errorMessage({ text: '無訂單資料可以匯出' });
                    return;
                }
                const printArray = dataArray.flatMap(order => {
                    const orderData = order.orderData;
                    return showLineItems
                        ? orderData.lineItems.map((item) => (Object.assign(Object.assign(Object.assign({}, getOrderJSON(order, orderData)), getProductJSON(item)), getUserJSON(order, orderData))))
                        : [Object.assign(Object.assign({}, getOrderJSON(order, orderData)), getUserJSON(order, orderData))];
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
            const limit = 250;
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
            return '訂單';
        })();
        BgWidget.settingDialog({
            gvc,
            title: '匯出訂單',
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
                            all: {},
                        };
                        this.export(gvc, dataMap[vm.select], vm.column);
                    }), '匯出'),
                ].join('');
            },
        });
    }
}
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
        '出貨單號碼',
        '出貨單日期',
        '發票號碼',
        '會員等級',
        '備註',
    ],
};
