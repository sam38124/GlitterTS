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
import {all} from 'underscore/index.js';
import {BgCustomerMessage} from '../backend-manager/bg-customer-message.js';
import {BgGuide} from "../backend-manager/bg-guide.js";
import {ApiShop} from "../glitter-base/route/shopping.js";
import {StepManager} from "../modules/step-manager.js";
import {ShareDialog} from "../glitterBundle/dialog/ShareDialog.js";

const html = String.raw;
//
const editorContainerID = `HtmlEditorContainer`;
init(import.meta.url, (gvc, glitter, gBundle) => {
    glitter.share.loading_dialog=(new ShareDialog(gvc.glitter))
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
    gvc.addStyle(css`
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
    Storage.lastSelect=''
    const swal = new Swal(gvc);
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

    //載入頁面資料
    async function lod() {
        if(gvc.glitter.getUrlParameter('function') !== 'backend-manger'){
            glitter.share.loading_dialog.dataLoading({text:'模組加載中...',visible:true})
        }else{
            await swal.loading('載入中...');
        }
        const waitGetData = [
            async () => {
                return await new Promise(async (resolve, reject) => {
                    const clock = gvc.glitter.ut.clock();
                    ApiPageConfig.getAppConfig().then((res) => {
                        viewModel.app_config_original = res.response.result[0];
                        viewModel.domain = res.response.result[0].domain;
                        viewModel.originalDomain = viewModel.domain;
                        resolve(true);
                    });
                });
            },
            async () => {
                return await new Promise(async (resolve) => {
                    if (!glitter.share.editor_vm) {
                        const data = await ApiPageConfig.getPage({
                            appName: gBundle.appName,
                            type: 'template',
                        });
                        viewModel.data=await new Promise((resolve, reject)=>{
                            ((window as any).glitterInitialHelper).getPageData({
                                tag: glitter.getUrlParameter('page'),
                                appName: gBundle.appName
                            }, (d2: any) => {
                                resolve(d2.response.result[0])
                            })
                        })

                        // viewModel.data = (
                        //     await ApiPageConfig.getPage({
                        //         appName: gBundle.appName,
                        //         tag: glitter.getUrlParameter('page'),
                        //     })
                        // ).response.result[0];
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
                            function createGenerator(){
                                (window as any).editerData = new gvc.glitter.htmlGenerate((viewModel.data! as any).config, [Storage.lastSelect], undefined, true);
                                (window as any).page_config = (viewModel.data! as any).page_config;
                            }
                            createGenerator()


// 示例代码
//                            const manager = new StepManager<()=>void>();
                            // clearInterval(glitter.share.stepInterVal)
                            // let lastCompare=JSON.parse(JSON.stringify((viewModel.data! as any).config))
                            // glitter.share.stepInterVal=setInterval(()=>{
                            //     if(JSON.stringify(lastCompare)!==JSON.stringify((viewModel.data! as any).config)){
                            //         const step=JSON.parse(JSON.stringify((viewModel.data! as any).config))
                            //         manager.addStep(()=>{
                            //             lastCompare=step;
                            //             (viewModel.data! as any).config=JSON.parse(JSON.stringify(step));
                            //             createGenerator();
                            //             (document.querySelector(`.iframe_view`) as any).contentWindow.glitter.pageConfig[0].gvc.recreateView()
                            //             gvc.notifyDataChange(editorContainerID);
                            //             gvc.notifyDataChange('step-container')
                            //         })
                            //         lastCompare=step
                            //         gvc.notifyDataChange('step-container')
                            //     }
                            // },500)

                            // glitter.share.stepManager=manager
                            //
                            // setTimeout(()=>{
                            //     (viewModel.data! as any).config=[];
                            //     createGenerator();
                            //     gvc.notifyDataChange(editorContainerID);
                            // },1000*5)
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
                    data.result=true
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
                        console.log(`falseIn`,waitGetData.findIndex((dd)=>{return dd===a}))
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
        swal.close();
        viewModel.loading = false;
        gvc.notifyDataChange(editorContainerID);
    }

    lod().then(() => {
        //設定儲存事件
        glitter.htmlGenerate.saveEvent = (refresh: boolean = true, callback?: () => void) => {
            glitter.closeDiaLog();
            glitter.setCookie('jumpToNavScroll', $(`#jumpToNav`).scrollTop());

                swal.loading('更新中...');
            async function saveEvent() {
                for (const b of Object.keys(glitter.share.editorViewModel.saveArray)) {
                    await (glitter.share.editorViewModel.saveArray[b] as any)();
                }
                glitter.share.editorViewModel.saveArray = {};
                const waitSave = [
                    async () => {
                        let haveID: string[] = [];
                        const config=JSON.parse(JSON.stringify((viewModel.data as any).config))
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
                        swal.nextStep(`伺服器錯誤`, () => {
                        }, 'error');
                        return;
                    }
                }
                swal.close();

                if (refresh) {
                    viewModel.originalConfig = JSON.parse(JSON.stringify(viewModel.appConfig));
                    (window as any).preloadData = {};
                    (window as any).glitterInitialHelper.share = {};
                    lod();
                }
                if (glitter.share.editor_vm) {
                    glitter.share.editor_vm.callback(viewModel.data);
                    swal.close();
                    swal.toast({
                        icon: 'success',
                        title: '儲存成功',
                    });
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
                        return ``;
                    } else {
                        let view: any = [];
                        if (gvc.glitter.getUrlParameter('function') !== 'backend-manger') {
                            view.push(AddComponent.leftNav(gvc));
                            view.push(SetGlobalValue.leftNav(gvc));
                        } else {
                            view.push(BgCustomerMessage.leftNav(gvc));
                        }
                        view.push(PageSettingView.leftNav(gvc));
                        view.push(AddPage.leftNav(gvc));
                        view.push(PageCodeSetting.leftNav(gvc));
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
                                                                                gvc.notifyDataChange(["MainEditorLeft","left_sm_bar"]);
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
                                                    onCreate:()=>{
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
                                                                            //內容編輯模式不允許特定頁面，自動重導向。
                                                                            if (Storage.select_function === 'user-editor') {
                                                                                if (!viewModel.data.page_config || viewModel.data.page_config.support_editor !== 'true') {
                                                                                    const redirect = viewModel.dataList.find((dd: any) => {
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
                                                                    glitter.setDrawer(`<div class="bg-white vh-120 overflow-auto">${view}</div>`, () => {
                                                                    });
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
                divCreate: {class:`editorContainer`},
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
                    if(!viewModel.loading ){
                        switch (Storage.select_function) {
                            case 'backend-manger':{
                                let bgGuide = new BgGuide(gvc,0);
                                ApiShop.getGuideable().then(r => {
                                    if (!r.response.value || !r.response.value.view){
                                        bgGuide.drawGuide();
                                    }
                                })
                                break
                            }
                            case 'user-editor':{

                            }
                        }
                    }


                    // }


                },
            });
        },
        onCreate: () => {

        },
    };
});

function initialEditor(gvc: GVC, viewModel: any) {
    const glitter = gvc.glitter;
    glitter.share.editorViewModel = viewModel;
    //預設為用戶編輯模式
    localStorage.setItem('editor_mode', localStorage.getItem('editor_mode') || 'user');
    //Swal載入動畫
    const swal = new Swal(gvc);
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
            container_cf:any;
        } = {
            widget: undefined,
            container: undefined,
            container_cf:undefined,
            index: 0,
        };

        function loop(array: any,container_cf:any) {
            array.map((dd: any, index: number) => {
                if (dd.id === id) {
                    find.widget = dd;
                    find.container = array;
                    find.container_cf=container_cf;
                    find.index = index;
                } else if (dd.type === 'container') {
                    loop(dd.data.setting,dd);
                }
            });
        }

        loop(glitter.share.editorViewModel.data.config,undefined);
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
        glitter.share.loading_dialog.dataLoading({text:'模組添加中...',visible:true})
        if(!viewModel.selectContainer.container_config){
            viewModel.selectContainer.container_config=glitter.share.main_view_config
        }
        glitter.share.left_block_hover=true
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
        if (viewModel.selectContainer.length === 1) {
            viewModel.selectContainer.container_config.getElement().recreateView();
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
        setTimeout(() => {
            Storage.lastSelect=data.id
            glitter.htmlGenerate.selectWidget({
                widget: data,
                widgetComponentID: data.id,
                gvc: viewModel.selectContainer.container_config.gvc,
                scroll_to_hover: true,
                glitter: glitter,
            });
            setTimeout(()=>{
                glitter.share.left_block_hover=false
                glitter.share.loading_dialog.dataLoading({visible:false})
            },1000)
        }, 100)
        AddComponent.toggle(false);
        viewModel.selectContainer && viewModel.selectContainer.rerenderReplaceElem && viewModel.selectContainer.rerenderReplaceElem()
    };
    //添加Component至指定索引
    glitter.share.addWithIndex = (cf: { data: any; index: string; direction: number }) => {
        glitter.share.loading_dialog.dataLoading({text:'模組添加中...',visible:true})
        if(!viewModel.selectContainer.container_config){
            viewModel.selectContainer.container_config=glitter.share.main_view_config
        }
        glitter.share.left_block_hover=true
        AddComponent.toggle(false);
        resetId(cf.data);
        const arrayData = glitter.share.findWidgetIndex(cf.index);
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
            Storage.lastSelect=cf.data.id
            glitter.htmlGenerate.selectWidget({
                widget: cf.data,
                widgetComponentID: cf.data.id,
                gvc: arrayData.container.container_config.gvc,
                scroll_to_hover: true,
                glitter: glitter,
            });
            setTimeout(()=>{
                glitter.share.left_block_hover=false
                glitter.share.loading_dialog.dataLoading({visible:false})
            },1000)
        }, 100)
        AddComponent.toggle(false);
        viewModel.selectContainer && viewModel.selectContainer.rerenderReplaceElem && viewModel.selectContainer.rerenderReplaceElem();
    };
    //部落格編輯模式
    if (glitter.getUrlParameter('blogEditor') === 'true') {
        glitter.share.blogEditor = true;
        glitter.share.blogPage = glitter.getUrlParameter('page');
    }
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
