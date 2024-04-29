import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {ApiUser} from "../../glitter-base/route/user.js";
import {Chat} from "../../glitter-base/route/chat.js";
import {GVC} from "../../glitterBundle/GVController.js";
import {HtmlJson} from "../../glitterBundle/plugins/plugin-creater.js";

TriggerEvent.createSingleEvent(import.meta.url, (glitter) => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.who=object.who??{}
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.who, {
                            hover: false,
                            option: [],
                            title: "取得USER_ID"
                        })
                    ].join('')
                },
                event: () => {
                    return new Promise<any>(async (resolve, reject) => {
                        const user_id=await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.who, subData:subData, element:element
                        })
                        Chat.getChatRoom({
                            page: 0,
                            limit: 1000,
                            user_id: user_id as any
                        }).then(async (data) => {
                           const chatData = (data.response.data)
                            Chat.getUnRead({user_id: user_id as any}).then((data) => {
                                const unRead = data.response
                                resolve({
                                    chatData:chatData,
                                    unRead:unRead
                                })
                            })
                        })
                    })
                }
            }
        }
    }
})