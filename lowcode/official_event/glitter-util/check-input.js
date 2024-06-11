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
            var _a, _b;
            object.filterType = (_a = object.filterType) !== null && _a !== void 0 ? _a : 'number';
            object.filterText = (_b = object.filterText) !== null && _b !== void 0 ? _b : '';
            return {
                editor: () => {
                    return gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                return [
                                    EditorElem.select({
                                        title: '過濾類型',
                                        gvc: gvc,
                                        def: object.filterType,
                                        array: [
                                            { title: '數字', value: "number" },
                                            { title: '自訂字表達式', value: "custom" }
                                        ],
                                        callback: (text) => {
                                            object.filterType = text;
                                            gvc.notifyDataChange(id);
                                        }
                                    }),
                                    ...(() => {
                                        if (object.filterType === 'custom') {
                                            return [EditorElem.editeInput({
                                                    gvc: gvc,
                                                    title: '正則表達式',
                                                    default: object.filterText,
                                                    placeHolder: `請輸入正則表達式`,
                                                    callback: (text) => {
                                                        object.filterText = text;
                                                        widget.refreshComponent();
                                                    }
                                                })];
                                        }
                                        else {
                                            return [];
                                        }
                                    })()
                                ].join('<div class="my-2"></div>');
                            }
                        };
                    });
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        if (object.filterType === 'number') {
                            element.e.value = element.e.value.replace(/[^0-9]/g, '');
                        }
                        else {
                            const regexStringFromBackend = object.filterText;
                            const regex = new RegExp(regexStringFromBackend, 'g');
                            element.e.value = element.e.value.replace(regex, '');
                        }
                        resolve(subData);
                    }));
                },
            };
        },
    };
});
