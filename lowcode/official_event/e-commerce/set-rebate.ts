import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.rebate = object.rebate ?? {}
            object.rebateError = object.rebateError ?? {}
            object.rebateSuccess = object.rebateSuccess ?? {}
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.rebate, {
                            hover: false,
                            option: [],
                            title: '回饋金來源'
                        }),
                        TriggerEvent.editer(gvc, widget, object.rebateSuccess, {
                            hover: false,
                            option: [],
                            title: '回饋金使用成功'
                        }),
                        TriggerEvent.editer(gvc, widget, object.rebateError, {
                            hover: false,
                            option: [],
                            title: '回饋金不足'
                        })
                    ].join(`<div class="my-2"></div>`)
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const rebate = (await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.rebate,
                            element: element
                        })) || (await ApiShop.getRebateValue()) || 0;
                        ApiShop.getCart().then(async (res: any) => {

                            const cartData: {
                                line_items: {
                                    "sku": string,
                                    "spec": string[],
                                    "stock": number,
                                    "sale_price": number,
                                    "compare_price": number,
                                    "preview_image": string,
                                    "title": string,
                                    "id": number,
                                    "count": number
                                }[],
                                total: number
                            } = {
                                line_items: [],
                                total: 0
                            }

                            for (const b of Object.keys(res)) {
                                cartData.line_items.push({
                                    id: b.split('-')[0] as any,
                                    count: res[b] as number,
                                    spec: b.split('-').filter((dd, index) => {
                                        return index !== 0
                                    }) as any
                                } as any)
                            }
                            ApiShop.getCheckout({
                                line_items: cartData.line_items.map((dd) => {
                                    return {
                                        id: dd.id,
                                        spec: dd.spec,
                                        count: dd.count
                                    }
                                }),
                                use_rebate: parseInt(rebate as string,10)
                            }).then(async (res) => {
                                if (res.result && res.response.data.use_rebate) {
                                    await ApiShop.setRebateValue(`${rebate}`)
                                    TriggerEvent.trigger({
                                        gvc: gvc,
                                        widget: widget,
                                        clickEvent: object.rebateSuccess,
                                        subData:res.response.data,
                                        element:element
                                    })
                                } else {
                                    await ApiShop.setRebateValue('')
                                    TriggerEvent.trigger({
                                        gvc: gvc,
                                        widget: widget,
                                        clickEvent: object.rebateError,
                                        subData:res.response.data,
                                        element:element
                                    })
                                }
                                resolve(res.response.data)
                            })

                        })
                    })
                },
            };
        },
    };
});

