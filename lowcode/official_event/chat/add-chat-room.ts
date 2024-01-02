import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {Chat} from "../../glitter-base/route/chat.js";

TriggerEvent.createSingleEvent(import.meta.url, (glitter) => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.type = object.type ?? {}
            object.participant = object.participant ?? {}
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.type, {
                            hover: false,
                            option: [],
                            title: "取得建立類型"
                        }),
                        TriggerEvent.editer(gvc, widget, object.participant, {
                            hover: false,
                            option: [],
                            title: "取得參加者"
                        })
                    ].join('<div class="my-2"></div>')
                },
                event: () => {
                    return new Promise<any>(async (resolve, reject) => {
                        const type = await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.type
                        })
                        const participant = await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.participant
                        })
                        await Chat.post({
                            type: type as any,
                            participant: participant as any
                        })
                        resolve(true)
                    })
                }
            }
        }
    }
})