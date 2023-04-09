import { EditorElem } from "./editor-elem.js";
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
    },
    {
        tag: "background-image", title: "背景圖片", innerHtml: (gvc, data) => {
            var _a, _b;
            data["background-image"] = (_a = data["background-image"]) !== null && _a !== void 0 ? _a : "";
            data["background-repeat"] = (_b = data["background-repeat"]) !== null && _b !== void 0 ? _b : "repeat";
            return gvc.bindView(() => {
                const id = gvc.glitter.getUUID();
                return {
                    bind: id,
                    view: () => {
                        return gvc.map([EditorElem.uploadImage({
                                gvc: gvc,
                                title: `背景圖`,
                                def: data["background-image"],
                                callback: (dd) => {
                                    if (dd.indexOf(`url('`) === -1) {
                                        data["background-image"] = `url('${dd}')`;
                                    }
                                    gvc.notifyDataChange(id);
                                },
                            }), EditorElem.select({
                                title: '是否重複繪圖',
                                gvc: gvc,
                                def: data["background-repeat"],
                                callback: (text) => {
                                    data["background-repeat"] = text;
                                },
                                array: [{ title: "是", value: "repeat" }, { title: "否", value: "no-repeat" }],
                            })]);
                    },
                    divCreate: {}
                };
            });
        }
    }
];
