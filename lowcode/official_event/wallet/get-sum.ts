import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {ApiWallet} from "../../glitter-base/route/wallet.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {

            return {
                editor: () => {
                    return ``
                },
                event: () => {

                    return new Promise(async (resolve, reject) => {
                        ApiWallet.getWallet(GlobalUser.token).then(async (res) => {
                            resolve(res.result && res.response.sum)
                        })
                    })
                },
            };
        }
    }
})