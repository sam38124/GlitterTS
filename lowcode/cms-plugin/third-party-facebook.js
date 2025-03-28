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
export class ThirdPartyLine {
    static main(gvc) {
        return (BgWidget.container(gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            const key = 'login_fb_setting';
            const vm = {
                loading: true,
                data: {
                    message_toggle: false,
                    facebook_toggle: false,
                    id: '',
                    secret: '',
                    pixel: '',
                    api_token: '',
                    secret_message: '',
                    id_message: '',
                    fans_id: '',
                    fans_token: '',
                },
            };
            ApiUser.getPublicConfig(key, 'manager').then((dd) => {
                vm.loading = false;
                dd.response.value && (vm.data = dd.response.value);
                console.log('vm.data -- ', vm.data);
                gvc.notifyDataChange(id);
            });
            return {
                bind: id,
                view: () => {
                    const html = String.raw;
                    if (vm.loading) {
                        return BgWidget.spinner();
                    }
                    return [
                        html `<div class="title-container">
                                    ${BgWidget.title('臉書串接設定')}
                                    <div class="flex-fill"></div>
                                </div>`,
                        BgWidget.mbContainer(18),
                        BgWidget.container1x2({
                            html: [
                                BgWidget.mainCard([
                                    html `<div class="tx_700">臉書登入設定</div>`,
                                    html `<div class="d-flex align-items-center" style="gap:10px;">
                                                        啟用臉書登入${BgWidget.switchButton(gvc, vm.data.facebook_toggle, () => {
                                        vm.data.facebook_toggle = !vm.data.facebook_toggle;
                                        gvc.notifyDataChange(id);
                                    })}
                                                    </div>`,
                                    BgWidget.editeInput({
                                        gvc: gvc,
                                        title: html `<div class="d-flex align-items-center" style="gap:10px;">應用程式編號</div>`,
                                        default: vm.data.id,
                                        placeHolder: '請前往META開發者後台取得應用程式編號',
                                        callback: (text) => {
                                            vm.data.id = text;
                                        },
                                    }),
                                    BgWidget.editeInput({
                                        gvc: gvc,
                                        title: html `<div class="d-flex align-items-center" style="gap:10px;">應用程式密鑰</div>`,
                                        default: vm.data.secret,
                                        placeHolder: '請前往META開發者後台取得應用程式密鑰',
                                        callback: (text) => {
                                            vm.data.secret = text;
                                        },
                                    }),
                                    html `<div
                                                        onclick="${gvc.event(() => {
                                        const dialog = new ShareDialog(gvc.glitter);
                                        navigator.clipboard.writeText(`https://` + window.parent.glitter.share.editorViewModel.domain);
                                        dialog.successMessage({ text: '已複製至剪貼簿' });
                                    })}"
                                                    >
                                                        ${BgWidget.editeInput({
                                        readonly: true,
                                        gvc: gvc,
                                        title: html `<div class="d-flex flex-column" style="gap:5px;">
                                                                允許網域 ${BgWidget.grayNote('點擊複製此連結至FACEBOOK開發者後台的Javascript允許網域')}
                                                            </div>`,
                                        default: `https://` + window.parent.glitter.share.editorViewModel.domain,
                                        placeHolder: '',
                                        callback: (text) => { },
                                    })}
                                                    </div>`,
                                    html `<div
                                                        onclick="${gvc.event(() => {
                                        const dialog = new ShareDialog(gvc.glitter);
                                        navigator.clipboard.writeText(`https://` + window.parent.glitter.share.editorViewModel.domain + '/login');
                                        dialog.successMessage({ text: '已複製至剪貼簿' });
                                    })}"
                                                    >
                                                        ${BgWidget.editeInput({
                                        readonly: true,
                                        gvc: gvc,
                                        title: html `<div class="d-flex flex-column" style="gap:5px;">
                                                                重新導向URI『 登入頁 』 ${BgWidget.grayNote('點擊複製此連結至FACEBOOK開發者後台的OAuth重新導向URI')}
                                                            </div>`,
                                        default: `https://` + window.parent.glitter.share.editorViewModel.domain + '/login',
                                        placeHolder: '',
                                        callback: (text) => { },
                                    })}
                                                    </div>`,
                                    html `<div
                                                        onclick="${gvc.event(() => {
                                        const dialog = new ShareDialog(gvc.glitter);
                                        navigator.clipboard.writeText(`https://` + window.parent.glitter.share.editorViewModel.domain + '/register');
                                        dialog.successMessage({ text: '已複製至剪貼簿' });
                                    })}"
                                                    >
                                                        ${BgWidget.editeInput({
                                        readonly: true,
                                        gvc: gvc,
                                        title: html `<div class="d-flex flex-column" style="gap:5px;">
                                                                重新導向URI『 註冊頁 』 ${BgWidget.grayNote('點擊複製此連結至FACEBOOK開發者後台的OAuth重新導向URI')}
                                                            </div>`,
                                        default: `https://` + window.parent.glitter.share.editorViewModel.domain + '/register',
                                        placeHolder: '',
                                        callback: (text) => { },
                                    })}
                                                    </div>`,
                                ].join(BgWidget.mbContainer(12))),
                                BgWidget.mainCard([
                                    html `<div class="tx_700">臉書訊息綁定</div>`,
                                    html `<div class="d-flex align-items-center" style="gap:10px;">
                                                        啟用臉書訊息綁定${BgWidget.switchButton(gvc, vm.data.message_toggle, () => {
                                        vm.data.message_toggle = !vm.data.message_toggle;
                                        gvc.notifyDataChange(id);
                                    })}
                                                    </div>`,
                                    BgWidget.editeInput({
                                        gvc: gvc,
                                        title: html `<div class="d-flex align-items-center" style="gap:10px;">粉絲團ID</div>`,
                                        default: vm.data.fans_id,
                                        placeHolder: '請輸入粉絲團ID',
                                        callback: (text) => {
                                            vm.data.fans_id = text;
                                        },
                                    }),
                                    BgWidget.editeInput({
                                        gvc: gvc,
                                        title: html `<div class="d-flex align-items-center" style="gap:10px;">粉絲團TOKEN</div>`,
                                        default: vm.data.fans_token,
                                        placeHolder: '請輸入粉絲團TOKEN',
                                        callback: (text) => {
                                            vm.data.fans_token = text;
                                        },
                                    }),
                                    html `<div
                                                        onclick="${gvc.event(() => {
                                        const dialog = new ShareDialog(gvc.glitter);
                                        navigator.clipboard.writeText(`${window.parent.config.url}/api-public/v1/fb_message/listenMessage?g-app=${window.parent.appName}`);
                                        dialog.successMessage({ text: '已複製至剪貼簿' });
                                    })}"
                                                    >
                                                        ${BgWidget.editeInput({
                                        readonly: true,
                                        gvc: gvc,
                                        title: html `<div class="d-flex flex-column" style="gap:5px;">
                                                                Webhook URL
                                                                ${BgWidget.grayNote('點擊複製此連結至FB開發者後台的Messaging API 中的設定 Webhooks -> 編輯 -> 回呼網址，並將"my_secret_token"填入驗證權杖欄位中')}
                                                            </div>`,
                                        default: `${window.parent.config.url}/api-public/v1/fb_message/listenMessage?g-app=${window.parent.appName}`,
                                        placeHolder: '',
                                        callback: (text) => { },
                                    })}
                                                    </div>`,
                                ].join(BgWidget.mbContainer(12))),
                                BgWidget.mainCard([
                                    html `<div class="tx_700">臉書像素(Pixel)</div>`,
                                    BgWidget.editeInput({
                                        gvc: gvc,
                                        title: `透過臉書像素來追蹤你的廣告成效`,
                                        default: vm.data.pixel,
                                        placeHolder: '請前往META開發者後台取得像素編號',
                                        callback: (text) => {
                                            vm.data.pixel = text;
                                        },
                                    }),
                                    BgWidget.editeInput({
                                        gvc: gvc,
                                        title: `轉換API token`,
                                        default: vm.data.api_token,
                                        placeHolder: '請前往META開發者後台取得轉換 API token',
                                        callback: (text) => {
                                            vm.data.api_token = text;
                                        },
                                    }),
                                ].join(BgWidget.mbContainer(12))),
                            ].join(BgWidget.mbContainer(24)),
                            ratio: 70,
                        }, {
                            html: [
                                BgWidget.summaryCard([
                                    html `<div class="tx_700">操作說明</div>`,
                                    html `<div class="tx_normal">設定FACEBOOK串接，實現臉書登入、訊息同步，與用戶行為追蹤</div>`,
                                    html `<div class="tx_normal">
                                                        前往
                                                        ${BgWidget.blueNote(`『 教學步驟 』`, gvc.event(() => {
                                        window.parent.glitter.openNewTab('https://shopnex.tw/blogs/fbapiconnect');
                                    }))}
                                                        查看串接設定流程
                                                    </div>`,
                                ].join(BgWidget.mbContainer(12))),
                            ].join(BgWidget.mbContainer(24)),
                            ratio: 30,
                        }),
                        html `<div class="update-bar-container">
                                    ${BgWidget.save(gvc.event(() => __awaiter(this, void 0, void 0, function* () {
                            const dialog = new ShareDialog(gvc.glitter);
                            dialog.dataLoading({ visible: true });
                            const cf = (yield ApiUser.getPublicConfig('login_config', 'manager')).response.value || {};
                            cf.fb = vm.data.facebook_toggle;
                            yield ApiUser.setPublicConfig({
                                key: 'login_config',
                                value: cf,
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
                                </div>`,
                    ].join('');
                },
            };
        })) + BgWidget.mbContainer(120));
    }
}
window.glitter.setModule(import.meta.url, ThirdPartyLine);
