import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {ApiPageConfig} from "../../api/pageConfig.js";
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            return {

                editor: () => {
                  `<div class="btn-outline-danger"></div>`
                    return ``

                },
                event: () => {
                    return new Promise(async (resolve, reject)=>{
                        const appList=await ApiPageConfig.getAppList()
                        resolve(appList.response.result)
                    })
                }
            }
        }
    };
});

