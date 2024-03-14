import {Plugin} from "../../glitterBundle/plugins/plugin-creater.js";
import {ApiPageConfig} from "../../api/pageConfig.js";
import {GVC} from "../../glitterBundle/GVController.js";
import {Glitter} from "../../glitterBundle/Glitter.js";

Plugin.createViewComponent(import.meta.url, (glitter, editMode) => {
    return {
        defaultData: {},
        render: (cf) => {
            return {
                view: () => {
                   return cf.gvc.bindView(()=>{
                       const id=cf.gvc.glitter.getUUID()

                       return {
                           bind:id,
                           view:()=>{
                               return ``
                           },
                           divCreate:{
                               elem:'web-component',option:[
                                   {
                                       key:'id',value:id
                                   }
                               ]
                           },
                           onCreate:()=>{
                               cf.gvc.addStyle(`<h3 style="color:red"></h3>`);
                               (document.querySelector('#'+id)! as any).test='12345';
                               (document.querySelector('#'+id)! as any).setView(cf.gvc,cf.gvc.bindView(()=>{
                                   const id=cf.gvc.glitter.getUUID()
                                   return {
                                       bind:id,
                                       view:()=>{
                                           return `<h3>Hello Web Component</h3>`
                                       }
                                   }
                               }))
                           }
                       }
                   })
                },
                editor: () => {
                    return ``
                },
                user_editor:()=>{
                    return `rmldma`
                }
            }
        }
    }
})