import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {ApiPost} from "../../glitter-base/route/post.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";

TriggerEvent.createSingleEvent(import.meta.url, (glitter) => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.get_data = object.get_data ?? {}
            object.page = object.page ?? {}
            object.limit = object.limit ?? {}
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.get_data, {
                            hover: false,
                            option: [],
                            title: '查詢內容'
                        }),
                        TriggerEvent.editer(gvc, widget, object.page, {
                            hover: false,
                            option: [],
                            title: '查訊頁數'
                        }),
                        TriggerEvent.editer(gvc, widget, object.limit, {
                            hover: false,
                            option: [],
                            title: '筆數限制'
                        })
                    ].join('<div class="my-2"></div>')
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const search: any = (await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.get_data,
                            subData: subData,
                            element: element
                        }));
                        const page: any = (await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.page,
                            subData: subData,
                            element: element
                        })) || 0;
                        const limit: any = (await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.limit,
                            subData: subData,
                            element: element
                        })) || 10;
                        ApiPost.getV2({
                            search: search,
                            page: page,
                            limit: limit
                        }).then((res) => {
                            if (res.result) {
                                resolve(res.response)
                            } else {
                                resolve(false)
                            }
                        })
                    })

                }
            }
        }
    }
})