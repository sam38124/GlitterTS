import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";
import {ApiUser} from "../../glitter-base/route/user.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.resetPwd = object.resetPwd ?? {}
            object.confirmPwd = object.confirmPwd ?? {}
            object.success = object.success ?? {}
            object.error = object.error ?? {}
            object.errorText = object.errorText ?? {}
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.resetPwd, {
                            hover: false,
                            option: [],
                            title: "取得新密碼"
                        }),
                        TriggerEvent.editer(gvc, widget, object.confirmPwd, {
                            hover: false,
                            option: [],
                            title: "取得確認密碼"
                        }),
                        TriggerEvent.editer(gvc, widget, object.errorText, {
                            hover: false,
                            option: [],
                            title: "密碼確認失敗"
                        }),
                        TriggerEvent.editer(gvc, widget, object.success, {
                            hover: false,
                            option: [],
                            title: "重設成功"
                        }),
                        TriggerEvent.editer(gvc, widget, object.error, {
                            hover: false,
                            option: [],
                            title: "重設失敗"
                        })
                    ].join('<div class="my-2"></div>')
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const resetPwd = await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.resetPwd
                        }) as any
                        const confirmPwd = await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.confirmPwd
                        }) as any
                        if (resetPwd !== confirmPwd) {
                            await TriggerEvent.trigger({
                                gvc: gvc, widget: widget, clickEvent: object.errorText
                            }) as any
                            resolve(false)
                        } else {
                            ApiUser.resetPwd(resetPwd)?.then(async (r) => {
                                if (!r.result || !r.response.result) {
                                    await TriggerEvent.trigger({
                                        gvc: gvc, widget: widget, clickEvent: object.error
                                    }) as any
                                } else {
                                    await TriggerEvent.trigger({
                                        gvc: gvc, widget: widget, clickEvent: object.success
                                    }) as any
                                }
                                resolve(r.response.result)
                            })
                        }

                    })
                },
            };
        },
    };
});

