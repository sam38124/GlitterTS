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
import { ApiUser } from "../../glitter-base/route/user.js";
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            var _a, _b, _c, _d, _e;
            object.resetPwd = (_a = object.resetPwd) !== null && _a !== void 0 ? _a : {};
            object.code = (_b = object.code) !== null && _b !== void 0 ? _b : {};
            object.success = (_c = object.success) !== null && _c !== void 0 ? _c : {};
            object.error = (_d = object.error) !== null && _d !== void 0 ? _d : {};
            object.user_id = (_e = object.user_id) !== null && _e !== void 0 ? _e : {};
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.user_id, {
                            hover: false,
                            option: [],
                            title: "取得帳號或USERID"
                        }),
                        TriggerEvent.editer(gvc, widget, object.resetPwd, {
                            hover: false,
                            option: [],
                            title: "取得新密碼"
                        }),
                        TriggerEvent.editer(gvc, widget, object.code, {
                            hover: false,
                            option: [],
                            title: "取得驗證碼"
                        }),
                        TriggerEvent.editer(gvc, widget, object.success, {
                            hover: false,
                            option: [],
                            title: "重設成功"
                        }),
                        TriggerEvent.editer(gvc, widget, object.error, {
                            hover: false,
                            option: [],
                            title: "重設失敗"
                        })
                    ].join('<div class="my-2"></div>');
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        var _a;
                        const pwd = yield TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.resetPwd
                        });
                        const code = yield TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.code
                        });
                        const user_id = yield TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.user_id
                        });
                        (_a = ApiUser.resetPwdV2(user_id, code, pwd)) === null || _a === void 0 ? void 0 : _a.then((r) => __awaiter(void 0, void 0, void 0, function* () {
                            if (!r.response.result) {
                                yield TriggerEvent.trigger({
                                    gvc: gvc, widget: widget, clickEvent: object.error
                                });
                            }
                            else {
                                yield TriggerEvent.trigger({
                                    gvc: gvc, widget: widget, clickEvent: object.success
                                });
                            }
                            resolve(r.response.result);
                        }));
                    }));
                },
            };
        },
    };
});
