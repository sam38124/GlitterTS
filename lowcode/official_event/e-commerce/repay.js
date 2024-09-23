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
import { ApiShop } from "../../glitter-base/route/shopping.js";
import { ApiCart } from "../../glitter-base/route/api-cart.js";
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            var _a, _b;
            object.order_id = (_a = object.order_id) !== null && _a !== void 0 ? _a : {};
            object.return_url = (_b = object.return_url) !== null && _b !== void 0 ? _b : {};
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
                    ].join(`<div class="my-2"></div>`);
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const order_id = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.order_id
                        });
                        const redirect = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.return_url
                        });
                        function checkout() {
                            const href = new URL(redirect, location.href);
                            ApiShop.repay(order_id, href.href).then((res) => {
                                if (object.payType === 'offline' || res.response.off_line || res.response.is_free) {
                                    ApiCart.clearCart();
                                    resolve(true);
                                    location.href = res.response.return_url;
                                }
                                else {
                                    const id = gvc.glitter.getUUID();
                                    $('body').append(`<div id="${id}" style="display: none;">${res.response.form}</div>`);
                                    document.querySelector(`#${id} #submit`).click();
                                    ApiCart.clearCart();
                                }
                            });
                        }
                        checkout();
                    }));
                },
            };
        },
    };
});
