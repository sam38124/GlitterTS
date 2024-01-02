import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            object.event = object.event ?? {}
            object.delay = object.delay ?? "1000"
            return {
                editor: () => {
                    return [
                        EditorElem.editeInput({
                            gvc: gvc,
                            title: '延遲秒數',
                            default: object.delay,
                            placeHolder: `請輸入欲延遲秒數`,
                            callback: (text) => {
                                object.delay = text
                                widget.refreshComponent()
                            },
                            type:'number'
                        }),
                        TriggerEvent.editer(gvc, widget, object.event, {
                            hover: false,
                            option: [],
                            title: "執行事件"
                        })
                    ].join('<div class="my-2"></div>')
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                       setTimeout(async ()=>{
                           resolve( await TriggerEvent.trigger({
                               gvc: gvc, widget: widget, clickEvent: object.event, subData: subData
                           }))
                       },parseInt(object.delay,10))
                    })
                },
            };
        },
    };
});

