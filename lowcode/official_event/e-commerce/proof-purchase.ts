import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            object.order_id = object.order_id ?? {}
            object.text = object.text ?? {}
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.order_id, {
                            hover: false,
                            option: [],
                            title: '訂單ID'
                        }),
                        TriggerEvent.editer(gvc, widget, object.text, {
                            hover: false,
                            option: [],
                            title: '付款證明'
                        })
                    ].join(`<div class="my-2"></div>`)
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const order_id = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.order_id
                        })
                        const text = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.text
                        });
                        (await ApiShop.proofPurchase(order_id as string,text as string));
                        resolve(true)
                    })
                },
            };
        },
    };
});

