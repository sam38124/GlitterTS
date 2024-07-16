import { TriggerEvent } from '../../glitterBundle/plugins/trigger-event.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { EditorElem } from '../../glitterBundle/plugins/editor-elem.js';

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            object.tagFrom = object.tagFrom ?? {};
            return {
                editor: () => {
                    return [TriggerEvent.editer(gvc, widget, object.tagFrom, { title: '取得商品分類標籤', hover: false, option: [] })].join('');
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        let tag = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.tagFrom,
                            subData: subData,
                        });
                        ApiShop.getShowList().then((res) => {
                            try {
                                ApiShop.getProduct({
                                    page: 0,
                                    limit: 50,
                                    id_list: res.response.value
                                        .find((dd: any) => {
                                            return dd.tag === tag;
                                        })
                                        .array.map((dd: any) => {
                                            return dd.id;
                                        })
                                        .join(','),
                                }).then((data) => {
                                    if (data.result && data.response.data) {
                                        resolve(
                                            data.response.data.map((dd: any) => {
                                                return dd.content;
                                            })
                                        );
                                    } else {
                                        resolve([]);
                                    }
                                });
                            } catch (e: any) {
                                resolve([]);
                            }
                        });
                    });
                },
            };
        },
    };
});
