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
import { FormWidget } from "../../official_view_component/official/form.js";
import { getInitialData } from "../../official_view_component/initial_data.js";
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            var _a, _b;
            object.formID = (_a = object.formID) !== null && _a !== void 0 ? _a : "";
            object.formFROM = (_b = object.formFROM) !== null && _b !== void 0 ? _b : "code";
            const config = getInitialData({
                obj: object,
                key: 'formSetting',
                def: {
                    array: [
                        {
                            title: '標題', key: '', readonly: 'read', type: 'text', require: "true",
                            style_data: {
                                label: {
                                    class: `form-label fs-base `,
                                    style: ``
                                },
                                input: {
                                    class: ``,
                                    style: ``
                                },
                                container: {
                                    class: ``,
                                    style: ``
                                }
                            }
                        }
                    ],
                    style: {},
                    formID: 'formID',
                    formData: {}
                },
            });
            return {
                editor: () => {
                    return gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                return [
                                    EditorElem.select({
                                        title: '表單來源',
                                        gvc: gvc,
                                        def: object.formFROM,
                                        array: [
                                            {
                                                title: '表單ID',
                                                value: 'code'
                                            },
                                            {
                                                title: '自定義',
                                                value: 'custom'
                                            }
                                        ],
                                        callback: (text) => {
                                            object.formFROM = text;
                                            gvc.notifyDataChange(id);
                                        }
                                    }),
                                    ...(() => {
                                        const append = [];
                                        if (object.formFROM === 'code') {
                                            append.push(EditorElem.editeInput({
                                                gvc: gvc,
                                                title: '表單ID',
                                                default: object.formID,
                                                placeHolder: `請輸入表單ID`,
                                                callback: (text) => {
                                                    object.formID = text;
                                                    widget.refreshComponent();
                                                }
                                            }));
                                        }
                                        else {
                                            append.push(gvc.bindView(() => {
                                                const id = gvc.glitter.getUUID();
                                                const vm = {
                                                    page: 'setting'
                                                };
                                                return {
                                                    bind: id,
                                                    view: () => {
                                                        return [
                                                            `<div class="d-flex border-bottom ">
                                                            <div class="add_item_button ${(vm.page === 'form') ? `add_item_button_active` : ``}" onclick="${gvc.event(() => {
                                                                vm.page = 'form';
                                                                gvc.notifyDataChange(id);
                                                            })}">資料填寫</div>
                                                            <div class=" add_item_button ${(vm.page === 'setting') ? `add_item_button_active` : ``}" onclick="${gvc.event(() => {
                                                                vm.page = 'setting';
                                                                gvc.notifyDataChange(id);
                                                            })}">格式設定</div>
                                                        </div>`,
                                                            ...(() => {
                                                                const ap = [];
                                                                if (vm.page === 'setting') {
                                                                    ap.push(FormWidget.settingView({
                                                                        gvc: gvc,
                                                                        array: config.array,
                                                                        refresh: () => {
                                                                            gvc.notifyDataChange(id);
                                                                        }
                                                                    }));
                                                                }
                                                                else {
                                                                    ap.push(`<div class="p-2">
${FormWidget.editorView({
                                                                        gvc: gvc,
                                                                        array: config.array,
                                                                        refresh: () => {
                                                                            gvc.notifyDataChange(id);
                                                                        },
                                                                        formData: config.formData
                                                                    })}
</div>`);
                                                                }
                                                                return ap.join('');
                                                            })()
                                                        ].join('');
                                                    },
                                                    divCreate: {
                                                        class: `mx-n2 border-top mt-3`
                                                    }
                                                };
                                            }));
                                        }
                                        return append.join('');
                                    })()
                                ].join('');
                            }
                        };
                    });
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        if (object.formFROM === 'code') {
                            resolve(document.querySelector(`.formID-${object.formID}`).formValue());
                        }
                        else {
                            resolve(config.formData);
                        }
                    }));
                },
            };
        },
    };
});
