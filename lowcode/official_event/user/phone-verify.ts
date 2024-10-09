import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {ApiUser} from "../../glitter-base/route/user.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.phone_number = object.phone_number ?? {}
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.phone_number, {
                            hover: false,
                            option: [],
                            title: "取得電話號碼"
                        })
                    ].join('<div class="my-2"></div>')
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const phone_number = await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.phone_number, element: element
                        })
                        ApiUser.phoneVerify(phone_number as string).then(async (r) => {
                            resolve(true)
                        })
                    })
                }
            }
        }
    }
})