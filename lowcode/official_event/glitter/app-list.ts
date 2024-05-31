import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {ApiPageConfig} from "../../api/pageConfig.js";
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData,element) => {
            object.token=object.token??{}
            return {

                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.token, {
                            hover: false,
                            option: [],
                            title: "取得TOKEN"
                        })
                    ].join('')

                },
                event: () => {
                    return new Promise(async (resolve, reject)=>{

                        const appList=await ApiPageConfig.getAppList(undefined,(await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.token, subData: subData,element:element
                        })) as any)
                        resolve(appList.response.result)
                    })
                }
            }
        }
    };
});

