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
            var _a, _b, _c, _d;
            object.getType = (_a = object.getType) !== null && _a !== void 0 ? _a : "manual";
            object.count = (_b = object.count) !== null && _b !== void 0 ? _b : {};
            object.productType = (_c = object.productType) !== null && _c !== void 0 ? _c : {};
            object.domain_from = (_d = object.domain_from) !== null && _d !== void 0 ? _d : {};
            return {
                editor: () => {
                    var _a;
                    const id = gvc.glitter.getUUID();
                    return EditorElem.select({
                        title: "取得商品方式",
                        gvc: gvc,
                        def: (_a = object.getType) !== null && _a !== void 0 ? _a : "manual",
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
                                    var _a, _b;
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
                                                    ApiShop.getProduct({
                                                        page: 0,
                                                        limit: 50,
                                                        search: ''
                                                    }).then((data) => {
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
                                        object.comefromTp = (_b = object.comefromTp) !== null && _b !== void 0 ? _b : 'single';
                                        resolve([EditorElem.select({
                                                title: '來源類型',
                                                gvc: gvc,
                                                def: object.comefromTp,
                                                array: [
                                                    {
                                                        title: '單一',
                                                        value: 'single'
                                                    },
                                                    {
                                                        title: '多項',
                                                        value: 'multiple'
                                                    }
                                                ],
                                                callback: (text) => {
                                                    object.comefromTp = text;
                                                }
                                            }), TriggerEvent.editer(gvc, widget, object.dataFrom, {
                                                hover: false,
                                                title: "取得商品ID",
                                                option: []
                                            }), TriggerEvent.editer(gvc, widget, object.domain_from, {
                                                hover: false,
                                                title: "取得商品DOMAIN",
                                                option: []
                                            }), TriggerEvent.editer(gvc, widget, object.count, {
                                                hover: false,
                                                title: "商品數量限制",
                                                option: []
                                            }), TriggerEvent.editer(gvc, widget, object.productType, {
                                                hover: false,
                                                title: "查詢類型",
                                                option: []
                                            })].join(`<div class="my-2"></div>`));
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
                                let searchJson = {};
                                const id = yield TriggerEvent.trigger({
                                    gvc: gvc,
                                    widget: widget,
                                    clickEvent: object.dataFrom,
                                    subData: subData
                                });
                                const count = yield TriggerEvent.trigger({
                                    gvc: gvc,
                                    widget: widget,
                                    clickEvent: object.count,
                                    subData: subData
                                });
                                const productType = yield TriggerEvent.trigger({
                                    gvc: gvc,
                                    widget: widget,
                                    clickEvent: object.productType,
                                    subData: subData
                                });
                                const domain = yield TriggerEvent.trigger({
                                    gvc: gvc,
                                    widget: widget,
                                    clickEvent: object.domain_from,
                                    subData: subData
                                });
                                switch (id.select) {
                                    case "collection":
                                        searchJson = {
                                            page: 0,
                                            limit: count || 200,
                                            collection: id.value.join(',') || '-99',
                                            accurate_search_collection: true
                                        };
                                        break;
                                    case "product":
                                        searchJson = { page: 0, limit: count || 200, id_list: id.value.concat('-99').join(',') };
                                        break;
                                    case "all":
                                        searchJson = { page: 0, limit: count || 200 };
                                        break;
                                    default:
                                        if (object.comefromTp === 'multiple') {
                                            searchJson = { page: 0, limit: count || 200, id_list: `${id}`.split(',').concat([`-99`]).join(',') };
                                        }
                                        else {
                                            if (domain) {
                                                searchJson = { page: 0, limit: count || 200, domain: domain };
                                            }
                                            else {
                                                searchJson = { page: 0, limit: count || 200, id: `${id}`.split(',').concat([`-99`]).join(',') };
                                            }
                                        }
                                }
                                productType && (searchJson.productType = productType);
                                searchJson = Object.assign(Object.assign({}, searchJson), { status: 'inRange' });
                                ApiShop.getProduct(searchJson).then((data) => {
                                    if (data.result && data.response.data) {
                                        if (!Array.isArray(data.response.data)) {
                                            resolve(data.response.data.content);
                                        }
                                        else {
                                            resolve(data.response.data.map((dd) => {
                                                return dd.content;
                                            }));
                                        }
                                    }
                                    else {
                                        resolve('');
                                    }
                                });
                            }
                            else {
                                ApiShop.getProduct({ page: 0, limit: 50, id: object.id, status: 'inRange' }).then((data) => {
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
