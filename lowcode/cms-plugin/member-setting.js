var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { EditorConfig } from '../editor-config.js';
import { ViewWidget } from './view-widget.js';
import { FormModule } from './module/form-module.js';
export class MemberSetting {
    static main(gvc) {
        const html = String.raw;
        const vm = {
            id: gvc.glitter.getUUID(),
            data: {},
            loading: true,
        };
        ApiUser.getPublicConfig('login_config', 'manager').then((dd) => {
            vm.loading = false;
            dd.response.value && (vm.data = dd.response.value);
            gvc.notifyDataChange(vm.id);
        });
        function saveEvent() {
            ApiUser.setPublicConfig({
                key: 'login_config',
                value: vm.data,
                user_id: 'manager',
            }).then(() => { });
        }
        return gvc.bindView(() => {
            return {
                bind: vm.id,
                view: () => {
                    if (vm.loading) {
                        return ``;
                    }
                    return BgWidget.container(html `
                            <div class="d-flex w-100 align-items-center">
                                ${BgWidget.title('顧客設定')}
                                <div class="flex-fill"></div>
                            </div>
                            ${BgWidget.container([
                        BgWidget.mainCard([
                            html ` <div class="tx_normal fw-bolder mt-2" style="margin-bottom: 24px;">登入 / 註冊設定</div>`,
                            gvc.bindView(() => {
                                const id = gvc.glitter.getUUID();
                                return {
                                    bind: id,
                                    view: () => {
                                        return [
                                            {
                                                title: 'line登入串接設定',
                                                value: 'line',
                                                src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716355632461-icon_LINE.svg',
                                                event: gvc.event(() => {
                                                    EditorElem.openEditorDialog(gvc, (gvc) => {
                                                        const key = 'login_line_setting';
                                                        return gvc.bindView(() => {
                                                            const id = gvc.glitter.getUUID();
                                                            const vm = {
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
                                                                                            ${ViewWidget.dialogSaveRaw(gvc, () => {
                                                                        gvc.glitter.closeDiaLog();
                                                                    }, () => {
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
                                                                    })}
                                                                                        `;
                                                                },
                                                            };
                                                        });
                                                    }, () => { }, 400, 'line登入串接設定');
                                                }),
                                            },
                                            {
                                                title: 'FB登入串接設定',
                                                value: 'fb',
                                                src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716359127136-facebook.svg',
                                                event: gvc.event(() => {
                                                    EditorElem.openEditorDialog(gvc, (gvc) => {
                                                        const key = 'login_fb_setting';
                                                        return gvc.bindView(() => {
                                                            const id = gvc.glitter.getUUID();
                                                            const vm = {
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
                                                                                            ${ViewWidget.dialogSaveRaw(gvc, () => {
                                                                        gvc.glitter.closeDiaLog();
                                                                    }, () => {
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
                                                                    })}
                                                                                        `;
                                                                },
                                                            };
                                                        });
                                                    }, () => { }, 400, 'FB登入串接設定');
                                                }),
                                            },
                                            {
                                                title: 'Google登入串接設定',
                                                value: 'google',
                                                src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716359248773-icon_google.svg',
                                                event: gvc.event(() => {
                                                    EditorElem.openEditorDialog(gvc, (gvc) => {
                                                        const key = 'login_google_setting';
                                                        return gvc.bindView(() => {
                                                            const id = gvc.glitter.getUUID();
                                                            const vm = {
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
                                                                    return html `
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
                                                                                            ${ViewWidget.dialogSaveRaw(gvc, () => {
                                                                        gvc.glitter.closeDiaLog();
                                                                    }, () => {
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
                                                                    })}
                                                                                        `;
                                                                },
                                                            };
                                                        });
                                                    }, () => { }, 400, 'GOOGLE登入串接設定');
                                                }),
                                            },
                                        ]
                                            .map((dd) => {
                                            return html ` <div class="col-12 col-md-4 px-1 py-2">
                                                                    ${BgWidget.mainCard(html ` <div style="display: flex; align-items: center; justify-content: space-between;">
                                                                            <div style="display: flex; align-items: center; gap: 10px;">
                                                                                <img style="width: 46px;" src="${dd.src}" />
                                                                                <div
                                                                                    style="flex-direction: column; justify-content: center; align-items: flex-start; gap: 4px; display: inline-flex; padding-left: 8px;"
                                                                                >
                                                                                    <div class="tx_normal">${dd.title}</div>
                                                                                    <div class="d-flex align-items-center w-100" style="gap:4px;">
                                                                                        <div class="tx_normal">${vm.data[dd.value] ? `開啟` : `關閉`}</div>
                                                                                        <div class="cursor_pointer form-check form-switch" style="margin-top: 10px;">
                                                                                            <input
                                                                                                class="form-check-input"
                                                                                                type="checkbox"
                                                                                                onchange="${gvc.event((e, event) => {
                                                vm.data[dd.value] = !vm.data[dd.value];
                                                saveEvent();
                                                gvc.notifyDataChange(id);
                                            })}"
                                                                                                ${vm.data[dd.value] ? `checked` : ``}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div class="bt_ffb40" onclick="${dd.event}">設定</div>
                                                                        </div>`)}
                                                                </div>`;
                                        })
                                            .join('');
                                    },
                                    divCreate: {
                                        class: `row m-0 mx-n2`,
                                    },
                                };
                            }),
                        ].join('')),
                        BgWidget.mainCard([
                            html ` <div class="tx_normal fw-bolder mt-2" style="margin-bottom: 24px;">驗證方式</div>`,
                            html ` <div class="d-flex flex-column" style="gap:18px;">
                                                ${[
                                {
                                    title: html ` <div class="d-flex flex-column">
                                                            不發送驗證信件
                                                            <span class="" style="color:#8D8D8D;font-size: 12px;">顧客可用未驗證帳號登入</span>
                                                        </div>`,
                                    checked: !vm.data.email_verify,
                                },
                                {
                                    title: html ` <div class="d-flex flex-column">
                                                            發送驗證信件
                                                            <span class="" style="color:#8D8D8D;font-size: 12px;">顧客必須經過驗證才能登入</span>
                                                        </div>`,
                                    checked: vm.data.email_verify,
                                },
                            ]
                                .map((dd) => {
                                return html ` <div>
                                                            ${[
                                    html ` <div
                                                                    class="d-flex align-items-center cursor_pointer"
                                                                    style="gap:8px;"
                                                                    onclick="${gvc.event(() => {
                                        vm.data.email_verify = !vm.data.email_verify;
                                        saveEvent();
                                        gvc.notifyDataChange(vm.id);
                                    })}"
                                                                >
                                                                    ${dd.checked ? html `<i class="fa-sharp fa-solid fa-circle-dot cl_39"></i>` : ` <div class="c_39_checkbox"></div>`}
                                                                    <div class="tx_normal fw-normal">${dd.title}</div>
                                                                </div>`,
                                ].join('')}
                                                        </div>`;
                            })
                                .join('')}
                                            </div>`,
                            html ` <div class="w-100 border-top my-3"></div>`,
                            html ` <div class="tx_normal fw-bolder mt-2" style="margin-bottom: 12px;">結帳設定</div>`,
                            html ` <div class="d-flex align-items-center w-100" style="gap:4px;margin-bottom: 12px;">
                                                <div class="tx_normal fw-bolder ">允許訪客結帳</div>
                                                <div class="tx_normal ms-2">${vm.data.login_in_to_order ? `關閉` : `開啟`}</div>
                                                <div class="cursor_pointer form-check form-switch m-0">
                                                    <input
                                                        class="form-check-input"
                                                        type="checkbox"
                                                        onchange="${gvc.event((e, event) => {
                                vm.data.login_in_to_order = !vm.data.login_in_to_order;
                                saveEvent();
                                gvc.notifyDataChange(vm.id);
                            })}"
                                                        ${vm.data.login_in_to_order ? `` : `checked`}
                                                    />
                                                </div>
                                                <div class="flex-fill"></div>
                                            </div>`,
                        ].join('')),
                        gvc.bindView(() => {
                            return {
                                bind: gvc.glitter.getUUID(),
                                view: () => {
                                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                        const form_formats = {};
                                        const form_keys = ['custom_form_checkout', 'custom_form_register', 'customer_form_user_setting'];
                                        for (const b of form_keys) {
                                            form_formats[b] = (yield ApiUser.getPublicConfig(b, 'manager')).response.value || { list: [] };
                                            form_formats[b].list.map((dd) => {
                                                dd.toggle = false;
                                            });
                                        }
                                        resolve([
                                            BgWidget.mainCard(FormModule.editor(gvc, form_formats['custom_form_checkout'].list, html `
                                                                        <div class="tx_normal fw-bolder mt-2 d-flex flex-column" style="margin-bottom: 12px;">
                                                                            結帳頁面表單
                                                                            <span class="" style="color:#8D8D8D;font-size: 12px;">於結帳頁面中設定顧客必須填寫的額外資料</span>
                                                                        </div>
                                                                        <div class="update-bar-container">
                                                                            ${BgWidget.save(gvc.event(() => __awaiter(this, void 0, void 0, function* () {
                                                const dialog = new ShareDialog(gvc.glitter);
                                                dialog.dataLoading({ visible: true });
                                                for (const b of form_keys) {
                                                    yield ApiUser.setPublicConfig({
                                                        key: b,
                                                        value: form_formats[b],
                                                        user_id: 'manager',
                                                    });
                                                }
                                                dialog.dataLoading({ visible: false });
                                                dialog.successMessage({ text: '設定成功' });
                                            })))}
                                                                        </div>
                                                                    `)),
                                            BgWidget.mainCard(FormModule.editor(gvc, form_formats['custom_form_register'].list, html `
                                                                        <div class="tx_normal fw-bolder mt-2 d-flex flex-column" style="margin-bottom: 12px;">
                                                                            註冊頁面表單
                                                                            <span class="" style="color:#8D8D8D;font-size: 12px;">於註冊頁面中設定顧客必須填寫的額外資料</span>
                                                                        </div>
                                                                    `)),
                                            BgWidget.mainCard(FormModule.editor(gvc, form_formats['customer_form_user_setting'].list, html `
                                                                        <div class="tx_normal fw-bolder mt-2 d-flex flex-column" style="margin-bottom: 12px;">
                                                                            設定頁面表單
                                                                            <span class="" style="color:#8D8D8D;font-size: 12px;">於用戶設定頁面中設定顧客必須填寫的額外資料</span>
                                                                        </div>
                                                                    `)),
                                        ].join(BgWidget.mbContainer(24)));
                                    }));
                                },
                                divCreate: {
                                    class: 'p-0',
                                },
                            };
                        }),
                        BgWidget.mbContainer(240),
                    ].join(BgWidget.mbContainer(24)))}
                        `, BgWidget.getContainerWidth());
                },
            };
        });
    }
    static item(it) {
        it.gvc.addStyle(`
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
        return html ` <div class="col-sm-4 col-12 mb-3">
            ${it.gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return html `
                            <div class="d-flex align-items-center list_item position-relative">
                                <img class="icon" src="${it.icon}" />
                                <div class="d-flex flex-column" style="gap:3px;">
                                    <div class="fs-6 fw-500">${it.title}</div>
                                    <div class=" d-flex align-items-center" style="gap:5px;">
                                        <div class="fs-sm">${it.toggle ? `已啟用` : `已停用`}</div>
                                        <i
                                            class="fa-sharp fa-solid ${it.toggle ? `fa-toggle-on` : `fa-toggle-off`} fs-4"
                                            style="cursor: pointer; color: ${it.toggle ? EditorConfig.editor_layout.main_color : `gray`};"
                                            onclick="${gvc.event(() => {
                        it.toggle = !it.toggle;
                        gvc.notifyDataChange(id);
                        it.toggle_event(it.toggle);
                    })}"
                                        ></i>
                                    </div>
                                </div>
                                <div class="ms-auto" style="right: 0px;top: 0px;">
                                    <div
                                        class="btn-sm bt_primary btn fs-sm fw-normal"
                                        style="height:25px; width:25px;"
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
                    class: 'p-3 bg-white',
                    style: '',
                },
            };
        })}
        </div>`;
    }
}
window.glitter.setModule(import.meta.url, MemberSetting);
