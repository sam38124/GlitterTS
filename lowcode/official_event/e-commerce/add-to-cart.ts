import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.count = object.count ?? {}
            object.pdid = object.pdid ?? {}

            return {
                editor: () => {
                    return EditorElem.container([TriggerEvent.editer(gvc, widget, object.pdid, {
                        title: `商品ID來源[ProductId-VIndex]`,
                        hover: false,
                        option: []
                    }),
                        TriggerEvent.editer(gvc, widget, object.count, {
                            title: `商品加入數量`,
                            hover: false,
                            option: []
                        })])
                },
                event: () => {

                    return new Promise(async (resolve, reject) => {
                        const pdid = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.pdid,
                            subData:subData,
                            element:element
                        })
                        const count = (await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.count,
                            subData:subData,
                            element:element
                        })) || 1

                        if((window as any).gtag){
                            let itemID = (pdid as string).split("-");


                            let data : any = await ApiShop.getProduct({page: 0, limit: 50, id: itemID[0]}).then((data) => {
                                if(data.result && data.response.result){
                                    let variants = data.response.data.content.variants;
                                    let product = data.response.data.content
                                    let target:any = {}
                                    function arraysEqualSet(arr1 : string[], arr2 : string[]) {
                                        arr2 = arr2.slice(1);
                                        if (arr1.length !== arr2.length) return false;
                                        let set1 = new Set(arr1);
                                        let set2 = new Set(arr2);
                                        if (set1.size !== set2.size) return false;
                                        return [...set1].every(value => set2.has(value));
                                    }
                                    variants.map((data:any)=>{
                                        if(arraysEqualSet(data.spec , itemID)){
                                            target = data
                                        }
                                    })
                                    ;(window as any).gtag("event", "add_to_cart", {
                                        currency: "TWD",
                                        value: (count as number) * target.sale_price as number,
                                        items: [
                                            {
                                                item_id: target?.sku ?? "",
                                                item_name: product?.title??"unknown name",
                                                price: target?.sale_price,
                                                quantity: count as Number,
                                                item_variant : itemID.slice(1),
                                            }
                                        ]
                                    });
                                }
                            })


                        }

                        ApiShop.addToCart(pdid as string, count as string)
                        ApiShop.getCart().then((resolve) => {})
                        resolve(pdid)
                    })
                },
            };
        },
    };
});

