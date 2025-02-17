import { GVC } from '../glitterBundle/GVController.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';

export class ThirdPartyApple {
    public static main(gvc: GVC) {
        return (
            BgWidget.container(
                gvc.bindView(() => {
                    const id = gvc.glitter.getUUID();
                    const key = 'login_apple_setting';
                    const vm: {
                        loading: boolean;
                        data: {
                            apple_toggle: boolean;
                            team_id: string;
                            bundle_id: string;
                            id: string;
                            secret: string;
                            key_id: string;
                        };
                        ga: {
                            ga4: { code: string }[];
                            g_tag: { code: string }[];
                        };
                    } = {
                        loading: true,
                        data: {
                            apple_toggle: false,
                            bundle_id: '',
                            id: '',
                            team_id: '',
                            secret: '',
                            key_id: '',
                        },
                        ga: {
                            ga4: [],
                            g_tag: [],
                        },
                    };

                    ApiUser.getPublicConfig(key, 'manager').then((dd) => {
                        vm.loading = false;
                        dd.response.value && (vm.data = dd.response.value);
                        ApiUser.getPublicConfig('ga4_config', 'manager').then((res) => {
                            res.response.value && (vm.ga = res.response.value);
                            gvc.notifyDataChange(id);
                        });
                    });

                    return {
                        bind: id,
                        view: () => {
                            if (vm.loading) {
                                return BgWidget.spinner();
                            }
                            const html = String.raw;
                            return [
                                html`<div class="title-container">
                                    ${BgWidget.title('Apple 串接設定')}
                                    <div class="flex-fill"></div>
                                </div>`,
                                BgWidget.mbContainer(18),
                                BgWidget.container1x2(
                                    {
                                        html: [
                                            BgWidget.mainCard(
                                                [
                                                    html`<div class="tx_700">串接綁定</div>`,
                                                    html`<div class="d-flex align-items-center" style="gap:10px;">
                                                        啟用Apple登入${BgWidget.switchButton(gvc, vm.data.apple_toggle, () => {
                                                            vm.data.apple_toggle = !vm.data.apple_toggle;
                                                            gvc.notifyDataChange(id);
                                                        })}
                                                    </div>`,
                                                    BgWidget.editeInput({
                                                        gvc: gvc,
                                                        title: html`<div class="d-flex align-items-center" style="gap:10px;">應用程式編號 Identifier</div>`,
                                                        default: vm.data.id,
                                                        placeHolder: '請前往APPLE開發者後台取得應用程式編號',
                                                        callback: (text) => {
                                                            vm.data.id = text;
                                                        },
                                                    }),
                                                    BgWidget.textArea({
                                                        gvc: gvc,
                                                        title: html`<div class="d-flex align-items-center" style="gap:10px;">應用程式私鑰 PRIVATE KEY</div>`,
                                                        default: vm.data.secret,
                                                        placeHolder: '請前往APPLE開發者後台取得應用程式私鑰',
                                                        callback: (text) => {
                                                            vm.data.secret = text;
                                                        },
                                                    }),
                                                    BgWidget.editeInput({
                                                        gvc: gvc,
                                                        title: html`<div class="d-flex align-items-center" style="gap:10px;">團隊ID</div>`,
                                                        default: vm.data.team_id,
                                                        placeHolder: '請前往META開發者後台取得團隊ID',
                                                        callback: (text) => {
                                                            vm.data.team_id = text;
                                                        },
                                                    }),
                                                    BgWidget.editeInput({
                                                        gvc: gvc,
                                                        title: html`<div class="d-flex align-items-center" style="gap:10px;">Key ID</div>`,
                                                        default: vm.data.key_id,
                                                        placeHolder: '請前往META開發者後台取得Key ID',
                                                        callback: (text) => {
                                                            vm.data.key_id = text;
                                                        },
                                                    }),
                                                    html`<div
                                                        onclick="${gvc.event(() => {
                                                            const dialog = new ShareDialog(gvc.glitter);
                                                            navigator.clipboard.writeText(`https://` + (window.parent as any).glitter.share.editorViewModel.domain + '/login');
                                                            dialog.successMessage({ text: '已複製至剪貼簿' });
                                                        })}"
                                                    >
                                                        ${BgWidget.editeInput({
                                                            readonly: true,
                                                            gvc: gvc,
                                                            title: html`<div class="d-flex flex-column" style="gap:5px;">
                                                                網域與子網域 ${BgWidget.grayNote('點擊複製此連結至APPLE Developer後台的Domain and subdomains')}
                                                            </div>`,
                                                            default: `https://` + (window.parent as any).glitter.share.editorViewModel.domain,
                                                            placeHolder: '',
                                                            callback: (text) => {},
                                                        })}
                                                    </div>`,
                                                    html`<div
                                                        onclick="${gvc.event(() => {
                                                            const dialog = new ShareDialog(gvc.glitter);
                                                            navigator.clipboard.writeText(`https://` + (window.parent as any).glitter.share.editorViewModel.domain + '/login');
                                                            dialog.successMessage({ text: '已複製至剪貼簿' });
                                                        })}"
                                                    >
                                                        ${BgWidget.editeInput({
                                                            readonly: true,
                                                            gvc: gvc,
                                                            title: html`<div class="d-flex flex-column" style="gap:5px;">
                                                                重新導向URI『 登入頁 』 ${BgWidget.grayNote('點擊複製此連結至APPLE Developer後台的Return URLS')}
                                                            </div>`,
                                                            default: `https://` + (window.parent as any).glitter.share.editorViewModel.domain + '/login',
                                                            placeHolder: '',
                                                            callback: (text) => {},
                                                        })}
                                                    </div>`,
                                                    html`<div
                                                        onclick="${gvc.event(() => {
                                                            const dialog = new ShareDialog(gvc.glitter);
                                                            navigator.clipboard.writeText(`https://` + (window.parent as any).glitter.share.editorViewModel.domain + '/register');
                                                            dialog.successMessage({ text: '已複製至剪貼簿' });
                                                        })}"
                                                    >
                                                        ${BgWidget.editeInput({
                                                            readonly: true,
                                                            gvc: gvc,
                                                            title: html`<div class="d-flex flex-column" style="gap:5px;">
                                                                重新導向URI『 註冊頁 』 ${BgWidget.grayNote('點擊複製此連結至APPLE Developer後台的Return URLS')}
                                                            </div>`,
                                                            default: `https://` + (window.parent as any).glitter.share.editorViewModel.domain + '/register',
                                                            placeHolder: '',
                                                            callback: (text) => {},
                                                        })}
                                                    </div>`,
                                                ].join(BgWidget.mbContainer(12))
                                            ),
                                        ].join(BgWidget.mbContainer(24)),
                                        ratio: 70,
                                    },
                                    {
                                        // 摘要預覽
                                        html: [
                                            BgWidget.summaryCard(
                                                [
                                                    html`<div class="tx_700">操作說明</div>`,
                                                    html`<div class="tx_normal">為啟用 Apple 登入功能，請前往 Apple 開發者後台，取得所需參數並完成設定。</div>`,
                                                ].join(BgWidget.mbContainer(12))
                                            ),
                                        ].join(BgWidget.mbContainer(24)),
                                        ratio: 30,
                                    }
                                ),
                                html`<div class="update-bar-container">
                                    ${BgWidget.save(
                                        gvc.event(async () => {
                                            const dialog = new ShareDialog(gvc.glitter);
                                            dialog.dataLoading({ visible: true });
                                            const cf = (await ApiUser.getPublicConfig('login_config', 'manager')).response.value || {};
                                            cf.apple = vm.data.apple_toggle;
                                            await ApiUser.setPublicConfig({
                                                key: 'login_config',
                                                value: cf,
                                                user_id: 'manager',
                                            });
                                            await ApiUser.setPublicConfig({
                                                key: 'ga4_config',
                                                value: vm.ga,
                                                user_id: 'manager',
                                            });
                                            ApiUser.setPublicConfig({
                                                key: key,
                                                value: vm.data,
                                                user_id: 'manager',
                                            }).then(() => {
                                                dialog.dataLoading({ visible: false });
                                                dialog.successMessage({ text: '設定成功' });
                                                gvc.closeDialog();
                                            });
                                        })
                                    )}
                                </div>`,
                            ].join('');
                        },
                    };
                })
            ) + BgWidget.mbContainer(120)
        );
    }
}

(window as any).glitter.setModule(import.meta.url, ThirdPartyApple);
