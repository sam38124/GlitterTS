var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TriggerEvent } from '../../glitterBundle/plugins/trigger-event.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { ApiCart } from "../../glitter-base/route/api-cart.js";
export function getCheckoutCount(callback) {
    const api_cart = new ApiCart();
    ApiShop.getCheckout(api_cart.cart).then((res) => {
        if (res.result) {
            api_cart.setCart((cartItem) => {
                cartItem.line_items = res.response.data.lineItems.map((dd) => {
                    return {
                        spec: dd.spec,
                        id: dd.id,
                        count: dd.count
                    };
                });
            });
            let total = 0;
            res.response.data.lineItems.map((dd) => {
                total += dd.count;
            });
            callback(total);
        }
        else {
            callback(0);
        }
    });
}
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            return {
                editor: () => {
                    return ``;
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        getCheckoutCount((count) => {
                            resolve(count);
                        });
                    }));
                },
            };
        },
    };
});
