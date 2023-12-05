import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            object.block = object.block ?? ""
            return {
                editor: () => {

                    return [
                        EditorElem.editeInput({
                            gvc: gvc,
                            title: '區塊標簽',
                            placeHolder: `請輸入區塊標簽`,
                            default: object.block,
                            callback: (text) => {
                                object.block = text
                            }
                        })
                    ].join('')
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        for (const b of document.querySelectorAll(object.block)){
                            b.recreateView()
                        }
                        resolve(true)
                    })
                },
            };
        },
    };
});

