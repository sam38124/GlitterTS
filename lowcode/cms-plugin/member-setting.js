import { EditorElem } from "../glitterBundle/plugins/editor-elem.js";
import { BgWidget } from "../backend-manager/bg-widget.js";
import { ApiUser } from "../glitter-base/route/user.js";
import { ShareDialog } from "../glitterBundle/dialog/ShareDialog.js";
import { EditorConfig } from "../editor-config.js";
import { ViewWidget } from "./view-widget.js";
export class MemberSetting {
    static main(gvc) {
        const html = String.raw;
        const vm = {
            data: {},
            loading: true
        };
        const id = gvc.glitter.getUUID();
        (ApiUser.getPublicConfig('login_config', 'manager')).then((dd) => {
            vm.loading = false;
            dd.response.value && (vm.data = dd.response.value);
            gvc.notifyDataChange(id);
        });
        function saveEvent() {
            ApiUser.setPublicConfig({
                key: 'login_config',
                value: vm.data,
                user_id: 'manager'
            }).then(() => { });
        }
        return gvc.bindView(() => {
            return {
                bind: id,
                view: () => {
                    if (vm.loading) {
                        return ``;
                    }
                    return BgWidget.container(html `
                        <div class="d-flex w-100 align-items-center mb-3">
                            ${BgWidget.title('登入方式設定')}
                            <div class="flex-fill"></div>
                        </div>
                        <div class="w-100 border p-3">
                            <div class="m-0 row">
                                ${MemberSetting.item({
                        gvc: gvc,
                        title: 'line登入串接設定',
                        icon: `https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716355632461-icon_LINE.svg`,
                        question: ``,
                        toggle: vm.data.line,
                        editor_preview_view: () => {
                            EditorElem.openEditorDialog(gvc, (gvc) => {
                                const key = 'login_line_setting';
                                return gvc.bindView(() => {
                                    const id = gvc.glitter.getUUID();
                                    const vm = {
                                        loading: false,
                                        data: {
                                            id: '',
                                            secret: ''
                                        }
                                    };
                                    (ApiUser.getPublicConfig(key, 'manager')).then((dd) => {
                                        vm.loading = false;
                                        dd.response.value && (vm.data = dd.response.value);
                                        gvc.notifyDataChange(id);
                                    });
                                    return {
                                        bind: id,
                                        view: () => {
                                            if (vm.loading) {
                                                return ``;
                                            }
                                            return html `
                                                            <div class="p-2">
                                                                ${[
                                                EditorElem.editeInput({
                                                    gvc: gvc,
                                                    title: 'Channel ID',
                                                    placeHolder: `請輸入Channel ID`,
                                                    default: vm.data.id,
                                                    callback: (text) => {
                                                        vm.data.id = text;
                                                    }
                                                }),
                                                EditorElem.editeInput({
                                                    gvc: gvc,
                                                    title: 'Channel Secret',
                                                    placeHolder: `請輸入Channel Secret`,
                                                    default: vm.data.secret,
                                                    callback: (text) => {
                                                        vm.data.secret = text;
                                                    }
                                                })
                                            ].join('')}
                                                            </div>
                                                            ${ViewWidget.dialogSaveRaw(gvc, () => {
                                                gvc.glitter.closeDiaLog();
                                            }, () => {
                                                const dialog = new ShareDialog(gvc.glitter);
                                                dialog.dataLoading({ visible: true });
                                                ApiUser.setPublicConfig({
                                                    key: key,
                                                    value: vm.data,
                                                    user_id: 'manager'
                                                }).then(() => {
                                                    dialog.dataLoading({ visible: false });
                                                    dialog.successMessage({ text: '設定成功' });
                                                    gvc.closeDialog();
                                                });
                                            })}
                                                        `;
                                        }
                                    };
                                });
                            }, () => {
                            }, 400, 'line登入串接設定');
                        },
                        toggle_event: (toggle) => {
                            vm.data.line = toggle;
                            saveEvent();
                        }
                    })}
                                ${MemberSetting.item({
                        gvc: gvc,
                        title: 'FB登入串接設定',
                        icon: `https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716359127136-facebook.svg`,
                        question: ``,
                        toggle: vm.data.fb,
                        editor_preview_view: () => {
                            EditorElem.openEditorDialog(gvc, (gvc) => {
                                const key = 'login_fb_setting';
                                return gvc.bindView(() => {
                                    const id = gvc.glitter.getUUID();
                                    const vm = {
                                        loading: false,
                                        data: {
                                            id: '',
                                            secret: ''
                                        }
                                    };
                                    (ApiUser.getPublicConfig(key, 'manager')).then((dd) => {
                                        vm.loading = false;
                                        dd.response.value && (vm.data = dd.response.value);
                                        gvc.notifyDataChange(id);
                                    });
                                    return {
                                        bind: id,
                                        view: () => {
                                            if (vm.loading) {
                                                return ``;
                                            }
                                            return html `
                                                                    <div class="p-2">
                                                                        ${[
                                                EditorElem.editeInput({
                                                    gvc: gvc,
                                                    title: '應用程式編號',
                                                    placeHolder: `請輸入應用程式編號`,
                                                    default: vm.data.id,
                                                    callback: (text) => {
                                                        vm.data.id = text;
                                                    }
                                                }),
                                                EditorElem.editeInput({
                                                    gvc: gvc,
                                                    title: '應用程式密鑰',
                                                    placeHolder: `請輸入應用程式密鑰`,
                                                    default: vm.data.secret,
                                                    callback: (text) => {
                                                        vm.data.secret = text;
                                                    }
                                                })
                                            ].join('')}
                                                                    </div>
                                                                    ${ViewWidget.dialogSaveRaw(gvc, () => {
                                                gvc.glitter.closeDiaLog();
                                            }, () => {
                                                const dialog = new ShareDialog(gvc.glitter);
                                                dialog.dataLoading({ visible: true });
                                                ApiUser.setPublicConfig({
                                                    key: key,
                                                    value: vm.data,
                                                    user_id: 'manager'
                                                }).then(() => {
                                                    dialog.dataLoading({ visible: false });
                                                    dialog.successMessage({ text: '設定成功' });
                                                    gvc.closeDialog();
                                                });
                                            })}
                                                                `;
                                        }
                                    };
                                });
                            }, () => {
                            }, 400, 'FB登入串接設定');
                        },
                        toggle_event: (toggle) => {
                            vm.data.fb = toggle;
                            saveEvent();
                        }
                    })}
                                ${MemberSetting.item({
                        gvc: gvc,
                        title: 'Google登入串接設定',
                        icon: `https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716359248773-icon_google.svg`,
                        question: ``,
                        toggle: vm.data.google,
                        editor_preview_view: () => {
                        },
                        toggle_event: (toggle) => {
                            vm.data.google = toggle;
                            saveEvent();
                        }
                    })}
                                ${MemberSetting.item({
                        gvc: gvc,
                        title: '信箱認證',
                        icon: `https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716359434406-281769.png`,
                        question: ``,
                        toggle: vm.data.email_verify,
                        editor_preview_view: () => {
                        },
                        toggle_event: (toggle) => {
                            vm.data.email_verify = toggle;
                            saveEvent();
                        }
                    })}


                            </div>
                        </div>
                    `);
                }
            };
        });
    }
    static item(it) {
        const css = String.raw;
        it.gvc.addStyle(css `
          .icon {
            width: 50px;
            height: 50px;
          }

          .list_item {
            gap: 10px;
          }

          .bt_primary {
            background: #295ed1;
          }
        `);
        const gvc = it.gvc;
        const html = String.raw;
        return html `
            <div class="col-sm-4 col-12 mb-3">
                ${it.gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return html `
                                <div class="d-flex align-items-center list_item position-relative">
                                    <img class="icon" src="${it.icon}">
                                    <div class="d-flex flex-column" style="gap:3px;">
                                        <div class="fs-6 fw-500">${it.title}</div>
                                        <div class=" d-flex align-items-center" style="gap:5px;">
                                            <div class="fs-sm">${(it.toggle) ? `已啟用` : `已停用`}</div>
                                            <i class="fa-sharp fa-solid ${(it.toggle) ? `fa-toggle-on` : `fa-toggle-off`} fs-4"
                                               style="cursor: pointer;
color: ${(it.toggle) ? EditorConfig.editor_layout.main_color : `gray`};
" onclick="${gvc.event(() => {
                        it.toggle = !it.toggle;
                        gvc.notifyDataChange(id);
                        it.toggle_event(it.toggle);
                    })}"></i>
                                            <!-- <i class="fa-sharp fa-solid fa-toggle-off"></i> -->
                                        </div>
                                    </div>
                                    <div class="ms-auto" style="right: 0px;top: 0px;">
                                        <div class="btn-sm bt_primary btn fs-sm fw-normal"
                                             style="height:25px;width:25px;" onclick="${gvc.event(() => {
                        it.editor_preview_view();
                    })}">
                                            設定
                                        </div>
                                    </div>
                                </div>
                            `;
                },
                divCreate: {
                    class: ` p-3 bg-white`, style: ``
                }
            };
        })}
            </div>`;
    }
}
window.glitter.setModule(import.meta.url, MemberSetting);
