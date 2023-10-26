import { TriggerEvent } from "../plugins/trigger-event.js";
import { Editor } from "./editor.js";
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
                return [
                    TriggerEvent.editer(gvc, widget, widget.data.clickEvent, {
                        hover: false,
                        option: [],
                        title: "代碼事件"
                    }),
                    Editor.select({
                        title: "觸發時機",
                        gvc: gvc,
                        def: widget.data.triggerTime,
                        array: [
                            { title: "渲染前", value: "first" },
                            { title: "渲染後", value: "last" }
                        ],
                        callback: (text) => {
                            widget.data.triggerTime = text;
                        }
                    })
                ].join('');
            }
        };
    }
};
