import { EditorElem } from "../../glitterBundle/plugins/editor-elem.js";
const html = String.raw;
export class ColorSelector {
    static main(cf) {
        var _a;
        const globalValue = cf.gvc.glitter.share.editorViewModel.appConfig;
        globalValue.color_theme = (_a = globalValue.color_theme) !== null && _a !== void 0 ? _a : [];
        return [`<div class="my-2"></div>`,
            EditorElem.colorSelect({
                gvc: cf.gvc,
                title: cf.widget.bundle.form_title,
                def: cf.widget.bundle.form_data[cf.widget.bundle.form_key],
                callback: (text) => {
                    cf.widget.bundle.form_data[cf.widget.bundle.form_key] = text;
                    cf.widget.bundle.refresh && cf.widget.bundle.refresh();
                },
            })
        ].join('');
    }
}
window.glitter.setModule(import.meta.url, ColorSelector);
