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
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            var _a, _b;
            object.sizeList = (_a = object.sizeList) !== null && _a !== void 0 ? _a : [];
            object.event = (_b = object.event) !== null && _b !== void 0 ? _b : {};
            return {
                editor: () => {
                    return gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                return [
                                    TriggerEvent.editer(gvc, widget, object.event, {
                                        hover: false,
                                        option: [],
                                        title: "預設事件"
                                    }),
                                    EditorElem.arrayItem({
                                        gvc: gvc,
                                        title: '設定其他裝置尺寸',
                                        array: () => {
                                            return object.sizeList.map((dd) => {
                                                return {
                                                    title: `寬度:${dd.size}`,
                                                    innerHtml: () => {
                                                        return [EditorElem.editeInput({
                                                                gvc: gvc,
                                                                title: '設定寬度尺寸',
                                                                default: `${dd.size}`,
                                                                placeHolder: '請輸入Class參數',
                                                                callback: (text) => {
                                                                    dd.size = text;
                                                                    gvc.recreateView();
                                                                },
                                                                type: 'text'
                                                            }), TriggerEvent.editer(gvc, widget, dd.event, {
                                                                hover: false,
                                                                option: [],
                                                                title: "執行事件"
                                                            })].join(`<div class="my-2"></div>`);
                                                    },
                                                    width: '400px'
                                                };
                                            });
                                        },
                                        originalArray: object.sizeList,
                                        expand: {},
                                        plus: {
                                            title: "新增尺寸",
                                            event: gvc.event(() => {
                                                object.sizeList.push({
                                                    size: 480,
                                                    event: {}
                                                });
                                                gvc.notifyDataChange(id);
                                            })
                                        },
                                        refreshComponent: () => {
                                            gvc.notifyDataChange(id);
                                        }
                                    })
                                ].join('<div class="my-2"></div>');
                            }
                        };
                    });
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const key = {};
                        object.sizeList.map((dd) => {
                            key[dd.size] = (() => __awaiter(void 0, void 0, void 0, function* () {
                                resolve(yield TriggerEvent.trigger({
                                    gvc: gvc, widget: widget, clickEvent: dd.event, subData: subData
                                }));
                            }));
                        });
                        gvc.glitter.ut.frSize(key, () => __awaiter(void 0, void 0, void 0, function* () {
                            resolve(yield TriggerEvent.trigger({
                                gvc: gvc, widget: widget, clickEvent: object.event, subData: subData
                            }));
                        }))();
                    }));
                },
            };
        },
    };
});
