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
TriggerEvent.createSingleEvent(import.meta.url, (glitter) => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            var _a;
            object.getEvent = (_a = object.getEvent) !== null && _a !== void 0 ? _a : {};
            return {
                editor: () => {
                    return TriggerEvent.editer(gvc, widget, object.getEvent, {
                        option: [],
                        title: '取得推播頻道',
                        hover: false,
                    });
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        var _a;
                        try {
                            const topic = yield TriggerEvent.trigger({
                                gvc,
                                widget,
                                clickEvent: object.getEvent,
                                subData: subData,
                                element,
                            });
                            if (typeof topic != 'object') {
                                gvc.glitter.runJsInterFace('regNotification', {
                                    topic: topic,
                                }, (response) => {
                                });
                            }
                            else {
                                topic.map((dd) => {
                                    gvc.glitter.runJsInterFace('regNotification', {
                                        topic: dd,
                                    }, (response) => {
                                    });
                                });
                            }
                            resolve(true);
                        }
                        catch (e) {
                            resolve((_a = object.errorCode) !== null && _a !== void 0 ? _a : false);
                        }
                    }));
                },
            };
        },
    };
});
