import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {ApiWallet} from "../../glitter-base/route/wallet.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.page = object.page ?? {}
            object.limit = object.limit ?? {}
            object.get_type_event= object.get_type_event || {}
            object.get_start_date = object.get_start_date || {}
            return {
                editor: () => {
                    return [TriggerEvent.editer(gvc, widget, object.page, {
                        hover: false,
                        option: [],
                        title: '頁面'
                    }),
                        TriggerEvent.editer(gvc, widget, object.limit, {
                            hover: false,
                            option: [],
                            title: '筆數'
                        }),
                        TriggerEvent.editer(gvc, widget, object.get_type_event, {
                            hover: false,
                            option: [],
                            title: '取得類型'
                        }),
                        TriggerEvent.editer(gvc, widget, object.get_start_date, {
                            hover: false,
                            option: [],
                            title: '過濾開始時間'
                        })
                    ].join('<div class="my-2"></div>')
                },
                event: () => {

                    return new Promise(async (resolve, reject) => {
                        const page = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.page
                        });
                        const limit = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.limit
                        });
                        const type = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.get_type_event
                        });
                        const get_start_date=await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.get_start_date
                        });
                        ApiWallet.getWalletMemory({
                            page:page as any,
                            limit:limit as any,
                            type:type as any,
                            start_date:(get_start_date  || '') as any
                        }).then(async (res) => {
                            resolve(res.result && res.response.data)
                        })
                    })
                },
            };
        }
    }
})