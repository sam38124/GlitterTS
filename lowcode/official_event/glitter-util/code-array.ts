import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {NormalPageEditor} from "../../editor/normal-page-editor.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun:  (gvc, widget, object, subData, element) => {
            return {
                editor: () => {
                    return gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                object.eventList = object.eventList ?? [];
                                try {
                                    return EditorElem.arrayItem({
                                        originalArray: object.eventList,
                                        gvc: gvc,
                                        title: '',
                                        array: () => {
                                            return object.eventList.map((dd: any, index: number) => {
                                                dd.yesEvent = dd.yesEvent ?? {};
                                                dd.trigger = dd.trigger ?? {};
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
                                                                        return `<div class="p-2">${[
                                                                            gvc.glitter.htmlGenerate.editeInput({
                                                                                gvc: gvc,
                                                                                title: '事件標題',
                                                                                default: dd.title ?? '',
                                                                                placeHolder: '請輸入事件標題',
                                                                                callback: (text: string) => {
                                                                                    dd.title = text;
                                                                                    // gvc.notifyDataChange(id)
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
                                                object.eventList.push({yesEvent: {}, trigger: {}});
                                                gvc.notifyDataChange(id);
                                            }),
                                        },
                                        refreshComponent: () => {
                                            gvc.notifyDataChange(id);
                                        },
                                        customEditor: true,
                                    });
                                } catch (e) {
                                    return ``;
                                }
                            },
                            divCreate: {},
                        };
                    });
                },
                event: () => {
                    return new Promise<any>(async (resolve, reject) => {
                        try {
                            for (const a of object.eventList) {
                                const result = await TriggerEvent.trigger({
                                    gvc: gvc,
                                    widget: widget,
                                    clickEvent: a.yesEvent,
                                    subData: subData,
                                    element: element,
                                });
                                if (result) {
                                    const response = await TriggerEvent.trigger({
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
                        } catch (e) {
                            resolve(object.errorCode ?? false);
                        }
                    });
                },
            };
        },
    }
})