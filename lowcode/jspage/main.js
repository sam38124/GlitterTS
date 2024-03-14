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
import { Main_editor } from "./function-page/main_editor.js";
import { Page_editor } from "./function-page/page_editor.js";
import { Setting_editor } from "./function-page/setting_editor.js";
import * as triggerBridge from "../editor-bridge/trigger-event.js";
import { TriggerEvent } from "../glitterBundle/plugins/trigger-event.js";
import { StoreHelper } from "../helper/store-helper.js";
import { Storage } from "../helper/storage.js";
import { ServerEditor } from "./function-page/server-editor/server-editor.js";
import { AddComponent } from "../editor/add-component.js";
import { PageSettingView } from "../editor/page-setting-view.js";
import { AddPage } from "../editor/add-page.js";
import { SetGlobalValue } from "../editor/set-global-value.js";
const html = String.raw;
const editorContainerID = `HtmlEditorContainer`;
init(import.meta.url, (gvc, glitter, gBundle) => {
    gvc.addStyle(`.tooltip{
    z-index:99999 !important;
    }
     .scroll-in {
    
      left: -100%; /* 將元素移到畫面外 */
      animation: slideInFromLeft 0.5s ease-out forwards;
    }

  .scroll-out {
      left: 0%; /* 將元素移到畫面外 */
      animation: slideOutFromLeft 1s ease-out forwards;
    }
    /* @keyframes 定義動畫 */
    @keyframes slideInFromLeft {
      0% {
        left: -100%; /* 起始位置在畫面外 */
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
        left: -100%; /* 結束位置在畫面內 */
      }
    }
    `);
    const swal = new Swal(gvc);
    const viewModel = {
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
        originalDomain: ''
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
            swal.loading('加載中...');
            const waitGetData = [
                (() => __awaiter(this, void 0, void 0, function* () {
                    return yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        const clock = gvc.glitter.ut.clock();
                        ApiPageConfig.getAppConfig().then((res) => {
                            console.log(res);
                            viewModel.domain = res.response.result[0].domain;
                            viewModel.originalDomain = viewModel.domain;
                            resolve(true);
                        });
                    }));
                })),
                (() => __awaiter(this, void 0, void 0, function* () {
                    return yield new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                        const clock = gvc.glitter.ut.clock();
                        const data = yield ApiPageConfig.getPage({
                            appName: gBundle.appName,
                            type: 'template'
                        });
                        viewModel.data = (yield ApiPageConfig.getPage({
                            appName: gBundle.appName,
                            tag: glitter.getUrlParameter('page')
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
                    }));
                })),
                (() => __awaiter(this, void 0, void 0, function* () {
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
                            viewModel.initialCode = (_d = data.response.data.initialCode) !== null && _d !== void 0 ? _d : "";
                            viewModel.homePage = (_e = data.response.data.homePage) !== null && _e !== void 0 ? _e : "";
                            viewModel.backendPlugins = (_f = data.response.data.backendPlugins) !== null && _f !== void 0 ? _f : [];
                            viewModel.globalValue = (_g = data.response.data.globalValue) !== null && _g !== void 0 ? _g : [];
                            resolve(true);
                            function load() {
                                return __awaiter(this, void 0, void 0, function* () {
                                    glitter.share.globalJsList = [{
                                            src: {
                                                official: "./official_event/event.js"
                                            }
                                        }].concat(viewModel.initialJS);
                                    for (const a of glitter.share.globalJsList) {
                                        yield new Promise((resolve) => {
                                            glitter.addMtScript([{
                                                    src: TriggerEvent.getLink(a.src.official),
                                                    type: 'module'
                                                }], () => {
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
                }))
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
            glitter.setCookie("jumpToNavScroll", $(`#jumpToNav`).scrollTop());
            swal.loading('更新中...');
            function saveEvent() {
                return __awaiter(this, void 0, void 0, function* () {
                    const waitSave = [
                        (() => __awaiter(this, void 0, void 0, function* () {
                            let haveID = [];
                            function getID(set) {
                                set.map((dd) => {
                                    var _a;
                                    dd.js = (dd.js).replace(`${location.origin}/${window.appName}/`, './');
                                    dd.formData = undefined;
                                    dd.pageConfig = undefined;
                                    dd.subData = undefined;
                                    dd.appConfig = undefined;
                                    dd.editorEvent = undefined;
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
                        })),
                        (() => __awaiter(this, void 0, void 0, function* () {
                            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                                viewModel.appConfig.homePage = viewModel.homePage;
                                viewModel.appConfig.globalStyle = viewModel.globalStyle;
                                viewModel.appConfig.globalScript = viewModel.globalScript;
                                viewModel.appConfig.globalValue = viewModel.globalValue;
                                viewModel.appConfig.globalStyleTag = viewModel.globalStyleTag;
                                resolve(yield StoreHelper.setPlugin(viewModel.originalConfig, viewModel.appConfig));
                            }));
                        }))
                    ];
                    for (const a of waitSave) {
                        if (!(yield a())) {
                            swal.nextStep(`伺服器錯誤`, () => {
                            }, 'error');
                            return;
                        }
                    }
                    swal.close();
                    viewModel.originalConfig = JSON.parse(JSON.stringify(viewModel.appConfig));
                    if (refresh) {
                        lod();
                    }
                });
            }
            saveEvent().then(r => {
                callback && callback();
            });
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
                        try {
                            const doc = new Editor(gvc, viewModel);
                            return doc.create(html `
                                        <div class="d-flex overflow-hidden" style="height:100vh;background:white;">
                                            <div style="width:60px;gap:20px;padding-top: 15px;"
                                                 class="h-100 border-end d-flex flex-column align-items-center">
                                                ${[
                                {
                                    src: `fa-table-layout`,
                                    index: 'page-editor',
                                    hint: '頁面編輯'
                                },
                                {
                                    src: `fa-solid fa-list-check`,
                                    index: 'backend-manger',
                                    hint: '後台系統'
                                },
                                {
                                    src: `fa-duotone fa-server`,
                                    index: 'server-manager',
                                    hint: '伺服器設定'
                                },
                            ].map((da) => {
                                return html `<i
                                                            class="fa-regular ${da.src} fs-5 fw-bold ${(Storage.select_function === `${da.index}`) ? `text-primary` : ``}  p-2 rounded"
                                                            data-bs-toggle="tooltip"
                                                            data-bs-placement="top"
                                                            data-bs-custom-class="custom-tooltip"
                                                            data-bs-title="${da.hint}"
                                                            style="cursor:pointer;${(Storage.select_function === `${da.index}`) ? `background-color: rgba(10,83,190,0.1);` : ``}"
                                                            onclick="${gvc.event(() => {
                                    viewModel.waitCopy = undefined;
                                    viewModel.selectItem = undefined;
                                    Storage.select_function = da.index;
                                    gvc.notifyDataChange(editorContainerID);
                                })}"></i>`;
                            }).join('')}
                                            </div>
                                            <div class="offcanvas-body swiper scrollbar-hover  w-100 ${(() => {
                                switch (Storage.select_function) {
                                    case 'backend-manger':
                                    case 'server-manager':
                                        return `pt-0`;
                                    case 'page-editor':
                                        return `p-0`;
                                    default:
                                        return `p-0`;
                                }
                            })()}" style="overflow-y: auto;overflow-x:hidden;height:calc(100vh - 56px);">
                                                ${AddComponent.leftNav(gvc)}
                                                ${PageSettingView.leftNav(gvc)}
                                                ${AddPage.leftNav(gvc)}
                                                ${SetGlobalValue.leftNav(gvc)}
                                                <div class="h-100" style="">
                                                    ${gvc.bindView(() => {
                                return {
                                    bind: 'MainEditorLeft',
                                    view: () => {
                                        switch (Storage.select_function) {
                                            case 'backend-manger':
                                                return Setting_editor.left(gvc, viewModel, editorContainerID, gBundle);
                                            case 'server-manager':
                                                return ServerEditor.left(gvc);
                                            case 'page-editor':
                                                return Main_editor.left(gvc, viewModel, editorContainerID, gBundle);
                                            default:
                                                return Page_editor.left(gvc, viewModel, editorContainerID, gBundle);
                                        }
                                    },
                                    divCreate: {
                                        class: "h-100"
                                    }
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
                                divCreate: {}
                            }));
                        }
                        catch (e) {
                            console.log(e);
                            return ``;
                        }
                    }
                },
                divCreate: {},
                onCreate: () => {
                    $("#jumpToNav").scroll(function () {
                        glitter.setCookie("jumpToNavScroll", $(`#jumpToNav`).scrollTop());
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
                                behavior: 'auto'
                            });
                        }
                    }
                    setTimeout(() => {
                        scrollToItem(document.querySelector(`.editor_item.active`));
                    }, 200);
                }
            });
        },
        onCreate: () => {
        },
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
            swal.nextStep(`請先複製元件`, () => {
            }, 'error');
            return;
        }
        var copy = JSON.parse(glitter.share.copycomponent);
        function checkId(dd) {
            dd.id = glitter.getUUID();
            if (dd.type === 'container') {
                dd.data.setting.map((d2) => {
                    checkId(d2);
                });
            }
        }
        checkId(copy);
        glitter.setCookie('lastSelect', copy.id);
        viewModel.selectContainer.splice(0, 0, copy);
        viewModel.selectItem = undefined;
        gvc.notifyDataChange(editorContainerID);
    };
    glitter.share.clearSelectItem = () => {
        viewModel.selectItem = undefined;
    };
    glitter.share.inspect = (_a = glitter.share.inspect) !== null && _a !== void 0 ? _a : true;
    triggerBridge.initial();
    glitter.share.refreshAllContainer = () => {
        gvc.notifyDataChange(editorContainerID);
    };
    glitter.share.addComponent = (data) => {
        const url = new URL(location.href);
        url.search = '';
        data.js = data.js.replace(url.href, './');
        viewModel.selectContainer.push(data);
        glitter.setCookie('lastSelect', data.id);
        gvc.notifyDataChange(editorContainerID);
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
        if ((event.ctrlKey) && keyCode === 71) {
            SetGlobalValue.toggle(true);
        }
    });
}
