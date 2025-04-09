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
import { ApiUser } from '../glitter-base/route/user.js';
import { GlobalUser } from '../glitter-base/global/global-user.js';
import { Setting_editor } from './function-page/setting_editor.js';
import { AiMessage } from '../cms-plugin/ai-message.js';
import { BgCustomerMessage } from '../backend-manager/bg-customer-message.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { Chat } from '../glitter-base/route/chat.js';
import { Language } from '../glitter-base/global/language.js';
import { SaasOffer } from '../saas-offer.js';
const html = String.raw;
export var ViewType;
(function (ViewType) {
    ViewType["mobile"] = "mobile";
    ViewType["desktop"] = "desktop";
    ViewType["col3"] = "col3";
    ViewType["fullScreen"] = "fullScreen";
})(ViewType || (ViewType = {}));
export class Editor {
    constructor(gvc, data) {
        const size = document.body.offsetWidth;
        const glitter = gvc.glitter;
        const $ = gvc.glitter.$;
        gvc.addStyle(`
      .tab-pane {
        word-break: break-word;
        white-space: normal;
      }
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
      div {
        word-break: break-word;
        white-space: nowrap;
      }
    `);
        function goBack() {
            if (glitter.share.editor_vm) {
                glitter.share.editor_vm.close();
            }
            else {
                if (glitter.pageConfig.length > 1) {
                    glitter.setUrlParameter('function', 'backend-manger');
                    glitter.goBack();
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
            }
        }
        function preView() {
            if (glitter.getUrlParameter('tab') === 'page_manager') {
                const content = JSON.parse(localStorage.getItem('preview_data'));
                const href = (() => {
                    return `${gvc.glitter.root_path}${(() => {
                        switch (content.page_type) {
                            case 'shopping':
                                return 'shop';
                            case 'hidden':
                                return 'hidden';
                            case 'page':
                                return 'pages';
                        }
                        return ``;
                    })()}/${content.tag}?preview=true&appName=${window.parent.appName}`;
                })();
                content.config = glitter.share.editorViewModel.data.config;
                localStorage.setItem('preview_data', JSON.stringify(content));
                const url = new URL(href);
                window.parent.glitter.openNewTab(url.href);
            }
            else if (gvc.glitter.getUrlParameter('device') === 'mobile') {
                if (document.body.clientWidth < 920) {
                    glitter.openNewTab(`${glitter.root_path}index-mobile?appName=${window.appName}&device=mobile`);
                }
                else {
                    BgWidget.appPreview({
                        gvc: gvc,
                        title: '預覽頁面',
                        src: `${glitter.root_path}index-app?appName=${window.appName}&device=mobile`,
                        style: `max-height: calc(100vh - 100px);`,
                    });
                }
            }
            else {
                const url = new URL('', glitter.share.editorViewModel.domain
                    ? `https://${glitter.share.editorViewModel.domain}/?page=index`
                    : location.href);
                url.searchParams.delete('type');
                url.searchParams.set('page', glitter.getUrlParameter('page'));
                if (document.body.clientWidth < 922 &&
                    Storage.view_type === 'desktop' &&
                    gvc.glitter.deviceType === gvc.glitter.deviceTypeEnum.Ios) {
                    url.searchParams.set('_preview_width', '1300');
                    url.searchParams.set('_preview_scale', `${(document.body.clientWidth / 1300).toFixed(2)}`);
                }
                glitter.openNewTab(url.href);
            }
        }
        this.create = (left, right) => {
            function getEditorTitle() {
                let click = 0;
                return html ` <div
          class="d-flex align-items-end"
          style="gap:5px;"
          onclick="${gvc.event(() => {
                    click++;
                    if (click > 5) {
                        Setting_editor.addPlugin(gvc, () => {
                            gvc.recreateView();
                        });
                        click = 0;
                    }
                })}"
        >
          <img src="${SaasOffer.saas_logo}" style="max-width:130px;">
          <span class="ms-1" style="font-size: 11px;color: orange;">${glitter.share.editerVersion}</span>
        </div>`;
            }
            function getSizeSelection() {
                return gvc.bindView({
                    bind: `showViewIcon`,
                    view: () => {
                        return html ` <div
              style="background:#f1f1f1;border-radius:10px;"
              class="d-flex align-items-center justify-content-center p-1 "
            >
              <div
                class="${glitter.share.is_blog_editor()
                            ? `d-none`
                            : `d-flex`} align-items-center justify-content-center  text-white me-1 fw-500"
                style="height:36px;width:36px;border-radius:10px;cursor:pointer;background:linear-gradient(143deg, #FFB400 -22.7%, #FF6C02 114.57%);"
                onclick="${gvc.event(() => {
                            Editor.languageSwitch(gvc);
                        })}"
              >
                ${Language.getLanguageText({})}
              </div>
              ${[
                            ...(() => {
                                if (Storage.select_function === 'user-editor') {
                                    if (Storage.view_type === ViewType.col3) {
                                        Storage.view_type = ViewType.desktop;
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
                            ...(() => {
                                if (glitter.getUrlParameter('device') === 'mobile') {
                                    return [];
                                }
                                else {
                                    return [{ icon: 'fa-regular fa-desktop', type: ViewType.desktop }];
                                }
                            })(),
                            { icon: 'fa-regular fa-mobile', type: ViewType.mobile },
                        ]
                            .map(dd => {
                            if (dd.type === Storage.view_type) {
                                return html ` <div
                      class="d-flex align-items-center justify-content-center bg-white"
                      style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                    >
                      <i class="${dd.icon}"></i>
                    </div>`;
                            }
                            else {
                                return html ` <div
                      class="d-flex align-items-center justify-content-center ci_${dd.type}"
                      style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                      onclick="${gvc.event(() => {
                                    Storage.view_type = dd.type;
                                    glitter.share.resetCenterFrame();
                                    document.querySelector('.iframe_view').classList.add('d-none');
                                    setTimeout(() => {
                                        document.querySelector('.iframe_view').contentWindow.glitter.pageConfig[0].gvc.recreateView();
                                        document.querySelector('.iframe_view').classList.remove('d-none');
                                    }, 10);
                                    gvc.notifyDataChange(['showViewIcon', 'MainEditorLeft']);
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
                    divCreate: {
                        class: ``,
                    },
                });
            }
            return html `
        <div
          class="position-relative vw-100 overflow-auto editor-constructor"
          style="word-break: break-word;white-space: nowrap;background:whitesmoke;height:${window.innerHeight}px;"
        >
          <header
            class="header navbar navbar-expand navbar-light bg-light border-bottom   fixed-top "
            data-scroll-header
            style="${parseInt(glitter.share.top_inset, 10)
                ? `padding-top:${glitter.share.top_inset || 0}px;min-height: 56px;`
                : `height:56px;`}"
          >
            <div
              class="${document.body.clientWidth < 800
                ? `d-flex w-100 align-items-center`
                : `container-fluid ps-0 pe-lg-4`}"
              style="position: relative"
            >
              <div class="navbar-brand text-dark d-none d-lg-flex py-0 h-100 " style="width: 255px;">
                <div
                  class="d-flex align-items-center justify-content-center border-end "
                  style="height: 56px; min-width: 60px;"
                >
                  <i
                    class="fa-solid fa-left-to-bracket hoverBtn"
                    style="cursor:pointer;"
                    onclick="${gvc.event(() => {
                goBack();
            })}"
                  >
                  </i>
                </div>
                <span
                  class="ms-4 fw-500"
                  style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
background: -webkit-linear-gradient(135deg, #667eea 0%, #764ba2 100%);
background-clip: text;
-webkit-background-clip: text;
color: transparent;"
                  >${getEditorTitle()}</span
                >
              </div>

              ${document.body.clientWidth > 922 || EditorConfig.backend_page() === 'backend-manger'
                ? html `
                    <div
                      class="border-end d-flex align-items-center justify-content-center ${document.body.clientWidth >
                    800
                    ? `ms-n2`
                    : ``} fs-3 d-lg-none"
                      style="width:56px;height: 56px;cursor: pointer;"
                      onclick="${gvc.event(() => {
                    if (EditorConfig.backend_page() === 'backend-manger') {
                        glitter.share.toggle_left_bar();
                    }
                    else {
                        goBack();
                    }
                })}"
                    >
                      ${EditorConfig.backend_page() === 'backend-manger'
                    ? `<i class="fa-solid fa-bars"></i>`
                    : ` <i class="fa-solid fa-arrow-left-from-arc"></i>`}
                    </div>
                  `
                : html `
                    <li class="nav-item dropdown">
                      <div
                        class="border-end d-flex align-items-center justify-content-center flex-column  fs-3 "
                        style="width:56px;height: 56px;cursor: pointer;"
                      >
                        <i class="fa-regular fa-ellipsis"></i>
                      </div>
                      <ul class="dropdown-menu">
                        ${[
                    {
                        icon: `<i class="fa-duotone fa-window guide-user-editor-1-icon"></i>`,
                        index: 'layout',
                        title: '元件列表總覽',
                    },
                    {
                        icon: `<i class="fa-sharp fa-regular fa-globe guide-user-editor-11-icon"></i>`,
                        index: 'color',
                        title: '全站樣式設定',
                    },
                    {
                        icon: `<i class="fa-regular fa-grid-2 design-guide-1-icon"></i>`,
                        index: 'widget',
                        title: '統一元件設定',
                    },
                    {
                        icon: `<i class="fa-solid fa-arrow-left-from-arc"></i>`,
                        title: `返回後台`,
                        event: gvc.event(() => {
                            goBack();
                        }),
                    },
                ]
                    .map(dd => {
                    var _a;
                    return html ` <li>
                              <a
                                class="dropdown-item d-flex align-items-center"
                                style="gap:10px;"
                                onclick="${(_a = dd.event) !== null && _a !== void 0 ? _a : gvc.event(() => {
                        gvc.glitter.share.editorViewModel.waitCopy = undefined;
                        gvc.glitter.share.editorViewModel.selectItem = undefined;
                        Storage.page_setting_item = dd.index;
                        if (document.body.clientWidth < 992) {
                            glitter.share.toggle_left_bar();
                        }
                        Storage.lastSelect = '';
                        gvc.notifyDataChange(['MainEditorLeft', 'top_sm_bar']);
                    })}"
                              >
                                <div class="d-flex align-items-center" style="width:20px;">${dd.icon}</div>
                                ${dd.title}</a
                              >
                            </li>`;
                })
                    .join('')}
                      </ul>
                    </li>
                    <div
                      class="border-end d-flex align-items-center justify-content-center flex-column  fs-5 fw-bold   linear_text"
                      style="width:56px;height: 56px;cursor: pointer;"
                      onclick="${gvc.event(() => {
                    AiMessage.vm.select_bt = 'page_editor';
                    AiMessage.setDrawer(gvc, [
                        {
                            key: 'page_editor',
                            label: '元件編輯',
                        },
                        {
                            key: 'writer',
                            label: '文案寫手',
                        },
                        {
                            key: 'design',
                            label: '圖片生成',
                        },
                    ]);
                })}"
                    >
                      AI
                    </div>
                  `}
              <div
                class="border-end d-none d-lg-block"
                style="height: 56px;${(() => {
                switch (EditorConfig.backend_page()) {
                    case 'page-editor':
                        return `width: 15px;`;
                    case 'user-editor':
                        return `width: 95px;`;
                    default:
                        return `width: 14px;`;
                }
            })()}"
              ></div>

              ${(() => {
                if (Storage.select_function === 'backend-manger') {
                    return html `
                  
                    <div
                      class="me-auto t_39_normal border-end px-4  ${SaasOffer.is_dealer ? `d-none` : `d-none d-sm-flex`} align-items-center justify-content-center"
                      style="height: 56px;cursor: pointer;"
                      onclick="${gvc.event(() => {
                        gvc.glitter.openNewTab('https://shopnex.tw/blogs');
                    })}"
                    >
                      教學文章
                    </div>
                  `;
                }
                else {
                    return ``;
                }
            })()}
              <div
                class="ms-2 d-flex align-items-center flex-fill ${Storage.select_function === 'page-editor' ||
                Storage.select_function === 'user-editor'
                ? ``
                : `d-none`}"
                style=""
              >
                ${gvc.bindView(() => {
                const id = gvc.glitter.getUUID();
                return {
                    bind: id,
                    view: () => {
                        const size = document.body.clientWidth > 768 ? 24 : 18;
                        return [
                            document.body.clientWidth < 992
                                ? ``
                                : html ` <div
                              class="ms-auto me-2 bt_orange_lin_mb d-md-flex"
                              style=""
                              onclick="${gvc.event(() => {
                                    AiMessage.vm.select_bt = 'page_editor';
                                    AiMessage.setDrawer(gvc, [
                                        {
                                            key: 'page_editor',
                                            label: '元件編輯',
                                        },
                                        {
                                            key: 'writer',
                                            label: '文案寫手',
                                        },
                                        {
                                            key: 'design',
                                            label: '圖片生成',
                                        },
                                    ]);
                                })}"
                            >
                              <img
                                src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/size1440_s*px$_sas0s9s0s1sesas0_1697354801736-Glitterlogo.png"
                                class="me-2"
                                style="width:25px;height:25px;"
                              />AI助手
                            </div>`,
                            html ` <div
                          class="hoverBtn  d-flex align-items-center justify-content-center   border ${Storage.select_function ===
                                'user-editor'
                                ? `d-none`
                                : ``}"
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
                        </div>`,
                        ].join('');
                    },
                    divCreate: {
                        class: `d-flex align-items-center`,
                    },
                    onCreate: () => {
                        $('.tooltip').remove();
                        $('[data-bs-toggle="tooltip"]').tooltip();
                    },
                };
            })}
                <div class="flex-fill"></div>
                <div
                  class="d-flex align-items-center"
                  style="position: absolute;transform: translateX(-50%);${document.body.clientWidth > 800
                ? `left: calc(50% + 15px);`
                : `left: calc(50%);`}"
                >
                  <div
                    class="d-flex align-items-center justify-content-center hoverBtn  border ${Storage.select_function ===
                'user-editor'
                ? `d-none`
                : ``}"
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
                    class="d-flex align-items-center justify-content-center hoverBtn ms-1 me-1 border ${Storage.select_function ===
                'user-editor'
                ? `d-none`
                : ``}"
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
                if (Storage.select_function === 'backend-manger') {
                    return ``;
                }
                return html ` <div
                      class="btn-group "
                      style="${document.body.clientWidth < 768 ? `` : `max-width:350px;min-width:200px;`}
                                                ${EditorConfig.backend_page() === 'page-editor' ? `` : ``}
                                               "
                    >
                      ${document.body.clientWidth < 800
                    ? [getSizeSelection()].join('')
                    : html ` <button
                            type="button"
                            class="btn btn-outline-secondary rounded px-2 "
                            onclick="${gvc.event(() => {
                        if (gvc.glitter.getUrlParameter('device') !== 'mobile') {
                            $('#topd').toggle();
                        }
                    })}"
                          >
                            <span style="max-width: 180px;overflow: hidden;text-overflow: ellipsis;"
                              >${data.data.name}</span
                            >
                            <i
                              class="fa-sharp fa-solid fa-caret-down position-absolute translate-middle-y ${gvc.glitter.getUrlParameter('device') === 'mobile'
                        ? `d-none`
                        : ``}"
                              style="top: 50%;right: 20px;"
                            ></i>
                          </button>`}
                      ${gvc.bindView(() => {
                    const id = gvc.glitter.getUUID();
                    return {
                        bind: id,
                        view: () => {
                            if (Storage.select_function !== 'page-editor') {
                                return ``;
                            }
                            return html ` <div class="px-2">
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
                              <div class="w-100 border-bottom mt-2 "></div>
                              <ul class="list-group list-group-flush mt-2">
                                ${(() => {
                                return gvc.bindView(() => {
                                    const id = glitter.getUUID();
                                    return {
                                        bind: id,
                                        view: () => {
                                            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                                PageEditor.pageSelctor(gvc, (d3) => {
                                                    glitter.share.clearSelectItem();
                                                    data.data = d3;
                                                    glitter.setUrlParameter('page', d3.tag);
                                                    glitter.share.reloadEditor();
                                                }, {
                                                    filter: data => {
                                                        if (Storage.select_function === 'user-editor') {
                                                            return data.page_config && data.page_config.support_editor === 'true';
                                                        }
                                                        else {
                                                            return data.page_type == Storage.select_page_type;
                                                        }
                                                    },
                                                }).then(data => {
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
                            style: `margin-top: 50px;max-height: calc(100vh - 100px);width:${document.body.clientWidth < 768 ? 200 : 260}px;overflow-y: scroll;`,
                            option: [{ key: 'id', value: 'topd' }],
                        },
                        onCreate: () => {
                            $('.tooltip').remove();
                            $('[data-bs-toggle="tooltip"]').tooltip();
                        },
                    };
                })}
                    </div>`;
            })()}

                  <div
                    class="d-flex align-items-center justify-content-center hoverBtn ms-2 me-1 border ${Storage.select_function ===
                'user-editor'
                ? `d-none`
                : ``}"
                    style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-custom-class="custom-tooltip"
                    data-bs-title="複製當前頁面"
                    onclick="${gvc.event(() => {
                EditorElem.openEditorDialog(gvc, gvc => {
                    const tdata = {
                        appName: config.appName,
                        tag: '',
                        group: gvc.glitter.share.editorViewModel.data.group,
                        name: '',
                        config: [],
                        page_type: Storage.select_page_type,
                        copy: gvc.glitter.getUrlParameter('page'),
                    };
                    return html `
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
                                        callback: text => {
                                            tdata.tag = text;
                                        },
                                    }),
                                    glitter.htmlGenerate.editeInput({
                                        gvc: gvc,
                                        title: '頁面名稱',
                                        default: '',
                                        placeHolder: '請輸入頁面名稱',
                                        callback: text => {
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
                              <button
                                class="btn btn-primary "
                                style="width: calc(100% - 20px);"
                                onclick="${gvc.event(() => {
                        const dialog = new ShareDialog(glitter);
                        dialog.dataLoading({
                            text: '上傳中',
                            visible: true,
                        });
                        ApiPageConfig.addPage(tdata).then(it => {
                            setTimeout(() => {
                                dialog.dataLoading({
                                    text: '',
                                    visible: false,
                                });
                                if (it.result) {
                                    location.href = `${glitter.root_path}/${tdata.tag}?type=editor&appName=${window.appName}&function=${EditorConfig.backend_page()}`;
                                }
                                else {
                                    dialog.errorMessage({
                                        text: '已有此頁面標籤',
                                    });
                                }
                            }, 1000);
                        });
                    })}"
                              >
                                確認新增
                              </button>
                            </div>
                          `;
                }, () => { }, 300, '複製頁面');
            })}"
                  >
                    <i class="fa-regular fa-copy"></i>
                  </div>
                  <div
                    class="d-flex align-items-center justify-content-center hoverBtn  me-1 border ${Storage.select_function ===
                'user-editor'
                ? `d-none`
                : ``}"
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
                return [
                    html ` <div
                      class="d-flex align-items-center justify-content-center hoverBtn  border d-none"
                      style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                      onclick="${gvc.event(() => {
                        EditorElem.openEditorDialog(gvc, gvc => {
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
            })()}
                ${gvc.bindView(() => {
                return {
                    bind: 'step-container',
                    view: () => {
                        const stepManager = glitter.share.stepManager;
                        return html ` <div
                          class="fs-5"
                          style="cursor: pointer;color: ${!stepManager.canGoBack() ? `#DDDDDD` : `#393939`};"
                          onclick="${gvc.event(() => {
                            stepManager.previousStep()();
                        })}"
                        >
                          <i class="fa-solid fa-arrow-rotate-left"></i>
                        </div>
                        <div
                          class=" fs-5"
                          style="cursor: pointer;color: ${!stepManager.canGoForward() ? `#DDDDDD` : `#393939`};"
                          onclick="${gvc.event(() => {
                            stepManager.nextStep()();
                        })}"
                        >
                          <i class="fa-solid fa-arrow-rotate-right"></i>
                        </div>`;
                    },
                    divCreate: {
                        class: `d-flex me-3`,
                        style: `gap:10px;`,
                    },
                };
            })}
                ${document.body.clientWidth > 768 ? getSizeSelection() : ``}
                ${document.body.clientWidth < 768
                ? html `
                      <div
                        class="border-start d-flex align-items-center justify-content-center flex-column  fs-3 "
                        style="width:56px;height: 56px;cursor: pointer;"
                        onclick="${gvc.event(() => {
                    preView();
                })}"
                      >
                        <i class="fa-regular fa-eye"></i>
                      </div>
                      <div
                        class="border-start d-flex align-items-center justify-content-center flex-column  fs-3  "
                        style="width:56px;height: 56px;cursor: pointer;"
                        onclick="${gvc.event(() => {
                    glitter.htmlGenerate.saveEvent(false);
                })}"
                      >
                        <i class="fa-regular fa-floppy-disk"></i>
                      </div>
                    `
                : html ` <button
                        class="ms-2 btn   ${glitter.getUrlParameter('editorPosition') === '2'
                    ? `d-none`
                    : ``} d-none d-sm-flex"
                        style="height: 42px;
display: inline-flex;
padding: 10px 22px 10px 23px;
justify-content: center;
align-items: center;
border-radius: 10px;;
border: 1px solid ${EditorConfig.editor_layout.main_color};
color:${EditorConfig.editor_layout.main_color};
"
                        onclick="${gvc.event(() => {
                    preView();
                })}"
                      >
                        <div
                          style="background: ${EditorConfig.editor_layout.btn_background};
background-clip: text;
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;"
                        >
                          預覽
                        </div>
                      </button>
                      <button
                        class=" btn ms-2  ${glitter.getUrlParameter('editorPosition') === '2' ? `d-none` : ``}"
                        style="height: 42px;
display: inline-flex;
padding: 10px 22px 10px 23px;
border-radius: 10px;;
justify-content: center;
align-items: center;
border:none;
background: ${EditorConfig.editor_layout.btn_background};
color:white;
"
                        onclick="${gvc.event(() => {
                    glitter.htmlGenerate.saveEvent(false);
                })}"
                      >
                        儲存
                      </button>`}
              </div>
              ${(() => {
                if (Storage.select_function === 'backend-manger') {
                    const size = document.body.clientWidth > 768 ? 24 : 18;
                    return (html `
                      <div
                        class="ms-auto me-2 bt_orange_lin_mb"
                        style=""
                        onclick="${gvc.event(() => {
                        AiMessage.setDrawer(gvc);
                    })}"
                      >
                        <img
                          src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/size1440_s*px$_sas0s9s0s1sesas0_1697354801736-Glitterlogo.png"
                          class="me-2"
                          style="width:${size}px;height: ${size}px;"
                        />AI助手
                      </div>
                      <div class="position-relative">
                        ${gvc.bindView((() => {
                        const chatId = glitter.getUUID();
                        const userPlan = GlobalUser.getPlan().id;
                        return {
                            bind: chatId,
                            view: () => {
                                if (userPlan == 0) {
                                    return '';
                                }
                                return html ` <div
                                    class="me-2 bt_orange_lin_mb position-relative"
                                    style="width:42px;"
                                    onclick="${gvc.event(() => {
                                    BgCustomerMessage.toggle(true, gvc);
                                })}"
                                  >
                                    <i class="fa-regular fa-messages"></i>
                                  </div>
                                  ${gvc.bindView(() => {
                                    const message_notice = gvc.glitter.getUUID();
                                    let unread = 0;
                                    let socket = undefined;
                                    const url = new URL(window.glitterBackend);
                                    let vm = {
                                        close: false,
                                    };
                                    function loadData() {
                                        Chat.getUnRead({
                                            user_id: 'manager',
                                        }).then((data) => __awaiter(this, void 0, void 0, function* () {
                                            unread = data.response.length;
                                            gvc.notifyDataChange(message_notice);
                                        }));
                                    }
                                    loadData();
                                    function connect() {
                                        socket = location.href.includes('https://')
                                            ? new WebSocket(`wss://${url.hostname}/websocket`)
                                            : new WebSocket(`ws://${url.hostname}:9003`);
                                        socket.addEventListener('open', function (event) {
                                            console.log('Connected to update list server');
                                            socket.send(JSON.stringify({
                                                type: 'message-count-change',
                                                user_id: 'manager',
                                                app_name: window.appName,
                                            }));
                                        });
                                        socket.addEventListener('message', function (event) {
                                            return __awaiter(this, void 0, void 0, function* () {
                                                console.log(`update_message_count`);
                                                const data = JSON.parse(event.data);
                                                if (data.type === 'update_message_count') {
                                                    loadData();
                                                }
                                            });
                                        });
                                        socket.addEventListener('close', function (event) {
                                            console.log('Disconnected from server');
                                            if (!vm.close) {
                                                console.log('Reconnected from server');
                                                connect();
                                            }
                                        });
                                    }
                                    connect();
                                    return {
                                        bind: message_notice,
                                        view: () => {
                                            return html ` <div
                                          class="${unread
                                                ? `d-flex`
                                                : `d-none`} rounded-circle bg-danger text-white  align-items-center justify-content-center fw-500"
                                          style="width:15px;height: 15px;color: white !important;"
                                        >
                                          ${unread}
                                        </div>`;
                                        },
                                        divCreate: {
                                            class: `position-absolute`,
                                            style: `font-size: 10px;right: 13px;top: 3px;`,
                                        },
                                        onDestroy: () => {
                                            vm.close = true;
                                            socket && socket.close();
                                        },
                                    };
                                })}`;
                            },
                        };
                    })())}
                      </div>
                      ${gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        const notice_count = gvc.glitter.getUUID();
                        let toggle = false;
                        let unread = 0;
                        let socket = undefined;
                        let vm = {
                            close: false,
                        };
                        function loadData() {
                            return __awaiter(this, void 0, void 0, function* () {
                                unread = (yield ApiUser.getNoticeUnread(window.glitterBase, GlobalUser.saas_token))
                                    .response.count;
                                gvc.notifyDataChange(id);
                            });
                        }
                        loadData();
                        function connect() {
                            const url = new URL(window.glitterBackend);
                            socket = location.href.includes('https://')
                                ? new WebSocket(`wss://${url.hostname}/websocket`)
                                : new WebSocket(`ws://${url.hostname}:9003`);
                            socket.addEventListener('open', function (event) {
                                return __awaiter(this, void 0, void 0, function* () {
                                    console.log('Connected to notice count server');
                                    const userData = (yield ApiUser.getSaasUserData(GlobalUser.saas_token, 'me')).response;
                                    socket.send(JSON.stringify({
                                        type: 'notice_count_change',
                                        user_id: userData.userID,
                                        app_name: window.appName,
                                    }));
                                });
                            });
                            socket.addEventListener('message', function (event) {
                                return __awaiter(this, void 0, void 0, function* () {
                                    const data = JSON.parse(event.data);
                                    if (data.type === 'notice_count_change') {
                                        loadData();
                                    }
                                });
                            });
                            socket.addEventListener('close', function (event) {
                                console.log('Disconnected from server');
                                if (!vm.close) {
                                    console.log('Reconnected from server');
                                    connect();
                                }
                            });
                        }
                        connect();
                        return {
                            bind: id,
                            view: () => {
                                let view = [
                                    html ` <div
                                class="me-2 bt_orange_lin_mb position-relative"
                                style="width: 42px;"
                                onclick="${gvc.event(() => {
                                        toggle = !toggle;
                                        unread = 0;
                                        setTimeout(() => {
                                            gvc.notifyDataChange(id);
                                        }, 100);
                                    })}"
                              >
                                ${toggle ? `<i class="fa-solid fa-xmark"></i>` : `<i class="fa-regular fa-bell"></i>`}
                              </div>`,
                                    gvc.bindView(() => {
                                        return {
                                            bind: notice_count,
                                            view: () => {
                                                return html ` <div
                                      class="${unread
                                                    ? `d-flex`
                                                    : `d-none`} rounded-circle bg-danger text-white  align-items-center justify-content-center fw-500"
                                      style="width:15px;height: 15px;color: white;"
                                    >
                                      ${unread}
                                    </div>`;
                                            },
                                            divCreate: {
                                                class: `position-absolute`,
                                                style: `font-size: 10px;right: 13px;top: 3px;`,
                                            },
                                        };
                                    }),
                                ];
                                if (toggle) {
                                    glitter.ut.frSize({
                                        sm: () => {
                                            view.push(html ` <div
                                          class="position-fixed vw-100 vh-100 top-0 start-0"
                                          style="z-index: 999;"
                                          onclick="${gvc.event(() => {
                                                toggle = !toggle;
                                                setTimeout(() => {
                                                    gvc.notifyDataChange(id);
                                                }, 100);
                                            })}"
                                        ></div>
                                        <div
                                          class="card rounded-3 shadow position-absolute "
                                          style="max-width:100vw;width:450px;height: 600px;right: 0px;top:${parseInt(glitter.share.top_inset, 10) + 42}px;z-index: 9999;"
                                        >
                                          <iframe
                                            class="card rounded-3 shadow position-absolute"
                                            src="${glitter.root_path}notice-widget?appName=cms_system&cms=true"
                                          ></iframe>
                                        </div>`);
                                        },
                                    }, () => {
                                        view.push(html ` <div
                                        class="position-fixed vw-100 vh-100 top-0 start-0"
                                        style="z-index: 999;"
                                        onclick="${gvc.event(() => {
                                            toggle = !toggle;
                                            setTimeout(() => {
                                                gvc.notifyDataChange(id);
                                            }, 100);
                                        })}"
                                      ></div>
                                      <div
                                        class="card  shadow position-fixed "
                                        style="max-width:100vw;width:100vw;height:calc(100vh - ${parseInt(glitter.share.top_inset, 10) + 50}px);right: 0px;top:${parseInt(glitter.share.top_inset, 10) +
                                            50}px;z-index: 999;"
                                      >
                                        <iframe
                                          class="card  shadow position-absolute"
                                          src="${glitter.root_path}notice-widget?appName=cms_system&cms=true"
                                        ></iframe>
                                      </div>`);
                                    })();
                                }
                                return view.join('');
                            },
                            divCreate: {
                                class: `position-relative `,
                            },
                        };
                    })}
                    ` + SaasViewModel.app_manager(gvc));
                }
                else {
                    return ``;
                }
            })()}
            </div>
          </header>
          <!--當到期日付費時-->
          ${EditorConfig.paymentInfo(gvc)}
          <aside
            id="componentsNav"
            class="${Storage.view_type === ViewType.fullScreen
                ? `d-none`
                : ``} offcanvas offcanvas-start offcanvas-expand-lg position-fixed top-0 start-0 vh-100 bg-light overflow-hidden"
            style="${size < 800
                ? `width: 0px;`
                : Storage.select_function === 'user-editor'
                    ? `width: 365px;`
                    : `width: ${document.body.clientWidth < 1200 ? 200 : 284}px;`}z-index:10 !important;"
          >
            <div
              class="offcanvas-header d-none d-lg-flex justify-content-start border-bottom px-0 ${Storage.select_function ===
                'user-editor'
                ? `border-end`
                : ``}"
              style="height: ${glitter.share.top_inset
                ? parseInt(glitter.share.top_inset, 10) + 56 + (Storage.select_function === 'backend-manger' ? 10 : 5)
                : 56}px;"
            >
              <div class="navbar-brand text-dark d-none d-lg-flex py-0 h-100">
                <div
                  class="d-flex align-items-center justify-content-center border-end "
                  style="width:50px;height: 56px;"
                >
                  <i
                    class="fa-solid fa-left-to-bracket hoverBtn"
                    style="cursor:pointer;"
                    onclick="${gvc.event(() => {
                goBack();
            })}"
                  >
                  </i>
                </div>
                <span
                  class="ms-3 fw-500"
                  style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
          ${gvc.bindView(() => {
                return {
                    bind: `docs-container`,
                    view: () => {
                        return gvc.bindView({
                            bind: `showView`,
                            view: () => {
                                return Main_editor.center(gvc);
                            },
                        });
                    },
                    divCreate: () => {
                        if (gvc.glitter.getUrlParameter('function') !== 'page-editor') {
                            return {
                                elem: 'main',
                                class: `docs-container`,
                                style: `padding-top: ${EditorConfig.getPaddingTop(gvc) + 56}px;
                           padding-left:${size < 992 ? `0px;` : Storage.select_function === 'user-editor' ? `365px;` : `${document.body.clientWidth < 1200 ? 200 : 284}px;`}
                           padding-right:0px;
                          ${Storage.select_function === 'page-editor' ? `overflow:hidden;` : ``}`,
                            };
                        }
                        else {
                            return {
                                elem: 'main',
                                class: `docs-container`,
                                style: `
                      padding-top: ${EditorConfig.getPaddingTop(gvc) + 56}px;
                      padding-right: ${(Storage.view_type === ViewType.col3 || Storage.view_type === ViewType.mobile) &&
                                    Storage.select_function !== 'backend-manger' &&
                                    Storage.select_function !== 'server-manager'
                                    ? `290`
                                    : `0`}px;
                      ${Storage.view_type === ViewType.fullScreen
                                    ? `padding-left:0px;`
                                    : `
                          padding-left:${size < 800 ? `0px;` : Storage.select_function === 'user-editor' ? `365px;` : `284px;`}
                          ${Storage.select_function === 'page-editor' ? `overflow:hidden;` : ``}
                          `}
                    `,
                            };
                        }
                    },
                };
            })}
          ${(() => {
                if ((Storage.view_type === ViewType.col3 || Storage.view_type === ViewType.mobile) &&
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
          <a href="#top" class="btn-scroll-top" data-scroll>
            <span class="btn-scroll-top-tooltip text-muted fs-sm me-2">Top</span>
            <i class="btn-scroll-top-icon bx bx-chevron-up"></i>
          </a>
        </div>
      `;
        };
    }
    static languageSwitch(gvc) {
        const glitter = gvc.glitter;
        const vm = {
            language_setting: {
                def: 'zh-TW',
                support: ['zh-TW'],
            },
            id: glitter.getUUID(),
            tableId: glitter.getUUID(),
            filterId: glitter.getUUID(),
            type: 'list',
            data: {
                ubn: '',
                email: '',
                phone: '',
                address: '',
                category: '',
                pos_type: 'retails',
                ai_search: true,
                shop_name: '',
                support_pos_payment: ['cash', 'creditCard', 'line'],
            },
            SEOData: {
                seo: {
                    code: '',
                    type: 'custom',
                    image: '',
                    logo: '',
                    title: '',
                    content: '',
                    keywords: '',
                },
                list: [],
                version: 'v2',
                formData: {},
                formFormat: [],
                resource_from: 'global',
                globalStyleTag: [],
                support_editor: 'true',
            },
            domain: {},
            dataList: undefined,
            query: '',
            mainLoading: true,
            SEOLoading: true,
            domainLoading: true,
        };
        BgWidget.settingDialog({
            gvc: gvc,
            title: '語言切換',
            innerHTML: (gvc) => {
                return html ` <div style="position: relative;word-break: break-all;white-space: normal;">
          ${gvc.bindView(() => {
                    var _a;
                    const vm = {
                        language_setting: {
                            def: 'zh-TW',
                            support: ['zh-TW'],
                        },
                        id: glitter.getUUID(),
                        tableId: glitter.getUUID(),
                        filterId: glitter.getUUID(),
                        type: 'list',
                        data: {
                            ubn: '',
                            email: '',
                            phone: '',
                            address: '',
                            category: '',
                            pos_type: 'retails',
                            ai_search: true,
                            shop_name: '',
                            support_pos_payment: ['cash', 'creditCard', 'line'],
                        },
                        SEOData: {
                            seo: {
                                code: '',
                                type: 'custom',
                                image: '',
                                logo: '',
                                title: '',
                                content: '',
                                keywords: '',
                            },
                            list: [],
                            version: 'v2',
                            formData: {},
                            formFormat: [],
                            resource_from: 'global',
                            globalStyleTag: [],
                            support_editor: 'true',
                        },
                        domain: {},
                        dataList: undefined,
                        query: '',
                        mainLoading: true,
                        SEOLoading: true,
                        domainLoading: true,
                    };
                    ApiUser.getPublicConfig('store-information', 'manager').then((r) => {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                        vm.data = r.response.value;
                        const data = r.response.value;
                        vm.data = {
                            ubn: (_a = data.ubn) !== null && _a !== void 0 ? _a : '',
                            email: (_b = data.email) !== null && _b !== void 0 ? _b : '',
                            phone: (_c = data.phone) !== null && _c !== void 0 ? _c : '',
                            address: (_d = data.address) !== null && _d !== void 0 ? _d : '',
                            category: (_e = data.category) !== null && _e !== void 0 ? _e : '',
                            pos_type: (_f = data.pos_type) !== null && _f !== void 0 ? _f : 'retails',
                            ai_search: (_g = data.ai_search) !== null && _g !== void 0 ? _g : true,
                            shop_name: (_h = data.shop_name) !== null && _h !== void 0 ? _h : '',
                            support_pos_payment: (_j = data.support_pos_payment) !== null && _j !== void 0 ? _j : ['cash', 'creditCard', 'line'],
                            language_setting: data.language_setting || {
                                def: 'zh-TW',
                                support: ['zh-TW'],
                            },
                        };
                        vm.mainLoading = false;
                        gvc.notifyDataChange(vm.id);
                    });
                    vm.data.language_setting = (_a = vm.data.language_setting) !== null && _a !== void 0 ? _a : {
                        def: 'zh-TW',
                        support: ['zh-TW'],
                    };
                    return {
                        bind: vm.id,
                        view: () => {
                            if (vm.mainLoading) {
                                return BgWidget.spinner();
                            }
                            const sup = [
                                {
                                    key: 'en-US',
                                    value: '英文',
                                },
                                {
                                    key: 'zh-CN',
                                    value: '簡體中文',
                                },
                                {
                                    key: 'zh-TW',
                                    value: '繁體中文',
                                },
                            ]
                                .filter(dd => {
                                return vm.data.language_setting.support.includes(dd.key);
                            })
                                .sort((dd) => {
                                return dd.key === vm.data.language_setting.def ? -1 : 1;
                            });
                            return html ` <div style="color: #393939;font-size: 16px;">多國語言</div>
                  ${BgWidget.grayNote('前往後台系統->商店設定->商店訊息中，設定支援語言。')}
                  <div class="d-flex mt-3 flex-wrap" style="gap:15px;">
                    ${sup
                                .map((dd) => {
                                return html `
                          <div
                            class="px-3 py-1 text-white position-relative d-flex align-items-center justify-content-center"
                            style="border-radius: 20px;background: #393939;cursor: pointer;width:100px;"
                            onclick="${gvc.event(() => {
                                    const dialog = new ShareDialog(glitter);
                                    Language.setLanguage(dd.key);
                                    dialog.dataLoading({ visible: true });
                                    location.href = `${glitter.root_path}${Language.getLanguageLinkPrefix()}${gvc.glitter.getUrlParameter('page')}?type=editor&appName=${window.appName}&function=user-editor`;
                                })}"
                          >
                            ${dd.value}
                            <div
                              class="position-absolute  text-white rounded-2 px-2 d-flex align-items-center rounded-3 ${dd.key !==
                                    Language.getLanguage()
                                    ? `d-none`
                                    : ``}"
                              style="top: -12px;right: -10px; height:20px;font-size: 11px;background: #ff6c02;"
                            >
                              已選擇
                            </div>
                          </div>
                        `;
                            })
                                .join('')}
                  </div>`;
                        },
                    };
                })}
        </div>`;
            },
            footer_html: () => {
                return '';
            },
            width: 300,
        });
    }
}
