import {GlobalUser} from "../../glitter-base/global/global-user.js";
import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {ApiPageConfig} from "../../api/pageConfig.js";
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            object.deleteApp=object.deleteApp??{}
            object.success=object.success??{}
            object.error=object.error??{}
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc,
                            widget,
                            object.deleteApp,
                            {
                                hover:false,
                                option:[],
                                title:'取得刪除的專案名稱'
                            }),
                        TriggerEvent.editer(gvc,
                            widget,
                            object.success,
                            {
                                hover:false,
                                option:[],
                                title:'刪除成功事件'
                            }),
                        TriggerEvent.editer(gvc,
                            widget,
                            object.error,
                            {
                                hover:false,
                                option:[],
                                title:'刪除失敗事件'
                            })
                    ].join(`<div class="my-2"></div>`)
                },
                event: () => {
                    return new Promise(async (resolve, reject)=>{
                        const deleteAPP=await TriggerEvent.trigger({
                            gvc:gvc,
                            widget:widget,
                            clickEvent:object.deleteApp,
                            subData:subData,
                        })
                        const response=await ApiPageConfig.deleteApp(deleteAPP as string)
                        if(response.result){
                            await TriggerEvent.trigger({
                                gvc:gvc,
                                widget:widget,
                                clickEvent:object.success,
                                subData:subData,
                            })
                        }else{
                            await TriggerEvent.trigger({
                                gvc:gvc,
                                widget:widget,
                                clickEvent:object.error,
                                subData:subData,
                            })
                        }
                        resolve(response.result)
                    })
                }
            }
        }
    };
});

