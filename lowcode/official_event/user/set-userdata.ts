import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";
import {ApiUser} from "../../glitter-base/route/user.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.userData=object.userData??{}
            object.emailVerify=object.emailVerify??{}
            object.success=object.success??{}
            object.error=object.error??{}
            object.verify_code=object.verify_code??{}
            object.phoneVerifyCode = object.phoneVerifyCode ?? {}
            object.checkError = object.checkError ?? {}
            object.checkErrorPhone = object.checkErrorPhone ?? {}
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc,widget,object.userData,{
                            hover:false,
                            option:[],
                            title:"取得要更新的用戶資料。"
                        }),
                        TriggerEvent.editer(gvc,widget,object.emailVerify,{
                            hover:false,
                            option:[],
                            title:"信箱驗證事件。"
                        }),
                        TriggerEvent.editer(gvc,widget,object.verify_code,{
                            hover:false,
                            option:[],
                            title:"信箱驗證碼"
                        }),
                        TriggerEvent.editer(gvc, widget, object.phoneVerifyCode, {
                            hover: false,
                            option: [],
                            title: "簡訊驗證碼"
                        }),
                        TriggerEvent.editer(gvc,widget,object.success,{
                            hover:false,
                            option:[],
                            title:"更新成功事件。"
                        }),
                        TriggerEvent.editer(gvc,widget,object.error,{
                            hover:false,
                            option:[],
                            title:"更新失敗事件。"
                        }),
                        TriggerEvent.editer(gvc, widget, object.checkError, {
                            hover: false,
                            option: [],
                            title: "信箱驗證失敗事件"
                        }),
                        TriggerEvent.editer(gvc, widget, object.checkErrorPhone, {
                            hover: false,
                            option: [],
                            title: "電話驗證失敗事件"
                        })
                    ].join('<div class="my-2"></div>')
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const userData:any=await TriggerEvent.trigger({
                            gvc:gvc,
                            widget:widget,
                            clickEvent:object.userData,
                            subData:subData,
                            element:element
                        })
                        const verify_code=await TriggerEvent.trigger({
                            gvc:gvc,
                            widget:widget,
                            clickEvent:object.verify_code,
                            subData:subData,
                            element:element
                        })
                        let phoneVerifyCode=await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.phoneVerifyCode,
                            subData: subData,
                            element: element
                        })
                        if(verify_code){
                            userData.verify_code=verify_code
                        }
                        userData.verify_code_phone=phoneVerifyCode
                        ApiUser.updateUserData({
                            userData:userData
                        }).then(async (r) => {
                            try {
                                if(r.result && r.response.data==='emailVerify'){
                                    await TriggerEvent.trigger({
                                        gvc:gvc,
                                        widget:widget,
                                        clickEvent:object.emailVerify,
                                        subData:subData,
                                        element:element
                                    })
                                    resolve(false)
                                }else if(r.result){
                                    ApiUser.getUserData(GlobalUser.token,'me').then(async (r) => {
                                        try {
                                            GlobalUser.userInfo = r.response
                                            GlobalUser.updateUserData = JSON.parse(JSON.stringify(r.response))
                                            await TriggerEvent.trigger({
                                                gvc:gvc,
                                                widget:widget,
                                                clickEvent:object.success,
                                                subData:subData,
                                                element:element
                                            })
                                            resolve(true)
                                        } catch (e) {
                                            resolve(false)
                                        }
                                    })
                                }else{
                                    if(!r.response.data){
                                        TriggerEvent.trigger({
                                            gvc: gvc,
                                            widget: widget,
                                            clickEvent: object.error,
                                            subData: subData,
                                            element: element
                                        })
                                    }else if(r.response.data.msg==='email-verify-false'){
                                        TriggerEvent.trigger({
                                            gvc: gvc,
                                            widget: widget,
                                            clickEvent: object.checkError,
                                            subData: subData,
                                            element: element
                                        })
                                    }else if(r.response.data.msg==='phone-verify-false'){
                                        TriggerEvent.trigger({
                                            gvc: gvc,
                                            widget: widget,
                                            clickEvent: object.checkErrorPhone,
                                            subData: subData,
                                            element: element
                                        })
                                    }
                                    resolve(false)
                                }
                            } catch (e) {
                                await TriggerEvent.trigger({
                                    gvc:gvc,
                                    widget:widget,
                                    clickEvent:object.error,
                                    subData:subData,
                                    element:element
                                })
                                resolve(false)
                            }
                        })
                    })
                },
            };
        },
    };
});

