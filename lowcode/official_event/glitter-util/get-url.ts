import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            object.key = object.key ?? ""

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
                        })
                    ].join('')
                },
                event: () => {

                    return new Promise(async (resolve, reject) => {
                        resolve( gvc.glitter.getUrlParameter(object.key))
                    })
                },
            };
        },
    };
});

