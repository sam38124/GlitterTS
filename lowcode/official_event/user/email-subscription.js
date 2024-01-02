var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TriggerEvent } from "../../glitterBundle/plugins/trigger-event.js";
import { ApiUser } from "../../glitter-base/route/user.js";
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            var _a, _b, _c, _d;
            object.email = (_a = object.email) !== null && _a !== void 0 ? _a : {};
            object.sendSuccess = (_b = object.sendSuccess) !== null && _b !== void 0 ? _b : {};
            object.sendError = (_c = object.sendError) !== null && _c !== void 0 ? _c : {};
            object.tag = (_d = object.tag) !== null && _d !== void 0 ? _d : {};
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.email, {
                            hover: false,
                            option: [],
                            title: "取得信箱資料"
                        }),
                        TriggerEvent.editer(gvc, widget, object.tag, {
                            hover: false,
                            option: [],
                            title: "取得標籤"
                        }),
                        TriggerEvent.editer(gvc, widget, object.sendSuccess, {
                            hover: false,
                            option: [],
                            title: "訂閱成功事件"
                        }),
                        TriggerEvent.editer(gvc, widget, object.sendError, {
                            hover: false,
                            option: [],
                            title: "訂閱失敗事件"
                        }),
                    ].join('<div class="my-2"></div>');
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        var _a;
                        const data = yield TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.email
                        });
                        const tag = yield TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.tag
                        });
                        (_a = ApiUser.subScribe(data, tag)) === null || _a === void 0 ? void 0 : _a.then((r) => __awaiter(void 0, void 0, void 0, function* () {
                            if (!r.result || !r.response.result) {
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
                    }));
                }
            };
        }
    };
});
