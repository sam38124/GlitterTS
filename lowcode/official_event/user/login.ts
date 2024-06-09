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
            object.loginMethod=object.loginMethod??"normal";
            object.code=object.code??{};
            object.redirect=object.redirect??{};
            return {
                editor: () => {
                    return gvc.bindView(()=>{
                        const id=gvc.glitter.getUUID()
                        return {
                            bind:id,
                            view:()=>{
                                let option=[
                                    EditorElem.select({
                                        title: '登入方式',
                                        gvc: gvc,
                                        def: object.loginMethod,
                                        callback: (text) => {
                                            object.loginMethod=text
                                            gvc.notifyDataChange(id);
                                        },
                                        array: [
                                            { title: "一般登入", value: "normal" },
                                            { title: "FB登入", value: "fb" },
                                            { title: "LINE登入", value: "line" },
                                            { title: "Google登入", value: "google" }
                                        ],
                                    })
                                ]
                                if(object.loginMethod!=='fb' && object.loginMethod!=='line' && object.loginMethod!=='google'){
                                    option=option.concat([ TriggerEvent.editer(gvc, widget, object.account, {
                                        hover: false,
                                        option: [],
                                        title: "用戶帳號"
                                    }), TriggerEvent.editer(gvc, widget, object.password, {
                                        hover: false,
                                        option: [],
                                        title: "用戶密碼"
                                    })])
                                }
                                if(object.loginMethod==='line' || (object.loginMethod==='google')){
                                    option=option.concat([
                                        TriggerEvent.editer(gvc, widget, object.code, {
                                            hover: false,
                                            option: [],
                                            title: "code代碼"
                                        }),
                                        TriggerEvent.editer(gvc, widget, object.redirect, {
                                            hover: false,
                                            option: [],
                                            title: "redirect"
                                        })
                                    ])
                                }
                                option=option.concat([
                                    TriggerEvent.editer(gvc, widget, object.successEvent, {
                                        hover: false,
                                        option: [],
                                        title: "登入成功事件"
                                    }),
                                    TriggerEvent.editer(gvc, widget, object.errorEvent, {
                                        hover: false,
                                        option: [],
                                        title: "登入失敗事件"
                                    })
                                ])
                                return option.join('<div class="my-2"></div>')
                            }
                        }
                    })

                },
                event: () => {
                     function loginCallback(r:any,resolve:(result:boolean)=>void ){
                         if (!r.result) {
                             TriggerEvent.trigger({
                                 gvc: gvc,
                                 widget: widget,
                                 clickEvent: object.errorEvent,
                                 subData: subData,
                                 element: element
                             })
                             resolve(false)
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
                    if(object.loginMethod==='fb'){
                        return new Promise(async (resolve, reject) => {
                            (window as any).FB.login(function(response:any) {
                                // handle the response
                                const accessToken=response.authResponse.accessToken;
                                ApiUser.login({
                                    login_type:'fb',
                                    fb_token:accessToken
                                }).then((r) => {
                                    loginCallback(r,(res)=>{
                                        resolve(res)
                                    })
                                })
                            }, {scope: 'public_profile,email'});

                        })
                    }else  if(object.loginMethod==='line'){
                        return new Promise(async (resolve, reject)=>{
                            let code = await TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.code,
                                subData: subData,
                                element: element
                            })
                            let redirect = await TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.redirect,
                                subData: subData,
                                element: element
                            })
                            ApiUser.login({
                                login_type:'line',
                                line_token:code as any,
                                redirect:redirect as any
                            }).then((r) => {
                                loginCallback(r,(res)=>{
                                    resolve(res)
                                })
                            })
                        })

                    }else  if(object.loginMethod==='google'){
                        return new Promise(async (resolve, reject)=>{
                            let code = await TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.code,
                                subData: subData,
                                element: element
                            })
                            let redirect = await TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.redirect,
                                subData: subData,
                                element: element
                            })
                            ApiUser.login({
                                login_type:'google',
                                google_token:code as any,
                                redirect:redirect as any
                            }).then((r) => {
                                loginCallback(r,(res)=>{
                                    resolve(res)
                                })
                            })
                        })

                    }else{
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
                            ApiUser.login({
                                account: account as string,
                                pwd: pwd as string
                            }).then((r) => {
                                loginCallback(r,(res)=>{
                                    resolve(res)
                                })
                            })
                        })
                    }
                },
            };
        },
    };
});

