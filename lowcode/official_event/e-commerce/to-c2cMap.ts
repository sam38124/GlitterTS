import { TriggerEvent } from '../../glitterBundle/plugins/trigger-event.js';
import { EditorElem } from '../../glitterBundle/plugins/editor-elem.js';
import { ApiDelivery } from '../../glitter-base/route/delivery.js';

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            object.ctype = object.ctype ?? {};
            return {
                editor: () => {
                    return gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                let map: any = [
                                    TriggerEvent.editer(gvc, widget, object.ctype, {
                                        hover: false,
                                        option: [],
                                        title: '取得門市類型',
                                    }),
                                ];
                                return EditorElem.container(map);
                            },
                        };
                    });
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const ctype = await TriggerEvent.trigger({ gvc: gvc, widget: widget, clickEvent: object.ctype, subData: subData });
                        ApiDelivery.storeMaps({
                            returnURL: location.href,
                            logistics: ctype as string,
                        }).then(async (res) => {
                            $('body').html(res.response.form);
                            (document.querySelector('#submit') as any).click();
                            localStorage.setItem('block-refresh-cart', 'true');
                        });
                    });
                },
            };
        },
    };
});
