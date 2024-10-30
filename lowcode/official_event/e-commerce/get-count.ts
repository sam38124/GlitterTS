import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from '../../glitter-base/route/shopping.js';
import {EditorElem} from '../../glitterBundle/plugins/editor-elem.js';
import {GlobalUser} from '../../glitter-base/global/global-user.js';
import {ApiCart} from "../../glitter-base/route/api-cart.js";

export function getCheckoutCount(callback: (count: number) => void) {
    ApiShop.getCheckout(ApiCart.cart).then((res) => {

        if (res.result) {
            ApiCart.setCart((cartItem) => {
                cartItem.line_items = res.response.data.lineItems.map((dd: any) => {
                    return {
                        spec: dd.spec,
                        id: dd.id,
                        count: dd.count
                    }
                })
            })
            let total = 0;
            res.response.data.lineItems.map((dd: any) => {
                total += dd.count;
            });
            callback(total);
        } else {
            callback(0);
        }
    })
}

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            return {
                editor: () => {
                    return ``;
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        getCheckoutCount((count) => {
                            resolve(count)
                        })
                    });
                },
            };
        },
    };
});
