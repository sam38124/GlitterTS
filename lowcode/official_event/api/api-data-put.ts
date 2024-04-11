import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {ShareDialog} from "../../glitterBundle/dialog/ShareDialog.js";
import {BaseApi} from "../../glitterBundle/api/base.js";
import {ApiPost} from "../../glitter-base/route/post.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";

TriggerEvent.createSingleEvent(import.meta.url, (glitter) => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.post_data = object.post_data ?? {};
            const html = String.raw
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.post_data, {
                            hover: false,
                            option: [],
                            title: '更新內容'
                        })
                    ].join('<div class="my-2"></div>')
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const postData: any = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.post_data,
                            subData: subData,
                            element: element
                        });
                        ApiPost.put({
                            postData: postData,
                            token: GlobalUser.token,
                            type: 'normal'
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