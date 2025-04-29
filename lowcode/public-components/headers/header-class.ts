import { GVC } from '../../glitterBundle/GVController.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { ApiCart } from '../../glitter-base/route/api-cart.js';
import { Tool } from '../../modules/tool.js';
import { Language } from '../../glitter-base/global/language.js';
import { Currency } from '../../glitter-base/global/currency.js';
import { PdClass } from '../product/pd-class.js';

const html = String.raw;

export class HeaderClass {
  static hideShopperBtn() {
    return !(window as any).store_info.web_type.find((dd: any) => {
      return ['shop', 'teaching'].includes(dd);
    });
  }

  static spinner(obj?: {
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

  static isImageUrlValid(url: string): Promise<boolean> {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  static noImageURL = 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg';

  static rightCartMenu(gvc: GVC, widget: any) {
    gvc.glitter.setDrawer(
      gvc.bindView(
        (() => {
          const vm = {
            id: gvc.glitter.getUUID(),
            imageId: gvc.glitter.getUUID(),
            // dataList: [] as {
            //     id: number;
            //     title: string;
            //     count: number;
            //     spec: string[];
            //     price: number;
            //     image: string;
            //     specs: string[];
            // }[],
            shippings: [] as {
              name: string;
              value: string;
            }[],
            dataList: [] as {
              logistic: string;
              cart: {
                id: number;
                title: string;
                count: number;
                spec: string[];
                price: number;
                image: string;
                specs: string[];
              }[];
            }[],
            loading: true,
          };

          const classPrefix = `header-checkout`;

          gvc.addStyle(`
                        .${classPrefix}-wh {
                            display: flex;
                            min-width: 70px;
                            min-height: 70px;
                            max-width: 70px;
                            max-height: 70px;
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                            object-position: center;
                        }

                        .${classPrefix}-select {
                            display: flex;
                            padding: 7px 30px 7px 18px;
                            max-height: 40px;
                            align-items: center;
                            gap: 6px;
                            border-radius: 10px;
                            border: 1px solid #ddd;
                            background: transparent url('https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1718100926212-Vector 89.png') no-repeat;
                            background-position-x: calc(100% - 12px);
                            background-position-y: 16px;
                            appearance: none;
                            -webkit-appearance: none;
                            -moz-appearance: none;
                            color: #393939;
                        }

                        .${classPrefix}-select:focus {
                            outline: 0;
                        }

                        .${classPrefix}-cart-container {
                            display: flex;
                            width: 100%;
                            align-items: center;
                            padding: 0;
                            margin-bottom: 18px;
                            padding: 12px;
                            border-bottom: 1px solid #dddddd;
                        }

                        .${classPrefix}-cart-title {
                            letter-spacing: 4px;
                            font-size: 22px;
                            font-weight: 700;
                        }

                        .${classPrefix}-shipping-title {
                            font-size: 18px;
                            font-weight: 600;
                        }

                        .${classPrefix}-title {
                            font-size: 16px;
                        }

                        .${classPrefix}-spec {
                            font-size: 14px;
                            color: #8d8d8d;
                        }

                        .${classPrefix}-card {
                            border-radius: 10px;
                            padding: 20px 8px;
                            background: #fff;
                            box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.12);
                            margin: 0 12px;
                        }

                        .${classPrefix}-button {
                            display: flex;
                            padding: 6px 14px;
                            max-height: 30px;
                            justify-content: center;
                            align-items: center;
                            gap: 8px;
                            border: 1px solid ${widget.formData.theme_color['solid-button-text'] ?? '#fff'};
                            border-radius: 10px;
                            background: ${widget.formData.theme_color['solid-button-bg'] ?? '#000'};
                            cursor: pointer;
                            color: ${widget.formData.theme_color['solid-button-text'] ?? '#fff'};
                        }
                    `);

          function refreshView() {
            setTimeout(() => {
              vm.loading = true;
              gvc.glitter.recreateView('.js-cart-count');
              gvc.glitter.recreateView('.shopping-cart');
              gvc.notifyDataChange(vm.id);
            }, 200);
          }

          function goToCheckoutButton(id: string) {
            return html` <button
              class="${classPrefix}-button"
              type="button"
              onclick="${gvc.event(() => {
                (window as any).drawer.close();
                ApiCart.toCheckOutPage(id);
              })}"
            >
              ${Language.text('proceed_to_checkout')}
            </button>`;
          }

          return {
            bind: vm.id,
            view: () => {
              try {
                if (vm.loading) {
                  return html` <div class="w-100 vh-100 bg-white">${this.spinner()}</div>`;
                } else {
                  return html` <div class="" style="position: relative;">
                    <div class="${classPrefix}-cart-container align-items-center">
                      <div
                        class="d-flex align-items-center justify-content-center fs-5 py-3 px-2"
                        style="cursor:pointer;"
                        onclick="${gvc.event(() => {
                          gvc.glitter.closeDrawer();
                        })}"
                      >
                        <i class="fa-sharp fa-solid fa-angle-left"></i>
                      </div>
                      <div class="${classPrefix}-cart-title">${Language.text('cart')}</div>
                      <div class="flex-fill"></div>
                      ${vm.dataList.length === 1 ? goToCheckoutButton(ApiCart.globalCart) : ''}
                    </div>
                    ${(() => {
                      if (vm.dataList.length === 0) {
                        return html` <div
                          class="container d-flex align-items-center justify-content-center flex-column"
                        >
                          <lottie-player
                            style="max-width: 100%; width: 300px; height: 300px;"
                            src="https://lottie.host/38ba8340-3414-41b8-b068-bba18d240bb3/h7e1Q29IQJ.json"
                            speed="1"
                            loop=""
                            autoplay=""
                            background="transparent"
                          ></lottie-player>
                          <div class="mt-3 fw-bold">${Language.text('empty_cart_message')}</div>
                        </div>`;
                      } else {
                        console.log(`vm.dataList==>`, vm.dataList);
                        return vm.dataList
                          .map(data => {
                            const logistic = vm.shippings.find(item => item.value === data.logistic);
                            const logiCartID = `${ApiCart.cartPrefix}_${logistic?.value}`;
                            const logiCart = new ApiCart(logiCartID);
                            logiCart.clearCart();

                            return html`
                              <div class="${classPrefix}-card">
                                ${vm.dataList.length !== 1
                                  ? html`
                                      <div class="d-flex justify-content-between align-items-center px-3 mb-2">
                                        <div class="${classPrefix}-shipping-title">${logistic?.name}</div>
                                        ${goToCheckoutButton(logiCartID)}
                                      </div>
                                    `
                                  : ''}
                                ${data.cart
                                  .map(item => {
                                    logiCart.addToCart(`${item.id}`, item.spec, item.count);
                                    return html` <div
                                      class="d-flex align-items-center px-3 position-relative"
                                      style="gap: 12px;"
                                    >
                                      <div
                                        class="position-absolute"
                                        style="right:13px;top:0px;cursor:pointer;"
                                        onclick="${gvc.event(() => {
                                          new ApiCart().setCart(cartItem => {
                                            cartItem.line_items = cartItem.line_items.filter(dd => {
                                              return !(dd.id === item.id && item.spec.join('') === dd.spec.join(''));
                                            });
                                            refreshView();
                                          });
                                        })}"
                                      >
                                        <i class="fa-regular fa-trash-can"></i>
                                      </div>
                                      <div class="d-none" style="width: 10%">
                                        <i
                                          class="fa-solid fa-xmark-large"
                                          style="cursor: pointer;"
                                          onclick="${gvc.event(() => {
                                            new ApiCart().setCart(cartItem => {
                                              cartItem.line_items = cartItem.line_items.filter(dd => {
                                                return !(dd.id === item.id && item.spec.join('') === dd.spec.join(''));
                                              });
                                              refreshView();
                                            });
                                          })}"
                                        ></i>
                                      </div>
                                      <div class="d-flex" style="">
                                        <img src="${item.image}" class="${classPrefix}-wh rounded-3" />
                                      </div>
                                      <div class="d-flex flex-column gap-1 flex-fill">
                                        <div class="${classPrefix}-title pe-3" style="">${item.title}</div>
                                        <div class="${classPrefix}-spec ">
                                          ${(() => {
                                            const spec: any = (() => {
                                              if (item.spec) {
                                                return item.spec.map((dd: string, index: number) => {
                                                  try {
                                                    return (
                                                      (item.specs[index] as any).option.find((d1: any) => {
                                                        return d1.title === dd;
                                                      }).language_title[Language.getLanguage()] || dd
                                                    );
                                                  } catch (e) {
                                                    return dd;
                                                  }
                                                });
                                              } else {
                                                return [];
                                              }
                                            })();
                                            return spec.join(' / ');
                                          })()}
                                        </div>
                                        <div class="d-flex align-items-center justify-content-between">
                                          <div class="d-flex align-items-center gap-1" style="font-size:14px;">
                                            ${Language.text('quantity')} ：<select
                                              class="${classPrefix}-select"
                                              style="width: 100px;"
                                              onchange="${gvc.event(e => {
                                                new ApiCart().setCart(cartItem => {
                                                  cartItem.line_items.find(dd => {
                                                    return (
                                                      `${dd.id}` === `${item.id}` &&
                                                      item.spec.join('') === dd.spec.join('')
                                                    );
                                                  })!.count = parseInt(e.value, 10);
                                                  refreshView();
                                                });
                                              })}"
                                            >
                                              ${[...new Array(99)]
                                                .map((_, index) => {
                                                  return html` <option
                                                    value="${index + 1}"
                                                    ${index + 1 === item.count ? `selected` : ``}
                                                  >
                                                    ${index + 1}
                                                  </option>`;
                                                })
                                                .join('')}
                                            </select>
                                          </div>
                                          ${Currency.convertCurrencyText(item.price * item.count)}
                                        </div>
                                      </div>
                                    </div>`;
                                  })
                                  .join(html` <div class="w-100 border-top my-3"></div>`)}
                              </div>
                            `;
                          })
                          .join(html` <div class="w-100 my-3"></div>`);
                      }
                    })()}
                  </div>`;
                }
              } catch (e) {
                console.error(e);
                return `${e}`;
              }
            },
            divCreate: {},
            onCreate: () => {
              if (vm.loading) {
                const cart = new ApiCart().cart;

                Promise.all([
                  new Promise(resolve => {
                    ApiShop.getShippingMethod().then(d => {
                      resolve(d);
                    });
                  }),
                  new Promise(resolve => {
                    ApiShop.getProduct({
                      page: 0,
                      limit: 10000,
                      status: 'inRange',
                      show_hidden: true,
                      id_list: [...new Set(cart.line_items.map(item => item.id))].join(','),
                    }).then(d => {
                      resolve(d);
                    });
                  }),
                ])
                  .then(async (dataArray: any) => {
                    const shippings = dataArray[0];
                    if (shippings.result && shippings.response) {
                      vm.shippings = shippings.response;
                    }

                    vm.dataList = [
                      ...vm.shippings.map(item => {
                        return {
                          logistic: item.value,
                          cart: [],
                        };
                      }),
                    ];
                    console.log(`vm.shippings=>`, vm.shippings);
                    console.log(`vm.dataList=>`, vm.dataList);

                    const data = dataArray[1];
                    if (data.result && data.response) {
                      const products = data.response.data;

                      for (const item of cart.line_items) {
                        const product = products.find((p: { id: number }) => `${p.id}` === `${item.id}`);
                        if (product) {
                          const variant = PdClass.getVariant(product.content, {
                            specs: item.spec,
                          });

                          const lineItem = {
                            id: item.id,
                            title: product.content.title,
                            count: item.count,
                            spec: item.spec,
                            specs: product.content.specs,
                            price: variant ? variant.sale_price : 0,
                            image: await (async () => {
                              if (!variant) {
                                if (product.content && product.content.preview_image) {
                                  return product.content.preview_image[0];
                                }
                                return this.noImageURL;
                              }
                              const img = await this.isImageUrlValid(variant.preview_image).then(isValid => {
                                return isValid
                                  ? variant.preview_image
                                  : product.content.preview_image[0] || this.noImageURL;
                              });
                              return img;
                            })(),
                          };

                          const logistics = product.content.designated_logistics;
                          for (const data of vm.dataList) {
                            if (!logistics || logistics.type === 'all' || logistics.list.includes(data.logistic)) {
                              data.cart.push(lineItem);
                            }
                          }
                        }
                      }

                      vm.dataList = vm.dataList.filter(item => item.cart.length > 0);
                      const hasFullShipping = vm.dataList.find(item => {
                        return item.cart.length === cart.line_items.length;
                      });
                      if (hasFullShipping) {
                        vm.dataList = [hasFullShipping];
                      }
                      console.log(`vm.dataList ==>`, vm.dataList);
                    }
                  })
                  .then(() => {
                    (document.querySelector('.hy-drawer-content') as any).style.background = '#ffffff';
                    vm.loading = false;
                    gvc.notifyDataChange(vm.id);
                  });
              }
            },
          };
        })()
      ),
      () => {
        if (document.body.clientWidth > 800) {
          gvc.glitter.openDrawer(400);
        } else if (document.body.clientWidth < 600) {
          gvc.glitter.openDrawer(document.body.clientWidth);
        } else {
          gvc.glitter.openDrawer(document.body.clientWidth * 0.8);
        }
      }
    );
  }
}
