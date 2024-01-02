import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {ApiUser} from "../../glitter-base/route/user.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.email = object.email ?? {}
            object.sendSuccess = object.sendSuccess ?? {}
            object.sendError = object.sendError ?? {}
            object.tag=object.tag ??{}
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.email, {
                            hover: false,
                            option: [],
                            title: "取得信箱資料"
                        }),
                        TriggerEvent.editer(gvc, widget, object.tag, {
                            hover: false,
                            option: [],
                            title: "取得標籤"
                        }),
                        TriggerEvent.editer(gvc, widget, object.sendSuccess, {
                            hover: false,
                            option: [],
                            title: "訂閱成功事件"
                        }),
                        TriggerEvent.editer(gvc, widget, object.sendError, {
                            hover: false,
                            option: [],
                            title: "訂閱失敗事件"
                        }),
                    ].join('<div class="my-2"></div>')
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const data = await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.email
                        })
                        const tag = await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.tag
                        })
                        ApiUser.subScribe(data as string,tag as string)?.then(async (r) => {
                            if (!r.result || !r.response.result) {
                                await TriggerEvent.trigger({
                                    gvc: gvc, widget: widget, clickEvent: object.sendError
                                })
                            } else {
                                await TriggerEvent.trigger({
                                    gvc: gvc, widget: widget, clickEvent: object.sendSuccess
                                })
                            }
                            resolve(r.response.result)
                        })
                    })
                }
            }
        }
    }
})