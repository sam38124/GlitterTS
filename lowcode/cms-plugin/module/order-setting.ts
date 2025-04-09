import { GVC } from '../../glitterBundle/GVController.js';
import { BgWidget, OptionsItem } from '../../backend-manager/bg-widget.js';
import { ApiUser } from '../../glitter-base/route/user.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { Tool } from '../../modules/tool.js';
import { CartData, LineItem, OrderData, OrderDetail } from './data.js';

const html = String.raw;

type TitleItem = {
  title: string;
  width: string;
};

type CombineStatus = 'normal' | 'success' | 'error';

type CombineData = {
  status: CombineStatus;
  note: string;
  targetID: string;
  orders: CartData[];
};

type DataMap = Record<string, CombineData>;

type DashboardData = {
  title: string;
  count: number;
  countStyle: CombineStatus;
  unit: string;
};

export class OrderSetting {
  // 付款名稱
  static getPaymentMethodText(orderData: OrderData) {
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

  // 配送名稱
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

  // 配送地址
  static getShippingAddress(orderData: OrderData) {
    const shipment = orderData.user_info.shipment;
    if (['UNIMARTC2C', 'FAMIC2C', 'OKMARTC2C', 'HILIFEC2C'].includes(shipment)) {
      return `${orderData.user_info.CVSStoreName} (${orderData.user_info.CVSAddress})`;
    }
    if (shipment === 'shop') {
      return '實體門市';
    }
    return orderData.user_info.address;
  }

  // 付款方式 Select Options
  static getPaymentStatusOpt() {
    return [
      { title: '已付款', value: '1' },
      { title: '部分付款', value: '3' },
      { title: '待核款 / 貨到付款 / 未付款', value: '0' },
      { title: '已退款', value: '-2' },
    ].map(item => {
      return {
        key: item.value,
        value: item.title,
      };
    });
  }

  // 配送方式 Select Options
  static getShippmentOpt() {
    return [
      { title: '已出貨', value: 'shipping' },
      { title: '未出貨 / 備貨中', value: 'wait' },
      { title: '已取貨', value: 'finish' },
      { title: '已退貨', value: 'returns' },
      { title: '已到貨', value: 'arrived' },
    ].map(item => {
      return {
        key: item.value,
        value: item.title,
      };
    });
  }

  // 訂單狀態 Select Options
  static getOrderStatusOpt() {
    return ApiShop.getOrderStatusArray().map(item => {
      return {
        key: item.value,
        value: item.title,
      };
    });
  }

  // 所有狀態 Badge
  static getAllStatusBadge(orderData: CartData) {
    const paymentBadges: Record<string, string> = {
      '0': orderData.orderData.proof_purchase ? BgWidget.warningInsignia('待核款') : BgWidget.notifyInsignia('未付款'),
      '1': BgWidget.infoInsignia('已付款'),
      '3': BgWidget.warningInsignia('部分付款'),
      '-2': BgWidget.notifyInsignia('已退款'),
    };

    const outShipBadges: Record<string, string> = {
      finish: BgWidget.infoInsignia('已取貨'),
      shipping: BgWidget.warningInsignia('已出貨'),
      arrived: BgWidget.warningInsignia('已送達'),
      wait: BgWidget.notifyInsignia('未出貨'),
      pre_order: BgWidget.notifyInsignia('待預購'),
      returns: BgWidget.notifyInsignia('已退貨'),
    };

    const orderStatusBadges: Record<string, string> = {
      '1': BgWidget.infoInsignia('已完成'),
      '0': BgWidget.warningInsignia('處理中'),
    };

    orderData.orderData.orderStatus = orderData.orderData.orderStatus ?? '0';
    return {
      paymentBadge: () => paymentBadges[`${orderData.status}`] || BgWidget.notifyInsignia('付款失敗'),
      outShipBadge: () => outShipBadges[orderData.orderData.progress ?? 'wait'] || BgWidget.notifyInsignia('未知狀態'),
      orderStatusBadge: () =>
        orderStatusBadges[`${orderData.orderData.orderStatus}`] || BgWidget.notifyInsignia('已取消'),
      archivedBadge: () => (orderData.orderData.archived === 'true' ? BgWidget.secondaryInsignia('已封存') : ''),
    };
  }

  // 分倉出貨
  static showEditShip(obj: { gvc: GVC; postMD: any; productData: any; callback?: () => void }) {
    let stockList: any = [];
    let loading = true;
    let productLoading = false;
    let postMD = obj.postMD;
    let productData: any = obj.productData;
    let topGVC = (window.parent as any).glitter.pageConfig[(window.parent as any).glitter.pageConfig.length - 1].gvc;

    topGVC.glitter.innerDialog((gvc: GVC) => {
      function getStockStore() {
        if (stockList.length == 0) {
          ApiUser.getPublicConfig('store_manager', 'manager').then((storeData: any) => {
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
          } else {
            dialog.dataLoading({ visible: false });
          }
          if (!productLoading) {
            postMD.map((dd: any) => {
              const product = productData.find((product: any) => product.id == dd.id);
              if (product) {
                const variant = product.content.variants.find((variant: any) => {
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

          return html`
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
                    let titleArray: TitleItem[] = [
                      {
                        title: '下單數量',
                        width: `${elementLength}px`,
                      },
                      {
                        title: '庫存',
                        width: `${elementLength}px`,
                      },
                    ];

                    function insertSubStocks(titleArray: TitleItem[], subStocks: string[]): TitleItem[] {
                      const targetIndex = titleArray.findIndex(item => item.title === '庫存');
                      if (targetIndex !== -1) {
                        // 格式化細分庫存
                        const formattedSubStocks: TitleItem[] = subStocks.map(stockTitle => ({
                          title: stockTitle,
                          width: titleArray[targetIndex].width, // 使用原"庫存"的寬度
                        }));

                        // 替換 "庫存" 為細分庫存
                        titleArray.splice(targetIndex, 1, ...formattedSubStocks);
                      }
                      return titleArray;
                    }

                    titleArray = insertSubStocks(
                      titleArray,
                      stockList.flatMap((item: any) => {
                        return [
                          html` <div class="d-flex flex-column" style="text-align: center;gap:5px;">
                            ${item.name}${BgWidget.warningInsignia('庫存數量')}
                          </div>`,
                          html` <div class="d-flex flex-column" style="text-align: center;gap:5px;">
                            ${item.name}<br />${BgWidget.infoInsignia('出貨數量')}
                          </div>`,
                        ];
                      })
                    );
                    return titleArray
                      .map(title => {
                        return html`
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
                          .map((item: any) => {
                            if (!item.deduction_log || Object.keys(item.deduction_log).length === 0) {
                              return ``;
                            }
                            return html`
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
                                  .flatMap((stock: any) => {
                                    if (!item.deduction_log) {
                                      return ``;
                                    }
                                    const limit = item.stockList?.[stock.id]?.count ?? 0;

                                    return [
                                      html` <div
                                        class="d-flex align-items-center justify-content-end flex-shrink-0"
                                        style="width: ${elementLength}px;gap: 12px;"
                                      >
                                        ${parseInt(limit)}
                                      </div>`,
                                      html` <div
                                        class="d-flex align-items-center justify-content-end flex-shrink-0"
                                        style="width: ${elementLength}px;gap: 12px"
                                      >
                                        <input
                                          class="w-100"
                                          style="border-radius: 10px;border: 1px solid #DDD;background: #FFF;text-align: center;padding:0 18px;height:40px;"
                                          max="${limit + (item.deduction_log[stock.id] ?? 0)}"
                                          min="0"
                                          value="${item.deduction_log[stock.id] ?? 0}"
                                          type="number"
                                          onchange="${gvc.event((e: any) => {
                                            const originalDeduction = item.deduction_log[stock.id] ?? 0;
                                            item.deduction_log[stock.id] = 0;

                                            /// 明確指定 item.deduction_log 的型別為 Record<string, number>
                                            const totalDeducted = Object.values(
                                              item.deduction_log as Record<string, number>
                                            ).reduce((total, deduction) => total + deduction, 0);
                                            const remainingStock = item.count - totalDeducted;

                                            // 限制輸入值不超過剩餘庫存
                                            const newDeduction = Math.min(parseInt(e.value), remainingStock);

                                            // 更新扣除紀錄
                                            item.deduction_log[stock.id] = newDeduction;

                                            // 如果有變更，更新庫存數量
                                            if (originalDeduction !== newDeduction) {
                                              const stockDiff = newDeduction - originalDeduction;
                                              item.stockList[stock.id]!.count -= stockDiff;
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
                          .filter((item: string) => {
                            return item;
                          })
                          .map((dd: any, index: number) => {
                            return `<div class="${index ? `border-top pt-2` : ` pb-2`}">${dd}</div>`;
                          })
                          .join(``);
                      } catch (e) {
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
                ${BgWidget.cancel(
                  gvc.event(() => {
                    postMD = origData;
                    topGVC.glitter.closeDiaLog();
                  })
                )}
                ${BgWidget.save(
                  gvc.event(() => {
                    const errorProducts: string[] = [];
                    const hasError = postMD.some((product: any) => {
                      if (!product.deduction_log) {
                        return false;
                      }
                      const totalDeduction = Object.values(product.deduction_log as Record<string, number>).reduce(
                        (sum, value) => sum + value,
                        0
                      );

                      if (Object.keys(product.deduction_log).length && totalDeduction !== product.count) {
                        errorProducts.push(`${product.title} - ${product.spec.join(',')}`);
                        return true; // 偵測到錯誤
                      }
                      return false;
                    });

                    if (hasError) {
                      dialog.errorMessage({
                        text: html` <div class="d-flex flex-column">出貨數量異常</div>`,
                      });
                    } else {
                      topGVC.glitter.closeDiaLog();
                      obj.callback?.(); // 簡化 callback 呼叫
                    }
                  })
                )}
              </div>
            </div>
          `;
        },
        divCreate: {
          class: `d-flex align-items-center justify-content-center`,
          style: `width: 100vw; height: 100vh;`,
        },
        onCreate: () => {},
      });
    }, 'batchEdit');
  }

  // 合併訂單
  static combineOrders(topGVC: GVC, dataArray: CartData[], callback: () => void) {
    const parentPageConfig = (window.parent as any)?.glitter?.pageConfig;
    const latestPageConfig = parentPageConfig?.[parentPageConfig.length - 1];
    const ogvc = latestPageConfig?.gvc || topGVC;
    const glitter = ogvc.glitter;
    const dialog = new ShareDialog(glitter);
    const isDesktop = document.body.clientWidth > 768;

    const vm = {
      dataObject: {} as DataMap, // 調用合併訂單資料
      originDataObject: {} as DataMap, // 原始合併訂單資料
      prefix: 'combine-orders',
    };

    const ids = {
      show: '',
      page: glitter.getUUID(),
      header: glitter.getUUID(),
      dashboard: glitter.getUUID(),
      orderlist: glitter.getUUID(),
    };

    const gClass = (name: string) => `${vm.prefix}-${name}`;

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

    const statusDataLength = (dataMap: DataMap, status: CombineStatus) => {
      return Object.values(dataMap).filter(item => item.status === status).length;
    };

    const renderHeader = (gvc: GVC) =>
      gvc.bindView({
        bind: ids.header,
        view: () =>
          html` <div class="${gClass('back-btn')}" onclick="${gvc.event(closeDialog)}">
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
          callback: () => {},
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

    const renderFooter = (gvc: GVC) => html`
      <div class="${gClass('footer')}">
        ${BgWidget.cancel(gvc.event(closeDialog))} ${BgWidget.save(gvc.event(handleSave), '合併')}
      </div>
    `;

    const renderContent = (gvc: GVC) => {
      // mainCard 手機版專用
      const phoneCardStyle = isDesktop
        ? ''
        : 'border-radius: 10px; padding: 12px; background: #fff; box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.08);';

      // 字體顏色
      const fontColor = {
        success: '#10931D',
        error: '#DA1313',
        normal: '#393939',
      };

      // 合併須知
      const hits = [
        '原訂單將被取消並封存，且所有訂單將合併為一筆新訂單',
        '合併後的訂單小計和折扣將依據當前的計算方式計算',
        '系統不會重複計算購物金和點數',
      ];

      // 儀表板資料處理
      const getDashboardData: () => DashboardData[] = () => {
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

      // 儀表板項目
      const dashboardItemHTML = (item: DashboardData) => {
        return BgWidget.mainCard(html`
          <div style="${phoneCardStyle}">
            <div class="${gClass('dashboard-gray')}">${item.title}</div>
            <div class="d-flex align-items-end gap-1">
              <span class="tx_700" style="font-size: 24px; color: ${fontColor[item.countStyle]}">${item.count}</span>
              <span class="tx_normal" style="margin-bottom: 0.35rem">${item.unit}</span>
            </div>
          </div>
        `);
      };

      // 訂購人合併訂單列表
      const editOrdersHTML = (key: string, editID: string) => {
        const dataMap = vm.dataObject;
        const data = dataMap[key];
        const orders = data.orders;
        const userInfo = orders[0].orderData.user_info;

        // bar: 訂單數量與開關
        const orderToggle = (isExpanded: boolean) => {
          return html`${orders.length} 筆訂單 <i class="fa-solid fa-angle-${isExpanded ? 'up' : 'down'} ms-1"></i>`;
        };

        // bar: 顧客資訊
        const userView = () => {
          return html` <span class="tx_700">${userInfo.name}</span>
            <span>(${key})</span>`;
        };

        // bar: 狀態徽章
        const combineBadge = () => {
          const resultMap = {
            normal: BgWidget.secondaryInsignia('待確認'),
            error: BgWidget.dangerInsignia('不可合併'),
            success: BgWidget.successInsignia('可以合併'),
          };
          return resultMap[data.status];
        };

        // bar: 狀態提示
        const alertText = () => {
          return html` <div style="color: ${fontColor[data.status]}; white-space: break-spaces;">${data.note}</div>`;
        };

        // bar: 確認資訊按鈕
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
                  return html`
                    <div class="${gClass('check-info-box')}">
                      ${BgWidget.grayNote(
                        '請與顧客確認合併訂單的付款、配送方式及地址<br />應與下列哪筆訂單相同，避免爭議'
                      )}
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
                              return html` <div
                                class="tx_700"
                                style="width: ${styles[i].width}%; text-align: ${styles[i].align};"
                              >
                                ${item.title}
                              </div>`;
                            })
                            .join('')}
                        </div>
                        <div class="d-flex flex-column gap-0 mt-3">
                          ${orders
                            .map(order => {
                              const orderData = order.orderData;
                              const vt = this.getAllStatusBadge(order);
                              const row = [
                                {
                                  title: html`
                                    <div class="d-flex gap-2">
                                      ${gvc.bindView({
                                        bind: `r-${order.cart_token}`,
                                        view: () => {
                                          return html`<input
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
                                { title: this.getPaymentMethodText(orderData) },
                                { title: this.getShippingMethodText(orderData) },
                                { title: this.getShippingAddress(orderData) },
                              ]
                                .map((item, i) => {
                                  return html` <div
                                    class="tx_normal"
                                    style="width: ${styles[i].width}%; text-align: ${styles[i].align};"
                                  >
                                    <span style="white-space: break-spaces;">${(item.title ?? '').trim()}</span>
                                  </div>`;
                                })
                                .join('');

                              return html` <div class="${gClass('order-row')}">${row}</div>`;
                            })
                            .join('')}
                        </div>
                      </div>
                    </div>
                  `;
                },
                save: {
                  event: () =>
                    new Promise<boolean>(resolve => {
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
                  event: () =>
                    new Promise<boolean>(resolve => {
                      resolve(true);
                    }),
                },
                xmark: () =>
                  new Promise<boolean>(resolve => {
                    resolve(true);
                  }),
              });
            }),
          });
        };

        // 列表開關事件
        const toggleOrderView = () => {
          const originID = ids.show;
          ids.show = originID === editID ? '' : editID;
          gvc.notifyDataChange(originID === editID ? editID : [originID, editID]);
        };

        // 電腦版介面
        const webView = (isExpanded: boolean) => {
          try {
            return html`
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
          } catch (error) {
            console.error('webView error: ', error);
            return '';
          }
        };

        // 手機版介面
        const phoneView = (isExpanded: boolean) => {
          try {
            return html`
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
          } catch (error) {
            console.error('phoneView error: ', error);
            return '';
          }
        };

        // 訂購人訂單列表
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

          return html` <div class="${gClass('box')} mt-2" style="${isDesktop ? '' : 'width: 1200px'}">
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
                  return html` <div class="tx_700" style="width: ${styles[i].width}%; text-align: ${styles[i].align};">
                    ${item.title}
                  </div>`;
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
                      title: html`
                        <div class="d-flex gap-3">
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
                    { title: `$ ${orderData.total.toLocaleString()}` },
                    { title: `${orderData.lineItems.length}件商品` },
                    {
                      title:
                        orders.length > 1
                          ? html`<i
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
                      return html` <div
                        class="tx_normal"
                        style="width: ${styles[i].width}%; text-align: ${styles[i].align};"
                      >
                        <span style="white-space: break-spaces;">${(item.title ?? '').trim()}</span>
                      </div>`;
                    })
                    .join('');

                  return html` <div class="${gClass('order-row')}">${row}</div>`;
                })
                .join('')}
            </div>
          </div>`;
        };

        const isExpanded = ids.show === editID;
        return isDesktop ? webView(isExpanded) : phoneView(isExpanded);
      };

      return html`
        <div class="row">
          <div class="col-12 col-lg-5">
            ${BgWidget.mainCard(html`
              <div style="min-height: 160px; ${phoneCardStyle}">
                <span class="tx_700">合併須知</span>
                <ul class="mt-2 ms-4">
                  ${hits
                    .map(hit => {
                      return html` <li class="${gClass('list')}">${hit}</li>`;
                    })
                    .join('')}
                </ul>
              </div>
            `)}
          </div>
          <div class="col-12 col-lg-7">
            ${BgWidget.mainCard(
              html` <div style="min-height: 160px; ${phoneCardStyle}">
                <span class="tx_700">訂單總計</span>
                ${gvc.bindView({
                  bind: ids.dashboard,
                  view: () =>
                    getDashboardData()
                      .map(item => {
                        return html` <div class="col-6 col-lg-3 px-0 px-lg-2">${dashboardItemHTML(item)}</div>`;
                      })
                      .join(''),
                  divCreate: {
                    class: 'row mt-3',
                  },
                })}
              </div>`
            )}
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
        ${BgWidget.mainCard(
          gvc.bindView({
            bind: ids.orderlist,
            view: () =>
              Object.keys(vm.dataObject)
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
          })
        )}
      `;
    };

    // 確認多筆訂單資料是否可以合併
    const checkOrderMergeConditions = (orders: CartData[]) => {
      if (orders.length < 2) return false; // 少於兩筆訂單直接不符合

      const [firstOrder, ...restOrders] = orders;
      const { status: baseStatus, orderData: baseData } = firstOrder;
      const { shipment: baseShipment, address: baseAddress, CVSStoreName: baseCVSStoreName } = baseData.user_info;

      return restOrders.every(order => {
        const { status, orderData } = order;
        const { user_info } = orderData;

        const isPayStatusSame = status === baseStatus;
        const isShipmentSame = user_info.shipment === baseShipment;
        const isAddressSame = ['UNIMARTC2C', 'FAMIC2C', 'OKMARTC2C', 'HILIFEC2C'].includes(baseShipment)
          ? user_info.CVSStoreName === baseCVSStoreName
          : user_info.address === baseAddress;

        return isPayStatusSame && isShipmentSame && isAddressSame;
      });
    };

    // 取得訂購人核定資料狀態
    const getStatusData = (data: CombineData): CombineData => {
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

    // 設定訂購人核定資料狀態
    const setDataStatus = (obj: DataMap) => {
      Object.keys(obj).forEach(key => {
        obj[key] = getStatusData(obj[key]);
      });
      return obj;
    };

    // ===== 彈出視窗，處理陣列資料 =====
    glitter.innerDialog((gvc: GVC) => {
      const temp: DataMap = {};
      applyClass();

      // 勾選訂單依照訂購人排序，並判斷合併狀態
      for (const order of dataArray) {
        const { email, user_info, progress, orderStatus } = order.orderData;

        if (
          !((progress === undefined || progress === 'wait') && (orderStatus === undefined || `${orderStatus}` === '0'))
        ) {
          dialog.infoMessage({ text: '訂單狀態應為處理中，且尚未出貨' });
          return;
        }

        const key = user_info?.email || user_info?.phone || email;
        if (key) {
          temp[key] = temp[key] || { orders: [] };
          temp[key].orders.push(order);
        }
      }

      // 設定原始資料
      vm.dataObject = setDataStatus(temp);
      vm.originDataObject = structuredClone(vm.dataObject);

      // 過濾掉只出現一次的訂購人
      const filteredData = Object.fromEntries(
        Object.entries(vm.dataObject).filter(([, data]) => {
          return data.orders.length >= 2;
        })
      );

      // 確認是否開始操作合併訂單
      if (Object.keys(filteredData).length === 0) {
        dialog.infoMessage({ text: '找不到相同的訂購人，無法合併訂單' });
        return;
      }

      return gvc.bindView({
        bind: ids.page,
        view: () => html`
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

  // 大量編輯
  static batchEditOrders(obj: { gvc: GVC; orders: any; callback: (orders: any) => void }) {
    const wp = window.parent as any;
    const topGVC = wp.glitter.pageConfig[wp.glitter.pageConfig.length - 1].gvc;
    const cloneOrders = structuredClone(obj.orders);

    topGVC.glitter.innerDialog((gvc: GVC) => {
      const dialog = new ShareDialog(gvc.glitter);
      const vm = {
        id: gvc.glitter.getUUID(),
        loading: true,
        orders: [] as any,
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
          id_list: obj.orders.map((data: any) => data.id).join(','),
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
        return vm.orders.map((dd: any) => {
          return [
            {
              key: '訂單編號',
              value: html` <div class="d-flex align-items-center gap-2" style="min-width: 200px;">
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
              value: html` <div style="width: 120px;">
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
              key: '付款狀態',
              value: BgWidget.select({
                gvc,
                callback: (value: any) => {
                  dd.status = value;
                },
                default: `${dd.status || 0}`,
                options: OrderSetting.getPaymentStatusOpt(),
                style: 'min-width: 220px;',
              }),
            },
            {
              key: '出貨狀態',
              value: BgWidget.select({
                gvc,
                callback: (value: any) => {
                  dd.orderData.progress = value;
                },
                default: dd.orderData.progress || 'wait',
                options: OrderSetting.getShippmentOpt(),
                style: 'min-width: 180px;',
              }),
            },
            {
              key: '訂單狀態',
              value: BgWidget.select({
                gvc,
                callback: (value: any) => {
                  dd.orderData.orderStatus = value;
                },
                default: `${dd.orderData.orderStatus || 0}`,
                options: OrderSetting.getOrderStatusOpt(),
              }),
            },
          ];
        });
      }

      function allEditDialog(data: { title: string; options: OptionsItem[]; callback: (value: any) => void }) {
        const defaultValue = '';
        let temp = '';

        BgWidget.settingDialog({
          gvc: gvc,
          title: data.title,
          innerHTML: (innerGVC: GVC) => {
            return html` <div>
              <div class="tx_700 mb-2">更改為</div>
              ${BgWidget.select({
                gvc: innerGVC,
                callback: (value: any) => {
                  temp = value;
                },
                default: defaultValue,
                options: [{ key: '', value: '請選擇狀態' }, ...data.options],
              })}
            </div>`;
          },
          footer_html: (footerGVC: GVC) => {
            return [
              BgWidget.cancel(
                footerGVC.event(() => footerGVC.closeDialog()),
                '取消'
              ),
              BgWidget.save(
                footerGVC.event(() => {
                  if (temp === defaultValue) {
                    dialog.infoMessage({ text: '請選擇欲更改的選項' });
                    return;
                  }
                  footerGVC.closeDialog();
                  data.callback(temp);
                  gvc.notifyDataChange(vm.id);
                }),
                '儲存'
              ),
            ].join('');
          },
          width: 350,
        });
      }

      function editOrderView() {
        return BgWidget.tableV3({
          gvc,
          filter: [
            {
              name: '更改付款狀態',
              event: (checkArray: any) => {
                allEditDialog({
                  title: '批量更改付款狀態',
                  options: OrderSetting.getPaymentStatusOpt(),
                  callback: (value: any) => {
                    checkArray.forEach((order: any) => {
                      order.status = Number(value);
                    });
                  },
                });
              },
            },
            {
              name: '更改出貨狀態',
              event: (checkArray: any) => {
                allEditDialog({
                  title: '批量更改出貨狀態',
                  options: OrderSetting.getShippmentOpt(),
                  callback: (value: any) => {
                    checkArray.forEach((order: any) => {
                      order.orderData.progress = value;
                    });
                  },
                });
              },
            },
            {
              name: '更改訂單狀態',
              event: (checkArray: any) => {
                allEditDialog({
                  title: '批量更改訂單狀態',
                  options: OrderSetting.getOrderStatusOpt(),
                  callback: (value: any) => {
                    checkArray.forEach((order: any) => {
                      order.orderData.orderStatus = value;
                    });
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
          rowClick: () => {},
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

          return html`
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
                ${BgWidget.save(
                  gvc.event(() => {
                    obj.callback(vm.orders);
                    topGVC.glitter.closeDiaLog();
                  })
                )}
              </div>
            </div>
          `;
        },
      });
    }, 'batchEditOrders');
  }

  // 拆分訂單
  static splitOrder(topGVC: GVC, orderData: any, callback: () => void) {
    //把原本的預設資訊扔進拆分表單內，並且把商品的數量設定為0
    function assignOrder(orderCreateUnit: OrderDetail) {
      orderCreateUnit.cart_token = orderData.orderID;
      orderCreateUnit.customer_info = orderData.user_info;
      orderCreateUnit.user_info = orderData.user_info;
      orderCreateUnit.voucher = orderData.voucherList;
      orderCreateUnit.lineItems = structuredClone(orderData.lineItems);
      orderCreateUnit.lineItems.forEach((lineItem: LineItem) => {
        lineItem.count = '0';
      });
    }
    orderData.orderSource = 'split';
    const dataArray: LineItem[] = orderData.lineItems;
    const parentPageConfig = (window.parent as any)?.glitter?.pageConfig;
    const latestPageConfig = parentPageConfig?.[parentPageConfig.length - 1];
    const ogvc = latestPageConfig?.gvc || topGVC;
    const glitter = ogvc.glitter;
    const dialog = new ShareDialog(glitter);
    const orderCreateUnit = new OrderDetail(0, 0);
    assignOrder(orderCreateUnit);
    const splitOrderArray: OrderDetail[] = [structuredClone(orderCreateUnit)];
    const passData = structuredClone(orderCreateUnit);//修改後的
    const isDesktop = document.body.clientWidth > 768;

    const vm = {
      dataObject: {} as DataMap, // 調用合併訂單資料
      originDataObject: {} as DataMap, // 原始合併訂單資料
      prefix: 'split-orders',
      splitCount: 1,
    };

    const ids = {
      show: '',
      page: glitter.getUUID(),
      header: glitter.getUUID(),
      dashboard: glitter.getUUID(),
      itemList: glitter.getUUID(),
      block: glitter.getUUID(),
      summary: glitter.getUUID(),
      footer: glitter.getUUID(),
    };

    const gClass = (name: string) => `${vm.prefix}-${name}`;

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
        .${vm.prefix}-split-rule {
          color: #4D86DB;
          font-size: 16px;
          font-weight: 400;text-decoration-line: underline;
          text-decoration-style: solid;
          text-decoration-skip-ink: none;
          text-decoration-thickness: auto;
          text-underline-offset: auto;
          text-underline-position: from-font;
          cursor: pointer;
        }
        .${vm.prefix}-product-preview-img{
          width: 42px;
          height: 42px;
          border-radius: 5px;
        }
        .${vm.prefix}-font-gray{
          color: #8d8d8d;
        }
        .${vm.prefix}-font-blue{
          color: #4D86DB;
        }
        .${vm.prefix}-product-input{
          border-radius: 10px;
          border: 1px solid #DDD;
          background: #FFF;
          padding: 9px 18px;
        }
        .${vm.prefix}-split-BTN{
          height:26px;
          color:#4D86DB;
          gap: 6px;
          padding-left:18px;
          display: flex;
          align-items: start;
          cursor:pointer;
        }
        .${vm.prefix}-minusQty{
          color: #4D86DB;
          font-size: 16px;
          font-weight: 400;
        }
        .${vm.prefix}-itemList-section{
          min-width: 100%;
          padding-top:24px;
          gap:5px;
          display: flex;
        }
        .${vm.prefix}-summary-section{
          border-top: 1px solid #DDD;
          border-bottom: 1px solid #DDD;
        }
        .${vm.prefix}-summary-title{
          width:606px;
          flex-shrink:0;
          border-right: 1px solid #DDD;
          padding-left:18px;
          padding:9px 18px;
          display: flex;
          justify-content: end;
          align-items: center;
        }
        .${vm.prefix}-summary-oriSummary{
          width:152px;
          border-right: 1px solid #DDD;
          flex-shrink:0;
        }
        .${vm.prefix}-summary-subSummary{
          width:155px;
          border-right: 1px solid #DDD;
          flex-shrink:0;
        }
        .${vm.prefix}-summary-raw-BG1{
          background: #F7F7F7;
        }
        .${vm.prefix}-summary-raw{
          display: flex;
          font-size: 16px;
          align-items: center;
          justify-content:start;
          padding-left:18px;
        }
        .${vm.prefix}-summary-raw1{
          display: flex;
          font-size: 16px;
          font-weight: 700;
          align-items: end;
          justify-content:start;
          padding-left:18px;
          padding-bottom:9px;
        }
        .${vm.prefix}-summary-right{
          margin:0 6px;
        }
        
        .${vm.prefix}-dialog-ul{
          padding:6px ;
          list-style:disc;
          
        }
        .${vm.prefix}-dialog-ul li{
          list-style:disc;
          text-align:left;
          list-style-position: inside;
        }
      `);
    };

    const closeDialog = () => glitter.closeDiaLog();


    const renderHeader = (gvc: GVC) =>
      gvc.bindView({
        bind: ids.header,
        view: () =>
          html` <div class="${gClass('back-btn')}" onclick="${gvc.event(closeDialog)}">
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
      const alertHTML = html`
      <div class="d-flex flex-column">
        <div class="tx_normal text-start">您即將拆分訂單，系統將產生 ${splitOrderArray.length} 筆子訂單，拆分後：</div>
        <ul class="${gClass('dialog-ul')}">
          <li>原訂單調整金額與折扣，運費及附加費維持不變。子訂單按比例分配優惠。</li>
          <li>子訂單繼承母訂單設定，發票需手動作廢與重開。 </li>
          <li>代收金額更新，已建立的出貨單需取消並重新建立。</li>
        </ul>
      </div>
      `

      dialog.checkYesOrNotWithCustomWidth({
        callback: bool => {
          if (bool) {
            orderData.lineItems.forEach((lineItem:any,index:number)=>{
              let count = 0;
              count = splitOrderArray.reduce((total,order)=>{return total += Number(order.lineItems[index].count)},0)
              lineItem.count -= count;
            })
            const passData = {
              orderData : orderData,
              splitOrderArray : splitOrderArray
            }
            console.log("passData -- " , passData);
            ApiShop.splitOrder(passData).then(r => {
              console.log("r -- " , r);
              // if (r.result && r.response) {
              //   dialog.dataLoading({ visible: false });
              //   dialog.successMessage({ text: '合併完成' });
              //   setTimeout(() => {
              //     closeDialog();
              //     callback();
              //   }, 500);
              // }
            });
          }
        },
        text: alertHTML,
      });
    };

    const renderFooter = (gvc: GVC) => gvc.bindView({
      bind:ids.footer,
      view:()=>{
        const allOrdersHaveZeroItems = splitOrderArray.every(order =>
          order.lineItems.every(item => Number(item.count) === 0)
        );
        let checkBTN = ``;
        if (!allOrdersHaveZeroItems) {
          checkBTN = BgWidget.save(gvc.event(handleSave), '拆分訂單')
        } else {
          checkBTN = BgWidget.disableSave('拆分訂單')
        }

        return html`
          ${BgWidget.cancel(gvc.event(closeDialog))} ${checkBTN}
        `
      },divCreate:{class:`${gClass('footer')}`}
    });

    const renderHint = (gvc: GVC) => {
      // mainCard 手機版專用
      const phoneCardStyle = isDesktop
        ? ''
        : 'border-radius: 10px; padding: 12px; background: #fff; box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.08);';

      // 字體顏色
      const fontColor = {
        success: '#10931D',
        error: '#DA1313',
        normal: '#393939',
      };

      // 合併須知
      const hits = [
        '原訂單將保留剩餘商品，訂單金額與折扣將調整；子訂單將包含選定商品，並按比例分配優惠折扣',
        '拆單後，運費及附加費用不變，將保留於原訂單內，若需要，請手動編輯訂單新增費用',
      ];
      return html`
        <div class="row">
          <div class="col-12 ">
            ${BgWidget.mainCard(html`
              <div style="${phoneCardStyle}">
                <span class="tx_700">拆單需知</span>
                <div class="w-100 d-flex">
                  <ul class="mt-2 ms-4">
                    ${hits
                      .map(hit => {
                        return html` <li class="${gClass('list')}">${hit}</li>`;
                      })
                      .join('')}
                  </ul>
                  <div class="${gClass('split-rule')} ms-auto d-flex align-items-end" onclick="${gvc.event(()=>{
                    BgWidget.settingDialog({
                      gvc: gvc,
                      title: '拆單需知',
                      width: 766,
                      innerHTML: gvc => {
                        return html`
                          <ul class="${gClass('dialog-ul')}">
                            <li>原訂單將保留剩餘商品，訂單金額與折扣將調整；子訂單將包含選定商品，並按比例分配優惠折扣</li>
                            <li>拆單後運費及附加費用不變，將保留於原訂單內，如需更改，請手動編輯訂單新增費用</li>
                            <li>子訂單會預設繼承母訂單的配送與付款方式，如需更改，請手動編輯訂單內容</li>
                            <li>子訂單若要重新開立發票，請至發票頁面手動建立</li>
                            <li>若發票已開立，系統不會自動作廢，需至訂單頁面手動作廢並重新開立</li>
                            <li>代收金額將更新，已建立的出貨單需取消並重新建立</li>
                          </ul>`;
                      },
                      footer_html: (gvc: GVC) => {
                        return '';
                      },
                    });
                  })}">詳細拆單規則</div>
                </div>
              </div>
            `)}
          </div>
        </div>
      `;
    };

    const renderItemList = (gvc: GVC) => {
      function newSplitOrder() {
        splitOrderArray.push(structuredClone(orderCreateUnit));
        gvc.notifyDataChange([ids.itemList, ids.summary , ids.footer]);
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
            return html`
              <div class="d-flex flex-column">
                <div class="${commonClass}" style="width: ${titleDom.width};${titleDom?.style ?? ''}">
                  <div class="tx_700">${titleDom.title}${index + 1}</div>
                  <div class="flex-fill"></div>
                </div>
                <div
                  class="d-flex flex-column"
                  style="width: ${titleDom.width};gap:16px;padding-top: 24px;${titleDom?.style ?? ''}"
                >
                  ${splitOrderArray[index].lineItems
                    .map((item, itemIndex) => {
                      return html`
                        <input
                          class="${gClass('product-input')} d-flex tx_normal w-100"
                          style="${commonHeight};"
                          type="number"
                          value="${parseInt(item.count)}"
                          min="0"
                          onchange="${gvc.event(e => {
                            const temp = structuredClone(item.count);
                            item.count = e.value;
                            let nowQty = 0;
                            splitOrderArray.forEach((order, index) => {
                              nowQty += Number(order.lineItems[itemIndex].count);
                            });
                            if (Number(dataArray[itemIndex].count) >= nowQty) {
                            } else {
                              item.count = temp;
                            }
                            gvc.notifyDataChange([ids.itemList, ids.summary , ids.footer]);
                          })}"
                        />
                      `;
                    })
                    .join('')}
                </div>
              </div>
            `;
          })
          .join('');
      }
      const commonClass = 'd-flex align-items-center';
      const commonHeight = 'height:40px;';
      const addBTN = html`
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
          const dataRaws: {
            title: string;
            key: string;
            width: string;
            style?: string;
            htmlArray: string[];
          }[] = [
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
          dataArray.forEach((item, lineItemIndex) => {
            return html`
              <div class="d-flex w-100">
                ${dataRaws
                  .map((dataRaw, dataRowIndex) => {
                    switch (dataRaw.key) {
                      case 'name': {
                        const spec = item.spec.length > 0 ? Tool.truncateString(item.spec.join(''), 5) : '單一規格';
                        const sku = '';
                        dataRaw.htmlArray.push(
                          html` <div class="${commonClass}" style="width: ${dataRaw.width};gap:12px;${commonHeight}">
                            <img class="${gClass('product-preview-img')}" src="${item.preview_image}" alt="產品圖片" />
                            <div class="d-flex flex-column flex-grow-1" style="gap:2px;">
                              <div class="tx_normal_14" style="white-space: normal;line-height: normal;">
                                ${Tool.truncateString(item.title, 10)} -${spec}
                              </div>
                              <div class="tx_normal_14 ${gClass('font-gray')}">
                                存貨單位 (SKU): ${item.sku ?? '無SKU'}
                              </div>
                            </div>
                          </div>`
                        );
                        break;
                      }
                      case 'stock': {
                        dataRaw.htmlArray.push(html`
                          <div
                            class="tx_normal ${commonClass} justify-content-start"
                            style="width: ${dataRaw.width};${commonHeight}"
                          >
                            AA倉庫
                          </div>
                        `);
                        break;
                      }
                      case 'price': {
                        dataRaw.htmlArray.push(html`
                          <div
                            class="tx_normal ${commonClass} justify-content-start"
                            style="width: ${dataRaw.width};${commonHeight}"
                          >
                            ${item.sale_price}
                          </div>
                        `);
                        break;
                      }
                      case 'totalQty': {
                        dataRaw.htmlArray.push(html`
                          <div
                            class="tx_normal ${commonClass} justify-content-start"
                            style="width: ${dataRaw.width};${commonHeight}"
                          >
                            ${item.count}
                          </div>
                        `);
                        break;
                      }
                      case 'oriQty': {
                        let splitQty = 0;
                        splitOrderArray.forEach(order => {
                          splitQty += Number(order.lineItems[lineItemIndex].count);
                        });
                        const minusQtyClass = `${gClass('minusQty')} ${splitQty > 0 ? '' : 'd-none'}`;
                        dataRaw.htmlArray.push(html`
                          <div
                            class="tx_normal ${commonClass} justify-content-start"
                            style="width: ${dataRaw.width};${commonHeight}"
                          >
                            ${item.count} <span class="${minusQtyClass}"> -> ${Number(item.count) - splitQty}</span>
                          </div>
                        `);
                        break;
                      }
                    }
                    return html``;
                  })
                  .join('')}
              </div>
            `;
          });
          return html`
            ${dataRaws
              .map(item => {
                return html`
                  <div class="d-flex flex-column">
                    <div class="${commonClass}" style="width: ${item.width};${item?.style ?? ''}">
                      <div class="tx_700">${item.title}</div>
                      <div class="flex-fill"></div>
                    </div>
                    <div
                      class="d-flex flex-column"
                      style="width: ${item.width};gap:16px;padding-top: 24px;${item?.style ?? ''}"
                    >
                      ${item.htmlArray.join('')}
                    </div>
                  </div>
                `;
              })
              .join('')}
            ${drawSplitOrder()} ${addBTN}
          `;
        },
        divCreate: { style: '', class: `${gClass('itemList-section')}` },
      });
    };

    const renderBlock = (gvc: GVC) => {
      const subBlock = splitOrderArray.map((order, index) => {
        return html`<div class="${gClass('summary-subSummary')}"></div>`
      }).join('')
      return html`
        <div class="d-flex" style="height:27px;">
          <div class="${gClass('summary-title')}"></div>
          <div class="${gClass('summary-oriSummary')}"></div>
          ${subBlock}
        </div>
      `;
    };
    const renderSummary = (gvc: GVC) => {
      return gvc.bindView({
        bind: ids.summary,
        view: () => {
          function drawSubTitle() {
            return splitOrderArray
              .map((order, index) => {
                return html`
                  <div class="${gClass('summary-subSummary')} ${gClass('summary-raw1')}">子訂單${index + 1}</div>
                `;
              })
              .join('');
          }
          function drawOriData(index: number) {
            //原先訂單的商品價格
            const sale_price = dataArray.reduce((total, data) => total + data.sale_price * Number(data.count), 0);
            //拆分訂單的商品總價格
            const split_price = splitOrderArray.reduce(
              (total, order) =>
                total +
                order.lineItems.reduce(
                  (subTotal, lineItem) => subTotal + lineItem.sale_price * Number(lineItem.count),
                  0
                ),
              0
            );
            const rate = 1 - split_price / (sale_price + orderData.shipment_fee);
            const discount = Math.round(orderData.discount * rate);
            switch (index) {
              case 1:
                //若是有修改價格 需藍字顯示出修改後內容
                if (split_price) {
                  return html`
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
                //若是有修改價格 需藍字顯示出修改後內容
                if (split_price) {
                  return html`
                    <div class="d-flex align-items-center">
                      <span class="text-decoration-line-through">-${orderData.discount}</span
                      ><i class="fa-solid fa-arrow-right ${gClass('font-blue')} ${gClass('summary-right')}"></i
                      ><span class="${gClass('font-blue')}">-${discount}</span>
                    </div>
                  `;
                }
                return -orderData.discount;
              default:
                if (split_price) {
                  return html`
                    <div class="d-flex align-items-center">
                      <span class="text-decoration-line-through">${orderData.total}</span
                      ><i class="fa-solid fa-arrow-right ${gClass('font-blue')} ${gClass('summary-right')}"></i
                      ><span class="${gClass('font-blue')}">${sale_price - split_price - discount + orderData.shipment_fee}</span>
                    </div>
                  `;
                }
                return orderData.total;
            }
          }
          //rawIndex 第幾列 決定要繪製什麼類型的資料
          function drawSplitData(rawIndex: number) {
            function drawUnit(order: OrderDetail, lineIndex: number) {
              //產品總價
              const total = order.lineItems.reduce(
                (total, lineItem) => total + lineItem.sale_price * Number(lineItem.count),
                0
              );
              const rate = total / orderData.total;
              order.discount = Math.round(orderData.discount*rate)
              //產品總價-折扣
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
            //lineIndex 決定要把第幾個拆分訂單的資訊放進去
            return splitOrderArray
              .map((order, lineIndex) => {
                return html`
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
                return html`
                  <div class="d-flex" style="height:58px;">
                    <div class="${gClass('summary-title')}"></div>
                    <div class="${gClass('summary-oriSummary')} d-flex ${gClass('summary-raw1')}">原訂單</div>
                    ${drawSubTitle()}
                  </div>
                `;
              }
              return html`
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

    // ===== 彈出視窗，處理陣列資料 =====
    glitter.innerDialog((gvc: GVC) => {
      const temp: DataMap = {};
      applyClass();

      return gvc.bindView({
        bind: ids.page,
        view: () => html`
          <div class="d-flex flex-column ${gClass('full-screen')}">
            ${renderHeader(gvc)}
            <div
              class="flex-fill scrollbar-appear"
              style="${isDesktop ? 'padding: 24px 32px;' : 'padding: 0;'} overflow: hidden auto;"
            >
              ${renderHint(gvc)} ${renderItemList(gvc)} ${renderBlock(gvc)} ${renderSummary(gvc)}
            </div>
            ${renderFooter(gvc)}
          </div>
        `,
      });
    }, 'splitOrder');
  }
}
