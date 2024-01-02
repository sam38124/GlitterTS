import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            object.orderID = object.orderID ?? {}
            return {
                editor: () => {

                    return [
                        TriggerEvent.editer(gvc, widget, object.orderID, {
                            title: `訂單ID來源`,
                            hover: false,
                            option: []
                        })
                    ].join('')
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const orderID = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.orderID
                        })
                        ApiShop.getOrder({
                            limit: 50,
                            page: 0,
                            data_from: "user",
                            search:orderID as string
                        }).then((res: any) => {
                            if (res.result) {
                                resolve(res.response.data[0])
                            } else {
                                resolve([])
                            }

                        })
                    })
                },
            };
        },
    };
});
