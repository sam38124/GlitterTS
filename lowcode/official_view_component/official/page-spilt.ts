import {HtmlJson, Plugin} from "../../glitterBundle/plugins/plugin-creater.js";
import {Glitter} from "../../glitterBundle/Glitter.js";
import {GVC} from "../../glitterBundle/GVController.js";
import {PageSplit} from "../../backend-manager/splitPage.js";

Plugin.createComponent(import.meta.url, (glitter: Glitter, editMode: boolean) => {
    return {
        defaultData:{},
        render:(gvc: GVC, widget: HtmlJson, setting: HtmlJson[], hoverID: string[])=>{
            return {
                view:()=>{
                    const pageSpilt=new PageSplit(gvc)
                    return pageSpilt.pageSplit(10,1,(p)=>{

                    })
                },
                editor:()=>{
                    return ``
                }
            }
        }
    }
})