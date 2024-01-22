import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            object.value=object.value??""
            return {
                editor: () => {
                    return EditorElem.uploadFile({
                        gvc: gvc,
                        title: ``,
                        def: object.value,
                        callback: (text) => {
                            object.value=text
                        }
                    })
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        resolve(object.value)
                    })
                },
            };
        },
    };
});

