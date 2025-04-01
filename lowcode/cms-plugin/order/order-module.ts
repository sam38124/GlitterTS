import { GVC } from '../../glitterBundle/GVController.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { BgWidget } from '../../backend-manager/bg-widget.js';
import { ApiDelivery } from '../../glitter-base/route/delivery.js';
import { PaymentConfig } from '../../glitter-base/global/payment-config.js';
import { ShipmentConfig } from '../../glitter-base/global/shipment-config.js';
import { PaymentPage } from '../pos-pages/payment-page.js';

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
}
