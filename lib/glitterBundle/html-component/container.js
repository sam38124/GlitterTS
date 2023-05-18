import { widgetComponent } from "./widget.js";
export const containerComponent = {
    render: (gvc, widget, setting, hoverID, subData) => {
        var _a, _b;
        widget.data.setting = (_a = widget.data.setting) !== null && _a !== void 0 ? _a : [];
        widget.data.styleEd = (_b = widget.data.styleEd) !== null && _b !== void 0 ? _b : {};
        const glitter = window.glitter;
        const htmlGenerate = new glitter.htmlGenerate(widget.data.setting, hoverID);
        return {
            view: () => {
                return widgetComponent.render(gvc, widget, setting, hoverID, subData).view();
            },
            editor: (() => {
                return widgetComponent.render(gvc, widget, setting, hoverID, subData).editor();
            })
        };
    }
};
