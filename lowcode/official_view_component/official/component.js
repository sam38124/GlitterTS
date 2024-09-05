var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Plugin } from "../../glitterBundle/plugins/plugin-creater.js";
import { TriggerEvent } from "../../glitterBundle/plugins/trigger-event.js";
import { Storage } from "../../glitterBundle/helper/storage.js";
import { BaseApi } from "../../glitterBundle/api/base.js";
import { GlobalWidget } from "../../glitterBundle/html-component/global-widget.js";
import { NormalPageEditor } from "../../editor/normal-page-editor.js";
import { RenderValue } from "../../glitterBundle/html-component/render-value.js";
export const component = Plugin.createComponent(import.meta.url, (glitter, editMode) => {
    return {
        render: (gvc, widget, setting, hoverID, subData, htmlGenerate, doc) => {
            var _a, _b, _c;
            const document = doc || (window.document);
            widget.data.list = (_a = widget.data.list) !== null && _a !== void 0 ? _a : [];
            widget.storage = (_b = widget.storage) !== null && _b !== void 0 ? _b : {};
            widget.storage.updateFormData = (_c = widget.storage.updateFormData) !== null && _c !== void 0 ? _c : ((page_config) => {
            });
            function initialReferData(widget) {
                ['mobile', 'desktop'].map((dd) => {
                    var _a, _b, _c;
                    widget[dd] = (_a = widget[dd]) !== null && _a !== void 0 ? _a : {};
                    (widget[dd].refer !== 'custom' && widget[dd].refer !== 'hide') && (widget[dd].refer = 'custom');
                    widget[`${dd}_editable`] = (_b = widget[`${dd}_editable`]) !== null && _b !== void 0 ? _b : [];
                    widget[dd].data = (_c = widget[dd].data) !== null && _c !== void 0 ? _c : {};
                    widget[dd].data.refer_app = widget.data.refer_app;
                });
            }
            initialReferData(widget);
            let viewConfig = undefined;
            const html = String.raw;
            const view_container_id = widget.id;
            return {
                view: () => {
                    let data = undefined;
                    let tag = widget.data.tag;
                    let carryData = widget.data.carryData;
                    function getData(document) {
                        return __awaiter(this, void 0, void 0, function* () {
                            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                var _a;
                                try {
                                    for (const b of widget.data.list) {
                                        b.evenet = (_a = b.evenet) !== null && _a !== void 0 ? _a : {};
                                        try {
                                            if (b.triggerType === 'trigger') {
                                                const result = yield new Promise((resolve, reject) => {
                                                    (TriggerEvent.trigger({
                                                        gvc: gvc,
                                                        widget: widget,
                                                        clickEvent: b.evenet,
                                                        subData
                                                    })).then((data) => {
                                                        resolve(data);
                                                    });
                                                });
                                                if (result) {
                                                    tag = b.tag;
                                                    carryData = b.carryData;
                                                    break;
                                                }
                                            }
                                            else {
                                                if (b.codeVersion === 'v2') {
                                                    if ((yield eval(`(() => {
                                                    ${b.code}
                                                })()`)) === true) {
                                                        tag = b.tag;
                                                        carryData = b.carryData;
                                                        break;
                                                    }
                                                }
                                                else {
                                                    if ((yield eval(b.code)) === true) {
                                                        tag = b.tag;
                                                        carryData = b.carryData;
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                        catch (e) {
                                            console.log(e);
                                        }
                                    }
                                    let sub = subData;
                                    try {
                                        sub.carryData = yield TriggerEvent.trigger({
                                            gvc: gvc,
                                            clickEvent: carryData,
                                            widget: widget,
                                            subData: subData
                                        });
                                    }
                                    catch (e) {
                                        console.log(e);
                                    }
                                    if (!tag) {
                                        resolve(``);
                                    }
                                    else {
                                        const page_request_config = widget.data.refer_app ? {
                                            tag: tag,
                                            appName: widget.data.refer_app
                                        } : {
                                            tag: tag,
                                            appName: window.appName
                                        };
                                        (window.glitterInitialHelper).getPageData(page_request_config, (d2) => {
                                            var _a;
                                            data = d2.response.result[0];
                                            data.config = (_a = data.config) !== null && _a !== void 0 ? _a : [];
                                            data.config.map((dd) => {
                                                glitter.htmlGenerate.renameWidgetID(dd);
                                            });
                                            function getFormData(ref) {
                                                var _a, _b;
                                                let formData = JSON.parse(JSON.stringify(ref || {}));
                                                if ((widget.data.refer_app)) {
                                                    GlobalWidget.initialShowCaseData({
                                                        widget: widget,
                                                        gvc: gvc
                                                    });
                                                    if (gvc.glitter.document.body.clientWidth < 800 && widget.mobile.refer === 'hide') {
                                                        resolve(`
                                                <!-- tag=${tag} -->
                                                `);
                                                        return;
                                                    }
                                                    else if (gvc.glitter.document.body.clientWidth >= 800 && widget.desktop.refer === 'hide') {
                                                        resolve(`
                                                <!-- tag=${tag} -->
                                                `);
                                                        return;
                                                    }
                                                    else if (gvc.glitter.document.body.clientWidth < 800 && widget.mobile.refer === 'custom') {
                                                        ((_a = widget[`mobile_editable`]) !== null && _a !== void 0 ? _a : []).map((dd) => {
                                                            formData[dd] = JSON.parse(JSON.stringify((widget.mobile.data.refer_form_data || data.page_config.formData)[dd] || {}));
                                                        });
                                                    }
                                                    else if (gvc.glitter.document.body.clientWidth >= 800 && widget.desktop.refer === 'custom') {
                                                        ((_b = widget[`desktop_editable`]) !== null && _b !== void 0 ? _b : []).map((dd) => {
                                                            formData[dd] = JSON.parse(JSON.stringify((widget.desktop.data.refer_form_data || data.page_config.formData)[dd] || {}));
                                                        });
                                                    }
                                                }
                                                return formData;
                                            }
                                            data.config.formData = getFormData((widget.data.refer_app) ? (widget.data.refer_form_data || data.page_config.formData) : data.page_config.formData);
                                            viewConfig = data.config;
                                            const id = gvc.glitter.getUUID();
                                            function updatePageConfig(formData, type, oWidget) {
                                                oWidget && (widget = oWidget);
                                                viewConfig.formData = getFormData((widget.data.refer_app) ? (widget.data.refer_form_data || data.page_config.formData) : data.page_config.formData);
                                                document.querySelector(`[gvc-id="${gvc.id(id)}"]`).outerHTML = getView();
                                            }
                                            function getView() {
                                                function loop(array) {
                                                    array.map((dd) => {
                                                        var _a;
                                                        if (dd.type === 'container') {
                                                            loop((_a = dd.data.setting) !== null && _a !== void 0 ? _a : []);
                                                        }
                                                        dd.formData = undefined;
                                                    });
                                                }
                                                function getCreateOption() {
                                                    var _a, _b, _c;
                                                    let createOption = (_a = (htmlGenerate !== null && htmlGenerate !== void 0 ? htmlGenerate : {}).createOption) !== null && _a !== void 0 ? _a : {};
                                                    createOption.option = (_b = createOption.option) !== null && _b !== void 0 ? _b : [];
                                                    createOption.class = createOption.class || ``;
                                                    createOption.childContainer = true;
                                                    createOption.class += ` ${(glitter.htmlGenerate.isEditMode()) ? `${page_request_config.appName}_${page_request_config.tag} ${widget.id}` : ``}`;
                                                    createOption.style = (_c = createOption.style) !== null && _c !== void 0 ? _c : '';
                                                    createOption.style += RenderValue.custom_style.container_style(gvc, widget);
                                                    createOption.style += (() => {
                                                        if (gvc.glitter.document.body.clientWidth < 800 && widget.mobile && widget.mobile.refer === 'custom' && widget[`mobile_editable`].find((d1) => {
                                                            return d1 === '_container_margin';
                                                        })) {
                                                            return RenderValue.custom_style.value(gvc, widget.mobile);
                                                        }
                                                        else if (gvc.glitter.document.body.clientWidth >= 800 && widget.desktop && widget.desktop.refer === 'custom' && widget[`desktop_editable`].find((d1) => {
                                                            return d1 === '_container_margin';
                                                        })) {
                                                            return RenderValue.custom_style.value(gvc, widget.desktop);
                                                        }
                                                        else {
                                                            return RenderValue.custom_style.value(gvc, widget);
                                                        }
                                                    })();
                                                    const fonts_index = (() => {
                                                        if (!glitter.share.font_theme[parseInt(widget.container_fonts, 10)]) {
                                                            widget.container_fonts = 0;
                                                        }
                                                        return parseInt(widget.container_fonts, 10);
                                                    })();
                                                    if (glitter.share.font_theme[fonts_index]) {
                                                        createOption.style += ` font-family: '${glitter.share.font_theme[fonts_index].value}' !important;`;
                                                    }
                                                    return createOption;
                                                }
                                                loop(viewConfig);
                                                return new glitter.htmlGenerate(viewConfig, [], sub).render(gvc, {
                                                    class: ``,
                                                    style: ``,
                                                    containerID: id,
                                                    tag: page_request_config.tag,
                                                    jsFinish: () => {
                                                    },
                                                    onCreate: () => {
                                                        if (glitter.htmlGenerate.isEditMode()) {
                                                            gvc.getBindViewElem(id).get(0).updatePageConfig = updatePageConfig;
                                                        }
                                                    },
                                                    document: document
                                                }, getCreateOption);
                                            }
                                            widget.storage.updatePageConfig = updatePageConfig;
                                            resolve(`
                                                <!-- tag=${tag} -->
                                              ${getView()}
                                                `);
                                        });
                                    }
                                }
                                catch (e) {
                                    console.log(e);
                                }
                            }));
                        });
                    }
                    return gvc.bindView(() => {
                        const tempView = glitter.getUUID();
                        return {
                            bind: tempView,
                            view: () => {
                                return ``;
                            },
                            divCreate: {
                                class: ``
                            },
                            onInitial: () => __awaiter(void 0, void 0, void 0, function* () {
                                const target = document.querySelector(`[gvc-id="${gvc.id(tempView)}"]`);
                                target.outerHTML = (yield getData(gvc.glitter.document));
                            }),
                            onDestroy: () => {
                            },
                        };
                    });
                },
                editor: () => __awaiter(void 0, void 0, void 0, function* () {
                    const EditorElem = yield new Promise((resolve, reject) => {
                        gvc.glitter.getModule(new URL('../../glitterBundle/plugins/editor-elem.js', import.meta.url).href, (clas) => {
                            resolve(clas);
                        });
                    });
                    const ApiPageConfig = yield new Promise((resolve, reject) => {
                        gvc.glitter.getModule(new URL('../../api/pageConfig.js', import.meta.url).href, (clas) => {
                            resolve(clas);
                        });
                    });
                    const FormWidget = yield new Promise((resolve, reject) => {
                        gvc.glitter.getModule(new URL('./form.js', import.meta.url).href, (clas) => {
                            resolve(clas);
                        });
                    });
                    const BgWidget = yield new Promise((resolve, reject) => {
                        gvc.glitter.getModule(new URL('../../backend-manager/bg-widget.js', import.meta.url).href, (clas) => {
                            resolve(clas);
                        });
                    });
                    const CustomStyle = yield new Promise((resolve, reject) => {
                        gvc.glitter.getModule(new URL(gvc.glitter.root_path + 'glitterBundle/html-component/custom-style.js', import.meta.url).href, (clas) => {
                            resolve(clas);
                        });
                    });
                    function devEditorView() {
                        const id = glitter.getUUID();
                        const data = {
                            dataList: undefined
                        };
                        const saasConfig = window.saasConfig;
                        function getData() {
                            BaseApi.create({
                                "url": saasConfig.config.url + `/api/v1/template?appName=${widget.data.refer_app || saasConfig.config.appName}&page_type=module`,
                                "type": "GET",
                                "timeout": 0,
                                "headers": {
                                    "Content-Type": "application/json"
                                }
                            }).then((d2) => {
                                data.dataList = d2.response.result;
                                gvc.notifyDataChange(id);
                            });
                        }
                        function setPage(pd) {
                            var _a;
                            let group = [];
                            let selectGroup = '';
                            pd.carryData = (_a = pd.carryData) !== null && _a !== void 0 ? _a : {};
                            let id = glitter.getUUID();
                            data.dataList.map((dd) => {
                                if (dd.tag === pd.tag) {
                                    selectGroup = dd.group;
                                }
                                if (group.indexOf(dd.group) === -1) {
                                    group.push(dd.group);
                                }
                            });
                            return gvc.bindView(() => {
                                return {
                                    bind: id,
                                    view: () => {
                                        var _a;
                                        return [EditorElem.select({
                                                title: "選擇嵌入頁面",
                                                gvc: gvc,
                                                def: (_a = pd.tag) !== null && _a !== void 0 ? _a : "",
                                                array: [
                                                    {
                                                        title: '選擇嵌入頁面', value: ''
                                                    }
                                                ].concat(data.dataList.sort((function (a, b) {
                                                    if (a.group.toUpperCase() < b.group.toUpperCase()) {
                                                        return -1;
                                                    }
                                                    if (a.group.toUpperCase() > b.group.toUpperCase()) {
                                                        return 1;
                                                    }
                                                    return 0;
                                                })).map((dd) => {
                                                    return {
                                                        title: `${dd.group}-${dd.name}`, value: dd.tag
                                                    };
                                                })),
                                                callback: (text) => {
                                                    pd.tag = text;
                                                },
                                            }), (() => {
                                                return TriggerEvent.editer(gvc, widget, pd.carryData, {
                                                    hover: true,
                                                    option: [],
                                                    title: "夾帶資料<[ subData.carryData ]>"
                                                });
                                            })()].join(`<div class="my-2"></div>`);
                                    },
                                    divCreate: {
                                        class: `mb-2`
                                    }
                                };
                            });
                        }
                        const html = String.raw;
                        return gvc.bindView(() => {
                            return {
                                bind: id,
                                view: () => {
                                    if (data.dataList) {
                                        return [
                                            EditorElem.editerDialog({
                                                gvc: gvc,
                                                dialog: (gvc) => {
                                                    return setPage(widget.data);
                                                },
                                                editTitle: `預設嵌入頁面`
                                            }),
                                            EditorElem.editerDialog({
                                                gvc: gvc,
                                                dialog: (gvc) => {
                                                    return gvc.bindView(() => {
                                                        const diaId = glitter.getUUID();
                                                        return {
                                                            bind: diaId,
                                                            view: () => {
                                                                return EditorElem.arrayItem({
                                                                    gvc: gvc,
                                                                    title: "",
                                                                    array: () => {
                                                                        return widget.data.list.map((dd, index) => {
                                                                            return {
                                                                                title: dd.name || `判斷式:${index + 1}`,
                                                                                expand: dd,
                                                                                innerHtml: ((gvc) => {
                                                                                    return glitter.htmlGenerate.editeInput({
                                                                                        gvc: gvc,
                                                                                        title: `判斷式名稱`,
                                                                                        default: dd.name,
                                                                                        placeHolder: "輸入判斷式名稱",
                                                                                        callback: (text) => {
                                                                                            dd.name = text;
                                                                                        }
                                                                                    }) +
                                                                                        EditorElem.select({
                                                                                            title: '類型',
                                                                                            gvc: gvc,
                                                                                            def: dd.triggerType,
                                                                                            array: [{
                                                                                                    title: '程式碼',
                                                                                                    value: 'manual'
                                                                                                }, {
                                                                                                    title: '觸發事件',
                                                                                                    value: 'trigger'
                                                                                                }],
                                                                                            callback: (text) => {
                                                                                                dd.triggerType = text;
                                                                                            }
                                                                                        }) +
                                                                                        (() => {
                                                                                            var _a;
                                                                                            if (dd.triggerType === 'trigger') {
                                                                                                dd.evenet = (_a = dd.evenet) !== null && _a !== void 0 ? _a : {};
                                                                                                return `<div class="mt-2"></div>` + TriggerEvent.editer(gvc, widget, dd.evenet, {
                                                                                                    hover: false,
                                                                                                    option: [],
                                                                                                    title: "觸發事件"
                                                                                                });
                                                                                            }
                                                                                            else {
                                                                                                return EditorElem.codeEditor({
                                                                                                    gvc: gvc,
                                                                                                    title: `判斷式內容`,
                                                                                                    initial: dd.code,
                                                                                                    callback: (text) => {
                                                                                                        dd.codeVersion = 'v2';
                                                                                                        dd.code = text;
                                                                                                    },
                                                                                                    height: 400
                                                                                                });
                                                                                            }
                                                                                        })() + `
 ${setPage(dd)}`;
                                                                                }),
                                                                                saveEvent: () => {
                                                                                    gvc.notifyDataChange(diaId);
                                                                                },
                                                                                minus: gvc.event(() => {
                                                                                    widget.data.list.splice(index, 1);
                                                                                    widget.refreshComponent();
                                                                                }),
                                                                                width: '600px',
                                                                            };
                                                                        });
                                                                    },
                                                                    expand: widget.data,
                                                                    plus: {
                                                                        title: "添加判斷",
                                                                        event: gvc.event(() => {
                                                                            widget.data.list.push({ code: '' });
                                                                            gvc.notifyDataChange(diaId);
                                                                        })
                                                                    },
                                                                    refreshComponent: () => {
                                                                    },
                                                                    originalArray: widget.data.list
                                                                });
                                                            },
                                                            divCreate: {}
                                                        };
                                                    });
                                                },
                                                width: "400px",
                                                editTitle: `判斷式頁面嵌入`
                                            })
                                        ].join(` <div class="my-2"></div>`);
                                    }
                                    else {
                                        return `<div class="w-100 d-flex align-items-center justify-content-center p-3">
<div class="spinner-border"></div>
</div>`;
                                    }
                                },
                                divCreate: {},
                                onCreate: () => {
                                    if (!data.dataList) {
                                        setTimeout(() => {
                                            getData();
                                        }, 100);
                                    }
                                }
                            };
                        });
                    }
                    function userEditorView() {
                        const saasConfig = window.saasConfig;
                        let data = {
                            dataList: []
                        };
                        return gvc.bindView(() => {
                            const id = glitter.getUUID();
                            let selectTag = '';
                            let vm = {
                                loading: true,
                                data: {}
                            };
                            BaseApi.create({
                                "url": saasConfig.config.url + `/api/v1/template?appName=${widget.data.refer_app || saasConfig.config.appName}&tag=${widget.data.tag}`,
                                "type": "GET",
                                "timeout": 0,
                                "headers": {
                                    "Content-Type": "application/json"
                                }
                            }).then((d2) => {
                                vm.data = d2;
                                vm.loading = false;
                                gvc.notifyDataChange(id);
                            });
                            return {
                                bind: id,
                                view: () => {
                                    if (vm.loading) {
                                        return `<div class="w-100 d-flex align-items-center justify-content-center">
<div class="spinner-border"></div>
</div>`;
                                    }
                                    else {
                                        const d2 = vm.data;
                                        data.dataList = d2.response.result;
                                        let valueArray = [];
                                        const def = data.dataList.find((dd) => {
                                            return dd.tag === widget.data.tag;
                                        });
                                        def && valueArray.push({
                                            title: def.name, tag: def.tag
                                        });
                                        widget.data.list.map((d2) => {
                                            const def = data.dataList.find((dd) => {
                                                return dd.tag === d2.tag;
                                            });
                                            def && valueArray.push({
                                                title: def.name, tag: def.tag
                                            });
                                        });
                                        valueArray.map((dd) => {
                                            selectTag = selectTag || dd.tag;
                                        });
                                        if (widget.data.refer_app) {
                                            selectTag = widget.data.tag;
                                        }
                                        const html = String.raw;
                                        return [
                                            html `
                                                <div class="d-flex align-items-center mt-2 mb-2 ${Storage.select_function === 'user-editor' ? `d-none` : ``}">
                                                    <select class="form-control form-select"
                                                            style="border-top-right-radius: 0;border-bottom-right-radius: 0;"
                                                            onchange="${gvc.event((e, event) => {
                                                selectTag = e.value;
                                                gvc.notifyDataChange(id);
                                            })}">${valueArray.map((dd) => {
                                                return `<option value="${dd.tag}" ${(dd.tag === selectTag) ? `selected` : ''} >${dd.title}</option>`;
                                            })}</select>
                                                    <div class="hoverBtn ms-auto d-flex align-items-center justify-content-center   border "
                                                         style="height:44px;width:44px;cursor:pointer;color:#151515;border-left: none;border-radius: 0px 10px 10px 0px;"
                                                         data-bs-toggle="tooltip" data-bs-placement="top"
                                                         data-bs-custom-class="custom-tooltip"
                                                         data-bs-title="跳轉至模塊" onclick="${gvc.event(() => {
                                                glitter.setUrlParameter('page', selectTag);
                                                glitter.share.reloadEditor();
                                            })}">
                                                        <i class="fa-regular fa-eye"></i>
                                                    </div>
                                                </div>
                                            `,
                                            gvc.bindView(() => {
                                                const id = gvc.glitter.getUUID();
                                                return {
                                                    bind: id,
                                                    view: () => {
                                                        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                                            function getPageData(cf) {
                                                                let tag = cf;
                                                                let appName = window.appName;
                                                                if (typeof cf === 'object') {
                                                                    tag = cf.tag;
                                                                    appName = cf.appName;
                                                                }
                                                                return new Promise((resolve, reject) => {
                                                                    (window.glitterInitialHelper).getPageData({
                                                                        tag: tag,
                                                                        appName: appName
                                                                    }, (d2) => {
                                                                        resolve(d2.response.result[0]);
                                                                    });
                                                                });
                                                            }
                                                            const pageData = yield getPageData(widget.data.refer_app ? {
                                                                tag: selectTag,
                                                                appName: widget.data.refer_app
                                                            } : selectTag);
                                                            let html = '';
                                                            let spiltCount = 0;
                                                            function appendHtml(pageData, widget, initial, p_id, parent_array) {
                                                                const oWidget = widget;
                                                                initialReferData(widget);
                                                                const page_config = pageData.page_config;
                                                                function getReferForm(widget, type) {
                                                                    if ((widget.data.refer_app)) {
                                                                        widget.data.refer_form_data = widget.data.refer_form_data || (oWidget.data.refer_form_data && JSON.parse(JSON.stringify(oWidget.data.refer_form_data))) || JSON.parse(JSON.stringify(page_config.formData));
                                                                        if (type !== 'def') {
                                                                            Object.keys(widget.data.refer_form_data).map(((dd) => {
                                                                                var _a;
                                                                                if (!((_a = oWidget[`${type}_editable`]) !== null && _a !== void 0 ? _a : []).find((d1) => {
                                                                                    return d1 === dd;
                                                                                })) {
                                                                                    widget.data.refer_form_data[dd] = undefined;
                                                                                }
                                                                            }));
                                                                            Object.keys(oWidget.data.refer_form_data).map((dd) => {
                                                                                var _a, _b;
                                                                                if (((_a = oWidget[`${type}_editable`]) !== null && _a !== void 0 ? _a : []).find((d1) => {
                                                                                    return d1 === dd;
                                                                                })) {
                                                                                    widget.data.refer_form_data[dd] = (_b = widget.data.refer_form_data[dd]) !== null && _b !== void 0 ? _b : JSON.parse(JSON.stringify(oWidget.data.refer_form_data[dd]));
                                                                                }
                                                                            });
                                                                            Object.keys(widget).map((dd) => {
                                                                                if ((dd !== 'data') && (dd !== 'refer')) {
                                                                                    widget[dd] = undefined;
                                                                                }
                                                                            });
                                                                        }
                                                                        return widget.data.refer_form_data;
                                                                    }
                                                                    else {
                                                                        return page_config.formData;
                                                                    }
                                                                }
                                                                if (page_config.formFormat && page_config.formFormat.length !== 0) {
                                                                    if (!initial && (spiltCount++ > 1)) {
                                                                        html += `<div class="d-flex align-items-center justify-content-center mt-2" style="gap:7px;">
<div class="flex-fill border"></div>
<span class="fw-500" style="color:black;">${pageData.name}</span>
<div class="flex-fill border"></div>
</div>`;
                                                                    }
                                                                    page_config.formData = page_config.formData || {};
                                                                    html += gvc.bindView(() => {
                                                                        const id = gvc.glitter.getUUID();
                                                                        function refreshLeftBar() {
                                                                            gvc.notifyDataChange(id);
                                                                        }
                                                                        const vm = {
                                                                            id: gvc.glitter.getUUID(),
                                                                            page: 'editor'
                                                                        };
                                                                        return {
                                                                            bind: id,
                                                                            view: () => {
                                                                                const html = String.raw;
                                                                                try {
                                                                                    return [
                                                                                        `<div class="mx-n2">${(() => {
                                                                                            switch (vm.page) {
                                                                                                case "editor":
                                                                                                    return html `
                                                                                                        ${gvc.bindView(() => {
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
                                                                                                                class: `px-3   border-bottom pb-3 fw-bold mt-n3 mb-2 pt-3 hoverF2 d-flex align-items-center`,
                                                                                                                style: `cursor: pointer;color:#393939;border-radius: 0px;gap:10px;`
                                                                                                            }
                                                                                                        };
                                                                                                    })}
                                                                                                        <div class="ps-2">
                                                                                                            ${GlobalWidget.showCaseBar(gvc, widget, () => {
                                                                                                        vm.page = 'editor';
                                                                                                        gvc.notifyDataChange(id);
                                                                                                    })}
                                                                                                        </div>`;
                                                                                                case "setting":
                                                                                                    return html `
                                                                                                        <div
                                                                                                                class="px-3   border-bottom pb-3 fw-bold mt-n3  pt-3 hoverF2 d-flex align-items-center"
                                                                                                                style="cursor: pointer;color:#393939;border-radius: 0px;gap:10px;"
                                                                                                                onclick="${gvc.event(() => {
                                                                                                        vm.page = 'editor';
                                                                                                        gvc.notifyDataChange(id);
                                                                                                    })}"
                                                                                                        >
                                                                                                            <i class="fa-solid fa-chevron-left"></i>
                                                                                                            <span style="max-width: calc(100% - 50px);text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">設定</span>
                                                                                                            <div class="flex-fill"></div>
                                                                                                        </div>`;
                                                                                            }
                                                                                        })()}</div>`,
                                                                                        GlobalWidget.showCaseEditor({
                                                                                            gvc: gvc,
                                                                                            widget: oWidget,
                                                                                            view: (widget, type) => {
                                                                                                try {
                                                                                                    const array_html = [];
                                                                                                    array_html.push(gvc.bindView(() => {
                                                                                                        const html = String.raw;
                                                                                                        function filterFormat(filter) {
                                                                                                            return __awaiter(this, void 0, void 0, function* () {
                                                                                                                function loop(ogArray, data) {
                                                                                                                    if (Array.isArray(data)) {
                                                                                                                        data.map((dd) => {
                                                                                                                            loop(data, dd);
                                                                                                                        });
                                                                                                                    }
                                                                                                                    else if (typeof data === 'object') {
                                                                                                                        if (filter(data)) {
                                                                                                                            Object.keys(data).map((d1) => {
                                                                                                                                loop(data, data[d1]);
                                                                                                                            });
                                                                                                                        }
                                                                                                                        else {
                                                                                                                            setTimeout(() => {
                                                                                                                                try {
                                                                                                                                    ogArray.splice(ogArray.findIndex((dd) => {
                                                                                                                                        return dd === data;
                                                                                                                                    }), 1);
                                                                                                                                }
                                                                                                                                catch (e) {
                                                                                                                                }
                                                                                                                            });
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                                const formFormat = JSON.parse(JSON.stringify(page_config.formFormat));
                                                                                                                loop(formFormat, formFormat);
                                                                                                                return new Promise((resolve) => {
                                                                                                                    setTimeout(() => {
                                                                                                                        resolve(formFormat);
                                                                                                                    }, 20);
                                                                                                                });
                                                                                                            });
                                                                                                        }
                                                                                                        return {
                                                                                                            bind: vm.id,
                                                                                                            view: () => __awaiter(this, void 0, void 0, function* () {
                                                                                                                let refer_form = getReferForm(widget, type);
                                                                                                                function refresh(widget, device) {
                                                                                                                    if (widget.data.refer_app) {
                                                                                                                        widget.data.refer_form_data = refer_form;
                                                                                                                        if (pageData.id !== p_id) {
                                                                                                                            glitter.share.editorViewModel.saveArray[pageData.id] = (() => {
                                                                                                                                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                                                                                                                    yield ApiPageConfig.setPage({
                                                                                                                                        id: p_id,
                                                                                                                                        appName: window.appName,
                                                                                                                                        tag: (parent_array).tag,
                                                                                                                                        config: parent_array
                                                                                                                                    });
                                                                                                                                    resolve(true);
                                                                                                                                }));
                                                                                                                            });
                                                                                                                            try {
                                                                                                                                console.log(`getPageData-${parent_array.tag}`, parent_array);
                                                                                                                                window.glitterInitialHelper.share[`getPageData-${window.appName}-${parent_array.tag}`].data.response.result[0].config = parent_array;
                                                                                                                            }
                                                                                                                            catch (error) {
                                                                                                                                console.log(`error->`, error);
                                                                                                                            }
                                                                                                                        }
                                                                                                                        if (!widget.storage) {
                                                                                                                            try {
                                                                                                                                const doc = (document.querySelector('#editerCenter iframe').contentWindow.document).querySelectorAll(`.${oWidget.data.refer_app}_${oWidget.data.tag}`);
                                                                                                                                if (doc) {
                                                                                                                                    for (const b of doc) {
                                                                                                                                        b.updatePageConfig(refer_form, device, oWidget);
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            }
                                                                                                                            catch (e) {
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                    else {
                                                                                                                        glitter.share.editorViewModel.saveArray[pageData.id] = (() => {
                                                                                                                            return ApiPageConfig.setPage({
                                                                                                                                id: pageData.id,
                                                                                                                                appName: pageData.appName,
                                                                                                                                tag: pageData.tag,
                                                                                                                                page_config: pageData.page_config,
                                                                                                                            });
                                                                                                                        });
                                                                                                                        try {
                                                                                                                            window.glitterInitialHelper.share[`getPageData-${pageData.tag}`].data.response.result[0].page_config = pageData.page_config;
                                                                                                                        }
                                                                                                                        catch (_a) {
                                                                                                                        }
                                                                                                                    }
                                                                                                                    widget.storage && widget.storage.updatePageConfig && widget.storage.updatePageConfig(refer_form, device, oWidget);
                                                                                                                }
                                                                                                                const setting_option = [
                                                                                                                    {
                                                                                                                        title: "樣式設定",
                                                                                                                        key: 'style',
                                                                                                                        array: yield filterFormat((dd) => {
                                                                                                                            if (type === 'def' || oWidget[`${type}_editable`].find((d1) => {
                                                                                                                                return d1 === dd.key;
                                                                                                                            })) {
                                                                                                                                return dd.page !== 'color_theme' && dd.category === 'style';
                                                                                                                            }
                                                                                                                            else {
                                                                                                                                return false;
                                                                                                                            }
                                                                                                                        })
                                                                                                                    },
                                                                                                                    {
                                                                                                                        title: "顏色設定",
                                                                                                                        key: 'color',
                                                                                                                        array: yield filterFormat((dd) => {
                                                                                                                            if (type === 'def' || oWidget[`${type}_editable`].find((d1) => {
                                                                                                                                return d1 === dd.key;
                                                                                                                            })) {
                                                                                                                                return dd.page === 'color_theme';
                                                                                                                            }
                                                                                                                            else {
                                                                                                                                return false;
                                                                                                                            }
                                                                                                                        })
                                                                                                                    },
                                                                                                                    {
                                                                                                                        title: "字型設定",
                                                                                                                        key: 'fonts',
                                                                                                                        array: []
                                                                                                                    },
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
                                                                                                                    switch (dd.key) {
                                                                                                                        case 'style':
                                                                                                                        case 'color':
                                                                                                                            return (dd.array && dd.array.length > 0);
                                                                                                                        case 'background':
                                                                                                                            return (type === 'def' || oWidget[`${type}_editable`].filter((d1) => {
                                                                                                                                return d1 === '_container_background';
                                                                                                                            }).length);
                                                                                                                        case 'fonts':
                                                                                                                            return (type === 'def' || oWidget[`${type}_editable`].filter((d1) => {
                                                                                                                                return d1 === '_container_fonts';
                                                                                                                            }).length);
                                                                                                                        case 'margin':
                                                                                                                        case 'develop':
                                                                                                                            return (type === 'def' || oWidget[`${type}_editable`].filter((d1) => {
                                                                                                                                return d1 === '_container_margin';
                                                                                                                            }).length);
                                                                                                                    }
                                                                                                                });
                                                                                                                try {
                                                                                                                    if (vm.page === 'editor') {
                                                                                                                        return [
                                                                                                                            type === 'def' ? `` : html `
                                                                                                                                <div class="my-2 mx-3 "
                                                                                                                                     style=" height: 40px; padding: 6px 18px;background: #393939; border-radius: 10px; overflow: hidden;
width: calc(100% - 30px);
justify-content: center; align-items: center; gap: 8px; display: inline-flex;cursor: pointer;"
                                                                                                                                     onclick="${gvc.event(() => {
                                                                                                                                const cGvc = gvc;
                                                                                                                                EditorElem.openEditorDialog(gvc, (gvc) => {
                                                                                                                                    return html `
                                                                                                                                                 <div class="p-3">
                                                                                                                                                     ${[
                                                                                                                                        BgWidget.multiCheckboxContainer(gvc, page_config.formFormat.map((dd) => {
                                                                                                                                            return {
                                                                                                                                                key: dd.key,
                                                                                                                                                name: dd.title
                                                                                                                                            };
                                                                                                                                        }).concat([{
                                                                                                                                                key: '_container_margin',
                                                                                                                                                name: '容器間距'
                                                                                                                                            }, {
                                                                                                                                                key: '_container_fonts',
                                                                                                                                                name: '字型設定'
                                                                                                                                            }, {
                                                                                                                                                key: '_container_background',
                                                                                                                                                name: '背景設定'
                                                                                                                                            },
                                                                                                                                        ]), oWidget[`${type}_editable`] || [], (select) => {
                                                                                                                                            oWidget[`${type}_editable`] = select;
                                                                                                                                        }, {}),
                                                                                                                                        html `
                                                                                                                                                             <div class="d-flex justify-content-end"
                                                                                                                                                                  style="gap:10px;">
                                                                                                                                                                 ${BgWidget.cancel(gvc.event(() => {
                                                                                                                                            gvc.closeDialog();
                                                                                                                                        }))}
                                                                                                                                                                 ${BgWidget.save(gvc.event(() => {
                                                                                                                                            gvc.closeDialog();
                                                                                                                                            getReferForm(widget, type);
                                                                                                                                            refreshLeftBar();
                                                                                                                                            refresh(widget, type);
                                                                                                                                        }), '完成')}
                                                                                                                                                             </div>`
                                                                                                                                    ].join('')}
                                                                                                                                                 </div>`;
                                                                                                                                }, () => {
                                                                                                                                }, 569, '設置自定義選項');
                                                                                                                            })}">
                                                                                                                                    <div style="color: white; font-size: 16px; font-family: Noto Sans; font-weight: 700; word-wrap: break-word">
                                                                                                                                        設置自定義選項
                                                                                                                                    </div>
                                                                                                                                </div>`,
                                                                                                                            FormWidget.editorView({
                                                                                                                                gvc: gvc,
                                                                                                                                array: yield filterFormat((dd) => {
                                                                                                                                    if (type === 'def' || oWidget[`${type}_editable`].find((d1) => {
                                                                                                                                        return d1 === dd.key;
                                                                                                                                    })) {
                                                                                                                                        return dd.page !== 'color_theme' && dd.category !== 'style';
                                                                                                                                    }
                                                                                                                                    else {
                                                                                                                                        return false;
                                                                                                                                    }
                                                                                                                                }),
                                                                                                                                refresh: () => {
                                                                                                                                    refresh(widget, type);
                                                                                                                                },
                                                                                                                                formData: refer_form,
                                                                                                                                widget: pageData.config
                                                                                                                            }),
                                                                                                                            html `
                                                                                                                                <div class="p-3 mt-3 d-flex align-items-center ${setting_option.length > 0 ? `` : `d-none`}"
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
                                                                                                                                </div>`
                                                                                                                        ].join('');
                                                                                                                    }
                                                                                                                    else if (vm.page === 'setting') {
                                                                                                                        return [setting_option.map((dd, index) => {
                                                                                                                                return gvc.bindView(() => {
                                                                                                                                    const vm_c = {
                                                                                                                                        id: gvc.glitter.getUUID(),
                                                                                                                                        toggle: false
                                                                                                                                    };
                                                                                                                                    setting_option[index].vm_c = vm_c;
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
                                                                                                                                                    case 'style':
                                                                                                                                                    case 'color':
                                                                                                                                                        (dd.array && dd.array.length > 0) && array_string.push(`<div class="px-1 pb-3 mt-n2">${FormWidget.editorView({
                                                                                                                                                            gvc: gvc,
                                                                                                                                                            array: dd.array.map((dd) => {
                                                                                                                                                                if (dd.page === 'color_theme') {
                                                                                                                                                                    dd.title = '';
                                                                                                                                                                }
                                                                                                                                                                return dd;
                                                                                                                                                            }),
                                                                                                                                                            refresh: () => {
                                                                                                                                                                refresh(widget, type);
                                                                                                                                                            },
                                                                                                                                                            formData: refer_form,
                                                                                                                                                            widget: pageData.config
                                                                                                                                                        })}</div>`);
                                                                                                                                                        break;
                                                                                                                                                    case 'fonts':
                                                                                                                                                        array_string.push(`<div class="px-3 pb-2 ">${EditorElem.select({
                                                                                                                                                            title: '',
                                                                                                                                                            gvc: gvc,
                                                                                                                                                            def: (() => {
                                                                                                                                                                if (!glitter.share.editorViewModel.appConfig.font_theme[parseInt(widget.container_fonts, 10)]) {
                                                                                                                                                                    widget.container_fonts = `0`;
                                                                                                                                                                }
                                                                                                                                                                return widget.container_fonts;
                                                                                                                                                            })(),
                                                                                                                                                            callback: (text) => {
                                                                                                                                                                widget.container_fonts = text;
                                                                                                                                                                refresh(widget, type);
                                                                                                                                                            },
                                                                                                                                                            array: glitter.share.editorViewModel.appConfig.font_theme.map((dd, index) => {
                                                                                                                                                                return {
                                                                                                                                                                    title: dd.title,
                                                                                                                                                                    value: `${index}`
                                                                                                                                                                };
                                                                                                                                                            }),
                                                                                                                                                        })}
  <div class="bt_border_editor mt-2"
                                                 onclick="${gvc.event((e, event) => {
                                                                                                                                                            gvc.glitter.getModule(`${gvc.glitter.root_path}/setting/fonts-config.js`, (FontsConfig) => {
                                                                                                                                                                NormalPageEditor.closeEvent = () => {
                                                                                                                                                                    gvc.notifyDataChange(vm_c.id);
                                                                                                                                                                    refresh(widget, type);
                                                                                                                                                                };
                                                                                                                                                                NormalPageEditor.toggle({
                                                                                                                                                                    visible: true,
                                                                                                                                                                    view: FontsConfig.fontsSettingView(gvc, glitter.share.editorViewModel.appConfig, true),
                                                                                                                                                                    title: '管理全站字型'
                                                                                                                                                                });
                                                                                                                                                            });
                                                                                                                                                        })}">
                                                管理全站字型
                                            </div>
</div>`);
                                                                                                                                                        break;
                                                                                                                                                    case 'margin':
                                                                                                                                                        array_string.push(`<div class="px-3 pb-2">${CustomStyle.editorMargin(gvc, widget, () => {
                                                                                                                                                            refresh(widget, type);
                                                                                                                                                        })}</div>`);
                                                                                                                                                        break;
                                                                                                                                                    case 'background':
                                                                                                                                                        array_string.push(`<div class="px-3 pb-2">${CustomStyle.editorBackground(gvc, widget, () => {
                                                                                                                                                            refresh(widget, type);
                                                                                                                                                        })}</div>`);
                                                                                                                                                        break;
                                                                                                                                                    case 'develop':
                                                                                                                                                        array_string.push(`<div class="px-3">${CustomStyle.editor(gvc, widget, () => {
                                                                                                                                                            refresh(widget, type);
                                                                                                                                                        })}</div>`);
                                                                                                                                                        break;
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                            return array_string.join('');
                                                                                                                                        },
                                                                                                                                        divCreate: {
                                                                                                                                            class: `border-bottom`,
                                                                                                                                            style: `cursor: pointer;color:#393939;border-radius: 0px;gap:10px;`
                                                                                                                                        }
                                                                                                                                    };
                                                                                                                                });
                                                                                                                            }).join('')].join('');
                                                                                                                    }
                                                                                                                    else {
                                                                                                                        return ``;
                                                                                                                    }
                                                                                                                }
                                                                                                                catch (e) {
                                                                                                                    console.log(`render-error`, e);
                                                                                                                    return ``;
                                                                                                                }
                                                                                                            })
                                                                                                        };
                                                                                                    }));
                                                                                                    return `<div class="mx-n2">${array_html.join('')}</div>`;
                                                                                                }
                                                                                                catch (e) {
                                                                                                    console.log(`error--->`, e);
                                                                                                    return ``;
                                                                                                }
                                                                                            },
                                                                                            custom_edit: true,
                                                                                            toggle_visible: (bool) => {
                                                                                                if (bool) {
                                                                                                    $(gvc.glitter.document.querySelector('#editerCenter  iframe').contentWindow.document.querySelector('.' + view_container_id)).show();
                                                                                                }
                                                                                                else {
                                                                                                    $(gvc.glitter.document.querySelector('#editerCenter  iframe').contentWindow.document.querySelector('.' + view_container_id)).hide();
                                                                                                }
                                                                                            }
                                                                                        })
                                                                                    ].join('');
                                                                                }
                                                                                catch (e) {
                                                                                    return ``;
                                                                                }
                                                                            },
                                                                            onDestroy: () => {
                                                                            },
                                                                            divCreate: {
                                                                                class: ``
                                                                            }
                                                                        };
                                                                    });
                                                                }
                                                            }
                                                            pageData.config.tag = pageData.tag;
                                                            appendHtml(pageData, widget, true, pageData.id, pageData.config);
                                                            function loop(array, id, parent_config) {
                                                                var _a;
                                                                return __awaiter(this, void 0, void 0, function* () {
                                                                    for (const dd of array) {
                                                                        if (dd.type === 'container') {
                                                                            yield loop(dd.data.setting, id, parent_config);
                                                                        }
                                                                        else if (dd.type === 'component') {
                                                                            const pageData = yield getPageData(dd.data.refer_app ? {
                                                                                tag: dd.data.tag,
                                                                                appName: dd.data.refer_app
                                                                            } : dd.data.tag);
                                                                            if (!pageData.template_config || !pageData.template_config.tag || (!pageData.template_config.tag.find((dd) => {
                                                                                return dd === "商品卡片";
                                                                            }))) {
                                                                                appendHtml(pageData, dd, false, (dd.data.refer_app) ? id : pageData.id, parent_config);
                                                                                if (!dd.data.refer_app) {
                                                                                    pageData.config.tag = pageData.tag;
                                                                                    yield loop((_a = pageData.config) !== null && _a !== void 0 ? _a : [], pageData.id, pageData.config);
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                });
                                                            }
                                                            yield loop(pageData.config, pageData.id, pageData.config);
                                                            if (!html) {
                                                                resolve(`<div class="d-flex align-items-center justify-content-center flex-column w-100"
                                         style="width:100%;">
                                        <lottie-player style="max-width: 100%;width: 200px;"
                                                       src="https://assets10.lottiefiles.com/packages/lf20_rc6CDU.json"
                                                       speed="1" loop="true"
                                                       background="transparent"></lottie-player>
                                        <h3 class="text-dark fs-6 mt-n3 px-2  "
                                            style="line-height: 200%;text-align: center;">
                                            此模塊無可編輯內容。</h3>
                                    </div>`);
                                                            }
                                                            else {
                                                                resolve(html);
                                                            }
                                                        }));
                                                    }
                                                };
                                            })
                                        ].join('');
                                    }
                                },
                                divCreate: {
                                    class: 'pb-2'
                                },
                                onCreate: () => {
                                    $('.tooltip').remove();
                                    $('[data-bs-toggle="tooltip"]').tooltip();
                                }
                            };
                        });
                    }
                    return [
                        gvc.bindView(() => {
                            const id = gvc.glitter.getUUID();
                            let toggle = true;
                            return {
                                bind: id,
                                view: () => {
                                    return html `
                                        <div class="${Storage.select_function === 'user-editor' ? `d-none` : ``} mx-0 d-flex  px-3 hi fw-bold d-flex align-items-center shadow border-bottom  py-2 bgf6 "
                                             style="color:black;cursor: pointer;font-size:15px;"
                                             onclick="${gvc.event(() => {
                                        toggle = !toggle;
                                        gvc.notifyDataChange(id);
                                    })}">
                                            內容編輯
                                            <div class="flex-fill"></div>
                                            ${toggle ? ` <i class="fa-solid fa-chevron-up d-flex align-items-center justify-content-center me-2"
                                   style="cursor:pointer;" aria-hidden="true"></i>` : ` <i class="fa-solid  fa-angle-down d-flex align-items-center justify-content-center me-2"
                                   style="cursor:pointer;" aria-hidden="true"></i>`}
                                        </div>
                                        <div class="p-2">
                                            ${(toggle) ? userEditorView() : ``}
                                            <div style="height:10px;"></div>
                                        </div>
                                    `;
                                },
                                divCreate: {
                                    class: `mx-n2 mt-n2`, style: ``
                                }
                            };
                        }),
                        gvc.bindView(() => {
                            const id = gvc.glitter.getUUID();
                            let toggle = false;
                            return {
                                bind: id,
                                view: () => {
                                    return html `
                                        <div class="${Storage.select_function === 'user-editor' ? `d-none` : ``} mx-0 d-flex   border-top px-3 hi fw-bold d-flex align-items-center shadow border-bottom  py-2 bgf6"
                                             style="color:black;cursor: pointer;font-size:15px;"
                                             onclick="${gvc.event(() => {
                                        toggle = !toggle;
                                        gvc.notifyDataChange(id);
                                    })}">
                                            模塊進階設定
                                            <div class="flex-fill"></div>
                                            ${toggle ? ` <i class="fa-solid fa-chevron-up d-flex align-items-center justify-content-center me-2"
                                   style="cursor:pointer;" aria-hidden="true"></i>` : ` <i class="fa-solid  fa-angle-down d-flex align-items-center justify-content-center me-2"
                                   style="cursor:pointer;" aria-hidden="true"></i>`}
                                        </div>
                                        ${(toggle) ? `<div class="p-2 border-bottom">
${devEditorView()}
</div>` : ``}

                                    `;
                                },
                                divCreate: {
                                    class: `mx-n2 mt-n3`, style: ``
                                }
                            };
                        })
                    ].join(`<div style=""></div>`);
                })
            };
        }
    };
});
