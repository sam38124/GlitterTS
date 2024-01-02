import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";

TriggerEvent.createSingleEvent(import.meta.url,()=>{
    return {
        fun:(gvc, widget, obj, subData, element)=>{
            return {
                editor:()=>{
                    return ``
                },
                event:()=>{
                    element!.event.preventDefault()
                    element!.event.stopPropagation()
                }
            }
        }
    }
})