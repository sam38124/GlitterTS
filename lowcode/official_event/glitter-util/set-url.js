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
            object.key = (_a = object.key) !== null && _a !== void 0 ? _a : "";
            object.value = (_b = object.value) !== null && _b !== void 0 ? _b : "";
            return {
                editor: () => {
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
                        EditorElem.editeInput({
                            gvc: gvc,
                            title: '參數',
                            placeHolder: `請輸入VALUE`,
                            default: object.value,
                            callback: (text) => {
                                object.value = text;
                            }
                        })
                    ].join('');
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        gvc.glitter.setUrlParameter(object.key, object.value);
                        resolve(true);
                    }));
                },
            };
        },
    };
});
