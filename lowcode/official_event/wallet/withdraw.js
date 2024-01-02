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
import { ApiWallet } from "../../glitter-base/route/wallet.js";
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            var _a, _b, _c, _d, _e, _f;
            object.total = (_a = object.total) !== null && _a !== void 0 ? _a : {};
            object.note = (_b = object.note) !== null && _b !== void 0 ? _b : {};
            object.code = (_c = object.code) !== null && _c !== void 0 ? _c : {};
            object.number = (_d = object.number) !== null && _d !== void 0 ? _d : {};
            object.success = (_e = object.success) !== null && _e !== void 0 ? _e : {};
            object.error = (_f = object.error) !== null && _f !== void 0 ? _f : {};
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.total, {
                            hover: false,
                            option: [],
                            title: '提領金額'
                        }),
                        TriggerEvent.editer(gvc, widget, object.note, {
                            hover: false,
                            option: [],
                            title: '備註內容'
                        }),
                        TriggerEvent.editer(gvc, widget, object.code, {
                            hover: false,
                            option: [],
                            title: '撥款銀行代號'
                        }),
                        TriggerEvent.editer(gvc, widget, object.number, {
                            hover: false,
                            option: [],
                            title: '撥款銀行帳戶'
                        }),
                        TriggerEvent.editer(gvc, widget, object.success, {
                            hover: false,
                            option: [],
                            title: '送審成功'
                        }),
                        TriggerEvent.editer(gvc, widget, object.error, {
                            hover: false,
                            option: [],
                            title: '送審失敗'
                        })
                    ].join(`<div class="my-2"></div>`);
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const total = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.total
                        });
                        const note = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.note
                        });
                        const number = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.number
                        });
                        const code = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.code
                        });
                        ApiWallet.withdraw({
                            total: total,
                            note: {
                                note: note,
                                code: code,
                                number: number
                            }
                        }).then((res) => __awaiter(void 0, void 0, void 0, function* () {
                            if (res.response && res.response.result) {
                                yield TriggerEvent.trigger({
                                    gvc: gvc,
                                    widget: widget,
                                    clickEvent: object.success
                                });
                            }
                            else {
                                yield TriggerEvent.trigger({
                                    gvc: gvc,
                                    widget: widget,
                                    clickEvent: object.error
                                });
                            }
                            resolve(res.response && res.response.result);
                        }));
                    }));
                },
            };
        }
    };
});
