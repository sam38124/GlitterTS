import {GlobalUser} from "../../glitter-base/global/global-user.js";
import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {ApiUser} from "../../glitter-base/route/user.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            return {
                editor: () => {
                    return ``
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {

                        const data = (await ApiUser.getNoticeUnread()).response.count;
                        resolve(data)
                    })

                },
            };
        },
    };
});

