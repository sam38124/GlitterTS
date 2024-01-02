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
import { ApiPost } from "../../glitter-base/route/post.js";
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            var _a;
            object.formData = (_a = object.formData) !== null && _a !== void 0 ? _a : {};
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.formData, {
                            hover: false,
                            option: [],
                            title: "取得發佈內容"
                        })
                    ].join('<div class="my-2"></div>');
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const formData = yield TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.formData, subData: subData
                        });
                        ApiPost.post({
                            postData: formData,
                            type: 'normal'
                        }).then((res) => {
                            if (res && res.response.result) {
                                resolve(true);
                            }
                            else {
                                resolve(false);
                            }
                        });
                    }));
                },
            };
        },
    };
});
