import {GVC, init} from '../glitterBundle/GVController.js';
import {Editor} from './editor.js';
import {ApiPageConfig} from '../api/pageConfig.js';
import {Swal} from '../modules/sweetAlert.js';
import {Main_editor} from './function-page/main_editor.js';
import {Page_editor} from './function-page/page_editor.js';
import {Setting_editor} from './function-page/setting_editor.js';
import * as triggerBridge from '../editor-bridge/trigger-event.js';
import {TriggerEvent} from '../glitterBundle/plugins/trigger-event.js';
import {StoreHelper} from '../helper/store-helper.js';
import {Storage} from '../glitterBundle/helper/storage.js';
import {ServerEditor} from './function-page/server-editor/server-editor.js';
import {AddComponent} from '../editor/add-component.js';
import {PageSettingView} from '../editor/page-setting-view.js';
import {AddPage} from '../editor/add-page.js';
import {SetGlobalValue} from '../editor/set-global-value.js';
import {PageCodeSetting} from '../editor/page-code-setting.js';
import {NormalPageEditor} from '../editor/normal-page-editor.js';
import {EditorConfig} from '../editor-config.js';
import {BgCustomerMessage} from '../backend-manager/bg-customer-message.js';
import {BgGuide} from "../backend-manager/bg-guide.js";
import {ApiShop} from "../glitter-base/route/shopping.js";
import {ShareDialog} from "../glitterBundle/dialog/ShareDialog.js";
import {SearchIdea} from "../editor/search-idea.js";
import {AiMessage} from "../cms-plugin/ai-message.js";
import {GlobalWidget} from "../glitterBundle/html-component/global-widget.js";
import {BgWidget} from "../backend-manager/bg-widget.js";
import {ApiUser} from "../glitter-base/route/user.js";
import {BaseApi} from "../glitterBundle/api/base.js";
import {GlobalUser} from "../glitter-base/global/global-user.js";
import {Article} from "../glitter-base/route/article.js";
import {AiChat} from "../glitter-base/route/ai-chat.js";
import {BgMobileGuide} from "../backend-manager/bg-mobile-guide.js";
import {SaasViewModel} from "../view-model/saas-view-model.js";

const html = String.raw;
//
const editorContainerID = `HtmlEditorContainer`;
init(import.meta.url, (gvc, glitter, gBundle) => {
    glitter.share.loading_dialog = (new ShareDialog(gvc.glitter))
    const css = String.raw;
    gvc.addStyle(css`

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
    gvc.addStyle(css`
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
    glitter.share.is_blog_editor=()=>{
        return glitter.getUrlParameter('page').startsWith('pages/') || glitter.getUrlParameter('page').startsWith('hidden/') || glitter.getUrlParameter('page').startsWith('shop/')
    }
    Storage.lastSelect = ''
    const viewModel: {
        dataList: any;
        data: any;
        loading: boolean;
        selectItem: any;
        initialJS: { name: string; src: { official: string; open: boolean }; route: string }[];
        pluginList: { name: string; src: { staging: string; official: string; open: boolean }; route: string }[];
        initialStyle: { name: string; src: { src: string }; route: string }[];
        initialStyleSheet: { name: string; src: { src: string }; route: string }[];
        globalValue: any;
        initialCode: any;
        initialList: any;
        homePage: string;
        selectContainer: any;
        backendPlugins: any;
        selectIndex: any;
        waitCopy: any;
        appConfig: any;
        originalConfig: any;
        globalScript: any;
        globalStyle: any;
        globalStyleTag: any;
        appName: string;
        originalData: any;
        domain: string;
        originalDomain: string;
        saveArray: any;
        app_config_original: any;
    } = {
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
    (window.parent as any).glitter.share.refreshMainLeftEditor = () => {
        gvc.notifyDataChange('MainEditorLeft');
    };
    (window.parent as any).glitter.share.refreshMainRightEditor = () => {
        gvc.notifyDataChange('MainEditorRight');
    };
    const dialog = new ShareDialog(glitter)

    //載入頁面資料
    async function lod() {
        if (EditorConfig.backend_page() !== 'backend-manger') {
            glitter.share.loading_dialog.dataLoading({text: '模組加載中...', visible: true})
        } else {
            dialog.dataLoading({visible: true})
        }

        if (parseInt(glitter.share.top_inset, 10)) {
            gvc.addStyle(css`
                .scroll-in {
                    padding-top: ${glitter.share.top_inset}px;
                }

                .scroll-right-in {
                    padding-top: ${glitter.share.top_inset}px;
                }
            `)
        }



        const waitGetData = [
            async () => {
            if((EditorConfig.backend_page() === 'backend-manger') && !(gvc.glitter.getUrlParameter('tab'))){
                gvc.glitter.setUrlParameter('tab','home_page')
            }
                return await new Promise(async (resolve, reject) => {
                    ApiPageConfig.getAppConfig().then((res) => {
                        viewModel.app_config_original = res.response.result[0];
                        if (EditorConfig.backend_page() === 'backend-manger' && ((viewModel.app_config_original.refer_app) && (viewModel.app_config_original.refer_app !== viewModel.app_config_original.appName))) {
                            glitter.setUrlParameter('appName', viewModel.app_config_original.refer_app)
                            location.reload()
                            return
                        }
                        viewModel.domain = res.response.result[0].domain;
                        viewModel.originalDomain = viewModel.domain;
                        resolve(true);
                    });
                });
            },
            async () => {
                return await new Promise(async (resolve) => {
                    viewModel.data = await new Promise((resolve, reject) => {
                        ApiPageConfig.getPage({
                            tag: glitter.getUrlParameter('page'),
                            appName: gBundle.appName
                        }).then((d2)=>{
                            if (glitter.share.is_blog_editor()) {
                                Article.get({
                                    page: 0,
                                    limit: 1,
                                    id: glitter.getUrlParameter('page-id')
                                }).then(async (data) => {
                                    const content=data.response.data[0].content
                                    if(content.language_data && content.language_data[glitter.getUrlParameter('language')] && content.language_data[glitter.getUrlParameter('language')].config){
                                        content.config=content.language_data[glitter.getUrlParameter('language')].config
                                    }
                                    d2.response.result[0].config = content.config
                                    resolve(d2.response.result[0])
                                })
                            } else {
                                resolve(d2.response.result[0])
                            }
                        })
                    });

                    if (!glitter.share.editor_vm) {
                        if (glitter.getUrlParameter('function') === 'backend-manger') {
                            resolve(true)
                            return
                        }
                        const data = await ApiPageConfig.getPage({
                            appName: gBundle.appName,
                            type: 'template',
                        });
                        Storage.select_page_type = viewModel.data.page_type;
                        if (data.result) {
                            data.response.result.map((dd: any) => {
                                dd.page_config = dd.page_config ?? {};
                                return dd;
                            });
                            viewModel.dataList = data.response.result;
                            viewModel.originalData = JSON.parse(JSON.stringify(viewModel.dataList));
                            glitter.share.allPageResource = JSON.parse(JSON.stringify(data.response.result));

                            //設定子層編輯器
                            function createGenerator() {
                                (window as any).editerData = new gvc.glitter.htmlGenerate((viewModel.data! as any).config, [Storage.lastSelect], undefined, true);
                                (window as any).page_config = (viewModel.data! as any).page_config;
                            }

                            createGenerator()
                            if (!data) {
                                resolve(false);
                            } else {
                                resolve(true);
                            }
                        }
                    } else {
                        viewModel.dataList = [];
                        viewModel.data = glitter.share.editor_vm.page_data;
                        const htmlGenerate = new gvc.glitter.htmlGenerate(viewModel.data.config, [Storage.lastSelect], undefined, true);
                        (window as any).editerData = htmlGenerate;
                        (window as any).page_config = (viewModel.data! as any).page_config;
                        resolve(true);
                    }
                });
            },
            async () => {
                return await new Promise(async (resolve) => {
                    const data = glitter.share.appConfigresponse;
                    data.result = true
                    if (data.result) {
                        viewModel.appConfig = data.response.data;
                        viewModel.originalConfig = JSON.parse(JSON.stringify(viewModel.appConfig));


                        viewModel.globalScript = data.response.data.globalScript ?? [];
                        viewModel.globalStyle = data.response.data.globalStyle ?? [];
                        viewModel.globalStyleTag = data.response.data.globalStyleTag ?? [];
                        viewModel.initialList = data.response.data.initialList;
                        viewModel.initialJS = data.response.data.eventPlugin;
                        viewModel.pluginList = data.response.data.pagePlugin;
                        viewModel.initialStyleSheet = data.response.data.initialStyleSheet;
                        viewModel.initialStyle = data.response.data.initialStyle;
                        viewModel.initialCode = data.response.data.initialCode ?? '';
                        viewModel.homePage = data.response.data.homePage ?? '';
                        viewModel.backendPlugins = data.response.data.backendPlugins ?? [];
                        viewModel.globalValue = data.response.data.globalValue ?? [];
                        resolve(true);

                        async function load() {
                            glitter.share.globalJsList = [
                                {
                                    src: {
                                        official: './official_event/event.js',
                                    },
                                },
                            ].concat(viewModel.initialJS);
                            for (const a of glitter.share.globalJsList) {
                                await new Promise((resolve) => {
                                    glitter.addMtScript(
                                        [
                                            {
                                                src: TriggerEvent.getLink(a.src.official),
                                                type: 'module',
                                            },
                                        ],
                                        () => {
                                            resolve(true);
                                        },
                                        () => {
                                            resolve(true);
                                        }
                                    );
                                });
                            }
                            resolve(true);
                        }

                        load();
                    } else {
                        resolve(false);
                    }
                }).then((data) => {
                    return data;
                });
            },
        ];
        let count = 0;
        let result = await new Promise((resolve, reject) => {
            for (const a of waitGetData) {

                a().then((result) => {
                    if (result) {
                        count++;
                    } else {
                        resolve(false);
                        console.log(`falseIn`, waitGetData.findIndex((dd) => {
                            return dd === a
                        }))
                    }
                    if (count === waitGetData.length) {

                        resolve(true);
                    }
                });
            }
        });
        if (!result) {
            await lod();
            return;
        }
        dialog.dataLoading({visible: false})
        viewModel.loading = false;
        //推播訂閱
        gvc.glitter.runJsInterFace("getFireBaseToken", {}, (response) => {
            if (response.token) {
                ApiUser.registerFCM(viewModel.app_config_original.user, response.token, (window as any).glitterBase)
            }
        }, {
            webFunction(data: any, callback: (data: any) => void): any {
                callback({})
            }
        })
        gvc.notifyDataChange(editorContainerID);
    }

    lod().then(() => {
        const dialog = new ShareDialog(gvc.glitter)
        dialog.dataLoading({visible: false})
        //設定儲存事件
        glitter.htmlGenerate.saveEvent = (refresh: boolean = true, callback?: () => void) => {
            glitter.closeDiaLog();
            glitter.setCookie('jumpToNavScroll', $(`#jumpToNav`).scrollTop());

            dialog.dataLoading({visible: true, text: '更新中..'})

            async function saveEvent() {
                for (const b of Object.keys(glitter.share.editorViewModel.saveArray)) {
                    await (glitter.share.editorViewModel.saveArray[b] as any)();
                }
                glitter.share.editorViewModel.saveArray = {};
                const waitSave = [
                    async () => {
                        let haveID: string[] = [];
                        const config = JSON.parse(JSON.stringify((viewModel.data as any).config))

                        function getID(set: any) {
                            set.map((dd: any) => {
                                dd.js = dd.js.replace(`${location.origin}/${(window as any).appName}/`, './');
                                dd.formData = undefined;
                                dd.pageConfig = undefined;
                                dd.subData = undefined;
                                dd.appConfig = undefined;
                                dd.storage = undefined;
                                dd.tag = undefined;
                                dd.bundle = undefined;
                                // dd.editorEvent = undefined;
                                dd.share = undefined;
                                if (haveID.indexOf(dd.id) !== -1) {
                                    dd.id = glitter.getUUID();
                                }
                                haveID.push(dd.id);
                                if (dd.type === 'container') {
                                    dd.data.setting = dd.data.setting ?? [];
                                    getID(dd.data.setting);
                                }
                            });
                        }

                        getID(config);
                        if (glitter.share.editor_vm) {
                            return new Promise((resolve, reject) => {
                                resolve(true);
                            });
                        } else {
                            return new Promise(async (resolve) => {
                                let result = true;
                                if (glitter.share.is_blog_editor()) {
                                    Article.get({
                                        page: 0,
                                        limit: 1,
                                        id: glitter.getUrlParameter('page-id')
                                    }).then(async (data) => {
                                        const content=data.response.data[0].content
                                        function empty(){
                                            return {
                                                name: '',
                                                seo: {
                                                    domain: '',
                                                    title: '',
                                                    content: '',
                                                    keywords: '',
                                                },
                                                text:'',
                                                config:''
                                            }
                                        }
                                        content.language_data=content.language_data ?? {
                                            'en-US': empty(),
                                            'zh-CN': empty(),
                                            'zh-TW': {
                                                name: content.name,
                                                seo:content.seo,
                                                text:content.text,
                                                config:content.config
                                            }
                                        }
                                        content.language_data[glitter.getUrlParameter('language')].config=config;
                                        Article.put(data.response.data[0]).then((response) => {
                                            resolve(response && response.result);
                                        })
                                    })
                                } else {
                                    ApiPageConfig.setPage({
                                        id: (viewModel.data! as any).id,
                                        appName: gBundle.appName,
                                        tag: (viewModel.data! as any).tag,
                                        name: (viewModel.data! as any).name,
                                        config: config,
                                        group: (viewModel.data! as any).group,
                                        page_config: (viewModel.data! as any).page_config,
                                        page_type: (viewModel.data! as any).page_type,
                                        preview_image: (viewModel.data! as any).preview_image,
                                        favorite: (viewModel.data! as any).favorite,
                                    }).then((api) => {
                                        resolve(result && api.result);
                                    });
                                }
                            });
                        }
                    },
                    async () => {
                        return new Promise(async (resolve) => {
                            viewModel.appConfig.homePage = viewModel.homePage;
                            viewModel.appConfig.globalStyle = viewModel.globalStyle;
                            viewModel.appConfig.globalScript = viewModel.globalScript;
                            viewModel.appConfig.globalValue = viewModel.globalValue;
                            viewModel.appConfig.globalStyleTag = viewModel.globalStyleTag;
                            resolve(await StoreHelper.setPlugin(viewModel.originalConfig, viewModel.appConfig));
                        });
                    },
                ];
                for (const a of waitSave) {
                    if (!(await a())) {
                        dialog.dataLoading({visible: false})
                        dialog.errorMessage({text: '伺服器錯誤'})
                        return;
                    }
                }
                dialog.dataLoading({visible: false})
                dialog.successMessage({text: '儲存成功'})
                if (refresh) {
                    viewModel.originalConfig = JSON.parse(JSON.stringify(viewModel.appConfig));
                    (window as any).preloadData = {};
                    (window as any).glitterInitialHelper.share = {};
                    lod();
                }
                if (glitter.share.editor_vm) {
                    glitter.share.editor_vm.callback(viewModel.data);
                } else if (refresh) {
                    (window as any).preloadData = {};
                    (window as any).glitterInitialHelper.share = {};
                    lod();
                }
            }

            saveEvent().then((r) => {
                callback && callback();
            });
        };
        glitter.share.selectEditorItem = () => {
            localStorage.setItem('rightSelect', 'module');
            glitter.share.selectEditorItemTimer && clearInterval(glitter.share.selectEditorItemTimer);
            glitter.share.selectEditorItemTimer = setTimeout(() => {
                // gvc.notifyDataChange(['MainEditorLeft', 'right_NAV']);
                gvc.notifyDataChange(['MainEditorLeft', 'right_NAV']);
            }, 10);
            // gvc.notifyDataChange('htmlGenerate')
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
                    } else {
                        let view: any = [];
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
                            view.push(
                                doc.create(
                                    html`
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
                                                                        return dd.index !== 'widget'
                                                                    } else {
                                                                        return true
                                                                    }
                                                                })
                                                                .map((da: any) => {
                                                                    return html`<i
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
                                                        class: `${
                                                                Storage.select_function === 'user-editor' || Storage.select_function === 'page-editor' ? `` : `d-none`
                                                        } h-120 border-end d-flex flex-column align-items-center`,
                                                    },
                                                    onCreate: () => {
                                                        $('.tooltip').remove();
                                                        ($('[data-bs-toggle="tooltip"]') as any).tooltip();
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
                                                    style="overflow-y: auto;overflow-x:hidden;height:calc(100vh - ${(document.body.clientWidth<800 || document.body.clientWidth>1200) ? 56:(parseInt(glitter.share.top_inset, 10)+56)}px);"
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
                                                                            //內容編輯模式不允許特定頁面，自動重導向。
                                                                            if (Storage.select_function === 'user-editor') {
                                                                                if (!viewModel.data.page_config || viewModel.data.page_config.support_editor !== 'true') {
                                                                                    console.log(glitter.root_path)
                                                                                    // const redirect = viewModel.dataList.find((dd: any) => {
                                                                                    //     return dd.page_config && dd.page_config.support_editor === 'true';
                                                                                    // });
                                                                                    // if (redirect) {
                                                                                    //     const url = new URL(glitter.root_path + `${redirect.tag}${location.search}`);
                                                                                    //     location.href = url.href;
                                                                                    // }
                                                                                }
                                                                            }
                                                                            return Main_editor.left(gvc, viewModel, editorContainerID, gBundle);
                                                                        default:
                                                                            return Page_editor.left(gvc, viewModel, editorContainerID, gBundle);
                                                                    }
                                                                })();
                                                                if (document.body.offsetWidth < 992) {
                                                                    glitter.setDrawer(`<div class="bg-white vh-120 overflow-auto">${view}</div>`, () => {});
                                                                    glitter.share.toggle_left_bar=()=>{
                                                                        glitter.setDrawer(`<div class="bg-white vh-120 overflow-auto">${view}</div>`, () => {
                                                                            glitter.openDrawer()
                                                                        });
                                                                    }
                                                                    return ``;
                                                                } else {
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
                                        </div>`,
                                    gvc.bindView({
                                        bind: 'MainEditorRight',
                                        view: () => {
                                            return ``;
                                        },
                                        divCreate: {},
                                    }),
                                )
                            );
                            return view.join('');
                        } catch (e) {
                            console.error(e);
                            return ``;
                        }
                    }
                },
                divCreate: {class: `editorContainer`},
                onCreate: () => {
                    $('#jumpToNav').scroll(function () {
                        glitter.setCookie('jumpToNavScroll', $(`#jumpToNav`).scrollTop());
                    });

                    function scrollToItem(element: any) {
                        if (element) {
                            // 获取元素的位置信息
                            let elementRect = element.getBoundingClientRect();
                            let elementTop = elementRect.top;
                            let elementHeight = elementRect.height;
                            // 获取窗口的高度
                            let windowHeight = document.querySelector('.scrollbar-hover')!.scrollHeight;
                            // 计算滚动位置，以使元素的中心位于窗口的垂直中心
                            let scrollTo = elementTop - (windowHeight - elementHeight) / 2;
                            // 滚动页面
                            document.querySelector('.scrollbar-hover')!.scrollTo({
                                top: scrollTo,
                                left: 0,
                                behavior: 'auto', // 使用平滑滚动效果，如果需要的话
                            });
                        }
                    }

                    setTimeout(() => {
                        scrollToItem(document.querySelector(`.editor_item.active`)!);
                    }, 200);
                    if (!viewModel.loading) {
                        switch (Storage.select_function) {
                            case 'backend-manger': {
                                let bgGuide = new BgGuide(gvc, 0);
                                function showTut(){
                                    if (document.body.clientWidth > 1000) {
                                        // ApiShop.getGuideable().then(r => {
                                        //     if (!r.response.value || !r.response.value.view) {
                                        //         ApiShop.setFEGuideable({})
                                        //         bgGuide.drawGuide();
                                        //     }
                                        // })
                                    }else {
                                        // if(!localStorage.getItem('see_bg_mobile_guide')){
                                        //     let bgMobileGuide = new BgMobileGuide(gvc,1);
                                        //     bgMobileGuide.drawGuide();
                                        //     localStorage.setItem('see_bg_mobile_guide','true')
                                        // }
                                    }
                                }
                                //如未填寫聯絡資訊則固定跳彈窗出來
                                (ApiUser.getSaasUserData(GlobalUser.saas_token, 'me')).then((res)=>{
                                    const userData = res.response;
                                    if(!userData.userData.name || !userData.userData.contact_phone){
                                        SaasViewModel.setContactInfo(gvc)
                                    }else{
                                        showTut()
                                    }
                                })

                                break
                            }
                            case 'user-editor': {
                                // if (document.body.clientWidth > 1000) {
                                //     ApiShop.getFEGuideable().then(r => {
                                //         if (!r.response.value || !r.response.value.view) {
                                //             let bgGuide = new BgGuide(gvc, 0, "user-editor", 0);
                                //             ApiShop.setFEGuideable({})
                                //             bgGuide.drawGuide();
                                //         }
                                //     })
                                // }
                                break
                            }
                        }
                    }


                    // }


                },
            });
        },
        onCreate: () => {

        },
        onResume: () => {
            setTimeout(() => {
                gvc.notifyDataChange('MainEditorLeft')
            }, 100)
        }
    };
});

function initialEditor(gvc: GVC, viewModel: any) {
    const glitter = gvc.glitter;
    setTimeout(()=>{
        if (EditorConfig.backend_page() === 'backend-manger' && (glitter.getUrlParameter('page') !== 'cms')) {
            setTimeout(() => {
                glitter.setUrlParameter('page', 'cms')
            }, 100)
        }
        glitter.setUrlParameter('function', EditorConfig.backend_page())
    },50);


    //AI聊天室功能開關
    glitter.share.ai_message = AiMessage
    //AI代碼生成
    glitter.share.ai_code_generator=(message:string,callback:(text:string)=>void)=>{
        const dialog = new ShareDialog(gvc.glitter)
        dialog.dataLoading({visible: true})
        AiChat.generateHtml({
            app_name: (window as any).appName,
            text: message
        }).then((res) => {
            if (res.result && res.response.data.usage === 0) {
                dialog.dataLoading({visible: false})
                dialog.errorMessage({text: `很抱歉你的AI代幣不足，請先前往加值`})
            } else if (res.result && (!res.response.data.obj.result)) {
                dialog.dataLoading({visible: false})
                dialog.errorMessage({text: `AI無法理解你的需求，請給出具體一點的描述`})
            } else if (!res.result) {
                dialog.dataLoading({visible: false})
                dialog.errorMessage({text: `發生錯誤`})
            } else {
                res.response.data.obj.html
                AddComponent.addWidget(gvc, {
                    "id": "s7scs2s9s3s5s8sc",
                    "js": "./official_view_component/official.js",
                    "css": {"class": {}, "style": {}},
                    "data": {
                        "refer_app": "shop_template_black_style",
                        "tag": "custom-code",
                        "list": [],
                        "carryData": {},
                        "_style_refer_global": {"index": "0"},
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
                        "_background_setting": {"type": "none"},
                        "refer_form_data": {
                            "code": res.response.data.obj.html,
                            "width": {"unit": "px", "value": "0px", "number": "0"},
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
                        "css": {"class": {}, "style": {}},
                        "data": {"refer_app": "shop_template_black_style"},
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
                dialog.successMessage({text: `AI生成完畢，使用了『${res.response.data.usage}』點 AI Points.`})

            }
        })
    }
    //跳轉至編輯器頁面功能
    glitter.share.switch_to_web_builder = (page: string,device:string) => {
        glitter.closeDrawer()
        glitter.changePage(
            'jspage/main.js',
            page,
            true,
            {
                appName: (window.parent as any).glitter.getUrlParameter('appName'),
            },
            {
                backGroundColor: `transparent;`,
                carry_search:[
                    {
                        key:'device',value:device
                    },
                    {
                        key:'function',value:'user-editor'
                    }
                ]
            }
        )
    }
    //續費功能
    glitter.share.subscription = async (title: string) => {
        const dialog = new ShareDialog(glitter)
        const vm: {
            total: number,
            note: any,
            return_url: string,
            line_items: any[],
            user_info: {
                email: string,
                invoice_type: 'me' | 'company' | 'donate',
                company: string,
                gui_number: string
            },
            customer_info: any
        } = {
            total: 500,
            note: {},
            line_items: [],
            return_url: (window.parent as any).location.href,
            user_info: {
                email: '',
                invoice_type: 'me',
                company: '',
                gui_number: ''
            },
            customer_info: {}
        }
        const dd = (await ApiUser.getPublicConfig('ai-points-store', 'manager'))
        if (dd.response.value) {
            vm.user_info = dd.response.value
        }
        const sku = (() => {
            switch (title) {
                case '輕便電商方案':
                    return 'light-year'
                case '標準電商方案':
                    return 'basic-year'
                case '通路電商方案':
                    return 'omo-year'
                case '行動電商方案':
                    return 'app-year'
                case '旗艦電商方案':
                    return 'flagship-year'
            }
            return ``
        })()
        if (gvc.glitter.deviceType === gvc.glitter.deviceTypeEnum.Ios) {
            dialog.dataLoading({visible: true});
            gvc.glitter.runJsInterFace("in_app_product", {
                total: `${sku.replace('-', '_')}_apple`,
                qty: (() => {
                    switch (title) {
                        case '輕便電商方案':
                            return 1
                        case '標準電商方案':
                            return 2
                        case '通路電商方案':
                            return 4
                        case '行動電商方案':
                            return 4
                        case '旗艦電商方案':
                            return 2
                    }
                })()
            }, async (res) => {
                console.log(`res.receipt_data=>`, res.receipt_data);
                if (res.receipt_data) {
                    await ApiShop.app_subscription(res.receipt_data, (window as any).appName);
                    window.parent.location.reload();
                } else {
                    dialog.dataLoading({visible: false});
                    dialog.errorMessage({text: '儲值失敗'})
                }
            })
            return
        }
        const product = await ApiShop.getProduct({
            limit: 1,
            page: 0,
            searchType: 'sku',
            search: sku,
            app_name: (window.parent as any).glitterBase
        });
        vm.line_items = [{
            id: product.response.data[0].id as any,
            spec: product.response.data[0].content.variants.find((dd: any) => {
                return dd.sku === sku
            }).spec,
            count: 1
        }]
        BgWidget.settingDialog({
            gvc: gvc,
            title: title,
            innerHTML: (gvc: GVC) => {
                return `<div class="mt-n2">${[
                    BgWidget.editeInput({
                        gvc: gvc,
                        title: `發票寄送電子信箱`,
                        placeHolder: '請輸入發票寄送電子信箱',
                        callback: (text) => {
                            vm.user_info.email = text
                        },
                        type: 'email',
                        default: vm.user_info.email
                    }),
                    `<div class="tx_normal fw-normal" >發票開立方式</div>`,
                    BgWidget.select({
                        gvc: gvc, callback: (text) => {
                            vm.user_info.invoice_type = text
                            gvc.recreateView()
                        }, options: [
                            {key: 'me', value: '個人單位'},
                            {key: 'company', value: '公司行號'}
                        ], default: vm.user_info.invoice_type
                    }),
                    ...(() => {
                        if (vm.user_info.invoice_type === 'company') {
                            return [
                                BgWidget.editeInput({
                                    gvc: gvc, title: `發票抬頭`, placeHolder: '請輸入發票抬頭', callback: (text) => {
                                        vm.user_info.company = text
                                    }, type: 'text', default: `${vm.user_info.company}`
                                }),
                                BgWidget.editeInput({
                                    gvc: gvc,
                                    title: `公司統一編號`,
                                    placeHolder: '請輸入統一編號',
                                    callback: (text) => {
                                        vm.user_info.gui_number = text
                                    },
                                    type: 'number',
                                    default: `${vm.user_info.gui_number}`
                                })
                            ]
                        } else {
                            return []
                        }
                    })()
                ].join(`<div class="my-2"></div>`)}</div>`
            },
            footer_html: (gvc: GVC) => {
                return [BgWidget.cancel(gvc.event(() => {
                    gvc.closeDialog()
                })), BgWidget.save(gvc.event(async () => {
                    if (vm.user_info.invoice_type !== 'company') {
                        vm.user_info.company = ''
                        vm.user_info.gui_number = ''
                    }
                    if (vm.user_info.invoice_type === 'company' && !vm.user_info.company) {
                        dialog.errorMessage({text: '請確實填寫發票抬頭'})
                        return
                    } else if (vm.user_info.invoice_type === 'company' && !vm.user_info.gui_number) {
                        dialog.errorMessage({text: '請確實填寫統一編號'})
                        return
                    } else if (!vm.user_info.email) {
                        dialog.errorMessage({text: '請確實填寫信箱'})
                        return
                    } else if (!BgWidget.isValidEmail(vm.user_info.email)) {
                        dialog.errorMessage({text: '請輸入有效信箱'})
                        return
                    } else if (vm.user_info.invoice_type === 'company' && !BgWidget.isValidNumbers(vm.user_info.gui_number)) {
                        dialog.errorMessage({text: '請輸入有效統一編號'})
                        return
                    }
                    dialog.dataLoading({visible: true})
                    await ApiUser.setPublicConfig({
                        key: 'ai-points-store',
                        value: vm.user_info,
                        user_id: 'manager',
                    })
                    vm.note = {
                        invoice_data: vm.user_info
                    };
                    vm.customer_info = {
                        "payment_select": "ecPay"
                    };
                    (vm.user_info as any).appName = (window.parent as any).appName;
                    BaseApi.create({
                        url: (window.parent as any).saasConfig.config.url + `/api-public/v1/ec/checkout`,
                        type: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'g-app': 'shopnex',
                            'Authorization': GlobalUser.saas_token,
                        },
                        data: JSON.stringify(vm),
                    }).then(async (res) => {
                        dialog.dataLoading({visible: false})
                        if (res.response.form) {
                            const id = gvc.glitter.getUUID()
                            if (gvc.glitter.deviceType === gvc.glitter.deviceTypeEnum.Ios) {
                                gvc.glitter.runJsInterFace("toCheckout", {
                                    form: res.response.form
                                }, () => {
                                    window.parent.location.reload()
                                })
                            } else {
                                (window as any).$('body').append(`<div id="${id}" style="display: none;">${res.response.form}</div>`);
                                (window as any).document.querySelector(`#${id} #submit`).click();
                            }
                            gvc.closeDialog()
                        } else {
                            dialog.errorMessage({text: '發生錯誤'})
                        }
                    })
                }))].join('')
            }
        })
    }
    //如果是APP版本
    if (gvc.glitter.getUrlParameter('device') === 'mobile') {
        gvc.glitter.setCookie('ViewType', 'mobile')
        GlobalWidget.glitter_view_type = 'mobile';
    }
    //找靈感組件
    glitter.share.SearchIdea = SearchIdea
    glitter.share.editorViewModel = viewModel;
    //預設為用戶編輯模式
    localStorage.setItem('editor_mode', localStorage.getItem('editor_mode') || 'user');
    //Swal載入動畫
    const swal = new Swal(gvc);
    glitter.share.swal = swal;
    //貼上事件
    glitter.share.pastEvent = () => {
        if (!glitter.share.copycomponent) {
            swal.nextStep(`請先複製元件`, () => {
            }, 'error');
            return;
        }
        let copy = JSON.parse(glitter.share.copycomponent);

        function checkId(dd: any) {
            dd.id = glitter.getUUID();
            if (dd.type === 'container') {
                dd.data.setting.map((d2: any) => {
                    checkId(d2);
                });
            }
        }

        checkId(copy);
        glitter.share.addComponent(copy);
        // glitter.setCookie('lastSelect', copy.id);
        // viewModel.selectContainer.splice(0, 0, copy)
        // viewModel.selectItem = undefined;
        // gvc.notifyDataChange(editorContainerID)
    };
    //清除選項
    glitter.share.clearSelectItem = () => {
        viewModel.selectItem = undefined;
    };
    //提供給編輯器使用
    glitter.share.NormalPageEditor = NormalPageEditor;
    //物件是否可選
    glitter.share.inspect = glitter.share.inspect ?? true;
    //觸發事件橋接
    triggerBridge.initial();
    //更新Editor事件
    glitter.share.refreshAllContainer = () => {
        gvc.notifyDataChange(editorContainerID);
    };
    //找到ID索引位置
    glitter.share.findWidgetIndex = (id: string) => {
        let find: {
            widget: any;
            container: any;
            index: number;
            container_cf: any;
        } = {
            widget: undefined,
            container: undefined,
            container_cf: undefined,
            index: 0,
        };

        function loop(array: any, container_cf: any) {
            array.map((dd: any, index: number) => {
                if (dd.id === id) {
                    find.widget = dd;
                    find.container = array;
                    find.container_cf = container_cf;
                    find.index = index;
                } else if (dd.type === 'container') {
                    loop(dd.data.setting, dd);
                }
            });
        }

        loop(glitter.share.editorViewModel.data.config, undefined);
        return find;
    };
    //找到ID索引位置
    glitter.share.findWidget = (where: (data: any) => boolean) => {
        let find: {
            widget: any;
            container: any;
            index: number;
        } = {
            widget: undefined,
            container: undefined,
            index: 0,
        };

        function loop(array: any) {
            array.map((dd: any, index: number) => {
                if (where(dd)) {
                    find.widget = dd;
                    find.container = array;
                    find.index = index;
                } else if (dd.type === 'container') {
                    loop(dd.data.setting);
                }
            });
        }

        loop(glitter.share.editorViewModel.data.config);
        return find;
    };

    function resetId(widget: any) {
        widget.id = glitter.getUUID();
        if (widget.type === 'container') {
            widget.data.setting.map((dd: any) => {
                resetId(dd);
            });
        }
    }

    //添加Component至當前頁面
    glitter.share.addComponent = (data: any) => {
        let parentCount=glitter.share.editorViewModel.data.config.length;

        glitter.share.loading_dialog.dataLoading({text: '模組添加中...', visible: true})
        if (gvc.glitter.getUrlParameter('toggle-message') === 'true') {
            gvc.glitter.setUrlParameter('toggle-message', undefined)
            BgCustomerMessage.toggle(true, gvc);
        }
        if (!viewModel.selectContainer) {
            viewModel.selectContainer = glitter.share.editorViewModel.data.config
        }
        if (!viewModel.selectContainer.container_config) {
            viewModel.selectContainer.container_config = glitter.share.main_view_config
        }
        glitter.share.left_block_hover = true
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
        }
        console.log('viewModel.selectContainer==>',viewModel.selectContainer)
        console.log('viewModel.selectContainer.container_config==>',viewModel.selectContainer.container_config)
        if (viewModel.selectContainer.length === 1) {
            try {
                viewModel.selectContainer.container_config.getElement().recreateView();
            }catch (e){
            }
        } else {
            $(viewModel.selectContainer.container_config.getElement()).append(
                glitter.htmlGenerate.renderWidgetSingle({
                    widget: data,
                    gvc: viewModel.selectContainer.container_config.gvc,
                    option: viewModel.selectContainer.container_config.option,
                    container: viewModel.selectContainer.container_config.container,
                    container_id: viewModel.selectContainer.container_config.container_id,
                    child_container: viewModel.selectContainer.container_config.child_container,
                    sub_data: viewModel.selectContainer.container_config.sub_data,
                    root: viewModel.selectContainer.container_config.root,
                })
            );
        }

        if(parentCount===0){
            Storage.lastSelect = data.id
            gvc.recreateView()
        }else{
            setTimeout(() => {
                Storage.lastSelect = data.id
                glitter.htmlGenerate.selectWidget({
                    widget: data,
                    widgetComponentID: data.id,
                    gvc: viewModel.selectContainer.container_config.gvc,
                    scroll_to_hover: true,
                    glitter: glitter,
                });
                setTimeout(() => {
                    glitter.share.left_block_hover = false
                    glitter.share.loading_dialog.dataLoading({visible: false})
                }, 1000)
            }, 100)
            viewModel.selectContainer && viewModel.selectContainer.rerenderReplaceElem && viewModel.selectContainer.rerenderReplaceElem()
        }

        AddComponent.toggle(false);

    };
    //添加Component至指定索引
    glitter.share.addWithIndex = (cf: { data: any; index: string; direction: number }) => {
        glitter.share.loading_dialog.dataLoading({text: '模組添加中...', visible: true})
        glitter.share.left_block_hover = true
        AddComponent.toggle(false);
        resetId(cf.data);
        const arrayData = glitter.share.findWidgetIndex(cf.index);
        if (!arrayData.container.container_config) {
            arrayData.container.container_config = glitter.share.main_view_config
        }
        const url = new URL(location.href);
        url.search = '';
        cf.data.js = cf.data.js.replace(url.href, './');
        if (cf.direction === 1) {
            arrayData.container.splice(arrayData.index + 1, 0, cf.data);
        } else {
            arrayData.container.splice(arrayData.index, 0, cf.data);
        }
        Storage.lastSelect = cf.data.id;
        glitter.htmlGenerate.hover_items = [Storage.lastSelect];
        const $ = ((document.querySelector('#editerCenter iframe') as any).contentWindow as any).$;
        $(
            glitter.htmlGenerate.renderWidgetSingle({
                widget: cf.data,
                gvc: arrayData.container.container_config.gvc,
                option: arrayData.container.container_config.option,
                container: arrayData.container.container_config.container,
                container_id: arrayData.container.container_config.container_id,
                child_container: arrayData.container.container_config.child_container,
                sub_data: arrayData.container.container_config.sub_data,
                root: arrayData.container.container_config.root,
            })
        )[cf.direction === 1 ? 'insertAfter' : 'insertBefore']($(`.editor_it_${cf.index}`).parent());
        //
        setTimeout(() => {
            console.log(`cf.data.id==>`,cf.data.id)
            Storage.lastSelect = cf.data.id
            function pasteEvent(){
                glitter.htmlGenerate.selectWidget({
                    widget: cf.data,
                    widgetComponentID: cf.data.id,
                    gvc: arrayData.container.container_config.gvc,
                    scroll_to_hover: true,
                    glitter: glitter,
                });
            }
            pasteEvent()
            setTimeout(() => {
                glitter.share.left_block_hover = false
                glitter.share.loading_dialog.dataLoading({visible: false})
                pasteEvent()
            }, 1000)
        }, 100)
        AddComponent.toggle(false);
        viewModel.selectContainer && viewModel.selectContainer.rerenderReplaceElem && viewModel.selectContainer.rerenderReplaceElem();
    };
    //快捷鍵設定
    shortCutKey(gvc);

}

function shortCutKey(gvc: GVC) {
    // 添加全局鍵盤事件監聽器
    document.addEventListener('keydown', function (event) {
        // 檢查按下的按鍵碼
        let keyCode = event.keyCode || event.which;
        // Ctrl + G
        if (event.ctrlKey && keyCode === 71) {
            SetGlobalValue.toggle(true);
        }
    });
}
