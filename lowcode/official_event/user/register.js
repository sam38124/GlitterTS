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
import { GlobalUser } from "../../glitter-base/global/global-user.js";
import { ApiUser } from "../../glitter-base/route/user.js";
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            object.successEvent = (_a = object.successEvent) !== null && _a !== void 0 ? _a : {};
            object.errorEvent = (_b = object.errorEvent) !== null && _b !== void 0 ? _b : {};
            object.account = (_c = object.account) !== null && _c !== void 0 ? _c : {};
            object.password = (_d = object.password) !== null && _d !== void 0 ? _d : {};
            object.userData = (_e = object.userData) !== null && _e !== void 0 ? _e : {};
            object.mailVerify = (_f = object.mailVerify) !== null && _f !== void 0 ? _f : {};
            object.emailVerifyCode = (_g = object.emailVerifyCode) !== null && _g !== void 0 ? _g : {};
            object.checkError = (_h = object.checkError) !== null && _h !== void 0 ? _h : {};
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
                            title: "驗證碼"
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
                            title: "驗證失敗事件"
                        })
                    ].join(`<div class="my-2"></div>`);
                },
                event: () => {
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
                        let emailVerifyCode = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.emailVerifyCode,
                            subData: subData,
                            element: element
                        });
                        let userData = (yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.userData,
                            subData: subData,
                            element: element
                        })) || {};
                        userData.verify_code = emailVerifyCode;
                        ApiUser.register({
                            account: account,
                            pwd: pwd,
                            userData: userData
                        }).then((r) => {
                            var _a;
                            if (!r.result) {
                                if (emailVerifyCode) {
                                    TriggerEvent.trigger({
                                        gvc: gvc,
                                        widget: widget,
                                        clickEvent: object.checkError,
                                        subData: subData,
                                        element: element
                                    });
                                }
                                else {
                                    TriggerEvent.trigger({
                                        gvc: gvc,
                                        widget: widget,
                                        clickEvent: object.errorEvent,
                                        subData: subData,
                                        element: element
                                    });
                                }
                                resolve(false);
                            }
                            else {
                                if (r.response.needVerify === 'mail') {
                                    TriggerEvent.trigger({
                                        gvc: gvc,
                                        widget: widget,
                                        clickEvent: object.mailVerify,
                                        subData: subData,
                                        element: element
                                    });
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
                        });
                    }));
                },
            };
        },
    };
});
