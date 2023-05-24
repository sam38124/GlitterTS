export const styleAttr = [
    {
        tag: "margin", title: "間距", innerHtml: (gvc, data) => {
            const glitter = window.glitter;
            return `
            <div class="alert alert-dark mt-2">
            <span class="fw-bold">範例:</span>10px,10em,10pt,10%
</div>
            ${['margin-left', 'margin-right', 'margin-top', 'margin-bottom'].map((dd, index) => {
                var _a;
                const k = ["左", "右", "上", "下"][index];
                return glitter.htmlGenerate.editeInput({
                    gvc: gvc,
                    title: `${k}側間距`,
                    default: (_a = data[dd]) !== null && _a !== void 0 ? _a : "",
                    placeHolder: `輸入${k}側間距`,
                    callback: (text) => {
                        data[dd] = text;
                    }
                });
            }).join('')}`;
        }
    },
    {
        tag: "font-size", title: "字體大小", innerHtml: (gvc, data) => {
            var _a;
            const glitter = window.glitter;
            data["font-size"] = (_a = data["font-size"]) !== null && _a !== void 0 ? _a : "14px";
            return ` <div class="alert alert-dark mt-2">
            <span class="fw-bold">範例:</span>10px,10em,10pt,10%
</div>` + glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `字體大小`,
                default: data["font-size"],
                placeHolder: `輸入字體大小`,
                callback: (text) => {
                    data["font-size"] = text;
                }
            });
        }
    }
];
