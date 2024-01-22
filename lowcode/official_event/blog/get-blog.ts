import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {Chat} from "../../glitter-base/route/chat.js";
import {Article} from "../../glitter-base/route/article.js";

TriggerEvent.createSingleEvent(import.meta.url, (glitter) => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.page = object.page ?? {}
            object.limit = object.limit ?? {}
            object.pageCount = object.pageCount ?? {}
            object.label = object.label ?? {}
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.page, {title: "當前頁面", hover: false, option: []}),
                        TriggerEvent.editer(gvc, widget, object.limit, {title: "每頁筆數", hover: false, option: []}),
                        TriggerEvent.editer(gvc, widget, object.pageCount, {
                            title: "總頁數返回",
                            hover: false,
                            option: []
                        }),
                        TriggerEvent.editer(gvc, widget, object.label, {title: "文章標籤", hover: false, option: []})
                    ].join('<div class="my-2"></div>')
                },
                event: () => {

                    return new Promise<any>(async (resolve, reject) => {

                        let page = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.page,
                            subData: subData
                        })
                        const limit = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.limit,
                            subData: subData
                        })
                        const label = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.label,
                            subData: subData
                        })
                        Article.get({
                            page: page as any,
                            limit: limit as any,
                            label:label as string
                        }).then(async (data) => {
                            await TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.pageCount,
                                subData: Math.ceil(data.response.total / parseInt(limit as string, 10))
                            })
                            resolve(data.response.data)
                        })
                    })
                }
            }
        }
    }
})