import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            object.formID = object.formID ?? ""
            return {
                editor: () => {
                    return [
                        EditorElem.editeInput({
                            gvc: gvc,
                            title: '表單ID',
                            default: object.formID,
                            placeHolder: `請輸入表單ID`,
                            callback: (text) => {
                                object.formID = text
                                widget.refreshComponent()
                            }
                        })
                    ].join('')
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        console.log((document.querySelector(`.formID-${object.formID}`) as any).formValue())
                        resolve((document.querySelector(`.formID-${object.formID}`) as any).formValue())
                    })
                },
            };
        },
    };
});

