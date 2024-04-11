import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {GlobalEvent} from "../../glitterBundle/api/global-event.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";


TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.key = object.key ?? ""
            object.event = object.event ?? {}
            return {
                editor: () => {
                    return [
                        gvc.bindView(() => {
                            const id = gvc.glitter.getUUID()
                            return {
                                bind: id,
                                view: () => {
                                    return new Promise(async (resolve, reject) => {
                                        const data = await GlobalEvent.getGlobalEvent({})
                                        resolve(EditorElem.select({
                                            title: '選擇事件',
                                            gvc: gvc,
                                            def: object.key,
                                            array: [
                                                {
                                                    title: '選擇事件集', value: ''
                                                }
                                            ].concat(data.response.result.sort((function (a: any, b: any) {
                                                if (a.group.toUpperCase() < b.group.toUpperCase()) {
                                                    return -1;
                                                }
                                                if (a.group.toUpperCase() > b.group.toUpperCase()) {
                                                    return 1;
                                                }
                                                return 0;
                                            })).map((dd: any) => {
                                                return {
                                                    title: `${dd.group}-${dd.name}`, value: dd.tag
                                                }
                                            })),
                                            callback: (text: string) => {
                                                object.key = text
                                            },
                                        }))
                                    })
                                }
                            }
                        }),
                        TriggerEvent.editer(gvc, widget, object.event, {
                            hover: false,
                            option: [],
                            title: "夾帶資料"
                        })
                    ].join(`<div class="my-2"></div>`)
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const sub = await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.event, subData: subData, element: element
                        })
                        GlobalEvent.getGlobalEvent({
                            tag: object.key
                        }).then(async (dd) => {
                            try {
                                const event = dd.response.result[0]
                                const response = await TriggerEvent.trigger({
                                    gvc: gvc,
                                    widget: widget,
                                    clickEvent: event.json,
                                    subData: sub,
                                    element: element
                                })
                                resolve(response)
                            } catch (e) {
                                resolve(false)
                            }
                        })
                    })
                },
            };
        },
    };
});

