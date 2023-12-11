
import {GlobalUser} from "../../glitter-base/global/global-user.js";
import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            return {
                editor: () => {
                    object.comefrom= object.comefrom??{}
                    return TriggerEvent.editer( gvc,
                        widget,
                        object.comefrom,
                        {
                            hover:false,
                            option:[],
                            title:'預覽專案來源'
                        });

                },
                event: () => {
                    const saasConfig: {
                        config: any;
                        api: any;
                    } = (window as any).saasConfig;
                    return new Promise(async (resolve, reject)=>{
                        const createAPP=await TriggerEvent.trigger({
                            gvc:gvc,
                            widget:widget,
                            clickEvent:object.comefrom,
                            subData:subData,
                        })
                        const url=new URL(location.href)
                        url.searchParams.set('appName',createAPP as string)
                        gvc.glitter.openNewTab(url.href)

                        resolve(true)
                    })
                }
            }
        }
    };
});

