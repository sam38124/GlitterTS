import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            object.formID = object.formID ?? ""
            object.finish = object.finish ?? {}
            object.notFinish = object.notFinish ?? {}
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
                        }),
                        TriggerEvent.editer(gvc, widget, object.finish, {
                            hover: false,
                            option: [],
                            title: "已填寫完畢事件"
                        }),
                        TriggerEvent.editer(gvc, widget, object.notFinish, {
                            hover: false,
                            option: [],
                            title: "未填寫完畢事件"
                        })
                    ].join('<div class="my-2"></div>')
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const result = (document.querySelector(`.formID-${object.formID}`) as any).checkEditFinish()
                        if (result) {
                            await TriggerEvent.trigger({
                                gvc: gvc, widget: widget, clickEvent: object.finish, subData: subData
                            })
                        } else {
                            await TriggerEvent.trigger({
                                gvc: gvc, widget: widget, clickEvent: object.notFinish, subData: subData
                            })
                        }
                        resolve(result)
                    })
                },
            };
        },
    };
});

