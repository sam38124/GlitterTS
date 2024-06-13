import {ApiUser} from "../glitter-base/route/user.js";
import {GlobalUser} from "../glitter-base/global/global-user.js";
import {GVC} from "../glitterBundle/GVController.js";
import {EditorConfig} from "../editor-config.js";
import {ApiPageConfig} from "../api/pageConfig.js";
import {EditorElem} from "../glitterBundle/plugins/editor-elem.js";
import {ShareDialog} from "../dialog/ShareDialog.js";
import {BaseApi} from "../glitterBundle/api/base.js";

const html = String.raw

export class SaasViewModel {
    public static app_manager(gvc: GVC) {
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID()

            return {
                bind: id,
                view: () => {
                    return new Promise(async (resolve, reject) => {
                        const userData = (await ApiUser.getSaasUserData(GlobalUser.saas_token, 'me')).response;
                        resolve(html`
                            <div class="p-2 " style=""
                                 data-bs-toggle="dropdown" aria-haspopup="false"
                                 aria-expanded="false">
                                <div class="d-flex align-items-center " style="">
                                    <img src="https://assets.imgix.net/~text?bg=7ED379&txtclr=ffffff&w=100&h=100&txtsize=40&txt=${userData.userData.name}&txtfont=Helvetica&txtalign=middle,center"
                                         class="rounded-circle" width="48" alt="Avatar"
                                         style="width:40px;height:40px;">
                                    <div class="d-none d-sm-block ps-2">
                                        <div class="fs-xs lh-1 opacity-60 fw-500">Hello,</div>
                                        <div class="fs-sm dropdown-toggle fw-500">${userData.userData.name}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="dropdown-menu " style="top:50px;right:0px;">
                                <a class="dropdown-item" onclick="${gvc.event(() => {
                                    gvc.glitter.innerDialog((gvc: GVC) => {
                                        const vm: {
                                            type: 'list' | 'replace'
                                        } = {
                                            type: 'list'
                                        }
                                        return gvc.bindView(() => {
                                            const id = gvc.glitter.getUUID();
                                            return {
                                                bind: id,
                                                view: () => {
                                                    if (vm.type === 'list') {
                                                        return html`
                                                            <div style="width:600px;overflow-y: auto;"
                                                                 class="bg-white shadow rounded-3">
                                                                <div class="w-100 d-flex align-items-center p-3 border-bottom">
                                                                    <div class="fw-500 "
                                                                         style="color:black;">
                                                                        所有商店
                                                                    </div>
                                                                    <div class="btn  btn-sm ms-3 "
                                                                         style="background:${EditorConfig.editor_layout.btn_background};font-size:14px;"
                                                                         onclick="${gvc.event(() => {
                                                                             vm.type = 'replace'
                                                                             gvc.notifyDataChange(id)
                                                                         })}"
                                                                    >
                                                                        <i class="fa-regular fa-circle-plus me-2 fs-6"></i>
                                                                        新增商店
                                                                    </div>
                                                                    <div class="flex-fill"></div>

                                                                    <i class="fa-regular fa-circle-xmark fs-5"
                                                                       style="color:black;cursor:pointer;"
                                                                       onclick="${
                                                                               gvc.event(() => {
                                                                                   gvc.closeDialog()
                                                                               })
                                                                       }"></i>
                                                                </div>
                                                                ${gvc.bindView(() => {
                                                                    const vm: {
                                                                        loading: boolean,
                                                                        data: any
                                                                    } = {
                                                                        loading: true,
                                                                        data: []
                                                                    }
                                                                    const id = gvc.glitter.getUUID()

                                                                    function refresh() {
                                                                        vm.loading = true
                                                                        gvc.notifyDataChange(id)
                                                                        ApiPageConfig.getAppList().then((res) => {
                                                                            vm.loading = false
                                                                            vm.data = res.response.result;
                                                                            gvc.notifyDataChange(id)
                                                                        })
                                                                    }

                                                                    refresh()
                                                                    return {
                                                                        bind: id,
                                                                        view: () => {
                                                                            if (vm.loading) {
                                                                                return `<div class="p-4  d-flex align-items-center justify-content-center">
<div class="spinner-border"></div>
</div>`
                                                                            } else {
                                                                                return `
                                                                                   ` + vm.data.map((dd: any) => {
                                                                                    dd.theme_config = dd.theme_config ?? {}
                                                                                    return html`
                                                                                        <div class=" p-4 "
                                                                                             style=" display: flex;    align-items: center; "
                                                                                        >
                                                                                            <div class=" rounded-3 shadow"
                                                                                                 style=" width: 110px;    height: 94px;background-position: center;background-repeat: no-repeat;background-size: cover;     background-image: url('${dd.theme_config.preview_image || (dd.config &&
                                                                                                         dd.template_config &&
                                                                                                         dd.template_config.image &&
                                                                                                         dd.template_config.image[0]) || 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713445383494-未命名(1080x1080像素).jpg'}'); "
                                                                                            ></div>
                                                                                            <div class="d-flex flex-column"
                                                                                                 style="     margin-left: 15px; gap:1px;"
                                                                                            >
                                                                                                <div class=" fw-500 fs-5 cl_39"
                                                                                                     style="  ">
                                                                                                    ${dd.theme_config.name || dd.appName}
                                                                                                </div>
                                                                                                ${(() => {
                                                                                                    const config = dd;
                                                                                                    let planText = '免費試用方案'
                                                                                                    if (config.plan === 'basic') {
                                                                                                        planText = '基本開店方案'
                                                                                                    } else if (config.plan === 'web+app') {
                                                                                                        planText = 'Web+App方案'
                                                                                                    }
                                                                                                    return `<div class="d-flex flex-column fw-500 cl_39" style="font-size:14px;">當前方案 : ${planText}
<div class="  "
                                                                                             style="font-size:13px;color:${(new Date(config.dead_line).getTime() < new Date().getTime()) ? `#EF4444` : `#295ed1`};">

                                                                                            ${(new Date(config.dead_line).getTime() < new Date().getTime()) ? ` 方案已過期` : ` 方案到期日`}
                                                                                                ：${gvc.glitter.ut.dateFormat(new Date(config.dead_line), 'yyyy-MM-dd hh:mm')}
                                                                                        </div></div>`
                                                                                                })()}
                                                                                                <div class="fw-500 cl_39"
                                                                                                     style="font-size:13px; ">
                                                                                                        上次儲存時間：${gvc.glitter.ut.dateFormat(new Date(dd.update_time), 'MM-dd hh:mm')}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div class=" flex-fill"
                                                                                                 style=" "
                                                                                            ></div>
                                                                                            <div class="d-none btn btn-sm bgf6 text-black"
                                                                                                 style=" color: black;width: 40px; "
                                                                                            >
                                                                                                <i class="fa-regular fa-trash"></i>
                                                                                            </div>
                                                                                            <div class=" p-0"
                                                                                                 style=" width: 40px; "
                                                                                            >
                                                                                                <button class="btn btn-sm bgf6 text-black w-100"
                                                                                                        style=" color: black; "
                                                                                                        type="button"
                                                                                                        data-bs-toggle="dropdown"
                                                                                                        aria-haspopup="true"
                                                                                                        aria-expanded="false">
                                                                                                    <i class="fa-solid fa-ellipsis"
                                                                                                       aria-hidden="true"></i>
                                                                                                </button>
                                                                                                <div class="dropdown-menu"
                                                                                                     style=""
                                                                                                >
                                                                                                    <a class="dropdown-item"
                                                                                                       onclick="${gvc.event(() => {
                                                                                                           SaasViewModel.renew(gvc)
                                                                                                       })}">續費</a>
                                                                                                    <div class="dropdown-divider"></div>
                                                                                                    <a class=" dropdown-item"
                                                                                                       style=" "
                                                                                                       onclick="${gvc.event(() => {
                                                                                                           EditorElem.openEditorDialog(gvc, (gvc) => {
                                                                                                               const appName = dd.theme_config.name || dd.appName
                                                                                                               let deleteText = ''
                                                                                                               return `<div class="p-2">${[
                                                                                                                   html`
                                                                                                                       <div class="alert alert-danger p-2 fs-base"
                                                                                                                            style="white-space: normal;">
                                                                                                                           是否確認刪除此商店，刪除之後則無法復原，請謹慎進行操作!
                                                                                                                       </div>`,
                                                                                                                   EditorElem.editeInput({
                                                                                                                       gvc: gvc,
                                                                                                                       title: '刪除確認',
                                                                                                                       placeHolder: `請輸入 -> ${appName}`,
                                                                                                                       default: deleteText,
                                                                                                                       callback: (text) => {
                                                                                                                           deleteText = text
                                                                                                                       }
                                                                                                                   }),
                                                                                                                   `<div class="d-flex align-items-center justify-content-end pt-2 border-top mt-2">
<button class="btn btn-danger btn-sm" onclick="${gvc.event(() => {
                                                                                                                       if (deleteText === appName) {
                                                                                                                           const dialog = new ShareDialog(gvc.glitter);
                                                                                                                           dialog.dataLoading({visible: true})
                                                                                                                           ApiPageConfig.deleteApp(dd.appName).then((res) => {
                                                                                                                               dialog.dataLoading({visible: false})
                                                                                                                               if (dd.appName === ((window as any).appName)) {
                                                                                                                                   const url = new URL(location.href)
                                                                                                                                   location.href = url.href.replace(url.search, '')
                                                                                                                               } else {
                                                                                                                                   gvc.closeDialog()
                                                                                                                                   refresh()
                                                                                                                               }
                                                                                                                           })
                                                                                                                       } else {
                                                                                                                           alert('輸入錯誤')
                                                                                                                       }
                                                                                                                   })}">確認刪除</button>
</div>`
                                                                                                               ].join('')}</div>`
                                                                                                           }, () => {

                                                                                                           }, 400, '刪除商店')
                                                                                                       })}"
                                                                                                    >刪除商店</a>
                                                                                                </div>
                                                                                            </div>

                                                                                            <div class=" btn btn-primary-c btn-sm"
                                                                                                 style="margin-left: 10px;color: white;height: 28px; "
                                                                                                 onclick="${gvc.event(() => {
                                                                                                     const url = new URL(gvc.glitter.root_path);
                                                                                                     url.searchParams.set('type','editor')
                                                                                                     url.searchParams.set('function','backend-manger')
                                                                                                     url.searchParams.set('appName', dd.appName)
                                                                                                     location.href=url.href
                                                                                                 })}"
                                                                                            >
                                                                                                更換商店
                                                                                            </div>
                                                                                        </div>`
                                                                                }).join('<div class="w-100 border-bottom"></div>')
                                                                            }
                                                                        },
                                                                        divCreate: {
                                                                            style: `max-height:600px;overflow-y:auto;`
                                                                        }
                                                                    }
                                                                })}

                                                            </div>`
                                                    } else {
                                                        return SaasViewModel.createShop(gvc, false)
                                                    }

                                                }
                                            }
                                        })

                                    }, 'change_app');

                                })}">所有商店</a>
                                <div class="dropdown-divider"></div>
                                <a onclick="${gvc.event(() => {
                                    GlobalUser.saas_token = ''
                                    const url = new URL(location.href)
                                    location.href = url.href.replace(url.search, '')
                                })}" class="dropdown-item">登出</a>
                            </div>`)
                    })
                }, divCreate: {
                    class: `btn-group dropdown border-start ps-2`
                }
            }
        })
    }

    public static createShop(gvc: GVC, register?: boolean) {
        const hr = html`
            <div style="width:400px;overflow-y: auto;"
                 class="bg-white shadow rounded-3 ">
                <div class="w-100 d-flex align-items-center p-3 border-bottom">
                    <div class="fw-500  cl_39"
                         style="">
                        建立您的商店
                    </div>
                    <div class="flex-fill"></div>
                    <i class="fa-regular fa-circle-xmark fs-5 cl_39 ${(register) ? `d-none` : ``}"
                       style="cursor:pointer;"
                       onclick="${
                               gvc.event(() => {
                                   gvc.closeDialog()
                               })
                       }"></i>
                </div>
                ${gvc.bindView(() => {
                    const id = gvc.glitter.getUUID()
                    const postMD: {
                        appName: string,
                        name: string,
                        sub_domain: string
                    } = {
                        name: '',
                        appName: 't_' + new Date().getTime(),
                        sub_domain: ''
                    }
                    return {
                        bind: id,
                        view: () => {
                            return html`
                                <div class="px-3 py-2">
                                    ${[
                                        EditorElem.editeInput({
                                            gvc: gvc,
                                            title: '商店名稱',
                                            style: 'color:#393939',
                                            placeHolder: `請輸入商店名稱`,
                                            default: postMD.name,
                                            callback: (text) => {
                                                postMD.name = text
                                            }
                                        }),
                                        EditorElem.editeInput({
                                            gvc: gvc,
                                            title: html`
                                                <div>免費商店網址</div>
                                                <div class="mt-2" style="color:#006621;font-size: 13px;">
                                                        https://${postMD.sub_domain || '請輸入網址'}.shopnex.cc
                                                </div>
                                            `,
                                            pattern: `A-Za-z0-9-`,
                                            placeHolder: `請輸入商店網址`,
                                            default: postMD.sub_domain,
                                            callback: (text) => {

                                                postMD.sub_domain = text
                                                gvc.notifyDataChange(id)
                                            }
                                        })
                                    ].join('<div class="my-2"></div>')}
                                    <div class="w-100 btn my-3"
                                         style="background:${EditorConfig.editor_layout.btn_background};color:white;"
                                         onclick="${gvc.event(() => {
                                             if (!postMD.sub_domain || !postMD.appName || !postMD.name) {
                                                 const dialog = new ShareDialog(gvc.glitter)
                                                 dialog.errorMessage({
                                                     text: '請確實填寫所有資料!'
                                                 })
                                                 return
                                             }
                                             SaasViewModel.createApp(gvc, postMD.appName, postMD.name, 'shop-template-clothing-v3', postMD.sub_domain, register!)
                                         })}">
                                        確認建立
                                    </div>
                                </div>`
                        },
                        divCreate: {
                            style: `max-height:600px;overflow-y:auto;`,
                            class: ``
                        }
                    }
                })}

            </div>`
        if (register) {
            return `<div class="position-fixed vw-100 vh-100 d-flex align-items-center justify-content-center bg-white" style="left: 0px;top:0px;
background-image: url('https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1711305933115-第一個背景橘色.png');
background-size: cover;
">
${hr}
</div>`
        } else {
            return hr
        }
    }

    public static renew(gvc: GVC) {
        EditorElem.openEditorDialog(gvc, (gvc) => {
            return html`
                <div class="w-100">
                    <div class="d-flex align-items-center p-4 justify-content-between"
                         style="gap:20px;">

                        ${[{
                            title: '基本電商方案',
                            money: 999,
                            array: [['頁面編輯系統', '多規格多價格'], ['綠界 / 藍新金流', '配送方式'], ['SEO設定', '商品庫存管理'], ['無限制商品數量', '優惠券系統']],
                            sku: 'basic-year'
                        }, {
                            title: '電商+APP方案',
                            money: 4999,
                            array: [['IOS應用程式', 'Android應用程式'], ['手機訊息推播', '商城上架協助'], ['專人開店顧問', '基本方案所有功能']],
                            sku: 'app-year'
                        }].map((dd) => {
                            return html`
                                <div class="position-relative rounded-3   "
                                     style="width: calc(50% - 10px); height: 470px;">
                                    <div class="w-100 h-100"
                                         style="display: flex;position: relative;flex-direction: column;align-items: center;gap: 42px;border-radius: 30px;background: #FFF;background: #FFF;box-shadow: 5px 5px 20px 0px rgba(0, 0, 0, 0.15);     padding: 44px 52px;    width: 500px; "
                                    >
                                        <div class=""
                                             style="        display: flex;flex-direction: column;align-items: center;align-self: stretch;     gap: 32px; "
                                        >
                                            <div class=""
                                                 style=" "
                                            >
                                                <div class="cl_39"
                                                     style="     text-align: center;font-family: &quot;Noto Sans&quot;;font-size: 24px;font-style: normal;font-weight: 700;line-height: normal;margin-bottom: 16px; "
                                                >
                                                    ${dd.title}
                                                </div>
                                                <div class="cl_39"
                                                     style="  text-align: center;font-family: &quot;Noto Sans&quot;;font-size: 27.915px;font-style: normal;font-weight: 400;line-height: 140%; "
                                                >
                                                    NT$.<span
                                                        style="background: linear-gradient(143deg, #FFB400 -22.7%, #FF6C02 114.57%);
background-clip: text;
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
font-size: 50px;
font-style: normal;
font-weight: 700;
line-height: 140%;">${dd.money}</span> / 月 <span style="font-size: 12px;">(限年繳)</span>
                                                </div>
                                            </div>
                                            <div class=" flex-column flex-lg-row flex-wrap"
                                                 style="            display: flex;justify-content: space-between;align-items: center;align-self: stretch;     gap: 14px; "
                                            >
                                                ${dd.array.map((dd) => {
                                                    return ` <div class=" w-100"
                                                                                                                                        style="                display: flex;align-items: flex-start;     gap: 14px;     "
                                                                                                                                   >
                                                                                                                                   ${dd.map((d1) => {
                                                        return ` <div class=" flex-row w-50"
                                                                                                                                            style="            display: flex;align-items: center;gap: 8px; " >
                                                                                                                                           <img class=""
                                                                                                                                                style="width: 20px;height: 20px; "

                                                                                                                                                src="https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1715139786902-Vector (11).svg">
                                                                                                                                           <div class="cl_39"
                                                                                                                                                style="    font-family: &quot;Noto Sans&quot;;font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%; "
                                                                                                                                           >
                                                                                                                                               ${d1}
                                                                                                                                           </div>
                                                                                                                                       </div>`
                                                    }).join('')}
                                                                                                                                   </div>`
                                                }).join('')}
                                            </div>

                                        </div>
                                        <svg class="d-none"
                                             style="     position: absolute;    top: -5px;    right: 35px; "
                                             xmlns="http://www.w3.org/2000/svg"
                                             width="61"
                                             height="137"
                                             viewBox="0 0 61 137"
                                             fill="none">
                                            <path class=""
                                                  style=" "
                                                  d="M0 4.80564C0 2.59382 1.49324 0.810576 3.69857 0.641117C7.5866 0.342357 15.3477 -8.90411e-09 30.5 0C45.6523 8.90411e-09 53.4134 0.342357 57.3014 0.641117C59.5068 0.810576 61 2.5938 61 4.80563V131.163C61 134.817 57.207 137.237 53.8928 135.697L31.7643 125.413C30.9626 125.041 30.0374 125.041 29.2357 125.413L7.10721 135.697C3.79297 137.237 0 134.817 0 131.163V4.80564Z"
                                                  fill="#E80000"></path>
                                        </svg>
                                        <span
                                                class="d-none"
                                                style="     position: absolute;    top: 12.5px;    right: 55px;    width: 21px;    height: 97.474px;    color: #FFF;    text-align: center;    font-family: &quot;Noto Sans&quot;;    font-size: 18px;    font-weight: 700;    line-height: 130%;
white-space: normal;"
                                        >免費30天</span>
                                    </div>
                                    <div class="position-absolute  w-100 d-flex align-items-center justify-content-center"
                                         style="bottom: 40px;">
                                        <div class=""
                                             style="     background: linear-gradient(143deg, #FFB400 -22.7%, #FF6C02 114.57%);color: #FFF;display: flex;flex-direction: column;justify-content: center;align-items: center;gap: 10px;cursor:pointer;box-shadow: 5px 5px 10px 0px rgba(0, 0, 0, 0.20);border-radius: 100px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 1.6px;text-align: center;     padding: 11px 40px;font-size: 16px; "
                                             onclick="${gvc.event(async () => {
                                                 const key = dd.sku;
                                                 const saasConfig: { config: any; api: any } = (window.parent as any).saasConfig;
                                                 const product: any = (await BaseApi.create({
                                                     url:
                                                             saasConfig.config.url +
                                                             `/api-public/v1/ec/product?${(() => {
                                                                 let par = [`sku=${key}`];
                                                                 return par.join('&');
                                                             })()}`,
                                                     type: 'GET',
                                                     headers: {
                                                         'Content-Type': 'application/json',
                                                         'g-app': encodeURIComponent((window.parent as any).glitterBase),
                                                     },
                                                 })).response.data[0]

                                                 BaseApi.create({
                                                     url: saasConfig.config.url + `/api-public/v1/ec/checkout`,
                                                     type: 'POST',
                                                     headers: {
                                                         'Content-Type': 'application/json',
                                                         'g-app': (window.parent as any).glitterBase,
                                                         Authorization: GlobalUser.saas_token,
                                                     },
                                                     data: JSON.stringify({
                                                         "line_items": [
                                                             {
                                                                 "id": (product).id,
                                                                 "spec": product.content.variants.find((dd: any) => {
                                                                     return dd.sku === key
                                                                 }).spec,
                                                                 "count": 1
                                                             }
                                                         ],
                                                         user_info: {
                                                             appName: (window.parent as any).appName
                                                         },
                                                         "return_url": location.href
                                                     }),
                                                 }).then((res) => {
                                                     $('body').html(res.response.form);
                                                     (document.querySelector('#submit') as any).click();
                                                 });
                                             })}">
                                            立即續費
                                        </div>
                                    </div>
                                </div>`
                        }).join('')}
                    </div>
                </div>`
        }, () => {
        }, 950, '方案續費')
    }

    public static createApp(gvc: GVC, app_name: string, pick_name: string, refer_app: string, sub_domain: string, register: boolean) {
        return new Promise(async (resolve, reject) => {
            const pass = /^[a-zA-Z0-9_-]+$/.test(app_name)
            if (!pass) {
                resolve(false)
                return
            }
            const createAPP = refer_app
            const appName = app_name
            const glitter = (window as any).glitter
            const shareDialog = new ShareDialog(glitter)
            const html = String.raw
            if (gvc.glitter.getCookieByName('glitterToken') === undefined) {
                shareDialog.errorMessage({text: "請先登入"})
                return
            } else {
                if (!appName) {
                    shareDialog.errorMessage({text: "請輸入APP名稱"})
                    return;
                }
                const saasConfig: {
                    config: any;
                    api: any;
                } = (window as any).saasConfig;
                shareDialog.dataLoading({
                    visible: true,
                    text: '商店準備中...'
                })
                BaseApi.create({
                    "url": saasConfig.config.url + `/api/v1/app`,
                    "type": "POST",
                    "timeout": 0,
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": (register) ? GlobalUser.token : GlobalUser.saas_token
                    },
                    "data": JSON.stringify({
                        "domain": '',
                        "appName": encodeURIComponent(appName),
                        "copyApp": createAPP,
                        "sub_domain": sub_domain,
                        "brand": (register) ? (window as any).appName : (window as any).glitterBase,
                        "name": pick_name,
                        "copyWith": ["checkout", "manager_post", "user_post", "user", "public_config"]
                    })
                }).then((d2) => {
                    shareDialog.dataLoading({visible: false})
                    if (d2.result) {
                        const url = new URL(location.href)
                        url.searchParams.set("type", "editor")
                        url.searchParams.set("page", "")
                        url.searchParams.set('function', 'backend-manger')
                        url.searchParams.set("appName", appName as string)
                        location.href = url.href
                        resolve(true)
                    } else {
                        if (d2.response.code === 'HAVE_APP') {
                            shareDialog.errorMessage({text: "創建失敗，此英文名稱已被使用!"})
                        } else if (d2.response.code === 'HAVE_DOMAIN') {
                            shareDialog.errorMessage({text: "創建失敗，此網域名稱已被使用!"})
                        } else {
                            shareDialog.errorMessage({text: "創建失敗，此英文名稱已被使用!"})
                        }
                        resolve(false)
                    }
                })
            }

        })
    }
}


const interval = setInterval(() => {
    if ((window as any).glitter) {
        clearInterval(interval);
        (window as any).glitter.setModule(import.meta.url, SaasViewModel)
    }
}, 100);

