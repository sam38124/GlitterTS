import { TriggerEvent } from '../../glitterBundle/plugins/trigger-event.js';
import { EditorElem } from "../../glitterBundle/plugins/editor-elem.js";
import { DynamicCode } from "./eval-code-event.js";
export const eval_code = TriggerEvent.createSingleEvent(import.meta.url, () => {
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
                    return DynamicCode.fun(gvc, widget, object, subData, element);
                },
            };
        }
    };
});
function getCheckSum(message) {
    return window.CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex);
}
