import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";
import {ApiUser} from "../../glitter-base/route/user.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.successEvent = object.successEvent ?? {}
            object.errorEvent = object.errorEvent ?? {}
            object.account = object.account ?? {}
            object.password = object.password ?? {}
            object.userData = object.userData ?? {}
            object.mailVerify = object.mailVerify ?? {}
            object.emailVerifyCode = object.emailVerifyCode ?? {}
            object.phoneVerifyCode = object.phoneVerifyCode ?? {}
            object.checkError = object.checkError ?? {}
            object.checkErrorPhone = object.checkErrorPhone ?? {}
            return {
                editor: () => {
                    return [TriggerEvent.editer(gvc, widget, object.account, {
                        hover: false,
                        option: [],
                        title: "用戶帳號"
                    }), TriggerEvent.editer(gvc, widget, object.password, {
                        hover: false,
                        option: [],
                        title: "用戶密碼"
                    }), TriggerEvent.editer(gvc, widget, object.userData, {
                        hover: false,
                        option: [],
                        title: "用戶資料"
                    }),
                        TriggerEvent.editer(gvc, widget, object.emailVerifyCode, {
                            hover: false,
                            option: [],
                            title: "信箱驗證碼"
                        }),
                        TriggerEvent.editer(gvc, widget, object.phoneVerifyCode, {
                            hover: false,
                            option: [],
                            title: "簡訊驗證碼"
                        }),
                        TriggerEvent.editer(gvc, widget, object.mailVerify, {
                            hover: false,
                            option: [],
                            title: "信箱驗證事件"
                        }),
                        TriggerEvent.editer(gvc, widget, object.successEvent, {
                            hover: false,
                            option: [],
                            title: "註冊成功事件"
                        }),
                        TriggerEvent.editer(gvc, widget, object.errorEvent, {
                            hover: false,
                            option: [],
                            title: "註冊失敗事件"
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
                    ].join(`<div class="my-2"></div>`)
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        let account = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.account,
                            subData: subData,
                            element: element
                        })
                        let pwd = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.password,
                            subData: subData,
                            element: element
                        })
                        let emailVerifyCode = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.emailVerifyCode,
                            subData: subData,
                            element: element
                        })
                        let phoneVerifyCode=await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.phoneVerifyCode,
                            subData: subData,
                            element: element
                        })
                        let userData: any = (await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.userData,
                            subData: subData,
                            element: element
                        })) || {};
                        userData.verify_code = emailVerifyCode
                        userData.verify_code_phone=phoneVerifyCode
                        ApiUser.register({
                            account: account as string,
                            pwd: pwd as string,
                            userData: userData
                        }).then((r) => {
                            if (!r.result) {
                                if(!r.response.data){
                                    TriggerEvent.trigger({
                                        gvc: gvc,
                                        widget: widget,
                                        clickEvent: object.errorEvent,
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
                            } else {
                                if (r.response.needVerify === 'mail') {
                                    TriggerEvent.trigger({
                                        gvc: gvc,
                                        widget: widget,
                                        clickEvent: object.mailVerify,
                                        subData: subData,
                                        element: element
                                    })
                                } else {
                                    TriggerEvent.trigger({
                                        gvc: gvc,
                                        widget: widget,
                                        clickEvent: object.successEvent,
                                        subData: subData,
                                        element: element
                                    })
                                    gvc.glitter.share.public_api = gvc.glitter.share.public_api ?? {}
                                    gvc.glitter.share.public_api.GlobalUser = GlobalUser
                                    GlobalUser.token = r.response.token
                                    GlobalUser.userInfo = r.response
                                    GlobalUser.updateUserData = JSON.parse(JSON.stringify(r.response))
                                    resolve(true)
                                }
                            }
                        })
                    })

                },
            };
        },
    };
});

