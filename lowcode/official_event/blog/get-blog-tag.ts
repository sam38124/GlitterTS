import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {Chat} from "../../glitter-base/route/chat.js";
import {Article} from "../../glitter-base/route/article.js";

TriggerEvent.createSingleEvent(import.meta.url, (glitter) => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.tag=object.tag??{}
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.tag, {title: "取得標籤", hover: false, option: []})
                    ].join('<div class="my-2"></div>')
                },
                event: () => {

                    return new Promise<any>(async (resolve, reject) => {
                        const tag = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.tag,
                            subData: subData
                        })
                        Article.get({
                            page: 0 as any,
                            limit: 10 as any,
                            tag:tag as any
                        }).then(async (data) => {
                            resolve(data.response.data[0])
                        })
                    })
                }
            }
        }
    }
})