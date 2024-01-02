import {GVC} from '../glitterBundle/GVController.js';
import {Main_editor} from "./main_editor.js";
import {Page_editor} from "./page_editor.js";
import {Setting_editor} from "./setting_editor.js";
import {Plugin_editor} from "./plugin_editor.js";
import {PageEditor} from "../editor/page-editor.js";
import {EditorElem} from "../glitterBundle/plugins/editor-elem.js";
import {fileManager} from "../setting/appSetting.js";
import {ShareDialog} from "../dialog/ShareDialog.js";
import Add_item_dia from "../glitterBundle/plugins/add_item_dia.js";
import {FormWidget} from "../official_view_component/official/form.js";

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
            "type": glitter.getCookieByName("ViewType") ?? ViewType.desktop
        }
        this.create = (left: string, right: string) => {
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
                                       onclick="location.href='index.html'">

                                    </i>
                                </div>
                                <span class="ms-3 fw-500" style="  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
   background: -webkit-linear-gradient(135deg, #667eea 0%, #764ba2 100%);
   background-clip: text;
   -webkit-background-clip: text;
   color: transparent;">GLITTER.EDITOR<span class="ms-1" style="font-size: 11px;">${glitter.share.editerVersion}</span></span>

                            </div>
                            <div style="width:30px;"></div>
                            <div class="d-flex align-items-center flex-fill" style="">
                                ${[
                                    `<div class="fw-bold fs-6 me-2 " style="color:black">應用配置</div>`,
                                    `<div class="hoverBtn ms-auto d-flex align-items-center justify-content-center    border"
                                     style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                     onclick="${gvc.event(() => {
                                        PageEditor.openDialog.seo_with_domain(gvc)
                                    })}">
                                    <i class="fa-sharp fa-regular fa-globe-pointer"></i>
                                </div>`,
                                    ` <div class="hoverBtn d-flex align-items-center justify-content-center   border " style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
  onclick="${gvc.event(() => {
                                        PageEditor.openDialog.plugin_setting(gvc)
                                    })}">
                                    <i class="fa-solid fa-puzzle-piece-simple"></i>

                                </div>`,
                                    ` <div class="d-flex align-items-center justify-content-center hoverBtn me-2 border"
                                     style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                     onclick="${gvc.event(() => {
                                        EditorElem.openEditorDialog(gvc, (gvc: GVC) => {
                                            return gvc.bindView(() => {
                                                return {
                                                    bind: gvc.glitter.getUUID(),
                                                    view: () => {
                                                        return new Promise(async (resolve, reject) => {
                                                            const data = await PageEditor.valueRender(gvc)
                                                            resolve(`
                                                                <div class="d-flex">
                          <div class="border-end" style="width:300px;overflow:hidden;"> ${data.left}</div>
                                                                ${data.right}                                       
</div>
                                                              
                                                                `)
                                                        })
                                                    }
                                                }
                                            })
                                        }, () => {

                                        }, 700, '共用資源管理')
                                    })}">
                                    <i class="fa-regular fa-folder"></i>
                                </div>`
                                ].join(`<div class="me-1"></div>`)}
                                <div class="flex-fill"></div>
                                <div class="btn-group " style=width:350px;">

                                    <button type="button" class="btn btn-outline-secondary rounded"
                                            onclick="${gvc.event(() => {
                                                $('#topd').toggle()
                                            })}">
                                        ${data.data.group + '/' + data.data.name}
                                        <i class="fa-sharp fa-solid fa-caret-down position-absolute translate-middle-y"
                                           style="top: 50%;right: 20px;"></i>
                                    </button>
                                    <div class="dropdown-menu" id="topd"
                                         style="margin-top: 50px;max-height: calc(100vh - 100px);width:300px;overflow-y: scroll;">
                                        <div
                                                class="fw-500 text-dark align-items-center justify-content-center d-flex p-1 rounded mt-0 hoverBtn mx-2 mb-3"
                                                style="border: 1px solid #151515;color:#151515;"
                                                onclick="${gvc.event(() => {
                                                    glitter.openDiaLog('dialog/addTemplate.js', 'addTemplate', {
                                                        vm: data
                                                    });
                                                })}"
                                        >
                                            <i class="fa-regular fa-circle-plus d-flex align-items-center justify-content-center subBt "></i>
                                            添加頁面
                                        </div>
                                        <ul class="list-group list-group-flush  ">
                                            ${(() => {
                                                return gvc.bindView(() => {
                                                    const id = glitter.getUUID()
                                                    return {
                                                        bind: id,
                                                        view: () => {
                                                            return new Promise(async (resolve, reject) => {
                                                                PageEditor.pageSelecter(gvc, (d3: any) => {
                                                                    console.log(d3)
                                                                    glitter.share.clearSelectItem()
                                                                    data.data = d3
                                                                    glitter.setUrlParameter('page', d3.tag)
                                                                    glitter.share.reloadEditor()
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
//                                              
                                            })()}
                                        </ul>
                                    </div>
                                </div>
                                <div class="flex-fill"></div>
                                <div class="d-flex align-items-center justify-content-center  me-2 border ${(glitter.share.inspect) ? `activeBtn` : ``}"
                                     style="height:36px;width:36px;border-radius:10px;cursor:pointer;"
                                     onclick="${gvc.event(() => {
                                         glitter.share.inspect = !glitter.share.inspect
                                         glitter.share.editorViewModel.selectItem = undefined
                                         glitter.share.editorViewModel.selectContainer = undefined
                                         glitter.setCookie('lastSelect', '');
                                         gvc.notifyDataChange('HtmlEditorContainer')
                                     })}">
                                    <i class="fa-sharp fa-regular fa-arrow-pointer"></i>
                                </div>
                                <div class="d-flex align-items-center justify-content-center hoverBtn me-2 border"
                                     style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
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
                                       onclick="location.href='index.html'">

                                    </i>
                                </div>
                                <span class="ms-3 fw-500" style="  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
   background: -webkit-linear-gradient(135deg, #667eea 0%, #764ba2 100%);
   background-clip: text;
   -webkit-background-clip: text;
   color: transparent;">GLITTER.EDITOR<span class="ms-1" style="font-size: 11px;">${glitter.share.editerVersion}</span></span>

                            </div>
                        </div>
                        ${left}
                    </aside>
                    <!-- Page container -->
                    <main class="docs-container"
                          style="padding-top: 40px;padding-right:${((viewModel.type === ViewType.col3 || viewModel.type === ViewType.mobile) && glitter.getUrlParameter('editorPosition') !== Setting_editor.index) ? `290` : `0`}px;${(viewModel.type === ViewType.fullScreen) ? `padding-left:0px;` : `
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
                        if (((viewModel.type === ViewType.col3 || (viewModel.type === ViewType.mobile)) && glitter.getUrlParameter('editorPosition') !== Setting_editor.index)) {
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
