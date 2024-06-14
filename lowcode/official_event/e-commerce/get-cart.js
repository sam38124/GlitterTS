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
import { GlobalUser } from "../../glitter-base/global/global-user.js";
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            var _a, _b;
            object.pd_from = (_a = object.pd_from) !== null && _a !== void 0 ? _a : 'local';
            object.pd_data = (_b = object.pd_data) !== null && _b !== void 0 ? _b : {};
            return {
                editor: () => {
                    return gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                let view = [
                                    EditorElem.select({
                                        title: '商品來源',
                                        gvc: gvc,
                                        def: object.pd_from,
                                        array: [
                                            { title: '本地購物車', value: "local" },
                                            { title: '自定義', value: "custom" }
                                        ],
                                        callback: (text) => {
                                            object.pd_from = text;
                                            gvc.notifyDataChange(id);
                                        }
                                    })
                                ];
                                if (object.pd_from === 'custom') {
                                    view.push(TriggerEvent.editer(gvc, widget, object.pd_data, { title: "設定商品來源", hover: false, option: [] }));
                                }
                                return view.join('');
                            },
                            divCreate: {}
                        };
                    });
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        (((object.pd_from === 'custom') ? (() => {
                            return TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.pd_data,
                                subData: subData
                            });
                        }) : ApiShop.getCart))().then((res) => __awaiter(void 0, void 0, void 0, function* () {
                            const cartData = {
                                line_items: [],
                                total: 0
                            };
                            for (const b of Object.keys(res)) {
                                cartData.line_items.push({
                                    id: b.split('-')[0],
                                    count: res[b],
                                    spec: b.split('-').filter((dd, index) => {
                                        return index !== 0;
                                    })
                                });
                            }
                            if (window.gtag) {
                                console.log(" cartData -- ", res);
                                let value = 0;
                                let count = 0;
                                function checkPass() {
                                    let emptyArray = [];
                                    let amount = 0;
                                    if (++count === cartData.line_items.length) {
                                        cartData.line_items.map((data) => {
                                            let temp = {};
                                            temp.item_id = data.sku;
                                            temp.item_name = data.title;
                                            temp.quantity = data.count;
                                            temp.price = data.sale_price;
                                            amount += temp.price * temp.quantity;
                                            emptyArray.push(temp);
                                        });
                                        window.gtag("event", "view_cart", {
                                            currency: "TWD",
                                            value: amount,
                                            items: emptyArray
                                        });
                                    }
                                }
                                cartData.line_items.map((product) => {
                                    value += product.sale_price;
                                    ApiShop.getProduct({ page: 0, limit: 50, id: product.id }).then((data) => {
                                        if (data.result && data.response.result) {
                                            let variants = data.response.data.content.variants;
                                            let target = {};
                                            const find = variants.find((dd) => {
                                                return dd.spec.join('') === product.spec.join('');
                                            });
                                            if (find) {
                                                product.title = data.response.data.content.title;
                                                product.sale_price = find.sale_price;
                                                product.sku = find.sku;
                                            }
                                            checkPass();
                                        }
                                        else {
                                            checkPass();
                                        }
                                    });
                                });
                            }
                            const voucher = yield ApiShop.getVoucherCode();
                            const rebate = (yield ApiShop.getRebateValue()) || 0;
                            ApiShop.getCheckout({
                                line_items: cartData.line_items.map((dd) => {
                                    return {
                                        id: dd.id,
                                        spec: dd.spec,
                                        count: dd.count
                                    };
                                }),
                                code: voucher,
                                use_rebate: GlobalUser.token && parseInt(rebate, 10)
                            }).then((res) => {
                                if (res.result) {
                                    resolve(res.response.data);
                                }
                                else {
                                    resolve([]);
                                }
                            });
                        }));
                    }));
                },
            };
        },
    };
});
