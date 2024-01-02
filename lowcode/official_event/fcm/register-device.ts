import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {ApiUser} from "../../glitter-base/route/user.js";

TriggerEvent.createSingleEvent(import.meta.url, (glitter) => {
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
                    ].join('<div class="my-2"></div>')
                },
                event: () => {
                    return new Promise<any>(async (resolve, reject) => {
                        const userID = await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.userID
                        })
                        try {
                            gvc.glitter.runJsInterFace("getFireBaseToken", {}, (response) => {
                                if (response.token) {
                                    ApiUser.registerFCM(userID as string,response.token)
                                }
                            }, {
                                webFunction(data: any, callback: (data: any) => void): any {
                                    callback({})
                                }
                            })
                        } catch (e) {
                        }
                        resolve(true)

                    })
                }
            }
        }
    }
})