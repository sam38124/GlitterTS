import { BgWidget } from '../../backend-manager/bg-widget.js';
import { ApiUser } from '../../glitter-base/route/user.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { Tool } from '../../modules/tool.js';
import { OrderDetail } from './data.js';
import { EditorElem } from '../../glitterBundle/plugins/editor-elem.js';
import { ShipmentConfig } from '../../glitter-base/global/shipment-config.js';
import { PaymentConfig } from '../../glitter-base/global/payment-config.js';
const html = String.raw;
export class OrderSetting {
    static getPaymentMethodText(orderData, paymentMethod) {
        const paymentMethods = {
            POS: '門市POS付款',
            off_line: '線下付款',
        };
        paymentMethod.map((item) => {
            paymentMethods[item.key] = item.name;
        });
        return orderData.orderSource === 'POS'
            ? paymentMethods['POS']
            : paymentMethods[orderData.customer_info.payment_select] || '線下付款';
    }
    static getShippingMethodText(orderData) {
        if (!orderData.user_info.shipment) {
            return '立即取貨';
        }
        const shippingData = ShipmentConfig.list.find(item => item.value === orderData.user_info.shipment);
        return shippingData ? shippingData.title : '立即取貨';
    }
    static getShippingAddress(orderData) {
        const shipment = orderData.user_info.shipment;
        if (['UNIMARTC2C', 'UNIMARTFREEZE', 'FAMIC2C', 'FAMIC2CFREEZE', 'OKMARTC2C', 'HILIFEC2C'].includes(shipment)) {
            return `${orderData.user_info.CVSStoreName} (${orderData.user_info.CVSAddress})`;
        }
        if (shipment === 'shop') {
            return '實體門市';
        }
        if (shipment === 'now') {
            return '立即取貨';
        }
        return orderData.user_info.address;
    }
    static getPaymentStatusOpt() {
        return [
            { title: '已付款', value: '1' },
            { title: '部分付款', value: '3' },
            { title: '待核款 / 貨到付款 / 未付款', value: '0' },
            { title: '已退款', value: '-2' },
            { title: '付款失敗', value: '-1' },
        ].map(item => {
            return {
                key: item.value,
                value: item.title,
            };
        });
    }
    static getShippmentOpt() {
        return [
            { title: '未出貨', value: 'wait' },
            { title: '待預購', value: 'pre_order' },
            { title: '備貨中', value: 'in_stock' },
            { title: '已出貨', value: 'shipping' },
            { title: '已到貨', value: 'arrived' },
            { title: '已取貨', value: 'finish' },
            { title: '已退貨', value: 'returns' },
        ].map(item => {
            return {
                key: item.value,
                value: item.title,
            };
        });
    }
    static getOrderStatusOpt() {
        return ApiShop.getOrderStatusArray().map(item => {
            return {
                key: item.value,
                value: item.title,
            };
        });
    }
    static getAllStatusBadge(order, size = 'md') {
        const paymentBadges = {
            '0': (() => {
                if (order.orderData.proof_purchase) {
                    return BgWidget.warningInsignia('待核款', { size });
                }
                if (order.orderData.customer_info.payment_select == 'cash_on_delivery') {
                    return BgWidget.warningInsignia('貨到付款', { size });
                }
                return BgWidget.notifyInsignia('未付款', { size });
            })(),
            '1': BgWidget.infoInsignia('已付款', { size }),
            '3': BgWidget.warningInsignia('部分付款', { size }),
            '-1': BgWidget.notifyInsignia('付款失敗', { size }),
            '-2': BgWidget.notifyInsignia('已退款', { size }),
        };
        const outShipBadges = {
            finish: BgWidget.infoInsignia('已取貨', { size }),
            shipping: BgWidget.warningInsignia('已出貨', { size }),
            arrived: BgWidget.warningInsignia('已送達', { size }),
            wait: order.orderData.user_info.shipment_number
                ? BgWidget.secondaryInsignia('備貨中', { size })
                : BgWidget.notifyInsignia('未出貨', { size }),
            pre_order: BgWidget.notifyInsignia('待預購', { size }),
            returns: BgWidget.notifyInsignia('已退貨', { size }),
        };
        const orderStatusBadges = {
            '1': BgWidget.infoInsignia('已完成', { size }),
            '0': BgWidget.warningInsignia('處理中', { size }),
            '-1': BgWidget.notifyInsignia('已取消', { size }),
        };
        const orderSourceBadges = {
            manual: BgWidget.primaryInsignia('手動', { type: 'border', size }),
            combine: BgWidget.successInsignia('合併', { type: 'border', size }),
            POS: BgWidget.primaryInsignia('POS', { type: 'border', size }),
            split: BgWidget.successInsignia('拆分', { type: 'border', size }),
            default: '',
        };
        return {
            sourceBadge: () => { var _a; return orderSourceBadges[(_a = order.orderData.orderSource) !== null && _a !== void 0 ? _a : 'default'] || orderSourceBadges['default']; },
            paymentBadge: () => paymentBadges[`${order.status}`] || paymentBadges['0'],
            outShipBadge: () => { var _a; return outShipBadges[(_a = order.orderData.progress) !== null && _a !== void 0 ? _a : 'wait'] || outShipBadges['wait']; },
            orderStatusBadge: () => { var _a; return orderStatusBadges[`${(_a = order.orderData.orderStatus) !== null && _a !== void 0 ? _a : 0}`] || orderStatusBadges['0']; },
            archivedBadge: () => (order.orderData.archived === 'true' ? BgWidget.secondaryInsignia('已封存') : ''),
        };
    }
    static showEditShip(obj) {
        let stockList = [];
        let loading = true;
        let productLoading = false;
        let postMD = obj.postMD;
        let productData = obj.productData;
        let topGVC = window.parent.glitter.pageConfig[window.parent.glitter.pageConfig.length - 1].gvc;
        topGVC.glitter.innerDialog((gvc) => {
            function getStockStore() {
                if (stockList.length == 0) {
                    ApiUser.getPublicConfig('store_manager', 'manager').then((storeData) => {
                        if (storeData.result) {
                            stockList = storeData.response.value.list;
                            loading = false;
                            if (!loading && !productLoading) {
                                gvc.notifyDataChange('editDialog');
                            }
                        }
                    });
                }
            }
            let dialog = new ShareDialog(topGVC.glitter);
            let origData = structuredClone(postMD);
            getStockStore();
            return gvc.bindView({
                bind: 'editDialog',
                view: () => {
                    const titleLength = 250;
                    const elementLength = 100;
                    if (loading && productLoading) {
                        dialog.dataLoading({ visible: true });
                        return '';
                    }
                    else {
                        dialog.dataLoading({ visible: false });
                    }
                    if (!productLoading) {
                        postMD.map((dd) => {
                            const product = productData.find((product) => product.id == dd.id);
                            if (product) {
                                const variant = product.content.variants.find((variant) => {
                                    return JSON.stringify(variant.spec) == JSON.stringify(dd.spec);
                                });
                                dd.stockList = variant.stockList;
                            }
                        });
                    }
                    gvc.addStyle(`
            .scrollbar-appear::-webkit-scrollbar {
              width: 10px;
              height: 10px;
            }
            .scrollbar-appear::-webkit-scrollbar-thumb {
              background: #666;
              border-radius: 20px;
            }
            .scrollbar-appear::-webkit-scrollbar-track {
              border-radius: 20px;
              background: #d8d8d8;
            }
            .scrollbar-appear {
            }
          `);
                    return html `
            <div
              class="d-flex flex-column position-relative"
              style="width: 80%;height:70%;background:white;border-radius: 10px;"
            >
              <div
                class="d-flex align-items-center"
                style="height: 60px;width: 100%;border-bottom: solid 1px #DDD;font-size: 16px;font-style: normal;font-weight: 700;color: #393939;background: #F2F2F2;border-radius: 10px 10px 0px 0px;"
              >
                <div class="flex-fill" style="padding: 19px 32px;">分倉出貨</div>
              </div>
              <div class="overflow-scroll scrollbar-appear flex-fill" style="padding:20px;">
                <div class="d-flex " style="margin-bottom:16px;gap:44px;position: relative;">
                  <div
                    class="d-flex flex-shrink-0 align-items-center "
                    style="width:${titleLength}px;font-size: 16px;font-style: normal;font-weight: 700;"
                  >
                    商品
                  </div>
                  ${(() => {
                        let titleArray = [
                            {
                                title: '下單數量',
                                width: `${elementLength}px`,
                            },
                            {
                                title: '庫存',
                                width: `${elementLength}px`,
                            },
                        ];
                        function insertSubStocks(titleArray, subStocks) {
                            const targetIndex = titleArray.findIndex(item => item.title === '庫存');
                            if (targetIndex !== -1) {
                                const formattedSubStocks = subStocks.map(stockTitle => ({
                                    title: stockTitle,
                                    width: titleArray[targetIndex].width,
                                }));
                                titleArray.splice(targetIndex, 1, ...formattedSubStocks);
                            }
                            return titleArray;
                        }
                        titleArray = insertSubStocks(titleArray, stockList.flatMap((item) => {
                            return [
                                html ` <div class="d-flex flex-column" style="text-align: center;gap:5px;">
                            ${item.name}${BgWidget.warningInsignia('庫存數量')}
                          </div>`,
                                html ` <div class="d-flex flex-column" style="text-align: center;gap:5px;">
                            ${item.name}<br />${BgWidget.infoInsignia('出貨數量')}
                          </div>`,
                            ];
                        }));
                        return titleArray
                            .map(title => {
                            return html `
                          <div
                            class="d-flex flex-shrink-0 align-items-center ${title.title == '下單數量'
                                ? 'justify-content-end'
                                : ''} ${title.title != '商品' && title.title != '下單數量'
                                ? 'justify-content-center'
                                : ''}"
                            style="width:${title.width};font-size: 16px;font-style: normal;font-weight: 700;;${title.title ==
                                '商品'
                                ? 'position:absolute;left: 0;top: 0;'
                                : ''}"
                          >
                            ${title.title}
                          </div>
                        `;
                        })
                            .join('');
                    })()}
                </div>
                ${(() => {
                        const id = topGVC.glitter.getUUID();
                        return gvc.bindView({
                            bind: id,
                            view: () => {
                                try {
                                    return postMD
                                        .map((item) => {
                                        if (!item.deduction_log || Object.keys(item.deduction_log).length === 0) {
                                            return '';
                                        }
                                        return html `
                              <div class="d-inline-flex align-items-center" style="gap:44px;">
                                <div
                                  class="d-flex align-items-center flex-shrink-0"
                                  style="width: ${titleLength}px;gap: 12px"
                                >
                                  <img
                                    style="height: 54px;width: 54px;border-radius: 5px;"
                                    src="${item.preview_image}"
                                  />
                                  <div class="d-flex flex-column" style="font-size: 16px;">
                                    <div
                                      style="max-width: calc(${titleLength} - 100px);white-space: normal;word-break: break-all;"
                                    >
                                      ${item.title}
                                    </div>
                                    <div style="color: #8D8D8D;font-size: 14px;">
                                      ${item.spec.length == 0 ? `單一規格` : item.spec.join(`,`)}
                                    </div>
                                    <div style="color: #8D8D8D;font-size: 14px;">存貨單位 (SKU): ${item.sku}</div>
                                  </div>
                                </div>
                                <div
                                  class="d-flex align-items-center justify-content-end flex-shrink-0"
                                  style="width: ${elementLength}px;gap: 12px"
                                >
                                  ${item.count}
                                </div>
                                ${stockList
                                            .flatMap((stock) => {
                                            var _a, _b, _c, _d, _e;
                                            if (!item.deduction_log) {
                                                return '';
                                            }
                                            const limit = (_c = (_b = (_a = item.stockList) === null || _a === void 0 ? void 0 : _a[stock.id]) === null || _b === void 0 ? void 0 : _b.count) !== null && _c !== void 0 ? _c : 0;
                                            return [
                                                html ` <div
                                        class="d-flex align-items-center justify-content-end flex-shrink-0"
                                        style="width: ${elementLength}px;gap: 12px;"
                                      >
                                        ${parseInt(limit)}
                                      </div>`,
                                                html ` <div
                                        class="d-flex align-items-center justify-content-end flex-shrink-0"
                                        style="width: ${elementLength}px;gap: 12px"
                                      >
                                        <input
                                          class="w-100"
                                          style="border-radius: 10px;border: 1px solid #DDD;background: #FFF;text-align: center;padding:0 18px;height:40px;"
                                          max="${limit + ((_d = item.deduction_log[stock.id]) !== null && _d !== void 0 ? _d : 0)}"
                                          min="0"
                                          value="${(_e = item.deduction_log[stock.id]) !== null && _e !== void 0 ? _e : 0}"
                                          type="number"
                                          onchange="${gvc.event((e) => {
                                                    var _a;
                                                    const originalDeduction = (_a = item.deduction_log[stock.id]) !== null && _a !== void 0 ? _a : 0;
                                                    item.deduction_log[stock.id] = 0;
                                                    const totalDeducted = Object.values(item.deduction_log).reduce((total, deduction) => total + deduction, 0);
                                                    const remainingStock = item.count - totalDeducted;
                                                    const newDeduction = Math.min(parseInt(e.value), remainingStock);
                                                    item.deduction_log[stock.id] = newDeduction;
                                                    if (originalDeduction !== newDeduction) {
                                                        const stockDiff = newDeduction - originalDeduction;
                                                        item.stockList[stock.id].count -= stockDiff;
                                                    }
                                                    gvc.notifyDataChange(id);
                                                })}"
                                        />
                                      </div>`,
                                            ];
                                        })
                                            .join('')}
                              </div>
                            `;
                                    })
                                        .filter((item) => {
                                        return item;
                                    })
                                        .map((dd, index) => {
                                        return `<div class="${index ? `border-top pt-2` : ` pb-2`}">${dd}</div>`;
                                    })
                                        .join('');
                                }
                                catch (e) {
                                    console.error(e);
                                }
                            },
                            divCreate: { class: 'd-inline-flex flex-column ', style: 'margin-bottom:80px;gap:12px;' },
                        });
                    })()}
              </div>
              <div
                class="w-100 justify-content-end d-flex bg-white"
                style="gap:14px;padding-right:24px;padding-bottom:20px;padding-top: 10px;border-radius: 0px 0px 10px 10px;"
              >
                ${BgWidget.cancel(gvc.event(() => {
                        postMD = origData;
                        topGVC.glitter.closeDiaLog();
                    }))}
                ${BgWidget.save(gvc.event(() => {
                        var _a;
                        const errorProducts = [];
                        const hasError = postMD.some((product) => {
                            if (!product.deduction_log) {
                                return false;
                            }
                            const totalDeduction = Object.values(product.deduction_log).reduce((sum, value) => sum + value, 0);
                            if (Object.keys(product.deduction_log).length && totalDeduction !== product.count) {
                                errorProducts.push(`${product.title} - ${product.spec.join(',')}`);
                                return true;
                            }
                            return false;
                        });
                        if (hasError) {
                            dialog.errorMessage({
                                text: html ` <div class="d-flex flex-column">出貨數量異常</div>`,
                            });
                        }
                        else {
                            topGVC.glitter.closeDiaLog();
                            (_a = obj.callback) === null || _a === void 0 ? void 0 : _a.call(obj);
                        }
                    }))}
              </div>
            </div>
          `;
                },
                divCreate: {
                    class: 'd-flex align-items-center justify-content-center',
                    style: 'width: 100vw; height: 100vh;',
                },
            });
        }, 'batchEdit');
    }
    static combineOrders(topGVC, dataArray, callback) {
        var _a, _b;
        const parentPageConfig = (_b = (_a = window.parent) === null || _a === void 0 ? void 0 : _a.glitter) === null || _b === void 0 ? void 0 : _b.pageConfig;
        const latestPageConfig = parentPageConfig === null || parentPageConfig === void 0 ? void 0 : parentPageConfig[parentPageConfig.length - 1];
        const ogvc = (latestPageConfig === null || latestPageConfig === void 0 ? void 0 : latestPageConfig.gvc) || topGVC;
        const glitter = ogvc.glitter;
        const dialog = new ShareDialog(glitter);
        const isDesktop = document.body.clientWidth > 768;
        const vm = {
            dataObject: {},
            originDataObject: {},
            prefix: 'combine-orders',
        };
        const ids = {
            show: '',
            page: glitter.getUUID(),
            header: glitter.getUUID(),
            dashboard: glitter.getUUID(),
            orderlist: glitter.getUUID(),
        };
        const gClass = (name) => `${vm.prefix}-${name}`;
        const applyClass = () => {
            ogvc.addStyle(`
        .scrollbar-appear::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .scrollbar-appear::-webkit-scrollbar-thumb {
          background: #666;
          border-radius: 20px;
        }
        .scrollbar-appear::-webkit-scrollbar-track {
          border-radius: 20px;
          background: #d8d8d8;
        }
        .${vm.prefix}-full-screen {
          width: 100vw;
          height: 100vh;
          position: absolute;
          left: 0;
          top: 0;
          background-color: white;
          z-index: 1;
        }
        .${vm.prefix}-header {
          height: 60px;
          border-bottom: 1px solid #ddd;
          font-size: 16px;
          font-weight: 700;
          color: #393939;
          background-color: white;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .${vm.prefix}-back-btn {
          padding: 19px 32px;
          gap: 8px;
          cursor: pointer;
          border-right: 1px solid #ddd;
          display: flex;
          align-items: center;
        }
        .${vm.prefix}-title {
          padding: 19px 32px;
        }
        .${vm.prefix}-footer {
          display: flex;
          justify-content: flex-end;
          padding: 14px 16px;
          gap: 14px;
          background-color: white;
          position: sticky;
          bottom: 0;
          z-index: 10;
        }
        .${vm.prefix}-dashboard-gray {
          color: #8d8d8d;
          font-size: 16px;
          font-weight: 400;
        }
        .${vm.prefix}-update {
          width: 80px;
          color: #4d86db;
          font-weight: 400;
          gap: 8px;
          cursor: pointer;
        }
        .${vm.prefix}-list {
          list-style: disc;
          white-space: break-spaces;
        }
        .${vm.prefix}-box {
          border-radius: 10px;
          padding: 6px 10px;
        }
        .${vm.prefix}-check-info-box {
          position: absolute;
          width: 1000px;
          overflow: auto;
        }
        .${vm.prefix}-order-row {
          display: flex;
          align-items: center;
          min-height: 80px;
        }
      `);
        };
        const closeDialog = () => glitter.closeDiaLog();
        const allOrderLength = () => Object.values(vm.dataObject).reduce((total, data) => total + data.orders.length, 0);
        const statusDataLength = (dataMap, status) => {
            return Object.values(dataMap).filter(item => item.status === status).length;
        };
        const renderHeader = (gvc) => gvc.bindView({
            bind: ids.header,
            view: () => html ` <div class="${gClass('back-btn')}" onclick="${gvc.event(closeDialog)}">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M13.79 4.96L8.03 10.72C7.69 11.06 7.5 11.52 7.5 12s.19.94.53 1.28l5.76 5.76c.3.3.7.46 1.12.46.88 0 1.59-.71 1.59-1.59V15h6c.83 0 1.5-.67 1.5-1.5v-3c0-.83-.67-1.5-1.5-1.5h-6V6.09c0-.88-.71-1.59-1.59-1.59-.42 0-.82.16-1.12.46ZM7.5 19.5h-3c-.83 0-1.5-.67-1.5-1.5V6c0-.83.67-1.5 1.5-1.5h3C8.33 4.5 9 3.83 9 3s-.67-1.5-1.5-1.5h-3C2.02 1.5 0 3.52 0 6v12c0 2.48 2.02 4.5 4.5 4.5h3c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5Z"
                  fill="#393939"
                />
              </svg>
              返回
            </div>
            <div class="flex-fill ${gClass('title')}">合併 ${allOrderLength()} 個訂單</div>`,
            divCreate: {
                class: `d-flex align-items-center ${gClass('header')}`,
            },
        });
        const handleSave = () => {
            let hasError = false;
            let normalCount = 0;
            for (const value of Object.values(vm.dataObject)) {
                if (value.status === 'error') {
                    hasError = true;
                    break;
                }
                if (value.status === 'normal') {
                    normalCount++;
                }
            }
            if (hasError) {
                dialog.errorMessage({ text: '含有不可合併的項目<br />請回到預設並再次合併' });
                return;
            }
            if (normalCount > 0) {
                dialog.warningMessage({
                    callback: () => { },
                    text: `有${normalCount}組訂單付款、配送方式或地址不同<br />而無法合併，需先確認應套用哪筆訂單的資料`,
                });
                return;
            }
            dialog.checkYesOrNot({
                callback: bool => {
                    if (bool) {
                        dialog.dataLoading({ visible: true });
                        ApiShop.combineOrder(vm.dataObject).then(r => {
                            if (r.result && r.response) {
                                dialog.dataLoading({ visible: false });
                                dialog.successMessage({ text: '合併完成' });
                                setTimeout(() => {
                                    closeDialog();
                                    callback();
                                }, 500);
                            }
                        });
                    }
                },
                text: `合併後將為${statusDataLength(vm.dataObject, 'success')}組訂單各別建立新訂單，<br />原訂單則會被取消並封存。`,
            });
        };
        const renderFooter = (gvc) => html `
      <div class="${gClass('footer')}">
        ${BgWidget.cancel(gvc.event(closeDialog))} ${BgWidget.save(gvc.event(handleSave), '合併')}
      </div>
    `;
        const renderContent = (gvc) => {
            const phoneCardStyle = isDesktop
                ? ''
                : 'border-radius: 10px; padding: 12px; background: #fff; box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.08);';
            const fontColor = {
                success: '#10931D',
                error: '#DA1313',
                normal: '#393939',
            };
            const hits = [
                '原訂單將被取消並封存，且所有訂單將合併為一筆新訂單',
                '合併後的訂單小計和折扣將依據當前的計算方式計算',
                '系統不會重複計算購物金和點數',
            ];
            const getDashboardData = () => {
                return [
                    {
                        title: '訂單數量',
                        count: allOrderLength(),
                        countStyle: 'normal',
                        unit: '筆',
                    },
                    {
                        title: '待確認',
                        count: statusDataLength(vm.dataObject, 'normal'),
                        countStyle: 'normal',
                        unit: '組',
                    },
                    {
                        title: '可以合併',
                        count: statusDataLength(vm.dataObject, 'success'),
                        countStyle: 'success',
                        unit: '組',
                    },
                    {
                        title: '不可合併',
                        count: statusDataLength(vm.dataObject, 'error'),
                        countStyle: 'error',
                        unit: '組',
                    },
                ];
            };
            const dashboardItemHTML = (item) => {
                return BgWidget.mainCard(html `
          <div style="${phoneCardStyle}">
            <div class="${gClass('dashboard-gray')}">${item.title}</div>
            <div class="d-flex align-items-end gap-1">
              <span class="tx_700" style="font-size: 24px; color: ${fontColor[item.countStyle]}">${item.count}</span>
              <span class="tx_normal" style="margin-bottom: 0.35rem">${item.unit}</span>
            </div>
          </div>
        `);
            };
            const editOrdersHTML = (key, editID) => {
                const dataMap = vm.dataObject;
                const data = dataMap[key];
                const orders = data.orders;
                const userInfo = orders[0].orderData.user_info;
                const orderToggle = (isExpanded) => {
                    return html `${orders.length} 筆訂單 <i class="fa-solid fa-angle-${isExpanded ? 'up' : 'down'} ms-1"></i>`;
                };
                const userView = () => {
                    return html ` <span class="tx_700">${userInfo.name}</span>
            <span>(${key})</span>`;
                };
                const combineBadge = () => {
                    const resultMap = {
                        normal: BgWidget.secondaryInsignia('待確認'),
                        error: BgWidget.dangerInsignia('不可合併'),
                        success: BgWidget.successInsignia('可以合併'),
                    };
                    return resultMap[data.status];
                };
                const alertText = () => {
                    return html ` <div style="color: ${fontColor[data.status]}; white-space: break-spaces;">${data.note}</div>`;
                };
                const checkInfoBtn = () => {
                    if (data.status !== 'normal') {
                        return '';
                    }
                    return BgWidget.customButton({
                        button: { color: 'snow', size: 'sm' },
                        text: { name: '確認資訊' },
                        event: gvc.event(() => {
                            const dialogVM = {
                                selectOrderID: data.targetID,
                                dotClass: BgWidget.getWhiteDotClass(gvc),
                            };
                            return BgWidget.dialog({
                                gvc: ogvc,
                                title: '確認資訊',
                                width: 1100,
                                style: 'position: relative; min-height: 600px;',
                                innerHTML: gvc => {
                                    const styles = [
                                        { width: 40, align: 'start' },
                                        { width: 10, align: 'center' },
                                        { width: 10, align: 'center' },
                                        { width: 10, align: 'center' },
                                        { width: 30, align: 'center' },
                                    ];
                                    const ovm = {
                                        list_id: gvc.glitter.getUUID(),
                                        list_loading: true,
                                        payment_method: [],
                                    };
                                    return html `
                    <div class="${gClass('check-info-box')}">
                      ${BgWidget.grayNote('請與顧客確認合併訂單的付款、配送方式及地址<br />應與下列哪筆訂單相同，避免爭議')}
                      <div class="${gClass('box')} mt-2">
                        <div class="d-flex">
                          ${[
                                        { title: '訂單編號' },
                                        { title: '訂單時間' },
                                        { title: '付款方式' },
                                        { title: '配送方式' },
                                        { title: '配送地址' },
                                    ]
                                        .map((item, i) => {
                                        return html ` <div
                                class="tx_700"
                                style="width: ${styles[i].width}%; text-align: ${styles[i].align};"
                              >
                                ${item.title}
                              </div>`;
                                    })
                                        .join('')}
                        </div>
                        ${gvc.bindView({
                                        bind: ovm.list_id,
                                        view: () => {
                                            if (ovm.list_loading) {
                                                return '';
                                            }
                                            else {
                                                return orders
                                                    .map(order => {
                                                    const orderData = order.orderData;
                                                    const vt = this.getAllStatusBadge(order);
                                                    const row = [
                                                        {
                                                            title: html `
                                        <div class="d-flex gap-2">
                                          ${gvc.bindView({
                                                                bind: `r-${order.cart_token}`,
                                                                view: () => {
                                                                    return html `<input
                                                class="form-check-input ${dialogVM.dotClass} cursor_pointer"
                                                style="margin-top: 0.25rem;"
                                                type="radio"
                                                id="r-${order.cart_token}"
                                                name="check-info-radios"
                                                onchange="${gvc.event(() => {
                                                                        dialogVM.selectOrderID = order.cart_token;
                                                                        gvc.notifyDataChange(orders.map(d => `r-${d.cart_token}`));
                                                                    })}"
                                                ${dialogVM.selectOrderID === order.cart_token ? 'checked' : ''}
                                              />`;
                                                                },
                                                            })}
                                          <span style="color: #4d86db;">${order.cart_token}</span>
                                          <div class="d-flex justify-content-end gap-2">
                                            ${vt.archivedBadge()}
                                            ${vt.paymentBadge()}${vt.outShipBadge()}${vt.orderStatusBadge()}
                                          </div>
                                        </div>
                                      `,
                                                        },
                                                        { title: order.created_time.split('T')[0] },
                                                        { title: this.getPaymentMethodText(orderData, ovm.payment_method) },
                                                        { title: this.getShippingMethodText(orderData) },
                                                        { title: this.getShippingAddress(orderData) },
                                                    ]
                                                        .map((item, i) => {
                                                        var _a;
                                                        return html ` <div
                                        class="tx_normal"
                                        style="width: ${styles[i].width}%; text-align: ${styles[i].align};"
                                      >
                                        <span style="white-space: break-spaces;">${((_a = item.title) !== null && _a !== void 0 ? _a : '').trim()}</span>
                                      </div>`;
                                                    })
                                                        .join('');
                                                    return html ` <div class="${gClass('order-row')}">${row}</div>`;
                                                })
                                                    .join('');
                                            }
                                        },
                                        divCreate: {
                                            class: 'd-flex flex-column gap-0 mt-3',
                                        },
                                        onCreate: () => {
                                            if (ovm.list_loading) {
                                                PaymentConfig.getSupportPayment(true).then(response => {
                                                    ovm.payment_method = response;
                                                    ovm.list_loading = false;
                                                    gvc.notifyDataChange(ovm.list_id);
                                                });
                                            }
                                        },
                                    })}
                      </div>
                    </div>
                  `;
                                },
                                save: {
                                    event: () => new Promise(resolve => {
                                        if (dialogVM.selectOrderID) {
                                            data.status = 'success';
                                            data.targetID = dialogVM.selectOrderID;
                                            data.note = '';
                                        }
                                        gvc.notifyDataChange([editID, ids.dashboard]);
                                        resolve(true);
                                    }),
                                },
                                cancel: {
                                    event: () => new Promise(resolve => {
                                        resolve(true);
                                    }),
                                },
                                xmark: () => new Promise(resolve => {
                                    resolve(true);
                                }),
                            });
                        }),
                    });
                };
                const toggleOrderView = () => {
                    const originID = ids.show;
                    ids.show = originID === editID ? '' : editID;
                    gvc.notifyDataChange(originID === editID ? editID : [originID, editID]);
                };
                const webView = (isExpanded) => {
                    try {
                        return html `
              <div class="d-flex ${gClass('box')}" style="background: ${isExpanded ? '#F7F7F7' : '#FFF'}">
                <div class="tx_700" style="width: 10%; cursor: pointer;" onclick="${gvc.event(toggleOrderView)}">
                  ${orderToggle(isExpanded)}
                </div>
                <div style="width: 30%;">${userView()}</div>
                <div style="width: 7%;">${combineBadge()}</div>
                <div style="width: 46%;">${alertText()}</div>
                <div style="width: 7%;">${checkInfoBtn()}</div>
              </div>
              ${isExpanded ? orderView() : ''}
            `;
                    }
                    catch (error) {
                        console.error('webView error: ', error);
                        return '';
                    }
                };
                const phoneView = (isExpanded) => {
                    try {
                        return html `
              <div
                class="d-flex flex-column gap-1 ${gClass('box')}"
                style="background: ${isExpanded ? '#F7F7F7' : '#FFF'};${isDesktop ? '' : 'position: sticky; left: 0;'}"
              >
                <div class="d-flex">
                  <div class="tx_700" style="width: 57.5%;" onclick="${gvc.event(toggleOrderView)}">
                    ${orderToggle(isExpanded)}
                  </div>
                  <div style="width: 20%;">${combineBadge()}</div>
                  <div style="width: 22.5%;">${checkInfoBtn()}</div>
                </div>
                <div>${userView()}</div>
                <div>${alertText()}</div>
              </div>
              ${isExpanded ? orderView() : ''}
            `;
                    }
                    catch (error) {
                        console.error('phoneView error: ', error);
                        return '';
                    }
                };
                const orderView = () => {
                    const styles = [
                        { width: 35, align: 'start' },
                        { width: 10, align: 'start' },
                        { width: 10, align: 'center' },
                        { width: 10, align: 'center' },
                        { width: 20, align: 'center' },
                        { width: 10, align: 'center' },
                        { width: 10, align: 'center' },
                        { width: 5, align: 'center' },
                    ];
                    const ovm = {
                        list_id: gvc.glitter.getUUID(),
                        list_loading: true,
                        payment_method: [],
                    };
                    return html ` <div class="${gClass('box')} mt-2" style="${isDesktop ? '' : 'width: 1200px'}">
            <div class="d-flex">
              ${[
                        { title: '訂單編號' },
                        { title: '訂單時間' },
                        { title: '付款方式' },
                        { title: '配送方式' },
                        { title: '配送地址' },
                        { title: '訂單小計' },
                        { title: '商品資訊' },
                        { title: '' },
                    ]
                        .map((item, i) => {
                        return html ` <div class="tx_700" style="width: ${styles[i].width}%; text-align: ${styles[i].align};">
                    ${item.title}
                  </div>`;
                    })
                        .join('')}
            </div>
            ${gvc.bindView({
                        bind: ovm.list_id,
                        view: () => {
                            if (ovm.list_loading) {
                                return '';
                            }
                            else {
                                return orders
                                    .map((order, index) => {
                                    const orderData = order.orderData;
                                    const vt = this.getAllStatusBadge(order);
                                    const row = [
                                        {
                                            title: html `
                            <div class="d-flex gap-3">
                              <span style="color: #4d86db;">${order.cart_token}</span>
                              <div class="d-flex justify-content-end gap-2">
                                ${vt.archivedBadge()} ${vt.paymentBadge()}${vt.outShipBadge()}${vt.orderStatusBadge()}
                              </div>
                            </div>
                          `,
                                        },
                                        { title: order.created_time.split('T')[0] },
                                        { title: this.getPaymentMethodText(orderData, ovm.payment_method) },
                                        { title: this.getShippingMethodText(orderData) },
                                        { title: this.getShippingAddress(orderData) },
                                        { title: `$ ${orderData.total.toLocaleString()}` },
                                        { title: `${orderData.lineItems.length}件商品` },
                                        {
                                            title: orders.length > 1
                                                ? html `<i
                                  class="fa-solid fa-xmark"
                                  style="color: #B0B0B0; cursor: pointer"
                                  onclick="${gvc.event(() => {
                                                    if (order.cart_token === data.targetID) {
                                                        data.targetID = '';
                                                    }
                                                    data.orders.splice(index, 1);
                                                    vm.dataObject = setDataStatus(dataMap);
                                                    gvc.notifyDataChange([editID, ids.header, ids.dashboard]);
                                                })}"
                                ></i>`
                                                : '',
                                        },
                                    ]
                                        .map((item, i) => {
                                        var _a;
                                        return html ` <div
                            class="tx_normal"
                            style="width: ${styles[i].width}%; text-align: ${styles[i].align};"
                          >
                            <span style="white-space: break-spaces;">${((_a = item.title) !== null && _a !== void 0 ? _a : '').trim()}</span>
                          </div>`;
                                    })
                                        .join('');
                                    return html ` <div class="${gClass('order-row')}">${row}</div>`;
                                })
                                    .join('');
                            }
                        },
                        divCreate: {
                            class: 'd-flex flex-column gap-0 mt-3',
                        },
                        onCreate: () => {
                            if (ovm.list_loading) {
                                PaymentConfig.getSupportPayment(true).then(response => {
                                    ovm.payment_method = response;
                                    ovm.list_loading = false;
                                    gvc.notifyDataChange(ovm.list_id);
                                });
                            }
                        },
                    })}
          </div>`;
                };
                const isExpanded = ids.show === editID;
                return isDesktop ? webView(isExpanded) : phoneView(isExpanded);
            };
            return html `
        <div class="row">
          <div class="col-12 col-lg-5">
            ${BgWidget.mainCard(html `
              <div style="min-height: 160px; ${phoneCardStyle}">
                <span class="tx_700">合併須知</span>
                <ul class="mt-2 ms-4">
                  ${hits
                .map(hit => {
                return html ` <li class="${gClass('list')}">${hit}</li>`;
            })
                .join('')}
                </ul>
              </div>
            `)}
          </div>
          <div class="col-12 col-lg-7">
            ${BgWidget.mainCard(html ` <div style="min-height: 160px; ${phoneCardStyle}">
                <span class="tx_700">訂單總計</span>
                ${gvc.bindView({
                bind: ids.dashboard,
                view: () => getDashboardData()
                    .map(item => {
                    return html ` <div class="col-6 col-lg-3 px-0 px-lg-2">${dashboardItemHTML(item)}</div>`;
                })
                    .join(''),
                divCreate: {
                    class: 'row mt-3',
                },
            })}
              </div>`)}
          </div>
        </div>
        <div class="d-flex my-1 my-lg-3">
          <div class="flex-fill"></div>
          <div
            class="${gClass('update')}"
            onclick="${gvc.event(() => {
                vm.dataObject = structuredClone(vm.originDataObject);
                gvc.notifyDataChange([ids.orderlist, ids.header, ids.dashboard]);
            })}"
          >
            回到預設
          </div>
        </div>
        ${BgWidget.mainCard(gvc.bindView({
                bind: ids.orderlist,
                view: () => Object.keys(vm.dataObject)
                    .map((key, index) => {
                    const id = `edit-orders-${index}`;
                    return gvc.bindView({
                        bind: id,
                        view: () => editOrdersHTML(key, id),
                        divCreate: {
                            style: isDesktop ? '' : 'position: relative; overflow-x: auto;',
                        },
                    });
                })
                    .join(BgWidget.horizontalLine()),
                divCreate: {
                    style: 'phoneCardStyle',
                },
            }))}
      `;
        };
        const checkOrderMergeConditions = (orders) => {
            if (orders.length < 2)
                return false;
            const [firstOrder, ...restOrders] = orders;
            const { status: baseStatus, orderData: baseData } = firstOrder;
            const { shipment: baseShipment, address: baseAddress, CVSStoreName: baseCVSStoreName } = baseData.user_info;
            return restOrders.every(order => {
                const { status, orderData } = order;
                const { user_info } = orderData;
                const isPayStatusSame = status === baseStatus;
                const isShipmentSame = user_info.shipment === baseShipment;
                const isAddressSame = [
                    'UNIMARTC2C',
                    'UNIMARTFREEZE',
                    'FAMIC2C',
                    'FAMIC2CFREEZE',
                    'OKMARTC2C',
                    'HILIFEC2C',
                ].includes(baseShipment)
                    ? user_info.CVSStoreName === baseCVSStoreName
                    : user_info.address === baseAddress;
                return isPayStatusSame && isShipmentSame && isAddressSame;
            });
        };
        const getStatusData = (data) => {
            const { orders, targetID } = data;
            if (orders.length < 2) {
                return {
                    status: 'error',
                    note: '需包含至少兩筆訂單，否則無法進行合併',
                    orders,
                    targetID: '',
                };
            }
            if (!checkOrderMergeConditions(orders) && !targetID) {
                return {
                    status: 'normal',
                    note: '因付款、配送方式或地址不同，請確認合併訂單應套用至哪筆訂單',
                    orders,
                    targetID: '',
                };
            }
            return {
                status: 'success',
                note: '',
                orders,
                targetID: targetID || orders[0].cart_token,
            };
        };
        const setDataStatus = (obj) => {
            Object.keys(obj).forEach(key => {
                obj[key] = getStatusData(obj[key]);
            });
            return obj;
        };
        glitter.innerDialog((gvc) => {
            const temp = {};
            applyClass();
            for (const order of dataArray) {
                const { email, user_info, progress, orderStatus } = order.orderData;
                if (!((progress === undefined || progress === 'wait') && (orderStatus === undefined || `${orderStatus}` === '0'))) {
                    dialog.infoMessage({ text: '訂單狀態應為處理中，且尚未出貨' });
                    return;
                }
                const key = (user_info === null || user_info === void 0 ? void 0 : user_info.email) || (user_info === null || user_info === void 0 ? void 0 : user_info.phone) || email;
                if (key) {
                    temp[key] = temp[key] || { orders: [] };
                    temp[key].orders.push(order);
                }
            }
            vm.dataObject = setDataStatus(temp);
            vm.originDataObject = structuredClone(vm.dataObject);
            const filteredData = Object.fromEntries(Object.entries(vm.dataObject).filter(([, data]) => {
                return data.orders.length >= 2;
            }));
            if (Object.keys(filteredData).length === 0) {
                dialog.infoMessage({ text: '找不到相同的訂購人，無法合併訂單' });
                return;
            }
            return gvc.bindView({
                bind: ids.page,
                view: () => html `
          <div class="d-flex flex-column ${gClass('full-screen')}">
            ${renderHeader(gvc)}
            <div
              class="flex-fill scrollbar-appear"
              style="${isDesktop ? 'padding: 24px 32px;' : 'padding: 0;'} overflow: hidden auto;"
            >
              ${renderContent(gvc)}
            </div>
            ${renderFooter(gvc)}
          </div>
        `,
            });
        }, 'combineOrders');
    }
    static allEditDialog(data) {
        const gvc = data.gvc;
        const dialog = new ShareDialog(gvc.glitter);
        const defaultValue = '';
        let temp = '';
        BgWidget.settingDialog({
            gvc: gvc,
            title: data.title,
            innerHTML: (innerGVC) => {
                return html ` <div>
          <div class="tx_700 mb-2">更改為</div>
          ${BgWidget.select({
                    gvc: innerGVC,
                    callback: (value) => {
                        temp = value;
                    },
                    default: defaultValue,
                    options: [{ key: '', value: '請選擇狀態' }, ...data.options],
                })}
        </div>`;
            },
            footer_html: (footerGVC) => {
                return [
                    BgWidget.cancel(footerGVC.event(() => footerGVC.closeDialog()), '取消'),
                    BgWidget.save(footerGVC.event(() => {
                        if (temp === defaultValue) {
                            dialog.infoMessage({ text: '請選擇欲更改的選項' });
                            return;
                        }
                        footerGVC.closeDialog();
                        data.callback(temp);
                    }), '儲存'),
                ].join('');
            },
            width: 350,
        });
    }
    static batchEditOrders(obj) {
        const wp = window.parent;
        const topGVC = wp.glitter.pageConfig[wp.glitter.pageConfig.length - 1].gvc;
        const cloneOrders = structuredClone(obj.orders);
        topGVC.glitter.innerDialog((gvc) => {
            const dialog = new ShareDialog(gvc.glitter);
            const vm = {
                id: gvc.glitter.getUUID(),
                loading: true,
                orders: [],
            };
            gvc.addStyle(`
        .scrollbar-appear::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .scrollbar-appear::-webkit-scrollbar-thumb {
          background: #666;
          border-radius: 20px;
        }
        .scrollbar-appear::-webkit-scrollbar-track {
          border-radius: 20px;
          background: #d8d8d8;
        }
        .scrollbar-appear {
        }
      `);
            function loadingEvent() {
                dialog.dataLoading({ visible: true });
                ApiShop.getOrder({
                    page: 0,
                    limit: 1000,
                    id_list: obj.orders.map((data) => data.id).join(','),
                }).then(d => {
                    dialog.dataLoading({ visible: false });
                    if (d.result && Array.isArray(d.response.data)) {
                        vm.orders = d.response.data;
                    }
                    vm.loading = false;
                    gvc.notifyDataChange(vm.id);
                });
            }
            function closeEvent() {
                obj.orders = cloneOrders;
                topGVC.glitter.closeDiaLog();
            }
            function getDatalist() {
                return vm.orders.map((dd, index) => {
                    return [
                        {
                            key: '訂單編號',
                            value: html ` <div class="d-flex align-items-center gap-2" style="min-width: 200px;">
                ${dd.cart_token}${(() => {
                                switch (dd.orderData.orderSource) {
                                    case 'manual':
                                        return BgWidget.primaryInsignia('手動', { type: 'border' });
                                    case 'combine':
                                        return BgWidget.warningInsignia('合併', { type: 'border' });
                                    case 'POS':
                                        return BgWidget.primaryInsignia('POS', { type: 'border' });
                                    default:
                                        return '';
                                }
                            })()}
              </div>`,
                        },
                        {
                            key: '訂單日期',
                            value: html ` <div style="width: 120px;">
                ${gvc.glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd')}
              </div>`,
                        },
                        {
                            key: '訂購人',
                            value: dd.orderData.user_info ? dd.orderData.user_info.name || '未填寫' : `匿名`,
                        },
                        {
                            key: '訂單金額',
                            value: `$ ${dd.orderData.total.toLocaleString()}`,
                        },
                        {
                            key: '出貨單號碼',
                            value: html ` <div style="width: 200px;">
                ${BgWidget.grayNote(dd.orderData.user_info.shipment_number
                                ? `#${dd.orderData.user_info.shipment_number}`
                                : dd.orderData.orderSource === 'POS'
                                    ? 'POS 訂單'
                                    : '')}
              </div>`,
                        },
                        {
                            key: '訂單狀態',
                            value: BgWidget.select({
                                gvc,
                                callback: (value) => {
                                    dd.orderData.orderStatus = value;
                                },
                                default: `${dd.orderData.orderStatus || 0}`,
                                options: OrderSetting.getOrderStatusOpt(),
                            }),
                        },
                        {
                            key: '付款狀態',
                            value: BgWidget.select({
                                gvc,
                                callback: (value) => {
                                    dd.status = value;
                                },
                                default: `${dd.status || 0}`,
                                options: (() => {
                                    const paymentOptions = OrderSetting.getPaymentStatusOpt();
                                    const unpayOption = paymentOptions.find(item => item.key === '0');
                                    if (unpayOption) {
                                        if (dd.orderData.proof_purchase) {
                                            unpayOption.value = '待核款';
                                        }
                                        else if (dd.orderData.customer_info.payment_select == 'cash_on_delivery') {
                                            unpayOption.value = '貨到付款';
                                        }
                                        else {
                                            unpayOption.value = '未付款';
                                        }
                                    }
                                    return paymentOptions;
                                })(),
                                style: 'min-width: 150px;',
                            }),
                        },
                        {
                            key: '出貨狀態',
                            value: gvc.bindView((() => {
                                const divView = {
                                    id: gvc.glitter.getUUID(),
                                    checkbox: 'auto',
                                    hasShipmentNumber: Boolean(dd.orderData.user_info.shipment_number),
                                };
                                if (divView.hasShipmentNumber) {
                                    dd.orderData.progress = 'in_stock';
                                }
                                return {
                                    bind: divView.id,
                                    view: () => {
                                        var _a;
                                        const htmlArray = [
                                            BgWidget.select({
                                                gvc,
                                                callback: (value) => {
                                                    dd.orderData.progress = value;
                                                    if (['wait', 'returns', undefined].includes(value)) {
                                                        dd.orderData.user_info.shipment_number = '';
                                                    }
                                                    gvc.notifyDataChange(divView.id);
                                                },
                                                default: dd.orderData.progress || 'wait',
                                                options: OrderSetting.getShippmentOpt(),
                                                style: 'max-width: 180px;',
                                            }),
                                            (() => {
                                                var _a;
                                                if (!divView.hasShipmentNumber &&
                                                    ['wait', 'returns', undefined].includes(cloneOrders[index].orderData.progress) &&
                                                    ['arrived', 'finish', 'shipping', 'in_stock'].includes(dd.orderData.progress)) {
                                                    (_a = dd.orderData.user_info).shipment_number || (_a.shipment_number = new Date().getTime());
                                                    return EditorElem.radio({
                                                        gvc: gvc,
                                                        title: '',
                                                        def: divView.checkbox,
                                                        array: [
                                                            {
                                                                title: '自動選號',
                                                                value: 'auto',
                                                            },
                                                            {
                                                                title: '手動輸入',
                                                                value: 'manual',
                                                            },
                                                        ],
                                                        callback: text => {
                                                            divView.checkbox = text;
                                                            gvc.notifyDataChange(divView.id);
                                                        },
                                                        oneLine: true,
                                                    });
                                                }
                                                return '';
                                            })(),
                                            divView.checkbox === 'manual'
                                                ? BgWidget.editeInput({
                                                    gvc,
                                                    title: '',
                                                    default: `${(_a = dd.orderData.user_info.shipment_number) !== null && _a !== void 0 ? _a : ''}`,
                                                    placeHolder: '為空則為自動選號',
                                                    callback: text => {
                                                        dd.orderData.user_info.shipment_number = text;
                                                        gvc.notifyDataChange(divView.id);
                                                    },
                                                })
                                                : '',
                                        ].filter(Boolean);
                                        return html ` <div class="d-flex align-items-center gap-2">${htmlArray.join('')}</div>`;
                                    },
                                    divCreate: {
                                        style: 'min-width: 620px;',
                                    },
                                };
                            })()),
                        },
                    ];
                });
            }
            function editOrderView() {
                return BgWidget.tableV3({
                    gvc,
                    filter: [
                        {
                            name: '更改付款狀態',
                            event: (checkArray) => {
                                OrderSetting.allEditDialog({
                                    gvc,
                                    title: '批量更改付款狀態',
                                    options: OrderSetting.getPaymentStatusOpt(),
                                    callback: (value) => {
                                        checkArray.forEach((order) => {
                                            order.status = Number(value);
                                        });
                                        gvc.notifyDataChange(vm.id);
                                    },
                                });
                            },
                        },
                        {
                            name: '更改出貨狀態',
                            event: (checkArray) => {
                                OrderSetting.allEditDialog({
                                    gvc,
                                    title: '批量更改出貨狀態',
                                    options: OrderSetting.getShippmentOpt(),
                                    callback: (value) => {
                                        checkArray.forEach((order) => {
                                            order.orderData.progress = value;
                                            if (['wait', 'returns', undefined].includes(value)) {
                                                order.orderData.user_info.shipment_number = '';
                                            }
                                        });
                                        gvc.notifyDataChange(vm.id);
                                    },
                                });
                            },
                        },
                        {
                            name: '更改訂單狀態',
                            event: (checkArray) => {
                                OrderSetting.allEditDialog({
                                    gvc,
                                    title: '批量更改訂單狀態',
                                    options: OrderSetting.getOrderStatusOpt(),
                                    callback: (value) => {
                                        checkArray.forEach((order) => {
                                            order.orderData.orderStatus = value;
                                        });
                                        gvc.notifyDataChange(vm.id);
                                    },
                                });
                            },
                        },
                    ],
                    getData: vmi => {
                        vmi.pageSize = 0;
                        vmi.originalData = vm.orders;
                        vmi.tableData = getDatalist();
                        setTimeout(() => {
                            vmi.loading = false;
                            vmi.callback();
                        }, 100);
                    },
                    rowClick: () => { },
                    hiddenPageSplit: true,
                    windowTarget: wp,
                });
            }
            return gvc.bindView({
                bind: vm.id,
                view: () => {
                    if (vm.loading) {
                        loadingEvent();
                        return '';
                    }
                    return html `
            <div
              class="d-flex flex-column"
              style="width: 100vw; height: 100vh; position: absolute; left: 0; top: 0; background-color: white; z-index: 1;"
            >
              <div
                class="d-flex align-items-center"
                style="height: 60px; width: 100vw; border-bottom: solid 1px #DDD; font-size: 16px; font-style: normal; font-weight: 700; color: #393939;"
              >
                <div
                  class="d-flex"
                  style="padding: 19px 32px; gap: 8px; cursor: pointer; border-right: solid 1px #DDD;"
                  onclick="${topGVC.event(() => closeEvent())}"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M13.7859 4.96406L8.02969 10.7203C7.69219 11.0578 7.5 11.5219 7.5 12C7.5 12.4781 7.69219 12.9422 8.02969 13.2797L13.7859 19.0359C14.0859 19.3359 14.4891 19.5 14.9109 19.5C15.7875 19.5 16.5 18.7875 16.5 17.9109V15H22.5C23.3297 15 24 14.3297 24 13.5V10.5C24 9.67031 23.3297 9 22.5 9H16.5V6.08906C16.5 5.2125 15.7875 4.5 14.9109 4.5C14.4891 4.5 14.0859 4.66875 13.7859 4.96406ZM7.5 19.5H4.5C3.67031 19.5 3 18.8297 3 18V6C3 5.17031 3.67031 4.5 4.5 4.5H7.5C8.32969 4.5 9 3.82969 9 3C9 2.17031 8.32969 1.5 7.5 1.5H4.5C2.01562 1.5 0 3.51562 0 6V18C0 20.4844 2.01562 22.5 4.5 22.5H7.5C8.32969 22.5 9 21.8297 9 21C9 20.1703 8.32969 19.5 7.5 19.5Z"
                      fill="#393939"
                    />
                  </svg>
                  返回
                </div>
                <div class="flex-fill" style="padding: 19px 32px;">編輯 ${obj.orders.length} 個訂單</div>
              </div>
              <div
                class="overflow-scroll scrollbar-appear flex-fill"
                style="padding: ${document.body.clientWidth > 768 ? 20 : 8}px;"
              >
                ${editOrderView()}
              </div>
              <div class="w-100 d-flex justify-content-end" style="padding: 14px 16px; gap: 14px;">
                ${BgWidget.cancel(gvc.event(() => closeEvent()))}
                ${BgWidget.save(gvc.event(() => {
                        const verify = this.batchUpdateOrderVerify(gvc, cloneOrders, vm.orders);
                        if (verify) {
                            obj.callback(vm.orders);
                            topGVC.glitter.closeDiaLog();
                        }
                    }))}
              </div>
            </div>
          `;
                },
            });
        }, 'batchEditOrders');
    }
    static batchUpdateOrderVerify(gvc, cloneOrders, updateOrders) {
        const dialog = new ShareDialog(gvc.glitter);
        for (let i = 0; i < updateOrders.length; i++) {
            const order = updateOrders[i];
            const cloneOrder = cloneOrders[i];
            if (['wait', 'returns', undefined].includes(cloneOrder.orderData.progress) &&
                ['arrived', 'finish', 'shipping', 'in_stock'].includes(order.orderData.progress) &&
                !order.orderData.user_info.shipment_number) {
                dialog.errorMessage({
                    text: `訂單編號 #${order.cart_token} 未輸入出貨單號碼`,
                });
                return false;
            }
        }
        updateOrders.forEach((order) => {
            if (order.orderData.progress === 'in_stock') {
                order.orderData.progress = 'wait';
            }
        });
        return true;
    }
    static splitOrder(topGVC, origOrderData, callback) {
        var _a, _b;
        const orderData = structuredClone(origOrderData);
        function assignOrder(orderCreateUnit) {
            orderCreateUnit.cart_token = orderData.orderID;
            orderCreateUnit.customer_info = orderData.customer_info;
            orderCreateUnit.user_info = orderData.user_info;
            orderCreateUnit.voucher = orderData.voucherList;
            orderCreateUnit.lineItems = structuredClone(orderData.lineItems);
            orderCreateUnit.lineItems.forEach((lineItem) => {
                lineItem.count = 0;
            });
        }
        orderData.orderSource = 'split';
        let storeList = [];
        const dataArray = orderData.lineItems;
        const parentPageConfig = (_b = (_a = window.parent) === null || _a === void 0 ? void 0 : _a.glitter) === null || _b === void 0 ? void 0 : _b.pageConfig;
        const latestPageConfig = parentPageConfig === null || parentPageConfig === void 0 ? void 0 : parentPageConfig[parentPageConfig.length - 1];
        const ogvc = (latestPageConfig === null || latestPageConfig === void 0 ? void 0 : latestPageConfig.gvc) || topGVC;
        const glitter = ogvc.glitter;
        const dialog = new ShareDialog(glitter);
        const orderCreateUnit = new OrderDetail(0, 0);
        assignOrder(orderCreateUnit);
        const splitOrderArray = [structuredClone(orderCreateUnit)];
        const passData = structuredClone(orderCreateUnit);
        const isDesktop = document.body.clientWidth > 768;
        const vm = {
            prefix: 'split-orders',
            loading: true,
            splitCount: 1,
        };
        const ids = {
            show: '',
            page: glitter.getUUID(),
            header: glitter.getUUID(),
            dashboard: glitter.getUUID(),
            origQTY: glitter.getUUID(),
            itemList: glitter.getUUID(),
            block: glitter.getUUID(),
            summary: glitter.getUUID(),
            footer: glitter.getUUID(),
        };
        const gClass = (name) => `${vm.prefix}-${name}`;
        const applyClass = () => {
            ogvc.addStyle(`
        .scrollbar-appear::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .scrollbar-appear::-webkit-scrollbar-thumb {
          background: #666;
          border-radius: 20px;
        }
        .scrollbar-appear::-webkit-scrollbar-track {
          border-radius: 20px;
          background: #d8d8d8;
        }
        .${vm.prefix}-full-screen {
          width: 100vw;
          height: 100vh;
          position: absolute;
          left: 0;
          top: 0;
          background-color: white;
          z-index: 1;
        }
        .${vm.prefix}-header {
          height: 60px;
          border-bottom: 1px solid #ddd;
          font-size: 16px;
          font-weight: 700;
          color: #393939;
          background-color: white;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .${vm.prefix}-back-btn {
          padding: 19px 32px;
          gap: 8px;
          cursor: pointer;
          border-right: 1px solid #ddd;
          display: flex;
          align-items: center;
        }
        .${vm.prefix}-title {
          padding: 19px 32px;
        }
        .${vm.prefix}-footer {
          display: flex;
          justify-content: flex-end;
          padding: 14px 16px;
          gap: 14px;
          background-color: white;
          position: sticky;
          bottom: 0;
          z-index: 10;
        }

        .${vm.prefix}-order-row {
          display: flex;
          align-items: center;
          min-height: 80px;
        }
        .${vm.prefix}-split-rule {
          color: #4d86db;
          font-size: 16px;
          font-weight: 400;
          text-decoration-line: underline;
          text-decoration-style: solid;
          text-decoration-skip-ink: none;
          text-decoration-thickness: auto;
          text-underline-offset: auto;
          text-underline-position: from-font;
          cursor: pointer;
        }
        .${vm.prefix}-product-preview-img {
          width: 42px;
          height: 42px;
          border-radius: 5px;
        }
        .${vm.prefix}-font-gray {
          color: #8d8d8d;
        }
        .${vm.prefix}-font-blue {
          color: #4d86db;
        }
        .${vm.prefix}-product-input {
          border-radius: 10px;
          border: 1px solid #ddd;
          background: #fff;
          padding: 9px 18px;
        }
        .${vm.prefix}-split-BTN {
          height: 26px;
          color: #4d86db;
          gap: 6px;
          padding: 0 18px;
          display: flex;
          align-items: start;
          cursor: pointer;
        }
        .${vm.prefix}-minusQty {
          color: #4d86db;
          font-size: 16px;
          font-weight: 400;
        }
        .${vm.prefix}-itemList-section {
          min-width: 100%;
          border-bottom: 1px solid #ddd;
          padding-top: 24px;
          gap: 5px;
          display: inline-flex;
        }
        .${vm.prefix}-summary-section {
          min-width: 100%;
          border-bottom: 1px solid #ddd;
          width: fit-content;
        }
        .${vm.prefix}-summary-title {
          width: 606px;
          flex-shrink: 0;
          border-right: 1px solid #ddd;
          padding-left: 18px;
          padding: 9px 18px;
          display: flex;
          justify-content: end;
          align-items: center;
        }
        .${vm.prefix}-summary-oriSummary {
          width: 152px;
          border-right: 1px solid #ddd;
          flex-shrink: 0;
        }
        .${vm.prefix}-summary-subSummary {
          width: 155px;
          border-right: 1px solid #ddd;
          flex-shrink: 0;
        }
        .${vm.prefix}-summary-raw-BG1 {
          background: #f7f7f7;
        }
        .${vm.prefix}-summary-raw {
          display: flex;
          font-size: 16px;
          align-items: center;
          justify-content: start;
          padding-left: 18px;
        }
        .${vm.prefix}-summary-raw1 {
          display: flex;
          font-size: 16px;
          font-weight: 700;
          align-items: end;
          justify-content: start;
          padding-left: 18px;
          padding-bottom: 9px;
        }
        .${vm.prefix}-summary-right {
          margin: 0 6px;
        }
        .${vm.prefix}-dialog-ul {
          padding: 6px;
        }
        .${vm.prefix}-dialog-ul-p24 {
          padding: 6px 24px;
        }
        .${vm.prefix}-dialog-ul li {
          margin-bottom: 3px;
          list-style: disc;
          text-align: left;
          white-space: break-spaces;
        }
      `);
        };
        const closeDialog = () => glitter.closeDiaLog();
        const renderHeader = (gvc) => gvc.bindView({
            bind: ids.header,
            view: () => html ` <div class="${gClass('back-btn')}" onclick="${gvc.event(closeDialog)}">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M13.79 4.96L8.03 10.72C7.69 11.06 7.5 11.52 7.5 12s.19.94.53 1.28l5.76 5.76c.3.3.7.46 1.12.46.88 0 1.59-.71 1.59-1.59V15h6c.83 0 1.5-.67 1.5-1.5v-3c0-.83-.67-1.5-1.5-1.5h-6V6.09c0-.88-.71-1.59-1.59-1.59-.42 0-.82.16-1.12.46ZM7.5 19.5h-3c-.83 0-1.5-.67-1.5-1.5V6c0-.83.67-1.5 1.5-1.5h3C8.33 4.5 9 3.83 9 3s-.67-1.5-1.5-1.5h-3C2.02 1.5 0 3.52 0 6v12c0 2.48 2.02 4.5 4.5 4.5h3c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5Z"
                  fill="#393939"
                />
              </svg>
              返回
            </div>
            <div class="flex-fill ${gClass('title')}">拆分訂單</div>`,
            divCreate: {
                class: `d-flex align-items-center ${gClass('header')}`,
            },
        });
        const handleSave = () => {
            const alertHTML = html `
        <div class="d-flex flex-column">
          <div class="tx_normal text-start">
            您即將拆分訂單，系統將產生 ${splitOrderArray.length} 筆子訂單，拆分後：
          </div>
          <ul class="${gClass('dialog-ul')} ${gClass('dialog-ul-p24')}">
            <li>原訂單調整金額與折扣，運費及附加費維持不變。子訂單按比例分配優惠。</li>
            <li>子訂單繼承母訂單設定，發票需手動作廢與重開。</li>
            <li>代收金額更新，已建立的出貨單需取消並重新建立。</li>
          </ul>
        </div>
      `;
            dialog.checkYesOrNotWithCustomWidth({
                callback: bool => {
                    if (bool) {
                        function deductFromStoresTS(log, amountToDeduct) {
                            const updatedLog = Object.assign({}, log);
                            const deductions = {};
                            let remainingAmount = Math.max(0, amountToDeduct);
                            const sortedEntries = Object.entries(updatedLog).sort(([, valueA], [, valueB]) => valueB - valueA);
                            for (const [storeKey, storeValue] of sortedEntries) {
                                if (remainingAmount <= 0) {
                                    break;
                                }
                                if (storeValue <= 0) {
                                    continue;
                                }
                                const amountDeductedFromThisStore = Math.min(remainingAmount, storeValue);
                                if (amountDeductedFromThisStore > 0) {
                                    updatedLog[storeKey] -= amountDeductedFromThisStore;
                                    deductions[storeKey] = amountDeductedFromThisStore;
                                    remainingAmount -= amountDeductedFromThisStore;
                                }
                            }
                            return {
                                updatedLog: updatedLog,
                                deductions: deductions,
                            };
                        }
                        orderData.lineItems.forEach((lineItem, index) => {
                            splitOrderArray.forEach(order => {
                                lineItem.count -= order.lineItems[index].count;
                                const resultTS = deductFromStoresTS(lineItem.deduction_log, order.lineItems[index].count);
                                order.lineItems[index].deduction_log = resultTS.deductions;
                                lineItem.deduction_log = resultTS.updatedLog;
                            });
                        });
                        const passData = {
                            orderData: orderData,
                            splitOrderArray: splitOrderArray,
                        };
                        dialog.dataLoading({ visible: true });
                        ApiShop.splitOrder(passData).then(r => {
                            if (r.result && r.response) {
                                dialog.dataLoading({ visible: false });
                                dialog.successMessage({ text: '拆分訂單完成' });
                                setTimeout(() => {
                                    closeDialog();
                                    callback();
                                }, 500);
                            }
                        });
                    }
                },
                text: alertHTML,
            });
        };
        const renderFooter = (gvc) => gvc.bindView({
            bind: ids.footer,
            view: () => {
                let allOrdersHaveZeroItems = false;
                let origQtyZero = true;
                let iSplitQtyCount = 0;
                splitOrderArray.forEach(splitOrder => {
                    if (splitOrder.lineItems.every(item => item.count === 0)) {
                        allOrdersHaveZeroItems = true;
                    }
                    iSplitQtyCount += splitOrder.lineItems.reduce((count, lineItem) => {
                        return (count += lineItem.count);
                    }, 0);
                });
                const iQtyCount = dataArray.reduce((iCount, lineItem) => {
                    return (iCount += lineItem.count);
                }, 0);
                origQtyZero = iSplitQtyCount === iQtyCount;
                let checkBTN = '';
                if (allOrdersHaveZeroItems || origQtyZero) {
                    checkBTN = BgWidget.disableSave('拆分訂單');
                }
                else {
                    checkBTN = BgWidget.save(gvc.event(handleSave), '拆分訂單');
                }
                return html ` ${BgWidget.cancel(gvc.event(closeDialog))} ${checkBTN} `;
            },
            divCreate: { class: `${gClass('footer')}` },
        });
        const renderHint = (gvc) => {
            const phoneCardStyle = isDesktop
                ? ''
                : 'border-radius: 10px; padding: 12px; background: #fff; box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.08);';
            const hits = [
                '原訂單將保留剩餘商品，訂單金額與折扣將調整；子訂單將包含選定商品，並按比例分配優惠折扣',
                '拆單後，運費及附加費用不變，將保留於原訂單內，若需要，請手動編輯訂單新增費用',
                '請務必進入每一張新的子訂單，為其中的所有商品選擇正確的出貨庫存',
            ];
            return html `
        <div class="row">
          ${BgWidget.mainCard(html `
            <div style="${phoneCardStyle}">
              <span class="tx_700">拆單需知</span>
              <div class="w-100 d-flex flex-column">
                <ul class="mt-2 ms-4 ${gClass('dialog-ul')}">
                  ${hits
                .map(hit => {
                return html ` <li>${hit}</li>`;
            })
                .join('')}
                </ul>
                <div
                  class="${gClass('split-rule')} ms-auto d-flex align-items-end justify-content-end"
                  onclick="${gvc.event(() => {
                BgWidget.settingDialog({
                    gvc: gvc,
                    title: '拆單需知',
                    width: 766,
                    innerHTML: () => {
                        const list = [
                            '原訂單將保留剩餘商品，訂單金額與折扣將調整；子訂單將包含選定商品，並按比例分配優惠折扣',
                            '拆單後運費及附加費用不變，將保留於原訂單內，如需更改，請手動編輯訂單新增費用',
                            '子訂單會預設繼承母訂單的配送與付款方式，如需更改，請手動編輯訂單內容',
                            '子訂單若要重新開立發票，請至發票頁面手動建立',
                            '若發票已開立，系統不會自動作廢，需至訂單頁面手動作廢並重新開立',
                            '代收金額將更新，已建立的出貨單需取消並重新建立',
                        ];
                        return html ` <ul class="${gClass('dialog-ul')} ${gClass('dialog-ul-p24')}">
                          ${list.map(text => html `<li>${text}</li>`).join('')}
                        </ul>`;
                    },
                    footer_html: (gvc) => {
                        return '';
                    },
                });
            })}"
                >
                  詳細拆單規則
                </div>
              </div>
            </div>
          `)}
        </div>
      `;
        };
        const renderItemList = (gvc) => {
            function newSplitOrder() {
                splitOrderArray.push(structuredClone(orderCreateUnit));
                gvc.notifyDataChange([ids.itemList, ids.summary, ids.footer]);
            }
            function drawSplitOrder() {
                const titleDom = {
                    title: '子訂單數量',
                    key: 'subOrder',
                    width: '150px',
                    style: 'padding-left:18px;padding-right:18px;border-right:1px solid #ddd;',
                    htmlArray: [],
                };
                return splitOrderArray
                    .map((order, index) => {
                    var _a, _b, _c;
                    return html `
              <div class="d-flex flex-column">
                <div class="${commonClass}" style="width: ${titleDom.width};${(_a = titleDom === null || titleDom === void 0 ? void 0 : titleDom.style) !== null && _a !== void 0 ? _a : ''}">
                  <div class="tx_700">
                    ${titleDom.title}${index + 1}
                    <i
                      class="fa-solid fa-xmark cursor_pointer"
                      onclick="${gvc.event(() => {
                        if (splitOrderArray.length > 1) {
                            splitOrderArray.splice(index, 1);
                            gvc.notifyDataChange([ids.itemList, ids.summary, ids.footer]);
                        }
                    })}"
                    ></i>
                  </div>
                  <div class="flex-fill"></div>
                </div>
                <div
                  class="d-flex flex-column flex-shrink-0"
                  style="width: ${titleDom.width};gap:16px;padding-top: 24px;${(_b = titleDom === null || titleDom === void 0 ? void 0 : titleDom.style) !== null && _b !== void 0 ? _b : ''}"
                >
                  ${splitOrderArray[index].lineItems
                        .map((item, itemIndex) => {
                        return html `
                        <input
                          class="${gClass('product-input')} d-flex tx_normal w-100"
                          style="${commonHeight};"
                          type="number"
                          value="${item.count}"
                          onchange="${gvc.event(e => {
                            if (Number(e.value) < 0) {
                                e.value = '0';
                            }
                            const temp = structuredClone(item.count);
                            item.count = Number(e.value);
                            let nowQty = 0;
                            splitOrderArray.forEach((splitOrder, index) => {
                                nowQty += splitOrder.lineItems[itemIndex].count;
                            });
                            if (dataArray[itemIndex].count < nowQty) {
                                item.count = temp;
                                e.value = temp;
                            }
                            gvc.notifyDataChange([ids.summary, ids.footer, 'oriQty']);
                        })}"
                        />
                      `;
                    })
                        .join('')}
                </div>
                <div
                  class="d-flex flex-column flex-grow-1"
                  style="width: ${titleDom.width};gap:16px;padding-top: 24px;${(_c = titleDom === null || titleDom === void 0 ? void 0 : titleDom.style) !== null && _c !== void 0 ? _c : ''}"
                ></div>
              </div>
            `;
                })
                    .join('');
            }
            const commonClass = 'd-flex align-items-center';
            const commonHeight = 'height:40px;';
            const addBTN = html `
        <div
          class="tx_700 ${gClass('split-BTN')}"
          onclick="${gvc.event(() => {
                newSplitOrder();
            })}"
        >
          <div class="${commonClass}">新增訂單<i class="fa-solid fa-plus"></i></div>
        </div>
      `;
            return gvc.bindView({
                bind: ids.itemList,
                view: () => {
                    const dataRaws = [
                        { title: '商品', key: 'name', width: '320px', htmlArray: [] },
                        { title: '出貨庫存', key: 'stock', width: '120px', htmlArray: [] },
                        { title: '單價', key: 'price', width: '100px', htmlArray: [] },
                        {
                            title: '總數',
                            key: 'totalQty',
                            width: '51px',
                            style: 'padding-right:18px;border-right:1px solid #ddd;',
                            htmlArray: [],
                        },
                        {
                            title: '原單數量',
                            key: 'oriQty',
                            width: '147px',
                            style: 'padding-left:18px;padding-right:18px;border-right:1px solid #ddd;',
                            htmlArray: [],
                        },
                    ];
                    function drawLineItems(dataRaw) {
                        switch (dataRaw.key) {
                            case 'name': {
                                return dataArray
                                    .map((item, lineItemIndex) => {
                                    var _a, _b;
                                    const spec = item.spec.length > 0 ? Tool.truncateString(item.spec.join(''), 5) : '單一規格';
                                    return html ` <div class="${commonClass}" style="width: ${dataRaw.width};gap:12px;${commonHeight}">
                      ${BgWidget.validImageBox({
                                        gvc: gvc,
                                        image: (_a = item.preview_image) !== null && _a !== void 0 ? _a : '',
                                        width: 42,
                                    })}
                      <div class="d-flex flex-column flex-grow-1" style="gap:2px;">
                        <div class="tx_normal_14" style="white-space: normal;line-height: normal;">
                          ${Tool.truncateString((_b = item.title) !== null && _b !== void 0 ? _b : '', 10)} -${spec}
                        </div>
                        <div class="tx_normal_14 ${gClass('font-gray')}">
                          存貨單位 (SKU): ${item.sku && item.sku.length > 0 ? item.sku : '無SKU'}
                        </div>
                      </div>
                    </div>`;
                                })
                                    .join('');
                            }
                            case 'stock': {
                                if (storeList.length > 0) {
                                    return dataArray
                                        .map(item => {
                                        var _a;
                                        let maxEntry = {
                                            key: '',
                                            title: '',
                                            value: 0,
                                        };
                                        Object.entries(item.deduction_log).forEach((log) => {
                                            if (maxEntry.value < log[1]) {
                                                maxEntry = {
                                                    key: log[0],
                                                    title: log[0],
                                                    value: log[1],
                                                };
                                            }
                                        });
                                        maxEntry.title = storeList.find((store) => {
                                            return store.id == maxEntry.key;
                                        }).name;
                                        return html `
                        <div
                          class="tx_normal ${commonClass} justify-content-start"
                          style="width: ${dataRaw.width};${commonHeight}"
                        >
                          ${(_a = maxEntry.title) !== null && _a !== void 0 ? _a : '出貨庫存錯誤'}
                        </div>
                      `;
                                    })
                                        .join('');
                                }
                                return html `
                  <div
                    class="tx_normal ${commonClass} justify-content-start"
                    style="width: ${dataRaw.width};${commonHeight}"
                  >
                    AA倉庫
                  </div>
                `;
                            }
                            case 'price': {
                                return dataArray
                                    .map((item, lineItemIndex) => {
                                    const spec = item.spec.length > 0 ? Tool.truncateString(item.spec.join(''), 5) : '單一規格';
                                    return html `
                      <div
                        class="tx_normal ${commonClass} justify-content-start"
                        style="width: ${dataRaw.width};${commonHeight}"
                      >
                        ${item.sale_price}
                      </div>
                    `;
                                })
                                    .join('');
                            }
                            case 'totalQty': {
                                return dataArray
                                    .map((item, lineItemIndex) => {
                                    const spec = item.spec.length > 0 ? Tool.truncateString(item.spec.join(''), 5) : '單一規格';
                                    return html `
                      <div
                        class="tx_normal ${commonClass} justify-content-start"
                        style="width: ${dataRaw.width};${commonHeight}"
                      >
                        ${item.count}
                      </div>
                    `;
                                })
                                    .join('');
                            }
                            case 'oriQty': {
                                return dataArray
                                    .map((item, lineItemIndex) => {
                                    let splitQty = 0;
                                    splitOrderArray.forEach(order => {
                                        splitQty += Number(order.lineItems[lineItemIndex].count);
                                    });
                                    const minusQtyClass = `${gClass('minusQty')} ${splitQty > 0 ? '' : 'd-none'}`;
                                    return html `
                      <div
                        class="tx_normal ${commonClass} justify-content-start"
                        style="width: ${dataRaw.width};${commonHeight}"
                      >
                        ${item.count}
                        <span class="${minusQtyClass}">
                          <i class="fa-solid fa-arrow-right ${gClass('font-blue')} ${gClass('summary-right')}"></i
                          >${Number(item.count) - splitQty}</span
                        >
                      </div>
                    `;
                                })
                                    .join('');
                            }
                            default: {
                                return '';
                            }
                        }
                    }
                    return html `
            ${dataRaws
                        .map(item => {
                        var _a, _b;
                        return html `
                  <div class="d-flex flex-column flex-shrink-0">
                    <div class="${commonClass}" style="width: ${item.width};${(_a = item === null || item === void 0 ? void 0 : item.style) !== null && _a !== void 0 ? _a : ''}">
                      <div class="tx_700">${item.title}</div>
                      <div class="flex-fill"></div>
                    </div>
                    ${gvc.bindView({
                            bind: item.key,
                            view: () => {
                                return (drawLineItems(item) +
                                    html `<div class="${commonClass} mt-3" style="width: ${item.width};"></div>`);
                            },
                            divCreate: {
                                class: 'd-flex flex-column',
                                style: `width: ${item.width};gap:16px;padding-top: 24px;${(_b = item === null || item === void 0 ? void 0 : item.style) !== null && _b !== void 0 ? _b : ''}`,
                            },
                        })}
                  </div>
                `;
                    })
                        .join('')}
            <div class="d-flex flex-shrink-0" style="overflow-x: scroll;gap:5px;">${drawSplitOrder()} ${addBTN}</div>
          `;
                },
                divCreate: {
                    class: `${gClass('itemList-section')}`,
                },
            });
        };
        const renderSummary = (gvc) => {
            return gvc.bindView({
                bind: ids.summary,
                view: () => {
                    function drawSubTitle() {
                        return splitOrderArray
                            .map((order, index) => {
                            return html `
                  <div class="${gClass('summary-subSummary')} ${gClass('summary-raw1')}">子訂單${index + 1}</div>
                `;
                        })
                            .join('');
                    }
                    function drawOriData(index) {
                        const sale_price = dataArray.reduce((total, data) => total + data.sale_price * Number(data.count), 0);
                        const split_price = splitOrderArray.reduce((total, order) => total +
                            order.lineItems.reduce((subTotal, lineItem) => subTotal + lineItem.sale_price * Number(lineItem.count), 0), 0);
                        const split_discount = splitOrderArray.reduce((total, order) => total + order.discount, 0);
                        switch (index) {
                            case 1:
                                if (split_price) {
                                    return html `
                    <div class="d-flex align-items-center">
                      <span class="text-decoration-line-through">${sale_price}</span
                      ><i class="fa-solid fa-arrow-right ${gClass('font-blue')} ${gClass('summary-right')}"></i
                      ><span class="${gClass('font-blue')}">${sale_price - split_price}</span>
                    </div>
                  `;
                                }
                                return sale_price;
                            case 2:
                                return orderData.shipment_fee;
                            case 3:
                                if (split_price) {
                                    return html `
                    <div class="d-flex align-items-center">
                      <span class="text-decoration-line-through">-${orderData.discount}</span
                      ><i class="fa-solid fa-arrow-right ${gClass('font-blue')} ${gClass('summary-right')}"></i
                      ><span class="${gClass('font-blue')}">-${orderData.discount - split_discount}</span>
                    </div>
                  `;
                                }
                                return -orderData.discount;
                            default:
                                if (split_price) {
                                    return html `
                    <div class="d-flex align-items-center">
                      <span class="text-decoration-line-through">${orderData.total}</span
                      ><i class="fa-solid fa-arrow-right ${gClass('font-blue')} ${gClass('summary-right')}"></i
                      ><span class="${gClass('font-blue')}"
                        >${sale_price -
                                        split_price -
                                        (orderData.discount - split_discount) +
                                        orderData.shipment_fee}</span
                      >
                    </div>
                  `;
                                }
                                return orderData.total;
                        }
                    }
                    function drawSplitData(rawIndex) {
                        function drawUnit(order, lineIndex) {
                            const total = order.lineItems.reduce((total, lineItem) => total + lineItem.sale_price * Number(lineItem.count), 0);
                            const rate = total / orderData.total;
                            order.discount = Math.round(orderData.discount * rate);
                            order.total = total - order.discount;
                            switch (rawIndex) {
                                case 1:
                                    return total;
                                case 2:
                                    return 0;
                                case 3:
                                    return -order.discount;
                                default:
                                    return order.total;
                            }
                        }
                        return splitOrderArray
                            .map((order, lineIndex) => {
                            return html `
                  <div class="${gClass('summary-subSummary')} d-flex ${gClass('summary-raw1')}">
                    ${drawUnit(order, lineIndex)}
                  </div>
                `;
                        })
                            .join('');
                    }
                    const titleRaw = [
                        { title: '', style: 'height:58px;' },
                        { title: '小計總額' },
                        { title: '運費' },
                        { title: '折扣' },
                        { title: '總金額' },
                    ];
                    return titleRaw
                        .map((raw, index) => {
                        if (index == 0) {
                            return html `
                  <div class="d-flex" style="height:58px;">
                    <div class="${gClass('summary-title')}"></div>
                    <div class="${gClass('summary-oriSummary')} d-flex ${gClass('summary-raw1')}">原訂單</div>
                    ${drawSubTitle()}
                  </div>
                `;
                        }
                        return html `
                <div class="d-flex ${gClass('summary-raw-BG' + (index % 2))}">
                  <div class="${gClass('summary-title')} ">${raw.title}</div>
                  <div class="${gClass('summary-oriSummary')} d-flex ${gClass('summary-raw')}">
                    ${drawOriData(index)}
                  </div>
                  ${drawSplitData(index)}
                </div>
              `;
                    })
                        .join('');
                },
                divCreate: {
                    class: `${gClass('summary-section')}`,
                },
            });
        };
        glitter.innerDialog((gvc) => {
            const temp = {};
            applyClass();
            return gvc.bindView({
                bind: ids.page,
                view: () => {
                    if (vm.loading) {
                        glitter.share.loading_dialog.dataLoading({ text: '載入中...', visible: true });
                        ApiUser.getPublicConfig('store_manager', 'manager').then((dd) => {
                            if (dd.result && dd.response.value) {
                                storeList = dd.response.value.list;
                                vm.loading = false;
                                gvc.notifyDataChange(ids.page);
                            }
                        });
                    }
                    else {
                        glitter.share.loading_dialog.dataLoading({ text: '載入中...', visible: false });
                    }
                    return html `
            <div class="d-flex flex-column ${gClass('full-screen')}">
              ${renderHeader(gvc)}
              <div
                class="flex-fill scrollbar-appear"
                style="${isDesktop ? 'padding: 24px 32px;' : 'padding: 0 24px;'} overflow: scroll;"
              >
                ${renderHint(gvc)} ${renderItemList(gvc)} ${renderSummary(gvc)}
              </div>
              ${renderFooter(gvc)}
            </div>
          `;
                },
            });
        }, 'splitOrder');
    }
}
