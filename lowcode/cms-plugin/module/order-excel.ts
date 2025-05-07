import { GVC } from '../../glitterBundle/GVController.js';
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

type Range = 'search' | 'checked' | 'all';

export class OrderExcel {
  // 範例檔資料 (出貨單)
  static importShipmentExample = [
    {
      訂單編號: '1241770010001',
      出貨單號碼: '1249900602345',
    },
  ];

  // 範例檔資料 (對帳單)
  static importReconciliation = [
    {
      訂單編號: '1241770010001',
      操作選項: '入帳',
      '入帳/沖帳日期': '2025-01-01',
      '入帳/沖帳金額': '2000',
      沖帳原因: '',
      沖帳備註: '',
    },
    {
      訂單編號: '1241770010002',
      操作選項: '沖帳',
      '入帳/沖帳日期': '2025-01-02',
      '入帳/沖帳金額': '-1000',
      沖帳原因: '支付金額異常',
      沖帳備註: '於玉山銀行進行查帳只有收到',
    },
  ];

  // 匯出可選欄位
  static headerColumn = async () => {
    const customizeMap = await this.getCustomizeMap();

    return {
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
      對帳資訊: ['對帳狀態', '入帳金額', '入帳日期', '應沖金額', '沖帳原因'],
      客製化資訊: [...customizeMap.keys()],
    };
  };

  // 選項元素
  static async optionsView(gvc: GVC, callback: (dataArray: string[]) => void) {
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
              divCreate: {
                class: (() => {
                  let maxLength = Math.max(...fields.map(field => field.length));
                  switch (true) {
                    case maxLength < 12:
                      return 'col-12 col-md-4 mb-3';
                    case maxLength >= 12 && maxLength < 20:
                      return 'col-12 col-md-6 mb-3';
                    case maxLength > 20:
                      return 'col-12 col-md-12 mb-3';
                  }
                })(),
              },
            });
          })
          .join('')}
      </div>
    `;

    const getColumn = await this.headerColumn();
    return checkboxContainer(getColumn);
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
      ShipmentConfig.shipmentMethod({
        type: 'all',
      }),
      PaymentConfig.getSupportPayment(true),
    ]);

    // 是否將訂單拆分商品欄位
    const getColumn = await this.headerColumn();
    const showLineItems = getColumn['商品'].some(a => column.includes(a));

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
    const getOrderJSON = (order: any, orderData: any) => {
      return formatJSON({
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
    };

    // 商品欄位物件
    const getProductJSON = (item: any) => {
      return formatJSON({
        商品名稱: item.title,
        商品規格: item.spec.length > 0 ? item.spec.join(' / ') : '單一規格',
        商品SKU: item.sku ?? '',
        商品購買數量: item.count,
        商品價格: item.sale_price,
        商品折扣: item.discount_price,
      });
    };

    // 顧客欄位物件
    const getUserJSON = (order: any, orderData: any) => {
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
        出貨單號碼: orderData.user_info.shipment_number ?? '',
        出貨單日期: formatDate(orderData.user_info.shipment_date),
        發票號碼: order.invoice_number ?? '',
        會員等級: order.user_data?.member_level?.tag_name ?? '',
        備註: orderData.user_info.note ?? '無備註',
      });
    };

    // 對帳欄位物件
    const getReconciliationJSON = (order: any) => {
      return formatJSON({
        對帳狀態: (() => {
          const received_c = (order.total_received ?? 0) + order.offset_amount;
          if (order.total_received === null || order.total_received === undefined) {
            return '待入帳';
          } else if (order.total_received === order.total) {
            return '已入帳';
          } else if (order.total_received > order.total && received_c === order.total) {
            return '已退款';
          } else if (order.total_received < order.total && received_c === order.total) {
            return '已沖帳';
          } else if (received_c < order.total) {
            return '待沖帳';
          } else if (received_c > order.total) {
            return '待退款';
          }
        })(),
        入帳金額: `$${((order.total_received || 0) + (order.offset_amount || 0)).toLocaleString()}`,
        入帳日期: order.reconciliation_date
          ? gvc.glitter.ut.dateFormat(new Date(order.reconciliation_date), 'yyyy-MM-dd')
          : '-',
        應沖金額: (() => {
          if (
            order.total_received === order.total ||
            order.total_received === null ||
            order.total_received === undefined
          ) {
            return '-';
          } else {
            return `$${order.orderData.total - (order.total_received + (order.offset_amount || 0))}`;
          }
        })(),
        沖帳原因: order.offset_reason ?? '-',
      });
    };

    // 客製化資訊
    const getCustomizeJSON = async (order: any) => {
      const customizeMap = await this.getCustomizeMap(order);
      const json = Object.fromEntries(customizeMap);

      return formatJSON(json);
    };

    // 匯出訂單 Excel
    async function exportOrdersToExcel(dataArray: any[]) {
      if (!dataArray.length) {
        dialog.errorMessage({ text: '無訂單資料可以匯出' });
        return;
      }

      const printArray = [];

      for (const order of dataArray) {
        const orderData = order.orderData;
        const customizeJSON = await getCustomizeJSON(order);

        if (showLineItems) {
          printArray.push(
            orderData.lineItems.map((item: any) => ({
              ...getOrderJSON(order, orderData),
              ...getProductJSON(item),
              ...getUserJSON(order, orderData),
              ...getReconciliationJSON(order),
              ...customizeJSON,
            }))
          );
        } else {
          printArray.push([
            {
              ...getOrderJSON(order, orderData),
              ...getUserJSON(order, orderData),
              ...getReconciliationJSON(order),
              ...customizeJSON,
            },
          ]);
        }
      }

      const printArrayFlat = printArray.flat();
      const worksheet = XLSX.utils.json_to_sheet(printArrayFlat);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, '訂單列表');

      const fileName = `訂單列表_${gvc.glitter.ut.dateFormat(new Date(), 'yyyyMMddhhmmss')}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    }

    // 透過 API, 取得訂單資料
    async function fetchOrders(limit: number) {
      dialog.dataLoading({ visible: true, text: '匯出資料中，請稍後...' });
      try {
        const response = await ApiShop.getOrder({
          ...apiJSON,
          page: 0,
          limit: limit,
        });

        if (response?.response?.total > 0) {
          const orders = response.response.data;
          await exportOrdersToExcel(orders).then(() => {
            dialog.dataLoading({ visible: false });
          });
        } else {
          dialog.dataLoading({ visible: false });
          dialog.errorMessage({ text: '匯出檔案發生錯誤' });
        }
      } catch (error) {
        console.error(error);
        dialog.dataLoading({ visible: false });
        dialog.errorMessage({ text: '無法取得訂單資料' });
      }
    }

    const limit = 1000;
    dialog.checkYesOrNot({
      text: `系統將會依條件匯出資料，最多匯出${limit}筆<br/>確定要匯出嗎？`,
      callback: bool => bool && fetchOrders(limit),
    });
  }

  // 取得客製化資訊
  static getCustomizeMap = async (order?: any) => {
    const [cashflowConfigObj, shipmentConfigObj, registerConfig, memberConfig ,receipt] = await OrderExcel.customizePromise();
    const customizeMap = new Map();

    const getUserValue = (key: string) => {
      try {
        return order.user_data.userData[key] || '-';
      } catch (error) {
        return '-';
      }
    };

    const getCashflowValue = (key: string) => {
      try {
        return order.orderData.user_info.custom_form_payment[key] || '-';
      } catch (error) {
        return '-';
      }
    };

    const getShipmentValue = (key: string) => {
      try {
        return order.orderData.user_info.custom_form_delivery[key] || '-';
      } catch (error) {
        return '-';
      }
    };

    (registerConfig || []).map((item: any) => {
      customizeMap.set(`註冊自訂值 - ${item.title}`, order ? getUserValue(item.key) : '-');
    });

    (memberConfig || []).map((item: any) => {
      customizeMap.set(`會員自訂值 - ${item.title}`, order ? getUserValue(item.key) : '-');
    });

    const cashflowConfig = order ? cashflowConfigObj[order.payment_method] : Object.values(cashflowConfigObj).flat();
    (cashflowConfig || []).map((item: any) => {
      customizeMap.set(`金流自訂值 - ${item.title}`, order ? getCashflowValue(item.key) : '-');
    });

    const shipmentConfig = order ? shipmentConfigObj[order.shipment_method] : Object.values(shipmentConfigObj).flat();
    (shipmentConfig || []).map((item: any) => {
      customizeMap.set(`物流自訂值 - ${item.title}`, order ? getShipmentValue(item.key) : '-');
    });

    let viewModel = [
      ['姓名', 'name'],
      ['電話', 'phone'],
      ['信箱', 'email'],
    ];
    receipt.list.map((d1: any) => {
      if (
        !viewModel.find(dd => {
          return dd[1] === d1.key;
        })
      ) {
        customizeMap.set(`收件人資訊 - ${d1.title}`, order ? (order.orderData.user_info[d1.key] ?? '-') : '-');
      }
    })
    return customizeMap;
  };

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
      const isReconciliation = apiJSON.is_reconciliation;

      if (isShipment && isArchived) return '已封存出貨單';
      if (isShipment) return '出貨單';
      if (isArchived && isPOS) return '已封存POS訂單';
      if (isArchived) return '已封存訂單';
      if (isPOS) return 'POS訂單';
      if (isReconciliation) return '對帳單';
      return '訂單';
    })();

    BgWidget.settingDialog({
      gvc,
      title: '匯出' + pageType,
      width: 700,
      innerHTML: gvc2 => {
        const id = gvc2.glitter.getUUID();

        return gvc2.bindView({
          bind: id,
          view: async () => {
            const view = await this.optionsView(gvc2, cols => {
              vm.column = cols;
            });

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
                匯出欄位
                ${BgWidget.grayNote('＊若勾選商品系列的欄位，將會以訂單商品作為資料列匯出 Excel', 'margin: 4px;')}
              </div>
              ${view}
            </div>`;
          },
        });
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
                  searchType: 'id',
                },
                all: {
                  is_reconciliation: apiJSON.is_reconciliation,
                  is_shipment: apiJSON.is_shipment,
                  archived: apiJSON.archived,
                  is_pos: apiJSON.is_pos,
                },
              };

              this.export(gvc, dataMap[vm.select], vm.column);
            }),
            '匯出'
          ),
        ].join('');
      },
    });
  }

  // 匯入方法 (出貨單)
  static async importWithShipment(gvc: GVC, target: HTMLInputElement, callback: () => void) {
    const dialog = new ShareDialog(gvc.glitter);

    function errorMsg(text: string) {
      dialog.dataLoading({ visible: false });
      dialog.errorMessage({ text: text });
    }

    if (target.files?.length) {
      try {
        dialog.dataLoading({ visible: true, text: '上傳檔案中' });
        const jsonData = await Excel.parseExcelToJson(gvc, target.files[0]);

        // 判斷是否有不成對的訂單編號與出貨單號碼
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

        // 取得訂單資料
        const getOrders = await ApiShop.getOrder({
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

        // 判斷匯入資料是否有不存在的訂單
        const orderMap = new Map(orders.map((order: any) => [order.cart_token, true]));
        const importKey = cartTokens.find(key => !orderMap.has(key));
        if (importKey) {
          errorMsg(`訂單編號 #${importKey} 不存在`);
          return;
        }

        // 判斷匯入資料是否可更新出貨單號碼
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
          } catch (error) {
            errorMsg('訂單資料有誤');
          }
        }

        // 更新事件與紀錄
        const saveEvent = (order: any, setShipping: boolean) => {
          const orderData = order.orderData;

          if (setShipping) {
            orderData.progress = 'shipping';
          }

          return ApiShop.putOrder({ id: `${order.id}`, order_data: orderData });
        };

        dialog.dataLoading({ visible: false });

        dialog.checkYesOrNot({
          text: '匯入的出貨單資料，是否要將出貨狀態改成「已出貨」？',
          yesString: '是',
          notString: '否',
          callback: async (bool: boolean) => {
            try {
              dialog.dataLoading({ visible: true });

              // 批次更新訂單
              const responses = await Promise.all(
                orders.map((order: any) => {
                  return saveEvent(order, bool);
                }) as { result: boolean; response: any }[]
              );

              const failedResponse = responses.find(res => !res.result);

              dialog.dataLoading({ visible: false });

              if (failedResponse) {
                console.error('匯入失敗:', failedResponse);
                dialog.errorMessage({ text: '匯入失敗' });
              } else {
                dialog.successMessage({ text: '匯入成功' });
                setTimeout(() => callback(), 300);
              }
            } catch (error) {
              dialog.dataLoading({ visible: false });
              console.error('批次出貨更新錯誤:', error);
              dialog.errorMessage({ text: '系統錯誤，請稍後再試' });
            }
          },
        });
      } catch (error) {
        console.error('Order Excel 解析失敗', error);
      }
    }
  }

  // 匯入方法 (對帳單)
  static async importWithReconciliation(gvc: GVC, target: HTMLInputElement, callback: () => void) {
    const dialog = new ShareDialog(gvc.glitter);

    function errorMsg(text: string) {
      dialog.dataLoading({ visible: false });
      dialog.errorMessage({ text: text });
    }

    if (target.files?.length) {
      try {
        dialog.dataLoading({ visible: true, text: '上傳檔案中' });
        const jsonData = await Excel.parseExcelToJson(gvc, target.files[0]);

        // 判斷是否有不成對的訂單編號與出貨單號碼
        const importMap = new Map();
        for (let i = 0; i < jsonData.length; i++) {
          const order = jsonData[i];
          if (!order['訂單編號'] || !order['操作選項'] || !order['入帳/沖帳日期'] || !order['入帳/沖帳金額']) {
            !order['訂單編號'] && errorMsg('請輸入訂單編號');
            !order['操作選項'] && errorMsg('請輸入操作選項');
            !order['入帳/沖帳日期'] && errorMsg('請輸入入帳/沖帳日期');
            !order['入帳/沖帳金額'] && errorMsg('請輸入入帳/沖帳金額');
            return;
          }
          importMap.set(`${order['訂單編號']}`, order);
        }
        const cartTokens = [...importMap.keys()];

        // 取得訂單資料
        const getOrders = await ApiShop.getOrder({
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

        // 判斷匯入資料是否有不存在的訂單
        const orderMap = new Map(orders.map((order: any) => [order.cart_token, true]));
        const importKey = cartTokens.find(key => !orderMap.has(key));
        if (importKey) {
          errorMsg(`訂單編號 #${importKey} 不存在`);
          return;
        }
        // 判斷匯入資料是否可更新對帳單
        for (const order of orders) {
          try {
            const compare = importMap.get(order.cart_token);

            if (compare['操作選項'] === '入帳' && order.reconciliation_date) {
              errorMsg(`已入帳訂單不可再次入帳<br/>（訂單編號: ${order.cart_token}）`);
              return;
            }
          } catch (error) {
            errorMsg('訂單資料有誤');
          }
        }
        const auth = await ApiUser.getPermission({
          page: 0,
          limit: 100,
        }).then(res => {
          return res.response.data.find((data: any) => {
            return `${data.user}` === `${GlobalUser.parseJWT(GlobalUser.saas_token).payload.userID}`;
          });
        });
        // 更新事件與紀錄
        const saveEvent = (order: any) => {
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
          } else {
            order.offset_records = order.offset_records ?? [];
            return ApiReconciliation.putReconciliation({
              order_id: order.cart_token,
              update: {
                offset_amount: order.offset_amount + money,
                offset_reason: compare['沖帳原因'],
                offset_records: JSON.stringify(
                  JSON.parse(JSON.stringify(order.offset_records)).concat([
                    {
                      offset_amount: money,
                      offset_reason: compare['沖帳原因'],
                      offset_date: new Date(compare['入帳/沖帳日期']).toISOString(),
                      offset_note: compare['沖帳備註'],
                      user: auth.config,
                    },
                  ])
                ),
              },
            });
          }
        };

        try {
          dialog.dataLoading({ visible: true });

          // 批次更新訂單
          const responses = await Promise.all(
            orders.map((order: any) => {
              return saveEvent(order);
            }) as { result: boolean; response: any }[]
          );

          const failedResponse = responses.find(res => !res.result);

          dialog.dataLoading({ visible: false });

          if (failedResponse) {
            console.error('匯入失敗:', failedResponse);
            dialog.errorMessage({ text: '匯入失敗' });
          } else {
            dialog.successMessage({ text: '匯入成功' });
            setTimeout(() => callback(), 300);
          }
        } catch (error) {
          dialog.dataLoading({ visible: false });
          console.error('批次更新錯誤:', error);
          dialog.errorMessage({ text: '系統錯誤，請稍後再試' });
        }
      } catch (error) {
        console.error('Order Excel 解析失敗', error);
      }
    }
  }

  // 匯入檔案彈出視窗
  static importDialog(gvc: GVC, query: any, callback: () => void) {
    const dialog = new ShareDialog(gvc.glitter);
    const vm = {
      id: 'importDialog',
      fileInput: {} as HTMLInputElement,
      type: '',
      orderTitle: (() => {
        if (query.isShipment) return '出貨單';
        if (query.isArchived) return '已封存訂單';
        if (query.is_reconciliation) return '對帳單';
        return '訂單';
      })(),
    };

    gvc.glitter.innerDialog((gvc: GVC) => {
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
                Excel.downloadExcel(
                  gvc,
                  (() => {
                    if (query.isShipment) return OrderExcel.importShipmentExample;
                    if (query.is_reconciliation) return OrderExcel.importReconciliation;
                    if (query.isArchived) return [];
                    return [];
                  })(),
                  `範例_${vm.orderTitle}列表_${gvc.glitter.ut.dateFormat(new Date(), 'yyyyMMddhhmmss')}.xlsx`,
                  `範例${vm.orderTitle}列表`
                );
              },
            },
            import: {
              event: () => {
                // 出貨單匯入事件
                if (query.isShipment) {
                  return this.importWithShipment(gvc, vm.fileInput, () => {
                    gvc.glitter.closeDiaLog();
                    callback();
                  });
                }
                //對帳單匯入事件
                if (query.is_reconciliation) {
                  return this.importWithReconciliation(gvc, vm.fileInput, () => {
                    gvc.glitter.closeDiaLog();
                    callback();
                  });
                }
                // 封存訂單匯入事件
                if (query.isArchived) {
                }
                // 訂單匯入事件
                // ...
              },
            },
          };

          return html`
            <div
              class="d-flex align-items-center w-100 tx_700"
              style="padding: 12px 0 12px 20px; align-items: center; border-radius: 10px 10px 0px 0px; background: #F2F2F2;"
            >
              ${viewData.title}
            </div>
            ${viewData.category.options.length > 0
              ? html`<div class="d-flex flex-column align-items-start gap-2" style="padding: 20px 20px 0px;">
                  <div class="tx_700">${viewData.category.title}</div>
                  ${BgWidget.multiCheckboxContainer(
                    gvc,
                    viewData.category.options,
                    [vm.type],
                    res => {
                      vm.type = res[0];
                    },
                    { single: true }
                  )}
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
                    return html`
                      ${BgWidget.customButton({
                        button: { color: 'snow', size: 'md' },
                        text: { name: '更換檔案' },
                        event: gvc.event(() => {
                          (document.querySelector('#upload-excel') as HTMLInputElement)!.click();
                        }),
                      })}
                      ${BgWidget.grayNote(vm.fileInput.files[0].name)}
                    `;
                  } else {
                    return BgWidget.customButton({
                      button: { color: 'snow', size: 'md' },
                      text: { name: '新增檔案' },
                      event: gvc.event(() => {
                        (document.querySelector('#upload-excel') as HTMLInputElement)!.click();
                      }),
                    });
                  }
                })()}
              </div>
            </div>
            <div class="d-flex justify-content-end gap-3" style="padding-right: 20px; padding-bottom: 20px;">
              ${BgWidget.cancel(
                gvc.event(() => {
                  gvc.glitter.closeDiaLog();
                })
              )}
              ${BgWidget.save(
                gvc.event(() => {
                  if (vm.fileInput.files && vm.fileInput.files.length > 0) {
                    viewData.import.event();
                  } else {
                    dialog.infoMessage({ text: '尚未上傳檔案' });
                  }
                }),
                '匯入'
              )}
            </div>
          `;
        },
        divCreate: {
          style: 'border-radius: 10px; background: #FFF; width: 570px; min-height: 360px; max-width: 90%;',
        },
      });
    }, vm.id);
  }

  static async customizePromise() {
    const saasConfig: { config: any; api: any } = (window.parent as any).saasConfig;

    const dataArray = await Promise.all([
      // 自訂金流
      await saasConfig.api.getPrivateConfig(saasConfig.config.appName, 'glitter_finance').then((data: any) => {
        const cashflowObject: any = {};

        data.response.result[0].value.payment_info_custom.map((item: any) => {
          ApiUser.getPublicConfig(`form_finance_${item.id}`, 'manager').then(r => {
            cashflowObject[item.id] = r.response.value.list;
          });
        });

        return cashflowObject;
      }),
      // 自訂物流
      await saasConfig.api.getPrivateConfig(saasConfig.config.appName, 'logistics_setting').then((data: any) => {
        const shipmentObject: any = {};

        data.response.result[0].value.custom_delivery.map((item: any) => {
          ApiUser.getPublicConfig(`form_delivery_${item.id}`, 'manager').then(r => {
            if (r.response.value.list.length > 0) {
              shipmentObject[item.id] = r.response.value.list;
            }
          });
        });

        return shipmentObject;
      }),
      // 註冊資料
      await ApiUser.getPublicConfig('custom_form_register', 'manager').then(r => {
        return Array.isArray(r.response.value.list) ? r.response.value.list : [];
      }),
      // 會員資料
      await ApiUser.getPublicConfig('customer_form_user_setting', 'manager').then(r => {
        return Array.isArray(r.response.value.list) ? r.response.value.list : [];
      }),
      //收件人資料
      (
        await ApiUser.getPublicConfig(
          'custom_form_checkout_recipient',
          'manager'
        )
      ).response.value
    ]);

    return dataArray;
  }
}
