var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TriggerEvent } from '../../glitterBundle/plugins/trigger-event.js';
import { EditorElem } from "../../glitterBundle/plugins/editor-elem.js";
import { GlobalUser } from "../../glitter-base/global/global-user.js";
import { ApiUser } from "../../glitter-base/route/user.js";
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            var _a, _b, _c, _d, _e, _f, _g;
            object.successEvent = (_a = object.successEvent) !== null && _a !== void 0 ? _a : {};
            object.errorEvent = (_b = object.errorEvent) !== null && _b !== void 0 ? _b : {};
            object.account = (_c = object.account) !== null && _c !== void 0 ? _c : {};
            object.password = (_d = object.password) !== null && _d !== void 0 ? _d : {};
            object.loginMethod = (_e = object.loginMethod) !== null && _e !== void 0 ? _e : "normal";
            object.code = (_f = object.code) !== null && _f !== void 0 ? _f : {};
            object.redirect = (_g = object.redirect) !== null && _g !== void 0 ? _g : {};
            return {
                editor: () => {
                    return gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                let option = [
                                    EditorElem.select({
                                        title: '登入方式',
                                        gvc: gvc,
                                        def: object.loginMethod,
                                        callback: (text) => {
                                            object.loginMethod = text;
                                            gvc.notifyDataChange(id);
                                        },
                                        array: [
                                            { title: "一般登入", value: "normal" },
                                            { title: "FB登入", value: "fb" },
                                            { title: "LINE登入", value: "line" },
                                            { title: "Google登入", value: "google" },
                                            { title: "Apple登入", value: "apple" }
                                        ],
                                    })
                                ];
                                if (!['fb', 'apple', 'google', 'line'].includes(object.loginMethod)) {
                                    option = option.concat([TriggerEvent.editer(gvc, widget, object.account, {
                                            hover: false,
                                            option: [],
                                            title: "用戶帳號"
                                        }), TriggerEvent.editer(gvc, widget, object.password, {
                                            hover: false,
                                            option: [],
                                            title: "用戶密碼"
                                        })]);
                                }
                                if (object.loginMethod === 'line' || (object.loginMethod === 'google')) {
                                    option = option.concat([
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
                                    ]);
                                }
                                if (object.loginMethod === 'apple') {
                                    option = option.concat([
                                        TriggerEvent.editer(gvc, widget, object.code, {
                                            hover: false,
                                            option: [],
                                            title: "code代碼"
                                        })
                                    ]);
                                }
                                option = option.concat([
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
                                ]);
                                return option.join('<div class="my-2"></div>');
                            }
                        };
                    });
                },
                event: () => {
                    function loginCallback(r, resolve) {
                        var _a;
                        if (!r.result) {
                            TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.errorEvent,
                                subData: subData,
                                element: element
                            });
                            resolve(false);
                        }
                        else {
                            TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.successEvent,
                                subData: subData,
                                element: element
                            });
                            gvc.glitter.share.public_api = (_a = gvc.glitter.share.public_api) !== null && _a !== void 0 ? _a : {};
                            gvc.glitter.share.public_api.GlobalUser = GlobalUser;
                            GlobalUser.token = r.response.token;
                            GlobalUser.userInfo = r.response;
                            GlobalUser.updateUserData = JSON.parse(JSON.stringify(r.response));
                            resolve(true);
                        }
                    }
                    if (object.loginMethod === 'fb') {
                        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                            if (gvc.glitter.deviceType === gvc.glitter.deviceTypeEnum.Ios) {
                                gvc.glitter.runJsInterFace("facebook_login", {}, (response) => {
                                    if (response.result) {
                                        ApiUser.login({
                                            login_type: 'fb',
                                            fb_token: response.accessToken
                                        }).then((r) => {
                                            loginCallback(r, (res) => {
                                                resolve(res);
                                            });
                                        });
                                    }
                                });
                            }
                            else {
                                window.FB.login(function (response) {
                                    const accessToken = response.authResponse.accessToken;
                                    ApiUser.login({
                                        login_type: 'fb',
                                        fb_token: accessToken
                                    }).then((r) => {
                                        loginCallback(r, (res) => {
                                            resolve(res);
                                        });
                                    });
                                }, { scope: 'public_profile,email' });
                            }
                        }));
                    }
                    else if (object.loginMethod === 'line') {
                        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                            let code = yield TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.code,
                                subData: subData,
                                element: element
                            });
                            let redirect = yield TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.redirect,
                                subData: subData,
                                element: element
                            });
                            ApiUser.login({
                                login_type: 'line',
                                line_token: code,
                                redirect: redirect
                            }).then((r) => {
                                loginCallback(r, (res) => {
                                    resolve(res);
                                });
                            });
                        }));
                    }
                    else if (object.loginMethod === 'google') {
                        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                            let code = yield TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.code,
                                subData: subData,
                                element: element
                            });
                            let redirect = yield TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.redirect,
                                subData: subData,
                                element: element
                            });
                            ApiUser.login({
                                login_type: 'google',
                                google_token: code,
                                redirect: redirect
                            }).then((r) => {
                                loginCallback(r, (res) => {
                                    resolve(res);
                                });
                            });
                        }));
                    }
                    else if (object.loginMethod === 'apple') {
                        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                            let code = yield TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.code,
                                subData: subData,
                                element: element
                            });
                            ApiUser.login({
                                login_type: 'apple',
                                token: code
                            }).then((r) => {
                                loginCallback(r, (res) => {
                                    resolve(res);
                                });
                            });
                        }));
                    }
                    else {
                        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                            let account = yield TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.account,
                                subData: subData,
                                element: element
                            });
                            let pwd = yield TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.password,
                                subData: subData,
                                element: element
                            });
                            ApiUser.login({
                                account: account,
                                pwd: pwd
                            }).then((r) => {
                                loginCallback(r, (res) => {
                                    resolve(res);
                                });
                            });
                        }));
                    }
                },
            };
        },
    };
});
