import {GVC} from "../GVController.js";
import {HtmlJson} from "../plugins/plugin-creater.js";
import {TriggerEvent} from "../plugins/trigger-event.js";
import {EditorElem} from "../plugins/editor-elem.js";

export const codeComponent = {
    render: (gvc: GVC, widget: HtmlJson, setting: HtmlJson[], hoverID: string[], subData: any, htmlGenerate?: any) => {
        widget.data.triggerTime = widget.data.triggerTime ?? "first"
        widget.data.clickEvent = widget.data.clickEvent ?? {}
        return {
            view: () => {
                return new Promise((resolve, reject) => {
                    const a = TriggerEvent.trigger({
                        gvc: gvc, widget: widget, clickEvent: widget.data.clickEvent, subData: subData,
                    })

                    a.then((res) => {
                        resolve(res)
                    })
                })
            },
            editor: () => {
                return gvc.bindView(() => {
                    const id = gvc.glitter.getUUID()
                    return {
                        bind: id,
                        view: () => {
                            let array = [
                                TriggerEvent.editer(gvc, widget, widget.data.clickEvent, {
                                    hover: false,
                                    option: [],
                                    title: "代碼事件"
                                }),
                                EditorElem.editeInput({
                                    gvc: gvc,
                                    title: '事件名稱',
                                    default: `${widget.label}`,
                                    placeHolder: '請輸入事件名稱',
                                    callback: (text) => {
                                        widget.label=text
                                        gvc.notifyDataChange(id)
                                    },
                                    type: 'text'
                                }),
                                EditorElem.select({
                                    title: "觸發時機",
                                    gvc: gvc,
                                    def: widget.data.triggerTime,
                                    array: [
                                        {title: "渲染前", value: "first"},
                                        {title: "渲染後", value: "last"},
                                        {title: "異步執行", value: "async"},
                                        {title: "定時執行", value: "timer"}
                                    ],
                                    callback: (text) => {
                                        widget.data.triggerTime = text
                                        gvc.notifyDataChange(id)
                                    }
                                })
                            ]
                            if (widget.data.triggerTime === 'timer') {
                                widget.data.timer=widget.data.timer??1000
                                array.push(EditorElem.editeInput({
                                    gvc: gvc,
                                    title: '設定定時(毫秒)',
                                    default: `${widget.data.timer}`,
                                    placeHolder: '請輸入定時秒數',
                                    callback: (text) => {
                                        widget.data.timer=text
                                        gvc.notifyDataChange(id)
                                    },
                                    type: 'text'
                                }))
                            }
                            return array.join('')
                        }
                    }
                })

            }
        }
    }
}