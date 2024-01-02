import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            object.pdid = object.pdid ?? {}
            return {
                editor: () => {
                    return EditorElem.container([TriggerEvent.editer(gvc, widget, object.pdid, {
                        title: `商品ID來源`,
                        hover: false,
                        option: []
                    })])
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const id:any=await TriggerEvent.trigger({
                            gvc:gvc,
                            widget:widget,
                            clickEvent:object.pdid,
                            subData:subData
                        })
                        ApiShop.deleteWishList(id).then(async (res) => {
                            resolve(res.result)
                        })
                    })
                },
            };
        },
    };
});

