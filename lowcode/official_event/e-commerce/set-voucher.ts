import { TriggerEvent } from '../../glitterBundle/plugins/trigger-event.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import {ApiCart} from "../../glitter-base/route/api-cart.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.success = object.success ?? {};
            object.error = object.error ?? {};
            object.code = object.code ?? {};
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
                    const api_cart=new ApiCart()
                    return new Promise(async (resolve, reject) => {
                        const cart=api_cart.cart
                        const code:any =
                            (await TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.code,
                                element: element,
                            })) ||
                            (cart.code) ||
                            '';


                        cart.code=code
                        ApiShop.getCheckout(cart).then(async (res) => {
                            if (
                                res.result &&
                                res.response.data.voucherList.find((dd: any) => {
                                    return code && dd.code === code;
                                })
                            ) {
                                api_cart.setCart((cartItem)=>{
                                    cartItem.code=code
                                })
                                await TriggerEvent.trigger({
                                    gvc: gvc,
                                    widget: widget,
                                    clickEvent: object.success,
                                });
                            } else {
                                api_cart.setCart((cartItem)=>{
                                    cartItem.code=undefined
                                })
                                await TriggerEvent.trigger({
                                    gvc: gvc,
                                    widget: widget,
                                    clickEvent: object.error,
                                });
                            }
                            resolve(res.response.data);
                        });
                    });
                },
            };
        },
    };
});
