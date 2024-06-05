var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TriggerEvent } from '../../glitterBundle/plugins/trigger-event.js';
import { GlobalUser } from "../../glitter-base/global/global-user.js";
import { ApiUser } from "../../glitter-base/route/user.js";
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            return {
                editor: () => {
                    return ``;
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        if (!GlobalUser.token) {
                            GlobalUser.token = '';
                            resolve(false);
                            return ``;
                        }
                        if (GlobalUser.userInfo) {
                            resolve(GlobalUser.userInfo);
                        }
                        else {
                            window.glitterInitialHelper.setQueue(`api-get-user_data`, (callback) => __awaiter(void 0, void 0, void 0, function* () {
                                callback(yield ApiUser.getUserData(GlobalUser.token, 'me'));
                            }), ((r) => {
                                try {
                                    if (!r.result) {
                                        GlobalUser.token = '';
                                        resolve(false);
                                        gvc.glitter.ut.queue[`api-get-user_data`] = undefined;
                                    }
                                    else {
                                        GlobalUser.userInfo = r.response;
                                        GlobalUser.updateUserData = JSON.parse(JSON.stringify(r.response));
                                        resolve(GlobalUser.userInfo);
                                    }
                                }
                                catch (e) {
                                    resolve(false);
                                    gvc.glitter.ut.queue[`api-get-user_data`] = undefined;
                                }
                            }));
                        }
                    }));
                },
            };
        },
    };
});
