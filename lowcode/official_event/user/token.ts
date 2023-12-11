
import {GlobalUser} from "../../glitter-base/global/global-user.js";
import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            return {
                editor: () => {
                    return ``
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        resolve(GlobalUser.token)
                    })

                },
            };
        },
    };
});

