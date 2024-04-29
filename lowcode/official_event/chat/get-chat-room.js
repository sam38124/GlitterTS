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
            var _a;
            object.who = (_a = object.who) !== null && _a !== void 0 ? _a : {};
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.who, {
                            hover: false,
                            option: [],
                            title: "取得USER_ID"
                        })
                    ].join('');
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const user_id = yield TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.who, subData: subData, element: element
                        });
                        Chat.getChatRoom({
                            page: 0,
                            limit: 1000,
                            user_id: user_id
                        }).then((data) => __awaiter(void 0, void 0, void 0, function* () {
                            const chatData = (data.response.data);
                            Chat.getUnRead({ user_id: user_id }).then((data) => {
                                const unRead = data.response;
                                resolve({
                                    chatData: chatData,
                                    unRead: unRead
                                });
                            });
                        }));
                    }));
                }
            };
        }
    };
});
