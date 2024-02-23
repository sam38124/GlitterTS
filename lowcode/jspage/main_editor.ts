import {GVC} from "../glitterBundle/GVController.js";
import {Swal} from "../modules/sweetAlert.js";
import Add_item_dia from "../glitterBundle/plugins/add_item_dia.js";
import {EditorElem} from "../glitterBundle/plugins/editor-elem.js";
import {PageEditor} from "../editor/page-editor.js";
import {fileManager} from "../setting/appSetting.js";
import {ShareDialog} from "../dialog/ShareDialog.js";
import {allKeys} from "underscore";
import {Setting_editor} from "./setting_editor.js";
import {HtmlGenerate} from "../glitterBundle/module/html-generate.js";
import {TriggerEvent} from "../glitterBundle/plugins/trigger-event.js";
import {ApiPageConfig} from "../api/pageConfig.js";
import {Storage} from "../helper/storage.js";


enum ViewType {
    mobile = "mobile",
    desktop = "desktop",
    col3 = "col3",
    fullScreen = "fullScreen"
}

const html = String.raw

export class Main_editor {
    public static left(gvc: GVC, viewModel: any, createID: string, gBundle: any) {

        const swal = new Swal(gvc);
        const glitter = gvc.glitter
        return gvc.bindView(() => {
            glitter.debugMode = true;
            const vid = glitter.getUUID();
            return {
                bind: vid,
                view: () => {
                    function checkSelect(array: any) {
                        array.map((dd: any) => {
                            if (dd.id === glitter.getCookieByName('lastSelect')) {
                                viewModel.selectContainer = array
                                viewModel.selectItem = dd
                            } else if (Array.isArray(dd.data.setting)) {
                                checkSelect(dd.data.setting)
                            }
                        })
                    }

                    checkSelect((viewModel.data! as any).config)

                    if ((glitter.getCookieByName("ViewType") === ViewType.col3) || (glitter.getCookieByName("ViewType") === ViewType.mobile)) {
                        gvc.notifyDataChange('right_NAV')
                    }
                    if (viewModel.selectItem && (glitter.getCookieByName("ViewType") !== ViewType.col3) && (glitter.getCookieByName("ViewType") !== ViewType.mobile) &&
                        (viewModel.selectItem.type !== 'code') && (viewModel.selectItem.type !== 'widget' || (viewModel.selectItem.data.elem !== 'style' && viewModel.selectItem.data.elem !== 'link' && viewModel.selectItem.data.elem !== 'script'))) {
                        return Main_editor.pageAndComponent({
                            gvc: gvc,
                            data: viewModel
                        })
                    } else {
                        return html`
                            <li class="w-100 align-items-center  d-flex editor_item_title  start-0 bg-white z-index-9"
                                style="z-index: 999;"
                                onclick="${gvc.event(() => {
                                })}"
                            >

                                <span style="font-size:14px;">${viewModel.data.name}-區段</span>
                                <div class="hoverBtn d-flex align-items-center justify-content-center   border ms-auto me-2"
                                     style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                     onclick="${gvc.event(() => {
                                         glitter.share.editorViewModel.selectContainer = glitter.share.editorViewModel.data.config
                                         gvc.glitter.innerDialog((gvc: GVC) => {
                                             return Add_item_dia.view(gvc)
                                         }, 'Add_Item')
                                     })}">
                                    <i class="fa-regular fa-circle-plus"></i>
                                </div>
                            </li>


                            ${(() => {
                                return gvc.map([
                                    html`
                                        <div class="d-flex ms-2  px-2   hi fw-bold d-flex align-items-center border-bottom d-none"
                                             style="color:#151515;font-size:14px;gap:0px;">頁面-區段
                                            <div class="flex-fill"></div>
                                            <l1 class="btn-group dropend me-0" onclick="${gvc.event(() => {
                                                viewModel.selectContainer = (viewModel.data! as any).config
                                            })}">
                                                <div class="editor_item d-none  px-2 me-0" style="cursor:pointer; "
                                                     onclick="${gvc.event(() => {
                                                         viewModel.selectContainer = (viewModel.data! as any).config
                                                         glitter.share.pastEvent()
                                                     })}">
                                                    <i class="fa-duotone fa-paste"></i>
                                                </div>
                                                <div class="editor_item   px-2 ms-0 me-n1"
                                                     style="cursor:pointer;gap:5px;" onclick="${gvc.event(() => {
                                                    viewModel.selectContainer = (viewModel.data! as any).config
                                                    gvc.glitter.innerDialog((gvc: GVC) => {
                                                        return Add_item_dia.view(gvc)
                                                    }, 'Add_Item')
                                                })}">
                                                    <i class="fa-regular fa-circle-plus"></i>
                                                </div>
                                            </l1>
                                        </div>`,
                                    (() => {
                                        let pageConfig = ((viewModel.data! as any).config.filter((dd: any, index: number) => {
                                            return (dd.type !== 'code') && (dd.type !== 'widget' || (dd.data.elem !== 'style' && dd.data.elem !== 'link' && dd.data.elem !== 'script'))
                                        }))

                                        function setPageConfig() {
                                            (viewModel.data! as any).config = pageConfig.concat(((viewModel.data! as any).config.filter((dd: any, index: number) => {
                                                        return !((dd.type !== 'code') && (dd.type !== 'widget' || (dd.data.elem !== 'style' && dd.data.elem !== 'link' && dd.data.elem !== 'script')))
                                                    })
                                            ));
                                            try {
                                                viewModel.dataList.find((dd: any) => {
                                                    return dd.tag === viewModel.data.tag
                                                }).config = (viewModel.data! as any).config;
                                                pageConfig = (viewModel.data! as any).config
                                            } catch (e) {

                                            }

                                            gvc.notifyDataChange(vid)
                                        }

                                        return new PageEditor(gvc, 'MainEditorLeft', 'MainEditorRight').renderLineItem(pageConfig, false, pageConfig, {
                                            selectEv: (dd) => {
                                                return dd.id === glitter.getCookieByName('lastSelect')
                                            },
                                            refreshEvent: () => {
                                                setPageConfig()
                                            }
                                        })
                                    })()

                                ])
                            })()}
                        `

                    }
                },
                divCreate: {class: `swiper-slide h-100 position-relative`},
                onCreate: () => {
                    const htmlGenerate = new gvc.glitter.htmlGenerate((viewModel.data! as any).config, [glitter.getCookieByName('lastSelect')], undefined, true);
                    (window as any).editerData = htmlGenerate;
                    (window as any).page_config = (viewModel.data! as any).page_config
                }
            }
        })
    }

    public static right(gvc: GVC, viewModel: any, createID: string, gBundle: any) {
        alert('s')
        const glitter = gvc.glitter
        return gvc.bindView(() => {
            let haveAdd = true;
            return {
                bind: `htmlGenerate`,
                view: () => {
                    let hoverList: string[] = [];
                    if (viewModel.selectItem !== undefined) {
                        hoverList.push((viewModel.selectItem as any).id);
                    }

                    alert('s')
                    if (!viewModel.selectItem) {
                        return `<div class="position-absolute w-100 top-50 d-flex align-items-center justify-content-center flex-column translate-middle-y">
<iframe src="https://embed.lottiefiles.com/animation/84663" class="w-100" style="width: 400px;height: 400px"></iframe>
<h3>請於左側選擇元件編輯</h3>
</div>`
                    }
                    const htmlGenerate = new glitter.htmlGenerate((viewModel.data! as any).config, hoverList, undefined, true);
                    (window as any).editerData = htmlGenerate;
                    (window as any).page_config = (viewModel.data! as any).page_config
                    const json = JSON.parse(JSON.stringify((viewModel.data! as any).config));
                    json.map((dd: any) => {
                        dd.refreshAllParameter = undefined;
                        dd.refreshComponentParameter = undefined;
                    });

                    return htmlGenerate.editor(gvc, {
                        return_: false,
                        refreshAll: () => {
                            if (viewModel.selectItem) {
                                gvc.notifyDataChange(['showView']);
                            }
                        },
                        setting: (() => {
                            if (viewModel.selectItem) {
                                return [viewModel.selectItem];
                            } else {
                                return undefined;
                            }
                        })(),
                        deleteEvent: () => {
                            viewModel.selectItem = undefined
                            gvc.notifyDataChange(createID);
                        }
                    });
                },
                divCreate: {},
                onCreate: () => {
                    setTimeout(() => {
                        $('#jumpToNav').scrollTop(parseInt(glitter.getCookieByName('jumpToNavScroll'), 10) ?? 0)
                    }, 1000)

                }
            };
        })
    }

    public static editorContent(option: {
        gvc: GVC,
        viewModel: any
    }) {
        const glitter = option.gvc.glitter
        const viewModel = option.viewModel
        const gvc = option.gvc

        function checkSelect(array: any) {
            array.map((dd: any) => {
                if (dd.id === glitter.getCookieByName('lastSelect')) {
                    viewModel.selectContainer = array
                    viewModel.selectItem = dd
                } else if (Array.isArray(dd.data.setting)) {
                    checkSelect(dd.data.setting)
                }
            })
        }

        return [html`
            <div class=" " style="overflow-y:auto;height:calc(100vh - 200px)">
                ${gvc.bindView(() => {
                    return {
                        bind: `htmlGenerate`,
                        view: () => {
                            gvc.notifyDataChange('editFooter')
                            checkSelect((viewModel.data! as any).config)
                            if (viewModel.selectItem === undefined || viewModel.selectItem.js === undefined) {
                                return `<div class="position-absolute w-100 top-50 d-flex align-items-center justify-content-center flex-column translate-middle-y">
<img class="border" src="https://liondesign-prd.s3.amazonaws.com/file/252530754/1692927479829-Screenshot 2023-08-25 at 9.36.15 AM.png"  >
<lottie-player src="https://lottie.host/23df5e29-6a51-428a-b112-ff6901c4650e/yxNS0Bw8mk.json" class="position-relative" background="transparent" speed="1" style="margin-top:-70px;" loop  autoplay direction="1" mode="normal"></lottie-player>
<div style="font-size:16px;margin-top:-10px;width:calc(100% - 20px);word-break:break-all !important;display:inline-block;white-space:normal;" class="p-2 text-center alert alert-secondary" >
請直接點擊頁面元件，或於左側頁面區段來選擇元件進行編輯。</div>
</div>`
                            }

                            let hoverList: string[] = [];
                            if (viewModel.selectItem !== undefined) {
                                hoverList.push((viewModel.selectItem as any).id);
                            }
                            const htmlGenerate = new glitter.htmlGenerate((viewModel.data! as any).config, hoverList, undefined, true);
                            (window as any).editerData = htmlGenerate;
                            (window as any).page_config = (viewModel.data! as any).page_config
                            const json = JSON.parse(JSON.stringify((viewModel.data! as any).config));
                            json.map((dd: any) => {
                                dd.refreshAllParameter = undefined;
                                dd.refreshComponentParameter = undefined;
                            });
                            return htmlGenerate.editor(gvc, {
                                return_: false,
                                refreshAll: () => {
                                    if (viewModel.selectItem) {
                                        gvc.notifyDataChange(['showView']);
                                    }
                                },
                                setting: (() => {
                                    if (viewModel.selectItem) {
                                        return [viewModel.selectItem];
                                    } else {
                                        return undefined;
                                    }
                                })(),
                                deleteEvent: () => {
                                }
                            })
                        },
                        divCreate: {
                            class: `p-2`
                        },
                        onCreate: () => {
                            setTimeout(() => {
                                $('#jumpToNav').scrollTop(parseInt(glitter.getCookieByName('jumpToNavScroll'), 10) ?? 0)
                            }, 1000)
                        }
                    };
                })}
                <div class="w-100" style="height:100px;"></div>
            </div>
        `,
            gvc.bindView(() => {
                return {
                    bind: 'editFooter',
                    view: () => {
                        if (viewModel.selectItem === undefined || viewModel.selectItem.js === undefined) {
                            return ``
                        }
                        return `
<div style="height:100px;"></div>
<div class="w-100  position-absolute bottom-0 border-top d-flex align-items-center ps-3"
                     style="height:50px;background:#f6f6f6;font-size:14px;">
                    <div class="hoverBtn fw-bold" style="color:#8e1f0b;cursor:pointer;"
                         onclick="${gvc.event(() => {
                            checkSelect((viewModel.data! as any).config)
                            try {
                                const dialog = new ShareDialog(gvc.glitter)

                                function deleteBlock() {
                                    for (let a = 0; a < viewModel.selectContainer.length; a++) {
                                        if (viewModel.selectContainer[a] == viewModel.selectItem) {
                                            viewModel.selectContainer.splice(a, 1)
                                        }
                                    }
                                    viewModel.selectItem = undefined
                                    gvc.notifyDataChange(['HtmlEditorContainer']);
                                }

                                if (viewModel.selectItem.type === 'component') {
                                    dialog.checkYesOrNot({
                                        text: '是否連同模塊一同刪除?',
                                        callback: (response) => {
                                            if (response) {
                                                new Promise(async (resolve, reject) => {
                                                    dialog.dataLoading({visible: true})
                                                    let deleteArray: string[] = [viewModel.selectItem.tag]
                                                    viewModel.selectItem.list && viewModel.selectItem.list.map((dd: any) => {
                                                        deleteArray.push(dd.tag)
                                                    })
                                                    for (const b of deleteArray) {
                                                        await new Promise((resolve, reject) => {
                                                            ApiPageConfig.deletePage({
                                                                "appName": (window as any).appName,
                                                                tag: b
                                                            }).then((data) => {
                                                                resolve(true)
                                                            })
                                                        })
                                                    }
                                                    deleteBlock()
                                                    dialog.dataLoading({visible: false})
                                                    glitter.htmlGenerate.saveEvent(true)
                                                })

                                            } else {
                                                deleteBlock()
                                            }
                                        }
                                    })
                                } else {
                                    deleteBlock()
                                }
                            } catch (e) {
                                alert(e)
                            }


                        })}">
                        <i class="fa-solid fa-trash-can me-2"></i>移除區塊
                    </div>
                </div>`
                    }
                }
            })
        ].join('')
    }

    public static center(viewModel: any, gvc: GVC) {
        return html`
            <div class="${(viewModel.type === ViewType.mobile && gvc.glitter.getUrlParameter('editorPosition') !== '2') ? `d-flex align-items-center justify-content-center flex-column mx-auto` : `d-flex align-items-center justify-content-center flex-column`}"
                 style="${(viewModel.type === ViewType.mobile && gvc.glitter.getUrlParameter('editorPosition') !== '2') ? `width: 414px;height: calc(100vh - 50px);padding-top: 20px;` : `width: calc(100% - 20px);margin-left:10px;height: calc(100vh - 50px);padding-top: 20px;"`}">
                <div class="" style="width:100%;height: calc(100%);" id="editerCenter">
                    <iframe class="w-100 h-100 rounded bg-white"
                            src="index.html?type=htmlEditor&page=${gvc.glitter.getUrlParameter('page')}&appName=${gvc.glitter.getUrlParameter('appName')}"></iframe>
                </div>
            </div>`
    }

    public static pageAndComponent(option: {
        gvc: GVC,
        data: any,
        divCreate?: any
    }) {
        const data = option.data
        const gvc = option.gvc
        const glitter = gvc.glitter;
        return gvc.bindView(() => {
            const id = 'right_NAV'
            return {
                bind: id,
                view: () => {
                    return gvc.bindView(() => {
                        const vm = {
                            pageID: gvc.glitter.getUUID(),
                            get select() {
                                return localStorage.getItem('uasi') || 'layout'
                            },
                            set select(v) {
                                localStorage.setItem('uasi', v)
                            },
                            selectItem: undefined
                        }
                        return {
                            bind: vm.pageID,
                            view: () => {
                                if (localStorage.getItem('rightSelect') === 'module') {
                                    localStorage.setItem('rightSelect', 'page')
                                    vm.select = 'codeBlock'
                                    gvc.notifyDataChange(vm.pageID)
                                }
                                let array = [];
                                if (!vm.selectItem) {
                                    array.push(html`
                                        <div class="d-flex bg-white w-100 border-bottom">
                                            <div class="w-100" style="">
                                                <div style=""
                                                     class="d-flex align-items-center justify-content-around  w-100 p-2">
                                                    ${(() => {
                                                        const items = [
                                                            {
                                                                title: '頁面內容',
                                                                value: 'layout',
                                                                icon: 'fa-regular fa-memo'
                                                            },
                                                            {
                                                                title: 'SEO相關配置',
                                                                value: 'basic',
                                                                icon: 'fa-regular fa-magnifying-glass'
                                                            },
                                                            {
                                                                title: '樣式設計',
                                                                value: 'style',
                                                                icon: 'fa-regular fa-regular fa-pen-swirl'
                                                            },
                                                            {
                                                                title: '觸發事件',
                                                                value: 'script',
                                                                icon: 'fa-regular fa-file-code'
                                                            },
                                                            {
                                                                title: '頁面原始碼',
                                                                value: 'code',
                                                                icon: 'fa-regular fa-regular fa-code'
                                                            },
                                                            {
                                                                title: '區段編輯',
                                                                value: 'codeBlock',
                                                                icon: 'fa-regular fa-brackets-curly'
                                                            }
                                                        ].filter((dd) => {
                                                            if (dd.value === 'basic' && Storage.select_page_type === 'module') {
                                                                return false
                                                            }
                                                            if ((Storage.editor_mode === 'user')) {
                                                                return ['layout', 'basic', 'codeBlock'].find((d2) => {
                                                                    return dd.value === d2
                                                                })
                                                            } else {
                                                                return true
                                                            }
                                                        })
                                                        if(!items.find((dd)=>{
                                                            return dd.value===vm.select
                                                        })){
                                                            vm.select=items[0].value
                                                        }

                                                        return items.map((dd) => {
                                                            return html`
                                                                <div class=" d-flex align-items-center justify-content-center ${(dd.value === vm.select) ? `border` : ``} rounded-3"
                                                                     style="height:36px;width:36px;cursor:pointer;
${(dd.value === vm.select) ? `background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);background:-webkit-linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:white;` : `color:#151515;`}
"
                                                                     onclick="${gvc.event(() => {
                                                                         vm.select = dd.value
                                                                         gvc.notifyDataChange(vm.pageID)
                                                                     })}"
                                                                     data-bs-toggle="tooltip" data-bs-placement="top"
                                                                     data-bs-custom-class="custom-tooltip"
                                                                     data-bs-title="${dd.title}">
                                                                    <i class="${dd.icon}"
                                                                       aria-hidden="true"></i>
                                                                </div>`
                                                        }).join(``)
                                                    })()}
                                                </div>
                                            </div>
                                        </div>`);
                                    (vm.select === 'codeBlock') && array.push(Main_editor.editorContent({
                                        gvc: gvc,
                                        viewModel: data
                                    }));
                                    (vm.select === 'layout') && (array.push(PageEditor.formSetting({
                                        gvc: gvc,
                                        id: glitter.getUUID(),
                                        vid: '',
                                        viewModel: gvc.glitter.share.editorViewModel.data
                                    })));
                                    (vm.select === 'basic') && (array.push(PageEditor.pageEditorView({
                                        gvc: gvc,
                                        id: glitter.getUUID(),
                                        vid: '',
                                        viewModel: {
                                            get selectItem() {
                                                return gvc.glitter.share.editorViewModel.data
                                            },
                                            get dataList() {
                                                return gvc.glitter.share.editorViewModel.dataList
                                            }
                                        }
                                    })));
                                    (vm.select === 'style') && (array.push(PageEditor.styleRenderSelector({
                                        gvc: gvc,
                                        vid: gvc.glitter.getUUID(),
                                        viewModel: {
                                            selectContainer: glitter.share.editorViewModel.data.config,
                                            globalStyle: glitter.share.editorViewModel.globalStyle,
                                            data: glitter.share.editorViewModel.data
                                        },
                                        docID: '',
                                        selectBack: (dd) => {
                                            EditorElem.openEditorDialog(gvc, (gvc: GVC) => {
                                                return PageEditor.styleRenderEditor({
                                                    gvc: gvc,
                                                    vid: gvc.glitter.getUUID(),
                                                    viewModel: {
                                                        selectItem: dd,
                                                        get globalStyle() {
                                                            return glitter.share.editorViewModel.globalStyle
                                                        },
                                                        set globalStyle(v) {
                                                            glitter.share.editorViewModel.globalStyle = v
                                                        },
                                                        data: glitter.share.editorViewModel.data
                                                    },
                                                    docID: '',
                                                    editFinish: () => {
                                                        vm.selectItem = undefined
                                                        gvc.notifyDataChange(vm.pageID)
                                                    }
                                                })
                                            }, () => {
                                                gvc.notifyDataChange(vm.pageID)
                                            }, 450, '編輯STYLE樣式')
                                        }
                                    })));
                                    (vm.select === 'script') && (array.push(PageEditor.scriptRenderSelector({
                                        gvc: gvc,
                                        vid: gvc.glitter.getUUID(),
                                        viewModel: {
                                            selectContainer: glitter.share.editorViewModel.data.config,
                                            globalScript: glitter.share.editorViewModel.globalScript,
                                            data: glitter.share.editorViewModel.data
                                        },
                                        docID: '',
                                        selectBack: (dd) => {
                                            EditorElem.openEditorDialog(gvc, (gvc: GVC) => {
                                                return PageEditor.scriptRenderEditor({
                                                    gvc: gvc,
                                                    vid: gvc.glitter.getUUID(),
                                                    viewModel: {
                                                        selectItem: dd,
                                                        get globalScript() {
                                                            return glitter.share.editorViewModel.globalScript
                                                        },
                                                        set globalScript(v) {
                                                            glitter.share.editorViewModel.globalScript = v
                                                        },
                                                        data: glitter.share.editorViewModel.data
                                                    },
                                                    docID: '',
                                                    editFinish: () => {
                                                        vm.selectItem = undefined
                                                        gvc.notifyDataChange(vm.pageID)
                                                    }
                                                })
                                            }, () => {
                                                gvc.notifyDataChange(vm.pageID)
                                            }, 450, '編輯SCRIPT與觸發事件')
                                        }
                                    })));
                                    (vm.select === 'code') && (array.push((() => {
                                        const json = JSON.parse(JSON.stringify(glitter.share.editorViewModel.data.config));
                                        json.map((dd: any) => {
                                            dd.refreshAllParameter = undefined;
                                            dd.refreshComponentParameter = undefined;
                                        });
                                        let value = JSON.stringify(json, null, '\t')
                                        return gvc.bindView(() => {
                                            const id = glitter.getUUID();
                                            return {
                                                bind: id,
                                                view: () => {
                                                    return html`
                                                        <div class="alert alert-danger flex-fill m-0 p-2 "
                                                             style="white-space: normal;word-break:break-all;">
                                                            此頁面的配置檔包含所有設計模組和觸發事件的代碼配置項目。<br>建議由熟悉程式開發的工程師進行編輯。
                                                        </div>
                                                        ${EditorElem.customCodeEditor({
                                                            gvc: gvc,
                                                            height: window.innerHeight - 350,
                                                            initial: value,
                                                            title: 'JSON配置參數',
                                                            callback: (data) => {
                                                                value = data;
                                                            },
                                                            language: 'json'
                                                        })}
                                                        <div class="d-flex w-100 mb-2 mt-2 justify-content-end"
                                                             style="gap:10px;">
                                                            <button class="btn btn-outline-secondary-c "
                                                                    style="flex:1;height:40px; width:calc(50% - 10px);"
                                                                    onclick="${gvc.event(() => {
                                                                        navigator.clipboard.writeText(JSON.stringify(json, null, '\t'));
                                                                    })}"><i
                                                                    class="fa-regular fa-copy me-2"></i>複製到剪貼簿
                                                            </button>
                                                            <button class="btn btn-primary-c "
                                                                    style="flex:1; height:40px; width:calc(50% - 10px);"
                                                                    onclick="${gvc.event(() => {
                                                                        const dialog = new ShareDialog(gvc.glitter)
                                                                        try {
                                                                            glitter.share.editorViewModel.data.config = JSON.parse(value)
                                                                            glitter.closeDiaLog()
                                                                            glitter.htmlGenerate.saveEvent()
                                                                        } catch (e: any) {
                                                                            dialog.errorMessage({text: "代碼輸入錯誤"})
                                                                            console.log(`${e}${e.stack}${e.line}`)
                                                                        }

                                                                    })}"><i
                                                                    class="fa-regular fa-floppy-disk me-2"></i>儲存
                                                            </button>
                                                        </div>
                                                    `
                                                },
                                                divCreate: {
                                                    class: `p-2`
                                                }
                                            }
                                        })
                                    })()));
                                }

                                return array.join('')
                            },
                            divCreate: {
                                style: `overflow-x:hidden;`
                            },
                            onCreate: () => {
                                $('.tooltip')!.remove();
                                ($('[data-bs-toggle="tooltip"]') as any).tooltip();
                            }
                        }
                    })
                },
                divCreate: option.divCreate || {
                    class: `w-100`,
                    style: `height:calc(100vh - 56px);overflow-y:auto;`
                }
            }
        })
    }

    public static index = '0'
}

function swapArr(arr: any, index1: number, index2: number) {
    const data = arr[index1];
    arr.splice(index1, 1);
    arr.splice(index2, 0, data);
}