import {GVC} from '../../glitterBundle/GVController.js';
import {Storage} from '../../glitterBundle/helper/storage.js';
import {Main_editor} from '../../jspage/function-page/main_editor.js';
import {NormalPageEditor} from '../../editor/normal-page-editor.js';
import {EditorConfig} from '../../editor-config.js';
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";

const html = String.raw;

export class ColorSelector {
    public static main(cf: { gvc: GVC; formData: any; widget: any; key: string; callback: (data: any) => void }) {
        const globalValue = cf.gvc.glitter.share.editorViewModel.appConfig;
        globalValue.color_theme = globalValue.color_theme ?? [];
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
        ].join('')
    }


}

(window as any).glitter.setModule(import.meta.url, ColorSelector);
