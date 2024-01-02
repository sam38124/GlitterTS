import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {ApiWallet} from "../../glitter-base/route/wallet.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.total = object.total ?? {}
            object.note = object.note ?? {}
            object.code = object.code ?? {}
            object.number = object.number ?? {}
            object.success = object.success ?? {}
            object.error = object.error ?? {}
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.total, {
                            hover: false,
                            option: [],
                            title: '提領金額'
                        }),
                        TriggerEvent.editer(gvc, widget, object.note, {
                            hover: false,
                            option: [],
                            title: '備註內容'
                        }),
                        TriggerEvent.editer(gvc, widget, object.code, {
                            hover: false,
                            option: [],
                            title: '撥款銀行代號'
                        }),
                        TriggerEvent.editer(gvc, widget, object.number, {
                            hover: false,
                            option: [],
                            title: '撥款銀行帳戶'
                        }),
                        TriggerEvent.editer(gvc, widget, object.success, {
                            hover: false,
                            option: [],
                            title: '送審成功'
                        }),
                        TriggerEvent.editer(gvc, widget, object.error, {
                            hover: false,
                            option: [],
                            title: '送審失敗'
                        })
                    ].join(`<div class="my-2"></div>`)
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const total = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.total
                        })
                        const note = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.note
                        })
                        const number = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.number
                        })
                        const code = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.code
                        })
                        ApiWallet.withdraw({
                            total: total as number,
                            note: {
                                note: note,
                                code: code,
                                number: number
                            }
                        }).then(async (res) => {
                            if (res.response && res.response.result) {
                                await TriggerEvent.trigger({
                                    gvc: gvc,
                                    widget: widget,
                                    clickEvent: object.success
                                })
                            } else {
                                await TriggerEvent.trigger({
                                    gvc: gvc,
                                    widget: widget,
                                    clickEvent: object.error
                                })
                            }
                            resolve(res.response && res.response.result)
                        })
                    })
                },
            };
        }
    }
})