import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {Chat} from "../../glitter-base/route/chat.js";

TriggerEvent.createSingleEvent(import.meta.url, (glitter) => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.message = object.message ?? {}
            object.attachment = object.attachment ?? {}
            object.chatID = object.chatID ?? {}
            object.userID = object.userID ?? {}
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.userID, {
                            hover: false,
                            option: [],
                            title: "取得USER ID"
                        }),
                        TriggerEvent.editer(gvc, widget, object.chatID, {
                            hover: false,
                            option: [],
                            title: "取得聊天室ID"
                        }),
                        TriggerEvent.editer(gvc, widget, object.message, {
                            hover: false,
                            option: [],
                            title: "取得文字內容"
                        }),
                        TriggerEvent.editer(gvc, widget, object.attachment, {
                            hover: false,
                            option: [],
                            title: "取得附件"
                        })
                    ].join('<div class="my-2"></div>')
                },
                event: () => {
                    return new Promise<any>(async (resolve, reject) => {
                        const chatID = await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.chatID
                        })
                        const message = await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.message
                        })
                        const attachment = await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.attachment
                        })
                        const userID = await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.userID
                        })

                        await Chat.postMessage({
                            chat_id: chatID as string,
                            user_id:userID as string,
                            message:{
                                text:message as string,
                                attachment:attachment as string
                            }
                        })
                        resolve(true)
                    })
                }
            }
        }
    }
})