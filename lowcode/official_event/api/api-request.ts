import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {BaseApi} from "../../glitterBundle/api/base.js";

TriggerEvent.createSingleEvent(import.meta.url, (glitter) => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.data = object.data ?? {}
            object.success = object.success ?? {}
            object.error = object.error ?? {}
            const html = String.raw
            return {
                editor: () => {
                    return [
                        html`
                            <div class="alert alert-secondary" style="white-space: normal;word-break: break-all;">
                                請求資料格式範例-><br>
                                {<br>
                                "url": 'https://sampleurl/com',<br>
                                "type": "GET",<br>
                                "timeout": 0,<br>
                                "headers": {<br>
                                "Content-Type": "application/json"<br>
                                }<br>
                                }
                            </div>
                        `,
                        TriggerEvent.editer(gvc, widget, object.data, {
                            hover: false,
                            option: [],
                            title: '設定請求資料'
                        }),
                        TriggerEvent.editer(gvc, widget, object.success, {
                            hover: false,
                            option: [],
                            title: '請求成功'
                        }),
                        TriggerEvent.editer(gvc, widget, object.error, {
                            hover: false,
                            option: [],
                            title: '請求失敗'
                        }),
                    ].join('<div class="my-2"></div>')
                },
                event: () => {
                    return new Promise<any>(async (resolve, reject) => {
                        const req = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.data,
                            subData: subData,
                            element: element
                        })
                        try {
                            const data = await BaseApi.create(req)
                            if (data.result) {
                                resolve((await TriggerEvent.trigger({
                                    gvc: gvc,
                                    widget: widget,
                                    clickEvent: object.success,
                                    subData: data.response,
                                    element: element
                                })) || data.response)
                            } else {
                                resolve((await TriggerEvent.trigger({
                                    gvc: gvc,
                                    widget: widget,
                                    clickEvent: object.error,
                                    subData: data.response,
                                    element: element
                                })) || false)
                            }
                        } catch (e) {
                            console.log(`request-error`,e)
                            resolve(false)
                        }
                    })
                }
            }
        }
    }
})