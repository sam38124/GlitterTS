import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiUser} from "../../glitter-base/route/user.js";


TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.userID = object.userID ?? {}
            return {
                editor: () => {

                    return [
                        TriggerEvent.editer(gvc, widget, object.userID, {
                            hover: false,
                            option: [],
                            title: "取得用戶ID"
                        }),
                    ].join('')
                },
                event: () => {

                    return new Promise(async (resolve, reject) => {
                        const userId=(await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.userID,
                            subData: subData,
                            element: element
                        })) as any;
                        resolve( (await ApiUser.getUsersData(userId)).response)
                    })
                },
            };
        },
    };
});

