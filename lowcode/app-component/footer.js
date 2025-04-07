import { GlobalUser } from '../glitter-base/global/global-user.js';
import { ApiCart } from '../glitter-base/route/api-cart.js';
const html = String.raw;
export class Footer {
    static main(cf) {
        const gvc = cf.gvc;
        if (cf.gvc.glitter.getUrlParameter('page') === 'checkout') {
            return ``;
        }
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
                    return ['index-app', 'index'].includes(cf.gvc.glitter.getUrlParameter('page'));
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
                    gvc.glitter.href = '/checkout';
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
                                if (!GlobalUser.token) {
                                    cf.gvc.glitter.href = '/login';
                                    return;
                                }
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
              class="d-flex flex-column align-items-center justify-content-center flex-fill"
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
