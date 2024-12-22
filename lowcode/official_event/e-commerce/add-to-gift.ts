import { TriggerEvent } from '../../glitterBundle/plugins/trigger-event.js';
import { EditorElem } from '../../glitterBundle/plugins/editor-elem.js';
import {ApiCart} from "../../glitter-base/route/api-cart.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.count = object.count ?? {};
            object.pdid = object.pdid ?? {};
            object.voucher_id = object.voucher_id ?? {};
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
                    return new Promise(async (resolve, reject) => {
                        const apiCart=new ApiCart()
                        const voucher_id :string = (await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.voucher_id,
                            subData: subData,
                            element: element,
                        })) as any;
                        const pdid :string = (await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.pdid,
                            subData: subData,
                            element: element,
                        })) as any;
                        const count = (await TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.count,
                                subData: subData,
                                element: element,
                            })) || 1;
                        apiCart.setCart(cartItem => {
                            cartItem.give_away= cartItem.give_away.filter((dd)=>{
                                return dd.voucher_id !== voucher_id
                            })
                        })
                        apiCart.addToGift(voucher_id,pdid.split('-')[0],pdid.split('-').filter((dd,index)=>{
                            return index>0 && dd
                        }),count )
                        resolve(pdid);
                    });
                },
            };
        },
    };
});
