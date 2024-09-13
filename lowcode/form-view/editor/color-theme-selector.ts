import { GVC } from '../../glitterBundle/GVController.js';
import { Storage } from '../../glitterBundle/helper/storage.js';
import { Main_editor } from '../../jspage/function-page/main_editor.js';
import { NormalPageEditor } from '../../editor/normal-page-editor.js';
import { EditorConfig } from '../../editor-config.js';

const html = String.raw;

export class ColorThemeSelector {
    public static main(cf: { gvc: GVC; formData: any; widget: any; key: string; callback: (data: any) => void }) {
        const globalValue = cf.gvc.glitter.share.editorViewModel.appConfig;
        globalValue.color_theme = globalValue.color_theme ?? [];
        const select = '0';

        return cf.gvc.bindView(() => {
            const id = cf.gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    try {
                        if (typeof cf.widget.bundle.form_data[cf.widget.bundle.form_key] !== 'object') {
                            cf.widget.bundle.form_data[cf.widget.bundle.form_key] = {};
                        }
                        const select = cf.widget.bundle.form_data[cf.widget.bundle.form_key];
                        return html`
                            <div class="tx_normal my-2">${cf.widget.bundle.form_title}</div>
                            <div class="w-100 colorSettingGuide">
                                ${[
                                    {
                                        title: html`全站統一配色`,
                                        hint: `  <span class=""
                                                  style="color:#8D8D8D;font-size: 13px;white-space: normal;word-break: break-all;line-height: 16px;">選擇一個配色，若是進行了修改，全站所有應用此配色的元件將自動更新，方便未來統一管理。</span>`,
                                        value: 'global',
                                    },
                                    {
                                        title: html`自定義配色`,
                                        hint: ` <span class="my-2"
                                                  style="color:#8D8D8D;font-size: 13px;white-space: normal;word-break: break-all;line-height: 16px;">可以單獨為元件設置獨特顏色，實現獨一無二的設計效果。</span>`,
                                        value: 'custom',
                                    },
                                ]
                                    .map((dd) => {
                                        return html` <div>
                                            ${[
                                                html` <div
                                                    class="d-flex  cursor_pointer"
                                                    style="gap:8px;"
                                                    onclick="${cf.gvc.event(() => {
                                                        
                                                        const key = `${select.id}`.split('-')[0] === 'custom' ? `custom` : `global`;
                                                        if (key === dd.value) {
                                                            return;
                                                        }
                                                        if (dd.value === 'custom') {
                                                            ColorThemeSelector.changeTheme(cf, `custom-${cf.widget.bundle.form_key}`, {}, select, globalValue, id, true);
                                                        } else {
                                                            ColorThemeSelector.changeTheme(cf, 0, globalValue.color_theme[0], select, globalValue, id, false);
                                                        }
                                                        cf.gvc.notifyDataChange(id);
                                                    })}"
                                                >
                                                    ${(`${select.id}`.split('-')[0] === 'custom' ? `custom` : `global`) === dd.value
                                                        ? `<i class="fa-sharp fa-solid fa-circle-dot color39" style="margin-top: 5px;"></i>`
                                                        : ` <div class="c_39_checkbox " style="margin-top: 5px;"></div>`}
                                                    <div
                                                        class="tx_normal fw-normal d-flex flex-column "
                                                        style="max-width: calc(100% - 40px);white-space: normal;word-break: break-all;overflow: hidden;line-height: 25px;"
                                                    >
                                                        ${dd.title} ${(`${select.id}`.split('-')[0] === 'custom' ? `custom` : `global`) === dd.value ? dd.hint : ``}
                                                    </div>
                                                </div>`,
                                                html` <div class="d-flex position-relative mt-2" style="">
                                                    <div class="ms-0 border-end position-absolute h-100" style="left: 5px;"></div>
                                                    <div class="flex-fill " style="margin-left:20px;max-width: 100%;">
                                                        ${(() => {
                                                            const key = `${select.id}`.split('-')[0] === 'custom' ? `custom` : `global`;
                                                            if (key !== dd.value) {
                                                                return ``;
                                                            }
                                                            if (key === 'global') {
                                                                return `<div
                                    class="position-relative"
                                    style="width: 100%;  padding: 18px 12px;border-radius: 7px; overflow: hidden; border: 1px #DDDDDD solid; flex-direction: column; justify-content: center; align-items: flex-start; gap: 32px; display: inline-flex"
                            >
                                <div style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 10px; display: inline-flex">
                                    <div style="width: 130px;">
                                        ${Main_editor.colorCard(`${select.id}`.split('-')[0] === 'custom' ? select : globalValue.color_theme[parseInt(select.id, 10)])}
                                    </div>
                                    <div style="flex: 1 1 0; flex-direction: column; justify-content: center; align-items: flex-start; gap: 4px; display: inline-flex">
                                        <div style="align-self: stretch; color: #393939; font-size: 16px;  font-weight: 400; word-wrap: break-word">
                                            ${(() => {
                                                if (`${select.id}`.split('-')[0] === 'custom') {
                                                    return `自定義`;
                                                } else if (globalValue.color_theme[parseInt(select.id, 10)]) {
                                                    return `配色${parseInt(select.id, 10) + 1}`;
                                                } else {
                                                    return `尚未設定`;
                                                }
                                            })()}
                                        </div>
                                    </div>

                                    <div class="guide-user-editor-10" style="cursor: pointer;" onclick="${cf.gvc.event(() => {
                                        const custom = `${select.id}`.split('-')[0] === 'custom';
                                        NormalPageEditor.toggle({
                                            visible: true,
                                            view: Main_editor.color_detail({
                                                gvc: cf.gvc,
                                                back: () => {
                                                    NormalPageEditor.toggle({ visible: false });
                                                    cf.gvc.notifyDataChange(id);
                                                },
                                                filter: (key) => {
                                                    if (!cf.widget.bundle.root_widget) {
                                                        return true;
                                                    }
                                                    const inf = JSON.stringify(cf.widget.bundle.root_widget).replace(/\s+/g, '');

                                                    return inf.includes(`.${key}`) || inf.includes(`("${key}`) || inf.includes(`('${key}`) || inf.includes(`['${key}']`) || inf.includes(`["${key}"]`);
                                                },
                                                name: custom ? `自定義配色` : `配色${parseInt(select.id, 10) + 1}`,
                                                data: custom ? select : globalValue.color_theme[parseInt(select.id, 10)],
                                                index: parseInt(select.id, 10),
                                            }),
                                            title: '顏色編輯',
                                        });
                                    })}">編輯
                                    </div>
                                </div>
                            </div>
                            <div class="w-100 mt-2">
                                <div class="bt_border_editor" data-bs-toggle="dropdown" aria-haspopup="true"
                                     aria-expanded="false">變更配色
                                </div>
                                <div class="dropdown-menu my-1 p-0 rounded-3 position-fixed  "
                                     style="overflow: hidden;max-width: 270px;">
                                    <div class="d-flex flex-column">
                                        ${globalValue.color_theme
                                            .map((value: any, index: number, array: any) => {
                                                return ColorThemeSelector.line_items(cf, index, value, select, globalValue, id, false);
                                            })
                                            .join('')}
                                    </div>
                                    <div class="w-100 d-flex align-items-center justify-content-center bt_3366BB_no_line"
                                         style="gap:5px;" onclick="${cf.gvc.event(() => {
                                             const vm: any = {};
                                             vm.data = { id: cf.gvc.glitter.getUUID() };
                                             globalValue.color_theme.push(vm.data);
                                             vm.name = '配色' + globalValue.color_theme.length;
                                             vm.type = 'detail';
                                             vm.index = globalValue.color_theme.length - 1;
                                             EditorConfig.color_setting_config.map((dd) => {
                                                 cf.widget.bundle.form_data[cf.widget.bundle.form_key][dd.key] = `@{{theme_color.${vm.index}.${dd.key}}}`;
                                             });
                                             cf.widget.bundle.form_data[cf.widget.bundle.form_key].id = `${vm.index}`;
                                             cf.widget.bundle.refresh && cf.widget.bundle.refresh();
                                             cf.gvc.notifyDataChange(id);
                                             NormalPageEditor.toggle({
                                                 visible: true,
                                                 view: Main_editor.color_detail({
                                                     gvc: cf.gvc,
                                                     back: () => {
                                                         NormalPageEditor.toggle({ visible: false });
                                                         cf.widget.bundle.refresh && cf.widget.bundle.refresh();
                                                         cf.gvc.notifyDataChange(id);
                                                     },
                                                     filter: (key) => {
                                                         if (!cf.widget.bundle.root_widget) {
                                                             return true;
                                                         }
                                                         const inf = JSON.stringify(cf.widget.bundle.root_widget).replace(/\s+/g, '');
                                                         return (
                                                             inf.includes(`.${key}`) || inf.includes(`("${key}`) || inf.includes(`('${key}`) || inf.includes(`['${key}']`) || inf.includes(`["${key}"]`)
                                                         );
                                                     },
                                                     name: vm.name,
                                                     data: vm.data,
                                                     index: vm.index,
                                                 }),
                                                 title: '顏色編輯',
                                             });
                                         })}"><i class="fa-solid fa-plus"></i>新增配色
                                    </div>
                                </div>
                            </div>`;
                                                            } else {
                                                                const vm: any = {};
                                                                vm.data = cf.widget.bundle.form_data[cf.widget.bundle.form_key];
                                                                vm.name = ``;
                                                                vm.type = 'detail';
                                                                vm.index = `custom-${cf.widget.bundle.form_key}`;
                                                                return Main_editor.color_detail_custom({
                                                                    gvc: cf.gvc,
                                                                    back: () => {
                                                                        cf.widget.bundle.refresh && cf.widget.bundle.refresh();
                                                                        cf.gvc.notifyDataChange(id);
                                                                    },
                                                                    filter: (key) => {
                                                                        if (!cf.widget.bundle.root_widget) {
                                                                            return true;
                                                                        }
                                                                        const inf = JSON.stringify(cf.widget.bundle.root_widget).replace(/\s+/g, '');
                                                                        return (
                                                                            inf.includes(`.${key}`) ||
                                                                            inf.includes(`("${key}`) ||
                                                                            inf.includes(`('${key}`) ||
                                                                            inf.includes(`['${key}']`) ||
                                                                            inf.includes(`["${key}"]`)
                                                                        );
                                                                    },
                                                                    name: vm.name,
                                                                    data: vm.data,
                                                                    index: vm.index,
                                                                });
                                                            }
                                                        })()}
                                                    </div>
                                                </div>`,
                                            ].join('')}
                                        </div>`;
                                    })
                                    .join(`<div class="my-2"></div>`)}
                            </div>

                            </div>`;
                    } catch (e) {
                        return `<div style="white-space: normal;">${e}</div>`;
                    }
                },
            };
        });
    }

    public static changeTheme(cf: any, index: any, value: any, select: any, globalValue: any, id: string, custom: boolean) {
        if (custom && !(cf.widget.bundle.form_data[cf.widget.bundle.form_key].id === `custom-${cf.widget.bundle.form_key}`)) {
            cf.widget.bundle.form_data[cf.widget.bundle.form_key].id = `custom-${cf.widget.bundle.form_key}`;
            const def: any = {
                title: '#030303',
                content: '#000000',
                'sec-title': '#000000',
                background: '#ffffff',
                'sec-background': '#FFFFFF',
                'solid-button-bg': '#000000',
                'border-button-bg': '#000000',
                'solid-button-text': '#ffffff',
                'border-button-text': '#000000',
            };
            EditorConfig.color_setting_config.map((dd) => {
                cf.widget.bundle.form_data[cf.widget.bundle.form_key][dd.key] = def[dd.key];
            });
            cf.widget.bundle.refresh && cf.widget.bundle.refresh();
            cf.gvc.notifyDataChange(id);
        } else if (!custom) {
            cf.widget.bundle.form_data[cf.widget.bundle.form_key].id = `${index}`;
            EditorConfig.color_setting_config.map((dd) => {
                cf.widget.bundle.form_data[cf.widget.bundle.form_key][dd.key] = `@{{theme_color.${index}.${dd.key}}}`;
            });
            cf.widget.bundle.refresh && cf.widget.bundle.refresh();
            cf.gvc.notifyDataChange(id);
        }
    }

    public static line_items(cf: any, index: any, value: any, select: any, globalValue: any, id: string, custom: boolean) {
        return `<div
                 class="py-2 cursor_pointer"
                 style="width: 100%;  justify-content: flex-start; align-items: center; gap: 10px; display: inline-flex;
padding-left:12px;padding-right: 12px;${`${index}` === select.id ? `background:#F7F7F7;` : ``};"
                 onclick="${cf.gvc.event(() => {
                     ColorThemeSelector.changeTheme(cf, index, value, select, globalValue, id, custom);
                 })}"
             >
                 <div style="width:100px;">${Main_editor.colorCard(custom ? cf.widget.bundle.form_data[cf.widget.bundle.form_key] : globalValue.color_theme[index])}</div>
                 <div style="width: 100px; flex-direction: column; justify-content: center; align-items: flex-start; gap: 4px; display: inline-flex">
                     <div style="align-self: stretch; color: #393939; font-size: 16px;  font-weight: 400; word-wrap: break-word">${custom ? `自定義配色` : `配色${index + 1}`}</div>
                 </div>
                 <div class="flex-fill"></div>
                 ${value.select ? `<i class="fa-solid fa-circle-check " style="color: #393939;font-size:24px;"></i>` : ``}
             </div>`;
    }
}

(window as any).glitter.setModule(import.meta.url, ColorThemeSelector);
