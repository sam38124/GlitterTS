import { GVC } from '../glitterBundle/GVController.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { EditorConfig } from '../editor-config.js';
import { ViewWidget } from './view-widget.js';
import { FormModule } from './module/form-module.js';

export class MemberSetting {
    public static main(gvc: GVC) {
        const html = String.raw;
        const vm: {
            id: string;
            data: any;
            loading: boolean;
        } = {
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
            }).then(() => {});
        }

        return gvc.bindView(() => {
            return {
                bind: vm.id,
                view: () => {
                    if (vm.loading) {
                        return ``;
                    }
                    return BgWidget.container(
                        html`
                            <div class="title-container">
                                ${BgWidget.title('結帳設定')}
                                <div class="flex-fill"></div>
                            </div>
                            ${BgWidget.container(
                                [
                                    BgWidget.mainCard(
                                        [
                                            html` <div class="tx_normal fw-bolder mt-2" style="margin-bottom: 12px;">結帳設定</div>`,
                                            html` <div class="d-flex align-items-center w-100" style="gap:4px;margin-bottom: 12px;">
                                                <div class="tx_normal  d-flex flex-column">允許訪客結帳</div>
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
                                        ].join('')
                                    ),
                                    ...(() => {
                                        const form = BgWidget.customForm(gvc, [
                                            {
                                                key: 'custom_form_checkout',
                                                title: html`
                                                    <div class="tx_normal fw-bolder mt-2 d-flex flex-column"
                                                         style="margin-bottom: 12px;">
                                                        顧客資訊表單
                                                        <span class="" style="color:#8D8D8D;font-size: 12px;">於結帳頁面中設定顧客必須填寫的顧客資訊表單</span>
                                                    </div>

                                                `
                                            },
                                            {
                                                key: 'custom_form_checkout_recipient',
                                                title: html`
                                                    <div class="tx_normal fw-bolder mt-2 d-flex flex-column"
                                                         style="margin-bottom: 12px;">
                                                        配送資訊表單
                                                        <span class="" style="color:#8D8D8D;font-size: 12px;">於結帳頁面中設定顧客必須填寫的配送資訊表單</span>
                                                    </div>

                                                `
                                            }
                                        ]);
                                        return [
                                            form.view,
                                            html` <div class="update-bar-container">
                                                ${BgWidget.save(
                                                    gvc.event(async () => {
                                                        const dialog = new ShareDialog(gvc.glitter);
                                                        dialog.dataLoading({ visible: true });
                                                        saveEvent();
                                                        await form.save();
                                                        dialog.dataLoading({ visible: false });
                                                      
                                                        dialog.successMessage({ text: '設定成功' });
                                                    })
                                                )}
                                            </div>`,
                                        ];
                                    })(),
                                    BgWidget.mbContainer(240),
                                ].join(BgWidget.mbContainer(24))
                            )}
                        `
                    );
                },
            };
        });
    }


}

(window as any).glitter.setModule(import.meta.url, MemberSetting);
