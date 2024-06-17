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
        fun: (gvc, widget, object, subData, element) => {
            var _a, _b, _c, _d;
            object.key = (_a = object.key) !== null && _a !== void 0 ? _a : "";
            object.value = (_b = object.value) !== null && _b !== void 0 ? _b : "";
            object.valueFrom = (_c = object.valueFrom) !== null && _c !== void 0 ? _c : "manual";
            object.valueData = (_d = object.valueData) !== null && _d !== void 0 ? _d : {};
            return {
                editor: () => {
                    return gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                return [
                                    EditorElem.editeInput({
                                        gvc: gvc,
                                        title: 'Key值',
                                        placeHolder: `請輸入Key值`,
                                        default: object.key,
                                        callback: (text) => {
                                            object.key = text;
                                        }
                                    }),
                                    EditorElem.select({
                                        title: '參數來源',
                                        gvc: gvc,
                                        def: object.valueFrom,
                                        array: [
                                            { title: '定義值', value: "manual" },
                                            { title: '程式碼', value: "code" }
                                        ],
                                        callback: (text) => {
                                            object.valueFrom = text;
                                            gvc.notifyDataChange(id);
                                        }
                                    }),
                                    ...(() => {
                                        if (object.valueFrom === 'manual') {
                                            return [
                                                EditorElem.editeInput({
                                                    gvc: gvc,
                                                    title: '參數',
                                                    placeHolder: `請輸入VALUE`,
                                                    default: object.value,
                                                    callback: (text) => {
                                                        object.value = text;
                                                    }
                                                })
                                            ];
                                        }
                                        else {
                                            return [
                                                TriggerEvent.editer(gvc, widget, object.valueData, {
                                                    hover: false,
                                                    option: [],
                                                    title: "取得參數內容"
                                                })
                                            ];
                                        }
                                    })()
                                ].join(`<div class="my-1"></div>`);
                            }
                        };
                    });
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        if (object.valueFrom === 'manual') {
                            gvc.glitter.setUrlParameter(object.key, object.value);
                            resolve(true);
                        }
                        else {
                            const formData = (yield TriggerEvent.trigger({
                                gvc: gvc, widget: widget, clickEvent: object.valueData, subData: subData, element: element
                            }));
                            if (formData) {
                                gvc.glitter.setUrlParameter(object.key, formData || undefined);
                            }
                            else {
                                gvc.glitter.setUrlParameter(object.key, formData || undefined);
                            }
                            resolve(true);
                        }
                    }));
                },
            };
        },
    };
});
