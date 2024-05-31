import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {ApiWallet} from "../../glitter-base/route/wallet.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.saveMoney = object.saveMoney ?? {}
            object.error=object.error??{}
            object.payMethod=object.payMethod??{}
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.saveMoney, {
                            hover: false,
                            option: [],
                            title: '儲值金額'
                        }),
                        TriggerEvent.editer(gvc, widget, object.payMethod, {
                            hover: false,
                            option: [],
                            title: '付款方式'
                        }),
                        TriggerEvent.editer(gvc, widget, object.error, {
                            hover: false,
                            option: [],
                            title: '儲值失敗事件'
                        })
                    ].join(`<div class="my-2"></div>`)
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const saveMoney = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.saveMoney
                        });
                        const payMethod= await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.payMethod
                        });
                        ApiWallet.store({
                            total: saveMoney as number,
                            method:payMethod,
                            note: {},
                            return_url:location.href
                        }).then(async (res) => {
                            if(res.response.form){
                                $('body').html(res.response.form)
                                setTimeout(() => {
                                    console.log((document.querySelector('#submit') as any).click())
                                }, 1000)
                            }else{
                                 await TriggerEvent.trigger({
                                    gvc: gvc,
                                    widget: widget,
                                    clickEvent: object.error
                                })
                            }
                            resolve(false)

                        })
                    })
                },
            };
        }
    }
})