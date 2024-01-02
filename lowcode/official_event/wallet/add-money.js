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
import { ApiWallet } from "../../glitter-base/route/wallet.js";
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            var _a, _b;
            object.saveMoney = (_a = object.saveMoney) !== null && _a !== void 0 ? _a : {};
            object.error = (_b = object.error) !== null && _b !== void 0 ? _b : {};
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.saveMoney, {
                            hover: false,
                            option: [],
                            title: '儲值金額'
                        }),
                        TriggerEvent.editer(gvc, widget, object.error, {
                            hover: false,
                            option: [],
                            title: '儲值失敗事件'
                        })
                    ].join(`<div class="my-2"></div>`);
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const saveMoney = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.saveMoney
                        });
                        ApiWallet.store({
                            total: saveMoney,
                            note: {},
                            return_url: location.href
                        }).then((res) => __awaiter(void 0, void 0, void 0, function* () {
                            if (res.response.form) {
                                $('body').html(res.response.form);
                                setTimeout(() => {
                                    console.log(document.querySelector('#submit').click());
                                }, 1000);
                            }
                            else {
                                yield TriggerEvent.trigger({
                                    gvc: gvc,
                                    widget: widget,
                                    clickEvent: object.error
                                });
                            }
                            resolve(false);
                        }));
                    }));
                },
            };
        }
    };
});
