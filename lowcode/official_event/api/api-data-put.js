var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TriggerEvent } from "../../glitterBundle/plugins/trigger-event.js";
import { ApiPost } from "../../glitter-base/route/post.js";
import { GlobalUser } from "../../glitter-base/global/global-user.js";
TriggerEvent.createSingleEvent(import.meta.url, (glitter) => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            var _a;
            object.post_data = (_a = object.post_data) !== null && _a !== void 0 ? _a : {};
            const html = String.raw;
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.post_data, {
                            hover: false,
                            option: [],
                            title: '更新內容'
                        })
                    ].join('<div class="my-2"></div>');
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const postData = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.post_data,
                            subData: subData,
                            element: element
                        });
                        ApiPost.put({
                            postData: postData,
                            token: GlobalUser.token,
                            type: 'normal'
                        }).then((res) => {
                            if (res.result) {
                                resolve(res.response);
                            }
                            else {
                                resolve(false);
                            }
                        });
                    }));
                }
            };
        }
    };
});
