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
            var _a, _b, _c, _d, _e;
            object.formID = (_a = object.formID) !== null && _a !== void 0 ? _a : "";
            object.finish = (_b = object.finish) !== null && _b !== void 0 ? _b : {};
            object.notFinish = (_c = object.notFinish) !== null && _c !== void 0 ? _c : {};
            object.form_id_from = (_d = object.form_id_from) !== null && _d !== void 0 ? _d : 'static';
            object.getFormID = (_e = object.getFormID) !== null && _e !== void 0 ? _e : {};
            return {
                editor: () => {
                    return gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                return [
                                    EditorElem.select({
                                        title: '表單ID來源',
                                        gvc: gvc,
                                        array: [
                                            { title: '靜態', value: 'static' },
                                            { title: '動態', value: 'code' }
                                        ],
                                        def: object.form_id_from,
                                        callback: (text) => {
                                            object.form_id_from = text;
                                            gvc.notifyDataChange(id);
                                        }
                                    }),
                                    (() => {
                                        if (object.form_id_from === 'code') {
                                            return TriggerEvent.editer(gvc, widget, object.getFormID, {
                                                hover: false,
                                                option: [],
                                                title: "設定表單ID來源"
                                            });
                                        }
                                        else {
                                            return EditorElem.editeInput({
                                                gvc: gvc,
                                                title: '表單ID',
                                                placeHolder: `請輸入表單ID`,
                                                default: object.formID,
                                                callback: (text) => {
                                                    object.formID = text;
                                                    widget.refreshComponent();
                                                }
                                            });
                                        }
                                    })(),
                                    TriggerEvent.editer(gvc, widget, object.finish, {
                                        hover: false,
                                        option: [],
                                        title: "已填寫完畢事件"
                                    }),
                                    TriggerEvent.editer(gvc, widget, object.notFinish, {
                                        hover: false,
                                        option: [],
                                        title: "未填寫完畢事件"
                                    })
                                ].join('<div class="my-2"></div>');
                            }
                        };
                    });
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        let formID = '';
                        if (object.form_id_from === 'code') {
                            formID = yield TriggerEvent.trigger({
                                gvc: gvc, widget: widget, clickEvent: object.getFormID, subData: subData
                            });
                        }
                        else {
                            formID = object.formID;
                        }
                        const result = document.querySelector(`.formID-${formID}`).checkEditFinish();
                        if (result) {
                            yield TriggerEvent.trigger({
                                gvc: gvc, widget: widget, clickEvent: object.finish, subData: subData
                            });
                        }
                        else {
                            yield TriggerEvent.trigger({
                                gvc: gvc, widget: widget, clickEvent: object.notFinish, subData: subData
                            });
                        }
                        resolve(result);
                    }));
                },
            };
        },
    };
});
