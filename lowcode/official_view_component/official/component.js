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
import { BaseApi } from "../../glitterBundle/api/base.js";
import { TriggerEvent } from "../../glitterBundle/plugins/trigger-event.js";
import { EditorElem } from "../../glitterBundle/plugins/editor-elem.js";
import { FormWidget } from "./form.js";
import { ApiPageConfig } from "../../api/pageConfig.js";
import { Storage } from "../../glitterBundle/helper/storage.js";
export const component = Plugin.createComponent(import.meta.url, (glitter, editMode) => {
    return {
        render: (gvc, widget, setting, hoverID, subData, htmlGenerate, doc) => {
            var _a, _b, _c;
            const document = doc || (window.document);
            widget.data.list = (_a = widget.data.list) !== null && _a !== void 0 ? _a : [];
            widget.storage = (_b = widget.storage) !== null && _b !== void 0 ? _b : {};
            widget.storage.updateFormData = (_c = widget.storage.updateFormData) !== null && _c !== void 0 ? _c : ((page_config) => {
            });
            let viewConfig = undefined;
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
                                    }),
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
                        "url": saasConfig.config.url + `/api/v1/template?appName=${widget.data.refer_app || saasConfig.config.appName}`,
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
                                let interVal = 0;
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
                                                    function appendHtml(pageData, widget, initial, id, parent_array) {
                                                        const page_config = pageData.page_config;
                                                        if (page_config.formFormat && page_config.formFormat.length !== 0) {
                                                            if (!initial && (spiltCount++ > 1)) {
                                                                html += `<div class="d-flex align-items-center justify-content-center mt-2" style="gap:7px;">
<div class="flex-fill border"></div>
<span class="fw-500" style="color:black;">${pageData.name}</span>
<div class="flex-fill border"></div>
</div>`;
                                                            }
                                                            console.log(`formData->`, page_config);
                                                            page_config.formData = page_config.formData || {};
                                                            const refer_form = ((widget.data.refer_app)) ? ((widget.data.refer_form_data || page_config.formData) || {}) : page_config.formData;
                                                            function refresh() {
                                                                console.log('refresh');
                                                                if (widget.data.refer_app) {
                                                                    widget.data.refer_form_data = refer_form;
                                                                    if (pageData.id !== id) {
                                                                        glitter.share.editorViewModel.saveArray[pageData.id] = (() => {
                                                                            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                                                                yield ApiPageConfig.setPage({
                                                                                    id: id,
                                                                                    appName: window.appName,
                                                                                    tag: (parent_array).tag,
                                                                                    config: parent_array
                                                                                });
                                                                                resolve(true);
                                                                            }));
                                                                        });
                                                                        try {
                                                                            window.glitterInitialHelper.share[`getPageData-${parent_array.tag}`].data.response.result[0].config = parent_array;
                                                                        }
                                                                        catch (_a) {
                                                                        }
                                                                    }
                                                                    if (!widget.storage) {
                                                                        try {
                                                                            const doc = (document.querySelector('#editerCenter iframe').contentWindow.document).querySelectorAll(`.${widget.data.refer_app}_${widget.data.tag}`);
                                                                            if (doc) {
                                                                                for (const b of doc) {
                                                                                    b.updatePageConfig(refer_form);
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
                                                                    catch (_b) {
                                                                    }
                                                                }
                                                                widget.storage && widget.storage.updatePageConfig && widget.storage.updatePageConfig(refer_form);
                                                            }
                                                            html += gvc.bindView(() => {
                                                                const id = gvc.glitter.getUUID();
                                                                return {
                                                                    bind: id,
                                                                    view: () => {
                                                                        return FormWidget.editorView({
                                                                            gvc: gvc,
                                                                            array: page_config.formFormat,
                                                                            refresh: refresh,
                                                                            formData: refer_form
                                                                        });
                                                                    },
                                                                    onDestroy: () => {
                                                                        refresh();
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
                                                                    appendHtml(pageData, dd, false, (dd.data.refer_app) ? id : pageData.id, parent_config);
                                                                    if (!dd.data.refer_app) {
                                                                        pageData.config.tag = pageData.tag;
                                                                        yield loop((_a = pageData.config) !== null && _a !== void 0 ? _a : [], pageData.id, pageData.config);
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
            const html = String.raw;
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
                                            var _a, _b, _c, _d, _e;
                                            data = d2.response.result[0];
                                            data.config = (_a = data.config) !== null && _a !== void 0 ? _a : [];
                                            data.config.map((dd) => {
                                                glitter.htmlGenerate.renameWidgetID(dd);
                                            });
                                            if (data.page_config.resource_from === 'own') {
                                                const url = new URL("", location.href);
                                                const id = gvc.glitter.getUUID();
                                                url.search = '';
                                                url.searchParams.set("page", data.tag);
                                                url.searchParams.set('appName', window.appName);
                                                url.searchParams.set('isIframe', 'true');
                                                url.searchParams.set('iframe_id', `${id}`);
                                                gvc.glitter.config.frameHeight = (_b = gvc.glitter.config.frameHeight) !== null && _b !== void 0 ? _b : {};
                                                gvc.glitter.config.frameHeight[url.href] = (_c = gvc.glitter.config.frameHeight[url.href]) !== null && _c !== void 0 ? _c : 0;
                                                function iframeView() {
                                                    var _a;
                                                    return __awaiter(this, void 0, void 0, function* () {
                                                        let rendered = false;
                                                        glitter.share.iframeHeightChange = (_a = glitter.share.iframeHeightChange) !== null && _a !== void 0 ? _a : {};
                                                        let lastHeight = 0;
                                                        glitter.share.iframeHeightChange[id] = (newHeight) => {
                                                            if (lastHeight != newHeight) {
                                                                lastHeight = newHeight;
                                                                let iframe = document.getElementById(id);
                                                                iframe.style.height = `${newHeight}px`;
                                                                iframe.style.minHeight = `${newHeight}px`;
                                                                $(`#${id}`).parent().height(`${newHeight}px`);
                                                            }
                                                        };
                                                        return `<iframe id="${id}" style="border:none !important;${(editMode) ? `pointer-events: none;` : ''}
  border: none;
    margin:!important;
    padding: !important;" src="${url.href}" class="w-100 h-100"  ></iframe>`;
                                                    });
                                                }
                                                iframeView().then((dd) => {
                                                    resolve(dd);
                                                });
                                            }
                                            else {
                                                let createOption = (_d = (htmlGenerate !== null && htmlGenerate !== void 0 ? htmlGenerate : {}).createOption) !== null && _d !== void 0 ? _d : {};
                                                createOption.option = (_e = createOption.option) !== null && _e !== void 0 ? _e : [];
                                                createOption.class = createOption.class || ``;
                                                createOption.childContainer = true;
                                                if ((widget.data.refer_app)) {
                                                    data.page_config.formData = (widget.data.refer_form_data || data.page_config.formData);
                                                }
                                                data.config.formData = data.page_config.formData;
                                                viewConfig = data.config;
                                                const id = gvc.glitter.getUUID();
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
                                                    loop(viewConfig);
                                                    createOption.class += ` ${(glitter.htmlGenerate.isEditMode()) ? `${page_request_config.appName}_${page_request_config.tag}` : ``}`;
                                                    return new glitter.htmlGenerate(viewConfig, [], sub).render(gvc, {
                                                        class: ``,
                                                        style: ``,
                                                        containerID: id,
                                                        tag: page_request_config.tag,
                                                        jsFinish: () => {
                                                        },
                                                        onCreate: () => {
                                                            if (glitter.htmlGenerate.isEditMode()) {
                                                                gvc.getBindViewElem(id).get(0).updatePageConfig = (formData) => {
                                                                    viewConfig.formData = formData;
                                                                    document.querySelector(`[gvc-id="${gvc.id(id)}"]`).outerHTML = getView();
                                                                };
                                                            }
                                                        },
                                                        document: document
                                                    }, createOption !== null && createOption !== void 0 ? createOption : {});
                                                }
                                                widget.storage.updatePageConfig = (formData) => {
                                                    try {
                                                        viewConfig.formData = formData;
                                                        document.querySelector(`[gvc-id="${gvc.id(id)}"]`).outerHTML = getView();
                                                    }
                                                    catch (e) {
                                                    }
                                                };
                                                resolve(`
                                                <!-- tag=${tag} -->
                                              ${getView()}
                                                `);
                                            }
                                        });
                                    }
                                }
                                catch (e) {
                                    console.log(e);
                                }
                            }));
                        });
                    }
                    const comp = false;
                    if (comp) {
                        return gvc.bindView(() => {
                            const id = gvc.glitter.getUUID();
                            return {
                                bind: id,
                                view: () => {
                                    return ``;
                                },
                                divCreate: {
                                    elem: 'web-component', option: [
                                        {
                                            key: 'id', value: id
                                        }
                                    ]
                                },
                                onCreate: () => __awaiter(void 0, void 0, void 0, function* () {
                                    const html = yield getData(document.querySelector('#' + id).shadowRoot);
                                    document.querySelector('#' + id).setView({
                                        gvc: gvc, view: html, id: id
                                    });
                                })
                            };
                        });
                    }
                    else {
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
                    }
                },
                editor: () => {
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
                }
            };
        }
    };
});
