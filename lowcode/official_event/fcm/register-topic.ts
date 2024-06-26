import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {ApiUser} from "../../glitter-base/route/user.js";

TriggerEvent.createSingleEvent(import.meta.url, (glitter) => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.getEvent = object.getEvent ?? {};
            return {
                editor: () => {
                    //gvc.glitter.share.public_api.GlobalUser.updateUserData.userData.service
                    return TriggerEvent.editer(gvc, widget, object.getEvent, {
                        option: [],
                        title: '取得推播頻道',
                        hover: false,
                    });
                },
                event: () => {
                    return new Promise<any>(async (resolve, reject) => {
                        try {
                            const topic = await TriggerEvent.trigger({
                                gvc,
                                widget,
                                clickEvent: object.getEvent,
                                subData: subData,
                                element,
                            });
                            if (typeof topic != 'object') {
                                gvc.glitter.runJsInterFace(
                                    'regNotification',
                                    {
                                        topic: topic,
                                    },
                                    (response) => {
                                    }
                                );
                            } else {
                                (topic as any).map((dd: any) => {
                                    gvc.glitter.runJsInterFace(
                                        'regNotification',
                                        {
                                            topic: dd,
                                        },
                                        (response) => {
                                        }
                                    );
                                });
                            }
                            resolve(true);
                        } catch (e) {
                            resolve(object.errorCode ?? false);
                        }
                    });
                },
            };
        },
    }
})