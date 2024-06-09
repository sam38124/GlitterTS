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
                        if (!gvc.glitter.share.GlobalUser.token) {
                            gvc.glitter.share.GlobalUser.token = '';
                            resolve(false);
                            return ``;
                        }
                        if (gvc.glitter.share.GlobalUser.userInfo) {
                            resolve(gvc.glitter.share.GlobalUser.userInfo);
                        }
                        else {
                            gvc.glitter.ut.setQueue(`api-get-user_data`, (callback) => __awaiter(void 0, void 0, void 0, function* () {
                                callback(yield ApiUser.getUserData(gvc.glitter.share.GlobalUser.token, 'me'));
                            }), ((r) => {
                                try {
                                    if (!r.result) {
                                        gvc.glitter.share.GlobalUser.token = '';
                                        resolve(false);
                                        gvc.glitter.ut.queue[`api-get-user_data`] = undefined;
                                    }
                                    else {
                                        gvc.glitter.share.GlobalUser.userInfo = r.response;
                                        gvc.glitter.share.GlobalUser.updateUserData = JSON.parse(JSON.stringify(r.response));
                                        resolve(gvc.glitter.share.GlobalUser.userInfo);
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
