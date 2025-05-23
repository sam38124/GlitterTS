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
import { EditorElem } from '../../glitterBundle/plugins/editor-elem.js';
import { ApiCart } from "../../glitter-base/route/api-cart.js";
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            object.userInfo = (_a = object.userInfo) !== null && _a !== void 0 ? _a : {};
            object.idData = (_b = object.idData) !== null && _b !== void 0 ? _b : {};
            object.cartCount = (_c = object.cartCount) !== null && _c !== void 0 ? _c : {};
            object.payType = (_d = object.payType) !== null && _d !== void 0 ? _d : 'online';
            object.codeData = (_e = object.codeData) !== null && _e !== void 0 ? _e : {};
            object.redirect = (_f = object.redirect) !== null && _f !== void 0 ? _f : {};
            object.customer_info = (_g = object.customer_info) !== null && _g !== void 0 ? _g : {};
            object.custom_form_format = (_h = object.custom_form_format) !== null && _h !== void 0 ? _h : {};
            object.custom_form_data = (_j = object.custom_form_data) !== null && _j !== void 0 ? _j : {};
            return {
                editor: () => {
                    return gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                var _a;
                                let map = [
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
                                        def: (_a = object.dataFrom) !== null && _a !== void 0 ? _a : 'cart',
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
                                    map.push(TriggerEvent.editer(gvc, widget, object.codeData, {
                                        hover: false,
                                        option: [],
                                        title: 'lineItems集合',
                                    }));
                                }
                                if (object.dataFrom === 'addNow') {
                                    map.push(TriggerEvent.editer(gvc, widget, object.idData, {
                                        hover: false,
                                        option: [],
                                        title: '取得商品ID',
                                    }));
                                    map.push(TriggerEvent.editer(gvc, widget, object.cartCount, {
                                        hover: false,
                                        option: [],
                                        title: '購買數量',
                                    }));
                                }
                                map.push(TriggerEvent.editer(gvc, widget, object.redirect, {
                                    hover: false,
                                    option: [],
                                    title: '跳轉頁面',
                                }));
                                return EditorElem.container(map);
                            },
                        };
                    });
                },
                event: () => {
                    const api_cart = new ApiCart();
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const userInfo = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.userInfo,
                        });
                        const redirect = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.redirect,
                        });
                        const custom_form_format = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.custom_form_format,
                        });
                        const custom_form_data = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.custom_form_data,
                        });
                        const customer_info = (yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.customer_info,
                        })) || {};
                        const cartData = {
                            line_items: [],
                            total: 0,
                        };
                        function checkout() {
                            const href = new URL(redirect, location.href);
                            ApiShop.toCheckout({
                                line_items: cartData.line_items.map((dd) => {
                                    return {
                                        id: dd.id,
                                        spec: dd.spec,
                                        count: dd.count,
                                    };
                                }),
                                customer_info: customer_info,
                                return_url: href.href,
                                user_info: userInfo,
                                code: api_cart.cart.code,
                                use_rebate: api_cart.cart.use_rebate,
                                custom_form_format: custom_form_format,
                                custom_form_data: custom_form_data,
                                distribution_code: api_cart.cart.distribution_code,
                                give_away: api_cart.cart.give_away
                            }).then((res) => {
                                localStorage.removeItem('custom_form_delivery');
                                if (object.payType === 'offline' || res.response.off_line || res.response.is_free) {
                                    api_cart.clearCart();
                                    resolve(true);
                                    location.href = res.response.return_url;
                                }
                                else {
                                    const id = gvc.glitter.getUUID();
                                    $('body').append(`<div id="${id}" style="display: none;">${res.response.form}</div>`);
                                    document.querySelector(`#${id} #submit`).click();
                                    api_cart.clearCart();
                                }
                            });
                        }
                        if (object.dataFrom === 'addNow') {
                            let b = yield TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.idData,
                                subData: subData,
                            });
                            let cartCount = yield TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.cartCount,
                                subData: subData,
                            });
                            const pd = (yield ApiShop.getProduct({
                                limit: 50,
                                page: 0,
                                id: b.split('-')[0],
                            })).response.data.content;
                            const vard = pd.variants.find((d2) => {
                                return `${pd.id}-${d2.spec.join('-')}` === b;
                            });
                            vard.id = pd.id;
                            vard.count = cartCount;
                            vard.title = pd.title;
                            cartData.line_items.push(vard);
                            cartData.total += vard.count * vard.sale_price;
                            checkout();
                        }
                        else if (object.dataFrom === 'code') {
                            cartData.line_items = (yield TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.codeData,
                                subData: subData,
                            }));
                            checkout();
                        }
                        else {
                            cartData.line_items = new ApiCart().cart.line_items;
                            checkout();
                        }
                    }));
                },
            };
        },
    };
});
