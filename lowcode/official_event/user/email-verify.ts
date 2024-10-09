import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {ApiUser} from "../../glitter-base/route/user.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.email = object.email ?? {}
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.email, {
                            hover: false,
                            option: [],
                            title: "取得信箱資料"
                        })
                    ].join('<div class="my-2"></div>')
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const email = await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.email, element: element
                        })
                        ApiUser.emailVerify(email as string).then(async (r) => {
                            resolve(true)
                        })
                    })
                }
            }
        }
    }
})