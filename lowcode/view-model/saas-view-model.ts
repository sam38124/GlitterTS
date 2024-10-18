import { ApiUser } from '../glitter-base/route/user.js';
import { GlobalUser } from '../glitter-base/global/global-user.js';
import { GVC } from '../glitterBundle/GVController.js';
import { ApiPageConfig } from '../api/pageConfig.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { BaseApi } from '../glitterBundle/api/base.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import {AiPointsApi} from "../glitter-base/route/ai-points-api.js";
import {SmsPointsApi} from "../glitter-base/route/sms-points-api.js";

const html = String.raw;

export class SaasViewModel {
    public static app_manager(gvc: GVC) {
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            const dialog = new ShareDialog(gvc.glitter);
            return {
                bind: id,
                view: () => {
                    return new Promise(async (resolve) => {
                        const userData = (await ApiUser.getSaasUserData(GlobalUser.saas_token, 'me')).response;
                        resolve(html` <div class="btn btn-outline-secondary dropdown-toggle border-0 p-1 position-relative" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onclick="${gvc.event((e,event)=>{
                            event.stopPropagation()
                            event.preventDefault()
                        })}" disabled="true" >
                                <div class="d-flex align-items-center ">
                                    <img
                                        src="https://assets.imgix.net/~text?bg=7ED379&txtclr=ffffff&w=100&h=100&txtsize=40&txt=${userData.userData.name}&txtfont=Helvetica&txtalign=middle,center"
                                        class="rounded-circle"
                                        width="48"
                                        alt="Avatar"
                                        style="width:40px;height:40px;"
                                    />
                                    <div class="d-none d-sm-block ps-2">
                                        <div class="fs-xs lh-1 opacity-60 fw-500">Hello,</div>
                                        <div class="fs-sm fw-500">${userData.userData.name}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="dropdown-menu position-absolute" style="top:50px; ${document.body.clientWidth > 768 ? 'right: 0 !important;' : 'left: -110px;'}">
                                <a
                                        class="dropdown-item cursor_pointer d-flex align-items-center"
                                        onclick="${gvc.event(() => {
                                            gvc.glitter.setUrlParameter('tab','ai-point')
                                            gvc.recreateView()
                                        })}"
                                ><img src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/size1440_s*px$_sas0s9s0s1sesas0_1697354801736-Glitterlogo.png" class="me-2" style="width:24px;height: 24px;">剩餘『${
                                        gvc.bindView(()=>{
                                            const id=gvc.glitter.getUUID()
                                            const vm={
                                                loading:true,
                                                sum:0
                                            }
                                            AiPointsApi.getSum({}).then((res)=>{
                                                vm.sum=parseInt(res.response.sum,10)
                                                vm.loading=false

                                                gvc.notifyDataChange(id)
                                            })
                                            return {
                                                bind:id,
                                                view:()=>{
                                                    if(vm.loading){
                                                        return `<div class="h-100 d-flex align-items-center"><div class="spinner-border" style="height:20px;width: 20px;"></div></div>`
                                                    }else{
                                                        return  `${vm.sum.toLocaleString()}`
                                                    }
                                                },
                                                divCreate:{
                                                    class:`mx-1`
                                                }
                                            }
                                        })
                                }』點</a
                                >
                                <a class="dropdown-item cursor_pointer d-flex align-items-center"
                                   onclick="${gvc.event(() => {
                                       gvc.glitter.setUrlParameter('tab','sms-points')
                                       gvc.recreateView()
                                   })}"
                                ><div class="me-2 d-flex align-items-center justify-content-center fs-6" style="width:24px;height: 24px;"><i class="fa-solid fa-comment-sms"></i></div>剩餘『${
                                        gvc.bindView(()=>{
                                            const id=gvc.glitter.getUUID()
                                            const vm={
                                                loading:true,
                                                sum:0
                                            }
                                            SmsPointsApi.getSum({}).then((res)=>{
                                                vm.sum=parseInt(res.response.sum,10)
                                                vm.loading=false

                                                gvc.notifyDataChange(id)
                                            })
                                            return {
                                                bind:id,
                                                view:()=>{
                                                    if(vm.loading){
                                                        return `<div class="h-100 d-flex align-items-center"><div class="spinner-border" style="height:20px;width: 20px;"></div></div>`
                                                    }else{
                                                        return  `${vm.sum.toLocaleString()}`
                                                    }
                                                },
                                                divCreate:{
                                                    class:`mx-1`
                                                }
                                            }
                                        })
                                }』點</a>
                                <a class="dropdown-item cursor_pointer d-flex align-items-center"
                                    onclick="${gvc.event(() => {
                                        SaasViewModel.openShopList(gvc)
                                    })}"
                                    ><div class="me-2 d-flex align-items-center justify-content-center fs-6" style="width:24px;height: 24px;"><i class="fa-duotone fa-solid fa-shop "  style=""></i></div>商店列表</a>
                                <div class="dropdown-divider"></div>
                                <a
                                    class="dropdown-item cursor_pointer"
                                    onclick="${gvc.event(() => {
                                        dialog.checkYesOrNot({
                                            callback: (bool) => {
                                                if (bool) {
                                                    GlobalUser.saas_token = '';
                                                    location.href = `${gvc.glitter.root_path}login`;
                                                }
                                            },
                                            text: '確定要登出嗎？',
                                        });
                                    })}"
                                    >登出</a
                                >
                            </div>`);
                    });
                },
                divCreate: {
                    class: `btn-group dropdown border-start ps-1`,
                },
            };
        });
    }
    public static openShopList(gvc:GVC){
        gvc.glitter.innerDialog((gvc: GVC) => {
            const vm: {
                type: 'list' | 'replace';
            } = {
                type: 'list',
            };
            return gvc.bindView(() => {
                const id = gvc.glitter.getUUID();
                return {
                    bind: id,
                    view: () => {
                        if (vm.type === 'list') {
                            return html` <div style="width: 600px; max-width: 95vw; overflow-y: auto;" class="bg-white shadow rounded-3">
                                                                <div class="w-100 d-flex align-items-center p-3 border-bottom">
                                                                    <div class="tx_700 me-3">所有商店</div>
                                                                    ${BgWidget.grayButton(
                                '新增商店',
                                gvc.event(() => {
                                    vm.type = 'replace';
                                    gvc.notifyDataChange(id);
                                }),
                                { icon: 'fa-regular fa-circle-plus' }
                            )}
                                                                    <div class="flex-fill"></div>
                                                                    <i
                                                                        class="fa-regular fa-circle-xmark fs-5"
                                                                        style="color:black; cursor:pointer;"
                                                                        onclick="${gvc.event(() => {
                                gvc.closeDialog();
                            })}"
                                                                    ></i>
                                                                </div>
                                                                ${gvc.bindView(() => {
                                const vm: {
                                    loading: boolean;
                                    data: any;
                                } = {
                                    loading: true,
                                    data: [],
                                };
                                const id = gvc.glitter.getUUID();

                                function refresh() {
                                    vm.loading = true;
                                    gvc.notifyDataChange(id);
                                    ApiPageConfig.getAppList().then((res) => {
                                        vm.loading = false;
                                        vm.data = res.response.result;
                                        gvc.notifyDataChange(id);
                                    });
                                }

                                refresh();
                                return {
                                    bind: id,
                                    view: () => {
                                        if (vm.loading) {
                                            return BgWidget.spinner({
                                                container: {
                                                    class: 'my-3',
                                                },
                                            });
                                        } else {
                                            return vm.data
                                                .map((dd: any) => {
                                                    dd.theme_config = dd.theme_config ?? {};
                                                    const storeList = [
                                                        BgWidget.validImageBox({
                                                            gvc,
                                                            image:
                                                                dd.theme_config.preview_image ||
                                                                (dd.config && dd.template_config && dd.template_config.image && dd.template_config.image[0]),
                                                            width: 120 / (document.body.clientWidth > 768 ? 1 : 1.5),
                                                            height: 90 / (document.body.clientWidth > 768 ? 1 : 1.5),
                                                            class: 'rounded-3 shadow',
                                                        }),
                                                        html` <div class="d-flex flex-column" style="margin-left: 15px; gap:1px;">
                                                                                                <div class="d-flex gap-2" style="text-wrap: wrap;">
                                                                                                    <span class="tx_700">${gvc.bindView(()=>{
                                                            return {
                                                                bind:gvc.glitter.getUUID(),
                                                                view:()=>{
                                                                    //dd.theme_config.name || dd.appName
                                                                    return new Promise<string>(async (resolve, reject)=>{
                                                                        try {
                                                                            resolve(((await ApiUser.getPublicConfig('store-information', 'manager',dd.appName)).response.value.shop_name || dd.theme_config.name || dd.appName) as string)
                                                                        }catch (e) {
                                                                            resolve((dd.theme_config.name || dd.appName) as string)
                                                                        }

                                                                    })
                                                                },divCreate:{}
                                                            }
                                                        })}</span>
                                                                                                </div>
                                                                                                <div class="my-1">
                                                                                                    ${dd.store_permission_title === 'owner' ? BgWidget.infoInsignia('商店擁有人') : ''}
                                                                                                </div>
                                                                                                ${(() => {
                                                            const config = dd;
                                                            let planText = '免費試用方案';
                                                            if (config.plan === 'basic') {
                                                                planText = '基本開店方案';
                                                            } else if (config.plan === 'web+app') {
                                                                planText = 'Web+App方案';
                                                            }
                                                            return html` <div class="d-flex flex-column tx_normal_14">
                                                                                                        當前方案 : ${planText}
                                                                                                        <div
                                                                                                            style="color: ${new Date(config.dead_line).getTime() < new Date().getTime()
                                                                ? '#da1313'
                                                                : '#4d86db'};"
                                                                                                        >
                                                                                                            ${new Date(config.dead_line).getTime() < new Date().getTime() ? '方案過期日' : '方案到期日'}
                                                                                                            ：${gvc.glitter.ut.dateFormat(new Date(config.dead_line), 'yyyy-MM-dd hh:mm')}
                                                                                                        </div>
                                                                                                    </div>`;
                                                        })()}
                                                                                                <div class="tx_normal_14">
                                                                                                    上次儲存時間：${gvc.glitter.ut.dateFormat(new Date(dd.update_time), 'yyyy-MM-dd hh:mm')}
                                                                                                </div>
                                                                                            </div>`,
                                                        dd.store_permission_title === 'owner'
                                                            ? html` <div class="p-0 me-1" style="width: 40px;">
                                                                                                      <button
                                                                                                          class="btn btn-size-sm btn-snow text-dark"
                                                                                                          type="button"
                                                                                                          data-bs-toggle="dropdown"
                                                                                                          aria-haspopup="true"
                                                                                                          aria-expanded="false"
                                                                                                      >
                                                                                                          <i class="fa-solid fa-ellipsis" aria-hidden="true"></i>
                                                                                                      </button>
                                                                                                      <div class="dropdown-menu">
                                                                                                          <a
                                                                                                              class="dropdown-item cursor_pointer"
                                                                                                              onclick="${gvc.event(() => {
                                                                gvc.glitter.setUrlParameter('appName', dd.appName);
                                                                SaasViewModel.renew(gvc);
                                                            })}"
                                                                                                              >續費</a
                                                                                                          >
                                                                                                          <div class="dropdown-divider"></div>
                                                                                                          <a
                                                                                                              class="dropdown-item cursor_pointer"
                                                                                                              onclick="${gvc.event(() => {
                                                                EditorElem.openEditorDialog(
                                                                    gvc,
                                                                    (gvc) => {
                                                                        const appName = dd.theme_config.name || dd.appName;
                                                                        let deleteText = '';
                                                                        return html` <div class="p-2">
                                                                                                                              ${[
                                                                            html` <div
                                                                                                                                      class="alert alert-danger p-2 fs-base"
                                                                                                                                      style="white-space: normal;"
                                                                                                                                  >
                                                                                                                                      請確認是否刪除此商店，刪除之後將無法復原，請謹慎進行操作
                                                                                                                                  </div>`,
                                                                            EditorElem.editeInput({
                                                                                gvc: gvc,
                                                                                title: '刪除確認',
                                                                                placeHolder: `請輸入「${appName}」`,
                                                                                default: deleteText,
                                                                                callback: (text) => {
                                                                                    deleteText = text;
                                                                                },
                                                                            }),
                                                                            BgWidget.horizontalLine(),
                                                                            html` <div class="d-flex align-items-center justify-content-end mb-1">
                                                                                                                                      ${BgWidget.redButton(
                                                                                '確認刪除',
                                                                                gvc.event(() => {
                                                                                    const dialog = new ShareDialog(gvc.glitter);
                                                                                    if (deleteText === appName) {
                                                                                        dialog.dataLoading({ visible: true });
                                                                                        ApiPageConfig.deleteApp(dd.appName).then((res) => {
                                                                                            dialog.dataLoading({ visible: false });
                                                                                            if (dd.appName === (window as any).appName) {
                                                                                                const url = new URL(location.href);
                                                                                                location.href = url.href.replace(
                                                                                                    url.search,
                                                                                                    ''
                                                                                                );
                                                                                            } else {
                                                                                                gvc.closeDialog();
                                                                                                refresh();
                                                                                            }
                                                                                        });
                                                                                    } else {
                                                                                        dialog.errorMessage({ text: '輸入錯誤' });
                                                                                    }
                                                                                })
                                                                            )}
                                                                                                                                  </div>`,
                                                                        ].join('')}
                                                                                                                          </div>`;
                                                                    },
                                                                    () => {},
                                                                    400,
                                                                    '刪除商店'
                                                                );
                                                            })}"
                                                                                                              >刪除商店</a
                                                                                                          >
                                                                                                      </div>
                                                                                                  </div>`
                                                            : '',
                                                        html` <div>
                                                                                                ${BgWidget.customButton({
                                                            button: {
                                                                color: 'black',
                                                                size: 'sm',
                                                            },
                                                            text: {
                                                                name: '更換商店',
                                                            },
                                                            event: gvc.event(() => {
                                                                const url = new URL(gvc.glitter.root_path);
                                                                url.searchParams.set('type', 'editor');
                                                                url.searchParams.set('function', 'backend-manger');
                                                                url.searchParams.set('appName', dd.appName);
                                                                location.href = url.href;
                                                            }),
                                                        })}
                                                                                            </div>`,
                                                    ];

                                                    if (document.body.clientWidth > 768) {
                                                        return html` <div class="p-4" style="display: flex; align-items: center;">
                                                                                                ${storeList[0]}${storeList[1]}
                                                                                                <div class="flex-fill"></div>
                                                                                                ${storeList[2]}${storeList[3]}
                                                                                            </div>`;
                                                    }
                                                    return html` <div
                                                                                            class="p-4"
                                                                                            style="display: flex; align-items: center; justify-content: flex-start; gap: 16px;"
                                                                                        >
                                                                                            ${storeList[0]}
                                                                                            <div style="width: 100%;">
                                                                                                ${storeList[1]}
                                                                                                <div style="display: flex; justify-content: flex-end; margin-top: 12px;">
                                                                                                    ${storeList[2]}${storeList[3]}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>`;
                                                })
                                                .join(html` <div class="w-100 border-bottom"></div>`);
                                        }
                                    },
                                    divCreate: {
                                        style: `max-height: 600px; overflow-y: auto;`,
                                    },
                                };
                            })}
                                                            </div>`;
                        } else {
                            return SaasViewModel.createShop(gvc, false);
                        }
                    },
                };
            });
        }, 'change_app');
    }

    public static createShop(gvc: GVC, register?: boolean) {
        const postMD: {
            appName: string;
            name: string;
            sub_domain: string;
            refer_app: string;
        } = {
            name: '',
            appName: 't_' + new Date().getTime(),
            sub_domain: '',
            refer_app: '',
        };
        gvc.addStyle(`
            .hoverHidden div {
                display: none;
            }
            .hoverHidden:hover div {
                display: flex;
            }
        `);
        gvc.glitter.addStyleLink(gvc.glitter.root_path + `/css/editor.css`);
        const hr = html` <div style="width: 600px;max-width: calc(100vw - 20px); overflow-y: auto;max-height: 100vh;" class="bg-white shadow rounded-3">
            <div class="w-100 d-flex align-items-center p-3 border-bottom">
                <div class="fw-500 color39">建立您的商店</div>
                <div class="flex-fill"></div>
                <i
                    class="fa-regular fa-circle-xmark fs-5 color39 ${register ? `d-none` : ``}"
                    style="cursor:pointer;"
                    onclick="${gvc.event(() => {
                        gvc.closeDialog();
                    })}"
                ></i>
            </div>
            ${gvc.bindView(() => {
                const id = gvc.glitter.getUUID();
                return {
                    bind: id,
                    view: () => {
                        return html` <div class="px-3 py-2">
                            ${[
                                EditorElem.editeInput({
                                    gvc: gvc,
                                    title: '商店名稱',
                                    style: 'color:#393939',
                                    placeHolder: `請輸入商店名稱`,
                                    default: postMD.name,
                                    callback: (text) => {
                                        postMD.name = text;
                                    },
                                }),
                                gvc.bindView(() => {
                                    const id = gvc.glitter.getUUID();
                                    return {
                                        bind: id,
                                        view: () => {
                                            return EditorElem.editeInput({
                                                gvc: gvc,
                                                title: html`
                                                    <div class="my-2">
                                                        <div class="mb-1">免費商店網址</div>
                                                        ${BgWidget.greenNote(`https://${postMD.sub_domain || '請輸入網址'}.shopnex.cc`, '', 'margin-top: 0.5rem')}
                                                    </div>
                                                `,
                                                pattern: `A-Za-z0-9-`,
                                                placeHolder: `請輸入商店網址`,
                                                default: postMD.sub_domain,
                                                callback: (text) => {
                                                    postMD.sub_domain = text;
                                                    gvc.notifyDataChange(id);
                                                },
                                            });
                                        },
                                    };
                                }),
                                EditorElem.h3('選擇初始模板'),
                                SaasViewModel.initialTemplate(gvc, (appName) => {
                                    postMD.refer_app = appName;
                                }),
                            ].join('<div class="my-2"></div>')}
                        </div>`;
                    },
                    divCreate: {
                        style: `max-height:calc(100vh - 200px);overflow-y:auto;`,
                        class: ``,
                    },
                };
            })}
            <div class="w-100 d-flex align-items-center justify-content-end shadow p-3">
                ${BgWidget.save(
                    gvc.event(() => {
                        const dialog = new ShareDialog(gvc.glitter);
                        if (!postMD.sub_domain) {
                            dialog.errorMessage({
                                text: '請填寫預設網域',
                            });
                        } else if (!postMD.name) {
                            dialog.errorMessage({
                                text: '請填寫商店名稱',
                            });
                        } else if (!postMD.refer_app) {
                            dialog.errorMessage({
                                text: '請選擇預設模板',
                            });
                        } else {
                            SaasViewModel.createApp(gvc, postMD.appName, postMD.name, postMD.refer_app, postMD.sub_domain, register!);
                        }
                    }),
                    '確認建立'
                )}
            </div>
        </div>`;
        if (register) {
            return html` <div
                class="position-fixed vw-100 vh-100 d-flex align-items-center justify-content-center bg-white"
                style="left: 0px;top:0px;
                    background-image: url('https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1711305933115-第一個背景橘色.png');
                    background-size: cover;
                    "
            >
                ${hr}
            </div>`;
        } else {
            return hr;
        }
    }

    public static initialTemplate(gvc: GVC, callback: (appName: string) => void) {
        let vm = {
            search: '',
            select: '',
        };
        const containerID = gvc.glitter.getUUID();
        return gvc.bindView(() => {
            return {
                bind: containerID,
                view: () => {
                    return gvc.bindView(() => {
                        let data: any = undefined;
                        const id = gvc.glitter.getUUID();
                        ApiPageConfig.getTemplateList().then((res) => {
                            data = res;
                            data.response.result.reverse();
                            gvc.notifyDataChange(id);
                        });

                        return {
                            bind: id,
                            view: () => {
                                if (data) {
                                    return (() => {
                                        if (data.response.result.length === 0) {
                                            if (!vm.search) {
                                                return html`
                                                    <div class="d-flex align-items-center justify-content-center flex-column w-100 py-4" style="width:700px;gap:10px;">
                                                        <img src="./img/box-open-solid.svg" />
                                                        <span class="color39 text-center">尚未自製任何模塊<br />請前往開發者模式自製專屬模塊</span>
                                                    </div>
                                                `;
                                            } else {
                                                return html`
                                                    <div class="d-flex align-items-center justify-content-center flex-column w-100 py-4" style="width:700px;gap:10px;">
                                                        <img src="./img/box-open-solid.svg" />
                                                        <span class="color39 text-center">查無相關模塊</span>
                                                    </div>
                                                `;
                                            }
                                        } else {
                                            return html`
                                                <div class="w-100" style=" overflow-y: auto;">
                                                    <div class="row m-0 pt-2  mx-n2">
                                                        ${data.response.result
                                                            .map((dd: any, index: number) => {
                                                                return html`
                                                                    <div class="col-6 col-sm-4 mb-3 rounded-3">
                                                                        <div
                                                                            class="d-flex flex-column justify-content-center w-100 "
                                                                            style="gap:5px;cursor:pointer;${vm.select === dd.appName
                                                                                ? `overflow:hidden;background: #FFB400;border: 1px solid #FF6C02;padding:10px;border-radius: 5px;`
                                                                                : ``}"
                                                                        >
                                                                            <div class="card w-100 position-relative rounded hoverHidden bgf6 rounded-3" style="padding-bottom: 133%;">
                                                                                <div
                                                                                    class="position-absolute w-100 h-100 d-flex align-items-center justify-content-center rounded-3"
                                                                                    style="overflow: hidden;"
                                                                                >
                                                                                    <img
                                                                                        class="w-100 "
                                                                                        src="${dd.template_config.image[0] ??
                                                                                        'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713445383494-未命名(1080x1080像素).jpg'}"
                                                                                    />
                                                                                </div>

                                                                                <div
                                                                                    class="position-absolute w-100 h-100  align-items-center justify-content-center rounded fs-6 flex-column"
                                                                                    style="background: rgba(0,0,0,0.5);gap:5px;"
                                                                                >
                                                                                    <button
                                                                                        class="btn btn-secondary d-flex align-items-center "
                                                                                        style="height: 28px;width: 75px;gap:5px;"
                                                                                        onclick="${gvc.event(() => {
                                                                                            vm.select = dd.appName;
                                                                                            callback(dd.appName);
                                                                                            gvc.notifyDataChange(id);
                                                                                        })}"
                                                                                    >
                                                                                        選擇
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                            <h3 class="fs-6 mb-0 d-flex justify-content-between align-items-center">
                                                                                ${dd.template_config.name}
                                                                                <i
                                                                                    class="fa-solid fa-eye"
                                                                                    style="cursor:pointer;"
                                                                                    onclick="${gvc.event(() => {
                                                                                        gvc.glitter.openNewTab(`https://${dd.domain}/index`);
                                                                                    })}"
                                                                                ></i>
                                                                            </h3>
                                                                        </div>
                                                                    </div>
                                                                `;
                                                            })
                                                            .join('')}
                                                    </div>
                                                </div>
                                            `;
                                        }
                                    })();
                                } else {
                                    return html` <div class="w-100 p-3 d-flex align-items-center justify-content-center flex-column" style="gap: 10px;">
                                        <div class="spinner-border fs-5"></div>
                                        <div class="fs-6 fw-500">載入中...</div>
                                    </div>`;
                                }
                            },
                            divCreate: {
                                style: '',
                            },
                        };
                    });
                },
            };
        });
    }

    public static renew(gvc: GVC) {
        gvc.closeDialog();
        (window.parent as any).glitter.setUrlParameter('tab', 'member_plan');
        (window.parent as any).glitter.pageConfig[0].gvc!.recreateView();
    }

    public static createApp(gvc: GVC, app_name: string, pick_name: string, refer_app: string, sub_domain: string, register: boolean) {
        return new Promise(async (resolve, reject) => {
            const pass = /^[a-zA-Z0-9_-]+$/.test(app_name);
            if (!pass) {
                resolve(false);
                return;
            }
            const createAPP = refer_app;
            const appName = app_name;
            const glitter = (window as any).glitter;
            const shareDialog = new ShareDialog(glitter);
            const html = String.raw;
            if (gvc.glitter.getCookieByName('glitterToken') === undefined) {
                shareDialog.errorMessage({ text: '請先登入' });
                return;
            } else {
                if (!appName) {
                    shareDialog.errorMessage({ text: '請輸入APP名稱' });
                    return;
                }
                const saasConfig: {
                    config: any;
                    api: any;
                } = (window as any).saasConfig;
                shareDialog.dataLoading({
                    visible: true,
                    text: '商店準備中...',
                });
                BaseApi.create({
                    url: saasConfig.config.url + `/api/v1/app`,
                    type: 'POST',
                    timeout: 0,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: register ? GlobalUser.token : GlobalUser.saas_token,
                    },
                    data: JSON.stringify({
                        domain: '',
                        appName: encodeURIComponent(appName),
                        copyApp: createAPP,
                        sub_domain: sub_domain,
                        brand: register ? (window as any).appName : (window as any).glitterBase,
                        name: pick_name,
                        copyWith: ['checkout', 'user', 'public_config'],
                    }),
                }).then((d2) => {
                    shareDialog.dataLoading({ visible: false });
                    if (d2.result) {
                        const url = new URL(location.href);
                        url.searchParams.set('type', 'editor');
                        url.searchParams.set('page', '');
                        url.searchParams.set('function', 'backend-manger');
                        url.searchParams.set('appName', appName as string);
                        location.href = url.href;
                        resolve(true);
                    } else {
                        if (d2.response.code === 'HAVE_APP') {
                            shareDialog.errorMessage({ text: '建立失敗，此英文名稱已被使用!' });
                        } else if (d2.response.code === 'HAVE_DOMAIN') {
                            shareDialog.errorMessage({ text: '建立失敗，此網域名稱已被使用!' });
                        } else {
                            shareDialog.errorMessage({ text: '建立失敗，此英文名稱已被使用!' });
                        }
                        resolve(false);
                    }
                });
            }
        });
    }
}

const interval = setInterval(() => {
    if ((window as any).glitter) {
        clearInterval(interval);
        (window as any).glitter.setModule(import.meta.url, SaasViewModel);
    }
}, 100);
