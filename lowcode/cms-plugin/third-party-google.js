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
export class ThirdPartyGoggle {
    static main(gvc) {
        return (BgWidget.container(gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            const key = 'login_google_setting';
            const vm = {
                loading: true,
                data: {
                    google_toggle: false,
                    id: '',
                    app_id: '',
                    secret: '',
                    pixel: '',
                },
                ga: {
                    ga4: [],
                    g_tag: [],
                },
            };
            ApiUser.getPublicConfig(key, 'manager').then((dd) => {
                vm.loading = false;
                if (Object.keys(dd.response.value).length) {
                    dd.response.value && (vm.data = dd.response.value);
                }
                ApiUser.getPublicConfig('ga4_config', 'manager').then((res) => {
                    if (Object.keys(res.response.value).length) {
                        res.response.value && (vm.ga = res.response.value);
                    }
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
                    function renderCodeSelect(array) {
                        return [
                            array
                                .map((dd, index) => {
                                return html `<div
                                                class="col-12 col-sm-4  mb-2 ps-0"
                                                style="align-self: stretch;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 0px;
    display: inline-flex;"
                                            >
                                                <input
                                                    class="w-100"
                                                    style="flex: 1 1 0;
    height: 40px;
    padding: 9px 18px;
    overflow: hidden;
    border: 1px #DDDDDD solid;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 10px;
    display: flex;
    border-right: 0px;
    border-radius: 10px 0px 0px 10px;"
                                                    placeholder="請輸入編號"
                                                    value="${dd.code}"
                                                    onchange="${gvc.event((e, event) => {
                                    dd.code = e.value;
                                })}"
                                                />
                                                <div
                                                    style="height: 100%;
    background: #f2f2f2;
    justify-content: center;
    align-items: center;
    display: flex;
    width: 40px;
    border: 1px #DDDDDD solid;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    cursor: pointer;"
                                                    onclick="${gvc.event(() => {
                                    const dialog = new ShareDialog(gvc.glitter);
                                    dialog.checkYesOrNot({
                                        text: '是否確認刪除此追蹤編號?',
                                        callback: (response) => {
                                            if (response) {
                                                array.splice(index, 1);
                                                gvc.notifyDataChange(id);
                                            }
                                        },
                                    });
                                })}"
                                                >
                                                    <div class="" style=""><i class="fa-regular fa-trash-can" aria-hidden="true"></i></div>
                                                </div>
                                            </div>`;
                            })
                                .join(''),
                            html `<div
                                        class="col-12 col-sm-4  mb-2 ps-0"
                                        onclick="${gvc.event(() => {
                                array.push({ code: '' });
                                gvc.notifyDataChange(id);
                            })}"
                                    >
                                        <div class="bt_orange">新增編號</div>
                                    </div>`,
                        ].join(``);
                    }
                    return [
                        html `<div class="title-container">
                                    ${BgWidget.title('Google 串接設定')}
                                    <div class="flex-fill"></div>
                                </div>`,
                        BgWidget.mbContainer(18),
                        BgWidget.container1x2({
                            html: [
                                BgWidget.mainCard([
                                    html `<div class="tx_700">串接綁定</div>`,
                                    html `<div class="d-flex align-items-center" style="gap:10px;">
                                                        啟用Google登入${BgWidget.switchButton(gvc, vm.data.google_toggle, () => {
                                        vm.data.google_toggle = !vm.data.google_toggle;
                                        gvc.notifyDataChange(id);
                                    })}
                                                    </div>`,
                                    BgWidget.editeInput({
                                        gvc: gvc,
                                        title: html `<div class="d-flex align-items-center" style="gap:10px;">客户端 ID</div>`,
                                        default: vm.data.id,
                                        placeHolder: '請前往GOOGLE開發者後台取得客户端 ID',
                                        callback: (text) => {
                                            vm.data.id = text;
                                        },
                                    }),
                                    BgWidget.editeInput({
                                        gvc: gvc,
                                        title: html `<div class="d-flex align-items-center" style="gap:10px;">APP客户端 ID『 非必填 』</div>`,
                                        default: vm.data.app_id,
                                        placeHolder: '請前往Google Cloud後台取得客户端 ID',
                                        callback: (text) => {
                                            vm.data.app_id = text;
                                        },
                                    }),
                                    BgWidget.editeInput({
                                        gvc: gvc,
                                        title: html `<div class="d-flex align-items-center" style="gap:10px;">應用程式密鑰</div>`,
                                        default: vm.data.secret,
                                        placeHolder: '請前往GOOGLE開發者後台取得應用程式密鑰',
                                        callback: (text) => {
                                            vm.data.secret = text;
                                        },
                                    }),
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
                                                                重新導向URI『 登入頁 』 ${BgWidget.grayNote('點擊複製此連結至Google Cloud後台的OAuth重定向URI')}
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
                                                                重新導向URI『 註冊頁 』 ${BgWidget.grayNote('點擊複製此連結至Google Cloud後台的OAuth重定向URI')}
                                                            </div>`,
                                        default: `https://` + window.parent.glitter.share.editorViewModel.domain + '/register',
                                        placeHolder: '',
                                        callback: (text) => { },
                                    })}
                                                    </div>`,
                                ].join(BgWidget.mbContainer(12))),
                                BgWidget.mainCard([
                                    html `<div class="tx_700 d-flex align-items-center" style="gap:10px;">
                                                        <img style="width: 25px;height: 25px;" src="https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1718208842472-ic_analytics.svg" />
                                                        資料分析 Google Analytics ( GA4 )
                                                    </div>`,
                                    html `<div class="tx_700">追蹤編號</div>`,
                                    html `<div class="row m-0">${renderCodeSelect(vm.ga.ga4)}</div>`,
                                ].join(BgWidget.mbContainer(12))),
                                BgWidget.mainCard([
                                    html `<div class="tx_700 d-flex align-items-center" style="gap:10px;">
                                                        <img style="width: 25px;height: 25px;" src="https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1718210156723-ic_tag_manager.svg" />
                                                        追蹤代碼管理工具 Google Tag Manager
                                                    </div>`,
                                    html `<div class="tx_700">追蹤編號含GTM</div>`,
                                    html `<div class="row m-0">${renderCodeSelect(vm.ga.g_tag)}</div>`,
                                ].join(BgWidget.mbContainer(12))),
                            ].join(BgWidget.mbContainer(24)),
                            ratio: 70,
                        }, {
                            html: [
                                BgWidget.summaryCard([
                                    html `<div class="tx_700">操作說明</div>`,
                                    html `<div class="tx_normal">設定Google串接，實現Google登入，與 GA4 用戶行為追蹤</div>`,
                                    html `<div class="tx_normal">
                                                        前往
                                                        ${BgWidget.blueNote(`『 教學步驟 』`, gvc.event(() => {
                                        window.parent.glitter.openNewTab('https://shopnex.cc/blogs/googleapiconnect');
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
                            cf.google = vm.data.google_toggle;
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
                                </div>`,
                    ].join('');
                },
            };
        })) + BgWidget.mbContainer(120));
    }
}
window.glitter.setModule(import.meta.url, ThirdPartyGoggle);
