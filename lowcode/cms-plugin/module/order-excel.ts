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
  // 範例檔資料 (出貨單)
  static importShipmentExample = [
    {
      訂單編號: '1241770010001',
      出貨單號碼: '1249900602345',
    },
  ];

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
      '收貨地址',
      '代收金額',
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

          orderData.editRecord = [...(orderData.editRecord ?? []), ...temps];
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
                <div class="tx_700">透過XLSX檔案匯入商品</div>
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
}
