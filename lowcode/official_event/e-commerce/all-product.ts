import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {

            object.page = object.page ?? {}
            object.limit = object.limit ?? {}
            object.collection = object.collection ?? {}
            object.maxPrice = object.maxPrice ?? {}
            object.minPrice = object.minPrice ?? {}
            object.titleMatch = object.titleMatch ?? {}
            object.orderBy= object.orderBy??{}
            return {
                editor: () => {
                    object.getType = object.getType ?? "manual"
                    const id = gvc.glitter.getUUID()
                    return EditorElem.container([
                        TriggerEvent.editer(gvc, widget, object.page, {title: "當前頁面", hover: false, option: []}),
                        TriggerEvent.editer(gvc, widget, object.limit, {title: "每頁筆數", hover: false, option: []}),
                        TriggerEvent.editer(gvc, widget, object.collection, {
                            title: "查詢分類",
                            hover: false,
                            option: []
                        }),
                        TriggerEvent.editer(gvc, widget, object.titleMatch, {
                            title: "查詢關鍵字",
                            hover: false,
                            option: []
                        }),
                        TriggerEvent.editer(gvc, widget, object.maxPrice, {
                            title: "最大金額",
                            hover: false,
                            option: []
                        }),
                        TriggerEvent.editer(gvc, widget, object.minPrice, {
                            title: "最小金額",
                            hover: false,
                            option: []
                        }),
                        TriggerEvent.editer(gvc, widget, object.orderBy, {
                            title: "排序方式",
                            hover: false,
                            option: []
                        }),
                    ])
                },
                event: () => {

                    return new Promise(async (resolve, reject) => {
                        const data = await new Promise(async (resolve, reject) => {
                            let page = await TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.page,
                                subData: subData
                            })
                            const limit = await TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.limit,
                                subData: subData
                            })
                            const collection = await TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.collection,
                                subData: subData
                            })
                            const titleMatch = await TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.titleMatch,
                                subData: subData
                            })
                            const maxPrice = await TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.maxPrice,
                                subData: subData
                            })
                            const minPrice = await TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.minPrice,
                                subData: subData
                            })
                            const orderBy=await TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.orderBy,
                                subData: subData
                            })
                            ApiShop.getProduct({
                                page: page as any,
                                limit: limit as any,
                                collection: collection as string,
                                maxPrice: maxPrice as string,
                                minPrice: minPrice as string,
                                search: titleMatch as string,
                                status:'active',
                                orderBy:orderBy as string
                            }).then((data) => {
                                data.response.data.pageSize = Math.ceil(data.response.total / parseInt(limit as any, 10))
                                if (parseInt(page as string, 10) <= data.response.data.pageSize) {
                                    page = 0
                                }
                                data.response.data.pageIndex = page
                                resolve(data.response.data)
                            })
                        })
                        resolve(data)
                    })
                },
            };
        },
    };
});
