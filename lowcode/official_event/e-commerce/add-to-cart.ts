import { TriggerEvent } from '../../glitterBundle/plugins/trigger-event.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { EditorElem } from '../../glitterBundle/plugins/editor-elem.js';

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.count = object.count ?? {};
            object.pdid = object.pdid ?? {};

            return {
                editor: () => {
                    return EditorElem.container([
                        TriggerEvent.editer(gvc, widget, object.pdid, {
                            title: `商品ID來源[ProductId-VIndex]`,
                            hover: false,
                            option: [],
                        }),
                        TriggerEvent.editer(gvc, widget, object.count, {
                            title: `商品加入數量`,
                            hover: false,
                            option: [],
                        }),
                    ]);
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const pdid = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.pdid,
                            subData: subData,
                            element: element,
                        });
                        const count =
                            (await TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.count,
                                subData: subData,
                                element: element,
                            })) || 1;
                        ApiShop.addToCart(pdid as string, count as string);
                        ApiShop.getCart();
                        resolve(pdid);
                        for (const b of document.querySelectorAll('.shopping-cart')){
                            (b as any).recreateView()
                        }
                    });
                },
            };
        },
    };
});
