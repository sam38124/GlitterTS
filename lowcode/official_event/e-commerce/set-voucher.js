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
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            var _a, _b, _c;
            object.success = (_a = object.success) !== null && _a !== void 0 ? _a : {};
            object.error = (_b = object.error) !== null && _b !== void 0 ? _b : {};
            object.code = (_c = object.code) !== null && _c !== void 0 ? _c : {};
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.code, {
                            hover: false,
                            option: [],
                            title: '優惠券來源',
                        }),
                        TriggerEvent.editer(gvc, widget, object.success, {
                            hover: false,
                            option: [],
                            title: '優惠券新增成功',
                        }),
                        TriggerEvent.editer(gvc, widget, object.error, {
                            hover: false,
                            option: [],
                            title: '優惠券新增失敗',
                        }),
                    ].join(`<div class="my-2"></div>`);
                },
                event: () => {
                    const api_cart = new ApiCart();
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const cart = api_cart.cart;
                        const code = (yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.code,
                            element: element,
                        })) ||
                            (cart.code) ||
                            '';
                        cart.code = code;
                        ApiShop.getCheckout(cart).then((res) => __awaiter(void 0, void 0, void 0, function* () {
                            if (res.result &&
                                res.response.data.voucherList.find((dd) => {
                                    return code && dd.code === code;
                                })) {
                                api_cart.setCart((cartItem) => {
                                    cartItem.code = code;
                                });
                                yield TriggerEvent.trigger({
                                    gvc: gvc,
                                    widget: widget,
                                    clickEvent: object.success,
                                });
                            }
                            else {
                                api_cart.setCart((cartItem) => {
                                    cartItem.code = undefined;
                                });
                                yield TriggerEvent.trigger({
                                    gvc: gvc,
                                    widget: widget,
                                    clickEvent: object.error,
                                });
                            }
                            resolve(res.response.data);
                        }));
                    }));
                },
            };
        },
    };
});
