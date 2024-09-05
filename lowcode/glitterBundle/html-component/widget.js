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
import { NormalPageEditor } from "../../editor/normal-page-editor.js";
import { GlobalWidget } from "./global-widget.js";
import { RenderValue } from "./render-value.js";
const container_style_list = ['grid', 'vertical', 'proportion'];
export const widgetComponent = {
    render: (gvc, widget, setting, hoverID, sub, htmlGenerate, document) => {
        const rootHtmlGenerate = htmlGenerate;
        const glitter = gvc.glitter;
        const subData = sub !== null && sub !== void 0 ? sub : {};
        let formData = subData;
        const id = htmlGenerate.widgetComponentID;
        RenderValue.custom_style.initialWidget(widget);
        const view_container_id = widget.id;
        return {
            view: () => {
                widget.refreshComponent = () => {
                    widget.refreshComponentParameter.view1();
                    widget.refreshComponentParameter.view2();
                };
                widget.refreshComponentParameter.view1 = () => {
                    gvc.notifyDataChange(id);
                };
                function showCaseData() {
                    return GlobalWidget.showCaseData({
                        gvc: gvc,
                        widget: widget,
                        empty: ` <!-- tag=${widget.label} -->
                         ${gvc.bindView(() => {
                            return {
                                bind: id,
                                view: () => {
                                    return ``;
                                },
                                divCreate: {
                                    class: `d-none`, style: ``
                                },
                                onCreate: () => {
                                    widget.data.setting.refresh = () => {
                                        gvc.glitter.document.querySelector(`[gvc-id="${gvc.id(id)}"]`).outerHTML = showCaseData();
                                    };
                                }
                            };
                        })}`,
                        view: (widget) => {
                            var _a;
                            function isEditorMode() {
                                return ((window.parent.editerData !== undefined) || (window.editerData !== undefined));
                            }
                            try {
                                let innerText = (() => {
                                    if ((widget.data.dataFrom === "code") || (widget.data.dataFrom === "code_text")) {
                                        return ``;
                                    }
                                    else {
                                        return widget.data.inner;
                                    }
                                })();
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
                                                    return { key: dd.attr, value: dd.value };
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
                                        let rela_link = innerText;
                                        if (innerText.includes(`size1440_s*px$_`)) {
                                            [150, 600, 1200, 1440].reverse().map((dd) => {
                                                if (document.body.clientWidth < dd) {
                                                    rela_link = innerText.replace('size1440_s*px$_', `size${dd}_s*px$_`);
                                                }
                                            });
                                        }
                                        option.push({ key: 'src', value: rela_link });
                                    }
                                    else if (widget.data.elem === 'input') {
                                        option.push({ key: 'value', value: innerText });
                                    }
                                    let classList = [];
                                    let elem = widget.data.elem;
                                    if (isEditorMode() && htmlGenerate.root) {
                                        classList.push(`editorParent`);
                                        classList.push(`relativePosition`);
                                        classList.push(view_container_id);
                                        option = option.concat([
                                            {
                                                key: 'onmouseover',
                                                value: gvc.event((e, event) => {
                                                    $(e).children('.editorChild').children('.plus_bt').show();
                                                }),
                                            },
                                            {
                                                key: 'onmouseout',
                                                value: gvc.event((e, event) => {
                                                    $(e).children('.editorChild').children('.plus_bt').hide();
                                                }),
                                            },
                                        ]);
                                    }
                                    classList.push(glitter.htmlGenerate.styleEditor(widget.data, gvc, widget, subData).class());
                                    widget.hashTag && classList.push(`glitterTag${widget.hashTag}`);
                                    let style_user = '';
                                    if (widget.type === 'container' && container_style_list.includes(widget.data._layout)) {
                                        style_user = RenderValue.custom_style.value(gvc, widget);
                                        style_user += RenderValue.custom_style.container_style(gvc, widget);
                                    }
                                    style_user += widget.code_style || '';
                                    return {
                                        elem: elem,
                                        class: classList.join(' '),
                                        style: glitter.htmlGenerate.styleEditor(widget.data, gvc, widget, subData).style() + ` ${(window.parent.editerData !== undefined) ? `${(widget.visible === false) ? `display:none;` : ``}` : ``} ${style_user}`,
                                        option: option.concat(htmlGenerate.option),
                                    };
                                }
                                if (widget.type === 'container') {
                                    const glitter = window.glitter;
                                    widget.data.setting.formData = widget.formData;
                                    function getView() {
                                        const chtmlGenerate = new glitter.htmlGenerate(widget.data.setting, hoverID, subData, rootHtmlGenerate.root);
                                        innerText = '';
                                        return chtmlGenerate.render(gvc, {
                                            containerID: id,
                                            tag: widget.tag,
                                            onCreate: () => {
                                                gvc.glitter.document.querySelector(`[gvc-id="${gvc.id(id)}"]`).onResumeEvent = () => {
                                                    TriggerEvent.trigger({
                                                        gvc,
                                                        widget: widget,
                                                        clickEvent: widget.onResumtEvent,
                                                        subData: subData
                                                    });
                                                };
                                                setTimeout(() => {
                                                    if (container_style_list.includes(widget.data._layout) && ((gvc.glitter.window.parent.editerData !== undefined) || (gvc.glitter.window.editerData !== undefined)) && htmlGenerate.root) {
                                                        const html = String.raw;
                                                        const tempID = gvc.glitter.getUUID();
                                                        function rerenderReplaceElem() {
                                                            var _a, _b;
                                                            gvc.glitter.$('.' + tempID).remove();
                                                            widget.data.setting.need_count = (() => {
                                                                var _a;
                                                                if (widget.data._layout === 'proportion') {
                                                                    return ((_a = widget.data._ratio_layout_value) !== null && _a !== void 0 ? _a : ``).split(',').length;
                                                                }
                                                                else {
                                                                    return parseInt(widget.data._x_count, 10) * parseInt(widget.data._y_count, 10);
                                                                }
                                                            })();
                                                            if (widget.data._layout === 'vertical') {
                                                                widget.data.setting.need_count = 1;
                                                            }
                                                            let horGroup = [];
                                                            let gIndex = 0;
                                                            let wCount = 0;
                                                            for (let index = 0; index < ((_a = widget.data._ratio_layout_value) !== null && _a !== void 0 ? _a : ``).split(',').length; index++) {
                                                                if (horGroup[gIndex] === undefined) {
                                                                    horGroup[gIndex] = [];
                                                                    wCount = 0;
                                                                }
                                                                const wid = Number(((_b = widget.data._ratio_layout_value) !== null && _b !== void 0 ? _b : ``).split(',')[index] || '0');
                                                                if (wCount + wid <= 100) {
                                                                    wCount = wCount + wid;
                                                                    horGroup[gIndex].push(index);
                                                                    if (wCount >= 100) {
                                                                        gIndex = gIndex + 1;
                                                                    }
                                                                }
                                                                else {
                                                                    gIndex = gIndex + 1;
                                                                }
                                                            }
                                                            for (let b = widget.data.setting.length; b < widget.data.setting.need_count; b++) {
                                                                gvc.glitter.$(`.editor_it_${id}`).append(html `
                                                                    <div
                                                                            class="d-flex align-items-center justify-content-center flex-column rounded-3 w-100 py-3 ${tempID}"
                                                                            style="background: lightgrey;color: #393939;cursor: pointer;min-height: 100px;left: 0px;top:0px;width: ${(() => {
                                                                    var _a, _b;
                                                                    if (widget.data._layout === 'proportion') {
                                                                        const wid = ((_a = widget.data._ratio_layout_value) !== null && _a !== void 0 ? _a : ``).split(',');
                                                                        for (const c of horGroup) {
                                                                            if (c.includes(b)) {
                                                                                const wid = ((_b = widget.data._ratio_layout_value) !== null && _b !== void 0 ? _b : ``).split(',');
                                                                                const _gap_y = ((Number(widget.data._gap_y) * (c.length - 1)) / c.length).toFixed(0);
                                                                                return `calc(${wid[b] || 100}% - ${_gap_y}px) !important;`;
                                                                            }
                                                                        }
                                                                        return wid[b] || 100 + '% !important';
                                                                    }
                                                                    else {
                                                                        return `100%`;
                                                                    }
                                                                })()};height: 100%;"
                                                                            onmousedown="${gvc.event(() => {
                                                                    glitter.getModule(new URL(gvc.glitter.root_path + 'editor/add-component.js').href, (AddComponent) => {
                                                                        glitter.share.editorViewModel.selectContainer = widget.data.setting;
                                                                        AddComponent.toggle(true);
                                                                        AddComponent.addWidget = (gvc, cf) => {
                                                                            window.parent.glitter.share.editorViewModel.selectContainer = widget.data.setting;
                                                                            window.parent.glitter.share.addComponent(cf);
                                                                            RenderValue.custom_style.value(gvc, widget);
                                                                            AddComponent.toggle(false);
                                                                        };
                                                                        AddComponent.addEvent = (gvc, tdata) => {
                                                                            window.parent.glitter.share.editorViewModel.selectContainer = widget.data.setting;
                                                                            window.parent.glitter.share.addComponent({
                                                                                id: gvc.glitter.getUUID(),
                                                                                js: './official_view_component/official.js',
                                                                                css: {
                                                                                    class: {},
                                                                                    style: {},
                                                                                },
                                                                                data: {
                                                                                    refer_app: tdata.copyApp,
                                                                                    tag: tdata.copy,
                                                                                    list: [],
                                                                                    carryData: {},
                                                                                    _style_refer_global: {
                                                                                        index: `0`,
                                                                                    },
                                                                                },
                                                                                type: 'component',
                                                                                class: 'w-100',
                                                                                index: 0,
                                                                                label: tdata.title,
                                                                                style: '',
                                                                                bundle: {},
                                                                                global: [],
                                                                                toggle: false,
                                                                                stylist: [],
                                                                                dataType: 'static',
                                                                                style_from: 'code',
                                                                                classDataType: 'static',
                                                                                preloadEvenet: {},
                                                                                share: {},
                                                                            });
                                                                            RenderValue.custom_style.value(gvc, widget);
                                                                            AddComponent.toggle(false);
                                                                        };
                                                                    });
                                                                })}"
                                                                    >
                                                                        <i class="fa-regular fa-circle-plus text-black"
                                                                           style="font-size: 60px;"></i>
                                                                        <span class="fw-500 fs-5 mt-3">添加元件</span>
                                                                    </div>`);
                                                            }
                                                        }
                                                        widget.data.setting.rerenderReplaceElem = rerenderReplaceElem;
                                                        rerenderReplaceElem();
                                                    }
                                                }, 200);
                                                TriggerEvent.trigger({
                                                    gvc,
                                                    widget: widget,
                                                    clickEvent: widget.onCreateEvent,
                                                    subData: subData,
                                                    element: gvc.getBindViewElem(id).get(0)
                                                });
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
                                            editorSection: widget.id,
                                            origin_widget: widget
                                        }, getCreateOption);
                                    }
                                    widget.data.setting.refresh = (() => {
                                        try {
                                            hoverID = [Storage.lastSelect];
                                            gvc.glitter.document.querySelector('.selectComponentHover') && gvc.glitter.document.querySelector('.selectComponentHover').classList.remove("selectComponentHover");
                                            gvc.glitter.document.querySelector(`[gvc-id="${gvc.id(id)}"]`).outerHTML = showCaseData();
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
                                            let view = [];
                                            switch (widget.data.elem) {
                                                case 'select':
                                                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
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
                                                                    gvc: gvc,
                                                                    widget: widget,
                                                                    clickEvent: widget.data.selectAPI,
                                                                    subData: vm
                                                                });
                                                                resolve(true);
                                                            }
                                                            else {
                                                                resolve(true);
                                                            }
                                                        });
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
                            </option>
`;
                                                            }).join('') + `<option class="d-none" ${(data.find((dd) => {
                                                                return `${dd.value}` === `${selectItem}`;
                                                            })) ? `` : `selected`}>請選擇</option>`);
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
                                                    }));
                                                case 'img':
                                                case 'input':
                                                case 'textArea':
                                                    break;
                                                default:
                                                    view.push(innerText);
                                                    break;
                                            }
                                            if (window.parent.editerData !== undefined && htmlGenerate.root && widget.data.elem !== 'textArea') {
                                                view.push(glitter.htmlGenerate.getEditorSelectSection({
                                                    id: widget.id,
                                                    gvc: gvc,
                                                    label: widget.label,
                                                    widget: widget
                                                }));
                                            }
                                            return view.join('');
                                        },
                                        divCreate: getCreateOption,
                                        onCreate: () => {
                                            glitter.elementCallback[gvc.id(id)].updateAttribute();
                                            if (widget.data.elem.toLowerCase() === 'textarea') {
                                                const textArea = gvc.getBindViewElem(id).get(0);
                                                textArea.textContent = innerText;
                                                setTimeout(() => {
                                                    textArea.style.height = textArea.scrollHeight + 'px';
                                                    autosize(textArea);
                                                }, 100);
                                            }
                                            TriggerEvent.trigger({
                                                gvc,
                                                widget: widget,
                                                clickEvent: widget.onCreateEvent,
                                                subData: subData,
                                                element: gvc.getBindViewElem(id).get(0)
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
                            }
                            catch (e) {
                                console.log(e);
                                return `${e}`;
                            }
                        }
                    });
                }
                return showCaseData();
            },
            editor: () => {
                var _a, _b, _c;
                if (widget.type === 'container' && Storage.select_function === 'user-editor' || localStorage.getItem('uasi') === 'user_editor') {
                    return gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        const vm = {
                            get page() {
                                return Storage.page_setting_global;
                            },
                            set page(vale) {
                                Storage.page_setting_global = vale;
                            }
                        };
                        const html = String.raw;
                        return {
                            bind: id,
                            view: () => __awaiter(void 0, void 0, void 0, function* () {
                                const CustomStyle = yield new Promise((resolve, reject) => {
                                    gvc.glitter.getModule(new URL(gvc.glitter.root_path + 'glitterBundle/html-component/custom-style.js').href, (clas) => {
                                        resolve(clas);
                                    });
                                });
                                if (vm.page === 'setting') {
                                    const oWidget = widget;
                                    return GlobalWidget.showCaseEditor({
                                        gvc: gvc,
                                        widget: widget,
                                        view: (widget, type) => {
                                            const setting_option = [
                                                {
                                                    title: "間距設定",
                                                    key: 'margin',
                                                    array: []
                                                },
                                                {
                                                    title: "容器背景設定",
                                                    key: 'background',
                                                    array: []
                                                },
                                                {
                                                    title: "開發者設定",
                                                    key: 'develop',
                                                    array: []
                                                }
                                            ].filter((dd) => {
                                                var _a;
                                                oWidget[`${type}_editable`] = (_a = oWidget[`${type}_editable`]) !== null && _a !== void 0 ? _a : [];
                                                switch (dd.key) {
                                                    case 'style':
                                                    case 'color':
                                                        return (dd.array && dd.array.length > 0);
                                                    case 'background':
                                                        return true;
                                                    case 'margin':
                                                    case 'develop':
                                                        return true;
                                                }
                                            });
                                            return [`<div
                                                                                                                class="px-3   border-bottom pb-3 fw-bold mt-n3  pt-3 hoverF2 d-flex align-items-center mx-n2"
                                                                                                                style="cursor: pointer;color:#393939;border-radius: 0px;gap:10px;"
                                                                                                                onclick="${gvc.event(() => {
                                                    vm.page = 'editor';
                                                    gvc.notifyDataChange(id);
                                                })}"
                                                                                                        >
                                                                                                            <i class="fa-solid fa-chevron-left"></i>
                                                                                                            <span style="max-width: calc(100% - 50px);text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">設定</span>
                                                                                                            <div class="flex-fill"></div>
                                                                                                        </div>`, setting_option.map((dd, index) => {
                                                    return gvc.bindView(() => {
                                                        const vm_c = {
                                                            id: gvc.glitter.getUUID(),
                                                            toggle: dd.toggle
                                                        };
                                                        setting_option[index].vm_c = vm_c;
                                                        widget.refreshComponentParameter.view2 = () => {
                                                            gvc.notifyDataChange(vm_c.id);
                                                        };
                                                        return {
                                                            bind: vm_c.id,
                                                            view: () => {
                                                                const array_string = [html `
                                                                <div class="hoverF2 d-flex align-items-center p-3"
                                                                     onclick="${gvc.event(() => {
                                                                        setting_option.map((dd) => {
                                                                            if (dd.vm_c.toggle) {
                                                                                dd.vm_c.toggle = false;
                                                                                gvc.notifyDataChange(dd.vm_c.id);
                                                                            }
                                                                        });
                                                                        vm_c.toggle = !vm_c.toggle;
                                                                        gvc.notifyDataChange(vm_c.id);
                                                                    })}">
<span class="fw-500"
      style="max-width: calc(100% - 50px);text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">${dd.title}</span>
                                                                    <div class="flex-fill"></div>
                                                                    ${vm_c.toggle ? ` <i class="fa-solid fa-chevron-down"></i>` : ` <i class="fa-solid fa-chevron-right"></i>`}

                                                                </div>`];
                                                                if (vm_c.toggle) {
                                                                    switch (dd.key) {
                                                                        case 'margin':
                                                                            array_string.push(`<div class="px-3 pb-2">${CustomStyle.editorMargin(gvc, widget, () => {
                                                                                gvc.notifyDataChange(vm_c.id);
                                                                                oWidget.refreshComponent();
                                                                            })}</div>`);
                                                                            break;
                                                                        case 'background':
                                                                            array_string.push(`<div class="px-3 pb-2">${CustomStyle.editorBackground(gvc, widget, () => {
                                                                                gvc.notifyDataChange(vm_c.id);
                                                                                oWidget.refreshComponent();
                                                                            })}</div>`);
                                                                            break;
                                                                        case 'develop':
                                                                            array_string.push(`<div class="px-3">${CustomStyle.editor(gvc, widget, () => {
                                                                                gvc.notifyDataChange(vm_c.id);
                                                                                oWidget.refreshComponent();
                                                                            })}</div>`);
                                                                            break;
                                                                    }
                                                                }
                                                                return array_string.join('');
                                                            },
                                                            divCreate: {
                                                                class: `border-bottom mx-n2 `,
                                                                style: `cursor: pointer;color:#393939;border-radius: 0px;gap:10px;`
                                                            }
                                                        };
                                                    });
                                                }).join('')].join('');
                                        },
                                        hide_selector: true
                                    });
                                }
                                widget.refreshComponentParameter.view2 = () => {
                                    gvc.notifyDataChange(id);
                                };
                                return [
                                    gvc.bindView(() => {
                                        const vm = {
                                            id: gvc.glitter.getUUID(),
                                            type: 'preview'
                                        };
                                        return {
                                            bind: vm.id,
                                            view: () => {
                                                if (vm.type === 'preview') {
                                                    return html `
                                                        <i class="fa-solid fa-chevron-left h-100 d-flex align-items-center justify-content-center "
                                                           onclick="${gvc.event(() => {
                                                        const select_ = glitter.share.findWidgetIndex(glitter.share.editorViewModel.selectItem.id);
                                                        if (select_.container_cf) {
                                                            const gvc_ = gvc.glitter.document.querySelector('.iframe_view').contentWindow.glitter.pageConfig[0].gvc;
                                                            gvc_.glitter.htmlGenerate.selectWidget({
                                                                widget: select_.container_cf,
                                                                widgetComponentID: select_.container_cf.id,
                                                                gvc: gvc_,
                                                                scroll_to_hover: true,
                                                                glitter: glitter,
                                                            });
                                                        }
                                                        else {
                                                            Storage.lastSelect = '';
                                                            gvc.glitter.share.editorViewModel.selectItem = undefined;
                                                            gvc.glitter.share.selectEditorItem();
                                                        }
                                                    })}"></i>
                                                        <span style="max-width: calc(100% - 50px);text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">${widget.label}</span>
                                                        <div class="flex-fill"></div>
                                                        <button class="btn sel_normal"
                                                                type="button"
                                                                onclick="${gvc.event(() => {
                                                        vm.type = 'editor';
                                                        gvc.notifyDataChange(vm.id);
                                                    })}">
                                                            <span style="font-size: 14px; color: #393939; font-weight: 400;">更改命名</span>
                                                        </button>`;
                                                }
                                                else {
                                                    let name = widget.label;
                                                    return html `
                                                        <i class="fa-solid fa-xmark h-100 d-flex align-items-center justify-content-center "
                                                           onclick="${gvc.event(() => {
                                                        vm.type = 'preview';
                                                        gvc.notifyDataChange(vm.id);
                                                    })}"></i>
                                                        ${EditorElem.editeInput({
                                                        gvc: gvc,
                                                        title: '',
                                                        default: name,
                                                        placeHolder: '請輸入自定義名稱',
                                                        callback: (text) => {
                                                            name = text;
                                                        },
                                                    })}
                                                        <button class="btn sel_normal"
                                                                type="button"
                                                                onclick="${gvc.event(() => {
                                                        vm.type = 'preview';
                                                        widget.label = name;
                                                        gvc.notifyDataChange(vm.id);
                                                    })}">
                                                            <span style="font-size: 14px; color: #393939; font-weight: 400;">確認</span>
                                                        </button>`;
                                                }
                                            },
                                            divCreate: {
                                                class: `px-3 mx-n2  border-bottom pb-3 fw-bold mt-n3 mb-2 pt-3 hoverF2 d-flex align-items-center`,
                                                style: `cursor: pointer;color:#393939;border-radius: 0px;gap:10px;`
                                            }
                                        };
                                    }),
                                    GlobalWidget.showCaseBar(gvc, widget, () => {
                                        gvc.notifyDataChange(id);
                                    }),
                                    GlobalWidget.showCaseEditor({
                                        gvc: gvc,
                                        widget: widget,
                                        view: (widget) => {
                                            var _a;
                                            const html = String.raw;
                                            let array = [];
                                            const setting_btn = html `
                                                <div class="py-3 mx-n3 px-3   d-flex align-items-center"
                                                     style="font-size: 16px;
cursor: pointer;
border-top: 1px solid #DDD;
font-style: normal;
gap:10px;
font-weight: 700;" onclick="${gvc.event(() => {
                                                vm.page = 'setting';
                                                gvc.notifyDataChange(id);
                                            })}">
                                                    設定
                                                    <i class="fa-solid fa-angle-right"></i>
                                                </div>`;
                                            const child_container = gvc.bindView(() => {
                                                const id = gvc.glitter.getUUID();
                                                const parId = gvc.glitter.getUUID();
                                                return {
                                                    bind: id,
                                                    view: () => {
                                                        let viewArray = [`<h3  style="color: #393939;margin-bottom: 5px;" class="fw-500 fs-6">子元件</h3>`];
                                                        viewArray.push(gvc.bindView(() => {
                                                            const id = gvc.glitter.getUUID();
                                                            return {
                                                                bind: id,
                                                                view: () => {
                                                                    return (widget.data.setting || []).map((dd) => {
                                                                        var _a;
                                                                        dd.visible = (_a = dd.visible) !== null && _a !== void 0 ? _a : 'visible';
                                                                        return `<li onclick="${gvc.event(() => {
                                                                            const gvc_ = gvc.glitter.document.querySelector('.iframe_view').contentWindow.glitter.pageConfig[0].gvc;
                                                                            gvc_.glitter.htmlGenerate.selectWidget({
                                                                                widget: dd,
                                                                                widgetComponentID: dd.id,
                                                                                gvc: gvc_,
                                                                                scroll_to_hover: true,
                                                                                glitter: glitter,
                                                                            });
                                                                        })}">
                                                                    <div class="w-100 fw-500 d-flex align-items-center  fs-6 hoverBtn h_item  rounded px-2 hoverF2 mb-1" style="gap:5px;color:#393939;" >
                                                                        <div class=" p-1 dragItem " >
                                                                            <i class="fa-solid fa-grip-dots-vertical d-flex align-items-center justify-content-center  " style="width:15px;height:15px;" aria-hidden="true"></i>
                                                                        </div>
                                                                        <span>${dd.label}</span>
                                                                        <div class="flex-fill"></div>
                                                                        <div class="hoverBtn p-1 child" onclick="${gvc.event((e, event) => {
                                                                            event.stopPropagation();
                                                                            event.preventDefault();
                                                                            glitter.htmlGenerate.deleteWidget(widget.data.setting, dd, () => {
                                                                            });
                                                                        })}">
                                                                            <i class="fa-regular fa-trash d-flex align-items-center justify-content-center " aria-hidden="true"></i>
                                                                        </div>
                                                                        <div class="hoverBtn p-1 child" onclick="${gvc.event((e, event) => {
                                                                            event.stopPropagation();
                                                                            event.preventDefault();
                                                                            dd.visible = !dd.visible;
                                                                            if (dd.visible) {
                                                                                gvc.glitter.document.querySelector('#editerCenter iframe').contentWindow.glitter
                                                                                    .$(`.editor_it_${dd.id}`)
                                                                                    .parent()
                                                                                    .show();
                                                                            }
                                                                            else {
                                                                                gvc.glitter.document.querySelector('#editerCenter iframe').contentWindow.glitter
                                                                                    .$(`.editor_it_${dd.id}`)
                                                                                    .parent()
                                                                                    .hide();
                                                                            }
                                                                            gvc.notifyDataChange(id);
                                                                        })}">
                                                                            <i class="${(dd.visible) ? `fa-regular fa-eye` : `fa-solid fa-eye-slash`} d-flex align-items-center justify-content-center " style="width:15px;height:15px;" aria-hidden="true"></i>
                                                                        </div>
                                                                    </div>
                                                                </li>`;
                                                                    }).join('');
                                                                },
                                                                divCreate: {
                                                                    class: `mx-n2`,
                                                                    elem: 'ul',
                                                                    option: [{ key: 'id', value: parId }],
                                                                },
                                                                onCreate: () => {
                                                                    gvc.glitter.addMtScript([
                                                                        {
                                                                            src: `https://raw.githack.com/SortableJS/Sortable/master/Sortable.js`,
                                                                        },
                                                                    ], () => {
                                                                        const interval = setInterval(() => {
                                                                            if (window.Sortable) {
                                                                                try {
                                                                                    gvc.addStyle(`
                                    ul {
                                        list-style: none;
                                        padding: 0;
                                    }
                                `);
                                                                                    function swapArr(arr, index1, index2) {
                                                                                        const data = arr[index1];
                                                                                        arr.splice(index1, 1);
                                                                                        arr.splice(index2, 0, data);
                                                                                    }
                                                                                    let startIndex = 0;
                                                                                    Sortable.create(gvc.glitter.document.getElementById(parId), {
                                                                                        handle: '.dragItem',
                                                                                        group: gvc.glitter.getUUID(),
                                                                                        animation: 100,
                                                                                        onChange: function (evt) {
                                                                                            function swapElements(elm1, elm2) {
                                                                                                var parent1, next1, parent2, next2;
                                                                                                parent1 = elm1.parentNode;
                                                                                                next1 = elm1.nextSibling;
                                                                                                parent2 = elm2.parentNode;
                                                                                                next2 = elm2.nextSibling;
                                                                                                parent1.insertBefore(elm2, next1);
                                                                                                parent2.insertBefore(elm1, next2);
                                                                                            }
                                                                                            swapElements(widget.data.setting[startIndex].editor_bridge.element().parentNode, widget.data.setting[evt.newIndex].editor_bridge.element().parentNode);
                                                                                            swapArr(widget.data.setting, startIndex, evt.newIndex);
                                                                                            const newIndex = evt.newIndex;
                                                                                            startIndex = newIndex;
                                                                                            setTimeout(() => {
                                                                                                const dd = widget.data.setting[newIndex];
                                                                                                dd && dd.editor_bridge && dd.editor_bridge.scrollWithHover();
                                                                                            });
                                                                                        },
                                                                                        onEnd: (evt) => {
                                                                                        },
                                                                                        onStart: function (evt) {
                                                                                            startIndex = evt.oldIndex;
                                                                                        },
                                                                                    });
                                                                                }
                                                                                catch (e) {
                                                                                }
                                                                                clearInterval(interval);
                                                                            }
                                                                        }, 100);
                                                                    }, () => {
                                                                    });
                                                                }
                                                            };
                                                        }));
                                                        viewArray.push(`<div class="w-100" style="justify-content: center; align-items: center; gap: 4px; display: flex;color: #3366BB;cursor: pointer;" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
onclick="${gvc.event(() => {
                                                            gvc.glitter.getModule(gvc.glitter.root_path + 'editor/add-component.js', (AddComponent) => {
                                                                gvc.glitter.share.editorViewModel.selectContainer = widget.data.setting;
                                                                AddComponent.toggle(true);
                                                                AddComponent.addWidget = (gvc, cf) => {
                                                                    gvc.glitter.share.addComponent(cf);
                                                                    gvc.notifyDataChange(id);
                                                                };
                                                                AddComponent.addEvent = (gvc, tdata) => {
                                                                    gvc.glitter.share.addComponent({
                                                                        "id": gvc.glitter.getUUID(),
                                                                        "js": "./official_view_component/official.js",
                                                                        "css": {
                                                                            "class": {},
                                                                            "style": {}
                                                                        },
                                                                        "data": {
                                                                            'refer_app': tdata.copyApp,
                                                                            "tag": tdata.copy,
                                                                            "list": [],
                                                                            "carryData": {},
                                                                            _style_refer_global: {
                                                                                index: `0`
                                                                            }
                                                                        },
                                                                        "type": "component",
                                                                        "class": "",
                                                                        "index": 0,
                                                                        "label": tdata.title,
                                                                        "style": "",
                                                                        "bundle": {},
                                                                        "global": [],
                                                                        "toggle": false,
                                                                        "stylist": [],
                                                                        "dataType": "static",
                                                                        "style_from": "code",
                                                                        "classDataType": "static",
                                                                        "preloadEvenet": {},
                                                                        "share": {}
                                                                    });
                                                                    gvc.notifyDataChange(id);
                                                                };
                                                            });
                                                        })}">
                        <div style="font-size: 16px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word">新增一個元件</div>
                        <i class="fa-solid fa-plus" aria-hidden="true"></i>
                    </div>`);
                                                        return viewArray.join('<div class="my-2"></div>');
                                                    },
                                                    divCreate: {
                                                        class: 'py-3  mt-3 mx-n3 px-3',
                                                        style: `border-top: 1px solid #DDD;`
                                                    }
                                                };
                                            });
                                            if (widget.data._layout === 'grid') {
                                                array = array.concat([EditorElem.editeInput({
                                                        gvc: gvc,
                                                        title: `X軸數量`,
                                                        default: widget.data._x_count,
                                                        placeHolder: '請輸入X軸數量',
                                                        callback: (text) => {
                                                            widget.data._x_count = text;
                                                            widget.refreshComponent();
                                                        }
                                                    }),
                                                    EditorElem.editeInput({
                                                        gvc: gvc,
                                                        title: `Y軸數量`,
                                                        default: widget.data._y_count,
                                                        placeHolder: '請輸入Y軸數量',
                                                        callback: (text) => {
                                                            widget.data._y_count = text;
                                                            widget.refreshComponent();
                                                        }
                                                    }),
                                                    EditorElem.editeInput({
                                                        gvc: gvc,
                                                        title: `X軸間距`,
                                                        default: widget.data._gap_x,
                                                        placeHolder: '請輸入X軸間距',
                                                        callback: (text) => {
                                                            widget.data._gap_x = text;
                                                            widget.refreshComponent();
                                                        }
                                                    }),
                                                    EditorElem.editeInput({
                                                        gvc: gvc,
                                                        title: `Y軸間距`,
                                                        default: widget.data._gap_y,
                                                        placeHolder: '請輸入Y軸間距',
                                                        callback: (text) => {
                                                            widget.data._gap_y = text;
                                                            widget.refreshComponent();
                                                        }
                                                    }), child_container, setting_btn]);
                                            }
                                            else if (widget.data._layout === 'vertical') {
                                                widget.data._ver_position = (_a = widget.data._ver_position) !== null && _a !== void 0 ? _a : 'center';
                                                array = array.concat([
                                                    EditorElem.editeInput({
                                                        gvc: gvc,
                                                        title: '元件間隔',
                                                        default: widget.data._gap || '',
                                                        placeHolder: '單位px',
                                                        callback: (text) => {
                                                            widget.data._gap = text;
                                                            widget.refreshComponent();
                                                        }
                                                    }), child_container,
                                                    setting_btn
                                                ]);
                                            }
                                            else if (widget.data._layout === 'proportion') {
                                                array = array.concat([
                                                    EditorElem.editeInput({
                                                        gvc: gvc,
                                                        title: `X軸間距`,
                                                        default: widget.data._gap_x,
                                                        placeHolder: '請輸入X軸間距',
                                                        callback: (text) => {
                                                            widget.data._gap_x = text;
                                                            widget.refreshComponent();
                                                        }
                                                    }),
                                                    EditorElem.editeInput({
                                                        gvc: gvc,
                                                        title: `Y軸間距`,
                                                        default: widget.data._gap_y,
                                                        placeHolder: '請輸入Y軸間距',
                                                        callback: (text) => {
                                                            widget.data._gap_y = text;
                                                            widget.refreshComponent();
                                                        }
                                                    }),
                                                    EditorElem.editeInput({
                                                        gvc: gvc,
                                                        title: html `
                                                                <div class="d-flex flex-column" style="gap:5px;">
                                                                    元件比例設定
                                                                    <h3
                                                                            class="my-auto tx_title"
                                                                            style="color: #8D8D8D;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;"
                                                                    >
                                                                        一列為100%，超過100%則跳往下一行
                                                                    </h3>
                                                                </div>`,
                                                        default: widget.data._ratio_layout_value,
                                                        placeHolder: '範例30,70,70,30',
                                                        callback: (text) => {
                                                            widget.data._ratio_layout_value = text;
                                                            RenderValue.custom_style.value(gvc, widget);
                                                            widget.refreshComponent();
                                                        }
                                                    }), child_container,
                                                    setting_btn
                                                ]);
                                            }
                                            return `<div class="mx-2">${array.join('')}</div>`;
                                        },
                                        toggle_visible: (bool) => {
                                            widget.data.setting.refresh();
                                        }
                                    })
                                ].join('');
                            })
                        };
                    });
                }
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
                                                                                        {
                                                                                            title: '隱藏',
                                                                                            value: "invisible"
                                                                                        },
                                                                                        {
                                                                                            title: '可選',
                                                                                            value: "visible"
                                                                                        }
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
                                                                        },
                                                                        structStart: `((gvc,widget,object,subData,element)=>{`
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
                                                innerHtml: (() => {
                                                    NormalPageEditor.closeEvent = () => {
                                                        widget.refreshComponent();
                                                    };
                                                    NormalPageEditor.toggle({
                                                        visible: true,
                                                        title: '編輯特徵值',
                                                        view: gvc.bindView(() => {
                                                            const id = gvc.glitter.getUUID();
                                                            return {
                                                                bind: id,
                                                                view: () => {
                                                                    return [
                                                                        EditorElem.select({
                                                                            title: "特徵來源",
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
                                                                                gvc.notifyDataChange(id);
                                                                            }
                                                                        }),
                                                                        (() => {
                                                                            if (dd.type === 'par') {
                                                                                let parMap = [EditorElem.searchInput({
                                                                                        title: '特徵標籤',
                                                                                        gvc: gvc,
                                                                                        def: dd.attr,
                                                                                        array: ['src', 'placeholder', 'href'],
                                                                                        callback: (text) => {
                                                                                            dd.attr = text;
                                                                                        },
                                                                                        placeHolder: "請輸入特徵標籤"
                                                                                    })];
                                                                                if (!((['script', 'img'].indexOf(widget.data.elem) !== -1 && (dd.attr === 'src')) || dd.attrType === 'link')) {
                                                                                    parMap.push(EditorElem.select({
                                                                                        title: '特徵類型',
                                                                                        gvc: gvc,
                                                                                        def: dd.attrType,
                                                                                        array: [
                                                                                            {
                                                                                                title: "一般",
                                                                                                value: 'normal'
                                                                                            },
                                                                                            {
                                                                                                title: "檔案連結",
                                                                                                value: 'link'
                                                                                            }
                                                                                        ],
                                                                                        callback: (text) => {
                                                                                            dd.attrType = text;
                                                                                            gvc.notifyDataChange(id);
                                                                                        }
                                                                                    }));
                                                                                }
                                                                                return parMap.join('');
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
                                                                                            gvc.notifyDataChange(id);
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
                                                                                                {
                                                                                                    title: '帶入值',
                                                                                                    value: "manual"
                                                                                                },
                                                                                                {
                                                                                                    title: '程式碼',
                                                                                                    value: "code"
                                                                                                }
                                                                                            ],
                                                                                            callback: (text) => {
                                                                                                dd.valueFrom = text;
                                                                                                gvc.notifyDataChange(id);
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
                                                                    ].join('');
                                                                },
                                                                divCreate: {
                                                                    class: `p-2`
                                                                }
                                                            };
                                                        })
                                                    });
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
                                    },
                                    customEditor: true
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
