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
import { GlobalUser } from "../../glitter-base/global/global-user.js";
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            var _a, _b;
            object.successEvent = (_a = object.successEvent) !== null && _a !== void 0 ? _a : {};
            object.errorEvent = (_b = object.errorEvent) !== null && _b !== void 0 ? _b : {};
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.successEvent, {
                            hover: false,
                            option: [],
                            title: "已登入狀態事件"
                        }),
                        TriggerEvent.editer(gvc, widget, object.errorEvent, {
                            hover: false,
                            option: [],
                            title: "未登入狀態事件"
                        })
                    ].join(`<div class="my-2"></div>`);
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        if (!GlobalUser.token) {
                            resolve(yield TriggerEvent.trigger({ gvc: gvc, widget: widget, clickEvent: object.errorEvent, subData: subData, element: element }));
                        }
                        else {
                            resolve(yield TriggerEvent.trigger({ gvc: gvc, widget: widget, clickEvent: object.successEvent, subData: subData, element: element }));
                        }
                    }));
                },
            };
        },
    };
});
