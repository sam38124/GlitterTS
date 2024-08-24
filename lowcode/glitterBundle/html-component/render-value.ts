import {GVC} from "../GVController.js";

const css = String.raw

export class RenderValue {
    public static custom_style = {


        container_style: (gvc: GVC, widget: any) => {
            let style_string = '';
            if ((widget.data._background_setting) && (widget.data._background_setting.type !== 'none')) {
                if (widget.data._background_setting.type === 'image') {
                    style_string += `background-image:url('${widget.data._background_setting.value}');background-position: center;
        background-repeat: no-repeat;
        background-size: cover;`
                } else if (widget.data._background_setting.type === 'color') {
                    style_string += `background-color:${widget.data._background_setting.value};`
                }
            }
            (widget.data._style) && (style_string += widget.data._style);
            return style_string
        },
        value: (gvc: GVC, widget: any) => {
            let style_string = '';
            if (widget.type === 'container') {
                if (widget.data._layout === 'grid') {
                    (style_string += `display: grid; gap: ${(isNaN(widget.data._gap_x)) ? widget.data._gap_x : `${widget.data._gap_x}px`} ${(isNaN(widget.data._gap_y)) ? widget.data._gap_y : `${widget.data._gap_y}px`}; 
             grid-template-rows: repeat(${widget.data._y_count}, 1fr);`);
                    if (widget.data._x_count > 1) {
                        style_string += `grid-template-columns: ${(() => {
                            let view = []
                            for (let a = 0; a < parseInt(widget.data._x_count, 10); a++) {
                                view.push(`calc((100% / ${parseInt(widget.data._x_count, 10)}) - ((${(isNaN(widget.data._gap_y)) ? widget.data._gap_y : `${widget.data._gap_y}px`})*${((parseInt(widget.data._x_count, 10) - 1) / (parseInt(widget.data._x_count, 10))).toFixed(1)}))`)
                            }
                            return view.join(' ')
                        })()};`
                    } else {
                        style_string += `grid-template-columns:100%;`
                    }

                } else if (widget.data._layout === 'vertical') {
                    style_string += css`display: flex;
                        flex-direction: column;
                        justify-content: ${widget.data._ver_position || 'center'};`
                } else if (widget.data._layout === 'proportion') {
                    style_string += css`flex-wrap: wrap !important;
                        display: flex;gap: ${(isNaN(widget.data._gap_x)) ? widget.data._gap_x : `${widget.data._gap_x}px`} ${(isNaN(widget.data._gap_y)) ? widget.data._gap_y : `${widget.data._gap_y}px`};`
                    let horGroup:any=[];
                    let gIndex=0
                    let wCount=0
                    for (let index = 0; index <(widget.data._ratio_layout_value ?? ``).split(',').length; index++) {
                        if (horGroup[gIndex] === undefined) {
                            horGroup[gIndex] = [];
                            wCount = 0;
                        }
                        const wid = Number((widget.data._ratio_layout_value ?? ``).split(',')[index] || '0');
                        if (wCount + wid <= 100) {
                            wCount = wCount + wid
                            horGroup[gIndex].push(index)
                            if (wCount >= 100) {
                                gIndex = gIndex + 1;
                            }
                        } else {
                            gIndex = gIndex + 1
                        }
                    }

                    widget.data.setting.map((dd: any,index:number) => {
                        if (!dd.code_style) {
                            let style = ''
                            Object.defineProperty(dd, 'code_style', {
                                get: function () {
                                    return style;
                                },

                                set(v) {
                                    style = v;
                                },
                            });
                        }
                        for (const b of horGroup){
                            if(b.includes(index)){
                                const wid=(widget.data._ratio_layout_value ?? ``).split(',');
                                const _gap_y=((Number(widget.data._gap_y) * (b.length-1))/b.length).toFixed(0);

                                dd.code_style += css`width: calc(${wid[index]}% - ${_gap_y}px) !important;`
                            }
                        }

                    })
                }
            }
            if (widget.data && widget.data._style_refer === 'global' && widget.data._style_refer_global) {
                const globalValue = gvc.glitter.share.global_container_theme[parseInt(widget.data._style_refer_global.index, 10)]

                widget = {
                    data: (globalValue && globalValue.data) || {}
                }

            }
            RenderValue.custom_style.initialWidget(widget);
            ['top', 'bottom', 'left', 'right'].map((dd) => {
                if (widget.data._padding[dd]) {
                    if (!isNaN(widget.data._padding[dd])) {
                        (style_string += `padding-${dd}:${widget.data._padding[dd]}px;`)
                    } else {
                        (style_string += `padding-${dd}:${widget.data._padding[dd]};`)
                    }

                }
            });
            if (widget.data._display_block === 'vertical') {
                (style_string += `display: flex;align-items: center;justify-content: center;flex-direction: column;`)
            } else if (widget.data._display_block === 'horizontal') {
                (style_string += `display: flex;align-items: center;justify-content: center;flex-direction: row;`)
            }
            widget.data._max_width && (style_string += `width:${(isNaN(widget.data._max_width)) ? widget.data._max_width : `${widget.data._max_width}px`};max-width:100%;`)
            widget.data._border.width && (style_string += `border: ${widget.data._border.width}px solid ${widget.data._border.color};`);
            widget.data._border['radius'] && (style_string += `border-radius: ${widget.data._border.radius}px;`);
            widget.data._border['radius'] && ((widget.data._border.radius || '0') > 0 && (style_string += 'overflow:hidden;'))
            widget.data._gap && (style_string += `gap:${widget.data._gap}px;`)
            widget.data._background && (style_string += `background:${widget.data._background};`)
            widget.data._radius && (style_string += `background:${widget.data._background};`);
            widget.data._z_index && (style_string += `z-index:${widget.data._z_index};`);
            widget.data._max_height && (style_string += `max-height:${(isNaN(widget.data._max_height)) ? widget.data._max_height : `${widget.data._max_height}px`};`)
            switch (widget.data._hor_position) {
                case "left":
                    if (widget.data._display_block === 'vertical') {
                        style_string += `align-items: start;`
                    } else {
                        style_string += `justify-content: start;`
                    }
                    break
                case "right":
                    if (widget.data._display_block === 'vertical') {
                        style_string += `align-items: end;`
                    } else {
                        style_string += `justify-content: end;`
                    }
                    break
                case "center":
                    if (widget.data._max_width) {
                        style_string += `margin:auto;`
                    }
                    break
            }
            ['top', 'bottom', 'left', 'right'].map((dd) => {
                if (widget.data._margin[dd] && (widget.data._margin[dd] != '0')) {
                    if (!isNaN(widget.data._margin[dd])) {
                        (style_string += `margin-${dd}:${widget.data._margin[dd]}px;`)
                    } else {
                        (style_string += `margin-${dd}:${widget.data._margin[dd]};`)
                    }

                }
            });
            (widget.data._style) && (style_string += widget.data._style);
            (widget.data._reverse === 'true') && (style_string += ((widget.data._display_block === 'vertical') ? `flex-direction: column-reverse !important;` : `flex-direction: row-reverse !important;`));
            if ((widget.data._background_setting) && (widget.data._background_setting.type !== 'none')) {
                if (widget.data._background_setting.type === 'image') {
                    style_string += `background-image:url('${widget.data._background_setting.value}');background-position: center;
        background-repeat: no-repeat;
        background-size: cover;`
                } else if (widget.data._background_setting.type === 'color') {
                    style_string += `background-color:${widget.data._background_setting.value};`
                }
            }

            return style_string
        },
        initialWidget: (widget: any) => {
            if (widget.data.onCreateEvent) {
                (widget as any).onCreateEvent = widget.data.onCreateEvent;
                widget.data.onCreateEvent = undefined;
            }
            if (widget.data._hor_position) {
                widget.data._style_refer = widget.data._style_refer ?? 'custom'
            } else {
                widget.data._style_refer = widget.data._style_refer ?? 'global';
            }

            widget.data.elem = widget.data.elem ?? "div"
            widget.data.inner = widget.data.inner ?? ""
            widget.data.attr = widget.data.attr ?? []
            widget.data._padding = widget.data._padding ?? {}
            widget.data._margin = widget.data._margin ?? {}
            widget.data._border = widget.data._border || {}
            widget.data._max_width = widget.data._max_width ?? ''
            widget.data._gap = widget.data._gap ?? ''
            widget.data._background = widget.data._background ?? ''
            widget.data._other = widget.data._other ?? {}
            widget.data._radius = widget.data._radius ?? ''
            widget.data._reverse = widget.data._reverse ?? 'false'
            widget.data._hor_position = widget.data._hor_position ?? 'center'
            widget.data._background_setting = widget.data._background_setting ?? {type: 'none'}
        }
    }
}