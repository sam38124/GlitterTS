import {GVC, init} from '../glitterBundle/GVController.js';
import {Editor} from './editor.js';
import {ApiPageConfig} from '../api/pageConfig.js';
import {Swal} from '../modules/sweetAlert.js';
import {Main_editor} from "./function-page/main_editor.js";
import {Page_editor} from "./function-page/page_editor.js";
import {Setting_editor} from "./function-page/setting_editor.js";
import {Plugin_editor} from "./function-page/plugin_editor.js";
import * as triggerBridge from "../editor-bridge/trigger-event.js";
import {TriggerEvent} from "../glitterBundle/plugins/trigger-event.js";
import {EditorElem} from "../glitterBundle/plugins/editor-elem.js";
import {StoreHelper} from "../helper/store-helper.js";
import {GlobalUser} from "../glitter-base/global/global-user.js";
import {DialogInterface} from "../dialog/dialog-interface.js";
import {Storage} from "../helper/storage.js";
import {ServerEditor} from "./function-page/server-editor/server-editor.js";
import {AddComponent} from "../editor/add-component.js";
import {PageSettingView} from "../editor/page-setting-view.js";
import {AddPage} from "../editor/add-page.js";
import {SetGlobalValue} from "../editor/set-global-value.js";

const html = String.raw
//
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
    `)
    const swal = new Swal(gvc);
    const viewModel: {
        dataList: any
        data: any
        loading: boolean,
        selectItem: any,
        initialJS: { name: string, src: { official: string, open: boolean }, route: string }[],
        pluginList: { name: string, src: { staging: string, official: string, open: boolean }, route: string }[],
        initialStyle: { name: string, src: { src: string }, route: string }[],
        initialStyleSheet: { name: string, src: { src: string }, route: string }[],
        globalValue: any
        initialCode: any,
        initialList: any,
        homePage: string,
        selectContainer: any,
        backendPlugins: any,
        selectIndex: any,
        waitCopy: any,
        appConfig: any,
        originalConfig: any,
        globalScript: any,
        globalStyle: any,
        globalStyleTag: any,
        appName: string,
        originalData: any,
        domain: string,
        originalDomain: string
    } = {
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
    (window.parent as any).glitter.share.refreshMainLeftEditor = () => {
        gvc.notifyDataChange('MainEditorLeft')
    };
    (window.parent as any).glitter.share.refreshMainRightEditor = () => {
        gvc.notifyDataChange('MainEditorRight')
    };

    //加載頁面資料
    async function lod() {
        swal.loading('加載中...');
        const waitGetData = [
            (async () => {
                return await new Promise(async (resolve, reject) => {
                    const clock = gvc.glitter.ut.clock()
                    ApiPageConfig.getAppConfig().then((res) => {
                        console.log(res)
                        viewModel.domain = res.response.result[0].domain
                        viewModel.originalDomain = viewModel.domain
                        resolve(true)
                    })
                })
            }),
            (async () => {
                return await new Promise(async (resolve) => {
                    const clock = gvc.glitter.ut.clock()
                    const data = await ApiPageConfig.getPage({
                        appName: gBundle.appName,
                        type: 'template'
                    })
                    viewModel.data = (await ApiPageConfig.getPage({
                        appName: gBundle.appName,
                        tag: glitter.getUrlParameter('page')
                    })).response.result[0];
                    Storage.select_page_type = viewModel.data.page_type
                    if (data.result) {
                        data.response.result.map((dd: any) => {
                            dd.page_config = dd.page_config ?? {}
                            return dd;
                        });
                        viewModel.dataList = data.response.result;
                        viewModel.originalData = JSON.parse(JSON.stringify(viewModel.dataList))
                        glitter.share.allPageResource = JSON.parse(JSON.stringify(data.response.result))
                        const htmlGenerate = new gvc.glitter.htmlGenerate((viewModel.data! as any).config, [Storage.lastSelect], undefined, true);
                        (window as any).editerData = htmlGenerate;
                        (window as any).page_config = (viewModel.data! as any).page_config
                        if (!data) {
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                    }
                })
            }),
            (async () => {
                return await new Promise(async (resolve) => {
                    const data = glitter.share.appConfigresponse
                    if (data.result) {
                        viewModel.appConfig = data.response.data
                        viewModel.originalConfig = JSON.parse(JSON.stringify(viewModel.appConfig))
                        viewModel.globalScript = data.response.data.globalScript ?? []
                        viewModel.globalStyle = data.response.data.globalStyle ?? []
                        viewModel.globalStyleTag = data.response.data.globalStyleTag ?? []
                        viewModel.initialList = data.response.data.initialList;
                        viewModel.initialJS = data.response.data.eventPlugin;
                        viewModel.pluginList = data.response.data.pagePlugin;
                        viewModel.initialStyleSheet = data.response.data.initialStyleSheet;
                        viewModel.initialStyle = data.response.data.initialStyle;
                        viewModel.initialCode = data.response.data.initialCode ?? "";
                        viewModel.homePage = data.response.data.homePage ?? ""
                        viewModel.backendPlugins = data.response.data.backendPlugins ?? []
                        viewModel.globalValue = data.response.data.globalValue ?? []
                        resolve(true);

                        async function load() {
                            glitter.share.globalJsList = [{
                                src: {
                                    official: "./official_event/event.js"
                                }
                            }].concat(viewModel.initialJS)
                            for (const a of glitter.share.globalJsList) {
                                await new Promise((resolve) => {
                                    glitter.addMtScript([{
                                        src: TriggerEvent.getLink(a.src.official),
                                        type: 'module'
                                    }], () => {
                                        resolve(true);
                                    }, () => {
                                        resolve(true);
                                    });
                                })
                            }
                            resolve(true);
                        }

                        load()
                    } else {
                        resolve(false);
                    }
                }).then((data) => {
                    return data;
                });
            })
        ];
        let count = 0
        let result = await new Promise((resolve, reject) => {
            for (const a of waitGetData) {
                a().then((result) => {
                    if (result) {
                        count++
                    } else {
                        resolve(false)
                    }
                    if (count === waitGetData.length) {
                        resolve(true)
                    }
                })
            }
        })
        if (!result) {
            await lod()
            return
        }
        swal.close();
        viewModel.loading = false;
        gvc.notifyDataChange(editorContainerID);
    }

    lod().then(() => {
        //設定儲存事件
        glitter.htmlGenerate.saveEvent = (refresh: boolean = true,callback?:()=>void) => {
            glitter.closeDiaLog()
            glitter.setCookie("jumpToNavScroll", $(`#jumpToNav`).scrollTop())
            swal.loading('更新中...');

            async function saveEvent() {
                const waitSave = [
                    (async () => {
                        let haveID: string[] = [];

                        function getID(set: any) {
                            set.map((dd: any) => {
                                dd.js = (dd.js).replace(`${location.origin}/${(window as any).appName}/`, './')
                                dd.formData = undefined;
                                dd.pageConfig = undefined;
                                dd.subData = undefined;
                                dd.appConfig = undefined
                                dd.editorEvent = undefined;
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

                        getID((viewModel.data as any).config);
                        return new Promise(async resolve => {
                            let result = true
                            ApiPageConfig.setPage({
                                id: (viewModel.data! as any).id,
                                appName: gBundle.appName,
                                tag: (viewModel.data! as any).tag,
                                name: (viewModel.data! as any).name,
                                config: (viewModel.data! as any).config,
                                group: (viewModel.data! as any).group,
                                page_config: (viewModel.data! as any).page_config,
                                page_type: (viewModel.data! as any).page_type,
                                preview_image: (viewModel.data! as any).preview_image,
                                favorite: (viewModel.data! as any).favorite,
                            }).then((api) => {
                                resolve(result && api.result)
                            })
                        });
                    }),
                    (async () => {
                        return new Promise(async resolve => {
                            viewModel.appConfig.homePage = viewModel.homePage
                            viewModel.appConfig.globalStyle = viewModel.globalStyle
                            viewModel.appConfig.globalScript = viewModel.globalScript
                            viewModel.appConfig.globalValue = viewModel.globalValue
                            viewModel.appConfig.globalStyleTag = viewModel.globalStyleTag
                            resolve(await StoreHelper.setPlugin(viewModel.originalConfig, viewModel.appConfig))
                        });

                    })
                ];
                for (const a of waitSave) {
                    if (!await a()) {
                        swal.nextStep(`伺服器錯誤`, () => {
                        }, 'error');
                        return;
                    }
                }
                swal.close();
                viewModel.originalConfig = JSON.parse(JSON.stringify(viewModel.appConfig))
                if (refresh) {
                    lod();
                }
            }

            saveEvent().then(r => {
                callback && callback()
            });
        };
        glitter.share.reloadEditor = () => {
            viewModel.selectItem = undefined
            viewModel.selectContainer = undefined
            lod()
        }
    });
    return {
        onCreateView: () => {
            return gvc.bindView({
                bind: editorContainerID,
                view: () => {
                    if (viewModel.loading) {
                        return ``;
                    } else {
                        try {
                            const doc = new Editor(gvc, viewModel);
                            return doc.create(html`
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
                                                    // {src: `fa-sharp fa-regular fa-file-dashed-line`, index: Page_editor.index},
                                                ].map((da: any) => {

                                                    return html`<i
                                                            class="fa-regular ${da.src} fs-5 fw-bold ${(Storage.select_function === `${da.index}`) ? `text-primary` : ``}  p-2 rounded"
                                                            data-bs-toggle="tooltip"
                                                            data-bs-placement="top"
                                                            data-bs-custom-class="custom-tooltip"
                                                            data-bs-title="${da.hint}"
                                                            style="cursor:pointer;${(Storage.select_function === `${da.index}`) ? `background-color: rgba(10,83,190,0.1);` : ``}"
                                                            onclick="${gvc.event(() => {
                                                                viewModel.waitCopy = undefined
                                                                viewModel.selectItem = undefined
                                                                Storage.select_function = da.index
                                                                gvc.notifyDataChange(editorContainerID)
                                                            })}"></i>`
                                                }).join('')}
                                            </div>
                                            <div class="offcanvas-body swiper scrollbar-hover  w-100 ${(() => {
                                                switch (Storage.select_function) {
                                                    case 'backend-manger':
                                                    case 'server-manager':
                                                        return `pt-0`
                                                    case 'page-editor':
                                                        return `p-0`
                                                    default:
                                                        return `p-0`
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
                                                                        return Setting_editor.left(gvc, viewModel, editorContainerID, gBundle)
                                                                    case 'server-manager':
                                                                        return ServerEditor.left(gvc)
                                                                    case 'page-editor':
                                                                        return Main_editor.left(gvc, viewModel, editorContainerID, gBundle)
                                                                    default:
                                                                        return Page_editor.left(gvc, viewModel, editorContainerID, gBundle)
                                                                }
                                                            },
                                                            divCreate: {
                                                                class: "h-100"
                                                            }
                                                        }
                                                    })}
                                                </div>
                                                <div class="swiper-scrollbar end-0"></div>
                                            </div>
                                        </div>`,
                                gvc.bindView({
                                    bind: 'MainEditorRight',
                                    view: () => {
                                        return ``
                                    },
                                    divCreate: {}
                                })
                            );
                        } catch (e) {
                            console.log(e)
                            return ``
                        }

                    }
                },
                divCreate: {},
                onCreate: () => {
                    $("#jumpToNav").scroll(function () {
                        glitter.setCookie("jumpToNavScroll", $(`#jumpToNav`).scrollTop())
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
                                behavior: 'auto' // 使用平滑滚动效果，如果需要的话
                            });
                        }
                    }

                    setTimeout(() => {
                        scrollToItem(document.querySelector(`.editor_item.active`)!)
                    }, 200)
                }
            });
        },
        onCreate: () => {
        },
    };
});


function initialEditor(gvc: GVC, viewModel: any) {
    const glitter = gvc.glitter
    glitter.share.editorViewModel = viewModel
    //預設為用戶編輯模式
    localStorage.setItem('editor_mode', localStorage.getItem('editor_mode') || 'user')
    //Swal加載動畫
    const swal = new Swal(gvc);
    //貼上事件
    glitter.share.pastEvent = () => {
        if (!glitter.share.copycomponent) {
            swal.nextStep(`請先複製元件`, () => {
            }, 'error');
            return
        }
        var copy = JSON.parse(glitter.share.copycomponent)

        function checkId(dd: any) {
            dd.id = glitter.getUUID()
            if (dd.type === 'container') {
                dd.data.setting.map((d2: any) => {
                    checkId(d2)
                })
            }
        }

        checkId(copy)
        glitter.setCookie('lastSelect', copy.id);
        viewModel.selectContainer.splice(0, 0, copy)
        viewModel.selectItem = undefined;
        gvc.notifyDataChange(editorContainerID)
    }
    //清除選項
    glitter.share.clearSelectItem = () => {
        viewModel.selectItem = undefined;
    }
    //物件是否可選
    glitter.share.inspect = glitter.share.inspect ?? true
    //觸發事件橋接
    triggerBridge.initial()
    //更新Editor事件
    glitter.share.refreshAllContainer = () => {
        gvc.notifyDataChange(editorContainerID);
    }
    //添加Component至當前頁面
    glitter.share.addComponent = (data: any) => {
        const url = new URL(location.href)
        url.search = ''
        data.js = data.js.replace(url.href, './')
        viewModel.selectContainer.push(data);
        glitter.setCookie('lastSelect', data.id);
        gvc.notifyDataChange(editorContainerID)
    }
    //部落格編輯模式
    if (glitter.getUrlParameter('blogEditor') === 'true') {
        glitter.share.blogEditor = true
        glitter.share.blogPage = glitter.getUrlParameter('page')
    }
    //快捷鍵設定
    shortCutKey(gvc)
}

function shortCutKey(gvc: GVC) {
    // 添加全局鍵盤事件監聽器
    document.addEventListener('keydown', function (event) {
        // 檢查按下的按鍵碼
        let keyCode = event.keyCode || event.which;
        // Ctrl + G
        if ((event.ctrlKey) && keyCode === 71) {
            SetGlobalValue.toggle(true)
        }
    });
}


