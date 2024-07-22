import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            return {
                editor: () => {
                    return ``
                },
                event: () => {

                    return new Promise(async (resolve, reject) => {
                        resolve((await ApiShop.getOrderPaymentMethod()).response)
                    })
                },
            };
        },
    };
});

