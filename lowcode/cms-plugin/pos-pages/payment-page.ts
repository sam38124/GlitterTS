import { OrderDetail, ViewModel } from './models.js';
import { GVC } from '../../glitterBundle/GVController.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { EditorElem } from '../../glitterBundle/plugins/editor-elem.js';
import { PosWidget } from '../pos-widget.js';
import { BgWidget } from '../../backend-manager/bg-widget.js';
import { FilterOptions } from '../filter-options.js';
import { ApiUser } from '../../glitter-base/route/user.js';
import { FormWidget } from '../../official_view_component/official/form.js';
import { CheckInput } from '../../modules/checkInput.js';
import { POSSetting } from '../POS-setting.js';
import { PayConfig } from './pay-config.js';
import { ApiDelivery } from '../../glitter-base/route/delivery.js';
import { IminModule } from './imin-module.js';
import { ConnectionMode } from './connection-mode.js';
import { PosFunction } from './pos-function.js';
import { TempOrder } from './temp-order.js';
import { PaymentFunction } from './payment-function.js';
import { UmClass } from '../../public-components/user-manager/um-class.js';
import { FormCheck } from '../module/form-check.js';
import { ShipmentConfig } from '../../glitter-base/global/shipment-config.js';

const html = String.raw;

export class PaymentPage {
  static async checkout(params: {
    line_items: any;
    user_info: any;
    code_array: string[];
    use_rebate: number;
  }): Promise<any> {
    const { line_items, user_info, code_array, use_rebate } = params;

    const orderDetail = await ApiShop.getCheckout({
      line_items,
      user_info,
      code_array,
      use_rebate,
      checkOutType: 'POS',
      pos_store: POSSetting.config.where_store,
    });

    return orderDetail.response.data;
  }

  public static shipmentSupport(orderDetail: any) {
    // 預設的取貨選項
    const defaultOptions = [{ title: '立即取貨', value: 'now' }];

    // 可用的運送選項
    const availableOptions = ShipmentConfig.list
      .filter(item => {
        const isPayNow = Boolean(item.paynow_id);
        const includeKey = item.value === 'normal' || item.value === 'shop';
        const isSupport = orderDetail.shipment_support.includes(item.value);
        return (isPayNow || includeKey) && isSupport;
      })
      .map(item => {
        return { title: item.title, value: item.value };
      });

    // 可用的運送選項(原)
    // const availableOptions = [
    //   { title: '一般宅配', value: 'normal' },
    //   { title: '全家店到店', value: 'FAMIC2C' },
    //   { title: '萊爾富店到店', value: 'HILIFEC2C' },
    //   { title: 'OK超商店到店', value: 'OKMARTC2C' },
    //   { title: '7-ELEVEN超商交貨便', value: 'UNIMARTC2C' },
    //   { title: '門市取貨', value: 'shop' },
    // ].filter(option => orderDetail.shipment_support.includes(option.value));

    // 合併預設選項和可用運送選項
    return defaultOptions.concat(availableOptions);
  }

  public static main(obj: { gvc: GVC; vm: ViewModel; ogOrderData: OrderDetail }) {
    // 沒有商品時返回空頁面
    if (!obj.ogOrderData.lineItems || obj.ogOrderData.lineItems.length === 0) {
      return POSSetting.emptyView('購物車是空的，請先選擇商品');
    }

    const gvc = obj.gvc;
    const vm = obj.vm;
    const dialog = new ShareDialog(gvc.glitter);
    PaymentPage.storeHistory(obj.ogOrderData);

    // 確保初始化包含預設值
    obj.ogOrderData.pos_info = obj.ogOrderData.pos_info || {
      payment: [
        {
          method: 'cash',
          total: 0,
        },
      ],
    };
    obj.ogOrderData.orderID = obj.ogOrderData.orderID || `${new Date().getTime()}`;
    obj.ogOrderData.pos_info.payment = obj.ogOrderData.pos_info.payment ?? [];
    obj.ogOrderData.pos_info.payment.map((dd: any) => {
      if (!dd.total) {
        dd.paied = false;
      }
    });
    obj.ogOrderData.use_rebate = Number(obj.ogOrderData.use_rebate) || 0;

    return gvc.bindView(() => {
      const id = 'checkout-page';
      let last_to = 0;

      function refreshOrderView() {
        try {
          last_to = document.querySelector('.right_pan_payment')!!.scrollTop;
        } catch (e) {}
        gvc.notifyDataChange(id);
      }

      return {
        bind: id,
        view: () => {
          return new Promise(async (resolve, reject) => {
            //後端返回的訂單資料預覽
            const orderDetail = await (async () => {
              dialog.dataLoading({ visible: true });
              const userInfo = obj.ogOrderData.user_info || {};
              userInfo.shipment = userInfo.shipment || 'now';

              const orderDetail =
                (await this.checkout({
                  line_items: obj.ogOrderData.lineItems,
                  user_info: userInfo,
                  code_array: obj.ogOrderData.code_array || [],
                  use_rebate: obj.ogOrderData.use_rebate,
                })) || {};

              // 確保 voucherList 存在
              obj.ogOrderData.voucherList = obj.ogOrderData.voucherList || [];

              // 添加缺少的 voucher
              obj.ogOrderData.voucherList.forEach((item: any) => {
                if (!orderDetail.voucherList.some((v: any) => v.id === item.id)) {
                  orderDetail.voucherList.push(item);
                }
              });

              orderDetail.orderID = obj.ogOrderData.orderID;
              orderDetail.pos_info = obj.ogOrderData.pos_info;
              dialog.dataLoading({ visible: false });

              if (
                !PaymentPage.shipmentSupport(orderDetail).find(dd => {
                  return dd.value === obj.ogOrderData.user_info.shipment;
                })
              ) {
                (obj.ogOrderData.user_info.shipment as any) = 'now';
              }
              //儲存資料至本地暫存
              obj.ogOrderData.lineItems = obj.ogOrderData.lineItems.filter(dd => {
                return orderDetail.lineItems.find((d1: any) => {
                  return dd.id + dd.spec.join('-') === d1.id + d1.spec.join('-');
                });
              });
              PaymentPage.storeHistory(obj.ogOrderData);
              if (obj.ogOrderData.lineItems.length === 0) {
                vm.type = 'menu';
              }
              return orderDetail;
            })();
            const ap_config = (await ApiUser.getPublicConfig('store-information', 'manager')).response.value;
            ap_config.support_pos_payment = ap_config.support_pos_payment ?? [];
            setTimeout(() => {
              document.querySelector('.right_pan_payment')!!.scrollTop = last_to;
            }, 10);
            gvc.glitter.share.rebateConfig = await UmClass.getRebateInfo();
            const rebateTitle = gvc.glitter.share.rebateConfig.title ?? '購物金';
            gvc.glitter.share.rebateConfig.title = rebateTitle;
            const hasWeighing = orderDetail.lineItems.find((item: any) => item.product_category === 'weighing');
            resolve(
              html` <div
                  class="left-panel"
                  style="${document.body.offsetWidth < 800
                    ? `width:calc(100%);padding: 20px 18px;height:auto;background:#FFF;`
                    : `width:calc(100% - 446px);padding: 32px 36px;`}overflow: auto;"
                >
                  ${PosWidget.bigTitle('訂單明細')}
                  <div
                    class="d-flex flex-column ${document.body.offsetWidth < 800 ? `` : ``}"
                    style="${document.body.offsetWidth < 800
                      ? ``
                      : `padding:24px;border-radius: 10px;background: #FFF;box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.08);margin-top:32px;`}"
                  >
                    <div
                      class="d-none d-sm-flex"
                      style="padding:15px 0;background: #F6F6F6;border-radius: 10px;font-weight: 700;"
                    >
                      <div class="col-6 text-left" style="padding-left: 23px;">商品名稱</div>
                      <div class="col-2 text-center d-none">規格</div>
                      <div class="col-2 text-start">單位價</div>
                      <div class="col-2 text-center">數量${hasWeighing ? ' / 重量' : ''}</div>
                      <div class="col-2 text-center">小計</div>
                    </div>
                    <div class="d-flex flex-column" style="${document.body.offsetWidth < 800 ? `` : ``}">
                      ${(() => {
                        if (orderDetail.lineItems.length > 0) {
                          return orderDetail.lineItems
                            .map((data: any, index: number) => {
                              return html`
                                <div class="d-flex" style="">
                                  <div class="col-12 col-sm-6 d-flex align-items-center">
                                    <div
                                      class="d-flex flex-column align-items-center justify-content-center"
                                      style="gap:5px;width:75px;"
                                    >
                                      <div style="height: 20px;"></div>
                                      <div
                                        style="width: 70px;height: 70px; min-width: 70px;min-height: 70px; border-radius: 5px;background: 50%/cover url('${data.preview_image ||
                                        'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg'}')"
                                      ></div>
                                      <div
                                        style="font-size: 13px;height: 20px;"
                                        class="fw-500 ${data.pre_order ? `text-danger` : ``}"
                                      >
                                        庫存:${(() => {
                                          if (`${data.show_understocking}` === 'false') {
                                            return `不追蹤`;
                                          } else {
                                            return (
                                              (data.stockList[POSSetting.config.where_store] &&
                                                data.stockList[POSSetting.config.where_store].count) ||
                                              0
                                            );
                                          }
                                        })()}
                                      </div>
                                    </div>
                                    <div
                                      class="d-flex flex-column py-2"
                                      onclick="${gvc.event(() => {
                                        const def = obj.ogOrderData.lineItems?.[index]?.count || 0;

                                        PosFunction.setMoney(
                                          gvc,
                                          def,
                                          count => {
                                            obj.ogOrderData.lineItems[index].count = count;
                                            refreshOrderView();
                                          },
                                          '更改商品數量'
                                        );
                                      })}"
                                      style="font-size: 16px;font-style: normal;font-weight: 500;letter-spacing: 0.64px;margin-left: 12px;"
                                    >
                                      <div class="d-flex justify-content-center flex-column" style="gap:5px;">
                                        ${(() => {
                                          if (!data.pre_order) {
                                            return ``;
                                          } else {
                                            return html` <div>${BgWidget.dangerInsignia('需預購')}</div>`;
                                          }
                                        })()}
                                        ${data.title}
                                      </div>
                                      <span
                                        style="color: #949494; font-size: 16px; font-style: normal; font-weight: 500; line-height: normal; letter-spacing: 0.64px; text-transform: uppercase;"
                                      >
                                        ${(() => {
                                          return data.spec.length > 0
                                            ? data.spec
                                                .map((spec: any) => {
                                                  return html` ${spec}`;
                                                })
                                                .join(',')
                                            : html``;
                                        })()}
                                      </span>

                                      ${document.body.clientWidth < 800
                                        ? html` <div
                                            style="color: #393939; font-size: 16px; font-style: normal; font-weight: 400; line-height: normal; letter-spacing: 0.64px; text-transform: uppercase;"
                                          >
                                            NT.${parseInt(data.sale_price as any, 10).toLocaleString()}
                                            ${document.body.clientWidth < 800 ? `x` : ``} ${data.count}
                                          </div>`
                                        : ``}
                                    </div>
                                    <div class="flex-fill"></div>
                                    <div
                                      class="d-sm-none d-flex align-items-center justify-content-center flex-column"
                                      style="gap:0px;"
                                      onclick="${gvc.event(() => {
                                        const n = obj.ogOrderData.lineItems?.[index]?.custom_price || 0;

                                        PosFunction.setMoney(
                                          gvc,
                                          n,
                                          money => {
                                            if (money === data.sale_price) {
                                              delete obj.ogOrderData.lineItems[index].custom_price;
                                            } else {
                                              obj.ogOrderData.lineItems[index].custom_price = money;
                                            }
                                            refreshOrderView();
                                          },
                                          '更改商品單價'
                                        );
                                      })}"
                                    >
                                      ${(() => {
                                        function formatPrice(price: any) {
                                          return `$${parseInt(`${price}`, 10).toLocaleString()}`;
                                        }

                                        if (data.variant_sale_price && data.sale_price !== data.variant_sale_price) {
                                          return html`
                                            <span class="text-decoration-line-through"
                                              >${formatPrice(data.variant_sale_price * data.count)}</span
                                            >
                                            <span class="text-danger"
                                              >${formatPrice(data.sale_price * data.count)}</span
                                            >
                                          `;
                                        }

                                        return html` <span>${formatPrice(data.sale_price * data.count)}</span> `;
                                      })()}
                                    </div>
                                  </div>
                                  <div class="col-2 d-none d-sm-flex align-items-center justify-content-start">
                                    $${parseInt(data.sale_price as any, 10).toLocaleString()}
                                  </div>
                                  <div
                                    class="col-3 col-lg-2 d-flex align-items-center justify-content-center d-none d-sm-flex"
                                    style="gap:10px;cursor: pointer;"
                                    onclick="${gvc.event(() => {
                                      const def = obj.ogOrderData.lineItems?.[index]?.count || 0;

                                      PosFunction.setMoney(
                                        gvc,
                                        def,
                                        count => {
                                          obj.ogOrderData.lineItems[index].count = count;
                                          refreshOrderView();
                                        },
                                        '更改商品數量'
                                      );
                                    })}"
                                  >
                                    ${Number(data.count as any).toLocaleString()}
                                  </div>
                                  <div
                                    class="col-3 col-lg-2 d-flex align-items-center justify-content-center  d-none d-sm-flex"
                                    style="gap:10px;cursor: pointer;"
                                    onclick="${gvc.event(() => {
                                      const def = obj.ogOrderData.lineItems?.[index]?.custom_price || 0;

                                      PosFunction.setMoney(
                                        gvc,
                                        def,
                                        money => {
                                          if (money === data.sale_price) {
                                            delete obj.ogOrderData.lineItems[index].custom_price;
                                          } else {
                                            obj.ogOrderData.lineItems[index].custom_price = money;
                                          }
                                          refreshOrderView();
                                        },
                                        '更改商品單價'
                                      );
                                    })}"
                                  >
                                    ${(() => {
                                      function formatPrice(price: any) {
                                        return `$${parseInt(`${price}`, 10).toLocaleString()}`;
                                      }

                                      if (data.variant_sale_price && data.sale_price !== data.variant_sale_price) {
                                        return html`
                                          <span class="text-decoration-line-through"
                                            >${formatPrice(data.variant_sale_price * data.count)}</span
                                          >
                                          <span class="text-danger">${formatPrice(data.sale_price * data.count)}</span>
                                        `;
                                      }

                                      return html` <span>${formatPrice(data.sale_price * data.count)}</span> `;
                                    })()}
                                  </div>
                                </div>
                              `;
                            })
                            .join(
                              (() => {
                                if (document.body.clientWidth < 800) {
                                  return `<div style="margin-top: 20px;background: #DDD;width: 100%;height: 1px;"></div>`;
                                } else {
                                  return `<div style=""></div>`;
                                }
                              })()
                            );
                        }
                        return ``;
                      })()}
                    </div>
                  </div>
                  ${PosWidget.bigTitle('會員', 'margin-top:32px;margin-bottom:18px;')}
                  ${gvc.bindView(() => {
                    orderDetail.user_info = orderDetail.user_info ?? {};
                    if (obj.ogOrderData.user_info.email === 'no-email') {
                      obj.ogOrderData.user_info.email = '';
                    }
                    const vm: {
                      id: string;
                      type: 'old' | 'new';
                    } = {
                      id: gvc.glitter.getUUID(),
                      type: `old`,
                    };

                    return {
                      bind: vm.id,
                      view: () => {
                        const view = [
                          html` <div class="w-100 d-flex flex-fill">
                            <div
                              class="w-100 d-flex align-items-center justify-content-center"
                              style="cursor:pointer;flex:1; height: 65px; ${vm.type === 'old'
                                ? `border-radius: 0px 10px 0px 0px; background: #FFF;`
                                : ``}"
                              onclick="${gvc.event(() => {
                                vm.type = 'old';
                                gvc.notifyDataChange(vm.id);
                              })}"
                            >
                              ${PosWidget.bigTextItem('已有會員')}
                            </div>
                            <div
                              class="w-100 d-flex align-items-center justify-content-center"
                              style="cursor:pointer;flex:1; height: 65px;${vm.type === 'new'
                                ? `border-radius: 10px 10px 0px 0px; background: #FFF;`
                                : ``}"
                              onclick="${gvc.event(() => {
                                vm.type = 'new';
                                gvc.notifyDataChange(vm.id);
                              })}"
                            >
                              ${PosWidget.bigTextItem('新建會員')}
                            </div>
                          </div>`,
                        ];
                        if (vm.type === 'old') {
                          view.push(
                            gvc.bindView(() => {
                              const id = gvc.glitter.getUUID();
                              return {
                                bind: id,
                                view: () => {
                                  const inView: string[] = [
                                    html` <div class="d-flex align-items-center" style="gap:14px;">
                                      <div
                                        style="flex:1;height: 44px; padding: 8px 18px;border-radius: 10px; border: 1px #DDDDDD solid; justify-content: center; align-items: center; gap: 8px; display: inline-flex;cursor:pointer;"
                                        onclick="${gvc.event(() => {
                                          BgWidget.selectDropDialog({
                                            gvc: gvc,
                                            title: '搜尋特定顧客',
                                            tag: 'select_users',
                                            updownOptions: FilterOptions.userOrderBy,
                                            callback: value => {},
                                            custom_line_items: (data: any) => {
                                              return html` <div
                                                class="w-100 border-bottom pb-3"
                                                style="padding-left: 8px; padding-right: 8px; background: white;  justify-content: flex-start; align-items: center; gap: 8px; display: inline-flex;cursor: pointer;"
                                                onclick="${gvc.event(() => {
                                                  obj.ogOrderData.user_info.id = data.key;
                                                  obj.ogOrderData.user_info.email = data.user_data.email;
                                                  obj.ogOrderData.user_info.phone = data.user_data.phone;
                                                  refreshOrderView();
                                                  gvc.glitter.closeDiaLog('select_users');
                                                })}"
                                              >
                                                <div
                                                  style="flex: 1 1 0; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: inline-flex"
                                                >
                                                  <div
                                                    style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 6px; display: inline-flex"
                                                  >
                                                    <div
                                                      style="color: #393939; font-size: 20px;  font-weight: 400; word-wrap: break-word"
                                                    >
                                                      ${data.user_data.name}
                                                    </div>
                                                  </div>
                                                  <div
                                                    style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; display: flex"
                                                  >
                                                    <div
                                                      style="align-self: stretch; color: #8D8D8D; font-size: 16px;  font-weight: 400; word-wrap: break-word"
                                                    >
                                                      ${data.user_data.phone || ''}
                                                    </div>
                                                    <div
                                                      style="align-self: stretch; color: #8D8D8D; font-size: 16px;  font-weight: 400; word-wrap: break-word"
                                                    >
                                                      ${data.user_data.email}
                                                    </div>
                                                  </div>
                                                </div>
                                                <div
                                                  style="padding: 4px 10px;background: #393939; border-radius: 7px; justify-content: center; align-items: center; gap: 10px; display: flex"
                                                >
                                                  <div
                                                    style="color: white; font-size: 16px;  font-weight: 700; word-wrap: break-word"
                                                  >
                                                    ${data.tag_name}
                                                  </div>
                                                </div>
                                              </div>`;
                                            },
                                            default: [''],
                                            single: true,
                                            api: (data: { query: string; orderString: string }) => {
                                              return new Promise(resolve => {
                                                ApiUser.getUserList({
                                                  page: 0,
                                                  limit: 99999,
                                                  search: data.query,
                                                  only_id: true,
                                                }).then(dd => {
                                                  if (dd.response.data) {
                                                    resolve(
                                                      dd.response.data.map(
                                                        (item: {
                                                          userID: number;
                                                          userData: {
                                                            name: string;
                                                            email: string;
                                                          };
                                                        }) => {
                                                          return {
                                                            key: item.userID,
                                                            value: item.userData.name ?? '（尚無姓名）',
                                                            note: item.userData.email,
                                                            user_data: item.userData,
                                                            tag_name: (item as any).tag_name,
                                                          };
                                                        }
                                                      )
                                                    );
                                                  }
                                                });
                                              });
                                            },
                                            style: 'width: 100%;',
                                          });
                                        })}"
                                      >
                                        <div
                                          style="flex: 1 1 0; height: 22px; justify-content: center; align-items: center; gap: 8px; display: flex"
                                        >
                                          <i class="fa-solid fa-magnifying-glass" style="color: #8D8D8D;"></i>
                                          <div
                                            style="flex: 1 1 0; color: #8D8D8D; font-size: 16px;  font-weight: 400; word-wrap: break-word"
                                          >
                                            搜尋會員信箱 / 電話 / 編號
                                          </div>
                                        </div>
                                      </div>
                                      <div
                                        class=""
                                        style="display: flex; width: 44px; height: 44px; padding: 8px 10px; border-radius: 10px; border: 1px solid #DDD; justify-content: center; align-items: center; gap: 8px; flex-shrink: 0;"
                                        onclick="${gvc.event(() => {
                                          gvc.glitter.runJsInterFace('start_scan', {}, async res => {
                                            const dialog = new ShareDialog(gvc.glitter);
                                            const user = await ApiUser.getUsersData(res.text.replace('user-', ''));
                                            if (!user.response || !user.response.account) {
                                              dialog.errorMessage({ text: '查無此會員' });
                                            } else {
                                              OrderDetail.singleInstance.user_info.email = user.response.userData.email;
                                              OrderDetail.singleInstance.user_info.phone = user.response.userData.phone;
                                              gvc.notifyDataChange(['checkout-page']);
                                            }
                                          });
                                        })}"
                                      >
                                        <i class="fa-solid fa-barcode-read fs-5"></i>
                                      </div>
                                    </div>`,
                                  ];
                                  if (obj.ogOrderData.user_info.email || obj.ogOrderData.user_info.phone) {
                                    inView.push(
                                      gvc.bindView(() => {
                                        const vm: {
                                          loading: boolean;
                                          id: string;
                                          user_data: any;
                                          rebate: number;
                                        } = {
                                          loading: true,
                                          id: gvc.glitter.getUUID(),
                                          user_data: {},
                                          rebate: 0,
                                        };
                                        ApiUser.getUsersDataWithEmailOrPhone(
                                          obj.ogOrderData.user_info.email || obj.ogOrderData.user_info.phone
                                        ).then(res => {
                                          vm.user_data = res.response;
                                          vm.loading = false;
                                          ApiUser.getUserRebate({ id: vm.user_data.userID }).then(res => {
                                            vm.rebate = res.response.data.point;
                                            gvc.notifyDataChange(vm.id);
                                          });
                                        });
                                        return {
                                          bind: vm.id,
                                          view: () => {
                                            if (vm.loading) {
                                              return html` <div
                                                class="w-100 d-flex align-items-center justify-content-center"
                                              >
                                                <div class="spinner-border"></div>
                                              </div>`;
                                            } else {
                                              return html` <div
                                                  style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 6px; display: inline-flex"
                                                >
                                                  <div
                                                    class="d-flex align-items-center"
                                                    style="flex: 1 1 0; color: #393939; font-size: 24px;  font-weight: 400; word-wrap: break-word;gap:10px;"
                                                  >
                                                    ${vm.user_data.userData.name}
                                                    <div
                                                      style="color: #4D86DB; font-size: 16px; font-style: normal; font-weight: 400; line-height: normal; letter-spacing: 0.72px; text-transform: uppercase;cursor:pointer;"
                                                      onclick="${gvc.event(() => {
                                                        obj.ogOrderData.use_rebate = 0;
                                                        obj.ogOrderData.user_info.id = 0;
                                                        obj.ogOrderData.user_info.email = '';
                                                        obj.ogOrderData.user_info.phone = '';
                                                        refreshOrderView();
                                                      })}"
                                                    >
                                                      移除選擇
                                                    </div>
                                                  </div>
                                                  <div
                                                    style="width: 68px; padding-left: 6px; padding-right: 6px; padding-top: 4px; padding-bottom: 4px; background: #393939; border-radius: 7px; justify-content: center; align-items: center; gap: 10px; display: flex"
                                                  >
                                                    <div
                                                      style="color: white; font-size: 14px;  font-weight: 700; word-wrap: break-word"
                                                    >
                                                      ${vm.user_data.member_level.tag_name}
                                                    </div>
                                                  </div>
                                                </div>
                                                <div
                                                  style="align-self: stretch;  flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 6px; display: flex"
                                                >
                                                  ${[
                                                    {
                                                      title: '會員編號',
                                                      value: vm.user_data.userID,
                                                    },
                                                    {
                                                      title: '會員生日',
                                                      value: vm.user_data.userData.birth || '未填寫',
                                                    },
                                                    {
                                                      title: '會員電話',
                                                      value: vm.user_data.userData.phone || '未填寫',
                                                    },
                                                    {
                                                      title: '會員信箱',
                                                      value: vm.user_data.userData.email || '未填寫',
                                                    },
                                                    {
                                                      title: '會員地址',
                                                      value: vm.user_data.userData.address || '未填寫',
                                                    },
                                                    {
                                                      title: '持有購物金',
                                                      value: `${vm.rebate.toLocaleString()}點`,
                                                    },
                                                    ...(() => {
                                                      const leadData = JSON.parse(JSON.stringify(vm.user_data.member))
                                                        .reverse()
                                                        .find((dd: any) => {
                                                          return !dd.trigger;
                                                        });
                                                      if (leadData) {
                                                        return [
                                                          {
                                                            title: (() => {
                                                              return html`
                                                                <div
                                                                  style=" flex-direction: column; justify-content: flex-start; align-items: flex-start; display: inline-flex"
                                                                >
                                                                  升等條件
                                                                  <div
                                                                    style="color: #8D8D8D; font-size: 16px;  font-weight: 400; word-wrap: break-word"
                                                                  >
                                                                    ${(() => {
                                                                      const condition_val =
                                                                        leadData.og.condition.value.toLocaleString();
                                                                      if (leadData.og.condition.type === 'total') {
                                                                        if (leadData.og.duration.type === 'noLimit') {
                                                                          return `*累積消費額達${condition_val}`;
                                                                        } else {
                                                                          return `*${leadData.og.duration.value}天內累積消費額達${condition_val}`;
                                                                        }
                                                                      } else {
                                                                        return `*單筆消費達${condition_val}`;
                                                                      }
                                                                    })()}
                                                                  </div>
                                                                </div>
                                                              `;
                                                            })(),
                                                            value: `還差${(leadData.leak ?? 0).toLocaleString()}`,
                                                          },
                                                        ];
                                                      } else {
                                                        return [];
                                                      }
                                                    })(),
                                                    ...(() => {
                                                      if (
                                                        vm.user_data.member_level.dead_line &&
                                                        vm.user_data.member_level.re_new_member
                                                      ) {
                                                        return [
                                                          {
                                                            title: (() => {
                                                              return html`
                                                                <div
                                                                  style=" flex-direction: column; justify-content: flex-start; align-items: flex-start; display: inline-flex"
                                                                >
                                                                  續等條件
                                                                  <div
                                                                    style="color: #8D8D8D; font-size: 16px;  font-weight: 400; word-wrap: break-word"
                                                                  >
                                                                    ${(() => {
                                                                      const leadData = JSON.parse(
                                                                        JSON.stringify(
                                                                          vm.user_data.member_level.re_new_member
                                                                        )
                                                                      );
                                                                      const condition_val =
                                                                        leadData.og.condition.value.toLocaleString();
                                                                      if (leadData.og.condition.type === 'total') {
                                                                        if (leadData.og.duration.type === 'noLimit') {
                                                                          return `*累積消費額達${condition_val}`;
                                                                        } else {
                                                                          return `*${leadData.og.duration.value}天內累積消費額達${condition_val}`;
                                                                        }
                                                                      } else {
                                                                        return `*單筆消費達${condition_val}`;
                                                                      }
                                                                    })()}
                                                                  </div>
                                                                </div>
                                                              `;
                                                            })(),
                                                            value: (() => {
                                                              if (!vm.user_data.member_level.re_new_member.leak) {
                                                                return `已達成`;
                                                              } else {
                                                                return `還差${Number(vm.user_data.member_level.re_new_member.leak).toLocaleString()}`;
                                                              }
                                                            })(),
                                                          },
                                                        ];
                                                      } else {
                                                        return [];
                                                      }
                                                    })(),
                                                    {
                                                      title: '會員備註',
                                                      value: vm.user_data.userData.note || '無',
                                                    },
                                                  ]
                                                    .map(dd => {
                                                      return html` <div
                                                        style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 2px; display: flex"
                                                      >
                                                        <div
                                                          style="color: #393939; font-size: 18px;  font-weight: 400; word-wrap: break-word;min-width: 113px;"
                                                        >
                                                          ${dd.title}
                                                        </div>
                                                        <div class="flex-fill"></div>
                                                        <div
                                                          style="color: #393939; font-size: 18px;  font-weight: 400; word-break: break-all;white-space: normal;text-align: right;"
                                                        >
                                                          ${dd.value}
                                                        </div>
                                                      </div>`;
                                                    })
                                                    .join('')}
                                                </div>`;
                                            }
                                          },
                                          divCreate: {
                                            class: `w-100 my-3`,
                                            style: `padding: 20px; border-radius: 10px; border: 1px #DDDDDD solid; flex-direction: column; justify-content: flex-start; align-items: flex-end; gap: 18px; display: inline-flex;`,
                                          },
                                        };
                                      })
                                    );
                                  }
                                  return inView.join('');
                                },
                                divCreate: {
                                  class: ` p-3 bg-white`,
                                  style: `gap:14px;`,
                                },
                              };
                            })
                          );
                          return view.join('');
                        } else {
                          let userData: any = {
                            name: '',
                            email: '',
                            phone: '',
                            birth: '',
                            address: '',
                            managerNote: '',
                          };
                          const saasConfig: {
                            config: any;
                            api: any;
                          } = (window.parent as any).saasConfig;
                          view.push(
                            gvc.bindView(() => {
                              const id = gvc.glitter.getUUID();
                              return {
                                bind: id,
                                view: () => {
                                  return new Promise(async resolve => {
                                    const formList = FormCheck.initialRegisterForm(
                                      (await ApiUser.getPublicConfig('custom_form_register', 'manager')).response.value
                                        .list ?? []
                                    );

                                    let need_check: any = {};

                                    function loopForm(data: any, refer_obj: any) {
                                      let h = '';
                                      data.map((item: any) => {
                                        if (item.hidden) {
                                          return ``;
                                        }
                                        if (item.require) {
                                          need_check[item.key] = true;
                                        }
                                        switch (item.page) {
                                          case 'input':
                                            h += html` <div>
                                              <div class="tx_normal">${item.title}</div>
                                              <div>
                                                ${BgWidget.editeInput({
                                                  gvc: gvc,
                                                  title: '',
                                                  default: refer_obj[item.key] || '',
                                                  placeHolder: `請輸入${item.title}`,
                                                  callback: text => {
                                                    refer_obj[item.key] = text;
                                                  },
                                                  readonly: false,
                                                })}
                                              </div>
                                            </div>`;
                                            break;
                                          case 'multiple_line_text':
                                            h += html` <div>
                                              <div class="tx_normal">${item.title}</div>
                                              ${BgWidget.textArea({
                                                gvc: gvc,
                                                title: '',
                                                default: refer_obj[item.key] || '',
                                                placeHolder: `請輸入${item.title}`,
                                                callback: text => {
                                                  refer_obj[item.key] = text;
                                                },
                                                readonly: false,
                                              })}
                                            </div>`;
                                            break;
                                          default:
                                            h += FormWidget.editorView({
                                              gvc: gvc,
                                              array: [item],
                                              refresh: () => {},
                                              formData: refer_obj,
                                              readonly: 'write',
                                            });
                                            break;
                                        }
                                      });
                                      return h;
                                    }

                                    // 預設用戶表單
                                    const form_array_view: any = [
                                      html` <div style="display:flex; gap: 12px; flex-direction: column;">
                                        ${loopForm(formList, userData)}
                                      </div>`,
                                    ];

                                    resolve(
                                      form_array_view.join(`<div class="my-4 border"></div>`) +
                                        html` <div class="d-flex align-content-end justify-content-end pt-3">
                                          ${BgWidget.save(
                                            gvc.event(async () => {
                                              const dialog = new ShareDialog(gvc.glitter);
                                              if (CheckInput.isEmpty(userData.name)) {
                                                dialog.infoMessage({ text: '請輸入顧客姓名' });
                                                return;
                                              }

                                              if (!CheckInput.isEmail(userData.email) && need_check.email) {
                                                dialog.infoMessage({ text: '請輸入正確的電子信箱格式' });
                                                return;
                                              }

                                              if (
                                                !CheckInput.isEmpty(userData.phone) &&
                                                !CheckInput.isTaiwanPhone(userData.phone) &&
                                                need_check.phone
                                              ) {
                                                dialog.infoMessage({ text: BgWidget.taiwanPhoneAlert() });
                                                return;
                                              }

                                              if (!CheckInput.isBirthString(userData.birth) && need_check.birth) {
                                                dialog.infoMessage({
                                                  text: html`
                                                    <div class="text-center">
                                                      生日日期無效，請確認年月日是否正確<br />(ex: 19950107)
                                                    </div>
                                                  `,
                                                });
                                                return;
                                              }
                                              const [email_count, phone_count] = await Promise.all([
                                                ApiUser.getEmailCount(userData.email),
                                                ApiUser.getPhoneCount(userData.phone),
                                              ]);
                                              if (email_count.response.result && need_check.email) {
                                                dialog.dataLoading({ visible: false });
                                                dialog.errorMessage({ text: '此信箱已被註冊' });
                                                return;
                                              }
                                              if (phone_count.response.result && need_check.phone) {
                                                dialog.dataLoading({ visible: false });
                                                dialog.errorMessage({ text: '此電話已被註冊' });
                                                return;
                                              }
                                              dialog.dataLoading({ visible: true });
                                              ApiUser.quickRegister({
                                                account: userData.email || userData.phone,
                                                pwd: gvc.glitter.getUUID(),
                                                userData: userData,
                                              }).then(r => {
                                                dialog.dataLoading({ visible: false });
                                                if (!r.result) {
                                                  dialog.errorMessage({ text: '沒有權限' });
                                                } else {
                                                  dialog.infoMessage({ text: '成功新增會員' });
                                                  obj.ogOrderData.user_info.email = userData.email;
                                                  obj.ogOrderData.user_info.phone = userData.phone;
                                                  refreshOrderView();
                                                }
                                              });
                                            })
                                          )}
                                        </div>`
                                    );
                                  });
                                },
                                divCreate: {
                                  class: `p-3 bg-white`,
                                },
                              };
                            })
                          );
                          return view.join('');
                        }
                      },
                      divCreate: {
                        class: `mx-sm-0`,
                        style: `
                                                    border-radius: 10px;
                                                    overflow: hidden;
                                                    background: #eaeaea;
                                                    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.15);
                                                `,
                      },
                    };
                  })}
                  ${PosWidget.bigTitle('訂單備註', 'margin-top:32px;margin-bottom:18px;')}
                  ${BgWidget.mainCard(
                    BgWidget.textArea({
                      gvc: gvc,
                      title: '',
                      default: orderDetail.user_info.note || '',
                      placeHolder: `請輸入訂單備註`,
                      callback: text => {
                        orderDetail.user_info.note = text;
                        obj.ogOrderData.user_info.note = text;
                        PaymentPage.storeHistory(obj.ogOrderData);
                      },
                      readonly: false,
                    }),
                    'p-0 p-sm-2'
                  )}
                </div>
                <div
                  class="right_pan_payment"
                  style="${document.body.offsetWidth < 800
                    ? `width:100%`
                    : `width: 446px;height: 100%;overflow: auto;`};padding: 20px;background: #FFF;box-shadow: 1px 0 10px 0 rgba(0, 0, 0, 0.10);"
                >
                  ${PosWidget.bigTitle('訂單款項')}
                  <div>訂單編號 : ${orderDetail.orderID}</div>
                  ${PaymentPage.spaceView()}
                  <div class="mb-2" style="font-size: 18px;font-weight: 700;letter-spacing: 0.72px;">配送方式</div>
                  ${EditorElem.select({
                    title: '',
                    def: obj.ogOrderData.user_info.shipment,
                    gvc: gvc,
                    array: PaymentPage.shipmentSupport(orderDetail),
                    callback: text => {
                      (obj.ogOrderData.user_info.shipment as any) = text;
                      PaymentPage.storeHistory(obj.ogOrderData);
                      gvc.notifyDataChange(id);
                    },
                  })}
                  ${(() => {
                    if (
                      ['FAMIC2C', 'HILIFEC2C', 'OKMARTC2C', 'UNIMARTC2C'].includes(obj.ogOrderData.user_info.shipment)
                    ) {
                      return html`
                        <div
                          class="mb-2"
                          style="margin-top: 14px;font-size: 18px;font-weight: 700;letter-spacing: 0.72px;"
                        >
                          門市選擇
                        </div>
                        <div
                          class="btn  w-100 text-white"
                          style="background: ${decodeURI(gvc.glitter.getUrlParameter('CVSStoreName') || '')
                            ? `#393939`
                            : `#d6293e`};"
                          onclick="${gvc.event(() => {
                            PaymentPage.storeHistory(obj.ogOrderData);
                            ApiDelivery.storeMaps({
                              returnURL: location.href,
                              logistics: obj.ogOrderData.user_info.shipment,
                            }).then(async res => {
                              $('body').html(res.response.form);
                              (document.querySelector('#submit') as any).click();
                            });
                          })}"
                        >
                          ${decodeURI(gvc.glitter.getUrlParameter('CVSStoreName') || '') || '請選擇到店門市'}
                        </div>
                      `;
                    } else if (obj.ogOrderData.user_info.shipment === 'normal') {
                      return `<input class="form-control mt-2" value="${obj.ogOrderData.user_info.address ?? ''}" onchange="${gvc.event(
                        (e, event) => {
                          obj.ogOrderData.user_info.address = e.value;
                        }
                      )}" placeholder="請輸入宅配地址">`;
                    } else {
                      return ``;
                    }
                  })()}
                  ${(() => {
                    if (obj.ogOrderData.user_info.shipment === 'now') {
                      return ``;
                    } else {
                      return html` ${PaymentPage.spaceView()}
                        <div
                          class="mb-2"
                          style="margin-top: 14px;font-size: 18px;font-weight: 700;letter-spacing: 0.72px;"
                        >
                          配送資訊
                        </div>
                        <div class="row  m-0 p-0 mb-n2">
                          ${[
                            {
                              title: '收件人姓名',
                              col: '6',
                              type: 'name',
                              key: 'name',
                            },
                            {
                              title: '收件人電話',
                              col: '6',
                              type: 'phone',
                              key: 'phone',
                            },
                            {
                              title: '聯絡信箱',
                              col: '12',
                              type: 'email',
                              key: 'email',
                            },
                          ]
                            .map(dd => {
                              return html` <div class="mb-2 col-${dd.col} ps-0" style="">
                                <div>
                                  <div
                                    class="fw-normal mb-2 fs-6"
                                    style="color: black; margin-bottom: 5px; white-space: normal;"
                                  >
                                    ${dd.title}
                                  </div>
                                  <input
                                    class="form-control"
                                    style="form-control"
                                    placeholder="請輸入${dd.title}"
                                    type="${dd.type}"
                                    value="${(obj.ogOrderData.user_info as any)[dd.key] || ''}"
                                    onchange="${gvc.event((e, event) => {
                                      (obj.ogOrderData.user_info as any)[dd.key] = e.value;
                                    })}"
                                  />
                                </div>
                              </div>`;
                            })
                            .join('')}
                        </div>`;
                    }
                  })()}
                  ${PaymentPage.spaceView()}
                  <div class="d-flex flex-column w-100" style="gap:8px;">
                    ${[
                      {
                        title: '小計總額',
                        hint: '',
                        value: (
                          Number(orderDetail.total) +
                          Number(orderDetail.discount) -
                          Number(orderDetail.shipment_fee) +
                          Number(orderDetail.use_rebate)
                        ).toLocaleString(),
                      },
                      ...(() => {
                        if (PayConfig.pos_config.pos_type === 'eat') {
                          return [];
                        } else {
                          return [
                            {
                              title: `運費`,
                              value: Number(orderDetail.shipment_fee).toLocaleString(),
                            },
                          ];
                        }
                      })(),
                      ...(() => {
                        if (orderDetail.use_rebate && orderDetail.use_rebate > 0) {
                          return [
                            {
                              title: `${gvc.glitter.share.rebateConfig.title}折抵`,
                              value: html` <div class="d-flex align-items-center" style="gap:5px;">
                                ${`-${Number(orderDetail.use_rebate).toLocaleString()}`}
                                <i
                                  class="fa-solid fa-xmark fs-5"
                                  style="color:#949494;"
                                  onclick="${gvc.event(() => {
                                    obj.ogOrderData.use_rebate = 0;
                                    gvc.notifyDataChange(id);
                                  })}"
                                ></i>
                              </div>`,
                            },
                          ];
                        } else {
                          return [];
                        }
                      })(),
                      ...(() => {
                        return (orderDetail as any).voucherList.map((dd: any, index: number) => {
                          return {
                            hint: dd.title,
                            value: html` <div class="d-flex align-items-center" style="gap:5px;">
                              ${dd.reBackType === 'rebate'
                                ? `+${dd.discount_total.toLocaleString()} ${gvc.glitter.share.rebateConfig.title}`
                                : (() => {
                                    const status = dd.discount_total > 0;
                                    const isMinus = status ? '-' : '';
                                    const isNegative = status ? 1 : -1;
                                    return `${isMinus} $${(dd.discount_total * isNegative).toLocaleString()}`;
                                  })()}
                              <i
                                class="fa-solid fa-xmark ${dd.code || dd.id === 0 ? `` : `d-none`} fs-5"
                                style="color:#949494;"
                                onclick="${gvc.event(() => {
                                  const dialog = new ShareDialog(gvc.glitter);
                                  dialog.checkYesOrNot({
                                    text: '是否確認刪除優惠券?',
                                    callback: response => {
                                      if (response) {
                                        if (dd.id === 0) {
                                          obj.ogOrderData.voucherList = obj.ogOrderData.voucherList.filter(
                                            (dd: any) => {
                                              return dd.id !== 0;
                                            }
                                          );
                                          gvc.notifyDataChange(id);
                                        } else {
                                          obj.ogOrderData.code_array = obj.ogOrderData.code_array!!.filter(d1 => {
                                            return d1 !== dd.code;
                                          });
                                          gvc.notifyDataChange(id);
                                        }
                                      }
                                    },
                                  });
                                })}"
                              ></i>
                            </div>`,
                            title: dd.id === 0 ? '手動折扣' : '活動折扣',
                          };
                        });
                      })(),
                    ]
                      .map(dd => {
                        return html` <div
                          class="w-100"
                          style=" justify-content: flex-start; align-items: center; gap: 10px; display: inline-flex;"
                        >
                          <div
                            style="flex: 1 1 0; flex-direction: column; justify-content: flex-start; align-items: flex-start; display: inline-flex"
                          >
                            <div
                              style="align-self: stretch; color: #393939; font-size: 18px;  text-transform: uppercase; letter-spacing: 0.72px; word-wrap: break-word"
                            >
                              ${dd.title}
                            </div>
                            <div
                              class="${dd.hint ? `` : 'd-none'}"
                              style="align-self: stretch; color: #8D8D8D; font-size: 16px; font-family: Noto Sans; text-transform: uppercase; letter-spacing: 0.64px; word-wrap: break-word"
                            >
                              ${dd.hint}
                            </div>
                          </div>
                          <div
                            style="color: #393939; font-size: 18px; font-family: Noto Sans; font-weight: 700; text-transform: uppercase; letter-spacing: 0.72px; word-wrap: break-word"
                          >
                            ${dd.value}
                          </div>
                        </div>`;
                      })
                      .join('')}
                    <div class="my-1"></div>
                    ${PosWidget.buttonSnow(
                      '新增優惠折扣',
                      gvc.event(() => {
                        PosFunction.selectVoucherAndRebate({
                          gvc: gvc,
                          notifyID: id,
                          orderData: obj.ogOrderData,
                        });
                      })
                    )}
                  </div>
                  ${PaymentPage.spaceView()}
                  ${gvc.bindView(() => {
                    const vm_id = gvc.glitter.getUUID();
                    orderDetail.voucherList.map((item: any) => {
                      if (item.id === 0) {
                        orderDetail.total -= item.discount_total;
                      }
                    });

                    return {
                      bind: vm_id,
                      dataList: [{ obj: vm, key: 'paySelect' }],
                      view: () => {
                        let view = [
                          html` <div class="d-flex" style="font-size: 18px;font-weight: 400;margin-bottom: 12px;">
                            <div>總金額</div>
                            <div class="ms-auto" style="font-size: 24px;font-weight: 700;">
                              ${parseInt(orderDetail.total as any, 10).toLocaleString()}
                            </div>
                          </div>`,
                          html`${PosWidget.bigTitle('付款方式')}
                          ${gvc.bindView({
                            bind: 'payment',
                            dataList: [{ obj: obj.ogOrderData.pos_info, key: 'payment' }],
                            view: () => {
                              if (
                                obj.ogOrderData.pos_info.payment.length === 1 &&
                                !obj.ogOrderData.pos_info.payment[0].paied
                              ) {
                                function drawIcon(black: boolean, type: string) {
                                  switch (type) {
                                    case 'cash':
                                      return html`
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="28"
                                          height="28"
                                          viewBox="0 0 28 28"
                                          fill="none"
                                        >
                                          <path
                                            d="M9.625 4.8125C9.625 4.81797 9.63047 4.84531 9.65781 4.89453C9.69063 4.96016 9.76719 5.06406 9.91484 5.19531C9.93672 5.21172 9.95859 5.23359 9.98047 5.25C8.95781 5.27187 7.9625 5.34297 7.00547 5.47422L7 4.8125C7 3.82812 7.53047 3.04062 8.15391 2.47734C8.77734 1.91406 9.61406 1.46562 10.5328 1.11563C12.3813 0.410156 14.8477 0 17.5 0C20.1523 0 22.6187 0.410156 24.4617 1.11016C25.3805 1.46016 26.2172 1.90859 26.8406 2.47187C27.4641 3.03516 28 3.82812 28 4.8125V10.5V16.1875C28 17.1719 27.4695 17.9594 26.8461 18.5227C26.2227 19.0859 25.3859 19.5344 24.4672 19.8844C23.9422 20.0867 23.368 20.2617 22.7555 20.4094V17.6914C23.0344 17.6094 23.2914 17.5219 23.532 17.4289C24.2758 17.1445 24.7898 16.8383 25.0906 16.5703C25.2383 16.4391 25.3148 16.3352 25.3477 16.2695C25.3805 16.2094 25.3805 16.1875 25.3805 16.1875V13.8031C25.0906 13.9453 24.7844 14.0766 24.4672 14.1969C23.9422 14.3992 23.368 14.5742 22.7555 14.7219V12.0039C23.0344 11.9219 23.2914 11.8344 23.532 11.7414C24.2758 11.457 24.7898 11.1508 25.0906 10.8828C25.2383 10.7516 25.3148 10.6477 25.3477 10.582C25.375 10.5328 25.3805 10.5055 25.3805 10.5V8.11562C25.0906 8.25781 24.7844 8.38906 24.4672 8.50938C23.718 8.79375 22.8594 9.03438 21.9352 9.21484C21.6562 8.80469 21.3336 8.45469 21.0164 8.17031C20.4641 7.67266 19.8242 7.26797 19.157 6.93438C20.8906 6.80859 22.4 6.48594 23.532 6.05391C24.2758 5.76953 24.7898 5.46328 25.0906 5.19531C25.2383 5.06406 25.3148 4.96016 25.3477 4.89453C25.375 4.84531 25.3805 4.81797 25.3805 4.8125C25.3805 4.8125 25.3805 4.78516 25.3477 4.73047C25.3148 4.66484 25.2383 4.56094 25.0906 4.42969C24.7898 4.15625 24.2758 3.85 23.532 3.57109C22.05 3.00234 19.9172 2.625 17.5 2.625C15.0828 2.625 12.95 3.00234 11.4734 3.56562C10.7297 3.85 10.2156 4.15625 9.91484 4.42422C9.76719 4.55547 9.69063 4.65938 9.65781 4.725C9.625 4.78516 9.625 4.80703 9.625 4.80703V4.8125ZM2.625 11.8125C2.625 11.818 2.63047 11.8453 2.65781 11.8945C2.69062 11.9602 2.76719 12.0641 2.91484 12.1953C3.21563 12.4688 3.72969 12.775 4.47344 13.0539C5.95 13.6172 8.08281 13.9945 10.5 13.9945C12.9172 13.9945 15.05 13.6172 16.5266 13.0539C17.2703 12.7695 17.7844 12.4633 18.0852 12.1953C18.2328 12.0641 18.3094 11.9602 18.3422 11.8945C18.3695 11.8453 18.375 11.818 18.375 11.8125C18.375 11.8125 18.375 11.7852 18.3422 11.7305C18.3094 11.6648 18.2328 11.5609 18.0852 11.4297C17.7844 11.1562 17.2703 10.85 16.5266 10.5711C15.05 10.0078 12.9172 9.63047 10.5 9.63047C8.08281 9.63047 5.95 10.0078 4.47344 10.5711C3.72969 10.8555 3.21563 11.1617 2.91484 11.4297C2.76719 11.5609 2.69062 11.6648 2.65781 11.7305C2.625 11.7906 2.625 11.8125 2.625 11.8125ZM0 11.8125C0 10.8281 0.530469 10.0406 1.15391 9.47734C1.77734 8.91406 2.61406 8.46562 3.53281 8.11562C5.38125 7.41016 7.84766 7 10.5 7C13.1523 7 15.6187 7.41016 17.4617 8.11016C18.3805 8.46016 19.2172 8.90859 19.8406 9.47188C20.4641 10.0352 21 10.8281 21 11.8125V17.5V23.1875C21 24.1719 20.4695 24.9594 19.8461 25.5227C19.2227 26.0859 18.3859 26.5344 17.4672 26.8844C15.6187 27.5898 13.1523 28 10.5 28C7.84766 28 5.38125 27.5898 3.53828 26.8898C2.61953 26.5398 1.78828 26.0914 1.15938 25.5281C0.530469 24.9648 0 24.1719 0 23.1875V17.5V11.8125ZM18.375 17.5V15.1156C18.0852 15.2578 17.7789 15.3891 17.4617 15.5094C15.6187 16.2148 13.1523 16.625 10.5 16.625C7.84766 16.625 5.38125 16.2148 3.53828 15.5148C3.22109 15.3945 2.91484 15.2633 2.625 15.1211V17.5C2.625 17.5055 2.63047 17.5328 2.65781 17.582C2.69062 17.6477 2.76719 17.7516 2.91484 17.8828C3.21563 18.1562 3.72969 18.4625 4.47344 18.7414C5.95 19.3047 8.08281 19.682 10.5 19.682C12.9172 19.682 15.05 19.3047 16.5266 18.7414C17.2703 18.457 17.7844 18.1508 18.0852 17.8828C18.2328 17.7516 18.3094 17.6477 18.3422 17.582C18.3695 17.5328 18.375 17.5055 18.375 17.5ZM3.53828 21.2023C3.22109 21.082 2.91484 20.9508 2.625 20.8086V23.1875C2.625 23.1875 2.625 23.2148 2.65781 23.2695C2.69062 23.3352 2.76719 23.4391 2.91484 23.5703C3.21563 23.8438 3.72969 24.15 4.47344 24.4289C5.95 24.9922 8.08281 25.3695 10.5 25.3695C12.9172 25.3695 15.05 24.9922 16.5266 24.4289C17.2703 24.1445 17.7844 23.8383 18.0852 23.5703C18.2328 23.4391 18.3094 23.3352 18.3422 23.2695C18.375 23.2094 18.375 23.1875 18.375 23.1875V20.8031C18.0852 20.9453 17.7789 21.0766 17.4617 21.1969C15.6187 21.9023 13.1523 22.3125 10.5 22.3125C7.84766 22.3125 5.38125 21.9023 3.53828 21.2023Z"
                                            fill="${black ? `#393939` : `#8D8D8D`}"
                                          />
                                        </svg>
                                      `;
                                    case 'creditCard':
                                      return html`
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="28"
                                          height="28"
                                          viewBox="0 0 28 28"
                                          fill="none"
                                        >
                                          <path
                                            d="M24.8889 5.84375C25.3167 5.84375 25.6667 6.19531 25.6667 6.625V8.1875H2.33333V6.625C2.33333 6.19531 2.68333 5.84375 3.11111 5.84375H24.8889ZM25.6667 12.875V22.25C25.6667 22.6797 25.3167 23.0312 24.8889 23.0312H3.11111C2.68333 23.0312 2.33333 22.6797 2.33333 22.25V12.875H25.6667ZM3.11111 3.5C1.39514 3.5 0 4.90137 0 6.625V22.25C0 23.9736 1.39514 25.375 3.11111 25.375H24.8889C26.6049 25.375 28 23.9736 28 22.25V6.625C28 4.90137 26.6049 3.5 24.8889 3.5H3.11111ZM5.83333 18.3437C5.18681 18.3437 4.66667 18.8662 4.66667 19.5156C4.66667 20.165 5.18681 20.6875 5.83333 20.6875H8.16667C8.81319 20.6875 9.33333 20.165 9.33333 19.5156C9.33333 18.8662 8.81319 18.3437 8.16667 18.3437H5.83333ZM12.0556 18.3437C11.409 18.3437 10.8889 18.8662 10.8889 19.5156C10.8889 20.165 11.409 20.6875 12.0556 20.6875H17.5C18.1465 20.6875 18.6667 20.165 18.6667 19.5156C18.6667 18.8662 18.1465 18.3437 17.5 18.3437H12.0556Z"
                                            fill="${black ? `#393939` : `#8D8D8D`}"
                                          />
                                        </svg>
                                      `;
                                    default:
                                      return html`
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                          <path
                                            fill="${black ? `#393939` : `#8D8D8D`}"
                                            d="M311 196.8v81.3c0 2.1-1.6 3.7-3.7 3.7h-13c-1.3 0-2.4-.7-3-1.5l-37.3-50.3v48.2c0 2.1-1.6 3.7-3.7 3.7h-13c-2.1 0-3.7-1.6-3.7-3.7V196.9c0-2.1 1.6-3.7 3.7-3.7h12.9c1.1 0 2.4 .6 3 1.6l37.3 50.3V196.9c0-2.1 1.6-3.7 3.7-3.7h13c2.1-.1 3.8 1.6 3.8 3.5zm-93.7-3.7h-13c-2.1 0-3.7 1.6-3.7 3.7v81.3c0 2.1 1.6 3.7 3.7 3.7h13c2.1 0 3.7-1.6 3.7-3.7V196.8c0-1.9-1.6-3.7-3.7-3.7zm-31.4 68.1H150.3V196.8c0-2.1-1.6-3.7-3.7-3.7h-13c-2.1 0-3.7 1.6-3.7 3.7v81.3c0 1 .3 1.8 1 2.5c.7 .6 1.5 1 2.5 1h52.2c2.1 0 3.7-1.6 3.7-3.7v-13c0-1.9-1.6-3.7-3.5-3.7zm193.7-68.1H327.3c-1.9 0-3.7 1.6-3.7 3.7v81.3c0 1.9 1.6 3.7 3.7 3.7h52.2c2.1 0 3.7-1.6 3.7-3.7V265c0-2.1-1.6-3.7-3.7-3.7H344V247.7h35.5c2.1 0 3.7-1.6 3.7-3.7V230.9c0-2.1-1.6-3.7-3.7-3.7H344V213.5h35.5c2.1 0 3.7-1.6 3.7-3.7v-13c-.1-1.9-1.7-3.7-3.7-3.7zM512 93.4V419.4c-.1 51.2-42.1 92.7-93.4 92.6H92.6C41.4 511.9-.1 469.8 0 418.6V92.6C.1 41.4 42.2-.1 93.4 0H419.4c51.2 .1 92.7 42.1 92.6 93.4zM441.6 233.5c0-83.4-83.7-151.3-186.4-151.3s-186.4 67.9-186.4 151.3c0 74.7 66.3 137.4 155.9 149.3c21.8 4.7 19.3 12.7 14.4 42.1c-.8 4.7-3.8 18.4 16.1 10.1s107.3-63.2 146.5-108.2c27-29.7 39.9-59.8 39.9-93.1z"
                                          />
                                        </svg>
                                      `;
                                  }
                                }

                                let btnArray = [
                                  {
                                    title: `現金`,
                                    value: 'cash',
                                    key: 'cash',
                                    event: () => {
                                      obj.ogOrderData.pos_info.payment = [
                                        {
                                          method: 'cash',
                                          total: 0,
                                        },
                                      ];
                                    },
                                  },
                                  {
                                    title: `刷卡`,
                                    value: 'creditCard',
                                    key: 'ut_credit_card',
                                    event: () => {
                                      obj.ogOrderData.pos_info.payment = [
                                        {
                                          method: 'creditCard',
                                          total: 0,
                                        },
                                      ];
                                    },
                                  },
                                  {
                                    title: `Line Pay`,
                                    value: 'line',
                                    key: 'line_pay_scan',
                                    event: () => {
                                      obj.ogOrderData.pos_info.payment = [
                                        {
                                          method: 'line',
                                          total: 0,
                                        },
                                      ];
                                    },
                                  },
                                ].filter(dd => {
                                  return (
                                    dd.key === 'cash' ||
                                    orderDetail.payment_setting.find((d1: any) => {
                                      return dd.key === d1.key;
                                    })
                                  );
                                });
                                return btnArray
                                  .map(btn => {
                                    return html`
                                      <div
                                        style="flex:1;display: flex;flex-direction: column;justify-content: center;align-items: center;padding: 15px 15px;border-radius: 10px;background: #F6F6F6;${obj.ogOrderData.pos_info.payment.find(
                                          (dd: any) => {
                                            return dd.method === btn.value;
                                          }
                                        )
                                          ? `color:#393939;border-radius: 10px;border: 3px solid #393939;box-shadow: 2px 2px 15px 0px rgba(0, 0, 0, 0.20);`
                                          : 'color:#8D8D8D;'}"
                                        onclick="${gvc.event(() => {
                                          btn.event();
                                        })}"
                                      >
                                        <div style="width: 28px;height: 28px;">
                                          ${drawIcon(
                                            obj.ogOrderData.pos_info.payment.find((dd: any) => {
                                              return dd.method === btn.value;
                                            }) !== undefined,
                                            btn.value
                                          )}
                                        </div>
                                        <div style="font-size: 16px;font-weight: 500;letter-spacing: 0.64px;">
                                          ${btn.title}
                                        </div>
                                      </div>
                                    `;
                                  })
                                  .join('');
                              } else {
                                return html` <div class="w-100 d-flex flex-column">
                                  <div class="d-flex align-items-center justify-content-center w-100 " style="">
                                    <div class="d-flex" style="flex:68;">${PosWidget.fontLight('付款方式')}</div>
                                    <div class="d-flex" style="flex:94;">${PosWidget.fontLight('付款金額')}</div>
                                    <div class="d-flex" style="flex:68;">${PosWidget.fontLight('狀態')}</div>
                                    <div class="d-flex" style="flex:34;"></div>
                                  </div>
                                  ${obj.ogOrderData.pos_info.payment
                                    .map((dd: any, index: number) => {
                                      return html` <div
                                        class="d-flex align-items-center justify-content-center w-100 mt-lg-4 mt-2"
                                        style="height:50px;"
                                      >
                                        <div
                                          class="d-flex"
                                          style="flex:68;color:#36B;cursor: pointer;"
                                          onclick="${gvc.event(() => {})}"
                                        >
                                          ${(() => {
                                            switch (dd.method) {
                                              case 'cash':
                                                return `現金`;
                                              case 'creditCard':
                                                return `刷卡`;
                                              case 'line':
                                                return `LINE PAY`;
                                            }
                                          })()}
                                        </div>
                                        <div class="d-flex" style="flex:94;">
                                          <input
                                            style="display: flex;width: calc(100% - 20px);padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;text-align: right;"
                                            class=""
                                            value="${dd.total}"
                                            onclick="${gvc.event(() => {
                                              if (dd.paied) {
                                                dialog.errorMessage({ text: '此付款金額已結清，無法進行調整' });
                                                return;
                                              }
                                              PosFunction.setMoney(gvc, dd.total, money => {
                                                dd.total = money || 0;
                                                refreshOrderView();
                                              });
                                            })}"
                                          />
                                        </div>
                                        <div class="d-flex" style="flex:68;">${dd.paied ? `已付款` : `尚未付款`}</div>
                                        <div class="d-flex" style="flex:34;">
                                          ${!dd.paied
                                            ? BgWidget.save(
                                                gvc.event(() => {
                                                  switch (dd.method) {
                                                    case 'cash':
                                                      PaymentFunction.cashFinish(gvc, dd.total, result => {
                                                        if (result) {
                                                          dd.paied = true;
                                                          refreshOrderView();
                                                        }
                                                      });
                                                      break;
                                                    case 'creditCard':
                                                      PaymentFunction.creditFinish(
                                                        gvc,
                                                        dd.total,
                                                        orderDetail,
                                                        result => {
                                                          if (result) {
                                                            dd.paied = true;
                                                            refreshOrderView();
                                                          }
                                                        }
                                                      );
                                                      break;
                                                    case 'line':
                                                      dd.line_prefix = dd.line_prefix || 0;
                                                      dd.line_prefix++;
                                                      PaymentFunction.lineFinish(
                                                        gvc,
                                                        dd.total,
                                                        dd.line_prefix,
                                                        orderDetail,
                                                        result => {
                                                          if (result) {
                                                            dd.paied = true;
                                                            refreshOrderView();
                                                          }
                                                        }
                                                      );
                                                      break;
                                                  }
                                                }),
                                                '支付'
                                              )
                                            : BgWidget.danger(
                                                gvc.event(() => {
                                                  dialog.checkYesOrNot({
                                                    text: '此款項已支付，是否確認移除付款資訊?',
                                                    callback: response => {
                                                      if (response) {
                                                        dd.paied = false;
                                                        refreshOrderView();
                                                      }
                                                    },
                                                  });
                                                }),
                                                '取消'
                                              )}
                                        </div>
                                      </div>`;
                                    })
                                    .join('')}
                                </div>`;
                              }
                            },
                            divCreate: {
                              class: ``,
                              style: `display: flex;justify-content: space-between;margin-top: 24px;gap:15px;`,
                            },
                          })}`,
                          html` <div style="height:24px;"></div>`,
                          PosWidget.buttonSnow(
                            `新增付款方式`,
                            gvc.event(() => {
                              PosFunction.selectPaymentMethod({
                                gvc: gvc,
                                orderData: orderDetail,
                                callback: data => {
                                  obj.ogOrderData.pos_info.payment = data;
                                  refreshOrderView();
                                },
                              });
                            })
                          ),
                          `<div style="height:24px;"></div>`,
                        ];
                        if (
                          obj.ogOrderData.pos_info.payment.length === 1 &&
                          !obj.ogOrderData.pos_info.payment[0].paied
                        ) {
                          view.push(html`
                            <div class="d-flex" style="font-size: 16px;font-weight: 400;margin-bottom: 12px;">
                              <div
                                class="d-flex align-items-center justify-content-center"
                                style="color: #393939;font-size: 18px;font-weight: 700;letter-spacing: 0.72px;"
                              >
                                實際收款金額
                              </div>
                              <input
                                style="display: flex;width: 143px;padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;text-align: right;"
                                class="ms-auto"
                                value="${obj.ogOrderData.pos_info.payment[0].total}"
                                onclick="${gvc.event(() => {
                                  const def = obj.ogOrderData.pos_info.payment?.[0]?.total;
                                  PosFunction.setMoney(gvc, def, money => {
                                    obj.ogOrderData.pos_info.payment[0].total = money || 0;
                                    PaymentPage.storeHistory(obj.ogOrderData);
                                    gvc.notifyDataChange(vm_id);
                                  });
                                })}"
                                readonly
                              />
                            </div>
                          `);
                        }
                        view.push(PaymentPage.spaceView());
                        const total = obj.ogOrderData.pos_info.payment
                          .map((dd: any) => {
                            return dd.total;
                          })
                          .reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0);

                        view.push(
                          html` <div class="d-flex" style="gap:18px;">
                            ${[
                              {
                                title: '實際收款金額',
                                value: total.toLocaleString(),
                                color: `#393939`,
                              },
                              {
                                title: total - parseInt(orderDetail.total as any, 10) < 0 ? `不足` : `找零`,
                                value: (total - parseInt(orderDetail.total as any, 10)).toLocaleString(),
                                color: total - parseInt(orderDetail.total as any, 10) >= 0 ? `#4D86DB` : `#E85757`,
                              },
                            ]
                              .map(dd => {
                                return html` <div
                                  style="flex:1;height: 87px; padding: 14px 16px;background: white; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.08); border-radius: 10px; border: 1px #DDDDDD solid; flex-direction: column; justify-content: center; align-items: center; gap: 4px; display: inline-flex"
                                >
                                  <div
                                    style="text-align: center; color: #393939; font-size: 16px; font-weight: 400; line-height: 22.40px; letter-spacing: 0.64px; word-wrap: break-word"
                                  >
                                    ${dd.title}
                                  </div>
                                  <div
                                    style="color: ${dd.color}; font-size: 24px;  font-weight: 700; text-transform: uppercase; letter-spacing: 0.96px; word-wrap: break-word"
                                  >
                                    ${dd.value}
                                  </div>
                                </div>`;
                              })
                              .join('')}
                          </div>`
                        );

                        function paymentNext(pre_order: boolean) {
                          TempOrder.removeTempOrders(orderDetail.orderID);
                          if (orderDetail.lineItems.length <= 0) {
                            dialog.errorMessage({ text: '請先選擇商品' });
                            return;
                          }
                          if (obj.ogOrderData.user_info.shipment === 'normal' && !obj.ogOrderData.user_info.address) {
                            dialog.errorMessage({ text: '請輸入地址' });
                            return;
                          }
                          if (
                            ['FAMIC2C', 'HILIFEC2C', 'OKMARTC2C', 'UNIMARTC2C'].includes(
                              obj.ogOrderData.user_info.shipment
                            ) &&
                            !gvc.glitter.getUrlParameter('CVSStoreName')
                          ) {
                            dialog.errorMessage({ text: '請選擇到店門市' });
                            return;
                          }
                          //設定POS機資訊
                          orderDetail.pos_info = {
                            who: gvc.glitter.share.select_member,
                            where_store: POSSetting.config.where_store,
                          };
                          orderDetail.user_info = obj.ogOrderData.user_info;
                          let passData = JSON.parse(JSON.stringify(orderDetail));
                          orderDetail.pos_info.payment = obj.ogOrderData.pos_info.payment;
                          passData.pos_info.payment = obj.ogOrderData.pos_info.payment;
                          passData.total = orderDetail.total;
                          passData.use_rebate = orderDetail.use_rebate;
                          passData.orderStatus = 1;
                          passData.pay_status = 1;
                          passData.pre_order = pre_order;
                          //只有一種付款方式時結帳付款
                          if (
                            obj.ogOrderData.pos_info.payment.length === 1 &&
                            obj.ogOrderData.pos_info.payment.find((dd: any) => {
                              return !dd.paied;
                            })
                          ) {
                            if (
                              obj.ogOrderData.pos_info.payment.find((dd: any) => {
                                return dd.method === 'cash';
                              })
                            ) {
                              PaymentFunction.cashFinish(gvc, obj.ogOrderData.pos_info.payment[0].total, result => {
                                if (result) {
                                  obj.ogOrderData.pos_info.payment[0].paied = true;
                                  PaymentPage.storeHistory(obj.ogOrderData);
                                  PaymentPage.selectInvoice(gvc, orderDetail, vm, passData);
                                }
                              });
                            } else if (
                              obj.ogOrderData.pos_info.payment.find((dd: any) => {
                                return dd.method === 'creditCard';
                              })
                            ) {
                              PaymentFunction.creditFinish(gvc, orderDetail.total, orderDetail, result => {
                                if (result) {
                                  obj.ogOrderData.pos_info.payment[0].paied = true;
                                  PaymentPage.storeHistory(obj.ogOrderData);
                                  PaymentPage.selectInvoice(gvc, orderDetail, vm, passData);
                                }
                              });
                            } else if (
                              obj.ogOrderData.pos_info.payment.find((dd: any) => {
                                return dd.method === 'line';
                              })
                            ) {
                              obj.ogOrderData.pos_info.payment[0].line_prefix =
                                obj.ogOrderData.pos_info.payment[0].line_prefix || 0;
                              obj.ogOrderData.pos_info.payment[0].line_prefix++;
                              PaymentFunction.lineFinish(
                                gvc,
                                orderDetail.total,
                                obj.ogOrderData.pos_info.payment[0].line_prefix,
                                orderDetail,
                                result => {
                                  if (result) {
                                    obj.ogOrderData.pos_info.payment[0].paied = true;
                                    PaymentPage.storeHistory(obj.ogOrderData);
                                    PaymentPage.selectInvoice(gvc, orderDetail, vm, passData);
                                  }
                                }
                              );
                            } else {
                              obj.ogOrderData.pos_info.payment[0].paied = true;
                              PaymentPage.storeHistory(obj.ogOrderData);
                              PaymentPage.selectInvoice(gvc, orderDetail, vm, passData);
                            }
                          } else {
                            PaymentPage.selectInvoice(gvc, orderDetail, vm, passData);
                          }
                        }

                        view.push(html`
                          <div style="margin-top: 32px;gap:10px;" class="d-flex align-items-center">
                            <div
                              style="width:49px;height: 49px;border-radius: 10px;background: #F6F6F6;cursor: pointer;"
                              class="d-flex align-items-center justify-content-center"
                              onclick="${gvc.event(() => {
                                PaymentPage.storeHistory(obj.ogOrderData);
                                TempOrder.addTempOrders({
                                  order: obj.ogOrderData,
                                  with_alert: true,
                                  gvc: gvc,
                                });
                              })}"
                            >
                              <i class="fa-solid fa-down-to-bracket fs-4"></i>
                            </div>
                            <div
                              class=""
                              style="flex:1;display: flex;padding: 10px;justify-content: center;align-items: center;border-radius: 10px;background: #FF6C02;color: #FFF;font-size: 18px;font-style: normal;font-weight: 500;line-height: normal;letter-spacing: 0.72px;"
                              onclick="${gvc.event(() => {
                                if (
                                  obj.ogOrderData.pos_info.payment.length > 1 &&
                                  obj.ogOrderData.pos_info.payment.find((dd: any) => {
                                    return !dd.paied;
                                  })
                                ) {
                                  dialog.errorMessage({
                                    text: `請結清所有款項`,
                                  });
                                  return;
                                }
                                dialog.checkYesOrNot({
                                  text: '是否確認建立預購單?',
                                  callback: response => {
                                    if (response) {
                                      paymentNext(true);
                                    }
                                  },
                                });
                              })}"
                            >
                              建立預購單
                            </div>
                            <div
                              class=""
                              style="flex:1;display: flex;padding: 10px;justify-content: center;align-items: center;border-radius: 10px;background: #393939;color: #FFF;font-size: 18px;font-style: normal;font-weight: 500;line-height: normal;letter-spacing: 0.72px;"
                              onclick="${gvc.event(() => {
                                if (total - parseInt(orderDetail.total as any, 10) < 0) {
                                  dialog.errorMessage({
                                    text: `收款金額尚需要『 ${((total - parseInt(orderDetail.total as any, 10)) * -1).toLocaleString()} 』`,
                                  });
                                  return;
                                } else if (
                                  obj.ogOrderData.pos_info.payment.length > 1 &&
                                  obj.ogOrderData.pos_info.payment.find((dd: any) => {
                                    return !dd.paied;
                                  })
                                ) {
                                  dialog.errorMessage({
                                    text: `請結清所有款項`,
                                  });
                                  return;
                                } else if (
                                  orderDetail.lineItems.find((dd: any) => {
                                    return dd.pre_order;
                                  })
                                ) {
                                  dialog.errorMessage({
                                    text: `庫存不足，請建立預購單`,
                                  });
                                  return;
                                }

                                PaymentPage.storeHistory(orderDetail);
                                dialog.checkYesOrNot({
                                  text: '是否確認前往結帳?',
                                  callback: response => {
                                    if (response) {
                                      paymentNext(false);
                                    }
                                  },
                                });
                              })}"
                            >
                              前往結帳
                            </div>
                          </div>
                        `);
                        return view.join('');
                      },
                      divCreate: {
                        class: `d-flex flex-column w-100`,
                      },
                    };
                  })}
                </div>`
            );
          });
        },
        divCreate: {
          class: `${document.body.offsetWidth < 800 ? `w-100` : `d-flex flex-column flex-sm-row w-100`}`,
          style: `overflow-y: auto;`,
        },
      };
    });
  }

  public static rmProductHistory(product_id: number) {
    const orderDetail: any = JSON.parse(localStorage.getItem('pos_order_detail') as string);
    if (orderDetail && orderDetail.lineItems) {
      orderDetail.lineItems = orderDetail.lineItems.filter((item: any) => item.id !== product_id);
    }
    this.storeHistory(orderDetail);
  }

  public static clearProductHistory() {
    const orderDetail: any = JSON.parse(localStorage.getItem('pos_order_detail') as string);
    if (orderDetail && orderDetail.lineItems) {
      orderDetail.lineItems = [];
    }
    this.storeHistory(orderDetail);
  }

  public static storeHistory(orderDetail: OrderDetail) {
    localStorage.setItem('pos_order_detail', JSON.stringify(orderDetail));
  }

  public static clearHistory() {
    localStorage.removeItem('pos_order_detail');
    const url = new URL(location.href);
    url.search = `?app-id=${(window as any).glitter.getUrlParameter('app-id')}`;
    window.history.replaceState({}, document.title, url.href);
  }

  public static spaceView() {
    return html` <div class="w-100" style="margin: 16px 0;">
      <svg xmlns="http://www.w3.org/2000/svg" width="398" height="2" viewBox="0 0 398 2" fill="none">
        <path d="M0 1H398" stroke="#DDDDDD" stroke-dasharray="8 8" />
      </svg>
    </div>`;
  }

  public static scanVoucher(gvc: GVC, orderDetail: any, reload: () => void) {
    const c_vm = {
      value: '',
    };
    gvc.glitter.innerDialog(
      (gvc: GVC) => {
        async function next() {
          const dialog = new ShareDialog(gvc.glitter);
          orderDetail.code_array = orderDetail.code_array || [];
          orderDetail.code_array = orderDetail.code_array.filter((dd: any) => {
            return dd !== c_vm.value;
          });
          orderDetail.code_array.push(c_vm.value);
          dialog.dataLoading({ visible: true });
          const od: any = (
            await ApiShop.getCheckout({
              line_items: orderDetail.lineItems,
              checkOutType: 'POS',
              user_info: orderDetail.user_info,
              code_array: orderDetail.code_array,
            })
          ).response.data;
          dialog.dataLoading({ visible: false });
          if (
            !od ||
            !od.voucherList.find((dd: any) => {
              return dd.code === c_vm.value;
            })
          ) {
            orderDetail.code_array = orderDetail.code_array.filter((dd: any) => {
              return dd !== c_vm.value;
            });
            dialog.errorMessage({ text: '請輸入正確的優惠代碼' });
          } else {
            gvc.closeDialog();
            dialog.successMessage({ text: '成功新增優惠券' });
            reload();
          }
        }

        return html`
          <div class="dialog-box">
            <div class="dialog-content position-relative " style="width: 370px;max-width: calc(100% - 20px);">
              <div
                class="my-3  fw-500 text-center"
                style="white-space: normal; overflow-wrap: anywhere;font-size: 20px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 2.8px;"
              >
                請掃描或輸入優惠代碼
              </div>
              <img
                class=""
                style="max-width:70%;"
                src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/size1440_s*px$_s5sasfscsbs7s3sf_%E6%88%AA%E5%9C%962024-08-30%E4%B8%8B%E5%8D%882.29.361.png"
              />
              <div class="d-flex w-100 align-items-center mt-3" style="border:1px solid grey;height: 50px;">
                <input
                  class="form-control h-100"
                  style="border: none;"
                  placeholder="請輸入或掃描優惠代碼"
                  oninput="${gvc.event((e, event) => {
                    c_vm.value = e.value.replace(`voucher-`, '');
                  })}"
                  value="${c_vm.value}"
                />
                <div class="flex-fill"></div>
                <div
                  style="background: grey;width: 50px;"
                  class="d-flex align-items-center justify-content-center text-white h-100"
                  onclick="${gvc.event(() => {
                    gvc.glitter.runJsInterFace('start_scan', {}, res => {
                      c_vm.value = res.text.replace(`voucher-`, '');
                      gvc.recreateView();
                      next();
                    });
                  })}"
                >
                  <i class="fa-regular fa-barcode-read"></i>
                </div>
              </div>
              <div
                class="d-flex align-items-center justify-content-center w-100"
                style="margin-top: 24px;font-size: 16px;font-weight: 700;letter-spacing: 0.64px;"
              >
                <div
                  class="flex-fill"
                  style="border-radius: 10px;border: 1px solid #DDD;background: #FFF;padding: 12px 24px;color: #393939;text-align:center;"
                  onclick="${gvc.event(() => {
                    gvc.glitter.closeDiaLog();
                  })}"
                >
                  取消
                </div>
                <div class="mx-2"></div>
                <div
                  class="flex-fill"
                  style="border-radius: 10px;background: #393939;padding: 12px 24px;color: #FFF;text-align:center;"
                  onclick="${gvc.event(async () => {
                    next();
                  })}"
                >
                  確定
                </div>
              </div>
            </div>
          </div>
        `;
      },
      'orderFinish',
      {
        dismiss: () => {
          gvc.glitter.share.scan_back = () => {};
        },
      }
    );
  }

  public static scanUserID(gvc: GVC, orderDetail: any, reload: () => void) {
    const c_vm = {
      value: '',
    };
    gvc.glitter.innerDialog(
      (gvc: GVC) => {
        async function next() {
          const dialog = new ShareDialog(gvc.glitter);
          const user = await ApiUser.getUsersData(c_vm.value);
          if (!user.response || !user.response.account) {
            dialog.errorMessage({ text: '查無此會員' });
          } else {
            orderDetail.user_info.email = user.response.account;
            orderDetail.user_info.phone = user.response.userData.phone;
            reload();
            gvc.closeDialog();
          }
        }

        return html`
          <div class="dialog-box">
            <div class="dialog-content position-relative " style="width: 370px;max-width: calc(100% - 20px);">
              <div
                class="my-3  fw-500 text-center"
                style="white-space: normal; overflow-wrap: anywhere;font-size: 20px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 2.8px;"
              >
                請掃描或輸入會員代碼
              </div>
              <img
                class=""
                style="max-width:70%;"
                src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/size1440_s*px$_s5sasfscsbs7s3sf_%E6%88%AA%E5%9C%962024-08-30%E4%B8%8B%E5%8D%882.29.361.png"
              />
              <div class="d-flex w-100 align-items-center mt-3" style="border:1px solid grey;height: 50px;">
                <input
                  class="form-control h-100"
                  style="border: none;"
                  placeholder="請掃描或輸入會員代碼"
                  oninput="${gvc.event((e, event) => {
                    c_vm.value = e.value;
                  })}"
                  value="${c_vm.value}"
                />
                <div class="flex-fill"></div>
                <div
                  style="background: grey;width: 50px;"
                  class="d-flex align-items-center justify-content-center text-white h-100"
                  onclick="${gvc.event(() => {
                    gvc.glitter.runJsInterFace('start_scan', {}, res => {
                      c_vm.value = res.text;
                      gvc.recreateView();
                      next();
                    });
                  })}"
                >
                  <i class="fa-regular fa-barcode-read"></i>
                </div>
              </div>
              <div
                class="d-flex align-items-center justify-content-center w-100"
                style="margin-top: 24px;font-size: 16px;font-weight: 700;letter-spacing: 0.64px;"
              >
                <div
                  class="flex-fill"
                  style="border-radius: 10px;border: 1px solid #DDD;background: #FFF;padding: 12px 24px;color: #393939;text-align:center;"
                  onclick="${gvc.event(() => {
                    gvc.glitter.closeDiaLog();
                  })}"
                >
                  取消
                </div>
                <div class="mx-2"></div>
                <div
                  class="flex-fill"
                  style="border-radius: 10px;background: #393939;padding: 12px 24px;color: #FFF;text-align:center;"
                  onclick="${gvc.event(async () => {
                    next();
                  })}"
                >
                  確定
                </div>
              </div>
            </div>
          </div>
        `;
      },
      'orderFinish',
      {
        dismiss: () => {
          gvc.glitter.share.scan_back = () => {};
        },
      }
    );
  }

  public static stripHtmlTags(htmlString: string): string[] {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString.replace(/\n/g, '');

    const items: string[] = [];
    const tbody = tempDiv.querySelector('table tbody');

    if (tbody) {
      for (let i = 1; i < tbody.children.length; i++) {
        const cell: any = tbody.children[i].children[0];
        items.push(cell ? cell.innerText.trim() : '');
      }
    }

    return items;
  }

  public static async selectInvoice(gvc: GVC, orderDetail: any, vm: any, passData: any) {
    const dialog = new ShareDialog(gvc.glitter);
    const c_vm: {
      invoice_select: 'print' | 'carry' | 'company' | 'nouse';
      value: any;
    } = {
      invoice_select: 'print',
      value: '',
    };

    function next() {
      if (c_vm.invoice_select === 'carry') {
        if (!c_vm.value) {
          dialog.infoMessage({ text: '請輸入載具' });
          return;
        } else {
          passData.user_info = {
            send_type: 'carrier',
            carrier_num: c_vm.value,
            invoice_type: 'me',
          };
        }
      } else if (c_vm.invoice_select === 'company') {
        if (!c_vm.value) {
          dialog.infoMessage({ text: '請輸入統一編號' });
          return;
        } else {
          passData.user_info = {
            company: 'un_fill',
            gui_number: c_vm.value,
            invoice_type: 'company',
          };
        }
      }
      passData.user_info.shipment = orderDetail.user_info.shipment;
      if (orderDetail.user_info.shipment === 'normal') {
        passData.user_info.address = orderDetail.user_info.address;
      } else if (['FAMIC2C', 'HILIFEC2C', 'OKMARTC2C', 'UNIMARTC2C'].includes(orderDetail.user_info.shipment)) {
        ['CVSAddress', 'CVSOutSide', 'CVSStoreID', 'CVSStoreName', 'LogisticsSubType'].map(dd => {
          passData.user_info[dd] = decodeURIComponent(gvc.glitter.getUrlParameter(dd));
        });
      }
      gvc.glitter.closeDiaLog();
      dialog.dataLoading({
        visible: true,
        text: `訂單成立中`,
      });
      passData.user_info.email = orderDetail.user_info.email || 'no-email';
      passData.pos_store = POSSetting.config.where_store;
      passData.invoice_select = c_vm.invoice_select;
      passData.use_rebate = orderDetail.use_rebate;
      passData.voucherList = orderDetail.voucherList;
      passData.user_info.note = orderDetail.user_info.note;
      ApiShop.toPOSCheckout(passData).then(async res => {
        if (!res.result) {
          dialog.dataLoading({ visible: false });
          if (c_vm.invoice_select === 'company') {
            dialog.errorMessage({ text: '請確認統編是否輸入正確' });
          } else if (c_vm.invoice_select === 'carry') {
            dialog.errorMessage({ text: '請確認載具是否輸入正確' });
          } else {
            dialog.errorMessage({ text: '開立異常，請確認發票配號是否足夠' });
          }
        } else {
          PaymentPage.clearHistory();
          const glitter = gvc.glitter;
          const invoice = res.response.data.invoice;
          if (
            res.response.data.invoice &&
            (PayConfig.deviceType === 'pos' || ConnectionMode.on_connected_device) &&
            c_vm.invoice_select !== 'carry' &&
            c_vm.invoice_select !== 'nouse'
          ) {
            POSSetting.config.pickup_number++;

            function print(type: 'save' | 'client') {
              if (type === 'client') {
                if (PayConfig.deviceType === 'pos') {
                  IminModule.printInvoice(invoice, res.response.data.orderID, glitter.share.staff_title);
                } else {
                  ConnectionMode.sendCommand({
                    cmd: 'print_invoice',
                    invoice: invoice,
                    orderID: res.response.data.orderID,
                    staff_title: glitter.share.staff_title,
                  });
                }
              }
            }

            print('client');
          } else if (
            PayConfig.pos_config.pos_support_finction.includes('print_order_receipt') ||
            PayConfig.pos_config.pos_support_finction.includes('print_order_detail')
          ) {
            if (PayConfig.deviceType === 'pos') {
              //客戶聯
              await IminModule.printTransactionDetails(res.response.data.orderID, invoice, glitter.share.staff_title);
              //如果需要收執聯的話
              if (
                PayConfig.pos_config.pos_support_finction.includes('print_order_receipt') &&
                PayConfig.pos_config.pos_support_finction.includes('print_order_detail')
              ) {
                await new Promise(resolve => {
                  const dialog = new ShareDialog(glitter);
                  dialog.infoMessage({
                    text: '請撕取客戶聯，在列印留存聯',
                    callback: () => {
                      resolve(true);
                    },
                  });
                });
                await IminModule.printTransactionDetails(res.response.data.orderID, invoice, glitter.share.staff_title);
              }
            } else {
              ConnectionMode.sendCommand({
                cmd: 'printTransactionDetails',
                invoice: invoice,
                orderID: res.response.data.orderID,
                staff_title: glitter.share.staff_title,
              });
            }
          }
          dialog.dataLoading({ visible: false });
          orderDetail.lineItems = [];
          gvc.glitter.share.clearOrderData();
          vm.type = 'menu';
          gvc.glitter.innerDialog(
            (gvc: GVC) => {
              return html`
                <div
                  class="w-100 h-100 d-flex align-items-center justify-content-center"
                  onclick="${gvc.event(() => {
                    gvc.closeDialog();
                  })}"
                >
                  <div
                    style="position: relative;max-width:calc(100% - 20px);width: 492px;height: 223px;border-radius: 10px;background: #FFF;display: flex;flex-direction: column;align-items: center;justify-content: center;"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      style="position: absolute;top: 12px;right: 12px;cursor: pointer;"
                      onclick="${gvc.event(() => {
                        gvc.glitter.closeDiaLog();
                      })}"
                    >
                      <path d="M1 1L13 13" stroke="#393939" stroke-linecap="round" />
                      <path d="M13 1L1 13" stroke="#393939" stroke-linecap="round" />
                    </svg>

                    <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 75 75" fill="none">
                      <g clip-path="url(#clip0_9850_171427)">
                        <path
                          d="M37.5 7.03125C45.5808 7.03125 53.3307 10.2413 59.0447 15.9553C64.7587 21.6693 67.9688 29.4192 67.9688 37.5C67.9688 45.5808 64.7587 53.3307 59.0447 59.0447C53.3307 64.7587 45.5808 67.9688 37.5 67.9688C29.4192 67.9688 21.6693 64.7587 15.9553 59.0447C10.2413 53.3307 7.03125 45.5808 7.03125 37.5C7.03125 29.4192 10.2413 21.6693 15.9553 15.9553C21.6693 10.2413 29.4192 7.03125 37.5 7.03125ZM37.5 75C47.4456 75 56.9839 71.0491 64.0165 64.0165C71.0491 56.9839 75 47.4456 75 37.5C75 27.5544 71.0491 18.0161 64.0165 10.9835C56.9839 3.95088 47.4456 0 37.5 0C27.5544 0 18.0161 3.95088 10.9835 10.9835C3.95088 18.0161 0 27.5544 0 37.5C0 47.4456 3.95088 56.9839 10.9835 64.0165C18.0161 71.0491 27.5544 75 37.5 75ZM54.0527 30.6152C55.4297 29.2383 55.4297 27.0117 54.0527 25.6494C52.6758 24.2871 50.4492 24.2725 49.0869 25.6494L32.8271 41.9092L25.9424 35.0244C24.5654 33.6475 22.3389 33.6475 20.9766 35.0244C19.6143 36.4014 19.5996 38.6279 20.9766 39.9902L30.3516 49.3652C31.7285 50.7422 33.9551 50.7422 35.3174 49.3652L54.0527 30.6152Z"
                          fill="#393939"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_9850_171427">
                          <rect width="75" height="75" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    <div
                      style="text-align: center;color: #393939;font-size: 16px;font-weight: 400;line-height: 160%;margin-top: 24px;"
                    >
                      訂單新增成功！
                    </div>
                  </div>
                </div>
              `;
            },
            'orderFinish',
            {
              dismiss: () => {
                // vm.type = "list";
              },
            }
          );
        }
      });
    }

    //不開立電子發票直接執行
    if (
      (await ApiShop.getInvoiceType()).response.method === 'nouse' ||
      orderDetail.pos_info.payment
        .map((dd: any) => {
          return dd.total;
        })
        .reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0) < orderDetail.total ||
      !PayConfig.pos_config.pos_support_finction.includes('print_invoice')
    ) {
      c_vm.invoice_select = 'nouse';
      next();
    } else {
      if (
        PayConfig.deviceType !== 'pos' &&
        !ConnectionMode.on_connected_device &&
        orderDetail.user_info.email === 'no-email'
      ) {
        const dialog = new ShareDialog(gvc.glitter);
        dialog.errorMessage({ text: '請選擇會員' });
        return;
      }
      gvc.glitter.innerDialog(
        (gvc: GVC) => {
          return html`
            <div class="dialog-box">
              <div class="dialog-content position-relative" style="width: 452px;max-width: calc(100% - 20px);">
                <div
                  class="mb-3 fs-5 fw-500 text-center"
                  style="white-space: normal; overflow-wrap: anywhere;font-size: 28px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 2.8px;"
                >
                  選擇發票開立方式
                </div>
                <div class="row p-0">
                  ${(() => {
                    let btnArray = [
                      {
                        title: PayConfig.deviceType === 'pos' || ConnectionMode.on_connected_device ? `列印` : `寄送`,
                        value: 'print',
                        icon: `<i class="fa-regular fa-print"></i>`,
                      },
                      {
                        title: `載具`,
                        value: 'carry',
                        icon: `<i class="fa-regular fa-mobile"></i>`,
                      },
                      {
                        title: `統編`,
                        value: 'company',
                        icon: `<i class="fa-regular fa-building"></i>`,
                      },
                      {
                        title: `不開立`,
                        value: 'nouse',
                        icon: `<i class="fa-solid fa-ban"></i>`,
                      },
                    ];
                    return btnArray
                      .map(btn => {
                        return html`
                          <div class="col-6  mb-4">
                            <div
                              class="w-100 d-flex align-items-center flex-column justify-content-center"
                              style="padding:  20px;border-radius: 10px;background: #F6F6F6;${c_vm.invoice_select ==
                              btn.value
                                ? `color:#393939;border-radius: 10px;border: 3px solid #393939;box-shadow: 2px 2px 15px 0px rgba(0, 0, 0, 0.20);`
                                : 'color:#8D8D8D;'} "
                              onclick="${gvc.event(() => {
                                c_vm.invoice_select = btn.value as any;
                                c_vm.value = '';
                                gvc.recreateView();
                              })}"
                            >
                              <div style="" class="fs-2">${btn.icon}</div>
                              <div style="font-size: 16px;font-weight: 500;letter-spacing: 0.64px;">${btn.title}</div>
                            </div>
                          </div>
                        `;
                      })
                      .join('');
                  })()}
                </div>
                ${(() => {
                  if (c_vm.invoice_select === 'carry') {
                    return html` <div
                      class="d-flex w-100 align-items-center mt-3"
                      style="border:1px solid grey;height: 50px;"
                    >
                      <input
                        class="form-control h-100"
                        style="border: none;"
                        placeholder="請輸入或掃描載具"
                        oninput="${gvc.event((e, event) => {
                          c_vm.value = e.value;
                        })}"
                        value="${c_vm.value}"
                      />
                      <div class="flex-fill"></div>
                      <div
                        style="background: grey;width: 50px;"
                        class="d-flex align-items-center justify-content-center text-white h-100"
                        onclick="${gvc.event(() => {
                          gvc.glitter.runJsInterFace('start_scan', {}, res => {
                            c_vm.value = res.text;
                            gvc.recreateView();
                          });
                        })}"
                      >
                        <i class="fa-regular fa-barcode-read"></i>
                      </div>
                    </div>`;
                  } else if (c_vm.invoice_select === 'company') {
                    return html` <div
                      class="d-flex w-100 align-items-center mt-3"
                      style="border:1px solid grey;height: 50px;"
                    >
                      <input
                        class="form-control h-100"
                        style="border: none;background: white;"
                        placeholder="請輸入統一編號"
                        value="${c_vm.value}"
                        onclick="${gvc.event(() => {
                          PosFunction.setMoney(
                            gvc,
                            c_vm.value || '0',
                            text => {
                              c_vm.value = `${text}`;
                              gvc.recreateView();
                            },
                            '統一編號'
                          );
                        })}"
                        readonly
                      />
                      <div class="flex-fill"></div>
                      <div
                        style="background: grey;width: 50px;"
                        class="d-flex align-items-center justify-content-center text-white h-100"
                        onclick="${gvc.event(() => {
                          gvc.glitter.runJsInterFace('start_scan', {}, res => {
                            c_vm.value = res.text;
                            gvc.recreateView();
                          });
                        })}"
                      >
                        <i class="fa-regular fa-barcode-read"></i>
                      </div>
                    </div>`;
                  } else {
                    return ``;
                  }
                })()}
                <div
                  class="d-flex align-items-center justify-content-center w-100"
                  style="margin-top: 24px;font-size: 16px;font-weight: 700;letter-spacing: 0.64px;"
                >
                  <div
                    class="flex-fill"
                    style="border-radius: 10px;background: #393939;padding: 12px 24px;color: #FFF;text-align:center;"
                    onclick="${gvc.event(() => {
                      next();
                    })}"
                  >
                    確定
                  </div>
                </div>
              </div>
            </div>
          `;
        },
        'selectInvoice',
        {
          dismiss: () => {
            // vm.type = "list";
            gvc.glitter.share.scan_back = () => {};
          },
        }
      );
    }
  }

  public static async enterCodeEvent(gvc: GVC, orderDetail: any, code: string, callback: () => void) {
    const dialog = new ShareDialog(gvc.glitter);

    // 確保 code_array 存在並更新
    orderDetail.code_array = orderDetail.code_array || [];
    orderDetail.code_array = orderDetail.code_array.filter((dd: any) => dd !== code);
    orderDetail.code_array.push(code);

    dialog.dataLoading({ visible: true });

    // 進行結帳
    const od = await this.checkout({
      line_items: orderDetail.lineItems,
      user_info: orderDetail.user_info,
      code_array: orderDetail.code_array,
      use_rebate: orderDetail.use_rebate || 0,
    });

    dialog.dataLoading({ visible: false });

    // 檢查優惠代碼有效性
    const isValidCode = od && od.voucherList.some((dd: any) => dd.code === code);
    if (!isValidCode) {
      orderDetail.code_array = orderDetail.code_array.filter((dd: any) => dd !== code);
      dialog.errorMessage({ text: '請輸入正確的優惠代碼' });
    } else {
      gvc.closeDialog();
      orderDetail.code_array = od.voucherList.filter((item: any) => item.code.length > 0).map((item: any) => item.code);
      dialog.successMessage({ text: '成功新增優惠券' });
      callback();
    }
  }
}
