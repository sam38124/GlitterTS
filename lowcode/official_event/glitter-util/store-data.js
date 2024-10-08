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
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            var _a, _b;
            object.storeData = (_a = object.storeData) !== null && _a !== void 0 ? _a : {};
            object.storeTag = (_b = object.storeTag) !== null && _b !== void 0 ? _b : {};
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.storeTag, {
                            hover: false,
                            option: [],
                            title: "取得儲存標籤"
                        }),
                        TriggerEvent.editer(gvc, widget, object.storeData, {
                            hover: false,
                            option: [],
                            title: "取得儲存資料"
                        })
                    ].join(`<div class="my-2"></div>`);
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const storeTag = (yield TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.storeTag, subData: subData, element: element
                        }));
                        const storeData = (yield TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.storeData, subData: subData, element: element
                        }));
                        gvc.glitter.setPro(storeTag, storeData, () => {
                            resolve(true);
                        });
                    }));
                },
            };
        },
    };
});
