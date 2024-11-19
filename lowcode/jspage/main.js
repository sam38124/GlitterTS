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
import { BgCustomerMessage } from '../backend-manager/bg-customer-message.js';
import { BgGuide } from "../backend-manager/bg-guide.js";
import { ApiShop } from "../glitter-base/route/shopping.js";
import { ShareDialog } from "../glitterBundle/dialog/ShareDialog.js";
import { SearchIdea } from "../editor/search-idea.js";
import { AiMessage } from "../cms-plugin/ai-message.js";
import { GlobalWidget } from "../glitterBundle/html-component/global-widget.js";
import { BgWidget } from "../backend-manager/bg-widget.js";
import { ApiUser } from "../glitter-base/route/user.js";
import { BaseApi } from "../glitterBundle/api/base.js";
import { GlobalUser } from "../glitter-base/global/global-user.js";
import { Article } from "../glitter-base/route/article.js";
import { AiChat } from "../glitter-base/route/ai-chat.js";
import { BgMobileGuide } from "../backend-manager/bg-MobileGuide.js";
const html = String.raw;
const editorContainerID = `HtmlEditorContainer`;
init(import.meta.url, (gvc, glitter, gBundle) => {
    glitter.share.loading_dialog = (new ShareDialog(gvc.glitter));
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
            animation: slideInFromLeft 0.3s ease-out forwards;
        }

        .scroll-out {
            left: 0%; /* 將元素移到畫面外 */
            animation: slideOutFromLeft 0.3s ease-out forwards;
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
        .parent_ {
            position: relative; /* 确保子元素相对于父元素定位 */
        }

        .child_ {
            display: none; /* 默认隐藏子元素 */
            position: absolute; /* 可选：使子元素定位 */
            top: 100%; /* 可选：根据需要调整子元素的位置 */
            left: 0;
            background-color: lightgrey; /* 可选：子元素背景颜色 */
            padding: 10px; /* 可选：子元素内边距 */
            border: 1px solid #ccc; /* 可选：子元素边框 */
        }

        .parent_:hover .child_ {
            display: block; /* 当父元素被 hover 时显示子元素 */
        }

        .scroll-right-in {
            right: -120%; /* 將元素移到畫面外 */
            animation: slideInRight 0.3s ease-out forwards;
        }

        .scroll-right-out {
            right: 0; /* 將元素移到畫面外 */
            animation: slideOutRight 0.3s ease-out forwards;
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
    Storage.lastSelect = '';
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
    const dialog = new ShareDialog(glitter);
    function lod() {
        return __awaiter(this, void 0, void 0, function* () {
            if (EditorConfig.backend_page() !== 'backend-manger') {
                glitter.share.loading_dialog.dataLoading({ text: '模組加載中...', visible: true });
            }
            else {
                dialog.dataLoading({ visible: true });
            }
            if (parseInt(glitter.share.top_inset, 10)) {
                gvc.addStyle(css `
                .scroll-in {
                    padding-top: ${glitter.share.top_inset}px;
                }

                .scroll-right-in {
                    padding-top: ${glitter.share.top_inset}px;
                }
            `);
            }
            const waitGetData = [
                () => __awaiter(this, void 0, void 0, function* () {
                    return yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        ApiPageConfig.getAppConfig().then((res) => {
                            viewModel.app_config_original = res.response.result[0];
                            if (EditorConfig.backend_page() === 'backend-manger' && ((viewModel.app_config_original.refer_app) && (viewModel.app_config_original.refer_app !== viewModel.app_config_original.appName))) {
                                glitter.setUrlParameter('appName', viewModel.app_config_original.refer_app);
                                location.reload();
                                return;
                            }
                            viewModel.domain = res.response.result[0].domain;
                            viewModel.originalDomain = viewModel.domain;
                            resolve(true);
                        });
                    }));
                }),
                () => __awaiter(this, void 0, void 0, function* () {
                    return yield new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                        viewModel.data = yield new Promise((resolve, reject) => {
                            (window.glitterInitialHelper).getPageData({
                                tag: glitter.getUrlParameter('page'),
                                appName: gBundle.appName
                            }, (d2) => {
                                if (glitter.getUrlParameter('page').startsWith('pages') || glitter.getUrlParameter('page').startsWith('hidden')) {
                                    Article.get({
                                        page: 0,
                                        limit: 1,
                                        tag: glitter.getUrlParameter('page').split('/')[1]
                                    }).then((data) => __awaiter(this, void 0, void 0, function* () {
                                        d2.response.result[0].config = data.response.data[0].content.config;
                                        resolve(d2.response.result[0]);
                                    }));
                                }
                                else {
                                    resolve(d2.response.result[0]);
                                }
                            });
                        });
                        if (!glitter.share.editor_vm) {
                            if (glitter.getUrlParameter('function') === 'backend-manger') {
                                resolve(true);
                                return;
                            }
                            const data = yield ApiPageConfig.getPage({
                                appName: gBundle.appName,
                                type: 'template',
                            });
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
                                function createGenerator() {
                                    window.editerData = new gvc.glitter.htmlGenerate(viewModel.data.config, [Storage.lastSelect], undefined, true);
                                    window.page_config = viewModel.data.page_config;
                                }
                                createGenerator();
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
                        data.result = true;
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
                            console.log(`falseIn`, waitGetData.findIndex((dd) => {
                                return dd === a;
                            }));
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
            dialog.dataLoading({ visible: false });
            viewModel.loading = false;
            gvc.glitter.runJsInterFace("getFireBaseToken", {}, (response) => {
                if (response.token) {
                    ApiUser.registerFCM(viewModel.app_config_original.user, response.token, window.glitterBase);
                }
            }, {
                webFunction(data, callback) {
                    callback({});
                }
            });
            gvc.notifyDataChange(editorContainerID);
        });
    }
    lod().then(() => {
        const dialog = new ShareDialog(gvc.glitter);
        dialog.dataLoading({ visible: false });
        glitter.htmlGenerate.saveEvent = (refresh = true, callback) => {
            glitter.closeDiaLog();
            glitter.setCookie('jumpToNavScroll', $(`#jumpToNav`).scrollTop());
            dialog.dataLoading({ visible: true, text: '更新中..' });
            function saveEvent() {
                return __awaiter(this, void 0, void 0, function* () {
                    for (const b of Object.keys(glitter.share.editorViewModel.saveArray)) {
                        yield glitter.share.editorViewModel.saveArray[b]();
                    }
                    glitter.share.editorViewModel.saveArray = {};
                    const waitSave = [
                        () => __awaiter(this, void 0, void 0, function* () {
                            let haveID = [];
                            const config = JSON.parse(JSON.stringify(viewModel.data.config));
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
                            getID(config);
                            if (glitter.share.editor_vm) {
                                return new Promise((resolve, reject) => {
                                    resolve(true);
                                });
                            }
                            else {
                                return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                                    let result = true;
                                    if (glitter.getUrlParameter('page').startsWith('pages') || glitter.getUrlParameter('page').startsWith('hidden')) {
                                        Article.get({
                                            page: 0,
                                            limit: 1,
                                            tag: glitter.getUrlParameter('page').split('/')[1]
                                        }).then((data) => __awaiter(this, void 0, void 0, function* () {
                                            data.response.data[0].content.config = config;
                                            Article.put(data.response.data[0]).then((response) => {
                                                resolve(response && response.result);
                                            });
                                        }));
                                    }
                                    else {
                                        ApiPageConfig.setPage({
                                            id: viewModel.data.id,
                                            appName: gBundle.appName,
                                            tag: viewModel.data.tag,
                                            name: viewModel.data.name,
                                            config: config,
                                            group: viewModel.data.group,
                                            page_config: viewModel.data.page_config,
                                            page_type: viewModel.data.page_type,
                                            preview_image: viewModel.data.preview_image,
                                            favorite: viewModel.data.favorite,
                                        }).then((api) => {
                                            resolve(result && api.result);
                                        });
                                    }
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
                            dialog.dataLoading({ visible: false });
                            dialog.errorMessage({ text: '伺服器錯誤' });
                            return;
                        }
                    }
                    dialog.dataLoading({ visible: false });
                    dialog.successMessage({ text: '儲存成功' });
                    if (refresh) {
                        viewModel.originalConfig = JSON.parse(JSON.stringify(viewModel.appConfig));
                        window.preloadData = {};
                        window.glitterInitialHelper.share = {};
                        lod();
                    }
                    if (glitter.share.editor_vm) {
                        glitter.share.editor_vm.callback(viewModel.data);
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
                        return `<div class="vw-100 vh-100 d-flex align-items-center justify-content-center">
<div class="spinner-border"></div>
</div>`;
                    }
                    else {
                        let view = [];
                        if (EditorConfig.backend_page() !== 'backend-manger') {
                            view.push(AddComponent.leftNav(gvc));
                            view.push(SetGlobalValue.leftNav(gvc));
                            view.push(PageSettingView.leftNav(gvc));
                            view.push(AddPage.leftNav(gvc));
                            view.push(PageCodeSetting.leftNav(gvc));
                        }
                        view.push(BgCustomerMessage.leftNav(gvc));
                        view.push(NormalPageEditor.leftNav(gvc));
                        try {
                            const doc = new Editor(gvc, viewModel);
                            view.push(doc.create(html `
                                        <div class="d-flex overflow-hidden border-end guide-user-editor-1"
                                             style="height:100vh;background:white;">
                                            ${gvc.bindView(() => {
                                return {
                                    bind: 'left_sm_bar',
                                    view: () => {
                                        return `      ${[
                                            {
                                                src: `fa-duotone fa-window guide-user-editor-1-icon`,
                                                index: 'layout',
                                                hint: '頁面編輯',
                                            },
                                            {
                                                src: `fa-sharp fa-regular fa-globe guide-user-editor-11-icon`,
                                                index: 'color',
                                                hint: '全站樣式'
                                            },
                                            {
                                                src: `fa-regular fa-grid-2 design-guide-1-icon`,
                                                index: 'widget',
                                                hint: '設計元件'
                                            }
                                        ]
                                            .filter((dd) => {
                                            if (gvc.glitter.getUrlParameter('device') === 'mobile') {
                                                return dd.index !== 'widget';
                                            }
                                            else {
                                                return true;
                                            }
                                        })
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
                                                gvc.notifyDataChange(["MainEditorLeft", "left_sm_bar"]);
                                            })}"
                                                                    ></i>`;
                                        })
                                            .join('')}`;
                                    },
                                    divCreate: {
                                        style: `width:50px;gap:20px;padding-top: 15px;min-width:50px;`,
                                        class: `${Storage.select_function === 'user-editor' || Storage.select_function === 'page-editor' ? `` : `d-none`} h-120 border-end d-flex flex-column align-items-center`,
                                    },
                                    onCreate: () => {
                                        $('.tooltip').remove();
                                        $('[data-bs-toggle="tooltip"]').tooltip();
                                    }
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
                                                    style="overflow-y: auto;overflow-x:hidden;height:calc(100vh - ${(document.body.clientWidth < 800 || document.body.clientWidth > 1200) ? 56 : (parseInt(glitter.share.top_inset, 10) + 56)}px);"
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
                                                            console.log(glitter.root_path);
                                                        }
                                                    }
                                                    return Main_editor.left(gvc, viewModel, editorContainerID, gBundle);
                                                default:
                                                    return Page_editor.left(gvc, viewModel, editorContainerID, gBundle);
                                            }
                                        })();
                                        if (document.body.offsetWidth < 992) {
                                            glitter.setDrawer(`<div class="bg-white vh-120 overflow-auto">${view}</div>`, () => { });
                                            glitter.share.toggle_left_bar = () => {
                                                glitter.setDrawer(`<div class="bg-white vh-120 overflow-auto">${view}</div>`, () => {
                                                    glitter.openDrawer();
                                                });
                                            };
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
                divCreate: { class: `editorContainer` },
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
                    if (!viewModel.loading) {
                        switch (Storage.select_function) {
                            case 'backend-manger': {
                                let bgGuide = new BgGuide(gvc, 0);
                                let bgMobileGuide = new BgMobileGuide(gvc, 1);
                                console.log("appear -- ");
                                if (document.body.clientWidth > 1000) {
                                    ApiShop.getGuideable().then(r => {
                                        if (!r.response.value || !r.response.value.view) {
                                            ApiShop.setFEGuideable({});
                                            bgGuide.drawGuide();
                                        }
                                    });
                                }
                                else {
                                }
                                break;
                            }
                            case 'user-editor': {
                                break;
                            }
                        }
                    }
                },
            });
        },
        onCreate: () => {
        },
        onResume: () => {
            setTimeout(() => {
                gvc.notifyDataChange('MainEditorLeft');
            }, 100);
        }
    };
});
function initialEditor(gvc, viewModel) {
    var _a;
    const glitter = gvc.glitter;
    setTimeout(() => {
        if (EditorConfig.backend_page() === 'backend-manger' && (glitter.getUrlParameter('page') !== 'cms')) {
            setTimeout(() => {
                glitter.setUrlParameter('page', 'cms');
            }, 100);
        }
        glitter.setUrlParameter('function', EditorConfig.backend_page());
    }, 50);
    glitter.share.ai_message = AiMessage;
    glitter.share.ai_code_generator = (message, callback) => {
        const dialog = new ShareDialog(gvc.glitter);
        dialog.dataLoading({ visible: true });
        AiChat.generateHtml({
            app_name: window.appName,
            text: message
        }).then((res) => {
            if (res.result && res.response.data.usage === 0) {
                dialog.dataLoading({ visible: false });
                dialog.errorMessage({ text: `很抱歉你的AI代幣不足，請先前往加值` });
            }
            else if (res.result && (!res.response.data.obj.result)) {
                dialog.dataLoading({ visible: false });
                dialog.errorMessage({ text: `AI無法理解你的需求，請給出具體一點的描述` });
            }
            else if (!res.result) {
                dialog.dataLoading({ visible: false });
                dialog.errorMessage({ text: `發生錯誤` });
            }
            else {
                res.response.data.obj.html;
                AddComponent.addWidget(gvc, {
                    "id": "s7scs2s9s3s5s8sc",
                    "js": "./official_view_component/official.js",
                    "css": { "class": {}, "style": {} },
                    "data": {
                        "refer_app": "shop_template_black_style",
                        "tag": "custom-code",
                        "list": [],
                        "carryData": {},
                        "_style_refer_global": { "index": "0" },
                        "_style_refer": "custom",
                        "elem": "div",
                        "inner": "",
                        "attr": [],
                        "_padding": {},
                        "_margin": {},
                        "_border": {},
                        "_max_width": "1200",
                        "_gap": "",
                        "_background": "",
                        "_other": {},
                        "_radius": "",
                        "_reverse": "false",
                        "_hor_position": "center",
                        "_background_setting": { "type": "none" },
                        "refer_form_data": {
                            "code": res.response.data.obj.html,
                            "width": { "unit": "px", "value": "0px", "number": "0" },
                            "height": {
                                "unit": "px",
                                "value": "50px",
                                "number": "50"
                            },
                            "with_bg": "false",
                            "background": {
                                "id": "custom-background",
                                "title": "#030303",
                                "content": "#000000",
                                "sec-title": "#000000",
                                "background": "#ffffff",
                                "sec-background": "#FFFFFF",
                                "solid-button-bg": "#000000",
                                "border-button-bg": "#000000",
                                "solid-button-text": "#ffffff",
                                "border-button-text": "#000000"
                            }
                        }
                    },
                    "type": "component",
                    "class": "w-100",
                    "index": 0,
                    "label": "自定義HTML代碼",
                    "style": "",
                    "bundle": {},
                    "global": [],
                    "toggle": true,
                    "stylist": [],
                    "dataType": "static",
                    "style_from": "code",
                    "classDataType": "static",
                    "preloadEvenet": {},
                    "share": {},
                    "formData": {},
                    "refreshAllParameter": {},
                    "editor_bridge": {},
                    "refreshComponentParameter": {},
                    "list": [],
                    "version": "v2",
                    "storage": {},
                    "mobile": {
                        "id": "s7scs2s9s3s5s8sc",
                        "js": "./official_view_component/official.js",
                        "css": { "class": {}, "style": {} },
                        "data": { "refer_app": "shop_template_black_style" },
                        "type": "component",
                        "class": "w-100",
                        "index": 0,
                        "label": "自定義HTML代碼",
                        "style": "",
                        "global": [],
                        "toggle": true,
                        "stylist": [],
                        "dataType": "static",
                        "style_from": "code",
                        "classDataType": "static",
                        "preloadEvenet": {},
                        "refreshAllParameter": {},
                        "editor_bridge": {},
                        "refreshComponentParameter": {},
                        "list": [],
                        "version": "v2",
                        "mobile_editable": [],
                        "desktop_editable": [],
                        "container_fonts": 0,
                        "visible": true,
                        "refer": "custom"
                    },
                    "mobile_editable": [],
                    "desktop": {
                        "data": {
                            "refer_app": "shop_template_black_style",
                            "refer_form_data": {}
                        }, "refer": "custom"
                    },
                    "desktop_editable": [],
                    "container_fonts": 0,
                    "visible": true
                });
                dialog.successMessage({ text: `AI生成完畢，使用了『${res.response.data.usage}』點 AI Points.` });
            }
        });
    };
    glitter.share.switch_to_web_builder = (page, device) => {
        glitter.closeDrawer();
        glitter.changePage('jspage/main.js', page, true, {
            appName: window.parent.glitter.getUrlParameter('appName'),
        }, {
            backGroundColor: `transparent;`,
            carry_search: [
                {
                    key: 'device', value: device
                },
                {
                    key: 'function', value: 'user-editor'
                }
            ]
        });
    };
    glitter.share.subscription = (title) => __awaiter(this, void 0, void 0, function* () {
        const dialog = new ShareDialog(glitter);
        const vm = {
            total: 500,
            note: {},
            line_items: [],
            return_url: window.parent.location.href,
            user_info: {
                email: '',
                invoice_type: 'me',
                company: '',
                gui_number: ''
            },
            customer_info: {}
        };
        const dd = (yield ApiUser.getPublicConfig('ai-points-store', 'manager'));
        if (dd.response.value) {
            vm.user_info = dd.response.value;
        }
        const sku = (() => {
            switch (title) {
                case '輕便電商方案':
                    return 'light-year';
                case '標準電商方案':
                    return 'basic-year';
                case '通路電商方案':
                    return 'omo-year';
                case '行動電商方案':
                    return 'app-year';
                case '旗艦電商方案':
                    return 'flagship-year';
            }
            return ``;
        })();
        if (gvc.glitter.deviceType === gvc.glitter.deviceTypeEnum.Ios) {
            dialog.dataLoading({ visible: true });
            gvc.glitter.runJsInterFace("in_app_product", {
                total: `${sku.replace('-', '_')}_apple`,
                qty: (() => {
                    switch (title) {
                        case '輕便電商方案':
                            return 1;
                        case '標準電商方案':
                            return 2;
                        case '通路電商方案':
                            return 4;
                        case '行動電商方案':
                            return 4;
                        case '旗艦電商方案':
                            return 2;
                    }
                })()
            }, (res) => __awaiter(this, void 0, void 0, function* () {
                console.log(`res.receipt_data=>`, res.receipt_data);
                if (res.receipt_data) {
                    yield ApiShop.app_subscription(res.receipt_data, window.appName);
                    window.parent.location.reload();
                }
                else {
                    dialog.dataLoading({ visible: false });
                    dialog.errorMessage({ text: '儲值失敗' });
                }
            }));
            return;
        }
        const product = yield ApiShop.getProduct({
            limit: 1,
            page: 0,
            searchType: 'sku',
            search: sku,
            app_name: window.parent.glitterBase
        });
        vm.line_items = [{
                id: product.response.data[0].id,
                spec: product.response.data[0].content.variants.find((dd) => {
                    return dd.sku === sku;
                }).spec,
                count: 1
            }];
        BgWidget.settingDialog({
            gvc: gvc,
            title: title,
            innerHTML: (gvc) => {
                return `<div class="mt-n2">${[
                    BgWidget.editeInput({
                        gvc: gvc,
                        title: `發票寄送電子信箱`,
                        placeHolder: '請輸入發票寄送電子信箱',
                        callback: (text) => {
                            vm.user_info.email = text;
                        },
                        type: 'email',
                        default: vm.user_info.email
                    }),
                    `<div class="tx_normal fw-normal" >發票開立方式</div>`,
                    BgWidget.select({
                        gvc: gvc, callback: (text) => {
                            vm.user_info.invoice_type = text;
                            gvc.recreateView();
                        }, options: [
                            { key: 'me', value: '個人單位' },
                            { key: 'company', value: '公司行號' }
                        ], default: vm.user_info.invoice_type
                    }),
                    ...(() => {
                        if (vm.user_info.invoice_type === 'company') {
                            return [
                                BgWidget.editeInput({
                                    gvc: gvc, title: `發票抬頭`, placeHolder: '請輸入發票抬頭', callback: (text) => {
                                        vm.user_info.company = text;
                                    }, type: 'text', default: `${vm.user_info.company}`
                                }),
                                BgWidget.editeInput({
                                    gvc: gvc,
                                    title: `公司統一編號`,
                                    placeHolder: '請輸入統一編號',
                                    callback: (text) => {
                                        vm.user_info.gui_number = text;
                                    },
                                    type: 'number',
                                    default: `${vm.user_info.gui_number}`
                                })
                            ];
                        }
                        else {
                            return [];
                        }
                    })()
                ].join(`<div class="my-2"></div>`)}</div>`;
            },
            footer_html: (gvc) => {
                return [BgWidget.cancel(gvc.event(() => {
                        gvc.closeDialog();
                    })), BgWidget.save(gvc.event(() => __awaiter(this, void 0, void 0, function* () {
                        if (vm.user_info.invoice_type !== 'company') {
                            vm.user_info.company = '';
                            vm.user_info.gui_number = '';
                        }
                        if (vm.user_info.invoice_type === 'company' && !vm.user_info.company) {
                            dialog.errorMessage({ text: '請確實填寫發票抬頭' });
                            return;
                        }
                        else if (vm.user_info.invoice_type === 'company' && !vm.user_info.gui_number) {
                            dialog.errorMessage({ text: '請確實填寫統一編號' });
                            return;
                        }
                        else if (!vm.user_info.email) {
                            dialog.errorMessage({ text: '請確實填寫信箱' });
                            return;
                        }
                        else if (!BgWidget.isValidEmail(vm.user_info.email)) {
                            dialog.errorMessage({ text: '請輸入有效信箱' });
                            return;
                        }
                        else if (vm.user_info.invoice_type === 'company' && !BgWidget.isValidNumbers(vm.user_info.gui_number)) {
                            dialog.errorMessage({ text: '請輸入有效統一編號' });
                            return;
                        }
                        dialog.dataLoading({ visible: true });
                        yield ApiUser.setPublicConfig({
                            key: 'ai-points-store',
                            value: vm.user_info,
                            user_id: 'manager',
                        });
                        vm.note = {
                            invoice_data: vm.user_info
                        };
                        vm.customer_info = {
                            "payment_select": "ecPay"
                        };
                        vm.user_info.appName = window.parent.appName;
                        BaseApi.create({
                            url: window.parent.saasConfig.config.url + `/api-public/v1/ec/checkout`,
                            type: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'g-app': 'shopnex',
                                'Authorization': GlobalUser.saas_token,
                            },
                            data: JSON.stringify(vm),
                        }).then((res) => __awaiter(this, void 0, void 0, function* () {
                            dialog.dataLoading({ visible: false });
                            if (res.response.form) {
                                const id = gvc.glitter.getUUID();
                                if (gvc.glitter.deviceType === gvc.glitter.deviceTypeEnum.Ios) {
                                    gvc.glitter.runJsInterFace("toCheckout", {
                                        form: res.response.form
                                    }, () => {
                                        window.parent.location.reload();
                                    });
                                }
                                else {
                                    window.$('body').append(`<div id="${id}" style="display: none;">${res.response.form}</div>`);
                                    window.document.querySelector(`#${id} #submit`).click();
                                }
                                gvc.closeDialog();
                            }
                            else {
                                dialog.errorMessage({ text: '發生錯誤' });
                            }
                        }));
                    })))].join('');
            }
        });
    });
    if (gvc.glitter.getUrlParameter('device') === 'mobile') {
        gvc.glitter.setCookie('ViewType', 'mobile');
        GlobalWidget.glitter_view_type = 'mobile';
    }
    glitter.share.SearchIdea = SearchIdea;
    glitter.share.editorViewModel = viewModel;
    localStorage.setItem('editor_mode', localStorage.getItem('editor_mode') || 'user');
    const swal = new Swal(gvc);
    glitter.share.swal = swal;
    glitter.share.pastEvent = () => {
        if (!glitter.share.copycomponent) {
            swal.nextStep(`請先複製元件`, () => {
            }, 'error');
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
            container_cf: undefined,
            index: 0,
        };
        function loop(array, container_cf) {
            array.map((dd, index) => {
                if (dd.id === id) {
                    find.widget = dd;
                    find.container = array;
                    find.container_cf = container_cf;
                    find.index = index;
                }
                else if (dd.type === 'container') {
                    loop(dd.data.setting, dd);
                }
            });
        }
        loop(glitter.share.editorViewModel.data.config, undefined);
        return find;
    };
    glitter.share.findWidget = (where) => {
        let find = {
            widget: undefined,
            container: undefined,
            index: 0,
        };
        function loop(array) {
            array.map((dd, index) => {
                if (where(dd)) {
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
        glitter.share.loading_dialog.dataLoading({ text: '模組添加中...', visible: true });
        if (gvc.glitter.getUrlParameter('toggle-message') === 'true') {
            gvc.glitter.setUrlParameter('toggle-message', undefined);
            BgCustomerMessage.toggle(true, gvc);
        }
        if (!viewModel.selectContainer) {
            viewModel.selectContainer = glitter.share.editorViewModel.data.config;
        }
        if (!viewModel.selectContainer.container_config) {
            viewModel.selectContainer.container_config = glitter.share.main_view_config;
        }
        glitter.share.left_block_hover = true;
        AddComponent.toggle(false);
        resetId(data);
        const url = new URL(location.href);
        url.search = '';
        data.js = data.js.replace(url.href, './');
        viewModel.selectContainer.push(data);
        Storage.lastSelect = data.id;
        glitter.htmlGenerate.hover_items = [Storage.lastSelect];
        data.data._style_refer_global = {
            index: `0`
        };
        if (viewModel.selectContainer.length === 1) {
            viewModel.selectContainer.container_config.getElement().recreateView();
        }
        else {
            $(viewModel.selectContainer.container_config.getElement()).append(glitter.htmlGenerate.renderWidgetSingle({
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
            Storage.lastSelect = data.id;
            glitter.htmlGenerate.selectWidget({
                widget: data,
                widgetComponentID: data.id,
                gvc: viewModel.selectContainer.container_config.gvc,
                scroll_to_hover: true,
                glitter: glitter,
            });
            setTimeout(() => {
                glitter.share.left_block_hover = false;
                glitter.share.loading_dialog.dataLoading({ visible: false });
            }, 1000);
        }, 100);
        AddComponent.toggle(false);
        viewModel.selectContainer && viewModel.selectContainer.rerenderReplaceElem && viewModel.selectContainer.rerenderReplaceElem();
    };
    glitter.share.addWithIndex = (cf) => {
        glitter.share.loading_dialog.dataLoading({ text: '模組添加中...', visible: true });
        glitter.share.left_block_hover = true;
        AddComponent.toggle(false);
        resetId(cf.data);
        const arrayData = glitter.share.findWidgetIndex(cf.index);
        if (!arrayData.container.container_config) {
            arrayData.container.container_config = glitter.share.main_view_config;
        }
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
        glitter.htmlGenerate.hover_items = [Storage.lastSelect];
        const $ = document.querySelector('#editerCenter iframe').contentWindow.$;
        $(glitter.htmlGenerate.renderWidgetSingle({
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
            console.log(`cf.data.id==>`, cf.data.id);
            Storage.lastSelect = cf.data.id;
            function pasteEvent() {
                glitter.htmlGenerate.selectWidget({
                    widget: cf.data,
                    widgetComponentID: cf.data.id,
                    gvc: arrayData.container.container_config.gvc,
                    scroll_to_hover: true,
                    glitter: glitter,
                });
            }
            pasteEvent();
            setTimeout(() => {
                glitter.share.left_block_hover = false;
                glitter.share.loading_dialog.dataLoading({ visible: false });
                pasteEvent();
            }, 1000);
        }, 100);
        AddComponent.toggle(false);
        viewModel.selectContainer && viewModel.selectContainer.rerenderReplaceElem && viewModel.selectContainer.rerenderReplaceElem();
    };
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
