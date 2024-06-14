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
import { ApiShop } from "../../glitter-base/route/shopping.js";
import { EditorElem } from "../../glitterBundle/plugins/editor-elem.js";
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            object.page = (_a = object.page) !== null && _a !== void 0 ? _a : {};
            object.limit = (_b = object.limit) !== null && _b !== void 0 ? _b : {};
            object.collection = (_c = object.collection) !== null && _c !== void 0 ? _c : {};
            object.maxPrice = (_d = object.maxPrice) !== null && _d !== void 0 ? _d : {};
            object.minPrice = (_e = object.minPrice) !== null && _e !== void 0 ? _e : {};
            object.titleMatch = (_f = object.titleMatch) !== null && _f !== void 0 ? _f : {};
            object.orderBy = (_g = object.orderBy) !== null && _g !== void 0 ? _g : {};
            object.with_hide_index = (_h = object.with_hide_index) !== null && _h !== void 0 ? _h : 'false';
            return {
                editor: () => {
                    var _a;
                    object.getType = (_a = object.getType) !== null && _a !== void 0 ? _a : "manual";
                    const id = gvc.glitter.getUUID();
                    return EditorElem.container([
                        EditorElem.select({
                            title: "是否查詢隱藏商品項目",
                            gvc: gvc,
                            def: object.with_hide_index,
                            array: [
                                {
                                    title: '是',
                                    value: 'true'
                                },
                                {
                                    title: '否',
                                    value: 'false'
                                }
                            ],
                            callback: (text) => {
                                object.with_hide_index = text;
                                gvc.notifyDataChange(id);
                            }
                        }),
                        TriggerEvent.editer(gvc, widget, object.page, { title: "當前頁面", hover: false, option: [] }),
                        TriggerEvent.editer(gvc, widget, object.limit, { title: "每頁筆數", hover: false, option: [] }),
                        TriggerEvent.editer(gvc, widget, object.collection, {
                            title: "查詢分類",
                            hover: false,
                            option: []
                        }),
                        TriggerEvent.editer(gvc, widget, object.titleMatch, {
                            title: "查詢關鍵字",
                            hover: false,
                            option: []
                        }),
                        TriggerEvent.editer(gvc, widget, object.maxPrice, {
                            title: "最大金額",
                            hover: false,
                            option: []
                        }),
                        TriggerEvent.editer(gvc, widget, object.minPrice, {
                            title: "最小金額",
                            hover: false,
                            option: []
                        }),
                        TriggerEvent.editer(gvc, widget, object.orderBy, {
                            title: "排序方式",
                            hover: false,
                            option: []
                        }),
                    ]);
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const data = yield new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
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
                            const collection = yield TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.collection,
                                subData: subData
                            });
                            const titleMatch = yield TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.titleMatch,
                                subData: subData
                            });
                            const maxPrice = yield TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.maxPrice,
                                subData: subData
                            });
                            const minPrice = yield TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.minPrice,
                                subData: subData
                            });
                            const orderBy = yield TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.orderBy,
                                subData: subData
                            });
                            if (window.gtag && titleMatch) {
                                ;
                                window.gtag("event", "search", {
                                    search_term: titleMatch !== null && titleMatch !== void 0 ? titleMatch : "",
                                    maxPrice: maxPrice,
                                    minPrice: minPrice,
                                    search: titleMatch,
                                    orderBy: orderBy,
                                });
                            }
                            if (window.gtag && collection) {
                                ;
                                window.gtag("event", "search", {
                                    collection: collection,
                                    maxPrice: maxPrice,
                                    minPrice: minPrice,
                                    search: titleMatch,
                                    orderBy: orderBy,
                                });
                            }
                            ApiShop.getProduct({
                                page: page,
                                limit: limit,
                                collection: collection,
                                maxPrice: maxPrice,
                                minPrice: minPrice,
                                search: titleMatch,
                                status: 'active',
                                orderBy: orderBy,
                                with_hide_index: object.with_hide_index
                            }).then((data) => {
                                data.response.data.pageSize = Math.ceil(data.response.total / parseInt(limit, 10));
                                if (parseInt(page, 10) <= data.response.data.pageSize) {
                                    page = 0;
                                }
                                data.response.data.pageIndex = page;
                                resolve(data.response.data);
                            });
                        }));
                        resolve(data);
                    }));
                },
            };
        },
    };
});
