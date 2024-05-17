import { TriggerEvent } from "../plugins/trigger-event.js";
import { EditorElem } from "../plugins/editor-elem.js";
export const codeComponent = {
    render: (gvc, widget, setting, hoverID, subData, htmlGenerate) => {
        var _a, _b;
        widget.data.triggerTime = (_a = widget.data.triggerTime) !== null && _a !== void 0 ? _a : "first";
        widget.data.clickEvent = (_b = widget.data.clickEvent) !== null && _b !== void 0 ? _b : {};
        return {
            view: () => {
                return new Promise((resolve, reject) => {
                    const a = TriggerEvent.trigger({
                        gvc: gvc, widget: widget, clickEvent: widget.data.clickEvent, subData: subData,
                    });
                    a.then((res) => {
                        resolve(res);
                    });
                });
            },
            editor: () => {
                return gvc.bindView(() => {
                    const id = gvc.glitter.getUUID();
                    return {
                        bind: id,
                        view: () => {
                            var _a;
                            let array = [
                                TriggerEvent.editer(gvc, widget, widget.data.clickEvent, {
                                    hover: false,
                                    option: [],
                                    title: "代碼事件"
                                }),
                                EditorElem.editeInput({
                                    gvc: gvc,
                                    title: '事件名稱',
                                    default: `${widget.label}`,
                                    placeHolder: '請輸入事件名稱',
                                    callback: (text) => {
                                        widget.label = text;
                                        gvc.notifyDataChange(id);
                                    },
                                    type: 'text'
                                }),
                                EditorElem.select({
                                    title: "觸發時機",
                                    gvc: gvc,
                                    def: widget.data.triggerTime,
                                    array: [
                                        { title: "渲染前", value: "first" },
                                        { title: "渲染後", value: "last" },
                                        { title: "異步執行", value: "async" },
                                        { title: "定時執行", value: "timer" }
                                    ],
                                    callback: (text) => {
                                        widget.data.triggerTime = text;
                                        gvc.notifyDataChange(id);
                                    }
                                })
                            ];
                            if (widget.data.triggerTime === 'timer') {
                                widget.data.timer = (_a = widget.data.timer) !== null && _a !== void 0 ? _a : 1000;
                                array.push(EditorElem.editeInput({
                                    gvc: gvc,
                                    title: '設定定時(毫秒)',
                                    default: `${widget.data.timer}`,
                                    placeHolder: '請輸入定時秒數',
                                    callback: (text) => {
                                        widget.data.timer = text;
                                        gvc.notifyDataChange(id);
                                    },
                                    type: 'text'
                                }));
                            }
                            return array.join('');
                        }
                    };
                });
            }
        };
    }
};
