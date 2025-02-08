import { Tool } from '../../modules/tool.js';
import { BgWidget } from '../../backend-manager/bg-widget.js';
import { GVC } from '../../glitterBundle/GVController.js';
import { ApiUser } from '../../glitter-base/route/user.js';

const html = String.raw;

export class DeliveryHTML {
    static print(ogvc: GVC, dataArray: CartData[], type: 'shipment' | 'pick') {
        const prefix = Tool.randomString(5);
        const containerID = Tool.randomString(5);
        const vm = {
            store: {} as any,
            info: (() => {
                switch (type) {
                    case 'shipment':
                        return {
                            title: '出貨明細',
                            subtitle: '出貨',
                        };
                    case 'pick':
                        return {
                            title: '揀貨單',
                            subtitle: '揀貨',
                        };
                }
            })(),
        };

        return BgWidget.fullDialog({
            gvc: ogvc,
            title: () => {
                return '列印出貨單';
            },
            innerHTML: (gvc) => {
                const glitter = gvc.glitter;
                const id = glitter.getUUID();
                let loading = true;
                this.addStyle(gvc, prefix);

                return gvc.bindView({
                    bind: id,
                    view: () => {
                        if (loading) {
                            return '';
                        } else {
                            return html`<div class="container" id="${containerID}">
                                ${dataArray
                                    .map((data) => {
                                        const orderData = data.orderData;
                                        try {
                                            return html`
                                                <div class="page">
                                                    <div class="header">
                                                        <h1 class="subtitle">商店名稱：${vm.store.shop_name}</h1>
                                                        <h1 class="title">${vm.info.title}</h1>
                                                        <h1 class="subtitle">${vm.info.subtitle}時間：${glitter.ut.dateFormat(new Date(), 'yyyy-MM-dd hh:mm')}</h1>
                                                    </div>
                                                    ${type === 'shipment'
                                                        ? html` <div class="details">
                                                              <table>
                                                                  <tr>
                                                                      <td>訂單編號：${data.cart_token}</td>
                                                                      <td>送貨方式：${this.getShippingMethodText(orderData)}</td>
                                                                  </tr>
                                                                  <tr>
                                                                      <td>訂購日期：${glitter.ut.dateFormat(new Date(data.created_time), 'yyyy-MM-dd hh:mm')}</td>
                                                                      <td>送貨地址：${orderData.user_info.address}</td>
                                                                  </tr>
                                                                  <tr>
                                                                      <td>訂購人帳號：${orderData.email}</td>
                                                                      <td>收件人姓名：${orderData.user_info.name}</td>
                                                                  </tr>
                                                                  <tr>
                                                                      <td>付款方式：${this.getPaymentMethodText(orderData)}</td>
                                                                      <td>收件人電話：${orderData.user_info.phone}</td>
                                                                  </tr>
                                                                  <tr>
                                                                      <td>付款狀態：${this.paymentStatus(data)}</td>
                                                                      <td>收件人信箱：${orderData.user_info.email}</td>
                                                                  </tr>
                                                              </table>
                                                          </div>`
                                                        : ''}
                                                    <div class="items">
                                                        <table>
                                                            <thead>
                                                                <tr>
                                                                    <th class="text-left">項次</th>
                                                                    <th class="text-left">商品名稱</th>
                                                                    ${type === 'shipment' ? html`<th class="text-right">單價</th>` : html`<th class="text-right">貨號</th>`}
                                                                    <th class="text-right">數量</th>
                                                                    ${type === 'shipment' ? html`<th class="text-right">金額</th>` : ''}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                ${orderData.lineItems
                                                                    .map((item, index) => {
                                                                        return html`
                                                                            <tr>
                                                                                <td class="text-left">${index + 1}</td>
                                                                                <td class="text-left">${item.title} ${item.spec.length > 0 ? `(${item.spec.join('/')})` : ''}</td>
                                                                                ${type === 'shipment'
                                                                                    ? html`<td class="text-right">${item.sale_price.toLocaleString()}</td>`
                                                                                    : html`<td class="text-right">${item.sku ?? ''}</td>`}
                                                                                <td class="text-right">${item.count}</td>
                                                                                ${type === 'shipment'
                                                                                    ? html`<td class="text-right">$ ${(item.sale_price * parseInt(item.count, 10)).toLocaleString()}</td>`
                                                                                    : ''}
                                                                            </tr>
                                                                        `;
                                                                    })
                                                                    .join('')}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    ${type === 'shipment'
                                                        ? html`
                                                              <div class="summary">
                                                                  <table>
                                                                      <tr>
                                                                          <td>小計：</td>
                                                                          <td>$ ${(orderData.total + orderData.discount - orderData.shipment_fee + orderData.use_rebate).toLocaleString()}</td>
                                                                      </tr>
                                                                      <tr>
                                                                          <td>運費：</td>
                                                                          <td>${orderData.shipment_fee.toLocaleString()}</td>
                                                                      </tr>
                                                                      <tr>
                                                                          <td>折扣：</td>
                                                                          <td>-${orderData.discount.toLocaleString()}</td>
                                                                      </tr>
                                                                      <tr>
                                                                          <td>購物金折抵：</td>
                                                                          <td>-${orderData.use_rebate.toLocaleString()}</td>
                                                                      </tr>
                                                                      <tr>
                                                                          <td>總計：</td>
                                                                          <td>$ ${orderData.total.toLocaleString()}</td>
                                                                      </tr>
                                                                  </table>
                                                              </div>
                                                              ${orderData.order_note && orderData.order_note.length > 0
                                                                  ? html` <div>【訂單備註】</div>
                                                                        <p class="note">${orderData.order_note.replace(/\n/g, '<br />')}</p>`
                                                                  : ''}
                                                          `
                                                        : ''}
                                                </div>
                                            `;
                                        } catch (e: any) {
                                            return 'ERROR: ' + (e.message ?? '');
                                        }
                                    })
                                    .join('')}
                            </div>`;
                        }
                    },
                    divCreate: {
                        style: 'min-height: calc(100vh - 70px); padding: 20px;',
                    },
                    onCreate: () => {
                        if (loading) {
                            ApiUser.getPublicConfig('store-information', 'manager').then((r) => {
                                if (r.result && r.response) {
                                    vm.store = r.response.value;
                                }
                                loading = false;
                                gvc.notifyDataChange(id);
                            });
                        } else {
                            // 動態添加前綴到 HTML 中的 class 名稱
                            const container = window.parent.document.getElementById(containerID);
                            if (container) {
                                const elements = container.querySelectorAll('[class]');
                                elements.forEach((el) => {
                                    const classList = Array.from(el.classList);
                                    el.className = classList.map((cls) => `${prefix}-${cls}`).join(' ');
                                });
                                container.className = `${prefix}-container`;
                            }
                        }
                    },
                });
            },
            footer_html: (gvc: GVC) => {
                return [
                    BgWidget.cancel(
                        gvc.event(() => {
                            gvc.closeDialog();
                        })
                    ),
                    BgWidget.save(
                        gvc.event(() => {
                            function printContainerWithStyles() {
                                // 捕捉父視窗的 DOM 元素
                                const container = window.parent.document.getElementById(containerID);

                                if (!container) {
                                    console.error(`未找到 ID 為 ${containerID} 的元素`);
                                    return;
                                }

                                // 創建新的印列視窗
                                const printWindow = window.open('', '_blank');

                                // 獲取當前頁面的所有樣式標籤
                                const styles = Array.from(window.parent.document.querySelectorAll('style, link[rel="stylesheet"]'))
                                    .map((style) => style.outerHTML)
                                    .join('\n');

                                if (!printWindow) {
                                    return;
                                }

                                // 在印列視窗中插入需要列印的內容及樣式
                                printWindow.document.open();
                                printWindow.document.write(html`
                                    <!DOCTYPE html>
                                    <html lang="zh-TW">
                                        <head>
                                            <meta charset="UTF-8" />
                                            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                                            <title>列印</title>
                                            ${styles}
                                            <!-- 複製的樣式 -->
                                        </head>
                                        <style>
                                            /* 設定列印樣式 */
                                            @media print {
                                                /* 設定列印紙張大小 */
                                                @page {
                                                    size: A4; /* 指定 A4 紙張大小 */
                                                    margin: 16mm; /* 自訂邊距 */
                                                }

                                                /* 確保內容分頁 */
                                                html,
                                                body {
                                                    width: 210mm; /* A4 寬度 */
                                                    height: 297mm; /* A4 高度 */
                                                    margin: 0;
                                                    padding: 0;
                                                    font-family: Arial, sans-serif;
                                                }

                                                .${prefix}-page {
                                                    page-break-after: always; /* 每頁結尾強制換頁 */
                                                }

                                                .${prefix}-page:last-child {
                                                    page-break-after: auto; /* 最後一頁不強制換頁 */
                                                }
                                            }
                                        </style>
                                        <body>
                                            ${container.outerHTML}
                                            <!-- 插入目標元素 -->
                                        </body>
                                    </html>
                                `);
                                printWindow.document.close();

                                // 啟動列印功能
                                printWindow.print();

                                // 選擇性：列印後關閉視窗
                                printWindow.onafterprint = () => {
                                    printWindow.close();
                                };
                            }

                            printContainerWithStyles();
                        }),
                        '列印'
                    ),
                ].join('');
            },
            closeCallback: () => {},
        });
    }

    static addStyle(gvc: GVC, prefix: string) {
        gvc.addStyle(`
            .${prefix}-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
            }
            .${prefix}-text-left {
                text-align: left;
            }
            .${prefix}-text-right {
                text-align: right;
            }
            .${prefix}-container {
                width: 100%;
                margin: 0 auto;
                padding: 0 24px;
            }
            .${prefix}-title {
                text-align: center;
                font-size: 24px;
                font-weight: bold;
            }
            .${prefix}-subtitle {
                font-size: 14px;
            }
            .${prefix}-note {
                margin-bottom: 24px;
            }
            .${prefix}-summary {
                display: flex;
                justify-content: end;
            }
            .${prefix}-details table,
            .${prefix}-items table {
                width: 100%;
                margin-bottom: 20px;
            }
            .${prefix}-summary table {
                width: 50%;
                margin-bottom: 20px;
            }
            .${prefix}-details td {
                padding: 4px;
                text-align: left;
                width: 50%;
            }
            .${prefix}-items th,
            .${prefix}-items td {
                padding: 4px;
            }
            .${prefix}-items th {
                background-color: #f4f4f4;
            }
            .${prefix}-summary td {
                padding: 4px;
                text-align: right;
            }
            .${prefix}-summary tr:last-child td {
                font-weight: bold;
            }
        `);
    }

    static getPaymentMethodText(orderData: OrderData) {
        if (orderData.orderSource === 'POS') {
            return `門市POS付款`;
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

    static getShippingMethodText(orderData: OrderData) {
        switch (orderData.user_info.shipment) {
            case 'UNIMARTC2C':
                return '7-11店到店';
            case 'FAMIC2C':
                return '全家店到店';
            case 'OKMARTC2C':
                return 'OK店到店';
            case 'HILIFEC2C':
                return '萊爾富店到店';
            default:
                return '宅配';
        }
    }

    static paymentStatus(cart: CartData) {
        if (cart.status === 0) {
            if (cart.orderData.proof_purchase) {
                return '待核款';
            }
            return '未付款';
        } else if (cart.status === 1) {
            return '已付款';
        } else if (cart.status === -2) {
            return '已退款';
        } else {
            return '付款失敗';
        }
    }
}
