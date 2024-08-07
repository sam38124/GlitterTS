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
        fun: (gvc, widget, object, subData, element) => {
            var _a, _b, _c;
            object.rebate = (_a = object.rebate) !== null && _a !== void 0 ? _a : {};
            object.rebateError = (_b = object.rebateError) !== null && _b !== void 0 ? _b : {};
            object.rebateSuccess = (_c = object.rebateSuccess) !== null && _c !== void 0 ? _c : {};
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.rebate, {
                            hover: false,
                            option: [],
                            title: '購物金來源',
                        }),
                        TriggerEvent.editer(gvc, widget, object.rebateSuccess, {
                            hover: false,
                            option: [],
                            title: '購物金使用成功',
                        }),
                        TriggerEvent.editer(gvc, widget, object.rebateError, {
                            hover: false,
                            option: [],
                            title: '購物金使用失敗',
                        }),
                    ].join(`<div class="my-2"></div>`);
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const trigger_rebate = (yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.rebate,
                            element: element,
                        })) || 0;
                        const def_rebate = (yield ApiShop.getRebateValue()) || 0;
                        const rebate = trigger_rebate !== null && trigger_rebate !== void 0 ? trigger_rebate : def_rebate;
                        ApiShop.getCart().then((res) => __awaiter(void 0, void 0, void 0, function* () {
                            const cartData = {
                                line_items: [],
                                total: 0,
                            };
                            for (const b of Object.keys(res)) {
                                cartData.line_items.push({
                                    id: b.split('-')[0],
                                    count: res[b],
                                    spec: b.split('-').filter((dd, index) => {
                                        return index !== 0;
                                    }),
                                });
                            }
                            ApiShop.getCheckout({
                                line_items: cartData.line_items.map((dd) => {
                                    return {
                                        id: dd.id,
                                        spec: dd.spec,
                                        count: dd.count,
                                    };
                                }),
                                use_rebate: parseInt(rebate, 10),
                            }).then((res) => __awaiter(void 0, void 0, void 0, function* () {
                                if (rebate == 0 || (res.result && res.response.data.use_rebate)) {
                                    ApiShop.setRebateValue(`${rebate}`);
                                    TriggerEvent.trigger({
                                        gvc: gvc,
                                        widget: widget,
                                        clickEvent: object.rebateSuccess,
                                        subData: res.response.data,
                                        element: element,
                                    });
                                }
                                else {
                                    ApiShop.setRebateValue('');
                                    TriggerEvent.trigger({
                                        gvc: gvc,
                                        widget: widget,
                                        clickEvent: object.rebateError,
                                        subData: res.response.data,
                                        element: element,
                                    });
                                }
                                resolve(res.response.data);
                            }));
                        }));
                    }));
                },
            };
        },
    };
});
