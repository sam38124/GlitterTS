var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { init } from '../glitterBundle/GVController.js';
import { Editor } from './editor.js';
import { ApiPageConfig } from '../api/pageConfig.js';
import { Swal } from '../modules/sweetAlert.js';
import { Main_editor } from './function-page/main_editor.js';
import { Page_editor } from './function-page/page_editor.js';
import { Setting_editor } from './function-page/setting_editor.js';
import * as triggerBridge from '../editor-bridge/trigger-event.js';
import { TriggerEvent } from '../glitterBundle/plugins/trigger-event.js';
import { StoreHelper } from '../helper/store-helper.js';
import { Storage } from '../glitterBundle/helper/storage.js';
import { ServerEditor } from './function-page/server-editor/server-editor.js';
import { AddComponent } from '../editor/add-component.js';
import { PageSettingView } from '../editor/page-setting-view.js';
import { AddPage } from '../editor/add-page.js';
import { SetGlobalValue } from '../editor/set-global-value.js';
import { PageCodeSetting } from '../editor/page-code-setting.js';
import { NormalPageEditor } from '../editor/normal-page-editor.js';
import { EditorConfig } from '../editor-config.js';
import { HtmlGenerate } from '../glitterBundle/module/html-generate.js';
import { BgCustomerMessage } from '../backend-manager/bg-customer-message.js';
const html = String.raw;
const editorContainerID = `HtmlEditorContainer`;
init(import.meta.url, (gvc, glitter, gBundle) => {
    const css = String.raw;
    gvc.addStyle(css `
        .hoverHidden div {
            display: none;
        }
        .hoverHidden:hover div {
            display: flex;
        }
        .tooltip {
            z-index: 99999 !important;
        }

        .scroll-in {
            left: -120%; /* 將元素移到畫面外 */
            animation: slideInFromLeft 0.5s ease-out forwards;
        }

        .scroll-out {
            left: 0%; /* 將元素移到畫面外 */
            animation: slideOutFromLeft 0.5s ease-out forwards;
        }

        /* @keyframes 定義動畫 */
        @keyframes slideInFromLeft {
            0% {
                left: -120%; /* 起始位置在畫面外 */
            }
            100% {
                left: 0; /* 結束位置在畫面內 */
            }
        }
        /* @keyframes 定義動畫 */
        @keyframes slideOutFromLeft {
            0% {
                left: 0; /* 起始位置在畫面外 */
            }
            100% {
                left: -120%; /* 結束位置在畫面內 */
            }
        }
    `);
    gvc.addStyle(css `
        .scroll-right-in {
            right: -120%; /* 將元素移到畫面外 */
            animation: slideInRight 0.5s ease-out forwards;
        }

        .scroll-right-out {
            right: 0; /* 將元素移到畫面外 */
            animation: slideOutRight 0.5s ease-out forwards;
        }

        /* @keyframes 定義動畫 */
        @keyframes slideInRight {
            0% {
                right: -120%; /* 起始位置在畫面外 */
            }
            100% {
                right: 0; /* 結束位置在畫面內 */
            }
        }
        /* @keyframes 定義動畫 */
        @keyframes slideOutRight {
            0% {
                right: 0; /* 起始位置在畫面外 */
            }
            100% {
                right: -120%; /* 結束位置在畫面內 */
            }
        }
    `);
    const swal = new Swal(gvc);
    const viewModel = {
        saveArray: {},
        appName: gBundle.appName,
        appConfig: undefined,
        originalConfig: undefined,
        dataList: undefined,
        originalData: undefined,
        data: undefined,
        loading: true,
        selectItem: undefined,
        initialStyle: [],
        globalValue: [],
        initialStyleSheet: [],
        pluginList: [],
        initialJS: [],
        globalStyleTag: [],
        initialCode: '',
        initialList: [],
        backendPlugins: [],
        homePage: '',
        selectContainer: undefined,
        selectIndex: undefined,
        waitCopy: undefined,
        globalScript: undefined,
        globalStyle: undefined,
        domain: '',
        originalDomain: '',
        app_config_original: {},
    };
    initialEditor(gvc, viewModel);
    window.parent.glitter.share.refreshMainLeftEditor = () => {
        gvc.notifyDataChange('MainEditorLeft');
    };
    window.parent.glitter.share.refreshMainRightEditor = () => {
        gvc.notifyDataChange('MainEditorRight');
    };
    function lod() {
        return __awaiter(this, void 0, void 0, function* () {
            yield swal.loading('載入中...');
            const waitGetData = [
                () => __awaiter(this, void 0, void 0, function* () {
                    return yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        const clock = gvc.glitter.ut.clock();
                        ApiPageConfig.getAppConfig().then((res) => {
                            viewModel.app_config_original = res.response.result[0];
                            viewModel.domain = res.response.result[0].domain;
                            viewModel.originalDomain = viewModel.domain;
                            resolve(true);
                        });
                    }));
                }),
                () => __awaiter(this, void 0, void 0, function* () {
                    return yield new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                        if (!glitter.share.editor_vm) {
                            const data = yield ApiPageConfig.getPage({
                                appName: gBundle.appName,
                                type: 'template',
                            });
                            viewModel.data = (yield ApiPageConfig.getPage({
                                appName: gBundle.appName,
                                tag: glitter.getUrlParameter('page'),
                            })).response.result[0];
                            Storage.select_page_type = viewModel.data.page_type;
                            if (data.result) {
                                data.response.result.map((dd) => {
                                    var _a;
                                    dd.page_config = (_a = dd.page_config) !== null && _a !== void 0 ? _a : {};
                                    return dd;
                                });
                                viewModel.dataList = data.response.result;
                                viewModel.originalData = JSON.parse(JSON.stringify(viewModel.dataList));
                                glitter.share.allPageResource = JSON.parse(JSON.stringify(data.response.result));
                                const htmlGenerate = new gvc.glitter.htmlGenerate(viewModel.data.config, [Storage.lastSelect], undefined, true);
                                window.editerData = htmlGenerate;
                                window.page_config = viewModel.data.page_config;
                                if (!data) {
                                    resolve(false);
                                }
                                else {
                                    resolve(true);
                                }
                            }
                        }
                        else {
                            viewModel.dataList = [];
                            viewModel.data = glitter.share.editor_vm.page_data;
                            const htmlGenerate = new gvc.glitter.htmlGenerate(viewModel.data.config, [Storage.lastSelect], undefined, true);
                            window.editerData = htmlGenerate;
                            window.page_config = viewModel.data.page_config;
                            resolve(true);
                        }
                    }));
                }),
                () => __awaiter(this, void 0, void 0, function* () {
                    return yield new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                        var _a, _b, _c, _d, _e, _f, _g;
                        const data = glitter.share.appConfigresponse;
                        if (data.result) {
                            viewModel.appConfig = data.response.data;
                            viewModel.originalConfig = JSON.parse(JSON.stringify(viewModel.appConfig));
                            viewModel.globalScript = (_a = data.response.data.globalScript) !== null && _a !== void 0 ? _a : [];
                            viewModel.globalStyle = (_b = data.response.data.globalStyle) !== null && _b !== void 0 ? _b : [];
                            viewModel.globalStyleTag = (_c = data.response.data.globalStyleTag) !== null && _c !== void 0 ? _c : [];
                            viewModel.initialList = data.response.data.initialList;
                            viewModel.initialJS = data.response.data.eventPlugin;
                            viewModel.pluginList = data.response.data.pagePlugin;
                            viewModel.initialStyleSheet = data.response.data.initialStyleSheet;
                            viewModel.initialStyle = data.response.data.initialStyle;
                            viewModel.initialCode = (_d = data.response.data.initialCode) !== null && _d !== void 0 ? _d : '';
                            viewModel.homePage = (_e = data.response.data.homePage) !== null && _e !== void 0 ? _e : '';
                            viewModel.backendPlugins = (_f = data.response.data.backendPlugins) !== null && _f !== void 0 ? _f : [];
                            viewModel.globalValue = (_g = data.response.data.globalValue) !== null && _g !== void 0 ? _g : [];
                            resolve(true);
                            function load() {
                                return __awaiter(this, void 0, void 0, function* () {
                                    glitter.share.globalJsList = [
                                        {
                                            src: {
                                                official: './official_event/event.js',
                                            },
                                        },
                                    ].concat(viewModel.initialJS);
                                    for (const a of glitter.share.globalJsList) {
                                        yield new Promise((resolve) => {
                                            glitter.addMtScript([
                                                {
                                                    src: TriggerEvent.getLink(a.src.official),
                                                    type: 'module',
                                                },
                                            ], () => {
                                                resolve(true);
                                            }, () => {
                                                resolve(true);
                                            });
                                        });
                                    }
                                    resolve(true);
                                });
                            }
                            load();
                        }
                        else {
                            resolve(false);
                        }
                    })).then((data) => {
                        return data;
                    });
                }),
            ];
            let count = 0;
            let result = yield new Promise((resolve, reject) => {
                for (const a of waitGetData) {
                    a().then((result) => {
                        if (result) {
                            count++;
                        }
                        else {
                            resolve(false);
                        }
                        if (count === waitGetData.length) {
                            resolve(true);
                        }
                    });
                }
            });
            if (!result) {
                yield lod();
                return;
            }
            swal.close();
            viewModel.loading = false;
            gvc.notifyDataChange(editorContainerID);
        });
    }
    lod().then(() => {
        glitter.htmlGenerate.saveEvent = (refresh = true, callback) => {
            glitter.closeDiaLog();
            glitter.setCookie('jumpToNavScroll', $(`#jumpToNav`).scrollTop());
            swal.loading('更新中...');
            function saveEvent() {
                return __awaiter(this, void 0, void 0, function* () {
                    for (const b of Object.keys(glitter.share.editorViewModel.saveArray)) {
                        yield glitter.share.editorViewModel.saveArray[b]();
                    }
                    glitter.share.editorViewModel.saveArray = {};
                    const waitSave = [
                        () => __awaiter(this, void 0, void 0, function* () {
                            let haveID = [];
                            function getID(set) {
                                set.map((dd) => {
                                    var _a;
                                    dd.js = dd.js.replace(`${location.origin}/${window.appName}/`, './');
                                    dd.formData = undefined;
                                    dd.pageConfig = undefined;
                                    dd.subData = undefined;
                                    dd.appConfig = undefined;
                                    dd.storage = undefined;
                                    dd.tag = undefined;
                                    dd.bundle = undefined;
                                    dd.share = undefined;
                                    if (haveID.indexOf(dd.id) !== -1) {
                                        dd.id = glitter.getUUID();
                                    }
                                    haveID.push(dd.id);
                                    if (dd.type === 'container') {
                                        dd.data.setting = (_a = dd.data.setting) !== null && _a !== void 0 ? _a : [];
                                        getID(dd.data.setting);
                                    }
                                });
                            }
                            getID(viewModel.data.config);
                            if (glitter.share.editor_vm) {
                                return new Promise((resolve, reject) => {
                                    resolve(true);
                                });
                            }
                            else {
                                return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                                    let result = true;
                                    ApiPageConfig.setPage({
                                        id: viewModel.data.id,
                                        appName: gBundle.appName,
                                        tag: viewModel.data.tag,
                                        name: viewModel.data.name,
                                        config: viewModel.data.config,
                                        group: viewModel.data.group,
                                        page_config: viewModel.data.page_config,
                                        page_type: viewModel.data.page_type,
                                        preview_image: viewModel.data.preview_image,
                                        favorite: viewModel.data.favorite,
                                    }).then((api) => {
                                        resolve(result && api.result);
                                    });
                                }));
                            }
                        }),
                        () => __awaiter(this, void 0, void 0, function* () {
                            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                                viewModel.appConfig.homePage = viewModel.homePage;
                                viewModel.appConfig.globalStyle = viewModel.globalStyle;
                                viewModel.appConfig.globalScript = viewModel.globalScript;
                                viewModel.appConfig.globalValue = viewModel.globalValue;
                                viewModel.appConfig.globalStyleTag = viewModel.globalStyleTag;
                                resolve(yield StoreHelper.setPlugin(viewModel.originalConfig, viewModel.appConfig));
                            }));
                        }),
                    ];
                    for (const a of waitSave) {
                        if (!(yield a())) {
                            swal.nextStep(`伺服器錯誤`, () => { }, 'error');
                            return;
                        }
                    }
                    swal.close();
                    viewModel.originalConfig = JSON.parse(JSON.stringify(viewModel.appConfig));
                    if (refresh) {
                        window.preloadData = {};
                        window.glitterInitialHelper.share = {};
                        lod();
                    }
                    if (glitter.share.editor_vm) {
                        glitter.share.editor_vm.callback(viewModel.data);
                        swal.close();
                        swal.toast({
                            icon: 'success',
                            title: '儲存成功',
                        });
                    }
                    else if (refresh) {
                        window.preloadData = {};
                        window.glitterInitialHelper.share = {};
                        lod();
                    }
                });
            }
            saveEvent().then((r) => {
                callback && callback();
            });
        };
        glitter.share.selectEditorItem = () => {
            localStorage.setItem('rightSelect', 'module');
            glitter.share.selectEditorItemTimer && clearInterval(glitter.share.selectEditorItemTimer);
            glitter.share.selectEditorItemTimer = setTimeout(() => {
                gvc.notifyDataChange(['MainEditorLeft', 'right_NAV']);
            }, 10);
        };
        glitter.share.reloadEditor = () => {
            viewModel.selectItem = undefined;
            viewModel.selectContainer = undefined;
            lod();
        };
    });
    return {
        onCreateView: () => {
            return gvc.bindView({
                bind: editorContainerID,
                view: () => {
                    if (viewModel.loading) {
                        return ``;
                    }
                    else {
                        let view = [];
                        if (gvc.glitter.getUrlParameter('function') !== 'backend-manger') {
                            view.push(AddComponent.leftNav(gvc));
                            view.push(SetGlobalValue.leftNav(gvc));
                        }
                        else {
                            view.push(BgCustomerMessage.leftNav(gvc));
                        }
                        view.push(PageSettingView.leftNav(gvc));
                        view.push(AddPage.leftNav(gvc));
                        view.push(PageCodeSetting.leftNav(gvc));
                        view.push(NormalPageEditor.leftNav(gvc));
                        try {
                            const doc = new Editor(gvc, viewModel);
                            view.push(doc.create(html ` <div class="d-flex overflow-hidden border-end" style="height:100vh;background:white;">
                                        ${gvc.bindView(() => {
                                return {
                                    bind: 'left_sm_bar',
                                    view: () => {
                                        return `      ${[
                                            {
                                                src: `fa-duotone fa-window`,
                                                index: 'layout',
                                                hint: '頁面編輯',
                                            },
                                            {
                                                src: `fa-sharp fa-regular fa-palette`,
                                                index: 'color',
                                                hint: '配色設定',
                                            },
                                        ]
                                            .map((da) => {
                                            return html `<i
                                                                class=" ${da.src} fs-5 fw-bold   p-2 rounded"
                                                                data-bs-toggle="tooltip"
                                                                data-bs-placement="top"
                                                                data-bs-custom-class="custom-tooltip"
                                                                data-bs-title="${da.hint}"
                                                                style="cursor:pointer;
${Storage.page_setting_item === `${da.index}` ? `background:${EditorConfig.editor_layout.btn_background};color:white;` : ``}
"
                                                                onclick="${gvc.event(() => {
                                                viewModel.waitCopy = undefined;
                                                viewModel.selectItem = undefined;
                                                Storage.page_setting_item = da.index;
                                                gvc.notifyDataChange(editorContainerID);
                                            })}"
                                                            ></i>`;
                                        })
                                            .join('')}`;
                                    },
                                    divCreate: {
                                        style: `width:50px;gap:20px;padding-top: 15px;min-width:50px;`,
                                        class: `${Storage.select_function === 'user-editor' || Storage.select_function === 'page-editor' ? `` : `d-none`} h-120 border-end d-flex flex-column align-items-center`,
                                    },
                                };
                            })}
                                        <div
                                            class="offcanvas-body swiper scrollbar-hover  w-120 ${(() => {
                                switch (Storage.select_function) {
                                    case 'backend-manger':
                                    case 'server-manager':
                                        return `pt-0`;
                                    case 'page-editor':
                                        return `p-0`;
                                    default:
                                        return `p-0`;
                                }
                            })()}"
                                            style="overflow-y: auto;overflow-x:hidden;height:calc(100vh - 56px);"
                                        >
                                            <div class="h-120" style="">
                                                ${gvc.bindView(() => {
                                return {
                                    bind: 'MainEditorLeft',
                                    view: () => {
                                        const view = (() => {
                                            switch (Storage.select_function) {
                                                case 'backend-manger':
                                                    return Setting_editor.left(gvc, viewModel, editorContainerID, gBundle);
                                                case 'server-manager':
                                                    return ServerEditor.left(gvc);
                                                case 'page-editor':
                                                case 'user-editor':
                                                    if (Storage.select_function === 'user-editor') {
                                                        if (!viewModel.data.page_config || viewModel.data.page_config.support_editor !== 'true') {
                                                            const redirect = viewModel.dataList.find((dd) => {
                                                                return dd.page_config && dd.page_config.support_editor === 'true';
                                                            });
                                                            if (redirect) {
                                                                const url = new URL(glitter.root_path + `${redirect.tag}${location.search}`);
                                                                location.href = url.href;
                                                            }
                                                        }
                                                    }
                                                    return Main_editor.left(gvc, viewModel, editorContainerID, gBundle);
                                                default:
                                                    return Page_editor.left(gvc, viewModel, editorContainerID, gBundle);
                                            }
                                        })();
                                        if (document.body.offsetWidth < 800) {
                                            glitter.setDrawer(`<div class="bg-white vh-120 overflow-auto">${view}</div>`, () => { });
                                            return ``;
                                        }
                                        else {
                                            return view;
                                        }
                                    },
                                    divCreate: {
                                        class: 'h-120',
                                    },
                                };
                            })}
                                            </div>
                                            <div class="swiper-scrollbar end-0"></div>
                                        </div>
                                    </div>`, gvc.bindView({
                                bind: 'MainEditorRight',
                                view: () => {
                                    return ``;
                                },
                                divCreate: {},
                            })));
                            return view.join('');
                        }
                        catch (e) {
                            console.error(e);
                            return ``;
                        }
                    }
                },
                divCreate: {},
                onCreate: () => {
                    $('#jumpToNav').scroll(function () {
                        glitter.setCookie('jumpToNavScroll', $(`#jumpToNav`).scrollTop());
                    });
                    function scrollToItem(element) {
                        if (element) {
                            let elementRect = element.getBoundingClientRect();
                            let elementTop = elementRect.top;
                            let elementHeight = elementRect.height;
                            let windowHeight = document.querySelector('.scrollbar-hover').scrollHeight;
                            let scrollTo = elementTop - (windowHeight - elementHeight) / 2;
                            document.querySelector('.scrollbar-hover').scrollTo({
                                top: scrollTo,
                                left: 0,
                                behavior: 'auto',
                            });
                        }
                    }
                    setTimeout(() => {
                        scrollToItem(document.querySelector(`.editor_item.active`));
                    }, 200);
                },
            });
        },
        onCreate: () => { },
    };
});
function initialEditor(gvc, viewModel) {
    var _a;
    const glitter = gvc.glitter;
    glitter.share.editorViewModel = viewModel;
    localStorage.setItem('editor_mode', localStorage.getItem('editor_mode') || 'user');
    const swal = new Swal(gvc);
    glitter.share.pastEvent = () => {
        if (!glitter.share.copycomponent) {
            swal.nextStep(`請先複製元件`, () => { }, 'error');
            return;
        }
        let copy = JSON.parse(glitter.share.copycomponent);
        function checkId(dd) {
            dd.id = glitter.getUUID();
            if (dd.type === 'container') {
                dd.data.setting.map((d2) => {
                    checkId(d2);
                });
            }
        }
        checkId(copy);
        glitter.share.addComponent(copy);
    };
    glitter.share.clearSelectItem = () => {
        viewModel.selectItem = undefined;
    };
    glitter.share.NormalPageEditor = NormalPageEditor;
    glitter.share.inspect = (_a = glitter.share.inspect) !== null && _a !== void 0 ? _a : true;
    triggerBridge.initial();
    glitter.share.refreshAllContainer = () => {
        gvc.notifyDataChange(editorContainerID);
    };
    glitter.share.findWidgetIndex = (id) => {
        let find = {
            widget: undefined,
            container: undefined,
            index: 0,
        };
        function loop(array) {
            array.map((dd, index) => {
                if (dd.id === id) {
                    find.widget = dd;
                    find.container = array;
                    find.index = index;
                }
                else if (dd.type === 'container') {
                    loop(dd.data.setting);
                }
            });
        }
        loop(glitter.share.editorViewModel.data.config);
        return find;
    };
    function resetId(widget) {
        widget.id = glitter.getUUID();
        if (widget.type === 'container') {
            widget.data.setting.map((dd) => {
                resetId(dd);
            });
        }
    }
    glitter.share.addComponent = (data) => {
        AddComponent.toggle(false);
        resetId(data);
        const url = new URL(location.href);
        url.search = '';
        data.js = data.js.replace(url.href, './');
        viewModel.selectContainer.push(data);
        Storage.lastSelect = data.id;
        HtmlGenerate.hover_items = [Storage.lastSelect];
        if (viewModel.selectContainer.length === 1) {
            viewModel.selectContainer.container_config.getElement().recreateView();
        }
        else {
            $(viewModel.selectContainer.container_config.getElement()).append(HtmlGenerate.renderWidgetSingle({
                widget: data,
                gvc: viewModel.selectContainer.container_config.gvc,
                option: viewModel.selectContainer.container_config.option,
                container: viewModel.selectContainer.container_config.container,
                container_id: viewModel.selectContainer.container_config.container_id,
                child_container: viewModel.selectContainer.container_config.child_container,
                sub_data: viewModel.selectContainer.container_config.sub_data,
                root: viewModel.selectContainer.container_config.root,
            }));
        }
        setTimeout(() => {
            HtmlGenerate.selectWidget({
                widget: data,
                widgetComponentID: data.id,
                gvc: viewModel.selectContainer.container_config.gvc,
                scroll_to_hover: true,
                glitter: glitter,
            });
        }, 50);
        AddComponent.toggle(false);
    };
    glitter.share.addWithIndex = (cf) => {
        AddComponent.toggle(false);
        resetId(cf.data);
        const arrayData = glitter.share.findWidgetIndex(cf.index);
        const url = new URL(location.href);
        url.search = '';
        cf.data.js = cf.data.js.replace(url.href, './');
        if (cf.direction === 1) {
            arrayData.container.splice(arrayData.index + 1, 0, cf.data);
        }
        else {
            arrayData.container.splice(arrayData.index, 0, cf.data);
        }
        Storage.lastSelect = cf.data.id;
        HtmlGenerate.hover_items = [Storage.lastSelect];
        const $ = document.querySelector('#editerCenter iframe').contentWindow.$;
        $(HtmlGenerate.renderWidgetSingle({
            widget: cf.data,
            gvc: arrayData.container.container_config.gvc,
            option: arrayData.container.container_config.option,
            container: arrayData.container.container_config.container,
            container_id: arrayData.container.container_config.container_id,
            child_container: arrayData.container.container_config.child_container,
            sub_data: arrayData.container.container_config.sub_data,
            root: arrayData.container.container_config.root,
        }))[cf.direction === 1 ? 'insertAfter' : 'insertBefore']($(`.editor_it_${cf.index}`).parent());
        setTimeout(() => {
            HtmlGenerate.selectWidget({
                widget: cf.data,
                widgetComponentID: cf.data.id,
                gvc: arrayData.container.container_config.gvc,
                scroll_to_hover: true,
                glitter: glitter,
            });
        }, 50);
    };
    if (glitter.getUrlParameter('blogEditor') === 'true') {
        glitter.share.blogEditor = true;
        glitter.share.blogPage = glitter.getUrlParameter('page');
    }
    shortCutKey(gvc);
}
function shortCutKey(gvc) {
    document.addEventListener('keydown', function (event) {
        let keyCode = event.keyCode || event.which;
        if (event.ctrlKey && keyCode === 71) {
            SetGlobalValue.toggle(true);
        }
    });
}
