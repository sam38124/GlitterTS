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
import { EditorElem } from "../../glitterBundle/plugins/editor-elem.js";
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            var _a, _b;
            object.event = (_a = object.event) !== null && _a !== void 0 ? _a : {};
            object.delay = (_b = object.delay) !== null && _b !== void 0 ? _b : "1000";
            return {
                editor: () => {
                    return [
                        EditorElem.editeInput({
                            gvc: gvc,
                            title: '延遲秒數',
                            default: object.delay,
                            placeHolder: `請輸入欲延遲秒數`,
                            callback: (text) => {
                                object.delay = text;
                                widget.refreshComponent();
                            },
                            type: 'number'
                        }),
                        TriggerEvent.editer(gvc, widget, object.event, {
                            hover: false,
                            option: [],
                            title: "執行事件"
                        })
                    ].join('<div class="my-2"></div>');
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                            resolve(yield TriggerEvent.trigger({
                                gvc: gvc, widget: widget, clickEvent: object.event, subData: subData
                            }));
                        }), parseInt(object.delay, 10));
                    }));
                },
            };
        },
    };
});
