import {GVC} from "../GVController.js";
import {HtmlJson} from "../plugins/plugin-creater.js";
import {widgetComponent} from "./widget.js";

export const containerComponent = {
    render: (gvc: GVC, widget: HtmlJson, setting: HtmlJson[], hoverID: string[], subData:any) =>{
        widget.data.setting = widget.data.setting ?? []
        widget.data.styleEd = widget.data.styleEd ?? {}
        const glitter = (window as any).glitter
        return {
            view: () => {
                return widgetComponent.render(gvc, widget,setting,hoverID,subData,{
                    widgetComponentID:gvc.glitter.getUUID()
                }).view()
                // return htmlGenerate.render(gvc, {
                //     class: `${glitter.htmlGenerate.styleEditor(widget.data.styleEd).class()}`,
                //     style: glitter.htmlGenerate.styleEditor(widget.data.styleEd).style()
                // })
            },
            editor: (() => {
                return widgetComponent.render(gvc, widget,setting,hoverID,subData,{
                    widgetComponentID:gvc.glitter.getUUID()
                }).editor()
            })
        }
    }}