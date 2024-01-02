import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            object.value=object.value??""
            return {
                editor: () => {
                    return EditorElem.editeText({
                        gvc: gvc,
                        title: ``,
                        default: object.value,
                        placeHolder: '請輸入參數內容',
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

