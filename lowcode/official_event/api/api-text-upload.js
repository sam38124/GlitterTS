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
import { BaseApi } from "../../glitterBundle/api/base.js";
TriggerEvent.createSingleEvent(import.meta.url, (glitter) => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            var _a, _b, _c, _d, _e;
            object.accept = (_a = object.accept) !== null && _a !== void 0 ? _a : {};
            object.uploading = (_b = object.uploading) !== null && _b !== void 0 ? _b : {};
            object.uploadFinish = (_c = object.uploadFinish) !== null && _c !== void 0 ? _c : {};
            object.error = (_d = object.error) !== null && _d !== void 0 ? _d : {};
            object.upload_count = object.upload_count || 'single';
            object.text = (_e = object.text) !== null && _e !== void 0 ? _e : {};
            const html = String.raw;
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.text, {
                            hover: false,
                            option: [],
                            title: '文字來源'
                        }),
                        TriggerEvent.editer(gvc, widget, object.accept, {
                            hover: false,
                            option: [],
                            title: '副檔名'
                        }),
                        TriggerEvent.editer(gvc, widget, object.uploading, {
                            hover: false,
                            option: [],
                            title: '上傳中'
                        }),
                        TriggerEvent.editer(gvc, widget, object.uploadFinish, {
                            hover: false,
                            option: [],
                            title: '上傳結束'
                        }),
                        TriggerEvent.editer(gvc, widget, object.error, {
                            hover: false,
                            option: [],
                            title: '上傳失敗'
                        })
                    ].join('<div class="my-2"></div>');
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const accept = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.accept,
                            subData: subData,
                            element: element
                        });
                        let text = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.text,
                            subData: subData,
                            element: element
                        });
                        if (typeof text !== 'string') {
                            text = JSON.stringify(text);
                        }
                        const saasConfig = window.saasConfig;
                        (yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.uploading,
                            subData: subData,
                            element: element
                        }));
                        let url_stack = [];
                        const res = yield new Promise((resolve, reject) => {
                            saasConfig.api.uploadFile(glitter.getUUID() + '.' + accept).then((data) => {
                                const data1 = data.response;
                                BaseApi.create({
                                    url: data1.url,
                                    type: 'put',
                                    data: text,
                                    headers: {
                                        "Content-Type": data1.type
                                    }
                                }).then((res) => __awaiter(void 0, void 0, void 0, function* () {
                                    if (res.result) {
                                        resolve(data1.fullUrl);
                                    }
                                    else {
                                        resolve(false);
                                    }
                                }));
                            });
                        });
                        if (!res) {
                            yield TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.error,
                                subData: subData,
                                element: element
                            });
                            resolve(false);
                            return;
                        }
                        url_stack.push(res);
                        resolve(url_stack[0]);
                    }));
                }
            };
        }
    };
});
