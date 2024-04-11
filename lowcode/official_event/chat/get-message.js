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
import { Chat } from "../../glitter-base/route/chat.js";
TriggerEvent.createSingleEvent(import.meta.url, (glitter) => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            var _a, _b, _c, _d, _e;
            object.chatID = (_a = object.chatID) !== null && _a !== void 0 ? _a : {};
            object.page = (_b = object.page) !== null && _b !== void 0 ? _b : {};
            object.limit = (_c = object.limit) !== null && _c !== void 0 ? _c : {};
            object.latestID = (_d = object.latestID) !== null && _d !== void 0 ? _d : {};
            object.olderID = (_e = object.olderID) !== null && _e !== void 0 ? _e : {};
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.chatID, {
                            hover: false,
                            option: [],
                            title: "取得聊天室ID"
                        }),
                        TriggerEvent.editer(gvc, widget, object.page, {
                            hover: false,
                            option: [],
                            title: "取得當下頁面"
                        }),
                        TriggerEvent.editer(gvc, widget, object.limit, {
                            hover: false,
                            option: [],
                            title: "取得每頁比數"
                        }),
                        TriggerEvent.editer(gvc, widget, object.latestID, {
                            hover: false,
                            option: [],
                            title: "最新訊息[返回最後一筆資料ID]"
                        }),
                        TriggerEvent.editer(gvc, widget, object.olderID, {
                            hover: false,
                            option: [],
                            title: "先前訊息[返回第一筆資料ID]"
                        })
                    ].join('<div class="my-2"></div>');
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const chatID = yield TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.chatID
                        });
                        const page = yield TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.page
                        });
                        const limit = yield TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.limit
                        });
                        const latestID = yield TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.latestID
                        });
                        const olderID = yield TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.olderID
                        });
                        resolve((yield Chat.getMessage({
                            limit: limit,
                            page: page,
                            chat_id: chatID,
                            latestID: latestID,
                            olderID: olderID,
                            user_id: ''
                        })).response);
                    }));
                }
            };
        }
    };
});
