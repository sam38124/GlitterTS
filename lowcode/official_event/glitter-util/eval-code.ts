import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            return {
                editor: () => {
                    object.codeVersion = 'v2';
                    const html = String.raw;
                    return html`
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
                    return new Promise<any>(async (resolve, reject) => {
                        try {
                            const queryWhere = `
                            /*
      ->Tag->${(widget as any).tag}
      ->Label->${widget.label}
      ->ID->${widget.id}
      */
                            `;
                            const a =
                                object.codeVersion == 'v2'
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
                                a.then((data: any) => {
                                    resolve(data);
                                });
                            } else {
                                resolve(a);
                            }
                        } catch (e) {
                            resolve(object.errorCode ?? false);
                        }
                    });
                },
            };
        }
    }
})