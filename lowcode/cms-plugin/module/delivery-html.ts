import { GVC } from '../../glitterBundle/GVController.js';
import { Tool } from '../../modules/tool.js';
import { BgWidget } from '../../backend-manager/bg-widget.js';
import { ApiUser } from '../../glitter-base/route/user.js';
import { CartData, OrderData } from './data.js';

const html = String.raw;

type PrintType = 'shipment' | 'pick' | 'address' | 'shipAddr';

type InfoObject = {
  title: string;
  subtitle: string;
};

export class DeliveryHTML {
  // 列印事件
  static print(ogvc: GVC, dataArray: CartData[], type: PrintType) {
    const prefix = Tool.randomString(3);
    const containerID = Tool.randomString(3);

    const infoMap: Record<PrintType, InfoObject> = {
      shipment: {
        title: '出貨明細',
        subtitle: '出貨',
      },
      pick: {
        title: '揀貨單',
        subtitle: '揀貨',
      },
      address: {
        title: '地址貼條',
        subtitle: '地址貼條',
      },
      shipAddr: {
        title: '出貨明細',
        subtitle: '出貨明細',
      },
    };

    const vm = {
      store: {} as any,
      twZipcode: [] as any,
      info: infoMap[type],
    };

    return BgWidget.fullDialog({
      gvc: ogvc,
      title: () => `列印${vm.info.subtitle}單`,
      innerHTML: gvc => {
        const glitter = gvc.glitter;
        const id = glitter.getUUID();
        let loading = true;
        this.addStyle(gvc, prefix);

        return gvc.bindView({
          bind: id,
          view: () => {
            if (loading) {
              return '載入中';
            }

            const printMap: Record<PrintType, string> = {
              shipment: this.shipmentHTML(vm, glitter, dataArray),
              pick: this.pickHTML(vm, glitter, dataArray),
              address: this.addressHTML(vm, dataArray),
              shipAddr: this.shipAddrHTML(vm, glitter, dataArray),
            };

            return html`<div class="container" id="${containerID}">${printMap[type]}</div>`;
          },
          divCreate: {
            style: 'min-height: calc(100vh - 70px); padding: 20px;',
          },
          onCreate: () => {
            if (loading) {
              Promise.all([
                // 讀取台灣郵遞區號
                fetch(new URL('../../assets/json/twzipcode.json', import.meta.url).href)
                  .then(response => response.text())
                  .then(content => JSON.parse(content)),

                // 讀取商家資料
                ApiUser.getPublicConfig('store-information', 'manager').then(r => {
                  return r.result && r.response ? r.response.value : {};
                }),
              ]).then(dataArray => {
                vm.twZipcode = dataArray[0];
                vm.store = dataArray[1];

                loading = false;
                gvc.notifyDataChange(id);
              });
            }

            // 動態添加前綴到 HTML 中的 class 名稱
            const container = window.parent.document.getElementById(containerID);
            if (container) {
              const elements = container.querySelectorAll('[class]');
              elements.forEach(el => {
                const classList = Array.from(el.classList);
                el.className = classList.map(cls => `${prefix}-${cls}`).join(' ');
              });
              container.className = `${prefix}-container`;
            }
          },
        });
      },
      footer_html: gvc => {
        return [
          BgWidget.cancel(
            gvc.event(() => {
              gvc.closeDialog();
            })
          ),
          BgWidget.save(
            gvc.event(() => {
              // 捕捉父視窗的 DOM 元素
              const container = window.parent.document.getElementById(containerID);

              if (!container) {
                console.error(`未找到 ID 為 ${containerID} 的元素`);
                return;
              }

              // 建立新的列印視窗
              const printWindow = window.open('', '_blank');

              if (!printWindow) {
                console.error('無法獲取列印視窗');
                return;
              }

              // 獲取當前頁面的所有樣式標籤
              const styles = Array.from(window.parent.document.querySelectorAll('style, link[rel="stylesheet"]'))
                .map(style => style.outerHTML)
                .join('\n');

              // 在列印視窗中插入需要列印的內容及樣式
              printWindow.document.open();
              printWindow.document.write(html`
                <!DOCTYPE html>
                <html lang="zh-TW">
                  <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>列印</title>
                    <!-- 複製的樣式 -->
                    ${styles}
                  </head>
                  <style>
                    @media print {
                      /* 確保紙張與內容大小一致 */
                      @page {
                        size: A4 portrait; /* 固定 A4 尺寸 */
                        margin: 4mm; /* 避免邊距影響 */
                      }

                      /* 讓 HTML 與 BODY 無任何邊距 */
                      html,
                      body {
                        width: 210mm; /* A4 寬度 */
                        height: 297mm; /* A4 高度 */
                        margin: 0;
                        padding: 0;
                        border: 0;
                        font-family: Arial, sans-serif;
                      }

                      /* 確保內容從最左上角開始 */
                      body {
                        position: static !important; /* 避免元素偏移 */
                        margin: 0 !important;
                        padding: 0 !important;
                      }

                      /* 確保每頁內容從新的一頁開始 */
                      .${prefix}-page {
                        page-break-after: always; /* 每頁結尾強制換頁 */
                        page-break-before: auto;
                        page-break-inside: avoid; /* 避免內容拆開 */
                      }
                    }
                  </style>
                  <body>
                    <!-- 插入目標元素 -->
                    ${container.outerHTML}
                  </body>
                </html>
              `);
              printWindow.document.close();

              // 啟動列印功能
              setTimeout(() => printWindow.print(), 200);

              // 選擇性：列印後關閉視窗
              printWindow.onafterprint = () => printWindow.close();
            }),
            '列印'
          ),
        ].join('');
      },
      closeCallback: () => {},
    });
  }

  // 添加樣式
  static addStyle(gvc: GVC, prefix: string) {
    gvc.addStyle(`
      .${prefix}-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        height: 60px;
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

      .${prefix}-recipient {
        margin: 0 24px;
      }

      .${prefix}-recipient-text {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 2px;
        min-height: 12px;
      }

      .${prefix}-flex-wrap {
        display: flex;
        flex-wrap: wrap;
      }

      .${prefix}-post-card {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 48%;
        border: 0.5px solid #b0b0b0;
        padding: 12px;
        margin: 6px;
      }

      .${prefix}-post-header {
        display: flex;
        flex-direction: column;
        gap: 18px;
        width: 100%;
        border-bottom: 0.5px solid #b0b0b0;
        padding: 12px;
      }

      .${prefix}-recipient-header {
        margin: 0 48px;
      }

      .${prefix}-send-text {
        font-size: 14px;
        font-weight: normal;
        min-height: 18px;
      }

      .${prefix}-order-text {
        min-height: 24px;
        text-align: end;
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
        margin-bottom: 12px;
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

  // 出貨明細 HTML
  static shipmentHTML(vm: any, glitter: any, dataArray: CartData[]) {
    const section = (data: CartData) => {
      const orderData = data.orderData;
      return html`
        <div class="page">
          <div class="header">
            <h1 class="subtitle">商店名稱：${vm.store.shop_name}</h1>
            <h1 class="title">${vm.info.title}</h1>
            <h1 class="subtitle">${vm.info.subtitle}時間：${glitter.ut.dateFormat(new Date(), 'yyyy-MM-dd hh:mm')}</h1>
          </div>
          <div class="details">
            <table>
              <tr>
                <td>訂單編號：${data.cart_token}</td>
                <td>送貨方式：${this.getShippingMethodText(orderData)}</td>
              </tr>
              <tr>
                <td>訂購日期：${glitter.ut.dateFormat(new Date(data.created_time), 'yyyy-MM-dd hh:mm')}</td>
                <td>
                  送貨地址：${[orderData.user_info.city, orderData.user_info.area, orderData.user_info.address]
                    .filter(Boolean)
                    .join('')}
                </td>
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
          </div>
          <div class="items">
            <table>
              <thead>
                <tr>
                  <th class="text-left">項次</th>
                  <th class="text-left">商品名稱</th>
                  <th class="text-right">單價</th>
                  <th class="text-right">數量</th>
                  <th class="text-right">金額</th>
                </tr>
              </thead>
              <tbody>
                ${orderData.lineItems
                  .map((item, index) => {
                    return html`
                      <tr>
                        <td class="text-left">${index + 1}</td>
                        <td class="text-left">
                          ${item.title} ${item.spec.length > 0 ? `(${item.spec.join('/')})` : ''}
                        </td>
                        <td class="text-right">${item.sale_price.toLocaleString()}</td>
                        <td class="text-right">${item.count}</td>
                        <td class="text-right">$ ${(item.sale_price * parseInt(item.count, 10)).toLocaleString()}</td>
                      </tr>
                    `;
                  })
                  .join('')}
              </tbody>
            </table>
          </div>
          <div class="summary">
            <table>
              <tr>
                <td>小計：</td>
                <td>
                  $
                  ${(
                    orderData.total +
                    orderData.discount -
                    orderData.shipment_fee +
                    orderData.use_rebate
                  ).toLocaleString()}
                </td>
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
        </div>
      `;
    };

    return dataArray
      .map(data => {
        try {
          return section(data);
        } catch (e) {
          const text = `訂單 #${data.cart_token} 列印出貨發生錯誤`;
          console.error(`${text}: ${e}`);
          return text;
        }
      })
      .join('');
  }

  // 揀貨單 HTML
  static pickHTML(vm: any, glitter: any, dataArray: CartData[]) {
    const formulaLineItems = () => {
      const mergedItems = dataArray
        .flatMap(data => data.orderData.lineItems)
        .reduce(
          (acc, item) => {
            const key = `${item.id}-${item.spec.join('/')}`; // 唯一識別鍵
            if (!acc[key]) {
              acc[key] = { ...item, count: 0 }; // 初始化 count
            }
            acc[key].count += item.count; // 數量累加
            return acc;
          },
          {} as Record<string, any>
        );

      const resultHtml = Object.values(mergedItems).map((item, index) => {
        return html`
          <tr>
            <td class="text-left">${index + 1}</td>
            <td class="text-left">${item.title} ${item.spec.length > 0 ? `(${item.spec.join('/')})` : ''}</td>
            <td class="text-right">${item.sku || '-'}</td>
            <td class="text-right">${item.count}</td>
          </tr>
        `;
      });

      return resultHtml;
    };

    return html`
      <div class="page">
        <div class="header">
          <h1 class="subtitle">商店名稱：${vm.store.shop_name}</h1>
          <h1 class="title">${vm.info.title}</h1>
          <h1 class="subtitle">${vm.info.subtitle}時間：${glitter.ut.dateFormat(new Date(), 'yyyy-MM-dd hh:mm')}</h1>
        </div>
        <div class="items">
          <table>
            <thead>
              <tr>
                <th class="text-left">項次</th>
                <th class="text-left">商品名稱</th>
                <th class="text-right">貨號</th>
                <th class="text-right">數量</th>
              </tr>
            </thead>
            <tbody>
              ${formulaLineItems().join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 地址貼條 HTML
  static addressHTML(vm: any, dataArray: CartData[]) {
    const dataMap = dataArray.map(order => {
      const orderData = order.orderData;

      // 取得台灣郵遞區號
      const zipcode = (() => {
        try {
          if (!(orderData.user_info.city && orderData.user_info.area)) return '';
          const county = orderData.user_info.city.replace('臺', '台');
          return vm.twZipcode[county][orderData.user_info.area];
        } catch (error) {
          return '';
        }
      })();

      // 單張地址貼條
      return html`<div class="post-card">
        <div>
          <h1 class="send-text">${vm.store.address}</h1>
          <h1 class="send-text">${vm.store.shop_name}</h1>
          <h1 class="send-text">${vm.store.phone}</h1>
        </div>
        <div class="recipient">
          <h1 class="recipient-text">
            ${[zipcode, orderData.user_info.city, orderData.user_info.area, orderData.user_info.address]
              .filter(Boolean)
              .join('')}
          </h1>
          <h1 class="recipient-text"></h1>
          <h1 class="recipient-text">${orderData.user_info.phone}</h1>
        </div>
        <div class="order-text">訂單編號： ${order.cart_token}</div>
      </div>`;
    });

    const chunk = 10;
    const chunksCount = Math.ceil(dataMap.length / chunk);
    const dataList: string[][] = [];

    for (let i = 0; i < chunksCount; i++) {
      dataList.push(dataMap.slice(i * chunk, (i + 1) * chunk));
    }

    return dataList
      .map(list => {
        return list.length > 0 ? html`<div class="page flex-wrap">${list.join('')}</div>` : '';
      })
      .join('');
  }

  // 出貨明細+地址貼條 HTML
  static shipAddrHTML(vm: any, glitter: any, dataArray: CartData[]) {
    const section = (data: CartData) => {
      const orderData = data.orderData;

      // 取得台灣郵遞區號
      const zipcode = (() => {
        try {
          if (!(orderData.user_info.city && orderData.user_info.area)) return '';
          const county = orderData.user_info.city.replace('臺', '台');
          return vm.twZipcode[county][orderData.user_info.area];
        } catch (error) {
          return '';
        }
      })();

      return html`
        <div class="page">
          <div class="post-header">
            <div>
              <h1 class="send-text">${vm.store.address}</h1>
              <h1 class="send-text">${vm.store.shop_name}</h1>
              <h1 class="send-text">${vm.store.phone}</h1>
            </div>
            <div class="recipient-header">
              <h1 class="recipient-text">
                ${[zipcode, orderData.user_info.city, orderData.user_info.area, orderData.user_info.address]
                  .filter(Boolean)
                  .join(' ')}
              </h1>
              <h1 class="recipient-text">${orderData.user_info.name}</h1>
              <h1 class="recipient-text">${orderData.user_info.phone}</h1>
            </div>
            <div style="text-align: end">訂單編號： ${data.cart_token}</div>
          </div>
          <div class="header">
            <h1 class="subtitle">商店名稱：${vm.store.shop_name}</h1>
            <h1 class="title">${vm.info.title}</h1>
            <h1 class="subtitle">${vm.info.subtitle}時間：${glitter.ut.dateFormat(new Date(), 'yyyy-MM-dd hh:mm')}</h1>
          </div>
          <div class="details">
            <table>
              <tr>
                <td>訂單編號：${data.cart_token}</td>
                <td>送貨方式：${this.getShippingMethodText(orderData)}</td>
              </tr>
              <tr>
                <td>訂購日期：${glitter.ut.dateFormat(new Date(data.created_time), 'yyyy-MM-dd hh:mm')}</td>
                <td>
                  送貨地址：${[orderData.user_info.city, orderData.user_info.area, orderData.user_info.address]
                    .filter(Boolean)
                    .join('')}
                </td>
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
          </div>
          <div class="items">
            <table>
              <thead>
                <tr>
                  <th class="text-left">項次</th>
                  <th class="text-left">商品名稱</th>
                  <th class="text-right">單價</th>
                  <th class="text-right">數量</th>
                  <th class="text-right">金額</th>
                </tr>
              </thead>
              <tbody>
                ${orderData.lineItems
                  .map((item, index) => {
                    return html`
                      <tr>
                        <td class="text-left">${index + 1}</td>
                        <td class="text-left">
                          ${item.title} ${item.spec.length > 0 ? `(${item.spec.join('/')})` : ''}
                        </td>
                        <td class="text-right">${item.sale_price.toLocaleString()}</td>
                        <td class="text-right">${item.count}</td>
                        <td class="text-right">$ ${(item.sale_price * parseInt(item.count, 10)).toLocaleString()}</td>
                      </tr>
                    `;
                  })
                  .join('')}
              </tbody>
            </table>
          </div>
          <div class="summary">
            <table>
              <tr>
                <td>小計：</td>
                <td>
                  $
                  ${(
                    orderData.total +
                    orderData.discount -
                    orderData.shipment_fee +
                    orderData.use_rebate
                  ).toLocaleString()}
                </td>
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
        </div>
      `;
    };

    return dataArray
      .map(data => {
        try {
          return section(data);
        } catch (e) {
          const text = `訂單 #${data.cart_token} 列印出貨發生錯誤`;
          console.error(`${text}: ${e}`);
          return text;
        }
      })
      .join('');
  }

  // 付款方式
  static getPaymentMethodText(orderData: OrderData) {
    const paymentMethods: Record<string, string> = {
      POS: '門市POS付款',
      off_line: '線下付款',
      newWebPay: '藍新金流',
      ecPay: '綠界金流',
      line_pay: 'Line Pay',
      atm: '銀行轉帳',
      line: 'Line 轉帳',
      cash_on_delivery: '貨到付款',
    };

    return orderData.orderSource === 'POS'
      ? paymentMethods['POS']
      : paymentMethods[orderData.customer_info.payment_select] || '線下付款';
  }

  // 配送方式
  static getShippingMethodText(orderData: OrderData) {
    const shippingMethods: Record<string, string> = {
      UNIMARTC2C: '7-11店到店',
      FAMIC2C: '全家店到店',
      OKMARTC2C: 'OK店到店',
      HILIFEC2C: '萊爾富店到店',
    };

    return shippingMethods[orderData.user_info.shipment] || '宅配';
  }

  // 付款狀態
  static paymentStatus(cart: CartData) {
    const statusMessages: Record<string, string> = {
      '0': cart.orderData.proof_purchase ? '待核款' : '未付款',
      '1': '已付款',
      '-2': '已退款',
    };

    return statusMessages[`${cart.status}`] || '付款失敗';
  }
}
