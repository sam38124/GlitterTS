import { GVC } from '../../glitterBundle/GVController.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { ShipmentConfig } from '../../glitter-base/global/shipment-config.js';
import { PaymentConfig } from '../../glitter-base/global/payment-config.js';
import { BgWidget } from '../../backend-manager/bg-widget.js';
import { Tool } from '../../modules/tool.js';
import { Excel } from './excel.js';

const html = String.raw;

type Range = 'search' | 'checked' | 'all';

export class OrderExcel {
  // 匯出可選欄位
  static headerColumn = {
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

  // 選項元素
  static optionsView(gvc: GVC, callback: (dataArray: string[]) => void) {
    let columnList = new Set<string>();
    const randomString = BgWidget.getCheckedClass(gvc);

    const checkbox = (checked: boolean, name: string, toggle: () => void) => html`
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

    const checkboxContainer = (items: Record<string, string[]>) => html`
      <div class="row w-100">
        ${Object.entries(items)
          .map(([category, fields]) => {
            const bindId = Tool.randomString(5);

            return gvc.bindView({
              bind: bindId,
              view: () => {
                const allChecked = fields.every(item => columnList.has(item));

                return html`
                  ${checkbox(allChecked, category, () => {
                    if (allChecked) {
                      fields.forEach(item => columnList.delete(item));
                    } else {
                      fields.forEach(item => columnList.add(item));
                    }
                    callback(Array.from(columnList));
                    gvc.notifyDataChange(bindId);
                  })}
                  <div class="d-flex position-relative my-2">
                    ${BgWidget.leftLineBar()}
                    <div class="ms-4 w-100 flex-fill">
                      ${fields
                        .map(item =>
                          checkbox(columnList.has(item), item, () => {
                            columnList.has(item) ? columnList.delete(item) : columnList.add(item);
                            callback(Array.from(columnList));
                            gvc.notifyDataChange(bindId);
                          })
                        )
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

  // 匯出方法
  static async export(gvc: GVC, apiJSON: any, column: string[]) {
    const dialog = new ShareDialog(gvc.glitter);

    if (column.length === 0) {
      dialog.infoMessage({ text: '請至少勾選一個匯出欄位' });
      return;
    }

    const XLSX = await Excel.loadXLSX(gvc);

    // 取得琣送與付款方式設定檔
    const [shipment_methods, payment_methods] = await Promise.all([
      ShipmentConfig.allShipmentMethod(),
      PaymentConfig.getSupportPayment(true),
    ]);

    // 是否將訂單拆分商品欄位
    const showLineItems = this.headerColumn['商品'].some(a => column.includes(a));

    // 格式化資料時間
    const formatDate = (date?: string | number) =>
      date ? gvc.glitter.ut.dateFormat(new Date(date), 'yyyy-MM-dd hh:mm') : '';

    // 建立物件並快速搜尋值或回傳預設值
    const getStatusLabel = (
      status: string | number | undefined,
      mapping: Record<string, string>,
      defaultLabel = '未知'
    ) => mapping[status?.toString() ?? ''] ?? defaultLabel;

    // 配送或付款回傳值
    const findMethodName = (key: string | undefined, methods: { key: string; name: string }[]) =>
      methods.find(m => m.key === key)?.name ?? '未知';

    // 處理 JSON, 判斷欄位是否顯示
    const formatJSON = (obj: Record<string, any>) =>
      Object.fromEntries(Object.entries(obj).filter(([key]) => column.includes(key)));

    // 訂單欄位物件
    const getOrderJSON = (order: any, orderData: any) =>
      formatJSON({
        訂單編號: order.cart_token,
        訂單來源: orderData.orderSource === 'POS' ? 'POS' : '手動',
        訂單建立時間: formatDate(order.created_time),
        會員信箱: order.email ?? 'no-email',
        訂單處理狀態: getStatusLabel(orderData.orderStatus, { '-1': '已取消', '1': '已完成', '0': '處理中' }, '處理中'),
        付款狀態: getStatusLabel(
          order.status,
          { '1': '已付款', '-1': '付款失敗', '-2': '已退款', '0': '未付款' },
          '未付款'
        ),
        出貨狀態: getStatusLabel(
          orderData.progress,
          {
            pre_order: '待預購',
            shipping: '已出貨',
            finish: '已取貨',
            arrived: '已送達',
            returns: '已退貨',
            wait: orderData.user_info.shipment_number ? '備貨中' : '未出貨',
          },
          '未出貨'
        ),
        訂單小計: orderData.total + orderData.discount - orderData.shipment_fee + orderData.use_rebate,
        訂單運費: orderData.shipment_fee,
        訂單使用優惠券: orderData.voucherList?.map((v: any) => v.title).join(', ') || '無',
        訂單折扣: orderData.discount,
        訂單使用購物金: orderData.use_rebate,
        訂單總計: orderData.total,
        分銷連結代碼: orderData.distribution_info?.code ?? '',
        分銷連結名稱: orderData.distribution_info?.title ?? '',
      });

    // 顧客欄位物件
    const getUserJSON = (order: any, orderData: any) =>
      formatJSON({
        顧客姓名: orderData.customer_info.name,
        顧客手機: orderData.customer_info.phone,
        顧客信箱: orderData.customer_info.email,
        收件人姓名: orderData.user_info.name,
        收件人手機: orderData.user_info.phone,
        收件人信箱: orderData.user_info.email,
        付款方式: findMethodName(orderData.customer_info.payment_select, payment_methods),
        配送方式: findMethodName(orderData.user_info.shipment, shipment_methods),
        出貨單號碼: orderData.user_info.shipment_number ?? '',
        出貨單日期: formatDate(orderData.user_info.shipment_date),
        發票號碼: order.invoice_number ?? '',
        會員等級: order.user_data?.member_level?.tag_name ?? '',
        備註: orderData.user_info.note ?? '無備註',
      });

    // 商品欄位物件
    const getProductJSON = (item: any) =>
      formatJSON({
        商品名稱: item.title,
        商品規格: item.spec.length > 0 ? item.spec.join(' / ') : '單一規格',
        商品SKU: item.sku ?? '',
        商品購買數量: item.count,
        商品價格: item.sale_price,
        商品折扣: item.discount_price,
      });

    // 匯出訂單 Excel
    function exportOrdersToExcel(dataArray: any[]) {
      if (!dataArray.length) {
        dialog.errorMessage({ text: '無訂單資料可以匯出' });
        return;
      }

      const printArray = dataArray.flatMap(order => {
        const orderData = order.orderData;
        return showLineItems
          ? orderData.lineItems.map((item: any) => ({
              ...getOrderJSON(order, orderData),
              ...getProductJSON(item),
              ...getUserJSON(order, orderData),
            }))
          : [{ ...getOrderJSON(order, orderData), ...getUserJSON(order, orderData) }];
      });

      const worksheet = XLSX.utils.json_to_sheet(printArray);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, '訂單列表');

      const fileName = `訂單列表_${gvc.glitter.ut.dateFormat(new Date(), 'yyyyMMddhhmmss')}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    }

    // 透過 API, 取得訂單資料
    async function fetchOrders(limit: number) {
      dialog.dataLoading({ visible: true });
      try {
        const response = await ApiShop.getOrder({
          ...apiJSON,
          page: 0,
          limit: limit,
        });
        dialog.dataLoading({ visible: false });

        if (response?.response?.total > 0) {
          exportOrdersToExcel(response.response.data);
        } else {
          dialog.errorMessage({ text: '匯出檔案發生錯誤' });
        }
      } catch (error) {
        dialog.dataLoading({ visible: false });
        dialog.errorMessage({ text: '無法取得訂單資料' });
      }
    }

    const limit = 250;
    dialog.checkYesOrNot({
      text: `系統將會依條件匯出資料，最多匯出${limit}筆<br/>確定要匯出嗎？`,
      callback: bool => bool && fetchOrders(limit),
    });
  }

  // 匯出檔案彈出視窗
  static exportDialog(gvc: GVC, apiJSON: any, dataArray: any[]) {
    const vm = {
      select: 'all' as Range,
      column: [] as string[],
    };

    const pageType = (() => {
      const isArchived = apiJSON.archived === 'true';
      const isShipment = apiJSON.is_shipment;
      const isPOS = apiJSON.is_pos;

      if (isShipment && isArchived) return '已封存出貨單';
      if (isShipment) return '出貨單';
      if (isArchived && isPOS) return '已封存POS訂單';
      if (isArchived) return '已封存訂單';
      if (isPOS) return 'POS訂單';
      return '訂單';
    })();

    BgWidget.settingDialog({
      gvc,
      title: '匯出訂單',
      width: 700,
      innerHTML: gvc2 => {
        return html`<div class="d-flex flex-column align-items-start gap-2">
          <div class="tx_700 mb-2">匯出範圍</div>
          ${BgWidget.multiCheckboxContainer(
            gvc2,
            [
              { key: 'all', name: `全部${pageType}` },
              { key: 'search', name: '目前搜尋與篩選的結果' },
              { key: 'checked', name: `勾選的 ${dataArray.length} 個訂單` },
            ],
            [vm.select],
            (res: any) => {
              vm.select = res[0];
            },
            { single: true }
          )}
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
          BgWidget.cancel(
            gvc2.event(() => {
              gvc2.glitter.closeDiaLog();
            })
          ),
          BgWidget.save(
            gvc2.event(() => {
              const dialog = new ShareDialog(gvc.glitter);
              if (vm.select === 'checked' && dataArray.length === 0) {
                dialog.infoMessage({ text: '請勾選至少一個以上的訂單' });
                return;
              }

              const dataMap: Record<Range, any> = {
                search: apiJSON,
                checked: {
                  ...apiJSON,
                  id_list: dataArray.map(data => data.id).join(','),
                },
                all: {},
              };

              this.export(gvc, dataMap[vm.select], vm.column);
            }),
            '匯出'
          ),
        ].join('');
      },
    });
  }
}
