import {GVC} from "../glitterBundle/GVController.js";
import {TableSet} from "./table-set.js";
import {BgWidget} from "../backend-manager/bg-widget.js";
import {ApiUser} from "../glitter-base/route/user.js";
import {ShareDialog} from "../glitterBundle/dialog/ShareDialog.js";

export class ThirdPartyLine {
    public static main(gvc: GVC) {
        return BgWidget.container(gvc.bindView(() => {
            const id = gvc.glitter.getUUID()
            const key = 'login_line_setting';
            const vm: {
                loading: boolean;
                data: {
                    login_toggle: boolean
                    id: string;
                    secret: string;
                    message_token: string
                };
            } = {
                loading: true,
                data: {
                    login_toggle: false,
                    id: '',
                    secret: '',
                    message_token: ''
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
                        return BgWidget.spinner()
                    }
                    return [
                        BgWidget.title('LINE 串接設定'),
                        BgWidget.mbContainer(18),
                        `<div class="d-flex justify-content-center mx-sm-n3 ${document.body.clientWidth < 768 ? 'flex-column' : ''}"
                                     style="gap: 24px">
                                    ${BgWidget.container(
                            [
                                BgWidget.card([
                                    `<div class="tx_700">串接綁定</div>`,
                                    `<div class="d-flex align-items-center" style="gap:10px;">
啟用LINE登入${BgWidget.switchButton(gvc, vm.data.login_toggle, () => {
                                        vm.data.login_toggle = !vm.data.login_toggle
                                        gvc.notifyDataChange(id)
                                    })}</div>`,
                                    BgWidget.editeInput({
                                        gvc: gvc,
                                        title: `<div class="d-flex align-items-center" style="gap:10px;">
通道ID${BgWidget.grayNote('(Channel ID)')}
</div>`,
                                        default: vm.data.id,
                                        placeHolder: '請前往LINE開發者後台取得Channel ID',
                                        callback: (text) => {
                                            vm.data.id = text
                                        }
                                    }),
                                    BgWidget.editeInput({
                                        gvc: gvc,
                                        title: `<div class="d-flex align-items-center" style="gap:10px;">
應用程式密鑰${BgWidget.grayNote('(Channel Secret)')}
</div>`,
                                        default: vm.data.secret,
                                        placeHolder: '請前往LINE開發者後台取得Channel Secret',
                                        callback: (text) => {
                                            vm.data.secret = text
                                        }
                                    }),
                                    BgWidget.editeInput({
                                        gvc: gvc,
                                        title: `<div class="d-flex align-items-center" style="gap:10px;">
訊息金鑰 ${BgWidget.grayNote('(Message API access token)')}
</div>`,
                                        default: vm.data.message_token,
                                        placeHolder: '請前往LINE開發者後台取得Message Token',
                                        callback: (text) => {
                                            vm.data.message_token = text
                                        }
                                    }),
                                    `<div  onclick="${gvc.event(()=>{
                                        const dialog=new ShareDialog(gvc.glitter)
                                        navigator.clipboard.writeText(`https://`+(window.parent as any).glitter.share.editorViewModel.domain+'/login');
                                        dialog.successMessage({text:'已複製至剪貼簿'})
                                    })}">
${BgWidget.editeInput({
                                        readonly:true,
                                        gvc: gvc,
                                        title: `<div class="d-flex flex-column" style="gap:5px;">
Callback URL ${BgWidget.grayNote('點擊複製此連結至LINE開發者後台的『 Callback URL 』欄位')}
</div>`,
                                        default:    `https://`+(window.parent as any).glitter.share.editorViewModel.domain+'/login',
                                        placeHolder: '',
                                        callback: (text) => {
                                         
                                        }
                                    })}
</div>`,
                                    `<div  onclick="${gvc.event(()=>{
                                        const dialog=new ShareDialog(gvc.glitter)
                                        navigator.clipboard.writeText( `https://`+(window.parent as any).glitter.share.editorViewModel.domain+'/login?line_liff=true');
                                        dialog.successMessage({text:'已複製至剪貼簿'})
                                    })}">
${BgWidget.editeInput({
                                        readonly:true,
                                        gvc: gvc,
                                        title: `<div class="d-flex flex-column" style="gap:5px;">
LINE LIFF ${BgWidget.grayNote('點擊複製此連結至LINE開發者後台的LIFF中的『 Endpoint URL 』欄位')}
</div>`,
                                        default:    `https://`+(window.parent as any).glitter.share.editorViewModel.domain+'/login?line_liff=true',
                                        placeHolder: '',
                                        callback: (text) => {

                                        }
                                    })}
</div>`,
                                    `<div  onclick="${gvc.event(()=>{
                                        const dialog=new ShareDialog(gvc.glitter)
                                        navigator.clipboard.writeText( `${(window.parent as any).config.url}/api-public/v1/line_message/listenMessage?g-app=${(window.parent as any).appName}`);
                                        dialog.successMessage({text:'已複製至剪貼簿'})
                                    })}">
${BgWidget.editeInput({
                                        readonly:true,
                                        gvc: gvc,
                                        title: `<div class="d-flex flex-column" style="gap:5px;">
Webhook URL ${BgWidget.grayNote('點擊複製此連結至LINE開發者後台的Messaging API 中的『 Webhook URL 』欄位')}
</div>`,
                                        default:    `${(window.parent as any).config.url}/api-public/v1/line_message/listenMessage?g-app=${(window.parent as any).appName}`,
                                        placeHolder: '',
                                        callback: (text) => {

                                        }
                                    })}
</div>`
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
                                    `<div class="tx_normal">設定LINE串接，實現LINE登入、訊息發送與推播功能，透過LINE LIFF實現用戶QR掃碼，同時加入好友與註冊會員綁定</div>`,
                                    `<div class="tx_normal">前往 ${BgWidget.blueNote(`『 教學步驟 』`, gvc.event(() => {
                                        (window.parent as any).glitter.openNewTab('https://shopnex.cc/blogs/lineapiconnect')
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
                            cf.line = vm.data.login_toggle;
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
        }), BgWidget.getContainerWidth())+BgWidget.mbContainer(120)
    }
}

(window as any).glitter.setModule(import.meta.url, ThirdPartyLine);