import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {

            return {
                editor: () => {

                    return ``
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
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
                            const voucher = await ApiShop.getVoucherCode()
                            const rebate = (await ApiShop.getRebateValue()) || 0
                            ApiShop.getCheckout({
                                line_items: cartData.line_items.map((dd) => {
                                    return {
                                        id: dd.id,
                                        spec: dd.spec,
                                        count: dd.count
                                    }
                                }),
                                code: voucher as string,
                                use_rebate: GlobalUser.token && parseInt(rebate as string, 10)
                            }).then((res) => {
                                if (res.result) {
                                    let total=0
                                    res.response.data.lineItems.map((dd:any)=>{
                                        total+=dd.count
                                    })
                                    resolve(total)
                                } else {
                                    resolve(0)
                                }
                            })

                        })
                    })
                },
            };
        },
    };
});

