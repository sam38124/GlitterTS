var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BgWidget } from '../backend-manager/bg-widget.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { EditorConfig } from '../editor-config.js';
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
                    var _a, _b, _c;
                    if (vm.loading) {
                        return ``;
                    }
                    return BgWidget.container(html `
                        <div class="title-container">
                            ${BgWidget.title('顧客設定')}
                            <div class="flex-fill"></div>
                        </div>
                        ${BgWidget.container([
                        BgWidget.mainCard([
                            html ` <div class="tx_normal fw-bolder mt-2" style="margin-bottom: 24px;">驗證方式</div>`,
                            html ` <div class="d-flex flex-column" style="gap:18px;">
                                            ${[
                                BgWidget.multiCheckboxContainer(gvc, [
                                    {
                                        key: 'true',
                                        name: html `<div class="d-flex flex-column">是否驗證信箱 ${BgWidget.grayNote(`信箱是否需要驗證才能進行註冊或修改`)}</div>`,
                                    },
                                ], [`${(_a = vm.data.email_verify) !== null && _a !== void 0 ? _a : ''}` || 'false'], () => {
                                    vm.data.email_verify = !vm.data.email_verify;
                                    saveEvent();
                                }),
                                BgWidget.multiCheckboxContainer(gvc, [
                                    {
                                        key: 'true',
                                        name: html `<div class="d-flex flex-column">是否驗證電話 ${BgWidget.grayNote(`電話是否需要驗證才能進行註冊或修改`)}</div>`,
                                    },
                                ], [`${(_b = vm.data.phone_verify) !== null && _b !== void 0 ? _b : ''}` || 'false'], () => {
                                    vm.data.phone_verify = !vm.data.phone_verify;
                                    saveEvent();
                                }),
                            ].join('')}
                                        </div>`,
                            html `
                                            <div class="w-100 border-top my-3"></div>
                                            <div class="tx_normal fw-bolder mt-2" style="margin-bottom: 12px;">商店顯示</div>
                                            <div class="d-flex align-items-center w-100" style="gap:4px;margin-bottom: 12px;">
                                                <div class="tx_normal  d-flex flex-column">設定商店密碼</div>
                                                <div class="tx_normal ms-2">${!vm.data.password_to_see ? `關閉` : `開啟`}</div>
                                                <div class="cursor_pointer form-check form-switch m-0">
                                                    <input
                                                        class="form-check-input"
                                                        type="checkbox"
                                                        onchange="${gvc.event((e, event) => {
                                vm.data.password_to_see = !vm.data.password_to_see;
                                saveEvent();
                                gvc.notifyDataChange(vm.id);
                            })}"
                                                        ${vm.data.password_to_see ? `checked` : ``}
                                                    />
                                                </div>
                                                <div class="flex-fill"></div>
                                            </div>
                                            ${vm.data.password_to_see
                                ? [
                                    BgWidget.grayNote(`需輸入密碼才可查看商店內容`),
                                    BgWidget.editeInput({
                                        gvc: gvc,
                                        title: '',
                                        default: (_c = vm.data.shop_pwd) !== null && _c !== void 0 ? _c : '',
                                        placeHolder: '請輸入商店密碼',
                                        callback: (text) => {
                                            vm.data.shop_pwd = text;
                                        },
                                    }),
                                ].join('')
                                : ``}
                                        `,
                        ].join('')),
                        ...(() => {
                            const form = BgWidget.customForm(gvc, [
                                {
                                    key: 'custom_form_register',
                                    title: html ` <div class="tx_normal fw-bolder mt-2 d-flex flex-column" style="margin-bottom: 12px;">
                                                註冊頁面表單
                                                <span class="" style="color:#8D8D8D;font-size: 12px;">於註冊頁面中設定顧客必須填寫的資料</span>
                                            </div>`,
                                },
                                {
                                    key: 'customer_form_user_setting',
                                    title: html ` <div class="tx_normal fw-bolder mt-2 d-flex flex-column" style="margin-bottom: 12px;">
                                                設定頁面表單
                                                <span class="" style="color:#8D8D8D;font-size: 12px;">於用戶設定頁面中設定顧客可填寫的額外資料</span>
                                            </div>`,
                                },
                            ]);
                            return [
                                form.view,
                                html ` <div class="update-bar-container">
                                            ${BgWidget.save(gvc.event(() => __awaiter(this, void 0, void 0, function* () {
                                    const dialog = new ShareDialog(gvc.glitter);
                                    dialog.dataLoading({ visible: true });
                                    saveEvent();
                                    yield form.save();
                                    dialog.dataLoading({ visible: false });
                                    dialog.successMessage({ text: '設定成功' });
                                })))}
                                        </div>`,
                            ];
                        })(),
                        BgWidget.mbContainer(240),
                    ].join(BgWidget.mbContainer(24)))}
                    `);
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
