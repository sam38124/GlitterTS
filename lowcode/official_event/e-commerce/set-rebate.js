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
            object.rebate = (_a = object.rebate) !== null && _a !== void 0 ? _a : {};
            object.rebateError = (_b = object.rebateError) !== null && _b !== void 0 ? _b : {};
            object.rebateSuccess = (_c = object.rebateSuccess) !== null && _c !== void 0 ? _c : {};
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.rebate, {
                            hover: false,
                            option: [],
                            title: '購物金來源',
                        }),
                        TriggerEvent.editer(gvc, widget, object.rebateSuccess, {
                            hover: false,
                            option: [],
                            title: '購物金使用成功',
                        }),
                        TriggerEvent.editer(gvc, widget, object.rebateError, {
                            hover: false,
                            option: [],
                            title: '購物金使用失敗',
                        }),
                    ].join(`<div class="my-2"></div>`);
                },
                event: () => {
                    const api_cart = new ApiCart();
                    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                        const triggerRebate = (yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.rebate,
                            element: element,
                        })) || 0;
                        const defaultRebate = api_cart.cart.use_rebate || 0;
                        const voucherCode = api_cart.cart.code;
                        ApiShop.getRebate({}).then((reb) => __awaiter(void 0, void 0, void 0, function* () {
                            var _a, _b;
                            const remainRebate = (_b = (_a = reb.response) === null || _a === void 0 ? void 0 : _a.sum) !== null && _b !== void 0 ? _b : 0;
                            const rebate = triggerRebate !== null && triggerRebate !== void 0 ? triggerRebate : defaultRebate;
                            ApiShop.getCheckout({
                                line_items: api_cart.cart.line_items,
                                code: voucherCode,
                                use_rebate: parseInt(rebate, 10),
                            }).then((res) => __awaiter(void 0, void 0, void 0, function* () {
                                var _c;
                                const data = (_c = res.response) === null || _c === void 0 ? void 0 : _c.data;
                                const useRebate = typeof rebate === 'string' ? parseInt(`${rebate}`, 10) : 0;
                                const subtotal = data.total - data.shipment_fee + data.use_rebate;
                                if (subtotal > 0 && useRebate >= 0 && subtotal >= useRebate && remainRebate >= useRebate) {
                                    api_cart.setCart((cartItem) => {
                                        cartItem.use_rebate = parseInt(rebate, 10);
                                    });
                                    TriggerEvent.trigger({
                                        gvc: gvc,
                                        widget: widget,
                                        clickEvent: object.rebateSuccess,
                                        subData: res.response.data,
                                        element: element,
                                    });
                                }
                                else {
                                    api_cart.setCart((cartItem) => {
                                        cartItem.use_rebate = undefined;
                                    });
                                    TriggerEvent.trigger({
                                        gvc: gvc,
                                        widget: widget,
                                        clickEvent: object.rebateError,
                                        subData: res.response.data,
                                        element: element,
                                    });
                                }
                                resolve(res.response.data);
                            }));
                        }));
                    }));
                },
            };
        },
    };
});
