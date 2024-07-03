import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiUser} from "../../glitter-base/route/user.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.pwdResource = object.pwdResource ?? {}
            object.sendSuccess = object.sendSuccess ?? {}
            object.sendError = object.sendError ?? {}
            object.code = object.code ?? {}
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.pwdResource, {
                            hover: false,
                            option: [],
                            title: "取得信箱資料"
                        }),
                        TriggerEvent.editer(gvc, widget, object.code, {
                            hover: false,
                            option: [],
                            title: "請輸入驗證碼"
                        }),
                        TriggerEvent.editer(gvc, widget, object.sendSuccess, {
                            hover: false,
                            option: [],
                            title: "確認成功"
                        }),
                        TriggerEvent.editer(gvc, widget, object.sendError, {
                            hover: false,
                            option: [],
                            title: "確認失敗"
                        }),
                    ].join('<div class="my-2"></div>')
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const data = await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.pwdResource
                        })
                        const code = await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.code
                        })
                        if (data) {
                            ApiUser.forgetPwdCheckCode(data as string, code as string)?.then(async (r) => {
                                if (!r.response.result) {
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
                        } else {
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

