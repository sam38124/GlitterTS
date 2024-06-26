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
import { EditorElem } from "../../glitterBundle/plugins/editor-elem.js";
import { NormalPageEditor } from "../../editor/normal-page-editor.js";
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            return {
                editor: () => {
                    return gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                var _a;
                                object.eventList = (_a = object.eventList) !== null && _a !== void 0 ? _a : [];
                                try {
                                    return EditorElem.arrayItem({
                                        originalArray: object.eventList,
                                        gvc: gvc,
                                        title: '',
                                        array: () => {
                                            return object.eventList.map((dd, index) => {
                                                var _a, _b;
                                                dd.yesEvent = (_a = dd.yesEvent) !== null && _a !== void 0 ? _a : {};
                                                dd.trigger = (_b = dd.trigger) !== null && _b !== void 0 ? _b : {};
                                                return {
                                                    title: dd.title || `事件:${index + 1}`,
                                                    expand: dd,
                                                    innerHtml: () => {
                                                        NormalPageEditor.toggle({
                                                            visible: true,
                                                            view: gvc.bindView(() => {
                                                                return {
                                                                    bind: gvc.glitter.getUUID(),
                                                                    view: () => {
                                                                        var _a;
                                                                        return `<div class="p-2">${[
                                                                            gvc.glitter.htmlGenerate.editeInput({
                                                                                gvc: gvc,
                                                                                title: '事件標題',
                                                                                default: (_a = dd.title) !== null && _a !== void 0 ? _a : '',
                                                                                placeHolder: '請輸入事件標題',
                                                                                callback: (text) => {
                                                                                    dd.title = text;
                                                                                },
                                                                            }),
                                                                            TriggerEvent.editer(gvc, widget, dd.yesEvent, {
                                                                                hover: true,
                                                                                option: [],
                                                                                title: '判斷式-返回true則執行事件',
                                                                            }),
                                                                            `<div class="mt-2"></div>`,
                                                                            TriggerEvent.editer(gvc, widget, dd.trigger, {
                                                                                hover: true,
                                                                                option: [],
                                                                                title: '執行事件',
                                                                            }),
                                                                        ].join('')}</div>`;
                                                                    },
                                                                };
                                                            }),
                                                            title: '設定事件',
                                                        });
                                                    },
                                                    minus: gvc.event(() => {
                                                        object.eventList.splice(index, 1);
                                                        gvc.notifyDataChange(id);
                                                    }),
                                                };
                                            });
                                        },
                                        expand: object,
                                        plus: {
                                            title: '添加事件判斷',
                                            event: gvc.event(() => {
                                                object.eventList.push({ yesEvent: {}, trigger: {} });
                                                gvc.notifyDataChange(id);
                                            }),
                                        },
                                        refreshComponent: () => {
                                            gvc.notifyDataChange(id);
                                        },
                                        customEditor: true,
                                    });
                                }
                                catch (e) {
                                    return ``;
                                }
                            },
                            divCreate: {},
                        };
                    });
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        var _a;
                        try {
                            for (const a of object.eventList) {
                                const result = yield TriggerEvent.trigger({
                                    gvc: gvc,
                                    widget: widget,
                                    clickEvent: a.yesEvent,
                                    subData: subData,
                                    element: element,
                                });
                                if (result) {
                                    const response = yield TriggerEvent.trigger({
                                        gvc: gvc,
                                        widget: widget,
                                        clickEvent: a.trigger,
                                        subData: subData,
                                        element: element,
                                    });
                                    resolve(response);
                                    return;
                                }
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
