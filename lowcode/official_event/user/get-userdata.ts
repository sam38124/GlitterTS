import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {ApiUser} from "../../glitter-base/route/user.js";


TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            return {
                editor: () => {

                    return ``
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        if(!gvc.glitter.share.GlobalUser.token){
                            gvc.glitter.share.GlobalUser.token = ''
                            resolve(false)
                            return ``
                        }
                        if(gvc.glitter.share.GlobalUser.userInfo){
                            resolve(gvc.glitter.share.GlobalUser.userInfo)
                        }else{
                            gvc.glitter.ut.setQueue(`api-get-user_data`, async (callback:any) => {
                                callback(await ApiUser.getUserData(gvc.glitter.share.GlobalUser.token,'me'))

                            }, ( (r:any) => {
                                try {
                                    if (!r.result) {
                                        gvc.glitter.share.GlobalUser.token = ''
                                        resolve(false);
                                        (gvc.glitter.ut.queue as any)[`api-get-user_data`]=undefined
                                    } else {
                                        gvc.glitter.share.GlobalUser.userInfo = r.response
                                        gvc.glitter.share.GlobalUser.updateUserData = JSON.parse(JSON.stringify(r.response))
                                        resolve(gvc.glitter.share.GlobalUser.userInfo);
                                    }
                                } catch (e) {
                                    resolve(false);
                                    (gvc.glitter.ut.queue as any)[`api-get-user_data`]=undefined
                                }
                            }));

                        }
                    })
                },
            };
        },
    };
});

