import { Plugin } from "../../glitterBundle/plugins/plugin-creater.js";
import { TriggerEvent } from "../../glitterBundle/plugins/trigger-event.js";
import { EditorElem } from "../../glitterBundle/plugins/editor-elem.js";
export const component = Plugin.createComponent(import.meta.url, (glitter, editMode) => {
    return {
        render: (gvc, widget, setting, hoverID, subData) => {
            var _a, _b, _c, _d;
            widget.data.elem = (_a = widget.data.elem) !== null && _a !== void 0 ? _a : "h3";
            widget.data.inner = (_b = widget.data.inner) !== null && _b !== void 0 ? _b : "";
            widget.data.attr = (_c = widget.data.attr) !== null && _c !== void 0 ? _c : [];
            const id = glitter.getUUID();
            subData = subData !== null && subData !== void 0 ? subData : {};
            let formData = subData;
            if ((widget.data.dataFrom === "code")) {
                widget.data.innerEvenet = (_d = widget.data.innerEvenet) !== null && _d !== void 0 ? _d : {};
                TriggerEvent.trigger({
                    gvc: gvc,
                    widget: widget,
                    clickEvent: widget.data.innerEvenet
                }).then((data) => {
                    if (widget.data.elem === 'select') {
                        formData[widget.data.key] = data;
                    }
                    widget.data.inner = data;
                    gvc.notifyDataChange(id);
                });
            }
            return {
                view: () => {
                    return gvc.bindView(() => {
                        var _a;
                        const vm = {
                            callback: () => {
                                gvc.notifyDataChange(id);
                            },
                            data: []
                        };
                        if (widget.data.elem === 'select' && widget.data.selectType === 'api') {
                            widget.data.selectAPI = (_a = widget.data.selectAPI) !== null && _a !== void 0 ? _a : {};
                            TriggerEvent.trigger({
                                gvc: gvc, widget: widget, clickEvent: widget.data.selectAPI, subData: vm
                            });
                        }
                        let option = widget.data.attr.map((dd) => {
                            if (dd.type === 'par') {
                                return { key: dd.attr, value: dd.value };
                            }
                            else {
                                return {
                                    key: dd.attr, value: gvc.event((e, event) => {
                                        TriggerEvent.trigger({
                                            gvc: gvc,
                                            widget: widget,
                                            clickEvent: dd,
                                            element: { e, event }
                                        }).then((data) => {
                                        });
                                    })
                                };
                            }
                        });
                        if (widget.data.elem === 'img') {
                            option.push({ key: 'src', value: widget.data.inner });
                        }
                        return {
                            bind: id,
                            view: () => {
                                switch (widget.data.elem) {
                                    case 'select':
                                        formData[widget.data.key] = widget.data.inner;
                                        if (widget.data.selectType === 'api') {
                                            return vm.data.map((dd) => {
                                                var _a;
                                                formData[widget.data.key] = (_a = formData[widget.data.key]) !== null && _a !== void 0 ? _a : dd.value;
                                                if (dd.visible === 'invisible' && (dd.value !== formData[widget.data.key])) {
                                                    return ``;
                                                }
                                                return `<option class="" value="${dd.value}" ${`${dd.value}` === `${formData[widget.data.key]}` ? `selected` : ``}>
                                ${dd.key}
                            </option>`;
                                            }).join('') + `<option value="" ${formData[widget.data.key] === '' ? `selected` : ``}>
                                選擇${widget.data.label}
                            </option>`;
                                        }
                                        else {
                                            return widget.data.selectList.map((dd) => {
                                                var _a;
                                                if (dd.visible === 'invisible' && (dd.value !== formData[widget.data.key])) {
                                                    return ``;
                                                }
                                                formData[widget.data.key] = (_a = formData[widget.data.key]) !== null && _a !== void 0 ? _a : dd.value;
                                                return `<option value="${dd.value}" ${dd.value === formData[widget.data.key] ? `selected` : ``}>
                                ${dd.name}
                            </option>`;
                                            }).join('');
                                        }
                                    case 'img':
                                        return ``;
                                    default:
                                        return widget.data.inner;
                                }
                            },
                            divCreate: {
                                elem: widget.data.elem,
                                class: glitter.htmlGenerate.styleEditor(widget.data).class(),
                                style: glitter.htmlGenerate.styleEditor(widget.data).style(),
                                option: option
                            }
                        };
                    });
                },
                editor: () => {
                    var _a, _b, _c;
                    widget.type = (_a = widget.type) !== null && _a !== void 0 ? _a : "elem";
                    widget.data.elemExpand = (_b = widget.data.elemExpand) !== null && _b !== void 0 ? _b : [];
                    widget.data.atrExpand = (_c = widget.data.atrExpand) !== null && _c !== void 0 ? _c : {};
                    return gvc.map([
                        `<div class="mt-2"></div>`,
                        EditorElem.toggleExpand({
                            gvc: gvc,
                            title: '元件設定',
                            data: widget.data.elemExpand,
                            innerText: () => {
                                return gvc.map([
                                    glitter.htmlGenerate.styleEditor(widget.data).editor(gvc, () => {
                                        widget.refreshComponent();
                                    }, '元素設計樣式'),
                                    EditorElem.searchInput({
                                        title: 'HTML元素標籤',
                                        gvc: gvc,
                                        def: widget.data.elem,
                                        array: ['button', 'h1', 'h2', 'h3', 'h4', 'h5', 'li', 'ul', 'table', 'div', 'header', 'section', 'span', 'p', 'a', 'img',
                                            'input', 'select'],
                                        callback: (text) => {
                                            widget.data.elem = text;
                                            widget.refreshComponent();
                                        },
                                        placeHolder: "請輸入元素標籤"
                                    }),
                                    (() => {
                                        var _a, _b, _c, _d, _e, _f, _g;
                                        switch (widget.data.elem) {
                                            case 'select':
                                                widget.data.selectList = (_a = widget.data.selectList) !== null && _a !== void 0 ? _a : [];
                                                widget.data.selectType = (_b = widget.data.selectType) !== null && _b !== void 0 ? _b : 'manual';
                                                const list = widget.data.selectList;
                                                let html = EditorElem.select({
                                                    title: '資料來源',
                                                    gvc: gvc,
                                                    def: widget.data.selectType,
                                                    array: [{
                                                            title: '手動設定', value: 'manual'
                                                        }, {
                                                            title: 'API', value: 'api'
                                                        }],
                                                    callback: (text) => {
                                                        widget.data.selectType = text;
                                                        widget.refreshComponent();
                                                    }
                                                });
                                                if (widget.data.selectType === 'manual') {
                                                    html += `<div class="alert alert-dark mt-2 p-2">${(EditorElem.arrayItem({
                                                        gvc: gvc,
                                                        title: "選項集合",
                                                        originalArray: widget.data.selectList,
                                                        array: widget.data.selectList.map((dd, index) => {
                                                            var _a;
                                                            dd.visible = (_a = dd.visible) !== null && _a !== void 0 ? _a : 'visible';
                                                            return {
                                                                title: dd.name || `區塊:${index + 1}`,
                                                                expand: dd,
                                                                innerHtml: (gvc) => {
                                                                    var _a;
                                                                    return glitter.htmlGenerate.editeInput({
                                                                        gvc: gvc,
                                                                        title: `參數標題`,
                                                                        default: dd.name,
                                                                        placeHolder: "輸入參數標題",
                                                                        callback: (text) => {
                                                                            dd.name = text;
                                                                            widget.refreshComponent();
                                                                        }
                                                                    }) + glitter.htmlGenerate.editeInput({
                                                                        gvc: gvc,
                                                                        title: `Value`,
                                                                        default: dd.value,
                                                                        placeHolder: "輸入參數值",
                                                                        callback: (text) => {
                                                                            dd.value = text;
                                                                            widget.refreshComponent();
                                                                        }
                                                                    }) +
                                                                        `${EditorElem.select({
                                                                            title: "參數可見度",
                                                                            gvc: gvc,
                                                                            def: (_a = dd.visible) !== null && _a !== void 0 ? _a : 'visible',
                                                                            array: [
                                                                                { title: '隱藏', value: "invisible" },
                                                                                { title: '可選', value: "visible" }
                                                                            ],
                                                                            callback: (text) => {
                                                                                dd.visible = text;
                                                                                widget.refreshComponent();
                                                                            }
                                                                        })}`;
                                                                },
                                                                minus: gvc.event(() => {
                                                                    list.splice(index, 1);
                                                                    widget.refreshComponent();
                                                                })
                                                            };
                                                        }),
                                                        expand: widget.data,
                                                        plus: {
                                                            title: "添加區塊",
                                                            event: gvc.event(() => {
                                                                widget.data.selectList.push({
                                                                    name: "名稱", value: "", key: "default"
                                                                });
                                                                widget.refreshComponent();
                                                            })
                                                        },
                                                        refreshComponent: () => {
                                                            widget.refreshComponent();
                                                        }
                                                    }) + (() => {
                                                        var _a, _b;
                                                        widget.data.dataFrom = (_a = widget.data.dataFrom) !== null && _a !== void 0 ? _a : "static";
                                                        widget.data.innerEvenet = (_b = widget.data.innerEvenet) !== null && _b !== void 0 ? _b : {};
                                                        return gvc.map([
                                                            EditorElem.select({
                                                                title: '預設值',
                                                                gvc: gvc,
                                                                def: widget.data.dataFrom,
                                                                array: [{
                                                                        title: "靜態",
                                                                        value: "static"
                                                                    }, {
                                                                        title: "程式碼",
                                                                        value: "code"
                                                                    }],
                                                                callback: (text) => {
                                                                    widget.data.dataFrom = text;
                                                                    widget.refreshComponent();
                                                                }
                                                            }),
                                                            (() => {
                                                                if (widget.data.dataFrom === 'static') {
                                                                    return glitter.htmlGenerate.editeInput({
                                                                        gvc: gvc,
                                                                        title: '',
                                                                        default: widget.data.inner,
                                                                        placeHolder: "預設值內容",
                                                                        callback: (text) => {
                                                                            widget.data.inner = text;
                                                                            widget.refreshComponent();
                                                                        }
                                                                    });
                                                                }
                                                                else {
                                                                    return TriggerEvent.editer(gvc, widget, widget.data.innerEvenet, {
                                                                        option: [],
                                                                        hover: false,
                                                                        title: "程式碼"
                                                                    });
                                                                }
                                                            })()
                                                        ]);
                                                    })())}</div>`;
                                                }
                                                else {
                                                    widget.data.selectAPI = (_c = widget.data.selectAPI) !== null && _c !== void 0 ? _c : {};
                                                    html += TriggerEvent.editer(gvc, widget, widget.data.selectAPI, {
                                                        hover: true,
                                                        option: [],
                                                        title: "選擇API"
                                                    });
                                                }
                                                return `<div class="alert  mt-2 p-2"  style="background-color: #262677;">${html}</div>`;
                                            case 'img':
                                                widget.data.dataFrom = (_d = widget.data.dataFrom) !== null && _d !== void 0 ? _d : "static";
                                                widget.data.innerEvenet = (_e = widget.data.innerEvenet) !== null && _e !== void 0 ? _e : {};
                                                return gvc.map([
                                                    EditorElem.select({
                                                        title: '內容取得',
                                                        gvc: gvc,
                                                        def: widget.data.dataFrom,
                                                        array: [{
                                                                title: "靜態",
                                                                value: "static"
                                                            }, {
                                                                title: "程式碼",
                                                                value: "code"
                                                            }],
                                                        callback: (text) => {
                                                            widget.data.dataFrom = text;
                                                            widget.refreshComponent();
                                                        }
                                                    }),
                                                    (() => {
                                                        var _a;
                                                        if (widget.data.dataFrom === 'static') {
                                                            return EditorElem.uploadImage({
                                                                title: '選擇圖片',
                                                                gvc: gvc,
                                                                def: (_a = widget.data.inner) !== null && _a !== void 0 ? _a : "",
                                                                callback: (data) => {
                                                                    widget.data.inner = data;
                                                                    widget.refreshComponent();
                                                                }
                                                            });
                                                        }
                                                        else {
                                                            return TriggerEvent.editer(gvc, widget, widget.data.innerEvenet, {
                                                                option: [],
                                                                hover: false,
                                                                title: "程式碼"
                                                            });
                                                        }
                                                    })()
                                                ]);
                                            default:
                                                widget.data.dataFrom = (_f = widget.data.dataFrom) !== null && _f !== void 0 ? _f : "static";
                                                widget.data.innerEvenet = (_g = widget.data.innerEvenet) !== null && _g !== void 0 ? _g : {};
                                                return gvc.map([
                                                    EditorElem.select({
                                                        title: '內容取得',
                                                        gvc: gvc,
                                                        def: widget.data.dataFrom,
                                                        array: [{
                                                                title: "靜態",
                                                                value: "static"
                                                            }, {
                                                                title: "程式碼",
                                                                value: "code"
                                                            }],
                                                        callback: (text) => {
                                                            widget.data.dataFrom = text;
                                                            widget.refreshComponent();
                                                        }
                                                    }),
                                                    (() => {
                                                        if (widget.data.dataFrom === 'static') {
                                                            return glitter.htmlGenerate.editeText({
                                                                gvc: gvc,
                                                                title: '內容',
                                                                default: widget.data.inner,
                                                                placeHolder: "元素內容",
                                                                callback: (text) => {
                                                                    widget.data.inner = text;
                                                                    widget.refreshComponent();
                                                                }
                                                            });
                                                        }
                                                        else {
                                                            return TriggerEvent.editer(gvc, widget, widget.data.innerEvenet, {
                                                                option: [],
                                                                hover: false,
                                                                title: "程式碼"
                                                            });
                                                        }
                                                    })()
                                                ]);
                                        }
                                    })()
                                ]);
                            }
                        }),
                        EditorElem.arrayItem({
                            originalArray: widget.data.attr,
                            gvc: gvc,
                            title: '特徵值',
                            array: widget.data.attr.map((dd, index) => {
                                var _a, _b, _c;
                                dd.type = (_a = dd.type) !== null && _a !== void 0 ? _a : "par";
                                dd.attr = (_b = dd.attr) !== null && _b !== void 0 ? _b : "";
                                return {
                                    title: (_c = dd.attr) !== null && _c !== void 0 ? _c : `特徵:${index + 1}`,
                                    expand: dd,
                                    innerHtml: ((gvc) => {
                                        return gvc.map([
                                            EditorElem.select({
                                                title: "特徵類型",
                                                gvc: gvc,
                                                def: dd.type,
                                                array: [{
                                                        title: '參數', value: 'par'
                                                    }, {
                                                        title: '事件', value: 'event'
                                                    }],
                                                callback: (text) => {
                                                    dd.type = text;
                                                    widget.refreshComponent();
                                                }
                                            }),
                                            (() => {
                                                if (dd.type === 'par') {
                                                    return EditorElem.searchInput({
                                                        title: '特徵標籤',
                                                        gvc: gvc,
                                                        def: dd.attr,
                                                        array: ['onclick', 'oninput', 'onchange', 'ondrag', 'placeholder'],
                                                        callback: (text) => {
                                                            dd.attr = text;
                                                            widget.refreshComponent();
                                                        },
                                                        placeHolder: "請輸入特徵標籤"
                                                    });
                                                }
                                                else {
                                                    return EditorElem.searchInput({
                                                        title: '特徵標籤',
                                                        gvc: gvc,
                                                        def: dd.attr,
                                                        array: ['onclick', 'oninput', 'onchange', 'ondrag'],
                                                        callback: (text) => {
                                                            dd.attr = text;
                                                            widget.refreshComponent();
                                                        },
                                                        placeHolder: "請輸入特徵標籤"
                                                    });
                                                }
                                            })(),
                                            (() => {
                                                var _a;
                                                if (dd.type === 'par') {
                                                    return glitter.htmlGenerate.editeText({
                                                        gvc: gvc,
                                                        title: '參數編輯',
                                                        default: (_a = dd.value) !== null && _a !== void 0 ? _a : "",
                                                        placeHolder: "輸入參數內容",
                                                        callback: (text) => {
                                                            dd.value = text;
                                                            widget.refreshComponent();
                                                        }
                                                    });
                                                }
                                                else {
                                                    return TriggerEvent.editer(gvc, widget, dd, {
                                                        option: [],
                                                        hover: false,
                                                        title: "觸發事件"
                                                    });
                                                }
                                            })()
                                        ]);
                                    }),
                                    minus: gvc.event(() => {
                                        widget.data.attr.splice(index, 1);
                                        widget.refreshComponent();
                                    }),
                                };
                            }),
                            expand: widget.data.atrExpand,
                            plus: {
                                title: '添加特徵',
                                event: gvc.event(() => {
                                    widget.data.attr.push({});
                                    widget.refreshComponent();
                                }),
                            },
                            refreshComponent: () => {
                                widget.refreshComponent();
                            }
                        })
                    ]);
                },
            };
        }
    };
});
