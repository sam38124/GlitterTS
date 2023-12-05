import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";
import {ApiUser} from "../../glitter-base/route/user.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData,element) => {
            object.language = object.language ?? {}
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.language, {
                            hover: false,
                            option: [],
                            title: "取得語言代號"
                        })
                    ].join('')
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        let language = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.language,
                            subData: subData,
                            element: element
                        })
                        GlobalUser.language=language
                        resolve(language)
                    })
                },
            };
        },
    };
});

