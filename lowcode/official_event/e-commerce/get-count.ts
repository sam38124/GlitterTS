import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {

            return {
                editor: () => {

                    return ``
                },
                event: () => {
                    return new Promise(async (resolve, reject)=>{


                        ApiShop.getCart().then(async (res:any)=>{
                           let total=0
                             for (const b of Object.keys(res)){
                                 const pd:any=(await  ApiShop.getProduct({limit:50,page:0,id:b.split('-')[0]})).response.data.content
                                 const vard=pd.variants.find((d2:any)=>{
                                     return `${pd.id}-${d2.spec.join('-')}`===b
                                 });
                                 total+=parseInt(res[b],10)
                             }
                            resolve(total)
                        })
                    })
                },
            };
        },
    };
});

