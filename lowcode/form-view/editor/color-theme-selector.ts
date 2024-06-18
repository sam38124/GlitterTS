import { GVC } from '../../glitterBundle/GVController.js';
import { Storage } from '../../glitterBundle/helper/storage.js';

const html = String.raw;

class ColorThemeSelector {
    public static main(cf: { gvc: GVC; formData: any; widget: any; key: string; callback: (data: any) => void }) {
        const globalValue = cf.gvc.glitter.share.editorViewModel.appConfig;
        globalValue.color_theme = globalValue.color_theme ?? [];
        const select = '0';
        return cf.gvc.bindView(() => {
            const id = cf.gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    if (typeof cf.widget.bundle.form_data[cf.widget.bundle.form_key] !== 'object') {
                        cf.widget.bundle.form_data[cf.widget.bundle.form_key] = {};
                    }
                    const select = cf.widget.bundle.form_data[cf.widget.bundle.form_key];
                    return html` <div class="tx_normal my-2">${cf.widget.bundle.form_title}</div>
                        <div
                            class="position-relative"
                            style="width: 100%;  padding: 18px 12px;border-radius: 7px; overflow: hidden; border: 1px #DDDDDD solid; flex-direction: column; justify-content: center; align-items: flex-start; gap: 32px; display: inline-flex"
                        >
                            <div style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 10px; display: inline-flex">
                                <div
                                    style="padding: 9px 18px;background: white; border-radius: 7px; overflow: hidden; border: 1px #DDDDDD solid; justify-content: center; align-items: center; display: flex"
                                >
                                    <div style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: center; gap: 2px; display: inline-flex">
                                        <div style="flex-direction: column; justify-content: flex-start; align-items: center; display: flex">
                                            <div style="color: #554233; font-size: 17px;  font-weight: 400; word-wrap: break-word">Title</div>
                                            <div style="color: #554233; font-size: 14px;  font-weight: 400; word-wrap: break-word">Aa</div>
                                        </div>
                                        <div style="width: 57px; justify-content: flex-start; align-items: flex-start; gap: 4px; display: inline-flex">
                                            <div style="width: 26.50px; height: 13px; position: relative; background: white; border-radius: 7px; border: 1px #554233 solid"></div>
                                            <div style="width: 26.50px; height: 13px; position: relative; background: #554233; border-radius: 7px; border: 1px #554233 solid"></div>
                                        </div>
                                    </div>
                                </div>
                                <div style="flex: 1 1 0; flex-direction: column; justify-content: center; align-items: flex-start; gap: 4px; display: inline-flex">
                                    <div style="align-self: stretch; color: #393939; font-size: 16px;  font-weight: 400; word-wrap: break-word">
                                        ${(() => {
                                            if (globalValue.color_theme[parseInt(select.id, 10)]) {
                                                return `配色${parseInt(select.id, 10) + 1}`;
                                            } else {
                                                return `尚未設定`;
                                            }
                                        })()}
                                    </div>
                                </div>
                                <div
                                    class="cursor_it ${(() => {
                                        if (!globalValue.color_theme[parseInt(select.id, 10)]) {
                                            return ``;
                                        } else {
                                            return `d-none`;
                                        }
                                    })()}"
                                    style="color: #3366BB; font-size: 16px;  font-weight: 400; word-wrap: break-word"
                                    onclick="${cf.gvc.event(() => {
                                        Storage.page_setting_item = 'color';
                                        cf.gvc.recreateView();
                                    })}"
                                >
                                    編輯
                                </div>
                            </div>
                            <div class="w-100 ">
                                <div class="bt_border_editor" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">變更配色</div>
                                <div class="dropdown-menu my-1 p-0 rounded-3 position-fixed  " style="overflow: hidden;max-width: 270px;">
                                    <div class="d-flex flex-column">
                                        ${globalValue.color_theme
                                            .map((value: any, index: number, array: any) => {
                                                return html` <div
                                                    class="py-2 cursor_it"
                                                    style="width: 100%;  justify-content: flex-start; align-items: center; gap: 10px; display: inline-flex;
padding-left:12px;padding-right: 12px;${`${index}` === select.id ? `background:#F7F7F7;` : ``};"
                                                    onclick="${cf.gvc.event(() => {
                                                        cf.widget.bundle.form_data[cf.widget.bundle.form_key].id = `${index}`;
                                                        [
                                                            {
                                                                key: 'background',
                                                                title: '背景顏色',
                                                            },
                                                            {
                                                                key: 'title',
                                                                title: '標題顏色',
                                                            },
                                                            {
                                                                key: 'content',
                                                                title: '內文',
                                                            },
                                                            {
                                                                key: 'solid-button-bg',
                                                                title: '純色按鈕',
                                                            },
                                                            {
                                                                key: 'solid-button-text',
                                                                title: '純色按鈕文字',
                                                            },
                                                            {
                                                                key: 'border-button-bg',
                                                                title: '邊框按鈕',
                                                            },
                                                            {
                                                                key: 'border-button-text',
                                                                title: '邊框按鈕文字',
                                                            },
                                                        ].map((dd) => {
                                                            cf.widget.bundle.form_data[cf.widget.bundle.form_key][dd.key] = `@{{theme_color.${index}.${dd.key}}}`;
                                                            cf.widget.bundle.refresh && cf.widget.bundle.refresh();
                                                            cf.gvc.notifyDataChange(id);
                                                        });
                                                    })}"
                                                >
                                                    <div
                                                        style="width:100px;padding: 9px 18px;background: white; border-radius: 7px; overflow: hidden; border: 1px #DDDDDD solid; justify-content: center; align-items: center; display: flex"
                                                    >
                                                        <div style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: center; gap: 2px; display: inline-flex">
                                                            <div style="flex-direction: column; justify-content: flex-start; align-items: center; display: flex">
                                                                <div style="color: #554233; font-size: 17px;  font-weight: 400; word-wrap: break-word">Title</div>
                                                                <div style="color: #554233; font-size: 14px;  font-weight: 400; word-wrap: break-word">Aa</div>
                                                            </div>
                                                            <div style="width: 57px; justify-content: flex-start; align-items: flex-start; gap: 4px; display: inline-flex">
                                                                <div style="width: 26.50px; height: 13px; position: relative; background: white; border-radius: 7px; border: 1px #AD9C8F solid"></div>
                                                                <div style="width: 26.50px; height: 13px; position: relative; background: #AD9C8F; border-radius: 7px"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style="width: 100px; flex-direction: column; justify-content: center; align-items: flex-start; gap: 4px; display: inline-flex">
                                                        <div style="align-self: stretch; color: #393939; font-size: 16px;  font-weight: 400; word-wrap: break-word">配色${index + 1}</div>
                                                    </div>
                                                    <div class="flex-fill"></div>
                                                    ${value.select ? `<i class="fa-solid fa-circle-check " style="color: #393939;font-size:24px;"></i>` : ``}
                                                </div>`;
                                            })
                                            .join('')}
                                    </div>
                                    <div
                                        class="w-100 d-flex align-items-center justify-content-center bt_3366BB_no_line"
                                        style="gap:5px;"
                                        onclick="${cf.gvc.event(() => {
                                            Storage.page_setting_item = 'color';
                                            cf.gvc.recreateView();
                                        })}"
                                    >
                                        <i class="fa-solid fa-plus"></i>新增配色
                                    </div>
                                </div>
                            </div>
                        </div>`;
                },
            };
        });
    }
}

(window as any).glitter.setModule(import.meta.url, ColorThemeSelector);
