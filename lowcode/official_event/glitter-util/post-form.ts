import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";
import {ApiPost} from "../../glitter-base/route/post.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            object.formData = object.formData ?? {}
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.formData, {
                            hover: false,
                            option: [],
                            title: "取得發佈內容"
                        })
                    ].join('<div class="my-2"></div>')
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const formData = await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.formData, subData: subData
                        })
                        ApiPost.post({
                            postData: formData,
                            type: 'normal'
                        }).then((res) => {
                            if (res && res.response.result) {
                                resolve(true)
                            } else {
                                resolve(false)
                            }
                        })
                    })
                },
            };
        },
    };
});

