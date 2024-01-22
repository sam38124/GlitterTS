import {HtmlJson, Plugin} from "../../glitterBundle/plugins/plugin-creater.js";
import {Glitter} from "../../glitterBundle/Glitter.js";
import {GVC} from "../../glitterBundle/GVController.js";

export const article = Plugin.createComponent(import.meta.url, (glitter: Glitter, editMode: boolean) => {
    return {
        render:(gvc: GVC, widget: HtmlJson, setting: HtmlJson[], hoverID: string[], subData)=>{
            return {
                view:()=>{
                    return ``
                },
                editor:()=>{
                    return ``
                }
            }
        }
    }
})