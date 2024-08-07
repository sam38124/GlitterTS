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
            var _a, _b;
            object.page = (_a = object.page) !== null && _a !== void 0 ? _a : {};
            object.limit = (_b = object.limit) !== null && _b !== void 0 ? _b : {};
            object.get_type_event = object.get_type_event || {};
            object.get_start_date = object.get_start_date || {};
            return {
                editor: () => {
                    return [TriggerEvent.editer(gvc, widget, object.page, {
                            hover: false,
                            option: [],
                            title: '頁面'
                        }),
                        TriggerEvent.editer(gvc, widget, object.limit, {
                            hover: false,
                            option: [],
                            title: '筆數'
                        }),
                        TriggerEvent.editer(gvc, widget, object.get_type_event, {
                            hover: false,
                            option: [],
                            title: '取得類型'
                        }),
                        TriggerEvent.editer(gvc, widget, object.get_start_date, {
                            hover: false,
                            option: [],
                            title: '過濾開始時間'
                        })
                    ].join('<div class="my-2"></div>');
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const page = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.page
                        });
                        const limit = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.limit
                        });
                        const type = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.get_type_event
                        });
                        const get_start_date = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.get_start_date
                        });
                        ApiWallet.getWalletMemory({
                            page: page,
                            limit: limit,
                            type: type,
                            start_date: (get_start_date || '')
                        }).then((res) => __awaiter(void 0, void 0, void 0, function* () {
                            resolve(res.result && res.response.data);
                        }));
                    }));
                },
            };
        }
    };
});
