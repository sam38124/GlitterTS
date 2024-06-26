var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TriggerEvent } from "../plugins/trigger-event.js";
import { Editor } from "./editor.js";
import { EditorElem } from "../plugins/editor-elem.js";
export const widgetComponent = {
    render: (gvc, widget, setting, hoverID, subData, htmlGenerate) => {
        var _a, _b, _c, _d;
        const glitter = gvc.glitter;
        widget.data.elem = (_a = widget.data.elem) !== null && _a !== void 0 ? _a : "div";
        widget.data.inner = (_b = widget.data.inner) !== null && _b !== void 0 ? _b : "";
        widget.data.attr = (_c = widget.data.attr) !== null && _c !== void 0 ? _c : [];
        widget.data.onCreateEvent = (_d = widget.data.onCreateEvent) !== null && _d !== void 0 ? _d : {};
        const id = htmlGenerate.widgetComponentID;
        subData = subData !== null && subData !== void 0 ? subData : {};
        let formData = subData;
        return {
            view: () => {
                var _a;
                let re = false;
                function getCreateOption() {
                    let option = widget.data.attr.map((dd) => {
                        if (dd.type === 'par') {
                            try {
                                return { key: dd.attr, value: eval(dd.value) };
                            }
                            catch (e) {
                                return { key: dd.attr, value: dd.value };
                            }
                        }
                        else {
                            return {
                                key: dd.attr, value: gvc.event((e, event) => {
                                    TriggerEvent.trigger({
                                        gvc: gvc,
                                        widget: widget,
                                        clickEvent: dd,
                                        element: { e, event },
                                        subData: subData
                                    }).then((data) => {
                                    });
                                })
                            };
                        }
                    });
                    if (widget.data.elem === 'a' && (window.parent.editerData !== undefined)) {
                        option = option.filter((dd) => {
                            return dd.key !== 'href';
                        });
                    }
                    if (widget.data.elem === 'img') {
                        option.push({ key: 'src', value: widget.data.inner });
                    }
                    else if (widget.data.elem === 'input') {
                        option.push({ key: 'value', value: widget.data.inner });
                    }
                    return {
                        elem: widget.data.elem,
                        class: glitter.htmlGenerate.styleEditor(widget.data, gvc, widget, subData).class() + ` glitterTag${widget.hashTag} ${hoverID.indexOf(widget.id) !== -1 ? ` selectComponentHover` : ``}`,
                        style: glitter.htmlGenerate.styleEditor(widget.data, gvc, widget, subData).style(),
                        option: option.concat(htmlGenerate.option),
                    };
                }
                if (widget.type === 'container') {
                    const glitter = window.glitter;
                    const htmlGenerate = new glitter.htmlGenerate(widget.data.setting, hoverID, subData);
                    widget.data.inner = '';
                    return htmlGenerate.render(gvc, { containerID: widget.id, onCreate: () => {
                            TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: widget.data.onCreateEvent,
                                subData: subData
                            });
                        } }, getCreateOption());
                }
                if ((widget.data.dataFrom === "code")) {
                    if (widget.data.elem !== 'select') {
                        widget.data.inner = '';
                    }
                    widget.data.innerEvenet = (_a = widget.data.innerEvenet) !== null && _a !== void 0 ? _a : {};
                    TriggerEvent.trigger({
                        gvc: gvc,
                        widget: widget,
                        clickEvent: widget.data.innerEvenet,
                        subData
                    }).then((data) => {
                        if (widget.data.elem === 'select') {
                            formData[widget.data.key] = data;
                        }
                        widget.data.inner = data;
                        re = true;
                        gvc.notifyDataChange(id);
                    });
                }
                return gvc.bindView(() => {
                    return {
                        bind: id,
                        view: () => {
                            return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                                const vm = {
                                    callback: () => {
                                    },
                                    data: []
                                };
                                yield new Promise((resolve, reject) => {
                                    var _a;
                                    if (widget.data.elem === 'select' && widget.data.selectType === 'api') {
                                        widget.data.selectAPI = (_a = widget.data.selectAPI) !== null && _a !== void 0 ? _a : {};
                                        vm.callback = () => {
                                            resolve(true);
                                        };
                                        TriggerEvent.trigger({
                                            gvc: gvc, widget: widget, clickEvent: widget.data.selectAPI, subData: vm
                                        });
                                    }
                                    else {
                                        resolve(true);
                                    }
                                });
                                switch (widget.data.elem) {
                                    case 'select':
                                        formData[widget.data.key] = widget.data.inner;
                                        if (widget.data.selectType === 'api') {
                                            resolve(vm.data.map((dd) => {
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
                            </option>`);
                                        }
                                        else {
                                            resolve(widget.data.selectList.map((dd) => {
                                                var _a;
                                                if (dd.visible === 'invisible' && (dd.value !== formData[widget.data.key])) {
                                                    return ``;
                                                }
                                                formData[widget.data.key] = (_a = formData[widget.data.key]) !== null && _a !== void 0 ? _a : dd.value;
                                                return `<option value="${dd.value}" ${dd.value === formData[widget.data.key] ? `selected` : ``}>
                                ${dd.name}
                            </option>`;
                                            }).join(''));
                                        }
                                        break;
                                    case 'img':
                                    case 'input':
                                        resolve(``);
                                        break;
                                    default:
                                        resolve(widget.data.inner);
                                        break;
                                }
                            }));
                        },
                        divCreate: getCreateOption,
                        onCreate: () => {
                            TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: widget.data.onCreateEvent,
                                subData: subData
                            });
                        },
                        onInitial: () => {
                        }
                    };
                });
            },
            editor: () => {
                var _a, _b, _c;
                widget.type = (_a = widget.type) !== null && _a !== void 0 ? _a : "elem";
                widget.data.elemExpand = (_b = widget.data.elemExpand) !== null && _b !== void 0 ? _b : {};
                widget.data.atrExpand = (_c = widget.data.atrExpand) !== null && _c !== void 0 ? _c : {};
                if (['link', 'style'].indexOf(widget.data.elem) !== -1) {
                    widget.data.elemExpand.expand = true;
                }
                return gvc.map([
                    `<div class="mt-2"></div>`,
                    (['link', 'script'].indexOf(widget.data.elem) !== -1) ? `` :
                        Editor.toggleExpand({
                            gvc: gvc,
                            title: '元件設定',
                            data: widget.data.elemExpand,
                            innerText: () => {
                                return gvc.map([
                                    (() => {
                                        if (['link', 'style', 'script'].indexOf(widget.data.elem) !== -1) {
                                            return ``;
                                        }
                                        else {
                                            return glitter.htmlGenerate.styleEditor(widget.data, gvc, widget, subData).editor(gvc, () => {
                                                widget.refreshComponent();
                                            }, '元素設計樣式');
                                        }
                                    })(),
                                    (() => {
                                        if (['link', 'style', 'img', 'input', 'script'].indexOf(widget.data.elem) !== -1) {
                                            return ``;
                                        }
                                        else {
                                            return Editor.select({
                                                title: '插件類型',
                                                gvc: gvc,
                                                def: widget.type,
                                                array: [{
                                                        title: 'HTML-容器', value: 'container'
                                                    }, {
                                                        title: 'HTML-元件', value: 'widget'
                                                    }],
                                                callback: (text) => {
                                                    widget.type = text;
                                                    gvc.notifyDataChange('HtmlEditorContainer');
                                                    widget.refreshComponent();
                                                }
                                            });
                                        }
                                    })(),
                                    (['link', 'style', 'script'].indexOf(widget.data.elem) === -1) ?
                                        Editor.searchInput({
                                            title: 'HTML元素標籤',
                                            gvc: gvc,
                                            def: widget.data.elem,
                                            array: ['button', 'h1', 'h2', 'h3', 'h4', 'h5', 'li', 'ul', 'table', 'div', 'header', 'section', 'span', 'p', 'a', 'img',
                                                'input', 'select', 'script', 'src', 'textArea'],
                                            callback: (text) => {
                                                if (['link', 'style'].indexOf(widget.data.elem) === -1) {
                                                    widget.data.elem = text;
                                                    widget.refreshComponent();
                                                }
                                            },
                                            placeHolder: "請輸入元素標籤"
                                        }) : ``,
                                    (() => {
                                        var _a, _b, _c, _d, _e, _f, _g;
                                        if (widget.type === 'container') {
                                            return ``;
                                        }
                                        switch (widget.data.elem) {
                                            case 'select':
                                                widget.data.selectList = (_a = widget.data.selectList) !== null && _a !== void 0 ? _a : [];
                                                widget.data.selectType = (_b = widget.data.selectType) !== null && _b !== void 0 ? _b : 'manual';
                                                const list = widget.data.selectList;
                                                let html = Editor.select({
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
                                                    html += (Editor.arrayItem({
                                                        gvc: gvc,
                                                        title: "選項集合",
                                                        originalArray: widget.data.selectList,
                                                        array: widget.data.selectList.map((dd, index) => {
                                                            var _a, _b;
                                                            dd.visible = (_a = dd.visible) !== null && _a !== void 0 ? _a : 'visible';
                                                            return {
                                                                title: dd.name || `區塊:${index + 1}`,
                                                                expand: dd,
                                                                innerHtml: glitter.htmlGenerate.editeInput({
                                                                    gvc: gvc,
                                                                    title: `參數標題`,
                                                                    default: dd.name,
                                                                    placeHolder: "輸入參數標題",
                                                                    callback: (text) => {
                                                                        dd.name = text;
                                                                        widget.refreshComponent();
                                                                    }
                                                                }) +
                                                                    glitter.htmlGenerate.editeInput({
                                                                        gvc: gvc,
                                                                        title: `Value`,
                                                                        default: dd.value,
                                                                        placeHolder: "輸入參數值",
                                                                        callback: (text) => {
                                                                            dd.value = text;
                                                                            widget.refreshComponent();
                                                                        }
                                                                    }) +
                                                                    `${Editor.select({
                                                                        title: "參數可見度",
                                                                        gvc: gvc,
                                                                        def: (_b = dd.visible) !== null && _b !== void 0 ? _b : 'visible',
                                                                        array: [
                                                                            { title: '隱藏', value: "invisible" },
                                                                            { title: '可選', value: "visible" }
                                                                        ],
                                                                        callback: (text) => {
                                                                            dd.visible = text;
                                                                            widget.refreshComponent();
                                                                        }
                                                                    })}`,
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
                                                            Editor.select({
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
                                                                    return `<div class="mt-2"></div>` + TriggerEvent.editer(gvc, widget, widget.data.innerEvenet, {
                                                                        option: [],
                                                                        hover: false,
                                                                        title: "程式碼"
                                                                    });
                                                                }
                                                            })()
                                                        ]);
                                                    })());
                                                }
                                                else {
                                                    widget.data.selectAPI = (_c = widget.data.selectAPI) !== null && _c !== void 0 ? _c : {};
                                                    html += TriggerEvent.editer(gvc, widget, widget.data.selectAPI, {
                                                        hover: true,
                                                        option: [],
                                                        title: "選擇API"
                                                    });
                                                }
                                                return html;
                                            case 'img':
                                                widget.data.dataFrom = (_d = widget.data.dataFrom) !== null && _d !== void 0 ? _d : "static";
                                                widget.data.innerEvenet = (_e = widget.data.innerEvenet) !== null && _e !== void 0 ? _e : {};
                                                return gvc.map([
                                                    Editor.select({
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
                                                            return Editor.uploadImage({
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
                                                            return `<div class="mt-2"></div>` + TriggerEvent.editer(gvc, widget, widget.data.innerEvenet, {
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
                                                    (() => {
                                                        if (['link'].indexOf(widget.data.elem) !== -1) {
                                                            return ``;
                                                        }
                                                        else {
                                                            return Editor.select({
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
                                                            });
                                                        }
                                                    })(),
                                                    (() => {
                                                        if (['link'].indexOf(widget.data.elem) !== -1) {
                                                            return ``;
                                                        }
                                                        else {
                                                            if (widget.data.dataFrom === 'static') {
                                                                if (widget.data.elem === 'style') {
                                                                    return EditorElem.styleEditor({
                                                                        gvc: gvc,
                                                                        title: 'CSS代碼',
                                                                        height: 300,
                                                                        initial: widget.data.inner,
                                                                        dontRefactor: true,
                                                                        callback: (text) => {
                                                                            widget.data.inner = text;
                                                                        }
                                                                    });
                                                                }
                                                                else {
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
                                                            }
                                                            else {
                                                                return `<div class="mt-2"></div>` + TriggerEvent.editer(gvc, widget, widget.data.innerEvenet, {
                                                                    option: [],
                                                                    hover: false,
                                                                    title: "程式碼"
                                                                });
                                                            }
                                                        }
                                                    })()
                                                ]);
                                        }
                                    })()
                                ]);
                            }
                        }),
                    Editor.arrayItem({
                        originalArray: widget.data.attr,
                        gvc: gvc,
                        title: '特徵值',
                        array: widget.data.attr.map((dd, index) => {
                            var _a, _b, _c;
                            dd.type = (_a = dd.type) !== null && _a !== void 0 ? _a : 'par';
                            dd.attr = (_b = dd.attr) !== null && _b !== void 0 ? _b : "";
                            dd.attrType = (_c = dd.attrType) !== null && _c !== void 0 ? _c : "normal";
                            return {
                                title: dd.attr,
                                expand: dd,
                                innerHtml: (() => {
                                    return gvc.map([
                                        Editor.select({
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
                                                return gvc.map([
                                                    Editor.searchInput({
                                                        title: '特徵標籤',
                                                        gvc: gvc,
                                                        def: dd.attr,
                                                        array: ['src', 'placeholder', 'href'],
                                                        callback: (text) => {
                                                            dd.attr = text;
                                                            widget.refreshComponent();
                                                        },
                                                        placeHolder: "請輸入特徵標籤"
                                                    }),
                                                    Editor.select({
                                                        title: '特徵類型',
                                                        gvc: gvc,
                                                        def: dd.attrType,
                                                        array: [
                                                            { title: "一般", value: 'normal' },
                                                            { title: "檔案連結", value: 'link' }
                                                        ],
                                                        callback: (text) => {
                                                            dd.attrType = text;
                                                            widget.refreshComponent();
                                                        }
                                                    })
                                                ]);
                                            }
                                            else {
                                                return Editor.searchInput({
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
                                            var _a, _b;
                                            if (dd.type === 'par') {
                                                if ((['script', 'img'].indexOf(widget.data.elem) !== -1 && (dd.attr === 'src')) || dd.attrType === 'link') {
                                                    return Editor.uploadFile({
                                                        title: "資源路徑",
                                                        gvc: gvc,
                                                        def: (_a = dd.value) !== null && _a !== void 0 ? _a : '',
                                                        callback: (text) => {
                                                            dd.value = text;
                                                            widget.refreshComponent();
                                                        }
                                                    });
                                                }
                                                else {
                                                    dd.valueFrom = (_b = dd.valueFrom) !== null && _b !== void 0 ? _b : "manual";
                                                    return [
                                                        EditorElem.h3('參數內容'),
                                                        EditorElem.select({
                                                            title: '',
                                                            gvc: gvc,
                                                            def: dd.valueFrom,
                                                            array: [
                                                                { title: '帶入值', value: "manual" },
                                                                { title: '程式碼', value: "code" }
                                                            ],
                                                            callback: (text) => {
                                                                dd.valueFrom = text;
                                                                widget.refreshComponent();
                                                            }
                                                        }),
                                                        (() => {
                                                            var _a, _b;
                                                            if (dd.valueFrom === 'code') {
                                                                dd.valueTrigger = (_a = dd.valueTrigger) !== null && _a !== void 0 ? _a : {};
                                                                return TriggerEvent.editer(gvc, widget, dd.valueTrigger, {
                                                                    hover: false,
                                                                    option: [],
                                                                    title: ''
                                                                });
                                                            }
                                                            else {
                                                                return glitter.htmlGenerate.editeText({
                                                                    gvc: gvc,
                                                                    title: '',
                                                                    default: (_b = dd.value) !== null && _b !== void 0 ? _b : "",
                                                                    placeHolder: `請輸入參數內容`,
                                                                    callback: (text) => {
                                                                        dd.value = text;
                                                                        widget.refreshComponent();
                                                                    }
                                                                });
                                                            }
                                                        })()
                                                    ].join('<div class="my-1"></div>');
                                                }
                                            }
                                            else {
                                                return `<div class="mt-2"></div>` + TriggerEvent.editer(gvc, widget, dd, {
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
                    }),
                    TriggerEvent.editer(gvc, widget, widget.data.onCreateEvent, {
                        hover: false,
                        option: [],
                        title: "[onCreate]建立事件"
                    })
                ]);
            },
        };
    }
};
