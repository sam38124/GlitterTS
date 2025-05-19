import { GVC } from '../../glitterBundle/GVController.js';
import { GlobalUser } from '../../glitter-base/global/global-user.js';
import { CheckInput } from '../../modules/checkInput.js';
import { Tool } from '../../modules/tool.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { ApiCart, CartItem } from '../../glitter-base/route/api-cart.js';
import { ApiDelivery } from '../../glitter-base/route/delivery.js';
import { ApiUser } from '../../glitter-base/route/user.js';
import { ApiWallet } from '../../glitter-base/route/wallet.js';
import { FormWidget } from '../../official_view_component/official/form.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { Voucher as OriginVoucher, VoucherContent } from '../user-manager/um-voucher.js';
import { PdClass } from '../product/pd-class.js';
import { Ad } from '../public/ad.js';
import { Language } from '../../glitter-base/global/language.js';
import { FakeOrder } from './fake-order.js';
import { FormCheck } from '../../cms-plugin/module/form-check.js';
import { Currency } from '../../glitter-base/global/currency.js';
import { ShipmentConfig } from '../../glitter-base/global/shipment-config.js';
import { Animation } from '../../glitterBundle/module/Animation.js';
import { ApiLiveInteraction } from '../../glitter-base/route/live-purchase-interactions.js';
import { ApplicationConfig } from '../../application-config.js';
import { CartModule, CartLogiGroup, CartDataList } from '../modules/cart-module.js';
import { ProductModule } from '../modules/product-module.js';
import { BgWidget } from '../../backend-manager/bg-widget.js';

const html = String.raw;

interface UserVoucher extends VoucherContent {
  usePass: boolean;
}

interface Voucher extends OriginVoucher {
  content: UserVoucher;
}

export class CheckoutIndex {
  static main(gvc: GVC, widget: any, subData: any) {
    const glitter = gvc.glitter;
    if (glitter.share.is_application && glitter.getUrlParameter('page') !== 'checkout') {
      return '';
    }
    let onlineData: any = {};
    function getCartData() {
      if (gvc.glitter.getUrlParameter('page') !== 'checkout') {
        ApiCart.checkoutCart = ApiCart.globalCart;
        return new ApiCart(ApiCart.globalCart);
      } else {
        return new ApiCart(ApiCart.checkoutCart);
      }
    }
    //取得要顯示的購物車
    let apiCart = getCartData();

    const check_out_sub = JSON.parse(localStorage.getItem('checkout_sub_' + ApiCart.checkoutCart) ?? '{}');

    const ids = {
      page: 'checkout-index',
      cart: glitter.getUUID(),
      shipping: glitter.getUUID(),
    };

    const loadings = {
      page: true,
    };
    const vm = {
      cartData: {} as any,
      cartDataList: [] as CartDataList[],
      logisticsGroup: [] as CartLogiGroup[],
      rebateConfig: { title: '購物金' } as any,
      quantity: '',
      hasFullLengthCart: false,
    };
    const classPrefix = 'cart-prefix';
    PdClass.addSpecStyle(gvc);
    function spinner(obj?: {
      container?: {
        class?: string;
        style?: string;
      };
      circle?: {
        visible?: boolean;
        width?: number;
        borderSize?: number;
      };
      text?: {
        value?: string;
        visible?: boolean;
        fontSize?: number;
      };
    }) {
      const container = {
        class: `${obj?.container?.class ?? ''}`,
        style: `margin-top: 2rem ;${obj?.container?.style}`,
      };
      const circleAttr = {
        visible: obj?.circle?.visible === false ? false : true,
        width: obj?.circle?.width ?? 20,
        borderSize: obj?.circle?.borderSize ?? 16,
      };
      const textAttr = {
        value: obj?.text?.value ?? Language.text('loading'),
        visible: obj?.text?.visible === false ? false : true,
        fontSize: obj?.text?.fontSize ?? 16,
      };
      return html` <div
        class="d-flex align-items-center justify-content-center flex-column w-100 mx-auto ${container.class}"
        style="${container.style}"
      >
        <div
          class="spinner-border ${circleAttr.visible ? '' : 'd-none'}"
          style="font-size: ${circleAttr.borderSize}px; width: ${circleAttr.width}px; height: ${circleAttr.width}px;"
          role="status"
        ></div>
        <span class="mt-3 ${textAttr.visible ? '' : 'd-none'}" style="font-size: ${textAttr.fontSize}px;"
          >${textAttr.value}</span
        >
      </div>`;
    }

    function gClass(text: string | string[]): string {
      if (Array.isArray(text)) {
        return text.map(c => gClass(c)).join(' ');
      }
      return `${classPrefix}-${text}`;
    }

    function addItemBadge() {
      return html` <div class="${gClass('add-item-badge')}">
        <div class="${gClass('add-item-text')}">${Language.text('addon')}</div>
      </div>`;
    }

    function giftBadge() {
      return html` <div class="${gClass('add-item-badge')}" style="background:  #FFE9B2;">
        <div class="${gClass('add-item-text')}">${Language.text('gift')}</div>
      </div>`;
    }

    function hiddenBadge() {
      return html` <div class="${gClass('add-item-badge')}" style="background: #EAEAEA;color:white !important;">
        <div class="${gClass('add-item-text')}">${Language.text('hidden_goods')}</div>
      </div>`;
    }

    function refreshCartData() {
      //重取購物車資料
      apiCart = getCartData();
      const dialog = new ShareDialog(gvc.glitter);
      //初次載入不需要加載動畫
      if (!loadings.page) {
        dialog.dataLoading({ visible: true });
      }
      const beta = false;
      if (!beta) {
        new Promise(async resolve => {
          new Promise(resolve => {
            setTimeout(() => resolve(apiCart.cart), 50);
          }).then(async (res: any) => {
            const cartData: {
              line_items: {
                sku: string;
                spec: string[];
                stock: number;
                sale_price: number;
                compare_price: number;
                preview_image: string;
                title: string;
                id: number;
                count: number;
              }[];
              total: number;
              user_info: {
                shipment: string;
              };
            } = {
              line_items: [],
              total: 0,
              user_info: {
                shipment: localStorage.getItem('shipment-select') as string,
              },
            };

            const cartObject = await CartModule.getLineItemAndShipmentCart();

            vm.cartDataList = cartObject.dataList;
            vm.logisticsGroup = cartObject.logisticsGroup;
            vm.hasFullLengthCart = cartObject.hasFullLengthCart;

            if (!localStorage.getItem('logistics-group')) {
              localStorage.setItem(
                'logistics-group',
                (() => {
                  try {
                    return vm.cartDataList[0].group[0];
                  } catch (error) {
                    return '';
                  }
                })()
              );
            }

            function resetShipmentSelected() {
              const findGroup = vm.logisticsGroup.find(item => item.key === localStorage.getItem('logistics-group'));
              if (findGroup) {
                const list = findGroup.list;
                const def = localStorage.getItem('shipment-select');
                if (!def || !list.includes(def)) {
                  localStorage.setItem('shipment-select', list[0]);
                }
              }
            }

            const defaultShipmentCart = vm.cartDataList.find(data => {
              const findGroup = vm.logisticsGroup.find(item => item.key === localStorage.getItem('logistics-group'));
              return findGroup?.list.includes(data.logistic);
            });

            if (defaultShipmentCart) {
              res.line_items = defaultShipmentCart.cart;
              resetShipmentSelected();
            } else if (vm.cartDataList[0]) {
              res.line_items = vm.cartDataList[0].cart;
            } else {
              res.line_items = [];
            }

            if (res.line_items) {
              res.user_info = {
                payment: localStorage.getItem('checkout-payment'),
                shipment: localStorage.getItem('shipment-select') as string,
                country: localStorage.getItem('country-select'),
              };
              const cart = res as CartItem;
              ApiShop.getCheckout(cart).then(res => {
                if (res.result) {
                  resolve(res.response.data);
                } else {
                  resolve([]);
                }
              });
            } else {
              for (const b of Object.keys(res)) {
                cartData.line_items.push({
                  id: b.split('-')[0] as any,
                  count: res[b] as number,
                  spec: b.split('-').filter((dd, index) => {
                    return index !== 0;
                  }) as any,
                } as any);
              }
              const voucher = apiCart.cart.code;
              const rebate = apiCart.cart.use_rebate || 0;
              const distributionCode = localStorage.getItem('distributionCode') ?? '';
              ApiShop.getCheckout({
                line_items: cartData.line_items.map(dd => {
                  return {
                    id: dd.id,
                    spec: dd.spec,
                    count: dd.count,
                  };
                }),
                code: voucher as string,
                use_rebate: GlobalUser.token && rebate ? rebate : undefined,
                distribution_code: distributionCode,
                user_info: {
                  shipment: localStorage.getItem('shipment-select'),
                  country: localStorage.getItem('country-select'),
                },
              }).then(res => {
                if (res.result) {
                  resolve(res.response.data);
                } else {
                  resolve([]);
                }
              });
            }
          });
        }).then(data => {
          vm.cartData = data;
          if (onlineData.interaction) {
            let newTotal = 0;
            (data as any).lineItems.forEach((lineItem: any) => {
              let product = onlineData.interaction.content.item_list.find((item: any) => {
                return item.id == lineItem.id;
              });
              let variant = product.content.variants.find((item: any) => {
                return item.spec.join(',') == lineItem.spec.join(',');
              });
              lineItem.sale_price = parseInt(variant.live_model.live_price);
              newTotal += lineItem.sale_price * lineItem.count;
            });
            (data as any).total = newTotal + (data as any).shipment_fee;
          }
          ApiWallet.getRebateConfig({ type: 'me' }).then(async res => {
            if (res.result && res.response.data) {
              vm.rebateConfig = res.response.data;
            }
            vm.rebateConfig.title = CheckInput.isEmpty(vm.rebateConfig.title)
              ? Language.text('shopping_credit')
              : vm.rebateConfig.title;
            gvc.addMtScript(
              [
                {
                  src: `${gvc.glitter.root_path}/jslib/lottie-player.js`,
                },
                {
                  src: `https://js.paynow.com.tw/sdk/v2/index.js?v=20250430`,
                },
              ],
              () => {},
              () => {}
            );
            loadings.page = false;
            dialog.dataLoading({ visible: false });
            gvc.notifyDataChange(['js-cart-count', ids.page]);
          });
        });
      } else {
        gvc.addMtScript(
          [
            {
              src: `${gvc.glitter.root_path}/jslib/lottie-player.js`,
            },
          ],
          () => {},
          () => {}
        );
        vm.cartData = FakeOrder.data;
        ApiWallet.getRebateConfig({ type: 'me' }).then(async res => {
          if (res.result && res.response.data) {
            vm.rebateConfig = res.response.data;
          }
          vm.rebateConfig.title = CheckInput.isEmpty(vm.rebateConfig.title)
            ? Language.text('shopping_credit')
            : vm.rebateConfig.title;
          gvc.addMtScript(
            [
              {
                src: `${gvc.glitter.root_path}/jslib/lottie-player.js`,
              },
              {
                src: `https://js.paynow.com.tw/sdk/v2/index.js`,
              },
            ],
            () => {},
            () => {}
          );
          loadings.page = false;
          dialog.dataLoading({ visible: false });
          gvc.notifyDataChange(['js-cart-count', ids.page]);
        });
        loadings.page = false;
        dialog.dataLoading({ visible: false });
        gvc.notifyDataChange(ids.page);
      }
      gvc.glitter.recreateView('.js-cart-count');
    }

    function formatterFormElement(dd: any) {
      dd.col = '4';
      dd.form_config.title_style = {
        list: [
          {
            class: gClass('label') + ' mb-2',
            style:
              'return `color:${glitter.share.globalValue[`theme_color.0.title`]} !important;font-size:16px !important;`',
            stylist: [],
            dataType: 'code',
            style_from: 'code',
            classDataType: 'static',
          },
        ],
        class: 'form-label',
        style: 'font-size: 20px;font-style: normal;font-weight: 400;line-height: 140%; color:#393939 !important;',
        stylist: [],
        version: 'v2',
        dataType: 'static',
        style_from: 'code',
        classDataType: 'static',
      };
      dd.form_config.input_style = {
        list: [
          {
            class: gClass('input'),
            style: 'return `border-radius: ${widget.formData.radius}px !important;`',
            stylist: [],
            dataType: 'code',
            style_from: 'code',
            classDataType: 'static',
          },
        ],
        class: ' mb-3',
        style: 'background: #FFF;',
        stylist: [],
        version: 'v2',
        dataType: 'static',
        style_from: 'code',
        classDataType: 'static',
      };
      return dd;
    }

    if (gvc.glitter.getUrlParameter('source') == 'group_buy' && gvc.glitter.getUrlParameter('cart_id')) {
      const cart_id = glitter.getUrlParameter('cart_id');
      const online_cart = new ApiCart(cart_id);
      online_cart.clearCart();
      ApiLiveInteraction.getOnlineCart(cart_id).then(r => {
        r.response.cartData.content.cart.forEach((item: any) => {
          online_cart.addToCart(item.id, item.spec.split(','), item.count);
        });
        onlineData = r.response;
        apiCart = online_cart;

        refreshCartData();
        glitter.share.reloadCartData = () => {
          refreshCartData();
        };
      });
    } else {
      refreshCartData();
      glitter.share.reloadCartData = () => {
        refreshCartData();
      };
    }
    return (
      gvc.bindView(
        (() => {
          return {
            bind: ids.page,
            view: async () => {
              try {
                if (loadings.page) {
                  return spinner();
                }
                const detail_info = html` <div class="d-flex flex-column gap-3">
                  <span class="${gClass('banner-text')}">${Language.text('shopping_details')}</span>

                  <div class="${gClass(['price-row', 'text-2'])}">
                    <div>${Language.text('total_products')}</div>
                    <div>
                      ${Currency.convertCurrencyText(
                        vm.cartData.total - vm.cartData.shipment_fee + vm.cartData.discount + vm.cartData.use_rebate
                      )}
                    </div>
                  </div>
                  <div class="${gClass(['price-row', 'text-2'])}">
                    <div>${Language.text('shipping_fee')}</div>
                    <div>${Currency.convertCurrencyText(vm.cartData.shipment_fee)}</div>
                  </div>
                  <div class="${gClass(['price-row', 'text-2'])}">
                    <div>${Language.text('discount_coupon')}</div>
                    <div>- ${Currency.convertCurrencyText(vm.cartData.discount)}</div>
                  </div>
                  <!-- 可使用的優惠券 -->
                  <div class="${gClass(['price-row', 'text-2'])}">
                    <div>${Language.text('promo_code')}</div>
                    <div
                      style="cursor: pointer; color: #3564c0;"
                      onclick="${gvc.event(() => {
                        this.viewDialog({
                          gvc: gvc,
                          title: Language.text('available_coupons'),
                          tag: '',
                          innerHTML: (gvc: GVC) => {
                            return gvc.bindView(
                              (() => {
                                const id = glitter.getUUID();
                                const vmi = {
                                  dataList: [] as Voucher[],
                                };
                                const isWebsite = document.body.clientWidth > 768;
                                let loading = true;
                                return {
                                  bind: id,
                                  view: () => {
                                    try {
                                      if (loading) {
                                        return html` <div style="height: 400px">${spinner()}</div>`;
                                      } else {
                                        const header = [
                                          {
                                            title: Language.text('coupon_name'),
                                          },
                                          {
                                            title: Language.text('coupon_code'),
                                          },
                                          {
                                            title: Language.text('expiration_date'),
                                          },
                                          {
                                            title: '',
                                          },
                                        ];

                                        function formatText(item: UserVoucher) {
                                          return [
                                            item.title,
                                            item.code,
                                            (() => {
                                              const endText = item.end_ISO_Date
                                                ? glitter.ut.dateFormat(new Date(item.end_ISO_Date), 'yyyy/MM/dd')
                                                : Language.text('no_expiration');
                                              return `${glitter.ut.dateFormat(
                                                new Date(item.start_ISO_Date),
                                                'yyyy/MM/dd'
                                              )} ~ ${endText}`;
                                            })(),
                                            item.usePass
                                              ? html` <button
                                                  class="${gClass('button-bgr')} my-2"
                                                  style="max-width: 150px;"
                                                  onclick="${gvc.event(() => {
                                                    apiCart.setCart(cartItem => {
                                                      cartItem.code = item.code;
                                                      refreshCartData();
                                                      gvc.closeDialog();
                                                    });
                                                  })}"
                                                >
                                                  <span class="${gClass('button-text')}"
                                                    >${Language.text('select_to_use')}</span
                                                  >
                                                </button>`
                                              : html` <button
                                                  class="${gClass('button-bgr-disable')} my-2"
                                                  style="max-width: 150px; cursor: not-allowed"
                                                >
                                                  <span class="${gClass('button-text')}"
                                                    >${Language.text('not_meet_usage_criteria')}</span
                                                  >
                                                </button>`,
                                          ];
                                        }

                                        const dialog = new ShareDialog(gvc.glitter);
                                        const cloneCart = JSON.parse(JSON.stringify(vm.cartData));

                                        function checkCodeValue(code: string) {
                                          cloneCart.code = code;
                                          cloneCart.line_items = cloneCart.lineItems;
                                          dialog.dataLoading({ visible: true });
                                          ApiShop.getCheckout(cloneCart).then(r => {
                                            dialog.dataLoading({ visible: false });
                                            if (
                                              r.result &&
                                              r.response.data &&
                                              r.response.data.voucherList.some((dd: any) => {
                                                return dd.code === code;
                                              })
                                            ) {
                                              apiCart.setCart(cartItem => {
                                                cartItem.code = code;
                                                refreshCartData();
                                                gvc.closeDialog();
                                              });
                                            } else {
                                              dialog.errorMessage({
                                                text: Language.text('code_unusable'),
                                              });
                                            }
                                          });
                                        }

                                        if (isWebsite) {
                                          const flexList = [1.2, 1, 1.5, 1.5];
                                          return html`
                                            <div>
                                              <div class="d-flex align-items-center mb-2">
                                                <label class="${gClass('label')} mb-0 me-2" style="min-width: 80px;"
                                                  >${Language.text('enter_code')}</label
                                                >
                                                <input
                                                  class="${gClass('input')}"
                                                  type="text"
                                                  onchange="${gvc.event(e => {
                                                    checkCodeValue(e.value);
                                                  })}"
                                                />
                                              </div>
                                            </div>
                                            ${vmi.dataList.length > 0
                                              ? html`<div class="w-100 d-sm-flex py-4 um-th-bar">
                                                    ${header
                                                      .map((item, index) => {
                                                        return html` <div
                                                          class="um-th"
                                                          style="flex: ${flexList[index]};"
                                                        >
                                                          ${item.title}
                                                        </div>`;
                                                      })
                                                      .join('')}
                                                  </div>
                                                  ${vmi.dataList
                                                    .map(item => {
                                                      const fText = formatText(item.content);
                                                      return html` <div class="w-100 d-sm-flex py-1 align-items-center">
                                                        ${fText
                                                          .map((dd, t2) => {
                                                            return html` <div
                                                              class="um-td ${t2 === fText.length - 1
                                                                ? 'text-center'
                                                                : ''}"
                                                              style="flex: ${flexList[t2]}"
                                                            >
                                                              ${dd}
                                                            </div>`;
                                                          })
                                                          .join('')}
                                                      </div>`;
                                                    })
                                                    .join('')}`
                                              : html`<div
                                                  class="d-flex justify-content-center align-items-center"
                                                  style="height: 250px;"
                                                >
                                                  尚無可使用的優惠券
                                                </div>`}
                                          `;
                                        }

                                        let voucher = '';
                                        return html`<div class="d-flex flex-column flex-sm-row align-items-center">
                                            <div class="d-flex align-items-center w-100">
                                              <input
                                                class="${gClass('input')}"
                                                type="text"
                                                style="border-top-right-radius: 0;border-bottom-right-radius: 0px;"
                                                onchange="${gvc.event(e => {
                                                  voucher = e.value;
                                                })}"
                                                placeholder="${Language.text('enter_promo_code')}"
                                              />
                                              <button
                                                class="${gClass('button-bgr')}"
                                                style="width:100px;border-top-left-radius: 0;border-bottom-left-radius: 0px;"
                                                onclick="${gvc.event(e => {
                                                  checkCodeValue(voucher);
                                                })}"
                                              >
                                                <span class="${gClass('button-text')}"
                                                  >${Language.text('confirm')}</span
                                                >
                                              </button>
                                            </div>
                                          </div>
                                          <div class="w-100 d-sm-none mb-3 s162413">
                                            ${vmi.dataList.length > 0
                                              ? vmi.dataList
                                                  .map(item => {
                                                    return html` <div class="um-mobile-area">
                                                      ${formatText(item.content)
                                                        .map((dd, index) => {
                                                          if (header[index].title === '') {
                                                            return dd;
                                                          }
                                                          return html` <div class="um-mobile-text">
                                                            ${header[index].title} : ${dd}
                                                          </div>`;
                                                        })
                                                        .join('')}
                                                    </div>`;
                                                  })
                                                  .join('')
                                              : html`<div
                                                  class="d-flex justify-content-center align-items-center"
                                                  style="height: 200px;"
                                                >
                                                  尚無可使用的優惠券
                                                </div>`}
                                          </div>`;
                                      }
                                    } catch (e) {
                                      return '';
                                    }
                                  },
                                  onCreate: () => {
                                    if (loading) {
                                      gvc.addMtScript(
                                        [
                                          {
                                            src: `${gvc.glitter.root_path}/jslib/lottie-player.js`,
                                          },
                                        ],
                                        () => {
                                          ApiShop.getVoucher({
                                            page: 0,
                                            limit: 10000,
                                            data_from: 'user',
                                          }).then(async res => {
                                            if (res.result && res.response.data) {
                                              vmi.dataList = res.response.data.filter((item: Voucher) => {
                                                return (
                                                  item.content.status === 1 &&
                                                  item.content.trigger === 'code' &&
                                                  Tool.isNowBetweenDates(
                                                    item.content.start_ISO_Date,
                                                    item.content.end_ISO_Date
                                                  )
                                                );
                                              });
                                            } else {
                                              vmi.dataList = [];
                                            }
                                            const cloneCart = JSON.parse(JSON.stringify(vm.cartData));
                                            Promise.all(
                                              vmi.dataList.map((voucher, index) => {
                                                return new Promise<{
                                                  code: string;
                                                  response: any;
                                                }>(resolve => {
                                                  const code = voucher.content.code;
                                                  cloneCart.code = code;
                                                  cloneCart.line_items = cloneCart.lineItems;
                                                  ApiShop.getCheckout(cloneCart).then(response => {
                                                    resolve({
                                                      code,
                                                      response,
                                                    });
                                                  });
                                                });
                                              })
                                            ).then(
                                              (
                                                resolveArray: {
                                                  code: string;
                                                  response: any;
                                                }[]
                                              ) => {
                                                vmi.dataList = vmi.dataList.map(item => {
                                                  const f = resolveArray.find(res => {
                                                    return item.content.code === res.code;
                                                  });
                                                  if (f) {
                                                    const r = f.response;
                                                    if (r.result && r.response.data) {
                                                      item.content.usePass = r.response.data.voucherList.some(
                                                        (dd: any) => {
                                                          return dd.code === f.code;
                                                        }
                                                      );
                                                    }
                                                  }
                                                  return item;
                                                });
                                                loading = false;
                                                gvc.notifyDataChange(id);
                                              }
                                            );
                                          });
                                        },
                                        () => {}
                                      );
                                    }
                                  },
                                };
                              })()
                            );
                          },
                        });
                      })}"
                    >
                      ${vm.cartData.code
                        ? html`${vm.cartData.code}<i
                              class="fa-solid fa-xmark-large ms-2"
                              style="cursor: pointer;"
                              onclick="${gvc.event((e, event) => {
                                event.stopPropagation();
                                apiCart.setCart(cartItem => {
                                  cartItem.code = '';
                                  refreshCartData();
                                });
                              })}"
                            ></i>`
                        : Language.text('add')}
                    </div>
                  </div>
                  ${(() => {
                    if (!GlobalUser.token || !vm.cartData.useRebateInfo.status) {
                      return '';
                    } else {
                      return html` ${(() => {
                          let tempRebate: number = 0;
                          const dialog = new ShareDialog(gvc.glitter);
                          return html` <div class="${gClass(['price-row', 'text-2'])}">
                              <div>${vm.rebateConfig.title}${Language.text('discount')}</div>
                              <div>- ${Currency.convertCurrencyText(vm.cartData.use_rebate)}</div>
                            </div>
                            <div class="${gClass(['price-row', 'text-2'])}">
                              <div>${vm.rebateConfig.title}${Language.text('reback_text')}</div>
                              <div>+ ${vm.cartData.rebate.toLocaleString()}</div>
                            </div>

                            <div class="${gClass(['price-row', 'text-2'])}">
                              <div
                                style="  justify-content: flex-start; align-items: center; display: inline-flex;border:1px solid #EAEAEA;border-radius: 10px;overflow: hidden; ${document
                                  .body.clientWidth > 768
                                  ? 'gap: 18px;'
                                  : 'gap: 0px;'}"
                                class="w-100"
                              >
                                <input
                                  class="flex-fill ${gClass('group-input')}"
                                  placeholder="${Language.text('please_enter')}${vm.rebateConfig.title}"
                                  style="${document.body.clientWidth < 800
                                    ? `width:calc(100% - 150px) !important;`
                                    : ''}"
                                  value="${vm.cartData.use_rebate || ''}"
                                  onchange="${gvc.event((e, event) => {
                                    if (CheckInput.isNumberString(e.value)) {
                                      tempRebate = parseInt(e.value, 10);
                                    } else {
                                      dialog.errorMessage({ text: Language.text('enter_value') });
                                      gvc.notifyDataChange(ids.page);
                                    }
                                  })}"
                                />
                                <div class="${gClass('group-button')}">
                                  <div
                                    class="${gClass('button-text')}"
                                    onclick="${gvc.event(async () => {
                                      const sum: number = await new Promise((resolve, reject) => {
                                        ApiShop.getRebate({}).then(async res => {
                                          if (res.result && res.response.sum) {
                                            resolve(res.response.sum);
                                          } else {
                                            resolve(0);
                                          }
                                        });
                                      });
                                      const limit =
                                        vm.cartData.total - vm.cartData.shipment_fee + vm.cartData.use_rebate;
                                      if (sum === 0) {
                                        dialog.errorMessage({
                                          text: `您的 ${vm.rebateConfig.title} 為 0 點，無法折抵`,
                                        });
                                        return;
                                      }
                                      if (tempRebate > Math.min(sum, limit)) {
                                        dialog.errorMessage({
                                          text: `${Language.text('please_enter')} 0 到 ${Math.min(sum, limit)} 的數值`,
                                        });
                                        return;
                                      }

                                      apiCart.setCart(cartItem => {
                                        cartItem.use_rebate = tempRebate;
                                        refreshCartData();
                                      });
                                    })}"
                                  >
                                    ${Language.text('apply')}
                                  </div>
                                </div>
                              </div>
                            </div>`;
                        })()}
                        <div class="${gClass(['price-row', 'text-2'])}">
                          ${(() => {
                            return gvc.bindView(() => {
                              return {
                                bind: gvc.glitter.getUUID(),
                                view: async () => {
                                  const sum = await new Promise((resolve, reject) => {
                                    ApiShop.getRebate({}).then(async res => {
                                      if (res.result && res.response.sum) {
                                        resolve(res.response.sum);
                                      } else {
                                        resolve(0);
                                      }
                                    });
                                  });
                                  if (!vm.cartData.useRebateInfo) {
                                    return '';
                                  }

                                  const info = vm.cartData.useRebateInfo;
                                  if (info.condition) {
                                    return html`${Language.text('distance_from_target_amount')}$
                                    ${info.condition.toLocaleString()} ${Language.text('can_use_now')}
                                    ${vm.rebateConfig.title} ${Language.text('discount')}`;
                                  }
                                  if (info.limit) {
                                    return html`${Language.text('remaining_balance')} ${sum || 0}
                                      ${Language.text('point')} ${vm.rebateConfig.title} <br />${Language.text(
                                        'max_discount_order'
                                      )}
                                      ${info.limit.toLocaleString()} ${Language.text('point')} ${vm.rebateConfig.title}`;
                                  } else {
                                    return `${Language.text('remaining_balance')} ${sum || 0} ${Language.text('point')} ${
                                      vm.rebateConfig.title
                                    }`;
                                  }
                                },
                              };
                            });
                          })()}
                        </div>`;
                    }
                  })()}
                  <div class="${gClass(['price-row', 'text-2', 'bold'])}">
                    <div>${Language.text('total_amount')}</div>
                    <div class="${gClass('total_amount')}">${Currency.convertCurrencyText(vm.cartData.total)}</div>
                  </div>
                </div>`;
                if (!widget.share.receipt_form) {
                  const res = await ApiUser.getPublicConfig('custom_form_checkout_recipient', 'manager');
                  widget.share.receipt_form = FormCheck.initialRecipientForm(res.response.value.list ?? []).filter(
                    dd => {
                      return !dd.hidden;
                    }
                  );
                  vm.cartData.receipt_form = widget.share.receipt_form.filter((dd: any) => {
                    return !['name', 'email', 'phone'].includes(dd.key);
                  });
                }
                if (!widget.share.custom_form_checkout) {
                  const res = await ApiUser.getPublicConfig('custom_form_checkout', 'manager');
                  widget.share.custom_form_checkout = FormCheck.initialCheckOutForm(res.response.value.list ?? []);
                  vm.cartData.custom_form_format = widget.share.custom_form_checkout.filter((dd: any) => {
                    return !['name', 'email', 'phone'].includes(dd.key);
                  });
                }
                this.initial(vm.cartData);
                CartModule.addStyle(gvc, classPrefix);
                if (vm.cartData.lineItems.length === 0) {
                  return html`
                    <div class="container ${gClass(['container', 'null-container'])}">
                      <div class="${gClass('header')}">${Language.text('shopping_details')}</div>
                      <lottie-player
                        style="max-width: 100%; width: 300px; height: 300px;"
                        src="https://lottie.host/38ba8340-3414-41b8-b068-bba18d240bb3/h7e1Q29IQJ.json"
                        speed="1"
                        loop=""
                        autoplay=""
                        background="transparent"
                      ></lottie-player>
                      <div class="mt-3 fw-bold">${Language.text('empty_cart_message')}</div>
                    </div>
                  `;
                }
                return html` <div class="w-100" style="margin-top:0 !important;">
                  ${gvc.bindView(
                    (() => {
                      return {
                        bind: ids.cart,
                        view: () => {
                          let padding = (document.body.clientWidth - 1200) / 2;
                          if (gvc.glitter.getUrlParameter('page') !== 'checkout') {
                            padding = 0;
                          }

                          const shipmentSupportSet = new Set(vm.cartData.shipment_support);

                          const shipmentList = this.getShipmentMethod(vm.cartData).filter((dd: { value: string }) =>
                            shipmentSupportSet.has(dd.value)
                          );

                          const localShip = shipmentSupportSet.has(localStorage.getItem('shipment-select'));

                          if (shipmentList.length === 0) {
                            vm.cartData.user_info.shipment = 'none';
                            localStorage.setItem('shipment-select', 'none');
                          } else if (localShip) {
                            vm.cartData.user_info.shipment = localStorage.getItem('shipment-select');
                          } else {
                            vm.cartData.user_info.shipment = shipmentList[0].value;
                            localStorage.setItem('shipment-select', shipmentList[0].value);
                          }

                          return html`
                            <div
                              class="d-flex flex-column flex-md-row justify-content-between w-100"
                              style="${document.body.clientWidth > 800 &&
                              gvc.glitter.getUrlParameter('page') === 'checkout'
                                ? `height:calc(100vh - 150px);overflow-y:auto;`
                                : `gap:20px;`} padding-left:${padding > 0 ? padding : 10}px;padding-right:${padding > 0
                                ? padding
                                : 10}px;"
                            >
                              <div
                                style="${document.body.clientWidth > 800
                                  ? `width:calc(66% - 10px);`
                                  : `width:calc(100%);`}"
                              >
                                <div
                                  style="padding-top:20px;"
                                  class="${gClass('banner-text')} fs-4 mb-3 pt-3 ${gvc.glitter.getUrlParameter(
                                    'page'
                                  ) === 'checkout'
                                    ? ''
                                    : `d-none`}"
                                >
                                  ${Language.text(
                                    ApiCart.checkoutCart === ApiCart.buyItNow ? 'buy_it_now' : 'your_shopping_cart'
                                  )}
                                </div>

                                ${(() => {
                                  const cartGroupSet = new Set(vm.cartDataList.map(cart => cart.group).flat());

                                  const filterLogiGroup = vm.logisticsGroup.filter(item => {
                                    return cartGroupSet.has(item.key);
                                  });

                                  if (filterLogiGroup.length < 2 || vm.hasFullLengthCart) {
                                    return '';
                                  }

                                  return html`<div
                                    class="rounded-3 bg-white w-100 ps-4"
                                    style="height: 68px; overflow: auto hidden;"
                                  >
                                    ${ProductModule.tab(
                                      filterLogiGroup.map(item => {
                                        return {
                                          title: item.name,
                                          key: item.key,
                                        };
                                      }),
                                      gvc,
                                      localStorage.getItem('logistics-group') ?? filterLogiGroup[0].key,
                                      text => {
                                        localStorage.setItem('logistics-group', text);
                                        refreshCartData();
                                      },
                                      'justify-content: flex-start;'
                                    )}
                                  </div>`;
                                })()}
                                <div class="rounded-3 bg-white w-100 mt-3">
                                  ${gvc.bindView({
                                    bind: glitter.getUUID(),
                                    view: () => {
                                      try {
                                        return vm.cartData.lineItems
                                          .map((item: any, index: number) => {
                                            function getBadgeClass() {
                                              if (item.is_add_on_items) {
                                                return addItemBadge();
                                              } else if (item.is_gift) {
                                                return giftBadge();
                                              } else if (item.is_hidden) {
                                                return hiddenBadge();
                                              } else {
                                                return '';
                                              }
                                            }

                                            const title =
                                              (item.language_data &&
                                                item.language_data[Language.getLanguage()].title) ||
                                              item.title;
                                            const spec = (() => {
                                              if (item.spec) {
                                                return item.spec.map((dd: string, index: number) => {
                                                  try {
                                                    return (
                                                      item.specs[index].option.find((d1: any) => {
                                                        return d1.title === dd;
                                                      }).language_title[Language.getLanguage()] || dd
                                                    );
                                                  } catch (e) {
                                                    return dd;
                                                  }
                                                });
                                              } else {
                                                return '';
                                              }
                                            })();

                                            if (vm.cartData.lineItems.length === index + 1) {
                                              gvc.notifyDataChange(ids.shipping);
                                            }

                                            return html`
                                              <div class="d-flex flex-column p-lg-3 px-2 py-3 gap-2">
                                                <div class="d-flex w-100 position-relative" style="gap:20px;">
                                                  <div class=" justify-content-start  ">
                                                    <div
                                                      style="width: 88px;height: 88px;border-radius: 10px;background: 50%/cover url('${item.preview_image}')"
                                                    ></div>
                                                  </div>
                                                  <div
                                                    class="d-flex  flex-column  position-relative"
                                                    style="gap: 2px; position: relative; width:calc(100% - 115px);"
                                                  >
                                                    <span
                                                      class="fw-bold pe-4"
                                                      style="gap:5px;font-size:${document.body.clientWidth > 800
                                                        ? `16`
                                                        : `14`}px;max-width:calc(100% - 10px); display: -webkit-box; -webkit-line-clamp: 2;  -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; "
                                                      >${title}</span
                                                    >
                                                    <div class="${gClass(['66text'])} fs-sm">
                                                      ${spec ? spec.join(' / ') : ''}
                                                    </div>
                                                    <div>${getBadgeClass()}</div>
                                                    <div class="d-flex flex-column align-items-start " style="gap:2px;">
                                                      <div class="fw-bold fs-6 ${gClass('price-text')}">
                                                        ${(() => {
                                                          if (item.is_gift) {
                                                            return Currency.convertCurrencyText(0);
                                                          }
                                                          return Currency.convertCurrencyText(
                                                            parseFloat(item.sale_price)
                                                          );
                                                        })()}
                                                      </div>
                                                      ${(() => {
                                                        if (item.is_gift || item.sale_price >= item.origin_price) {
                                                          return '';
                                                        }
                                                        return html` <div
                                                          style="text-decoration: line-through; font-size: 12px;"
                                                        >
                                                          ${Currency.convertCurrencyText(parseFloat(item.origin_price))}
                                                        </div>`;
                                                      })()}
                                                    </div>
                                                    <div class="w-100 d-flex">
                                                      <div class="flex-fill"></div>
                                                      <div
                                                        class="d-flex align-items-center border rounded-2"
                                                        style="overflow: hidden;"
                                                      >
                                                        <div
                                                          class="${item.is_gift
                                                            ? `d-none`
                                                            : `d-flex`} align-items-center justify-content-center"
                                                          style="width:38px;height: 38px;cursor: pointer;"
                                                          onclick="${gvc.event(() => {
                                                            apiCart.setCart(cartItem => {
                                                              const find = cartItem.line_items.find(dd => {
                                                                return (
                                                                  dd.id === item.id &&
                                                                  item.spec.join('') === dd.spec.join('')
                                                                );
                                                              })!;
                                                              if (find.count - 1 > 0) {
                                                                find.count = find.count - 1;
                                                                refreshCartData();
                                                              }
                                                            });
                                                          })}"
                                                        >
                                                          <i class="fa-solid fa-minus" style="color:black;"></i>
                                                        </div>
                                                        <select
                                                          class="form-select custom-select mx-0 p-0 "
                                                          style="
                                                            
                                                            ${item.is_gift
                                                            ? `border:none;`
                                                            : `border-top:none;border-bottom: none;`}
                                                            border-radius: 0px; color: #575757; width: 50px;height:38px;background-image:none;${parseInt(
                                                            vm.quantity,
                                                            10
                                                          ) < 10
                                                            ? `text-indent: 43%;`
                                                            : `text-indent: 40%;`}"
                                                          onchange="${gvc.event(e => {
                                                            apiCart.setCart(cartItem => {
                                                              cartItem.line_items.find(dd => {
                                                                return (
                                                                  dd.id === item.id &&
                                                                  item.spec.join('') === dd.spec.join('')
                                                                );
                                                              })!.count = parseInt(e.value, 10);
                                                              refreshCartData();
                                                            });
                                                          })}"
                                                          ${item.is_gift ? `disabled` : ''}
                                                        >
                                                          ${[
                                                            ...new Array(
                                                              (() => {
                                                                if (item.show_understocking === 'false') {
                                                                  return 50;
                                                                }
                                                                return item.stock < 50 ? item.stock : 50;
                                                              })()
                                                            ),
                                                          ]
                                                            .map((_, index) => {
                                                              return html` <option
                                                                value="${index + 1}"
                                                                ${index + 1 === item.count ? `selected` : ''}
                                                              >
                                                                ${index + 1}
                                                              </option>`;
                                                            })
                                                            .join('')}
                                                        </select>
                                                        <div
                                                          class=" align-items-center justify-content-center ${item.is_gift
                                                            ? `d-none`
                                                            : `d-flex`}"
                                                          style="width:38px;height: 38px;cursor: pointer;"
                                                          onclick="${gvc.event(() => {
                                                            apiCart.setCart(cartItem => {
                                                              const find = cartItem.line_items.find(dd => {
                                                                return (
                                                                  dd.id === item.id &&
                                                                  item.spec.join('') === dd.spec.join('')
                                                                );
                                                              })!;
                                                              if (
                                                                item.show_understocking === 'false' ||
                                                                find.count + 1 < item.stock
                                                              ) {
                                                                find.count = find.count + 1;
                                                                refreshCartData();
                                                              }
                                                            });
                                                          })}"
                                                        >
                                                          <i class="fa-solid fa-plus" style="color:black;"></i>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div
                                                      class="d-block "
                                                      style="position: absolute; right: 5px; top:0px;"
                                                    >
                                                      <i
                                                        class="fa-solid fa-xmark-large"
                                                        style="cursor: pointer;color:gray;"
                                                        onclick="${gvc.event(() => {
                                                          apiCart.setCart(cartItem => {
                                                            cartItem.line_items = cartItem.line_items.filter(dd => {
                                                              return !(
                                                                dd.id === item.id &&
                                                                item.spec.join('') === dd.spec.join('')
                                                              );
                                                            });
                                                            refreshCartData();
                                                          });
                                                        })}"
                                                      ></i>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div>
                                                  ${vm.cartData.voucherList
                                                    .filter((dd: any) => {
                                                      return (
                                                        dd.bind.find((d2: any) => {
                                                          return d2.id === item.id;
                                                        }) &&
                                                        dd.reBackType !== 'giveaway' &&
                                                        dd.reBackType !== 'add_on_items'
                                                      );
                                                    })
                                                    .map((dd: any) => {
                                                      return html`<div
                                                        class="w-100"
                                                        style="${document.body.clientWidth < 800
                                                          ? `font-size:12px;`
                                                          : `font-size:14px;`}"
                                                      >
                                                        <i class="fa-solid fa-tickets-perforated  me-2"></i>${dd.title}
                                                      </div>`;
                                                    })
                                                    .join('<div class="my-1"></div>')}
                                                  ${(() => {
                                                    let min = (item.min_qty && parseInt(item.min_qty, 10)) || 1;
                                                    let count = 0;
                                                    for (const b of vm.cartData.lineItems) {
                                                      if (b.id === item.id) {
                                                        count += b.count;
                                                      }
                                                    }
                                                    if (count < min) {
                                                      return `<div class="text-danger">${Language.text('min_p_count').replace('_c_', min)}</div>`;
                                                    } else {
                                                      return '';
                                                    }
                                                  })()}
                                                  ${(() => {
                                                    let max_qty =
                                                      (item.max_qty && parseInt(item.max_qty, 10)) || Infinity;
                                                    let count = 0;
                                                    for (const b of vm.cartData.lineItems) {
                                                      if (b.id === item.id) {
                                                        count += b.count;
                                                      }
                                                    }

                                                    if (count > max_qty) {
                                                      return html`<div class="text-danger">
                                                        ${Language.text('max_p_count').replace('_c_', max_qty)}
                                                      </div>`;
                                                    } else {
                                                      return '';
                                                    }
                                                  })()}
                                                </div>
                                              </div>
                                            `;
                                          })
                                          .join(html`<div class="border-bottom w-100"></div>`);
                                      } catch (e) {
                                        console.error(`error 1 =>`, e);
                                        return '';
                                      }
                                    },
                                  })}
                                </div>
                                <!--贈品-->
                                ${(() => {
                                  const giftHtml = vm.cartData.voucherList
                                    .filter((d1: any) => {
                                      return d1.reBackType === 'giveaway';
                                    })
                                    .map((dd: any) => {
                                      let already_add: any[] = vm.cartData.lineItems.filter((dd: any) => {
                                        return dd.is_gift;
                                      });
                                      dd.add_on_products = dd.add_on_products.filter(Boolean);

                                      let isSelected = already_add.find(d2 => {
                                        return dd.add_on_products.find((d1: any) => {
                                          return d1.id === d2.id;
                                        });
                                      });

                                      already_add = already_add.filter(dd => {
                                        return !dd === isSelected;
                                      });

                                      return html`
                                        <span class="${gClass('banner-text')}">${dd.title}</span>
                                        <div class="d-flex align-items-center w-100" style="overflow-x:auto;gap:10px;">
                                          ${dd.add_on_products
                                            .filter(Boolean)
                                            .map((pd: any) => {
                                              try {
                                                return html` <div
                                                  class="d-flex py-3 align-items-center"
                                                  style="gap:10px;"
                                                >
                                                  <div
                                                    class="img-fluid img-106px"
                                                    style="background-image: url('${pd.preview_image[0]}');"
                                                  ></div>
                                                  <div class="d-flex flex-column" style="width: 130px;">
                                                    <div class="${gClass('banner-text')} banner-font-15">
                                                      ${pd.title}
                                                    </div>
                                                    <div class="text-danger ntd-font-14">
                                                      ${Currency.convertCurrencyText(0)}
                                                    </div>
                                                    <div
                                                      style="text-decoration: line-through; font-size: 12px; height: 20px;"
                                                    >
                                                      ${pd.min_price > 0
                                                        ? Currency.convertCurrencyText(pd.min_price)
                                                        : ''}
                                                    </div>
                                                    <button
                                                      class="${gClass('button-bgr')} mb-0 mt-2"
                                                      style="${isSelected
                                                        ? isSelected.id === pd.id
                                                          ? `background: gray !important;`
                                                          : ''
                                                        : `background: orangered !important;`}"
                                                      onclick="${gvc.event(() => {
                                                        if (isSelected && isSelected.id === pd.id) {
                                                          return;
                                                        }
                                                        const titleFontColor =
                                                          glitter.share.globalValue['theme_color.0.title'] ?? '#333333';
                                                        gvc.glitter.innerDialog(
                                                          (gvc: GVC) => {
                                                            return html` <div
                                                              class=" bg-white shadow  ${document.body.clientWidth > 768
                                                                ? `rounded-3`
                                                                : ` position-absolute bottom-0`}"
                                                              style=" ${document.body.clientWidth > 768
                                                                ? `min-width: 400px; width: 1000px;max-height:calc(100% - 150px);overflow-y: auto;`
                                                                : 'width:calc(100vw);height:100%;'}"
                                                            >
                                                              <div
                                                                class="bg-white shadow  ${document.body.clientWidth >
                                                                768
                                                                  ? `rounded-3`
                                                                  : `h-100`}"
                                                                style="width: 100%;  position: relative;${document.body
                                                                  .clientWidth > 768
                                                                  ? ''
                                                                  : `overflow-y: auto;`}"
                                                              >
                                                                <div
                                                                  class="w-100 d-flex align-items-center p-3 border-bottom"
                                                                  style="position: sticky; top: 0; background: #fff;z-index:12;"
                                                                >
                                                                  <div
                                                                    class="fw-bold fs-5"
                                                                    style="color:${titleFontColor}; white-space: nowrap;text-overflow: ellipsis;max-width: calc(100% - 40px); overflow: hidden;"
                                                                  >
                                                                    ${pd.title}
                                                                  </div>
                                                                  <div class="flex-fill"></div>
                                                                  <i
                                                                    class="fa-regular fa-circle-xmark fs-5 text-dark"
                                                                    style="cursor: pointer"
                                                                    onclick="${gvc.event(() => {
                                                                      gvc.closeDialog();
                                                                    })}"
                                                                  ></i>
                                                                </div>
                                                                <div
                                                                  class="c_dialog_main"
                                                                  style="gap: 24px;  max-height: calc(100% - 100px); ${document
                                                                    .body.clientWidth < 800
                                                                    ? `padding: 12px 20px;`
                                                                    : `padding: 30px;`}"
                                                                >
                                                                  ${PdClass.selectSpec({
                                                                    gvc,
                                                                    titleFontColor:
                                                                      glitter.share.globalValue[
                                                                        'theme_color.0.title'
                                                                      ] ?? '#333333',
                                                                    prod: pd,
                                                                    vm: {
                                                                      specs: pd.specs.map(
                                                                        (spec: {
                                                                          option: {
                                                                            title: string;
                                                                          }[];
                                                                        }) => {
                                                                          return spec.option[0].title;
                                                                        }
                                                                      ),
                                                                      quantity: '1',
                                                                      wishStatus: (glitter.share.wishList ?? []).some(
                                                                        (item: { id: number }) => {
                                                                          return item.id === dd.id;
                                                                        }
                                                                      ),
                                                                    },
                                                                    preview: true,
                                                                    with_qty: false,
                                                                    is_gift: true,
                                                                    callback: () => {
                                                                      let find = vm.cartData.lineItems.find(
                                                                        (d1: any) => {
                                                                          return dd.add_on_products.find((d2: any) => {
                                                                            return d2 && d2.id === d1.id;
                                                                          });
                                                                        }
                                                                      );

                                                                      if (find) {
                                                                        apiCart.setCart(cartItem => {
                                                                          cartItem.line_items.map(dd => {
                                                                            if (dd.id === find.id) {
                                                                              dd.count--;
                                                                            }
                                                                          });
                                                                          cartItem.line_items =
                                                                            cartItem.line_items.filter(dd => {
                                                                              return dd.count > 0;
                                                                            });
                                                                          refreshCartData();
                                                                          gvc.closeDialog();
                                                                        });
                                                                      } else {
                                                                        refreshCartData();
                                                                        gvc.closeDialog();
                                                                      }
                                                                    },
                                                                  })}
                                                                  <div class="d-sm-none" style="height:100px;"></div>
                                                                </div>
                                                              </div>
                                                            </div>`;
                                                          },
                                                          Tool.randomString(7),
                                                          {
                                                            animation:
                                                              document.body.clientWidth < 768
                                                                ? Animation.popup
                                                                : Animation.fade,
                                                          }
                                                        );
                                                      })}"
                                                    >
                                                      <span
                                                        class="${gClass('button-text')}"
                                                        style="${isSelected
                                                          ? isSelected.id === pd.id
                                                            ? ''
                                                            : `color: white;`
                                                          : ''}"
                                                        >${isSelected
                                                          ? isSelected.id === pd.id
                                                            ? Language.text('selected')
                                                            : Language.text('change_gift')
                                                          : Language.text('select_gift')}</span
                                                      >
                                                    </button>
                                                  </div>
                                                </div>`;
                                              } catch (e) {
                                                console.error(`error 2 =>`, e);
                                              }
                                            })
                                            .join('')}
                                        </div>
                                      `;
                                    })
                                    .join('');
                                  return giftHtml && html`<div class="rounded-3 bg-white p-3 mt-3">${giftHtml}</div>`;
                                })()}
                                <!--加購品-->
                                ${(() => {
                                  let add_on: any[] = [];
                                  vm.cartData.voucherList.filter((dd: any) => {
                                    if (dd.reBackType === 'add_on_items') {
                                      add_on = add_on.concat(dd.add_on_products).filter(Boolean);
                                    }
                                  });
                                  if (add_on.length) {
                                    return gvc.bindView(() => {
                                      const id = gvc.glitter.getUUID();
                                      return {
                                        bind: id,
                                        view: async () => {
                                          const add_products = await ApiShop.getProduct({
                                            page: 0,
                                            limit: 100,
                                            productType: 'addProduct',
                                            id_list: add_on.join(','),
                                          });
                                          if (!add_products.response.data.length) {
                                            return '';
                                          }
                                          return html`
                                            <div class="rounded-3 mt-3 p-3 bg-white">
                                              <span class="${gClass('banner-text')}"
                                                >${Language.text('additional_purchase_items')}</span
                                              >
                                              <div
                                                class="d-flex align-items-center w-100"
                                                style="overflow-x:auto;gap:10px;"
                                              >
                                                ${add_products.response.data
                                                  .map((dd: any) => {
                                                    return html` <div
                                                      class="d-flex py-3 align-items-center"
                                                      style="gap:10px;"
                                                    >
                                                      <div
                                                        class="img-fluid img-106px"
                                                        style="background-image: url('${dd.content.preview_image[0]}');"
                                                      ></div>
                                                      <div class="d-flex flex-column" style="gap:5px;">
                                                        <div class="${gClass('banner-text')} banner-font-15">
                                                          ${dd.content.title}
                                                        </div>
                                                        <div class="ntd-font-14">
                                                          ${Currency.convertCurrencyText(dd.content.min_price)}
                                                        </div>
                                                        <button
                                                          class="${gClass('button-bgr')} mb-0 mt-2"
                                                          onclick="${gvc.event(() => {
                                                            const titleFontColor =
                                                              glitter.share.globalValue['theme_color.0.title'] ??
                                                              '#333333';
                                                            gvc.glitter.innerDialog(
                                                              (gvc: GVC) => {
                                                                return html` <div
                                                                  class=" bg-white shadow  ${document.body.clientWidth >
                                                                  768
                                                                    ? `rounded-3`
                                                                    : ` position-absolute bottom-0`}"
                                                                  style=" ${document.body.clientWidth > 768
                                                                    ? `min-width: 400px; width: 1000px;max-height:calc(100% - 150px);overflow-y: auto;`
                                                                    : 'width:calc(100vw);height:100%;'}"
                                                                >
                                                                  <div
                                                                    class="bg-white shadow  ${document.body
                                                                      .clientWidth > 768
                                                                      ? `rounded-3`
                                                                      : `h-100`}"
                                                                    style="width: 100%;  position: relative;${document
                                                                      .body.clientWidth > 768
                                                                      ? ''
                                                                      : `overflow-y: auto;`}"
                                                                  >
                                                                    <div
                                                                      class="w-100 d-flex align-items-center p-3 border-bottom"
                                                                      style="position: sticky; top: 0; background: #fff;z-index:12;"
                                                                    >
                                                                      <div
                                                                        class="fw-bold fs-5"
                                                                        style="color:${titleFontColor}; white-space: nowrap;text-overflow: ellipsis;max-width: calc(100% - 40px); overflow: hidden;"
                                                                      >
                                                                        ${dd.content.title}
                                                                      </div>
                                                                      <div class="flex-fill"></div>
                                                                      <i
                                                                        class="fa-regular fa-circle-xmark fs-5 text-dark"
                                                                        style="cursor: pointer"
                                                                        onclick="${gvc.event(() => {
                                                                          gvc.closeDialog();
                                                                        })}"
                                                                      ></i>
                                                                    </div>
                                                                    <div
                                                                      class="c_dialog_main"
                                                                      style="gap: 24px;  max-height: calc(100% - 100px); ${document
                                                                        .body.clientWidth < 800
                                                                        ? `padding: 12px 20px;`
                                                                        : `padding: 30px;`}"
                                                                    >
                                                                      ${PdClass.selectSpec({
                                                                        gvc,
                                                                        titleFontColor:
                                                                          glitter.share.globalValue[
                                                                            'theme_color.0.title'
                                                                          ] ?? '#333333',
                                                                        prod: dd.content,
                                                                        vm: {
                                                                          specs: dd.content.specs.map(
                                                                            (spec: {
                                                                              option: {
                                                                                title: string;
                                                                              }[];
                                                                            }) => {
                                                                              return spec.option[0].title;
                                                                            }
                                                                          ),
                                                                          quantity: '1',
                                                                          wishStatus: (
                                                                            glitter.share.wishList ?? []
                                                                          ).some((item: { id: number }) => {
                                                                            return item.id === dd.id;
                                                                          }),
                                                                        },
                                                                        preview: true,
                                                                        with_qty: false,
                                                                        is_gift: true,
                                                                        callback: () => {
                                                                          gvc.closeDialog();
                                                                          let find = vm.cartData.lineItems.find(
                                                                            (d1: any) => {
                                                                              return dd.add_on_products.find(
                                                                                (d2: any) => {
                                                                                  return d2.id === d1.id;
                                                                                }
                                                                              );
                                                                            }
                                                                          );
                                                                          if (find) {
                                                                            apiCart.setCart(cartItem => {
                                                                              cartItem.line_items.map(dd => {
                                                                                if (dd.id === find.id) {
                                                                                  dd.count--;
                                                                                }
                                                                              });
                                                                              cartItem.line_items =
                                                                                cartItem.line_items.filter(dd => {
                                                                                  return dd.count > 0;
                                                                                });
                                                                              refreshCartData();
                                                                              gvc.closeDialog();
                                                                            });
                                                                          } else {
                                                                            refreshCartData();
                                                                            gvc.closeDialog();
                                                                          }
                                                                        },
                                                                      })}
                                                                      <div
                                                                        class="d-sm-none"
                                                                        style="height:100px;"
                                                                      ></div>
                                                                    </div>
                                                                  </div>
                                                                </div>`;
                                                              },
                                                              Tool.randomString(7),
                                                              {
                                                                animation:
                                                                  document.body.clientWidth < 768
                                                                    ? Animation.popup
                                                                    : Animation.fade,
                                                              }
                                                            );
                                                          })}"
                                                        >
                                                          <span class="${gClass('button-text')}"
                                                            >${Language.text('add_to_cart')}</span
                                                          >
                                                        </button>
                                                      </div>
                                                    </div>`;
                                                  })
                                                  .join('')}
                                              </div>
                                            </div>
                                          `;
                                        },
                                        divCreate: {
                                          class: `w-100`,
                                        },
                                      };
                                    });
                                  } else {
                                    return '';
                                  }
                                })()}
                                <!--配送資訊-->
                                <div class="rounded-3 bg-white w-100 p-2 mt-3">
                                  ${html` <section>
                                    <div class="${gClass('banner-text')} px-2 pt-3">
                                      ${Language.text('payment_and_shipping_methods')}
                                    </div>
                                    ${vm.cartData.shipment_info
                                      ? html` <div class="pt-2 mx-2 mx-sm-3">${vm.cartData.shipment_info}</div>`
                                      : ''}
                                    <div class="row mt-3 mx-1 mx-sm-0 my-md-3">
                                      <div class="col-12 col-md-6 mb-2 mb-sm-0">
                                        <label class="${gClass('label')}">${Language.text('payment_method')}</label>
                                        <div>
                                          <select
                                            class="w-100 ${gClass('select')}"
                                            onchange="${gvc.event(e => {
                                              vm.cartData.customer_info.payment_select = e.value;
                                              this.storeLocalData(vm.cartData);
                                              refreshCartData();
                                            })}"
                                          >
                                            ${(() => {
                                              return this.getPaymentMethod(vm.cartData)
                                                .map((dd: { name: string; value: string }) => {
                                                  return html` <option
                                                    value="${dd.value}"
                                                    ${localStorage.getItem('checkout-payment') === dd.value
                                                      ? `selected`
                                                      : ''}
                                                  >
                                                    ${Language.getLanguageCustomText(dd.name) ||
                                                    Language.text(dd.value)}
                                                  </option>`;
                                                })
                                                .join('');
                                            })()}
                                          </select>
                                        </div>
                                      </div>
                                      <div class="col-12 col-md-6 mb-2">
                                        <label class="${gClass('label')}">${Language.text('shipping_method')}</label>
                                        ${gvc.bindView({
                                          bind: ids.shipping,
                                          view: () => {
                                            const shipmentTargetNotification = () => {
                                              try {
                                                const target =
                                                  vm.cartData.select_shipment_setting.cartSetting.freeShipmnetTarget;
                                                if (target) {
                                                  return html`
                                                    <div class="${gClass('danger-text')}">
                                                      ${vm.cartData.shipment_fee === 0
                                                        ? Language.text('free_shipping_achieved')
                                                        : Language.text('free_shipping_threshold').replace(
                                                            '_p_',
                                                            Number(
                                                              target -
                                                                (vm.cartData.total -
                                                                  vm.cartData.shipment_fee +
                                                                  vm.cartData.discount +
                                                                  vm.cartData.use_rebate)
                                                            ).toLocaleString()
                                                          )}
                                                    </div>
                                                  `;
                                                }
                                                return '';
                                              } catch (error) {
                                                return '';
                                              }
                                            };

                                            return html` <div class="d-flex flex-column gap-1">
                                              <select
                                                class="w-100 ${gClass('select')}"
                                                onchange="${gvc.event(e => {
                                                  [
                                                    'CVSStoreName',
                                                    'MerchantTradeNo',
                                                    'LogisticsSubType',
                                                    'CVSStoreID',
                                                    'CVSTelephone',
                                                    'CVSOutSide',
                                                    'ExtraData',
                                                    'CVSAddress',
                                                  ].map(dd => {
                                                    gvc.glitter.setUrlParameter(dd);
                                                  });
                                                  vm.cartData.user_info.shipment = e.value;
                                                  this.storeLocalData(vm.cartData);
                                                  refreshCartData();
                                                })}"
                                              >
                                                ${shipmentList.length > 0
                                                  ? shipmentList
                                                      .map((dd: { name: string; value: string }) => {
                                                        return html` <option
                                                          value="${dd.value}"
                                                          ${vm.cartData.user_info.shipment === dd.value
                                                            ? `selected`
                                                            : ''}
                                                        >
                                                          ${Language.text(`ship_${dd.value}`) ||
                                                          Language.getLanguageCustomText(dd.name)}
                                                        </option>`;
                                                      })
                                                      .join('')
                                                  : html` <option selected>(${Language.text('disable_ship')})</option>`}
                                              </select>
                                              ${shipmentTargetNotification()}
                                            </div>`;
                                          },
                                        })}
                                      </div>
                                      <div class="col-12">
                                        ${gvc.bindView(() => {
                                          return {
                                            bind: gvc.glitter.getUUID(),
                                            view: async () => {
                                              const log_config = (
                                                await ApiUser.getPublicConfig(
                                                  'shipment_config_' + vm.cartData.user_info.shipment,
                                                  'manager'
                                                )
                                              ).response.value;
                                              if (log_config.content) {
                                                return html` <label class="${gClass('label')}"
                                                    >${Language.text('shipping_instructions')}</label
                                                  >
                                                  <div class="border rounded-3 p-2">${log_config.content}</div>`;
                                              }
                                              return '';
                                            },
                                          };
                                        })}
                                      </div>
                                      <!-- 配送地址 -->
                                      ${(() => {
                                        if (vm.cartData.user_info.shipment === 'none') {
                                          return false;
                                        }
                                        const ship_method = this.getShipmentMethod(vm.cartData).find((dd: any) => {
                                          return vm.cartData.user_info.shipment === dd.value;
                                        });
                                        if (ship_method && ship_method.system_form) {
                                          return (ship_method.system_form ?? []).includes('tw-address-selector');
                                        }
                                        return ['normal', 'black_cat', 'black_cat_freezing', 'black_cat_ice'].includes(
                                          vm.cartData.user_info.shipment
                                        );
                                      })()
                                        ? gvc.bindView(() => {
                                            const id = gvc.glitter.getUUID();
                                            gvc.addStyle(`
                                              .city-selector select {
                                                -webkit-appearance: none;
                                                -moz-appearance: none;
                                                appearance: none;
                                                border-width: 1px;
                                                border-radius: 8px;
                                                border-color: #ddd;
                                                outline: none;
                                                padding: 0.3em 1.25em;
                                                flex: 1;
                                              }
                                            `);
                                            let select_id = '';
                                            return {
                                              bind: id,
                                              view: () => {
                                                select_id = gvc.glitter.getUUID();
                                                return html`<label
                                                    class="${gClass('label')} w-100 d-flex align-items-center"
                                                    >${Language.text('shipping_address')}
                                                    <div class="flex-fill"></div>
                                                    <div
                                                      class="fs-sm fw-500 ${!GlobalUser.token ? `d-none` : ''}"
                                                      style="cursor: pointer; color: #3366bb;"
                                                      onclick="${gvc.event(() => {
                                                        ApiUser.getUserData(GlobalUser.token, 'me').then(res => {
                                                          vm.cartData.user_info.address =
                                                            res.response.userData.consignee_address;
                                                          this.storeLocalData(vm.cartData);
                                                          gvc.notifyDataChange(id);
                                                        });
                                                      })}"
                                                    >
                                                      ${Language.text('quick_input')}
                                                    </div>
                                                  </label>
                                                  <div class="row">
                                                    <div class="col-12 mb-3">
                                                      <div
                                                        role="tw-city-selector"
                                                        id="select_id_${id}"
                                                        class="w-100 city-selector d-flex d_${select_id}"
                                                        style="gap:15px;"
                                                      ></div>
                                                    </div>
                                                    <div class="col-12">
                                                      <input
                                                        class="${gClass('input')}"
                                                        type="address"
                                                        placeholder="${Language.text('please_enter_street_location')}"
                                                        value="${vm.cartData.user_info.address || ''}"
                                                        onchange="${gvc.event(e => {
                                                          vm.cartData.user_info.address = e.value;
                                                          this.storeLocalData(vm.cartData);
                                                        })}"
                                                      />
                                                    </div>
                                                  </div> `;
                                              },
                                              divCreate: {
                                                class: `col-12  mb-2`,
                                              },
                                              onCreate: () => {
                                                gvc.glitter.addMtScript(
                                                  [
                                                    {
                                                      src: 'https://cdn.jsdelivr.net/npm/tw-city-selector@2.1.1/dist/tw-city-selector.min.js',
                                                    },
                                                  ],
                                                  () => {
                                                    //@ts-ignore
                                                    const tw_selector = new TwCitySelector({
                                                      el: `.d_${select_id}`,
                                                    });
                                                    const interVal = setInterval(() => {
                                                      if (document.querySelector(`#select_id_${id} .county`) as any) {
                                                        clearInterval(interVal);
                                                        (
                                                          document.querySelector(`#select_id_${id} .county`) as any
                                                        ).addEventListener('change', (event: any) => {
                                                          // 獲取當前選中的值
                                                          const selectedValue = event.target.value;

                                                          // 根據選中的值執行其他操作
                                                          vm.cartData.user_info.city = selectedValue;
                                                          vm.cartData.user_info.area = undefined;
                                                          this.storeLocalData(vm.cartData);
                                                        });
                                                        (
                                                          document.querySelector(`#select_id_${id} .district`) as any
                                                        ).addEventListener('change', (event: any) => {
                                                          // 獲取當前選中的值
                                                          const selectedValue = event.target.value;

                                                          // 根據選中的值執行其他操作
                                                          vm.cartData.user_info.area = selectedValue;
                                                          this.storeLocalData(vm.cartData);
                                                        });

                                                        if (vm.cartData.user_info.city && vm.cartData.user_info.area) {
                                                          tw_selector.setValue(
                                                            vm.cartData.user_info.city,
                                                            vm.cartData.user_info.area
                                                          );
                                                        } else if (vm.cartData.user_info.city) {
                                                          tw_selector.setValue(vm.cartData.user_info.city);
                                                        }
                                                      }
                                                      glitter.share.tw_selector = tw_selector;
                                                    }, 100);
                                                  },
                                                  () => {}
                                                );
                                              },
                                            };
                                          })
                                        : ''}
                                      <!-- 選取超商 -->
                                      ${ShipmentConfig.supermarketList.includes(vm.cartData.user_info.shipment)
                                        ? html` <div class="col-12">
                                            <button
                                              class="${gClass('button-bgr')}"
                                              onclick="${gvc.event(() => {
                                                ApiDelivery.storeMaps({
                                                  returnURL: (() => {
                                                    if (ApplicationConfig.device_type === 'ios') {
                                                      const url = new URL(location.href);
                                                      url.searchParams.set('select_map_finish', 'true');
                                                      return url.href;
                                                    } else {
                                                      return location.href;
                                                    }
                                                  })(),
                                                  logistics: vm.cartData.user_info.shipment,
                                                }).then(async res => {
                                                  if (ApplicationConfig.device_type === 'ios') {
                                                    glitter.runJsInterFace(
                                                      'post_form',
                                                      {
                                                        form: res.response.form,
                                                      },
                                                      () => {}
                                                    );
                                                  } else {
                                                    const form_id = gvc.glitter.getUUID();
                                                    $('body').append(`<div id="${form_id}">${res.response.form}</div>`);
                                                    (document.querySelector(`#${form_id} #submit`) as any).click();
                                                  }
                                                });
                                              })}"
                                            >
                                              <span class="${gClass('button-text')}"
                                                >${(() => {
                                                  let cvs = glitter.getUrlParameter('CVSStoreName') || '';
                                                  if (decodeURIComponent(cvs)) {
                                                    return `${decodeURIComponent(cvs)} 『 ${Language.text('click_to_reselct_store')} 』`;
                                                  } else {
                                                    return Language.text('select_pickup_store');
                                                  }
                                                })()}</span
                                              >
                                            </button>
                                          </div>`
                                        : ''}
                                      ${(() => {
                                        if (vm.cartData.user_info.shipment === 'none') {
                                          return false;
                                        }
                                        const ship_method = this.getShipmentMethod(vm.cartData).find((dd: any) => {
                                          return vm.cartData.user_info.shipment === dd.value;
                                        });
                                        if (ship_method && ship_method.system_form) {
                                          return (ship_method.system_form ?? []).includes('global-address-selector');
                                        }
                                        return ['global_express'].includes(vm.cartData.user_info.shipment);
                                      })()
                                        ? [
                                            html`<label class="${gClass('label')}">${Language.text('country')}</label>
                                              ${gvc.bindView(() => {
                                                const id = gvc.glitter.getUUID();
                                                return {
                                                  bind: id,
                                                  view: async () => {
                                                    let country_select: any = [];
                                                    const support_country = (
                                                      await ApiUser.getPublicConfig('global_express_country', 'manager')
                                                    ).response.value.country;
                                                    await new Promise((resolve, reject) => {
                                                      glitter.getModule(
                                                        (() => {
                                                          switch (Language.getLanguage()) {
                                                            case 'en-US':
                                                              return `${gvc.glitter.root_path}/modules/country-language/country-en.js`;
                                                            case 'zh-CN':
                                                              return `${gvc.glitter.root_path}/modules/country-language/country-zh.js`;
                                                            default:
                                                              return `${gvc.glitter.root_path}/modules/country-language/country-tw.js`;
                                                          }
                                                        })(),
                                                        response => {
                                                          country_select = response.filter((dd: any) => {
                                                            return support_country.includes(dd.countryCode);
                                                          });
                                                          resolve(true);
                                                        }
                                                      );
                                                    });
                                                    return html`<select
                                                      class="w-100 ${gClass('select')}"
                                                      onchange="${gvc.event((e, event) => {
                                                        vm.cartData.user_info.country = e.value;
                                                        this.storeLocalData(vm.cartData);
                                                        refreshCartData();
                                                      })}"
                                                    >
                                                      ${(() => {
                                                        let map = country_select.map(
                                                          (dd: { countryCode: string; countryName: string }) => {
                                                            return html`
                                                              <option
                                                                value="${dd.countryCode}"
                                                                ${vm.cartData.user_info.country === dd.countryCode
                                                                  ? `selected`
                                                                  : ''}
                                                              >
                                                                ${dd.countryName}
                                                              </option>
                                                            `;
                                                          }
                                                        );
                                                        if (
                                                          !country_select.find((dd: any) => {
                                                            return dd.countryCode === vm.cartData.user_info.country;
                                                          })
                                                        ) {
                                                          delete vm.cartData.user_info.country;
                                                          map.push(
                                                            html` <option class="d-none" selected>
                                                              ${Language.text('select_country')}
                                                            </option>`
                                                          );
                                                        }
                                                        return map.join('');
                                                      })()}
                                                    </select>`;
                                                  },
                                                };
                                              })}`,
                                            html` <label class="${gClass('label')}"
                                                >${Language.text('shipping_address')}</label
                                              >
                                              <input
                                                class="${gClass('input')}"
                                                type="address"
                                                placeholder="${Language.text('please_enter_delivery_address')}"
                                                value="${vm.cartData.user_info.address || ''}"
                                                onchange="${gvc.event(e => {
                                                  vm.cartData.user_info.address = e.value;
                                                  this.storeLocalData(vm.cartData);
                                                })}"
                                              />`,
                                            html` <label class="${gClass('label')}">${Language.text('city')}</label>
                                              <input
                                                class="${gClass('input')}"
                                                type="city"
                                                placeholder="${Language.text('city')}"
                                                value="${vm.cartData.user_info.city || ''}"
                                                onchange="${gvc.event(e => {
                                                  vm.cartData.user_info.city = e.value;
                                                  this.storeLocalData(vm.cartData);
                                                })}"
                                              />`,
                                            html` <label class="${gClass('label')}">${Language.text('state')}</label>
                                              <input
                                                class="${gClass('input')}"
                                                class="${gClass('input')}"
                                                type="state"
                                                placeholder="${Language.text('state')}"
                                                value="${vm.cartData.user_info.state || ''}"
                                                onchange="${gvc.event(e => {
                                                  vm.cartData.user_info.state = e.value;
                                                  this.storeLocalData(vm.cartData);
                                                })}"
                                              />`,
                                            html` <label class="${gClass('label')}"
                                                >${Language.text('postal_code')}</label
                                              >
                                              <input
                                                class="${gClass('input')}"
                                                placeholder="${Language.text('postal_code')}"
                                                value="${vm.cartData.user_info.postal_code || ''}"
                                                onchange="${gvc.event(e => {
                                                  vm.cartData.user_info.postal_code = e.value;
                                                  this.storeLocalData(vm.cartData);
                                                })}"
                                              />`,
                                          ]
                                            .map(dd => {
                                              return html` <div class="col-12 col-md-6 mb-2">${dd}</div>`;
                                            })
                                            .join('')
                                        : ''}
                                      ${(() => {
                                        try {
                                          vm.cartData.user_info.custom_form_delivery =
                                            vm.cartData.user_info.custom_form_delivery ?? {};
                                          const formData = this.getShipmentMethod(vm.cartData).find((dd: any) => {
                                            return vm.cartData.user_info.shipment === dd.value;
                                          }).form;

                                          if (!formData) {
                                            return '';
                                          }
                                          const form_array = JSON.parse(JSON.stringify(formData));
                                          form_array.map((dd: any) => {
                                            return formatterFormElement(dd);
                                          });
                                          return [
                                            FormWidget.editorView({
                                              gvc: gvc,
                                              array: form_array,
                                              refresh: () => {
                                                this.storeLocalData(vm.cartData);
                                              },
                                              formData: vm.cartData.user_info.custom_form_delivery,
                                            }),
                                          ].join('');
                                        } catch (e) {
                                          console.error(`error 3-1 =>`, e);
                                          return '';
                                        }
                                      })()}
                                      ${(() => {
                                        try {
                                          vm.cartData.user_info.custom_form_payment =
                                            vm.cartData.user_info.custom_form_payment ?? {};

                                          const formData = vm.cartData.payment_customer_form.find((dd: any) => {
                                            return vm.cartData.customer_info.payment_select === dd.id;
                                          })?.list;

                                          if (!formData) {
                                            return '';
                                          }
                                          const form_array = JSON.parse(JSON.stringify(formData));
                                          form_array.map((dd: any) => {
                                            return formatterFormElement(dd);
                                          });
                                          return [
                                            FormWidget.editorView({
                                              gvc: gvc,
                                              array: form_array,
                                              refresh: () => {
                                                this.storeLocalData(vm.cartData);
                                              },
                                              formData: vm.cartData.user_info.custom_form_payment,
                                            }),
                                          ].join('');
                                        } catch (e) {
                                          console.error(`error 3-2 =>`, e);
                                          return '';
                                        }
                                      })()}
                                    </div>
                                  </section>`}
                                </div>
                                <!--顧客資訊-->
                                <div class="rounded-3 bg-white w-100 p-2 mt-3">
                                  <div class="${gClass('banner-text')} px-3 pt-3 w-100 d-flex align-items-center">
                                    ${Language.text('customer_info')}
                                    <div class="flex-fill"></div>
                                    <div
                                      class="fs-sm fw-500 ${!GlobalUser.token ? `d-none` : ''}"
                                      style="cursor: pointer; color: #3366bb;"
                                      onclick="${gvc.event(() => {
                                        ApiUser.getUserData(GlobalUser.token, 'me').then(res => {
                                          ['name', 'phone', 'email'].map(dd => {
                                            vm.cartData.customer_info[dd] =
                                              res.response.userData[dd] || vm.cartData.customer_info[dd];
                                          });
                                          this.storeLocalData(vm.cartData);
                                          gvc.notifyDataChange('customer-info');
                                        });
                                      })}"
                                    >
                                      ${Language.text('quick_input')}
                                    </div>
                                  </div>
                                  ${gvc.bindView(() => {
                                    const id = 'customer-info';
                                    const vm_info: {
                                      loading: boolean;
                                      list: any[];
                                    } = {
                                      loading: true,
                                      list: [],
                                    };
                                    vm_info.list = widget.share.custom_form_checkout;
                                    return {
                                      bind: id,
                                      view: () => {
                                        return new Promise(async (resolve, reject) => {
                                          vm_info.list = widget.share.custom_form_checkout;
                                          resolve(
                                            [
                                              html` <div class="row m-0 mt-3 mb-2">
                                                ${[
                                                  {
                                                    name: Language.text('name'),
                                                    key: 'name',
                                                  },
                                                  {
                                                    name: Language.text('contact_number'),
                                                    key: 'phone',
                                                  },
                                                  {
                                                    name: Language.text('email'),
                                                    key: 'email',
                                                  },
                                                ]
                                                  .filter(dd => {
                                                    return vm_info.list.find(d1 => {
                                                      return d1.key === dd.key && `${d1.hidden}` !== 'true';
                                                    });
                                                  })
                                                  .map(dd => {
                                                    return html` <div class="col-12 col-md-4 mb-2">
                                                      <label class="${gClass('label')}">${dd.name}</label>
                                                      <input
                                                        class="${gClass('input')}"
                                                        type="${dd.key}"
                                                        value="${vm.cartData.customer_info[dd.key] || ''}"
                                                        onchange="${gvc.event((e, event) => {
                                                          vm.cartData.customer_info[dd.key] = e.value;
                                                          this.storeLocalData(vm.cartData);
                                                        })}"
                                                      />
                                                    </div>`;
                                                  })
                                                  .join('')}
                                              </div>`,
                                              gvc.bindView(() => {
                                                const id = gvc.glitter.getUUID();
                                                return {
                                                  bind: id,
                                                  view: () => {
                                                    const form_array = JSON.parse(JSON.stringify(vm_info.list));
                                                    form_array.map((dd: any) => {
                                                      dd.col = '4';
                                                      dd.form_config.title_style = {
                                                        list: [
                                                          {
                                                            class: gClass('label') + ' mb-2',
                                                            style:
                                                              'return `color:${glitter.share.globalValue[`theme_color.0.title`]} !important;font-size:16px !important;`',
                                                            stylist: [],
                                                            dataType: 'code',
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                          },
                                                        ],
                                                        class: 'form-label',
                                                        style:
                                                          'font-size: 20px;font-style: normal;font-weight: 400;line-height: 140%; color:#393939 !important;',
                                                        stylist: [],
                                                        version: 'v2',
                                                        dataType: 'static',
                                                        style_from: 'code',
                                                        classDataType: 'static',
                                                      };
                                                      dd.form_config.input_style = {
                                                        list: [
                                                          {
                                                            class: gClass('input'),
                                                            style:
                                                              'return `border-radius: ${widget.formData.radius}px !important;`',
                                                            stylist: [],
                                                            dataType: 'code',
                                                            style_from: 'code',
                                                            classDataType: 'static',
                                                          },
                                                        ],
                                                        class: ' mb-3',
                                                        style: 'background: #FFF;',
                                                        stylist: [],
                                                        version: 'v2',
                                                        dataType: 'static',
                                                        style_from: 'code',
                                                        classDataType: 'static',
                                                      };
                                                    });
                                                    return [
                                                      FormWidget.editorView({
                                                        gvc: gvc,
                                                        array: form_array.filter((dd: any) => {
                                                          return !['name', 'email', 'phone'].includes(dd.key);
                                                        }),
                                                        refresh: () => {
                                                          this.storeLocalData(vm.cartData);
                                                        },
                                                        formData: vm.cartData.custom_form_data,
                                                      }),
                                                    ].join('');
                                                  },
                                                  divCreate: {
                                                    class: `w-100 `,
                                                  },
                                                };
                                              }),
                                            ].join('')
                                          );
                                        });
                                      },
                                    };
                                  })}
                                </div>
                                <!--收件人資料-->
                                <div class="rounded-3 bg-white w-100 p-2 mt-3">
                                  <div class="${gClass('banner-text')} px-3 pt-3 d-flex align-items-center">
                                    ${Language.text('recipient_info')}
                                    <div class="flex-fill"></div>
                                    <div
                                      class="fs-sm fw-500 ${!GlobalUser.token ? `d-none` : ''}"
                                      style="cursor: pointer; color: #3366bb;"
                                      onclick="${gvc.event(() => {
                                        ApiUser.getUserData(GlobalUser.token, 'me').then(res => {
                                          const userData = res.response.userData;
                                          const userInfo = vm.cartData.user_info;

                                          function setUserInfo(data: any) {
                                            ['name', 'phone', 'email'].map(dd => {
                                              userInfo[dd] = data[dd] || userInfo[dd];
                                            });

                                            const { carrier_number, gui_number, company } = data;

                                            [
                                              {
                                                key: 'carrier_num',
                                                refer: carrier_number,
                                              },
                                              {
                                                key: 'gui_number',
                                                refer: gui_number,
                                              },
                                              {
                                                key: 'send_type',
                                                refer: gui_number || !carrier_number ? 'email' : 'carrier_num',
                                              },
                                              {
                                                key: 'invoice_type',
                                                refer: gui_number ? 'company' : 'me',
                                              },
                                              {
                                                key: 'company',
                                                refer: company,
                                              },
                                            ].map(dd => {
                                              userInfo[dd.key] = dd.refer || userInfo[dd.key];
                                            });

                                            CheckoutIndex.storeLocalData(vm.cartData);
                                            gvc.notifyDataChange('invoice_place');
                                          }

                                          if (Array.isArray(userData.receive_list)) {
                                            BgWidget.settingDialog({
                                              gvc,
                                              title: '快速帶入',
                                              innerHTML: (iGVC: GVC) => {
                                                const isPhone = document.body.clientWidth < 800;
                                                const listHTML = userData.receive_list
                                                  .map((data: any, index: number) => {
                                                    return html`<div
                                                      class="d-flex justify-content-between align-items-center p-1 w-100 gap-2"
                                                    >
                                                      <div class="d-flex flex-column">
                                                        <h5>收件人 ${index + 1}</h5>
                                                        ${['name', 'email', 'phone']
                                                          .filter(key => data[key])
                                                          .map(key => {
                                                            return html`<span style="line-break: anywhere;"
                                                              >${data[key]}</span
                                                            >`;
                                                          })
                                                          .join('')}
                                                      </div>
                                                      <button
                                                        class="${gClass('button-bgr')}"
                                                        style="width: ${isPhone ? 80 : 130}px;"
                                                        onclick="${gvc.event(() => {
                                                          iGVC.closeDialog();
                                                          setUserInfo(data);
                                                        })}"
                                                      >
                                                        <span class="${gClass('button-text')}" style="font-size: 13px;">
                                                          ${Language.text('select')}</span
                                                        >
                                                      </button>
                                                    </div>`;
                                                  })
                                                  .join(BgWidget.horizontalLine());

                                                return html`<div class="px-2 py-3">${listHTML}</div>`;
                                              },
                                              footer_html: () => {
                                                return '';
                                              },
                                            });
                                          } else {
                                            setUserInfo(userInfo);
                                          }
                                        });
                                      })}"
                                    >
                                      ${Language.text('quick_input')}
                                    </div>
                                  </div>
                                  ${gvc.bindView(() => {
                                    const id = 'invoice_place';
                                    const vm_info: {
                                      loading: boolean;
                                      list: any[];
                                    } = {
                                      loading: true,
                                      list: [],
                                    };
                                    let method = widget.share.invoice_method || '';
                                    if (widget.share.invoice_method) {
                                      vm_info.loading = false;
                                      gvc.notifyDataChange(id);
                                    } else {
                                      ApiShop.getInvoiceType().then((res: any) => {
                                        method = res.response.method;
                                        vm_info.loading = false;
                                        widget.share.invoice_method = method;
                                        gvc.notifyDataChange(id);
                                      });
                                    }
                                    const checkbox = this.getCheckedClass(gvc);
                                    return {
                                      bind: id,
                                      view: async () => {
                                        try {
                                          if (vm_info.loading) {
                                            return '';
                                          }
                                          const receipt_form = JSON.parse(
                                            JSON.stringify(widget.share.receipt_form)
                                          ).map((dd: any) => {
                                            switch (dd.key) {
                                              case 'name':
                                                dd.form_config.place_holder = Language.text('please_enter_name');
                                                dd.title = Language.text('name');
                                                break;
                                              case 'phone':
                                                dd.form_config.place_holder =
                                                  Language.text('please_enter_contact_number');
                                                dd.title = Language.text('contact_number');
                                                break;
                                              case 'email':
                                                dd.form_config.place_holder = Language.text('please_enter_email');
                                                dd.title = Language.text('email');
                                                break;
                                            }
                                            dd.col = '4';
                                            return dd;
                                          });
                                          vm_info.list = [
                                            ...receipt_form,
                                            ...(method === 'nouse'
                                              ? []
                                              : [
                                                  {
                                                    col: '6',
                                                    key: 'invoice_type',
                                                    page: 'form-select',
                                                    type: 'form_plugin_v2',
                                                    group: '',
                                                    title: Language.text('invoice_recipient'),
                                                    col_sm: '12',
                                                    appName: 'cms_system',
                                                    require: 'true',
                                                    readonly: 'write',
                                                    formFormat: '{}',
                                                    moduleName: '下拉選單',
                                                    style_data: {
                                                      input: {
                                                        list: [],
                                                        class: '',
                                                        style: '',
                                                        version: 'v2',
                                                      },
                                                      label: {
                                                        list: [],
                                                        class: 'form-label fs-base ',
                                                        style: '',
                                                        version: 'v2',
                                                      },
                                                      container: {
                                                        list: [],
                                                        class: '',
                                                        style: '',
                                                        version: 'v2',
                                                      },
                                                    },
                                                    form_config: {
                                                      type: 'name',
                                                      title: '',
                                                      option: [
                                                        {
                                                          name: Language.text('personal'),
                                                          index: 0,
                                                          value: 'me',
                                                        },
                                                        {
                                                          name: Language.text('company'),
                                                          index: 1,
                                                          value: 'company',
                                                        },
                                                        {
                                                          name: Language.text('donate_invoice'),
                                                          index: 2,
                                                          value: 'donate',
                                                        },
                                                      ],
                                                      input_style: { list: [], version: 'v2' },
                                                      title_style: { list: [], version: 'v2' },
                                                      place_holder: '',
                                                    },
                                                    hidden_code: "return (form_data['invoice_method']==='nouse')",
                                                  },
                                                  {
                                                    col: '6',
                                                    key: 'send_type',
                                                    page: 'form-select',
                                                    type: 'form_plugin_v2',
                                                    group: '',
                                                    title: Language.text('invoice_method'),
                                                    col_sm: '12',
                                                    appName: 'cms_system',
                                                    require: 'true',
                                                    readonly: 'write',
                                                    formFormat: '{}',
                                                    moduleName: '下拉選單',
                                                    style_data: {
                                                      input: {
                                                        list: [],
                                                        class: '',
                                                        style: '',
                                                        version: 'v2',
                                                      },
                                                      label: {
                                                        list: [],
                                                        class: 'form-label fs-base ',
                                                        style: '',
                                                        version: 'v2',
                                                      },
                                                      container: {
                                                        list: [],
                                                        class: '',
                                                        style: '',
                                                        version: 'v2',
                                                      },
                                                    },
                                                    form_config: {
                                                      type: 'name',
                                                      title: '',
                                                      option: [
                                                        {
                                                          name: Language.text('send_to_user_email'),
                                                          index: 0,
                                                          value: 'email',
                                                        },
                                                        {
                                                          name: Language.text('mobile_barcode_device'),
                                                          index: 1,
                                                          value: 'carrier',
                                                        },
                                                      ],
                                                      input_style: { list: [], version: 'v2' },
                                                      title_style: { list: [], version: 'v2' },
                                                      place_holder: '',
                                                    },
                                                    hidden_code:
                                                      "    if(form_data['invoice_type']!=='me' || (form_data['invoice_method']==='nouse') || (form_data['invoice_method']==='off_line')){\n         form_data[form_key]=undefined\nreturn true\n    }else{\n return false\n    }",
                                                  },
                                                  {
                                                    key: 'carrier_num',
                                                    page: 'input',
                                                    type: 'form_plugin_v2',
                                                    group: '',
                                                    title: Language.text('carrier_number'),
                                                    appName: 'cms_system',
                                                    require: 'false',
                                                    readonly: 'write',
                                                    formFormat: '{}',
                                                    moduleName: '輸入框',
                                                    col: '3',
                                                    col_sm: '12',
                                                    style_data: {
                                                      input: {
                                                        list: [],
                                                        class: '',
                                                        style: '',
                                                        version: 'v2',
                                                      },
                                                      label: {
                                                        list: [],
                                                        class: 'form-label fs-base ',
                                                        style: '',
                                                        version: 'v2',
                                                      },
                                                      container: {
                                                        list: [],
                                                        class: '',
                                                        style: '',
                                                        version: 'v2',
                                                      },
                                                    },
                                                    form_config: {
                                                      type: 'name',
                                                      title: '',
                                                      input_style: { list: [], version: 'v2' },
                                                      title_style: { list: [], version: 'v2' },
                                                      place_holder: Language.text('please_enter_carrier_number'),
                                                    },
                                                    hidden_code:
                                                      "    \n    if(form_data['invoice_type']!=='me' || form_data['send_type']!=='carrier'){\n       form_data[form_key]=undefined\nreturn true\n    }else{\n return false\n    }",
                                                  },
                                                  {
                                                    key: 'company',
                                                    page: 'input',
                                                    type: 'form_plugin_v2',
                                                    group: '',
                                                    title: Language.text('company_name'),
                                                    appName: 'cms_system',
                                                    require: 'false',
                                                    readonly: 'write',
                                                    formFormat: '{}',
                                                    moduleName: '輸入框',
                                                    col: '3',
                                                    col_sm: '12',
                                                    style_data: {
                                                      input: {
                                                        list: [],
                                                        class: '',
                                                        style: '',
                                                        version: 'v2',
                                                      },
                                                      label: {
                                                        list: [],
                                                        class: 'form-label fs-base ',
                                                        style: '',
                                                        version: 'v2',
                                                      },
                                                      container: {
                                                        list: [],
                                                        class: '',
                                                        style: '',
                                                        version: 'v2',
                                                      },
                                                    },
                                                    form_config: {
                                                      type: 'name',
                                                      title: '',
                                                      input_style: { list: [], version: 'v2' },
                                                      title_style: { list: [], version: 'v2' },
                                                      place_holder: Language.text('please_enter_company_name'),
                                                    },
                                                    hidden_code:
                                                      "    if(form_data['invoice_type']!=='company' || (form_data['invoice_method']==='nouse')){\n         form_data[form_key]=undefined\nreturn true\n    }else{\n return false\n    }",
                                                  },
                                                  {
                                                    key: 'gui_number',
                                                    page: 'input',
                                                    type: 'form_plugin_v2',
                                                    group: '',
                                                    title: Language.text('company_tax_id'),
                                                    col: '3',
                                                    col_sm: '12',
                                                    appName: 'cms_system',
                                                    require: 'false',
                                                    readonly: 'write',
                                                    formFormat: '{}',
                                                    moduleName: '輸入框',
                                                    style_data: {
                                                      input: {
                                                        list: [],
                                                        class: '',
                                                        style: '',
                                                        version: 'v2',
                                                      },
                                                      label: {
                                                        list: [],
                                                        class: 'form-label fs-base ',
                                                        style: '',
                                                        version: 'v2',
                                                      },
                                                      container: {
                                                        list: [],
                                                        class: '',
                                                        style: '',
                                                        version: 'v2',
                                                      },
                                                    },
                                                    form_config: {
                                                      type: 'name',
                                                      title: '',
                                                      input_style: { list: [], version: 'v2' },
                                                      title_style: { list: [], version: 'v2' },
                                                      place_holder: Language.text('please_enter_company_tax_id'),
                                                    },
                                                    hidden_code:
                                                      "    if(form_data['invoice_type']!=='company'){\n       form_data[form_key]=undefined\nreturn true\n    }else{\n return false\n    }",
                                                  },
                                                  {
                                                    col: '6',
                                                    key: 'love_code',
                                                    page: 'input',
                                                    type: 'form_plugin_v2',
                                                    group: '',
                                                    title: Language.text('donation_code'),
                                                    col_sm: '12',
                                                    appName: 'cms_system',
                                                    require: 'false',
                                                    readonly: 'write',
                                                    formFormat: '{}',
                                                    moduleName: '輸入框',
                                                    style_data: {
                                                      input: {
                                                        list: [],
                                                        class: '',
                                                        style: '',
                                                        version: 'v2',
                                                      },
                                                      label: {
                                                        list: [],
                                                        class: 'form-label fs-base ',
                                                        style: '',
                                                        version: 'v2',
                                                      },
                                                      container: {
                                                        list: [],
                                                        class: '',
                                                        style: '',
                                                        version: 'v2',
                                                      },
                                                    },
                                                    form_config: {
                                                      type: 'name',
                                                      title: '',
                                                      input_style: { list: [], version: 'v2' },
                                                      title_style: { list: [], version: 'v2' },
                                                      place_holder: Language.text('please_enter_donation_code'),
                                                    },
                                                    hidden_code:
                                                      "    if(form_data['invoice_type']!=='donate' || (form_data['invoice_method']==='nouse')){\n       form_data[form_key]=undefined\nreturn true\n    }else{\n return false\n    }",
                                                  },
                                                ]),
                                            {
                                              col: '12',
                                              key: 'note',
                                              page: 'multiple_line_text',
                                              type: 'form_plugin_v2',
                                              group: '',
                                              title: Language.text('delivery_notes'),
                                              col_sm: '12',
                                              appName: 'cms_system',
                                              require: 'false',
                                              readonly: 'write',
                                              formFormat: '{}',
                                              moduleName: '多行文字區塊',
                                              style_data: {
                                                input: {
                                                  list: [],
                                                  class: '',
                                                  style: '',
                                                  version: 'v2',
                                                },
                                                label: {
                                                  list: [],
                                                  class: 'form-label fs-base ',
                                                  style: '',
                                                  version: 'v2',
                                                },
                                                container: {
                                                  list: [],
                                                  class: '',
                                                  style: '',
                                                  version: 'v2',
                                                },
                                              },
                                              form_config: {
                                                type: 'text',
                                                title: '',
                                                title_style: { list: [], version: 'v2' },
                                                place_holder: Language.text('enter_delivery_notes'),
                                              },
                                              hidden_code: 'return false',
                                            },
                                          ].filter(dd => {
                                            return (
                                              (dd.key !== 'name' && dd.key !== 'phone' && dd.key !== 'email') ||
                                              !vm.cartData.user_info_same ||
                                              !widget.share.custom_form_checkout.find((d1: any) => {
                                                return d1.key === dd.key && d1.require;
                                              })
                                            );
                                          });
                                          vm.cartData.user_info.invoice_method = method;
                                          vm.cartData.user_info.invoice_type =
                                            vm.cartData.user_info.invoice_type || 'me';
                                          vm.cartData.user_info.send_type = vm.cartData.user_info.send_type || 'email';

                                          const form_array = JSON.parse(JSON.stringify(vm_info.list));

                                          form_array.map((dd: any) => {
                                            if (
                                              dd.key === 'send_type' &&
                                              vm.cartData.user_info.send_type === 'carrier'
                                            ) {
                                              dd.col = 3;
                                            }
                                            dd.form_config.title_style = {
                                              list: [
                                                {
                                                  class: ['company', 'gui_number', 'carrier_num', 'love_code'].includes(
                                                    dd.key
                                                  )
                                                    ? gClass('label') + ' mt-2'
                                                    : gClass('label') + ' mb-2',
                                                  style:
                                                    'return `color:${glitter.share.globalValue[`theme_color.0.title`]} !important;font-size:16px !important;`',
                                                  stylist: [],
                                                  dataType: 'code',
                                                  style_from: 'code',
                                                  classDataType: 'static',
                                                },
                                              ],
                                              class: 'form-label',
                                              style:
                                                'font-size: 20px;font-style: normal;font-weight: 400;line-height: 140%; color:#393939 !important;',
                                              stylist: [],
                                              version: 'v2',
                                              dataType: 'static',
                                              style_from: 'code',
                                              classDataType: 'static',
                                            };
                                            dd.form_config.input_style = {
                                              list: [
                                                {
                                                  class: gClass('input'),
                                                  style:
                                                    'return `border-radius: ${widget.formData.radius}px !important;`',
                                                  stylist: [],
                                                  dataType: 'code',
                                                  style_from: 'code',
                                                  classDataType: 'static',
                                                },
                                              ],
                                              class: ' mb-3',
                                              style: 'background: #FFF;',
                                              stylist: [],
                                              version: 'v2',
                                              dataType: 'static',
                                              style_from: 'code',
                                              classDataType: 'static',
                                            };
                                            return dd;
                                          });
                                          return [
                                            html` <div
                                              class="d-flex ms-2 my-3"
                                              style="gap:10px;cursor:pointer;"
                                              onclick="${gvc.event(() => {
                                                vm.cartData.user_info_same = !vm.cartData.user_info_same;
                                                if (vm.cartData.user_info_same) {
                                                  vm.cartData.user_info.name = vm.cartData.customer_info.name;
                                                  vm.cartData.user_info.phone = vm.cartData.customer_info.phone;
                                                  vm.cartData.user_info.email = vm.cartData.customer_info.email;
                                                }
                                                gvc.notifyDataChange(id);
                                              })}"
                                            >
                                              <input
                                                class="form-check-input form-checkbox  ${checkbox}"
                                                type="checkbox"
                                                ${vm.cartData.user_info_same ? `checked` : ''}
                                              />
                                              ${Language.text('same_as_buyer_info')}
                                            </div>`,
                                            FormWidget.editorView({
                                              gvc: gvc,
                                              array: form_array.map((dd: any, index: number) => {
                                                dd.col = '6';
                                                if (index === form_array.length - 1) {
                                                  dd.col = '12';
                                                }
                                                return dd;
                                              }),
                                              refresh: () => {
                                                this.storeLocalData(vm.cartData);
                                                gvc.notifyDataChange(id);
                                              },
                                              formData: vm.cartData.user_info,
                                            }),
                                          ].join('<div class="my-2"></div>');
                                        } catch (e) {
                                          console.error(`error 4 =>`, e);
                                          return '';
                                        }
                                      },
                                      divCreate: {
                                        class: `w-100 mt-2`,
                                      },
                                    };
                                  })}
                                  ${(() => {
                                    const verify = [];
                                    const shipment = vm.cartData.shipment_selector.find(
                                      (item: any) => item.value === vm.cartData.user_info.shipment
                                    );
                                    if (shipment.isExcludedByTotal) {
                                      verify.push(
                                        '提示：若總金額超過20,000元，結帳系統無法提供四大超商配送，請調整購買項目'
                                      );
                                    }
                                    if (shipment.isExcludedByWeight) {
                                      verify.push(
                                        '提示：若訂單總重超過20公斤，無法提供中華郵政/黑貓宅配服務，請調整購買項目'
                                      );
                                    }
                                    return html`
                                      <div style="height:100px;"></div>

                                      <div
                                        class="w-100 d-flex align-items-center justify-content-center position-fixed bottom-0 start-0 p-2 shadow bg-white"
                                        style="min-height:76px;z-index:10;"
                                      >
                                        ${(() => {
                                          if (verify.length > 0) {
                                            return verify
                                              .map(dd => {
                                                return `<div class="text-danger" style="font-size: 13px;">${dd}</div>`;
                                              })
                                              .join('');
                                          } else {
                                            return html` <div
                                              class="d-flex align-items-center justify-content-end"
                                              style="width:1180px;max-width: 100%;gap:24px;"
                                            >
                                              <div class="d-flex align-items-center fs-base" style="gap:5px;">
                                                <div style="white-space:nowrap;" class="fw-bold fs-sm">
                                                  ${Language.text('total_amount')}
                                                </div>
                                                <div class="${gClass(['price-row', 'text-1', 'bold'])}">
                                                  <div class="fs-5 fw-bold ${gClass('price-text')}">
                                                    ${Currency.convertCurrencyText(vm.cartData.total)}
                                                  </div>
                                                </div>
                                              </div>
                                              <div class="flex-fill d-block d-sm-none"></div>
                                              <div>
                                                <button
                                                  class="${gClass(
                                                    verify.length > 0 ? 'button-bgr-disable' : 'button-bgr'
                                                  )}"
                                                  style="${document.body.clientWidth < 800
                                                    ? `min-width:100px;`
                                                    : `min-width:380px;`}"
                                                  onclick="${gvc.event(() => {
                                                    const that = this;
                                                    if (onlineData?.interaction?.status == 3) {
                                                      const dialog = new ShareDialog(gvc.glitter);
                                                      dialog.infoMessage({
                                                        text: `很抱歉，團購的結帳時間已截止，無法再進行訂單結算。感謝您的支持，期待下次再為您服務！`,
                                                      });
                                                      return;
                                                    }

                                                    if (
                                                      (window as any).login_config.login_in_to_order &&
                                                      !GlobalUser.token
                                                    ) {
                                                      GlobalUser.loginRedirect = location.href;
                                                      gvc.glitter.href = '/login';
                                                      return;
                                                    }

                                                    function next() {
                                                      if (vm.cartData.user_info_same) {
                                                        vm.cartData.user_info.name = vm.cartData.customer_info.name;
                                                        vm.cartData.user_info.phone = vm.cartData.customer_info.phone;
                                                        vm.cartData.user_info.email = vm.cartData.customer_info.email;
                                                      }
                                                      if (verify.length > 0) {
                                                        return;
                                                      }

                                                      if (shipmentList.length === 0) {
                                                        vm.cartData.user_info.shipment = 'none';
                                                      }

                                                      const dialog = new ShareDialog(gvc.glitter);
                                                      if (!that.checkFormData(gvc, vm.cartData, widget)) {
                                                        return;
                                                      }
                                                      for (const item of vm.cartData.lineItems) {
                                                        const title =
                                                          (item.language_data &&
                                                            item.language_data[Language.getLanguage()].title) ||
                                                          item.title;
                                                        let min = (item.min_qty && parseInt(item.min_qty, 10)) || 1;
                                                        let max_qty =
                                                          (item.max_qty && parseInt(item.max_qty, 10)) || Infinity;
                                                        let count = 0;
                                                        for (const b of vm.cartData.lineItems) {
                                                          if (b.id === item.id) {
                                                            count += b.count;
                                                          }
                                                        }
                                                        if (count < min) {
                                                          dialog.errorMessage({
                                                            text: Language.text('min_p_count_d')
                                                              .replace('_c_', min)
                                                              .replace('_p_', `『${title}』`),
                                                          });
                                                          return;
                                                        }
                                                        if (count > max_qty) {
                                                          dialog.errorMessage({
                                                            text: Language.text('max_p_count_d')
                                                              .replace('_c_', max_qty)
                                                              .replace('_p_', `『${title}』`),
                                                          });
                                                          return;
                                                        }
                                                        if (max_qty > 0 && count + item.buy_history_count > max_qty) {
                                                          dialog.errorMessage({
                                                            text: Language.text('trigger_maximum_item').replace(
                                                              '_p_',
                                                              `『${title}』`
                                                            ),
                                                          });
                                                          return;
                                                        }
                                                      }
                                                      [
                                                        'MerchantTradeNo',
                                                        'LogisticsSubType',
                                                        'CVSStoreID',
                                                        'CVSStoreName',
                                                        'CVSTelephone',
                                                        'CVSOutSide',
                                                        'ExtraData',
                                                        'CVSAddress',
                                                      ].map(dd => {
                                                        if (gvc.glitter.getUrlParameter(dd)) {
                                                          vm.cartData.user_info[dd] = decodeURI(
                                                            glitter.getUrlParameter(dd)
                                                          );
                                                        }
                                                      });
                                                      dialog.dataLoading({ visible: true });
                                                      vm.cartData.user_info.note =
                                                        (vm.cartData.user_info.note ?? '') + (check_out_sub.note ?? '');
                                                      ApiShop.toCheckout({
                                                        line_items: vm.cartData.lineItems.map((dd: any) => {
                                                          return {
                                                            id: dd.id,
                                                            spec: dd.spec,
                                                            count: dd.count,
                                                          };
                                                        }),
                                                        customer_info: vm.cartData.customer_info,
                                                        return_url: (() => {
                                                          const originalUrl =
                                                            glitter.root_path + 'order_detail' + location.search;
                                                          const urlObject = new URL(originalUrl);
                                                          urlObject.searchParams.set('EndCheckout', '1');
                                                          const newUrl = urlObject.toString();
                                                          if (
                                                            ApplicationConfig.device_type !== 'web' &&
                                                            ['jkopay', 'line_pay'].includes(
                                                              vm.cartData.customer_info.payment_select
                                                            )
                                                          ) {
                                                            return `${ApplicationConfig.bundle_id}://?path=${encodeURIComponent(newUrl)}`;
                                                          } else {
                                                            return newUrl;
                                                          }
                                                        })(),
                                                        user_info: vm.cartData.user_info,
                                                        code: apiCart.cart.code,
                                                        use_rebate: apiCart.cart.use_rebate,
                                                        custom_form_format: vm.cartData.custom_form_format,
                                                        custom_form_data: vm.cartData.custom_form_data,
                                                        custom_receipt_form: vm.cartData.receipt_form,
                                                        distribution_code:
                                                          localStorage.getItem('distributionCode') ?? '',
                                                        give_away: apiCart.cart.give_away,
                                                      }).then(res => {
                                                        dialog.dataLoading({ visible: false });
                                                        if (!res.result) {
                                                          dialog.infoMessage({
                                                            text: '系統處理您的付款時遇到一些問題，導致交易未能完成。請聯繫我們的客服團隊以取得進一步的協助',
                                                          });
                                                          return;
                                                        }
                                                        if (vm.cartData.customer_info.payment_select == 'paynow') {
                                                          if (!res.response?.data?.result?.secret) {
                                                            return 'paynow API失敗';
                                                          }
                                                          glitter.innerDialog(
                                                            (gvc: GVC) => {
                                                              document.body.style.setProperty(
                                                                'overflow-y',
                                                                'hidden',
                                                                'important'
                                                              );
                                                              return gvc.bindView({
                                                                bind: `paynow`,
                                                                view: () => {
                                                                  return html` <div
                                                                    class="w-100 h-100 d-flex align-items-center justify-content-center"
                                                                  >
                                                                    ${document.body.clientWidth < 800
                                                                      ? `
                                                                            <div class="bg-white position-relative vw-100" style="height: ${window.innerHeight}px;overflow-y: auto;
                                                                            padding-top:${50 + glitter.share.top_inset}px;
                                                                            ">
                                                                            `
                                                                      : `<div class="p-3  bg-white position-relative" style="max-height: calc(100vh - 90px);overflow-y:auto;">`}
                                                                    <div
                                                                      style="position: absolute; right: 15px;top:${15 +
                                                                      glitter.share.top_inset}px;z-index:1;"
                                                                      onclick="${gvc.event(() => {
                                                                        location.href = res.response.returnUrl;
                                                                        gvc.closeDialog();
                                                                      })}"
                                                                    >
                                                                      <i
                                                                        class="fa-regular fa-circle-xmark fs-5 text-dark cursor_pointer"
                                                                      ></i>
                                                                    </div>
                                                                    <div id="paynow-container">
                                                                      <div style="width:200px;height:200px;">
                                                                        loading...
                                                                      </div>
                                                                    </div>
                                                                    <div class="px-3 px-sm-0 w-100">
                                                                      <button
                                                                        class="${gClass(
                                                                          verify.length > 0
                                                                            ? 'button-bgr-disable'
                                                                            : 'button-bgr'
                                                                        )} "
                                                                        id="checkoutButton"
                                                                        onclick="${gvc.event(() => {
                                                                          const PayNow = (window as any).PayNow;
                                                                          const dialog = new ShareDialog(gvc.glitter);
                                                                          dialog.dataLoading({ visible: true });
                                                                          PayNow.checkout().then((response: any) => {
                                                                            dialog.dataLoading({ visible: false });
                                                                            if (response.error) {
                                                                              dialog.errorMessage({
                                                                                text: response.error.message,
                                                                              });
                                                                            }
                                                                          });
                                                                        })}"
                                                                      >
                                                                        <span class="${gClass('button-text')}"
                                                                          >確認結帳</span
                                                                        >
                                                                      </button>
                                                                    </div>
                                                                  </div>`;
                                                                },
                                                                divCreate: {
                                                                  class: ` h-100 d-flex align-items-center justify-content-center`,
                                                                  style: `max-width:100vw;${document.body.clientWidth < 800 ? 'width:100%;' : 'width:400px;'};`,
                                                                },
                                                                onCreate: () => {
                                                                  const publicKey = res.response.publicKey;
                                                                  const secret = res.response.data.result.secret;
                                                                  const env =
                                                                    res.response.BETA == 'true'
                                                                      ? 'sandbox'
                                                                      : 'production';
                                                                  const PayNow = (window as any).PayNow;
                                                                  PayNow.createPayment({
                                                                    publicKey: publicKey,
                                                                    secret: secret,
                                                                    env: env,
                                                                  });
                                                                  PayNow.mount('#paynow-container', {
                                                                    locale: 'zh_tw',
                                                                    appearance: {
                                                                      variables: {
                                                                        fontFamily: 'monospace',
                                                                        colorPrimary: '#0078ab',
                                                                        colorDefault: '#0a0a0a',
                                                                        colorBorder: '#cccccc',
                                                                        colorPlaceholder: '#eeeeee',
                                                                        borderRadius: '.3rem',
                                                                        colorDanger: '#ff3d3d',
                                                                      },
                                                                    },
                                                                  });
                                                                },
                                                              });
                                                            },
                                                            `paynow`,
                                                            {
                                                              animation:
                                                                document.body.clientWidth > 800
                                                                  ? Animation.fade
                                                                  : Animation.popup,
                                                              dismiss: () => {
                                                                document.body.style.setProperty('overflow-y', 'auto');
                                                              },
                                                            }
                                                          );
                                                        }

                                                        localStorage.setItem(
                                                          'clear_cart_items',
                                                          JSON.stringify(
                                                            vm.cartData.lineItems.map((item: any) => item.id)
                                                          )
                                                        );

                                                        if (res.response.off_line || res.response.is_free) {
                                                          location.href = res.response.return_url;
                                                        } else {
                                                          if (
                                                            res.response.returnCode == '0000' &&
                                                            vm.cartData.customer_info.payment_select == 'line_pay'
                                                          ) {
                                                            if (glitter.share.is_application) {
                                                              gvc.glitter.runJsInterFace(
                                                                'intent_url',
                                                                {
                                                                  url: res.response.info.paymentUrl.app,
                                                                },
                                                                () => {}
                                                              );
                                                              // location.href = res.response.info.paymentUrl.app;
                                                            } else {
                                                              location.href = res.response.info.paymentUrl.web;
                                                            }
                                                            // todo 手機跳轉用這個
                                                            // location.href = res.response.form.info.paymentUrl.app;
                                                          } else if (res.response.approveLink) {
                                                            location.href = res.response.approveLink;
                                                          } else if (
                                                            vm.cartData.customer_info.payment_select == 'jkopay'
                                                          ) {
                                                            if (glitter.share.is_application) {
                                                              gvc.glitter.runJsInterFace(
                                                                'intent_url',
                                                                {
                                                                  url: res.response.result_object.payment_url,
                                                                },
                                                                () => {}
                                                              );
                                                            } else {
                                                              location.href = res.response.result_object.payment_url;
                                                            }
                                                          } else {
                                                            const id = gvc.glitter.getUUID();
                                                            $('body').append(
                                                              html` <div id="${id}" style="display: none;">
                                                                ${res.response.form}
                                                              </div>`
                                                            );
                                                            (document.querySelector(`#${id} #submit`) as any).click();
                                                          }
                                                        }
                                                      });
                                                    }

                                                    if (
                                                      (window as any).login_config.login_in_to_order &&
                                                      !GlobalUser.token
                                                    ) {
                                                      GlobalUser.loginRedirect = location.href;
                                                      gvc.glitter.href = '/login';
                                                      return;
                                                    } else {
                                                      ApiUser.getUserData(GlobalUser.token, 'me').then(res => {
                                                        if (
                                                          res.response.userData &&
                                                          !res.response.userData.phone &&
                                                          (window as any).login_config.phone_verify &&
                                                          glitter.getUrlParameter('page') !== 'account_edit'
                                                        ) {
                                                          const dialog = new ShareDialog(glitter);
                                                          dialog.infoMessage({
                                                            text: Language.text('phone_verify_check'),
                                                          });
                                                          glitter.href = '/account_edit';
                                                        } else {
                                                          next();
                                                        }
                                                      });
                                                    }
                                                  })}"
                                                >
                                                  <span
                                                    class="${gClass('button-text')} "
                                                    style="${verify.length > 0 ? `font-size:13px;` : ''}"
                                                  >
                                                    ${verify.length > 0
                                                      ? verify.join('<br/>')
                                                      : (window as any).login_config.login_in_to_order &&
                                                          !GlobalUser.token
                                                        ? Language.text('login_in_to_checkout')
                                                        : Language.text('next')}
                                                  </span>
                                                </button>
                                              </div>
                                            </div>`;
                                          }
                                        })()}
                                      </div>
                                    `;
                                  })()}
                                </div>
                                <div class="d-none d-sm-block" style="height:120px;"></div>
                              </div>
                              <div
                                style="${document.body.clientWidth > 800
                                  ? `width:calc(34% - 10px);position: sticky; top: 65px;`
                                  : `width:calc(100%);`}"
                              >
                                <!--明細-->
                                <div class="rounded-3 bg-white w-100 p-3">${detail_info}</div>
                                <div class="d-sm-none" style="height:120px;"></div>
                              </div>
                            </div>
                          `;
                        },
                      };
                    })()
                  )}
                </div>`;
              } catch (e) {
                console.error(`error 5 =>`, e);
                return '';
              }
            },
            divCreate: {
              class: `check_out_cart_data text-start`,
              style:
                gvc.glitter.getUrlParameter('page') === 'checkout'
                  ? `background:#f0f0f0;`
                  : `background:#f0f0f0;padding-top:10px;border-radius:10px;max-width:1200px;margin:0 auto;`,
            },
            onCreate: () => {
              if (gvc.glitter.getUrlParameter('page') !== 'checkout') {
                setTimeout(() => {
                  document.querySelector('footer')!.remove();
                }, 10);
              }
              Ad.gtagEvent('view_cart', {
                currency: 'TWD',
                value: vm.cartData.total,
                items: vm.cartData.lineItems.map((item: any) => {
                  return {
                    item_id: item.id,
                    item_name: item.title,
                    item_variant: item.spec.join('-'),
                    price: item.sale_price,
                    quantity: item.count,
                    discount: item.discount_price,
                  };
                }),
              });
              Ad.fbqEvent('AddPaymentInfo', {
                value: vm.cartData.total,
                currency: 'TWD',
                contents: vm.cartData.lineItems.map((item: any) => {
                  return {
                    id: item.sku || item.id,
                    quantity: item.count,
                  };
                }),
                content_ids: vm.cartData.lineItems.map((item: any) => item.id),
              });
            },
          };
        })()
      ) +
      (gvc.glitter.getUrlParameter('page') === 'checkout'
        ? html`
            <div style="background:#f0f0f0;z-index:-1;" class="position-absolute start-0 top-0 vw-100 vh-100"></div>
          `
        : html` <div style="background:#f0f0f0;z-index:-1;" class="position-absolute start-0 top-0 w-100"></div> `)
    );
  }

  //檢查資料
  public static checkFormData(gvc: GVC, cartData: any, widget: any): boolean {
    const userData = cartData.customer_info;
    const subData = cartData.user_info;
    const dialog = new ShareDialog(gvc.glitter);

    function checkAddressPattern(input: any) {
      const addressPattern = /^.{6,60}$/;
      return addressPattern.test(input);
    }

    let pass = true;

    // 驗證有無配送方式
    if (subData.shipment === 'none') {
      dialog.errorMessage({
        text: Language.text('select_shipping_method'),
      });
      return false;
    }

    // 填入預設資料
    if (ShipmentConfig.supermarketList.includes(subData['shipment'])) {
      [
        'MerchantID',
        'MerchantTradeNo',
        'LogisticsSubType',
        'CVSStoreID',
        'CVSAddress',
        'CVSTelephone',
        'CVSOutSide',
        'CVSStoreName',
      ].map(dd => {
        if ((window as any).glitter.getUrlParameter(dd)) {
          subData[dd] = decodeURIComponent((window as any).glitter.getUrlParameter(dd));
        } else {
          subData[dd] = undefined;
        }
      });
    }

    // 驗證配送地址是否填寫
    if (
      (() => {
        const ship_method = this.getShipmentMethod(cartData).find((dd: any) => {
          return subData['shipment'] === dd.value;
        });
        if (ship_method && ship_method.system_form) {
          return (ship_method.system_form ?? []).includes('tw-address-selector');
        }
        return ['normal', 'black_cat', 'black_cat_freezing', 'black_cat_ice', 'global_express'].includes(
          subData['shipment']
        );
      })()
    ) {
      if (!subData['address'] || subData['address'] === '') {
        dialog.errorMessage({
          text: `${Language.text('please_enter')}「${Language.text('shipping_address')}」`,
        });
        return false;
      } else if (!subData['city'] || subData['city'] === '') {
        dialog.errorMessage({
          text: `${Language.text('please_enter')}「${Language.text('city')}」`,
        });
        return false;
      } else if ((!subData['area'] || subData['area'] === '') && subData['shipment'] !== 'global_express') {
        dialog.errorMessage({
          text: `${Language.text('please_enter')}「${Language.text('area')}」`,
        });
        return false;
      } else if ((!subData['state'] || subData['state'] === '') && subData['shipment'] === 'global_express') {
        dialog.errorMessage({
          text: `${Language.text('please_enter')}「${Language.text('state')}」`,
        });
        return false;
      }
    } else {
      delete subData['city'];
      delete subData['area'];
      delete subData['address'];
    }

    // 驗證配送地址內容
    if (subData['shipment'] === 'normal' && !checkAddressPattern(subData['address'])) {
      dialog.errorMessage({
        text: Language.text('address_length_requirements'),
      });
      return false;
    }

    // 驗證配送門市
    if (ShipmentConfig.supermarketList.includes(subData['shipment']) && !subData['CVSStoreName']) {
      dialog.errorMessage({
        text: Language.text('select_delivery_store'),
      });
      return false;
    }

    // 驗證配送表單
    const form = this.getShipmentMethod(cartData).find((dd: any) => dd.value === subData['shipment']).form;
    if (FormWidget.checkLeakData(form, subData.custom_form_delivery)) {
      dialog.errorMessage({
        text: `${Language.text('please_enter')}「${Language.getLanguageCustomText(FormWidget.checkLeakData(form, subData))}」`,
      });
      return false;
    }

    // 驗證顧客表單
    const leakData = FormWidget.checkLeakData(cartData.custom_form_format, cartData.custom_form_data);
    if (leakData) {
      dialog.errorMessage({
        text: `${Language.text('please_enter')}「${Language.getLanguageCustomText(leakData)}」`,
      });
      return false;
    }

    // 驗證贈品判斷
    if (
      (() => {
        let gift_need = cartData.voucherList.filter((dd: any) => {
          return dd.reBackType === 'giveaway';
        }).length;
        let gift = 0;
        cartData.lineItems
          .filter((dd: any) => {
            return dd.is_gift;
          })
          .map((dd: any) => {
            gift += dd.count;
          });
        // todo 刪掉
        return gift < gift_need;
      })()
    ) {
      dialog.errorMessage({
        text: Language.text('please_select_gift'),
      });
      return false;
    }

    // 驗證顧客表單
    const leakData_customer = FormWidget.checkLeakDataObj(widget.share.custom_form_checkout, {
      ...userData,
      ...cartData.custom_form_data,
    });
    if (leakData_customer) {
      dialog.errorMessage({
        text: (() => {
          switch (leakData_customer.key) {
            case 'name':
              return Language.text('please_enter_name');
            case 'phone':
              return Language.text('please_enter_contact_number');
            case 'email':
              return Language.text('please_enter_email');
            default:
              return `${Language.text('please_enter')}「${leakData_customer.title}」`;
          }
        })(),
      });
      return false;
    }

    // 驗證配送表單
    const leakData_Receipt_form = FormWidget.checkLeakDataObj(widget.share.receipt_form, subData);
    if (leakData_Receipt_form) {
      dialog.errorMessage({
        text: (() => {
          switch (leakData_Receipt_form.key) {
            case 'name':
              return Language.text('please_enter_name');
            case 'phone':
              return Language.text('please_enter_contact_number');
            case 'email':
              return Language.text('please_enter_email');
            default:
              return `${Language.text('please_enter')}「${leakData_Receipt_form.title}」`;
          }
        })(),
      });
      return false;
    }
    if (!pass) {
      return false;
    }

    // 確認送出事件
    Ad.gtagEvent('begin_checkout', {
      currency: 'TWD',
      value: cartData.total,
      coupon: cartData.code ?? '',
      items: cartData.lineItems.map((item: any) => {
        return {
          item_id: item.id,
          item_name: item.title,
          item_variant: item.spec.join('-'),
          price: item.sale_price,
          quantity: item.count,
          discount: item.discount_price,
        };
      }),
    });

    return true;
  }

  //彈出視窗
  public static viewDialog(obj: { gvc: GVC; tag: string; title?: string; innerHTML: (gvc: GVC) => string }) {
    return obj.gvc.glitter.innerDialog((gvc: GVC) => {
      return html` <div
        class="bg-white shadow rounded-3"
        style="overflow-y: auto;${document.body.clientWidth > 768
          ? `min-width: 600px; width: 700px;`
          : 'min-width: 90vw; max-width: 92.5vw;'}"
      >
        <div class="bg-white shadow rounded-3" style="width: 100%; overflow-y: auto; position: relative;">
          <div
            class="w-100 d-flex align-items-center p-3 border-bottom"
            style="position: sticky; top: 0; background: #fff;"
          >
            <div style="font-size: 16px; font-weight: 700; color: #292218;">${obj.title ?? ''}</div>
            <div class="flex-fill"></div>
            <i
              class="fa-regular fa-circle-xmark fs-5 text-dark"
              style="cursor: pointer"
              onclick="${gvc.event(() => {
                gvc.closeDialog();
              })}"
            ></i>
          </div>
          <div class="c_dialog">
            <div class="c_dialog_body">
              <div class="c_dialog_main" style="gap: 24px; height: auto; max-height: 500px; padding: 12px;">
                ${obj.innerHTML(gvc)}
              </div>
            </div>
          </div>
        </div>
      </div>`;
    }, obj.tag);
  }

  //取得付款方式
  public static getPaymentMethod(cartData: any) {
    let array = [];

    cartData.payment_setting.map((dd: any) => {
      switch (dd.key) {
        case 'newWebPay':
          array.push({
            name: dd.custome_name || '藍新金流',
            value: 'newWebPay',
          });
          break;
        case 'ecPay':
          array.push({
            name: dd.custome_name || '綠界金流',
            value: 'ecPay',
          });
          break;
        case 'paypal':
          array.push({
            name: dd.custome_name || 'PayPal',
            value: 'paypal',
          });
          break;
        case 'line_pay':
          array.push({
            name: dd.custome_name || 'Line Pay',
            value: 'line_pay',
          });
          break;
        case 'jkopay':
          array.push({
            name: dd.custome_name || '街口支付',
            value: 'jkopay',
          });
          break;
        case 'paynow':
          array.push({
            name: dd.custome_name || 'PayNow 立吉富',
            value: 'paynow',
          });
          break;
      }
    });

    cartData.off_line_support = cartData.off_line_support ?? {};
    cartData.off_line_support.atm &&
      array.push({
        name: '銀行轉帳',
        value: 'atm',
      });
    cartData.off_line_support.line &&
      array.push({
        name: 'Line轉帳',
        value: 'line',
      });
    cartData.off_line_support.cash_on_delivery &&
      array.push({
        name: '貨到付款',
        value: 'cash_on_delivery',
      });
    if (cartData.payment_info_custom && cartData.payment_info_custom.length > 0) {
      cartData.payment_info_custom.map((item: any) => {
        if (cartData.off_line_support[item.id]) {
          array.push({
            name: item.name,
            value: item.id,
          });
        }
      });
    }

    // 沒有找到付款方式，則重新 inital
    if (
      !array.find(dd => {
        return dd.value === localStorage.getItem('checkout-payment');
      })
    ) {
      localStorage.setItem('checkout-payment', array[0].value);
    }

    cartData.customer_info.payment_select = localStorage.getItem('checkout-payment');
    return array;
  }

  //取得配送方式
  public static getShipmentMethod(cartData: any) {
    if (
      !cartData.shipment_selector.find((dd: any) => {
        return dd.value === localStorage.getItem('shipment-select');
      })
    ) {
      localStorage.setItem('shipment-select', cartData.shipment_selector[0].value);
    }

    cartData.user_info.shipment = localStorage.getItem('shipment-select');
    return cartData.shipment_selector;
  }

  //儲存本地資料
  public static storeLocalData(cartData: any) {
    //設定顧客
    localStorage.setItem('cart_customer_info', JSON.stringify(cartData.customer_info));
    //設定配送
    localStorage.setItem('shipment-select', cartData.user_info.shipment);
    //設定配送國家資訊
    localStorage.setItem('country-select', cartData.user_info.country);
    //設定付款
    localStorage.setItem('checkout-payment', cartData.customer_info.payment_select);
    //設定自訂表單
    localStorage.setItem('custom_form_data', JSON.stringify(cartData.custom_form_data));
    //設定配送資訊
    localStorage.setItem('custom_user_info', JSON.stringify(cartData.user_info));
    //贈品功能
    localStorage.setItem('give_away', JSON.stringify(cartData.give_away));
  }

  public static initial(cartData: any) {
    try {
      cartData.customer_info = JSON.parse(localStorage.getItem('cart_customer_info') || '{}');
      cartData.custom_form_data = JSON.parse(localStorage.getItem('custom_form_data') || '{}');
      cartData.user_info = JSON.parse(localStorage.getItem('custom_user_info') || '{}');
      cartData.give_away = JSON.parse(localStorage.getItem('give_away') || '[]');
    } catch (e) {
      cartData.customer_info = {};
      cartData.custom_form_data = {};
      cartData.user_info = {};
      cartData.give_away = {};
    }
    this.getPaymentMethod(cartData);
    this.getShipmentMethod(cartData);
  }

  static getCheckedClass(gvc: GVC, color?: string) {
    const className = Tool.randomString(6);
    gvc.addStyle(`
      .${className} {
        min-width: 1rem;
        min-height: 1rem;
      }
      .${className}:checked[type='checkbox'] {
        border: 2px solid ${color ?? '#000'};
        background-color: #fff;
        background-image: url(${this.checkedDataImage(color ?? '#000')}) !important;
        background-position: center center;
      }
    `);
    return className;
  }

  static checkedDataImage(color: string): string {
    color = color.replace('#', '%23');
    return `"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='${color}' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M6 10l3 3l6-6'/%3e%3c/svg%3e"`;
  }
}

(window as any).glitter.setModule(import.meta.url, CheckoutIndex);
