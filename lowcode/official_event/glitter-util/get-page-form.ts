import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            object.key = object.key ?? ""
            object.type=object.type ?? 'tag'
            return {
                editor: () => {

                    return gvc.bindView(()=>{
                        const id=gvc.glitter.getUUID()
                        return {
                            bind:id,
                            view:()=>{
                                return [
                                    EditorElem.select({
                                        title:'取得項目',
                                        gvc:gvc,
                                        def:object.type ?? 'tag',
                                        array:[
                                            {
                                                title:'全部',value:'all',
                                            },
                                            {
                                                title:'依照標籤',value:'tag',
                                            }
                                        ],
                                        callback:(text)=>{
                                            object.type=text
                                            gvc.notifyDataChange(id)
                                        }
                                    }),
                                    (object.type==='tag') ?
                                    EditorElem.editeInput({
                                        gvc: gvc,
                                        title: 'Key值',
                                        placeHolder: `請輸入Key值`,
                                        default: object.key,
                                        callback: (text) => {
                                            object.key = text
                                        }
                                    }):``
                                ].join('<div class="my-2"></div>')
                            }
                        }
                    })
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {

                        if(!widget.formData){
                            resolve(false)
                        }else{
                            if(object.type==='all'){
                                resolve(widget.formData)
                            }else{
                                resolve(widget.formData[object.key])
                            }

                        }
                    })
                },
            };
        },
    };
});

