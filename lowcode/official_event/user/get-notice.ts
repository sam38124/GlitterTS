import {GlobalUser} from "../../glitter-base/global/global-user.js";
import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {ApiUser} from "../../glitter-base/route/user.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.page = object.page ?? {}
            object.limit = object.limit ?? {}
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.page, {title: "當前頁面", hover: false, option: []}),
                        TriggerEvent.editer(gvc, widget, object.limit, {title: "每頁筆數", hover: false, option: []}),
                    ].join('<div class="my-2"></div>')
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
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
                        const data = (await ApiUser.getNotice({
                            page: page as any,
                            limit: limit as any
                        })).response
                        console.log(`notice_data->`,data)
                        resolve(data)
                    })

                },
            };
        },
    };
});

