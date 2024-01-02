import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.success = object.success ?? {}
            object.error = object.error ?? {}
            object.code = object.code ?? {}
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.code, {
                            hover: false,
                            option: [],
                            title: '優惠券來源'
                        }),
                        TriggerEvent.editer(gvc, widget, object.success, {
                            hover: false,
                            option: [],
                            title: '優惠券新增成功'
                        }),
                        TriggerEvent.editer(gvc, widget, object.error, {
                            hover: false,
                            option: [],
                            title: '優惠券新增失敗'
                        })
                    ].join(`<div class="my-2"></div>`)
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const code = (await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.code,
                            element: element
                        })) || (await ApiShop.getVoucherCode()) || ''
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
                                code: code as string
                            }).then(async (res) => {
                                if (res.result && res.response.data.voucherList.find((dd: any) => {
                                    return code && (dd.code === code)
                                })) {
                                    await ApiShop.setVoucherCode(code as string)
                                    await TriggerEvent.trigger({
                                        gvc: gvc,
                                        widget: widget,
                                        clickEvent: object.success
                                    })
                                } else {
                                    await ApiShop.setVoucherCode('')
                                    await TriggerEvent.trigger({
                                        gvc: gvc,
                                        widget: widget,
                                        clickEvent: object.error
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

