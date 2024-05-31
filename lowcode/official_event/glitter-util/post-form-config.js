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
        fun: (gvc, widget, object, subData, element) => {
            var _a, _b, _c;
            object.tag = (_a = object.tag) !== null && _a !== void 0 ? _a : {};
            object.data = (_b = object.data) !== null && _b !== void 0 ? _b : {};
            object.form_title = (_c = object.form_title) !== null && _c !== void 0 ? _c : {};
            return {
                editor: () => {
                    return gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                return [
                                    TriggerEvent.editer(gvc, widget, object.tag, {
                                        hover: false,
                                        option: [],
                                        title: "配置檔來源"
                                    }),
                                    TriggerEvent.editer(gvc, widget, object.data, {
                                        hover: false,
                                        option: [],
                                        title: "資料內容"
                                    }),
                                    TriggerEvent.editer(gvc, widget, object.form_title, {
                                        hover: false,
                                        option: [],
                                        title: "表單標題"
                                    })
                                ].join(`<div class="my-2"></div>`);
                            }
                        };
                    });
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const config = yield TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.tag, subData: subData
                        });
                        const data = yield TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.data, subData: subData
                        });
                        const form_title = yield TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.form_title, subData: subData
                        });
                        ApiPost.post({
                            postData: {
                                form_config: config,
                                form_data: data,
                                type: 'post-form-config',
                                form_title: form_title
                            },
                            type: "normal"
                        }).then((data) => {
                            resolve(true);
                        });
                    }));
                },
            };
        },
    };
});
