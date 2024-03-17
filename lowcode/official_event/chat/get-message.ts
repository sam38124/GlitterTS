import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {Chat} from "../../glitter-base/route/chat.js";

TriggerEvent.createSingleEvent(import.meta.url, (glitter) => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.chatID = object.chatID ?? {}
            object.page = object.page ?? {}
            object.limit = object.limit ?? {}
            object.latestID=object.latestID ?? {}
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.chatID, {
                            hover: false,
                            option: [],
                            title: "取得聊天室ID"
                        }),
                        TriggerEvent.editer(gvc, widget, object.page, {
                            hover: false,
                            option: [],
                            title: "取得當下頁面"
                        }),
                        TriggerEvent.editer(gvc, widget, object.limit, {
                            hover: false,
                            option: [],
                            title: "取得每頁比數"
                        }),
                        TriggerEvent.editer(gvc, widget, object.latestID, {
                            hover: false,
                            option: [],
                            title: "最新訊息[返回最後一筆資料ID]"
                        })
                    ].join('<div class="my-2"></div>')
                },
                event: () => {
                    return new Promise<any>(async (resolve, reject) => {
                        const chatID = await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.chatID
                        })
                        const page = await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.page
                        })
                        const limit = await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.limit
                        })
                        const latestID = await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.latestID
                        })

                        resolve((await Chat.getMessage({
                            limit:limit as any,
                            page:page as any,
                            chat_id:chatID as string,
                            latestID:latestID as string
                        })).response)
                    })
                }
            }
        }
    }
})