import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {GlobalEvent} from "../../glitterBundle/api/global-event.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";


TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.event = object.event ?? {}
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.event, {
                            hover: false,
                            option: [],
                            title: "事件來源"
                        })
                    ].join(`<div class="my-2"></div>`)
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const event = await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.event, subData: subData, element: element
                        })
                        TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: event, subData: subData, element: element
                        }).then((res)=>{
                            resolve(res)
                        })
                    })
                },
            };
        },
    };
});

