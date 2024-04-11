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
import { EditorElem } from "../plugins/editor-elem.js";
import autosize from "../plugins/autosize.js";
import { ShareDialog } from "../dialog/ShareDialog.js";
import { Storage } from "../helper/storage.js";
export const widgetComponent = {
    render: (gvc, widget, setting, hoverID, sub, htmlGenerate, document) => {
        var _a, _b, _c;
        const glitter = gvc.glitter;
        if (widget.data.onCreateEvent) {
            widget.onCreateEvent = widget.data.onCreateEvent;
            widget.data.onCreateEvent = undefined;
        }
        widget.data.elem = (_a = widget.data.elem) !== null && _a !== void 0 ? _a : "div";
        widget.data.inner = (_b = widget.data.inner) !== null && _b !== void 0 ? _b : "";
        widget.data.attr = (_c = widget.data.attr) !== null && _c !== void 0 ? _c : [];
        const id = htmlGenerate.widgetComponentID;
        const subData = sub !== null && sub !== void 0 ? sub : {};
        let formData = subData;
        return {
            view: () => {
                var _a;
                let innerText = widget.data.inner;
                function getCreateOption() {
                    let option = widget.data.attr.map((dd) => {
                        if (dd.type === 'par') {
                            try {
                                if (dd.valueFrom === 'code') {
                                    return {
                                        key: dd.attr, value: eval(`(() => {
                                            ${dd.value}
                                        })()`)
                                    };
                                }
                                else {
                                    return { key: dd.attr, value: eval(dd.value) };
                                }
                            }
                            catch (e) {
                                return { key: dd.attr, value: dd.value };
                            }
                        }
                        else if (dd.type === 'append') {
                            return {
                                key: glitter.promiseValue(new Promise((resolve, reject) => {
                                    TriggerEvent.trigger({
                                        gvc: gvc,
                                        widget: widget,
                                        clickEvent: dd,
                                        subData: subData
                                    }).then((data) => {
                                        if (data) {
                                            resolve(dd.attr);
                                        }
                                    });
                                })), value: ''
                            };
                        }
                        else {
                            return {
                                key: dd.attr, value: gvc.event((e, event) => {
                                    event.stopPropagation();
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
                        option.push({ key: 'src', value: innerText });
                    }
                    else if (widget.data.elem === 'input') {
                        option.push({ key: 'value', value: innerText });
                    }
                    let classList = [glitter.htmlGenerate.styleEditor(widget.data, gvc, widget, subData).class()];
                    widget.hashTag && classList.push(`glitterTag${widget.hashTag}`);
                    (hoverID.indexOf(widget.id) !== -1) && (window.parent.editerData !== undefined) && classList.push(`selectComponentHover`);
                    return {
                        elem: widget.data.elem,
                        class: classList.join(' '),
                        style: glitter.htmlGenerate.styleEditor(widget.data, gvc, widget, subData).style(),
                        option: option.concat(htmlGenerate.option),
                    };
                }
                if (widget.type === 'container') {
                    const glitter = window.glitter;
                    widget.data.setting.formData = widget.formData;
                    function getView() {
                        const htmlGenerate = new glitter.htmlGenerate(widget.data.setting, hoverID, subData);
                        innerText = '';
                        return htmlGenerate.render(gvc, {
                            containerID: id, onCreate: () => {
                                TriggerEvent.trigger({
                                    gvc,
                                    widget: widget,
                                    clickEvent: widget.onCreateEvent,
                                    subData: subData
                                });
                                gvc.glitter.document.querySelector(`[gvc-id="${gvc.id(id)}"]`).onResumeEvent = () => {
                                    TriggerEvent.trigger({
                                        gvc,
                                        widget: widget,
                                        clickEvent: widget.onResumtEvent,
                                        subData: subData
                                    });
                                };
                            },
                            onDestroy: () => {
                                TriggerEvent.trigger({
                                    gvc,
                                    widget: widget,
                                    clickEvent: widget.onDestoryEvent,
                                    subData: subData
                                });
                            },
                            onInitial: () => {
                                TriggerEvent.trigger({
                                    gvc,
                                    widget: widget,
                                    clickEvent: widget.onInitialEvent,
                                    subData: subData
                                });
                            },
                            app_config: widget.global.appConfig,
                            page_config: widget.global.pageConfig,
                            document: document,
                        }, getCreateOption());
                    }
                    widget.data.setting.refresh = (() => {
                        try {
                            hoverID = [Storage.lastSelect];
                            gvc.glitter.document.querySelector('.selectComponentHover') && gvc.glitter.document.querySelector('.selectComponentHover').classList.remove("selectComponentHover");
                            gvc.glitter.document.querySelector(`[gvc-id="${gvc.id(id)}"]`).outerHTML = getView();
                            setTimeout(() => {
                                gvc.glitter.document.querySelector('.selectComponentHover').scrollIntoView({
                                    behavior: 'auto',
                                    block: 'center',
                                });
                            }, 10);
                        }
                        catch (e) {
                        }
                    });
                    return getView();
                }
                if ((widget.data.dataFrom === "code")) {
                    if (widget.data.elem !== 'select') {
                        innerText = '';
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
                        innerText = data || '';
                        gvc.notifyDataChange(id);
                    });
                }
                else if (widget.data.dataFrom === "code_text") {
                    const inner = (eval(`(() => {
                                ${widget.data.inner}
                            })()`));
                    if (inner && inner.then) {
                        inner.then((data) => {
                            innerText = data || '';
                            gvc.notifyDataChange(id);
                        });
                    }
                    else {
                        innerText = inner;
                        gvc.notifyDataChange(id);
                    }
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
                                        formData[widget.data.key] = innerText;
                                        if (widget.data.selectType === 'api') {
                                            resolve(vm.data.map((dd) => {
                                                var _a;
                                                formData[widget.data.key] = (_a = formData[widget.data.key]) !== null && _a !== void 0 ? _a : dd.value;
                                                if (dd.visible === 'invisible' && (dd.value !== formData[widget.data.key])) {
                                                    return ``;
                                                }
                                                return glitter.html `<option class="" value="${dd.value}" ${`${dd.value}` === `${formData[widget.data.key]}` ? `selected` : ``}>
                                ${dd.key}
                            </option>`;
                                            }).join('') + `<option value="" ${formData[widget.data.key] === '' ? `selected` : ``}>
                                選擇${widget.data.label}
                            </option>`);
                                        }
                                        else if (widget.data.selectType === 'trigger') {
                                            const data = yield TriggerEvent.trigger({
                                                gvc: gvc,
                                                widget: widget,
                                                clickEvent: widget.data.selectTrigger,
                                                subData: subData
                                            });
                                            const selectItem = yield TriggerEvent.trigger({
                                                gvc: gvc,
                                                widget: widget,
                                                clickEvent: widget.data.selectItem,
                                                subData: subData
                                            });
                                            resolve(data.map((dd) => {
                                                return `<option value="${dd.value}" ${`${dd.value}` === `${selectItem}` ? `selected` : ``}>
                                ${dd.name}
                            </option>`;
                                            }).join(''));
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
                                        resolve(innerText);
                                        break;
                                }
                            }));
                        },
                        divCreate: getCreateOption,
                        onCreate: () => {
                            glitter.elementCallback[gvc.id(id)].updateAttribute();
                            if (widget.data.elem.toLowerCase() === 'textarea') {
                                autosize(gvc.getBindViewElem(id).get(0));
                            }
                            TriggerEvent.trigger({
                                gvc,
                                widget: widget,
                                clickEvent: widget.onCreateEvent,
                                subData: subData
                            });
                            gvc.glitter.document.querySelector(`[gvc-id="${gvc.id(id)}"]`).onResumeEvent = () => {
                                TriggerEvent.trigger({
                                    gvc,
                                    widget: widget,
                                    clickEvent: widget.onResumtEvent,
                                    subData: subData
                                });
                            };
                        },
                        onDestroy: () => {
                            TriggerEvent.trigger({
                                gvc,
                                widget: widget,
                                clickEvent: widget.onDestoryEvent,
                                subData: subData
                            });
                        },
                        onInitial: () => {
                            TriggerEvent.trigger({
                                gvc,
                                widget: widget,
                                clickEvent: widget.onInitialEvent,
                                subData: subData
                            });
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
                return gvc.bindView(() => {
                    const id = gvc.glitter.getUUID();
                    function refreshEditor() {
                        gvc.notifyDataChange(id);
                    }
                    return {
                        bind: id,
                        view: () => {
                            return [
                                `<div class="mt-2"></div>`,
                                (['link', 'script'].indexOf(widget.data.elem) !== -1) ? `` :
                                    gvc.map([
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
                                                return EditorElem.select({
                                                    title: '元素類型',
                                                    gvc: gvc,
                                                    def: widget.type,
                                                    array: [{
                                                            title: '容器', value: 'container'
                                                        }, {
                                                            title: '元件', value: 'widget'
                                                        }],
                                                    callback: (text) => {
                                                        var _a;
                                                        widget.type = text;
                                                        if (widget.type === 'container') {
                                                            widget.data.setting = (_a = widget.data.setting) !== null && _a !== void 0 ? _a : [];
                                                        }
                                                        gvc.notifyDataChange('HtmlEditorContainer');
                                                        widget.refreshComponent();
                                                    }
                                                });
                                            }
                                        })(),
                                        (widget.type === 'container') ? `<div class="d-flex justify-content-end">
<button class="btn btn-secondary mt-2 w-100" onclick="${gvc.event(() => {
                                            const dialog = new ShareDialog(gvc.glitter);
                                            dialog.checkYesOrNot({
                                                text: '是否確認清空容器內容?',
                                                callback: (b) => {
                                                    if (b) {
                                                        widget.data.setting = [];
                                                    }
                                                    gvc.notifyDataChange('HtmlEditorContainer');
                                                    widget.refreshComponent();
                                                }
                                            });
                                        })}">
<i class="fa-solid fa-trash-can me-2" aria-hidden="true"></i>
清空容器內容
</button>
</div>` : ``,
                                        (() => {
                                            const array = [];
                                            if ((['link', 'style', 'script'].indexOf(widget.data.elem) === -1)) {
                                                array.push(EditorElem.searchInput({
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
                                                }));
                                            }
                                            return array.join();
                                        })(),
                                        (() => {
                                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                                            if (widget.type === 'container') {
                                                return ``;
                                            }
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
                                                                title: '觸發事件', value: 'trigger'
                                                            }, {
                                                                title: 'API', value: 'api'
                                                            }],
                                                        callback: (text) => {
                                                            widget.data.selectType = text;
                                                            widget.refreshComponent();
                                                        }
                                                    });
                                                    if (widget.data.selectType === 'manual') {
                                                        widget.data.selectList = (_c = widget.data.selectList) !== null && _c !== void 0 ? _c : [];
                                                        html += `<div class="mx-n2 my-2">${(EditorElem.arrayItem({
                                                            gvc: gvc,
                                                            title: "選項集合",
                                                            originalArray: widget.data.selectList,
                                                            array: (() => {
                                                                return widget.data.selectList.map((dd, index) => {
                                                                    var _a;
                                                                    dd.visible = (_a = dd.visible) !== null && _a !== void 0 ? _a : 'visible';
                                                                    return {
                                                                        title: dd.name || `區塊:${index + 1}`,
                                                                        expand: dd,
                                                                        innerHtml: () => {
                                                                            var _a;
                                                                            return [glitter.htmlGenerate.editeInput({
                                                                                    gvc: gvc,
                                                                                    title: `參數標題`,
                                                                                    default: dd.name,
                                                                                    placeHolder: "輸入參數標題",
                                                                                    callback: (text) => {
                                                                                        dd.name = text;
                                                                                        widget.refreshComponent();
                                                                                    }
                                                                                }),
                                                                                glitter.htmlGenerate.editeInput({
                                                                                    gvc: gvc,
                                                                                    title: `Value`,
                                                                                    default: dd.value,
                                                                                    placeHolder: "輸入參數值",
                                                                                    callback: (text) => {
                                                                                        dd.value = text;
                                                                                        widget.refreshComponent();
                                                                                    }
                                                                                }),
                                                                                EditorElem.select({
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
                                                                                })].join('');
                                                                        },
                                                                        minus: gvc.event(() => {
                                                                            list.splice(index, 1);
                                                                            widget.refreshComponent();
                                                                        })
                                                                    };
                                                                });
                                                            }),
                                                            expand: widget.data,
                                                            plus: {
                                                                title: "添加選項",
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
                                                        }))}</div>
${(() => {
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
                                                                        return `<div class="mt-2"></div>` + TriggerEvent.editer(gvc, widget, widget.data.innerEvenet, {
                                                                            option: [],
                                                                            hover: false,
                                                                            title: "程式碼"
                                                                        });
                                                                    }
                                                                })()
                                                            ]);
                                                        })()}`;
                                                    }
                                                    else if (widget.data.selectType === 'trigger') {
                                                        widget.data.selectTrigger = (_d = widget.data.selectTrigger) !== null && _d !== void 0 ? _d : {};
                                                        widget.data.selectItem = (_e = widget.data.selectItem) !== null && _e !== void 0 ? _e : {};
                                                        html += `<div class="my-2"><div>${TriggerEvent.editer(gvc, widget, widget.data.selectTrigger, {
                                                            hover: true,
                                                            option: [],
                                                            title: "選項列表來源"
                                                        })}`;
                                                        html += `<div class="my-2"><div>${TriggerEvent.editer(gvc, widget, widget.data.selectItem, {
                                                            hover: true,
                                                            option: [],
                                                            title: "選中項目"
                                                        })}`;
                                                    }
                                                    else {
                                                        widget.data.selectAPI = (_f = widget.data.selectAPI) !== null && _f !== void 0 ? _f : {};
                                                        html += `<div class="my-2"><div>${TriggerEvent.editer(gvc, widget, widget.data.selectAPI, {
                                                            hover: true,
                                                            option: [],
                                                            title: "選擇API"
                                                        })}`;
                                                    }
                                                    return html;
                                                case 'img':
                                                    widget.data.dataFrom = (_g = widget.data.dataFrom) !== null && _g !== void 0 ? _g : "static";
                                                    widget.data.innerEvenet = (_h = widget.data.innerEvenet) !== null && _h !== void 0 ? _h : {};
                                                    return gvc.map([
                                                        EditorElem.select({
                                                            title: '內容取得',
                                                            gvc: gvc,
                                                            def: widget.data.dataFrom,
                                                            array: [{
                                                                    title: "文字",
                                                                    value: "static"
                                                                }, {
                                                                    title: "觸發事件",
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
                                                                return `<div class="mt-2"></div>` + TriggerEvent.editer(gvc, widget, widget.data.innerEvenet, {
                                                                    option: [],
                                                                    hover: false,
                                                                    title: "程式碼"
                                                                });
                                                            }
                                                        })()
                                                    ]);
                                                default:
                                                    widget.data.dataFrom = (_j = widget.data.dataFrom) !== null && _j !== void 0 ? _j : "static";
                                                    widget.data.innerEvenet = (_k = widget.data.innerEvenet) !== null && _k !== void 0 ? _k : {};
                                                    return gvc.map([
                                                        (() => {
                                                            if (['link', 'style'].indexOf(widget.data.elem) !== -1) {
                                                                return ``;
                                                            }
                                                            else {
                                                                return EditorElem.select({
                                                                    title: '內容取得',
                                                                    gvc: gvc,
                                                                    def: widget.data.dataFrom,
                                                                    array: [{
                                                                            title: "靜態",
                                                                            value: "static"
                                                                        }, {
                                                                            title: "程式碼",
                                                                            value: "code_text"
                                                                        },
                                                                        {
                                                                            title: "觸發事件",
                                                                            value: "code"
                                                                        },
                                                                        {
                                                                            title: "HTML代碼",
                                                                            value: "static_code"
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
                                                                else if (widget.data.dataFrom === 'static_code') {
                                                                    return EditorElem.customCodeEditor({
                                                                        gvc: gvc,
                                                                        title: '複製的代碼內容',
                                                                        height: 300,
                                                                        initial: widget.data.inner,
                                                                        language: 'html',
                                                                        callback: (text) => {
                                                                            widget.data.inner = text;
                                                                        }
                                                                    });
                                                                }
                                                                else if (widget.data.dataFrom === 'code_text') {
                                                                    return EditorElem.codeEditor({
                                                                        gvc: gvc,
                                                                        height: 200,
                                                                        initial: widget.data.inner,
                                                                        title: "代碼區塊",
                                                                        callback: (text) => {
                                                                            widget.data.inner = text;
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
                                                            }
                                                        })()
                                                    ]);
                                            }
                                        })()
                                    ]),
                                `<div class="mx-n2 mt-2">${EditorElem.arrayItem({
                                    originalArray: widget.data.attr,
                                    gvc: gvc,
                                    title: '特徵值',
                                    array: () => {
                                        return widget.data.attr.map((dd, index) => {
                                            var _a, _b, _c;
                                            dd.type = (_a = dd.type) !== null && _a !== void 0 ? _a : 'par';
                                            dd.attr = (_b = dd.attr) !== null && _b !== void 0 ? _b : "";
                                            dd.attrType = (_c = dd.attrType) !== null && _c !== void 0 ? _c : "normal";
                                            return {
                                                title: dd.attr,
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
                                                                }, {
                                                                    title: '附加值', value: 'append'
                                                                }
                                                            ],
                                                            callback: (text) => {
                                                                dd.type = text;
                                                                gvc.recreateView();
                                                            }
                                                        }),
                                                        (() => {
                                                            if (dd.type === 'par') {
                                                                return gvc.map([
                                                                    EditorElem.searchInput({
                                                                        title: '特徵標籤',
                                                                        gvc: gvc,
                                                                        def: dd.attr,
                                                                        array: ['src', 'placeholder', 'href'],
                                                                        callback: (text) => {
                                                                            dd.attr = text;
                                                                        },
                                                                        placeHolder: "請輸入特徵標籤"
                                                                    }),
                                                                    EditorElem.select({
                                                                        title: '特徵類型',
                                                                        gvc: gvc,
                                                                        def: dd.attrType,
                                                                        array: [
                                                                            { title: "一般", value: 'normal' },
                                                                            { title: "檔案連結", value: 'link' }
                                                                        ],
                                                                        callback: (text) => {
                                                                            dd.attrType = text;
                                                                            gvc.recreateView();
                                                                        }
                                                                    })
                                                                ]);
                                                            }
                                                            else {
                                                                return EditorElem.searchInput({
                                                                    title: '特徵標籤',
                                                                    gvc: gvc,
                                                                    def: dd.attr,
                                                                    array: ['onclick', 'oninput', 'onchange', 'ondrag', 'onmouseover', 'onmouseout'],
                                                                    callback: (text) => {
                                                                        dd.attr = text;
                                                                    },
                                                                    placeHolder: "請輸入特徵標籤"
                                                                });
                                                            }
                                                        })(),
                                                        (() => {
                                                            var _a, _b;
                                                            if (dd.type === 'par') {
                                                                if ((['script', 'img'].indexOf(widget.data.elem) !== -1 && (dd.attr === 'src')) || dd.attrType === 'link') {
                                                                    return EditorElem.uploadFile({
                                                                        title: "資源路徑",
                                                                        gvc: gvc,
                                                                        def: (_a = dd.value) !== null && _a !== void 0 ? _a : '',
                                                                        callback: (text) => {
                                                                            dd.value = text;
                                                                            gvc.recreateView();
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
                                                                                gvc.recreateView();
                                                                            }
                                                                        }),
                                                                        (() => {
                                                                            var _a;
                                                                            if (dd.valueFrom === 'code') {
                                                                                return EditorElem.codeEditor({
                                                                                    gvc: gvc,
                                                                                    height: 200,
                                                                                    initial: dd.value,
                                                                                    title: '程式碼',
                                                                                    callback: (data) => {
                                                                                        dd.value = data;
                                                                                    }
                                                                                });
                                                                            }
                                                                            else {
                                                                                return glitter.htmlGenerate.editeText({
                                                                                    gvc: gvc,
                                                                                    title: '',
                                                                                    default: (_a = dd.value) !== null && _a !== void 0 ? _a : "",
                                                                                    placeHolder: `請輸入參數內容`,
                                                                                    callback: (text) => {
                                                                                        dd.value = text;
                                                                                    }
                                                                                });
                                                                            }
                                                                        })()
                                                                    ].join('<div class="my-1"></div>');
                                                                }
                                                            }
                                                            else if (dd.type === 'append') {
                                                                return `<div class="mt-2"></div>` + TriggerEvent.editer(gvc, widget, dd, {
                                                                    option: [],
                                                                    hover: false,
                                                                    title: "顯示條件[請返回Bool值]"
                                                                });
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
                                                saveEvent: () => {
                                                    widget.refreshComponent();
                                                },
                                                minus: gvc.event(() => {
                                                    widget.data.attr.splice(index, 1);
                                                    widget.refreshComponent();
                                                }),
                                            };
                                        });
                                    },
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
                                })}</div>`
                            ].join('');
                        },
                        onCreate: () => {
                            setTimeout(() => {
                                gvc.glitter.document.querySelector('.right_scroll').scrollTop = glitter.share.lastRightScrollTop;
                                console.log(`lastRightScrollTop-->`, glitter.share.lastRightScrollTop);
                            });
                        }
                    };
                });
            },
        };
    }
};
