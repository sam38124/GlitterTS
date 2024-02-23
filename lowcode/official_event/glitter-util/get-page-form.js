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
            object.type = (_b = object.type) !== null && _b !== void 0 ? _b : 'tag';
            return {
                editor: () => {
                    return gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                var _a;
                                return [
                                    EditorElem.select({
                                        title: '取得項目',
                                        gvc: gvc,
                                        def: (_a = object.type) !== null && _a !== void 0 ? _a : 'tag',
                                        array: [
                                            {
                                                title: '全部', value: 'all',
                                            },
                                            {
                                                title: '依照標籤', value: 'tag',
                                            }
                                        ],
                                        callback: (text) => {
                                            object.type = text;
                                            gvc.notifyDataChange(id);
                                        }
                                    }),
                                    (object.type === 'tag') ?
                                        EditorElem.editeInput({
                                            gvc: gvc,
                                            title: 'Key值',
                                            placeHolder: `請輸入Key值`,
                                            default: object.key,
                                            callback: (text) => {
                                                object.key = text;
                                            }
                                        }) : ``
                                ].join('<div class="my-2"></div>');
                            }
                        };
                    });
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        if (!widget.formData) {
                            resolve(false);
                        }
                        else {
                            if (object.type === 'all') {
                                resolve(widget.formData);
                            }
                            else {
                                resolve(widget.formData[object.key]);
                            }
                        }
                    }));
                },
            };
        },
    };
});
