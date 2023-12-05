var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Main_editor } from "./main_editor.js";
import { Setting_editor } from "./setting_editor.js";
import { PageEditor } from "../editor/page-editor.js";
import { EditorElem } from "../glitterBundle/plugins/editor-elem.js";
import { fileManager } from "../setting/appSetting.js";
export var ViewType;
(function (ViewType) {
    ViewType["mobile"] = "mobile";
    ViewType["desktop"] = "desktop";
    ViewType["col3"] = "col3";
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
                            <div class="d-flex align-items-center w-100">
                                <div class="flex-fill"></div>
                                <div class="btn-group " style=width:350px;">

                                    <button type="button" class="btn btn-outline-secondary rounded"
                                            onclick="${gvc.event(() => {
                $('#topd').toggle();
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
                    const id = glitter.getUUID();
                    return {
                        bind: id,
                        view: () => {
                            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                PageEditor.pageSelecter(gvc, (d3) => {
                                    console.log(d3);
                                    glitter.share.clearSelectItem();
                                    data.data = d3;
                                    glitter.setUrlParameter('page', d3.tag);
                                    gvc.notifyDataChange('HtmlEditorContainer');
                                    gvc.notifyDataChange(id);
                                }).then((data) => {
                                    resolve(data.left);
                                });
                            }));
                        },
                        divCreate: {
                            class: `ms-n2 mt-n2`
                        }
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
                EditorElem.openEditorDialog(gvc, (gvc) => {
                    return `<div style="width:350px;">${fileManager(gvc, gvc.glitter.getUUID(), {
                        data: []
                    })}</div>`;
                }, () => {
                }, 350);
            })}">
                                    <i class="fa-regular fa-folder"></i>
                                </div>
                                <div class="d-flex align-items-center justify-content-center  me-2 border ${(glitter.share.inspect) ? `activeBtn` : ``}"
                                     style="height:36px;width:36px;border-radius:10px;cursor:pointer;"
                                     onclick="${gvc.event(() => {
                glitter.share.inspect = !glitter.share.inspect;
                glitter.share.editorViewModel.selectItem = undefined;
                glitter.share.editorViewModel.selectContainer = undefined;
                glitter.setCookie('lastSelect', '');
                gvc.notifyDataChange('HtmlEditorContainer');
            })}">
                                    <i class="fa-sharp fa-regular fa-arrow-pointer"></i>
                                </div>
                                <div class="d-flex align-items-center justify-content-center hoverBtn me-2 border"
                                     style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                     onclick="${gvc.event(() => {
                const url = new URL("", (glitter.share.editorViewModel.domain) ? `https://${glitter.share.editorViewModel.domain}/?page=index` : location.href);
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
                        { icon: 'fa-regular fa-columns-3', type: ViewType.col3 },
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
                                <button class=" btn ms-2 btn-primary-c ${(glitter.getUrlParameter('editorPosition') === '2') ? `d-none` : ``}"
                                        style="height: 30px;width: 60px;"
                                        onclick="${gvc.event(() => {
                glitter.htmlGenerate.saveEvent();
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
                dataList: [{ obj: viewModel, key: "type" }],
                bind: `showView`,
                view: () => {
                    var _a;
                    let selectPosition = (_a = glitter.getUrlParameter('editorPosition')) !== null && _a !== void 0 ? _a : "0";
                    switch (selectPosition) {
                        default:
                            return Main_editor.center(viewModel, gvc);
                    }
                },
                divCreate: {}
            })}
                    </main>
                    ${gvc.bindView(() => {
                const id = 'right_NAV';
                return {
                    bind: id,
                    view: () => {
                        return Main_editor.editorContent(gvc, data);
                    },
                    divCreate: {
                        elem: `aside`,
                        class: `p-0  side-nav-end  position-fixed top-0 end-0 vh-100 border-start  bg-white ${((viewModel.type === ViewType.col3 || (viewModel.type === ViewType.mobile)) && glitter.getUrlParameter('editorPosition') !== Setting_editor.index) ? `` : `d-none`}`,
                        style: `width: 290px;padding-top:60px !important;`
                    }
                };
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
