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
import { Article } from "../../glitter-base/route/article.js";
TriggerEvent.createSingleEvent(import.meta.url, (glitter) => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            var _a, _b, _c, _d;
            object.page = (_a = object.page) !== null && _a !== void 0 ? _a : {};
            object.limit = (_b = object.limit) !== null && _b !== void 0 ? _b : {};
            object.pageCount = (_c = object.pageCount) !== null && _c !== void 0 ? _c : {};
            object.label = (_d = object.label) !== null && _d !== void 0 ? _d : {};
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.page, { title: "當前頁面", hover: false, option: [] }),
                        TriggerEvent.editer(gvc, widget, object.limit, { title: "每頁筆數", hover: false, option: [] }),
                        TriggerEvent.editer(gvc, widget, object.pageCount, {
                            title: "總頁數返回",
                            hover: false,
                            option: []
                        }),
                        TriggerEvent.editer(gvc, widget, object.label, { title: "文章標籤", hover: false, option: [] })
                    ].join('<div class="my-2"></div>');
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        let page = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.page,
                            subData: subData
                        });
                        const limit = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.limit,
                            subData: subData
                        });
                        const label = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.label,
                            subData: subData
                        });
                        Article.get({
                            page: page,
                            limit: limit,
                            label: label
                        }).then((data) => __awaiter(void 0, void 0, void 0, function* () {
                            yield TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.pageCount,
                                subData: Math.ceil(data.response.total / parseInt(limit, 10))
                            });
                            resolve(data.response.data);
                        }));
                    }));
                }
            };
        }
    };
});
