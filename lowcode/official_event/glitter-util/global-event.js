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
import { GlobalEvent } from "../../api/global-event.js";
import { EditorElem } from "../../glitterBundle/plugins/editor-elem.js";
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            var _a, _b;
            object.key = (_a = object.key) !== null && _a !== void 0 ? _a : "";
            object.event = (_b = object.event) !== null && _b !== void 0 ? _b : {};
            return {
                editor: () => {
                    return [
                        gvc.bindView(() => {
                            const id = gvc.glitter.getUUID();
                            return {
                                bind: id,
                                view: () => {
                                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                                        const data = yield GlobalEvent.getGlobalEvent({});
                                        resolve(EditorElem.select({
                                            title: '選擇事件',
                                            gvc: gvc,
                                            def: object.key,
                                            array: [
                                                {
                                                    title: '選擇事件集', value: ''
                                                }
                                            ].concat(data.response.result.sort((function (a, b) {
                                                if (a.group.toUpperCase() < b.group.toUpperCase()) {
                                                    return -1;
                                                }
                                                if (a.group.toUpperCase() > b.group.toUpperCase()) {
                                                    return 1;
                                                }
                                                return 0;
                                            })).map((dd) => {
                                                return {
                                                    title: `${dd.group}-${dd.name}`, value: dd.tag
                                                };
                                            })),
                                            callback: (text) => {
                                                object.key = text;
                                            },
                                        }));
                                    }));
                                }
                            };
                        }),
                        TriggerEvent.editer(gvc, widget, object.event, {
                            hover: false,
                            option: [],
                            title: "夾帶資料"
                        })
                    ].join(`<div class="my-2"></div>`);
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const sub = yield TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.event, subData: subData, element: element
                        });
                        GlobalEvent.getGlobalEvent({
                            tag: object.key
                        }).then((dd) => __awaiter(void 0, void 0, void 0, function* () {
                            try {
                                const event = dd.response.result[0];
                                const response = yield TriggerEvent.trigger({
                                    gvc: gvc,
                                    widget: widget,
                                    clickEvent: event.json,
                                    subData: sub,
                                    element: element
                                });
                                resolve(response);
                            }
                            catch (e) {
                                resolve(false);
                            }
                        }));
                    }));
                },
            };
        },
    };
});
