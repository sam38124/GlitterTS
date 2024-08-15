import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {

            return {
                editor: () => {
                    return ``
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        ApiShop.getCollection().then((res) => {
                            function loopCValue(data:any,ind:string){
                                data.map((dd:any)=>{
                                    const indt=(ind) ? `${ind} / ${dd.title}`:dd.title
                                    dd.collectionTag=indt
                                    if(dd.array&&dd.array.length>0){
                                        loopCValue(dd.array,indt)
                                    }
                                })
                            }
                            loopCValue( res.response.value || [],'')
                            resolve(res.response.value)
                        })

                    })
                },
            };
        },
    };
});
