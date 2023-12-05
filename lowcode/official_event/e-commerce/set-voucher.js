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
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            var _a, _b, _c;
            object.success = (_a = object.success) !== null && _a !== void 0 ? _a : {};
            object.error = (_b = object.error) !== null && _b !== void 0 ? _b : {};
            object.code = (_c = object.code) !== null && _c !== void 0 ? _c : {};
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.code, {
                            hover: false,
                            option: [],
                            title: '代碼來源'
                        }),
                        TriggerEvent.editer(gvc, widget, object.success, {
                            hover: false,
                            option: [],
                            title: '新增成功'
                        }), TriggerEvent.editer(gvc, widget, object.error, {
                            hover: false,
                            option: [],
                            title: '新增失敗'
                        })
                    ].join(`<div class="my-2"></div>`);
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const code = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.code,
                            element: element
                        });
                        ApiShop.getCart().then((res) => __awaiter(void 0, void 0, void 0, function* () {
                            const cartData = {
                                line_items: [],
                                total: 0
                            };
                            for (const b of Object.keys(res)) {
                                cartData.line_items.push({
                                    id: b.split('-')[0],
                                    count: res[b],
                                    spec: b.split('-').filter((dd, index) => {
                                        return index !== 0;
                                    })
                                });
                            }
                            ApiShop.getCheckout({
                                line_items: cartData.line_items.map((dd) => {
                                    return {
                                        id: dd.id,
                                        spec: dd.spec,
                                        count: dd.count
                                    };
                                }),
                                code: code
                            }).then((res) => __awaiter(void 0, void 0, void 0, function* () {
                                if (res.result && res.response.data.voucherList.find((dd) => {
                                    return code && (dd.code === code);
                                })) {
                                    yield ApiShop.setVoucherCode(code);
                                    TriggerEvent.trigger({
                                        gvc: gvc,
                                        widget: widget,
                                        clickEvent: object.success
                                    });
                                    resolve(res.response.data);
                                }
                                else {
                                    yield ApiShop.setVoucherCode('');
                                    TriggerEvent.trigger({
                                        gvc: gvc,
                                        widget: widget,
                                        clickEvent: object.error
                                    });
                                    resolve(res.response.data);
                                }
                            }));
                        }));
                    }));
                },
            };
        },
    };
});
