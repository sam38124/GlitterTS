import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData,element) => {
            object.key = object.key ?? ""
            object.value = object.value ?? ""
            object.valueFrom = object.valueFrom ?? "manual"
            object.valueData=object.valueData ?? {}
            return {
                editor: () => {
                    return gvc.bindView(()=>{
                        const id=gvc.glitter.getUUID()
                        return {
                            bind:id,
                            view:()=>{
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
                                    EditorElem.select({
                                        title:'參數來源',
                                        gvc:gvc,
                                        def:object.valueFrom,
                                        array:[
                                            {title:'定義值',value:"manual"},
                                            {title:'程式碼',value:"code"}
                                        ],
                                        callback:(text)=>{
                                            object.valueFrom=text
                                           gvc.notifyDataChange(id)
                                        }
                                    }),
                                    ... (()=>{
                                        if(object.valueFrom==='manual'){
                                            return [
                                                EditorElem.editeInput({
                                                    gvc: gvc,
                                                    title: '參數',
                                                    placeHolder: `請輸入VALUE`,
                                                    default: object.value,
                                                    callback: (text) => {
                                                        object.value = text
                                                    }
                                                })
                                            ]
                                        }else{

                                            return [
                                                TriggerEvent.editer(gvc, widget, object.valueData, {
                                                    hover: false,
                                                    option: [],
                                                    title: "取得參數內容"
                                                })
                                            ]
                                        }
                                    })()
                                ].join(`<div class="my-1"></div>`)
                            }
                        }
                    })

                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        if(object.valueFrom==='manual'){

                            gvc.glitter.setUrlParameter(object.key, object.value)
                            resolve(true)
                        }else{
                            const formData : any = (await TriggerEvent.trigger({
                                gvc: gvc, widget: widget, clickEvent: object.valueData, subData: subData,element:element
                            }))
                            gvc.glitter.setUrlParameter(object.key, formData || undefined)
                            resolve(true)
                        }
                    })
                },
            };
        },
    };
});

