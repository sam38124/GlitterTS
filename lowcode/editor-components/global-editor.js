import { ToolSetting } from '../jspage/function-page/tool-setting.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
export class GlobalEditor {
    static main(obj) {
        var _a;
        const gvc = obj.gvc;
        const glitter = gvc.glitter;
        if ([
            ...glitter.share._global_component
                .filter((dd) => {
                return dd.template_config.tag.includes('標頭元件');
            })
                .map((dd) => {
                return dd.tag;
            }),
        ].includes(obj.widget.data.tag)) {
            obj.widget.header_refer = (_a = obj.widget.header_refer) !== null && _a !== void 0 ? _a : 'def';
            const c_view = [`<div class="mx-2 ">

${[`<div class="mx-n2 border-top"></div>`,
                    `<div class="fw-500 mb-2 mt-2">標頭樣式</div>`,
                    BgWidget.select({
                        gvc: gvc,
                        callback: (text) => {
                            obj.widget.header_refer = text;
                            glitter.share.selectEditorItem();
                        },
                        default: obj.widget.header_refer,
                        options: [
                            {
                                key: 'custom',
                                value: '自定義標頭樣式',
                            },
                            {
                                key: 'def',
                                value: '全站預設樣式',
                            },
                        ],
                    })
                ].join('')}</div>`];
            if (obj.widget.header_refer !== 'def') {
                c_view.push(ToolSetting.item({
                    gvc: gvc,
                    dd: {
                        title: '標頭選單',
                        tag: '標頭元件',
                        hint: ``,
                        toggle: true,
                    },
                }));
                c_view.push(obj.append);
            }
            return c_view.join('');
        }
        else {
            return obj.append;
        }
    }
}
window.glitter.setModule(import.meta.url, GlobalEditor);
