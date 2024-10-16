import {GVC} from "../glitterBundle/GVController.js";
import {TableSet} from "./table-set.js";
import {BgWidget} from "../backend-manager/bg-widget.js";
import {ApiUser} from "../glitter-base/route/user.js";
import {ShareDialog} from "../glitterBundle/dialog/ShareDialog.js";

export class ThirdPartyLine {
    public static main(gvc: GVC) {
        return BgWidget.container(gvc.bindView(() => {

            const id = gvc.glitter.getUUID()
            const key = 'login_fb_setting';
            const vm: {
                loading: boolean;
                data: {
                    facebook_toggle: boolean,
                    message_toggle: boolean
                    id: string;
                    secret: string;
                    pixel: string;
                    api_token: string;
                    secret_message: string;
                    id_message: string;
                    fans_id: string;
                    fans_token: string;
                };
            } = {
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
                    fans_token: ''
                },
            };

            ApiUser.getPublicConfig(key, 'manager').then((dd) => {
                vm.loading = false;
                dd.response.value && (vm.data = dd.response.value);
                console.log("vm.data -- ", vm.data)
                gvc.notifyDataChange(id);
            });

            return {
                bind: id,
                view: () => {
                    const html = String.raw;
                    if (vm.loading) {
                        return BgWidget.spinner()
                    }
                    return [

                        BgWidget.title('臉書串接設定'),
                        BgWidget.mbContainer(18),
                        `<div class="d-flex justify-content-center mx-sm-n3 ${document.body.clientWidth < 768 ? 'flex-column' : ''}"
                                     style="gap: 24px">
                                    ${BgWidget.container(
                            [
                                BgWidget.card([
                                    `<div class="tx_700">臉書登入設定</div>`,
                                    `<div class="d-flex align-items-center" style="gap:10px;">
啟用臉書登入${BgWidget.switchButton(gvc, vm.data.facebook_toggle, () => {
                                        vm.data.facebook_toggle = !vm.data.facebook_toggle
                                        gvc.notifyDataChange(id)
                                    })}</div>`,
                                    BgWidget.editeInput({
                                        gvc: gvc,
                                        title: `<div class="d-flex align-items-center" style="gap:10px;">
應用程式編號
</div>`,
                                        default: vm.data.id,
                                        placeHolder: '請前往META開發者後台取得應用程式編號',
                                        callback: (text) => {
                                            vm.data.id = text
                                        }
                                    }),
                                    BgWidget.editeInput({
                                        gvc: gvc,
                                        title: `<div class="d-flex align-items-center" style="gap:10px;">
應用程式密鑰
</div>`,
                                        default: vm.data.secret,
                                        placeHolder: '請前往META開發者後台取得應用程式密鑰',
                                        callback: (text) => {
                                            vm.data.secret = text
                                        }
                                    })
                                ].join(BgWidget.mbContainer(12))),
                                BgWidget.card([
                                    `<div class="tx_700">臉書訊息綁定</div>`,
                                    `<div class="d-flex align-items-center" style="gap:10px;">
                                        啟用臉書訊息綁定${BgWidget.switchButton(gvc, vm.data.message_toggle, () => {
                                        vm.data.message_toggle = !vm.data.message_toggle
                                        gvc.notifyDataChange(id)
                                    })}</div>`,

                                    BgWidget.editeInput({
                                        gvc: gvc,
                                        title: `<div class="d-flex align-items-center" style="gap:10px;">
粉絲團ID
</div>`,
                                        default: vm.data.fans_id,
                                        placeHolder: '請輸入粉絲團ID',
                                        callback: (text) => {
                                            vm.data.fans_id = text
                                        }
                                    }),
                                    BgWidget.editeInput({
                                        gvc: gvc,
                                        title: `<div class="d-flex align-items-center" style="gap:10px;">
粉絲團TOKEN
</div>`,
                                        default: vm.data.fans_token,
                                        placeHolder: '請輸入粉絲團TOKEN',
                                        callback: (text) => {
                                            vm.data.fans_token = text
                                        }
                                    }),
                                    html`<div  onclick="${gvc.event(() => {
                                        const dialog = new ShareDialog(gvc.glitter)
                                        navigator.clipboard.writeText(`${(window.parent as any).config.url}/api-public/v1/fb_message/listenMessage?g-app=${(window.parent as any).appName}`);
                                        dialog.successMessage({text: '已複製至剪貼簿'})
                                    })}">
${BgWidget.editeInput({
                                        readonly: true,
                                        gvc: gvc,
                                        title: `<div class="d-flex flex-column" style="gap:5px;">
Webhook URL ${BgWidget.grayNote('點擊複製此連結至FB開發者後台的Messaging API 中的設定 Webhooks -> 編輯 -> 回呼網址，並將"my_secret_token"填入驗證權杖欄位中')}
</div>`,
                                        default: `${(window.parent as any).config.url}/api-public/v1/fb_message/listenMessage?g-app=${(window.parent as any).appName}`,
                                        placeHolder: '',
                                        callback: (text) => {

                                        }
                                    })}
</div>`,


                                ].join(BgWidget.mbContainer(12))),
                                BgWidget.card([
                                    `<div class="tx_700">臉書像素(Pixel)</div>`,
                                    BgWidget.editeInput({
                                        gvc: gvc,
                                        title: `透過臉書像素來追蹤你的廣告成效`,
                                        default: vm.data.pixel,
                                        placeHolder: '請前往META開發者後台取得像素編號',
                                        callback: (text) => {
                                            vm.data.pixel = text
                                        }
                                    }),
                                    BgWidget.editeInput({
                                        gvc: gvc,
                                        title: `轉換API token`,
                                        default: vm.data.api_token,
                                        placeHolder: '請前往META開發者後台取得轉換 API token',
                                        callback: (text) => {
                                            vm.data.api_token = text
                                        }
                                    })
                                ].join(BgWidget.mbContainer(12)))
                            ].join(BgWidget.mbContainer(24)),
                            undefined,
                            'padding: 0 ; margin: 0 !important; width: 68.5%;'
                        )}
                              ${BgWidget.container(
                            // 摘要預覽
                            [
                                BgWidget.card([
                                    `<div class="tx_700">操作說明</div>`,
                                    `<div class="tx_normal">設定FACEBOOK串接，實現臉書登入、訊息同步，與用戶行為追蹤</div>`,
                                    `<div class="tx_normal">前往 ${BgWidget.blueNote(`『 教學步驟 』`, gvc.event(() => {
                                        (window.parent as any).glitter.openNewTab('https://shopnex.cc/blogs/fbapiconnect')
                                    }))} 查看串接設定流程</div>`,
                                ].join(BgWidget.mbContainer(12)))
                            ].join(BgWidget.mbContainer(24)),
                            undefined,
                            'padding: 0; margin: 0 !important; width: 26.5%;'
                        )}
                               <div class="update-bar-container">
                               ${BgWidget.save(gvc.event(async () => {
                            const dialog = new ShareDialog(gvc.glitter);
                            dialog.dataLoading({visible: true});
                            const cf = (await ApiUser.getPublicConfig('login_config', 'manager')).response.value || {}
                            cf.fb = vm.data.facebook_toggle;
                            await ApiUser.setPublicConfig({
                                key: 'login_config',
                                value: cf,
                                user_id: 'manager',
                            })

                            ApiUser.setPublicConfig({
                                key: key,
                                value: vm.data,
                                user_id: 'manager',
                            }).then(() => {
                                dialog.dataLoading({visible: false});
                                dialog.successMessage({text: '設定成功'});
                                gvc.closeDialog();
                            });

                        }))}
</div>
                                </div>`
                    ].join('')
                }
            }
        }), BgWidget.getContainerWidth()) + BgWidget.mbContainer(120)
    }
}

(window as any).glitter.setModule(import.meta.url, ThirdPartyLine);