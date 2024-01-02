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
            var _a, _b;
            object.type = (_a = object.type) !== null && _a !== void 0 ? _a : {};
            object.participant = (_b = object.participant) !== null && _b !== void 0 ? _b : {};
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.type, {
                            hover: false,
                            option: [],
                            title: "取得建立類型"
                        }),
                        TriggerEvent.editer(gvc, widget, object.participant, {
                            hover: false,
                            option: [],
                            title: "取得參加者"
                        })
                    ].join('<div class="my-2"></div>');
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const type = yield TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.type
                        });
                        const participant = yield TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.participant
                        });
                        yield Chat.post({
                            type: type,
                            participant: participant
                        });
                        resolve(true);
                    }));
                }
            };
        }
    };
});
