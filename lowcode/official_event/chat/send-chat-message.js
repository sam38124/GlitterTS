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
            var _a, _b, _c, _d;
            object.message = (_a = object.message) !== null && _a !== void 0 ? _a : {};
            object.attachment = (_b = object.attachment) !== null && _b !== void 0 ? _b : {};
            object.chatID = (_c = object.chatID) !== null && _c !== void 0 ? _c : {};
            object.userID = (_d = object.userID) !== null && _d !== void 0 ? _d : {};
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.userID, {
                            hover: false,
                            option: [],
                            title: "取得USER ID"
                        }),
                        TriggerEvent.editer(gvc, widget, object.chatID, {
                            hover: false,
                            option: [],
                            title: "取得聊天室ID"
                        }),
                        TriggerEvent.editer(gvc, widget, object.message, {
                            hover: false,
                            option: [],
                            title: "取得文字內容"
                        }),
                        TriggerEvent.editer(gvc, widget, object.attachment, {
                            hover: false,
                            option: [],
                            title: "取得附件"
                        })
                    ].join('<div class="my-2"></div>');
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const chatID = yield TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.chatID
                        });
                        const message = yield TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.message
                        });
                        const attachment = yield TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.attachment
                        });
                        const userID = yield TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.userID
                        });
                        yield Chat.postMessage({
                            chat_id: chatID,
                            user_id: userID,
                            message: {
                                text: message,
                                attachment: attachment
                            }
                        });
                        resolve(true);
                    }));
                }
            };
        }
    };
});
