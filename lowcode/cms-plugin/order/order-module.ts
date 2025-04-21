import { GVC } from '../../glitterBundle/GVController.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { BgWidget } from '../../backend-manager/bg-widget.js';
import { BgProduct } from '../../backend-manager/bg-product.js';
import { ApiDelivery } from '../../glitter-base/route/delivery.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { ApiUser } from '../../glitter-base/route/user.js';
import { PaymentConfig } from '../../glitter-base/global/payment-config.js';
import { ShipmentConfig } from '../../glitter-base/global/shipment-config.js';
import { PaymentPage } from '../pos-pages/payment-page.js';
import { PosFunction } from '../pos-pages/pos-function.js';

const html = String.raw;

export class OrderModule {
  static getPaymentMethodText(gvc: GVC, orderData: any) {
    if (orderData.orderSource === 'POS') {
      return `${(() => {
        if (typeof orderData.pos_info.payment === 'string') {
          return `門市『 ${(() => {
            switch (orderData.pos_info.payment) {
              case 'creditCard':
                return '信用卡';
              case 'line':
                return 'Line Pay';
              case 'cash':
                return '現金';
            }
          })()} 』付款`;
        } else {
          const pay_total = orderData.pos_info.payment
            .map((dd: any) => {
              return dd.total;
            })
            .reduce((acc: any, val: any) => acc + val, 0);
          let map_ = orderData.pos_info.payment.map((dd: any) => {
            return `${(() => {
              switch (dd.method) {
                case 'creditCard':
                  return '信用卡';
                case 'line':
                  return 'Line Pay';
                case 'cash':
                  return '現金';
              }
            })()}付款<span class="fw-500" style="color:#E85757;"> $${dd.total.toLocaleString()}</span>`;
          });
          if (pay_total < orderData.total) {
            map_.push(
              html` <div class="d-flex align-items-center">
                <span class="fw-500 text-danger">付款金額不足</span>
                <div class="mx-1"></div>
                <span class="fw-500"> $${(orderData.total - pay_total).toLocaleString()}</span>
                <div class="mx-1"></div>
                ${BgWidget.customButton({
                  button: {
                    color: 'gray',
                    size: 'sm',
                  },
                  text: {
                    name: '前往結帳',
                  },
                  event: gvc.event(() => {
                    PaymentPage.storeHistory(orderData);
                    gvc.closeDialog();
                    localStorage.setItem('show_pos_page', 'payment');
                    gvc.glitter.share.reloadPosPage();
                  }),
                })}
              </div>`
            );
          }
          return map_.join('<div class="w-100"></div>');
        }
      })()}
            `;
    }
    return gvc.bindView(() => {
      return {
        bind: gvc.glitter.getUUID(),
        view: async () => {
          return (
            (await PaymentConfig.getSupportPayment()).find(dd => {
              return dd.key === orderData.customer_info.payment_select;
            })?.name || '線下付款'
          );
        },
      };
    });
  }

  static getProofPurchaseString(gvc: GVC, orderData: any) {
    if (orderData.method !== 'off_line' || orderData.customer_info.payment_select === 'cash_on_delivery') {
      return '';
    }
    return html` <div class="tx_700">付款證明回傳</div>
      <div class="border rounded-3 w-100 p-3 tx_normal">
        ${(() => {
          const array: string[] = [];

          // 若使用貨到付款
          if (orderData.customer_info.payment_select === 'cash_on_delivery') {
            return '貨到付款';
          }

          // 若使用ATM付款
          if (orderData.customer_info.payment_select === 'atm') {
            ['pay-date', 'bank_name', 'bank_account', 'trasaction_code'].map((dd, index) => {
              if (orderData.proof_purchase && orderData.proof_purchase[dd]) {
                array.push(
                  `${['交易時間', '銀行名稱', '銀行戶名', '銀行帳號後五碼'][index]} : ${orderData.proof_purchase[dd]}`
                );
              }
            });
          }

          // 若使用line付款
          if (orderData.customer_info.payment_select === 'line') {
            ['image'].map(dd => {
              if (orderData.proof_purchase && orderData.proof_purchase[dd]) {
                array.push(
                  BgWidget.imageDialog({
                    gvc,
                    image: orderData.proof_purchase[dd],
                    width: 400,
                    height: 250,
                    read: () => {},
                  })
                );
              }
            });
          }

          if (!['atm', 'line'].includes(orderData.customer_info.payment_select)) {
            if (orderData.proof_purchase === undefined || orderData.proof_purchase.paymentForm === undefined) {
              return '尚未回傳付款證明';
            }

            // 其他付款方式
            const paymentFormList = orderData.proof_purchase.paymentForm.list ?? [];
            paymentFormList.map((item: any) => {
              array.push(`${item.title} : ${orderData.proof_purchase[item.key]}`);
            });
          }

          return array.join(BgWidget.mbContainer(8)) || '尚未回傳付款證明';
        })()}
      </div>`;
  }

  static printStoreOrderInfo(obj: { gvc: GVC; cart_token: string; print: boolean; callback?: () => void }) {
    const gvc = obj.gvc;
    const glitter = gvc.glitter;
    const dialog = new ShareDialog(gvc.glitter);
    let shipment_date = gvc.glitter.ut.dateFormat(new Date(), 'yyyy-MM-dd');
    let shipment_time = gvc.glitter.ut.dateFormat(new Date(), 'hh:mm');

    function next() {
      dialog.dataLoading({ visible: true, text: '處理中...' });
      ApiDelivery.getOrderInfo({
        order_id: obj.cart_token,
        shipment_date: obj.print ? undefined : new Date(`${shipment_date} ${shipment_time}:00`).toISOString(),
      }).then(async res => {
        gvc.notifyDataChange('orderDetailRefresh');
        dialog.dataLoading({ visible: false });
        if (!obj.print) {
          obj.callback?.();
          return;
        }
        if (res.result && res.response.data) {
          const data = res.response.data;
          if (data.result) {
            if (data.link) {
              if ((window.parent as any).glitter.share.PayConfig.posType === 'SUNMI') {
                glitter.runJsInterFace(
                  'print-web-view',
                  {
                    url: data.link,
                  },
                  () => {}
                );
              } else {
                glitter.openNewTab(data.link);
              }
            } else if (data.id) {
              const url = ApiDelivery.getFormURL(data.id);
              if ((window.parent as any).glitter.share.PayConfig.posType === 'SUNMI') {
                glitter.runJsInterFace(
                  'print-web-view',
                  {
                    url: url,
                  },
                  () => {}
                );
              } else {
                glitter.openNewTab(url);
              }
            } else {
              dialog.errorMessage({ text: '列印失敗' });
            }
          } else {
            dialog.errorMessage({ text: data.message ?? '發生錯誤' });
          }
        } else {
          dialog.errorMessage({ text: '列印失敗' });
        }
      });
    }

    if (!obj.print) {
      BgWidget.settingDialog({
        gvc: gvc,
        title: '設定出貨日期',
        innerHTML: (gvc: GVC) => {
          return [
            BgWidget.editeInput({
              gvc: gvc,
              title: '出貨日期',
              default: shipment_date,
              callback: text => {
                shipment_date = text;
              },
              type: 'date',
              placeHolder: '請輸入出貨日期',
            }),
            BgWidget.editeInput({
              gvc: gvc,
              title: '出貨時間',
              default: shipment_time,
              callback: text => {
                shipment_time = text;
              },
              type: 'time',
              placeHolder: '請輸入出貨時間',
            }),
          ].join('');
        },
        footer_html: (gvc: GVC) => {
          return [
            BgWidget.cancel(
              gvc.event(() => {
                gvc.closeDialog();
              }),
              '取消'
            ),
            BgWidget.save(
              gvc.event(() => {
                gvc.closeDialog();
                next();
              }),
              '儲存'
            ),
          ].join('');
        },
        width: 350,
      });
    } else {
      next();
    }

    return;
  }

  static supportShipmentMethod() {
    return ShipmentConfig.list.map(dd => {
      return {
        name: dd.title,
        value: dd.value,
      };
    });
  }

  static formatRecord(gvc: GVC, vm: any, orderID: string, record: string): string {
    // 處理訂單連結
    const orderNumbers = record.match(/{{order=(\d+)}}/g) || [];
    orderNumbers.map((order: string) => {
      const pureOrder = order.replace(/{{order=|}}/g, '');
      record = record.replace(
        order,
        BgWidget.blueNote(
          `#${pureOrder}`,
          gvc.event(() => {
            vm.data.cart_token = pureOrder;
            vm.type = 'replace';
          })
        )
      );
    });

    // 處理出貨單連結
    const shipmentNumbers = record.match(/{{shipment=(.*?)}}/g) || [];
    shipmentNumbers.map((order: string) => {
      const pureOrder = order.replace(/{{shipment=|}}/g, '');
      record = record.replace(
        order,
        BgWidget.blueNote(
          `${pureOrder}`,
          gvc.event(() => {
            (window as any).glitter.setUrlParameter('page', 'shipment_list');
            (window as any).glitter.setUrlParameter('orderID', orderID);
            gvc.recreateView();
          })
        )
      );
    });

    return record;
  }

  static newOrder(gvc: GVC) {
    const glitter = gvc.glitter;
    return {
      id: glitter.getUUID(),
      productArray: [],
      productCheck: [],
      productTemp: [],
      orderProductArray: [],
      orderString: '',
      query: '',
    };
  }

  static newVocuher(): VoucherData {
    return {
      id: 0,
      discount_total: 0,
      end_ISO_Date: '',
      for: 'all',
      forKey: [],
      method: 'percent',
      overlay: false,
      reBackType: 'rebate',
      rebate_total: 0,
      rule: 'min_price',
      ruleValue: 0,
      startDate: '',
      startTime: '',
      start_ISO_Date: '',
      status: 1,
      target: '',
      targetList: [],
      title: '',
      trigger: 'auto',
      type: 'voucher',
      value: 0,
    };
  }

  static editOrderLineItems(gvc: GVC, orderData: Order, callback: () => void) {
    const id = gvc.glitter.getUUID();
    const dialog = new ShareDialog(gvc.glitter);
    const cloneData = structuredClone(orderData);

    function getNewItem(id: number, product: any, variant: any) {
      return {
        id: id,
        sku: variant.sku,
        spec: variant.spec,
        count: 1,
        stock: variant.stockList
          ? Number(Object.values(variant.stockList).reduce((sum, val: any) => sum + val.count, 0))
          : 0,
        times: 0,
        title: product.content.title,
        rebate: 0,
        weight: Number(variant.weight),
        is_gift: false,
        is_hidden: false,
        stockList: variant.stockList,
        sale_price: variant.sale_price,
        origin_price: variant.origin_price,
        preview_image: variant.preview_image,
        discount_price: 0,
        is_add_on_items: false,
        show_understocking: variant.show_understocking,
        deduction_log: (() => {
          const obj: any = {};
          const stockKey = Object.keys(variant.stockList).find(key => variant.stockList[key]?.count > 0);
          if (stockKey) {
            obj[stockKey] = 1;
          }
          return obj;
        })(),
      };
    }

    function showTag(color: string, text: string) {
      return html` <div class="product-show-tag" style="background: ${color};">${text}</div> `;
    }

    function getLineItemSubtotal(lineItems: LineItem[]) {
      return lineItems
        .map(dd => Number(dd.count) * Number(dd.sale_price))
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    }

    return BgWidget.settingDialog({
      gvc,
      title: '編輯訂單明細',
      width: 800,
      height: 600,
      innerHTML: gvc => {
        return gvc.bindView({
          bind: id,
          view: () => {
            const subtotal = getLineItemSubtotal(orderData.orderData.lineItems);

            return html`<div class="d-flex flex-column">
              ${orderData.orderData.lineItems
                .filter((dd: any) => dd.count > 0)
                .map((dd: any) => {
                  function countInput() {
                    return BgWidget.editeInput({
                      gvc,
                      title: '',
                      default: `${dd.count}`,
                      placeHolder: '',
                      callback: (value: string) => {
                        const n = Number(value);
                        if (isNaN(n) || n < 0) {
                          dialog.errorMessage({ text: '請填寫大於 0 的數值' });
                          return;
                        }

                        const storeKeys = Object.keys(dd.deduction_log || {});
                        if (storeKeys.length > 0) {
                          let selectStore = '';
                          for (const key of storeKeys) {
                            if (dd.deduction_log[key] === 0) {
                              delete dd.deduction_log[key];
                            } else if (!selectStore && dd.deduction_log[key] > 0) {
                              selectStore = key;
                            }
                          }

                          if (selectStore) {
                            dd.deduction_log[selectStore] = n;
                          }
                        }

                        dd.count = n;
                        gvc.notifyDataChange(id);
                      },
                      style: 'width: 64px;',
                    });
                  }

                  function renderImage() {
                    return html`<div
                      class="d-flex flex-column align-items-center justify-content-center"
                      style="gap: 5px; margin-right: 12px;"
                    >
                      ${BgWidget.validImageBox({
                        gvc,
                        image: dd.preview_image,
                        width: 60,
                        class: 'border rounded',
                        style: '',
                      })}
                    </div>`;
                  }

                  function renderTrash() {
                    return html`<div
                      class="hoverBtn d-flex align-items-center justify-content-center fs-6"
                      style="width: 24px;"
                      onclick="${gvc.event(() => {
                        const findData = orderData.orderData.lineItems.find(item => {
                          return item.id === dd.id && item.spec.join('') === dd.spec.join('');
                        });
                        if (findData) {
                          findData.count = 0;
                          Object.keys(findData.deduction_log).map(key => {
                            findData.deduction_log[key] = 0;
                          });
                        }
                        gvc.notifyDataChange(id);
                      })}"
                    >
                      <i class="fa-sharp fa-regular fa-trash"></i>
                    </div>`;
                  }

                  function isHiddenProduct() {
                    return dd.is_hidden
                      ? html`<div class="w-auto">${BgWidget.secondaryInsignia('隱形商品')}</div>`
                      : '';
                  }

                  function webPriceCount() {
                    return html`<div class="d-none d-lg-flex justify-content-end tx_normal_16" style="min-width: 80px;">
                      <div class="d-flex align-items-center gap-2">
                        $${dd.sale_price.toLocaleString()} × ${countInput()}
                      </div>
                    </div>`;
                  }

                  function renderSubtotal() {
                    return html`<div
                      class="d-flex justify-content-end align-items-center tx_normal"
                      style="width: 110px;"
                    >
                      $${(dd.sale_price * dd.count).toLocaleString()}
                    </div>`;
                  }

                  function mobPriceCount() {
                    return html`<div class="d-sm-none d-flex align-items-center gap-2 tx_normal">
                      $${dd.sale_price.toLocaleString()} × ${countInput()}
                    </div>`;
                  }

                  function renderSKU() {
                    return BgWidget.grayNote(`存貨單位 (SKU)：${dd.sku && dd.sku.length > 0 ? dd.sku : '無'}`);
                  }

                  function renderTitleInfo() {
                    return html`<div class="tx_700 d-flex align-items-center gap-1">
                      <div style="white-space: normal;">${dd.title}</div>
                      ${dd.is_gift ? html`<div>${showTag('#FFE9B2', '贈品')}</div>` : ''}
                      ${dd.is_add_on_items ? html`<div>${showTag('#D8E7EC', '加購品')}</div>` : ''}
                      ${dd.pre_order ? html`<div>${showTag('#D8E7EC', '預購')}</div>` : ''}
                    </div>`;
                  }

                  function renderSpec() {
                    return dd.spec.length > 0 ? BgWidget.grayNote(dd.spec.join(', ')) : '';
                  }

                  if (document.body.clientWidth > 768) {
                    return html`<div class="d-flex align-items-center gap-1">
                      ${renderImage()}
                      <div class="d-flex flex-column">
                        ${isHiddenProduct()} ${renderTitleInfo()} ${renderSpec()} ${renderSKU()}
                      </div>
                      <div class="flex-fill"></div>
                      ${webPriceCount()} ${renderSubtotal()} ${renderTrash()}
                    </div>`;
                  }

                  return html`<div class="d-flex flex-column gap-1 mt-2">
                    <div class="d-flex gap-2">
                      ${renderImage()}
                      <div class="d-flex flex-column">
                        ${isHiddenProduct()} ${renderTitleInfo()} ${renderSpec()} ${renderSKU()}
                      </div>
                    </div>
                    <div class="d-flex gap-2 justify-content-between">
                      ${mobPriceCount()} ${renderSubtotal()} ${renderTrash()}
                    </div>
                  </div>`;
                })
                .join(html` <div style="margin-top: 12px;"></div>`)}
              <div class="d-flex align-items-center justify-content-center mt-1">
                <div style="width: 50px;">
                  ${BgWidget.plusButton({
                    title: '新增商品',
                    event: gvc.event(() => {
                      return BgProduct.productsDialog({
                        gvc,
                        title: '新增商品',
                        default: [],
                        with_variants: true,
                        callback: async (dataArray: any) => {
                          const specArray: { id: string; spec: string }[] = [];

                          const idSet = new Set(
                            dataArray.map((data: string) => {
                              const id = data.split('-')[0];
                              const spec = data.substring(data.indexOf('-') + 1);
                              specArray.push({ id, spec });
                              return id;
                            })
                          );

                          dialog.dataLoading({ visible: true });

                          await ApiShop.getProduct({
                            page: 0,
                            limit: 99999,
                            id_list: [...idSet].join(','),
                            status: 'inRange',
                          }).then(r => {
                            setTimeout(() => dialog.dataLoading({ visible: false }), 100);

                            if (r.result && r.response.total > 0) {
                              const productMap: Map<string, any> = new Map(
                                r.response.data.map((product: any) => [`${product.id}`, product])
                              );

                              specArray.forEach(specData => {
                                const product = productMap.get(`${specData.id}`);
                                if (!product) {
                                  return;
                                }

                                const variant = product.content.variants.find(
                                  (variant: any) => variant.spec.join('-') === specData.spec
                                );
                                if (!variant) {
                                  return;
                                }

                                const lineItemData = orderData.orderData.lineItems.find(item => {
                                  return (
                                    item.id === Number(specData.id) && item.spec.join('') === variant.spec.join('')
                                  );
                                });

                                if (lineItemData) {
                                  // 原陣列就有的商品
                                  lineItemData.count++;
                                  if (Object.keys(lineItemData.deduction_log || {}).length > 0) {
                                    const key = Object.keys(lineItemData.deduction_log)[0];
                                    lineItemData.deduction_log[key]++;
                                  }
                                } else {
                                  // 新增的商品
                                  const itemObject = getNewItem(Number(specData.id), product, variant);
                                  orderData.orderData.lineItems.push(itemObject);
                                }
                              });
                            }
                            gvc.notifyDataChange(id);
                          });
                        },
                      });
                    }),
                  })}
                </div>
              </div>
              ${BgWidget.horizontalLine()}
              ${[
                {
                  title: '小計',
                  description: `${orderData.orderData.lineItems
                    .map(dd => Number(dd.count))
                    .reduce((accumulator, currentValue) => accumulator + currentValue, 0)} 件商品`,
                  total: `$${subtotal.toLocaleString()}`,
                },
                {
                  title: '運費',
                  description: '',
                  total: `$${orderData.orderData.shipment_fee.toLocaleString()}`,
                },
                ...(orderData.orderData.use_rebate
                  ? [
                      {
                        title: '回饋金',
                        description: '',
                        total: `- $${orderData.orderData.use_rebate.toLocaleString()}`,
                      },
                    ]
                  : []),
                ...(orderData.orderData.use_wallet && `${orderData.orderData.use_wallet}` !== '0'
                  ? [
                      {
                        title: '錢包',
                        description: `使用錢包扣款`,
                        total: `- $${orderData.orderData.use_wallet.toLocaleString()}`,
                      },
                    ]
                  : []),
                ...orderData.orderData.voucherList.map((dd: any) => {
                  const descHTML = html` <div
                    style="color: #8D8D8D; font-size: 14px; white-space: nowrap; text-overflow: ellipsis;"
                  >
                    ${dd.title}
                  </div>`;
                  const rebackMaps: Record<string, { title: string; description: string; total: string }> = {
                    add_on_items: {
                      title: '加購優惠',
                      description: descHTML,
                      total: '－',
                    },
                    giveaway: {
                      title: '滿額贈送',
                      description: descHTML,
                      total: '－',
                    },
                    rebate: {
                      title: '回饋購物金',
                      description: descHTML,
                      total: `${dd.rebate_total} 點`,
                    },
                    default: {
                      title: dd.id == 0 ? '手動調整' : '折扣',
                      description: descHTML,
                      total: (() => {
                        const status = dd.discount_total > 0;
                        const isMinus = status ? '-' : '';
                        const isNegative = status ? 1 : -1;
                        return `${isMinus} $${(dd.discount_total * isNegative).toLocaleString()}`;
                      })(),
                    },
                  };

                  return rebackMaps[dd.reBackType] ?? rebackMaps.default;
                }),
                {
                  title: html`<span class="tx_700">總金額</span>`,
                  description: '',
                  total: html`<span class="tx_700"
                    >$${(
                      subtotal -
                      orderData.orderData.discount +
                      orderData.orderData.shipment_fee -
                      orderData.orderData.use_rebate
                    ).toLocaleString()}</span
                  >`,
                },
              ]
                .map(dd => {
                  return html` <div class="d-flex align-items-center justify-content-end">
                    <div class="tx_normal_16" style="text-align: end;">${dd.title} ${dd.description ?? ''}</div>
                    <div class="tx_normal" style="width: 114px;display: flex;justify-content: end;">${dd.total}</div>
                  </div>`;
                })
                .join(BgWidget.mbContainer(18))}
              ${`${orderData.orderData.orderStatus ?? 0}` === '0'
                ? html`<div class="d-flex justify-content-end mt-3">
                    ${BgWidget.blueNote(
                      '手動調整訂單價格',
                      gvc.event(() => {
                        PosFunction.manualDiscount({
                          gvc,
                          orderDetail: orderData.orderData,
                          reload: voucher => {
                            orderData.orderData.total -= voucher.discount_total;
                            orderData.orderData.discount += voucher.discount_total;
                            gvc.notifyDataChange(id);
                          },
                        });
                      })
                    )}
                  </div>`
                : ''}
            </div>`;
          },
        });
      },
      footer_html: footerGVC => {
        return [
          BgWidget.cancel(
            footerGVC.event(() => {
              orderData = cloneData;
              footerGVC.closeDialog();
            })
          ),
          BgWidget.save(
            footerGVC.event(() => {
              function updateEvent() {
                // 重新計算總金額
                orderData.orderData.total =
                  getLineItemSubtotal(orderData.orderData.lineItems) -
                  orderData.orderData.discount +
                  orderData.orderData.shipment_fee -
                  orderData.orderData.use_rebate;

                dialog.dataLoading({ visible: true });

                ApiShop.putOrder({
                  id: `${orderData.id}`,
                  order_data: orderData.orderData,
                }).then(() => {
                  dialog.dataLoading({ visible: false });
                  footerGVC.closeDialog();
                  callback();
                });
              }

              dialog.checkYesOrNot({
                text: '此操作將會直接更新訂單明細，確定要更新嗎？',
                callback: bool => bool && updateEvent(),
              });
            }),
            '更新'
          ),
        ].join('');
      },
      closeCallback: () => {
        orderData = cloneData;
      },
    });
  }

  static useOrderTags(obj: {
    gvc: GVC;
    config_key: 'order_manager_tags';
    def: string[];
    callback: (dataArray: string[]) => void;
  }) {
    const gvc = obj.gvc;

    const vmt = {
      id: gvc.glitter.getUUID(),
      loading: true,
      search: '',
      dataList: [] as string[],
      postData: obj.def,
    };

    return BgWidget.settingDialog({
      gvc,
      title: '使用現有標籤',
      innerHTML: gvc2 => {
        return gvc2.bindView({
          bind: vmt.id,
          view: () => {
            if (vmt.loading) {
              return BgWidget.spinner();
            } else {
              return [
                BgWidget.searchPlace(
                  gvc2.event(e => {
                    vmt.search = e.value;
                    vmt.loading = true;
                    gvc2.notifyDataChange(vmt.id);
                  }),
                  vmt.search,
                  '搜尋標籤',
                  '0',
                  '0'
                ),
                BgWidget.renderOptions(gvc2, vmt),
              ].join(BgWidget.mbContainer(18));
            }
          },
          divCreate: {},
          onCreate: () => {
            if (vmt.loading) {
              ApiUser.getPublicConfig(obj.config_key, 'manager').then((dd: any) => {
                if (dd.result && dd.response?.value?.list) {
                  const responseList = dd.response.value.list;
                  const list = [...new Set([...responseList, ...obj.def])];
                  vmt.dataList = list.filter((item: string) => item.includes(vmt.search));
                }
                vmt.loading = false;
                gvc2.notifyDataChange(vmt.id);
              });
            }
          },
        });
      },
      footer_html: gvc2 => {
        return [
          html`<div
            style="color: #393939; text-decoration-line: underline; cursor: pointer"
            onclick="${gvc2.event(() => {
              vmt.postData = [];
              vmt.loading = true;
              gvc2.notifyDataChange(vmt.id);
            })}"
          >
            清除全部
          </div>`,
          BgWidget.cancel(
            gvc2.event(() => {
              gvc2.closeDialog();
            })
          ),
          BgWidget.save(
            gvc2.event(() => {
              obj.callback(vmt.postData);
              gvc2.closeDialog();
            })
          ),
        ].join('');
      },
    });
  }

  static async getOrderManagerTag() {
    return await ApiUser.getPublicConfig('order_manager_tags', 'manager').then((dd: any) => {
      if (dd.result && dd.response?.value?.list) {
        return dd.response.value.list.map((item: string) => {
          return {
            key: item,
            name: `#${item}`,
          };
        });
      }
      return [];
    });
  }
}
