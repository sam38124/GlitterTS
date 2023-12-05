import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";
import {ApiUser} from "../../glitter-base/route/user.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.pwdResource = object.pwdResource ?? {}
            object.sendSuccess=object.sendSuccess ?? {}
            object.sendError=object.sendError ?? {}
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.pwdResource, {
                            hover: false,
                            option: [],
                            title: "取得信箱資料"
                        }),
                        TriggerEvent.editer(gvc, widget, object.sendSuccess, {
                            hover: false,
                            option: [],
                            title: "寄送成功"
                        }),
                        TriggerEvent.editer(gvc, widget, object.sendError, {
                            hover: false,
                            option: [],
                            title: "寄送失敗"
                        }),
                    ].join('<div class="my-2"></div>')
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const data = await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.pwdResource
                        })
                        if (data) {
                            ApiUser.forgetPwd(data as string)?.then(async (r) => {
                                if (!r.response.result) {
                                    await TriggerEvent.trigger({
                                        gvc: gvc, widget: widget, clickEvent: object.sendError
                                    })
                                }else{
                                    await TriggerEvent.trigger({
                                        gvc: gvc, widget: widget, clickEvent: object.sendSuccess
                                    })
                                }
                                resolve(r.response.result)
                            })
                        }else{
                            await TriggerEvent.trigger({
                                gvc: gvc, widget: widget, clickEvent: object.sendError
                            })
                            resolve(false)
                        }
                    })
                },
            };
        },
    };
});

