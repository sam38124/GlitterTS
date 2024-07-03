import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";
import {ApiUser} from "../../glitter-base/route/user.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.resetPwd = object.resetPwd ?? {}
            object.code = object.code ?? {}
            object.success = object.success ?? {}
            object.error = object.error ?? {}
            object.user_id=object.user_id??{}
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.user_id, {
                            hover: false,
                            option: [],
                            title: "取得帳號或USERID"
                        }),
                        TriggerEvent.editer(gvc, widget, object.resetPwd, {
                            hover: false,
                            option: [],
                            title: "取得新密碼"
                        }),
                        TriggerEvent.editer(gvc, widget, object.code, {
                            hover: false,
                            option: [],
                            title: "取得驗證碼"
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
                        const pwd :any= await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.resetPwd
                        })
                        const code:any = await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.code
                        })
                        const user_id :any= await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.user_id
                        });
                        ApiUser.resetPwdV2(user_id,code,pwd)?.then(async (r) => {
                            if (!r.response.result) {
                                await TriggerEvent.trigger({
                                    gvc: gvc, widget: widget, clickEvent: object.error
                                })
                            } else {
                                await TriggerEvent.trigger({
                                    gvc: gvc, widget: widget, clickEvent: object.success
                                })
                            }
                            resolve(r.response.result)
                        })
                    })
                },
            };
        },
    };
});

