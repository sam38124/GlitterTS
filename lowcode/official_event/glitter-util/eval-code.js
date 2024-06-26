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
        fun: (gvc, widget, object, subData, element) => {
            return {
                editor: () => {
                    object.codeVersion = 'v2';
                    const html = String.raw;
                    return html `
                        <div class="w-100">
                            ${EditorElem.codeEditor({
                        gvc: gvc,
                        height: 500,
                        initial: object.code,
                        title: '代碼區塊',
                        callback: (text) => {
                            object.code = text;
                        },
                        structStart: `((gvc,widget,object,subData,element)=>{`,
                    })}
                        </div>`;
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        var _a;
                        try {
                            const queryWhere = `
                            /*
      ->Tag->${widget.tag}
      ->Label->${widget.label}
      ->ID->${widget.id}
      */
                            `;
                            const a = object.codeVersion == 'v2'
                                ? eval(`
                                        (() => {
                                            try {
                                                return (() => {
                                                    ${queryWhere}
                                                    ${object.code}
                                                })()
                                            } catch (e) {
                                                console.log(e)
                                                return undefined
                                            }
                                        })()
                                    `)
                                : eval(object.code);
                            if (a.then) {
                                a.then((data) => {
                                    resolve(data);
                                });
                            }
                            else {
                                resolve(a);
                            }
                        }
                        catch (e) {
                            resolve((_a = object.errorCode) !== null && _a !== void 0 ? _a : false);
                        }
                    }));
                },
            };
        }
    };
});
