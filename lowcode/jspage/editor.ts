import {GVC} from '../glitterBundle/GVController.js';
import {Main_editor} from "./function-page/main_editor.js";
import {Page_editor} from "./function-page/page_editor.js";
import {Setting_editor} from "./function-page/setting_editor.js";
import {Plugin_editor} from "./function-page/plugin_editor.js";
import {PageEditor} from "../editor/page-editor.js";
import {EditorElem} from "../glitterBundle/plugins/editor-elem.js";
import {fileManager} from "../setting/appSetting.js";
import {ShareDialog} from "../dialog/ShareDialog.js";
import Add_item_dia from "../glitterBundle/plugins/add_item_dia.js";
import {FormWidget} from "../official_view_component/official/form.js";
import {BgGlobalEvent} from "../backend-manager/bg-global-event.js";
import {DialogInterface} from "../dialog/dialog-interface.js";
import {ApiPageConfig} from "../api/pageConfig.js";
import {Storage} from "../helper/storage.js";
import {PageSettingView} from "../editor/page-setting-view.js";
import {AddPage} from "../editor/add-page.js";
import {SetGlobalValue} from "../editor/set-global-value.js";

export enum ViewType {
    mobile = "mobile",
    desktop = "desktop",
    col3 = "col3",
    fullScreen = "fullScreen"
}

export class Editor {
    public create: (left: string, right: string) => string;

    constructor(gvc: GVC, data: any) {

        const html = String.raw
        const glitter = gvc.glitter;
        const $ = gvc.glitter.$;
        gvc.addStyle(`
            .tab-pane {
                word-break: break-word;
                white-space: normal;
            }
        `);
        gvc.addStyle(`
            .accordion-body {
                word-break: break-word;
                white-space: normal;
            }
            h1,
            h2,
            h3,
            h4 {
                white-space: normal;
                word-break: break-word;
            }
        `);
        gvc.addStyle(`div{word-break: break-word;white-space: nowrap;}`);
        const viewModel: { type: string } = {
            "type": Storage.view_type ?? ViewType.col3
        }
        this.create = (left: string, right: string) => {
            function getEditorTitle() {
                return (glitter.share.blogEditor) ? `編輯Blog文章` :
                    `CODENEX.EDITOR<span class="ms-1" style="font-size: 11px;">${glitter.share.editerVersion}</span>`
            }

            return html`
                <div class="position-relative vh-100 vw-100 overflow-auto"
                     style="word-break: break-word;white-space: nowrap;background:whitesmoke;">
                    <!-- Navbar -->
                    <header
                            class="header navbar navbar-expand navbar-light bg-light border-bottom border-light shadow fixed-top"
                            data-scroll-header
                            style="height: 56px;">
                        <div class="container-fluid pe-lg-4">
                            <div class="navbar-brand text-dark d-none d-lg-flex py-0 h-100">
                                <div class="d-flex align-items-center justify-content-center border-end "
                                     style="width:50px;height: 56px;">
                                    <i class="fa-regular fa-arrow-left-from-arc hoverBtn" style="cursor:pointer;"
                                       onclick="${gvc.event(() => {
                                           if (window.parent && (window.parent as any).glitter) {
                                               (window.parent as any).glitter.closeDiaLog()
                                           } else {
                                               location.href = 'index.html'
                                           }
                                       })}">

                                    </i>
                                </div>
                                ${
                                        (glitter.share.blogEditor) ? `
                                        <span class="ms-3 fw-500" style="  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
   background: -webkit-linear-gradient(135deg, #667eea 0%, #764ba2 100%);
   background-clip: text;
   -webkit-background-clip: text;
   color: transparent;">${getEditorTitle()}</span>
                                        ` : `<span class="ms-3 fw-500" style="  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
   background: -webkit-linear-gradient(135deg, #667eea 0%, #764ba2 100%);
   background-clip: text;
   -webkit-background-clip: text;
   color: transparent;">${getEditorTitle()}</span>
                                        `
                                }
                            </div>
                            <div style="width:${(glitter.getUrlParameter('blogEditor')) ? `100px` : `20px`};"></div>
                            
                            <div class="d-flex align-items-center flex-fill ${(Storage.select_function==='page-editor') ? ``:`d-none`}" style="">
                               
                                ${gvc.bindView(()=>{
                                    const id=gvc.glitter.getUUID()
                                    return {
                                        bind:id,
                                        view:()=>{
                                            return `  <div class="hoverBtn  d-flex align-items-center justify-content-center   border"
                                     style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                     onclick="${gvc.event(() => {
                                                SetGlobalValue.toggle(true)
                                            })}"
                                     data-bs-toggle="tooltip" data-bs-placement="top"
                                     data-bs-custom-class="custom-tooltip"
                                     data-bs-title="全域設置"
                                >
                                    <i class="fa-solid fa-bars"></i>
                                </div>`
                                        },
                                        onCreate:()=>{
                                            $('.tooltip').remove();
                                            $('[data-bs-toggle="tooltip"]').tooltip();  
                                        }
                                    }
                                })}
                               
                                <div class="flex-fill"></div>
                                <div class="d-flex align-items-center justify-content-center hoverBtn me-1 border"
                                     style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                     data-bs-toggle="tooltip" data-bs-placement="top"
                                     data-bs-custom-class="custom-tooltip"
                                     data-bs-title="頁面編輯"
                                     onclick="${gvc.event(() => {
                                         PageSettingView.toggle(true)
                                     })}">
                                    <i class="fa-regular fa-gear"></i>
                                </div>
                                <div class="btn-group ms-1" style="max-width: 350px;min-width: 250px;">
                                    <button type="button" class="btn btn-outline-secondary rounded px-2"
                                            onclick="${gvc.event(() => {
                                                $('#topd').toggle()
                                            })}">
                                        <span style="max-width: 180px;overflow: hidden;text-overflow: ellipsis;">${data.data.name}</span>
                                        <i class="fa-sharp fa-solid fa-caret-down position-absolute translate-middle-y"
                                           style="top: 50%;right: 20px;"></i>
                                    </button>
                                    ${
                                            gvc.bindView(() => {
                                                const id = gvc.glitter.getUUID()
                                                return {
                                                    bind: id,
                                                    view: () => {
                                                        return html`
                                                            <div class="d-flex align-items-center justify-content-around  w-100 border-bottom pb-2">
                                                                ${(() => {
                                                                    const list: {
                                                                        title: string,
                                                                        icon: string,
                                                                        type: string
                                                                    }[] = [
                                                                        {
                                                                            title: '網頁',
                                                                            icon: 'fa-sharp fa-regular fa-memo',
                                                                            type: 'page'
                                                                        },
                                                                        {
                                                                            title: '嵌入模塊',
                                                                            icon: 'fa-regular fa-block',
                                                                            type: 'module'
                                                                        },
                                                                        {
                                                                            title: '網誌模板',
                                                                            icon: 'fa-regular fa-file-dashed-line',
                                                                            type: 'article'
                                                                        },
                                                                        {
                                                                            title: '網誌文章',
                                                                            icon: 'fa-solid fa-blog',
                                                                            type: 'blog'
                                                                        }
                                                                    ];
                                                                    return list.map((dd: any) => {
                                                                        if (dd.type === Storage.select_page_type) {
                                                                            return html`
                                                                                <div class=" d-flex align-items-center justify-content-center border rounded-3"
                                                                                     style="height:36px;width:36px;cursor:pointer;
background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);background:-webkit-linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:white;
" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip" data-bs-title="${dd.title}">
                                                                                    <i class="${dd.icon}"></i>
                                                                                </div>`
                                                                        } else {
                                                                            return html`
                                                                                <div class=" d-flex align-items-center justify-content-center  rounded-3"
                                                                                     style="height:36px;width:36px;cursor:pointer;color:#151515;" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip" data-bs-title="${dd.title}"
                                                                                     onclick="${gvc.event(() => {
                                                                                         Storage.select_page_type = dd.type as any
                                                                                         gvc.notifyDataChange(id)
                                                                                         $('#topd').toggle()
                                                                                     })}">
                                                                                    <i class="${dd.icon}"></i>
                                                                                </div>`
                                                                        }
                                                                    }).join('')
                                                                })()}
                                                            </div>
                                                            <ul class="list-group list-group-flush  mt-2">
                                                                ${(() => {
                                                                    return gvc.bindView(() => {
                                                                        const id = glitter.getUUID()
                                                                        return {
                                                                            bind: id,
                                                                            view: () => {
                                                                                return new Promise(async (resolve, reject) => {
                                                                                    PageEditor.pageSelctor(gvc, (d3: any) => {
                                                                                        console.log(d3)
                                                                                        glitter.share.clearSelectItem()
                                                                                        data.data = d3
                                                                                        glitter.setUrlParameter('page', d3.tag)
                                                                                        glitter.share.reloadEditor()
                                                                                    },{
                                                                                        filter:(data)=>{
                                                                                            return data.page_type==Storage.select_page_type
                                                                                        }
                                                                                    }).then((data) => {
                                                                                        resolve(data.left)
                                                                                    })
                                                                                })
                                                                            },
                                                                            divCreate: {
                                                                                class: `ms-n2 mt-n2`
                                                                            }
                                                                        }
                                                                    })
                                                                })()}
                                                            </ul>`
                                                    },
                                                    divCreate: {
                                                        class: 'dropdown-menu',
                                                        style: 'margin-top: 50px;max-height: calc(100vh - 100px);width:300px;overflow-y: scroll;',
                                                        option: [
                                                            {key: 'id', value: 'topd'}
                                                        ]
                                                    },
                                                    onCreate:()=>{
                                                        $('.tooltip')!.remove();
                                                        ($('[data-bs-toggle="tooltip"]') as any).tooltip();
                                                    }
                                                }
                                            })
                                    }
                                </div>
                                <div class="d-flex align-items-center justify-content-center hoverBtn ms-2 me-1 border"
                                     style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                     data-bs-toggle="tooltip" data-bs-placement="top"
                                     data-bs-custom-class="custom-tooltip"
                                     data-bs-title="添加頁面"
                                     onclick="${gvc.event(() => {
                                         AddPage.toggle(true)
                                     })}">
                                    <i class="fa-regular fa-circle-plus"></i>
                                </div>
                                <div class="flex-fill"></div>
                                ${(() => {
                                    if (glitter.share.blogEditor) {
                                        if (glitter.share.blogPage !== glitter.getUrlParameter('page')) {
                                            return `<button class="btn btn-secondary" style="height: 40px;" onclick="${
                                                    gvc.event(() => {
                                                        glitter.setUrlParameter('page', glitter.share.blogPage)
                                                        glitter.share.reloadEditor()
                                                    })
                                            }">返回編輯文章內容</button>`
                                        }
                                        return []
                                    } else {
                                        return [
                                            html`
                                                <div class="d-flex align-items-center justify-content-center hoverBtn  border d-none"
                                                     style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                                     onclick="${gvc.event(() => {
                                                         EditorElem.openEditorDialog(gvc, (gvc) => {
                                                             return BgGlobalEvent.mainPage(gvc)
                                                         }, () => {

                                                         }, 800, '事件集管理')
                                                     })}"
                                                     data-bs-toggle="tooltip" data-bs-placement="top"
                                                     data-bs-custom-class="custom-tooltip"
                                                     data-bs-title="事件集"
                                                ><i class="fa-sharp fa-regular fa-brackets-curly"></i>
                                                </div>`
                                        ].join(`<div class="me-1"></div>`)
                                    }
                                })()}
                                <div class="d-flex align-items-center justify-content-center hoverBtn ms-1 me-2 border"
                                     style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                     data-bs-toggle="tooltip" data-bs-placement="top"
                                     data-bs-custom-class="custom-tooltip"
                                     data-bs-title="預覽應用"
                                     onclick="${gvc.event(() => {
                                         const url = new URL("", (glitter.share.editorViewModel.domain) ? `https://${glitter.share.editorViewModel.domain}/?page=index` : location.href)
                                         url.searchParams.delete('type')
                                         url.searchParams.set("page", glitter.getUrlParameter("page"))
                                         glitter.openNewTab(url.href)
                                     })}">
                                    <i class="fa-regular fa-eye"></i>
                                </div>

                                ${gvc.bindView({
                                    bind: `showViewIcon`,
                                    view: () => {
                                        glitter.setCookie("ViewType", viewModel.type)
                                        return html`
                                            <div style="background:#f1f1f1;border-radius:10px;"
                                                 class="d-flex align-items-center justify-content-center p-1 ">
                                                ${[
                                                    {icon: 'fa-regular fa-columns-3', type: ViewType.col3},
                                                    {icon: 'fa-regular fa-desktop', type: ViewType.desktop},
                                                    {icon: 'fa-regular fa-mobile', type: ViewType.mobile},
                                                    {icon: 'fa-solid fa-expand', type: ViewType.fullScreen}
                                                ].map((dd) => {
                                                    if (dd.type === viewModel.type) {
                                                        return html`
                                                            <div class="d-flex align-items-center justify-content-center bg-white"
                                                                 style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;">
                                                                <i class="${dd.icon}"></i>
                                                            </div>`
                                                    } else {
                                                        return html`
                                                            <div class="d-flex align-items-center justify-content-center"
                                                                 style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                                                 onclick="${gvc.event(() => {
                                                                     viewModel.type = dd.type
                                                                     glitter.setCookie("ViewType", viewModel.type)
                                                                     gvc.notifyDataChange('HtmlEditorContainer')
                                                                 })}">
                                                                <i class="${dd.icon}"></i>
                                                            </div>`
                                                    }
                                                    return ``
                                                }).join('')}
                                            </div>`
                                    },
                                    divCreate: {}
                                })}
                                <button class=" btn ms-2 btn-primary-c ${(glitter.getUrlParameter('editorPosition') === '2') ? `d-none` : ``}"
                                        style="height: 30px;width: 60px;"
                                        onclick="${gvc.event(() => {
                                            glitter.htmlGenerate.saveEvent()
                                        })}">儲存
                                </button>
                            </div>
                        </div>

                    </header>
                    <aside
                            id="componentsNav"
                            class="${(viewModel.type === ViewType.fullScreen) ? `d-none` : ``} offcanvas offcanvas-start offcanvas-expand-lg position-fixed top-0 start-0 vh-100 bg-light border-end-lg overflow-hidden"
                            style="width: 20rem;"
                    >
                        <div class="offcanvas-header d-none d-lg-flex justify-content-start border-bottom px-0"
                             style="height: 56px;">
                            <div class="navbar-brand text-dark d-none d-lg-flex py-0 h-100">
                                <div class="d-flex align-items-center justify-content-center border-end "
                                     style="width:50px;height: 56px;">
                                    <i class="fa-regular fa-arrow-left-from-arc hoverBtn" style="cursor:pointer;"
                                       onclick="${gvc.event(() => {
                                           if (window.parent && (window.parent as any).glitter) {
                                               (window.parent as any).glitter.closeDiaLog()
                                           } else {
                                               location.href = 'index.html'
                                           }
                                       })}">

                                    </i>
                                </div>
                                <span class="ms-3 fw-500" style="  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
   background: -webkit-linear-gradient(135deg, #667eea 0%, #764ba2 100%);
   background-clip: text;
   -webkit-background-clip: text;
   color: transparent;">${getEditorTitle()}</span>

                            </div>
                        </div>
                        ${left}
                    </aside>
                    <!-- Page container -->
                    <main class="docs-container"
                          style="padding-top: 40px;padding-right:${((viewModel.type === ViewType.col3 || viewModel.type === ViewType.mobile) && Storage.select_function !== 'backend-manger' && Storage.select_function !== 'server-manager') ? `290` : `0`}px;${(viewModel.type === ViewType.fullScreen) ? `padding-left:0px;` : `
                          padding-left:20rem;
                          `}">
                        ${gvc.bindView({
                            dataList: [{obj: viewModel, key: "type"}],
                            bind: `showView`,
                            view: () => {
                                let selectPosition = glitter.getUrlParameter('editorPosition') ?? "0"
                                switch (selectPosition) {
                                    default:
                                        return Main_editor.center(viewModel, gvc)
                                }
                            },
                            divCreate: {}
                        })}
                    </main>
                    ${(() => {
                        if (((viewModel.type === ViewType.col3 || (viewModel.type === ViewType.mobile)) && Storage.select_function !== 'backend-manger' && Storage.select_function !== 'server-manager')) {
                            return Main_editor.pageAndComponent({
                                gvc: gvc,
                                data: data,
                                divCreate: {
                                    class: `p-0  side-nav-end  position-fixed top-0 end-0 vh-100 border-start  bg-white `,
                                    style: `width: 290px;padding-top:60px !important;`
                                },
                            })
                        } else {
                            return ``
                        }
                    })()}

                    <!-- Back to top button -->
                    <a href="#top" class="btn-scroll-top " data-scroll>
                        <span class="btn-scroll-top-tooltip text-muted fs-sm me-2" style="">Top</span>
                        <i class="btn-scroll-top-icon bx bx-chevron-up"></i>
                    </a>
                    <!--                  -->

                </div>
            `;
        };
    }
}
