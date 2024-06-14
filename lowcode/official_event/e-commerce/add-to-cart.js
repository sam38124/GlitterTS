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
        fun: (gvc, widget, object, subData, element) => {
            var _a, _b;
            object.count = (_a = object.count) !== null && _a !== void 0 ? _a : {};
            object.pdid = (_b = object.pdid) !== null && _b !== void 0 ? _b : {};
            return {
                editor: () => {
                    return EditorElem.container([TriggerEvent.editer(gvc, widget, object.pdid, {
                            title: `商品ID來源[ProductId-VIndex]`,
                            hover: false,
                            option: []
                        }),
                        TriggerEvent.editer(gvc, widget, object.count, {
                            title: `商品加入數量`,
                            hover: false,
                            option: []
                        })]);
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const pdid = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.pdid,
                            subData: subData,
                            element: element
                        });
                        const count = (yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.count,
                            subData: subData,
                            element: element
                        })) || 1;
                        if (window.gtag) {
                            let itemID = pdid.split("-");
                            let data = yield ApiShop.getProduct({ page: 0, limit: 50, id: itemID[0] }).then((data) => {
                                var _a, _b;
                                if (data.result && data.response.result) {
                                    let variants = data.response.data.content.variants;
                                    let product = data.response.data.content;
                                    let target = {};
                                    function arraysEqualSet(arr1, arr2) {
                                        arr2 = arr2.slice(1);
                                        if (arr1.length !== arr2.length)
                                            return false;
                                        let set1 = new Set(arr1);
                                        let set2 = new Set(arr2);
                                        if (set1.size !== set2.size)
                                            return false;
                                        return [...set1].every(value => set2.has(value));
                                    }
                                    variants.map((data) => {
                                        if (arraysEqualSet(data.spec, itemID)) {
                                            target = data;
                                        }
                                    });
                                    window.gtag("event", "add_to_cart", {
                                        currency: "TWD",
                                        value: count * target.sale_price,
                                        items: [
                                            {
                                                item_id: (_a = target === null || target === void 0 ? void 0 : target.sku) !== null && _a !== void 0 ? _a : "",
                                                item_name: (_b = product === null || product === void 0 ? void 0 : product.title) !== null && _b !== void 0 ? _b : "unknown name",
                                                price: target === null || target === void 0 ? void 0 : target.sale_price,
                                                quantity: count,
                                                item_variant: itemID.slice(1),
                                            }
                                        ]
                                    });
                                }
                            });
                        }
                        ApiShop.addToCart(pdid, count);
                        ApiShop.getCart().then((resolve) => { });
                        resolve(pdid);
                    }));
                },
            };
        },
    };
});
