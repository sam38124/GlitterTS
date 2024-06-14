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
            var _a;
            object.pdid = (_a = object.pdid) !== null && _a !== void 0 ? _a : {};
            return {
                editor: () => {
                    return EditorElem.container([TriggerEvent.editer(gvc, widget, object.pdid, {
                            title: `商品ID來源`,
                            hover: false,
                            option: []
                        })]);
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        let pdInf = subData.content;
                        console.log(" subData -- ", subData);
                        if (window.gtag) {
                            ;
                            window.gtag("event", "add_to_wishlist", {
                                currency: "TWD",
                                value: pdInf.variants[0].sale_price,
                                items: [
                                    {
                                        item_id: pdInf.variants[0].sale_price,
                                        item_name: pdInf.title,
                                    }
                                ],
                            });
                        }
                        const id = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.pdid,
                            subData: subData
                        });
                        ApiShop.postWishList(id).then((res) => __awaiter(void 0, void 0, void 0, function* () {
                            resolve(res.result);
                        }));
                    }));
                },
            };
        },
    };
});
