import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {ApiUser} from "../../glitter-base/route/user.js";

TriggerEvent.createSingleEvent(import.meta.url, (glitter) => {
    return {
        fun:  (gvc, widget, object, subData, element) => {
            return {
                editor: () => {
                    return ``;
                },
                event: () => {
                    return new Promise<any>(async (resolve, reject) => {
                        try {
                            gvc.glitter.runJsInterFace('deleteFireBaseToken', {}, (response) => {
                                resolve(true);
                            });
                        } catch (e) {
                            resolve(object.errorCode ?? false);
                        }
                    });
                },
            };
        }
    }
})