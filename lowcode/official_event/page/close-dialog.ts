import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.closeFrom = object.closeFrom ?? 'now'
            object.tag = object.tag ?? {}
            return {
                editor: () => {
                    return gvc.bindView(() => {
                        const id = gvc.glitter.getUUID()
                        return {
                            bind: id,
                            view: () => {
                                let array = [
                                    EditorElem.select({
                                        title: "欲關閉的彈跳視窗",
                                        gvc: gvc,
                                        def: object.closeFrom,
                                        array: [
                                            {
                                                title: '當下視窗',
                                                value: 'now'
                                            },
                                            {
                                                title: '特定標籤',
                                                value: 'tag'
                                            }
                                        ],
                                        callback: (text) => {
                                            object.closeFrom = text
                                            gvc.notifyDataChange(id)
                                        }
                                    })
                                ]
                                if (object.closeFrom === 'tag') {
                                    array.push(TriggerEvent.editer(gvc, widget, object.tag, {
                                        hover: true,
                                        option: [],
                                        title: "取得標籤"
                                    }))
                                }
                                return array.join(`<div class="my-2"></div>`)
                            }
                        }
                    })

                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        if (object.closeFrom === 'now') {
                            gvc.closeDialog()
                        } else {
                            const tag = (await TriggerEvent.trigger({
                                gvc, widget, clickEvent: object.tag, subData
                            }))
                            gvc.glitter.closeDiaLog(tag as string)
                        }
                        resolve(true)
                    })
                }
            }
        }
    }
})