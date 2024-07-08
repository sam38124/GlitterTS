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
import { ApiShop } from '../../glitter-base/route/shopping.js';
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            var _a;
            object.tagFrom = (_a = object.tagFrom) !== null && _a !== void 0 ? _a : {};
            return {
                editor: () => {
                    return [TriggerEvent.editer(gvc, widget, object.tagFrom, { title: '取得商品分類標籤', hover: false, option: [] })].join('');
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        let tag = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.tagFrom,
                            subData: subData,
                        });
                        ApiShop.getShowList().then((res) => {
                            try {
                                ApiShop.getProduct({
                                    page: 0,
                                    limit: 50,
                                    id_list: res.response.value
                                        .find((dd) => {
                                        return dd.tag === tag;
                                    })
                                        .array.map((dd) => {
                                        return dd.id;
                                    })
                                        .join(','),
                                }).then((data) => {
                                    if (data.result && data.response.data) {
                                        resolve(data.response.data.map((dd) => {
                                            return dd.content;
                                        }));
                                    }
                                    else {
                                        resolve([]);
                                    }
                                });
                            }
                            catch (e) {
                                resolve([]);
                            }
                        });
                    }));
                },
            };
        },
    };
});
