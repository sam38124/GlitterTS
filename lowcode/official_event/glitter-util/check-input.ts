import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.filterType = object.filterType ?? 'number'
            object.filterText = object.filterText ?? ''
            return {
                editor: () => {
                    return gvc.bindView(() => {
                        const id = gvc.glitter.getUUID()
                        return {
                            bind: id,
                            view: () => {
                                return [
                                    EditorElem.select({
                                        title: '過濾類型',
                                        gvc: gvc,
                                        def: object.filterType,
                                        array: [
                                            {title: '數字', value: "number"},
                                            {title: '自訂字表達式', value: "custom"}
                                        ],
                                        callback: (text) => {
                                            object.filterType = text
                                            gvc.notifyDataChange(id)
                                        }
                                    }),
                                    ...(() => {
                                        if (object.filterType === 'custom') {
                                            return EditorElem.editeInput({
                                                gvc: gvc,
                                                title: '正則表達式',
                                                default: object.filterText,
                                                placeHolder: `請輸入正則表達式`,
                                                callback: (text) => {
                                                    object.filterText = text
                                                    widget.refreshComponent()
                                                }
                                            })
                                        } else {
                                            return ``
                                        }
                                    })()
                                ].join('<div class="my-2"></div>')
                            }
                        }
                    })
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        if (object.filterType === 'number') {
                            element!.e.value = element!.e.value.replace(/[^0-9]/g, '');

                        } else {
                            const regexStringFromBackend = object.filterText;
                            // 动态创建正则表达式对象
                            const regex = new RegExp(regexStringFromBackend, 'g');
                            element!.e.value = element!.e.value.replace(regex, '');
                        }
                        resolve(subData)
                    })
                },
            };
        },
    };
});

