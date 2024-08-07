import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.count = object.count ?? {}
            object.pdid = object.pdid ?? {}

            return {
                editor: () => {
                    return EditorElem.container([TriggerEvent.editer(gvc, widget, object.pdid, {
                        title: `商品ID來源[ProductId-VIndex]`,
                        hover: false,
                        option: []
                    }),
                        TriggerEvent.editer(gvc, widget, object.count, {
                            title: `商品更新數量`,
                            hover: false,
                            option: []
                        })])
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const pdid = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.pdid,
                            subData:subData,
                            element:element
                        })
                        const count = (await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.count,
                            subData:subData,
                            element:element
                        })) ?? 1
                        ApiShop.setToCart(pdid as string, count as string)
                        resolve(pdid)
                    })
                },
            };
        },
    };
});

