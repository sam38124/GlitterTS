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
            var _a, _b, _c, _d;
            object.pwdResource = (_a = object.pwdResource) !== null && _a !== void 0 ? _a : {};
            object.sendSuccess = (_b = object.sendSuccess) !== null && _b !== void 0 ? _b : {};
            object.sendError = (_c = object.sendError) !== null && _c !== void 0 ? _c : {};
            object.code = (_d = object.code) !== null && _d !== void 0 ? _d : {};
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.pwdResource, {
                            hover: false,
                            option: [],
                            title: "取得信箱資料"
                        }),
                        TriggerEvent.editer(gvc, widget, object.code, {
                            hover: false,
                            option: [],
                            title: "請輸入驗證碼"
                        }),
                        TriggerEvent.editer(gvc, widget, object.sendSuccess, {
                            hover: false,
                            option: [],
                            title: "確認成功"
                        }),
                        TriggerEvent.editer(gvc, widget, object.sendError, {
                            hover: false,
                            option: [],
                            title: "確認失敗"
                        }),
                    ].join('<div class="my-2"></div>');
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        var _a;
                        const data = yield TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.pwdResource
                        });
                        const code = yield TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.code
                        });
                        if (data) {
                            (_a = ApiUser.forgetPwdCheckCode(data, code)) === null || _a === void 0 ? void 0 : _a.then((r) => __awaiter(void 0, void 0, void 0, function* () {
                                if (!r.response.result) {
                                    yield TriggerEvent.trigger({
                                        gvc: gvc, widget: widget, clickEvent: object.sendError
                                    });
                                }
                                else {
                                    yield TriggerEvent.trigger({
                                        gvc: gvc, widget: widget, clickEvent: object.sendSuccess
                                    });
                                }
                                resolve(r.response.result);
                            }));
                        }
                        else {
                            yield TriggerEvent.trigger({
                                gvc: gvc, widget: widget, clickEvent: object.sendError
                            });
                            resolve(false);
                        }
                    }));
                },
            };
        },
    };
});
