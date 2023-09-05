import {GVC} from '../glitterBundle/GVController.js';
import {Main_editor} from "./main_editor.js";
import {Page_editor} from "./page_editor.js";
import {Setting_editor} from "./setting_editor.js";
import {Plugin_editor} from "./plugin_editor.js";

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
   color: transparent;">GLITTER.EDITOR </span>

                            </div>
                            <div class="d-flex align-items-center w-100">
                                <div class="flex-fill"></div>
                                <div class="btn-group " style=width:300px;">
                                    <button type="button" class="btn btn-outline-secondary rounded"
                                            onclick="${gvc.event(() => {
                                                $('#topd').toggle()
                                            })}">
                                        ${data.data.name}
                                        <i class="fa-sharp fa-solid fa-caret-down position-absolute translate-middle-y"
                                           style="top: 50%;right: 20px;"></i>
                                    </button>
                                    <div class="dropdown-menu" id="topd"
                                         style="margin-top: 50px;max-height: calc(100vh - 100px);width:300px;overflow-y: scroll;">
                                        <button href="" class="dropdown-item d-flex align-items-center "
                                                onclick="${gvc.event(() => {
                                                    glitter.openDiaLog('dialog/addTemplate.js', 'addTemplate', {
                                                        vm: data
                                                    });
                                                })}"><i
                                                class="d-flex align-items-center justify-content-center fa-solid fa-plus  bg-warning rounded-circle p-1 me-2 "
                                                style="width: 30px;height: 30px;"></i>添加頁面
                                        </button>
                                        <ul class="list-group list-group-flush border-bottom mt-2">
                                            ${(() => {
                                                let group: string[] = [];
                                                let selectGroup = ''
                                                let id = glitter.getUUID()
                                                data.dataList.map((dd: any) => {
                                                    if (dd.tag === glitter.getUrlParameter('page')) {
                                                        selectGroup = dd.group
                                                    }
                                                    if (group.indexOf(dd.group) === -1) {
                                                        group.push(dd.group)
                                                    }
                                                })
                                                return gvc.bindView(() => {
                                                    return {
                                                        bind: id,
                                                        view: () => {
                                                            return group.sort(function (a, b) {
                                                                // 按姓名的字母顺序排序
                                                                var nameA = a.toUpperCase();
                                                                var nameB = b.toUpperCase();
                                                                if (nameA < nameB) {
                                                                    return -1;
                                                                }
                                                                if (nameA > nameB) {
                                                                    return 1;
                                                                }
                                                                return 0;
                                                            }).map((dd) => {
                                                                return html`
                                                                            <l1 onclick="${gvc.event(() => {
                                                                                selectGroup = dd
                                                                                gvc.notifyDataChange(id)
                                                                            })}"
                                                                                class="list-group-item list-group-item-action border-0 d py-2 ${(selectGroup === dd) && 'active'} position-relative "
                                                                                style="border-radius: 0px;cursor: pointer;">
                                                                                ${dd || "未分類"}
                                                                            </l1>`
                                                                        + `<div class="collapse multi-collapse ${(selectGroup === dd) && 'show'}" style="margin-left: 10px;">
 ${data.dataList.filter((d2: any) => {
                                                                            return d2.group === dd
                                                                        }).sort((a: any, b: any) => {
                                                                            // 按姓名的字母顺序排序
                                                                            var nameA = a.name.toUpperCase();
                                                                            var nameB = b.name.toUpperCase();
                                                                            if (nameA < nameB) {
                                                                                return -1;
                                                                            }
                                                                            if (nameA > nameB) {
                                                                                return 1;
                                                                            }
                                                                            return 0;
                                                                        }).map((d3: any) => {
                                                                            if (d3.tag !== glitter.getUrlParameter('page')) {
                                                                                return `<a onclick="${gvc.event(() => {
                                                                                    glitter.share.clearSelectItem()
                                                                                    data.data = d3
                                                                                    glitter.setUrlParameter('page', d3.tag)
                                                                                    gvc.notifyDataChange('HtmlEditorContainer')
                                                                                })}"  class=" list-group-item list-group-item-action border-0 py-2 px-4"  style="border-radius: 0px;">${d3.name}</a>`
                                                                            } else {
                                                                                return `<a   class=" list-group-item list-group-item-action border-0 py-2 px-4 bg-warning"  style="cursor:pointer;background-color: #FFDC6A !important;color:black !important;border-radius: 0px;">${d3.name}</a>`
                                                                            }
                                                                        }).join('')}
</div>`
                                                            }).join('')
                                                        },
                                                        divCreate: {}
                                                    }
                                                })
                                            })()}
                                        </ul>

                                    </div>
                                </div>
                                <div class="flex-fill"></div>
                                <div class="d-flex align-items-center justify-content-center  me-2 border ${(glitter.share.inspect) ? `activeBtn`:``}"
                                     style="height:36px;width:36px;border-radius:10px;cursor:pointer;"
                                     onclick="${gvc.event(() => {
                                         glitter.share.inspect=!glitter.share.inspect
                                         gvc.notifyDataChange('HtmlEditorContainer')
                                     })}">
                                    <i class="fa-sharp fa-regular fa-arrow-pointer"></i>
                                </div>
                               
                                <div class="d-flex align-items-center justify-content-center hoverBtn me-2 border"
                                     style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                     onclick="${gvc.event(() => {
                                         const url = new URL("", location.href)
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
                                <button class=" btn ms-2 btn-primary-c" style="height: 30px;width: 60px;"
                                        onclick="${gvc.event(() => {
                                            glitter.htmlGenerate.saveEvent()
                                        })}">儲存
                                </button>
                            </div>
                        </div>

                    </header>
                    <aside
                            id="componentsNav"
                            class="${(viewModel.type === ViewType.fullScreen) ? `d-none` : ``} offcanvas offcanvas-start offcanvas-expand-lg position-fixed top-0 start-0 vh-100 bg-light border-end-lg overflow-auto"
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
   color: transparent;">GLITTER.EDITOR </span>

                            </div>
                        </div>
                        ${left}
                    </aside>
                    <!-- Page container -->
                    <main class="docs-container"
                          style="padding-top: 40px;padding-right:${(viewModel.type===ViewType.col3) ? `290`:`0`}px;${(viewModel.type === ViewType.fullScreen) ? `padding-left:0px;` : `
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
                    ${gvc.bindView(()=>{
                        const id='right_NAV'
                        return {
                            bind:id,
                            view:()=>{
                                return Main_editor.editorContent(gvc,data)
                            },
                            divCreate:{
                                elem:`aside`,
                                class:`p-0  side-nav-end  position-fixed top-0 end-0 vh-100 border-start  bg-white ${(viewModel.type===ViewType.col3) ? ``:`d-none`}`,style:`width: 290px;padding-top:60px !important;`
                            }
                        }
                    })}

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
