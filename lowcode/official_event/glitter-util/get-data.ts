import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {GlobalEvent} from "../../glitterBundle/api/global-event.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";


TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.storeTag = object.storeTag ?? {}
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.storeTag, {
                            hover: false,
                            option: [],
                            title: "取得儲存標籤"
                        })
                    ].join(`<div class="my-2"></div>`)
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {

                        const storeTag = (await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.storeTag, subData: subData, element: element
                        })) as string
                        gvc.glitter.getPro(storeTag, (response) => {
                            resolve(response.data)
                        })
                    })
                },
            };
        },
    };
});

