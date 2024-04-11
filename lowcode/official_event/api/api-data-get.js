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
TriggerEvent.createSingleEvent(import.meta.url, (glitter) => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            var _a, _b, _c;
            object.get_data = (_a = object.get_data) !== null && _a !== void 0 ? _a : {};
            object.page = (_b = object.page) !== null && _b !== void 0 ? _b : {};
            object.limit = (_c = object.limit) !== null && _c !== void 0 ? _c : {};
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.get_data, {
                            hover: false,
                            option: [],
                            title: '查詢內容'
                        }),
                        TriggerEvent.editer(gvc, widget, object.page, {
                            hover: false,
                            option: [],
                            title: '查訊頁數'
                        }),
                        TriggerEvent.editer(gvc, widget, object.limit, {
                            hover: false,
                            option: [],
                            title: '筆數限制'
                        })
                    ].join('<div class="my-2"></div>');
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const search = (yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.get_data,
                            subData: subData,
                            element: element
                        }));
                        const page = (yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.page,
                            subData: subData,
                            element: element
                        })) || 0;
                        const limit = (yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.limit,
                            subData: subData,
                            element: element
                        })) || 10;
                        ApiPost.getV2({
                            search: search,
                            page: page,
                            limit: limit
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
