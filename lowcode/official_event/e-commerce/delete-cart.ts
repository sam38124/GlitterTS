import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            return {
                editor: () => {
                    return ``
                },
                event: () => {

                    return new Promise(async (resolve, reject) => {

                        ApiShop.clearCart()

                        resolve(true)
                    })
                },
            };
        },
    };
});

