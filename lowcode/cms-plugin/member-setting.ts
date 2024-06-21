import { SeoSetting } from './seo-setting.js';
import { GVC } from '../glitterBundle/GVController.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { FormWidget } from '../official_view_component/official/form.js';
import { ApiPost } from '../glitter-base/route/post.js';
import { EditorConfig } from '../editor-config.js';
import { ViewWidget } from './view-widget.js';

export class MemberSetting {
    public static main(gvc: GVC) {
        const html = String.raw;
        const vm: {
            data: any;
            loading: boolean;
        } = {
            data: {},
            loading: true,
        };
        const id = gvc.glitter.getUUID();
        ApiUser.getPublicConfig('login_config', 'manager').then((dd) => {
            vm.loading = false;
            dd.response.value && (vm.data = dd.response.value);
            gvc.notifyDataChange(id);
        });

        function saveEvent() {
            ApiUser.setPublicConfig({
                key: 'login_config',
                value: vm.data,
                user_id: 'manager',
            }).then(() => {});
        }

        return gvc.bindView(() => {
            return {
                bind: id,
                view: () => {
                    if (vm.loading) {
                        return ``;
                    }
                    return BgWidget.container(
                        html`
                            ${BgWidget.title('顧客設定')}
                            <div style="height: 24px;"></div>
                            ${BgWidget.card(
                                [
                                    `<div class="tx_normal fw-bolder mt-2" style="margin-bottom: 24px;">登入 / 註冊設定</div>`,
                                    gvc.bindView(() => {
                                        const id = gvc.glitter.getUUID();
                                        return {
                                            bind: id,
                                            view: () => {
                                                return [
                                                    {
                                                        title: 'line登入串接設定',
                                                        value: 'line',
                                                        src: `https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716355632461-icon_LINE.svg`,
                                                        event: gvc.event(() => {
                                                            EditorElem.openEditorDialog(
                                                                gvc,
                                                                (gvc) => {
                                                                    const key = 'login_line_setting';
                                                                    return gvc.bindView(() => {
                                                                        const id = gvc.glitter.getUUID();
                                                                        const vm: {
                                                                            loading: boolean;
                                                                            data: {
                                                                                id: string;
                                                                                secret: string;
                                                                            };
                                                                        } = {
                                                                            loading: false,
                                                                            data: {
                                                                                id: '',
                                                                                secret: '',
                                                                            },
                                                                        };
                                                                        ApiUser.getPublicConfig(key, 'manager').then((dd) => {
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
                                                                                return html`
                                                                                    <div class="p-2">
                                                                                        ${[
                                                                                            EditorElem.editeInput({
                                                                                                gvc: gvc,
                                                                                                title: 'Channel ID',
                                                                                                placeHolder: `請輸入Channel ID`,
                                                                                                default: vm.data.id,
                                                                                                callback: (text) => {
                                                                                                    vm.data.id = text;
                                                                                                },
                                                                                            }),
                                                                                            EditorElem.editeInput({
                                                                                                gvc: gvc,
                                                                                                title: 'Channel Secret',
                                                                                                placeHolder: `請輸入Channel Secret`,
                                                                                                default: vm.data.secret,
                                                                                                callback: (text) => {
                                                                                                    vm.data.secret = text;
                                                                                                },
                                                                                            }),
                                                                                        ].join('')}
                                                                                    </div>
                                                                                    ${ViewWidget.dialogSaveRaw(
                                                                                        gvc,
                                                                                        () => {
                                                                                            gvc.glitter.closeDiaLog();
                                                                                        },
                                                                                        () => {
                                                                                            const dialog = new ShareDialog(gvc.glitter);
                                                                                            dialog.dataLoading({ visible: true });
                                                                                            ApiUser.setPublicConfig({
                                                                                                key: key,
                                                                                                value: vm.data,
                                                                                                user_id: 'manager',
                                                                                            }).then(() => {
                                                                                                dialog.dataLoading({ visible: false });
                                                                                                dialog.successMessage({ text: '設定成功' });
                                                                                                gvc.closeDialog();
                                                                                            });
                                                                                        }
                                                                                    )}
                                                                                `;
                                                                            },
                                                                        };
                                                                    });
                                                                },
                                                                () => {},
                                                                400,
                                                                'line登入串接設定'
                                                            );
                                                        }),
                                                    },
                                                    {
                                                        title: 'FB登入串接設定',
                                                        value: 'fb',
                                                        src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716359127136-facebook.svg',
                                                        event: gvc.event(() => {
                                                            EditorElem.openEditorDialog(
                                                                gvc,
                                                                (gvc) => {
                                                                    const key = 'login_fb_setting';
                                                                    return gvc.bindView(() => {
                                                                        const id = gvc.glitter.getUUID();
                                                                        const vm: {
                                                                            loading: boolean;
                                                                            data: {
                                                                                id: string;
                                                                                secret: string;
                                                                            };
                                                                        } = {
                                                                            loading: false,
                                                                            data: {
                                                                                id: '',
                                                                                secret: '',
                                                                            },
                                                                        };
                                                                        ApiUser.getPublicConfig(key, 'manager').then((dd) => {
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
                                                                                return html`
                                                                                    <div class="p-2">
                                                                                        ${[
                                                                                            EditorElem.editeInput({
                                                                                                gvc: gvc,
                                                                                                title: '應用程式編號',
                                                                                                placeHolder: `請輸入應用程式編號`,
                                                                                                default: vm.data.id,
                                                                                                callback: (text) => {
                                                                                                    vm.data.id = text;
                                                                                                },
                                                                                            }),
                                                                                            EditorElem.editeInput({
                                                                                                gvc: gvc,
                                                                                                title: '應用程式密鑰',
                                                                                                placeHolder: `請輸入應用程式密鑰`,
                                                                                                default: vm.data.secret,
                                                                                                callback: (text) => {
                                                                                                    vm.data.secret = text;
                                                                                                },
                                                                                            }),
                                                                                        ].join('')}
                                                                                    </div>
                                                                                    ${ViewWidget.dialogSaveRaw(
                                                                                        gvc,
                                                                                        () => {
                                                                                            gvc.glitter.closeDiaLog();
                                                                                        },
                                                                                        () => {
                                                                                            const dialog = new ShareDialog(gvc.glitter);
                                                                                            dialog.dataLoading({ visible: true });
                                                                                            ApiUser.setPublicConfig({
                                                                                                key: key,
                                                                                                value: vm.data,
                                                                                                user_id: 'manager',
                                                                                            }).then(() => {
                                                                                                dialog.dataLoading({ visible: false });
                                                                                                dialog.successMessage({ text: '設定成功' });
                                                                                                gvc.closeDialog();
                                                                                            });
                                                                                        }
                                                                                    )}
                                                                                `;
                                                                            },
                                                                        };
                                                                    });
                                                                },
                                                                () => {},
                                                                400,
                                                                'FB登入串接設定'
                                                            );
                                                        }),
                                                    },
                                                    {
                                                        title: 'Google登入串接設定',
                                                        value: 'google',
                                                        src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716359248773-icon_google.svg',
                                                        event: gvc.event(() => {
                                                            EditorElem.openEditorDialog(
                                                                gvc,
                                                                (gvc) => {
                                                                    const key = 'login_google_setting';
                                                                    return gvc.bindView(() => {
                                                                        const id = gvc.glitter.getUUID();
                                                                        const vm: {
                                                                            loading: boolean;
                                                                            data: {
                                                                                id: string;
                                                                                secret: string;
                                                                            };
                                                                        } = {
                                                                            loading: false,
                                                                            data: {
                                                                                id: '',
                                                                                secret: '',
                                                                            },
                                                                        };
                                                                        ApiUser.getPublicConfig(key, 'manager').then((dd) => {
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
                                                                                return html`
                                                                                    <div class="p-2">
                                                                                        ${[
                                                                                            EditorElem.editeInput({
                                                                                                gvc: gvc,
                                                                                                title: '客户端 ID',
                                                                                                placeHolder: `請輸入客户端ID`,
                                                                                                default: vm.data.id,
                                                                                                callback: (text) => {
                                                                                                    vm.data.id = text;
                                                                                                },
                                                                                            }),
                                                                                            EditorElem.editeInput({
                                                                                                gvc: gvc,
                                                                                                title: '客户端密鑰',
                                                                                                placeHolder: `請輸入客户端密鑰`,
                                                                                                default: vm.data.secret,
                                                                                                callback: (text) => {
                                                                                                    vm.data.secret = text;
                                                                                                },
                                                                                            }),
                                                                                        ].join('')}
                                                                                    </div>
                                                                                    ${ViewWidget.dialogSaveRaw(
                                                                                        gvc,
                                                                                        () => {
                                                                                            gvc.glitter.closeDiaLog();
                                                                                        },
                                                                                        () => {
                                                                                            const dialog = new ShareDialog(gvc.glitter);
                                                                                            dialog.dataLoading({ visible: true });
                                                                                            ApiUser.setPublicConfig({
                                                                                                key: key,
                                                                                                value: vm.data,
                                                                                                user_id: 'manager',
                                                                                            }).then(() => {
                                                                                                dialog.dataLoading({ visible: false });
                                                                                                dialog.successMessage({ text: '設定成功' });
                                                                                                gvc.closeDialog();
                                                                                            });
                                                                                        }
                                                                                    )}
                                                                                `;
                                                                            },
                                                                        };
                                                                    });
                                                                },
                                                                () => {},
                                                                400,
                                                                'GOOGLE登入串接設定'
                                                            );
                                                        }),
                                                    },
                                                ]
                                                    .map((dd) => {
                                                        return html`
                                                            <div class="col-12 col-md-4 mb-3">
                                                                <div
                                                                    class="w-100"
                                                                    style=" padding: 24px; background: white; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.08); border-radius: 10px; overflow: hidden; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 18px; display: inline-flex"
                                                                >
                                                                    <div style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 28px; display: inline-flex">
                                                                        <img style="width: 46px;" src="${dd.src}" />
                                                                        <div style="flex-direction: column; justify-content: center; align-items: flex-start; gap: 4px; display: inline-flex">
                                                                            <div class="tx_normal">${dd.title}</div>
                                                                            <div class="d-flex align-items-center w-100" style="gap:4px;">
                                                                                <div class="tx_normal">${vm.data[dd.value] ? `開啟` : `關閉`}</div>
                                                                                <div class="cursor_it form-check form-switch" style="     margin-top: 10px; ">
                                                                                    <input
                                                                                        class=" form-check-input"
                                                                                        style=" "
                                                                                        type="checkbox"
                                                                                        value=""
                                                                                        onchange="${gvc.event((e, event) => {
                                                                                            vm.data[dd.value] = !vm.data[dd.value];
                                                                                            saveEvent();
                                                                                            gvc.notifyDataChange(id);
                                                                                        })}"
                                                                                        ${vm.data[dd.value] ? `checked` : ``}
                                                                                    />
                                                                                </div>
                                                                                <div class="flex-fill"></div>
                                                                            </div>
                                                                        </div>
                                                                        <div class="flex-fill"></div>
                                                                        <div class="bt_ffb40" onclick="${dd.event}">設定</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        `;
                                                    })
                                                    .join('');
                                            },
                                            divCreate: {
                                                class: `row m-0 mx-n2`,
                                            },
                                        };
                                    }),
                                ].join('')
                            )}
                            <div style="height: 24px;"></div>
                            ${BgWidget.card(
                                [
                                    `<div class="tx_normal fw-bolder mt-2" style="margin-bottom: 24px;">驗證方式</div>`,
                                    ` <div class="d-flex flex-column" style="gap:18px;">
                                                ${[
                                                    {
                                                        title: `<div class="d-flex flex-column">
不發送驗證信件
<span class="" style="color:#8D8D8D;font-size: 12px;">顧客可用未驗證帳號登入</span>
</div>`,
                                                        checked: !vm.data.email_verify,
                                                    },
                                                    {
                                                        title: `<div class="d-flex flex-column">
發送驗證信件
<span class="" style="color:#8D8D8D;font-size: 12px;">顧客必須經過驗證才能登入</span>
</div>`,
                                                        checked: vm.data.email_verify,
                                                    },
                                                ]
                                                    .map((dd) => {
                                                        return `<div>${[
                                                            html` <div
                                                                class="d-flex align-items-center cursor_it"
                                                                style="gap:8px;"
                                                                onclick="${gvc.event(() => {
                                                                    vm.data.email_verify = !vm.data.email_verify;
                                                                    saveEvent();
                                                                    gvc.notifyDataChange(id);
                                                                })}"
                                                            >
                                                                ${dd.checked ? `<i class="fa-sharp fa-solid fa-circle-dot cl_39"></i>` : ` <div class="c_39_checkbox"></div>`}
                                                                <div class="tx_normal fw-normal">${dd.title}</div>
                                                            </div>`,
                                                        ].join('')}</div>`;
                                                    })
                                                    .join('')}
                                            </div>`,
                                    `<div class="w-100 border-top my-3"></div>`,
                                    `<div class="tx_normal fw-bolder mt-2" style="margin-bottom: 12px;">結帳設定</div>`,
                                    `   <div class="d-flex align-items-center w-100"
                                                                     style="gap:4px;margin-bottom: 12px;">
                                                                     <div class="tx_normal fw-bolder " style="">只允許登入下單</div>
                                                                    <div class="tx_normal ms-2">
                                                                        ${vm.data.login_in_to_order ? `開啟` : `關閉`}
                                                                    </div>
                                                                    <div class="cursor_it form-check form-switch m-0"
                                                                         style=" ">
                                                                        <input class=" form-check-input" style=" "
                                                                               type="checkbox" value=""
                                                                               onchange="${gvc.event((e, event) => {
                                                                                   vm.data.login_in_to_order = !vm.data.login_in_to_order;
                                                                                   saveEvent();
                                                                                   gvc.notifyDataChange(id);
                                                                               })}"
                                                                               ${vm.data.login_in_to_order ? `checked` : ``}>
                                                                    </div>
                                                                    <div class="flex-fill"></div>
                                                                </div>`,
                                ].join('')
                            )}
                        `,
                        undefined,
                        'width:calc(100% - 56px);'
                    );
                    return BgWidget.container(html`
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
                                        EditorElem.openEditorDialog(
                                            gvc,
                                            (gvc) => {
                                                const key = 'login_line_setting';
                                                return gvc.bindView(() => {
                                                    const id = gvc.glitter.getUUID();
                                                    const vm: {
                                                        loading: boolean;
                                                        data: {
                                                            id: string;
                                                            secret: string;
                                                        };
                                                    } = {
                                                        loading: false,
                                                        data: {
                                                            id: '',
                                                            secret: '',
                                                        },
                                                    };
                                                    ApiUser.getPublicConfig(key, 'manager').then((dd) => {
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
                                                            return html`
                                                                <div class="p-2">
                                                                    ${[
                                                                        EditorElem.editeInput({
                                                                            gvc: gvc,
                                                                            title: 'Channel ID',
                                                                            placeHolder: `請輸入Channel ID`,
                                                                            default: vm.data.id,
                                                                            callback: (text) => {
                                                                                vm.data.id = text;
                                                                            },
                                                                        }),
                                                                        EditorElem.editeInput({
                                                                            gvc: gvc,
                                                                            title: 'Channel Secret',
                                                                            placeHolder: `請輸入Channel Secret`,
                                                                            default: vm.data.secret,
                                                                            callback: (text) => {
                                                                                vm.data.secret = text;
                                                                            },
                                                                        }),
                                                                    ].join('')}
                                                                </div>
                                                                ${ViewWidget.dialogSaveRaw(
                                                                    gvc,
                                                                    () => {
                                                                        gvc.glitter.closeDiaLog();
                                                                    },
                                                                    () => {
                                                                        const dialog = new ShareDialog(gvc.glitter);
                                                                        dialog.dataLoading({ visible: true });
                                                                        ApiUser.setPublicConfig({
                                                                            key: key,
                                                                            value: vm.data,
                                                                            user_id: 'manager',
                                                                        }).then(() => {
                                                                            dialog.dataLoading({ visible: false });
                                                                            dialog.successMessage({ text: '設定成功' });
                                                                            gvc.closeDialog();
                                                                        });
                                                                    }
                                                                )}
                                                            `;
                                                        },
                                                    };
                                                });
                                            },
                                            () => {},
                                            400,
                                            'line登入串接設定'
                                        );
                                    },
                                    toggle_event: (toggle) => {
                                        vm.data.line = toggle;
                                        saveEvent();
                                    },
                                })}
                                ${MemberSetting.item({
                                    gvc: gvc,
                                    title: 'FB登入串接設定',
                                    icon: `https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716359127136-facebook.svg`,
                                    question: ``,
                                    toggle: vm.data.fb,
                                    editor_preview_view: () => {
                                        EditorElem.openEditorDialog(
                                            gvc,
                                            (gvc) => {
                                                const key = 'login_fb_setting';
                                                return gvc.bindView(() => {
                                                    const id = gvc.glitter.getUUID();
                                                    const vm: {
                                                        loading: boolean;
                                                        data: {
                                                            id: string;
                                                            secret: string;
                                                        };
                                                    } = {
                                                        loading: false,
                                                        data: {
                                                            id: '',
                                                            secret: '',
                                                        },
                                                    };
                                                    ApiUser.getPublicConfig(key, 'manager').then((dd) => {
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
                                                            return html`
                                                                <div class="p-2">
                                                                    ${[
                                                                        EditorElem.editeInput({
                                                                            gvc: gvc,
                                                                            title: '應用程式編號',
                                                                            placeHolder: `請輸入應用程式編號`,
                                                                            default: vm.data.id,
                                                                            callback: (text) => {
                                                                                vm.data.id = text;
                                                                            },
                                                                        }),
                                                                        EditorElem.editeInput({
                                                                            gvc: gvc,
                                                                            title: '應用程式密鑰',
                                                                            placeHolder: `請輸入應用程式密鑰`,
                                                                            default: vm.data.secret,
                                                                            callback: (text) => {
                                                                                vm.data.secret = text;
                                                                            },
                                                                        }),
                                                                    ].join('')}
                                                                </div>
                                                                ${ViewWidget.dialogSaveRaw(
                                                                    gvc,
                                                                    () => {
                                                                        gvc.glitter.closeDiaLog();
                                                                    },
                                                                    () => {
                                                                        const dialog = new ShareDialog(gvc.glitter);
                                                                        dialog.dataLoading({ visible: true });
                                                                        ApiUser.setPublicConfig({
                                                                            key: key,
                                                                            value: vm.data,
                                                                            user_id: 'manager',
                                                                        }).then(() => {
                                                                            dialog.dataLoading({ visible: false });
                                                                            dialog.successMessage({ text: '設定成功' });
                                                                            gvc.closeDialog();
                                                                        });
                                                                    }
                                                                )}
                                                            `;
                                                        },
                                                    };
                                                });
                                            },
                                            () => {},
                                            400,
                                            'FB登入串接設定'
                                        );
                                    },
                                    toggle_event: (toggle) => {
                                        vm.data.fb = toggle;
                                        saveEvent();
                                    },
                                })}
                                ${MemberSetting.item({
                                    gvc: gvc,
                                    title: 'Google登入串接設定',
                                    icon: `https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716359248773-icon_google.svg`,
                                    question: ``,
                                    toggle: vm.data.google,
                                    editor_preview_view: () => {},
                                    toggle_event: (toggle) => {
                                        vm.data.google = toggle;
                                        saveEvent();
                                    },
                                })}
                                ${MemberSetting.item({
                                    gvc: gvc,
                                    title: '信箱認證',
                                    icon: `https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716359434406-281769.png`,
                                    question: ``,
                                    toggle: vm.data.email_verify,
                                    editor_preview_view: () => {},
                                    toggle_event: (toggle) => {
                                        vm.data.email_verify = toggle;
                                        saveEvent();
                                    },
                                })}
                            </div>
                        </div>
                    `);
                },
            };
        });
    }

    public static item(it: { gvc: GVC; title: string; icon: string; question: string; toggle: boolean; editor_preview_view: () => void; toggle_event: (toggle: boolean) => void }) {
        const css = String.raw;
        it.gvc.addStyle(css`
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
        return html` <div class="col-sm-4 col-12 mb-3">
            ${it.gvc.bindView(() => {
                const id = gvc.glitter.getUUID();
                return {
                    bind: id,
                    view: () => {
                        return html`
                            <div class="d-flex align-items-center list_item position-relative">
                                <img class="icon" src="${it.icon}" />
                                <div class="d-flex flex-column" style="gap:3px;">
                                    <div class="fs-6 fw-500">${it.title}</div>
                                    <div class=" d-flex align-items-center" style="gap:5px;">
                                        <div class="fs-sm">${it.toggle ? `已啟用` : `已停用`}</div>
                                        <i
                                            class="fa-sharp fa-solid ${it.toggle ? `fa-toggle-on` : `fa-toggle-off`} fs-4"
                                            style="cursor: pointer;
color: ${it.toggle ? EditorConfig.editor_layout.main_color : `gray`};
"
                                            onclick="${gvc.event(() => {
                                                it.toggle = !it.toggle;
                                                gvc.notifyDataChange(id);
                                                it.toggle_event(it.toggle);
                                            })}"
                                        ></i>
                                        <!-- <i class="fa-sharp fa-solid fa-toggle-off"></i> -->
                                    </div>
                                </div>
                                <div class="ms-auto" style="right: 0px;top: 0px;">
                                    <div
                                        class="btn-sm bt_primary btn fs-sm fw-normal"
                                        style="height:25px;width:25px;"
                                        onclick="${gvc.event(() => {
                                            it.editor_preview_view();
                                        })}"
                                    >
                                        設定
                                    </div>
                                </div>
                            </div>
                        `;
                    },
                    divCreate: {
                        class: ` p-3 bg-white`,
                        style: ``,
                    },
                };
            })}
        </div>`;
    }
}

(window as any).glitter.setModule(import.meta.url, MemberSetting);
