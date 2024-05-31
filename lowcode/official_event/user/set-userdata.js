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
            var _a, _b, _c, _d, _e;
            object.userData = (_a = object.userData) !== null && _a !== void 0 ? _a : {};
            object.emailVerify = (_b = object.emailVerify) !== null && _b !== void 0 ? _b : {};
            object.success = (_c = object.success) !== null && _c !== void 0 ? _c : {};
            object.error = (_d = object.error) !== null && _d !== void 0 ? _d : {};
            object.verify_code = (_e = object.verify_code) !== null && _e !== void 0 ? _e : {};
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.userData, {
                            hover: false,
                            option: [],
                            title: "取得要更新的用戶資料。"
                        }),
                        TriggerEvent.editer(gvc, widget, object.emailVerify, {
                            hover: false,
                            option: [],
                            title: "信箱驗證事件。"
                        }),
                        TriggerEvent.editer(gvc, widget, object.verify_code, {
                            hover: false,
                            option: [],
                            title: "驗證碼來源。"
                        }),
                        TriggerEvent.editer(gvc, widget, object.success, {
                            hover: false,
                            option: [],
                            title: "更新成功事件。"
                        }),
                        TriggerEvent.editer(gvc, widget, object.error, {
                            hover: false,
                            option: [],
                            title: "更新失敗事件。"
                        })
                    ].join('<div class="my-2"></div>');
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const userData = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.userData,
                            subData: subData,
                            element: element
                        });
                        const verify_code = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.verify_code,
                            subData: subData,
                            element: element
                        });
                        if (verify_code) {
                            userData.verify_code = verify_code;
                        }
                        ApiUser.updateUserData({
                            userData: userData
                        }).then((r) => __awaiter(void 0, void 0, void 0, function* () {
                            try {
                                if (r.result && r.response.data === 'emailVerify') {
                                    yield TriggerEvent.trigger({
                                        gvc: gvc,
                                        widget: widget,
                                        clickEvent: object.emailVerify,
                                        subData: subData,
                                        element: element
                                    });
                                    resolve(false);
                                }
                                else if (r.result) {
                                    ApiUser.getUserData(GlobalUser.token, 'me').then((r) => __awaiter(void 0, void 0, void 0, function* () {
                                        try {
                                            GlobalUser.userInfo = r.response;
                                            GlobalUser.updateUserData = JSON.parse(JSON.stringify(r.response));
                                            yield TriggerEvent.trigger({
                                                gvc: gvc,
                                                widget: widget,
                                                clickEvent: object.success,
                                                subData: subData,
                                                element: element
                                            });
                                            resolve(true);
                                        }
                                        catch (e) {
                                            resolve(false);
                                        }
                                    }));
                                }
                                else {
                                    yield TriggerEvent.trigger({
                                        gvc: gvc,
                                        widget: widget,
                                        clickEvent: object.error,
                                        subData: r,
                                        element: element
                                    });
                                    resolve(false);
                                }
                            }
                            catch (e) {
                                yield TriggerEvent.trigger({
                                    gvc: gvc,
                                    widget: widget,
                                    clickEvent: object.error,
                                    subData: subData,
                                    element: element
                                });
                                resolve(false);
                            }
                        }));
                    }));
                },
            };
        },
    };
});
