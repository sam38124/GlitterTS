export declare class AbsolutePathCheck {
    static check(page: string): void;
    static getTemplate(code: string): {
        id: number;
        userID: string;
        appName: string;
        tag: string;
        group: string;
        name: string;
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
                _other: {};
                _border: {};
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
                        _gap: string;
                        attr: never[];
                        elem: string;
                        list: never[];
                        inner: string;
                        _other: {};
                        _border: {};
                        _margin: {};
                        _radius: string;
                        version: string;
                        _padding: {};
                        _reverse: string;
                        dataFrom: string;
                        atrExpand: {};
                        _max_width: string;
                        elemExpand: {};
                        _background: string;
                        innerEvenet: {
                            clickEvent: {
                                code: string;
                                clickEvent: {
                                    src: string;
                                    route: string;
                                };
                                codeVersion: string;
                            }[];
                        };
                        _style_refer: string;
                        _hor_position: string;
                        _background_setting: {
                            type: string;
                        };
                        _style_refer_global: {
                            index: string;
                        };
                    };
                    type: string;
                    index: number;
                    label: string;
                    global: never[];
                    mobile: {
                        refer: string;
                    };
                    desktop: {
                        refer: string;
                    };
                    editor_bridge: {};
                    preloadEvenet: {};
                    refreshAllParameter: {};
                    refreshComponentParameter: {};
                }[];
                version: string;
                _padding: {};
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
                _style_refer_global: {
                    index: string;
                };
            };
            type: string;
            index: number;
            label: string;
            gCount: string;
            global: never[];
            mobile: {
                refer: string;
            };
            toggle: boolean;
            desktop: {
                refer: string;
            };
            arrayData: {
                clickEvent: {
                    code: string;
                    clickEvent: {
                        src: string;
                        route: string;
                    };
                    codeVersion: string;
                }[];
            };
            hiddenEvent: {};
            editor_bridge: {};
            onCreateEvent: {};
            onResumtEvent: {};
            preloadEvenet: {};
            onDestoryEvent: {};
            onInitialEvent: {};
            refreshAllParameter: {};
            refreshComponentParameter: {};
        }[];
        page_type: string;
        page_config: {
            seo: {
                type: string;
            };
            list: never[];
            version: string;
            formData: {};
            formFormat: never[];
            resource_from: string;
            globalStyleTag: never[];
            support_editor: string;
        };
        created_time: string;
        preview_image: null;
        favorite: number;
        template_config: null;
        template_type: number;
        updated_time: string;
    };
}
