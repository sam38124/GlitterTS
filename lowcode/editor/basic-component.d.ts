import { GVC } from "../glitterBundle/GVController.js";
export declare class BasicComponent {
    static componentList: ({
        title: string;
        config: {
            id: string;
            js: string;
            css: {
                class: {};
                style: {};
            };
            data: {
                _gap: string;
                attr: never[];
                elem: string;
                list: never[];
                inner: string;
                _gap_x: string;
                _gap_y: string;
                _other: {
                    expand?: undefined;
                };
                _border: {};
                _layout: string;
                _margin: {};
                _radius: string;
                setting: ({
                    id: string;
                    js: string;
                    css: {
                        class: {};
                        style: {};
                    };
                    data: {
                        tag: string;
                        _gap: string;
                        attr: never[];
                        elem: string;
                        list: never[];
                        inner: string;
                        _other: {};
                        _border: {};
                        _margin: {};
                        _radius: string;
                        _padding: {
                            top?: undefined;
                            left?: undefined;
                            right?: undefined;
                            bottom?: undefined;
                        };
                        _reverse: string;
                        carryData: {};
                        refer_app: string;
                        _max_width: string;
                        _background: string;
                        _style_refer: string;
                        _hor_position: string;
                        refer_form_data: {
                            kkw: string;
                            size: string;
                            color: {
                                id: string;
                                title: string;
                                content: string;
                                "sec-title": string;
                                background: string;
                                "sec-background": string;
                                "solid-button-bg": string;
                                "border-button-bg": string;
                                "solid-button-text": string;
                                "border-button-text": string;
                            };
                            title: string;
                            margin: {
                                top: string;
                                left: string;
                                right: string;
                                bottom: string;
                                toggle: boolean;
                            };
                            weight: string;
                            import_: string;
                            justify: string;
                            padding: {
                                top: string;
                                left: string;
                                right: string;
                                bottom: string;
                                toggle: boolean;
                            };
                            size_pc: string;
                            distance: {
                                toggle: boolean;
                                margin_pc: {
                                    toggle: boolean;
                                };
                                padding_pc: {
                                    toggle: boolean;
                                };
                                margin_phone: {
                                    toggle: boolean;
                                    top?: undefined;
                                    bottom?: undefined;
                                };
                                padding_phone: {
                                    toggle: boolean;
                                };
                                margin?: undefined;
                                padding?: undefined;
                            };
                            margin_pc: {
                                top: string;
                                left: string;
                                right: string;
                                bottom: string;
                                toggle: boolean;
                            };
                            padding_pc: {
                                top: string;
                                left: string;
                                right: string;
                                bottom: string;
                                toggle: boolean;
                            };
                            size_phone: string;
                            theme_color: {
                                id: string;
                                title: string;
                                content: string;
                                background: string;
                                "solid-button-bg": string;
                                "border-button-bg": string;
                                "solid-button-text": string;
                                "border-button-text": string;
                            };
                            margin_phone: {
                                top: string;
                                left: string;
                                right: string;
                                bottom: string;
                                toggle: boolean;
                            };
                            padding_phone: {
                                top: string;
                                left: string;
                                right: string;
                                bottom: string;
                                toggle: boolean;
                            };
                            r_1716801819158: {};
                            r_1718616868830: {
                                type: string;
                                value: string;
                            };
                            r_1718616877262: {
                                type: string;
                                value: string;
                            };
                            r_1718616885960: {
                                type: string;
                                value: string;
                            };
                            link?: undefined;
                            theme?: undefined;
                            width?: undefined;
                            height?: undefined;
                            radius?: undefined;
                            "font-size"?: undefined;
                        };
                        _background_setting: {
                            type: string;
                        };
                        _style_refer_global: {
                            index: string;
                        };
                    };
                    list: never[];
                    type: string;
                    class: string;
                    index: number;
                    label: string;
                    style: string;
                    global: never[];
                    mobile: {
                        id: string;
                        js: string;
                        css: {
                            class: {};
                            style: {};
                        };
                        data: {
                            refer_app: string;
                        };
                        list: never[];
                        type: string;
                        class: string;
                        index: number;
                        label: string;
                        style: string;
                        global: never[];
                        toggle: boolean;
                        stylist: never[];
                        version: string;
                        visible: boolean;
                        dataType: string;
                        style_from: string;
                        classDataType: string;
                        editor_bridge: {};
                        preloadEvenet: {};
                        container_fonts: number;
                        mobile_editable: never[];
                        desktop_editable: never[];
                        refreshAllParameter: {};
                        refreshComponentParameter: {};
                        refer: string;
                    };
                    toggle: boolean;
                    desktop: {
                        id: string;
                        js: string;
                        css: {
                            class: {};
                            style: {};
                        };
                        data: {
                            refer_app: string;
                        };
                        list: never[];
                        type: string;
                        class: string;
                        index: number;
                        label: string;
                        style: string;
                        global: never[];
                        toggle: boolean;
                        stylist: never[];
                        version: string;
                        visible: boolean;
                        dataType: string;
                        style_from: string;
                        classDataType: string;
                        editor_bridge: {};
                        preloadEvenet: {};
                        container_fonts: number;
                        mobile_editable: never[];
                        desktop_editable: never[];
                        refreshAllParameter: {};
                        refreshComponentParameter: {};
                        refer: string;
                    };
                    stylist: never[];
                    version: string;
                    visible: boolean;
                    dataType: string;
                    style_from: string;
                    classDataType: string;
                    editor_bridge: {};
                    preloadEvenet: {};
                    container_fonts: number;
                    mobile_editable: never[];
                    desktop_editable: never[];
                    refreshAllParameter: {};
                    refreshComponentParameter: {};
                    formData: {};
                } | {
                    id: string;
                    js: string;
                    css: {
                        class: {};
                        style: {};
                    };
                    data: {
                        tag: string;
                        _gap: string;
                        attr: never[];
                        elem: string;
                        list: never[];
                        inner: string;
                        _other: {};
                        _border: {};
                        _margin: {};
                        _radius: string;
                        _padding: {
                            top?: undefined;
                            left?: undefined;
                            right?: undefined;
                            bottom?: undefined;
                        };
                        _reverse: string;
                        carryData: {};
                        refer_app: string;
                        _max_width: string;
                        _background: string;
                        _style_refer: string;
                        _hor_position: string;
                        refer_form_data: {
                            kkw: string;
                            size: string;
                            color: {
                                id: string;
                                title: string;
                                content: string;
                                "sec-title": string;
                                background: string;
                                "sec-background": string;
                                "solid-button-bg": string;
                                "border-button-bg": string;
                                "solid-button-text": string;
                                "border-button-text": string;
                            };
                            title: string;
                            margin: {
                                top: string;
                                left: string;
                                right: string;
                                bottom: string;
                                toggle: boolean;
                            };
                            weight: string;
                            justify: string;
                            padding: {
                                top: string;
                                left: string;
                                right: string;
                                bottom: string;
                                toggle: boolean;
                            };
                            size_pc: string;
                            distance: {
                                toggle: boolean;
                                margin_pc: {
                                    toggle: boolean;
                                };
                                padding_pc: {
                                    toggle: boolean;
                                };
                                margin_phone: {
                                    top: string;
                                    bottom: string;
                                    toggle: boolean;
                                };
                                padding_phone: {
                                    toggle?: undefined;
                                };
                                margin?: undefined;
                                padding?: undefined;
                            };
                            margin_pc: {
                                top: string;
                                left: string;
                                right: string;
                                bottom: string;
                                toggle: boolean;
                            };
                            padding_pc: {
                                top: string;
                                left: string;
                                right: string;
                                bottom: string;
                                toggle: boolean;
                            };
                            size_phone: string;
                            theme_color: {
                                id: string;
                                title: string;
                                content: string;
                                background: string;
                                "solid-button-bg": string;
                                "border-button-bg": string;
                                "solid-button-text": string;
                                "border-button-text": string;
                            };
                            margin_phone: {
                                top: string;
                                left: string;
                                right: string;
                                bottom: string;
                                toggle: boolean;
                            };
                            padding_phone: {
                                top: string;
                                left: string;
                                right: string;
                                bottom: string;
                                toggle: boolean;
                            };
                            r_1716801819158: {};
                            r_1718616868830: {
                                type: string;
                                value: string;
                            };
                            r_1718616877262: {
                                type: string;
                                value: string;
                            };
                            r_1718616885960: {
                                type: string;
                                value: string;
                            };
                            import_?: undefined;
                            link?: undefined;
                            theme?: undefined;
                            width?: undefined;
                            height?: undefined;
                            radius?: undefined;
                            "font-size"?: undefined;
                        };
                        _background_setting: {
                            type: string;
                        };
                        _style_refer_global: {
                            index: string;
                        };
                    };
                    list: never[];
                    type: string;
                    class: string;
                    index: number;
                    label: string;
                    style: string;
                    global: never[];
                    mobile: {
                        id: string;
                        js: string;
                        css: {
                            class: {};
                            style: {};
                        };
                        data: {
                            refer_app: string;
                        };
                        list: never[];
                        type: string;
                        class: string;
                        index: number;
                        label: string;
                        style: string;
                        global: never[];
                        toggle: boolean;
                        stylist: never[];
                        version: string;
                        visible: boolean;
                        dataType: string;
                        style_from: string;
                        classDataType: string;
                        editor_bridge: {};
                        preloadEvenet: {};
                        container_fonts: number;
                        mobile_editable: never[];
                        desktop_editable: never[];
                        refreshAllParameter: {};
                        refreshComponentParameter: {};
                        refer: string;
                    };
                    toggle: boolean;
                    desktop: {
                        id: string;
                        js: string;
                        css: {
                            class: {};
                            style: {};
                        };
                        data: {
                            refer_app: string;
                        };
                        list: never[];
                        type: string;
                        class: string;
                        index: number;
                        label: string;
                        style: string;
                        global: never[];
                        toggle: boolean;
                        stylist: never[];
                        version: string;
                        visible: boolean;
                        dataType: string;
                        style_from: string;
                        classDataType: string;
                        editor_bridge: {};
                        preloadEvenet: {};
                        container_fonts: number;
                        mobile_editable: never[];
                        desktop_editable: never[];
                        refreshAllParameter: {};
                        refreshComponentParameter: {};
                        refer: string;
                    };
                    stylist: never[];
                    version: string;
                    visible: boolean;
                    dataType: string;
                    style_from: string;
                    classDataType: string;
                    editor_bridge: {};
                    preloadEvenet: {};
                    container_fonts: number;
                    mobile_editable: never[];
                    desktop_editable: never[];
                    refreshAllParameter: {};
                    refreshComponentParameter: {};
                    formData: {};
                } | {
                    id: string;
                    js: string;
                    css: {
                        class: {};
                        style: {};
                    };
                    data: {
                        tag: string;
                        _gap: string;
                        attr: never[];
                        elem: string;
                        list: never[];
                        inner: string;
                        _other: {};
                        _border: {};
                        _margin: {};
                        _radius: string;
                        _padding: {
                            top: string;
                            left: string;
                            right: string;
                            bottom: string;
                        };
                        _reverse: string;
                        carryData: {};
                        refer_app: string;
                        _max_width: string;
                        _background: string;
                        _style_refer: string;
                        _hor_position: string;
                        refer_form_data: {
                            link: string;
                            theme: {
                                id: string;
                                title: string;
                                content: string;
                                "sec-title": string;
                                background: string;
                                "sec-background": string;
                                "solid-button-bg": string;
                                "border-button-bg": string;
                                "solid-button-text": string;
                                "border-button-text": string;
                            };
                            title: string;
                            width: {
                                unit: string;
                                value: string;
                                number: string;
                            };
                            height: {
                                unit: string;
                                value: string;
                                number: string;
                            };
                            radius: string;
                            distance: {
                                margin: {
                                    top: string;
                                    bottom: string;
                                    toggle: boolean;
                                };
                                toggle: boolean;
                                padding: {
                                    top: string;
                                    left: string;
                                    right: string;
                                    bottom: string;
                                    toggle: boolean;
                                };
                                margin_pc: {
                                    toggle: boolean;
                                };
                                padding_pc: {
                                    toggle: boolean;
                                };
                                margin_phone?: undefined;
                                padding_phone?: undefined;
                            };
                            "font-size": string;
                            kkw?: undefined;
                            size?: undefined;
                            color?: undefined;
                            margin?: undefined;
                            weight?: undefined;
                            import_?: undefined;
                            justify?: undefined;
                            padding?: undefined;
                            size_pc?: undefined;
                            margin_pc?: undefined;
                            padding_pc?: undefined;
                            size_phone?: undefined;
                            theme_color?: undefined;
                            margin_phone?: undefined;
                            padding_phone?: undefined;
                            r_1716801819158?: undefined;
                            r_1718616868830?: undefined;
                            r_1718616877262?: undefined;
                            r_1718616885960?: undefined;
                        };
                        _background_setting: {
                            type: string;
                        };
                        _style_refer_global: {
                            index: string;
                        };
                    };
                    list: never[];
                    type: string;
                    class: string;
                    index: number;
                    label: string;
                    style: string;
                    global: never[];
                    mobile: {
                        id: string;
                        js: string;
                        css: {
                            class: {};
                            style: {};
                        };
                        data: {
                            refer_app: string;
                        };
                        list: never[];
                        type: string;
                        class: string;
                        index: number;
                        label: string;
                        style: string;
                        global: never[];
                        toggle: boolean;
                        stylist: never[];
                        version: string;
                        visible: boolean;
                        dataType: string;
                        style_from: string;
                        classDataType: string;
                        editor_bridge: {};
                        preloadEvenet: {};
                        container_fonts: number;
                        mobile_editable: never[];
                        desktop_editable: never[];
                        refreshAllParameter: {};
                        refreshComponentParameter: {};
                        refer: string;
                    };
                    toggle: boolean;
                    desktop: {
                        id: string;
                        js: string;
                        css: {
                            class: {};
                            style: {};
                        };
                        data: {
                            refer_app: string;
                        };
                        list: never[];
                        type: string;
                        class: string;
                        index: number;
                        label: string;
                        style: string;
                        global: never[];
                        toggle: boolean;
                        stylist: never[];
                        version: string;
                        visible: boolean;
                        dataType: string;
                        style_from: string;
                        classDataType: string;
                        editor_bridge: {};
                        preloadEvenet: {};
                        container_fonts: number;
                        mobile_editable: never[];
                        desktop_editable: never[];
                        refreshAllParameter: {};
                        refreshComponentParameter: {};
                        refer: string;
                    };
                    stylist: never[];
                    version: string;
                    visible: boolean;
                    dataType: string;
                    style_from: string;
                    classDataType: string;
                    editor_bridge: {};
                    preloadEvenet: {};
                    container_fonts: number;
                    mobile_editable: never[];
                    desktop_editable: never[];
                    refreshAllParameter: {};
                    refreshComponentParameter: {};
                    formData: {};
                })[];
                version: string;
                _padding: {
                    top: string;
                    left: string;
                    right: string;
                    bottom: string;
                };
                _reverse: string;
                _x_count: string;
                _y_count: string;
                atrExpand: {};
                _max_width: string;
                elemExpand: {};
                _background: string;
                _style_refer: string;
                _hor_position: string;
                _ver_position: string;
                _background_setting: {
                    type: string;
                    value: string;
                };
                _style_refer_global: {
                    index: number;
                };
                _ratio_layout_value?: undefined;
                tag?: undefined;
                carryData?: undefined;
                refer_app?: undefined;
                refer_form_data?: undefined;
            };
            type: string;
            index: number;
            label: string;
            global: never[];
            mobile: {
                refer: string;
                id?: undefined;
                js?: undefined;
                css?: undefined;
                data?: undefined;
                type?: undefined;
                index?: undefined;
                label?: undefined;
                global?: undefined;
                toggle?: undefined;
                visible?: undefined;
                def_editable?: undefined;
                editor_bridge?: undefined;
                preloadEvenet?: undefined;
                mobile_editable?: undefined;
                refreshAllParameter?: undefined;
                refreshComponentParameter?: undefined;
                list?: undefined;
                class?: undefined;
                style?: undefined;
                stylist?: undefined;
                version?: undefined;
                dataType?: undefined;
                style_from?: undefined;
                classDataType?: undefined;
                container_fonts?: undefined;
                desktop_editable?: undefined;
            };
            toggle: boolean;
            desktop: {
                refer: string;
                id?: undefined;
                js?: undefined;
                css?: undefined;
                data?: undefined;
                list?: undefined;
                type?: undefined;
                class?: undefined;
                index?: undefined;
                label?: undefined;
                style?: undefined;
                global?: undefined;
                toggle?: undefined;
                stylist?: undefined;
                version?: undefined;
                visible?: undefined;
                dataType?: undefined;
                style_from?: undefined;
                classDataType?: undefined;
                editor_bridge?: undefined;
                preloadEvenet?: undefined;
                container_fonts?: undefined;
                mobile_editable?: undefined;
                desktop_editable?: undefined;
                refreshAllParameter?: undefined;
                refreshComponentParameter?: undefined;
            };
            visible: boolean;
            def_editable: never[];
            editor_bridge: {};
            preloadEvenet: {};
            refreshAllParameter: {};
            refreshComponentParameter: {};
            formData: {};
            mobile_editable?: undefined;
            list?: undefined;
            class?: undefined;
            style?: undefined;
            stylist?: undefined;
            version?: undefined;
            dataType?: undefined;
            style_from?: undefined;
            classDataType?: undefined;
            container_fonts?: undefined;
            desktop_editable?: undefined;
            storage?: undefined;
            bundle?: undefined;
            share?: undefined;
        };
        image: string;
    } | {
        title: string;
        config: {
            id: string;
            js: string;
            css: {
                class: {};
                style: {};
            };
            data: {
                _gap: string;
                attr: never[];
                elem: string;
                list: never[];
                inner: string;
                _gap_x: string;
                _gap_y: string;
                _other: {
                    expand?: undefined;
                };
                _border: {};
                _layout: string;
                _margin: {};
                _radius: string;
                setting: ({
                    id: string;
                    js: string;
                    css: {
                        class: {};
                        style: {};
                    };
                    data: {
                        tag: string;
                        _gap: string;
                        attr: never[];
                        elem: string;
                        list: never[];
                        inner: string;
                        _other: {};
                        _border: {};
                        _margin: {};
                        _radius: string;
                        _padding: {
                            top?: undefined;
                            left?: undefined;
                            right?: undefined;
                            bottom?: undefined;
                        };
                        _reverse: string;
                        carryData: {};
                        refer_app: string;
                        _max_width: string;
                        _background: string;
                        _style_refer: string;
                        _hor_position: string;
                        refer_form_data: {
                            image: {
                                type: string;
                                value: string;
                            };
                            scale: string;
                        };
                        _background_setting: {
                            type: string;
                            value?: undefined;
                        };
                        _style_refer_global: {
                            index: string;
                        };
                        _gap_x?: undefined;
                        _gap_y?: undefined;
                        _layout?: undefined;
                        setting?: undefined;
                        version?: undefined;
                        _x_count?: undefined;
                        _y_count?: undefined;
                        atrExpand?: undefined;
                        elemExpand?: undefined;
                        _ver_position?: undefined;
                    };
                    list: never[];
                    type: string;
                    class: string;
                    index: number;
                    label: string;
                    style: string;
                    global: never[];
                    mobile: {
                        id: string;
                        js: string;
                        css: {
                            class: {};
                            style: {};
                        };
                        data: {
                            refer_app: string;
                            refer_form_data: {};
                        };
                        list: never[];
                        type: string;
                        class: string;
                        index: number;
                        label: string;
                        style: string;
                        global: never[];
                        toggle: boolean;
                        stylist: never[];
                        version: string;
                        visible: string;
                        dataType: string;
                        style_from: string;
                        classDataType: string;
                        editor_bridge: {};
                        preloadEvenet: {};
                        container_fonts: number;
                        mobile_editable: never[];
                        desktop_editable: never[];
                        refreshAllParameter: {};
                        refreshComponentParameter: {};
                        refer: string;
                    };
                    toggle: boolean;
                    desktop: {
                        id: string;
                        js: string;
                        css: {
                            class: {};
                            style: {};
                        };
                        data: {
                            refer_app: string;
                        };
                        list: never[];
                        type: string;
                        class: string;
                        index: number;
                        label: string;
                        style: string;
                        global: never[];
                        toggle: boolean;
                        stylist: never[];
                        version: string;
                        visible: string;
                        dataType: string;
                        style_from: string;
                        classDataType: string;
                        editor_bridge: {};
                        preloadEvenet: {};
                        container_fonts: number;
                        mobile_editable: never[];
                        desktop_editable: never[];
                        refreshAllParameter: {};
                        refreshComponentParameter: {};
                        refer: string;
                    };
                    stylist: never[];
                    version: string;
                    visible: string;
                    dataType: string;
                    style_from: string;
                    classDataType: string;
                    editor_bridge: {};
                    preloadEvenet: {};
                    container_fonts: number;
                    mobile_editable: never[];
                    desktop_editable: never[];
                    refreshAllParameter: {};
                    refreshComponentParameter: {};
                    formData: {};
                    def_editable?: undefined;
                } | {
                    id: string;
                    js: string;
                    css: {
                        class: {};
                        style: {};
                    };
                    data: {
                        _gap: string;
                        attr: never[];
                        elem: string;
                        list: never[];
                        inner: string;
                        _gap_x: string;
                        _gap_y: string;
                        _other: {};
                        _border: {};
                        _layout: string;
                        _margin: {};
                        _radius: string;
                        setting: ({
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                tag: string;
                                _gap: string;
                                attr: never[];
                                elem: string;
                                list: never[];
                                inner: string;
                                _other: {};
                                _border: {};
                                _margin: {};
                                _radius: string;
                                _padding: {
                                    top?: undefined;
                                    left?: undefined;
                                    right?: undefined;
                                    bottom?: undefined;
                                };
                                _reverse: string;
                                carryData: {};
                                refer_app: string;
                                _max_width: string;
                                _background: string;
                                _style_refer: string;
                                _hor_position: string;
                                refer_form_data: {
                                    kkw: string;
                                    size: string;
                                    color: {
                                        id: string;
                                        title: string;
                                        content: string;
                                        "sec-title": string;
                                        background: string;
                                        "sec-background": string;
                                        "solid-button-bg": string;
                                        "border-button-bg": string;
                                        "solid-button-text": string;
                                        "border-button-text": string;
                                    };
                                    title: string;
                                    margin: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    weight: string;
                                    import_: string;
                                    justify: string;
                                    padding: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    size_pc: string;
                                    distance: {
                                        toggle: boolean;
                                        margin_pc: {
                                            toggle: boolean;
                                        };
                                        padding_pc: {
                                            toggle: boolean;
                                        };
                                        margin_phone: {
                                            toggle: boolean;
                                            top?: undefined;
                                            bottom?: undefined;
                                        };
                                        padding_phone: {
                                            toggle: boolean;
                                        };
                                        margin?: undefined;
                                        padding?: undefined;
                                    };
                                    margin_pc: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    padding_pc: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    size_phone: string;
                                    theme_color: {
                                        id: string;
                                        title: string;
                                        content: string;
                                        background: string;
                                        "solid-button-bg": string;
                                        "border-button-bg": string;
                                        "solid-button-text": string;
                                        "border-button-text": string;
                                    };
                                    margin_phone: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    padding_phone: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    r_1716801819158: {};
                                    r_1718616868830: {
                                        type: string;
                                        value: string;
                                    };
                                    r_1718616877262: {
                                        type: string;
                                        value: string;
                                    };
                                    r_1718616885960: {
                                        type: string;
                                        value: string;
                                    };
                                    link?: undefined;
                                    theme?: undefined;
                                    width?: undefined;
                                    height?: undefined;
                                    radius?: undefined;
                                    "font-size"?: undefined;
                                };
                                _background_setting: {
                                    type: string;
                                };
                                _style_refer_global: {
                                    index: string;
                                };
                            };
                            list: never[];
                            type: string;
                            class: string;
                            index: number;
                            label: string;
                            style: string;
                            global: never[];
                            mobile: {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    refer_app: string;
                                    refer_form_data?: undefined;
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                toggle: boolean;
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                refer: string;
                            };
                            toggle: boolean;
                            desktop: {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    refer_app: string;
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                toggle: boolean;
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                refer: string;
                            };
                            stylist: never[];
                            version: string;
                            visible: boolean;
                            dataType: string;
                            style_from: string;
                            classDataType: string;
                            editor_bridge: {};
                            preloadEvenet: {};
                            container_fonts: number;
                            mobile_editable: never[];
                            desktop_editable: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                            formData: {};
                        } | {
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                tag: string;
                                _gap: string;
                                attr: never[];
                                elem: string;
                                list: never[];
                                inner: string;
                                _other: {};
                                _border: {};
                                _margin: {};
                                _radius: string;
                                _padding: {
                                    top?: undefined;
                                    left?: undefined;
                                    right?: undefined;
                                    bottom?: undefined;
                                };
                                _reverse: string;
                                carryData: {};
                                refer_app: string;
                                _max_width: string;
                                _background: string;
                                _style_refer: string;
                                _hor_position: string;
                                refer_form_data: {
                                    kkw: string;
                                    size: string;
                                    color: {
                                        id: string;
                                        title: string;
                                        content: string;
                                        "sec-title": string;
                                        background: string;
                                        "sec-background": string;
                                        "solid-button-bg": string;
                                        "border-button-bg": string;
                                        "solid-button-text": string;
                                        "border-button-text": string;
                                    };
                                    title: string;
                                    margin: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    weight: string;
                                    justify: string;
                                    padding: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    size_pc: string;
                                    distance: {
                                        toggle: boolean;
                                        margin_pc: {
                                            toggle: boolean;
                                        };
                                        padding_pc: {
                                            toggle: boolean;
                                        };
                                        margin_phone: {
                                            top: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        padding_phone: {
                                            toggle?: undefined;
                                        };
                                        margin?: undefined;
                                        padding?: undefined;
                                    };
                                    margin_pc: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    padding_pc: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    size_phone: string;
                                    theme_color: {
                                        id: string;
                                        title: string;
                                        content: string;
                                        background: string;
                                        "solid-button-bg": string;
                                        "border-button-bg": string;
                                        "solid-button-text": string;
                                        "border-button-text": string;
                                    };
                                    margin_phone: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    padding_phone: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    r_1716801819158: {};
                                    r_1718616868830: {
                                        type: string;
                                        value: string;
                                    };
                                    r_1718616877262: {
                                        type: string;
                                        value: string;
                                    };
                                    r_1718616885960: {
                                        type: string;
                                        value: string;
                                    };
                                    import_?: undefined;
                                    link?: undefined;
                                    theme?: undefined;
                                    width?: undefined;
                                    height?: undefined;
                                    radius?: undefined;
                                    "font-size"?: undefined;
                                };
                                _background_setting: {
                                    type: string;
                                };
                                _style_refer_global: {
                                    index: string;
                                };
                            };
                            list: never[];
                            type: string;
                            class: string;
                            index: number;
                            label: string;
                            style: string;
                            global: never[];
                            mobile: {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    refer_app: string;
                                    refer_form_data: {};
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                toggle: boolean;
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                refer: string;
                            };
                            toggle: boolean;
                            desktop: {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    refer_app: string;
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                toggle: boolean;
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                refer: string;
                            };
                            stylist: never[];
                            version: string;
                            visible: boolean;
                            dataType: string;
                            style_from: string;
                            classDataType: string;
                            editor_bridge: {};
                            preloadEvenet: {};
                            container_fonts: number;
                            mobile_editable: never[];
                            desktop_editable: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                            formData: {};
                        } | {
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                tag: string;
                                _gap: string;
                                attr: never[];
                                elem: string;
                                list: never[];
                                inner: string;
                                _other: {};
                                _border: {};
                                _margin: {};
                                _radius: string;
                                _padding: {
                                    top?: undefined;
                                    left?: undefined;
                                    right?: undefined;
                                    bottom?: undefined;
                                };
                                _reverse: string;
                                carryData: {};
                                refer_app: string;
                                _max_width: string;
                                _background: string;
                                _style_refer: string;
                                _hor_position: string;
                                refer_form_data: {
                                    kkw: string;
                                    size: string;
                                    color: {
                                        id: string;
                                        title: string;
                                        content: string;
                                        "sec-title": string;
                                        background: string;
                                        "sec-background": string;
                                        "solid-button-bg": string;
                                        "border-button-bg": string;
                                        "solid-button-text": string;
                                        "border-button-text": string;
                                    };
                                    title: string;
                                    margin: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    weight: string;
                                    justify: string;
                                    padding: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    size_pc: string;
                                    distance: {
                                        toggle: boolean;
                                        margin_pc: {
                                            toggle: boolean;
                                        };
                                        padding_pc: {
                                            toggle: boolean;
                                        };
                                        margin_phone: {
                                            top: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        padding_phone: {
                                            toggle?: undefined;
                                        };
                                        margin?: undefined;
                                        padding?: undefined;
                                    };
                                    margin_pc: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    padding_pc: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    size_phone: string;
                                    theme_color: {
                                        id: string;
                                        title: string;
                                        content: string;
                                        background: string;
                                        "solid-button-bg": string;
                                        "border-button-bg": string;
                                        "solid-button-text": string;
                                        "border-button-text": string;
                                    };
                                    margin_phone: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    padding_phone: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    r_1716801819158: {};
                                    r_1718616868830: {
                                        type: string;
                                        value: string;
                                    };
                                    r_1718616877262: {
                                        type: string;
                                        value: string;
                                    };
                                    r_1718616885960: {
                                        type: string;
                                        value: string;
                                    };
                                    import_?: undefined;
                                    link?: undefined;
                                    theme?: undefined;
                                    width?: undefined;
                                    height?: undefined;
                                    radius?: undefined;
                                    "font-size"?: undefined;
                                };
                                _background_setting: {
                                    type: string;
                                };
                                _style_refer_global: {
                                    index: string;
                                };
                            };
                            list: never[];
                            type: string;
                            class: string;
                            index: number;
                            label: string;
                            style: string;
                            global: never[];
                            mobile: {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    refer_app: string;
                                    refer_form_data?: undefined;
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                toggle: boolean;
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                refer: string;
                            };
                            toggle: boolean;
                            desktop: {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    refer_app: string;
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                toggle: boolean;
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                refer: string;
                            };
                            stylist: never[];
                            version: string;
                            visible: boolean;
                            dataType: string;
                            style_from: string;
                            classDataType: string;
                            editor_bridge: {};
                            preloadEvenet: {};
                            container_fonts: number;
                            mobile_editable: never[];
                            desktop_editable: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                            formData: {};
                        } | {
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                tag: string;
                                _gap: string;
                                attr: never[];
                                elem: string;
                                list: never[];
                                inner: string;
                                _other: {};
                                _border: {};
                                _margin: {};
                                _radius: string;
                                _padding: {
                                    top: string;
                                    left: string;
                                    right: string;
                                    bottom: string;
                                };
                                _reverse: string;
                                carryData: {};
                                refer_app: string;
                                _max_width: string;
                                _background: string;
                                _style_refer: string;
                                _hor_position: string;
                                refer_form_data: {
                                    link: string;
                                    theme: {
                                        id: string;
                                        title: string;
                                        content: string;
                                        "sec-title": string;
                                        background: string;
                                        "sec-background": string;
                                        "solid-button-bg": string;
                                        "border-button-bg": string;
                                        "solid-button-text": string;
                                        "border-button-text": string;
                                    };
                                    title: string;
                                    width: {
                                        unit: string;
                                        value: string;
                                        number: string;
                                    };
                                    height: {
                                        unit: string;
                                        value: string;
                                        number: string;
                                    };
                                    radius: string;
                                    distance: {
                                        margin: {
                                            top: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        toggle: boolean;
                                        padding: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        margin_pc: {
                                            toggle: boolean;
                                        };
                                        padding_pc: {
                                            toggle: boolean;
                                        };
                                        margin_phone?: undefined;
                                        padding_phone?: undefined;
                                    };
                                    "font-size": string;
                                    kkw?: undefined;
                                    size?: undefined;
                                    color?: undefined;
                                    margin?: undefined;
                                    weight?: undefined;
                                    import_?: undefined;
                                    justify?: undefined;
                                    padding?: undefined;
                                    size_pc?: undefined;
                                    margin_pc?: undefined;
                                    padding_pc?: undefined;
                                    size_phone?: undefined;
                                    theme_color?: undefined;
                                    margin_phone?: undefined;
                                    padding_phone?: undefined;
                                    r_1716801819158?: undefined;
                                    r_1718616868830?: undefined;
                                    r_1718616877262?: undefined;
                                    r_1718616885960?: undefined;
                                };
                                _background_setting: {
                                    type: string;
                                };
                                _style_refer_global: {
                                    index: string;
                                };
                            };
                            list: never[];
                            type: string;
                            class: string;
                            index: number;
                            label: string;
                            style: string;
                            global: never[];
                            mobile: {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    refer_app: string;
                                    refer_form_data?: undefined;
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                toggle: boolean;
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                refer: string;
                            };
                            toggle: boolean;
                            desktop: {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    refer_app: string;
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                toggle: boolean;
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                refer: string;
                            };
                            stylist: never[];
                            version: string;
                            visible: boolean;
                            dataType: string;
                            style_from: string;
                            classDataType: string;
                            editor_bridge: {};
                            preloadEvenet: {};
                            container_fonts: number;
                            mobile_editable: never[];
                            desktop_editable: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                            formData: {};
                        })[];
                        version: string;
                        _padding: {
                            top: string;
                            left: string;
                            right: string;
                            bottom: string;
                        };
                        _reverse: string;
                        _x_count: string;
                        _y_count: string;
                        atrExpand: {};
                        _max_width: string;
                        elemExpand: {};
                        _background: string;
                        _style_refer: string;
                        _hor_position: string;
                        _ver_position: string;
                        _background_setting: {
                            type: string;
                            value: string;
                        };
                        _style_refer_global: {
                            index: string;
                        };
                        tag?: undefined;
                        carryData?: undefined;
                        refer_app?: undefined;
                        refer_form_data?: undefined;
                    };
                    type: string;
                    index: number;
                    label: string;
                    global: never[];
                    mobile: {
                        refer: string;
                        id?: undefined;
                        js?: undefined;
                        css?: undefined;
                        data?: undefined;
                        list?: undefined;
                        type?: undefined;
                        class?: undefined;
                        index?: undefined;
                        label?: undefined;
                        style?: undefined;
                        global?: undefined;
                        toggle?: undefined;
                        stylist?: undefined;
                        version?: undefined;
                        visible?: undefined;
                        dataType?: undefined;
                        style_from?: undefined;
                        classDataType?: undefined;
                        editor_bridge?: undefined;
                        preloadEvenet?: undefined;
                        container_fonts?: undefined;
                        mobile_editable?: undefined;
                        desktop_editable?: undefined;
                        refreshAllParameter?: undefined;
                        refreshComponentParameter?: undefined;
                    };
                    toggle: boolean;
                    desktop: {
                        refer: string;
                        id?: undefined;
                        js?: undefined;
                        css?: undefined;
                        data?: undefined;
                        list?: undefined;
                        type?: undefined;
                        class?: undefined;
                        index?: undefined;
                        label?: undefined;
                        style?: undefined;
                        global?: undefined;
                        toggle?: undefined;
                        stylist?: undefined;
                        version?: undefined;
                        visible?: undefined;
                        dataType?: undefined;
                        style_from?: undefined;
                        classDataType?: undefined;
                        editor_bridge?: undefined;
                        preloadEvenet?: undefined;
                        container_fonts?: undefined;
                        mobile_editable?: undefined;
                        desktop_editable?: undefined;
                        refreshAllParameter?: undefined;
                        refreshComponentParameter?: undefined;
                    };
                    visible: boolean;
                    def_editable: never[];
                    editor_bridge: {};
                    preloadEvenet: {};
                    refreshAllParameter: {};
                    refreshComponentParameter: {};
                    formData: {};
                    list?: undefined;
                    class?: undefined;
                    style?: undefined;
                    stylist?: undefined;
                    version?: undefined;
                    dataType?: undefined;
                    style_from?: undefined;
                    classDataType?: undefined;
                    container_fonts?: undefined;
                    mobile_editable?: undefined;
                    desktop_editable?: undefined;
                })[];
                version: string;
                _padding: {
                    top: string;
                    left: string;
                    right: string;
                    bottom: string;
                };
                _reverse: string;
                atrExpand: {};
                _max_width: string;
                elemExpand: {};
                _background: string;
                _style_refer: string;
                _hor_position: string;
                _background_setting: {
                    type: string;
                    value?: undefined;
                };
                _ratio_layout_value: string;
                _style_refer_global: {
                    index: string;
                };
                _x_count?: undefined;
                _y_count?: undefined;
                _ver_position?: undefined;
                tag?: undefined;
                carryData?: undefined;
                refer_app?: undefined;
                refer_form_data?: undefined;
            };
            type: string;
            index: number;
            label: string;
            global: never[];
            mobile: {
                id: string;
                js: string;
                css: {
                    class: {};
                    style: {};
                };
                data: {
                    _gap: string;
                    attr: never[];
                    elem: string;
                    list: never[];
                    inner: string;
                    _gap_x: string;
                    _gap_y: string;
                    _other: {
                        expand?: undefined;
                    };
                    _border: {};
                    _layout: string;
                    _margin: {};
                    _radius: string;
                    setting: ({
                        id: string;
                        js: string;
                        css: {
                            class: {};
                            style: {};
                        };
                        data: {
                            tag: string;
                            _gap: string;
                            attr: never[];
                            elem: string;
                            list: never[];
                            inner: string;
                            _other: {};
                            _border: {};
                            _margin: {};
                            _radius: string;
                            _padding: {
                                top?: undefined;
                                left?: undefined;
                                right?: undefined;
                                bottom?: undefined;
                            };
                            _reverse: string;
                            carryData: {};
                            refer_app: string;
                            _max_width: string;
                            _background: string;
                            _style_refer: string;
                            _hor_position: string;
                            refer_form_data: {
                                image: {
                                    type: string;
                                    value: string;
                                };
                                scale: string;
                            };
                            _background_setting: {
                                type: string;
                                value?: undefined;
                            };
                            _style_refer_global: {
                                index: string;
                            };
                            _gap_x?: undefined;
                            _gap_y?: undefined;
                            _layout?: undefined;
                            setting?: undefined;
                            version?: undefined;
                            _x_count?: undefined;
                            _y_count?: undefined;
                            atrExpand?: undefined;
                            elemExpand?: undefined;
                            _ver_position?: undefined;
                        };
                        list: never[];
                        type: string;
                        class: string;
                        index: number;
                        label: string;
                        style: string;
                        global: never[];
                        mobile: {
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                refer_app: string;
                                refer_form_data: {};
                            };
                            list: never[];
                            type: string;
                            class: string;
                            index: number;
                            label: string;
                            style: string;
                            global: never[];
                            toggle: boolean;
                            stylist: never[];
                            version: string;
                            visible: string;
                            dataType: string;
                            style_from: string;
                            classDataType: string;
                            editor_bridge: {};
                            preloadEvenet: {};
                            container_fonts: number;
                            mobile_editable: never[];
                            desktop_editable: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                            refer: string;
                        };
                        toggle: boolean;
                        desktop: {
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                refer_app: string;
                            };
                            list: never[];
                            type: string;
                            class: string;
                            index: number;
                            label: string;
                            style: string;
                            global: never[];
                            toggle: boolean;
                            stylist: never[];
                            version: string;
                            visible: string;
                            dataType: string;
                            style_from: string;
                            classDataType: string;
                            editor_bridge: {};
                            preloadEvenet: {};
                            container_fonts: number;
                            mobile_editable: never[];
                            desktop_editable: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                            refer: string;
                        };
                        stylist: never[];
                        version: string;
                        visible: string;
                        dataType: string;
                        style_from: string;
                        classDataType: string;
                        editor_bridge: {};
                        preloadEvenet: {};
                        container_fonts: number;
                        mobile_editable: never[];
                        desktop_editable: never[];
                        refreshAllParameter: {};
                        refreshComponentParameter: {};
                        formData: {};
                        def_editable?: undefined;
                    } | {
                        id: string;
                        js: string;
                        css: {
                            class: {};
                            style: {};
                        };
                        data: {
                            _gap: string;
                            attr: never[];
                            elem: string;
                            list: never[];
                            inner: string;
                            _gap_x: string;
                            _gap_y: string;
                            _other: {};
                            _border: {};
                            _layout: string;
                            _margin: {};
                            _radius: string;
                            setting: ({
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    tag: string;
                                    _gap: string;
                                    attr: never[];
                                    elem: string;
                                    list: never[];
                                    inner: string;
                                    _other: {};
                                    _border: {};
                                    _margin: {};
                                    _radius: string;
                                    _padding: {
                                        top?: undefined;
                                        left?: undefined;
                                        right?: undefined;
                                        bottom?: undefined;
                                    };
                                    _reverse: string;
                                    carryData: {};
                                    refer_app: string;
                                    _max_width: string;
                                    _background: string;
                                    _style_refer: string;
                                    _hor_position: string;
                                    refer_form_data: {
                                        kkw: string;
                                        size: string;
                                        color: {
                                            id: string;
                                            title: string;
                                            content: string;
                                            "sec-title": string;
                                            background: string;
                                            "sec-background": string;
                                            "solid-button-bg": string;
                                            "border-button-bg": string;
                                            "solid-button-text": string;
                                            "border-button-text": string;
                                        };
                                        title: string;
                                        margin: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        weight: string;
                                        import_: string;
                                        justify: string;
                                        padding: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        size_pc: string;
                                        distance: {
                                            toggle: boolean;
                                            margin_pc: {
                                                toggle: boolean;
                                            };
                                            padding_pc: {
                                                toggle: boolean;
                                            };
                                            margin_phone: {
                                                toggle: boolean;
                                                top?: undefined;
                                                bottom?: undefined;
                                            };
                                            padding_phone: {
                                                toggle: boolean;
                                            };
                                            margin?: undefined;
                                            padding?: undefined;
                                        };
                                        margin_pc: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        padding_pc: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        size_phone: string;
                                        theme_color: {
                                            id: string;
                                            title: string;
                                            content: string;
                                            background: string;
                                            "solid-button-bg": string;
                                            "border-button-bg": string;
                                            "solid-button-text": string;
                                            "border-button-text": string;
                                        };
                                        margin_phone: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        padding_phone: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        r_1716801819158: {};
                                        r_1718616868830: {
                                            type: string;
                                            value: string;
                                        };
                                        r_1718616877262: {
                                            type: string;
                                            value: string;
                                        };
                                        r_1718616885960: {
                                            type: string;
                                            value: string;
                                        };
                                        link?: undefined;
                                        theme?: undefined;
                                        width?: undefined;
                                        height?: undefined;
                                        radius?: undefined;
                                        "font-size"?: undefined;
                                    };
                                    _background_setting: {
                                        type: string;
                                    };
                                    _style_refer_global: {
                                        index: string;
                                    };
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                mobile: {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        refer_app: string;
                                        refer_form_data?: undefined;
                                    };
                                    list: never[];
                                    type: string;
                                    class: string;
                                    index: number;
                                    label: string;
                                    style: string;
                                    global: never[];
                                    toggle: boolean;
                                    stylist: never[];
                                    version: string;
                                    visible: boolean;
                                    dataType: string;
                                    style_from: string;
                                    classDataType: string;
                                    editor_bridge: {};
                                    preloadEvenet: {};
                                    container_fonts: number;
                                    mobile_editable: never[];
                                    desktop_editable: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                    refer: string;
                                };
                                toggle: boolean;
                                desktop: {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        refer_app: string;
                                    };
                                    list: never[];
                                    type: string;
                                    class: string;
                                    index: number;
                                    label: string;
                                    style: string;
                                    global: never[];
                                    toggle: boolean;
                                    stylist: never[];
                                    version: string;
                                    visible: boolean;
                                    dataType: string;
                                    style_from: string;
                                    classDataType: string;
                                    editor_bridge: {};
                                    preloadEvenet: {};
                                    container_fonts: number;
                                    mobile_editable: never[];
                                    desktop_editable: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                    refer: string;
                                };
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                formData: {};
                            } | {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    tag: string;
                                    _gap: string;
                                    attr: never[];
                                    elem: string;
                                    list: never[];
                                    inner: string;
                                    _other: {};
                                    _border: {};
                                    _margin: {};
                                    _radius: string;
                                    _padding: {
                                        top?: undefined;
                                        left?: undefined;
                                        right?: undefined;
                                        bottom?: undefined;
                                    };
                                    _reverse: string;
                                    carryData: {};
                                    refer_app: string;
                                    _max_width: string;
                                    _background: string;
                                    _style_refer: string;
                                    _hor_position: string;
                                    refer_form_data: {
                                        kkw: string;
                                        size: string;
                                        color: {
                                            id: string;
                                            title: string;
                                            content: string;
                                            "sec-title": string;
                                            background: string;
                                            "sec-background": string;
                                            "solid-button-bg": string;
                                            "border-button-bg": string;
                                            "solid-button-text": string;
                                            "border-button-text": string;
                                        };
                                        title: string;
                                        margin: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        weight: string;
                                        justify: string;
                                        padding: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        size_pc: string;
                                        distance: {
                                            toggle: boolean;
                                            margin_pc: {
                                                toggle: boolean;
                                            };
                                            padding_pc: {
                                                toggle: boolean;
                                            };
                                            margin_phone: {
                                                top: string;
                                                bottom: string;
                                                toggle: boolean;
                                            };
                                            padding_phone: {
                                                toggle?: undefined;
                                            };
                                            margin?: undefined;
                                            padding?: undefined;
                                        };
                                        margin_pc: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        padding_pc: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        size_phone: string;
                                        theme_color: {
                                            id: string;
                                            title: string;
                                            content: string;
                                            background: string;
                                            "solid-button-bg": string;
                                            "border-button-bg": string;
                                            "solid-button-text": string;
                                            "border-button-text": string;
                                        };
                                        margin_phone: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        padding_phone: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        r_1716801819158: {};
                                        r_1718616868830: {
                                            type: string;
                                            value: string;
                                        };
                                        r_1718616877262: {
                                            type: string;
                                            value: string;
                                        };
                                        r_1718616885960: {
                                            type: string;
                                            value: string;
                                        };
                                        import_?: undefined;
                                        link?: undefined;
                                        theme?: undefined;
                                        width?: undefined;
                                        height?: undefined;
                                        radius?: undefined;
                                        "font-size"?: undefined;
                                    };
                                    _background_setting: {
                                        type: string;
                                    };
                                    _style_refer_global: {
                                        index: string;
                                    };
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                mobile: {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        refer_app: string;
                                        refer_form_data: {};
                                    };
                                    list: never[];
                                    type: string;
                                    class: string;
                                    index: number;
                                    label: string;
                                    style: string;
                                    global: never[];
                                    toggle: boolean;
                                    stylist: never[];
                                    version: string;
                                    visible: boolean;
                                    dataType: string;
                                    style_from: string;
                                    classDataType: string;
                                    editor_bridge: {};
                                    preloadEvenet: {};
                                    container_fonts: number;
                                    mobile_editable: never[];
                                    desktop_editable: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                    refer: string;
                                };
                                toggle: boolean;
                                desktop: {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        refer_app: string;
                                    };
                                    list: never[];
                                    type: string;
                                    class: string;
                                    index: number;
                                    label: string;
                                    style: string;
                                    global: never[];
                                    toggle: boolean;
                                    stylist: never[];
                                    version: string;
                                    visible: boolean;
                                    dataType: string;
                                    style_from: string;
                                    classDataType: string;
                                    editor_bridge: {};
                                    preloadEvenet: {};
                                    container_fonts: number;
                                    mobile_editable: never[];
                                    desktop_editable: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                    refer: string;
                                };
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                formData: {};
                            } | {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    tag: string;
                                    _gap: string;
                                    attr: never[];
                                    elem: string;
                                    list: never[];
                                    inner: string;
                                    _other: {};
                                    _border: {};
                                    _margin: {};
                                    _radius: string;
                                    _padding: {
                                        top?: undefined;
                                        left?: undefined;
                                        right?: undefined;
                                        bottom?: undefined;
                                    };
                                    _reverse: string;
                                    carryData: {};
                                    refer_app: string;
                                    _max_width: string;
                                    _background: string;
                                    _style_refer: string;
                                    _hor_position: string;
                                    refer_form_data: {
                                        kkw: string;
                                        size: string;
                                        color: {
                                            id: string;
                                            title: string;
                                            content: string;
                                            "sec-title": string;
                                            background: string;
                                            "sec-background": string;
                                            "solid-button-bg": string;
                                            "border-button-bg": string;
                                            "solid-button-text": string;
                                            "border-button-text": string;
                                        };
                                        title: string;
                                        margin: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        weight: string;
                                        justify: string;
                                        padding: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        size_pc: string;
                                        distance: {
                                            toggle: boolean;
                                            margin_pc: {
                                                toggle: boolean;
                                            };
                                            padding_pc: {
                                                toggle: boolean;
                                            };
                                            margin_phone: {
                                                top: string;
                                                bottom: string;
                                                toggle: boolean;
                                            };
                                            padding_phone: {
                                                toggle?: undefined;
                                            };
                                            margin?: undefined;
                                            padding?: undefined;
                                        };
                                        margin_pc: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        padding_pc: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        size_phone: string;
                                        theme_color: {
                                            id: string;
                                            title: string;
                                            content: string;
                                            background: string;
                                            "solid-button-bg": string;
                                            "border-button-bg": string;
                                            "solid-button-text": string;
                                            "border-button-text": string;
                                        };
                                        margin_phone: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        padding_phone: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        r_1716801819158: {};
                                        r_1718616868830: {
                                            type: string;
                                            value: string;
                                        };
                                        r_1718616877262: {
                                            type: string;
                                            value: string;
                                        };
                                        r_1718616885960: {
                                            type: string;
                                            value: string;
                                        };
                                        import_?: undefined;
                                        link?: undefined;
                                        theme?: undefined;
                                        width?: undefined;
                                        height?: undefined;
                                        radius?: undefined;
                                        "font-size"?: undefined;
                                    };
                                    _background_setting: {
                                        type: string;
                                    };
                                    _style_refer_global: {
                                        index: string;
                                    };
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                mobile: {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        refer_app: string;
                                        refer_form_data?: undefined;
                                    };
                                    list: never[];
                                    type: string;
                                    class: string;
                                    index: number;
                                    label: string;
                                    style: string;
                                    global: never[];
                                    toggle: boolean;
                                    stylist: never[];
                                    version: string;
                                    visible: boolean;
                                    dataType: string;
                                    style_from: string;
                                    classDataType: string;
                                    editor_bridge: {};
                                    preloadEvenet: {};
                                    container_fonts: number;
                                    mobile_editable: never[];
                                    desktop_editable: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                    refer: string;
                                };
                                toggle: boolean;
                                desktop: {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        refer_app: string;
                                    };
                                    list: never[];
                                    type: string;
                                    class: string;
                                    index: number;
                                    label: string;
                                    style: string;
                                    global: never[];
                                    toggle: boolean;
                                    stylist: never[];
                                    version: string;
                                    visible: boolean;
                                    dataType: string;
                                    style_from: string;
                                    classDataType: string;
                                    editor_bridge: {};
                                    preloadEvenet: {};
                                    container_fonts: number;
                                    mobile_editable: never[];
                                    desktop_editable: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                    refer: string;
                                };
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                formData: {};
                            } | {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    tag: string;
                                    _gap: string;
                                    attr: never[];
                                    elem: string;
                                    list: never[];
                                    inner: string;
                                    _other: {};
                                    _border: {};
                                    _margin: {};
                                    _radius: string;
                                    _padding: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                    };
                                    _reverse: string;
                                    carryData: {};
                                    refer_app: string;
                                    _max_width: string;
                                    _background: string;
                                    _style_refer: string;
                                    _hor_position: string;
                                    refer_form_data: {
                                        link: string;
                                        theme: {
                                            id: string;
                                            title: string;
                                            content: string;
                                            "sec-title": string;
                                            background: string;
                                            "sec-background": string;
                                            "solid-button-bg": string;
                                            "border-button-bg": string;
                                            "solid-button-text": string;
                                            "border-button-text": string;
                                        };
                                        title: string;
                                        width: {
                                            unit: string;
                                            value: string;
                                            number: string;
                                        };
                                        height: {
                                            unit: string;
                                            value: string;
                                            number: string;
                                        };
                                        radius: string;
                                        distance: {
                                            margin: {
                                                top: string;
                                                bottom: string;
                                                toggle: boolean;
                                            };
                                            toggle: boolean;
                                            padding: {
                                                top: string;
                                                left: string;
                                                right: string;
                                                bottom: string;
                                                toggle: boolean;
                                            };
                                            margin_pc: {
                                                toggle: boolean;
                                            };
                                            padding_pc: {
                                                toggle: boolean;
                                            };
                                            margin_phone?: undefined;
                                            padding_phone?: undefined;
                                        };
                                        "font-size": string;
                                        kkw?: undefined;
                                        size?: undefined;
                                        color?: undefined;
                                        margin?: undefined;
                                        weight?: undefined;
                                        import_?: undefined;
                                        justify?: undefined;
                                        padding?: undefined;
                                        size_pc?: undefined;
                                        margin_pc?: undefined;
                                        padding_pc?: undefined;
                                        size_phone?: undefined;
                                        theme_color?: undefined;
                                        margin_phone?: undefined;
                                        padding_phone?: undefined;
                                        r_1716801819158?: undefined;
                                        r_1718616868830?: undefined;
                                        r_1718616877262?: undefined;
                                        r_1718616885960?: undefined;
                                    };
                                    _background_setting: {
                                        type: string;
                                    };
                                    _style_refer_global: {
                                        index: string;
                                    };
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                mobile: {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        refer_app: string;
                                        refer_form_data?: undefined;
                                    };
                                    list: never[];
                                    type: string;
                                    class: string;
                                    index: number;
                                    label: string;
                                    style: string;
                                    global: never[];
                                    toggle: boolean;
                                    stylist: never[];
                                    version: string;
                                    visible: boolean;
                                    dataType: string;
                                    style_from: string;
                                    classDataType: string;
                                    editor_bridge: {};
                                    preloadEvenet: {};
                                    container_fonts: number;
                                    mobile_editable: never[];
                                    desktop_editable: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                    refer: string;
                                };
                                toggle: boolean;
                                desktop: {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        refer_app: string;
                                    };
                                    list: never[];
                                    type: string;
                                    class: string;
                                    index: number;
                                    label: string;
                                    style: string;
                                    global: never[];
                                    toggle: boolean;
                                    stylist: never[];
                                    version: string;
                                    visible: boolean;
                                    dataType: string;
                                    style_from: string;
                                    classDataType: string;
                                    editor_bridge: {};
                                    preloadEvenet: {};
                                    container_fonts: number;
                                    mobile_editable: never[];
                                    desktop_editable: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                    refer: string;
                                };
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                formData: {};
                            })[];
                            version: string;
                            _padding: {
                                top: string;
                                left: string;
                                right: string;
                                bottom: string;
                            };
                            _reverse: string;
                            _x_count: string;
                            _y_count: string;
                            atrExpand: {};
                            _max_width: string;
                            elemExpand: {};
                            _background: string;
                            _style_refer: string;
                            _hor_position: string;
                            _ver_position: string;
                            _background_setting: {
                                type: string;
                                value: string;
                            };
                            _style_refer_global: {
                                index: string;
                            };
                            tag?: undefined;
                            carryData?: undefined;
                            refer_app?: undefined;
                            refer_form_data?: undefined;
                        };
                        type: string;
                        index: number;
                        label: string;
                        global: never[];
                        mobile: {
                            refer: string;
                            id?: undefined;
                            js?: undefined;
                            css?: undefined;
                            data?: undefined;
                            list?: undefined;
                            type?: undefined;
                            class?: undefined;
                            index?: undefined;
                            label?: undefined;
                            style?: undefined;
                            global?: undefined;
                            toggle?: undefined;
                            stylist?: undefined;
                            version?: undefined;
                            visible?: undefined;
                            dataType?: undefined;
                            style_from?: undefined;
                            classDataType?: undefined;
                            editor_bridge?: undefined;
                            preloadEvenet?: undefined;
                            container_fonts?: undefined;
                            mobile_editable?: undefined;
                            desktop_editable?: undefined;
                            refreshAllParameter?: undefined;
                            refreshComponentParameter?: undefined;
                        };
                        toggle: boolean;
                        desktop: {
                            refer: string;
                            id?: undefined;
                            js?: undefined;
                            css?: undefined;
                            data?: undefined;
                            list?: undefined;
                            type?: undefined;
                            class?: undefined;
                            index?: undefined;
                            label?: undefined;
                            style?: undefined;
                            global?: undefined;
                            toggle?: undefined;
                            stylist?: undefined;
                            version?: undefined;
                            visible?: undefined;
                            dataType?: undefined;
                            style_from?: undefined;
                            classDataType?: undefined;
                            editor_bridge?: undefined;
                            preloadEvenet?: undefined;
                            container_fonts?: undefined;
                            mobile_editable?: undefined;
                            desktop_editable?: undefined;
                            refreshAllParameter?: undefined;
                            refreshComponentParameter?: undefined;
                        };
                        visible: boolean;
                        def_editable: never[];
                        editor_bridge: {};
                        preloadEvenet: {};
                        refreshAllParameter: {};
                        refreshComponentParameter: {};
                        formData: {};
                        list?: undefined;
                        class?: undefined;
                        style?: undefined;
                        stylist?: undefined;
                        version?: undefined;
                        dataType?: undefined;
                        style_from?: undefined;
                        classDataType?: undefined;
                        container_fonts?: undefined;
                        mobile_editable?: undefined;
                        desktop_editable?: undefined;
                    })[];
                    version: string;
                    _padding: {
                        top: string;
                        left: string;
                        right: string;
                        bottom: string;
                    };
                    _reverse: string;
                    atrExpand: {};
                    _max_width: string;
                    elemExpand: {};
                    _background: string;
                    _style_refer: string;
                    _hor_position: string;
                    _background_setting: {
                        type: string;
                    };
                    _ratio_layout_value: string;
                    _style_refer_global: {
                        index: string;
                    };
                    refer_app?: undefined;
                    refer_form_data?: undefined;
                    _x_count?: undefined;
                    _y_count?: undefined;
                };
                type: string;
                index: number;
                label: string;
                global: never[];
                toggle: boolean;
                visible: boolean;
                def_editable: never[];
                editor_bridge: {};
                preloadEvenet: {};
                mobile_editable: never[];
                refreshAllParameter: {};
                refreshComponentParameter: {};
                refer: string;
                list?: undefined;
                class?: undefined;
                style?: undefined;
                stylist?: undefined;
                version?: undefined;
                dataType?: undefined;
                style_from?: undefined;
                classDataType?: undefined;
                container_fonts?: undefined;
                desktop_editable?: undefined;
            };
            toggle: boolean;
            desktop: {
                refer: string;
                id?: undefined;
                js?: undefined;
                css?: undefined;
                data?: undefined;
                list?: undefined;
                type?: undefined;
                class?: undefined;
                index?: undefined;
                label?: undefined;
                style?: undefined;
                global?: undefined;
                toggle?: undefined;
                stylist?: undefined;
                version?: undefined;
                visible?: undefined;
                dataType?: undefined;
                style_from?: undefined;
                classDataType?: undefined;
                editor_bridge?: undefined;
                preloadEvenet?: undefined;
                container_fonts?: undefined;
                mobile_editable?: undefined;
                desktop_editable?: undefined;
                refreshAllParameter?: undefined;
                refreshComponentParameter?: undefined;
            };
            visible: boolean;
            def_editable: never[];
            editor_bridge: {};
            preloadEvenet: {};
            mobile_editable: never[];
            refreshAllParameter: {};
            refreshComponentParameter: {};
            formData: {};
            list?: undefined;
            class?: undefined;
            style?: undefined;
            stylist?: undefined;
            version?: undefined;
            dataType?: undefined;
            style_from?: undefined;
            classDataType?: undefined;
            container_fonts?: undefined;
            desktop_editable?: undefined;
            storage?: undefined;
            bundle?: undefined;
            share?: undefined;
        };
        image: string;
    } | {
        title: string;
        config: {
            id: string;
            js: string;
            css: {
                class: {};
                style: {};
            };
            data: {
                tag: string;
                _gap: string;
                attr: never[];
                elem: string;
                list: never[];
                inner: string;
                _other: {
                    expand?: undefined;
                };
                _border: {};
                _margin: {};
                _radius: string;
                _padding: {
                    top: string;
                    right: string;
                    bottom: string;
                    left: string;
                };
                _reverse: string;
                carryData: {};
                refer_app: string;
                _max_width: string;
                _background: string;
                _style_refer: string;
                _hor_position: string;
                refer_form_data: {
                    bo: {
                        gap_x: string;
                        gap_y: string;
                        radio: {
                            unit: string;
                            value: string;
                            number: string;
                        };
                        ratio: string;
                        width: string;
                        border: string;
                        height: {
                            type: string;
                            unit: string;
                            value: string;
                            number: string;
                        };
                        toggle: boolean;
                        show_title: string;
                        image_hover: string;
                        border_color: {
                            id: string;
                            title: string;
                            content: string;
                            "sec-title": string;
                            background: string;
                            "sec-background": string;
                            "solid-button-bg": string;
                            "border-button-bg": string;
                            "solid-button-text": string;
                            "border-button-text": string;
                        };
                    };
                    ggg: {
                        images: ({
                            link: string;
                            name: string;
                            image: string;
                            index: number;
                            c_v_id: string;
                            toggle: boolean;
                        } | {
                            name: string;
                            image: string;
                            index: number;
                            c_v_id: string;
                            toggle: boolean;
                            link?: undefined;
                        })[];
                        toggle: boolean;
                        image_hover: string;
                    };
                    grid: string;
                    size: string;
                    color: string;
                    gap_x: string;
                    gap_y: string;
                    title: string;
                    width: string;
                    border: string;
                    height: string;
                    images: {
                        name: string;
                        image: string;
                    }[];
                    margin: {
                        top: string;
                        left: string;
                        right: string;
                        bottom: string;
                        toggle: boolean;
                    };
                    weight: string;
                    grid_pc: {
                        x: string;
                        y: string;
                        toggle: boolean;
                    };
                    justify: string;
                    padding: {
                        top: string;
                        left: string;
                        right: string;
                        bottom: string;
                        toggle: boolean;
                    };
                    size_pc: string;
                    distance: {
                        toggle: boolean;
                        margin_pc: {
                            top: string;
                            bottom: string;
                            toggle: boolean;
                        };
                        padding_pc: {};
                        margin_phone: {
                            top: string;
                            bottom: string;
                            toggle: boolean;
                        };
                        padding_phone: {};
                    };
                    margin_pc: {
                        top: string;
                        left: string;
                        right: string;
                        bottom: string;
                        toggle: boolean;
                    };
                    grid_phone: {
                        x: string;
                        y: string;
                        toggle: boolean;
                    };
                    padding_pc: {
                        top: string;
                        left: string;
                        right: string;
                        bottom: string;
                        toggle: boolean;
                    };
                    size_phone: string;
                    image_hover: string;
                    border_color: {
                        id: string;
                        title: string;
                        content: string;
                        background: string;
                        "solid-button-bg": string;
                        "border-button-bg": string;
                        "solid-button-text": string;
                        "border-button-text": string;
                    };
                    margin_phone: {
                        top: string;
                        left: string;
                        right: string;
                        bottom: string;
                        toggle: boolean;
                    };
                    padding_phone: {
                        top: string;
                        left: string;
                        right: string;
                        bottom: string;
                        toggle: boolean;
                    };
                    r_1716801819158: {};
                    ccc?: undefined;
                    circle?: undefined;
                    slide_pc?: undefined;
                    slide_phone?: undefined;
                    slide_tablet?: undefined;
                    hint?: undefined;
                    ratio?: undefined;
                    back_img?: undefined;
                    sub_title?: undefined;
                    search_tag?: undefined;
                    "title-size"?: undefined;
                    cover_color?: undefined;
                    theme_color?: undefined;
                    "sub-title-size"?: undefined;
                    image?: undefined;
                    scale?: undefined;
                    random?: undefined;
                    autoplay?: undefined;
                    title_size?: undefined;
                    phone_image?: undefined;
                    banner_height?: undefined;
                    banner_height2?: undefined;
                    r_1718088289110?: undefined;
                    phone_banner_height?: undefined;
                    theme?: undefined;
                    content?: undefined;
                    carry_info?: undefined;
                };
                _background_setting: {
                    type: string;
                    value?: undefined;
                };
                _style_refer_global: {
                    index: string;
                };
                _gap_x?: undefined;
                _gap_y?: undefined;
                _layout?: undefined;
                setting?: undefined;
                version?: undefined;
                _x_count?: undefined;
                _y_count?: undefined;
                atrExpand?: undefined;
                elemExpand?: undefined;
                _ver_position?: undefined;
                _ratio_layout_value?: undefined;
            };
            list: never[];
            type: string;
            class: string;
            index: number;
            label: string;
            style: string;
            global: never[];
            mobile: {
                id: string;
                js: string;
                css: {
                    class: {};
                    style: {};
                };
                data: {
                    refer_app: string;
                    refer_form_data: {
                        bo: {
                            gap_x: string;
                            gap_y: string;
                            radio: {
                                unit: string;
                                value: string;
                                number: string;
                            };
                            ratio: string;
                            width: string;
                            border: string;
                            height: {
                                type: string;
                                unit: string;
                                value: string;
                                number: string;
                            };
                            toggle: boolean;
                            show_title: string;
                            image_hover: string;
                            border_color: {
                                id: string;
                                title: string;
                                content: string;
                                "sec-title": string;
                                background: string;
                                "sec-background": string;
                                "solid-button-bg": string;
                                "border-button-bg": string;
                                "solid-button-text": string;
                                "border-button-text": string;
                            };
                        };
                        grid_pc: {
                            x: string;
                            y: string;
                            toggle: boolean;
                        };
                        ratio?: undefined;
                        search_tag?: undefined;
                        "title-size"?: undefined;
                        "sub-title-size"?: undefined;
                    };
                    _gap?: undefined;
                    attr?: undefined;
                    elem?: undefined;
                    list?: undefined;
                    inner?: undefined;
                    _gap_x?: undefined;
                    _gap_y?: undefined;
                    _other?: undefined;
                    _border?: undefined;
                    _layout?: undefined;
                    _margin?: undefined;
                    _radius?: undefined;
                    setting?: undefined;
                    version?: undefined;
                    _padding?: undefined;
                    _reverse?: undefined;
                    atrExpand?: undefined;
                    _max_width?: undefined;
                    elemExpand?: undefined;
                    _background?: undefined;
                    _style_refer?: undefined;
                    _hor_position?: undefined;
                    _background_setting?: undefined;
                    _ratio_layout_value?: undefined;
                    _style_refer_global?: undefined;
                    _x_count?: undefined;
                    _y_count?: undefined;
                };
                list: never[];
                type: string;
                class: string;
                index: number;
                label: string;
                style: string;
                global: never[];
                toggle: boolean;
                stylist: never[];
                version: string;
                visible: boolean;
                dataType: string;
                style_from: string;
                classDataType: string;
                editor_bridge: {};
                preloadEvenet: {};
                container_fonts: number;
                mobile_editable: string[];
                desktop_editable: never[];
                refreshAllParameter: {};
                refreshComponentParameter: {};
                refer: string;
                def_editable?: undefined;
            };
            toggle: boolean;
            desktop: {
                id: string;
                js: string;
                css: {
                    class: {};
                    style: {};
                };
                data: {
                    refer_app: string;
                    refer_form_data?: undefined;
                };
                list: never[];
                type: string;
                class: string;
                index: number;
                label: string;
                style: string;
                global: never[];
                toggle: boolean;
                stylist: never[];
                version: string;
                visible: boolean;
                dataType: string;
                style_from: string;
                classDataType: string;
                editor_bridge: {};
                preloadEvenet: {};
                container_fonts: number;
                mobile_editable: string[];
                desktop_editable: never[];
                refreshAllParameter: {};
                refreshComponentParameter: {};
                refer: string;
            };
            stylist: never[];
            version: string;
            visible: boolean;
            dataType: string;
            style_from: string;
            classDataType: string;
            editor_bridge: {};
            preloadEvenet: {};
            container_fonts: number;
            mobile_editable: string[];
            desktop_editable: never[];
            refreshAllParameter: {};
            refreshComponentParameter: {};
            formData: {};
            storage: {};
            def_editable?: undefined;
            bundle?: undefined;
            share?: undefined;
        };
        image: string;
    } | {
        title: string;
        image: string;
        config: {
            id: string;
            js: string;
            css: {
                class: {};
                style: {};
            };
            data: {
                tag: string;
                _gap: string;
                attr: never[];
                elem: string;
                list: never[];
                inner: string;
                _other: {
                    expand?: undefined;
                };
                _border: {};
                _margin: {};
                _radius: string;
                _padding: {
                    top: string;
                    left: string;
                    right: string;
                    bottom: string;
                };
                _reverse: string;
                carryData: {};
                refer_app: string;
                _max_width: string;
                _background: string;
                _style_refer: string;
                _hor_position: string;
                refer_form_data: {
                    ccc: {
                        toggle: boolean;
                        circles: ({
                            image: string;
                            index: number;
                            title: string;
                            c_v_id: string;
                            toggle: boolean;
                            link?: undefined;
                        } | {
                            link: string;
                            image: string;
                            index: number;
                            title: string;
                            c_v_id: string;
                            toggle: boolean;
                        })[];
                    };
                    title: {
                        color: {
                            id: string;
                            title: string;
                            content: string;
                            background: string;
                            "solid-button-bg": string;
                            "border-button-bg": string;
                            "solid-button-text": string;
                            "border-button-text": string;
                        };
                        toggle: boolean;
                        size_pc: string;
                        size_phone: string;
                    };
                    circle: {
                        color: {
                            id: string;
                            title: string;
                            content: string;
                            background: string;
                            "solid-button-bg": string;
                            "border-button-bg": string;
                            "solid-button-text": string;
                            "border-button-text": string;
                        };
                        border: string;
                        radius: string;
                        toggle: boolean;
                        size_pc: {
                            type: string;
                            unit: string;
                            value: string;
                            number: string;
                        };
                        size_phone: {
                            type: string;
                            unit: string;
                            value: string;
                            number: string;
                        };
                    };
                    distance: {
                        toggle: boolean;
                        margin_pc: {
                            top: string;
                            bottom: string;
                            toggle: boolean;
                        };
                        padding_pc: {};
                        margin_phone: {
                            top: string;
                            bottom: string;
                            toggle: boolean;
                        };
                        padding_phone: {};
                    };
                    slide_pc: {
                        view: string;
                        space: string;
                        toggle: boolean;
                    };
                    margin_pc: {
                        top: string;
                        left: string;
                        right: string;
                        bottom: string;
                        toggle: boolean;
                    };
                    padding_pc: {
                        top: string;
                        left: string;
                        right: string;
                        bottom: string;
                        toggle: boolean;
                    };
                    slide_phone: {
                        view: string;
                        space: string;
                        toggle: boolean;
                    };
                    margin_phone: {
                        top: string;
                        left: string;
                        right: string;
                        bottom: string;
                        toggle: boolean;
                    };
                    slide_tablet: {
                        view: string;
                        space: string;
                        toggle: boolean;
                    };
                    padding_phone: {
                        top: string;
                        left: string;
                        right: string;
                        bottom: string;
                        toggle: boolean;
                    };
                    bo?: undefined;
                    ggg?: undefined;
                    grid?: undefined;
                    size?: undefined;
                    color?: undefined;
                    gap_x?: undefined;
                    gap_y?: undefined;
                    width?: undefined;
                    border?: undefined;
                    height?: undefined;
                    images?: undefined;
                    margin?: undefined;
                    weight?: undefined;
                    grid_pc?: undefined;
                    justify?: undefined;
                    padding?: undefined;
                    size_pc?: undefined;
                    grid_phone?: undefined;
                    size_phone?: undefined;
                    image_hover?: undefined;
                    border_color?: undefined;
                    r_1716801819158?: undefined;
                    hint?: undefined;
                    ratio?: undefined;
                    back_img?: undefined;
                    sub_title?: undefined;
                    search_tag?: undefined;
                    "title-size"?: undefined;
                    cover_color?: undefined;
                    theme_color?: undefined;
                    "sub-title-size"?: undefined;
                    image?: undefined;
                    scale?: undefined;
                    random?: undefined;
                    autoplay?: undefined;
                    title_size?: undefined;
                    phone_image?: undefined;
                    banner_height?: undefined;
                    banner_height2?: undefined;
                    r_1718088289110?: undefined;
                    phone_banner_height?: undefined;
                    theme?: undefined;
                    content?: undefined;
                    carry_info?: undefined;
                };
                _background_setting: {
                    type: string;
                    value?: undefined;
                };
                _style_refer_global: {
                    index: string;
                };
                _gap_x?: undefined;
                _gap_y?: undefined;
                _layout?: undefined;
                setting?: undefined;
                version?: undefined;
                _x_count?: undefined;
                _y_count?: undefined;
                atrExpand?: undefined;
                elemExpand?: undefined;
                _ver_position?: undefined;
                _ratio_layout_value?: undefined;
            };
            list: never[];
            type: string;
            class: string;
            index: number;
            label: string;
            style: string;
            global: never[];
            mobile: {
                id: string;
                js: string;
                css: {
                    class: {};
                    style: {};
                };
                data: {
                    refer_app: string;
                    _gap?: undefined;
                    attr?: undefined;
                    elem?: undefined;
                    list?: undefined;
                    inner?: undefined;
                    _gap_x?: undefined;
                    _gap_y?: undefined;
                    _other?: undefined;
                    _border?: undefined;
                    _layout?: undefined;
                    _margin?: undefined;
                    _radius?: undefined;
                    setting?: undefined;
                    version?: undefined;
                    _padding?: undefined;
                    _reverse?: undefined;
                    atrExpand?: undefined;
                    _max_width?: undefined;
                    elemExpand?: undefined;
                    _background?: undefined;
                    _style_refer?: undefined;
                    _hor_position?: undefined;
                    _background_setting?: undefined;
                    _ratio_layout_value?: undefined;
                    _style_refer_global?: undefined;
                    refer_form_data?: undefined;
                    _x_count?: undefined;
                    _y_count?: undefined;
                };
                list: never[];
                type: string;
                class: string;
                index: number;
                label: string;
                style: string;
                global: never[];
                toggle: boolean;
                stylist: never[];
                version: string;
                visible: boolean;
                dataType: string;
                style_from: string;
                classDataType: string;
                editor_bridge: {};
                preloadEvenet: {};
                container_fonts: number;
                mobile_editable: never[];
                desktop_editable: never[];
                refreshAllParameter: {};
                refreshComponentParameter: {};
                refer: string;
                def_editable?: undefined;
            };
            toggle: boolean;
            desktop: {
                id: string;
                js: string;
                css: {
                    class: {};
                    style: {};
                };
                data: {
                    refer_app: string;
                    refer_form_data?: undefined;
                };
                list: never[];
                type: string;
                class: string;
                index: number;
                label: string;
                style: string;
                global: never[];
                toggle: boolean;
                stylist: never[];
                version: string;
                visible: boolean;
                dataType: string;
                style_from: string;
                classDataType: string;
                editor_bridge: {};
                preloadEvenet: {};
                container_fonts: number;
                mobile_editable: never[];
                desktop_editable: never[];
                refreshAllParameter: {};
                refreshComponentParameter: {};
                refer: string;
            };
            stylist: never[];
            version: string;
            visible: boolean;
            dataType: string;
            style_from: string;
            classDataType: string;
            editor_bridge: {};
            preloadEvenet: {};
            container_fonts: number;
            mobile_editable: never[];
            desktop_editable: never[];
            refreshAllParameter: {};
            refreshComponentParameter: {};
            formData: {};
            def_editable?: undefined;
            storage?: undefined;
            bundle?: undefined;
            share?: undefined;
        };
    } | {
        title: string;
        config: {
            id: string;
            js: string;
            css: {
                class: {};
                style: {};
            };
            data: {
                tag: string;
                _gap: string;
                attr: never[];
                elem: string;
                list: never[];
                inner: string;
                _other: {
                    expand?: undefined;
                };
                _border: {};
                _margin: {};
                _radius: string;
                _padding: {
                    top?: undefined;
                    left?: undefined;
                    right?: undefined;
                    bottom?: undefined;
                };
                _reverse: string;
                carryData: {};
                refer_app: string;
                _max_width: string;
                _background: string;
                _style_refer: string;
                _hor_position: string;
                refer_form_data: {
                    hint: string;
                    ratio: string;
                    title: string;
                    back_img: {
                        type: string;
                        value: string;
                    };
                    sub_title: string;
                    search_tag: {
                        title: string;
                    }[];
                    "title-size": string;
                    cover_color: string;
                    theme_color: {
                        id: string;
                        title: string;
                        content: string;
                        "sec-title": string;
                        background: string;
                        "sec-background": string;
                        "solid-button-bg": string;
                        "border-button-bg": string;
                        "solid-button-text": string;
                        "border-button-text": string;
                    };
                    "sub-title-size": string;
                    bo?: undefined;
                    ggg?: undefined;
                    grid?: undefined;
                    size?: undefined;
                    color?: undefined;
                    gap_x?: undefined;
                    gap_y?: undefined;
                    width?: undefined;
                    border?: undefined;
                    height?: undefined;
                    images?: undefined;
                    margin?: undefined;
                    weight?: undefined;
                    grid_pc?: undefined;
                    justify?: undefined;
                    padding?: undefined;
                    size_pc?: undefined;
                    distance?: undefined;
                    margin_pc?: undefined;
                    grid_phone?: undefined;
                    padding_pc?: undefined;
                    size_phone?: undefined;
                    image_hover?: undefined;
                    border_color?: undefined;
                    margin_phone?: undefined;
                    padding_phone?: undefined;
                    r_1716801819158?: undefined;
                    ccc?: undefined;
                    circle?: undefined;
                    slide_pc?: undefined;
                    slide_phone?: undefined;
                    slide_tablet?: undefined;
                    image?: undefined;
                    scale?: undefined;
                    random?: undefined;
                    autoplay?: undefined;
                    title_size?: undefined;
                    phone_image?: undefined;
                    banner_height?: undefined;
                    banner_height2?: undefined;
                    r_1718088289110?: undefined;
                    phone_banner_height?: undefined;
                    theme?: undefined;
                    content?: undefined;
                    carry_info?: undefined;
                };
                _background_setting: {
                    type: string;
                    value?: undefined;
                };
                _style_refer_global: {
                    index: string;
                };
                _gap_x?: undefined;
                _gap_y?: undefined;
                _layout?: undefined;
                setting?: undefined;
                version?: undefined;
                _x_count?: undefined;
                _y_count?: undefined;
                atrExpand?: undefined;
                elemExpand?: undefined;
                _ver_position?: undefined;
                _ratio_layout_value?: undefined;
            };
            list: never[];
            type: string;
            class: string;
            index: number;
            label: string;
            style: string;
            global: never[];
            mobile: {
                id: string;
                js: string;
                css: {
                    class: {};
                    style: {};
                };
                data: {
                    refer_app: string;
                    refer_form_data: {
                        ratio: string;
                        search_tag: {
                            title: string;
                        }[];
                        "title-size": string;
                        "sub-title-size": string;
                        bo?: undefined;
                        grid_pc?: undefined;
                    };
                    _gap?: undefined;
                    attr?: undefined;
                    elem?: undefined;
                    list?: undefined;
                    inner?: undefined;
                    _gap_x?: undefined;
                    _gap_y?: undefined;
                    _other?: undefined;
                    _border?: undefined;
                    _layout?: undefined;
                    _margin?: undefined;
                    _radius?: undefined;
                    setting?: undefined;
                    version?: undefined;
                    _padding?: undefined;
                    _reverse?: undefined;
                    atrExpand?: undefined;
                    _max_width?: undefined;
                    elemExpand?: undefined;
                    _background?: undefined;
                    _style_refer?: undefined;
                    _hor_position?: undefined;
                    _background_setting?: undefined;
                    _ratio_layout_value?: undefined;
                    _style_refer_global?: undefined;
                    _x_count?: undefined;
                    _y_count?: undefined;
                };
                list: never[];
                type: string;
                class: string;
                index: number;
                label: string;
                style: string;
                global: never[];
                toggle: boolean;
                stylist: never[];
                version: string;
                visible: boolean;
                dataType: string;
                style_from: string;
                classDataType: string;
                editor_bridge: {};
                preloadEvenet: {};
                container_fonts: number;
                mobile_editable: string[];
                desktop_editable: never[];
                refreshAllParameter: {};
                refreshComponentParameter: {};
                refer: string;
                def_editable?: undefined;
            };
            toggle: boolean;
            desktop: {
                data: {
                    refer_app: string;
                    refer_form_data: {};
                };
                refer: string;
                id?: undefined;
                js?: undefined;
                css?: undefined;
                list?: undefined;
                type?: undefined;
                class?: undefined;
                index?: undefined;
                label?: undefined;
                style?: undefined;
                global?: undefined;
                toggle?: undefined;
                stylist?: undefined;
                version?: undefined;
                visible?: undefined;
                dataType?: undefined;
                style_from?: undefined;
                classDataType?: undefined;
                editor_bridge?: undefined;
                preloadEvenet?: undefined;
                container_fonts?: undefined;
                mobile_editable?: undefined;
                desktop_editable?: undefined;
                refreshAllParameter?: undefined;
                refreshComponentParameter?: undefined;
            };
            stylist: never[];
            version: string;
            visible: boolean;
            dataType: string;
            style_from: string;
            classDataType: string;
            editor_bridge: {};
            preloadEvenet: {};
            container_fonts: number;
            mobile_editable: string[];
            desktop_editable: never[];
            refreshAllParameter: {};
            refreshComponentParameter: {};
            formData: {};
            def_editable?: undefined;
            storage?: undefined;
            bundle?: undefined;
            share?: undefined;
        };
        image: string;
    } | {
        title: string;
        config: {
            id: string;
            js: string;
            css: {
                class: {};
                style: {};
            };
            data: {
                tag: string;
                _gap: string;
                attr: never[];
                elem: string;
                list: never[];
                inner: string;
                _other: {
                    expand?: undefined;
                };
                _border: {};
                _margin: {};
                _radius: string;
                _padding: {
                    top?: undefined;
                    left?: undefined;
                    right?: undefined;
                    bottom?: undefined;
                };
                _reverse: string;
                carryData: {};
                refer_app: string;
                _max_width: string;
                _background: string;
                _style_refer: string;
                _hor_position: string;
                refer_form_data: {
                    image: ({
                        img: string;
                        link: string;
                        index: number;
                        title: string;
                        c_v_id: string;
                        toggle: boolean;
                        button_text: string;
                        title_color: string;
                        r_1714460674658: string;
                    } | {
                        img: string;
                        index: number;
                        title: string;
                        c_v_id: string;
                        toggle: boolean;
                        button_text: string;
                        title_color: string;
                        r_1714460674658: string;
                        link?: undefined;
                    })[];
                    scale: string;
                    random: string;
                    autoplay: string;
                    title_size: string;
                    phone_image: {
                        img: string;
                        link: string;
                        index: number;
                        title: string;
                        c_v_id: string;
                        toggle: boolean;
                        button_text: string;
                    }[];
                    banner_height: {
                        type: string;
                        unit: string;
                        value: string;
                        number: string;
                    };
                    banner_height2: {
                        unit: string;
                        value: string;
                        number: string;
                    };
                    r_1718088289110: string;
                    phone_banner_height: {
                        unit: string;
                        value: string;
                        number: string;
                    };
                    bo?: undefined;
                    ggg?: undefined;
                    grid?: undefined;
                    size?: undefined;
                    color?: undefined;
                    gap_x?: undefined;
                    gap_y?: undefined;
                    title?: undefined;
                    width?: undefined;
                    border?: undefined;
                    height?: undefined;
                    images?: undefined;
                    margin?: undefined;
                    weight?: undefined;
                    grid_pc?: undefined;
                    justify?: undefined;
                    padding?: undefined;
                    size_pc?: undefined;
                    distance?: undefined;
                    margin_pc?: undefined;
                    grid_phone?: undefined;
                    padding_pc?: undefined;
                    size_phone?: undefined;
                    image_hover?: undefined;
                    border_color?: undefined;
                    margin_phone?: undefined;
                    padding_phone?: undefined;
                    r_1716801819158?: undefined;
                    ccc?: undefined;
                    circle?: undefined;
                    slide_pc?: undefined;
                    slide_phone?: undefined;
                    slide_tablet?: undefined;
                    hint?: undefined;
                    ratio?: undefined;
                    back_img?: undefined;
                    sub_title?: undefined;
                    search_tag?: undefined;
                    "title-size"?: undefined;
                    cover_color?: undefined;
                    theme_color?: undefined;
                    "sub-title-size"?: undefined;
                    theme?: undefined;
                    content?: undefined;
                    carry_info?: undefined;
                };
                _background_setting: {
                    type: string;
                    value?: undefined;
                };
                _style_refer_global: {
                    index: string;
                };
                _gap_x?: undefined;
                _gap_y?: undefined;
                _layout?: undefined;
                setting?: undefined;
                version?: undefined;
                _x_count?: undefined;
                _y_count?: undefined;
                atrExpand?: undefined;
                elemExpand?: undefined;
                _ver_position?: undefined;
                _ratio_layout_value?: undefined;
            };
            list: never[];
            type: string;
            class: string;
            index: number;
            label: string;
            style: string;
            global: never[];
            mobile: {
                id: string;
                js: string;
                css: {
                    class: {};
                    style: {};
                };
                data: {
                    refer_app: string;
                    _gap?: undefined;
                    attr?: undefined;
                    elem?: undefined;
                    list?: undefined;
                    inner?: undefined;
                    _gap_x?: undefined;
                    _gap_y?: undefined;
                    _other?: undefined;
                    _border?: undefined;
                    _layout?: undefined;
                    _margin?: undefined;
                    _radius?: undefined;
                    setting?: undefined;
                    version?: undefined;
                    _padding?: undefined;
                    _reverse?: undefined;
                    atrExpand?: undefined;
                    _max_width?: undefined;
                    elemExpand?: undefined;
                    _background?: undefined;
                    _style_refer?: undefined;
                    _hor_position?: undefined;
                    _background_setting?: undefined;
                    _ratio_layout_value?: undefined;
                    _style_refer_global?: undefined;
                    refer_form_data?: undefined;
                    _x_count?: undefined;
                    _y_count?: undefined;
                };
                list: never[];
                type: string;
                class: string;
                index: number;
                label: string;
                style: string;
                global: never[];
                toggle: boolean;
                stylist: never[];
                version: string;
                visible: boolean;
                dataType: string;
                style_from: string;
                classDataType: string;
                editor_bridge: {};
                preloadEvenet: {};
                container_fonts: number;
                mobile_editable: never[];
                desktop_editable: never[];
                refreshAllParameter: {};
                refreshComponentParameter: {};
                refer: string;
                def_editable?: undefined;
            };
            toggle: boolean;
            desktop: {
                id: string;
                js: string;
                css: {
                    class: {};
                    style: {};
                };
                data: {
                    refer_app: string;
                    refer_form_data: {};
                };
                list: never[];
                type: string;
                class: string;
                index: number;
                label: string;
                style: string;
                global: never[];
                toggle: boolean;
                stylist: never[];
                version: string;
                visible: boolean;
                dataType: string;
                style_from: string;
                classDataType: string;
                editor_bridge: {};
                preloadEvenet: {};
                container_fonts: number;
                mobile_editable: never[];
                desktop_editable: never[];
                refreshAllParameter: {};
                refreshComponentParameter: {};
                refer: string;
            };
            stylist: never[];
            version: string;
            visible: boolean;
            dataType: string;
            style_from: string;
            classDataType: string;
            editor_bridge: {};
            preloadEvenet: {};
            container_fonts: number;
            mobile_editable: never[];
            desktop_editable: never[];
            refreshAllParameter: {};
            refreshComponentParameter: {};
            formData: {};
            def_editable?: undefined;
            storage?: undefined;
            bundle?: undefined;
            share?: undefined;
        };
        image: string;
    } | {
        title: string;
        config: {
            id: string;
            js: string;
            css: {
                class: {};
                style: {};
            };
            data: {
                _gap: string;
                attr: never[];
                elem: string;
                list: never[];
                inner: string;
                _gap_x: string;
                _gap_y: string;
                _other: {
                    expand?: undefined;
                };
                _border: {};
                _layout: string;
                _margin: {};
                _radius: string;
                setting: ({
                    id: string;
                    js: string;
                    css: {
                        class: {};
                        style: {};
                    };
                    data: {
                        tag: string;
                        _gap: string;
                        attr: never[];
                        elem: string;
                        list: never[];
                        inner: string;
                        _other: {};
                        _border: {};
                        _margin: {};
                        _radius: string;
                        _padding: {
                            top?: undefined;
                            left?: undefined;
                            right?: undefined;
                            bottom?: undefined;
                        };
                        _reverse: string;
                        carryData: {};
                        refer_app: string;
                        _max_width: string;
                        _background: string;
                        _style_refer: string;
                        _hor_position: string;
                        refer_form_data: {
                            link: string;
                            mask: {
                                color: string;
                                toggle: boolean;
                                opacity: string;
                            };
                            cover: {
                                type: string;
                                value: string;
                            };
                            scale: string;
                            distance: {
                                toggle: boolean;
                                margin_pc: {};
                                padding_pc: {};
                                margin_phone: {};
                                padding_phone: {};
                            };
                            auto_play: string;
                            textblock: {
                                width: {
                                    type: string;
                                    unit: string;
                                    value: string;
                                    number: string;
                                };
                                height: {
                                    type: string;
                                    unit: string;
                                    value: string;
                                    number: string;
                                };
                                toggle: boolean;
                            };
                            preview_image: {
                                type: string;
                                value: string;
                            };
                        };
                        _background_setting: {
                            type: string;
                            value?: undefined;
                        };
                        _style_refer_global: {
                            index: string;
                        };
                        _gap_x?: undefined;
                        _gap_y?: undefined;
                        _layout?: undefined;
                        setting?: undefined;
                        version?: undefined;
                        _x_count?: undefined;
                        _y_count?: undefined;
                        atrExpand?: undefined;
                        elemExpand?: undefined;
                        _ver_position?: undefined;
                    };
                    list: never[];
                    type: string;
                    class: string;
                    index: number;
                    label: string;
                    style: string;
                    global: never[];
                    mobile: {
                        id: string;
                        js: string;
                        css: {
                            class: {};
                            style: {};
                        };
                        data: {
                            refer_app: string;
                        };
                        list: never[];
                        type: string;
                        class: string;
                        index: number;
                        label: string;
                        style: string;
                        global: never[];
                        toggle: boolean;
                        stylist: never[];
                        version: string;
                        visible: string;
                        dataType: string;
                        style_from: string;
                        classDataType: string;
                        editor_bridge: {};
                        preloadEvenet: {};
                        container_fonts: number;
                        mobile_editable: never[];
                        desktop_editable: never[];
                        refreshAllParameter: {};
                        refreshComponentParameter: {};
                        refer: string;
                    };
                    toggle: boolean;
                    desktop: {
                        id: string;
                        js: string;
                        css: {
                            class: {};
                            style: {};
                        };
                        data: {
                            refer_app: string;
                        };
                        list: never[];
                        type: string;
                        class: string;
                        index: number;
                        label: string;
                        style: string;
                        global: never[];
                        toggle: boolean;
                        stylist: never[];
                        version: string;
                        visible: string;
                        dataType: string;
                        style_from: string;
                        classDataType: string;
                        editor_bridge: {};
                        preloadEvenet: {};
                        container_fonts: number;
                        mobile_editable: never[];
                        desktop_editable: never[];
                        refreshAllParameter: {};
                        refreshComponentParameter: {};
                        refer: string;
                    };
                    stylist: never[];
                    version: string;
                    visible: string;
                    dataType: string;
                    style_from: string;
                    classDataType: string;
                    editor_bridge: {};
                    preloadEvenet: {};
                    container_fonts: number;
                    mobile_editable: never[];
                    desktop_editable: never[];
                    refreshAllParameter: {};
                    refreshComponentParameter: {};
                    formData: {};
                    def_editable?: undefined;
                } | {
                    id: string;
                    js: string;
                    css: {
                        class: {};
                        style: {};
                    };
                    data: {
                        _gap: string;
                        attr: never[];
                        elem: string;
                        list: never[];
                        inner: string;
                        _gap_x: string;
                        _gap_y: string;
                        _other: {};
                        _border: {};
                        _layout: string;
                        _margin: {};
                        _radius: string;
                        setting: ({
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                tag: string;
                                _gap: string;
                                attr: never[];
                                elem: string;
                                list: never[];
                                inner: string;
                                _other: {};
                                _border: {};
                                _margin: {};
                                _radius: string;
                                _padding: {
                                    top?: undefined;
                                    left?: undefined;
                                    right?: undefined;
                                    bottom?: undefined;
                                };
                                _reverse: string;
                                carryData: {};
                                refer_app: string;
                                _max_width: string;
                                _background: string;
                                _style_refer: string;
                                _hor_position: string;
                                refer_form_data: {
                                    kkw: string;
                                    size: string;
                                    color: {
                                        id: string;
                                        title: string;
                                        content: string;
                                        "sec-title": string;
                                        background: string;
                                        "sec-background": string;
                                        "solid-button-bg": string;
                                        "border-button-bg": string;
                                        "solid-button-text": string;
                                        "border-button-text": string;
                                    };
                                    title: string;
                                    margin: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    weight: string;
                                    import_: string;
                                    justify: string;
                                    padding: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    size_pc: string;
                                    distance: {
                                        toggle: boolean;
                                        margin_pc: {
                                            toggle: boolean;
                                        };
                                        padding_pc: {
                                            toggle: boolean;
                                        };
                                        margin_phone: {
                                            toggle: boolean;
                                            top?: undefined;
                                            bottom?: undefined;
                                        };
                                        padding_phone: {
                                            toggle: boolean;
                                        };
                                        margin?: undefined;
                                        padding?: undefined;
                                    };
                                    margin_pc: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    padding_pc: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    size_phone: string;
                                    theme_color: {
                                        id: string;
                                        title: string;
                                        content: string;
                                        background: string;
                                        "solid-button-bg": string;
                                        "border-button-bg": string;
                                        "solid-button-text": string;
                                        "border-button-text": string;
                                    };
                                    margin_phone: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    padding_phone: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    r_1716801819158: {};
                                    r_1718616868830: {
                                        type: string;
                                        value: string;
                                    };
                                    r_1718616877262: {
                                        type: string;
                                        value: string;
                                    };
                                    r_1718616885960: {
                                        type: string;
                                        value: string;
                                    };
                                    link?: undefined;
                                    theme?: undefined;
                                    width?: undefined;
                                    height?: undefined;
                                    radius?: undefined;
                                    "font-size"?: undefined;
                                };
                                _background_setting: {
                                    type: string;
                                };
                                _style_refer_global: {
                                    index: string;
                                };
                            };
                            list: never[];
                            type: string;
                            class: string;
                            index: number;
                            label: string;
                            style: string;
                            global: never[];
                            mobile: {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    refer_app: string;
                                    refer_form_data?: undefined;
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                toggle: boolean;
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                refer: string;
                            };
                            toggle: boolean;
                            desktop: {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    refer_app: string;
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                toggle: boolean;
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                refer: string;
                            };
                            stylist: never[];
                            version: string;
                            visible: boolean;
                            dataType: string;
                            style_from: string;
                            classDataType: string;
                            editor_bridge: {};
                            preloadEvenet: {};
                            container_fonts: number;
                            mobile_editable: never[];
                            desktop_editable: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                            formData: {};
                        } | {
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                tag: string;
                                _gap: string;
                                attr: never[];
                                elem: string;
                                list: never[];
                                inner: string;
                                _other: {};
                                _border: {};
                                _margin: {};
                                _radius: string;
                                _padding: {
                                    top?: undefined;
                                    left?: undefined;
                                    right?: undefined;
                                    bottom?: undefined;
                                };
                                _reverse: string;
                                carryData: {};
                                refer_app: string;
                                _max_width: string;
                                _background: string;
                                _style_refer: string;
                                _hor_position: string;
                                refer_form_data: {
                                    kkw: string;
                                    size: string;
                                    color: {
                                        id: string;
                                        title: string;
                                        content: string;
                                        "sec-title": string;
                                        background: string;
                                        "sec-background": string;
                                        "solid-button-bg": string;
                                        "border-button-bg": string;
                                        "solid-button-text": string;
                                        "border-button-text": string;
                                    };
                                    title: string;
                                    margin: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    weight: string;
                                    justify: string;
                                    padding: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    size_pc: string;
                                    distance: {
                                        toggle: boolean;
                                        margin_pc: {
                                            toggle: boolean;
                                        };
                                        padding_pc: {
                                            toggle: boolean;
                                        };
                                        margin_phone: {
                                            top: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        padding_phone: {
                                            toggle?: undefined;
                                        };
                                        margin?: undefined;
                                        padding?: undefined;
                                    };
                                    margin_pc: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    padding_pc: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    size_phone: string;
                                    theme_color: {
                                        id: string;
                                        title: string;
                                        content: string;
                                        background: string;
                                        "solid-button-bg": string;
                                        "border-button-bg": string;
                                        "solid-button-text": string;
                                        "border-button-text": string;
                                    };
                                    margin_phone: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    padding_phone: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    r_1716801819158: {};
                                    r_1718616868830: {
                                        type: string;
                                        value: string;
                                    };
                                    r_1718616877262: {
                                        type: string;
                                        value: string;
                                    };
                                    r_1718616885960: {
                                        type: string;
                                        value: string;
                                    };
                                    import_?: undefined;
                                    link?: undefined;
                                    theme?: undefined;
                                    width?: undefined;
                                    height?: undefined;
                                    radius?: undefined;
                                    "font-size"?: undefined;
                                };
                                _background_setting: {
                                    type: string;
                                };
                                _style_refer_global: {
                                    index: string;
                                };
                            };
                            list: never[];
                            type: string;
                            class: string;
                            index: number;
                            label: string;
                            style: string;
                            global: never[];
                            mobile: {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    refer_app: string;
                                    refer_form_data: {};
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                toggle: boolean;
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                refer: string;
                            };
                            toggle: boolean;
                            desktop: {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    refer_app: string;
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                toggle: boolean;
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                refer: string;
                            };
                            stylist: never[];
                            version: string;
                            visible: boolean;
                            dataType: string;
                            style_from: string;
                            classDataType: string;
                            editor_bridge: {};
                            preloadEvenet: {};
                            container_fonts: number;
                            mobile_editable: never[];
                            desktop_editable: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                            formData: {};
                        } | {
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                tag: string;
                                _gap: string;
                                attr: never[];
                                elem: string;
                                list: never[];
                                inner: string;
                                _other: {};
                                _border: {};
                                _margin: {};
                                _radius: string;
                                _padding: {
                                    top?: undefined;
                                    left?: undefined;
                                    right?: undefined;
                                    bottom?: undefined;
                                };
                                _reverse: string;
                                carryData: {};
                                refer_app: string;
                                _max_width: string;
                                _background: string;
                                _style_refer: string;
                                _hor_position: string;
                                refer_form_data: {
                                    kkw: string;
                                    size: string;
                                    color: {
                                        id: string;
                                        title: string;
                                        content: string;
                                        "sec-title": string;
                                        background: string;
                                        "sec-background": string;
                                        "solid-button-bg": string;
                                        "border-button-bg": string;
                                        "solid-button-text": string;
                                        "border-button-text": string;
                                    };
                                    title: string;
                                    margin: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    weight: string;
                                    justify: string;
                                    padding: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    size_pc: string;
                                    distance: {
                                        toggle: boolean;
                                        margin_pc: {
                                            toggle: boolean;
                                        };
                                        padding_pc: {
                                            toggle: boolean;
                                        };
                                        margin_phone: {
                                            top: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        padding_phone: {
                                            toggle?: undefined;
                                        };
                                        margin?: undefined;
                                        padding?: undefined;
                                    };
                                    margin_pc: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    padding_pc: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    size_phone: string;
                                    theme_color: {
                                        id: string;
                                        title: string;
                                        content: string;
                                        background: string;
                                        "solid-button-bg": string;
                                        "border-button-bg": string;
                                        "solid-button-text": string;
                                        "border-button-text": string;
                                    };
                                    margin_phone: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    padding_phone: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    r_1716801819158: {};
                                    r_1718616868830: {
                                        type: string;
                                        value: string;
                                    };
                                    r_1718616877262: {
                                        type: string;
                                        value: string;
                                    };
                                    r_1718616885960: {
                                        type: string;
                                        value: string;
                                    };
                                    import_?: undefined;
                                    link?: undefined;
                                    theme?: undefined;
                                    width?: undefined;
                                    height?: undefined;
                                    radius?: undefined;
                                    "font-size"?: undefined;
                                };
                                _background_setting: {
                                    type: string;
                                };
                                _style_refer_global: {
                                    index: string;
                                };
                            };
                            list: never[];
                            type: string;
                            class: string;
                            index: number;
                            label: string;
                            style: string;
                            global: never[];
                            mobile: {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    refer_app: string;
                                    refer_form_data?: undefined;
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                toggle: boolean;
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                refer: string;
                            };
                            toggle: boolean;
                            desktop: {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    refer_app: string;
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                toggle: boolean;
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                refer: string;
                            };
                            stylist: never[];
                            version: string;
                            visible: boolean;
                            dataType: string;
                            style_from: string;
                            classDataType: string;
                            editor_bridge: {};
                            preloadEvenet: {};
                            container_fonts: number;
                            mobile_editable: never[];
                            desktop_editable: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                            formData: {};
                        } | {
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                tag: string;
                                _gap: string;
                                attr: never[];
                                elem: string;
                                list: never[];
                                inner: string;
                                _other: {};
                                _border: {};
                                _margin: {};
                                _radius: string;
                                _padding: {
                                    top: string;
                                    left: string;
                                    right: string;
                                    bottom: string;
                                };
                                _reverse: string;
                                carryData: {};
                                refer_app: string;
                                _max_width: string;
                                _background: string;
                                _style_refer: string;
                                _hor_position: string;
                                refer_form_data: {
                                    link: string;
                                    theme: {
                                        id: string;
                                        title: string;
                                        content: string;
                                        "sec-title": string;
                                        background: string;
                                        "sec-background": string;
                                        "solid-button-bg": string;
                                        "border-button-bg": string;
                                        "solid-button-text": string;
                                        "border-button-text": string;
                                    };
                                    title: string;
                                    width: {
                                        unit: string;
                                        value: string;
                                        number: string;
                                    };
                                    height: {
                                        unit: string;
                                        value: string;
                                        number: string;
                                    };
                                    radius: string;
                                    distance: {
                                        margin: {
                                            top: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        toggle: boolean;
                                        padding: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        margin_pc: {
                                            toggle: boolean;
                                        };
                                        padding_pc: {
                                            toggle: boolean;
                                        };
                                        margin_phone?: undefined;
                                        padding_phone?: undefined;
                                    };
                                    "font-size": string;
                                    kkw?: undefined;
                                    size?: undefined;
                                    color?: undefined;
                                    margin?: undefined;
                                    weight?: undefined;
                                    import_?: undefined;
                                    justify?: undefined;
                                    padding?: undefined;
                                    size_pc?: undefined;
                                    margin_pc?: undefined;
                                    padding_pc?: undefined;
                                    size_phone?: undefined;
                                    theme_color?: undefined;
                                    margin_phone?: undefined;
                                    padding_phone?: undefined;
                                    r_1716801819158?: undefined;
                                    r_1718616868830?: undefined;
                                    r_1718616877262?: undefined;
                                    r_1718616885960?: undefined;
                                };
                                _background_setting: {
                                    type: string;
                                };
                                _style_refer_global: {
                                    index: string;
                                };
                            };
                            list: never[];
                            type: string;
                            class: string;
                            index: number;
                            label: string;
                            style: string;
                            global: never[];
                            mobile: {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    refer_app: string;
                                    refer_form_data?: undefined;
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                toggle: boolean;
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                refer: string;
                            };
                            toggle: boolean;
                            desktop: {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    refer_app: string;
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                toggle: boolean;
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                refer: string;
                            };
                            stylist: never[];
                            version: string;
                            visible: boolean;
                            dataType: string;
                            style_from: string;
                            classDataType: string;
                            editor_bridge: {};
                            preloadEvenet: {};
                            container_fonts: number;
                            mobile_editable: never[];
                            desktop_editable: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                            formData: {};
                        })[];
                        version: string;
                        _padding: {
                            top: string;
                            left: string;
                            right: string;
                            bottom: string;
                        };
                        _reverse: string;
                        _x_count: string;
                        _y_count: string;
                        atrExpand: {};
                        _max_width: string;
                        elemExpand: {};
                        _background: string;
                        _style_refer: string;
                        _hor_position: string;
                        _ver_position: string;
                        _background_setting: {
                            type: string;
                            value: string;
                        };
                        _style_refer_global: {
                            index: string;
                        };
                        tag?: undefined;
                        carryData?: undefined;
                        refer_app?: undefined;
                        refer_form_data?: undefined;
                    };
                    type: string;
                    index: number;
                    label: string;
                    global: never[];
                    mobile: {
                        refer: string;
                        id?: undefined;
                        js?: undefined;
                        css?: undefined;
                        data?: undefined;
                        list?: undefined;
                        type?: undefined;
                        class?: undefined;
                        index?: undefined;
                        label?: undefined;
                        style?: undefined;
                        global?: undefined;
                        toggle?: undefined;
                        stylist?: undefined;
                        version?: undefined;
                        visible?: undefined;
                        dataType?: undefined;
                        style_from?: undefined;
                        classDataType?: undefined;
                        editor_bridge?: undefined;
                        preloadEvenet?: undefined;
                        container_fonts?: undefined;
                        mobile_editable?: undefined;
                        desktop_editable?: undefined;
                        refreshAllParameter?: undefined;
                        refreshComponentParameter?: undefined;
                    };
                    toggle: boolean;
                    desktop: {
                        refer: string;
                        id?: undefined;
                        js?: undefined;
                        css?: undefined;
                        data?: undefined;
                        list?: undefined;
                        type?: undefined;
                        class?: undefined;
                        index?: undefined;
                        label?: undefined;
                        style?: undefined;
                        global?: undefined;
                        toggle?: undefined;
                        stylist?: undefined;
                        version?: undefined;
                        visible?: undefined;
                        dataType?: undefined;
                        style_from?: undefined;
                        classDataType?: undefined;
                        editor_bridge?: undefined;
                        preloadEvenet?: undefined;
                        container_fonts?: undefined;
                        mobile_editable?: undefined;
                        desktop_editable?: undefined;
                        refreshAllParameter?: undefined;
                        refreshComponentParameter?: undefined;
                    };
                    visible: boolean;
                    def_editable: never[];
                    editor_bridge: {};
                    preloadEvenet: {};
                    refreshAllParameter: {};
                    refreshComponentParameter: {};
                    formData: {};
                    list?: undefined;
                    class?: undefined;
                    style?: undefined;
                    stylist?: undefined;
                    version?: undefined;
                    dataType?: undefined;
                    style_from?: undefined;
                    classDataType?: undefined;
                    container_fonts?: undefined;
                    mobile_editable?: undefined;
                    desktop_editable?: undefined;
                })[];
                version: string;
                _padding: {
                    top: string;
                    left: string;
                    right: string;
                    bottom: string;
                };
                _reverse: string;
                atrExpand: {};
                _max_width: string;
                elemExpand: {};
                _background: string;
                _style_refer: string;
                _hor_position: string;
                _background_setting: {
                    type: string;
                    value?: undefined;
                };
                _ratio_layout_value: string;
                _style_refer_global: {
                    index: string;
                };
                _x_count?: undefined;
                _y_count?: undefined;
                _ver_position?: undefined;
                tag?: undefined;
                carryData?: undefined;
                refer_app?: undefined;
                refer_form_data?: undefined;
            };
            type: string;
            index: number;
            label: string;
            global: never[];
            mobile: {
                id: string;
                js: string;
                css: {
                    class: {};
                    style: {};
                };
                data: {
                    _gap: string;
                    attr: never[];
                    elem: string;
                    list: never[];
                    inner: string;
                    _gap_x: string;
                    _gap_y: string;
                    _other: {
                        expand?: undefined;
                    };
                    _border: {};
                    _layout: string;
                    _margin: {};
                    _radius: string;
                    setting: ({
                        id: string;
                        js: string;
                        css: {
                            class: {};
                            style: {};
                        };
                        data: {
                            tag: string;
                            _gap: string;
                            attr: never[];
                            elem: string;
                            list: never[];
                            inner: string;
                            _other: {};
                            _border: {};
                            _margin: {};
                            _radius: string;
                            _padding: {
                                top?: undefined;
                                left?: undefined;
                                right?: undefined;
                                bottom?: undefined;
                            };
                            _reverse: string;
                            carryData: {};
                            refer_app: string;
                            _max_width: string;
                            _background: string;
                            _style_refer: string;
                            _hor_position: string;
                            refer_form_data: {
                                link: string;
                                mask: {
                                    color: string;
                                    toggle: boolean;
                                    opacity: string;
                                };
                                cover: {
                                    type: string;
                                    value: string;
                                };
                                scale: string;
                                distance: {
                                    toggle: boolean;
                                    margin_pc: {};
                                    padding_pc: {};
                                    margin_phone: {};
                                    padding_phone: {};
                                };
                                auto_play: string;
                                textblock: {
                                    width: {
                                        type: string;
                                        unit: string;
                                        value: string;
                                        number: string;
                                    };
                                    height: {
                                        type: string;
                                        unit: string;
                                        value: string;
                                        number: string;
                                    };
                                    toggle: boolean;
                                };
                                preview_image: {
                                    type: string;
                                    value: string;
                                };
                            };
                            _background_setting: {
                                type: string;
                                value?: undefined;
                            };
                            _style_refer_global: {
                                index: string;
                            };
                            _gap_x?: undefined;
                            _gap_y?: undefined;
                            _layout?: undefined;
                            setting?: undefined;
                            version?: undefined;
                            _x_count?: undefined;
                            _y_count?: undefined;
                            atrExpand?: undefined;
                            elemExpand?: undefined;
                            _ver_position?: undefined;
                        };
                        list: never[];
                        type: string;
                        class: string;
                        index: number;
                        label: string;
                        style: string;
                        global: never[];
                        mobile: {
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                refer_app: string;
                            };
                            list: never[];
                            type: string;
                            class: string;
                            index: number;
                            label: string;
                            style: string;
                            global: never[];
                            toggle: boolean;
                            stylist: never[];
                            version: string;
                            visible: string;
                            dataType: string;
                            style_from: string;
                            classDataType: string;
                            editor_bridge: {};
                            preloadEvenet: {};
                            container_fonts: number;
                            mobile_editable: never[];
                            desktop_editable: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                            refer: string;
                        };
                        toggle: boolean;
                        desktop: {
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                refer_app: string;
                            };
                            list: never[];
                            type: string;
                            class: string;
                            index: number;
                            label: string;
                            style: string;
                            global: never[];
                            toggle: boolean;
                            stylist: never[];
                            version: string;
                            visible: string;
                            dataType: string;
                            style_from: string;
                            classDataType: string;
                            editor_bridge: {};
                            preloadEvenet: {};
                            container_fonts: number;
                            mobile_editable: never[];
                            desktop_editable: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                            refer: string;
                        };
                        stylist: never[];
                        version: string;
                        visible: string;
                        dataType: string;
                        style_from: string;
                        classDataType: string;
                        editor_bridge: {};
                        preloadEvenet: {};
                        container_fonts: number;
                        mobile_editable: never[];
                        desktop_editable: never[];
                        refreshAllParameter: {};
                        refreshComponentParameter: {};
                        formData: {};
                        def_editable?: undefined;
                    } | {
                        id: string;
                        js: string;
                        css: {
                            class: {};
                            style: {};
                        };
                        data: {
                            _gap: string;
                            attr: never[];
                            elem: string;
                            list: never[];
                            inner: string;
                            _gap_x: string;
                            _gap_y: string;
                            _other: {};
                            _border: {};
                            _layout: string;
                            _margin: {};
                            _radius: string;
                            setting: ({
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    tag: string;
                                    _gap: string;
                                    attr: never[];
                                    elem: string;
                                    list: never[];
                                    inner: string;
                                    _other: {};
                                    _border: {};
                                    _margin: {};
                                    _radius: string;
                                    _padding: {
                                        top?: undefined;
                                        left?: undefined;
                                        right?: undefined;
                                        bottom?: undefined;
                                    };
                                    _reverse: string;
                                    carryData: {};
                                    refer_app: string;
                                    _max_width: string;
                                    _background: string;
                                    _style_refer: string;
                                    _hor_position: string;
                                    refer_form_data: {
                                        kkw: string;
                                        size: string;
                                        color: {
                                            id: string;
                                            title: string;
                                            content: string;
                                            "sec-title": string;
                                            background: string;
                                            "sec-background": string;
                                            "solid-button-bg": string;
                                            "border-button-bg": string;
                                            "solid-button-text": string;
                                            "border-button-text": string;
                                        };
                                        title: string;
                                        margin: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        weight: string;
                                        import_: string;
                                        justify: string;
                                        padding: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        size_pc: string;
                                        distance: {
                                            toggle: boolean;
                                            margin_pc: {
                                                toggle: boolean;
                                            };
                                            padding_pc: {
                                                toggle: boolean;
                                            };
                                            margin_phone: {
                                                toggle: boolean;
                                                top?: undefined;
                                                bottom?: undefined;
                                            };
                                            padding_phone: {
                                                toggle: boolean;
                                            };
                                            margin?: undefined;
                                            padding?: undefined;
                                        };
                                        margin_pc: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        padding_pc: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        size_phone: string;
                                        theme_color: {
                                            id: string;
                                            title: string;
                                            content: string;
                                            background: string;
                                            "solid-button-bg": string;
                                            "border-button-bg": string;
                                            "solid-button-text": string;
                                            "border-button-text": string;
                                        };
                                        margin_phone: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        padding_phone: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        r_1716801819158: {};
                                        r_1718616868830: {
                                            type: string;
                                            value: string;
                                        };
                                        r_1718616877262: {
                                            type: string;
                                            value: string;
                                        };
                                        r_1718616885960: {
                                            type: string;
                                            value: string;
                                        };
                                        link?: undefined;
                                        theme?: undefined;
                                        width?: undefined;
                                        height?: undefined;
                                        radius?: undefined;
                                        "font-size"?: undefined;
                                    };
                                    _background_setting: {
                                        type: string;
                                    };
                                    _style_refer_global: {
                                        index: string;
                                    };
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                mobile: {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        refer_app: string;
                                        refer_form_data?: undefined;
                                    };
                                    list: never[];
                                    type: string;
                                    class: string;
                                    index: number;
                                    label: string;
                                    style: string;
                                    global: never[];
                                    toggle: boolean;
                                    stylist: never[];
                                    version: string;
                                    visible: boolean;
                                    dataType: string;
                                    style_from: string;
                                    classDataType: string;
                                    editor_bridge: {};
                                    preloadEvenet: {};
                                    container_fonts: number;
                                    mobile_editable: never[];
                                    desktop_editable: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                    refer: string;
                                };
                                toggle: boolean;
                                desktop: {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        refer_app: string;
                                    };
                                    list: never[];
                                    type: string;
                                    class: string;
                                    index: number;
                                    label: string;
                                    style: string;
                                    global: never[];
                                    toggle: boolean;
                                    stylist: never[];
                                    version: string;
                                    visible: boolean;
                                    dataType: string;
                                    style_from: string;
                                    classDataType: string;
                                    editor_bridge: {};
                                    preloadEvenet: {};
                                    container_fonts: number;
                                    mobile_editable: never[];
                                    desktop_editable: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                    refer: string;
                                };
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                formData: {};
                            } | {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    tag: string;
                                    _gap: string;
                                    attr: never[];
                                    elem: string;
                                    list: never[];
                                    inner: string;
                                    _other: {};
                                    _border: {};
                                    _margin: {};
                                    _radius: string;
                                    _padding: {
                                        top?: undefined;
                                        left?: undefined;
                                        right?: undefined;
                                        bottom?: undefined;
                                    };
                                    _reverse: string;
                                    carryData: {};
                                    refer_app: string;
                                    _max_width: string;
                                    _background: string;
                                    _style_refer: string;
                                    _hor_position: string;
                                    refer_form_data: {
                                        kkw: string;
                                        size: string;
                                        color: {
                                            id: string;
                                            title: string;
                                            content: string;
                                            "sec-title": string;
                                            background: string;
                                            "sec-background": string;
                                            "solid-button-bg": string;
                                            "border-button-bg": string;
                                            "solid-button-text": string;
                                            "border-button-text": string;
                                        };
                                        title: string;
                                        margin: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        weight: string;
                                        justify: string;
                                        padding: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        size_pc: string;
                                        distance: {
                                            toggle: boolean;
                                            margin_pc: {
                                                toggle: boolean;
                                            };
                                            padding_pc: {
                                                toggle: boolean;
                                            };
                                            margin_phone: {
                                                top: string;
                                                bottom: string;
                                                toggle: boolean;
                                            };
                                            padding_phone: {
                                                toggle?: undefined;
                                            };
                                            margin?: undefined;
                                            padding?: undefined;
                                        };
                                        margin_pc: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        padding_pc: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        size_phone: string;
                                        theme_color: {
                                            id: string;
                                            title: string;
                                            content: string;
                                            background: string;
                                            "solid-button-bg": string;
                                            "border-button-bg": string;
                                            "solid-button-text": string;
                                            "border-button-text": string;
                                        };
                                        margin_phone: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        padding_phone: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        r_1716801819158: {};
                                        r_1718616868830: {
                                            type: string;
                                            value: string;
                                        };
                                        r_1718616877262: {
                                            type: string;
                                            value: string;
                                        };
                                        r_1718616885960: {
                                            type: string;
                                            value: string;
                                        };
                                        import_?: undefined;
                                        link?: undefined;
                                        theme?: undefined;
                                        width?: undefined;
                                        height?: undefined;
                                        radius?: undefined;
                                        "font-size"?: undefined;
                                    };
                                    _background_setting: {
                                        type: string;
                                    };
                                    _style_refer_global: {
                                        index: string;
                                    };
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                mobile: {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        refer_app: string;
                                        refer_form_data: {};
                                    };
                                    list: never[];
                                    type: string;
                                    class: string;
                                    index: number;
                                    label: string;
                                    style: string;
                                    global: never[];
                                    toggle: boolean;
                                    stylist: never[];
                                    version: string;
                                    visible: boolean;
                                    dataType: string;
                                    style_from: string;
                                    classDataType: string;
                                    editor_bridge: {};
                                    preloadEvenet: {};
                                    container_fonts: number;
                                    mobile_editable: never[];
                                    desktop_editable: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                    refer: string;
                                };
                                toggle: boolean;
                                desktop: {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        refer_app: string;
                                    };
                                    list: never[];
                                    type: string;
                                    class: string;
                                    index: number;
                                    label: string;
                                    style: string;
                                    global: never[];
                                    toggle: boolean;
                                    stylist: never[];
                                    version: string;
                                    visible: boolean;
                                    dataType: string;
                                    style_from: string;
                                    classDataType: string;
                                    editor_bridge: {};
                                    preloadEvenet: {};
                                    container_fonts: number;
                                    mobile_editable: never[];
                                    desktop_editable: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                    refer: string;
                                };
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                formData: {};
                            } | {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    tag: string;
                                    _gap: string;
                                    attr: never[];
                                    elem: string;
                                    list: never[];
                                    inner: string;
                                    _other: {};
                                    _border: {};
                                    _margin: {};
                                    _radius: string;
                                    _padding: {
                                        top?: undefined;
                                        left?: undefined;
                                        right?: undefined;
                                        bottom?: undefined;
                                    };
                                    _reverse: string;
                                    carryData: {};
                                    refer_app: string;
                                    _max_width: string;
                                    _background: string;
                                    _style_refer: string;
                                    _hor_position: string;
                                    refer_form_data: {
                                        kkw: string;
                                        size: string;
                                        color: {
                                            id: string;
                                            title: string;
                                            content: string;
                                            "sec-title": string;
                                            background: string;
                                            "sec-background": string;
                                            "solid-button-bg": string;
                                            "border-button-bg": string;
                                            "solid-button-text": string;
                                            "border-button-text": string;
                                        };
                                        title: string;
                                        margin: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        weight: string;
                                        justify: string;
                                        padding: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        size_pc: string;
                                        distance: {
                                            toggle: boolean;
                                            margin_pc: {
                                                toggle: boolean;
                                            };
                                            padding_pc: {
                                                toggle: boolean;
                                            };
                                            margin_phone: {
                                                top: string;
                                                bottom: string;
                                                toggle: boolean;
                                            };
                                            padding_phone: {
                                                toggle?: undefined;
                                            };
                                            margin?: undefined;
                                            padding?: undefined;
                                        };
                                        margin_pc: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        padding_pc: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        size_phone: string;
                                        theme_color: {
                                            id: string;
                                            title: string;
                                            content: string;
                                            background: string;
                                            "solid-button-bg": string;
                                            "border-button-bg": string;
                                            "solid-button-text": string;
                                            "border-button-text": string;
                                        };
                                        margin_phone: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        padding_phone: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        r_1716801819158: {};
                                        r_1718616868830: {
                                            type: string;
                                            value: string;
                                        };
                                        r_1718616877262: {
                                            type: string;
                                            value: string;
                                        };
                                        r_1718616885960: {
                                            type: string;
                                            value: string;
                                        };
                                        import_?: undefined;
                                        link?: undefined;
                                        theme?: undefined;
                                        width?: undefined;
                                        height?: undefined;
                                        radius?: undefined;
                                        "font-size"?: undefined;
                                    };
                                    _background_setting: {
                                        type: string;
                                    };
                                    _style_refer_global: {
                                        index: string;
                                    };
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                mobile: {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        refer_app: string;
                                        refer_form_data?: undefined;
                                    };
                                    list: never[];
                                    type: string;
                                    class: string;
                                    index: number;
                                    label: string;
                                    style: string;
                                    global: never[];
                                    toggle: boolean;
                                    stylist: never[];
                                    version: string;
                                    visible: boolean;
                                    dataType: string;
                                    style_from: string;
                                    classDataType: string;
                                    editor_bridge: {};
                                    preloadEvenet: {};
                                    container_fonts: number;
                                    mobile_editable: never[];
                                    desktop_editable: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                    refer: string;
                                };
                                toggle: boolean;
                                desktop: {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        refer_app: string;
                                    };
                                    list: never[];
                                    type: string;
                                    class: string;
                                    index: number;
                                    label: string;
                                    style: string;
                                    global: never[];
                                    toggle: boolean;
                                    stylist: never[];
                                    version: string;
                                    visible: boolean;
                                    dataType: string;
                                    style_from: string;
                                    classDataType: string;
                                    editor_bridge: {};
                                    preloadEvenet: {};
                                    container_fonts: number;
                                    mobile_editable: never[];
                                    desktop_editable: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                    refer: string;
                                };
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                formData: {};
                            } | {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    tag: string;
                                    _gap: string;
                                    attr: never[];
                                    elem: string;
                                    list: never[];
                                    inner: string;
                                    _other: {};
                                    _border: {};
                                    _margin: {};
                                    _radius: string;
                                    _padding: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                    };
                                    _reverse: string;
                                    carryData: {};
                                    refer_app: string;
                                    _max_width: string;
                                    _background: string;
                                    _style_refer: string;
                                    _hor_position: string;
                                    refer_form_data: {
                                        link: string;
                                        theme: {
                                            id: string;
                                            title: string;
                                            content: string;
                                            "sec-title": string;
                                            background: string;
                                            "sec-background": string;
                                            "solid-button-bg": string;
                                            "border-button-bg": string;
                                            "solid-button-text": string;
                                            "border-button-text": string;
                                        };
                                        title: string;
                                        width: {
                                            unit: string;
                                            value: string;
                                            number: string;
                                        };
                                        height: {
                                            unit: string;
                                            value: string;
                                            number: string;
                                        };
                                        radius: string;
                                        distance: {
                                            margin: {
                                                top: string;
                                                bottom: string;
                                                toggle: boolean;
                                            };
                                            toggle: boolean;
                                            padding: {
                                                top: string;
                                                left: string;
                                                right: string;
                                                bottom: string;
                                                toggle: boolean;
                                            };
                                            margin_pc: {
                                                toggle: boolean;
                                            };
                                            padding_pc: {
                                                toggle: boolean;
                                            };
                                            margin_phone?: undefined;
                                            padding_phone?: undefined;
                                        };
                                        "font-size": string;
                                        kkw?: undefined;
                                        size?: undefined;
                                        color?: undefined;
                                        margin?: undefined;
                                        weight?: undefined;
                                        import_?: undefined;
                                        justify?: undefined;
                                        padding?: undefined;
                                        size_pc?: undefined;
                                        margin_pc?: undefined;
                                        padding_pc?: undefined;
                                        size_phone?: undefined;
                                        theme_color?: undefined;
                                        margin_phone?: undefined;
                                        padding_phone?: undefined;
                                        r_1716801819158?: undefined;
                                        r_1718616868830?: undefined;
                                        r_1718616877262?: undefined;
                                        r_1718616885960?: undefined;
                                    };
                                    _background_setting: {
                                        type: string;
                                    };
                                    _style_refer_global: {
                                        index: string;
                                    };
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                mobile: {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        refer_app: string;
                                        refer_form_data?: undefined;
                                    };
                                    list: never[];
                                    type: string;
                                    class: string;
                                    index: number;
                                    label: string;
                                    style: string;
                                    global: never[];
                                    toggle: boolean;
                                    stylist: never[];
                                    version: string;
                                    visible: boolean;
                                    dataType: string;
                                    style_from: string;
                                    classDataType: string;
                                    editor_bridge: {};
                                    preloadEvenet: {};
                                    container_fonts: number;
                                    mobile_editable: never[];
                                    desktop_editable: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                    refer: string;
                                };
                                toggle: boolean;
                                desktop: {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        refer_app: string;
                                    };
                                    list: never[];
                                    type: string;
                                    class: string;
                                    index: number;
                                    label: string;
                                    style: string;
                                    global: never[];
                                    toggle: boolean;
                                    stylist: never[];
                                    version: string;
                                    visible: boolean;
                                    dataType: string;
                                    style_from: string;
                                    classDataType: string;
                                    editor_bridge: {};
                                    preloadEvenet: {};
                                    container_fonts: number;
                                    mobile_editable: never[];
                                    desktop_editable: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                    refer: string;
                                };
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                formData: {};
                            })[];
                            version: string;
                            _padding: {
                                top: string;
                                left: string;
                                right: string;
                                bottom: string;
                            };
                            _reverse: string;
                            _x_count: string;
                            _y_count: string;
                            atrExpand: {};
                            _max_width: string;
                            elemExpand: {};
                            _background: string;
                            _style_refer: string;
                            _hor_position: string;
                            _ver_position: string;
                            _background_setting: {
                                type: string;
                                value: string;
                            };
                            _style_refer_global: {
                                index: string;
                            };
                            tag?: undefined;
                            carryData?: undefined;
                            refer_app?: undefined;
                            refer_form_data?: undefined;
                        };
                        type: string;
                        index: number;
                        label: string;
                        global: never[];
                        mobile: {
                            refer: string;
                            id?: undefined;
                            js?: undefined;
                            css?: undefined;
                            data?: undefined;
                            list?: undefined;
                            type?: undefined;
                            class?: undefined;
                            index?: undefined;
                            label?: undefined;
                            style?: undefined;
                            global?: undefined;
                            toggle?: undefined;
                            stylist?: undefined;
                            version?: undefined;
                            visible?: undefined;
                            dataType?: undefined;
                            style_from?: undefined;
                            classDataType?: undefined;
                            editor_bridge?: undefined;
                            preloadEvenet?: undefined;
                            container_fonts?: undefined;
                            mobile_editable?: undefined;
                            desktop_editable?: undefined;
                            refreshAllParameter?: undefined;
                            refreshComponentParameter?: undefined;
                        };
                        toggle: boolean;
                        desktop: {
                            refer: string;
                            id?: undefined;
                            js?: undefined;
                            css?: undefined;
                            data?: undefined;
                            list?: undefined;
                            type?: undefined;
                            class?: undefined;
                            index?: undefined;
                            label?: undefined;
                            style?: undefined;
                            global?: undefined;
                            toggle?: undefined;
                            stylist?: undefined;
                            version?: undefined;
                            visible?: undefined;
                            dataType?: undefined;
                            style_from?: undefined;
                            classDataType?: undefined;
                            editor_bridge?: undefined;
                            preloadEvenet?: undefined;
                            container_fonts?: undefined;
                            mobile_editable?: undefined;
                            desktop_editable?: undefined;
                            refreshAllParameter?: undefined;
                            refreshComponentParameter?: undefined;
                        };
                        visible: boolean;
                        def_editable: never[];
                        editor_bridge: {};
                        preloadEvenet: {};
                        refreshAllParameter: {};
                        refreshComponentParameter: {};
                        formData: {};
                        list?: undefined;
                        class?: undefined;
                        style?: undefined;
                        stylist?: undefined;
                        version?: undefined;
                        dataType?: undefined;
                        style_from?: undefined;
                        classDataType?: undefined;
                        container_fonts?: undefined;
                        mobile_editable?: undefined;
                        desktop_editable?: undefined;
                    })[];
                    version: string;
                    _padding: {
                        top: string;
                        left: string;
                        right: string;
                        bottom: string;
                    };
                    _reverse: string;
                    atrExpand: {};
                    _max_width: string;
                    elemExpand: {};
                    _background: string;
                    _style_refer: string;
                    _hor_position: string;
                    _background_setting: {
                        type: string;
                    };
                    _ratio_layout_value: string;
                    _style_refer_global: {
                        index: string;
                    };
                    refer_app?: undefined;
                    refer_form_data?: undefined;
                    _x_count?: undefined;
                    _y_count?: undefined;
                };
                type: string;
                index: number;
                label: string;
                global: never[];
                toggle: boolean;
                visible: boolean;
                def_editable: never[];
                editor_bridge: {};
                preloadEvenet: {};
                mobile_editable: never[];
                refreshAllParameter: {};
                refreshComponentParameter: {};
                refer: string;
                list?: undefined;
                class?: undefined;
                style?: undefined;
                stylist?: undefined;
                version?: undefined;
                dataType?: undefined;
                style_from?: undefined;
                classDataType?: undefined;
                container_fonts?: undefined;
                desktop_editable?: undefined;
            };
            toggle: boolean;
            desktop: {
                refer: string;
                id?: undefined;
                js?: undefined;
                css?: undefined;
                data?: undefined;
                list?: undefined;
                type?: undefined;
                class?: undefined;
                index?: undefined;
                label?: undefined;
                style?: undefined;
                global?: undefined;
                toggle?: undefined;
                stylist?: undefined;
                version?: undefined;
                visible?: undefined;
                dataType?: undefined;
                style_from?: undefined;
                classDataType?: undefined;
                editor_bridge?: undefined;
                preloadEvenet?: undefined;
                container_fonts?: undefined;
                mobile_editable?: undefined;
                desktop_editable?: undefined;
                refreshAllParameter?: undefined;
                refreshComponentParameter?: undefined;
            };
            visible: boolean;
            def_editable: never[];
            editor_bridge: {};
            preloadEvenet: {};
            mobile_editable: never[];
            refreshAllParameter: {};
            refreshComponentParameter: {};
            formData: {};
            list?: undefined;
            class?: undefined;
            style?: undefined;
            stylist?: undefined;
            version?: undefined;
            dataType?: undefined;
            style_from?: undefined;
            classDataType?: undefined;
            container_fonts?: undefined;
            desktop_editable?: undefined;
            storage?: undefined;
            bundle?: undefined;
            share?: undefined;
        };
        image: string;
    } | {
        title: string;
        config: {
            id: string;
            js: string;
            css: {
                class: {};
                style: {};
            };
            data: {
                _gap: string;
                attr: never[];
                elem: string;
                list: never[];
                inner: string;
                _gap_x: string;
                _gap_y: string;
                _other: {
                    expand?: undefined;
                };
                _border: {};
                _layout: string;
                _margin: {};
                _radius: string;
                setting: ({
                    id: string;
                    js: string;
                    css: {
                        class: {};
                        style: {};
                    };
                    data: {
                        tag: string;
                        _gap: string;
                        attr: never[];
                        elem: string;
                        list: never[];
                        inner: string;
                        _other: {};
                        _border: {};
                        _margin: {};
                        _radius: string;
                        _padding: {};
                        _reverse: string;
                        carryData: {};
                        refer_app: string;
                        _max_width: string;
                        _background: string;
                        _style_refer: string;
                        _hor_position: string;
                        refer_form_data: {
                            kkw: string;
                            size: string;
                            color: {
                                id: string;
                                title: string;
                                content: string;
                                "sec-title": string;
                                background: string;
                                "sec-background": string;
                                "solid-button-bg": string;
                                "border-button-bg": string;
                                "solid-button-text": string;
                                "border-button-text": string;
                            };
                            title: string;
                            margin: {
                                top: string;
                                left: string;
                                right: string;
                                bottom: string;
                                toggle: boolean;
                            };
                            weight: string;
                            import_: string;
                            justify: string;
                            padding: {
                                top: string;
                                left: string;
                                right: string;
                                bottom: string;
                                toggle: boolean;
                            };
                            size_pc: string;
                            distance: {
                                toggle: boolean;
                                margin_pc: {
                                    toggle: boolean;
                                    top?: undefined;
                                    left?: undefined;
                                    right?: undefined;
                                    bottom?: undefined;
                                };
                                padding_pc: {
                                    toggle: boolean;
                                };
                                margin_phone: {
                                    toggle: boolean;
                                    top?: undefined;
                                    left?: undefined;
                                    right?: undefined;
                                    bottom?: undefined;
                                };
                                padding_phone: {
                                    toggle: boolean;
                                };
                            };
                            margin_pc: {
                                top: string;
                                left: string;
                                right: string;
                                bottom: string;
                                toggle: boolean;
                            };
                            padding_pc: {
                                top: string;
                                left: string;
                                right: string;
                                bottom: string;
                                toggle: boolean;
                            };
                            size_phone: string;
                            theme_color: {
                                id: string;
                                title: string;
                                content: string;
                                background: string;
                                "solid-button-bg": string;
                                "border-button-bg": string;
                                "solid-button-text": string;
                                "border-button-text": string;
                            };
                            margin_phone: {
                                top: string;
                                left: string;
                                right: string;
                                bottom: string;
                                toggle: boolean;
                            };
                            padding_phone: {
                                top: string;
                                left: string;
                                right: string;
                                bottom: string;
                                toggle: boolean;
                            };
                            r_1716801819158: {};
                            r_1718616868830: {
                                type: string;
                                value: string;
                            };
                            r_1718616877262: {
                                type: string;
                                value: string;
                            };
                            r_1718616885960: {
                                type: string;
                                value: string;
                            };
                            ccc?: undefined;
                            content?: undefined;
                            btn_color?: undefined;
                        };
                        _background_setting: {
                            type: string;
                        };
                        _style_refer_global: {
                            index: string;
                        };
                    };
                    list: never[];
                    type: string;
                    class: string;
                    index: number;
                    label: string;
                    style: string;
                    global: never[];
                    mobile: {
                        id: string;
                        js: string;
                        css: {
                            class: {};
                            style: {};
                        };
                        data: {
                            refer_app: string;
                        };
                        list: never[];
                        type: string;
                        class: string;
                        index: number;
                        label: string;
                        style: string;
                        global: never[];
                        toggle: boolean;
                        stylist: never[];
                        version: string;
                        visible: boolean;
                        dataType: string;
                        style_from: string;
                        classDataType: string;
                        editor_bridge: {};
                        preloadEvenet: {};
                        container_fonts: number;
                        mobile_editable: never[];
                        desktop_editable: never[];
                        refreshAllParameter: {};
                        refreshComponentParameter: {};
                        refer: string;
                    };
                    toggle: boolean;
                    desktop: {
                        id: string;
                        js: string;
                        css: {
                            class: {};
                            style: {};
                        };
                        data: {
                            refer_app: string;
                        };
                        list: never[];
                        type: string;
                        class: string;
                        index: number;
                        label: string;
                        style: string;
                        global: never[];
                        toggle: boolean;
                        stylist: never[];
                        version: string;
                        visible: boolean;
                        dataType: string;
                        style_from: string;
                        classDataType: string;
                        editor_bridge: {};
                        preloadEvenet: {};
                        container_fonts: number;
                        mobile_editable: never[];
                        desktop_editable: never[];
                        refreshAllParameter: {};
                        refreshComponentParameter: {};
                        refer: string;
                    };
                    stylist: never[];
                    version: string;
                    visible: boolean;
                    dataType: string;
                    style_from: string;
                    classDataType: string;
                    editor_bridge: {};
                    preloadEvenet: {};
                    container_fonts: number;
                    mobile_editable: never[];
                    desktop_editable: never[];
                    refreshAllParameter: {};
                    refreshComponentParameter: {};
                    formData: {};
                } | {
                    id: string;
                    js: string;
                    css: {
                        class: {};
                        style: {};
                    };
                    data: {
                        tag: string;
                        _gap: string;
                        attr: never[];
                        elem: string;
                        list: never[];
                        inner: string;
                        _other: {};
                        _border: {};
                        _margin: {};
                        _radius: string;
                        _padding: {};
                        _reverse: string;
                        carryData: {};
                        refer_app: string;
                        _max_width: string;
                        _background: string;
                        _style_refer: string;
                        _hor_position: string;
                        refer_form_data: {
                            ccc: {
                                toggle: boolean;
                                content: {
                                    id: string;
                                    text: string;
                                    index: number;
                                    title: string;
                                    c_v_id: string;
                                    toggle: boolean;
                                    heading_id: string;
                                    collapse_id: string;
                                }[];
                            };
                            color: {
                                id: string;
                                title: string;
                                content: string;
                                background: string;
                                "solid-button-bg": string;
                                "border-button-bg": string;
                                "solid-button-text": string;
                                "border-button-text": string;
                                "sec-title"?: undefined;
                                "sec-background"?: undefined;
                            };
                            content: {
                                text: string;
                                title: string;
                            }[];
                            size_pc: string;
                            distance: {
                                toggle: boolean;
                                margin_pc: {
                                    top: string;
                                    left: string;
                                    right: string;
                                    bottom: string;
                                    toggle: boolean;
                                };
                                padding_pc: {
                                    toggle?: undefined;
                                };
                                margin_phone: {
                                    top: string;
                                    left: string;
                                    right: string;
                                    bottom: string;
                                    toggle: boolean;
                                };
                                padding_phone: {
                                    toggle?: undefined;
                                };
                            };
                            btn_color: {
                                id: string;
                                title: string;
                                content: string;
                                background: string;
                                "solid-button-bg": string;
                                "border-button-bg": string;
                                "solid-button-text": string;
                                "border-button-text": string;
                            };
                            margin_pc: {
                                top: string;
                                left: string;
                                right: string;
                                bottom: string;
                                toggle: boolean;
                            };
                            padding_pc: {
                                top: string;
                                left: string;
                                right: string;
                                bottom: string;
                                toggle: boolean;
                            };
                            size_phone: string;
                            margin_phone: {
                                top: string;
                                left: string;
                                right: string;
                                bottom: string;
                                toggle: boolean;
                            };
                            padding_phone: {
                                top: string;
                                left: string;
                                right: string;
                                bottom: string;
                                toggle: boolean;
                            };
                            kkw?: undefined;
                            size?: undefined;
                            title?: undefined;
                            margin?: undefined;
                            weight?: undefined;
                            import_?: undefined;
                            justify?: undefined;
                            padding?: undefined;
                            theme_color?: undefined;
                            r_1716801819158?: undefined;
                            r_1718616868830?: undefined;
                            r_1718616877262?: undefined;
                            r_1718616885960?: undefined;
                        };
                        _background_setting: {
                            type: string;
                        };
                        _style_refer_global: {
                            index: string;
                        };
                    };
                    list: never[];
                    type: string;
                    class: string;
                    index: number;
                    label: string;
                    style: string;
                    global: never[];
                    mobile: {
                        id: string;
                        js: string;
                        css: {
                            class: {};
                            style: {};
                        };
                        data: {
                            refer_app: string;
                        };
                        list: never[];
                        type: string;
                        class: string;
                        index: number;
                        label: string;
                        style: string;
                        global: never[];
                        toggle: boolean;
                        stylist: never[];
                        version: string;
                        visible: string;
                        dataType: string;
                        style_from: string;
                        classDataType: string;
                        editor_bridge: {};
                        preloadEvenet: {};
                        container_fonts: number;
                        mobile_editable: never[];
                        desktop_editable: never[];
                        refreshAllParameter: {};
                        refreshComponentParameter: {};
                        refer: string;
                    };
                    toggle: boolean;
                    desktop: {
                        id: string;
                        js: string;
                        css: {
                            class: {};
                            style: {};
                        };
                        data: {
                            refer_app: string;
                        };
                        list: never[];
                        type: string;
                        class: string;
                        index: number;
                        label: string;
                        style: string;
                        global: never[];
                        toggle: boolean;
                        stylist: never[];
                        version: string;
                        visible: string;
                        dataType: string;
                        style_from: string;
                        classDataType: string;
                        editor_bridge: {};
                        preloadEvenet: {};
                        container_fonts: number;
                        mobile_editable: never[];
                        desktop_editable: never[];
                        refreshAllParameter: {};
                        refreshComponentParameter: {};
                        refer: string;
                    };
                    stylist: never[];
                    version: string;
                    visible: string;
                    dataType: string;
                    style_from: string;
                    classDataType: string;
                    editor_bridge: {};
                    preloadEvenet: {};
                    container_fonts: number;
                    mobile_editable: never[];
                    desktop_editable: never[];
                    refreshAllParameter: {};
                    refreshComponentParameter: {};
                    formData: {};
                })[];
                version: string;
                _padding: {
                    top: string;
                    left: string;
                    right: string;
                    bottom: string;
                };
                _reverse: string;
                _x_count: string;
                _y_count: string;
                atrExpand: {};
                _max_width: string;
                elemExpand: {};
                _background: string;
                _style_refer: string;
                _hor_position: string;
                _ver_position: string;
                _background_setting: {
                    type: string;
                    value?: undefined;
                };
                _style_refer_global: {
                    index: string;
                };
                _ratio_layout_value?: undefined;
                tag?: undefined;
                carryData?: undefined;
                refer_app?: undefined;
                refer_form_data?: undefined;
            };
            type: string;
            index: number;
            label: string;
            global: never[];
            mobile: {
                refer: string;
                id?: undefined;
                js?: undefined;
                css?: undefined;
                data?: undefined;
                type?: undefined;
                index?: undefined;
                label?: undefined;
                global?: undefined;
                toggle?: undefined;
                visible?: undefined;
                def_editable?: undefined;
                editor_bridge?: undefined;
                preloadEvenet?: undefined;
                mobile_editable?: undefined;
                refreshAllParameter?: undefined;
                refreshComponentParameter?: undefined;
                list?: undefined;
                class?: undefined;
                style?: undefined;
                stylist?: undefined;
                version?: undefined;
                dataType?: undefined;
                style_from?: undefined;
                classDataType?: undefined;
                container_fonts?: undefined;
                desktop_editable?: undefined;
            };
            toggle: boolean;
            desktop: {
                refer: string;
                id?: undefined;
                js?: undefined;
                css?: undefined;
                data?: undefined;
                list?: undefined;
                type?: undefined;
                class?: undefined;
                index?: undefined;
                label?: undefined;
                style?: undefined;
                global?: undefined;
                toggle?: undefined;
                stylist?: undefined;
                version?: undefined;
                visible?: undefined;
                dataType?: undefined;
                style_from?: undefined;
                classDataType?: undefined;
                editor_bridge?: undefined;
                preloadEvenet?: undefined;
                container_fonts?: undefined;
                mobile_editable?: undefined;
                desktop_editable?: undefined;
                refreshAllParameter?: undefined;
                refreshComponentParameter?: undefined;
            };
            visible: boolean;
            def_editable: never[];
            editor_bridge: {};
            preloadEvenet: {};
            refreshAllParameter: {};
            refreshComponentParameter: {};
            formData: {};
            mobile_editable?: undefined;
            list?: undefined;
            class?: undefined;
            style?: undefined;
            stylist?: undefined;
            version?: undefined;
            dataType?: undefined;
            style_from?: undefined;
            classDataType?: undefined;
            container_fonts?: undefined;
            desktop_editable?: undefined;
            storage?: undefined;
            bundle?: undefined;
            share?: undefined;
        };
        image: string;
    } | {
        title: string;
        config: {
            id: string;
            js: string;
            css: {
                class: {};
                style: {};
            };
            data: {
                _gap: string;
                attr: never[];
                elem: string;
                list: never[];
                inner: string;
                _gap_x: string;
                _gap_y: string;
                _other: {
                    expand: boolean;
                };
                _border: {};
                _layout: string;
                _margin: {};
                _radius: string;
                setting: {
                    id: string;
                    js: string;
                    css: {
                        class: {};
                        style: {};
                    };
                    data: {
                        tag: string;
                        _gap: string;
                        attr: never[];
                        elem: string;
                        list: never[];
                        inner: string;
                        _other: {};
                        _border: {};
                        _margin: {};
                        _radius: string;
                        _padding: {};
                        _reverse: string;
                        carryData: {};
                        refer_app: string;
                        _max_width: string;
                        _background: string;
                        _style_refer: string;
                        _hor_position: string;
                        refer_form_data: {
                            img: string;
                            ratio: string;
                            theme: {
                                id: string;
                                title: string;
                                content: string;
                                "sec-title": string;
                                background: string;
                                "sec-background": string;
                                "solid-button-bg": string;
                                "border-button-bg": string;
                                "solid-button-text": string;
                                "border-button-text": string;
                            };
                            title: string;
                            border: string;
                        };
                        _background_setting: {
                            type: string;
                        };
                        _style_refer_global: {
                            index: string;
                        };
                    };
                    list: never[];
                    type: string;
                    class: string;
                    index: number;
                    label: string;
                    style: string;
                    global: never[];
                    mobile: {
                        id: string;
                        js: string;
                        css: {
                            class: {};
                            style: {};
                        };
                        data: {
                            refer_app: string;
                        };
                        list: never[];
                        type: string;
                        class: string;
                        index: number;
                        label: string;
                        style: string;
                        global: never[];
                        toggle: boolean;
                        stylist: never[];
                        version: string;
                        visible: string;
                        dataType: string;
                        style_from: string;
                        classDataType: string;
                        editor_bridge: {};
                        preloadEvenet: {};
                        container_fonts: number;
                        mobile_editable: never[];
                        desktop_editable: never[];
                        refreshAllParameter: {};
                        refreshComponentParameter: {};
                        refer: string;
                    };
                    toggle: boolean;
                    desktop: {
                        id: string;
                        js: string;
                        css: {
                            class: {};
                            style: {};
                        };
                        data: {
                            refer_app: string;
                        };
                        list: never[];
                        type: string;
                        class: string;
                        index: number;
                        label: string;
                        style: string;
                        global: never[];
                        toggle: boolean;
                        stylist: never[];
                        version: string;
                        visible: string;
                        dataType: string;
                        style_from: string;
                        classDataType: string;
                        editor_bridge: {};
                        preloadEvenet: {};
                        container_fonts: number;
                        mobile_editable: never[];
                        desktop_editable: never[];
                        refreshAllParameter: {};
                        refreshComponentParameter: {};
                        refer: string;
                    };
                    stylist: never[];
                    version: string;
                    visible: string;
                    dataType: string;
                    style_from: string;
                    classDataType: string;
                    editor_bridge: {};
                    preloadEvenet: {};
                    container_fonts: number;
                    mobile_editable: never[];
                    desktop_editable: never[];
                    refreshAllParameter: {};
                    refreshComponentParameter: {};
                    formData: {};
                }[];
                version: string;
                _padding: {
                    top?: undefined;
                    left?: undefined;
                    right?: undefined;
                    bottom?: undefined;
                };
                _reverse: string;
                _x_count: string;
                _y_count: string;
                atrExpand: {};
                _max_width: string;
                elemExpand: {};
                _background: string;
                _style_refer: string;
                _hor_position: string;
                _background_setting: {
                    type: string;
                    value?: undefined;
                };
                _style_refer_global: {
                    index: string;
                };
                _ver_position?: undefined;
                _ratio_layout_value?: undefined;
                tag?: undefined;
                carryData?: undefined;
                refer_app?: undefined;
                refer_form_data?: undefined;
            };
            type: string;
            index: number;
            label: string;
            global: never[];
            mobile: {
                id: string;
                js: string;
                css: {
                    class: {};
                    style: {};
                };
                data: {
                    _gap: string;
                    attr: never[];
                    elem: string;
                    list: never[];
                    inner: string;
                    _gap_x: string;
                    _gap_y: string;
                    _other: {
                        expand: boolean;
                    };
                    _border: {};
                    _layout: string;
                    _margin: {};
                    _radius: string;
                    setting: {
                        id: string;
                        js: string;
                        css: {
                            class: {};
                            style: {};
                        };
                        data: {
                            tag: string;
                            _gap: string;
                            attr: never[];
                            elem: string;
                            list: never[];
                            inner: string;
                            _other: {};
                            _border: {};
                            _margin: {};
                            _radius: string;
                            _padding: {};
                            _reverse: string;
                            carryData: {};
                            refer_app: string;
                            _max_width: string;
                            _background: string;
                            _style_refer: string;
                            _hor_position: string;
                            refer_form_data: {
                                img: string;
                                ratio: string;
                                theme: {
                                    id: string;
                                    title: string;
                                    content: string;
                                    "sec-title": string;
                                    background: string;
                                    "sec-background": string;
                                    "solid-button-bg": string;
                                    "border-button-bg": string;
                                    "solid-button-text": string;
                                    "border-button-text": string;
                                };
                                title: string;
                                border: string;
                            };
                            _background_setting: {
                                type: string;
                            };
                            _style_refer_global: {
                                index: string;
                            };
                        };
                        list: never[];
                        type: string;
                        class: string;
                        index: number;
                        label: string;
                        style: string;
                        global: never[];
                        mobile: {
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                refer_app: string;
                            };
                            list: never[];
                            type: string;
                            class: string;
                            index: number;
                            label: string;
                            style: string;
                            global: never[];
                            toggle: boolean;
                            stylist: never[];
                            version: string;
                            visible: string;
                            dataType: string;
                            style_from: string;
                            classDataType: string;
                            editor_bridge: {};
                            preloadEvenet: {};
                            container_fonts: number;
                            mobile_editable: never[];
                            desktop_editable: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                            refer: string;
                        };
                        toggle: boolean;
                        desktop: {
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                refer_app: string;
                            };
                            list: never[];
                            type: string;
                            class: string;
                            index: number;
                            label: string;
                            style: string;
                            global: never[];
                            toggle: boolean;
                            stylist: never[];
                            version: string;
                            visible: string;
                            dataType: string;
                            style_from: string;
                            classDataType: string;
                            editor_bridge: {};
                            preloadEvenet: {};
                            container_fonts: number;
                            mobile_editable: never[];
                            desktop_editable: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                            refer: string;
                        };
                        stylist: never[];
                        version: string;
                        visible: string;
                        dataType: string;
                        style_from: string;
                        classDataType: string;
                        editor_bridge: {};
                        preloadEvenet: {};
                        container_fonts: number;
                        mobile_editable: never[];
                        desktop_editable: never[];
                        refreshAllParameter: {};
                        refreshComponentParameter: {};
                        formData: {};
                    }[];
                    version: string;
                    _padding: {
                        top: string;
                        left: string;
                        right: string;
                        bottom: string;
                    };
                    _reverse: string;
                    _x_count: string;
                    _y_count: string;
                    atrExpand: {};
                    _max_width: string;
                    elemExpand: {};
                    _background: string;
                    _style_refer: string;
                    _hor_position: string;
                    _background_setting: {
                        type: string;
                    };
                    _style_refer_global: {
                        index: string;
                    };
                    _ratio_layout_value?: undefined;
                    refer_app?: undefined;
                    refer_form_data?: undefined;
                };
                type: string;
                index: number;
                label: string;
                global: never[];
                toggle: boolean;
                visible: boolean;
                def_editable: never[];
                editor_bridge: {};
                preloadEvenet: {};
                mobile_editable: never[];
                refreshAllParameter: {};
                refreshComponentParameter: {};
                refer: string;
                list?: undefined;
                class?: undefined;
                style?: undefined;
                stylist?: undefined;
                version?: undefined;
                dataType?: undefined;
                style_from?: undefined;
                classDataType?: undefined;
                container_fonts?: undefined;
                desktop_editable?: undefined;
            };
            toggle: boolean;
            desktop: {
                refer: string;
                id?: undefined;
                js?: undefined;
                css?: undefined;
                data?: undefined;
                list?: undefined;
                type?: undefined;
                class?: undefined;
                index?: undefined;
                label?: undefined;
                style?: undefined;
                global?: undefined;
                toggle?: undefined;
                stylist?: undefined;
                version?: undefined;
                visible?: undefined;
                dataType?: undefined;
                style_from?: undefined;
                classDataType?: undefined;
                editor_bridge?: undefined;
                preloadEvenet?: undefined;
                container_fonts?: undefined;
                mobile_editable?: undefined;
                desktop_editable?: undefined;
                refreshAllParameter?: undefined;
                refreshComponentParameter?: undefined;
            };
            visible: boolean;
            def_editable: never[];
            editor_bridge: {};
            preloadEvenet: {};
            mobile_editable: never[];
            refreshAllParameter: {};
            refreshComponentParameter: {};
            formData: {};
            list?: undefined;
            class?: undefined;
            style?: undefined;
            stylist?: undefined;
            version?: undefined;
            dataType?: undefined;
            style_from?: undefined;
            classDataType?: undefined;
            container_fonts?: undefined;
            desktop_editable?: undefined;
            storage?: undefined;
            bundle?: undefined;
            share?: undefined;
        };
        image: string;
    } | {
        title: string;
        config: {
            id: string;
            js: string;
            css: {
                class: {};
                style: {};
            };
            data: {
                refer_app: string;
                tag: string;
                list: never[];
                carryData: {};
                _style_refer_global: {
                    index: string;
                };
                _style_refer: string;
                elem: string;
                inner: string;
                attr: never[];
                _padding: {
                    top?: undefined;
                    left?: undefined;
                    right?: undefined;
                    bottom?: undefined;
                };
                _margin: {};
                _border: {};
                _max_width: string;
                _gap: string;
                _background: string;
                _other: {
                    expand?: undefined;
                };
                _radius: string;
                _reverse: string;
                _hor_position: string;
                _background_setting: {
                    type: string;
                    value?: undefined;
                };
                refer_form_data: {
                    theme: {
                        id: string;
                        title: string;
                        content: string;
                        "sec-title": string;
                        background: string;
                        "sec-background": string;
                        "solid-button-bg": string;
                        "border-button-bg": string;
                        "solid-button-text": string;
                        "border-button-text": string;
                    };
                    title: string;
                    content: string;
                    bo?: undefined;
                    ggg?: undefined;
                    grid?: undefined;
                    size?: undefined;
                    color?: undefined;
                    gap_x?: undefined;
                    gap_y?: undefined;
                    width?: undefined;
                    border?: undefined;
                    height?: undefined;
                    images?: undefined;
                    margin?: undefined;
                    weight?: undefined;
                    grid_pc?: undefined;
                    justify?: undefined;
                    padding?: undefined;
                    size_pc?: undefined;
                    distance?: undefined;
                    margin_pc?: undefined;
                    grid_phone?: undefined;
                    padding_pc?: undefined;
                    size_phone?: undefined;
                    image_hover?: undefined;
                    border_color?: undefined;
                    margin_phone?: undefined;
                    padding_phone?: undefined;
                    r_1716801819158?: undefined;
                    ccc?: undefined;
                    circle?: undefined;
                    slide_pc?: undefined;
                    slide_phone?: undefined;
                    slide_tablet?: undefined;
                    hint?: undefined;
                    ratio?: undefined;
                    back_img?: undefined;
                    sub_title?: undefined;
                    search_tag?: undefined;
                    "title-size"?: undefined;
                    cover_color?: undefined;
                    theme_color?: undefined;
                    "sub-title-size"?: undefined;
                    image?: undefined;
                    scale?: undefined;
                    random?: undefined;
                    autoplay?: undefined;
                    title_size?: undefined;
                    phone_image?: undefined;
                    banner_height?: undefined;
                    banner_height2?: undefined;
                    r_1718088289110?: undefined;
                    phone_banner_height?: undefined;
                    carry_info?: undefined;
                };
                _gap_x?: undefined;
                _gap_y?: undefined;
                _layout?: undefined;
                setting?: undefined;
                version?: undefined;
                _x_count?: undefined;
                _y_count?: undefined;
                atrExpand?: undefined;
                elemExpand?: undefined;
                _ver_position?: undefined;
                _ratio_layout_value?: undefined;
            };
            type: string;
            class: string;
            index: number;
            label: string;
            style: string;
            bundle: {};
            global: never[];
            toggle: boolean;
            stylist: never[];
            dataType: string;
            style_from: string;
            classDataType: string;
            preloadEvenet: {};
            share: {};
            formData: {};
            refreshAllParameter: {};
            editor_bridge: {};
            refreshComponentParameter: {};
            list: never[];
            version: string;
            storage: {};
            mobile: {
                id: string;
                js: string;
                css: {
                    class: {};
                    style: {};
                };
                data: {
                    refer_app: string;
                    _gap?: undefined;
                    attr?: undefined;
                    elem?: undefined;
                    list?: undefined;
                    inner?: undefined;
                    _gap_x?: undefined;
                    _gap_y?: undefined;
                    _other?: undefined;
                    _border?: undefined;
                    _layout?: undefined;
                    _margin?: undefined;
                    _radius?: undefined;
                    setting?: undefined;
                    version?: undefined;
                    _padding?: undefined;
                    _reverse?: undefined;
                    atrExpand?: undefined;
                    _max_width?: undefined;
                    elemExpand?: undefined;
                    _background?: undefined;
                    _style_refer?: undefined;
                    _hor_position?: undefined;
                    _background_setting?: undefined;
                    _ratio_layout_value?: undefined;
                    _style_refer_global?: undefined;
                    refer_form_data?: undefined;
                    _x_count?: undefined;
                    _y_count?: undefined;
                };
                type: string;
                class: string;
                index: number;
                label: string;
                style: string;
                global: never[];
                toggle: boolean;
                stylist: never[];
                dataType: string;
                style_from: string;
                classDataType: string;
                preloadEvenet: {};
                refreshAllParameter: {};
                editor_bridge: {};
                refreshComponentParameter: {};
                list: never[];
                version: string;
                mobile_editable: never[];
                desktop_editable: never[];
                container_fonts: number;
                visible: boolean;
                refer: string;
                def_editable?: undefined;
            };
            mobile_editable: never[];
            desktop: {
                id: string;
                js: string;
                css: {
                    class: {};
                    style: {};
                };
                data: {
                    refer_app: string;
                    refer_form_data?: undefined;
                };
                type: string;
                class: string;
                index: number;
                label: string;
                style: string;
                global: never[];
                toggle: boolean;
                stylist: never[];
                dataType: string;
                style_from: string;
                classDataType: string;
                preloadEvenet: {};
                refreshAllParameter: {};
                editor_bridge: {};
                refreshComponentParameter: {};
                list: never[];
                version: string;
                mobile_editable: never[];
                desktop_editable: never[];
                container_fonts: number;
                visible: boolean;
                refer: string;
            };
            desktop_editable: never[];
            container_fonts: number;
            visible: boolean;
            def_editable?: undefined;
        };
        image: string;
    } | {
        title: string;
        config: {
            id: string;
            js: string;
            css: {
                class: {};
                style: {};
            };
            data: {
                _gap: string;
                attr: never[];
                elem: string;
                list: never[];
                inner: string;
                _gap_x: string;
                _gap_y: string;
                _other: {
                    expand?: undefined;
                };
                _border: {};
                _layout: string;
                _margin: {};
                _radius: string;
                setting: ({
                    id: string;
                    js: string;
                    css: {
                        class: {};
                        style: {};
                    };
                    data: {
                        tag: string;
                        _gap: string;
                        attr: never[];
                        elem: string;
                        list: never[];
                        inner: string;
                        _other: {};
                        _border: {};
                        _margin: {};
                        _radius: string;
                        _padding: {
                            top: string;
                            left: string;
                            right: string;
                            bottom: string;
                        };
                        _reverse: string;
                        carryData: {};
                        refer_app: string;
                        _max_width: string;
                        _background: string;
                        _style_refer: string;
                        _hor_position: string;
                        refer_form_data: {
                            image: {
                                type: string;
                                value: string;
                            };
                            scale: string;
                            form_title?: undefined;
                            left_items?: undefined;
                            left_title?: undefined;
                            form_config?: undefined;
                            theme_color?: undefined;
                        };
                        _background_setting: {
                            type: string;
                        };
                        _style_refer_global: {
                            index: string;
                        };
                    };
                    list: never[];
                    type: string;
                    class: string;
                    index: number;
                    label: string;
                    style: string;
                    global: never[];
                    mobile: {
                        id: string;
                        js: string;
                        css: {
                            class: {};
                            style: {};
                        };
                        data: {
                            _gap: string;
                            attr: never[];
                            elem: string;
                            inner: string;
                            _other: {};
                            _border: {};
                            _margin: {};
                            _radius: string;
                            _padding: {
                                top?: undefined;
                                left?: undefined;
                                right?: undefined;
                                bottom?: undefined;
                            };
                            _reverse: string;
                            refer_app: string;
                            _max_width: string;
                            _background: string;
                            _style_refer: string;
                            _hor_position: string;
                            refer_form_data: {
                                image: {
                                    type: string;
                                    value: string;
                                };
                                scale: string;
                            };
                            _background_setting: {
                                type: string;
                            };
                        };
                        list: never[];
                        type: string;
                        class: string;
                        index: number;
                        label: string;
                        style: string;
                        global: never[];
                        toggle: boolean;
                        stylist: never[];
                        version: string;
                        visible: string;
                        dataType: string;
                        style_from: string;
                        classDataType: string;
                        editor_bridge: {};
                        preloadEvenet: {};
                        container_fonts: number;
                        mobile_editable: string[];
                        desktop_editable: never[];
                        refreshAllParameter: {};
                        refreshComponentParameter: {};
                        refer: string;
                    };
                    toggle: boolean;
                    desktop: {
                        id: string;
                        js: string;
                        css: {
                            class: {};
                            style: {};
                        };
                        data: {
                            refer_app: string;
                            refer_form_data: {};
                        };
                        list: never[];
                        type: string;
                        class: string;
                        index: number;
                        label: string;
                        style: string;
                        global: never[];
                        toggle: boolean;
                        stylist: never[];
                        version: string;
                        visible: string;
                        dataType: string;
                        style_from: string;
                        classDataType: string;
                        editor_bridge: {};
                        preloadEvenet: {};
                        container_fonts: number;
                        mobile_editable: string[];
                        desktop_editable: never[];
                        refreshAllParameter: {};
                        refreshComponentParameter: {};
                        refer: string;
                    };
                    stylist: never[];
                    version: string;
                    visible: string;
                    dataType: string;
                    formData: {};
                    style_from: string;
                    classDataType: string;
                    editor_bridge: {};
                    preloadEvenet: {};
                    container_fonts: number;
                    mobile_editable: string[];
                    desktop_editable: never[];
                    refreshAllParameter: {};
                    refreshComponentParameter: {};
                    share?: undefined;
                    bundle?: undefined;
                    storage?: undefined;
                } | {
                    id: string;
                    js: string;
                    css: {
                        class: {};
                        style: {};
                    };
                    data: {
                        tag: string;
                        _gap: string;
                        attr: never[];
                        elem: string;
                        list: never[];
                        inner: string;
                        _other: {};
                        _border: {};
                        _margin: {};
                        _radius: string;
                        _padding: {
                            top: string;
                            left: string;
                            right: string;
                            bottom: string;
                        };
                        _reverse: string;
                        carryData: {};
                        refer_app: string;
                        _max_width: string;
                        _background: string;
                        _style_refer: string;
                        _hor_position: string;
                        refer_form_data: {
                            form_title: string;
                            left_items: {
                                icon: string;
                                index: number;
                                title: string;
                                c_v_id: string;
                                toggle: boolean;
                                content: string;
                                btn_link: string;
                                btn_title: string;
                            }[];
                            left_title: string;
                            form_config: ({
                                col: string;
                                key: string;
                                page: string;
                                type: string;
                                group: string;
                                title: string;
                                col_sm: string;
                                toggle: boolean;
                                appName: string;
                                require: boolean;
                                readonly: string;
                                formFormat: string;
                                moduleName: string;
                                style_data: {
                                    input: {
                                        list: never[];
                                        class: string;
                                        style: string;
                                        version: string;
                                    };
                                    label: {
                                        list: never[];
                                        class: string;
                                        style: string;
                                        version: string;
                                    };
                                    container: {
                                        list: never[];
                                        class: string;
                                        style: string;
                                        version: string;
                                    };
                                };
                                form_config: {
                                    type: string;
                                    title: string;
                                    input_style: {
                                        list: never[];
                                        version: string;
                                    };
                                    title_style: {
                                        list: never[];
                                        class: string;
                                        style: string;
                                        stylist: never[];
                                        version: string;
                                        dataType: string;
                                        style_from: string;
                                        classDataType: string;
                                    };
                                    place_holder: string;
                                    option?: undefined;
                                };
                            } | {
                                col: string;
                                key: string;
                                page: string;
                                type: string;
                                group: string;
                                title: string;
                                col_sm: string;
                                toggle: boolean;
                                appName: string;
                                require: boolean;
                                readonly: string;
                                formFormat: string;
                                moduleName: string;
                                style_data: {
                                    input: {
                                        list: never[];
                                        class: string;
                                        style: string;
                                        version: string;
                                    };
                                    label: {
                                        list: never[];
                                        class: string;
                                        style: string;
                                        version: string;
                                    };
                                    container: {
                                        list: never[];
                                        class: string;
                                        style: string;
                                        version: string;
                                    };
                                };
                                form_config: {
                                    type: string;
                                    title: string;
                                    option: {
                                        name: string;
                                        index: number;
                                        value: string;
                                    }[];
                                    input_style: {
                                        list?: undefined;
                                        version?: undefined;
                                    };
                                    title_style: {
                                        list?: undefined;
                                        class?: undefined;
                                        style?: undefined;
                                        stylist?: undefined;
                                        version?: undefined;
                                        dataType?: undefined;
                                        style_from?: undefined;
                                        classDataType?: undefined;
                                    };
                                    place_holder: string;
                                };
                            } | {
                                key: string;
                                page: string;
                                type: string;
                                group: string;
                                toggle: boolean;
                                title: string;
                                appName: string;
                                require: string;
                                readonly: string;
                                formFormat: string;
                                style_data: {
                                    input: {
                                        list: never[];
                                        class: string;
                                        style: string;
                                        version: string;
                                    };
                                    label: {
                                        list: never[];
                                        class: string;
                                        style: string;
                                        version: string;
                                    };
                                    container: {
                                        list: never[];
                                        class: string;
                                        style: string;
                                        version: string;
                                    };
                                };
                                form_config: {
                                    type: string;
                                    title: string;
                                    input_style: {
                                        list: never[];
                                        version: string;
                                    };
                                    title_style: {
                                        list: never[];
                                        version: string;
                                        class?: undefined;
                                        style?: undefined;
                                        stylist?: undefined;
                                        dataType?: undefined;
                                        style_from?: undefined;
                                        classDataType?: undefined;
                                    };
                                    place_holder: string;
                                    option?: undefined;
                                };
                                col: string;
                                col_sm: string;
                                moduleName?: undefined;
                            })[];
                            theme_color: {
                                id: string;
                                title: string;
                                content: string;
                                "sec-title": string;
                                background: string;
                                "sec-background": string;
                                "solid-button-bg": string;
                                "border-button-bg": string;
                                "solid-button-text": string;
                                "border-button-text": string;
                            };
                            image?: undefined;
                            scale?: undefined;
                        };
                        _background_setting: {
                            type: string;
                        };
                        _style_refer_global: {
                            index: string;
                        };
                    };
                    list: never[];
                    type: string;
                    class: string;
                    index: number;
                    label: string;
                    share: {};
                    style: string;
                    bundle: {};
                    global: never[];
                    mobile: {
                        id: string;
                        js: string;
                        css: {
                            class: {};
                            style: {};
                        };
                        data: {
                            _gap: string;
                            attr: never[];
                            elem: string;
                            inner: string;
                            _other: {};
                            _border: {};
                            _margin: {};
                            _radius: string;
                            _padding: {
                                top: string;
                                left: string;
                                right: string;
                                bottom: string;
                            };
                            _reverse: string;
                            refer_app: string;
                            _max_width: string;
                            _background: string;
                            _style_refer: string;
                            _hor_position: string;
                            refer_form_data: {
                                image?: undefined;
                                scale?: undefined;
                            };
                            _background_setting: {
                                type: string;
                            };
                        };
                        list: never[];
                        type: string;
                        class: string;
                        index: number;
                        label: string;
                        style: string;
                        global: never[];
                        toggle: boolean;
                        stylist: never[];
                        version: string;
                        visible: string;
                        dataType: string;
                        style_from: string;
                        classDataType: string;
                        editor_bridge: {};
                        preloadEvenet: {};
                        container_fonts: number;
                        mobile_editable: string[];
                        desktop_editable: never[];
                        refreshAllParameter: {};
                        refreshComponentParameter: {};
                        refer: string;
                    };
                    toggle: boolean;
                    desktop: {
                        id: string;
                        js: string;
                        css: {
                            class: {};
                            style: {};
                        };
                        data: {
                            refer_app: string;
                            refer_form_data?: undefined;
                        };
                        list: never[];
                        type: string;
                        class: string;
                        index: number;
                        label: string;
                        style: string;
                        global: never[];
                        toggle: boolean;
                        stylist: never[];
                        version: string;
                        visible: string;
                        dataType: string;
                        style_from: string;
                        classDataType: string;
                        editor_bridge: {};
                        preloadEvenet: {};
                        container_fonts: number;
                        mobile_editable: string[];
                        desktop_editable: never[];
                        refreshAllParameter: {};
                        refreshComponentParameter: {};
                        refer: string;
                    };
                    storage: {};
                    stylist: never[];
                    version: string;
                    visible: string;
                    dataType: string;
                    formData: {};
                    style_from: string;
                    classDataType: string;
                    editor_bridge: {};
                    preloadEvenet: {};
                    container_fonts: number;
                    mobile_editable: string[];
                    desktop_editable: never[];
                    refreshAllParameter: {};
                    refreshComponentParameter: {};
                })[];
                version: string;
                _padding: {
                    top: string;
                    left: string;
                    right: string;
                    bottom: string;
                };
                _reverse: string;
                atrExpand: {};
                _max_width: string;
                elemExpand: {};
                _background: string;
                _style_refer: string;
                _hor_position: string;
                _background_setting: {
                    type: string;
                    value?: undefined;
                };
                _ratio_layout_value: string;
                _style_refer_global: {
                    index: string;
                };
                _x_count?: undefined;
                _y_count?: undefined;
                _ver_position?: undefined;
                tag?: undefined;
                carryData?: undefined;
                refer_app?: undefined;
                refer_form_data?: undefined;
            };
            type: string;
            index: number;
            label: string;
            global: never[];
            mobile: {
                id: string;
                js: string;
                css: {
                    class: {};
                    style: {};
                };
                data: {
                    _gap: string;
                    attr: never[];
                    elem: string;
                    list: never[];
                    inner: string;
                    _gap_x: string;
                    _gap_y: string;
                    _other: {
                        expand?: undefined;
                    };
                    _border: {};
                    _layout: string;
                    _margin: {};
                    _radius: string;
                    setting: ({
                        id: string;
                        js: string;
                        css: {
                            class: {};
                            style: {};
                        };
                        data: {
                            tag: string;
                            _gap: string;
                            attr: never[];
                            elem: string;
                            list: never[];
                            inner: string;
                            _other: {};
                            _border: {};
                            _margin: {};
                            _radius: string;
                            _padding: {
                                top: string;
                                left: string;
                                right: string;
                                bottom: string;
                            };
                            _reverse: string;
                            carryData: {};
                            refer_app: string;
                            _max_width: string;
                            _background: string;
                            _style_refer: string;
                            _hor_position: string;
                            refer_form_data: {
                                image: {
                                    type: string;
                                    value: string;
                                };
                                scale: string;
                                form_title?: undefined;
                                left_items?: undefined;
                                left_title?: undefined;
                                form_config?: undefined;
                                theme_color?: undefined;
                            };
                            _background_setting: {
                                type: string;
                            };
                            _style_refer_global: {
                                index: string;
                            };
                        };
                        list: never[];
                        type: string;
                        class: string;
                        index: number;
                        label: string;
                        style: string;
                        global: never[];
                        mobile: {
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                _gap: string;
                                attr: never[];
                                elem: string;
                                inner: string;
                                _other: {};
                                _border: {};
                                _margin: {};
                                _radius: string;
                                _padding: {
                                    top?: undefined;
                                    left?: undefined;
                                    right?: undefined;
                                    bottom?: undefined;
                                };
                                _reverse: string;
                                refer_app: string;
                                _max_width: string;
                                _background: string;
                                _style_refer: string;
                                _hor_position: string;
                                refer_form_data: {
                                    image: {
                                        type: string;
                                        value: string;
                                    };
                                    scale: string;
                                };
                                _background_setting: {
                                    type: string;
                                };
                            };
                            list: never[];
                            type: string;
                            class: string;
                            index: number;
                            label: string;
                            style: string;
                            global: never[];
                            toggle: boolean;
                            stylist: never[];
                            version: string;
                            visible: string;
                            dataType: string;
                            style_from: string;
                            classDataType: string;
                            editor_bridge: {};
                            preloadEvenet: {};
                            container_fonts: number;
                            mobile_editable: string[];
                            desktop_editable: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                            refer: string;
                        };
                        toggle: boolean;
                        desktop: {
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                refer_app: string;
                                refer_form_data: {};
                            };
                            list: never[];
                            type: string;
                            class: string;
                            index: number;
                            label: string;
                            style: string;
                            global: never[];
                            toggle: boolean;
                            stylist: never[];
                            version: string;
                            visible: string;
                            dataType: string;
                            style_from: string;
                            classDataType: string;
                            editor_bridge: {};
                            preloadEvenet: {};
                            container_fonts: number;
                            mobile_editable: string[];
                            desktop_editable: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                            refer: string;
                        };
                        stylist: never[];
                        version: string;
                        visible: string;
                        dataType: string;
                        formData: {};
                        style_from: string;
                        classDataType: string;
                        editor_bridge: {};
                        preloadEvenet: {};
                        container_fonts: number;
                        mobile_editable: string[];
                        desktop_editable: never[];
                        refreshAllParameter: {};
                        refreshComponentParameter: {};
                        share?: undefined;
                        bundle?: undefined;
                        storage?: undefined;
                    } | {
                        id: string;
                        js: string;
                        css: {
                            class: {};
                            style: {};
                        };
                        data: {
                            tag: string;
                            _gap: string;
                            attr: never[];
                            elem: string;
                            list: never[];
                            inner: string;
                            _other: {};
                            _border: {};
                            _margin: {};
                            _radius: string;
                            _padding: {
                                top: string;
                                left: string;
                                right: string;
                                bottom: string;
                            };
                            _reverse: string;
                            carryData: {};
                            refer_app: string;
                            _max_width: string;
                            _background: string;
                            _style_refer: string;
                            _hor_position: string;
                            refer_form_data: {
                                form_title: string;
                                left_items: {
                                    icon: string;
                                    index: number;
                                    title: string;
                                    c_v_id: string;
                                    toggle: boolean;
                                    content: string;
                                    btn_link: string;
                                    btn_title: string;
                                }[];
                                left_title: string;
                                form_config: ({
                                    col: string;
                                    key: string;
                                    page: string;
                                    type: string;
                                    group: string;
                                    title: string;
                                    col_sm: string;
                                    toggle: boolean;
                                    appName: string;
                                    require: boolean;
                                    readonly: string;
                                    formFormat: string;
                                    moduleName: string;
                                    style_data: {
                                        input: {
                                            list: never[];
                                            class: string;
                                            style: string;
                                            version: string;
                                        };
                                        label: {
                                            list: never[];
                                            class: string;
                                            style: string;
                                            version: string;
                                        };
                                        container: {
                                            list: never[];
                                            class: string;
                                            style: string;
                                            version: string;
                                        };
                                    };
                                    form_config: {
                                        type: string;
                                        title: string;
                                        input_style: {
                                            list: never[];
                                            version: string;
                                        };
                                        title_style: {
                                            list: never[];
                                            class: string;
                                            style: string;
                                            stylist: never[];
                                            version: string;
                                            dataType: string;
                                            style_from: string;
                                            classDataType: string;
                                        };
                                        place_holder: string;
                                        option?: undefined;
                                    };
                                } | {
                                    col: string;
                                    key: string;
                                    page: string;
                                    type: string;
                                    group: string;
                                    title: string;
                                    col_sm: string;
                                    toggle: boolean;
                                    appName: string;
                                    require: boolean;
                                    readonly: string;
                                    formFormat: string;
                                    moduleName: string;
                                    style_data: {
                                        input: {
                                            list: never[];
                                            class: string;
                                            style: string;
                                            version: string;
                                        };
                                        label: {
                                            list: never[];
                                            class: string;
                                            style: string;
                                            version: string;
                                        };
                                        container: {
                                            list: never[];
                                            class: string;
                                            style: string;
                                            version: string;
                                        };
                                    };
                                    form_config: {
                                        type: string;
                                        title: string;
                                        option: {
                                            name: string;
                                            index: number;
                                            value: string;
                                        }[];
                                        input_style: {
                                            list?: undefined;
                                            version?: undefined;
                                        };
                                        title_style: {
                                            list?: undefined;
                                            class?: undefined;
                                            style?: undefined;
                                            stylist?: undefined;
                                            version?: undefined;
                                            dataType?: undefined;
                                            style_from?: undefined;
                                            classDataType?: undefined;
                                        };
                                        place_holder: string;
                                    };
                                } | {
                                    key: string;
                                    page: string;
                                    type: string;
                                    group: string;
                                    toggle: boolean;
                                    title: string;
                                    appName: string;
                                    require: string;
                                    readonly: string;
                                    formFormat: string;
                                    style_data: {
                                        input: {
                                            list: never[];
                                            class: string;
                                            style: string;
                                            version: string;
                                        };
                                        label: {
                                            list: never[];
                                            class: string;
                                            style: string;
                                            version: string;
                                        };
                                        container: {
                                            list: never[];
                                            class: string;
                                            style: string;
                                            version: string;
                                        };
                                    };
                                    form_config: {
                                        type: string;
                                        title: string;
                                        input_style: {
                                            list: never[];
                                            version: string;
                                        };
                                        title_style: {
                                            list: never[];
                                            version: string;
                                            class?: undefined;
                                            style?: undefined;
                                            stylist?: undefined;
                                            dataType?: undefined;
                                            style_from?: undefined;
                                            classDataType?: undefined;
                                        };
                                        place_holder: string;
                                        option?: undefined;
                                    };
                                    col: string;
                                    col_sm: string;
                                    moduleName?: undefined;
                                })[];
                                theme_color: {
                                    id: string;
                                    title: string;
                                    content: string;
                                    "sec-title": string;
                                    background: string;
                                    "sec-background": string;
                                    "solid-button-bg": string;
                                    "border-button-bg": string;
                                    "solid-button-text": string;
                                    "border-button-text": string;
                                };
                                image?: undefined;
                                scale?: undefined;
                            };
                            _background_setting: {
                                type: string;
                            };
                            _style_refer_global: {
                                index: string;
                            };
                        };
                        list: never[];
                        type: string;
                        class: string;
                        index: number;
                        label: string;
                        share: {};
                        style: string;
                        bundle: {};
                        global: never[];
                        mobile: {
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                _gap: string;
                                attr: never[];
                                elem: string;
                                inner: string;
                                _other: {};
                                _border: {};
                                _margin: {};
                                _radius: string;
                                _padding: {
                                    top: string;
                                    left: string;
                                    right: string;
                                    bottom: string;
                                };
                                _reverse: string;
                                refer_app: string;
                                _max_width: string;
                                _background: string;
                                _style_refer: string;
                                _hor_position: string;
                                refer_form_data: {
                                    image?: undefined;
                                    scale?: undefined;
                                };
                                _background_setting: {
                                    type: string;
                                };
                            };
                            list: never[];
                            type: string;
                            class: string;
                            index: number;
                            label: string;
                            style: string;
                            global: never[];
                            toggle: boolean;
                            stylist: never[];
                            version: string;
                            visible: string;
                            dataType: string;
                            style_from: string;
                            classDataType: string;
                            editor_bridge: {};
                            preloadEvenet: {};
                            container_fonts: number;
                            mobile_editable: string[];
                            desktop_editable: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                            refer: string;
                        };
                        toggle: boolean;
                        desktop: {
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                refer_app: string;
                                refer_form_data?: undefined;
                            };
                            list: never[];
                            type: string;
                            class: string;
                            index: number;
                            label: string;
                            style: string;
                            global: never[];
                            toggle: boolean;
                            stylist: never[];
                            version: string;
                            visible: string;
                            dataType: string;
                            style_from: string;
                            classDataType: string;
                            editor_bridge: {};
                            preloadEvenet: {};
                            container_fonts: number;
                            mobile_editable: string[];
                            desktop_editable: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                            refer: string;
                        };
                        storage: {};
                        stylist: never[];
                        version: string;
                        visible: string;
                        dataType: string;
                        formData: {};
                        style_from: string;
                        classDataType: string;
                        editor_bridge: {};
                        preloadEvenet: {};
                        container_fonts: number;
                        mobile_editable: string[];
                        desktop_editable: never[];
                        refreshAllParameter: {};
                        refreshComponentParameter: {};
                    })[];
                    version: string;
                    _padding: {
                        top: string;
                        left: string;
                        right: string;
                        bottom: string;
                    };
                    _reverse: string;
                    atrExpand: {};
                    _max_width: string;
                    elemExpand: {};
                    _background: string;
                    _style_refer: string;
                    _hor_position: string;
                    _background_setting: {
                        type: string;
                    };
                    _ratio_layout_value: string;
                    _style_refer_global: {
                        index: string;
                    };
                    refer_app?: undefined;
                    refer_form_data?: undefined;
                    _x_count?: undefined;
                    _y_count?: undefined;
                };
                type: string;
                index: number;
                label: string;
                global: never[];
                toggle: boolean;
                visible: boolean;
                def_editable: never[];
                editor_bridge: {};
                preloadEvenet: {};
                mobile_editable: never[];
                refreshAllParameter: {};
                refreshComponentParameter: {};
                refer: string;
                list?: undefined;
                class?: undefined;
                style?: undefined;
                stylist?: undefined;
                version?: undefined;
                dataType?: undefined;
                style_from?: undefined;
                classDataType?: undefined;
                container_fonts?: undefined;
                desktop_editable?: undefined;
            };
            toggle: boolean;
            desktop: {
                refer: string;
                id?: undefined;
                js?: undefined;
                css?: undefined;
                data?: undefined;
                list?: undefined;
                type?: undefined;
                class?: undefined;
                index?: undefined;
                label?: undefined;
                style?: undefined;
                global?: undefined;
                toggle?: undefined;
                stylist?: undefined;
                version?: undefined;
                visible?: undefined;
                dataType?: undefined;
                style_from?: undefined;
                classDataType?: undefined;
                editor_bridge?: undefined;
                preloadEvenet?: undefined;
                container_fonts?: undefined;
                mobile_editable?: undefined;
                desktop_editable?: undefined;
                refreshAllParameter?: undefined;
                refreshComponentParameter?: undefined;
            };
            visible: boolean;
            formData: {};
            def_editable: never[];
            editor_bridge: {};
            preloadEvenet: {};
            mobile_editable: never[];
            refreshAllParameter: {};
            refreshComponentParameter: {};
            list?: undefined;
            class?: undefined;
            style?: undefined;
            stylist?: undefined;
            version?: undefined;
            dataType?: undefined;
            style_from?: undefined;
            classDataType?: undefined;
            container_fonts?: undefined;
            desktop_editable?: undefined;
            storage?: undefined;
            bundle?: undefined;
            share?: undefined;
        };
        image: string;
    } | {
        title: string;
        config: {
            id: string;
            js: string;
            css: {
                class: {};
                style: {};
            };
            data: {
                refer_app: string;
                tag: string;
                list: never[];
                carryData: {};
                refer_form_data: {
                    carry_info: {
                        index: number;
                        title: string;
                        c_v_id: string;
                        toggle: boolean;
                    }[];
                    bo?: undefined;
                    ggg?: undefined;
                    grid?: undefined;
                    size?: undefined;
                    color?: undefined;
                    gap_x?: undefined;
                    gap_y?: undefined;
                    title?: undefined;
                    width?: undefined;
                    border?: undefined;
                    height?: undefined;
                    images?: undefined;
                    margin?: undefined;
                    weight?: undefined;
                    grid_pc?: undefined;
                    justify?: undefined;
                    padding?: undefined;
                    size_pc?: undefined;
                    distance?: undefined;
                    margin_pc?: undefined;
                    grid_phone?: undefined;
                    padding_pc?: undefined;
                    size_phone?: undefined;
                    image_hover?: undefined;
                    border_color?: undefined;
                    margin_phone?: undefined;
                    padding_phone?: undefined;
                    r_1716801819158?: undefined;
                    ccc?: undefined;
                    circle?: undefined;
                    slide_pc?: undefined;
                    slide_phone?: undefined;
                    slide_tablet?: undefined;
                    hint?: undefined;
                    ratio?: undefined;
                    back_img?: undefined;
                    sub_title?: undefined;
                    search_tag?: undefined;
                    "title-size"?: undefined;
                    cover_color?: undefined;
                    theme_color?: undefined;
                    "sub-title-size"?: undefined;
                    image?: undefined;
                    scale?: undefined;
                    random?: undefined;
                    autoplay?: undefined;
                    title_size?: undefined;
                    phone_image?: undefined;
                    banner_height?: undefined;
                    banner_height2?: undefined;
                    r_1718088289110?: undefined;
                    phone_banner_height?: undefined;
                    theme?: undefined;
                    content?: undefined;
                };
                _style_refer_global: {
                    index: string;
                };
                _style_refer: string;
                elem: string;
                inner: string;
                attr: never[];
                _padding: {
                    top?: undefined;
                    left?: undefined;
                    right?: undefined;
                    bottom?: undefined;
                };
                _margin: {};
                _border: {};
                _max_width: string;
                _gap: string;
                _background: string;
                _other: {
                    expand?: undefined;
                };
                _radius: string;
                _reverse: string;
                _hor_position: string;
                _background_setting: {
                    type: string;
                    value?: undefined;
                };
                _gap_x?: undefined;
                _gap_y?: undefined;
                _layout?: undefined;
                setting?: undefined;
                version?: undefined;
                _x_count?: undefined;
                _y_count?: undefined;
                atrExpand?: undefined;
                elemExpand?: undefined;
                _ver_position?: undefined;
                _ratio_layout_value?: undefined;
            };
            type: string;
            class: string;
            index: number;
            label: string;
            style: string;
            bundle: {};
            global: never[];
            toggle: boolean;
            stylist: never[];
            dataType: string;
            style_from: string;
            classDataType: string;
            preloadEvenet: {};
            share: {};
            refreshAllParameter: {};
            editor_bridge: {};
            refreshComponentParameter: {};
            list: never[];
            version: string;
            storage: {};
            mobile: {
                id: string;
                js: string;
                css: {
                    class: {};
                    style: {};
                };
                data: {
                    refer_app: string;
                    _gap?: undefined;
                    attr?: undefined;
                    elem?: undefined;
                    list?: undefined;
                    inner?: undefined;
                    _gap_x?: undefined;
                    _gap_y?: undefined;
                    _other?: undefined;
                    _border?: undefined;
                    _layout?: undefined;
                    _margin?: undefined;
                    _radius?: undefined;
                    setting?: undefined;
                    version?: undefined;
                    _padding?: undefined;
                    _reverse?: undefined;
                    atrExpand?: undefined;
                    _max_width?: undefined;
                    elemExpand?: undefined;
                    _background?: undefined;
                    _style_refer?: undefined;
                    _hor_position?: undefined;
                    _background_setting?: undefined;
                    _ratio_layout_value?: undefined;
                    _style_refer_global?: undefined;
                    refer_form_data?: undefined;
                    _x_count?: undefined;
                    _y_count?: undefined;
                };
                type: string;
                class: string;
                index: number;
                label: string;
                style: string;
                global: never[];
                toggle: boolean;
                stylist: never[];
                dataType: string;
                style_from: string;
                classDataType: string;
                preloadEvenet: {};
                refreshAllParameter: {};
                editor_bridge: {};
                refreshComponentParameter: {};
                list: never[];
                version: string;
                mobile_editable: never[];
                desktop_editable: never[];
                refer: string;
                visible?: undefined;
                def_editable?: undefined;
                container_fonts?: undefined;
            };
            mobile_editable: never[];
            desktop: {
                id: string;
                js: string;
                css: {
                    class: {};
                    style: {};
                };
                data: {
                    refer_app: string;
                    refer_form_data?: undefined;
                };
                type: string;
                class: string;
                index: number;
                label: string;
                style: string;
                global: never[];
                toggle: boolean;
                stylist: never[];
                dataType: string;
                style_from: string;
                classDataType: string;
                preloadEvenet: {};
                refreshAllParameter: {};
                editor_bridge: {};
                refreshComponentParameter: {};
                list: never[];
                version: string;
                mobile_editable: never[];
                desktop_editable: never[];
                refer: string;
                visible?: undefined;
                container_fonts?: undefined;
            };
            desktop_editable: never[];
            container_fonts: number;
            visible?: undefined;
            def_editable?: undefined;
            formData?: undefined;
        };
        image: string;
    } | {
        title: string;
        config: {
            id: string;
            js: string;
            css: {
                class: {};
                style: {};
            };
            data: {
                _gap: string;
                attr: never[];
                elem: string;
                list: never[];
                inner: string;
                _gap_x: string;
                _gap_y: string;
                _other: {
                    expand?: undefined;
                };
                _border: {};
                _layout: string;
                _margin: {};
                _radius: string;
                setting: ({
                    id: string;
                    js: string;
                    css: {
                        class: {};
                        style: {};
                    };
                    data: {
                        tag: string;
                        _gap: string;
                        attr: never[];
                        elem: string;
                        list: never[];
                        inner: string;
                        _other: {};
                        _border: {};
                        _margin: {};
                        _radius: string;
                        _padding: {
                            top?: undefined;
                            left?: undefined;
                            right?: undefined;
                            bottom?: undefined;
                        };
                        _reverse: string;
                        carryData: {};
                        refer_app: string;
                        _max_width: string;
                        _background: string;
                        _style_refer: string;
                        _hor_position: string;
                        refer_form_data: {
                            map: string;
                            width: {
                                unit: string;
                                value: string;
                                number: string;
                            };
                            height: {
                                unit: string;
                                value: string;
                                number: string;
                            };
                        };
                        _background_setting: {
                            type: string;
                            value?: undefined;
                        };
                        _style_refer_global: {
                            index: string;
                        };
                        _gap_x?: undefined;
                        _gap_y?: undefined;
                        _layout?: undefined;
                        setting?: undefined;
                        version?: undefined;
                        _x_count?: undefined;
                        _y_count?: undefined;
                        atrExpand?: undefined;
                        elemExpand?: undefined;
                        _ver_position?: undefined;
                    };
                    list: never[];
                    type: string;
                    class: string;
                    index: number;
                    label: string;
                    style: string;
                    global: never[];
                    mobile: {
                        id: string;
                        js: string;
                        css: {
                            class: {};
                            style: {};
                        };
                        data: {
                            refer_app: string;
                        };
                        list: never[];
                        type: string;
                        class: string;
                        index: number;
                        label: string;
                        style: string;
                        global: never[];
                        toggle: boolean;
                        stylist: never[];
                        version: string;
                        visible: string;
                        dataType: string;
                        style_from: string;
                        classDataType: string;
                        editor_bridge: {};
                        preloadEvenet: {};
                        container_fonts: number;
                        mobile_editable: never[];
                        desktop_editable: never[];
                        refreshAllParameter: {};
                        refreshComponentParameter: {};
                        refer: string;
                    };
                    toggle: boolean;
                    desktop: {
                        id: string;
                        js: string;
                        css: {
                            class: {};
                            style: {};
                        };
                        data: {
                            refer_app: string;
                            refer_form_data: {};
                        };
                        list: never[];
                        type: string;
                        class: string;
                        index: number;
                        label: string;
                        style: string;
                        global: never[];
                        toggle: boolean;
                        stylist: never[];
                        version: string;
                        visible: string;
                        dataType: string;
                        style_from: string;
                        classDataType: string;
                        editor_bridge: {};
                        preloadEvenet: {};
                        container_fonts: number;
                        mobile_editable: never[];
                        desktop_editable: never[];
                        refreshAllParameter: {};
                        refreshComponentParameter: {};
                        refer: string;
                    };
                    stylist: never[];
                    version: string;
                    visible: string;
                    dataType: string;
                    style_from: string;
                    classDataType: string;
                    editor_bridge: {};
                    preloadEvenet: {};
                    container_fonts: number;
                    mobile_editable: never[];
                    desktop_editable: never[];
                    refreshAllParameter: {};
                    refreshComponentParameter: {};
                    formData: {};
                    def_editable?: undefined;
                } | {
                    id: string;
                    js: string;
                    css: {
                        class: {};
                        style: {};
                    };
                    data: {
                        _gap: string;
                        attr: never[];
                        elem: string;
                        list: never[];
                        inner: string;
                        _gap_x: string;
                        _gap_y: string;
                        _other: {};
                        _border: {};
                        _layout: string;
                        _margin: {};
                        _radius: string;
                        setting: ({
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                tag: string;
                                _gap: string;
                                attr: never[];
                                elem: string;
                                list: never[];
                                inner: string;
                                _other: {};
                                _border: {};
                                _margin: {};
                                _radius: string;
                                _padding: {
                                    top?: undefined;
                                    left?: undefined;
                                    right?: undefined;
                                    bottom?: undefined;
                                };
                                _reverse: string;
                                carryData: {};
                                refer_app: string;
                                _max_width: string;
                                _background: string;
                                _style_refer: string;
                                _hor_position: string;
                                refer_form_data: {
                                    kkw: string;
                                    size: string;
                                    color: {
                                        id: string;
                                        title: string;
                                        content: string;
                                        "sec-title": string;
                                        background: string;
                                        "sec-background": string;
                                        "solid-button-bg": string;
                                        "border-button-bg": string;
                                        "solid-button-text": string;
                                        "border-button-text": string;
                                    };
                                    title: string;
                                    margin: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    weight: string;
                                    import_: string;
                                    justify: string;
                                    padding: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    size_pc: string;
                                    distance: {
                                        toggle: boolean;
                                        margin_pc: {
                                            toggle: boolean;
                                        };
                                        padding_pc: {
                                            toggle: boolean;
                                        };
                                        margin_phone: {
                                            toggle: boolean;
                                            top?: undefined;
                                            bottom?: undefined;
                                        };
                                        padding_phone: {
                                            toggle: boolean;
                                        };
                                        margin?: undefined;
                                        padding?: undefined;
                                    };
                                    margin_pc: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    padding_pc: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    size_phone: string;
                                    theme_color: {
                                        id: string;
                                        title: string;
                                        content: string;
                                        background: string;
                                        "solid-button-bg": string;
                                        "border-button-bg": string;
                                        "solid-button-text": string;
                                        "border-button-text": string;
                                    };
                                    margin_phone: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    padding_phone: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    r_1716801819158: {};
                                    r_1718616868830: {
                                        type: string;
                                        value: string;
                                    };
                                    r_1718616877262: {
                                        type: string;
                                        value: string;
                                    };
                                    r_1718616885960: {
                                        type: string;
                                        value: string;
                                    };
                                    link?: undefined;
                                    theme?: undefined;
                                    width?: undefined;
                                    height?: undefined;
                                    radius?: undefined;
                                    "font-size"?: undefined;
                                };
                                _background_setting: {
                                    type: string;
                                };
                                _style_refer_global: {
                                    index: string;
                                };
                            };
                            list: never[];
                            type: string;
                            class: string;
                            index: number;
                            label: string;
                            style: string;
                            global: never[];
                            mobile: {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    refer_app: string;
                                    refer_form_data?: undefined;
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                toggle: boolean;
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                refer: string;
                            };
                            toggle: boolean;
                            desktop: {
                                data: {
                                    refer_app: string;
                                    refer_form_data: {};
                                };
                                refer: string;
                            };
                            stylist: never[];
                            version: string;
                            visible: boolean;
                            dataType: string;
                            style_from: string;
                            classDataType: string;
                            editor_bridge: {};
                            preloadEvenet: {};
                            container_fonts: number;
                            mobile_editable: never[];
                            desktop_editable: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                            formData: {};
                        } | {
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                tag: string;
                                _gap: string;
                                attr: never[];
                                elem: string;
                                list: never[];
                                inner: string;
                                _other: {};
                                _border: {};
                                _margin: {};
                                _radius: string;
                                _padding: {
                                    top?: undefined;
                                    left?: undefined;
                                    right?: undefined;
                                    bottom?: undefined;
                                };
                                _reverse: string;
                                carryData: {};
                                refer_app: string;
                                _max_width: string;
                                _background: string;
                                _style_refer: string;
                                _hor_position: string;
                                refer_form_data: {
                                    kkw: string;
                                    size: string;
                                    color: {
                                        id: string;
                                        title: string;
                                        content: string;
                                        "sec-title": string;
                                        background: string;
                                        "sec-background": string;
                                        "solid-button-bg": string;
                                        "border-button-bg": string;
                                        "solid-button-text": string;
                                        "border-button-text": string;
                                    };
                                    title: string;
                                    margin: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    weight: string;
                                    justify: string;
                                    padding: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    size_pc: string;
                                    distance: {
                                        toggle: boolean;
                                        margin_pc: {
                                            toggle: boolean;
                                        };
                                        padding_pc: {
                                            toggle: boolean;
                                        };
                                        margin_phone: {
                                            top: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        padding_phone: {
                                            toggle?: undefined;
                                        };
                                        margin?: undefined;
                                        padding?: undefined;
                                    };
                                    margin_pc: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    padding_pc: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    size_phone: string;
                                    theme_color: {
                                        id: string;
                                        title: string;
                                        content: string;
                                        background: string;
                                        "solid-button-bg": string;
                                        "border-button-bg": string;
                                        "solid-button-text": string;
                                        "border-button-text": string;
                                    };
                                    margin_phone: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    padding_phone: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    r_1716801819158: {};
                                    r_1718616868830: {
                                        type: string;
                                        value: string;
                                    };
                                    r_1718616877262: {
                                        type: string;
                                        value: string;
                                    };
                                    r_1718616885960: {
                                        type: string;
                                        value: string;
                                    };
                                    import_?: undefined;
                                    link?: undefined;
                                    theme?: undefined;
                                    width?: undefined;
                                    height?: undefined;
                                    radius?: undefined;
                                    "font-size"?: undefined;
                                };
                                _background_setting: {
                                    type: string;
                                };
                                _style_refer_global: {
                                    index: string;
                                };
                            };
                            list: never[];
                            type: string;
                            class: string;
                            index: number;
                            label: string;
                            style: string;
                            global: never[];
                            mobile: {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    refer_app: string;
                                    refer_form_data: {};
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                toggle: boolean;
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                refer: string;
                            };
                            toggle: boolean;
                            desktop: {
                                data: {
                                    refer_app: string;
                                    refer_form_data: {};
                                };
                                refer: string;
                            };
                            stylist: never[];
                            version: string;
                            visible: boolean;
                            dataType: string;
                            style_from: string;
                            classDataType: string;
                            editor_bridge: {};
                            preloadEvenet: {};
                            container_fonts: number;
                            mobile_editable: never[];
                            desktop_editable: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                            formData: {};
                        } | {
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                tag: string;
                                _gap: string;
                                attr: never[];
                                elem: string;
                                list: never[];
                                inner: string;
                                _other: {};
                                _border: {};
                                _margin: {};
                                _radius: string;
                                _padding: {
                                    top?: undefined;
                                    left?: undefined;
                                    right?: undefined;
                                    bottom?: undefined;
                                };
                                _reverse: string;
                                carryData: {};
                                refer_app: string;
                                _max_width: string;
                                _background: string;
                                _style_refer: string;
                                _hor_position: string;
                                refer_form_data: {
                                    kkw: string;
                                    size: string;
                                    color: {
                                        id: string;
                                        title: string;
                                        content: string;
                                        "sec-title": string;
                                        background: string;
                                        "sec-background": string;
                                        "solid-button-bg": string;
                                        "border-button-bg": string;
                                        "solid-button-text": string;
                                        "border-button-text": string;
                                    };
                                    title: string;
                                    margin: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    weight: string;
                                    justify: string;
                                    padding: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    size_pc: string;
                                    distance: {
                                        toggle: boolean;
                                        margin_pc: {
                                            toggle: boolean;
                                        };
                                        padding_pc: {
                                            toggle: boolean;
                                        };
                                        margin_phone: {
                                            top: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        padding_phone: {
                                            toggle?: undefined;
                                        };
                                        margin?: undefined;
                                        padding?: undefined;
                                    };
                                    margin_pc: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    padding_pc: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    size_phone: string;
                                    theme_color: {
                                        id: string;
                                        title: string;
                                        content: string;
                                        background: string;
                                        "solid-button-bg": string;
                                        "border-button-bg": string;
                                        "solid-button-text": string;
                                        "border-button-text": string;
                                    };
                                    margin_phone: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    padding_phone: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    r_1716801819158: {};
                                    r_1718616868830: {
                                        type: string;
                                        value: string;
                                    };
                                    r_1718616877262: {
                                        type: string;
                                        value: string;
                                    };
                                    r_1718616885960: {
                                        type: string;
                                        value: string;
                                    };
                                    import_?: undefined;
                                    link?: undefined;
                                    theme?: undefined;
                                    width?: undefined;
                                    height?: undefined;
                                    radius?: undefined;
                                    "font-size"?: undefined;
                                };
                                _background_setting: {
                                    type: string;
                                };
                                _style_refer_global: {
                                    index: string;
                                };
                            };
                            list: never[];
                            type: string;
                            class: string;
                            index: number;
                            label: string;
                            style: string;
                            global: never[];
                            mobile: {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    refer_app: string;
                                    refer_form_data?: undefined;
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                toggle: boolean;
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                refer: string;
                            };
                            toggle: boolean;
                            desktop: {
                                data: {
                                    refer_app: string;
                                    refer_form_data: {};
                                };
                                refer: string;
                            };
                            stylist: never[];
                            version: string;
                            visible: boolean;
                            dataType: string;
                            style_from: string;
                            classDataType: string;
                            editor_bridge: {};
                            preloadEvenet: {};
                            container_fonts: number;
                            mobile_editable: never[];
                            desktop_editable: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                            formData: {};
                        } | {
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                tag: string;
                                _gap: string;
                                attr: never[];
                                elem: string;
                                list: never[];
                                inner: string;
                                _other: {};
                                _border: {};
                                _margin: {};
                                _radius: string;
                                _padding: {
                                    top: string;
                                    left: string;
                                    right: string;
                                    bottom: string;
                                };
                                _reverse: string;
                                carryData: {};
                                refer_app: string;
                                _max_width: string;
                                _background: string;
                                _style_refer: string;
                                _hor_position: string;
                                refer_form_data: {
                                    link: string;
                                    theme: {
                                        id: string;
                                        title: string;
                                        content: string;
                                        "sec-title": string;
                                        background: string;
                                        "sec-background": string;
                                        "solid-button-bg": string;
                                        "border-button-bg": string;
                                        "solid-button-text": string;
                                        "border-button-text": string;
                                    };
                                    title: string;
                                    width: {
                                        unit: string;
                                        value: string;
                                        number: string;
                                    };
                                    height: {
                                        unit: string;
                                        value: string;
                                        number: string;
                                    };
                                    radius: string;
                                    distance: {
                                        margin: {
                                            top: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        toggle: boolean;
                                        padding: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        margin_pc: {
                                            toggle: boolean;
                                        };
                                        padding_pc: {
                                            toggle: boolean;
                                        };
                                        margin_phone?: undefined;
                                        padding_phone?: undefined;
                                    };
                                    "font-size": string;
                                    kkw?: undefined;
                                    size?: undefined;
                                    color?: undefined;
                                    margin?: undefined;
                                    weight?: undefined;
                                    import_?: undefined;
                                    justify?: undefined;
                                    padding?: undefined;
                                    size_pc?: undefined;
                                    margin_pc?: undefined;
                                    padding_pc?: undefined;
                                    size_phone?: undefined;
                                    theme_color?: undefined;
                                    margin_phone?: undefined;
                                    padding_phone?: undefined;
                                    r_1716801819158?: undefined;
                                    r_1718616868830?: undefined;
                                    r_1718616877262?: undefined;
                                    r_1718616885960?: undefined;
                                };
                                _background_setting: {
                                    type: string;
                                };
                                _style_refer_global: {
                                    index: string;
                                };
                            };
                            list: never[];
                            type: string;
                            class: string;
                            index: number;
                            label: string;
                            style: string;
                            global: never[];
                            mobile: {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    refer_app: string;
                                    refer_form_data?: undefined;
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                toggle: boolean;
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                refer: string;
                            };
                            toggle: boolean;
                            desktop: {
                                data: {
                                    refer_app: string;
                                    refer_form_data: {};
                                };
                                refer: string;
                            };
                            stylist: never[];
                            version: string;
                            visible: boolean;
                            dataType: string;
                            style_from: string;
                            classDataType: string;
                            editor_bridge: {};
                            preloadEvenet: {};
                            container_fonts: number;
                            mobile_editable: never[];
                            desktop_editable: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                            formData: {};
                        })[];
                        version: string;
                        _padding: {
                            top: string;
                            left: string;
                            right: string;
                            bottom: string;
                        };
                        _reverse: string;
                        _x_count: string;
                        _y_count: string;
                        atrExpand: {};
                        _max_width: string;
                        elemExpand: {};
                        _background: string;
                        _style_refer: string;
                        _hor_position: string;
                        _ver_position: string;
                        _background_setting: {
                            type: string;
                            value: string;
                        };
                        _style_refer_global: {
                            index: string;
                        };
                        tag?: undefined;
                        carryData?: undefined;
                        refer_app?: undefined;
                        refer_form_data?: undefined;
                    };
                    type: string;
                    index: number;
                    label: string;
                    global: never[];
                    mobile: {
                        refer: string;
                        id?: undefined;
                        js?: undefined;
                        css?: undefined;
                        data?: undefined;
                        list?: undefined;
                        type?: undefined;
                        class?: undefined;
                        index?: undefined;
                        label?: undefined;
                        style?: undefined;
                        global?: undefined;
                        toggle?: undefined;
                        stylist?: undefined;
                        version?: undefined;
                        visible?: undefined;
                        dataType?: undefined;
                        style_from?: undefined;
                        classDataType?: undefined;
                        editor_bridge?: undefined;
                        preloadEvenet?: undefined;
                        container_fonts?: undefined;
                        mobile_editable?: undefined;
                        desktop_editable?: undefined;
                        refreshAllParameter?: undefined;
                        refreshComponentParameter?: undefined;
                    };
                    toggle: boolean;
                    desktop: {
                        refer: string;
                        id?: undefined;
                        js?: undefined;
                        css?: undefined;
                        data?: undefined;
                        list?: undefined;
                        type?: undefined;
                        class?: undefined;
                        index?: undefined;
                        label?: undefined;
                        style?: undefined;
                        global?: undefined;
                        toggle?: undefined;
                        stylist?: undefined;
                        version?: undefined;
                        visible?: undefined;
                        dataType?: undefined;
                        style_from?: undefined;
                        classDataType?: undefined;
                        editor_bridge?: undefined;
                        preloadEvenet?: undefined;
                        container_fonts?: undefined;
                        mobile_editable?: undefined;
                        desktop_editable?: undefined;
                        refreshAllParameter?: undefined;
                        refreshComponentParameter?: undefined;
                    };
                    visible: boolean;
                    def_editable: never[];
                    editor_bridge: {};
                    preloadEvenet: {};
                    refreshAllParameter: {};
                    refreshComponentParameter: {};
                    formData: {};
                    list?: undefined;
                    class?: undefined;
                    style?: undefined;
                    stylist?: undefined;
                    version?: undefined;
                    dataType?: undefined;
                    style_from?: undefined;
                    classDataType?: undefined;
                    container_fonts?: undefined;
                    mobile_editable?: undefined;
                    desktop_editable?: undefined;
                })[];
                version: string;
                _padding: {
                    top: string;
                    left: string;
                    right: string;
                    bottom: string;
                };
                _reverse: string;
                atrExpand: {};
                _max_width: string;
                elemExpand: {};
                _background: string;
                _style_refer: string;
                _hor_position: string;
                _background_setting: {
                    type: string;
                    value?: undefined;
                };
                _ratio_layout_value: string;
                _style_refer_global: {
                    index: string;
                };
                _x_count?: undefined;
                _y_count?: undefined;
                _ver_position?: undefined;
                tag?: undefined;
                carryData?: undefined;
                refer_app?: undefined;
                refer_form_data?: undefined;
            };
            type: string;
            index: number;
            label: string;
            global: never[];
            mobile: {
                id: string;
                js: string;
                css: {
                    class: {};
                    style: {};
                };
                data: {
                    _gap: string;
                    attr: never[];
                    elem: string;
                    list: never[];
                    inner: string;
                    _gap_x: string;
                    _gap_y: string;
                    _other: {
                        expand?: undefined;
                    };
                    _border: {};
                    _layout: string;
                    _margin: {};
                    _radius: string;
                    setting: ({
                        id: string;
                        js: string;
                        css: {
                            class: {};
                            style: {};
                        };
                        data: {
                            tag: string;
                            _gap: string;
                            attr: never[];
                            elem: string;
                            list: never[];
                            inner: string;
                            _other: {};
                            _border: {};
                            _margin: {};
                            _radius: string;
                            _padding: {
                                top?: undefined;
                                left?: undefined;
                                right?: undefined;
                                bottom?: undefined;
                            };
                            _reverse: string;
                            carryData: {};
                            refer_app: string;
                            _max_width: string;
                            _background: string;
                            _style_refer: string;
                            _hor_position: string;
                            refer_form_data: {
                                map: string;
                                width: {
                                    unit: string;
                                    value: string;
                                    number: string;
                                };
                                height: {
                                    unit: string;
                                    value: string;
                                    number: string;
                                };
                            };
                            _background_setting: {
                                type: string;
                                value?: undefined;
                            };
                            _style_refer_global: {
                                index: string;
                            };
                            _gap_x?: undefined;
                            _gap_y?: undefined;
                            _layout?: undefined;
                            setting?: undefined;
                            version?: undefined;
                            _x_count?: undefined;
                            _y_count?: undefined;
                            atrExpand?: undefined;
                            elemExpand?: undefined;
                            _ver_position?: undefined;
                        };
                        list: never[];
                        type: string;
                        class: string;
                        index: number;
                        label: string;
                        style: string;
                        global: never[];
                        mobile: {
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                refer_app: string;
                            };
                            list: never[];
                            type: string;
                            class: string;
                            index: number;
                            label: string;
                            style: string;
                            global: never[];
                            toggle: boolean;
                            stylist: never[];
                            version: string;
                            visible: string;
                            dataType: string;
                            style_from: string;
                            classDataType: string;
                            editor_bridge: {};
                            preloadEvenet: {};
                            container_fonts: number;
                            mobile_editable: never[];
                            desktop_editable: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                            refer: string;
                        };
                        toggle: boolean;
                        desktop: {
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                refer_app: string;
                                refer_form_data: {};
                            };
                            list: never[];
                            type: string;
                            class: string;
                            index: number;
                            label: string;
                            style: string;
                            global: never[];
                            toggle: boolean;
                            stylist: never[];
                            version: string;
                            visible: string;
                            dataType: string;
                            style_from: string;
                            classDataType: string;
                            editor_bridge: {};
                            preloadEvenet: {};
                            container_fonts: number;
                            mobile_editable: never[];
                            desktop_editable: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                            refer: string;
                        };
                        stylist: never[];
                        version: string;
                        visible: string;
                        dataType: string;
                        style_from: string;
                        classDataType: string;
                        editor_bridge: {};
                        preloadEvenet: {};
                        container_fonts: number;
                        mobile_editable: never[];
                        desktop_editable: never[];
                        refreshAllParameter: {};
                        refreshComponentParameter: {};
                        formData: {};
                        def_editable?: undefined;
                    } | {
                        id: string;
                        js: string;
                        css: {
                            class: {};
                            style: {};
                        };
                        data: {
                            _gap: string;
                            attr: never[];
                            elem: string;
                            list: never[];
                            inner: string;
                            _gap_x: string;
                            _gap_y: string;
                            _other: {};
                            _border: {};
                            _layout: string;
                            _margin: {};
                            _radius: string;
                            setting: ({
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    tag: string;
                                    _gap: string;
                                    attr: never[];
                                    elem: string;
                                    list: never[];
                                    inner: string;
                                    _other: {};
                                    _border: {};
                                    _margin: {};
                                    _radius: string;
                                    _padding: {
                                        top?: undefined;
                                        left?: undefined;
                                        right?: undefined;
                                        bottom?: undefined;
                                    };
                                    _reverse: string;
                                    carryData: {};
                                    refer_app: string;
                                    _max_width: string;
                                    _background: string;
                                    _style_refer: string;
                                    _hor_position: string;
                                    refer_form_data: {
                                        kkw: string;
                                        size: string;
                                        color: {
                                            id: string;
                                            title: string;
                                            content: string;
                                            "sec-title": string;
                                            background: string;
                                            "sec-background": string;
                                            "solid-button-bg": string;
                                            "border-button-bg": string;
                                            "solid-button-text": string;
                                            "border-button-text": string;
                                        };
                                        title: string;
                                        margin: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        weight: string;
                                        import_: string;
                                        justify: string;
                                        padding: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        size_pc: string;
                                        distance: {
                                            toggle: boolean;
                                            margin_pc: {
                                                toggle: boolean;
                                            };
                                            padding_pc: {
                                                toggle: boolean;
                                            };
                                            margin_phone: {
                                                toggle: boolean;
                                                top?: undefined;
                                                bottom?: undefined;
                                            };
                                            padding_phone: {
                                                toggle: boolean;
                                            };
                                            margin?: undefined;
                                            padding?: undefined;
                                        };
                                        margin_pc: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        padding_pc: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        size_phone: string;
                                        theme_color: {
                                            id: string;
                                            title: string;
                                            content: string;
                                            background: string;
                                            "solid-button-bg": string;
                                            "border-button-bg": string;
                                            "solid-button-text": string;
                                            "border-button-text": string;
                                        };
                                        margin_phone: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        padding_phone: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        r_1716801819158: {};
                                        r_1718616868830: {
                                            type: string;
                                            value: string;
                                        };
                                        r_1718616877262: {
                                            type: string;
                                            value: string;
                                        };
                                        r_1718616885960: {
                                            type: string;
                                            value: string;
                                        };
                                        link?: undefined;
                                        theme?: undefined;
                                        width?: undefined;
                                        height?: undefined;
                                        radius?: undefined;
                                        "font-size"?: undefined;
                                    };
                                    _background_setting: {
                                        type: string;
                                    };
                                    _style_refer_global: {
                                        index: string;
                                    };
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                mobile: {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        refer_app: string;
                                        refer_form_data?: undefined;
                                    };
                                    list: never[];
                                    type: string;
                                    class: string;
                                    index: number;
                                    label: string;
                                    style: string;
                                    global: never[];
                                    toggle: boolean;
                                    stylist: never[];
                                    version: string;
                                    visible: boolean;
                                    dataType: string;
                                    style_from: string;
                                    classDataType: string;
                                    editor_bridge: {};
                                    preloadEvenet: {};
                                    container_fonts: number;
                                    mobile_editable: never[];
                                    desktop_editable: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                    refer: string;
                                };
                                toggle: boolean;
                                desktop: {
                                    data: {
                                        refer_app: string;
                                        refer_form_data: {};
                                    };
                                    refer: string;
                                };
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                formData: {};
                            } | {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    tag: string;
                                    _gap: string;
                                    attr: never[];
                                    elem: string;
                                    list: never[];
                                    inner: string;
                                    _other: {};
                                    _border: {};
                                    _margin: {};
                                    _radius: string;
                                    _padding: {
                                        top?: undefined;
                                        left?: undefined;
                                        right?: undefined;
                                        bottom?: undefined;
                                    };
                                    _reverse: string;
                                    carryData: {};
                                    refer_app: string;
                                    _max_width: string;
                                    _background: string;
                                    _style_refer: string;
                                    _hor_position: string;
                                    refer_form_data: {
                                        kkw: string;
                                        size: string;
                                        color: {
                                            id: string;
                                            title: string;
                                            content: string;
                                            "sec-title": string;
                                            background: string;
                                            "sec-background": string;
                                            "solid-button-bg": string;
                                            "border-button-bg": string;
                                            "solid-button-text": string;
                                            "border-button-text": string;
                                        };
                                        title: string;
                                        margin: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        weight: string;
                                        justify: string;
                                        padding: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        size_pc: string;
                                        distance: {
                                            toggle: boolean;
                                            margin_pc: {
                                                toggle: boolean;
                                            };
                                            padding_pc: {
                                                toggle: boolean;
                                            };
                                            margin_phone: {
                                                top: string;
                                                bottom: string;
                                                toggle: boolean;
                                            };
                                            padding_phone: {
                                                toggle?: undefined;
                                            };
                                            margin?: undefined;
                                            padding?: undefined;
                                        };
                                        margin_pc: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        padding_pc: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        size_phone: string;
                                        theme_color: {
                                            id: string;
                                            title: string;
                                            content: string;
                                            background: string;
                                            "solid-button-bg": string;
                                            "border-button-bg": string;
                                            "solid-button-text": string;
                                            "border-button-text": string;
                                        };
                                        margin_phone: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        padding_phone: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        r_1716801819158: {};
                                        r_1718616868830: {
                                            type: string;
                                            value: string;
                                        };
                                        r_1718616877262: {
                                            type: string;
                                            value: string;
                                        };
                                        r_1718616885960: {
                                            type: string;
                                            value: string;
                                        };
                                        import_?: undefined;
                                        link?: undefined;
                                        theme?: undefined;
                                        width?: undefined;
                                        height?: undefined;
                                        radius?: undefined;
                                        "font-size"?: undefined;
                                    };
                                    _background_setting: {
                                        type: string;
                                    };
                                    _style_refer_global: {
                                        index: string;
                                    };
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                mobile: {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        refer_app: string;
                                        refer_form_data: {};
                                    };
                                    list: never[];
                                    type: string;
                                    class: string;
                                    index: number;
                                    label: string;
                                    style: string;
                                    global: never[];
                                    toggle: boolean;
                                    stylist: never[];
                                    version: string;
                                    visible: boolean;
                                    dataType: string;
                                    style_from: string;
                                    classDataType: string;
                                    editor_bridge: {};
                                    preloadEvenet: {};
                                    container_fonts: number;
                                    mobile_editable: never[];
                                    desktop_editable: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                    refer: string;
                                };
                                toggle: boolean;
                                desktop: {
                                    data: {
                                        refer_app: string;
                                        refer_form_data: {};
                                    };
                                    refer: string;
                                };
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                formData: {};
                            } | {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    tag: string;
                                    _gap: string;
                                    attr: never[];
                                    elem: string;
                                    list: never[];
                                    inner: string;
                                    _other: {};
                                    _border: {};
                                    _margin: {};
                                    _radius: string;
                                    _padding: {
                                        top?: undefined;
                                        left?: undefined;
                                        right?: undefined;
                                        bottom?: undefined;
                                    };
                                    _reverse: string;
                                    carryData: {};
                                    refer_app: string;
                                    _max_width: string;
                                    _background: string;
                                    _style_refer: string;
                                    _hor_position: string;
                                    refer_form_data: {
                                        kkw: string;
                                        size: string;
                                        color: {
                                            id: string;
                                            title: string;
                                            content: string;
                                            "sec-title": string;
                                            background: string;
                                            "sec-background": string;
                                            "solid-button-bg": string;
                                            "border-button-bg": string;
                                            "solid-button-text": string;
                                            "border-button-text": string;
                                        };
                                        title: string;
                                        margin: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        weight: string;
                                        justify: string;
                                        padding: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        size_pc: string;
                                        distance: {
                                            toggle: boolean;
                                            margin_pc: {
                                                toggle: boolean;
                                            };
                                            padding_pc: {
                                                toggle: boolean;
                                            };
                                            margin_phone: {
                                                top: string;
                                                bottom: string;
                                                toggle: boolean;
                                            };
                                            padding_phone: {
                                                toggle?: undefined;
                                            };
                                            margin?: undefined;
                                            padding?: undefined;
                                        };
                                        margin_pc: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        padding_pc: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        size_phone: string;
                                        theme_color: {
                                            id: string;
                                            title: string;
                                            content: string;
                                            background: string;
                                            "solid-button-bg": string;
                                            "border-button-bg": string;
                                            "solid-button-text": string;
                                            "border-button-text": string;
                                        };
                                        margin_phone: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        padding_phone: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        r_1716801819158: {};
                                        r_1718616868830: {
                                            type: string;
                                            value: string;
                                        };
                                        r_1718616877262: {
                                            type: string;
                                            value: string;
                                        };
                                        r_1718616885960: {
                                            type: string;
                                            value: string;
                                        };
                                        import_?: undefined;
                                        link?: undefined;
                                        theme?: undefined;
                                        width?: undefined;
                                        height?: undefined;
                                        radius?: undefined;
                                        "font-size"?: undefined;
                                    };
                                    _background_setting: {
                                        type: string;
                                    };
                                    _style_refer_global: {
                                        index: string;
                                    };
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                mobile: {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        refer_app: string;
                                        refer_form_data?: undefined;
                                    };
                                    list: never[];
                                    type: string;
                                    class: string;
                                    index: number;
                                    label: string;
                                    style: string;
                                    global: never[];
                                    toggle: boolean;
                                    stylist: never[];
                                    version: string;
                                    visible: boolean;
                                    dataType: string;
                                    style_from: string;
                                    classDataType: string;
                                    editor_bridge: {};
                                    preloadEvenet: {};
                                    container_fonts: number;
                                    mobile_editable: never[];
                                    desktop_editable: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                    refer: string;
                                };
                                toggle: boolean;
                                desktop: {
                                    data: {
                                        refer_app: string;
                                        refer_form_data: {};
                                    };
                                    refer: string;
                                };
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                formData: {};
                            } | {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    tag: string;
                                    _gap: string;
                                    attr: never[];
                                    elem: string;
                                    list: never[];
                                    inner: string;
                                    _other: {};
                                    _border: {};
                                    _margin: {};
                                    _radius: string;
                                    _padding: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                    };
                                    _reverse: string;
                                    carryData: {};
                                    refer_app: string;
                                    _max_width: string;
                                    _background: string;
                                    _style_refer: string;
                                    _hor_position: string;
                                    refer_form_data: {
                                        link: string;
                                        theme: {
                                            id: string;
                                            title: string;
                                            content: string;
                                            "sec-title": string;
                                            background: string;
                                            "sec-background": string;
                                            "solid-button-bg": string;
                                            "border-button-bg": string;
                                            "solid-button-text": string;
                                            "border-button-text": string;
                                        };
                                        title: string;
                                        width: {
                                            unit: string;
                                            value: string;
                                            number: string;
                                        };
                                        height: {
                                            unit: string;
                                            value: string;
                                            number: string;
                                        };
                                        radius: string;
                                        distance: {
                                            margin: {
                                                top: string;
                                                bottom: string;
                                                toggle: boolean;
                                            };
                                            toggle: boolean;
                                            padding: {
                                                top: string;
                                                left: string;
                                                right: string;
                                                bottom: string;
                                                toggle: boolean;
                                            };
                                            margin_pc: {
                                                toggle: boolean;
                                            };
                                            padding_pc: {
                                                toggle: boolean;
                                            };
                                            margin_phone?: undefined;
                                            padding_phone?: undefined;
                                        };
                                        "font-size": string;
                                        kkw?: undefined;
                                        size?: undefined;
                                        color?: undefined;
                                        margin?: undefined;
                                        weight?: undefined;
                                        import_?: undefined;
                                        justify?: undefined;
                                        padding?: undefined;
                                        size_pc?: undefined;
                                        margin_pc?: undefined;
                                        padding_pc?: undefined;
                                        size_phone?: undefined;
                                        theme_color?: undefined;
                                        margin_phone?: undefined;
                                        padding_phone?: undefined;
                                        r_1716801819158?: undefined;
                                        r_1718616868830?: undefined;
                                        r_1718616877262?: undefined;
                                        r_1718616885960?: undefined;
                                    };
                                    _background_setting: {
                                        type: string;
                                    };
                                    _style_refer_global: {
                                        index: string;
                                    };
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                mobile: {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        refer_app: string;
                                        refer_form_data?: undefined;
                                    };
                                    list: never[];
                                    type: string;
                                    class: string;
                                    index: number;
                                    label: string;
                                    style: string;
                                    global: never[];
                                    toggle: boolean;
                                    stylist: never[];
                                    version: string;
                                    visible: boolean;
                                    dataType: string;
                                    style_from: string;
                                    classDataType: string;
                                    editor_bridge: {};
                                    preloadEvenet: {};
                                    container_fonts: number;
                                    mobile_editable: never[];
                                    desktop_editable: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                    refer: string;
                                };
                                toggle: boolean;
                                desktop: {
                                    data: {
                                        refer_app: string;
                                        refer_form_data: {};
                                    };
                                    refer: string;
                                };
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                formData: {};
                            })[];
                            version: string;
                            _padding: {
                                top: string;
                                left: string;
                                right: string;
                                bottom: string;
                            };
                            _reverse: string;
                            _x_count: string;
                            _y_count: string;
                            atrExpand: {};
                            _max_width: string;
                            elemExpand: {};
                            _background: string;
                            _style_refer: string;
                            _hor_position: string;
                            _ver_position: string;
                            _background_setting: {
                                type: string;
                                value: string;
                            };
                            _style_refer_global: {
                                index: string;
                            };
                            tag?: undefined;
                            carryData?: undefined;
                            refer_app?: undefined;
                            refer_form_data?: undefined;
                        };
                        type: string;
                        index: number;
                        label: string;
                        global: never[];
                        mobile: {
                            refer: string;
                            id?: undefined;
                            js?: undefined;
                            css?: undefined;
                            data?: undefined;
                            list?: undefined;
                            type?: undefined;
                            class?: undefined;
                            index?: undefined;
                            label?: undefined;
                            style?: undefined;
                            global?: undefined;
                            toggle?: undefined;
                            stylist?: undefined;
                            version?: undefined;
                            visible?: undefined;
                            dataType?: undefined;
                            style_from?: undefined;
                            classDataType?: undefined;
                            editor_bridge?: undefined;
                            preloadEvenet?: undefined;
                            container_fonts?: undefined;
                            mobile_editable?: undefined;
                            desktop_editable?: undefined;
                            refreshAllParameter?: undefined;
                            refreshComponentParameter?: undefined;
                        };
                        toggle: boolean;
                        desktop: {
                            refer: string;
                            id?: undefined;
                            js?: undefined;
                            css?: undefined;
                            data?: undefined;
                            list?: undefined;
                            type?: undefined;
                            class?: undefined;
                            index?: undefined;
                            label?: undefined;
                            style?: undefined;
                            global?: undefined;
                            toggle?: undefined;
                            stylist?: undefined;
                            version?: undefined;
                            visible?: undefined;
                            dataType?: undefined;
                            style_from?: undefined;
                            classDataType?: undefined;
                            editor_bridge?: undefined;
                            preloadEvenet?: undefined;
                            container_fonts?: undefined;
                            mobile_editable?: undefined;
                            desktop_editable?: undefined;
                            refreshAllParameter?: undefined;
                            refreshComponentParameter?: undefined;
                        };
                        visible: boolean;
                        def_editable: never[];
                        editor_bridge: {};
                        preloadEvenet: {};
                        refreshAllParameter: {};
                        refreshComponentParameter: {};
                        formData: {};
                        list?: undefined;
                        class?: undefined;
                        style?: undefined;
                        stylist?: undefined;
                        version?: undefined;
                        dataType?: undefined;
                        style_from?: undefined;
                        classDataType?: undefined;
                        container_fonts?: undefined;
                        mobile_editable?: undefined;
                        desktop_editable?: undefined;
                    })[];
                    version: string;
                    _padding: {
                        top: string;
                        left: string;
                        right: string;
                        bottom: string;
                    };
                    _reverse: string;
                    atrExpand: {};
                    _max_width: string;
                    elemExpand: {};
                    _background: string;
                    _style_refer: string;
                    _hor_position: string;
                    _background_setting: {
                        type: string;
                    };
                    _ratio_layout_value: string;
                    _style_refer_global: {
                        index: string;
                    };
                    refer_app?: undefined;
                    refer_form_data?: undefined;
                    _x_count?: undefined;
                    _y_count?: undefined;
                };
                type: string;
                index: number;
                label: string;
                global: never[];
                toggle: boolean;
                visible: boolean;
                def_editable: never[];
                editor_bridge: {};
                preloadEvenet: {};
                mobile_editable: never[];
                refreshAllParameter: {};
                refreshComponentParameter: {};
                refer: string;
                list?: undefined;
                class?: undefined;
                style?: undefined;
                stylist?: undefined;
                version?: undefined;
                dataType?: undefined;
                style_from?: undefined;
                classDataType?: undefined;
                container_fonts?: undefined;
                desktop_editable?: undefined;
            };
            toggle: boolean;
            desktop: {
                refer: string;
                id?: undefined;
                js?: undefined;
                css?: undefined;
                data?: undefined;
                list?: undefined;
                type?: undefined;
                class?: undefined;
                index?: undefined;
                label?: undefined;
                style?: undefined;
                global?: undefined;
                toggle?: undefined;
                stylist?: undefined;
                version?: undefined;
                visible?: undefined;
                dataType?: undefined;
                style_from?: undefined;
                classDataType?: undefined;
                editor_bridge?: undefined;
                preloadEvenet?: undefined;
                container_fonts?: undefined;
                mobile_editable?: undefined;
                desktop_editable?: undefined;
                refreshAllParameter?: undefined;
                refreshComponentParameter?: undefined;
            };
            visible: boolean;
            def_editable: never[];
            editor_bridge: {};
            preloadEvenet: {};
            mobile_editable: never[];
            refreshAllParameter: {};
            refreshComponentParameter: {};
            formData: {};
            list?: undefined;
            class?: undefined;
            style?: undefined;
            stylist?: undefined;
            version?: undefined;
            dataType?: undefined;
            style_from?: undefined;
            classDataType?: undefined;
            container_fonts?: undefined;
            desktop_editable?: undefined;
            storage?: undefined;
            bundle?: undefined;
            share?: undefined;
        };
        image: string;
    })[];
    static productList: ({
        title: string;
        config: {
            id: string;
            js: string;
            css: {
                class: {};
                style: {};
            };
            data: {
                _gap: string;
                attr: never[];
                elem: string;
                list: never[];
                inner: string;
                _gap_x: string;
                _gap_y: string;
                _other: {};
                _border: {};
                _layout: string;
                _margin: {};
                _radius: string;
                setting: ({
                    id: string;
                    js: string;
                    css: {
                        class: {};
                        style: {};
                    };
                    data: {
                        tag: string;
                        _gap: string;
                        attr: never[];
                        elem: string;
                        list: never[];
                        inner: string;
                        _other: {};
                        _border: {};
                        _margin: {};
                        _radius: string;
                        _padding: {
                            top?: undefined;
                            left?: undefined;
                            right?: undefined;
                            bottom?: undefined;
                        };
                        _reverse: string;
                        carryData: {};
                        refer_app: string;
                        _max_width: string;
                        _background: string;
                        _style_refer: string;
                        _hor_position: string;
                        refer_form_data: {
                            list: {
                                id: number;
                                index: number;
                                c_v_id: string;
                                toggle: boolean;
                                product_title: string;
                            }[];
                            more: string;
                            count: string;
                            list2: {
                                toggle: boolean;
                                product2dds: number;
                            }[];
                            title: string;
                            distance: {
                                toggle: boolean;
                                margin_pc: {
                                    top: string;
                                    left: string;
                                    right: string;
                                    bottom: string;
                                    toggle: boolean;
                                };
                                padding_pc: {
                                    toggle: boolean;
                                };
                                margin_phone: {
                                    toggle: boolean;
                                };
                                padding_phone: {};
                            };
                            font_size: string;
                            font_color: string;
                            more_title: string;
                            button_color: string;
                            mobile_count: string;
                            desktop_count: string;
                            product_select: {
                                value: never[];
                                select: string;
                            };
                            button_bg_color: string;
                            r_1714145557038: never[];
                        };
                        _background_setting: {
                            type: string;
                            value?: undefined;
                        };
                        _style_refer_global: {
                            index: string;
                        };
                        _gap_x?: undefined;
                        _gap_y?: undefined;
                        _layout?: undefined;
                        setting?: undefined;
                        version?: undefined;
                        _x_count?: undefined;
                        _y_count?: undefined;
                        atrExpand?: undefined;
                        elemExpand?: undefined;
                        _ver_position?: undefined;
                    };
                    list: never[];
                    type: string;
                    class: string;
                    index: number;
                    label: string;
                    style: string;
                    global: never[];
                    mobile: {
                        id: string;
                        js: string;
                        css: {
                            class: {};
                            style: {};
                        };
                        data: {
                            refer_app: string;
                        };
                        list: never[];
                        type: string;
                        class: string;
                        index: number;
                        label: string;
                        style: string;
                        global: never[];
                        toggle: boolean;
                        stylist: never[];
                        version: string;
                        visible: string;
                        dataType: string;
                        style_from: string;
                        classDataType: string;
                        editor_bridge: {};
                        preloadEvenet: {};
                        container_fonts: number;
                        mobile_editable: never[];
                        desktop_editable: never[];
                        refreshAllParameter: {};
                        refreshComponentParameter: {};
                        refer: string;
                    };
                    toggle: boolean;
                    desktop: {
                        id: string;
                        js: string;
                        css: {
                            class: {};
                            style: {};
                        };
                        data: {
                            refer_app: string;
                        };
                        list: never[];
                        type: string;
                        class: string;
                        index: number;
                        label: string;
                        style: string;
                        global: never[];
                        toggle: boolean;
                        stylist: never[];
                        version: string;
                        visible: string;
                        dataType: string;
                        style_from: string;
                        classDataType: string;
                        editor_bridge: {};
                        preloadEvenet: {};
                        container_fonts: number;
                        mobile_editable: never[];
                        desktop_editable: never[];
                        refreshAllParameter: {};
                        refreshComponentParameter: {};
                        refer: string;
                    };
                    stylist: never[];
                    version: string;
                    visible: string;
                    dataType: string;
                    style_from: string;
                    classDataType: string;
                    editor_bridge: {};
                    preloadEvenet: {};
                    container_fonts: number;
                    mobile_editable: never[];
                    desktop_editable: never[];
                    refreshAllParameter: {};
                    refreshComponentParameter: {};
                    formData: {};
                    def_editable?: undefined;
                } | {
                    id: string;
                    js: string;
                    css: {
                        class: {};
                        style: {};
                    };
                    data: {
                        _gap: string;
                        attr: never[];
                        elem: string;
                        list: never[];
                        inner: string;
                        _gap_x: string;
                        _gap_y: string;
                        _other: {};
                        _border: {};
                        _layout: string;
                        _margin: {};
                        _radius: string;
                        setting: ({
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                tag: string;
                                _gap: string;
                                attr: never[];
                                elem: string;
                                list: never[];
                                inner: string;
                                _other: {};
                                _border: {};
                                _margin: {};
                                _radius: string;
                                _padding: {
                                    top?: undefined;
                                    left?: undefined;
                                    right?: undefined;
                                    bottom?: undefined;
                                };
                                _reverse: string;
                                carryData: {};
                                refer_app: string;
                                _max_width: string;
                                _background: string;
                                _style_refer: string;
                                _hor_position: string;
                                refer_form_data: {
                                    kkw: string;
                                    size: string;
                                    color: {
                                        id: string;
                                        title: string;
                                        content: string;
                                        "sec-title": string;
                                        background: string;
                                        "sec-background": string;
                                        "solid-button-bg": string;
                                        "border-button-bg": string;
                                        "solid-button-text": string;
                                        "border-button-text": string;
                                    };
                                    title: string;
                                    margin: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    weight: string;
                                    import_: string;
                                    justify: string;
                                    padding: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    size_pc: string;
                                    distance: {
                                        toggle: boolean;
                                        margin_pc: {
                                            toggle: boolean;
                                        };
                                        padding_pc: {
                                            toggle: boolean;
                                        };
                                        margin_phone: {
                                            toggle: boolean;
                                            top?: undefined;
                                            bottom?: undefined;
                                        };
                                        padding_phone: {
                                            toggle: boolean;
                                        };
                                        margin?: undefined;
                                        padding?: undefined;
                                    };
                                    margin_pc: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    padding_pc: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    size_phone: string;
                                    theme_color: {
                                        id: string;
                                        title: string;
                                        content: string;
                                        background: string;
                                        "solid-button-bg": string;
                                        "border-button-bg": string;
                                        "solid-button-text": string;
                                        "border-button-text": string;
                                    };
                                    margin_phone: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    padding_phone: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    r_1716801819158: {};
                                    r_1718616868830: {
                                        type: string;
                                        value: string;
                                    };
                                    r_1718616877262: {
                                        type: string;
                                        value: string;
                                    };
                                    r_1718616885960: {
                                        type: string;
                                        value: string;
                                    };
                                    link?: undefined;
                                    theme?: undefined;
                                    width?: undefined;
                                    height?: undefined;
                                    radius?: undefined;
                                    "font-size"?: undefined;
                                };
                                _background_setting: {
                                    type: string;
                                };
                                _style_refer_global: {
                                    index: string;
                                };
                            };
                            list: never[];
                            type: string;
                            class: string;
                            index: number;
                            label: string;
                            style: string;
                            global: never[];
                            mobile: {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    refer_app: string;
                                    refer_form_data?: undefined;
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                toggle: boolean;
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                refer: string;
                            };
                            toggle: boolean;
                            desktop: {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    refer_app: string;
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                toggle: boolean;
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                refer: string;
                            };
                            stylist: never[];
                            version: string;
                            visible: boolean;
                            dataType: string;
                            style_from: string;
                            classDataType: string;
                            editor_bridge: {};
                            preloadEvenet: {};
                            container_fonts: number;
                            mobile_editable: never[];
                            desktop_editable: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                            formData: {};
                        } | {
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                tag: string;
                                _gap: string;
                                attr: never[];
                                elem: string;
                                list: never[];
                                inner: string;
                                _other: {};
                                _border: {};
                                _margin: {};
                                _radius: string;
                                _padding: {
                                    top?: undefined;
                                    left?: undefined;
                                    right?: undefined;
                                    bottom?: undefined;
                                };
                                _reverse: string;
                                carryData: {};
                                refer_app: string;
                                _max_width: string;
                                _background: string;
                                _style_refer: string;
                                _hor_position: string;
                                refer_form_data: {
                                    kkw: string;
                                    size: string;
                                    color: {
                                        id: string;
                                        title: string;
                                        content: string;
                                        "sec-title": string;
                                        background: string;
                                        "sec-background": string;
                                        "solid-button-bg": string;
                                        "border-button-bg": string;
                                        "solid-button-text": string;
                                        "border-button-text": string;
                                    };
                                    title: string;
                                    margin: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    weight: string;
                                    justify: string;
                                    padding: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    size_pc: string;
                                    distance: {
                                        toggle: boolean;
                                        margin_pc: {
                                            toggle: boolean;
                                        };
                                        padding_pc: {
                                            toggle: boolean;
                                        };
                                        margin_phone: {
                                            top: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        padding_phone: {
                                            toggle?: undefined;
                                        };
                                        margin?: undefined;
                                        padding?: undefined;
                                    };
                                    margin_pc: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    padding_pc: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    size_phone: string;
                                    theme_color: {
                                        id: string;
                                        title: string;
                                        content: string;
                                        background: string;
                                        "solid-button-bg": string;
                                        "border-button-bg": string;
                                        "solid-button-text": string;
                                        "border-button-text": string;
                                    };
                                    margin_phone: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    padding_phone: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    r_1716801819158: {};
                                    r_1718616868830: {
                                        type: string;
                                        value: string;
                                    };
                                    r_1718616877262: {
                                        type: string;
                                        value: string;
                                    };
                                    r_1718616885960: {
                                        type: string;
                                        value: string;
                                    };
                                    import_?: undefined;
                                    link?: undefined;
                                    theme?: undefined;
                                    width?: undefined;
                                    height?: undefined;
                                    radius?: undefined;
                                    "font-size"?: undefined;
                                };
                                _background_setting: {
                                    type: string;
                                };
                                _style_refer_global: {
                                    index: string;
                                };
                            };
                            list: never[];
                            type: string;
                            class: string;
                            index: number;
                            label: string;
                            style: string;
                            global: never[];
                            mobile: {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    refer_app: string;
                                    refer_form_data: {};
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                toggle: boolean;
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                refer: string;
                            };
                            toggle: boolean;
                            desktop: {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    refer_app: string;
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                toggle: boolean;
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                refer: string;
                            };
                            stylist: never[];
                            version: string;
                            visible: boolean;
                            dataType: string;
                            style_from: string;
                            classDataType: string;
                            editor_bridge: {};
                            preloadEvenet: {};
                            container_fonts: number;
                            mobile_editable: never[];
                            desktop_editable: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                            formData: {};
                        } | {
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                tag: string;
                                _gap: string;
                                attr: never[];
                                elem: string;
                                list: never[];
                                inner: string;
                                _other: {};
                                _border: {};
                                _margin: {};
                                _radius: string;
                                _padding: {
                                    top?: undefined;
                                    left?: undefined;
                                    right?: undefined;
                                    bottom?: undefined;
                                };
                                _reverse: string;
                                carryData: {};
                                refer_app: string;
                                _max_width: string;
                                _background: string;
                                _style_refer: string;
                                _hor_position: string;
                                refer_form_data: {
                                    kkw: string;
                                    size: string;
                                    color: {
                                        id: string;
                                        title: string;
                                        content: string;
                                        "sec-title": string;
                                        background: string;
                                        "sec-background": string;
                                        "solid-button-bg": string;
                                        "border-button-bg": string;
                                        "solid-button-text": string;
                                        "border-button-text": string;
                                    };
                                    title: string;
                                    margin: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    weight: string;
                                    justify: string;
                                    padding: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    size_pc: string;
                                    distance: {
                                        toggle: boolean;
                                        margin_pc: {
                                            toggle: boolean;
                                        };
                                        padding_pc: {
                                            toggle: boolean;
                                        };
                                        margin_phone: {
                                            top: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        padding_phone: {
                                            toggle?: undefined;
                                        };
                                        margin?: undefined;
                                        padding?: undefined;
                                    };
                                    margin_pc: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    padding_pc: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    size_phone: string;
                                    theme_color: {
                                        id: string;
                                        title: string;
                                        content: string;
                                        background: string;
                                        "solid-button-bg": string;
                                        "border-button-bg": string;
                                        "solid-button-text": string;
                                        "border-button-text": string;
                                    };
                                    margin_phone: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    padding_phone: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    r_1716801819158: {};
                                    r_1718616868830: {
                                        type: string;
                                        value: string;
                                    };
                                    r_1718616877262: {
                                        type: string;
                                        value: string;
                                    };
                                    r_1718616885960: {
                                        type: string;
                                        value: string;
                                    };
                                    import_?: undefined;
                                    link?: undefined;
                                    theme?: undefined;
                                    width?: undefined;
                                    height?: undefined;
                                    radius?: undefined;
                                    "font-size"?: undefined;
                                };
                                _background_setting: {
                                    type: string;
                                };
                                _style_refer_global: {
                                    index: string;
                                };
                            };
                            list: never[];
                            type: string;
                            class: string;
                            index: number;
                            label: string;
                            style: string;
                            global: never[];
                            mobile: {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    refer_app: string;
                                    refer_form_data?: undefined;
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                toggle: boolean;
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                refer: string;
                            };
                            toggle: boolean;
                            desktop: {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    refer_app: string;
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                toggle: boolean;
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                refer: string;
                            };
                            stylist: never[];
                            version: string;
                            visible: boolean;
                            dataType: string;
                            style_from: string;
                            classDataType: string;
                            editor_bridge: {};
                            preloadEvenet: {};
                            container_fonts: number;
                            mobile_editable: never[];
                            desktop_editable: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                            formData: {};
                        } | {
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                tag: string;
                                _gap: string;
                                attr: never[];
                                elem: string;
                                list: never[];
                                inner: string;
                                _other: {};
                                _border: {};
                                _margin: {};
                                _radius: string;
                                _padding: {
                                    top: string;
                                    left: string;
                                    right: string;
                                    bottom: string;
                                };
                                _reverse: string;
                                carryData: {};
                                refer_app: string;
                                _max_width: string;
                                _background: string;
                                _style_refer: string;
                                _hor_position: string;
                                refer_form_data: {
                                    link: string;
                                    theme: {
                                        id: string;
                                        title: string;
                                        content: string;
                                        "sec-title": string;
                                        background: string;
                                        "sec-background": string;
                                        "solid-button-bg": string;
                                        "border-button-bg": string;
                                        "solid-button-text": string;
                                        "border-button-text": string;
                                    };
                                    title: string;
                                    width: {
                                        unit: string;
                                        value: string;
                                        number: string;
                                    };
                                    height: {
                                        unit: string;
                                        value: string;
                                        number: string;
                                    };
                                    radius: string;
                                    distance: {
                                        margin: {
                                            top: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        toggle: boolean;
                                        padding: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        margin_pc: {
                                            toggle: boolean;
                                        };
                                        padding_pc: {
                                            toggle: boolean;
                                        };
                                        margin_phone?: undefined;
                                        padding_phone?: undefined;
                                    };
                                    "font-size": string;
                                    kkw?: undefined;
                                    size?: undefined;
                                    color?: undefined;
                                    margin?: undefined;
                                    weight?: undefined;
                                    import_?: undefined;
                                    justify?: undefined;
                                    padding?: undefined;
                                    size_pc?: undefined;
                                    margin_pc?: undefined;
                                    padding_pc?: undefined;
                                    size_phone?: undefined;
                                    theme_color?: undefined;
                                    margin_phone?: undefined;
                                    padding_phone?: undefined;
                                    r_1716801819158?: undefined;
                                    r_1718616868830?: undefined;
                                    r_1718616877262?: undefined;
                                    r_1718616885960?: undefined;
                                };
                                _background_setting: {
                                    type: string;
                                };
                                _style_refer_global: {
                                    index: string;
                                };
                            };
                            list: never[];
                            type: string;
                            class: string;
                            index: number;
                            label: string;
                            style: string;
                            global: never[];
                            mobile: {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    refer_app: string;
                                    refer_form_data?: undefined;
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                toggle: boolean;
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                refer: string;
                            };
                            toggle: boolean;
                            desktop: {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    refer_app: string;
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                toggle: boolean;
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                refer: string;
                            };
                            stylist: never[];
                            version: string;
                            visible: boolean;
                            dataType: string;
                            style_from: string;
                            classDataType: string;
                            editor_bridge: {};
                            preloadEvenet: {};
                            container_fonts: number;
                            mobile_editable: never[];
                            desktop_editable: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                            formData: {};
                        })[];
                        version: string;
                        _padding: {
                            top: string;
                            left: string;
                            right: string;
                            bottom: string;
                        };
                        _reverse: string;
                        _x_count: string;
                        _y_count: string;
                        atrExpand: {};
                        _max_width: string;
                        elemExpand: {};
                        _background: string;
                        _style_refer: string;
                        _hor_position: string;
                        _ver_position: string;
                        _background_setting: {
                            type: string;
                            value: string;
                        };
                        _style_refer_global: {
                            index: string;
                        };
                        tag?: undefined;
                        carryData?: undefined;
                        refer_app?: undefined;
                        refer_form_data?: undefined;
                    };
                    type: string;
                    index: number;
                    label: string;
                    global: never[];
                    mobile: {
                        refer: string;
                        id?: undefined;
                        js?: undefined;
                        css?: undefined;
                        data?: undefined;
                        list?: undefined;
                        type?: undefined;
                        class?: undefined;
                        index?: undefined;
                        label?: undefined;
                        style?: undefined;
                        global?: undefined;
                        toggle?: undefined;
                        stylist?: undefined;
                        version?: undefined;
                        visible?: undefined;
                        dataType?: undefined;
                        style_from?: undefined;
                        classDataType?: undefined;
                        editor_bridge?: undefined;
                        preloadEvenet?: undefined;
                        container_fonts?: undefined;
                        mobile_editable?: undefined;
                        desktop_editable?: undefined;
                        refreshAllParameter?: undefined;
                        refreshComponentParameter?: undefined;
                    };
                    toggle: boolean;
                    desktop: {
                        refer: string;
                        id?: undefined;
                        js?: undefined;
                        css?: undefined;
                        data?: undefined;
                        list?: undefined;
                        type?: undefined;
                        class?: undefined;
                        index?: undefined;
                        label?: undefined;
                        style?: undefined;
                        global?: undefined;
                        toggle?: undefined;
                        stylist?: undefined;
                        version?: undefined;
                        visible?: undefined;
                        dataType?: undefined;
                        style_from?: undefined;
                        classDataType?: undefined;
                        editor_bridge?: undefined;
                        preloadEvenet?: undefined;
                        container_fonts?: undefined;
                        mobile_editable?: undefined;
                        desktop_editable?: undefined;
                        refreshAllParameter?: undefined;
                        refreshComponentParameter?: undefined;
                    };
                    visible: boolean;
                    def_editable: never[];
                    editor_bridge: {};
                    preloadEvenet: {};
                    refreshAllParameter: {};
                    refreshComponentParameter: {};
                    formData: {};
                    list?: undefined;
                    class?: undefined;
                    style?: undefined;
                    stylist?: undefined;
                    version?: undefined;
                    dataType?: undefined;
                    style_from?: undefined;
                    classDataType?: undefined;
                    container_fonts?: undefined;
                    mobile_editable?: undefined;
                    desktop_editable?: undefined;
                })[];
                version: string;
                _padding: {
                    top: string;
                    left: string;
                    right: string;
                    bottom: string;
                };
                _reverse: string;
                atrExpand: {};
                _max_width: string;
                elemExpand: {};
                _background: string;
                _style_refer: string;
                _hor_position: string;
                _background_setting: {
                    type: string;
                };
                _ratio_layout_value: string;
                _style_refer_global: {
                    index: string;
                };
                tag?: undefined;
                carryData?: undefined;
                refer_app?: undefined;
                refer_form_data?: undefined;
            };
            type: string;
            index: number;
            label: string;
            global: never[];
            mobile: {
                id: string;
                js: string;
                css: {
                    class: {};
                    style: {};
                };
                data: {
                    _gap: string;
                    attr: never[];
                    elem: string;
                    list: never[];
                    inner: string;
                    _gap_x: string;
                    _gap_y: string;
                    _other: {};
                    _border: {};
                    _layout: string;
                    _margin: {};
                    _radius: string;
                    setting: ({
                        id: string;
                        js: string;
                        css: {
                            class: {};
                            style: {};
                        };
                        data: {
                            tag: string;
                            _gap: string;
                            attr: never[];
                            elem: string;
                            list: never[];
                            inner: string;
                            _other: {};
                            _border: {};
                            _margin: {};
                            _radius: string;
                            _padding: {
                                top?: undefined;
                                left?: undefined;
                                right?: undefined;
                                bottom?: undefined;
                            };
                            _reverse: string;
                            carryData: {};
                            refer_app: string;
                            _max_width: string;
                            _background: string;
                            _style_refer: string;
                            _hor_position: string;
                            refer_form_data: {
                                list: {
                                    id: number;
                                    index: number;
                                    c_v_id: string;
                                    toggle: boolean;
                                    product_title: string;
                                }[];
                                more: string;
                                count: string;
                                list2: {
                                    toggle: boolean;
                                    product2dds: number;
                                }[];
                                title: string;
                                distance: {
                                    toggle: boolean;
                                    margin_pc: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                        toggle: boolean;
                                    };
                                    padding_pc: {
                                        toggle: boolean;
                                    };
                                    margin_phone: {
                                        toggle: boolean;
                                    };
                                    padding_phone: {};
                                };
                                font_size: string;
                                font_color: string;
                                more_title: string;
                                button_color: string;
                                mobile_count: string;
                                desktop_count: string;
                                product_select: {
                                    value: never[];
                                    select: string;
                                };
                                button_bg_color: string;
                                r_1714145557038: never[];
                            };
                            _background_setting: {
                                type: string;
                                value?: undefined;
                            };
                            _style_refer_global: {
                                index: string;
                            };
                            _gap_x?: undefined;
                            _gap_y?: undefined;
                            _layout?: undefined;
                            setting?: undefined;
                            version?: undefined;
                            _x_count?: undefined;
                            _y_count?: undefined;
                            atrExpand?: undefined;
                            elemExpand?: undefined;
                            _ver_position?: undefined;
                        };
                        list: never[];
                        type: string;
                        class: string;
                        index: number;
                        label: string;
                        style: string;
                        global: never[];
                        mobile: {
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                refer_app: string;
                            };
                            list: never[];
                            type: string;
                            class: string;
                            index: number;
                            label: string;
                            style: string;
                            global: never[];
                            toggle: boolean;
                            stylist: never[];
                            version: string;
                            visible: string;
                            dataType: string;
                            style_from: string;
                            classDataType: string;
                            editor_bridge: {};
                            preloadEvenet: {};
                            container_fonts: number;
                            mobile_editable: never[];
                            desktop_editable: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                            refer: string;
                        };
                        toggle: boolean;
                        desktop: {
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                refer_app: string;
                            };
                            list: never[];
                            type: string;
                            class: string;
                            index: number;
                            label: string;
                            style: string;
                            global: never[];
                            toggle: boolean;
                            stylist: never[];
                            version: string;
                            visible: string;
                            dataType: string;
                            style_from: string;
                            classDataType: string;
                            editor_bridge: {};
                            preloadEvenet: {};
                            container_fonts: number;
                            mobile_editable: never[];
                            desktop_editable: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                            refer: string;
                        };
                        stylist: never[];
                        version: string;
                        visible: string;
                        dataType: string;
                        style_from: string;
                        classDataType: string;
                        editor_bridge: {};
                        preloadEvenet: {};
                        container_fonts: number;
                        mobile_editable: never[];
                        desktop_editable: never[];
                        refreshAllParameter: {};
                        refreshComponentParameter: {};
                        formData: {};
                        def_editable?: undefined;
                    } | {
                        id: string;
                        js: string;
                        css: {
                            class: {};
                            style: {};
                        };
                        data: {
                            _gap: string;
                            attr: never[];
                            elem: string;
                            list: never[];
                            inner: string;
                            _gap_x: string;
                            _gap_y: string;
                            _other: {};
                            _border: {};
                            _layout: string;
                            _margin: {};
                            _radius: string;
                            setting: ({
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    tag: string;
                                    _gap: string;
                                    attr: never[];
                                    elem: string;
                                    list: never[];
                                    inner: string;
                                    _other: {};
                                    _border: {};
                                    _margin: {};
                                    _radius: string;
                                    _padding: {
                                        top?: undefined;
                                        left?: undefined;
                                        right?: undefined;
                                        bottom?: undefined;
                                    };
                                    _reverse: string;
                                    carryData: {};
                                    refer_app: string;
                                    _max_width: string;
                                    _background: string;
                                    _style_refer: string;
                                    _hor_position: string;
                                    refer_form_data: {
                                        kkw: string;
                                        size: string;
                                        color: {
                                            id: string;
                                            title: string;
                                            content: string;
                                            "sec-title": string;
                                            background: string;
                                            "sec-background": string;
                                            "solid-button-bg": string;
                                            "border-button-bg": string;
                                            "solid-button-text": string;
                                            "border-button-text": string;
                                        };
                                        title: string;
                                        margin: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        weight: string;
                                        import_: string;
                                        justify: string;
                                        padding: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        size_pc: string;
                                        distance: {
                                            toggle: boolean;
                                            margin_pc: {
                                                toggle: boolean;
                                            };
                                            padding_pc: {
                                                toggle: boolean;
                                            };
                                            margin_phone: {
                                                toggle: boolean;
                                                top?: undefined;
                                                bottom?: undefined;
                                            };
                                            padding_phone: {
                                                toggle: boolean;
                                            };
                                            margin?: undefined;
                                            padding?: undefined;
                                        };
                                        margin_pc: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        padding_pc: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        size_phone: string;
                                        theme_color: {
                                            id: string;
                                            title: string;
                                            content: string;
                                            background: string;
                                            "solid-button-bg": string;
                                            "border-button-bg": string;
                                            "solid-button-text": string;
                                            "border-button-text": string;
                                        };
                                        margin_phone: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        padding_phone: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        r_1716801819158: {};
                                        r_1718616868830: {
                                            type: string;
                                            value: string;
                                        };
                                        r_1718616877262: {
                                            type: string;
                                            value: string;
                                        };
                                        r_1718616885960: {
                                            type: string;
                                            value: string;
                                        };
                                        link?: undefined;
                                        theme?: undefined;
                                        width?: undefined;
                                        height?: undefined;
                                        radius?: undefined;
                                        "font-size"?: undefined;
                                    };
                                    _background_setting: {
                                        type: string;
                                    };
                                    _style_refer_global: {
                                        index: string;
                                    };
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                mobile: {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        refer_app: string;
                                        refer_form_data?: undefined;
                                    };
                                    list: never[];
                                    type: string;
                                    class: string;
                                    index: number;
                                    label: string;
                                    style: string;
                                    global: never[];
                                    toggle: boolean;
                                    stylist: never[];
                                    version: string;
                                    visible: boolean;
                                    dataType: string;
                                    style_from: string;
                                    classDataType: string;
                                    editor_bridge: {};
                                    preloadEvenet: {};
                                    container_fonts: number;
                                    mobile_editable: never[];
                                    desktop_editable: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                    refer: string;
                                };
                                toggle: boolean;
                                desktop: {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        refer_app: string;
                                    };
                                    list: never[];
                                    type: string;
                                    class: string;
                                    index: number;
                                    label: string;
                                    style: string;
                                    global: never[];
                                    toggle: boolean;
                                    stylist: never[];
                                    version: string;
                                    visible: boolean;
                                    dataType: string;
                                    style_from: string;
                                    classDataType: string;
                                    editor_bridge: {};
                                    preloadEvenet: {};
                                    container_fonts: number;
                                    mobile_editable: never[];
                                    desktop_editable: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                    refer: string;
                                };
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                formData: {};
                            } | {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    tag: string;
                                    _gap: string;
                                    attr: never[];
                                    elem: string;
                                    list: never[];
                                    inner: string;
                                    _other: {};
                                    _border: {};
                                    _margin: {};
                                    _radius: string;
                                    _padding: {
                                        top?: undefined;
                                        left?: undefined;
                                        right?: undefined;
                                        bottom?: undefined;
                                    };
                                    _reverse: string;
                                    carryData: {};
                                    refer_app: string;
                                    _max_width: string;
                                    _background: string;
                                    _style_refer: string;
                                    _hor_position: string;
                                    refer_form_data: {
                                        kkw: string;
                                        size: string;
                                        color: {
                                            id: string;
                                            title: string;
                                            content: string;
                                            "sec-title": string;
                                            background: string;
                                            "sec-background": string;
                                            "solid-button-bg": string;
                                            "border-button-bg": string;
                                            "solid-button-text": string;
                                            "border-button-text": string;
                                        };
                                        title: string;
                                        margin: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        weight: string;
                                        justify: string;
                                        padding: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        size_pc: string;
                                        distance: {
                                            toggle: boolean;
                                            margin_pc: {
                                                toggle: boolean;
                                            };
                                            padding_pc: {
                                                toggle: boolean;
                                            };
                                            margin_phone: {
                                                top: string;
                                                bottom: string;
                                                toggle: boolean;
                                            };
                                            padding_phone: {
                                                toggle?: undefined;
                                            };
                                            margin?: undefined;
                                            padding?: undefined;
                                        };
                                        margin_pc: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        padding_pc: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        size_phone: string;
                                        theme_color: {
                                            id: string;
                                            title: string;
                                            content: string;
                                            background: string;
                                            "solid-button-bg": string;
                                            "border-button-bg": string;
                                            "solid-button-text": string;
                                            "border-button-text": string;
                                        };
                                        margin_phone: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        padding_phone: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        r_1716801819158: {};
                                        r_1718616868830: {
                                            type: string;
                                            value: string;
                                        };
                                        r_1718616877262: {
                                            type: string;
                                            value: string;
                                        };
                                        r_1718616885960: {
                                            type: string;
                                            value: string;
                                        };
                                        import_?: undefined;
                                        link?: undefined;
                                        theme?: undefined;
                                        width?: undefined;
                                        height?: undefined;
                                        radius?: undefined;
                                        "font-size"?: undefined;
                                    };
                                    _background_setting: {
                                        type: string;
                                    };
                                    _style_refer_global: {
                                        index: string;
                                    };
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                mobile: {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        refer_app: string;
                                        refer_form_data: {};
                                    };
                                    list: never[];
                                    type: string;
                                    class: string;
                                    index: number;
                                    label: string;
                                    style: string;
                                    global: never[];
                                    toggle: boolean;
                                    stylist: never[];
                                    version: string;
                                    visible: boolean;
                                    dataType: string;
                                    style_from: string;
                                    classDataType: string;
                                    editor_bridge: {};
                                    preloadEvenet: {};
                                    container_fonts: number;
                                    mobile_editable: never[];
                                    desktop_editable: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                    refer: string;
                                };
                                toggle: boolean;
                                desktop: {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        refer_app: string;
                                    };
                                    list: never[];
                                    type: string;
                                    class: string;
                                    index: number;
                                    label: string;
                                    style: string;
                                    global: never[];
                                    toggle: boolean;
                                    stylist: never[];
                                    version: string;
                                    visible: boolean;
                                    dataType: string;
                                    style_from: string;
                                    classDataType: string;
                                    editor_bridge: {};
                                    preloadEvenet: {};
                                    container_fonts: number;
                                    mobile_editable: never[];
                                    desktop_editable: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                    refer: string;
                                };
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                formData: {};
                            } | {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    tag: string;
                                    _gap: string;
                                    attr: never[];
                                    elem: string;
                                    list: never[];
                                    inner: string;
                                    _other: {};
                                    _border: {};
                                    _margin: {};
                                    _radius: string;
                                    _padding: {
                                        top?: undefined;
                                        left?: undefined;
                                        right?: undefined;
                                        bottom?: undefined;
                                    };
                                    _reverse: string;
                                    carryData: {};
                                    refer_app: string;
                                    _max_width: string;
                                    _background: string;
                                    _style_refer: string;
                                    _hor_position: string;
                                    refer_form_data: {
                                        kkw: string;
                                        size: string;
                                        color: {
                                            id: string;
                                            title: string;
                                            content: string;
                                            "sec-title": string;
                                            background: string;
                                            "sec-background": string;
                                            "solid-button-bg": string;
                                            "border-button-bg": string;
                                            "solid-button-text": string;
                                            "border-button-text": string;
                                        };
                                        title: string;
                                        margin: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        weight: string;
                                        justify: string;
                                        padding: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        size_pc: string;
                                        distance: {
                                            toggle: boolean;
                                            margin_pc: {
                                                toggle: boolean;
                                            };
                                            padding_pc: {
                                                toggle: boolean;
                                            };
                                            margin_phone: {
                                                top: string;
                                                bottom: string;
                                                toggle: boolean;
                                            };
                                            padding_phone: {
                                                toggle?: undefined;
                                            };
                                            margin?: undefined;
                                            padding?: undefined;
                                        };
                                        margin_pc: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        padding_pc: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        size_phone: string;
                                        theme_color: {
                                            id: string;
                                            title: string;
                                            content: string;
                                            background: string;
                                            "solid-button-bg": string;
                                            "border-button-bg": string;
                                            "solid-button-text": string;
                                            "border-button-text": string;
                                        };
                                        margin_phone: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        padding_phone: {
                                            top: string;
                                            left: string;
                                            right: string;
                                            bottom: string;
                                            toggle: boolean;
                                        };
                                        r_1716801819158: {};
                                        r_1718616868830: {
                                            type: string;
                                            value: string;
                                        };
                                        r_1718616877262: {
                                            type: string;
                                            value: string;
                                        };
                                        r_1718616885960: {
                                            type: string;
                                            value: string;
                                        };
                                        import_?: undefined;
                                        link?: undefined;
                                        theme?: undefined;
                                        width?: undefined;
                                        height?: undefined;
                                        radius?: undefined;
                                        "font-size"?: undefined;
                                    };
                                    _background_setting: {
                                        type: string;
                                    };
                                    _style_refer_global: {
                                        index: string;
                                    };
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                mobile: {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        refer_app: string;
                                        refer_form_data?: undefined;
                                    };
                                    list: never[];
                                    type: string;
                                    class: string;
                                    index: number;
                                    label: string;
                                    style: string;
                                    global: never[];
                                    toggle: boolean;
                                    stylist: never[];
                                    version: string;
                                    visible: boolean;
                                    dataType: string;
                                    style_from: string;
                                    classDataType: string;
                                    editor_bridge: {};
                                    preloadEvenet: {};
                                    container_fonts: number;
                                    mobile_editable: never[];
                                    desktop_editable: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                    refer: string;
                                };
                                toggle: boolean;
                                desktop: {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        refer_app: string;
                                    };
                                    list: never[];
                                    type: string;
                                    class: string;
                                    index: number;
                                    label: string;
                                    style: string;
                                    global: never[];
                                    toggle: boolean;
                                    stylist: never[];
                                    version: string;
                                    visible: boolean;
                                    dataType: string;
                                    style_from: string;
                                    classDataType: string;
                                    editor_bridge: {};
                                    preloadEvenet: {};
                                    container_fonts: number;
                                    mobile_editable: never[];
                                    desktop_editable: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                    refer: string;
                                };
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                formData: {};
                            } | {
                                id: string;
                                js: string;
                                css: {
                                    class: {};
                                    style: {};
                                };
                                data: {
                                    tag: string;
                                    _gap: string;
                                    attr: never[];
                                    elem: string;
                                    list: never[];
                                    inner: string;
                                    _other: {};
                                    _border: {};
                                    _margin: {};
                                    _radius: string;
                                    _padding: {
                                        top: string;
                                        left: string;
                                        right: string;
                                        bottom: string;
                                    };
                                    _reverse: string;
                                    carryData: {};
                                    refer_app: string;
                                    _max_width: string;
                                    _background: string;
                                    _style_refer: string;
                                    _hor_position: string;
                                    refer_form_data: {
                                        link: string;
                                        theme: {
                                            id: string;
                                            title: string;
                                            content: string;
                                            "sec-title": string;
                                            background: string;
                                            "sec-background": string;
                                            "solid-button-bg": string;
                                            "border-button-bg": string;
                                            "solid-button-text": string;
                                            "border-button-text": string;
                                        };
                                        title: string;
                                        width: {
                                            unit: string;
                                            value: string;
                                            number: string;
                                        };
                                        height: {
                                            unit: string;
                                            value: string;
                                            number: string;
                                        };
                                        radius: string;
                                        distance: {
                                            margin: {
                                                top: string;
                                                bottom: string;
                                                toggle: boolean;
                                            };
                                            toggle: boolean;
                                            padding: {
                                                top: string;
                                                left: string;
                                                right: string;
                                                bottom: string;
                                                toggle: boolean;
                                            };
                                            margin_pc: {
                                                toggle: boolean;
                                            };
                                            padding_pc: {
                                                toggle: boolean;
                                            };
                                            margin_phone?: undefined;
                                            padding_phone?: undefined;
                                        };
                                        "font-size": string;
                                        kkw?: undefined;
                                        size?: undefined;
                                        color?: undefined;
                                        margin?: undefined;
                                        weight?: undefined;
                                        import_?: undefined;
                                        justify?: undefined;
                                        padding?: undefined;
                                        size_pc?: undefined;
                                        margin_pc?: undefined;
                                        padding_pc?: undefined;
                                        size_phone?: undefined;
                                        theme_color?: undefined;
                                        margin_phone?: undefined;
                                        padding_phone?: undefined;
                                        r_1716801819158?: undefined;
                                        r_1718616868830?: undefined;
                                        r_1718616877262?: undefined;
                                        r_1718616885960?: undefined;
                                    };
                                    _background_setting: {
                                        type: string;
                                    };
                                    _style_refer_global: {
                                        index: string;
                                    };
                                };
                                list: never[];
                                type: string;
                                class: string;
                                index: number;
                                label: string;
                                style: string;
                                global: never[];
                                mobile: {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        refer_app: string;
                                        refer_form_data?: undefined;
                                    };
                                    list: never[];
                                    type: string;
                                    class: string;
                                    index: number;
                                    label: string;
                                    style: string;
                                    global: never[];
                                    toggle: boolean;
                                    stylist: never[];
                                    version: string;
                                    visible: boolean;
                                    dataType: string;
                                    style_from: string;
                                    classDataType: string;
                                    editor_bridge: {};
                                    preloadEvenet: {};
                                    container_fonts: number;
                                    mobile_editable: never[];
                                    desktop_editable: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                    refer: string;
                                };
                                toggle: boolean;
                                desktop: {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        refer_app: string;
                                    };
                                    list: never[];
                                    type: string;
                                    class: string;
                                    index: number;
                                    label: string;
                                    style: string;
                                    global: never[];
                                    toggle: boolean;
                                    stylist: never[];
                                    version: string;
                                    visible: boolean;
                                    dataType: string;
                                    style_from: string;
                                    classDataType: string;
                                    editor_bridge: {};
                                    preloadEvenet: {};
                                    container_fonts: number;
                                    mobile_editable: never[];
                                    desktop_editable: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                    refer: string;
                                };
                                stylist: never[];
                                version: string;
                                visible: boolean;
                                dataType: string;
                                style_from: string;
                                classDataType: string;
                                editor_bridge: {};
                                preloadEvenet: {};
                                container_fonts: number;
                                mobile_editable: never[];
                                desktop_editable: never[];
                                refreshAllParameter: {};
                                refreshComponentParameter: {};
                                formData: {};
                            })[];
                            version: string;
                            _padding: {
                                top: string;
                                left: string;
                                right: string;
                                bottom: string;
                            };
                            _reverse: string;
                            _x_count: string;
                            _y_count: string;
                            atrExpand: {};
                            _max_width: string;
                            elemExpand: {};
                            _background: string;
                            _style_refer: string;
                            _hor_position: string;
                            _ver_position: string;
                            _background_setting: {
                                type: string;
                                value: string;
                            };
                            _style_refer_global: {
                                index: string;
                            };
                            tag?: undefined;
                            carryData?: undefined;
                            refer_app?: undefined;
                            refer_form_data?: undefined;
                        };
                        type: string;
                        index: number;
                        label: string;
                        global: never[];
                        mobile: {
                            refer: string;
                            id?: undefined;
                            js?: undefined;
                            css?: undefined;
                            data?: undefined;
                            list?: undefined;
                            type?: undefined;
                            class?: undefined;
                            index?: undefined;
                            label?: undefined;
                            style?: undefined;
                            global?: undefined;
                            toggle?: undefined;
                            stylist?: undefined;
                            version?: undefined;
                            visible?: undefined;
                            dataType?: undefined;
                            style_from?: undefined;
                            classDataType?: undefined;
                            editor_bridge?: undefined;
                            preloadEvenet?: undefined;
                            container_fonts?: undefined;
                            mobile_editable?: undefined;
                            desktop_editable?: undefined;
                            refreshAllParameter?: undefined;
                            refreshComponentParameter?: undefined;
                        };
                        toggle: boolean;
                        desktop: {
                            refer: string;
                            id?: undefined;
                            js?: undefined;
                            css?: undefined;
                            data?: undefined;
                            list?: undefined;
                            type?: undefined;
                            class?: undefined;
                            index?: undefined;
                            label?: undefined;
                            style?: undefined;
                            global?: undefined;
                            toggle?: undefined;
                            stylist?: undefined;
                            version?: undefined;
                            visible?: undefined;
                            dataType?: undefined;
                            style_from?: undefined;
                            classDataType?: undefined;
                            editor_bridge?: undefined;
                            preloadEvenet?: undefined;
                            container_fonts?: undefined;
                            mobile_editable?: undefined;
                            desktop_editable?: undefined;
                            refreshAllParameter?: undefined;
                            refreshComponentParameter?: undefined;
                        };
                        visible: boolean;
                        def_editable: never[];
                        editor_bridge: {};
                        preloadEvenet: {};
                        refreshAllParameter: {};
                        refreshComponentParameter: {};
                        formData: {};
                        list?: undefined;
                        class?: undefined;
                        style?: undefined;
                        stylist?: undefined;
                        version?: undefined;
                        dataType?: undefined;
                        style_from?: undefined;
                        classDataType?: undefined;
                        container_fonts?: undefined;
                        mobile_editable?: undefined;
                        desktop_editable?: undefined;
                    })[];
                    version: string;
                    _padding: {
                        top: string;
                        left: string;
                        right: string;
                        bottom: string;
                    };
                    _reverse: string;
                    atrExpand: {};
                    _max_width: string;
                    elemExpand: {};
                    _background: string;
                    _style_refer: string;
                    _hor_position: string;
                    _background_setting: {
                        type: string;
                    };
                    _ratio_layout_value: string;
                    _style_refer_global: {
                        index: string;
                    };
                    refer_app?: undefined;
                    refer_form_data?: undefined;
                };
                type: string;
                index: number;
                label: string;
                global: never[];
                toggle: boolean;
                visible: boolean;
                def_editable: never[];
                editor_bridge: {};
                preloadEvenet: {};
                mobile_editable: never[];
                refreshAllParameter: {};
                refreshComponentParameter: {};
                refer: string;
                list?: undefined;
                class?: undefined;
                style?: undefined;
                stylist?: undefined;
                version?: undefined;
                dataType?: undefined;
                style_from?: undefined;
                classDataType?: undefined;
                container_fonts?: undefined;
                desktop_editable?: undefined;
            };
            toggle: boolean;
            desktop: {
                refer: string;
                id?: undefined;
                js?: undefined;
                css?: undefined;
                data?: undefined;
                list?: undefined;
                type?: undefined;
                class?: undefined;
                index?: undefined;
                label?: undefined;
                style?: undefined;
                global?: undefined;
                toggle?: undefined;
                stylist?: undefined;
                version?: undefined;
                dataType?: undefined;
                style_from?: undefined;
                classDataType?: undefined;
                editor_bridge?: undefined;
                preloadEvenet?: undefined;
                container_fonts?: undefined;
                mobile_editable?: undefined;
                desktop_editable?: undefined;
                refreshAllParameter?: undefined;
                refreshComponentParameter?: undefined;
                visible?: undefined;
            };
            visible: boolean;
            def_editable: never[];
            editor_bridge: {};
            preloadEvenet: {};
            mobile_editable: never[];
            refreshAllParameter: {};
            refreshComponentParameter: {};
            formData: {};
            list?: undefined;
            class?: undefined;
            style?: undefined;
            stylist?: undefined;
            version?: undefined;
            dataType?: undefined;
            style_from?: undefined;
            classDataType?: undefined;
            container_fonts?: undefined;
            desktop_editable?: undefined;
            storage?: undefined;
            bundle?: undefined;
            share?: undefined;
        };
        image: string;
    } | {
        title: string;
        config: {
            id: string;
            js: string;
            css: {
                class: {};
                style: {};
            };
            data: {
                tag: string;
                _gap: string;
                attr: never[];
                elem: string;
                list: never[];
                inner: string;
                _other: {};
                _border: {};
                _margin: {};
                _radius: string;
                _padding: {
                    top: string;
                    right: string;
                    bottom: string;
                    left: string;
                };
                _reverse: string;
                carryData: {};
                refer_app: string;
                _max_width: string;
                _background: string;
                _style_refer: string;
                _hor_position: string;
                refer_form_data: {
                    list: {
                        id: number;
                        index: number;
                        c_v_id: string;
                        toggle: boolean;
                        product_title: string;
                    }[];
                    more: string;
                    count: string;
                    list2: {
                        toggle: boolean;
                        product2dds: number;
                    }[];
                    title: string;
                    distance: {
                        toggle: boolean;
                        margin_pc: {
                            top: string;
                            left: string;
                            right: string;
                            bottom: string;
                            toggle: boolean;
                        };
                        padding_pc: {
                            toggle: boolean;
                        };
                        margin_phone: {
                            toggle: boolean;
                        };
                        padding_phone: {};
                    };
                    font_size: string;
                    font_color: string;
                    more_title: string;
                    button_color: string;
                    mobile_count: string;
                    desktop_count: string;
                    product_select: {
                        value: never[];
                        select: string;
                    };
                    button_bg_color: string;
                    r_1714145557038: never[];
                    r_1720723986033?: undefined;
                    margin_pc?: undefined;
                    padding_pc?: undefined;
                    theme_color?: undefined;
                    card_setting?: undefined;
                    margin_phone?: undefined;
                    page_setting?: undefined;
                    padding_phone?: undefined;
                    title_setting?: undefined;
                };
                _background_setting: {
                    type: string;
                };
                _style_refer_global: {
                    index: string;
                };
                _gap_x?: undefined;
                _gap_y?: undefined;
                _layout?: undefined;
                setting?: undefined;
                version?: undefined;
                atrExpand?: undefined;
                elemExpand?: undefined;
                _ratio_layout_value?: undefined;
            };
            list: never[];
            type: string;
            class: string;
            index: number;
            label: string;
            style: string;
            global: never[];
            mobile: {
                id: string;
                js: string;
                css: {
                    class: {};
                    style: {};
                };
                data: {
                    refer_app: string;
                    _gap?: undefined;
                    attr?: undefined;
                    elem?: undefined;
                    list?: undefined;
                    inner?: undefined;
                    _gap_x?: undefined;
                    _gap_y?: undefined;
                    _other?: undefined;
                    _border?: undefined;
                    _layout?: undefined;
                    _margin?: undefined;
                    _radius?: undefined;
                    setting?: undefined;
                    version?: undefined;
                    _padding?: undefined;
                    _reverse?: undefined;
                    atrExpand?: undefined;
                    _max_width?: undefined;
                    elemExpand?: undefined;
                    _background?: undefined;
                    _style_refer?: undefined;
                    _hor_position?: undefined;
                    _background_setting?: undefined;
                    _ratio_layout_value?: undefined;
                    _style_refer_global?: undefined;
                    refer_form_data?: undefined;
                };
                list: never[];
                type: string;
                class: string;
                index: number;
                label: string;
                style: string;
                global: never[];
                toggle: boolean;
                stylist: never[];
                version: string;
                dataType: string;
                style_from: string;
                classDataType: string;
                editor_bridge: {};
                preloadEvenet: {};
                container_fonts: number;
                mobile_editable: never[];
                desktop_editable: never[];
                refreshAllParameter: {};
                refreshComponentParameter: {};
                refer: string;
                visible?: undefined;
                def_editable?: undefined;
            };
            toggle: boolean;
            desktop: {
                id: string;
                js: string;
                css: {
                    class: {};
                    style: {};
                };
                data: {
                    refer_app: string;
                };
                list: never[];
                type: string;
                class: string;
                index: number;
                label: string;
                style: string;
                global: never[];
                toggle: boolean;
                stylist: never[];
                version: string;
                dataType: string;
                style_from: string;
                classDataType: string;
                editor_bridge: {};
                preloadEvenet: {};
                container_fonts: number;
                mobile_editable: never[];
                desktop_editable: never[];
                refreshAllParameter: {};
                refreshComponentParameter: {};
                refer: string;
                visible?: undefined;
            };
            stylist: never[];
            version: string;
            dataType: string;
            style_from: string;
            classDataType: string;
            editor_bridge: {};
            preloadEvenet: {};
            container_fonts: number;
            mobile_editable: never[];
            desktop_editable: never[];
            refreshAllParameter: {};
            refreshComponentParameter: {};
            formData: {};
            storage: {};
            visible?: undefined;
            def_editable?: undefined;
            bundle?: undefined;
            share?: undefined;
        };
        image: string;
    } | {
        title: string;
        config: {
            id: string;
            js: string;
            css: {
                class: {};
                style: {};
            };
            data: {
                tag: string;
                _gap: string;
                attr: never[];
                elem: string;
                list: never[];
                inner: string;
                _other: {};
                _border: {};
                _margin: {};
                _radius: string;
                _padding: {
                    top?: undefined;
                    left?: undefined;
                    right?: undefined;
                    bottom?: undefined;
                };
                _reverse: string;
                carryData: {};
                refer_app: string;
                _max_width: string;
                _background: string;
                _style_refer: string;
                _hor_position: string;
                refer_form_data: {
                    list: {
                        id: number;
                        index: number;
                        c_v_id: string;
                        toggle: boolean;
                        product_title: string;
                    }[];
                    more: string;
                    count: string;
                    list2: {
                        toggle: boolean;
                        product2dds: number;
                    }[];
                    title: string;
                    distance: {
                        toggle: boolean;
                        margin_pc: {
                            top: string;
                            left: string;
                            right: string;
                            bottom: string;
                            toggle: boolean;
                        };
                        padding_pc: {
                            toggle: boolean;
                        };
                        margin_phone: {
                            toggle: boolean;
                        };
                        padding_phone: {};
                    };
                    font_size: string;
                    font_color: string;
                    more_title: string;
                    button_color: string;
                    mobile_count: string;
                    desktop_count: string;
                    product_select: {
                        value: never[];
                        select: string;
                    };
                    button_bg_color: string;
                    r_1714145557038: never[];
                    r_1720723986033: {
                        type: string;
                        unit: string;
                        value: string;
                        number: string;
                    };
                    margin_pc?: undefined;
                    padding_pc?: undefined;
                    theme_color?: undefined;
                    card_setting?: undefined;
                    margin_phone?: undefined;
                    page_setting?: undefined;
                    padding_phone?: undefined;
                    title_setting?: undefined;
                };
                _background_setting: {
                    type: string;
                };
                _style_refer_global: {
                    index: string;
                };
                _gap_x?: undefined;
                _gap_y?: undefined;
                _layout?: undefined;
                setting?: undefined;
                version?: undefined;
                atrExpand?: undefined;
                elemExpand?: undefined;
                _ratio_layout_value?: undefined;
            };
            list: never[];
            type: string;
            class: string;
            index: number;
            label: string;
            style: string;
            global: never[];
            mobile: {
                id: string;
                js: string;
                css: {
                    class: {};
                    style: {};
                };
                data: {
                    _gap: string;
                    attr: never[];
                    elem: string;
                    inner: string;
                    _other: {};
                    _border: {};
                    _margin: {};
                    _radius: string;
                    _padding: {
                        top: string;
                        left: string;
                        right: string;
                        bottom: string;
                    };
                    _reverse: string;
                    refer_app: string;
                    _max_width: string;
                    _background: string;
                    _style_refer: string;
                    _hor_position: string;
                    refer_form_data: {
                        desktop_count: string;
                    };
                    _background_setting: {
                        type: string;
                    };
                    list?: undefined;
                    _gap_x?: undefined;
                    _gap_y?: undefined;
                    _layout?: undefined;
                    setting?: undefined;
                    version?: undefined;
                    atrExpand?: undefined;
                    elemExpand?: undefined;
                    _ratio_layout_value?: undefined;
                    _style_refer_global?: undefined;
                };
                list: never[];
                type: string;
                class: string;
                index: number;
                label: string;
                style: string;
                global: never[];
                toggle: boolean;
                stylist: never[];
                version: string;
                visible: boolean;
                dataType: string;
                style_from: string;
                classDataType: string;
                editor_bridge: {};
                preloadEvenet: {};
                container_fonts: number;
                mobile_editable: string[];
                desktop_editable: never[];
                refreshAllParameter: {};
                refreshComponentParameter: {};
                refer: string;
                def_editable?: undefined;
            };
            toggle: boolean;
            desktop: {
                id: string;
                js: string;
                css: {
                    class: {};
                    style: {};
                };
                data: {
                    refer_app: string;
                };
                list: never[];
                type: string;
                class: string;
                index: number;
                label: string;
                style: string;
                global: never[];
                toggle: boolean;
                stylist: never[];
                version: string;
                visible: boolean;
                dataType: string;
                style_from: string;
                classDataType: string;
                editor_bridge: {};
                preloadEvenet: {};
                container_fonts: number;
                mobile_editable: string[];
                desktop_editable: never[];
                refreshAllParameter: {};
                refreshComponentParameter: {};
                refer: string;
            };
            stylist: never[];
            version: string;
            visible: boolean;
            dataType: string;
            style_from: string;
            classDataType: string;
            editor_bridge: {};
            preloadEvenet: {};
            container_fonts: number;
            mobile_editable: string[];
            desktop_editable: never[];
            refreshAllParameter: {};
            refreshComponentParameter: {};
            formData: {};
            def_editable?: undefined;
            storage?: undefined;
            bundle?: undefined;
            share?: undefined;
        };
        image: string;
    } | {
        title: string;
        config: {
            id: string;
            js: string;
            css: {
                class: {};
                style: {};
            };
            data: {
                refer_app: string;
                tag: string;
                list: never[];
                carryData: {};
                _style_refer_global: {
                    index: string;
                };
                _style_refer: string;
                elem: string;
                inner: string;
                attr: never[];
                _padding: {
                    top: string;
                    right: string;
                    bottom: string;
                    left: string;
                };
                _margin: {};
                _border: {};
                _max_width: string;
                _gap: string;
                _background: string;
                _other: {};
                _radius: string;
                _reverse: string;
                _hor_position: string;
                _background_setting: {
                    type: string;
                };
                refer_form_data: {
                    list: {
                        more: string;
                        index: number;
                        title: string;
                        c_v_id: string;
                        toggle: boolean;
                        product_list: {
                            value: never[];
                            select: string;
                        };
                    }[];
                    more: {
                        bg: string;
                        size: string;
                        color: string;
                        toggle: boolean;
                        border_color: string;
                        border_width: string;
                    };
                    count: string;
                    title: string;
                    distance: {
                        toggle: boolean;
                        margin_pc: {
                            top?: undefined;
                            left?: undefined;
                            right?: undefined;
                            bottom?: undefined;
                            toggle?: undefined;
                        };
                        padding_pc: {
                            toggle: boolean;
                        };
                        margin_phone: {
                            toggle?: undefined;
                        };
                        padding_phone: {};
                    };
                    margin_pc: {};
                    padding_pc: {};
                    theme_color: {
                        id: string;
                        title: string;
                        content: string;
                        "sec-title": string;
                        background: string;
                        "sec-background": string;
                        "solid-button-bg": string;
                        "border-button-bg": string;
                        "solid-button-text": string;
                        "border-button-text": string;
                    };
                    card_setting: {
                        sp: {
                            size: string;
                            color: string;
                            toggle: boolean;
                        };
                        name: {
                            size: string;
                            color: string;
                            toggle: boolean;
                        };
                        price: {
                            size: string;
                            color: string;
                            toggle: boolean;
                        };
                        toggle: boolean;
                    };
                    margin_phone: {};
                    page_setting: {
                        toggle: boolean;
                        selected: {
                            bg: string;
                            color: string;
                            toggle: boolean;
                            border_color: string;
                            border_width: string;
                        };
                        unselected: {
                            bg: string;
                            color: string;
                            toggle: boolean;
                            border_color: string;
                            border_width: string;
                        };
                    };
                    padding_phone: {};
                    title_setting: {
                        size: string;
                        color: string;
                        title: string;
                        toggle: boolean;
                        size_sm: string;
                    };
                    list2?: undefined;
                    font_size?: undefined;
                    font_color?: undefined;
                    more_title?: undefined;
                    button_color?: undefined;
                    mobile_count?: undefined;
                    desktop_count?: undefined;
                    product_select?: undefined;
                    button_bg_color?: undefined;
                    r_1714145557038?: undefined;
                    r_1720723986033?: undefined;
                };
                _gap_x?: undefined;
                _gap_y?: undefined;
                _layout?: undefined;
                setting?: undefined;
                version?: undefined;
                atrExpand?: undefined;
                elemExpand?: undefined;
                _ratio_layout_value?: undefined;
            };
            type: string;
            class: string;
            index: number;
            label: string;
            style: string;
            bundle: {};
            global: never[];
            toggle: boolean;
            stylist: never[];
            dataType: string;
            style_from: string;
            classDataType: string;
            preloadEvenet: {};
            share: {};
            formData: {};
            refreshAllParameter: {};
            editor_bridge: {};
            refreshComponentParameter: {};
            list: never[];
            version: string;
            storage: {};
            mobile: {
                id: string;
                js: string;
                css: {
                    class: {};
                    style: {};
                };
                data: {
                    refer_app: string;
                    _gap?: undefined;
                    attr?: undefined;
                    elem?: undefined;
                    list?: undefined;
                    inner?: undefined;
                    _gap_x?: undefined;
                    _gap_y?: undefined;
                    _other?: undefined;
                    _border?: undefined;
                    _layout?: undefined;
                    _margin?: undefined;
                    _radius?: undefined;
                    setting?: undefined;
                    version?: undefined;
                    _padding?: undefined;
                    _reverse?: undefined;
                    atrExpand?: undefined;
                    _max_width?: undefined;
                    elemExpand?: undefined;
                    _background?: undefined;
                    _style_refer?: undefined;
                    _hor_position?: undefined;
                    _background_setting?: undefined;
                    _ratio_layout_value?: undefined;
                    _style_refer_global?: undefined;
                    refer_form_data?: undefined;
                };
                type: string;
                class: string;
                index: number;
                label: string;
                style: string;
                global: never[];
                toggle: boolean;
                stylist: never[];
                dataType: string;
                style_from: string;
                classDataType: string;
                preloadEvenet: {};
                refreshAllParameter: {};
                editor_bridge: {};
                refreshComponentParameter: {};
                list: never[];
                version: string;
                mobile_editable: never[];
                desktop_editable: never[];
                container_fonts: number;
                refer: string;
                visible?: undefined;
                def_editable?: undefined;
            };
            mobile_editable: never[];
            desktop: {
                id: string;
                js: string;
                css: {
                    class: {};
                    style: {};
                };
                data: {
                    refer_app: string;
                };
                type: string;
                class: string;
                index: number;
                label: string;
                style: string;
                global: never[];
                toggle: boolean;
                stylist: never[];
                dataType: string;
                style_from: string;
                classDataType: string;
                preloadEvenet: {};
                refreshAllParameter: {};
                editor_bridge: {};
                refreshComponentParameter: {};
                list: never[];
                version: string;
                mobile_editable: never[];
                desktop_editable: never[];
                container_fonts: number;
                refer: string;
                visible?: undefined;
            };
            desktop_editable: never[];
            container_fonts: number;
            visible?: undefined;
            def_editable?: undefined;
        };
        image: string;
    })[];
    static moreComponent: {
        title: string;
        config: {
            id: string;
            js: string;
            css: {
                class: {};
                style: {};
            };
            data: {
                refer_app: string;
                tag: string;
                list: never[];
                carryData: {};
                _style_refer_global: {
                    index: string;
                };
                _style_refer: string;
                elem: string;
                inner: string;
                attr: never[];
                _padding: {};
                _margin: {};
                _border: {};
                _max_width: string;
                _gap: string;
                _background: string;
                _other: {};
                _radius: string;
                _reverse: string;
                _hor_position: string;
                _background_setting: {
                    type: string;
                };
                refer_form_data: {
                    code: string;
                    width: {
                        unit: string;
                        value: string;
                        number: string;
                    };
                    height: {
                        unit: string;
                        value: string;
                        number: string;
                    };
                    with_bg: string;
                    background: {
                        id: string;
                        title: string;
                        content: string;
                        "sec-title": string;
                        background: string;
                        "sec-background": string;
                        "solid-button-bg": string;
                        "border-button-bg": string;
                        "solid-button-text": string;
                        "border-button-text": string;
                    };
                };
            };
            type: string;
            class: string;
            index: number;
            label: string;
            style: string;
            bundle: {};
            global: never[];
            toggle: boolean;
            stylist: never[];
            dataType: string;
            style_from: string;
            classDataType: string;
            preloadEvenet: {};
            share: {};
            formData: {};
            refreshAllParameter: {};
            editor_bridge: {};
            refreshComponentParameter: {};
            list: never[];
            version: string;
            storage: {};
            mobile: {
                id: string;
                js: string;
                css: {
                    class: {};
                    style: {};
                };
                data: {
                    refer_app: string;
                };
                type: string;
                class: string;
                index: number;
                label: string;
                style: string;
                global: never[];
                toggle: boolean;
                stylist: never[];
                dataType: string;
                style_from: string;
                classDataType: string;
                preloadEvenet: {};
                refreshAllParameter: {};
                editor_bridge: {};
                refreshComponentParameter: {};
                list: never[];
                version: string;
                mobile_editable: never[];
                desktop_editable: never[];
                container_fonts: number;
                visible: boolean;
                refer: string;
            };
            mobile_editable: never[];
            desktop: {
                data: {
                    refer_app: string;
                    refer_form_data: {};
                };
                refer: string;
            };
            desktop_editable: never[];
            container_fonts: number;
            visible: boolean;
        };
        image: string;
    }[];
    static main(gvc: GVC): string;
    static getComponentList(gvc: GVC, list: {
        title: string;
        value: string;
    }[], tag?: string): string;
}
