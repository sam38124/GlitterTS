import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {GlobalEvent} from "../../glitterBundle/api/global-event.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {ApiUser} from "../../glitter-base/route/user.js";


TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.key = object.key ?? {}
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.key, {
                            hover: false,
                            option: [],
                            title: "Key"
                        })
                    ].join(`<div class="my-2"></div>`)
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const key = await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.key, subData: subData
                        });
                        (ApiUser.getPublicConfig(key as string, 'manager')).then((dd) => {
                            resolve(dd.response.value || {})
                        });
                    })
                },
            };
        },
    };
});

