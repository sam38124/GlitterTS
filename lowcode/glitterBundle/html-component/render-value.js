const css = String.raw;
export class RenderValue {
}
RenderValue.custom_style = {
    container_style: (gvc, widget) => {
        let style_string = '';
        if ((widget.data._background_setting) && (widget.data._background_setting.type !== 'none')) {
            if (widget.data._background_setting.type === 'image') {
                style_string += `background-image:url('${widget.data._background_setting.value}');background-position: center;
        background-repeat: no-repeat;
        background-size: cover;`;
            }
            else if (widget.data._background_setting.type === 'color') {
                style_string += `background-color:${widget.data._background_setting.value};`;
            }
        }
        (widget.data._style) && (style_string += widget.data._style);
        return style_string;
    },
    value: (gvc, widget) => {
        let style_string = '';
        if (widget.data._layout === 'grid') {
            (style_string += `display: grid; gap: ${(isNaN(widget.data._gap_x)) ? widget.data._gap_x : `${widget.data._gap_x}px`} ${(isNaN(widget.data._gap_y)) ? widget.data._gap_y : `${widget.data._gap_y}px`}; 
            grid-template-columns: repeat(${widget.data._x_count}, 1fr); grid-template-rows: repeat(${widget.data._y_count}, 1fr);`);
            style_string += `grid-template-columns: ${(() => {
                let view = [];
                for (let a = 0; a < parseInt(widget.data._x_count, 10); a++) {
                    view.push(`calc((100% / ${parseInt(widget.data._x_count, 10)}) - ((${(isNaN(widget.data._gap_y)) ? widget.data._gap_y : `${widget.data._gap_y}px`})*${((parseInt(widget.data._x_count, 10) - 1) / (parseInt(widget.data._x_count, 10))).toFixed(1)}))`);
                }
                return view.join(' ');
            })()} 0px;`;
        }
        else if (widget.data._layout === 'vertical') {
            style_string += css `display:flex;flex-direction: column;justify-content: ${widget.data._ver_position || 'center'};`;
        }
        if (widget.data && widget.data._style_refer === 'global' && widget.data._style_refer_global) {
            const globalValue = gvc.glitter.share.global_container_theme[parseInt(widget.data._style_refer_global.index, 10)];
            widget = {
                data: (globalValue && globalValue.data) || {}
            };
        }
        RenderValue.custom_style.initialWidget(widget);
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
        if ((widget.data._background_setting) && (widget.data._background_setting.type !== 'none')) {
            if (widget.data._background_setting.type === 'image') {
                style_string += `background-image:url('${widget.data._background_setting.value}');background-position: center;
        background-repeat: no-repeat;
        background-size: cover;`;
            }
            else if (widget.data._background_setting.type === 'color') {
                style_string += `background-color:${widget.data._background_setting.value};`;
            }
        }
        return style_string;
    },
    initialWidget: (widget) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
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
        widget.data._background_setting = (_q = widget.data._background_setting) !== null && _q !== void 0 ? _q : { type: 'none' };
    }
};
