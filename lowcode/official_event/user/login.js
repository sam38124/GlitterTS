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
            var _a, _b, _c, _d, _e;
            object.successEvent = (_a = object.successEvent) !== null && _a !== void 0 ? _a : {};
            object.errorEvent = (_b = object.errorEvent) !== null && _b !== void 0 ? _b : {};
            object.account = (_c = object.account) !== null && _c !== void 0 ? _c : {};
            object.password = (_d = object.password) !== null && _d !== void 0 ? _d : {};
            object.loginMethod = (_e = object.loginMethod) !== null && _e !== void 0 ? _e : "normal";
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
                                            { title: "FB登入", value: "fb" }
                                        ],
                                    })
                                ];
                                if (object.loginMethod !== 'fb') {
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
                    if (object.loginMethod === 'fb') {
                        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                            window.FB.login(function (response) {
                                console.log(`FB.login`, response.authResponse.accessToken);
                                const accessToken = response.authResponse.accessToken;
                                ApiUser.login({
                                    login_type: 'fb',
                                    fb_token: accessToken
                                }).then((r) => {
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
                                });
                            }, { scope: 'public_profile,email' });
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
                                var _a;
                                console.log(`login--->`, r);
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
                            });
                        }));
                    }
                },
            };
        },
    };
});
