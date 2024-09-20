import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {ApiCart} from "../../glitter-base/route/api-cart.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            object.order_id = object.order_id ?? {}
            object.return_url = object.return_url ?? {}
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.order_id, {
                            hover: false,
                            option: [],
                            title: '訂單ID'
                        }),
                        TriggerEvent.editer(gvc, widget, object.return_url, {
                            hover: false,
                            option: [],
                            title: '導向連結'
                        })
                    ].join(`<div class="my-2"></div>`)
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const order_id = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.order_id
                        });
                        const redirect = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.return_url
                        });
                        function checkout() {
                            const href = new URL(redirect as any,location.href)
                            ApiShop.repay(order_id as string,href.href).then((res) => {
                                if (object.payType === 'offline' || res.response.off_line || res.response.is_free) {
                                    ApiCart.clearCart()
                                    resolve(true)
                                    location.href = res.response.return_url
                                }else{
                                    const id=gvc.glitter.getUUID()
                                    $('body').append(`<div id="${id}" style="display: none;">${res.response.form}</div>`);
                                    (document.querySelector(`#${id} #submit`) as any).click()
                                    ApiCart.clearCart()
                                }

                            })
                        }
                        checkout()
                    })
                },
            };
        },
    };
});

