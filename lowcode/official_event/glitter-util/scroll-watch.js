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
            object.scrollTOP = (_a = object.scrollTOP) !== null && _a !== void 0 ? _a : {};
            object.scrollBT = (_b = object.scrollBT) !== null && _b !== void 0 ? _b : {};
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.scrollTOP, {
                            hover: false,
                            option: [],
                            title: "滾動至頂部"
                        }),
                        TriggerEvent.editer(gvc, widget, object.scrollBT, {
                            hover: false,
                            option: [],
                            title: "滾動至底部"
                        }),
                    ].join(`<div class="my-2"></div>`);
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        let targetElement = element === null || element === void 0 ? void 0 : element.e;
                        if (targetElement.scrollWatch) {
                            targetElement.removeEventListener('scroll', targetElement.scrollWatch);
                        }
                        targetElement.scrollWatch = function () {
                            if (targetElement.scrollTop + targetElement.clientHeight >= targetElement.scrollHeight) {
                                TriggerEvent.trigger({
                                    gvc: gvc, widget: widget, clickEvent: object.scrollBT, subData: subData, element: element
                                });
                            }
                        };
                        targetElement.addEventListener('scroll', targetElement.scrollWatch);
                        resolve(true);
                    }));
                },
            };
        },
    };
});
