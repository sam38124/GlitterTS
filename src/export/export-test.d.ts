declare const a: ({
    id: string;
    js: string;
    css: {
        class: {};
        style: {};
    };
    data: {
        tag: string;
        list: {
            tag: string;
            code: string;
            name: string;
            evenet: {};
            expand: boolean;
            carryData: {};
        }[];
        expand: boolean;
        carryData: {};
        attr?: undefined;
        elem?: undefined;
        class?: undefined;
        inner?: undefined;
        style?: undefined;
        setting?: undefined;
        dataFrom?: undefined;
        atrExpand?: undefined;
        styleList?: undefined;
        elemExpand?: undefined;
        innerEvenet?: undefined;
        note?: undefined;
    };
    type: string;
    index: number;
    label: string;
    style: string;
    hashTag: string;
    styleList: never[];
    refreshAllParameter: {};
    refreshComponentParameter: {};
    class?: undefined;
} | {
    id: string;
    js: string;
    css: {
        class: {};
        style: {};
    };
    data: {
        attr: never[];
        elem: string;
        class: string;
        inner: string;
        style: string;
        setting: ({
            id: string;
            js: string;
            css: {
                class: {};
                style: {};
            };
            data: {
                attr: never[];
                elem: string;
                class: string;
                inner: string;
                style: string;
                dataFrom: string;
                atrExpand: {
                    expand: boolean;
                };
                styleList: never[];
                elemExpand: {
                    expand: boolean;
                };
                innerEvenet: {};
                setting?: undefined;
            };
            type: string;
            index: number;
            label: string;
            refreshAllParameter: {};
            refreshComponentParameter: {};
            styleList?: undefined;
        } | {
            id: string;
            js: string;
            css: {
                class: {};
                style: {};
            };
            data: {
                attr: never[];
                elem: string;
                class: string;
                inner: string;
                style: string;
                setting: {
                    id: string;
                    js: string;
                    css: {
                        class: {};
                        style: {};
                    };
                    data: {
                        attr: never[];
                        elem: string;
                        class: string;
                        inner: string;
                        style: string;
                        setting: ({
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                attr: never[];
                                elem: string;
                                class: string;
                                inner: string;
                                style: string;
                                setting: {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        attr: never[];
                                        elem: string;
                                        class: string;
                                        inner: string;
                                        style: string;
                                        setting: ({
                                            id: string;
                                            js: string;
                                            css: {
                                                class: {};
                                                style: {};
                                            };
                                            data: {
                                                attr: never[];
                                                elem: string;
                                                class: string;
                                                inner: string;
                                                style: string;
                                                setting: {
                                                    id: string;
                                                    js: string;
                                                    css: {
                                                        class: {};
                                                        style: {};
                                                    };
                                                    data: {
                                                        attr: {
                                                            attr: string;
                                                            type: string;
                                                            expand: boolean;
                                                            attrType: string;
                                                            clickEvent: {
                                                                code: string;
                                                                expand: boolean;
                                                                clickEvent: {
                                                                    src: string;
                                                                    route: string;
                                                                };
                                                                blockExpand: {
                                                                    expand: boolean;
                                                                };
                                                                pluginExpand: {
                                                                    expand: boolean;
                                                                };
                                                                dataPlaceExpand: {
                                                                    expand: boolean;
                                                                };
                                                                errorPlaceExpand: {
                                                                    expand: boolean;
                                                                };
                                                            }[];
                                                        }[];
                                                        elem: string;
                                                        class: string;
                                                        inner: string;
                                                        style: string;
                                                        setting: never[];
                                                        dataFrom: string;
                                                        atrExpand: {
                                                            expand: boolean;
                                                        };
                                                        styleList: never[];
                                                        elemExpand: {
                                                            expand: boolean;
                                                        };
                                                        innerEvenet: {};
                                                    };
                                                    type: string;
                                                    index: number;
                                                    label: string;
                                                    styleList: never[];
                                                    refreshAllParameter: {};
                                                    refreshComponentParameter: {};
                                                }[];
                                                dataFrom: string;
                                                atrExpand: {
                                                    expand: boolean;
                                                };
                                                elemExpand: {
                                                    expand: boolean;
                                                };
                                                innerEvenet: {};
                                                styleList?: undefined;
                                            };
                                            type: string;
                                            index: number;
                                            label: string;
                                            styleList: never[];
                                            refreshAllParameter: {};
                                            refreshComponentParameter: {};
                                        } | {
                                            id: string;
                                            js: string;
                                            css: {
                                                class: {};
                                                style: {};
                                            };
                                            data: {
                                                attr: never[];
                                                elem: string;
                                                class: string;
                                                inner: string;
                                                style: string;
                                                dataFrom: string;
                                                atrExpand: {
                                                    expand: boolean;
                                                };
                                                styleList: never[];
                                                elemExpand: {
                                                    expand: boolean;
                                                };
                                                innerEvenet: {};
                                                setting?: undefined;
                                            };
                                            type: string;
                                            index: number;
                                            label: string;
                                            refreshAllParameter: {};
                                            refreshComponentParameter: {};
                                            styleList?: undefined;
                                        } | {
                                            id: string;
                                            js: string;
                                            css: {
                                                class: {};
                                                style: {};
                                            };
                                            data: {
                                                attr: {
                                                    attr: string;
                                                    type: string;
                                                    expand: boolean;
                                                    clickEvent: {
                                                        link: string;
                                                        expand: boolean;
                                                        clickEvent: {
                                                            src: string;
                                                            route: string;
                                                        };
                                                        pluginExpand: {
                                                            expand: boolean;
                                                        };
                                                        stackControl: string;
                                                        dataPlaceExpand: {
                                                            expand: boolean;
                                                        };
                                                        errorPlaceExpand: {
                                                            expand: boolean;
                                                        };
                                                        link_change_type: string;
                                                    }[];
                                                }[];
                                                elem: string;
                                                class: string;
                                                inner: string;
                                                style: string;
                                                setting: never[];
                                                dataFrom: string;
                                                atrExpand: {
                                                    expand: boolean;
                                                };
                                                elemExpand: {
                                                    expand: boolean;
                                                };
                                                innerEvenet: {};
                                                styleList?: undefined;
                                            };
                                            type: string;
                                            index: number;
                                            label: string;
                                            styleList: never[];
                                            refreshAllParameter: {};
                                            refreshComponentParameter: {};
                                        })[];
                                        dataFrom: string;
                                        atrExpand: {
                                            expand: boolean;
                                        };
                                        elemExpand: {
                                            expand: boolean;
                                        };
                                        innerEvenet: {};
                                    };
                                    type: string;
                                    index: number;
                                    label: string;
                                    styleList: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                }[];
                                dataFrom: string;
                                atrExpand: {
                                    expand: boolean;
                                };
                                elemExpand: {
                                    expand: boolean;
                                };
                                innerEvenet: {};
                            };
                            type: string;
                            index: number;
                            label: string;
                            styleList: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                        } | {
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                attr: never[];
                                elem: string;
                                class: string;
                                inner: string;
                                style: string;
                                setting: {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        attr: never[];
                                        elem: string;
                                        class: string;
                                        inner: string;
                                        style: string;
                                        setting: ({
                                            id: string;
                                            js: string;
                                            css: {
                                                class: {};
                                                style: {};
                                            };
                                            data: {
                                                attr: never[];
                                                elem: string;
                                                class: string;
                                                inner: string;
                                                style: string;
                                                setting: {
                                                    id: string;
                                                    js: string;
                                                    css: {
                                                        class: {};
                                                        style: {};
                                                    };
                                                    data: {
                                                        attr: never[];
                                                        elem: string;
                                                        class: string;
                                                        inner: string;
                                                        style: string;
                                                        setting: {
                                                            id: string;
                                                            js: string;
                                                            css: {
                                                                class: {};
                                                                style: {};
                                                            };
                                                            data: {
                                                                attr: {
                                                                    attr: string;
                                                                    type: string;
                                                                    value: string;
                                                                    expand: boolean;
                                                                }[];
                                                                elem: string;
                                                                class: string;
                                                                inner: string;
                                                                style: string;
                                                                setting: never[];
                                                                dataFrom: string;
                                                                atrExpand: {
                                                                    expand: boolean;
                                                                };
                                                                styleList: never[];
                                                                elemExpand: {
                                                                    expand: boolean;
                                                                };
                                                                innerEvenet: {};
                                                            };
                                                            type: string;
                                                            index: number;
                                                            label: string;
                                                            styleList: never[];
                                                            refreshAllParameter: {};
                                                            refreshComponentParameter: {};
                                                        }[];
                                                        dataFrom: string;
                                                        atrExpand: {
                                                            expand: boolean;
                                                        };
                                                        elemExpand: {
                                                            expand: boolean;
                                                        };
                                                        innerEvenet: {};
                                                    };
                                                    type: string;
                                                    index: number;
                                                    label: string;
                                                    styleList: never[];
                                                    refreshAllParameter: {};
                                                    refreshComponentParameter: {};
                                                }[];
                                                dataFrom: string;
                                                atrExpand: {
                                                    expand: boolean;
                                                };
                                                elemExpand: {
                                                    expand: boolean;
                                                };
                                                innerEvenet: {};
                                                styleList?: undefined;
                                            };
                                            type: string;
                                            index: number;
                                            label: string;
                                            styleList: never[];
                                            refreshAllParameter: {};
                                            refreshComponentParameter: {};
                                        } | {
                                            id: string;
                                            js: string;
                                            css: {
                                                class: {};
                                                style: {};
                                            };
                                            data: {
                                                attr: never[];
                                                elem: string;
                                                class: string;
                                                inner: string;
                                                style: string;
                                                setting: {
                                                    id: string;
                                                    js: string;
                                                    css: {
                                                        class: {};
                                                        style: {};
                                                    };
                                                    data: {
                                                        attr: never[];
                                                        elem: string;
                                                        class: string;
                                                        inner: string;
                                                        style: string;
                                                        setting: {
                                                            id: string;
                                                            js: string;
                                                            css: {
                                                                class: {};
                                                                style: {};
                                                            };
                                                            data: {
                                                                attr: never[];
                                                                elem: string;
                                                                class: string;
                                                                inner: string;
                                                                style: string;
                                                                setting: ({
                                                                    id: string;
                                                                    js: string;
                                                                    css: {
                                                                        class: {};
                                                                        style: {};
                                                                    };
                                                                    data: {
                                                                        attr: never[];
                                                                        elem: string;
                                                                        class: string;
                                                                        inner: string;
                                                                        style: string;
                                                                        setting: {
                                                                            id: string;
                                                                            js: string;
                                                                            css: {
                                                                                class: {};
                                                                                style: {};
                                                                            };
                                                                            data: {
                                                                                attr: never[];
                                                                                elem: string;
                                                                                class: string;
                                                                                inner: string;
                                                                                style: string;
                                                                                setting: {
                                                                                    id: string;
                                                                                    js: string;
                                                                                    css: {
                                                                                        class: {};
                                                                                        style: {};
                                                                                    };
                                                                                    data: {
                                                                                        attr: never[];
                                                                                        elem: string;
                                                                                        class: string;
                                                                                        inner: string;
                                                                                        style: string;
                                                                                        setting: never[];
                                                                                        dataFrom: string;
                                                                                        atrExpand: {
                                                                                            expand: boolean;
                                                                                        };
                                                                                        elemExpand: {
                                                                                            expand: boolean;
                                                                                        };
                                                                                        innerEvenet: {};
                                                                                    };
                                                                                    type: string;
                                                                                    index: number;
                                                                                    label: string;
                                                                                    styleList: never[];
                                                                                    refreshAllParameter: {};
                                                                                    refreshComponentParameter: {};
                                                                                }[];
                                                                                dataFrom: string;
                                                                                atrExpand: {
                                                                                    expand: boolean;
                                                                                };
                                                                                elemExpand: {
                                                                                    expand: boolean;
                                                                                };
                                                                                innerEvenet: {};
                                                                            };
                                                                            type: string;
                                                                            index: number;
                                                                            label: string;
                                                                            styleList: never[];
                                                                            refreshAllParameter: {};
                                                                            refreshComponentParameter: {};
                                                                        }[];
                                                                        dataFrom: string;
                                                                        atrExpand: {
                                                                            expand: boolean;
                                                                        };
                                                                        styleList: never[];
                                                                        elemExpand: {
                                                                            expand: boolean;
                                                                        };
                                                                        innerEvenet: {};
                                                                    };
                                                                    type: string;
                                                                    index: number;
                                                                    label: string;
                                                                    styleList: never[];
                                                                    refreshAllParameter: {};
                                                                    refreshComponentParameter: {};
                                                                } | {
                                                                    id: string;
                                                                    js: string;
                                                                    css: {
                                                                        class: {};
                                                                        style: {};
                                                                    };
                                                                    data: {
                                                                        attr: never[];
                                                                        elem: string;
                                                                        class: string;
                                                                        inner: string;
                                                                        style: string;
                                                                        setting: {
                                                                            id: string;
                                                                            js: string;
                                                                            css: {
                                                                                class: {};
                                                                                style: {};
                                                                            };
                                                                            data: {
                                                                                attr: never[];
                                                                                elem: string;
                                                                                note: string;
                                                                                class: string;
                                                                                inner: string;
                                                                                style: string;
                                                                                setting: {
                                                                                    id: string;
                                                                                    js: string;
                                                                                    css: {
                                                                                        class: {};
                                                                                        style: {};
                                                                                    };
                                                                                    data: {
                                                                                        attr: never[];
                                                                                        elem: string;
                                                                                        class: string;
                                                                                        inner: string;
                                                                                        style: string;
                                                                                        setting: never[];
                                                                                        dataFrom: string;
                                                                                        atrExpand: {
                                                                                            expand: boolean;
                                                                                        };
                                                                                        elemExpand: {
                                                                                            expand: boolean;
                                                                                        };
                                                                                        innerEvenet: {};
                                                                                    };
                                                                                    type: string;
                                                                                    index: number;
                                                                                    label: string;
                                                                                    styleList: never[];
                                                                                    refreshAllParameter: {};
                                                                                    refreshComponentParameter: {};
                                                                                }[];
                                                                                dataFrom: string;
                                                                                atrExpand: {
                                                                                    expand: boolean;
                                                                                };
                                                                                elemExpand: {
                                                                                    expand: boolean;
                                                                                };
                                                                                innerEvenet: {};
                                                                            };
                                                                            type: string;
                                                                            index: number;
                                                                            label: string;
                                                                            styleList: never[];
                                                                            refreshAllParameter: {};
                                                                            refreshComponentParameter: {};
                                                                        }[];
                                                                        dataFrom: string;
                                                                        atrExpand: {
                                                                            expand: boolean;
                                                                        };
                                                                        styleList: never[];
                                                                        elemExpand: {
                                                                            expand: boolean;
                                                                        };
                                                                        innerEvenet: {};
                                                                    };
                                                                    type: string;
                                                                    index: number;
                                                                    label: string;
                                                                    styleList: never[];
                                                                    refreshAllParameter: {};
                                                                    refreshComponentParameter: {};
                                                                })[];
                                                                dataFrom: string;
                                                                atrExpand: {
                                                                    expand: boolean;
                                                                };
                                                                elemExpand: {
                                                                    expand: boolean;
                                                                };
                                                                innerEvenet: {};
                                                            };
                                                            type: string;
                                                            index: number;
                                                            label: string;
                                                            styleList: never[];
                                                            refreshAllParameter: {};
                                                            refreshComponentParameter: {};
                                                        }[];
                                                        dataFrom: string;
                                                        atrExpand: {
                                                            expand: boolean;
                                                        };
                                                        elemExpand: {
                                                            expand: boolean;
                                                        };
                                                        innerEvenet: {};
                                                    };
                                                    type: string;
                                                    index: number;
                                                    label: string;
                                                    styleList: never[];
                                                    refreshAllParameter: {};
                                                    refreshComponentParameter: {};
                                                }[];
                                                dataFrom: string;
                                                atrExpand: {
                                                    expand: boolean;
                                                };
                                                styleList: never[];
                                                elemExpand: {
                                                    expand: boolean;
                                                };
                                                innerEvenet: {};
                                            };
                                            type: string;
                                            index: number;
                                            label: string;
                                            styleList: never[];
                                            refreshAllParameter: {};
                                            refreshComponentParameter: {};
                                        })[];
                                        dataFrom: string;
                                        atrExpand: {
                                            expand: boolean;
                                        };
                                        elemExpand: {
                                            expand: boolean;
                                        };
                                        innerEvenet: {};
                                    };
                                    type: string;
                                    index: number;
                                    label: string;
                                    styleList: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                }[];
                                dataFrom: string;
                                atrExpand: {
                                    expand: boolean;
                                };
                                elemExpand: {
                                    expand: boolean;
                                };
                                innerEvenet: {};
                            };
                            type: string;
                            index: number;
                            label: string;
                            styleList: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                        })[];
                        dataFrom: string;
                        atrExpand: {
                            expand: boolean;
                        };
                        elemExpand: {
                            expand: boolean;
                        };
                        innerEvenet: {};
                    };
                    type: string;
                    index: number;
                    label: string;
                    styleList: never[];
                    refreshAllParameter: {};
                    refreshComponentParameter: {};
                }[];
                dataFrom: string;
                atrExpand: {
                    expand: boolean;
                };
                elemExpand: {
                    expand: boolean;
                };
                innerEvenet: {};
                styleList?: undefined;
            };
            type: string;
            index: number;
            label: string;
            styleList: never[];
            refreshAllParameter: {};
            refreshComponentParameter: {};
        })[];
        dataFrom: string;
        atrExpand: {
            expand: boolean;
        };
        styleList: never[];
        elemExpand: {
            expand: boolean;
        };
        innerEvenet: {};
        tag?: undefined;
        list?: undefined;
        expand?: undefined;
        carryData?: undefined;
        note?: undefined;
    };
    type: string;
    index: number;
    label: string;
    styleList: never[];
    refreshAllParameter: {};
    refreshComponentParameter: {};
    style?: undefined;
    hashTag?: undefined;
    class?: undefined;
} | {
    id: string;
    js: string;
    css: {
        class: {};
        style: {};
    };
    data: {
        attr: never[];
        elem: string;
        class: string;
        inner: string;
        setting: {
            id: string;
            js: string;
            css: {
                class: {};
                style: {};
            };
            data: {
                attr: never[];
                elem: string;
                class: string;
                inner: string;
                dataFrom: string;
                atrExpand: {
                    expand: boolean;
                };
                styleList: never[];
                elemExpand: never[];
                innerEvenet: {};
            };
            type: string;
            class: string;
            index: number;
            label: string;
            styleList: never[];
            refreshAllParameter: {};
            refreshComponentParameter: {};
        }[];
        atrExpand: {
            expand: boolean;
        };
        styleList: never[];
        elemExpand: {
            expand: boolean;
        };
        tag?: undefined;
        list?: undefined;
        expand?: undefined;
        carryData?: undefined;
        style?: undefined;
        dataFrom?: undefined;
        innerEvenet?: undefined;
        note?: undefined;
    };
    type: string;
    index: number;
    label: string;
    hashTag: string;
    refreshAllParameter: {};
    refreshComponentParameter: {};
    style?: undefined;
    styleList?: undefined;
    class?: undefined;
} | {
    id: string;
    js: string;
    css: {
        class: {};
        style: {};
    };
    data: {
        attr: never[];
        elem: string;
        class: string;
        inner: string;
        style: string;
        setting: ({
            id: string;
            js: string;
            css: {
                class: {};
                style: {};
            };
            data: {
                attr: never[];
                elem: string;
                class: string;
                inner: string;
                style: string;
                setting: {
                    id: string;
                    js: string;
                    css: {
                        class: {};
                        style: {};
                    };
                    data: {
                        attr: {
                            attr: string;
                            type: string;
                            value: string;
                            expand: boolean;
                        }[];
                        elem: string;
                        class: string;
                        inner: string;
                        style: string;
                        setting: {
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                attr: {
                                    attr: string;
                                    type: string;
                                    value: string;
                                    expand: boolean;
                                }[];
                                elem: string;
                                class: string;
                                inner: string;
                                style: string;
                                setting: ({
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        attr: {
                                            attr: string;
                                            type: string;
                                            value: string;
                                            expand: boolean;
                                        }[];
                                        elem: string;
                                        class: string;
                                        inner: string;
                                        style: string;
                                        setting: {
                                            id: string;
                                            js: string;
                                            css: {
                                                class: {};
                                                style: {};
                                            };
                                            data: {
                                                attr: never[];
                                                elem: string;
                                                class: string;
                                                inner: string;
                                                style: string;
                                                setting: {
                                                    id: string;
                                                    js: string;
                                                    css: {
                                                        class: {};
                                                        style: {};
                                                    };
                                                    data: {
                                                        attr: never[];
                                                        elem: string;
                                                        class: string;
                                                        inner: string;
                                                        style: string;
                                                        setting: {
                                                            id: string;
                                                            js: string;
                                                            css: {
                                                                class: {};
                                                                style: {};
                                                            };
                                                            data: {
                                                                attr: {
                                                                    attr: string;
                                                                    type: string;
                                                                    value: string;
                                                                    expand: boolean;
                                                                }[];
                                                                elem: string;
                                                                class: string;
                                                                inner: string;
                                                                style: string;
                                                                setting: never[];
                                                                dataFrom: string;
                                                                atrExpand: {
                                                                    expand: boolean;
                                                                };
                                                                elemExpand: {
                                                                    expand: boolean;
                                                                };
                                                                innerEvenet: {};
                                                            };
                                                            type: string;
                                                            index: number;
                                                            label: string;
                                                            styleList: never[];
                                                            refreshAllParameter: {};
                                                            refreshComponentParameter: {};
                                                        }[];
                                                        dataFrom: string;
                                                        atrExpand: {
                                                            expand: boolean;
                                                        };
                                                        elemExpand: {
                                                            expand: boolean;
                                                        };
                                                        innerEvenet: {};
                                                    };
                                                    type: string;
                                                    index: number;
                                                    label: string;
                                                    styleList: never[];
                                                    refreshAllParameter: {};
                                                    refreshComponentParameter: {};
                                                }[];
                                                dataFrom: string;
                                                atrExpand: {
                                                    expand: boolean;
                                                };
                                                elemExpand: {
                                                    expand: boolean;
                                                };
                                                innerEvenet: {};
                                            };
                                            type: string;
                                            index: number;
                                            label: string;
                                            styleList: never[];
                                            refreshAllParameter: {};
                                            refreshComponentParameter: {};
                                        }[];
                                        dataFrom: string;
                                        atrExpand: {
                                            expand: boolean;
                                        };
                                        elemExpand: {
                                            expand: boolean;
                                        };
                                        innerEvenet: {};
                                    };
                                    type: string;
                                    index: number;
                                    label: string;
                                    styleList: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                } | {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        attr: {
                                            attr: string;
                                            type: string;
                                            value: string;
                                            expand: boolean;
                                        }[];
                                        elem: string;
                                        class: string;
                                        inner: string;
                                        style: string;
                                        setting: {
                                            id: string;
                                            js: string;
                                            css: {
                                                class: {};
                                                style: {};
                                            };
                                            data: {
                                                attr: never[];
                                                elem: string;
                                                class: string;
                                                inner: string;
                                                style: string;
                                                setting: {
                                                    id: string;
                                                    js: string;
                                                    css: {
                                                        class: {};
                                                        style: {};
                                                    };
                                                    data: {
                                                        attr: never[];
                                                        elem: string;
                                                        class: string;
                                                        inner: string;
                                                        style: string;
                                                        setting: ({
                                                            id: string;
                                                            js: string;
                                                            css: {
                                                                class: {};
                                                                style: {};
                                                            };
                                                            data: {
                                                                attr: {
                                                                    attr: string;
                                                                    type: string;
                                                                    value: string;
                                                                    expand: boolean;
                                                                }[];
                                                                elem: string;
                                                                class: string;
                                                                inner: string;
                                                                style: string;
                                                                setting: never[];
                                                                dataFrom: string;
                                                                atrExpand: {
                                                                    expand: boolean;
                                                                };
                                                                styleList: never[];
                                                                elemExpand: {
                                                                    expand: boolean;
                                                                };
                                                                innerEvenet: {};
                                                            };
                                                            type: string;
                                                            index: number;
                                                            label: string;
                                                            styleList: never[];
                                                            refreshAllParameter: {};
                                                            refreshComponentParameter: {};
                                                        } | {
                                                            id: string;
                                                            js: string;
                                                            css: {
                                                                class: {};
                                                                style: {};
                                                            };
                                                            data: {
                                                                attr: never[];
                                                                elem: string;
                                                                class: string;
                                                                inner: string;
                                                                style: string;
                                                                setting: never[];
                                                                dataFrom: string;
                                                                atrExpand: {
                                                                    expand: boolean;
                                                                };
                                                                elemExpand: {
                                                                    expand: boolean;
                                                                };
                                                                innerEvenet: {};
                                                                styleList?: undefined;
                                                            };
                                                            type: string;
                                                            index: number;
                                                            label: string;
                                                            styleList: never[];
                                                            refreshAllParameter: {};
                                                            refreshComponentParameter: {};
                                                        })[];
                                                        dataFrom: string;
                                                        atrExpand: {
                                                            expand: boolean;
                                                        };
                                                        elemExpand: {
                                                            expand: boolean;
                                                        };
                                                        innerEvenet: {};
                                                    };
                                                    type: string;
                                                    index: number;
                                                    label: string;
                                                    styleList: never[];
                                                    refreshAllParameter: {};
                                                    refreshComponentParameter: {};
                                                }[];
                                                dataFrom: string;
                                                atrExpand: {
                                                    expand: boolean;
                                                };
                                                elemExpand: {
                                                    expand: boolean;
                                                };
                                                innerEvenet: {};
                                            };
                                            type: string;
                                            index: number;
                                            label: string;
                                            styleList: never[];
                                            refreshAllParameter: {};
                                            refreshComponentParameter: {};
                                        }[];
                                        dataFrom: string;
                                        atrExpand: {
                                            expand: boolean;
                                        };
                                        elemExpand: {
                                            expand: boolean;
                                        };
                                        innerEvenet: {};
                                    };
                                    type: string;
                                    index: number;
                                    label: string;
                                    styleList: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                })[];
                                dataFrom: string;
                                atrExpand: {
                                    expand: boolean;
                                };
                                elemExpand: {
                                    expand: boolean;
                                };
                                innerEvenet: {};
                            };
                            type: string;
                            index: number;
                            label: string;
                            styleList: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                        }[];
                        dataFrom: string;
                        atrExpand: {
                            expand: boolean;
                        };
                        elemExpand: {
                            expand: boolean;
                        };
                        innerEvenet: {};
                    };
                    type: string;
                    index: number;
                    label: string;
                    styleList: never[];
                    refreshAllParameter: {};
                    refreshComponentParameter: {};
                }[];
                dataFrom: string;
                atrExpand: {
                    expand: boolean;
                };
                styleList: never[];
                elemExpand: {
                    expand: boolean;
                };
                innerEvenet: {};
            };
            type: string;
            index: number;
            label: string;
            styleList: never[];
            refreshAllParameter: {};
            refreshComponentParameter: {};
        } | {
            id: string;
            js: string;
            css: {
                class: {};
                style: {};
            };
            data: {
                attr: never[];
                elem: string;
                class: string;
                inner: string;
                style: string;
                setting: ({
                    id: string;
                    js: string;
                    css: {
                        class: {};
                        style: {};
                    };
                    data: {
                        attr: {
                            attr: string;
                            type: string;
                            value: string;
                            expand: boolean;
                        }[];
                        elem: string;
                        class: string;
                        inner: string;
                        style: string;
                        setting: {
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                attr: never[];
                                elem: string;
                                class: string;
                                inner: string;
                                style: string;
                                setting: ({
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        attr: never[];
                                        elem: string;
                                        class: string;
                                        inner: string;
                                        style: string;
                                        setting: {
                                            id: string;
                                            js: string;
                                            css: {
                                                class: {};
                                                style: {};
                                            };
                                            data: {
                                                attr: never[];
                                                elem: string;
                                                class: string;
                                                inner: string;
                                                style: string;
                                                setting: never[];
                                                dataFrom: string;
                                                atrExpand: {
                                                    expand: boolean;
                                                };
                                                elemExpand: {
                                                    expand: boolean;
                                                };
                                                innerEvenet: {};
                                            };
                                            type: string;
                                            index: number;
                                            label: string;
                                            styleList: never[];
                                            refreshAllParameter: {};
                                            refreshComponentParameter: {};
                                        }[];
                                        dataFrom: string;
                                        atrExpand: {
                                            expand: boolean;
                                        };
                                        elemExpand: {
                                            expand: boolean;
                                        };
                                        innerEvenet: {};
                                    };
                                    type: string;
                                    index: number;
                                    label: string;
                                    styleList: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                } | {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        attr: {
                                            attr: string;
                                            type: string;
                                            expand: boolean;
                                            clickEvent: {
                                                link: string;
                                                expand: boolean;
                                                clickEvent: {
                                                    src: string;
                                                    route: string;
                                                };
                                                pluginExpand: {
                                                    expand: boolean;
                                                };
                                                stackControl: string;
                                                dataPlaceExpand: {
                                                    expand: boolean;
                                                };
                                                errorPlaceExpand: {
                                                    expand: boolean;
                                                };
                                                link_change_type: string;
                                            }[];
                                        }[];
                                        elem: string;
                                        class: string;
                                        inner: string;
                                        style: string;
                                        setting: never[];
                                        dataFrom: string;
                                        atrExpand: {
                                            expand: boolean;
                                        };
                                        elemExpand: {
                                            expand: boolean;
                                        };
                                        innerEvenet: {};
                                    };
                                    type: string;
                                    index: number;
                                    label: string;
                                    styleList: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                })[];
                                dataFrom: string;
                                atrExpand: {
                                    expand: boolean;
                                };
                                elemExpand: {
                                    expand: boolean;
                                };
                                innerEvenet: {};
                            };
                            type: string;
                            index: number;
                            label: string;
                            styleList: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                        }[];
                        dataFrom: string;
                        atrExpand: {
                            expand: boolean;
                        };
                        elemExpand: {
                            expand: boolean;
                        };
                        innerEvenet: {};
                        styleList?: undefined;
                    };
                    type: string;
                    index: number;
                    label: string;
                    styleList: never[];
                    refreshAllParameter: {};
                    refreshComponentParameter: {};
                } | {
                    id: string;
                    js: string;
                    css: {
                        class: {};
                        style: {};
                    };
                    data: {
                        attr: {
                            attr: string;
                            type: string;
                            value: string;
                            expand: boolean;
                        }[];
                        elem: string;
                        class: string;
                        inner: string;
                        style: string;
                        setting: {
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                attr: never[];
                                elem: string;
                                class: string;
                                inner: string;
                                style: string;
                                setting: ({
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        attr: {
                                            attr: string;
                                            type: string;
                                            value: string;
                                            expand: boolean;
                                        }[];
                                        elem: string;
                                        class: string;
                                        inner: string;
                                        style: string;
                                        setting: never[];
                                        dataFrom: string;
                                        atrExpand: {
                                            expand: boolean;
                                        };
                                        styleList: never[];
                                        elemExpand: {
                                            expand: boolean;
                                        };
                                        innerEvenet: {};
                                    };
                                    type: string;
                                    index: number;
                                    label: string;
                                    styleList: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                } | {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        attr: {
                                            attr: string;
                                            type: string;
                                            value: string;
                                            expand: boolean;
                                        }[];
                                        elem: string;
                                        class: string;
                                        inner: string;
                                        style: string;
                                        setting: never[];
                                        dataFrom: string;
                                        atrExpand: {
                                            expand: boolean;
                                        };
                                        elemExpand: {
                                            expand: boolean;
                                        };
                                        innerEvenet: {};
                                        styleList?: undefined;
                                    };
                                    type: string;
                                    index: number;
                                    label: string;
                                    styleList: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                })[];
                                dataFrom: string;
                                atrExpand: {
                                    expand: boolean;
                                };
                                styleList: never[];
                                elemExpand: {
                                    expand: boolean;
                                };
                                innerEvenet: {};
                            };
                            type: string;
                            index: number;
                            label: string;
                            styleList: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                        }[];
                        dataFrom: string;
                        atrExpand: {
                            expand: boolean;
                        };
                        styleList: never[];
                        elemExpand: {
                            expand: boolean;
                        };
                        innerEvenet: {};
                    };
                    type: string;
                    index: number;
                    label: string;
                    styleList: never[];
                    refreshAllParameter: {};
                    refreshComponentParameter: {};
                })[];
                dataFrom: string;
                atrExpand: {
                    expand: boolean;
                };
                styleList: never[];
                elemExpand: {
                    expand: boolean;
                };
                innerEvenet: {};
            };
            type: string;
            index: number;
            label: string;
            styleList: never[];
            refreshAllParameter: {};
            refreshComponentParameter: {};
        } | {
            id: string;
            js: string;
            css: {
                class: {};
                style: {};
            };
            data: {
                attr: never[];
                elem: string;
                class: string;
                inner: string;
                style: string;
                setting: ({
                    id: string;
                    js: string;
                    css: {
                        class: {};
                        style: {};
                    };
                    data: {
                        attr: {
                            attr: string;
                            type: string;
                            value: string;
                            expand: boolean;
                        }[];
                        elem: string;
                        class: string;
                        inner: string;
                        style: string;
                        setting: {
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                attr: never[];
                                elem: string;
                                class: string;
                                inner: string;
                                style: string;
                                setting: ({
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        attr: never[];
                                        elem: string;
                                        class: string;
                                        inner: string;
                                        style: string;
                                        setting: {
                                            id: string;
                                            js: string;
                                            css: {
                                                class: {};
                                                style: {};
                                            };
                                            data: {
                                                attr: never[];
                                                elem: string;
                                                class: string;
                                                inner: string;
                                                style: string;
                                                setting: never[];
                                                dataFrom: string;
                                                atrExpand: {
                                                    expand: boolean;
                                                };
                                                elemExpand: {
                                                    expand: boolean;
                                                };
                                                innerEvenet: {};
                                            };
                                            type: string;
                                            index: number;
                                            label: string;
                                            styleList: never[];
                                            refreshAllParameter: {};
                                            refreshComponentParameter: {};
                                        }[];
                                        dataFrom: string;
                                        atrExpand: {
                                            expand: boolean;
                                        };
                                        elemExpand: {
                                            expand: boolean;
                                        };
                                        innerEvenet: {};
                                    };
                                    type: string;
                                    index: number;
                                    label: string;
                                    styleList: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                } | {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        attr: {
                                            attr: string;
                                            type: string;
                                            expand: boolean;
                                            clickEvent: {
                                                link: string;
                                                expand: boolean;
                                                clickEvent: {
                                                    src: string;
                                                    route: string;
                                                };
                                                pluginExpand: {
                                                    expand: boolean;
                                                };
                                                stackControl: string;
                                                dataPlaceExpand: {
                                                    expand: boolean;
                                                };
                                                errorPlaceExpand: {
                                                    expand: boolean;
                                                };
                                                link_change_type: string;
                                            }[];
                                        }[];
                                        elem: string;
                                        class: string;
                                        inner: string;
                                        style: string;
                                        setting: never[];
                                        dataFrom: string;
                                        atrExpand: {
                                            expand: boolean;
                                        };
                                        elemExpand: {
                                            expand: boolean;
                                        };
                                        innerEvenet: {};
                                    };
                                    type: string;
                                    index: number;
                                    label: string;
                                    styleList: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                })[];
                                dataFrom: string;
                                atrExpand: {
                                    expand: boolean;
                                };
                                elemExpand: {
                                    expand: boolean;
                                };
                                innerEvenet: {};
                            };
                            type: string;
                            index: number;
                            label: string;
                            styleList: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                        }[];
                        dataFrom: string;
                        atrExpand: {
                            expand: boolean;
                        };
                        elemExpand: {
                            expand: boolean;
                        };
                        innerEvenet: {};
                        styleList?: undefined;
                    };
                    type: string;
                    index: number;
                    label: string;
                    styleList: never[];
                    refreshAllParameter: {};
                    refreshComponentParameter: {};
                } | {
                    id: string;
                    js: string;
                    css: {
                        class: {};
                        style: {};
                    };
                    data: {
                        attr: {
                            attr: string;
                            type: string;
                            value: string;
                            expand: boolean;
                        }[];
                        elem: string;
                        class: string;
                        inner: string;
                        style: string;
                        setting: {
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                attr: never[];
                                elem: string;
                                class: string;
                                inner: string;
                                style: string;
                                setting: ({
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        attr: {
                                            attr: string;
                                            type: string;
                                            value: string;
                                            expand: boolean;
                                        }[];
                                        elem: string;
                                        class: string;
                                        inner: string;
                                        style: string;
                                        setting: never[];
                                        dataFrom: string;
                                        atrExpand: {
                                            expand: boolean;
                                        };
                                        styleList: never[];
                                        elemExpand: {
                                            expand: boolean;
                                        };
                                        innerEvenet: {};
                                    };
                                    type: string;
                                    index: number;
                                    label: string;
                                    styleList: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                } | {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        attr: {
                                            attr: string;
                                            type: string;
                                            value: string;
                                            expand: boolean;
                                        }[];
                                        elem: string;
                                        class: string;
                                        inner: string;
                                        style: string;
                                        setting: never[];
                                        dataFrom: string;
                                        atrExpand: {
                                            expand: boolean;
                                        };
                                        elemExpand: {
                                            expand: boolean;
                                        };
                                        innerEvenet: {};
                                        styleList?: undefined;
                                    };
                                    type: string;
                                    index: number;
                                    label: string;
                                    styleList: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                })[];
                                dataFrom: string;
                                atrExpand: {
                                    expand: boolean;
                                };
                                elemExpand: {
                                    expand: boolean;
                                };
                                innerEvenet: {};
                            };
                            type: string;
                            index: number;
                            label: string;
                            styleList: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                        }[];
                        dataFrom: string;
                        atrExpand: {
                            expand: boolean;
                        };
                        styleList: never[];
                        elemExpand: {
                            expand: boolean;
                        };
                        innerEvenet: {};
                    };
                    type: string;
                    index: number;
                    label: string;
                    styleList: never[];
                    refreshAllParameter: {};
                    refreshComponentParameter: {};
                })[];
                dataFrom: string;
                atrExpand: {
                    expand: boolean;
                };
                styleList: never[];
                elemExpand: {
                    expand: boolean;
                };
                innerEvenet: {};
            };
            type: string;
            index: number;
            label: string;
            styleList: never[];
            refreshAllParameter: {};
            refreshComponentParameter: {};
        } | {
            id: string;
            js: string;
            css: {
                class: {};
                style: {};
            };
            data: {
                attr: never[];
                elem: string;
                class: string;
                inner: string;
                style: string;
                setting: {
                    id: string;
                    js: string;
                    css: {
                        class: {};
                        style: {};
                    };
                    data: {
                        attr: {
                            attr: string;
                            type: string;
                            value: string;
                            expand: boolean;
                        }[];
                        elem: string;
                        class: string;
                        inner: string;
                        style: string;
                        setting: {
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                attr: never[];
                                elem: string;
                                class: string;
                                inner: string;
                                style: string;
                                setting: ({
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        attr: {
                                            attr: string;
                                            type: string;
                                            value: string;
                                            expand: boolean;
                                        }[];
                                        elem: string;
                                        class: string;
                                        inner: string;
                                        style: string;
                                        setting: never[];
                                        dataFrom: string;
                                        atrExpand: {
                                            expand: boolean;
                                        };
                                        styleList: never[];
                                        elemExpand: {
                                            expand: boolean;
                                        };
                                        innerEvenet: {};
                                    };
                                    type: string;
                                    index: number;
                                    label: string;
                                    styleList: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                } | {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        attr: {
                                            attr: string;
                                            type: string;
                                            value: string;
                                            expand: boolean;
                                        }[];
                                        elem: string;
                                        class: string;
                                        inner: string;
                                        style: string;
                                        setting: never[];
                                        dataFrom: string;
                                        atrExpand: {
                                            expand: boolean;
                                        };
                                        elemExpand: {
                                            expand: boolean;
                                        };
                                        innerEvenet: {};
                                        styleList?: undefined;
                                    };
                                    type: string;
                                    index: number;
                                    label: string;
                                    styleList: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                })[];
                                dataFrom: string;
                                atrExpand: {
                                    expand: boolean;
                                };
                                elemExpand: {
                                    expand: boolean;
                                };
                                innerEvenet: {};
                            };
                            type: string;
                            index: number;
                            label: string;
                            styleList: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                        }[];
                        dataFrom: string;
                        atrExpand: {
                            expand: boolean;
                        };
                        elemExpand: {
                            expand: boolean;
                        };
                        innerEvenet: {};
                    };
                    type: string;
                    index: number;
                    label: string;
                    styleList: never[];
                    refreshAllParameter: {};
                    refreshComponentParameter: {};
                }[];
                dataFrom: string;
                atrExpand: {
                    expand: boolean;
                };
                elemExpand: {
                    expand: boolean;
                };
                innerEvenet: {};
                styleList?: undefined;
            };
            type: string;
            index: number;
            label: string;
            styleList: never[];
            refreshAllParameter: {};
            refreshComponentParameter: {};
        } | {
            id: string;
            js: string;
            css: {
                class: {};
                style: {};
            };
            data: {
                attr: never[];
                elem: string;
                class: string;
                inner: string;
                style: string;
                setting: {
                    id: string;
                    js: string;
                    css: {
                        class: {};
                        style: {};
                    };
                    data: {
                        attr: {
                            attr: string;
                            type: string;
                            value: string;
                            expand: boolean;
                        }[];
                        elem: string;
                        class: string;
                        inner: string;
                        style: string;
                        setting: {
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                attr: never[];
                                elem: string;
                                class: string;
                                inner: string;
                                style: string;
                                setting: ({
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        attr: {
                                            attr: string;
                                            type: string;
                                            value: string;
                                            expand: boolean;
                                        }[];
                                        elem: string;
                                        class: string;
                                        inner: string;
                                        style: string;
                                        setting: never[];
                                        dataFrom: string;
                                        atrExpand: {
                                            expand: boolean;
                                        };
                                        styleList: never[];
                                        elemExpand: {
                                            expand: boolean;
                                        };
                                        innerEvenet: {};
                                    };
                                    type: string;
                                    index: number;
                                    label: string;
                                    styleList: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                } | {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        attr: {
                                            attr: string;
                                            type: string;
                                            value: string;
                                            expand: boolean;
                                        }[];
                                        elem: string;
                                        class: string;
                                        inner: string;
                                        style: string;
                                        setting: never[];
                                        dataFrom: string;
                                        atrExpand: {
                                            expand: boolean;
                                        };
                                        elemExpand: {
                                            expand: boolean;
                                        };
                                        innerEvenet: {};
                                        styleList?: undefined;
                                    };
                                    type: string;
                                    index: number;
                                    label: string;
                                    styleList: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                })[];
                                dataFrom: string;
                                atrExpand: {
                                    expand: boolean;
                                };
                                elemExpand: {
                                    expand: boolean;
                                };
                                innerEvenet: {};
                            };
                            type: string;
                            index: number;
                            label: string;
                            styleList: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                        }[];
                        dataFrom: string;
                        atrExpand: {
                            expand: boolean;
                        };
                        elemExpand: {
                            expand: boolean;
                        };
                        innerEvenet: {};
                    };
                    type: string;
                    index: number;
                    label: string;
                    styleList: never[];
                    refreshAllParameter: {};
                    refreshComponentParameter: {};
                }[];
                dataFrom: string;
                atrExpand: {
                    expand: boolean;
                };
                styleList: never[];
                elemExpand: {
                    expand: boolean;
                };
                innerEvenet: {};
            };
            type: string;
            index: number;
            label: string;
            styleList: never[];
            refreshAllParameter: {};
            refreshComponentParameter: {};
        })[];
        dataFrom: string;
        atrExpand: {
            expand: boolean;
        };
        styleList: never[];
        elemExpand: {
            expand: boolean;
        };
        innerEvenet: {};
        tag?: undefined;
        list?: undefined;
        expand?: undefined;
        carryData?: undefined;
        note?: undefined;
    };
    type: string;
    index: number;
    label: string;
    styleList: never[];
    refreshAllParameter: {};
    refreshComponentParameter: {};
    style?: undefined;
    hashTag?: undefined;
    class?: undefined;
} | {
    id: string;
    js: string;
    css: {
        class: {};
        style: {};
    };
    data: {
        attr: never[];
        elem: string;
        class: string;
        inner: string;
        style: string;
        setting: ({
            id: string;
            js: string;
            css: {
                class: {};
                style: {};
            };
            data: {
                attr: never[];
                elem: string;
                class: string;
                inner: string;
                style: string;
                setting: never[];
                dataFrom: string;
                atrExpand: {
                    expand: boolean;
                };
                styleList: never[];
                elemExpand: {
                    expand: boolean;
                };
                innerEvenet: {};
            };
            type: string;
            index: number;
            label: string;
            styleList: never[];
            refreshAllParameter: {};
            refreshComponentParameter: {};
        } | {
            id: string;
            js: string;
            css: {
                class: {};
                style: {};
            };
            data: {
                attr: {
                    attr: string;
                    type: string;
                    value: string;
                    expand: boolean;
                }[];
                elem: string;
                class: string;
                inner: string;
                style: string;
                setting: ({
                    id: string;
                    js: string;
                    css: {
                        class: {};
                        style: {};
                    };
                    data: {
                        attr: {
                            attr: string;
                            type: string;
                            value: string;
                            expand: boolean;
                        }[];
                        elem: string;
                        class: string;
                        inner: string;
                        style: string;
                        setting: {
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                attr: {
                                    attr: string;
                                    type: string;
                                    value: string;
                                    expand: boolean;
                                }[];
                                elem: string;
                                class: string;
                                inner: string;
                                style: string;
                                setting: {
                                    id: string;
                                    js: string;
                                    css: {
                                        class: {};
                                        style: {};
                                    };
                                    data: {
                                        attr: {
                                            attr: string;
                                            type: string;
                                            value: string;
                                            expand: boolean;
                                        }[];
                                        elem: string;
                                        class: string;
                                        inner: string;
                                        style: string;
                                        setting: {
                                            id: string;
                                            js: string;
                                            css: {
                                                class: {};
                                                style: {};
                                            };
                                            data: {
                                                attr: never[];
                                                elem: string;
                                                class: string;
                                                inner: string;
                                                style: string;
                                                setting: never[];
                                                dataFrom: string;
                                                atrExpand: {
                                                    expand: boolean;
                                                };
                                                styleList: never[];
                                                elemExpand: {
                                                    expand: boolean;
                                                };
                                                innerEvenet: {};
                                            };
                                            type: string;
                                            index: number;
                                            label: string;
                                            styleList: never[];
                                            refreshAllParameter: {};
                                            refreshComponentParameter: {};
                                        }[];
                                        dataFrom: string;
                                        atrExpand: {
                                            expand: boolean;
                                        };
                                        styleList: never[];
                                        elemExpand: {
                                            expand: boolean;
                                        };
                                        innerEvenet: {};
                                    };
                                    type: string;
                                    index: number;
                                    label: string;
                                    styleList: never[];
                                    refreshAllParameter: {};
                                    refreshComponentParameter: {};
                                }[];
                                dataFrom: string;
                                atrExpand: {
                                    expand: boolean;
                                };
                                styleList: never[];
                                elemExpand: {
                                    expand: boolean;
                                };
                                innerEvenet: {};
                            };
                            type: string;
                            index: number;
                            label: string;
                            styleList: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                        }[];
                        dataFrom: string;
                        atrExpand: {
                            expand: boolean;
                        };
                        elemExpand: {
                            expand: boolean;
                        };
                        innerEvenet: {};
                    };
                    type: string;
                    index: number;
                    label: string;
                    styleList: never[];
                    refreshAllParameter: {};
                    refreshComponentParameter: {};
                } | {
                    id: string;
                    js: string;
                    css: {
                        class: {};
                        style: {};
                    };
                    data: {
                        attr: never[];
                        elem: string;
                        class: string;
                        inner: string;
                        style: string;
                        setting: {
                            id: string;
                            js: string;
                            css: {
                                class: {};
                                style: {};
                            };
                            data: {
                                attr: {
                                    attr: string;
                                    type: string;
                                    value: string;
                                    expand: boolean;
                                }[];
                                elem: string;
                                class: string;
                                inner: string;
                                style: string;
                                setting: never[];
                                dataFrom: string;
                                atrExpand: {
                                    expand: boolean;
                                };
                                elemExpand: {
                                    expand: boolean;
                                };
                                innerEvenet: {};
                            };
                            type: string;
                            index: number;
                            label: string;
                            styleList: never[];
                            refreshAllParameter: {};
                            refreshComponentParameter: {};
                        }[];
                        dataFrom: string;
                        atrExpand: {
                            expand: boolean;
                        };
                        elemExpand: {
                            expand: boolean;
                        };
                        innerEvenet: {};
                    };
                    type: string;
                    index: number;
                    label: string;
                    styleList: never[];
                    refreshAllParameter: {};
                    refreshComponentParameter: {};
                })[];
                dataFrom: string;
                atrExpand: {
                    expand: boolean;
                };
                elemExpand: {
                    expand: boolean;
                };
                innerEvenet: {};
                styleList?: undefined;
            };
            type: string;
            index: number;
            label: string;
            styleList: never[];
            refreshAllParameter: {};
            refreshComponentParameter: {};
        })[];
        dataFrom: string;
        atrExpand: {
            expand: boolean;
        };
        styleList: never[];
        elemExpand: {
            expand: boolean;
        };
        innerEvenet: {};
        tag?: undefined;
        list?: undefined;
        expand?: undefined;
        carryData?: undefined;
        note?: undefined;
    };
    type: string;
    index: number;
    label: string;
    styleList: never[];
    refreshAllParameter: {};
    refreshComponentParameter: {};
    style?: undefined;
    hashTag?: undefined;
    class?: undefined;
} | {
    id: string;
    js: string;
    css: {
        class: {};
        style: {};
    };
    data: {
        tag: string;
        list: never[];
        expand: boolean;
        carryData: {};
        attr?: undefined;
        elem?: undefined;
        class?: undefined;
        inner?: undefined;
        style?: undefined;
        setting?: undefined;
        dataFrom?: undefined;
        atrExpand?: undefined;
        styleList?: undefined;
        elemExpand?: undefined;
        innerEvenet?: undefined;
        note?: undefined;
    };
    type: string;
    class: string;
    index: number;
    label: string;
    style: string;
    styleList: never[];
    refreshAllParameter: {};
    refreshComponentParameter: {};
    hashTag?: undefined;
} | {
    id: string;
    js: string;
    css: {
        class: {};
        style: {};
    };
    data: {
        attr: {
            attr: string;
            type: string;
            value: string;
            expand: boolean;
        }[];
        elem: string;
        note: string;
        class: string;
        inner: string;
        style: string;
        setting: never[];
        dataFrom: string;
        atrExpand: {
            expand: boolean;
        };
        elemExpand: {
            expand: boolean;
        };
        innerEvenet: {};
        tag?: undefined;
        list?: undefined;
        expand?: undefined;
        carryData?: undefined;
        styleList?: undefined;
    };
    type: string;
    index: number;
    label: string;
    styleList: never[];
    refreshAllParameter: {};
    refreshComponentParameter: {};
    style?: undefined;
    hashTag?: undefined;
    class?: undefined;
} | {
    id: string;
    js: string;
    css: {
        class: {};
        style: {};
    };
    data: {
        attr: never[];
        elem: string;
        class: string;
        inner: string;
        style: string;
        setting: never[];
        dataFrom: string;
        atrExpand: {
            expand: boolean;
        };
        elemExpand: {
            expand: boolean;
        };
        innerEvenet: {};
        tag?: undefined;
        list?: undefined;
        expand?: undefined;
        carryData?: undefined;
        styleList?: undefined;
        note?: undefined;
    };
    type: string;
    index: number;
    label: string;
    styleList: never[];
    refreshAllParameter: {};
    refreshComponentParameter: {};
    style?: undefined;
    hashTag?: undefined;
    class?: undefined;
})[];
declare function covert(data: any): void;
