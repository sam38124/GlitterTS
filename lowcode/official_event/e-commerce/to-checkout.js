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
import { EditorElem } from "../../glitterBundle/plugins/editor-elem.js";
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            var _a, _b, _c;
            object.userInfo = (_a = object.userInfo) !== null && _a !== void 0 ? _a : {};
            object.idData = (_b = object.idData) !== null && _b !== void 0 ? _b : {};
            object.cartCount = (_c = object.cartCount) !== null && _c !== void 0 ? _c : {};
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
                                        title: "資料來源",
                                        def: (_a = object.dataFrom) !== null && _a !== void 0 ? _a : "cart",
                                        array: [{ title: "立即購買", value: "addNow" }, { title: "購物車內容", value: "cart" }],
                                        callback: (text) => {
                                            object.dataFrom = text;
                                            gvc.notifyDataChange(id);
                                        }
                                    }),
                                    TriggerEvent.editer(gvc, widget, object.userInfo, {
                                        hover: false,
                                        option: [],
                                        title: '取得客戶資料'
                                    })
                                ];
                                if (object.dataFrom === 'addNow') {
                                    map.push(TriggerEvent.editer(gvc, widget, object.idData, {
                                        hover: false,
                                        option: [],
                                        title: '取得商品ID'
                                    }));
                                    map.push(TriggerEvent.editer(gvc, widget, object.cartCount, {
                                        hover: false,
                                        option: [],
                                        title: '購買數量'
                                    }));
                                }
                                return EditorElem.container(map);
                            }
                        };
                    });
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const userInfo = yield TriggerEvent.trigger({ gvc: gvc, widget: widget, clickEvent: object.userInfo });
                        const cartData = {
                            line_items: [],
                            total: 0
                        };
                        const voucher = yield ApiShop.getVoucherCode();
                        const rebate = (yield ApiShop.getRebateValue()) || 0;
                        function checkout() {
                            const href = new URL(location.href);
                            href.searchParams.set('page', '');
                            ApiShop.toCheckout({
                                line_items: cartData.line_items.map((dd) => {
                                    return {
                                        id: dd.id,
                                        spec: dd.spec,
                                        count: dd.count
                                    };
                                }),
                                return_url: href.href,
                                user_info: userInfo,
                                code: voucher,
                                use_rebate: parseInt(rebate, 10)
                            }).then((res) => {
                                $('body').html(res.response.form);
                                setTimeout(() => {
                                    console.log(document.querySelector('#submit').click());
                                }, 1000);
                                ApiShop.clearCart();
                            });
                        }
                        if (object.dataFrom === 'addNow') {
                            let b = yield TriggerEvent.trigger({ gvc: gvc, widget: widget, clickEvent: object.idData });
                            let cartCount = yield TriggerEvent.trigger({ gvc: gvc, widget: widget, clickEvent: object.cartCount });
                            const pd = (yield ApiShop.getProduct({ limit: 50, page: 0, id: b.split('-')[0] })).response.data.content;
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
                        else {
                            ApiShop.getCart().then((res) => __awaiter(void 0, void 0, void 0, function* () {
                                for (const b of Object.keys(res)) {
                                    const pd = (yield ApiShop.getProduct({ limit: 50, page: 0, id: b.split('-')[0] })).response.data.content;
                                    const vard = pd.variants.find((d2) => {
                                        return `${pd.id}-${d2.spec.join('-')}` === b;
                                    });
                                    vard.id = pd.id;
                                    vard.count = res[b];
                                    vard.title = pd.title;
                                    cartData.line_items.push(vard);
                                    cartData.total += vard.count * vard.sale_price;
                                }
                                checkout();
                            }));
                        }
                    }));
                },
            };
        },
    };
});
