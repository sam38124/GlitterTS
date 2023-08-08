import { Main_editor } from "./main_editor.js";
import { Page_editor } from "./page_editor.js";
import { Setting_editor } from "./setting_editor.js";
var ViewType;
(function (ViewType) {
    ViewType["mobile"] = "mobile";
    ViewType["desktop"] = "desktop";
    ViewType["fullScreen"] = "fullScreen";
})(ViewType || (ViewType = {}));
export class Editor {
    constructor(gvc, data) {
        var _a;
        const html = String.raw;
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
        const viewModel = {
            "type": (_a = glitter.getCookieByName("ViewType")) !== null && _a !== void 0 ? _a : ViewType.desktop
        };
        this.create = (left, right) => {
            return html `
                <div class="position-relative vh-100 vw-100 overflow-auto"
                     style="word-break: break-word;white-space: nowrap;background:whitesmoke;">
                    <!-- Navbar -->
                    <header
                            class="header navbar navbar-expand navbar-light bg-light border-bottom border-light shadow fixed-top"
                            data-scroll-header
                            style="height: 56px;">
                        <div class="container-fluid pe-lg-4">
                            <div class="d-flex align-items-center">
                                <a href="index.html" class="navbar-brand flex-shrink-0 py-1 py-lg-2">
                                    <div
                                            class="bg-white  rounded-circle d-flex align-items-center justify-content-center me-2"
                                            style="box-sizing: border-box;width: 50px;height: 50px;"
                                    >
                                        <img src="assets/img/glitter (1).png" width="30" alt="Silicon"/>
                                    </div>
                                    Glitter Editor
                                </a>

                            </div>
                            <div class="d-flex align-items-center w-100">
                                <div class="flex-fill"></div>
                                <div class="btn-group " style=width:300px;">
                                    <button type="button" class="btn btn-outline-secondary rounded"
                                            onclick="${gvc.event(() => {
                $('#topd').toggle();
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
                let group = [];
                let selectGroup = '';
                let id = glitter.getUUID();
                data.dataList.map((dd) => {
                    if (dd.tag === glitter.getUrlParameter('page')) {
                        selectGroup = dd.group;
                    }
                    if (group.indexOf(dd.group) === -1) {
                        group.push(dd.group);
                    }
                });
                return gvc.bindView(() => {
                    return {
                        bind: id,
                        view: () => {
                            return group.sort(function (a, b) {
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
                                return `<l1 onclick="${gvc.event(() => {
                                    selectGroup = dd;
                                    gvc.notifyDataChange(id);
                                })}"  class="list-group-item list-group-item-action border-0 d py-2 ${(selectGroup === dd) && 'active'} position-relative " style="border-radius: 0px;cursor: pointer;">${dd || "未分類"}</l1>`
                                    + `<div class="collapse multi-collapse ${(selectGroup === dd) && 'show'}" style="margin-left: 10px;">
 ${data.dataList.filter((d2) => {
                                        return d2.group === dd;
                                    }).sort((a, b) => {
                                        var nameA = a.name.toUpperCase();
                                        var nameB = b.name.toUpperCase();
                                        if (nameA < nameB) {
                                            return -1;
                                        }
                                        if (nameA > nameB) {
                                            return 1;
                                        }
                                        return 0;
                                    }).map((d3) => {
                                        if (d3.tag !== glitter.getUrlParameter('page')) {
                                            return `<a onclick="${gvc.event(() => {
                                                data.data = d3;
                                                glitter.setUrlParameter('page', d3.tag);
                                                gvc.notifyDataChange('HtmlEditorContainer');
                                            })}"  class=" list-group-item list-group-item-action border-0 py-2 px-4"  style="border-radius: 0px;">${d3.name}</a>`;
                                        }
                                        else {
                                            return `<a   class=" list-group-item list-group-item-action border-0 py-2 px-4 bg-warning"  style="cursor:pointer;background-color: #FFDC6A !important;color:black !important;border-radius: 0px;">${d3.name}</a>`;
                                        }
                                    }).join('')}
</div>`;
                            }).join('');
                        },
                        divCreate: {}
                    };
                });
            })()}
                                        </ul>

                                    </div>
                                </div>
                                <div class="flex-fill"></div>
                                <div class="d-flex align-items-center justify-content-center hoverBtn me-2 border"
                                     style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                onclick="${gvc.event(() => {
                const url = new URL("", location.href);
                url.searchParams.delete('type');
                url.searchParams.set("page", glitter.getUrlParameter("page"));
                glitter.openNewTab(url.href);
            })}">
                                    <i class="fa-regular fa-eye"></i>
                                </div>
                                ${gvc.bindView({
                bind: `showViewIcon`,
                view: () => {
                    glitter.setCookie("ViewType", viewModel.type);
                    return html `
                                            <div style="background:#f1f1f1;border-radius:10px;"
                                                 class="d-flex align-items-center justify-content-center p-1 ">
                                                ${[
                        { icon: 'fa-regular fa-desktop', type: ViewType.desktop },
                        { icon: 'fa-regular fa-mobile', type: ViewType.mobile },
                        { icon: 'fa-solid fa-expand', type: ViewType.fullScreen }
                    ].map((dd) => {
                        if (dd.type === viewModel.type) {
                            return html `
                                                            <div class="d-flex align-items-center justify-content-center bg-white"
                                                                 style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;">
                                                                <i class="${dd.icon}"></i>
                                                            </div>`;
                        }
                        else {
                            return html `
                                                            <div class="d-flex align-items-center justify-content-center"
                                                                 style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                                                 onclick="${gvc.event(() => {
                                viewModel.type = dd.type;
                                gvc.notifyDataChange('HtmlEditorContainer');
                            })}">
                                                                <i class="${dd.icon}"></i>
                                                            </div>`;
                        }
                        return ``;
                    }).join('')}
                                            </div>`;
                },
                divCreate: {}
            })}
                                <button class=" btn ms-2 btn-primary-c" style="height: 30px;width: 60px;"
                                        onclick="${gvc.event(() => {
                glitter.htmlGenerate.saveEvent();
            })}">儲存
                                </button>
                            </div>
                        </div>

                    </header>
                    <aside
                            id="componentsNav"
                            class="${(viewModel.type === ViewType.fullScreen) ? `d-none` : ``} offcanvas offcanvas-start offcanvas-expand-lg position-fixed top-0 start-0 vh-100 bg-light border-end-lg overflow-auto"
                            style="width: 21rem;"
                    >
                        <div class="offcanvas-header d-none d-lg-flex justify-content-start border-bottom px-0"
                             style="height: 56px;">
                            <div class="navbar-brand text-dark d-none d-lg-flex py-0 h-100">
                                <div class="d-flex align-items-center justify-content-center border-end " style="width:50px;height: 56px;">
                                    <i class="fa-regular fa-arrow-left-from-arc hoverBtn"  style="cursor:pointer;" onclick="location.href='index.html'">

                                    </i>
                                </div>
                                <span class="ms-3 fw-500" style="  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
   background: -webkit-linear-gradient(135deg, #667eea 0%, #764ba2 100%);
   background-clip: text;
   -webkit-background-clip: text;
   color: transparent;">GLITTER.AI </span>
                                
                            </div>
                        </div>
                        <div class="offcanvas-header d-block d-lg-none border-bottom">
                            <div class="d-flex align-items-center justify-content-between">
                                <h5 class="d-lg-none mb-0">Menu</h5>
                                <button type="button" class="btn-close d-lg-none" data-bs-dismiss="offcanvas"></button>
                            </div>

                            <div class="d-flex mt-4">
                                <div class="form-check form-switch mode-switch pe-lg-1 ms-lg-auto d-sm-none"
                                     data-bs-toggle="mode">
                                    <input type="checkbox" class="form-check-input" id="theme-mode"/>
                                    <label class="form-check-label  d-sm-block d-lg-none d-xl-block" for="theme-mode">Light</label>
                                    <label class="form-check-label  d-sm-block d-lg-none d-xl-block" for="theme-mode">Dark</label>
                                </div>
                            </div>
                        </div>
                        ${left}
                    </aside>
                    <!-- Page container -->
                    <main class="docs-container" style="padding-top: 40px;padding-right:0px;${(viewModel.type === ViewType.fullScreen) ? `padding-left:0px;` : ``}">${gvc.bindView({
                dataList: [{ obj: viewModel, key: "type" }],
                bind: `showView`,
                view: () => {
                    var _a;
                    let selectPosition = (_a = glitter.getUrlParameter('editorPosition')) !== null && _a !== void 0 ? _a : "0";
                    switch (selectPosition) {
                        case Setting_editor.index:
                            return Setting_editor.center(gvc, data, 'showView');
                        case Page_editor.index:
                            return Page_editor.center(data, gvc, 'showView');
                        default:
                            return Main_editor.center(viewModel, gvc);
                    }
                },
                divCreate: {}
            })}
                    </main>


                    <!-- Back to top button -->
                    <a href="#top" class="btn-scroll-top" data-scroll>
                        <span class="btn-scroll-top-tooltip text-muted fs-sm me-2">Top</span>
                        <i class="btn-scroll-top-icon bx bx-chevron-up"></i>
                    </a>
                    <!--                  -->

                </div>
            `;
        };
    }
}
