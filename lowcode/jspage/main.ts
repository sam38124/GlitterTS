import {GVC, init} from '../glitterBundle/GVController.js';
import {Editor} from './editor.js';
import {ApiPageConfig} from '../api/pageConfig.js';
import {Swal} from '../modules/sweetAlert.js';
import {Main_editor} from "./main_editor.js";
import {Page_editor} from "./page_editor.js";
import {Setting_editor} from "./setting_editor.js";
import {Plugin_editor} from "./plugin_editor.js";
import * as triggerBridge from "../editor-bridge/trigger-event.js";
import {TriggerEvent} from "../glitterBundle/plugins/trigger-event.js";
import {EditorElem} from "../glitterBundle/plugins/editor-elem.js";
import {StoreHelper} from "../helper/store-helper.js";

const html = String.raw
init(import.meta.url,(gvc, glitter, gBundle) => {

    triggerBridge.initial()
    gvc.addStyle(`
    .swal2-title {
    color:black!important;
    }
    `);
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
        originalConfig:any,
        globalScript: any,
        globalStyle: any,
        globalStyleTag:any,
        appName: string,
        originalData: any,
        domain:string,
        originalDomain:string
    } = {
        appName: gBundle.appName,
        appConfig: undefined,
        originalConfig:undefined,
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
        globalStyleTag:[],
        initialCode: '',
        initialList: [],
        backendPlugins: [],
        homePage: '',
        selectContainer: undefined,
        selectIndex: undefined,
        waitCopy: undefined,
        globalScript: undefined,
        globalStyle: undefined,
        domain:'',
        originalDomain:''
    };
    const swal = new Swal(gvc);
    const doc = new Editor(gvc, viewModel);
    const createID = `HtmlEditorContainer`;
    glitter.share.refreshAllContainer = () => {
        gvc.notifyDataChange(createID);
    }
    //Add component to now page
    glitter.share.addComponent = (data: any) => {
        viewModel.selectContainer.push(data);
        glitter.setCookie('lastSelect', data.id);
        gvc.notifyDataChange(createID)
    }

    async function lod() {
        swal.loading('加載中...');
        const waitGetData = [
            (async ()=>{
                return await new Promise(async (resolve, reject)=>{
                    const clock=gvc.glitter.ut.clock()
                    ApiPageConfig.getAppConfig().then((res)=>{
                       viewModel.domain=res.response.result[0].domain
                       viewModel.originalDomain=viewModel.domain
                       resolve(true)
                    })
                })
            }),
            (async () => {
                return await new Promise(async (resolve) => {
                    const clock=gvc.glitter.ut.clock()
                    const data = await ApiPageConfig.getPage(gBundle.appName)
                    viewModel.data = (await ApiPageConfig.getPage(gBundle.appName,glitter.getUrlParameter('page'))).response.result[0];
                    if (data.result) {
                        data.response.result.map((dd: any) => {
                            dd.page_config = dd.page_config ?? {}
                            return dd;
                        });
                        viewModel.dataList = data.response.result;
                        viewModel.originalData = JSON.parse(JSON.stringify(viewModel.dataList))
                        glitter.share.allPageResource = JSON.parse(JSON.stringify(data.response.result))
                        const htmlGenerate = new gvc.glitter.htmlGenerate((viewModel.data! as any).config, [glitter.getCookieByName('lastSelect')], undefined, true);
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
                        viewModel.originalConfig=JSON.parse(JSON.stringify(viewModel.appConfig))
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
        let count=0
        let result=await new Promise((resolve, reject)=>{
            for (const a of waitGetData) {
                a().then((result)=>{
                    if(result){
                        count++
                    }else{
                        resolve(false)
                    }
                    if(count===waitGetData.length){
                        resolve(true)
                    }
                })
            }
        })
       if(!result){
           await lod()
           return
       }
        swal.close();
        viewModel.loading = false;
        gvc.notifyDataChange(createID);
    }
    glitter.htmlGenerate.saveEvent = (refresh:boolean=true) => {
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
                            dd.formData=undefined;
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
                            page_config: (viewModel.data! as any).page_config
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
                        resolve(await StoreHelper.setPlugin(viewModel.originalConfig,viewModel.appConfig))
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
            viewModel.originalConfig=JSON.parse(JSON.stringify(viewModel.appConfig))
            if(refresh){
                lod();
            }

        }
        saveEvent().then(r => {
        });
    };
    lod();
    glitter.share.reloadEditor=()=>{
        viewModel.selectItem=undefined
        viewModel.selectContainer=undefined
        lod()
    }

    (window.parent as any).glitter.share.refreshMainLeftEditor = () => {
        gvc.notifyDataChange('MainEditorLeft')
    };
    (window.parent as any).glitter.share.refreshMainRightEditor = () => {
        gvc.notifyDataChange('MainEditorRight')
    };
    glitter.share.clearSelectItem = () => {
        viewModel.selectItem = undefined;
    }
    glitter.share.copycomponent = undefined
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
        gvc.notifyDataChange(createID)
    }
    glitter.share.inspect = glitter.share.inspect ?? true
    glitter.share.editorViewModel = viewModel

    return {
        onCreateView: () => {
            return gvc.bindView({
                bind: createID,
                view: () => {
                    let selectPosition = glitter.getUrlParameter('editorPosition') ?? "0"

                    if (viewModel.loading) {
                        return ``;
                    } else {
                        try {
                            return doc.create(html`
                                        <div class="d-flex overflow-hidden" style="height:100vh;background:white;">
                                            <div style="width:60px;gap:20px;padding-top: 15px;"
                                                 class="h-100 border-end d-flex flex-column align-items-center">
                                                ${[
                                                    {src: `fa-table-layout`, index: Main_editor.index},
                                                    {src: `fa-solid fa-list-check`, index: Setting_editor.index},
                                                    // {src: `fa-sharp fa-regular fa-file-dashed-line`, index: Page_editor.index},
                                                ].map((da: any) => {
                                                    return `<i class="fa-regular ${da.src} fs-5 fw-bold ${(selectPosition === `${da.index}`) ? `text-primary` : ``}  p-2 rounded" style="cursor:pointer;${(selectPosition === `${da.index}`) ? `background-color: rgba(10,83,190,0.1);` : ``}"
onclick="${gvc.event(() => {
                                                        viewModel.waitCopy = undefined
                                                        viewModel.selectItem = undefined
                                                        glitter.setUrlParameter(`editorPosition`, `${da.index}`)
                                                        gvc.notifyDataChange(createID)
                                                    })}"></i>`
                                                }).join('')}
                                            </div>
                                            <div class="offcanvas-body swiper scrollbar-hover  w-100 ${(() => {
                                                switch (selectPosition) {
                                                    case Setting_editor.index:
                                                    case Main_editor.index:
                                                        return `pt-0`
                                                    case Page_editor.index:
                                                        return `p-0`
                                                    default:
                                                        return `p-0`
                                                }
                                            })()}" style="overflow-y: auto;overflow-x:hidden;height:calc(100vh - 56px);">
                                                <div class="h-100" style="">
                                                    ${gvc.bindView(() => {
                                                        return {
                                                            bind: 'MainEditorLeft',
                                                            view: () => {
                                                                switch (selectPosition) {
                                                                    case Setting_editor.index:
                                                                        return Setting_editor.left(gvc, viewModel, createID, gBundle)
                                                                    case Page_editor.index:
                                                                        return Page_editor.left(gvc, viewModel, createID, gBundle)
                                                                    case Plugin_editor.index:
                                                                        return Plugin_editor.left(gvc, viewModel, createID, gBundle)
                                                                    default:
                                                                        return Main_editor.left(gvc, viewModel, createID, gBundle)
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
                            var elementRect = element.getBoundingClientRect();
                            var elementTop = elementRect.top;
                            var elementHeight = elementRect.height;

                            // 获取窗口的高度
                            var windowHeight = document.querySelector('.scrollbar-hover')!.scrollHeight;
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


