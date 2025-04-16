const glitter = window.glitter;
glitter.htmlGenerate.share.styleEditor = {
    render: (obj) => {
        return glitter.htmlGenerate.editeText({
            gvc: obj.gvc,
            title: '',
            default: obj.widget.css.style[obj.tag] || obj.def,
            placeHolder: `輸入設計樣式`,
            callback: (text) => {
                obj.widget.css.style[obj.tag] = text;
                obj.widget.refreshComponent();
            }
        });
    }
};
function styleValue(obj) {
    var _a;
    obj.widget.css.style[obj.tag] = (_a = obj.widget.css.style[obj.tag]) !== null && _a !== void 0 ? _a : [];
    return;
}
export {};
