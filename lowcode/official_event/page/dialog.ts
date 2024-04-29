import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {GlobalData} from "../event.js";
import {GVC} from "../../glitterBundle/GVController.js";
import {component} from "../../official_view_component/official/component.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {EditorConfig} from "../../editor-config.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.coverData = object.coverData ?? {}
            object.dialogTag = object.dialogTag ?? {}
            object.waitType = object.waitType ?? 'block'
            object.tag_from=object.tag_from??"static"
            return {
                editor: () => {
                    const id = gvc.glitter.getUUID()
                    const glitter = gvc.glitter

                    function recursive() {
                        if (GlobalData.data.pageList.length === 0) {
                            GlobalData.data.run();
                            setTimeout(() => {
                                recursive();
                            }, 200);
                        } else {
                            gvc.notifyDataChange(id);
                        }
                    }

                    recursive();

                    return gvc.bindView(() => {
                        return {
                            bind: id,
                            view: () => {
                                object.select_page_type=object.select_page_type||'page'

                                return [
                                    EditorElem.select({
                                        title: '標籤來源',
                                        gvc: gvc,
                                        def: object.tag_from,
                                        array: [{title:'靜態',value:'static'},{title:'程式碼',value:'code'}],
                                        callback: (text) => {
                                            object.tag_from=text
                                            gvc.notifyDataChange(id)
                                        }
                                    }),
                                    (()=>{
                                        if(object.tag_from==='static'){
                                            return [EditorElem.select({
                                                title: '嵌入類型',
                                                gvc: gvc,
                                                def: '',
                                                array: EditorConfig.page_type_list,
                                                callback: (text) => {
                                                    object.select_page_type=text
                                                    gvc.notifyDataChange(id)
                                                }
                                            }),EditorElem.pageSelect(gvc, '', object.link, (tag) => {
                                                object.link = tag
                                            }, (data) => {
                                                return data.page_type===object.select_page_type
                                            }), TriggerEvent.editer(gvc, widget, object.coverData, {
                                                hover: true,
                                                option: [],
                                                title: "夾帶資料"
                                            })].join(`<div class="my-2"></div>`)
                                        }else{
                                            object.get_page_tag=object.get_page_tag??{}
                                            return  TriggerEvent.editer(gvc, widget, object.get_page_tag, {
                                                hover: true,
                                                option: [],
                                                title: "取得頁面標籤連結"
                                            })
                                        }
                                    })(),
                                    TriggerEvent.editer(gvc, widget, object.dialogTag, {
                                        hover: true,
                                        option: [],
                                        title: "視窗標籤"
                                    }),
                                    EditorElem.select({
                                        title: "是否阻塞事件，直到視窗關閉?",
                                        gvc: gvc,
                                        def: object.waitType,
                                        array: [
                                            {
                                                title: '是',
                                                value: 'block'
                                            },
                                            {
                                                title: '否',
                                                value: 'async'
                                            }
                                        ],
                                        callback: (text) => {
                                            object.waitType = text
                                            gvc.notifyDataChange(id)
                                        }
                                    })
                                ].join('<div class="my-2"></div>')
                            },
                            divCreate: {}
                        }
                    })
                },
                event: () => {

                    subData = subData ?? {}

                    return new Promise(async (resolve, reject) => {
                        let link=(object.tag_from==='code') ? (await TriggerEvent.trigger({
                            gvc, widget, clickEvent: object.get_page_tag, subData
                        })) : object.link;
                        const data = await TriggerEvent.trigger({
                            gvc, widget, clickEvent: object.coverData, subData
                        })
                        const tag = (await TriggerEvent.trigger({
                            gvc, widget, clickEvent: object.dialogTag, subData
                        })) || gvc.glitter.getUUID()

                        gvc.glitter.innerDialog((gvc: GVC) => {
                            gvc.getBundle().carryData = data
                            return new Promise<string>(async (resolve, reject) => {
                                const view = component.render(gvc, ({
                                    data: {
                                        tag: link
                                    }
                                } as any), ([] as any), [], subData).view()

                                resolve(view)
                            })

                        }, tag as string, {
                            dismiss: () => {
                                resolve(true)
                            }
                        })
                        if (object.waitType !== 'block') {
                            resolve(true)
                        }
                    })


                }
            }
        }
    }
})