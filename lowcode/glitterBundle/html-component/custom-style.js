import { EditorElem } from "../plugins/editor-elem.js";
import { NormalPageEditor } from "../../editor/normal-page-editor.js";
import { ShareDialog } from "../dialog/ShareDialog.js";
const html = String.raw;
export class CustomStyle {
    static renderThemeEditor(gvc, widget, callback) {
        CustomStyle.initialWidget(widget);
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
                }
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
                }
            }),
            `<div class="my-2"></div>`,
            EditorElem.select({
                title: '排版方式',
                gvc: gvc,
                def: widget.data._display_block,
                array: [{
                        title: "預設",
                        value: "def"
                    }, {
                        title: "垂直",
                        value: "vertical"
                    },
                    {
                        title: "水平",
                        value: "horizontal"
                    }],
                callback: (text) => {
                    widget.data._display_block = text;
                    (callback || widget.refreshComponent)();
                }
            }),
            `<div class="my-2"></div>`,
            `<div class="my-2"></div>`,
            EditorElem.editeInput({
                gvc: gvc,
                title: `內距(上,右,下,左)`,
                default: [{
                        title: '上',
                        key: 'top'
                    },
                    {
                        title: '右',
                        key: 'right'
                    },
                    {
                        title: '下',
                        key: 'bottom'
                    },
                    {
                        title: '左',
                        key: 'left'
                    }
                ].map((dd) => {
                    if (widget.data._padding[dd.key]) {
                        return widget.data._padding[dd.key];
                    }
                    else {
                        return `0`;
                    }
                }).join(','),
                placeHolder: '',
                callback: (text) => {
                    const dialog = new ShareDialog(gvc.glitter);
                    if (text.split(',').length != 4) {
                        dialog.errorMessage({
                            text: '格式輸入錯誤'
                        });
                    }
                    else {
                        [{
                                title: '上',
                                key: 'top'
                            },
                            {
                                title: '右',
                                key: 'right'
                            },
                            {
                                title: '下',
                                key: 'bottom'
                            },
                            {
                                title: '左',
                                key: 'left'
                            }
                        ].map((dd, index) => {
                            widget.data._padding[dd.key] = text.split(',')[index];
                        });
                        (callback || widget.refreshComponent)();
                    }
                }
            }),
            EditorElem.editeInput({
                gvc: gvc,
                title: `外距(上,右,下,左)`,
                default: [{
                        title: '上',
                        key: 'top'
                    },
                    {
                        title: '右',
                        key: 'right'
                    },
                    {
                        title: '下',
                        key: 'bottom'
                    },
                    {
                        title: '左',
                        key: 'left'
                    }
                ].map((dd) => {
                    if (widget.data._margin[dd.key]) {
                        return widget.data._margin[dd.key];
                    }
                    else {
                        return `0`;
                    }
                }).join(','),
                placeHolder: '',
                callback: (text) => {
                    const dialog = new ShareDialog(gvc.glitter);
                    if (text.split(',').length != 4) {
                        dialog.errorMessage({
                            text: '格式輸入錯誤'
                        });
                    }
                    else {
                        [{
                                title: '上',
                                key: 'top'
                            },
                            {
                                title: '右',
                                key: 'right'
                            },
                            {
                                title: '下',
                                key: 'bottom'
                            },
                            {
                                title: '左',
                                key: 'left'
                            }
                        ].map((dd, index) => {
                            widget.data._margin[dd.key] = text.split(',')[index];
                        });
                        (callback || widget.refreshComponent)();
                    }
                }
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
                            }
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
                            }
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
                            }
                        }),
                        EditorElem.editeInput({
                            gvc: gvc,
                            title: '間距',
                            default: widget.data._gap || '',
                            placeHolder: '單位px',
                            callback: (text) => {
                                widget.data._gap = text;
                                (callback || widget.refreshComponent)();
                            }
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
                            }
                        }),
                        EditorElem.select({
                            title: '水平位置',
                            gvc: gvc,
                            def: widget.data._hor_position,
                            array: [{
                                    title: "靠左",
                                    value: "left"
                                }, {
                                    title: "置中",
                                    value: "center"
                                },
                                {
                                    title: "靠右",
                                    value: "right"
                                }],
                            callback: (text) => {
                                widget.data._hor_position = text;
                                (callback || widget.refreshComponent)();
                            }
                        }),
                        EditorElem.select({
                            title: "內容翻轉",
                            gvc: gvc,
                            def: widget.data._reverse,
                            array: [
                                {
                                    title: '是',
                                    value: 'true'
                                },
                                {
                                    title: '否',
                                    value: 'false'
                                }
                            ],
                            callback: (text) => {
                                widget.data._reverse = text;
                                (callback || widget.refreshComponent)();
                            }
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
                            }
                        }),
                        `<div class="mt-2"></div>` + EditorElem.editerDialog({
                            gvc: gvc,
                            dialog: () => {
                                return EditorElem.styleEditor({
                                    gvc: gvc,
                                    title: '自訂Style代碼',
                                    height: 400,
                                    initial: widget.data._style || '',
                                    callback: (text) => {
                                        widget.data._style = text;
                                    }
                                });
                            },
                            editTitle: '自訂設計代碼',
                            callback: () => {
                                (callback || widget.refreshComponent)();
                            }
                        })
                    ].join('');
                },
            })
        ].join('');
    }
    static renderMarginEditor(gvc, widget, callback) {
        CustomStyle.initialWidget(widget);
        return [
            EditorElem.editeInput({
                gvc: gvc,
                title: `間距(上,右,下,左)`,
                default: [{
                        title: '上',
                        key: 'top'
                    },
                    {
                        title: '右',
                        key: 'right'
                    },
                    {
                        title: '下',
                        key: 'bottom'
                    },
                    {
                        title: '左',
                        key: 'left'
                    }
                ].map((dd) => {
                    if (widget.data._padding[dd.key]) {
                        return widget.data._padding[dd.key];
                    }
                    else {
                        return `0`;
                    }
                }).join(','),
                placeHolder: '',
                callback: (text) => {
                    const dialog = new ShareDialog(gvc.glitter);
                    if (text.split(',').length != 4) {
                        dialog.errorMessage({
                            text: '格式輸入錯誤'
                        });
                    }
                    else {
                        [{
                                title: '上',
                                key: 'top'
                            },
                            {
                                title: '右',
                                key: 'right'
                            },
                            {
                                title: '下',
                                key: 'bottom'
                            },
                            {
                                title: '左',
                                key: 'left'
                            }
                        ].map((dd, index) => {
                            widget.data._padding[dd.key] = text.split(',')[index];
                        });
                        (callback || widget.refreshComponent)();
                    }
                }
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
                }
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
                }
            }),
        ].join('');
    }
    static editor(gvc, widget, callback) {
        CustomStyle.initialWidget(widget);
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
                        }
                    ]
                        .map((dd) => {
                        return html `
                                <div>
                                    ${[
                            html `
                                            <div
                                                    class="d-flex  cursor_pointer"
                                                    style="gap:8px;"
                                                    onclick="${gvc.event(() => {
                                widget.data._style_refer = dd.value;
                                if (dd.value === 'global') {
                                    widget.data._style_refer_global = {
                                        index: gvc.glitter.share.global_container_theme[0] ? 0 : undefined
                                    };
                                }
                                (callback || widget.refreshComponent)();
                                gvc.notifyDataChange(id);
                            })}"
                                            >
                                                ${widget.data._style_refer === dd.value
                                ? `<i class="fa-sharp fa-solid fa-circle-dot cl_39" style="margin-top: 5px;"></i>`
                                : ` <div class="c_39_checkbox " style="margin-top: 5px;"></div>`}
                                                <div class="tx_normal fw-normal d-flex flex-column"
                                                     style="max-width: calc(100% - 40px);white-space: normal;word-break: break-all;overflow: hidden;line-height: 25px;">
                                                    ${dd.title}
                                                    ${(widget.data._style_refer === dd.value) ? dd.hint : ``}
                                                </div>
                                            </div>`,
                            html `
                                            <div class="d-flex position-relative mt-2"
                                                 style="">
                                                <div class="ms-0 border-end position-absolute h-100"
                                                     style="left: 5px;"></div>
                                                <div class="flex-fill "
                                                     style="margin-left:20px;max-width: 100%;">
                                                    ${(() => {
                                var _a;
                                if (widget.data._style_refer !== dd.value) {
                                    return ``;
                                }
                                if (widget.data._style_refer === 'global') {
                                    const globalValue = gvc.glitter.share.editorViewModel.appConfig;
                                    globalValue.container_theme = (_a = globalValue.container_theme) !== null && _a !== void 0 ? _a : [];
                                    return CustomStyle.globalContainerSelect(globalValue, gvc, (widget.data._style_refer_global && widget.data._style_refer_global.index), (index) => {
                                        widget.data._style_refer_global = {
                                            index: index
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
                    class: `pt-2`
                }
            };
        });
    }
    static editorMargin(gvc, widget, callback) {
        CustomStyle.initialWidget(widget);
        const html = String.raw;
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return [
                        {
                            title: html `套用統一間距`,
                            hint: `<span class=""
                                                  style="color:#8D8D8D;font-size: 13px;white-space: normal;word-break: break-all;line-height: 16px;">選擇一個間距，若是進行了修改，全站所有套用此間距的元件將自動更新，方便未來統一管理。</span>`,
                            value: 'global',
                        },
                        {
                            title: html `自定義間距`,
                            hint: ` <span class="my-2"
                                                  style="color:#8D8D8D;font-size: 13px;white-space: normal;word-break: break-all;line-height: 16px;">可以單獨為元件設置獨特間距，實現獨一無二的設計效果。</span>`,
                            value: 'custom',
                        }
                    ]
                        .map((dd) => {
                        return html `
                                <div>
                                    ${[
                            html `
                                            <div
                                                    class="d-flex  cursor_pointer"
                                                    style="gap:8px;"
                                                    onclick="${gvc.event(() => {
                                widget.data._style_refer = dd.value;
                                if (dd.value === 'global') {
                                    widget.data._style_refer_global = {
                                        index: gvc.glitter.share.global_container_theme[0] ? 0 : undefined
                                    };
                                }
                                (callback || widget.refreshComponent)();
                                gvc.notifyDataChange(id);
                            })}"
                                            >
                                                ${widget.data._style_refer === dd.value
                                ? `<i class="fa-sharp fa-solid fa-circle-dot cl_39" style="margin-top: 5px;"></i>`
                                : ` <div class="c_39_checkbox " style="margin-top: 5px;"></div>`}
                                                <div class="tx_normal fw-normal d-flex flex-column"
                                                     style="max-width: calc(100% - 40px);white-space: normal;word-break: break-all;overflow: hidden;line-height: 25px;">
                                                    ${dd.title}
                                                    ${(widget.data._style_refer === dd.value) ? dd.hint : ``}
                                                </div>
                                            </div>`,
                            html `
                                            <div class="d-flex position-relative mt-2"
                                                 style="">
                                                <div class="ms-0 border-end position-absolute h-100"
                                                     style="left: 5px;"></div>
                                                <div class="flex-fill "
                                                     style="margin-left:20px;max-width: 100%;">
                                                    ${(() => {
                                var _a;
                                if (widget.data._style_refer !== dd.value) {
                                    return ``;
                                }
                                if (widget.data._style_refer === 'global') {
                                    const globalValue = gvc.glitter.share.editorViewModel.appConfig;
                                    globalValue.container_theme = (_a = globalValue.container_theme) !== null && _a !== void 0 ? _a : [];
                                    return CustomStyle.globalMarginSelect(globalValue, gvc, (widget.data._style_refer_global && widget.data._style_refer_global.index), (index) => {
                                        widget.data._style_refer_global = {
                                            index: index
                                        };
                                        (callback || widget.refreshComponent)();
                                        gvc.notifyDataChange(id);
                                    });
                                }
                                else {
                                    return html `
                                                                <div class="p-3 mb-2" style="border-radius: 10px;
border: 1px solid #DDD;
background: #F7F7F7;">${CustomStyle.renderMarginEditor(gvc, widget, callback)}
                                                                </div>`;
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
                    class: `pt-2`
                }
            };
        });
    }
    static value(gvc, widget) {
        let style_string = '';
        if (widget.data._layout === 'grid') {
            (style_string += `display: grid; gap: ${(isNaN(widget.data._gap_x)) ? widget.data._gap_x : `${widget.data._gap_x}px`} ${(isNaN(widget.data._gap_y)) ? widget.data._gap_y : `${widget.data._gap_y}px`}; 
            grid-template-columns: repeat(${widget.data._x_count}, 1fr); grid-template-rows: repeat(${widget.data._y_count}, 1fr);`);
            style_string += `grid-template-columns: ${(() => {
                let view = [];
                for (let a = 0; a < parseInt(widget.data._x_count, 10); a++) {
                    view.push(`calc((100% / ${parseInt(widget.data._x_count, 10)}) - ((${(isNaN(widget.data._gap_y)) ? widget.data._gap_y : `${widget.data._gap_y}px`})/${parseInt(widget.data._x_count, 10)}))`);
                }
                return view.join(' ');
            })()};`;
        }
        if (widget.data && widget.data._style_refer === 'global' && widget.data._style_refer_global) {
            const globalValue = gvc.glitter.share.global_container_theme[parseInt(widget.data._style_refer_global.index, 10)];
            widget = {
                data: (globalValue && globalValue.data) || {}
            };
        }
        CustomStyle.initialWidget(widget);
        ['top', 'bottom', 'left', 'right'].map((dd) => {
            if (widget.data._padding[dd]) {
                if (!isNaN(widget.data._padding[dd])) {
                    (style_string += `padding-${dd}:${widget.data._padding[dd]}px;`);
                }
                else {
                    (style_string += `padding-${dd}:${widget.data._padding[dd]};`);
                }
            }
        });
        if (widget.data._display_block === 'vertical') {
            (style_string += `display: flex;align-items: center;justify-content: center;flex-direction: column;`);
        }
        else if (widget.data._display_block === 'horizontal') {
            (style_string += `display: flex;align-items: center;justify-content: center;flex-direction: row;`);
        }
        widget.data._max_width && (style_string += `width:${(isNaN(widget.data._max_width)) ? widget.data._max_width : `${widget.data._max_width}px`};max-width:100%;`);
        widget.data._border.width && (style_string += `border: ${widget.data._border.width}px solid ${widget.data._border.color};`);
        widget.data._border['radius'] && (style_string += `border-radius: ${widget.data._border.radius}px;`);
        widget.data._border['radius'] && ((widget.data._border.radius || '0') > 0 && (style_string += 'overflow:hidden;'));
        widget.data._gap && (style_string += `gap:${widget.data._gap}px;`);
        widget.data._background && (style_string += `background:${widget.data._background};`);
        widget.data._radius && (style_string += `background:${widget.data._background};`);
        widget.data._z_index && (style_string += `z-index:${widget.data._z_index};`);
        widget.data._max_height && (style_string += `max-height:${(isNaN(widget.data._max_height)) ? widget.data._max_height : `${widget.data._max_height}px`};`);
        switch (widget.data._hor_position) {
            case "left":
                if (widget.data._display_block === 'vertical') {
                    style_string += `align-items: start;`;
                }
                else {
                    style_string += `justify-content: start;`;
                }
                break;
            case "right":
                if (widget.data._display_block === 'vertical') {
                    style_string += `align-items: end;`;
                }
                else {
                    style_string += `justify-content: end;`;
                }
                break;
            case "center":
                if (widget.data._max_width) {
                    style_string += `margin:auto;`;
                }
                break;
        }
        ['top', 'bottom', 'left', 'right'].map((dd) => {
            if (widget.data._margin[dd] && (widget.data._margin[dd] != '0')) {
                if (!isNaN(widget.data._margin[dd])) {
                    (style_string += `margin-${dd}:${widget.data._margin[dd]}px;`);
                }
                else {
                    (style_string += `margin-${dd}:${widget.data._margin[dd]};`);
                }
            }
        });
        (widget.data._style) && (style_string += widget.data._style);
        (widget.data._reverse === 'true') && (style_string += ((widget.data._display_block === 'vertical') ? `flex-direction: column-reverse !important;` : `flex-direction: row-reverse !important;`));
        return style_string;
    }
    static initialWidget(widget) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        if (widget.data.onCreateEvent) {
            widget.onCreateEvent = widget.data.onCreateEvent;
            widget.data.onCreateEvent = undefined;
        }
        if (widget.data._hor_position) {
            widget.data._style_refer = (_a = widget.data._style_refer) !== null && _a !== void 0 ? _a : 'custom';
        }
        else {
            widget.data._style_refer = (_b = widget.data._style_refer) !== null && _b !== void 0 ? _b : 'global';
        }
        widget.data.elem = (_c = widget.data.elem) !== null && _c !== void 0 ? _c : "div";
        widget.data.inner = (_d = widget.data.inner) !== null && _d !== void 0 ? _d : "";
        widget.data.attr = (_e = widget.data.attr) !== null && _e !== void 0 ? _e : [];
        widget.data._padding = (_f = widget.data._padding) !== null && _f !== void 0 ? _f : {};
        widget.data._margin = (_g = widget.data._margin) !== null && _g !== void 0 ? _g : {};
        widget.data._border = widget.data._border || {};
        widget.data._max_width = (_h = widget.data._max_width) !== null && _h !== void 0 ? _h : '';
        widget.data._gap = (_j = widget.data._gap) !== null && _j !== void 0 ? _j : '';
        widget.data._background = (_k = widget.data._background) !== null && _k !== void 0 ? _k : '';
        widget.data._other = (_l = widget.data._other) !== null && _l !== void 0 ? _l : {};
        widget.data._radius = (_m = widget.data._radius) !== null && _m !== void 0 ? _m : '';
        widget.data._reverse = (_o = widget.data._reverse) !== null && _o !== void 0 ? _o : 'false';
        widget.data._hor_position = (_p = widget.data._hor_position) !== null && _p !== void 0 ? _p : 'center';
    }
    static globalContainerList(vm, gvc, id, globalValue) {
        return gvc.bindView(() => {
            const vm_c = {
                toggle: false,
                id: gvc.glitter.getUUID()
            };
            return {
                bind: vm_c.id,
                view: () => {
                    const array = [`<div class="hoverF2 d-flex align-items-center p-3"
                 onclick="${gvc.event(() => {
                            vm_c.toggle = !vm_c.toggle;
                            gvc.notifyDataChange(vm_c.id);
                        })}">
<span class="fw-500"
      style="max-width: calc(100% - 50px);text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">容器樣式</span>
                <div class="flex-fill"></div>
                ${vm_c.toggle ? ` <i class="fa-solid fa-chevron-down"></i>` : ` <i class="fa-solid fa-chevron-right"></i>`}
            </div>`];
                    if (vm_c.toggle) {
                        array.push(` <div class="row ${(globalValue.container_theme.length === 0) ? `d-none` : ``} p-0"
                                             style="margin: 18px 18px 0px;">
                                            ${globalValue.container_theme.map((dd, index) => {
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
                        }).join('')}
                                        </div>
                                        <div style="padding: 0px 24px 24px;${(globalValue.container_theme.length === 0) ? `margin-top:24px;` : ``}">
                                            <div class="bt_border_editor"
                                                 onclick="${gvc.event(() => {
                            vm.data = { id: gvc.glitter.getUUID() };
                            globalValue.container_theme.push(vm.data);
                            vm.name = ('間距樣式' + globalValue.container_theme.length);
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
                    class: `border-bottom    w-100`
                }
            };
        });
    }
    static globalContainerSelect(globalValue, gvc, def, callback) {
        return gvc.bindView(() => {
            const vm = {
                id: gvc.glitter.getUUID()
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
                                hide_delete: true
                            }),
                            title: '變更全局容器樣式'
                        });
                    })}"><i class="fa-solid fa-pencil"></i></div>
</div>
              
                <div class="dropdown-menu my-1">
                    ${globalValue.container_theme.map((dd, index) => {
                        return `<div class="dropdown-item" style="cursor: pointer;" onclick="${gvc.event(() => {
                            callback(`${index}`);
                        })}">
                                               容器樣式${index + 1}
                                            </div>`;
                    }).join('')}
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
                                    back: () => {
                                    },
                                    name: `容器${globalValue.container_theme.length}`,
                                    data: { id: gvc.glitter.getUUID() },
                                    index: globalValue.container_theme.length - 1,
                                    hide_title: true,
                                    hide_delete: true
                                }),
                                `<div class="d-flex align-content-center border justify-content-end p-3">
<button class="btn btn-black" type="button" onclick="${gvc.event(() => {
                                    NormalPageEditor.closeEvent = () => {
                                    };
                                    NormalPageEditor.toggle({ visible: false });
                                    callback(`${globalValue.container_theme.length - 1}`);
                                    gvc.notifyDataChange(vm.id);
                                })}">
            <span class="tx_700_white">儲存並新增</span>
        </button>
</div>`
                            ].join(''),
                            title: '新增全局容器'
                        });
                    })}">新增容器</a>
                </div>
            </div>`;
                }
            };
        });
    }
    static globalMarginSelect(globalValue, gvc, def, callback) {
        return gvc.bindView(() => {
            const vm = {
                id: gvc.glitter.getUUID()
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
                                margin_style: true
                            }),
                            title: '變更全局間距樣式'
                        });
                    })}"><i class="fa-solid fa-pencil"></i></div>
</div>
                <div class="dropdown-menu my-1">
                    ${globalValue.container_theme.map((dd, index) => {
                        return `<div class="dropdown-item" style="cursor: pointer;" onclick="${gvc.event(() => {
                            callback(`${index}`);
                        })}">
                                               間距樣式${index + 1}
                                            </div>`;
                    }).join('')}
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
                                    back: () => {
                                    },
                                    name: `間距樣式${globalValue.container_theme.length}`,
                                    data: { id: gvc.glitter.getUUID() },
                                    index: globalValue.container_theme.length - 1,
                                    hide_title: true,
                                    hide_delete: true,
                                    margin_style: true
                                }),
                                `<div class="d-flex align-content-center border justify-content-end p-3">
<button class="btn btn-black" type="button" onclick="${gvc.event(() => {
                                    NormalPageEditor.closeEvent = () => {
                                    };
                                    NormalPageEditor.toggle({ visible: false });
                                    callback(`${globalValue.container_theme.length - 1}`);
                                    gvc.notifyDataChange(vm.id);
                                })}">
            <span class="tx_700_white">儲存並新增</span>
        </button>
</div>`
                            ].join(''),
                            title: '新增間距樣式'
                        });
                    })}">新增間距</a>
                </div>
            </div>`;
                }
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
                <div class="${obj.hide_title ? `d-none` : ``} px-3   border-bottom pb-3 fw-bold mt-2 pt-2"
                     style="cursor: pointer;color:#393939;"
                     onclick="${gvc.event(() => {
            obj.back();
        })}">
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
                catch (e) {
                }
            });
        })}
                </div>
                <div class="${obj.hide_delete ? `d-none` : ``} mx-n2" style="padding: 0px 24px 24px;">
                    <div class="bt_border_editor"
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
                }
            });
        })}">
                        刪除樣式
                    </div>
                </div>
            </div>
        `;
    }
}
