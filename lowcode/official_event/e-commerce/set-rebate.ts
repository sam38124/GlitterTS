import { TriggerEvent } from '../../glitterBundle/plugins/trigger-event.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import {ApiCart} from "../../glitter-base/route/api-cart.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.rebate = object.rebate ?? {};
            object.rebateError = object.rebateError ?? {};
            object.rebateSuccess = object.rebateSuccess ?? {};
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
                    return new Promise(async (resolve) => {
                        const triggerRebate =
                            (await TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.rebate,
                                element: element,
                            })) || 0;
                        const defaultRebate = ApiCart.cart.use_rebate || 0;
                        const voucherCode = ApiCart.cart.code;

                        ApiShop.getRebate({}).then(async (reb) => {
                            const remainRebate = reb.response?.sum ?? 0;
                            const rebate = triggerRebate ?? defaultRebate;
                            ApiShop.getCheckout({
                                line_items: ApiCart.cart.line_items,
                                code: voucherCode as string,
                                use_rebate: parseInt(rebate as string, 10),
                            }).then(async (res) => {
                                const data = res.response?.data;
                                const useRebate = typeof rebate === 'string' ? parseInt(`${rebate}`, 10) : 0;
                                const subtotal = data.total - data.shipment_fee + data.use_rebate;

                                if (subtotal > 0 && useRebate >= 0 && subtotal >= useRebate && remainRebate >= useRebate) {
                                    ApiCart.setCart((cartItem)=>{
                                        cartItem.use_rebate=parseInt(rebate as any,10)
                                    })
                                    TriggerEvent.trigger({
                                        gvc: gvc,
                                        widget: widget,
                                        clickEvent: object.rebateSuccess,
                                        subData: res.response.data,
                                        element: element,
                                    });
                                } else {
                                    ApiCart.setCart((cartItem)=>{
                                        cartItem.use_rebate=undefined
                                    })
                                    TriggerEvent.trigger({
                                        gvc: gvc,
                                        widget: widget,
                                        clickEvent: object.rebateError,
                                        subData: res.response.data,
                                        element: element,
                                    });
                                }
                                resolve(res.response.data);
                            });
                        });
                    });
                },
            };
        },
    };
});
