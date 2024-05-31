import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {GlobalEvent} from "../../glitterBundle/api/global-event.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {ApiUser} from "../../glitter-base/route/user.js";


TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.key = object.key ?? {}
            object.value = object.value ?? {}
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.key, {
                            hover: false,
                            option: [],
                            title: "Key"
                        }),
                        TriggerEvent.editer(gvc, widget, object.value, {
                            hover: false,
                            option: [],
                            title: "Value"
                        })
                    ].join(`<div class="my-2"></div>`)
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const key = await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.key, subData: subData
                        });
                        const value=await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.value, subData: subData
                        });
                        ApiUser.setPublicConfig({
                            key:key as string,
                            user_id:'manager',
                            value:value
                        }).then((dd) => {
                            resolve(dd.response.value || {})
                        });
                    })
                },
            };
        },
    };
});

