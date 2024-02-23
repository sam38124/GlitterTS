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
import { ShareDialog } from "../dialog/ShareDialog.js";
import { BgGlobalEvent } from "../backend-manager/bg-global-event.js";
import { DialogInterface } from "../dialog/dialog-interface.js";
import { ApiPageConfig } from "../api/pageConfig.js";
import { Storage } from "../helper/storage.js";
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
            "type": (_a = glitter.getCookieByName("ViewType")) !== null && _a !== void 0 ? _a : ViewType.col3
        };
        this.create = (left, right) => {
            function getEditorTitle() {
                return (glitter.share.blogEditor) ? `編輯Blog文章` :
                    `GLITTER.EDITOR<span class="ms-1" style="font-size: 11px;">${glitter.share.editerVersion}</span>`;
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
                            <div style="width:${(glitter.getUrlParameter('blogEditor')) ? `100px` : `30px`};"></div>
                            <div class="d-flex align-items-center flex-fill " style="">
                                <div class=" d-flex align-items-center justify-content-center me-2">
                                    <div class="form-check form-switch mode-switch" data-bs-toggle="mode"
                                         onchange="${gvc.event(() => {
                Storage.editor_mode = (Storage.editor_mode === 'user') ? 'dev' : 'user';
                gvc.recreateView();
            })}">
                                        <input type="checkbox" class="form-check-input" id="theme-mode"
                                               ${(Storage.editor_mode === 'dev') ? `checked` : ``}>
                                        <label class="form-check-label d-none d-sm-block "
                                               for="theme-mode">編輯者</label>
                                        <label class="form-check-label d-none d-sm-block"
                                               for="theme-mode">開發者</label>
                                    </div>

                                </div>
                                <div class="flex-fill"></div>
                                <div class="d-flex align-items-center justify-content-center hoverBtn me-1 border"
                                     style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                     data-bs-toggle="tooltip" data-bs-placement="top"
                                     data-bs-custom-class="custom-tooltip"
                                     data-bs-title="頁面編輯"
                                     onclick="${gvc.event(() => {
                EditorElem.openEditorDialog(gvc, (gvc) => {
                    return gvc.bindView(() => {
                        const docID = gvc.glitter.getUUID();
                        return {
                            bind: docID,
                            view: () => {
                                let viewModel = glitter.share.editorViewModel;
                                let editData = glitter.share.editorViewModel.data;
                                return html `
                                                             <div class="mx-n2  mt-n2" style="">
                                                                 <div class=" pt-0 justify-content-start px-2"
                                                                      style="">
                                                                     ${[
                                    (() => {
                                        var _a, _b, _c, _d;
                                        let view = [EditorElem.select({
                                                gvc: gvc,
                                                title: '類型',
                                                def: (_a = editData.page_type) !== null && _a !== void 0 ? _a : 'page',
                                                array: [
                                                    {
                                                        title: "網頁",
                                                        value: 'page'
                                                    },
                                                    {
                                                        title: "頁面模塊",
                                                        value: 'module'
                                                    },
                                                    {
                                                        title: "網誌模板",
                                                        value: 'article'
                                                    },
                                                    {
                                                        title: "Blog網誌",
                                                        value: 'blog'
                                                    }
                                                ],
                                                callback: (text) => {
                                                    editData.page_type = text;
                                                    gvc.notifyDataChange(docID);
                                                }
                                            })];
                                        const title = (() => {
                                            switch (editData.page_type) {
                                                case 'page':
                                                    return '頁面';
                                                case 'module':
                                                    return '模塊';
                                                case 'article':
                                                    return '模板';
                                                case 'blog':
                                                    return '網誌';
                                            }
                                        })();
                                        editData.page_type = (_b = editData.page_type) !== null && _b !== void 0 ? _b : 'page';
                                        ((editData.page_type === 'page') || (editData.page_type === 'blog')) && view.push(EditorElem.select({
                                            title: "設為首頁",
                                            gvc: gvc,
                                            def: (viewModel.homePage === editData.tag) ? `true` : `false`,
                                            array: [{
                                                    title: "是",
                                                    value: 'true'
                                                }, {
                                                    title: "否",
                                                    value: 'false'
                                                }],
                                            callback: (text) => {
                                                if (text === 'true') {
                                                    viewModel.homePage = editData.tag;
                                                    editData.page_config.seo.type = 'custom';
                                                }
                                                else {
                                                    viewModel.homePage = undefined;
                                                }
                                                gvc.notifyDataChange(docID);
                                            }
                                        }));
                                        if (editData.page_type === 'module') {
                                            view.push(EditorElem.select({
                                                title: "是否加入至模板庫",
                                                gvc: gvc,
                                                def: `${(_c = editData.favorite) !== null && _c !== void 0 ? _c : '0'}`,
                                                array: [{
                                                        title: "是",
                                                        value: '1'
                                                    }, {
                                                        title: "否",
                                                        value: '0'
                                                    }],
                                                callback: (text) => {
                                                    editData.favorite = text;
                                                    gvc.notifyDataChange(docID);
                                                }
                                            }));
                                            editData.preview_image = (_d = editData.preview_image) !== null && _d !== void 0 ? _d : '';
                                            view.push(EditorElem.uploadImage({
                                                gvc: gvc,
                                                title: `預覽圖片`,
                                                def: editData.preview_image,
                                                callback: (text) => {
                                                    editData.preview_image = text;
                                                }
                                            }));
                                        }
                                        view.push(EditorElem.editeInput({
                                            gvc: gvc,
                                            title: `${title}標籤`,
                                            placeHolder: `請輸入${title}標籤`,
                                            default: editData.tag,
                                            callback: (text) => {
                                                editData.tag = text;
                                            }
                                        }));
                                        view.push(EditorElem.editeInput({
                                            gvc: gvc,
                                            title: `${title}名稱`,
                                            placeHolder: `請輸入${title}名稱`,
                                            default: editData.name,
                                            callback: (text) => {
                                                editData.name = text;
                                            }
                                        }));
                                        view.push(EditorElem.searchInput({
                                            title: `${title}分類`,
                                            gvc: gvc,
                                            def: editData.group,
                                            array: (() => {
                                                let group = [];
                                                viewModel.dataList.map((dd) => {
                                                    if ((group.indexOf(dd.group) === -1) && dd.page_type === editData.page_type) {
                                                        group.push(dd.group);
                                                    }
                                                });
                                                return group;
                                            })(),
                                            callback: (text) => {
                                                editData.group = text;
                                                gvc.notifyDataChange(docID);
                                            },
                                            placeHolder: `請輸入${title}分類`
                                        }));
                                        return view.join('');
                                    })(),
                                    html `
                                                                                     <div class="w-100 mt-2 d-flex align-items-center justify-content-end"
                                                                                          style="gap:5px;">
                                                                                         <div class="d-flex align-items-center justify-content-center hoverBtn  border"
                                                                                              style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                                                                              onclick="${gvc.event(() => {
                                        EditorElem.openEditorDialog(gvc, (gvc) => {
                                            return gvc.bindView(() => {
                                                const id = glitter.getUUID();
                                                let checkText = '';
                                                return {
                                                    bind: id,
                                                    view: () => {
                                                        return `<lottie-player
  autoplay
  loop
  mode="normal"
  src="${new URL('../lottie/error.json', import.meta.url)}"
  style="width: 200px;"
  class=""
>
</lottie-player>
<div class="alert alert-danger w-100" style="word-break: break-all;white-space: normal;"><strong>請注意</strong>，頁面刪除後即無法復原，請警慎進行操作。</div>
<input placeholder="請輸入『 我要刪除 』後按下確認刪除" class="form-control" onchange="${gvc.event((e, event) => {
                                                            checkText = e.value;
                                                        })}"></input>
<div class="btn btn-danger w-100 mt-2" onclick="${gvc.event(() => {
                                                            const dialog = new ShareDialog(gvc.glitter);
                                                            if (checkText !== '我要刪除') {
                                                                dialog.errorMessage({ text: "請輸入我要刪除" });
                                                            }
                                                            else {
                                                                dialog.checkYesOrNot({
                                                                    callback: (response) => {
                                                                        if (response) {
                                                                            dialog.dataLoading({ visible: true });
                                                                            ApiPageConfig.deletePage({
                                                                                "id": glitter.share.editorViewModel.data.id,
                                                                                "appName": window.appName,
                                                                            }).then((data) => {
                                                                                dialog.dataLoading({ visible: false });
                                                                                location.reload();
                                                                            });
                                                                        }
                                                                    },
                                                                    text: "是否確認刪除頁面?"
                                                                });
                                                            }
                                                        })}">確認刪除</div>
`;
                                                    },
                                                    divCreate: {
                                                        class: `flex-column p-2 d-flex align-items-center justify-content-center`,
                                                        style: ``
                                                    }
                                                };
                                            });
                                        }, () => {
                                        }, 400);
                                    })}"
                                                                                              data-bs-toggle="tooltip"
                                                                                              data-bs-placement="top"
                                                                                              data-bs-custom-class="custom-tooltip"
                                                                                              data-bs-title="刪除頁面"
                                                                                         >
                                                                                             <i class="fa-solid fa-trash text-danger"></i>
                                                                                         </div>
                                                                                         <button class="btn btn-primary-c "
                                                                                                 style="height: 35px;"
                                                                                                 onclick="${gvc.event(() => {
                                        gvc.glitter.htmlGenerate.saveEvent(false);
                                        location.reload();
                                    })}">儲存
                                                                                         </button>
                                                                                     </div>
                                                                                 `
                                ].map((dd) => {
                                    return `<div class="">${dd}</div>`;
                                }).join(``)}
                                                                 </div>
                                                             </div>`;
                            },
                            divCreate: () => {
                                return {
                                    class: ` h-100 p-2 d-flex flex-column`,
                                    style: `width:400px;max-height:80vh;overflow-y:auto;overflow-x:hidden;`
                                };
                            },
                            onCreate: () => {
                                $('.tooltip').remove();
                                $('[data-bs-toggle="tooltip"]').tooltip();
                            }
                        };
                    });
                }, () => {
                }, 400, data.data.name);
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
                                     data-bs-title="添加頁面"
                                     onclick="${gvc.event(() => {
                glitter.openDiaLog('dialog/addTemplate.js', 'addTemplate', {
                    vm: data
                });
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
                    return [
                        `<div class="d-flex align-items-center justify-content-center hoverBtn  border"
                                                     style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                                     onclick="${gvc.event(() => {
                            DialogInterface.globalResource(gvc);
                        })}"
                                                     data-bs-toggle="tooltip" data-bs-placement="top"
                                                     data-bs-custom-class="custom-tooltip"
                                                     data-bs-title="資源管理 : CTRL + G"
                                                >
                                                    <i class="fa-regular fa-folder"></i>
                                                </div>`
                    ];
                }
                else {
                    return [
                        html `
                                                <div class="hoverBtn ms-auto d-flex align-items-center justify-content-center   border"
                                                     style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                                     onclick="${gvc.event(() => {
                            PageEditor.openDialog.seo_with_domain(gvc);
                        })}"
                                                     data-bs-toggle="tooltip" data-bs-placement="top"
                                                     data-bs-custom-class="custom-tooltip"
                                                     data-bs-title="網域設置"
                                                >
                                                    <i class="fa-sharp fa-regular fa-globe-pointer"></i>
                                                </div>`,
                        html `
                                                <div class="hoverBtn d-flex align-items-center justify-content-center   border "
                                                     style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                                     onclick="${gvc.event(() => {
                            PageEditor.openDialog.plugin_setting(gvc);
                        })}"
                                                     data-bs-toggle="tooltip" data-bs-placement="top"
                                                     data-bs-custom-class="custom-tooltip"
                                                     data-bs-title="模塊設置"
                                                >
                                                    <i class="fa-solid fa-puzzle-piece-simple"></i>

                                                </div>`,
                        html `
                                                <div class="d-flex align-items-center justify-content-center hoverBtn  border"
                                                     style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                                     onclick="${gvc.event(() => {
                            DialogInterface.globalResource(gvc);
                        })}"
                                                     data-bs-toggle="tooltip" data-bs-placement="top"
                                                     data-bs-custom-class="custom-tooltip"
                                                     data-bs-title="資源管理 : CTRL + G"
                                                >
                                                    <i class="fa-regular fa-folder"></i>
                                                </div>`,
                        html `
                                                <div class="d-flex align-items-center justify-content-center hoverBtn  border"
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
                                <div class="d-flex align-items-center justify-content-center hoverBtn ms-1 me-2 border"
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
                    ${(() => {
                if (((viewModel.type === ViewType.col3 || (viewModel.type === ViewType.mobile)) && glitter.getUrlParameter('editorPosition') !== Setting_editor.index)) {
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
