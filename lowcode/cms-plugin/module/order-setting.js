import { BgWidget } from '../../backend-manager/bg-widget.js';
import { ApiUser } from '../../glitter-base/route/user.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
const html = String.raw;
const css = String.raw;
export class OrderSetting {
    static getPaymentMethodText(orderData) {
        if (orderData.orderSource === 'POS') {
            return '門市POS付款';
        }
        switch (orderData.customer_info.payment_select) {
            case 'off_line':
                return '線下付款';
            case 'newWebPay':
                return '藍新金流';
            case 'ecPay':
                return '綠界金流';
            case 'line_pay':
                return 'Line Pay';
            case 'atm':
                return '銀行轉帳';
            case 'line':
                return 'Line 轉帳';
            case 'cash_on_delivery':
                return '貨到付款';
            default:
                return '線下付款';
        }
    }
    static getShippingMethodText(orderData) {
        switch (orderData.user_info.shipment) {
            case 'UNIMARTC2C':
                return '7-11店到店';
            case 'FAMIC2C':
                return '全家店到店';
            case 'OKMARTC2C':
                return 'OK店到店';
            case 'HILIFEC2C':
                return '萊爾富店到店';
            case 'normal':
                return '中華郵政';
            case 'black_cat':
                return '黑貓到府';
            case 'shop':
                return '實體門市取貨';
            case 'global_express':
                return '國際快遞';
            case 'now':
                return '立即取貨';
            default:
                return '宅配';
        }
    }
    static getShippingAddress(orderData) {
        const shipment = orderData.user_info.shipment;
        if (['UNIMARTC2C', 'FAMIC2C', 'OKMARTC2C', 'HILIFEC2C'].includes(shipment)) {
            return `${orderData.user_info.CVSStoreName} (${orderData.user_info.CVSAddress})`;
        }
        if (shipment === 'shop') {
            return '實體門市';
        }
        return orderData.user_info.address;
    }
    static getAllStatusBadge(orderData) {
        var _a;
        const paymentBadges = {
            '0': orderData.orderData.proof_purchase ? BgWidget.warningInsignia('待核款') : BgWidget.notifyInsignia('未付款'),
            '1': BgWidget.infoInsignia('已付款'),
            '3': BgWidget.warningInsignia('部分付款'),
            '-2': BgWidget.notifyInsignia('已退款'),
        };
        const outShipBadges = {
            finish: BgWidget.infoInsignia('已取貨'),
            shipping: BgWidget.warningInsignia('已出貨'),
            arrived: BgWidget.warningInsignia('已送達'),
            wait: BgWidget.notifyInsignia('未出貨'),
            pre_order: BgWidget.notifyInsignia('待預購'),
            returns: BgWidget.notifyInsignia('已退貨'),
        };
        const orderStatusBadges = {
            '1': BgWidget.infoInsignia('已完成'),
            '0': BgWidget.warningInsignia('處理中'),
        };
        orderData.orderData.orderStatus = (_a = orderData.orderData.orderStatus) !== null && _a !== void 0 ? _a : '0';
        return {
            paymentBadge: () => paymentBadges[`${orderData.status}`] || BgWidget.notifyInsignia('付款失敗'),
            outShipBadge: () => { var _a; return outShipBadges[(_a = orderData.orderData.progress) !== null && _a !== void 0 ? _a : 'wait'] || BgWidget.notifyInsignia('未知狀態'); },
            orderStatusBadge: () => orderStatusBadges[`${orderData.orderData.orderStatus}`] || BgWidget.notifyInsignia('已取消'),
            archivedBadge: () => (orderData.orderData.archived === 'true' ? BgWidget.secondaryInsignia('已封存') : ''),
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
                        <div class="d-flex flex-column position-relative" style="width: 80%;height:70%;background:white;border-radius: 10px;">
                            <div
                                class="d-flex align-items-center"
                                style="height: 60px;width: 100%;border-bottom: solid 1px #DDD;font-size: 16px;font-style: normal;font-weight: 700;color: #393939;background: #F2F2F2;border-radius: 10px 10px 0px 0px;"
                            >
                                <div class="flex-fill" style="padding: 19px 32px;">分倉出貨</div>
                            </div>
                            <div class="overflow-scroll scrollbar-appear flex-fill" style="padding:20px;">
                                <div class="d-flex " style="margin-bottom:16px;gap:44px;position: relative;">
                                    <div class="d-flex flex-shrink-0 align-items-center " style="width:${titleLength}px;font-size: 16px;font-style: normal;font-weight: 700;">商品</div>
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
                            const targetIndex = titleArray.findIndex((item) => item.title === '庫存');
                            if (targetIndex !== -1) {
                                const formattedSubStocks = subStocks.map((stockTitle) => ({
                                    title: stockTitle,
                                    width: titleArray[targetIndex].width,
                                }));
                                titleArray.splice(targetIndex, 1, ...formattedSubStocks);
                            }
                            return titleArray;
                        }
                        titleArray = insertSubStocks(titleArray, stockList.flatMap((item) => {
                            return [
                                html ` <div class="d-flex flex-column" style="text-align: center;gap:5px;">${item.name}${BgWidget.warningInsignia('庫存數量')}</div>`,
                                html ` <div class="d-flex flex-column" style="text-align: center;gap:5px;">${item.name}<br />${BgWidget.infoInsignia('出貨數量')}</div>`,
                            ];
                        }));
                        return titleArray
                            .map((title) => {
                            return html `
                                                    <div
                                                        class="d-flex flex-shrink-0 align-items-center ${title.title == '下單數量' ? 'justify-content-end' : ''} ${title.title != '商品' &&
                                title.title != '下單數量'
                                ? 'justify-content-center'
                                : ''}"
                                                        style="width:${title.width};font-size: 16px;font-style: normal;font-weight: 700;;${title.title == '商品'
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
                                return postMD
                                    .map((item) => {
                                    if (item.deduction_log && Object.keys(item.deduction_log).length === 0) {
                                        return;
                                    }
                                    return html `
                                                        <div class="d-flex align-items-center" style="gap:44px;">
                                                            <div class="d-flex align-items-center flex-shrink-0" style="width: ${titleLength}px;gap: 12px">
                                                                <img style="height: 54px;width: 54px;border-radius: 5px;" src="${item.preview_image}" />
                                                                <div class="d-flex flex-column" style="font-size: 16px;">
                                                                    <div>${item.title}</div>
                                                                    <div style="color: #8D8D8D;font-size: 14px;">${item.spec.length == 0 ? `單一規格` : item.spec.join(`,`)}</div>
                                                                    <div style="color: #8D8D8D;font-size: 14px;">存貨單位 (SKU): ${item.sku}</div>
                                                                </div>
                                                            </div>
                                                            <div class="d-flex align-items-center justify-content-end flex-shrink-0" style="width: ${elementLength}px;gap: 12px">${item.count}</div>
                                                            ${stockList
                                        .flatMap((stock) => {
                                        var _a, _b, _c, _d, _e;
                                        const limit = (_c = (_b = (_a = item.stockList) === null || _a === void 0 ? void 0 : _a[stock.id]) === null || _b === void 0 ? void 0 : _b.count) !== null && _c !== void 0 ? _c : 0;
                                        return [
                                            html ` <div class="d-flex align-items-center justify-content-end flex-shrink-0" style="width: ${elementLength}px;gap: 12px;">
                                                                            ${parseInt(limit)}
                                                                        </div>`,
                                            html ` <div class="d-flex align-items-center justify-content-end flex-shrink-0" style="width: ${elementLength}px;gap: 12px">
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
                                    .join('');
                            },
                            divCreate: { class: 'd-flex flex-column', style: 'margin-bottom:80px;gap:12px;' },
                        });
                    })()}
                            </div>
                            <div class="w-100 justify-content-end d-flex bg-white" style="gap:14px;padding-right:24px;padding-bottom:20px;padding-top: 10px;border-radius: 0px 0px 10px 10px;">
                                ${BgWidget.cancel(gvc.event(() => {
                        postMD = origData;
                        topGVC.glitter.closeDiaLog();
                    }))}
                                ${BgWidget.save(gvc.event(() => {
                        var _a;
                        const errorProducts = [];
                        const hasError = postMD.some((product) => {
                            const totalDeduction = Object.values(product.deduction_log).reduce((sum, value) => sum + value, 0);
                            if (Object.keys(product.deduction_log).length && totalDeduction !== product.count) {
                                errorProducts.push(`${product.title} - ${product.spec.join(',')}`);
                                return true;
                            }
                            return false;
                        });
                        if (hasError) {
                            dialog.errorMessage({
                                text: html `<div class="d-flex flex-column">出貨數量異常</div>`,
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
                    class: `d-flex align-items-center justify-content-center`,
                    style: `width: 100vw; height: 100vh;`,
                },
                onCreate: () => { },
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
            return Object.values(dataMap).filter((item) => item.status === status).length;
        };
        const renderHeader = (gvc) => gvc.bindView({
            bind: ids.header,
            view: () => html `<div class="${gClass('back-btn')}" onclick="${gvc.event(closeDialog)}">
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
                callback: (bool) => {
                    if (bool) {
                        dialog.dataLoading({ visible: true });
                        ApiShop.combineOrder(vm.dataObject).then((r) => {
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
        const renderFooter = (gvc) => html ` <div class="${gClass('footer')}">${BgWidget.cancel(gvc.event(closeDialog))} ${BgWidget.save(gvc.event(handleSave), '合併')}</div> `;
        const renderContent = (gvc) => {
            const phoneCardStyle = isDesktop ? '' : 'border-radius: 10px; padding: 12px; background: #fff; box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.08);';
            const fontColor = {
                success: '#10931D',
                error: '#DA1313',
                normal: '#393939',
            };
            const hits = ['原訂單將被取消並封存，且所有訂單將合併為一筆新訂單', '合併後的訂單小計和折扣將依據當前的計算方式計算', '系統不會重複計算購物金和點數'];
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
                    return html `<div style="color: ${fontColor[data.status]}; white-space: break-spaces;">${data.note}</div>`;
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
                                innerHTML: (gvc) => {
                                    const styles = [
                                        { width: 40, align: 'start' },
                                        { width: 10, align: 'center' },
                                        { width: 10, align: 'center' },
                                        { width: 10, align: 'center' },
                                        { width: 30, align: 'center' },
                                    ];
                                    return html `
                                        <div class="${gClass('check-info-box')}">
                                            ${BgWidget.grayNote('請與顧客確認合併訂單的付款、配送方式及地址<br />應與下列哪筆訂單相同，避免爭議')}
                                            <div class="${gClass('box')} mt-2">
                                                <div class="d-flex">
                                                    ${[{ title: '訂單編號' }, { title: '訂單時間' }, { title: '付款方式' }, { title: '配送方式' }, { title: '配送地址' }]
                                        .map((item, i) => {
                                        return html `<div class="tx_700" style="width: ${styles[i].width}%; text-align: ${styles[i].align};">${item.title}</div>`;
                                    })
                                        .join('')}
                                                </div>
                                                <div class="d-flex flex-column gap-0 mt-3">
                                                    ${orders
                                        .map((order) => {
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
                                                            gvc.notifyDataChange(orders.map((d) => `r-${d.cart_token}`));
                                                        })}"
                                                                                        ${dialogVM.selectOrderID === order.cart_token ? 'checked' : ''}
                                                                                    />`;
                                                    },
                                                })}
                                                                            <span style="color: #4d86db;">${order.cart_token}</span>
                                                                            <div class="d-flex justify-content-end gap-2">
                                                                                ${vt.archivedBadge()} ${vt.paymentBadge()}${vt.outShipBadge()}${vt.orderStatusBadge()}
                                                                            </div>
                                                                        </div>
                                                                    `,
                                            },
                                            { title: order.created_time.split('T')[0] },
                                            { title: this.getPaymentMethodText(orderData) },
                                            { title: this.getShippingMethodText(orderData) },
                                            { title: this.getShippingAddress(orderData) },
                                        ]
                                            .map((item, i) => {
                                            var _a;
                                            return html `<div class="tx_normal" style="width: ${styles[i].width}%; text-align: ${styles[i].align};">
                                                                        <span style="white-space: break-spaces;">${((_a = item.title) !== null && _a !== void 0 ? _a : '').trim()}</span>
                                                                    </div>`;
                                        })
                                            .join('');
                                        return html ` <div class="${gClass('order-row')}">${row}</div>`;
                                    })
                                        .join('')}
                                                </div>
                                            </div>
                                        </div>
                                    `;
                                },
                                save: {
                                    event: () => new Promise((resolve) => {
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
                                    event: () => new Promise((resolve) => {
                                        resolve(true);
                                    }),
                                },
                                xmark: () => new Promise((resolve) => {
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
                        <div
                          class="tx_700"
                          style="width: 10%; cursor: pointer;"
                          onclick="${gvc.event(toggleOrderView)}"
                        >
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
                          style="background: ${isExpanded ? '#F7F7F7' : '#FFF'};${isDesktop
                            ? ''
                            : 'position: sticky; left: 0;'}"
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
                    return html `<div class="${gClass('box')} mt-2" style="${isDesktop ? '' : 'width: 1200px'}">
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
                        return html `<div class="tx_700" style="width: ${styles[i].width}%; text-align: ${styles[i].align};">${item.title}</div>`;
                    })
                        .join('')}
                        </div>
                        <div class="d-flex flex-column gap-0 mt-3">
                            ${orders
                        .map((order, index) => {
                        const orderData = order.orderData;
                        const vt = this.getAllStatusBadge(order);
                        const row = [
                            {
                                title: html `
                                                <div class="d-flex gap-3">
                                                    <span style="color: #4d86db;">${order.cart_token}</span>
                                                    <div class="d-flex justify-content-end gap-2">${vt.archivedBadge()} ${vt.paymentBadge()}${vt.outShipBadge()}${vt.orderStatusBadge()}</div>
                                                </div>
                                            `,
                            },
                            { title: order.created_time.split('T')[0] },
                            { title: this.getPaymentMethodText(orderData) },
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
                            return html `<div class="tx_normal" style="width: ${styles[i].width}%; text-align: ${styles[i].align};">
                                                <span style="white-space: break-spaces;">${((_a = item.title) !== null && _a !== void 0 ? _a : '').trim()}</span>
                                            </div>`;
                        })
                            .join('');
                        return html ` <div class="${gClass('order-row')}">${row}</div>`;
                    })
                        .join('')}
                        </div>
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
                .map((hit) => {
                return html `<li class="${gClass('list')}">${hit}</li>`;
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
                    .map((item) => {
                    return html `<div class="col-6 col-lg-3 px-0 px-lg-2">${dashboardItemHTML(item)}</div>`;
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
            return restOrders.every((order) => {
                const { status, orderData } = order;
                const { user_info } = orderData;
                const isPayStatusSame = status === baseStatus;
                const isShipmentSame = user_info.shipment === baseShipment;
                const isAddressSame = ['UNIMARTC2C', 'FAMIC2C', 'OKMARTC2C', 'HILIFEC2C'].includes(baseShipment) ? user_info.CVSStoreName === baseCVSStoreName : user_info.address === baseAddress;
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
            Object.keys(obj).forEach((key) => {
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
                        <div class="flex-fill scrollbar-appear" style="${isDesktop ? 'padding: 24px 32px;' : 'padding: 0;'} overflow: hidden auto;">${renderContent(gvc)}</div>
                        ${renderFooter(gvc)}
                    </div>
                `,
            });
        }, 'combineOrders');
    }
}
