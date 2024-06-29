var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Main_editor } from './function-page/main_editor.js';
import { PageEditor } from '../editor/page-editor.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { BgGlobalEvent } from '../backend-manager/bg-global-event.js';
import { Storage } from '../glitterBundle/helper/storage.js';
import { PageSettingView } from '../editor/page-setting-view.js';
import { AddPage } from '../editor/add-page.js';
import { SetGlobalValue } from '../editor/set-global-value.js';
import { config } from '../config.js';
import { ShareDialog } from '../dialog/ShareDialog.js';
import { ApiPageConfig } from '../api/pageConfig.js';
import { PageCodeSetting } from '../editor/page-code-setting.js';
import { EditorConfig } from '../editor-config.js';
import { SaasViewModel } from '../view-model/saas-view-model.js';
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
        const size = document.body.offsetWidth;
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
            type: (_a = Storage.view_type) !== null && _a !== void 0 ? _a : ViewType.col3,
        };
        this.create = (left, right) => {
            function getEditorTitle() {
                return glitter.share.blogEditor
                    ? `編輯Blog文章`
                    : (() => {
                        return `<div class="d-flex align-items-end"><svg width="157" height="28" viewBox="0 0 157 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.812 17.972C2.28067 18.342 3.08233 18.8477 4.217 19.489C5.37633 20.1303 6.474 20.451 7.51 20.451C8.57067 20.451 9.101 20.044 9.101 19.23C9.101 18.86 8.953 18.5393 8.657 18.268C8.361 17.972 7.81833 17.639 7.029 17.269C6.23967 16.899 5.64767 16.6153 5.253 16.418C4.85833 16.196 4.328 15.8507 3.662 15.382C3.02067 14.8887 2.52733 14.383 2.182 13.865C1.19533 12.459 0.702 10.6707 0.702 8.5C0.702 6.32933 1.50367 4.504 3.107 3.024C4.735 1.51933 6.85633 0.766998 9.471 0.766998C11.247 0.766998 12.8873 0.964332 14.392 1.359C15.8967 1.729 16.6737 2.22233 16.723 2.839C16.723 2.913 16.723 2.987 16.723 3.061C16.723 3.92433 16.4517 5.022 15.909 6.354C15.3663 7.66133 14.984 8.389 14.762 8.537C13.1833 7.723 11.765 7.316 10.507 7.316C9.27367 7.316 8.657 7.76 8.657 8.648C8.657 9.19067 9.11333 9.67167 10.026 10.091C10.2233 10.1897 10.507 10.3253 10.877 10.498C11.247 10.6707 11.6663 10.8803 12.135 11.127C12.6283 11.349 13.1463 11.645 13.689 12.015C14.2563 12.3603 14.8607 12.829 15.502 13.421C16.8093 14.6543 17.463 16.2823 17.463 18.305C17.463 20.9443 16.7353 23.1027 15.28 24.78C13.8247 26.4573 11.58 27.3207 8.546 27.37C7.066 27.37 5.72167 27.2467 4.513 27C3.329 26.7533 2.293 26.2723 1.405 25.557C0.517 24.8417 0.073 23.9783 0.073 22.967C0.073 21.9557 0.258 20.9567 0.628 19.97C0.998 18.9587 1.39267 18.2927 1.812 17.972ZM40.6343 26.371C40.6343 26.7903 39.3886 27 36.8973 27C34.4059 27 33.1603 26.7903 33.1603 26.371V17.861H27.9803V26.371C27.9803 26.7903 26.7346 27 24.2433 27C21.7519 27 20.5063 26.7903 20.5063 26.371V1.84C20.5063 1.322 21.7519 1.063 24.2433 1.063C26.7346 1.063 27.9803 1.322 27.9803 1.84V10.535H33.1603V1.914C33.1603 1.56867 33.7769 1.322 35.0103 1.174C35.6516 1.12467 36.2806 1.1 36.8973 1.1L38.7843 1.174C40.0176 1.322 40.6343 1.56867 40.6343 1.914V26.371ZM55.3068 27.37C51.8534 27.37 49.0291 26.2353 46.8338 23.966C44.6631 21.6967 43.5778 18.3913 43.5778 14.05C43.5778 9.684 44.6754 6.37867 46.8708 4.134C49.0908 1.88933 51.9398 0.766998 55.4178 0.766998C58.9204 0.766998 61.7448 1.877 63.8908 4.097C66.0368 6.29233 67.1098 9.63467 67.1098 14.124C67.1098 18.5887 66.0121 21.9187 63.8168 24.114C61.6214 26.2847 58.7848 27.37 55.3068 27.37ZM55.3438 7.871C54.1598 7.871 53.1608 8.41367 52.3468 9.499C51.5574 10.5843 51.1628 12.1137 51.1628 14.087C51.1628 16.0357 51.5451 17.5403 52.3098 18.601C53.0744 19.637 54.0734 20.155 55.3068 20.155C56.5648 20.155 57.5761 19.6247 58.3408 18.564C59.1301 17.5033 59.5248 15.9863 59.5248 14.013C59.5248 12.0397 59.1178 10.5227 58.3038 9.462C57.5144 8.40133 56.5278 7.871 55.3438 7.871ZM73.2995 27.074C71.0548 27.074 69.9325 26.8273 69.9325 26.334V2.358C69.9325 1.51933 70.3148 1.1 71.0795 1.1H77.5915C81.2421 1.1 83.8691 1.85233 85.4725 3.357C87.1005 4.86167 87.9145 7.04467 87.9145 9.906C87.9145 12.274 87.1498 14.4447 85.6205 16.418C84.8558 17.4047 83.7335 18.194 82.2535 18.786C80.7735 19.378 79.0468 19.674 77.0735 19.674V26.297C77.0735 26.593 76.6048 26.8027 75.6675 26.926C74.7548 27.0247 73.9655 27.074 73.2995 27.074ZM77.0735 7.538V13.384H77.5545C78.4178 13.384 79.1455 13.1127 79.7375 12.57C80.3295 12.0273 80.6255 11.2627 80.6255 10.276C80.6255 9.28933 80.4158 8.58633 79.9965 8.167C79.6018 7.74767 78.8865 7.538 77.8505 7.538H77.0735ZM111.458 26.186C111.458 26.704 110.299 26.963 107.98 26.963C105.661 26.963 104.403 26.778 104.206 26.408L98.027 14.864V26.371C98.027 26.815 96.88 27.037 94.586 27.037C92.3167 27.037 91.182 26.815 91.182 26.371V1.618C91.182 1.248 92.1564 1.063 94.105 1.063C94.8697 1.063 95.7577 1.137 96.769 1.285C97.805 1.40833 98.434 1.655 98.656 2.025L104.576 13.421V1.803C104.576 1.33433 105.723 1.1 108.017 1.1C110.311 1.1 111.458 1.33433 111.458 1.803V26.186ZM127.199 11.386C127.668 11.386 127.902 12.2493 127.902 13.976C127.902 14.494 127.841 15.1107 127.717 15.826C127.619 16.5167 127.421 16.862 127.125 16.862H122.426V20.562H129.234C129.654 20.562 129.937 21.1047 130.085 22.19C130.159 22.6587 130.196 23.1643 130.196 23.707C130.196 24.225 130.122 24.9033 129.974 25.742C129.826 26.5807 129.58 27 129.234 27H116.58C115.643 27 115.174 26.6177 115.174 25.853V2.062C115.174 1.42067 115.458 1.1 116.025 1.1H129.271C129.789 1.1 130.048 2.19767 130.048 4.393C130.048 6.56367 129.789 7.649 129.271 7.649H122.426V11.386H127.199ZM147.148 2.099C147.444 1.359 148.986 0.989 151.773 0.989C152.489 0.989 153.364 1.05067 154.4 1.174C155.461 1.27267 155.991 1.37133 155.991 1.47L149.701 14.272L156.213 26.519C156.287 26.6423 155.757 26.7657 154.622 26.889C153.488 26.9877 152.526 27.037 151.736 27.037C148.604 27.037 146.889 26.6177 146.593 25.779L143.818 18.712L141.302 26.001C141.056 26.6917 139.477 27.037 136.566 27.037C135.851 27.037 134.963 26.9877 133.902 26.889C132.842 26.7903 132.361 26.6547 132.459 26.482L138.231 13.68L132.237 1.47C132.163 1.34666 132.669 1.23566 133.754 1.137C134.864 1.01366 135.802 0.951998 136.566 0.951998C139.674 0.951998 141.376 1.396 141.672 2.284L144.225 8.5L147.148 2.099Z" fill="url(#paint0_linear_3001_1051)"></path>
<defs>
<linearGradient id="paint0_linear_3001_1051" x1="-6" y1="-22.75" x2="13.6088" y2="74.6316" gradientUnits="userSpaceOnUse">
<stop stop-color="#FFB400"></stop>
<stop offset="1" stop-color="#FF6C02"></stop>
</linearGradient>
</defs>
</svg><span class="ms-1 " style="font-size: 11px;color: orange;">${glitter.share.editerVersion}</span></div>`;
                    })();
            }
            return html `
                <div class="position-relative vh-100 vw-100 overflow-auto" style="word-break: break-word;white-space: nowrap;background:whitesmoke;">
                    <!-- Navbar -->
                    <header class="header navbar navbar-expand navbar-light bg-light border-bottom border-light shadow fixed-top" data-scroll-header style="height: 56px;">
                        <div class="container-fluid pe-lg-4" style="position: relative">
                            <div class="navbar-brand  text-dark d-none d-lg-flex py-0 h-100" style="width:220px;">
                                <div class="d-flex align-items-center justify-content-center border-end " style="width:50px;height: 56px;">
                                    <i
                                        class="fa-solid fa-left-to-bracket hoverBtn"
                                        style="cursor:pointer;"
                                        onclick="${gvc.event(() => {
            })}"
                                    >
                                    </i>
                                </div>
                                ${glitter.share.blogEditor
                ? html `
                                          <span
                                              class="ms-3 fw-500"
                                              style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
   background: -webkit-linear-gradient(135deg, #667eea 0%, #764ba2 100%);
   background-clip: text;
   -webkit-background-clip: text;
   color: transparent;"
                                              >${getEditorTitle()}</span
                                          >
                                      `
                : `<span class="ms-3 fw-500" style="  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
   background: -webkit-linear-gradient(135deg, #667eea 0%, #764ba2 100%);
   background-clip: text;
   -webkit-background-clip: text;
   color: transparent;">${getEditorTitle()}</span>
                                        `}
                            </div>
                            <div
                                class="border-end d-flex align-items-center justify-content-center ms-n2 fs-3 d-sm-none"
                                style="width:56px;height: 56px;cursor: pointer;"
                                onclick="${gvc.event(() => {
                glitter.openDrawer();
            })}"
                            >
                                <i class="fa-solid fa-bars"></i>
                            </div>
                            <div class="border-end d-none d-sm-block" style="width:${glitter.getUrlParameter('blogEditor') ? `100px` : `37px`};height: 56px; "></div>
                            ${(() => {
                if (Storage.select_function === 'backend-manger') {
                    return html ` <div
                                        class="me-auto t_39_normal border-end px-4 d-flex align-items-center justify-content-center"
                                        style="height: 56px;cursor: pointer;"
                                        onclick="${gvc.event(() => {
                        gvc.glitter.openNewTab('https://shopnex.cc/blog-home-page');
                    })}"
                                    >
                                        開店教學
                                    </div>`;
                }
                else {
                    return ``;
                }
            })()}
                            <div class="ms-2 d-flex align-items-center flex-fill ${Storage.select_function === 'page-editor' || Storage.select_function === 'user-editor' ? `` : `d-none`}" style="">
                                ${Storage.select_function === 'user-editor'
                ? ``
                : gvc.bindView(() => {
                    const id = gvc.glitter.getUUID();
                    return {
                        bind: id,
                        view: () => {
                            return html ` <div
                                                      class="hoverBtn  d-flex align-items-center justify-content-center   border "
                                                      style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                                      onclick="${gvc.event(() => {
                                SetGlobalValue.toggle(true);
                            })}"
                                                      data-bs-toggle="tooltip"
                                                      data-bs-placement="top"
                                                      data-bs-custom-class="custom-tooltip"
                                                      data-bs-title="全域設置"
                                                  >
                                                      <i class="fa-solid fa-bars"></i>
                                                  </div>`;
                        },
                        onCreate: () => {
                            $('.tooltip').remove();
                            $('[data-bs-toggle="tooltip"]').tooltip();
                        },
                    };
                })}
                                <div class="flex-fill"></div>
                                <div class="d-flex align-items-center" style="position: absolute;transform: translateX(-50%);left: calc(50% + 15px);">
                                    <div
                                        class="d-flex align-items-center justify-content-center hoverBtn  border ${Storage.select_function === 'user-editor' ? `d-none` : ``}"
                                        style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        data-bs-custom-class="custom-tooltip"
                                        data-bs-title="頁面代碼"
                                        onclick="${gvc.event(() => {
                PageCodeSetting.toggle(true, gvc);
            })}"
                                    >
                                        <i class="fa-sharp fa-regular fa-square-code"></i>
                                    </div>
                                    <div
                                        class="d-flex align-items-center justify-content-center hoverBtn ms-1 me-1 border ${Storage.select_function === 'user-editor' ? `d-none` : ``}"
                                        style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        data-bs-custom-class="custom-tooltip"
                                        data-bs-title="頁面編輯"
                                        onclick="${gvc.event(() => {
                PageSettingView.toggle(true);
            })}"
                                    >
                                        <i class="fa-regular fa-gear"></i>
                                    </div>
                                    ${(() => {
                if (glitter.share.editor_vm) {
                    return html ` <div class="btn btn-outline-secondary rounded px-3">${glitter.share.editor_vm.title}</div>`;
                }
                else {
                    return html ` <div class="btn-group ms-1" style="max-width: 350px;min-width: 250px;">
                                                <button
                                                    type="button"
                                                    class="btn btn-outline-secondary rounded px-2"
                                                    onclick="${gvc.event(() => {
                        $('#topd').toggle();
                    })}"
                                                >
                                                    <span style="max-width: 180px;overflow: hidden;text-overflow: ellipsis;">${data.data.name}</span>
                                                    <i class="fa-sharp fa-solid fa-caret-down position-absolute translate-middle-y" style="top: 50%;right: 20px;"></i>
                                                </button>
                                                ${gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                return html ` <div class="px-2 ${Storage.select_function === 'user-editor' ? `d-none` : ``}">
                                                                    ${EditorElem.select({
                                    title: '',
                                    gvc: gvc,
                                    def: Storage.select_page_type || 'page',
                                    array: EditorConfig.page_type_list,
                                    callback: (text) => {
                                        Storage.select_page_type = text;
                                        gvc.notifyDataChange(id);
                                        setTimeout(() => {
                                            $('#topd').toggle();
                                        });
                                    },
                                })}
                                                                </div>
                                                                <div class="w-100 border-bottom mt-2 ${Storage.select_function === 'user-editor' ? `d-none` : ``}"></div>
                                                                <ul class="list-group list-group-flush mt-2">
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
                                                            if (Storage.select_function === 'user-editor') {
                                                                return data.page_config && data.page_config.support_editor === 'true';
                                                            }
                                                            else {
                                                                return data.page_type == Storage.select_page_type;
                                                            }
                                                        },
                                                    }).then((data) => {
                                                        resolve(data.left);
                                                    });
                                                }));
                                            },
                                            divCreate: {
                                                class: `ms-n2 mt-n2`,
                                            },
                                        };
                                    });
                                })()}
                                                                </ul>`;
                            },
                            divCreate: {
                                class: 'dropdown-menu',
                                style: 'margin-top: 50px;max-height: calc(100vh - 100px);width:300px;overflow-y: scroll;',
                                option: [{ key: 'id', value: 'topd' }],
                            },
                            onCreate: () => {
                                $('.tooltip').remove();
                                $('[data-bs-toggle="tooltip"]').tooltip();
                            },
                        };
                    })}
                                            </div>`;
                }
            })()}

                                    <div
                                        class="d-flex align-items-center justify-content-center hoverBtn ms-2 me-1 border ${Storage.select_function === 'user-editor' ? `d-none` : ``}"
                                        style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        data-bs-custom-class="custom-tooltip"
                                        data-bs-title="複製當前頁面"
                                        onclick="${gvc.event(() => {
                EditorElem.openEditorDialog(gvc, (gvc) => {
                    const tdata = {
                        appName: config.appName,
                        tag: '',
                        group: gvc.glitter.share.editorViewModel.data.group,
                        name: '',
                        config: [],
                        page_type: Storage.select_page_type,
                        copy: gvc.glitter.getUrlParameter('page'),
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
                                        default: '',
                                        placeHolder: '請輸入頁面標籤[不得重複]',
                                        callback: (text) => {
                                            tdata.tag = text;
                                        },
                                    }),
                                    glitter.htmlGenerate.editeInput({
                                        gvc: gvc,
                                        title: '頁面名稱',
                                        default: '',
                                        placeHolder: '請輸入頁面名稱',
                                        callback: (text) => {
                                            tdata.name = text;
                                        },
                                    }),
                                ]);
                            },
                            divCreate: {},
                        };
                    })}
</div>
<div class="d-flex w-100 my-2 align-items-center justify-content-center">
<button class="btn btn-primary " style="width: calc(100% - 20px);" onclick="${gvc.event(() => {
                        const dialog = new ShareDialog(glitter);
                        dialog.dataLoading({ text: '上傳中', visible: true });
                        ApiPageConfig.addPage(tdata).then((it) => {
                            setTimeout(() => {
                                dialog.dataLoading({ text: '', visible: false });
                                if (it.result) {
                                    const li = new URL(location.href);
                                    li.searchParams.set('page', tdata.tag);
                                    location.href = li.href;
                                }
                                else {
                                    dialog.errorMessage({
                                        text: '已有此頁面標籤',
                                    });
                                }
                            }, 1000);
                        });
                    })}">確認新增</button>
</div>
            `;
                }, () => { }, 300, '複製頁面');
            })}"
                                    >
                                        <i class="fa-regular fa-copy"></i>
                                    </div>
                                    <div
                                        class="d-flex align-items-center justify-content-center hoverBtn  me-1 border ${Storage.select_function === 'user-editor' ? `d-none` : ``}"
                                        style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        data-bs-custom-class="custom-tooltip"
                                        data-bs-title="添加頁面"
                                        onclick="${gvc.event(() => {
                AddPage.toggle(true);
            })}"
                                    >
                                        <i class="fa-regular fa-circle-plus"></i>
                                    </div>
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
                        html ` <div
                                                class="d-flex align-items-center justify-content-center hoverBtn  border d-none"
                                                style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                                onclick="${gvc.event(() => {
                            EditorElem.openEditorDialog(gvc, (gvc) => {
                                return BgGlobalEvent.mainPage(gvc);
                            }, () => { }, 800, '事件集管理');
                        })}"
                                                data-bs-toggle="tooltip"
                                                data-bs-placement="top"
                                                data-bs-custom-class="custom-tooltip"
                                                data-bs-title="事件集"
                                            >
                                                <i class="fa-sharp fa-regular fa-brackets-curly"></i>
                                            </div>`,
                    ].join(`<div class="me-1"></div>`);
                }
            })()}
                                <div class="d-flex align-items-center justify-content-center hoverBtn ms-1 me-2 border bg-white
${(glitter.share.editorViewModel.homePage === glitter.getUrlParameter('page')) ? `d-none` : ``}
${(glitter.share.editor_vm) ? `d-none` : ``}
"
                                    style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    data-bs-custom-class="custom-tooltip"
                                    data-bs-title="返回首頁"
                                    onclick="${gvc.event(() => {
                const url = new URL(glitter.root_path + glitter.share.editorViewModel.homePage);
                url.search = location.search;
                location.href = url.href;
            })}"
                                >
                                    <i class="fa-regular fa-house"></i>
                                </div>
                                <div class="d-flex align-items-center justify-content-center hoverBtn  me-2 border
${(glitter.share.editor_vm) ? `d-none` : ``}
"
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
                    glitter.setCookie('ViewType', viewModel.type);
                    return html ` <div style="background:#f1f1f1;border-radius:10px;" class="d-flex align-items-center justify-content-center p-1 ">
                                            ${[
                        ...(() => {
                            if (Storage.select_function === 'user-editor') {
                                if (viewModel.type === ViewType.col3) {
                                    viewModel.type = ViewType.desktop;
                                }
                                return [];
                            }
                            else {
                                return [
                                    {
                                        icon: 'fa-regular fa-columns-3',
                                        type: ViewType.col3,
                                    },
                                ];
                            }
                        })(),
                        { icon: 'fa-regular fa-desktop', type: ViewType.desktop },
                        { icon: 'fa-regular fa-mobile', type: ViewType.mobile },
                        { icon: 'fa-solid fa-expand', type: ViewType.fullScreen },
                    ]
                        .map((dd) => {
                        if (dd.type === viewModel.type) {
                            return html ` <div
                                                            class="d-flex align-items-center justify-content-center bg-white"
                                                            style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                                        >
                                                            <i class="${dd.icon}"></i>
                                                        </div>`;
                        }
                        else {
                            return html ` <div
                                                            class="d-flex align-items-center justify-content-center"
                                                            style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                                            onclick="${gvc.event(() => {
                                viewModel.type = dd.type;
                                glitter.setCookie('ViewType', viewModel.type);
                                gvc.notifyDataChange('HtmlEditorContainer');
                            })}"
                                                        >
                                                            <i class="${dd.icon}"></i>
                                                        </div>`;
                        }
                        return ``;
                    })
                        .join('')}
                                        </div>`;
                },
                divCreate: {},
            })}
                                <button
                                    class=" btn ms-2  ${glitter.getUrlParameter('editorPosition') === '2' ? `d-none` : ``}"
                                    style="height: 42px;display: inline-flex;
padding: 10px 22px 10px 23px;
justify-content: center;
align-items: center;
border-radius: 12px;
border:none;
background: ${EditorConfig.editor_layout.btn_background};
color:white;
"
                                    onclick="${gvc.event(() => {
                glitter.htmlGenerate.saveEvent();
            })}"
                                >
                                    儲存
                                </button>
                            </div>
                            ${(() => {
                if (Storage.select_function === 'backend-manger') {
                    return (html ` <div
                                            class="ms-auto me-2 bt_orange"
                                            onclick="${gvc.event(() => {
                        const url = new URL('', glitter.share.editorViewModel.domain ? `https://${glitter.share.editorViewModel.domain}/?page=index` : location.href);
                        url.searchParams.delete('type');
                        url.searchParams.set('page', glitter.getUrlParameter('page'));
                        glitter.openNewTab(url.href);
                    })}"
                                        >
                                            預覽商店
                                        </div>` + SaasViewModel.app_manager(gvc));
                }
                else {
                    return ``;
                }
            })()}
                        </div>
                    </header>
                    <aside
                        id="componentsNav"
                        class="${viewModel.type === ViewType.fullScreen ? `d-none` : ``} offcanvas offcanvas-start offcanvas-expand-lg position-fixed top-0 start-0 vh-100 bg-light overflow-hidden"
                        style="${size < 800 ? `width: 0px;` : Storage.select_function === 'user-editor' ? `width: 365px;` : `width: 284px;`}"
                    >
                        <div class="offcanvas-header d-none d-lg-flex justify-content-start border-bottom px-0 ${Storage.select_function === 'user-editor' ? `border-end` : ``}" style="height: 56px;">
                            <div class="navbar-brand text-dark d-none d-lg-flex py-0 h-100">
                                <div class="d-flex align-items-center justify-content-center border-end " style="width:50px;height: 56px;">
                                    <i
                                        class="fa-solid fa-left-to-bracket hoverBtn"
                                        style="cursor:pointer;"
                                        onclick="${gvc.event(() => {
                if (glitter.share.editor_vm) {
                    glitter.share.editor_vm.close();
                }
                else {
                    if (Storage.select_function !== 'backend-manger') {
                        const url = new URL(location.href);
                        url.searchParams.set('function', 'backend-manger');
                        location.href = url.href;
                    }
                    else {
                        const url = new URL(location.href);
                        url.searchParams.delete('appName');
                        url.searchParams.delete('type');
                        url.searchParams.set('page', 'backend_manager');
                        location.href = url.href.replace(url.search, '');
                    }
                }
            })}"
                                    >
                                    </i>
                                </div>
                                <span
                                    class="ms-3 fw-500"
                                    style="  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
   background: -webkit-linear-gradient(135deg, #667eea 0%, #764ba2 100%);
   background-clip: text;
   -webkit-background-clip: text;
   color: transparent;"
                                    >${getEditorTitle()}</span
                                >
                            </div>
                        </div>
                        ${left}
                    </aside>
                    <!-- Page container -->
                    <main
                        class="docs-container"
                        style="padding-top: 56px;
                          padding-right:${(viewModel.type === ViewType.col3 || viewModel.type === ViewType.mobile) &&
                Storage.select_function !== 'backend-manger' &&
                Storage.select_function !== 'server-manager'
                ? `290`
                : `0`}px;${viewModel.type === ViewType.fullScreen
                ? `padding-left:0px;`
                : `
                          padding-left:${size < 800 ? `0px;` : Storage.select_function === 'user-editor' ? `365px;` : `284px;`}
                          ${Storage.select_function === 'page-editor' ? `overflow:hidden;` : ``}
                          `}"
                    >
                        ${gvc.bindView({
                dataList: [{ obj: viewModel, key: 'type' }],
                bind: `showView`,
                view: () => {
                    var _a;
                    let selectPosition = (_a = glitter.getUrlParameter('editorPosition')) !== null && _a !== void 0 ? _a : '0';
                    switch (selectPosition) {
                        default:
                            return Main_editor.center(viewModel, gvc);
                    }
                },
                divCreate: {},
            })}
                    </main>
                    ${(() => {
                if ((viewModel.type === ViewType.col3 || viewModel.type === ViewType.mobile) &&
                    Storage.select_function !== 'backend-manger' &&
                    Storage.select_function !== 'server-manager' &&
                    Storage.select_function !== 'user-editor') {
                    return Main_editor.pageAndComponent({
                        gvc: gvc,
                        data: data,
                        divCreate: {
                            class: `p-0  side-nav-end  position-fixed top-0 end-0 vh-100 border-start  bg-white `,
                            style: `width: 290px;padding-top:60px !important;`,
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
