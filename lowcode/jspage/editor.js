var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Main_editor } from "./function-page/main_editor.js";
import { PageEditor } from "../editor/page-editor.js";
import { EditorElem } from "../glitterBundle/plugins/editor-elem.js";
import { BgGlobalEvent } from "../backend-manager/bg-global-event.js";
import { Storage } from "../helper/storage.js";
import { PageSettingView } from "../editor/page-setting-view.js";
import { AddPage } from "../editor/add-page.js";
import { SetGlobalValue } from "../editor/set-global-value.js";
import { config } from "../config.js";
import { ShareDialog } from "../dialog/ShareDialog.js";
import { ApiPageConfig } from "../api/pageConfig.js";
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
            "type": (_a = Storage.view_type) !== null && _a !== void 0 ? _a : ViewType.col3
        };
        this.create = (left, right) => {
            function getEditorTitle() {
                return (glitter.share.blogEditor) ? `編輯Blog文章` :
                    `CODENEX.EDITOR<span class="ms-1" style="font-size: 11px;">${glitter.share.editerVersion}</span>`;
            }
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
                                       onclick="${gvc.event(() => {
                if (window.parent && window.parent.glitter) {
                    window.parent.glitter.closeDiaLog();
                }
                else {
                    location.href = 'index.html';
                }
            })}">

                                    </i>
                                </div>
                                ${(glitter.share.blogEditor) ? `
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
                                        `}
                            </div>
                            <div style="width:${(glitter.getUrlParameter('blogEditor')) ? `100px` : `20px`};"></div>
                            
                            <div class="d-flex align-items-center flex-fill ${(Storage.select_function === 'page-editor') ? `` : `d-none`}" style="">
                               
                              
                               <div style="width:36px;"></div>
                                <div class="flex-fill"></div>
                                ${gvc.bindView(() => {
                const id = gvc.glitter.getUUID();
                return {
                    bind: id,
                    view: () => {
                        return `  <div class="hoverBtn  d-flex align-items-center justify-content-center   border"
                                     style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                     onclick="${gvc.event(() => {
                            SetGlobalValue.toggle(true);
                        })}"
                                     data-bs-toggle="tooltip" data-bs-placement="top"
                                     data-bs-custom-class="custom-tooltip"
                                     data-bs-title="全域設置"
                                >
                                    <i class="fa-solid fa-bars"></i>
                                </div>`;
                    },
                    onCreate: () => {
                        $('.tooltip').remove();
                        $('[data-bs-toggle="tooltip"]').tooltip();
                    }
                };
            })}
                                <div class="d-flex align-items-center justify-content-center hoverBtn ms-1 me-1 border"
                                     style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                     data-bs-toggle="tooltip" data-bs-placement="top"
                                     data-bs-custom-class="custom-tooltip"
                                     data-bs-title="頁面編輯"
                                     onclick="${gvc.event(() => {
                PageSettingView.toggle(true);
            })}">
                                    <i class="fa-regular fa-gear"></i>
                                </div>
                                <div class="btn-group ms-1" style="max-width: 350px;min-width: 250px;">
                                    <button type="button" class="btn btn-outline-secondary rounded px-2"
                                            onclick="${gvc.event(() => {
                $('#topd').toggle();
            })}">
                                        <span style="max-width: 180px;overflow: hidden;text-overflow: ellipsis;">${data.data.name}</span>
                                        <i class="fa-sharp fa-solid fa-caret-down position-absolute translate-middle-y"
                                           style="top: 50%;right: 20px;"></i>
                                    </button>
                                    ${gvc.bindView(() => {
                const id = gvc.glitter.getUUID();
                return {
                    bind: id,
                    view: () => {
                        return html `
                                                            <div class="d-flex align-items-center justify-content-around  w-100 border-bottom pb-2">
                                                                ${(() => {
                            const list = [
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
                                    title: '樣板',
                                    icon: 'fa-regular fa-file-dashed-line',
                                    type: 'article'
                                },
                            ];
                            return list.map((dd) => {
                                if (dd.type === Storage.select_page_type) {
                                    return html `
                                                                                <div class=" d-flex align-items-center justify-content-center border rounded-3"
                                                                                     style="height:36px;width:36px;cursor:pointer;
background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);background:-webkit-linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:white;
" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip" data-bs-title="${dd.title}">
                                                                                    <i class="${dd.icon}"></i>
                                                                                </div>`;
                                }
                                else {
                                    return html `
                                                                                <div class=" d-flex align-items-center justify-content-center  rounded-3"
                                                                                     style="height:36px;width:36px;cursor:pointer;color:#151515;" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip" data-bs-title="${dd.title}"
                                                                                     onclick="${gvc.event(() => {
                                        Storage.select_page_type = dd.type;
                                        gvc.notifyDataChange(id);
                                        $('#topd').toggle();
                                    })}">
                                                                                    <i class="${dd.icon}"></i>
                                                                                </div>`;
                                }
                            }).join('');
                        })()}
                                                            </div>
                                                            <ul class="list-group list-group-flush  mt-2">
                                                                ${(() => {
                            return gvc.bindView(() => {
                                const id = glitter.getUUID();
                                return {
                                    bind: id,
                                    view: () => {
                                        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                            PageEditor.pageSelctor(gvc, (d3) => {
                                                console.log(d3);
                                                glitter.share.clearSelectItem();
                                                data.data = d3;
                                                glitter.setUrlParameter('page', d3.tag);
                                                glitter.share.reloadEditor();
                                            }, {
                                                filter: (data) => {
                                                    return data.page_type == Storage.select_page_type;
                                                }
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
                                                            </ul>`;
                    },
                    divCreate: {
                        class: 'dropdown-menu',
                        style: 'margin-top: 50px;max-height: calc(100vh - 100px);width:300px;overflow-y: scroll;',
                        option: [
                            { key: 'id', value: 'topd' }
                        ]
                    },
                    onCreate: () => {
                        $('.tooltip').remove();
                        $('[data-bs-toggle="tooltip"]').tooltip();
                    }
                };
            })}
                                </div>
                                <div class="d-flex align-items-center justify-content-center hoverBtn ms-2 me-1 border"
                                     style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                     data-bs-toggle="tooltip" data-bs-placement="top"
                                     data-bs-custom-class="custom-tooltip"
                                     data-bs-title="複製當前頁面"
                                     onclick="${gvc.event(() => {
                EditorElem.openEditorDialog(gvc, (gvc) => {
                    const tdata = {
                        "appName": config.appName,
                        "tag": "",
                        "group": gvc.glitter.share.editorViewModel.data.group,
                        "name": "",
                        "config": [],
                        "page_type": 'page',
                        copy: gvc.glitter.getUrlParameter('page')
                    };
                    return `
            <div class="py-2 px-2">
${gvc.bindView(() => {
                        const id = glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                return gvc.map([
                                    glitter.htmlGenerate.editeInput({
                                        gvc: gvc,
                                        title: '頁面標籤',
                                        default: "",
                                        placeHolder: "請輸入頁面標籤[不得重複]",
                                        callback: (text) => {
                                            tdata.tag = text;
                                        }
                                    }),
                                    glitter.htmlGenerate.editeInput({
                                        gvc: gvc,
                                        title: '頁面名稱',
                                        default: "",
                                        placeHolder: "請輸入頁面名稱",
                                        callback: (text) => {
                                            tdata.name = text;
                                        }
                                    })
                                ]);
                            },
                            divCreate: {}
                        };
                    })}
</div>
<div class="d-flex w-100 my-2 align-items-center justify-content-center">
<button class="btn btn-primary " style="width: calc(100% - 20px);" onclick="${gvc.event(() => {
                        const dialog = new ShareDialog(glitter);
                        dialog.dataLoading({ text: "上傳中", visible: true });
                        ApiPageConfig.addPage(tdata).then((it) => {
                            setTimeout(() => {
                                dialog.dataLoading({ text: "", visible: false });
                                if (it.result) {
                                    const li = new URL(location.href);
                                    li.searchParams.set('page', tdata.tag);
                                    location.href = li.href;
                                }
                                else {
                                    dialog.errorMessage({
                                        text: "已有此頁面標籤"
                                    });
                                }
                            }, 1000);
                        });
                    })}">確認新增</button>
</div>
            `;
                }, () => { }, 300, '複製頁面');
            })}">
                                    <i class="fa-regular fa-copy"></i>
                                </div>
                                <div class="d-flex align-items-center justify-content-center hoverBtn  me-1 border"
                                     style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                     data-bs-toggle="tooltip" data-bs-placement="top"
                                     data-bs-custom-class="custom-tooltip"
                                     data-bs-title="添加頁面"
                                     onclick="${gvc.event(() => {
                AddPage.toggle(true);
            })}">
                                    <i class="fa-regular fa-circle-plus"></i>
                                </div>
                                <div class="flex-fill"></div>
                                ${(() => {
                if (glitter.share.blogEditor) {
                    if (glitter.share.blogPage !== glitter.getUrlParameter('page')) {
                        return `<button class="btn btn-secondary" style="height: 40px;" onclick="${gvc.event(() => {
                            glitter.setUrlParameter('page', glitter.share.blogPage);
                            glitter.share.reloadEditor();
                        })}">返回編輯文章內容</button>`;
                    }
                    return [];
                }
                else {
                    return [
                        html `
                                                <div class="d-flex align-items-center justify-content-center hoverBtn  border d-none"
                                                     style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                                     onclick="${gvc.event(() => {
                            EditorElem.openEditorDialog(gvc, (gvc) => {
                                return BgGlobalEvent.mainPage(gvc);
                            }, () => {
                            }, 800, '事件集管理');
                        })}"
                                                     data-bs-toggle="tooltip" data-bs-placement="top"
                                                     data-bs-custom-class="custom-tooltip"
                                                     data-bs-title="事件集"
                                                ><i class="fa-sharp fa-regular fa-brackets-curly"></i>
                                                </div>`
                    ].join(`<div class="me-1"></div>`);
                }
            })()}
                                <div class="d-flex align-items-center justify-content-center hoverBtn ms-1 me-2 border bg-white
${(glitter.share.editorViewModel.homePage === glitter.getUrlParameter('page')) ? `d-none` : ``}
"
                                     style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                     data-bs-toggle="tooltip" data-bs-placement="top"
                                     data-bs-custom-class="custom-tooltip" data-bs-title="返回首頁"
                                     onclick="${gvc.event(() => {
                const url = new URL(location.href);
                url.searchParams.set('page', glitter.share.editorViewModel.homePage);
                location.href = url.href;
            })}">
                                    <i class="fa-regular fa-house"></i>
                                </div>
                                <div class="d-flex align-items-center justify-content-center hoverBtn  me-2 border"
                                     style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                     data-bs-toggle="tooltip" data-bs-placement="top"
                                     data-bs-custom-class="custom-tooltip"
                                     data-bs-title="預覽應用"
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
                                glitter.setCookie("ViewType", viewModel.type);
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
                                       onclick="${gvc.event(() => {
                if (window.parent && window.parent.glitter) {
                    window.parent.glitter.closeDiaLog();
                }
                else {
                    location.href = 'index.html';
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
                    ${(() => {
                if (((viewModel.type === ViewType.col3 || (viewModel.type === ViewType.mobile)) && Storage.select_function !== 'backend-manger' && Storage.select_function !== 'server-manager')) {
                    return Main_editor.pageAndComponent({
                        gvc: gvc,
                        data: data,
                        divCreate: {
                            class: `p-0  side-nav-end  position-fixed top-0 end-0 vh-100 border-start  bg-white `,
                            style: `width: 290px;padding-top:60px !important;`
                        },
                    });
                }
                else {
                    return ``;
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
