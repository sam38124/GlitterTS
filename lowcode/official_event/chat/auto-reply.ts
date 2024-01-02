import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {Chat} from "../../glitter-base/route/chat.js";
import {PublicConfig} from "../../glitter-base/route/public-config.js";
import {ApiUser} from "../../glitter-base/route/user.js";

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
                        const who = await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.who
                        })
                        resolve(((await ApiUser.getPublicConfig('robot_auto_reply',who as string)).response.value.question) ?? [])
                    })
                }
            }
        }
    }
})