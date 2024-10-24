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
export class ThirdPartyApple {
    static main(gvc) {
        return (BgWidget.container(gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            const key = 'login_apple_setting';
            const vm = {
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
                        BgWidget.title('Apple串接設定'),
                        BgWidget.mbContainer(18),
                        `<div class="d-flex justify-content-center mx-sm-n3 ${document.body.clientWidth < 768 ? 'flex-column' : ''}"
                                     style="gap: 24px">
                                    ${BgWidget.container([
                            BgWidget.card([
                                `<div class="tx_700">串接綁定</div>`,
                                `<div class="d-flex align-items-center" style="gap:10px;">
啟用Apple登入${BgWidget.switchButton(gvc, vm.data.apple_toggle, () => {
                                    vm.data.apple_toggle = !vm.data.apple_toggle;
                                    gvc.notifyDataChange(id);
                                })}</div>`,
                                BgWidget.editeInput({
                                    gvc: gvc,
                                    title: `<div class="d-flex align-items-center" style="gap:10px;">
應用程式編號 Identifier
</div>`,
                                    default: vm.data.id,
                                    placeHolder: '請前往APPLE開發者後台取得應用程式編號',
                                    callback: (text) => {
                                        vm.data.id = text;
                                    },
                                }),
                                BgWidget.textArea({
                                    gvc: gvc,
                                    title: `<div class="d-flex align-items-center" style="gap:10px;">
應用程式私鑰 PRIVATE KEY
</div>`,
                                    default: vm.data.secret,
                                    placeHolder: '請前往APPLE開發者後台取得應用程式私鑰',
                                    callback: (text) => {
                                        vm.data.secret = text;
                                    },
                                }),
                                BgWidget.editeInput({
                                    gvc: gvc,
                                    title: `<div class="d-flex align-items-center" style="gap:10px;">
團隊ID
</div>`,
                                    default: vm.data.team_id,
                                    placeHolder: '請前往META開發者後台取得團隊ID',
                                    callback: (text) => {
                                        vm.data.team_id = text;
                                    },
                                }),
                                BgWidget.editeInput({
                                    gvc: gvc,
                                    title: `<div class="d-flex align-items-center" style="gap:10px;">
Key ID
</div>`,
                                    default: vm.data.key_id,
                                    placeHolder: '請前往META開發者後台取得Key ID',
                                    callback: (text) => {
                                        vm.data.key_id = text;
                                    },
                                }),
                                `<div onclick="${gvc.event(() => {
                                    const dialog = new ShareDialog(gvc.glitter);
                                    navigator.clipboard.writeText(`https://` + window.parent.glitter.share.editorViewModel.domain + '/login');
                                    dialog.successMessage({ text: '已複製至剪貼簿' });
                                })}">
${BgWidget.editeInput({
                                    readonly: true,
                                    gvc: gvc,
                                    title: `<div class="d-flex flex-column" style="gap:5px;">
網域與子網域 ${BgWidget.grayNote('點擊複製此連結至APPLE Developer後台的Domain and subdomains')}
</div>`,
                                    default: `https://` + window.parent.glitter.share.editorViewModel.domain,
                                    placeHolder: '',
                                    callback: (text) => { },
                                })}
</div>`,
                                `<div onclick="${gvc.event(() => {
                                    const dialog = new ShareDialog(gvc.glitter);
                                    navigator.clipboard.writeText(`https://` + window.parent.glitter.share.editorViewModel.domain + '/login');
                                    dialog.successMessage({ text: '已複製至剪貼簿' });
                                })}">
${BgWidget.editeInput({
                                    readonly: true,
                                    gvc: gvc,
                                    title: `<div class="d-flex flex-column" style="gap:5px;">
重新導向URI『 登入頁 』 ${BgWidget.grayNote('點擊複製此連結至APPLE Developer後台的Return URLS')}
</div>`,
                                    default: `https://` + window.parent.glitter.share.editorViewModel.domain + '/login',
                                    placeHolder: '',
                                    callback: (text) => { },
                                })}
</div>`,
                                `<div onclick="${gvc.event(() => {
                                    const dialog = new ShareDialog(gvc.glitter);
                                    navigator.clipboard.writeText(`https://` + window.parent.glitter.share.editorViewModel.domain + '/register');
                                    dialog.successMessage({ text: '已複製至剪貼簿' });
                                })}">
${BgWidget.editeInput({
                                    readonly: true,
                                    gvc: gvc,
                                    title: `<div class="d-flex flex-column" style="gap:5px;">
重新導向URI『 註冊頁 』  ${BgWidget.grayNote('點擊複製此連結至APPLE Developer後台的Return URLS')}
</div>`,
                                    default: `https://` + window.parent.glitter.share.editorViewModel.domain + '/register',
                                    placeHolder: '',
                                    callback: (text) => { },
                                })}
</div>`,
                            ].join(BgWidget.mbContainer(12))),
                        ].join(BgWidget.mbContainer(24)))}
                              ${BgWidget.container([
                            BgWidget.card([`<div class="tx_700">操作說明</div>`, `<div class="tx_normal">為啟用 Apple 登入功能，請前往 Apple 開發者後台，取得所需參數並完成設定。</div>`].join(BgWidget.mbContainer(12))),
                        ].join(BgWidget.mbContainer(24)))}
                               <div class="update-bar-container">
                               ${BgWidget.save(gvc.event(() => __awaiter(this, void 0, void 0, function* () {
                            const dialog = new ShareDialog(gvc.glitter);
                            dialog.dataLoading({ visible: true });
                            const cf = (yield ApiUser.getPublicConfig('login_config', 'manager')).response.value || {};
                            cf.apple = vm.data.apple_toggle;
                            yield ApiUser.setPublicConfig({
                                key: 'login_config',
                                value: cf,
                                user_id: 'manager',
                            });
                            yield ApiUser.setPublicConfig({
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
                        })))}
</div>
                                </div>`,
                    ].join('');
                },
            };
        })) + BgWidget.mbContainer(120));
    }
}
window.glitter.setModule(import.meta.url, ThirdPartyApple);
