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
import { EditorElem } from '../../glitterBundle/plugins/editor-elem.js';
import { ApiCart } from "../../glitter-base/route/api-cart.js";
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            var _a, _b, _c;
            object.count = (_a = object.count) !== null && _a !== void 0 ? _a : {};
            object.pdid = (_b = object.pdid) !== null && _b !== void 0 ? _b : {};
            object.voucher_id = (_c = object.voucher_id) !== null && _c !== void 0 ? _c : {};
            return {
                editor: () => {
                    return EditorElem.container([
                        TriggerEvent.editer(gvc, widget, object.voucher_id, {
                            title: `優惠券ID`,
                            hover: false,
                            option: [],
                        }),
                        TriggerEvent.editer(gvc, widget, object.pdid, {
                            title: `贈品ID來源[ProductId-VIndex]`,
                            hover: false,
                            option: [],
                        }),
                        TriggerEvent.editer(gvc, widget, object.count, {
                            title: `商品加入數量`,
                            hover: false,
                            option: [],
                        }),
                    ]);
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const voucher_id = (yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.voucher_id,
                            subData: subData,
                            element: element,
                        }));
                        const pdid = (yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.pdid,
                            subData: subData,
                            element: element,
                        }));
                        const count = (yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.count,
                            subData: subData,
                            element: element,
                        })) || 1;
                        ApiCart.setCart(cartItem => {
                            cartItem.give_away = cartItem.give_away.filter((dd) => {
                                return dd.voucher_id !== voucher_id;
                            });
                        });
                        ApiCart.addToGift(voucher_id, pdid.split('-')[0], pdid.split('-').filter((dd, index) => {
                            return index > 0 && dd;
                        }), count);
                        resolve(pdid);
                    }));
                },
            };
        },
    };
});
