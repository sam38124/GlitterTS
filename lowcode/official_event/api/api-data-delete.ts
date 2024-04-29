import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {ShareDialog} from "../../glitterBundle/dialog/ShareDialog.js";
import {BaseApi} from "../../glitterBundle/api/base.js";
import {ApiPost} from "../../glitter-base/route/post.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";

TriggerEvent.createSingleEvent(import.meta.url, (glitter) => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.delete_id = object.delete_id ?? {};
            const html = String.raw
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.delete_id, {
                            hover: false,
                            option: [],
                            title: '取得刪除ID'
                        })
                    ].join('<div class="my-2"></div>')
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const id: any = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.delete_id,
                            subData: subData,
                            element: element
                        });
                        ApiPost.delete({
                            id:id
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