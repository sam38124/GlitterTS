import { TriggerEvent } from '../../glitterBundle/plugins/trigger-event.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { EditorElem } from '../../glitterBundle/plugins/editor-elem.js';
import {ApiCart} from "../../glitter-base/route/api-cart.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            object.userInfo = object.userInfo ?? {};
            object.idData = object.idData ?? {};
            object.cartCount = object.cartCount ?? {};
            object.payType = object.payType ?? 'online';
            object.codeData = object.codeData ?? {};
            object.redirect = object.redirect ?? {};
            object.customer_info = object.customer_info ?? {};
            object.custom_form_format = object.custom_form_format ?? {};
            object.custom_form_data = object.custom_form_data ?? {};
            return {
                editor: () => {
                    return gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                let map: any = [
                                    EditorElem.select({
                                        gvc: gvc,
                                        title: '付款方式',
                                        def: object.payType,
                                        array: [
                                            { title: '線上金流付款', value: 'online' },
                                            {
                                                title: '線下付款',
                                                value: 'offline',
                                            },
                                        ],
                                        callback: (text) => {
                                            object.payType = text;
                                            gvc.notifyDataChange(id);
                                        },
                                    }),
                                    EditorElem.select({
                                        gvc: gvc,
                                        title: '資料來源',
                                        def: object.dataFrom ?? 'cart',
                                        array: [
                                            { title: '立即購買', value: 'addNow' },
                                            {
                                                title: '購物車內容',
                                                value: 'cart',
                                            },
                                            { title: '程式碼', value: 'code' },
                                        ],
                                        callback: (text) => {
                                            object.dataFrom = text;
                                            gvc.notifyDataChange(id);
                                        },
                                    }),
                                    TriggerEvent.editer(gvc, widget, object.customer_info, {
                                        hover: false,
                                        option: [],
                                        title: '取得客戶資料',
                                    }),
                                    TriggerEvent.editer(gvc, widget, object.userInfo, {
                                        hover: false,
                                        option: [],
                                        title: '取得配送資料',
                                    }),
                                    TriggerEvent.editer(gvc, widget, object.custom_form_format, {
                                        hover: false,
                                        option: [],
                                        title: '自訂表單格式',
                                    }),
                                    TriggerEvent.editer(gvc, widget, object.custom_form_data, {
                                        hover: false,
                                        option: [],
                                        title: '自訂表單資料',
                                    }),
                                ];
                                if (object.dataFrom === 'code') {
                                    map.push(
                                        TriggerEvent.editer(gvc, widget, object.codeData, {
                                            hover: false,
                                            option: [],
                                            title: 'lineItems集合',
                                        })
                                    );
                                }
                                if (object.dataFrom === 'addNow') {
                                    map.push(
                                        TriggerEvent.editer(gvc, widget, object.idData, {
                                            hover: false,
                                            option: [],
                                            title: '取得商品ID',
                                        })
                                    );
                                    map.push(
                                        TriggerEvent.editer(gvc, widget, object.cartCount, {
                                            hover: false,
                                            option: [],
                                            title: '購買數量',
                                        })
                                    );
                                }
                                map.push(
                                    TriggerEvent.editer(gvc, widget, object.redirect, {
                                        hover: false,
                                        option: [],
                                        title: '跳轉頁面',
                                    })
                                );

                                return EditorElem.container(map);
                            },
                        };
                    });
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const userInfo = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.userInfo,
                        });
                        const redirect = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.redirect,
                        });
                        const custom_form_format = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.custom_form_format,
                        });
                        const custom_form_data = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.custom_form_data,
                        });
                        const customer_info =
                            (await TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.customer_info,
                            })) || {};
                        const cartData: {
                            line_items: {
                                spec: string[];
                                id: number;
                                count: number;
                            }[];
                            total: number;
                        } = {
                            line_items: [],
                            total: 0,
                        };


                        function checkout() {
                            const href = new URL(redirect as any, location.href);
                            ApiShop.toCheckout({
                                line_items: cartData.line_items.map((dd) => {
                                    return {
                                        id: dd.id,
                                        spec: dd.spec,
                                        count: dd.count,
                                    };
                                }),
                                customer_info: customer_info as any,
                                return_url: href.href,
                                user_info: userInfo as any,
                                code: ApiCart.cart.code,
                                use_rebate: ApiCart.cart.use_rebate,
                                custom_form_format: custom_form_format,
                                custom_form_data: custom_form_data,
                                distribution_code: ApiCart.cart.distribution_code,
                                give_away:ApiCart.cart.give_away
                            }).then((res) => {

                                if (object.payType === 'offline' || res.response.off_line || res.response.is_free) {
                                    ApiCart.clearCart()
                                    resolve(true);
                                    location.href = res.response.return_url;
                                } else {
                                    const id = gvc.glitter.getUUID();
                                    $('body').append(`<div id="${id}" style="display: none;">${res.response.form}</div>`);
                                    (document.querySelector(`#${id} #submit`) as any).click();
                                    ApiCart.clearCart()
                                }
                            });
                        }

                        if (object.dataFrom === 'addNow') {
                            let b: any = await TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.idData,
                                subData: subData,
                            });
                            let cartCount = await TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.cartCount,
                                subData: subData,
                            });
                            const pd: any = (
                                await ApiShop.getProduct({
                                    limit: 50,
                                    page: 0,
                                    id: b.split('-')[0],
                                })
                            ).response.data.content;
                            const vard = pd.variants.find((d2: any) => {
                                return `${pd.id}-${d2.spec.join('-')}` === b;
                            });
                            vard.id = pd.id;
                            vard.count = cartCount;
                            vard.title = pd.title;
                            cartData.line_items.push(vard);
                            cartData.total += vard.count * vard.sale_price;
                            checkout();
                        } else if (object.dataFrom === 'code') {
                            cartData.line_items = (await TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.codeData,
                                subData: subData,
                            })) as any;
                            checkout();
                        } else {
                            cartData.line_items=ApiCart.cart.line_items
                            checkout();
                        }
                    });
                },
            };
        },
    };
});
