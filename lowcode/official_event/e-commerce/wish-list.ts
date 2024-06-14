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
                        let pdInf = subData.content
                        console.log(" subData -- " , subData);
                        if((window as any).gtag){
                            ;(window as any).gtag("event", "add_to_wishlist", {
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
                        const id:any=await TriggerEvent.trigger({
                            gvc:gvc,
                            widget:widget,
                            clickEvent:object.pdid,
                            subData:subData
                        })
                        ApiShop.postWishList(id).then(async (res) => {
                            resolve(res.result)
                        })
                    })
                },
            };
        },
    };
});

