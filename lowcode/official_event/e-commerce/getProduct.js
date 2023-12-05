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
        fun: (gvc, widget, object, subData) => {
            return {
                editor: () => {
                    var _a, _b;
                    object.getType = (_a = object.getType) !== null && _a !== void 0 ? _a : "manual";
                    const id = gvc.glitter.getUUID();
                    return EditorElem.select({
                        title: "取得商品方式",
                        gvc: gvc,
                        def: (_b = object.getType) !== null && _b !== void 0 ? _b : "manual",
                        array: [{ title: '手動輸入', value: 'manual' }, { title: '程式碼帶入', value: 'code' }],
                        callback: (text) => {
                            object.getType = text;
                            gvc.notifyDataChange(id);
                        }
                    }) + `<div class="my-2"></div>` + gvc.bindView(() => {
                        let interval = 0;
                        return {
                            bind: id,
                            view: () => {
                                return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                                    var _a;
                                    if (object.getType == 'manual') {
                                        const title = yield new Promise((resolve, reject) => {
                                            ApiShop.getProduct({ page: 0, limit: 50, id: object.id }).then((data) => {
                                                if (data.result && data.response.result) {
                                                    resolve(data.response.data.content.title);
                                                }
                                                else {
                                                    resolve('');
                                                }
                                            });
                                        });
                                        resolve(EditorElem.searchInputDynamic({
                                            title: '搜尋商品',
                                            gvc: gvc,
                                            def: title,
                                            search: (text, callback) => {
                                                clearInterval(interval);
                                                interval = setTimeout(() => {
                                                    ApiShop.getProduct({ page: 0, limit: 50, search: '' }).then((data) => {
                                                        callback(data.response.data.map((dd) => {
                                                            return dd.content.title;
                                                        }));
                                                    });
                                                }, 100);
                                            },
                                            callback: (text) => {
                                                ApiShop.getProduct({ page: 0, limit: 50, search: text }).then((data) => {
                                                    object.id = data.response.data.find((dd) => {
                                                        return dd.content.title === text;
                                                    }).id;
                                                });
                                            },
                                            placeHolder: '請輸入商品名稱'
                                        }));
                                    }
                                    else {
                                        object.dataFrom = (_a = object.dataFrom) !== null && _a !== void 0 ? _a : {};
                                        resolve(TriggerEvent.editer(gvc, widget, object.dataFrom, {
                                            hover: false,
                                            title: "取得商品ID",
                                            option: []
                                        }));
                                    }
                                }));
                            },
                            divCreate: {
                                style: `min-height:400px;pt-2`
                            }
                        };
                    });
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const data = yield new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                            if (object.getType == 'code') {
                                const id = yield TriggerEvent.trigger({
                                    gvc: gvc,
                                    widget: widget,
                                    clickEvent: object.dataFrom,
                                    subData: subData
                                });
                                ApiShop.getProduct({ page: 0, limit: 50, id: id }).then((data) => {
                                    if (data.result && data.response.result) {
                                        resolve(data.response.data.content);
                                    }
                                    else {
                                        resolve('');
                                    }
                                });
                            }
                            else {
                                ApiShop.getProduct({ page: 0, limit: 50, id: object.id }).then((data) => {
                                    if (data.result && data.response.result) {
                                        resolve(data.response.data.content);
                                    }
                                    else {
                                        resolve('');
                                    }
                                });
                            }
                        }));
                        resolve(data);
                    }));
                },
            };
        },
    };
});
