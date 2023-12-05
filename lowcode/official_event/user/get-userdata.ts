import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";
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
                        if(!GlobalUser.token){
                            GlobalUser.token = ''
                            resolve(false)
                            return ``
                        }
                        if(GlobalUser.userInfo){

                            resolve(GlobalUser.userInfo)
                        }else{
                            ApiUser.getUserData(GlobalUser.token).then(async (r) => {
                                try {
                                    if (!r.result) {
                                        GlobalUser.token = ''
                                        resolve(false)
                                    } else {
                                        GlobalUser.userInfo = r.response
                                        GlobalUser.updateUserData = JSON.parse(JSON.stringify(r.response))
                                        resolve(GlobalUser.userInfo)
                                    }
                                } catch (e) {
                                    resolve(false)
                                }
                            })
                        }
                    })
                },
            };
        },
    };
});

