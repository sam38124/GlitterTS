import { EditorElem } from '../plugins/editor-elem.js';
import { NormalPageEditor } from '../../editor/normal-page-editor.js';
import { ShareDialog } from '../dialog/ShareDialog.js';
import { RenderValue } from './render-value.js';
const html = String.raw;
export class CustomStyle {
    static renderThemeEditor(gvc, widget, callback) {
        RenderValue.custom_style.initialWidget(widget);
        return [
            EditorElem.editeInput({
                gvc: gvc,
                title: `元件最大寬度
                           
                            `,
                default: widget.data._max_width,
                placeHolder: '',
                callback: (text) => {
                    widget.data._max_width = text;
                    (callback || widget.refreshComponent)();
                },
            }),
            EditorElem.editeInput({
                gvc: gvc,
                title: `元件最大高度
                           
                            `,
                default: widget.data._max_height,
                placeHolder: '',
                callback: (text) => {
                    widget.data._max_height = text;
                    (callback || widget.refreshComponent)();
                },
            }),
            `<div class="my-2"></div>`,
            EditorElem.select({
                title: '排版方式',
                gvc: gvc,
                def: widget.data._display_block,
                array: [
                    {
                        title: '預設',
                        value: 'def',
                    },
                    {
                        title: '垂直',
                        value: 'vertical',
                    },
                    {
                        title: '水平',
                        value: 'horizontal',
                    },
                ],
                callback: (text) => {
                    widget.data._display_block = text;
                    (callback || widget.refreshComponent)();
                },
            }),
            `<div class="my-2"></div>`,
            `<div class="my-2"></div>`,
            EditorElem.editeInput({
                gvc: gvc,
                title: `內距(上,右,下,左)`,
                default: [
                    {
                        title: '上',
                        key: 'top',
                    },
                    {
                        title: '右',
                        key: 'right',
                    },
                    {
                        title: '下',
                        key: 'bottom',
                    },
                    {
                        title: '左',
                        key: 'left',
                    },
                ]
                    .map((dd) => {
                    if (widget.data._padding[dd.key]) {
                        return widget.data._padding[dd.key];
                    }
                    else {
                        return `0`;
                    }
                })
                    .join(','),
                placeHolder: '',
                callback: (text) => {
                    const dialog = new ShareDialog(gvc.glitter);
                    if (text.split(',').length != 4) {
                        dialog.errorMessage({
                            text: '格式輸入錯誤',
                        });
                    }
                    else {
                        [
                            {
                                title: '上',
                                key: 'top',
                            },
                            {
                                title: '右',
                                key: 'right',
                            },
                            {
                                title: '下',
                                key: 'bottom',
                            },
                            {
                                title: '左',
                                key: 'left',
                            },
                        ].map((dd, index) => {
                            widget.data._padding[dd.key] = text.split(',')[index];
                        });
                        (callback || widget.refreshComponent)();
                    }
                },
            }),
            EditorElem.editeInput({
                gvc: gvc,
                title: `外距(上,右,下,左)`,
                default: [
                    {
                        title: '上',
                        key: 'top',
                    },
                    {
                        title: '右',
                        key: 'right',
                    },
                    {
                        title: '下',
                        key: 'bottom',
                    },
                    {
                        title: '左',
                        key: 'left',
                    },
                ]
                    .map((dd) => {
                    if (widget.data._margin[dd.key]) {
                        return widget.data._margin[dd.key];
                    }
                    else {
                        return `0`;
                    }
                })
                    .join(','),
                placeHolder: '',
                callback: (text) => {
                    const dialog = new ShareDialog(gvc.glitter);
                    if (text.split(',').length != 4) {
                        dialog.errorMessage({
                            text: '格式輸入錯誤',
                        });
                    }
                    else {
                        [
                            {
                                title: '上',
                                key: 'top',
                            },
                            {
                                title: '右',
                                key: 'right',
                            },
                            {
                                title: '下',
                                key: 'bottom',
                            },
                            {
                                title: '左',
                                key: 'left',
                            },
                        ].map((dd, index) => {
                            widget.data._margin[dd.key] = text.split(',')[index];
                        });
                        (callback || widget.refreshComponent)();
                    }
                },
            }),
            `<div class="my-2"></div>`,
            EditorElem.toggleExpand({
                gvc: gvc,
                title: `其餘樣式設計`,
                data: widget.data._other,
                innerText: () => {
                    return [
                        EditorElem.editeInput({
                            gvc: gvc,
                            title: '圓角',
                            type: 'number',
                            default: widget.data._border.radius || '0',
                            placeHolder: '單位px',
                            callback: (text) => {
                                widget.data._border.radius = text;
                                (callback || widget.refreshComponent)();
                            },
                        }),
                        EditorElem.editeInput({
                            gvc: gvc,
                            title: '邊框寬度',
                            type: 'number',
                            default: widget.data._border.width || '0',
                            placeHolder: '單位px',
                            callback: (text) => {
                                widget.data._border.width = text;
                                (callback || widget.refreshComponent)();
                            },
                        }),
                        EditorElem.editeInput({
                            gvc: gvc,
                            title: '邊框顏色',
                            type: 'color',
                            default: widget.data._border.color || '0',
                            placeHolder: '',
                            callback: (text) => {
                                widget.data._border.color = text;
                                (callback || widget.refreshComponent)();
                            },
                        }),
                        EditorElem.editeInput({
                            gvc: gvc,
                            title: '間距',
                            default: widget.data._gap || '',
                            placeHolder: '單位px',
                            callback: (text) => {
                                widget.data._gap = text;
                                (callback || widget.refreshComponent)();
                            },
                        }),
                        EditorElem.editeInput({
                            gvc: gvc,
                            title: '背景顏色',
                            type: 'color',
                            default: widget.data._background || '',
                            placeHolder: '請輸入背景顏色',
                            callback: (text) => {
                                widget.data._background = text;
                                (callback || widget.refreshComponent)();
                            },
                        }),
                        EditorElem.select({
                            title: '水平位置',
                            gvc: gvc,
                            def: widget.data._hor_position,
                            array: [
                                {
                                    title: '靠左',
                                    value: 'left',
                                },
                                {
                                    title: '置中',
                                    value: 'center',
                                },
                                {
                                    title: '靠右',
                                    value: 'right',
                                },
                            ],
                            callback: (text) => {
                                widget.data._hor_position = text;
                                (callback || widget.refreshComponent)();
                            },
                        }),
                        EditorElem.select({
                            title: '內容翻轉',
                            gvc: gvc,
                            def: widget.data._reverse,
                            array: [
                                {
                                    title: '是',
                                    value: 'true',
                                },
                                {
                                    title: '否',
                                    value: 'false',
                                },
                            ],
                            callback: (text) => {
                                widget.data._reverse = text;
                                (callback || widget.refreshComponent)();
                            },
                        }),
                        EditorElem.editeInput({
                            gvc: gvc,
                            title: '圖層高度',
                            type: 'number',
                            default: widget.data._z_index || '0',
                            placeHolder: '請輸入圖層高度',
                            callback: (text) => {
                                widget.data._z_index = text;
                                (callback || widget.refreshComponent)();
                            },
                        }),
                        `<div class="mt-2"></div>` +
                            EditorElem.editerDialog({
                                gvc: gvc,
                                dialog: () => {
                                    return EditorElem.styleEditor({
                                        gvc: gvc,
                                        title: '自訂Style代碼',
                                        height: 400,
                                        initial: widget.data._style || '',
                                        callback: (text) => {
                                            widget.data._style = text;
                                        },
                                    });
                                },
                                editTitle: '自訂設計代碼',
                                callback: () => {
                                    (callback || widget.refreshComponent)();
                                },
                            }),
                    ].join('');
                },
            }),
        ].join('');
    }
    static renderMarginEditor(gvc, widget, callback) {
        RenderValue.custom_style.initialWidget(widget);
        return [
            EditorElem.editeInput({
                gvc: gvc,
                title: `間距(上,右,下,左)`,
                default: [
                    {
                        title: '上',
                        key: 'top',
                    },
                    {
                        title: '右',
                        key: 'right',
                    },
                    {
                        title: '下',
                        key: 'bottom',
                    },
                    {
                        title: '左',
                        key: 'left',
                    },
                ]
                    .map((dd) => {
                    if (widget.data._padding[dd.key]) {
                        return widget.data._padding[dd.key];
                    }
                    else {
                        return `0`;
                    }
                })
                    .join(','),
                placeHolder: '',
                callback: (text) => {
                    const dialog = new ShareDialog(gvc.glitter);
                    if (text.split(',').length != 4) {
                        dialog.errorMessage({
                            text: '格式輸入錯誤',
                        });
                    }
                    else {
                        [
                            {
                                title: '上',
                                key: 'top',
                            },
                            {
                                title: '右',
                                key: 'right',
                            },
                            {
                                title: '下',
                                key: 'bottom',
                            },
                            {
                                title: '左',
                                key: 'left',
                            },
                        ].map((dd, index) => {
                            widget.data._padding[dd.key] = text.split(',')[index];
                        });
                        (callback || widget.refreshComponent)();
                    }
                },
            }),
            EditorElem.editeInput({
                gvc: gvc,
                title: `元件最大寬度
                           
                            `,
                default: widget.data._max_width,
                placeHolder: '',
                callback: (text) => {
                    widget.data._max_width = text;
                    (callback || widget.refreshComponent)();
                },
            }),
            EditorElem.editeInput({
                gvc: gvc,
                title: `元件最大高度
                           
                            `,
                default: widget.data._max_height,
                placeHolder: '',
                callback: (text) => {
                    widget.data._max_height = text;
                    (callback || widget.refreshComponent)();
                },
            }),
        ].join('');
    }
    static editor(gvc, widget, callback) {
        RenderValue.custom_style.initialWidget(widget);
        const html = String.raw;
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return [
                        {
                            title: html `套用統一容器`,
                            hint: `<span class=""
                                                  style="color:#8D8D8D;font-size: 13px;white-space: normal;word-break: break-all;line-height: 16px;">選擇一個全站容器，若是進行了修改，全站所有應用此容器的元件將自動更新，方便未來統一管理。</span>`,
                            value: 'global',
                        },
                        {
                            title: html `自定義容器`,
                            hint: ` <span class="my-2"
                                                  style="color:#8D8D8D;font-size: 13px;white-space: normal;word-break: break-all;line-height: 16px;">可以單獨為容器設計樣式，實現獨一無二的設計效果。</span>`,
                            value: 'custom',
                        },
                    ]
                        .map((dd) => {
                        return html ` <div>
                                ${[
                            html ` <div
                                        class="d-flex  cursor_pointer d-none"
                                        style="gap:8px;"
                                        onclick="${gvc.event(() => {
                                widget.data._style_refer = dd.value;
                                if (dd.value === 'global') {
                                    widget.data._style_refer_global = {
                                        index: gvc.glitter.share.global_container_theme[0] ? 0 : undefined,
                                    };
                                }
                                (callback || widget.refreshComponent)();
                                gvc.notifyDataChange(id);
                            })}"
                                    >
                                        ${widget.data._style_refer === dd.value
                                ? `<i class="fa-sharp fa-solid fa-circle-dot color39" style="margin-top: 5px;"></i>`
                                : ` <div class="c_39_checkbox " style="margin-top: 5px;"></div>`}
                                        <div
                                            class="tx_normal fw-normal d-flex flex-column"
                                            style="max-width: calc(100% - 40px);white-space: normal;word-break: break-all;overflow: hidden;line-height: 25px;"
                                        >
                                            ${dd.title} ${widget.data._style_refer === dd.value ? dd.hint : ``}
                                        </div>
                                    </div>`,
                            html ` <div class="d-flex position-relative mt-2" style="">
                                        <div class="ms-0 border-end position-absolute h-100" style="left: 5px;"></div>
                                        <div class="flex-fill " style="margin-left:20px;max-width: 100%;">
                                            ${(() => {
                                var _a;
                                if (widget.data._style_refer !== dd.value) {
                                    return ``;
                                }
                                if (widget.data._style_refer === 'global') {
                                    const globalValue = gvc.glitter.share.editorViewModel.appConfig;
                                    globalValue.container_theme = (_a = globalValue.container_theme) !== null && _a !== void 0 ? _a : [];
                                    return CustomStyle.globalContainerSelect(globalValue, gvc, widget.data._style_refer_global && widget.data._style_refer_global.index, (index) => {
                                        widget.data._style_refer_global = {
                                            index: index,
                                        };
                                        (callback || widget.refreshComponent)();
                                        gvc.notifyDataChange(id);
                                    });
                                }
                                else {
                                    return CustomStyle.renderThemeEditor(gvc, widget, callback);
                                }
                            })()}
                                        </div>
                                    </div>`,
                        ].join('')}
                            </div>`;
                    })
                        .join(`<div class="my-2"></div>`);
                },
                divCreate: {
                    class: `pt-2`,
                },
            };
        });
    }
    static editorMargin(gvc, widget, callback) {
        RenderValue.custom_style.initialWidget(widget);
        const html = String.raw;
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            widget.data._style_refer = 'custom';
            return {
                bind: id,
                view: () => {
                    return CustomStyle.renderMarginEditor(gvc, widget, callback);
                },
                divCreate: {
                    class: `pb-2`,
                },
            };
        });
    }
    static editorBackground(gvc, widget, callback) {
        RenderValue.custom_style.initialWidget(widget);
        const html = String.raw;
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return [
                        {
                            title: html `預設背景`,
                            hint: `<span class="" style="color:#8D8D8D;font-size: 13px;white-space: normal;word-break: break-all;line-height: 16px;">將依據父層的背景樣式，進行顯示。</span>`,
                            value: 'none',
                        },
                        {
                            title: html `背景顏色`,
                            hint: ` <span class="my-2"
                                                  style="color:#8D8D8D;font-size: 13px;white-space: normal;word-break: break-all;line-height: 16px;">設定容器的背景顏色。</span>`,
                            value: 'color',
                        },
                        {
                            title: html `背景圖片`,
                            hint: ` <span class="my-2"
                                                  style="color:#8D8D8D;font-size: 13px;white-space: normal;word-break: break-all;line-height: 16px;">使用圖片作為容器的背景顯示效果。</span>`,
                            value: 'image',
                        },
                    ]
                        .map((dd) => {
                        return html ` <div>
                                ${[
                            html ` <div
                                        class="d-flex  cursor_pointer"
                                        style="gap:8px;"
                                        onclick="${gvc.event(() => {
                                if (widget.data._background_setting.type !== dd.value) {
                                    widget.data._background_setting.value = '';
                                    widget.data._background_setting.type = dd.value;
                                    (callback || widget.refreshComponent)();
                                    gvc.notifyDataChange(id);
                                }
                            })}"
                                    >
                                        ${widget.data._background_setting.type === dd.value
                                ? `<i class="fa-sharp fa-solid fa-circle-dot color39" style="margin-top: 5px;"></i>`
                                : ` <div class="c_39_checkbox " style="margin-top: 5px;"></div>`}
                                        <div
                                            class="tx_normal fw-normal d-flex flex-column"
                                            style="max-width: calc(100% - 40px);white-space: normal;word-break: break-all;overflow: hidden;line-height: 25px;"
                                        >
                                            ${dd.title} ${widget.data._background_setting.type === dd.value ? dd.hint : ``}
                                        </div>
                                    </div>`,
                            html ` <div class="d-flex position-relative mt-2" style="">
                                        <div class="ms-0 border-end position-absolute h-100" style="left: 5px;"></div>
                                        <div class="flex-fill ${widget.data._background_setting.type !== dd.value ? `d-none` : ``} mt-n2" style="margin-left:20px;max-width: 100%;">
                                            ${(() => {
                                if (widget.data._background_setting.type !== dd.value) {
                                    return ``;
                                }
                                switch (widget.data._background_setting.type) {
                                    case 'none':
                                        return ``;
                                    case 'color':
                                        return EditorElem.colorSelect({
                                            title: '',
                                            callback: (text) => {
                                                widget.data._background_setting.value = text;
                                                (callback || widget.refreshComponent)();
                                            },
                                            def: widget.data._background_setting.value,
                                            gvc: gvc,
                                        });
                                    case 'image':
                                        return EditorElem.uploadImageContainer({
                                            title: '',
                                            callback: (text) => {
                                                widget.data._background_setting.value = text;
                                                (callback || widget.refreshComponent)();
                                                gvc.notifyDataChange(id);
                                            },
                                            def: widget.data._background_setting.value,
                                            gvc: gvc,
                                        });
                                }
                            })()}
                                        </div>
                                    </div>`,
                        ].join('')}
                            </div>`;
                    })
                        .join(`<div class="my-2"></div>`);
                },
                divCreate: {
                    class: `pt-2`,
                },
            };
        });
    }
    static globalContainerList(vm, gvc, id, globalValue) {
        return gvc.bindView(() => {
            const vm_c = {
                toggle: false,
                id: gvc.glitter.getUUID(),
            };
            return {
                bind: vm_c.id,
                view: () => {
                    const array = [
                        `<div class="hoverF2 d-flex align-items-center p-3"
                 onclick="${gvc.event(() => {
                            vm_c.toggle = !vm_c.toggle;
                            gvc.notifyDataChange(vm_c.id);
                        })}">
<span class="fw-500"
      style="max-width: calc(100% - 50px);text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">容器樣式</span>
                <div class="flex-fill"></div>
                ${vm_c.toggle ? ` <i class="fa-solid fa-chevron-down"></i>` : ` <i class="fa-solid fa-chevron-right"></i>`}
            </div>`,
                    ];
                    if (vm_c.toggle) {
                        array.push(` <div class="row ${globalValue.container_theme.length === 0 ? `d-none` : ``} p-0"
                                             style="margin: 18px 18px 0px;">
                                            ${globalValue.container_theme
                            .map((dd, index) => {
                            return `<div class="col-12 mb-3" style="cursor: pointer;" onclick="${gvc.event(() => {
                                vm.type = 'container_detail';
                                vm.data = globalValue.container_theme[index];
                                vm.index = index;
                                gvc.notifyDataChange(id);
                            })}">
                                               <div class="rounded border p-3 d-flex">
                                               <div>間距樣式:${index + 1}</div>
                                               <div class="t"></div>
</div>
                                            </div>`;
                        })
                            .join('')}
                                        </div>
                                        <div style="padding: 0px 24px 24px;${globalValue.container_theme.length === 0 ? `margin-top:24px;` : ``}">
                                            <div class="bt_border_editor"
                                                 onclick="${gvc.event(() => {
                            vm.data = { id: gvc.glitter.getUUID() };
                            globalValue.container_theme.push(vm.data);
                            vm.name = '間距樣式' + globalValue.container_theme.length;
                            vm.type = 'container_detail';
                            vm.index = globalValue.container_theme.length - 1;
                            gvc.notifyDataChange(id);
                        })}">
                                                新增間距
                                            </div>
                                        </div>`);
                    }
                    return array.join('');
                },
                divCreate: {
                    class: `border-bottom    w-100`,
                },
            };
        });
    }
    static globalContainerSelect(globalValue, gvc, def, callback) {
        return gvc.bindView(() => {
            const vm = {
                id: gvc.glitter.getUUID(),
            };
            if (!globalValue.container_theme.find((dd, index) => {
                return index === parseInt(def, 10);
            })) {
                if (def !== '') {
                    callback('');
                }
                else {
                    def = '';
                }
            }
            return {
                bind: vm.id,
                view: () => {
                    return `<div class="btn-group dropdown w-100">
<div class="d-flex w-100" style="gap:10px;" data-bs-toggle="dropdown">
  <button type="button" class="btn btn-outline-secondary dropdown-toggle flex-fill" 
                        aria-haspopup="true" aria-expanded="false">
                    ${isNaN(parseInt(def, 10)) ? `選擇容器` : `容器樣式${parseInt(def, 10) + 1}`}
                </button>
                <div class="btn btn-outline-secondary btn-sm" style="cursor: pointer;" onclick="${gvc.event((e, event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        const data = globalValue.container_theme.find((dd, ind) => {
                            return ind === parseInt(def, 10);
                        });
                        NormalPageEditor.toggle({
                            visible: true,
                            view: CustomStyle.globalContainerDetail({
                                gvc: gvc,
                                back: () => {
                                    callback(def);
                                },
                                name: `容器${parseInt(def, 10) + 1}`,
                                data: data,
                                index: parseInt(def, 10),
                                hide_title: true,
                                hide_delete: true,
                            }),
                            title: '變更全站容器樣式',
                        });
                    })}"><i class="fa-solid fa-pencil"></i></div>
</div>
              
                <div class="dropdown-menu my-1">
                    ${globalValue.container_theme
                        .map((dd, index) => {
                        return `<div class="dropdown-item" style="cursor: pointer;" onclick="${gvc.event(() => {
                            callback(`${index}`);
                        })}">
                                               容器樣式${index + 1}
                                            </div>`;
                    })
                        .join('')}
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item" onclick="${gvc.event(() => {
                        globalValue.container_theme.push({ id: gvc.glitter.getUUID() });
                        NormalPageEditor.closeEvent = () => {
                            globalValue.container_theme = globalValue.container_theme.filter((dd, index) => {
                                return index < globalValue.container_theme.length - 1;
                            });
                            gvc.notifyDataChange(vm.id);
                        };
                        NormalPageEditor.toggle({
                            visible: true,
                            view: [
                                CustomStyle.globalContainerDetail({
                                    gvc: gvc,
                                    back: () => { },
                                    name: `容器${globalValue.container_theme.length}`,
                                    data: { id: gvc.glitter.getUUID() },
                                    index: globalValue.container_theme.length - 1,
                                    hide_title: true,
                                    hide_delete: true,
                                }),
                                `<div class="d-flex align-content-center border justify-content-end p-3">
<button class="btn btn-black" type="button" onclick="${gvc.event(() => {
                                    NormalPageEditor.closeEvent = () => { };
                                    NormalPageEditor.toggle({ visible: false });
                                    callback(`${globalValue.container_theme.length - 1}`);
                                    gvc.notifyDataChange(vm.id);
                                })}">
            <span class="tx_700_white">儲存並新增</span>
        </button>
</div>`,
                            ].join(''),
                            title: '新增全站容器',
                        });
                    })}">新增容器</a>
                </div>
            </div>`;
                },
            };
        });
    }
    static globalMarginSelect(globalValue, gvc, def, callback) {
        return gvc.bindView(() => {
            const vm = {
                id: gvc.glitter.getUUID(),
            };
            if (!globalValue.container_theme.find((dd, index) => {
                return index === parseInt(def, 10);
            })) {
                def = '';
            }
            return {
                bind: vm.id,
                view: () => {
                    return `<div class="btn-group dropdown w-100">
<div class="d-flex w-100" style="gap:10px;" data-bs-toggle="dropdown">
  <button type="button" class="btn btn-outline-secondary dropdown-toggle flex-fill" 
                        aria-haspopup="true" aria-expanded="false">
                    ${isNaN(parseInt(def, 10)) ? `選擇間距` : `間距樣式${parseInt(def, 10) + 1}`}
                </button>
                <div class="btn btn-outline-secondary btn-sm" style="cursor: pointer;" onclick="${gvc.event((e, event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        const data = globalValue.container_theme.find((dd, ind) => {
                            return ind === parseInt(def, 10);
                        });
                        NormalPageEditor.toggle({
                            visible: true,
                            view: CustomStyle.globalContainerDetail({
                                gvc: gvc,
                                back: () => {
                                    callback(def);
                                },
                                name: `間距${parseInt(def, 10) + 1}`,
                                data: data,
                                index: parseInt(def, 10),
                                hide_title: true,
                                hide_delete: true,
                                margin_style: true,
                            }),
                            title: '變更全站間距樣式',
                        });
                    })}"><i class="fa-solid fa-pencil"></i></div>
</div>
                <div class="dropdown-menu my-1">
                    ${globalValue.container_theme
                        .map((dd, index) => {
                        return `<div class="dropdown-item" style="cursor: pointer;" onclick="${gvc.event(() => {
                            callback(`${index}`);
                        })}">
                                               間距樣式${index + 1}
                                            </div>`;
                    })
                        .join('')}
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item" onclick="${gvc.event(() => {
                        globalValue.container_theme.push({ id: gvc.glitter.getUUID() });
                        NormalPageEditor.closeEvent = () => {
                            globalValue.container_theme = globalValue.container_theme.filter((dd, index) => {
                                return index < globalValue.container_theme.length - 1;
                            });
                            gvc.notifyDataChange(vm.id);
                        };
                        NormalPageEditor.toggle({
                            visible: true,
                            view: [
                                CustomStyle.globalContainerDetail({
                                    gvc: gvc,
                                    back: () => { },
                                    name: `間距樣式${globalValue.container_theme.length}`,
                                    data: { id: gvc.glitter.getUUID() },
                                    index: globalValue.container_theme.length - 1,
                                    hide_title: true,
                                    hide_delete: true,
                                    margin_style: true,
                                }),
                                `<div class="d-flex align-content-center border justify-content-end p-3">
<button class="btn btn-black" type="button" onclick="${gvc.event(() => {
                                    NormalPageEditor.closeEvent = () => { };
                                    NormalPageEditor.toggle({ visible: false });
                                    callback(`${globalValue.container_theme.length - 1}`);
                                    gvc.notifyDataChange(vm.id);
                                })}">
            <span class="tx_700_white">儲存並新增</span>
        </button>
</div>`,
                            ].join(''),
                            title: '新增間距樣式',
                        });
                    })}">新增間距</a>
                </div>
            </div>`;
                },
            };
        });
    }
    static globalContainerDetail(obj) {
        obj.data.data = obj.data.data || {};
        const html = String.raw;
        const gvc = obj.gvc;
        const globalValue = gvc.glitter.share.editorViewModel.appConfig;
        return html `
            <div class="">
                <div
                    class="${obj.hide_title ? `d-none` : ``} px-3   border-bottom pb-3 fw-bold mt-2 pt-2"
                    style="cursor: pointer;color:#393939;"
                    onclick="${gvc.event(() => {
            obj.back();
        })}"
                >
                    <i class="fa-solid fa-angle-left"></i>
                    <span>${obj.name} 編輯</span>
                </div>
                <div class="py-2 px-3">
                    ${(obj.margin_style ? CustomStyle.renderMarginEditor : CustomStyle.renderThemeEditor)(obj.gvc, obj.data, () => {
            gvc.glitter.share.global_container_theme = globalValue.container_theme;
            const element = document.querySelector('#editerCenter iframe').contentWindow.glitter.elementCallback;
            document.querySelector('#editerCenter  iframe').contentWindow.glitter.share.global_container_theme = globalValue.container_theme;
            Object.keys(element).map((dd) => {
                try {
                    element[dd].updateAttribute();
                }
                catch (e) { }
            });
        })}
                </div>
                <div class="${obj.hide_delete ? `d-none` : ``} mx-n2" style="padding: 0px 24px 24px;">
                    <div
                        class="bt_border_editor"
                        onclick="${gvc.event(() => {
            const dialog = new ShareDialog(gvc.glitter);
            dialog.checkYesOrNot({
                text: '是否確認刪除樣式?',
                callback: (response) => {
                    if (response) {
                        globalValue.container_theme = globalValue.container_theme.filter((dd) => {
                            return dd !== obj.data;
                        });
                        obj.back();
                    }
                },
            });
        })}"
                    >
                        刪除樣式
                    </div>
                </div>
            </div>
        `;
    }
}
const interval = setInterval(() => {
    if (window.glitter) {
        clearInterval(interval);
        window.glitter.setModule(import.meta.url, CustomStyle);
    }
}, 100);
