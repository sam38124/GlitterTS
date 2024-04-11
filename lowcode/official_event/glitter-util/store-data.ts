import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {GlobalEvent} from "../../glitterBundle/api/global-event.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";


TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.storeData = object.storeData ?? {}
            object.storeTag = object.storeTag ?? {}
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.storeTag, {
                            hover: false,
                            option: [],
                            title: "取得儲存標籤"
                        }),
                        TriggerEvent.editer(gvc, widget, object.storeData, {
                            hover: false,
                            option: [],
                            title: "取得儲存資料"
                        })
                    ].join(`<div class="my-2"></div>`)
                },
                event: () => {

                    return new Promise(async (resolve, reject) => {
                        const storeTag = (await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.storeTag, subData: subData, element: element
                        })) as string

                        const storeData = (await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.storeData, subData: subData, element: element
                        })) as string

                        gvc.glitter.setPro(storeTag, storeData, () => {
                            resolve(true)
                        })
                    })
                },
            };
        },
    };
});

