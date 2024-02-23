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
            var _a, _b, _c;
            object.data = (_a = object.data) !== null && _a !== void 0 ? _a : {};
            object.success = (_b = object.success) !== null && _b !== void 0 ? _b : {};
            object.error = (_c = object.error) !== null && _c !== void 0 ? _c : {};
            const html = String.raw;
            return {
                editor: () => {
                    return [
                        html `
                            <div class="alert alert-secondary" style="white-space: normal;word-break: break-all;">
                                請求資料格式範例-><br>
                                {<br>
                                "url": 'https://sampleurl/com',<br>
                                "type": "GET",<br>
                                "timeout": 0,<br>
                                "headers": {<br>
                                "Content-Type": "application/json"<br>
                                }<br>
                                }
                            </div>
                        `,
                        TriggerEvent.editer(gvc, widget, object.data, {
                            hover: false,
                            option: [],
                            title: '設定請求資料'
                        }),
                        TriggerEvent.editer(gvc, widget, object.success, {
                            hover: false,
                            option: [],
                            title: '請求成功'
                        }),
                        TriggerEvent.editer(gvc, widget, object.error, {
                            hover: false,
                            option: [],
                            title: '請求失敗'
                        }),
                    ].join('<div class="my-2"></div>');
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const req = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.data,
                            subData: subData,
                            element: element
                        });
                        try {
                            const data = yield BaseApi.create(req);
                            if (data.result) {
                                resolve((yield TriggerEvent.trigger({
                                    gvc: gvc,
                                    widget: widget,
                                    clickEvent: object.success,
                                    subData: data.response,
                                    element: element
                                })) || data.response);
                            }
                            else {
                                resolve((yield TriggerEvent.trigger({
                                    gvc: gvc,
                                    widget: widget,
                                    clickEvent: object.error,
                                    subData: data.response,
                                    element: element
                                })) || false);
                            }
                        }
                        catch (e) {
                            resolve(true);
                        }
                    }));
                }
            };
        }
    };
});
