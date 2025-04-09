import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";
import {ApiUser} from "../../glitter-base/route/user.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.successEvent=object.successEvent??{}
            object.errorEvent=object.errorEvent??{}
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.successEvent, {
                            hover: false,
                            option: [],
                            title: "已登入狀態事件"
                        }),
                        TriggerEvent.editer(gvc, widget, object.errorEvent, {
                            hover: false,
                            option: [],
                            title: "未登入狀態事件"
                        })
                    ].join(`<div class="my-2"></div>`)
                },
                event: () => {

                    return new Promise(async (resolve, reject) => {
                        if(!GlobalUser.token){
                            GlobalUser.token = ''
                            resolve(await TriggerEvent.trigger({gvc:gvc,widget:widget,clickEvent:object.errorEvent,subData:subData,element:element}))
                            return ``
                        }
                        if (gvc.glitter.getUrlParameter('token')) {
                            GlobalUser.token = gvc.glitter.getUrlParameter('token')
                            gvc.glitter.setUrlParameter('token', undefined)
                        }
                        ApiUser.getUserData(GlobalUser.token,'me').then(async (r) => {
                            try {
                                if (!r.result) {
                                    GlobalUser.token = ''
                                    resolve(await TriggerEvent.trigger({gvc:gvc,widget:widget,clickEvent:object.errorEvent,subData:subData,element:element}))
                                } else {
                                    GlobalUser.userInfo = r.response
                                    GlobalUser.updateUserData = JSON.parse(JSON.stringify(r.response))
                                    resolve(await TriggerEvent.trigger({gvc:gvc,widget:widget,clickEvent:object.successEvent,subData:subData,element:element}))
                                }
                            } catch (e) {
                                resolve(await TriggerEvent.trigger({gvc:gvc,widget:widget,clickEvent:object.errorEvent,subData:subData,element:element}))
                            }
                        })
                    })
                },
            };
        },
    };
});

