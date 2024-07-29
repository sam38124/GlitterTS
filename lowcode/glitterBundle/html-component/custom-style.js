import { EditorElem } from "../plugins/editor-elem.js";
export class CustomStyle {
    static editor(gvc, widget) {
        CustomStyle.initialWidget(widget);
        return [
            `<div class="alert  alert-secondary p-2 fw-500 mt-2 " style="word-break: break-all;white-space: normal;letter-spacing: 0.5px;">
                            可輸入純數值 (px) 或附加單位(%,rem,vw,vh,calc,px)。
</div>`,
            EditorElem.editeInput({
                gvc: gvc,
                title: `容器最大寬度 << 不輸入則自適應寬度 >>
                           
                            `,
                default: widget.data._max_width,
                placeHolder: '',
                callback: (text) => {
                    widget.data._max_width = text;
                    widget.refreshComponent();
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
                    widget.refreshComponent();
                }
            }),
            `<div class="my-2"></div>`,
            `<div class="my-2"></div>`,
            EditorElem.toggleExpand({
                gvc: gvc,
                title: `內距`,
                data: widget.data._padding,
                innerText: () => {
                    return [{
                            title: '上',
                            key: 'top'
                        },
                        {
                            title: '下',
                            key: 'bottom'
                        },
                        {
                            title: '左',
                            key: 'left'
                        },
                        {
                            title: '右',
                            key: 'right'
                        }].map((dd) => {
                        return EditorElem.editeInput({
                            gvc: gvc,
                            title: dd.title,
                            default: widget.data._padding[dd.key] || '0',
                            placeHolder: '單位px',
                            callback: (text) => {
                                widget.data._padding[dd.key] = text;
                                widget.refreshComponent();
                            }
                        });
                    }).join('');
                }
            }),
            EditorElem.toggleExpand({
                gvc: gvc,
                title: `外距`,
                data: widget.data._margin,
                innerText: () => {
                    return [{
                            title: '上',
                            key: 'top'
                        },
                        {
                            title: '下',
                            key: 'bottom'
                        },
                        {
                            title: '左',
                            key: 'left'
                        },
                        {
                            title: '右',
                            key: 'right'
                        }].map((dd) => {
                        return EditorElem.editeInput({
                            gvc: gvc,
                            title: dd.title,
                            default: widget.data._margin[dd.key] || '0',
                            placeHolder: '單位px',
                            callback: (text) => {
                                widget.data._margin[dd.key] = text;
                                widget.refreshComponent();
                            }
                        });
                    }).join('');
                },
            }),
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
                                widget.refreshComponent();
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
                                widget.refreshComponent();
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
                                widget.refreshComponent();
                            }
                        }),
                        EditorElem.editeInput({
                            gvc: gvc,
                            title: '間距',
                            default: widget.data._gap || '',
                            placeHolder: '單位px',
                            callback: (text) => {
                                widget.data._gap = text;
                                widget.refreshComponent();
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
                                widget.refreshComponent();
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
                                widget.refreshComponent();
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
                                widget.refreshComponent();
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
                                widget.refreshComponent();
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
                                widget.refreshComponent();
                            }
                        })
                    ].join('');
                },
            })
        ].join('');
    }
    static value(gvc, widget) {
        CustomStyle.initialWidget(widget);
        let style_string = '';
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        if (widget.data.onCreateEvent) {
            widget.onCreateEvent = widget.data.onCreateEvent;
            widget.data.onCreateEvent = undefined;
        }
        widget.data.elem = (_a = widget.data.elem) !== null && _a !== void 0 ? _a : "div";
        widget.data.inner = (_b = widget.data.inner) !== null && _b !== void 0 ? _b : "";
        widget.data.attr = (_c = widget.data.attr) !== null && _c !== void 0 ? _c : [];
        widget.data._padding = (_d = widget.data._padding) !== null && _d !== void 0 ? _d : {};
        widget.data._margin = (_e = widget.data._margin) !== null && _e !== void 0 ? _e : {};
        widget.data._border = widget.data._border || {};
        widget.data._max_width = (_f = widget.data._max_width) !== null && _f !== void 0 ? _f : '';
        widget.data._gap = (_g = widget.data._gap) !== null && _g !== void 0 ? _g : '';
        widget.data._background = (_h = widget.data._background) !== null && _h !== void 0 ? _h : '';
        widget.data._other = (_j = widget.data._other) !== null && _j !== void 0 ? _j : {};
        widget.data._radius = (_k = widget.data._radius) !== null && _k !== void 0 ? _k : '';
        widget.data._reverse = (_l = widget.data._reverse) !== null && _l !== void 0 ? _l : 'false';
        widget.data._hor_position = (_m = widget.data._hor_position) !== null && _m !== void 0 ? _m : 'center';
    }
}
