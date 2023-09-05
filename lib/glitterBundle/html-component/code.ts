import {GVC} from "../GVController.js";
import {HtmlJson} from "../plugins/plugin-creater.js";
import {TriggerEvent} from "../plugins/trigger-event.js";
import {Editor} from "./editor.js";

export const codeComponent = {
    render: (gvc: GVC, widget: HtmlJson, setting: HtmlJson[], hoverID: string[], subData: any, htmlGenerate?: any) => {
        widget.data.triggerTime = widget.data.triggerTime ?? "first"
        widget.data.clickEvent=widget.data.clickEvent??{}
        return {
            view: () => {
                return new Promise((resolve, reject) => {
                    console.log(`trigger:${JSON.stringify(widget.data.clickEvent)}`)
                    const a = TriggerEvent.trigger({
                        gvc: gvc, widget: widget, clickEvent: widget.data.clickEvent, subData: subData,
                    })

                    a.then((res) => {
                        resolve(res)
                    })
                })
            },
            editor: () => {
                return [
                    TriggerEvent.editer(gvc, widget, widget.data.clickEvent, {
                        hover: false,
                        option: [],
                        title: "代碼事件"
                    }),
                    Editor.select({
                        title: "觸發時機",
                        gvc: gvc,
                        def: widget.data.triggerTime,
                        array: [
                            {title: "渲染前", value: "first"},
                            {title: "渲染後", value: "last"}
                        ],
                        callback: (text) => {
                            widget.data.triggerTime = text
                        }
                    })
                ].join('')
            }
        }
    }
}