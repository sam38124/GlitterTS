import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData,element) => {
            object.prdID = object.prdID??{}
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.prdID, {
                            title: `商品ID來源`,
                            hover: false,
                            option: []
                        })
                    ].join('')
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const pdid = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.prdID,
                            subData:subData,
                            element:element
                        })
                        ApiShop.checkWishList(pdid as string).then(async (res) => {
                            resolve(res.result && res.response.result)
                        })
                    })
                },
            };
        },
    };
});

