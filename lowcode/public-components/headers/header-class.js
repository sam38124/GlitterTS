var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { ApiCart } from '../../glitter-base/route/api-cart.js';
import { Language } from '../../glitter-base/global/language.js';
import { Currency } from '../../glitter-base/global/currency.js';
import { PdClass } from '../product/pd-class.js';
import { CartModule } from '../modules/cart-module.js';
const html = String.raw;
const css = String.raw;
export class HeaderClass {
    static hideShopperBtn() {
        return !window.store_info.web_type.find((dd) => {
            return ['shop', 'teaching'].includes(dd);
        });
    }
    static spinner(obj) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        const container = {
            class: `${(_b = (_a = obj === null || obj === void 0 ? void 0 : obj.container) === null || _a === void 0 ? void 0 : _a.class) !== null && _b !== void 0 ? _b : ''}`,
            style: `margin-top: 2rem ;${(_c = obj === null || obj === void 0 ? void 0 : obj.container) === null || _c === void 0 ? void 0 : _c.style}`,
        };
        const circleAttr = {
            visible: ((_d = obj === null || obj === void 0 ? void 0 : obj.circle) === null || _d === void 0 ? void 0 : _d.visible) === false ? false : true,
            width: (_f = (_e = obj === null || obj === void 0 ? void 0 : obj.circle) === null || _e === void 0 ? void 0 : _e.width) !== null && _f !== void 0 ? _f : 20,
            borderSize: (_h = (_g = obj === null || obj === void 0 ? void 0 : obj.circle) === null || _g === void 0 ? void 0 : _g.borderSize) !== null && _h !== void 0 ? _h : 16,
        };
        const textAttr = {
            value: (_k = (_j = obj === null || obj === void 0 ? void 0 : obj.text) === null || _j === void 0 ? void 0 : _j.value) !== null && _k !== void 0 ? _k : Language.text('loading'),
            visible: ((_l = obj === null || obj === void 0 ? void 0 : obj.text) === null || _l === void 0 ? void 0 : _l.visible) === false ? false : true,
            fontSize: (_o = (_m = obj === null || obj === void 0 ? void 0 : obj.text) === null || _m === void 0 ? void 0 : _m.fontSize) !== null && _o !== void 0 ? _o : 16,
        };
        return html ` <div
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
    static rightCartMenu(gvc, widget) {
        gvc.glitter.setDrawer(gvc.bindView((() => {
            var _a, _b, _c;
            const vm = {
                id: gvc.glitter.getUUID(),
                imageId: gvc.glitter.getUUID(),
                dataList: [],
                shippings: [],
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
              background: transparent
                url('https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1718100926212-Vector 89.png') no-repeat;
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

            .${classPrefix}-cart-header {
              display: flex;
              flex-direction: column;
              width: 100%;
              margin-bottom: 12px;
              padding: 0;
              padding: 12px;
              border-bottom: 1px solid #dddddd;
              position: sticky;
              top: 0;
              background-color: #fff;
              z-index: 2;
            }

            .${classPrefix}-cart-div {
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 100%;
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
              border: 1px solid ${(_a = widget.formData.theme_color['solid-button-text']) !== null && _a !== void 0 ? _a : '#fff'};
              border-radius: 10px;
              background: ${(_b = widget.formData.theme_color['solid-button-bg']) !== null && _b !== void 0 ? _b : '#000'};
              cursor: pointer;
              color: ${(_c = widget.formData.theme_color['solid-button-text']) !== null && _c !== void 0 ? _c : '#fff'};
            }
          `);
            function refreshView() {
                setTimeout(() => {
                    vm.loading = true;
                    gvc.glitter.recreateView('.js-cart-count');
                    gvc.glitter.recreateView('.shopping-cart');
                    gvc.notifyDataChange(vm.id);
                }, 100);
            }
            function goToCheckoutButton(id) {
                return html ` <button
              class="${classPrefix}-button"
              type="button"
              onclick="${gvc.event(() => {
                    window.drawer.close();
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
                            return html ` <div class="w-100 vh-100 bg-white">${this.spinner()}</div>`;
                        }
                        return html ` <div class="position-relative" style="padding-bottom: 120px;">
                  <div class="${classPrefix}-cart-header">
                    <div class="${classPrefix}-cart-div">
                      <div
                        class="d-flex align-items-center justify-content-center fs-5 py-3 px-2"
                        style="cursor:pointer;"
                        onclick="${gvc.event(() => {
                            gvc.glitter.closeDrawer();
                        })}"
                      >
                        <i class="fa-sharp fa-solid fa-angle-left"></i>
                      </div>
                      <div class="flex-fill"></div>
                      ${goToCheckoutButton(ApiCart.globalCart)}
                    </div>
                    ${(() => {
                            if (vm.dataList.length === 0) {
                                return '';
                            }
                            const num = vm.dataList.reduce((sum, item) => sum + item.count * item.price, 0);
                            return html `<div class="text-end px-2 py-1 fw-bold">
                        ${Language.text('cart_subtotal')} $ ${num.toLocaleString()}
                      </div>`;
                        })()}
                  </div>
                  ${(() => {
                            if (vm.dataList.length === 0) {
                                return html ` <div class="container d-flex align-items-center justify-content-center flex-column">
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
                            }
                            else {
                                return vm.dataList
                                    .map(item => {
                                    function trashEvent() {
                                        new ApiCart().setCart(cartItem => {
                                            cartItem.line_items = cartItem.line_items.filter(dd => {
                                                return !(dd.id === item.id && item.spec.join('') === dd.spec.join(''));
                                            });
                                            refreshView();
                                        });
                                    }
                                    return html ` <div class="d-flex align-items-center px-3 position-relative" style="gap: 12px;">
                            <div
                              class="position-absolute"
                              style="right:13px;top:0px;cursor:pointer;"
                              onclick="${gvc.event(() => trashEvent())}"
                            >
                              <i class="fa-regular fa-trash-can"></i>
                            </div>
                            <div class="d-none" style="width: 10%">
                              <i
                                class="fa-solid fa-xmark-large"
                                style="cursor: pointer;"
                                onclick="${gvc.event(() => trashEvent())}"
                              ></i>
                            </div>
                            <div class="d-flex">
                              <img src="${item.image}" class="${classPrefix}-wh rounded-3" />
                            </div>
                            <div class="d-flex flex-column gap-1 flex-fill">
                              <div class="${classPrefix}-title pe-3">${item.title}</div>
                              <div class="${classPrefix}-spec">
                                ${(() => {
                                        const spec = (() => {
                                            if (!item.spec)
                                                return [];
                                            return item.spec.map((dd, index) => {
                                                try {
                                                    return (item.specs[index].option.find((d1) => {
                                                        return d1.title === dd;
                                                    }).language_title[Language.getLanguage()] || dd);
                                                }
                                                catch (e) {
                                                    return dd;
                                                }
                                            });
                                        })();
                                        return spec.join(' / ');
                                    })()}
                              </div>
                              <div class="d-flex align-items-center justify-content-between">
                                <div class="d-flex align-items-center gap-2" style="font-size: 14px;">
                                  ${Language.text('quantity')}<select
                                    class="${classPrefix}-select"
                                    style="width: 100px;"
                                    onchange="${gvc.event(e => {
                                        new ApiCart().setCart(cartItem => {
                                            cartItem.line_items.find(dd => {
                                                return `${dd.id}` === `${item.id}` && item.spec.join('') === dd.spec.join('');
                                            }).count = parseInt(e.value, 10);
                                            refreshView();
                                        });
                                    })}"
                                  >
                                    ${[...new Array(99)]
                                        .map((_, index) => {
                                        return html ` <option
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
                                    .join(html ` <div class="w-100 border-top my-3"></div>`);
                            }
                        })()}
                </div>`;
                    }
                    catch (e) {
                        console.error(e);
                        return `${e}`;
                    }
                },
                onCreate: () => {
                    if (vm.loading) {
                        const cart = new ApiCart().cart;
                        vm.dataList = [];
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
                            .then((dataArray) => __awaiter(this, void 0, void 0, function* () {
                            const shippings = dataArray[0];
                            if (shippings.result && shippings.response) {
                                vm.shippings = shippings.response;
                            }
                            const data = dataArray[1];
                            const products = data.response.data;
                            for (const item of cart.line_items) {
                                const product = products.find((p) => `${p.id}` === `${item.id}`);
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
                                        image: yield (() => __awaiter(this, void 0, void 0, function* () {
                                            if (!variant) {
                                                if (product.content && product.content.preview_image) {
                                                    return product.content.preview_image[0];
                                                }
                                                return CartModule.noImageURL;
                                            }
                                            const img = yield CartModule.isImageUrlValid(variant.preview_image).then(isValid => {
                                                return isValid
                                                    ? variant.preview_image
                                                    : product.content.preview_image[0] || CartModule.noImageURL;
                                            });
                                            return img;
                                        }))(),
                                    };
                                    vm.dataList.push(lineItem);
                                }
                            }
                        }))
                            .then(() => {
                            document.querySelector('.hy-drawer-content').style.background = '#ffffff';
                            vm.loading = false;
                            gvc.notifyDataChange(vm.id);
                        });
                    }
                },
            };
        })()), () => {
            if (document.body.clientWidth > 800) {
                gvc.glitter.openDrawer(400);
            }
            else if (document.body.clientWidth < 600) {
                gvc.glitter.openDrawer(document.body.clientWidth);
            }
            else {
                gvc.glitter.openDrawer(document.body.clientWidth * 0.8);
            }
        });
    }
    static getChangePagePath(gvc) {
        return new URL('./official_event/page/change-page.js', gvc.glitter.root_path).href;
    }
    static addStyle(gvc) {
        gvc.addStyle(css `
      .h-logo-image {
        width: 150px;
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        border-radius: 10px;
        margin-bottom: 20px;
      }

      .h-logo-text-1 {
        width: 150px;
        margin-bottom: 20px;
        font-size: 36px;
      }

      .h-logo-text-2 {
        margin-bottom: 20px;
        font-size: 20px;
      }

      .h-glass-div {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        color: rgb(107, 114, 128);
      }

      .h-20px-pointer {
        cursor: pointer;
        font-size: 20px;
      }

      .h-checkout-count-icon {
        width: 18px;
        height: 18px;
        color: white !important;
        background: #fe5541;
        align-items: center;
        justify-content: center;
        color: #fff;
        display: flex;
        font-weight: 500;
      }

      .h-member-button {
        cursor: pointer;
        display: flex;
        width: 100px;
        padding: 7px;
        justify-content: center;
        align-items: center;
        gap: 10px;
        border-radius: 5px;
      }
    `);
    }
}
