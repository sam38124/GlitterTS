import { GlobalUser } from '../glitter-base/global/global-user.js';
import { ApiCart } from '../glitter-base/route/api-cart.js';
import { Animation } from '../glitterBundle/module/Animation.js';
import { Language } from '../glitter-base/global/language.js';
import { CheckoutIndex } from '../public-components/checkout/index.js';
const html = String.raw;
export class Footer {
    static main(cf) {
        const gvc = cf.gvc;
        return html ` <div style="height: ${gvc.glitter.share.bottom_inset / 2}px;"></div>
      <div
        class="position-fixed bottom-0 d-flex shadow vw-100 start-0"
        style="z-index:10;justify-content: space-around;background: rgba(255,255,255,0.95);
padding-bottom: ${gvc.glitter.share.bottom_inset / 2}px;;
"
      >
        ${[
            {
                title: '首頁',
                icon: '<i class="fa-solid fa-house"></i>',
                event: cf.gvc.event(() => {
                    cf.gvc.glitter.href = '/index-app' + location.search;
                }),
                select: () => {
                    return cf.gvc.glitter.getUrlParameter('page') === 'index-app';
                },
            },
            {
                title: '分類',
                icon: '<i class="fa-duotone fa-solid fa-grid-2"></i>',
                event: cf.gvc.event(() => {
                    cf.gvc.glitter.href = '/all-product' + location.search;
                }),
                select: () => {
                    return cf.gvc.glitter.getUrlParameter('page') === 'all-product';
                },
            },
            {
                title: '購物車',
                icon: '<i class="fa-regular fa-cart-shopping"></i>',
                event: cf.gvc.event(() => {
                    ApiCart.checkoutCart = ApiCart.globalCart;
                    gvc.glitter.innerDialog((gvc) => {
                        return gvc.bindView(() => {
                            const id = gvc.glitter.getUUID();
                            return {
                                bind: id,
                                view: () => {
                                    return [
                                        html ` <div
                            class="w-100 d-flex align-items-center justify-content-center fw-bold position-fixed top-0 start-0"
                            style="height: calc(50px + ${gvc.glitter.share.top_inset}px);
                          padding-top: ${gvc.glitter.share.top_inset}px;
                              background: ${gvc.glitter.share.globalValue['theme_color.0.solid-button-bg']};
                              color:${gvc.glitter.share.globalValue['theme_color.0.solid-button-text']};
                              z-index: 999;
                              "
                          >
                            <div class="d-flex position-relative align-items-center justify-content-center w-100 py-3">
                              ${Language.text('cart')}
                              <div
                                class="position-absolute  d-flex align-items-center justify-content-center"
                                style="top:50%;transform: translateY(-50%);
width:50px;height: 50px;
right:0px;
"
                                onclick="${gvc.event(() => {
                                            gvc.closeDialog();
                                        })}"
                              >
                                <i class="fa-solid fa-xmark"></i>
                              </div>
                            </div>
                          </div>`,
                                        `  <div style="height: calc(50px + ${gvc.glitter.share.top_inset}px);"></div>`,
                                        CheckoutIndex.main(gvc, cf.widget, {}),
                                    ].join('');
                                },
                                divCreate: {
                                    class: `h-100  w-100`,
                                    style: `overflow-y: auto;background:#f0f0f0;`,
                                },
                            };
                        });
                    }, 'checkout', {
                        animation: Animation.popup,
                    });
                }),
                select: () => {
                    return cf.gvc.glitter.getUrlParameter('page') === 'checkout';
                },
            },
            ...(() => {
                if (window.store_info.chat_toggle) {
                    return [
                        {
                            title: '訊息',
                            icon: '<i class="fa-sharp fa-solid fa-headset"></i>',
                            event: cf.gvc.event(() => {
                                const userID = (() => {
                                    if (GlobalUser.token) {
                                        return GlobalUser.parseJWT(GlobalUser.token).payload.userID;
                                    }
                                    else {
                                        return gvc.glitter.macAddress;
                                    }
                                })();
                                gvc.glitter.getModule(new URL('./cms-plugin/customer-message-user.js', gvc.glitter.root_path).href, cl => {
                                    cl.mobileChat({
                                        gvc: gvc,
                                        chat: {
                                            chat_id: [`${userID}`, 'manager'].sort().join('-'),
                                            type: 'user',
                                        },
                                        user_id: `${userID}`,
                                    });
                                });
                            }),
                            select: () => { },
                        },
                    ];
                }
                else {
                    return [];
                }
            })(),
            {
                title: '我的',
                icon: '<i class="fa-regular fa-user"></i>',
                event: cf.gvc.event(() => {
                    cf.gvc.glitter.href = '/account_userinfo' + location.search;
                }),
                select: () => {
                    return cf.gvc.glitter.getUrlParameter('page') === 'account_userinfo';
                },
            },
        ]
            .map((dd) => {
            const color = dd.select()
                ? cf.gvc.glitter.share.globalValue['theme_color.0.border-button-text']
                : '#8D8D8D';
            return html ` <div
              class="d-flex flex-column align-items-center justify-content-center"
              style="height:63px;gap: 2px;cursor: pointer;"
              onclick="${dd.event}"
            >
              <div
                class="d-flex align-items-center justify-content-center fs-5"
                style="width:25px;height: 25px;color:${color};"
              >
                ${dd.icon}
              </div>
              <div class="fw-bold" style="font-size: 12px; color:${color};">${dd.title}</div>
            </div>`;
        })
            .join('')}
      </div>`;
    }
}
window.glitter.setModule(import.meta.url, Footer);
