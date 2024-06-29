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
            object.form_id_from=object.form_id_from ?? 'static'
            object.getFormID=object.getFormID ?? {}
            return {
                editor: () => {
                    return gvc.bindView(()=>{
                        const id=gvc.glitter.getUUID()
                        return {
                            bind:id,
                            view:()=>{
                                return [
                                    EditorElem.select({
                                        title: '表單ID來源',
                                        gvc: gvc,
                                        array: [
                                            {title: '靜態', value: 'static'},
                                            {title: '動態', value: 'code'}
                                        ],
                                        def: object.form_id_from,
                                        callback: (text) => {
                                            object.form_id_from = text
                                            gvc.notifyDataChange(id)
                                        }
                                    }),
                                    (()=>{
                                        if(object.form_id_from==='code'){
                                            return  TriggerEvent.editer(gvc, widget, object.getFormID, {
                                                hover: false,
                                                option: [],
                                                title: "設定表單ID來源"
                                            })
                                        }else{
                                            return EditorElem.editeInput({
                                                gvc: gvc,
                                                title: '表單ID',
                                                placeHolder: `請輸入表單ID`,
                                                default: object.formID,
                                                callback: (text) => {
                                                    object.formID = text
                                                    widget.refreshComponent()
                                                }
                                            })
                                        }
                                    })(),
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
                            }
                        }
                    })
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        let formID:any='';
                        if(object.form_id_from==='code'){
                            formID=await TriggerEvent.trigger({
                                gvc: gvc, widget: widget, clickEvent: object.getFormID, subData: subData
                            })
                        }else{
                            formID=object.formID
                        }
                        const result = (document.querySelector(`.formID-${formID}`) as any).checkEditFinish()
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

