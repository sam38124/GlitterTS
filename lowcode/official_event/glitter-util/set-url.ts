import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            object.key = object.key ?? ""
            object.value = object.value ?? ""
            return {
                editor: () => {

                    return [
                        EditorElem.editeInput({
                            gvc: gvc,
                            title: 'Key值',
                            placeHolder: `請輸入Key值`,
                            default: object.key,
                            callback: (text) => {
                                object.key = text
                            }
                        }),
                        EditorElem.editeInput({
                            gvc: gvc,
                            title: '參數',
                            placeHolder: `請輸入VALUE`,
                            default: object.value,
                            callback: (text) => {
                                object.value = text
                            }
                        })
                    ].join('')
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        gvc.glitter.setUrlParameter(object.key, object.value)
                        resolve(true)
                    })
                },
            };
        },
    };
});

