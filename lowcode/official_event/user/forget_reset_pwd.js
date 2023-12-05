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
            object.confirmPwd = (_b = object.confirmPwd) !== null && _b !== void 0 ? _b : {};
            object.success = (_c = object.success) !== null && _c !== void 0 ? _c : {};
            object.error = (_d = object.error) !== null && _d !== void 0 ? _d : {};
            object.errorText = (_e = object.errorText) !== null && _e !== void 0 ? _e : {};
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.resetPwd, {
                            hover: false,
                            option: [],
                            title: "取得新密碼"
                        }),
                        TriggerEvent.editer(gvc, widget, object.confirmPwd, {
                            hover: false,
                            option: [],
                            title: "取得確認密碼"
                        }),
                        TriggerEvent.editer(gvc, widget, object.errorText, {
                            hover: false,
                            option: [],
                            title: "密碼確認失敗"
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
                        const resetPwd = yield TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.resetPwd
                        });
                        const confirmPwd = yield TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.confirmPwd
                        });
                        if (resetPwd !== confirmPwd) {
                            yield TriggerEvent.trigger({
                                gvc: gvc, widget: widget, clickEvent: object.errorText
                            });
                            resolve(false);
                        }
                        else {
                            (_a = ApiUser.resetPwd(resetPwd)) === null || _a === void 0 ? void 0 : _a.then((r) => __awaiter(void 0, void 0, void 0, function* () {
                                if (!r.result || !r.response.result) {
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
                        }
                    }));
                },
            };
        },
    };
});
