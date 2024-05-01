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
            var _a, _b, _c, _d;
            object.accept = (_a = object.accept) !== null && _a !== void 0 ? _a : {};
            object.uploading = (_b = object.uploading) !== null && _b !== void 0 ? _b : {};
            object.uploadFinish = (_c = object.uploadFinish) !== null && _c !== void 0 ? _c : {};
            object.error = (_d = object.error) !== null && _d !== void 0 ? _d : {};
            const html = String.raw;
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.accept, {
                            hover: false,
                            option: [],
                            title: '檔案類型{accept}'
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
                        glitter.ut.chooseMediaCallback({
                            single: true,
                            accept: accept || '*',
                            callback(data) {
                                return __awaiter(this, void 0, void 0, function* () {
                                    const saasConfig = window.saasConfig;
                                    yield TriggerEvent.trigger({
                                        gvc: gvc,
                                        widget: widget,
                                        clickEvent: object.uploading,
                                        subData: subData,
                                        element: element
                                    });
                                    const file = data[0].file;
                                    saasConfig.api.uploadFile(file.name).then((data) => {
                                        const data1 = data.response;
                                        BaseApi.create({
                                            url: data1.url,
                                            type: 'put',
                                            data: file,
                                            headers: {
                                                "Content-Type": data1.type
                                            }
                                        }).then((res) => __awaiter(this, void 0, void 0, function* () {
                                            if (res.result) {
                                                yield TriggerEvent.trigger({
                                                    gvc: gvc,
                                                    widget: widget,
                                                    clickEvent: object.uploadFinish,
                                                    subData: data1.fullUrl,
                                                    element: element
                                                });
                                                resolve(data1.fullUrl);
                                            }
                                            else {
                                                yield TriggerEvent.trigger({
                                                    gvc: gvc,
                                                    widget: widget,
                                                    clickEvent: object.error,
                                                    subData: subData,
                                                    element: element
                                                });
                                                resolve(false);
                                            }
                                        }));
                                    });
                                });
                            },
                        });
                    }));
                }
            };
        }
    };
});
