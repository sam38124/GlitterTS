var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ApiUser } from "../glitter-base/route/user.js";
import { GlobalUser } from "../glitter-base/global/global-user.js";
import { EditorConfig } from "../editor-config.js";
import { ApiPageConfig } from "../api/pageConfig.js";
import { EditorElem } from "../glitterBundle/plugins/editor-elem.js";
import { ShareDialog } from "../dialog/ShareDialog.js";
import { BaseApi } from "../glitterBundle/api/base.js";
const html = String.raw;
export class SaasViewModel {
    static app_manager(gvc) {
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        const userData = (yield ApiUser.getSaasUserData(GlobalUser.saas_token, 'me')).response;
                        resolve(` <div  class="p-2 "  style=""
                                                         data-bs-toggle="dropdown" aria-haspopup="false"
                                                         aria-expanded="false">
                                                       <div class="d-flex align-items-center " style=""> 
  <img src="https://assets.imgix.net/~text?bg=7ED379&txtclr=ffffff&w=100&h=100&txtsize=40&txt=${userData.userData.name}&txtfont=Helvetica&txtalign=middle,center" class="rounded-circle" width="48" alt="Avatar"
  style="width:40px;height:40px;">
                      <div class="d-none d-sm-block ps-2">
                        <div class="fs-xs lh-1 opacity-60 fw-500">Hello,</div>
                        <div class="fs-sm dropdown-toggle fw-500">${userData.userData.name}</div>
                      </div>
</div>
                                                    </div>
                                                    <div class="dropdown-menu " style="top:50px;right:0px;">
                                                        <a  class="dropdown-item" onclick="${gvc.event(() => {
                            gvc.glitter.innerDialog((gvc) => {
                                const vm = {
                                    type: 'list'
                                };
                                return gvc.bindView(() => {
                                    const id = gvc.glitter.getUUID();
                                    return {
                                        bind: id,
                                        view: () => {
                                            if (vm.type === 'list') {
                                                return html `
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
                                                    vm.type = 'replace';
                                                    gvc.notifyDataChange(id);
                                                })}"
                                                            >
                                                                <i class="fa-regular fa-circle-plus me-2 fs-6"></i>
                                                                新增商店
                                                            </div>
                                                            <div class="flex-fill"></div>

                                                            <i class="fa-regular fa-circle-xmark fs-5"
                                                               style="color:black;cursor:pointer;"
                                                               onclick="${gvc.event(() => {
                                                    gvc.closeDialog();
                                                })}"></i>
                                                        </div>
                                                        ${gvc.bindView(() => {
                                                    const vm = {
                                                        loading: true,
                                                        data: []
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
                                                                return `<div class="p-4  d-flex align-items-center justify-content-center">
<div class="spinner-border"></div>
</div>`;
                                                            }
                                                            else {
                                                                return `
                                                                                   ` + vm.data.map((dd) => {
                                                                    var _a;
                                                                    dd.theme_config = (_a = dd.theme_config) !== null && _a !== void 0 ? _a : {};
                                                                    return html `
                                                                                <div class=" p-4 "
                                                                                     style=" display: flex;    align-items: center; "
                                                                                >
                                                                                    <div class=" rounded-3 shadow"
                                                                                         style=" width: 90px;    height: 74px;background-position: center;background-repeat: no-repeat;background-size: cover;     background-image: url('${dd.theme_config.preview_image || (dd.config &&
                                                                        dd.template_config &&
                                                                        dd.template_config.image &&
                                                                        dd.template_config.image[0]) || 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713445383494-未命名(1080x1080像素).jpg'}'); "
                                                                                    ></div>
                                                                                    <div class=""
                                                                                         style="     margin-left: 10px; "
                                                                                    >
                                                                                        <div class=" fw-500 fs-6"
                                                                                             style=" color: black; ">
                                                                                            ${dd.theme_config.name || dd.appName}
                                                                                        </div>
                                                                                        <div class="fw-normal  text-body"
                                                                                             style="font-size:13px;">
                                                                                                上次儲存時間：${gvc.glitter.ut.dateFormat(new Date(dd.update_time), 'MM-dd hh:mm')}
                                                                                        </div>
                                                                                        <div class=" fw-normal  ${(new Date(dd.dead_line).getTime() < new Date().getTime()) ? `text-danger` : `text-body`}"
                                                                                             style="font-size:13px;">

                                                                                            ${(new Date(dd.dead_line).getTime() < new Date().getTime()) ? `商店已過期` : `商店到期日`}
                                                                                                ：${gvc.glitter.ut.dateFormat(new Date(dd.dead_line), 'MM-dd hh:mm')}
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
                                                                        EditorElem.openEditorDialog(gvc, (gvc) => {
                                                                            return html `
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
                                                                                return ` <div class="position-relative rounded-3   "
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
                                                                                                                                   <div class=""
                                                                                                                                        style="     color: #393939;text-align: center;font-family: &quot;Noto Sans&quot;;font-size: 24px;font-style: normal;font-weight: 700;line-height: normal;margin-bottom: 16px; "
                                                                                                                                   >
                                                                                                                                       ${dd.title}
                                                                                                                                   </div>
                                                                                                                                   <div class=""
                                                                                                                                        style="  color: #393939;text-align: center;font-family: &quot;Noto Sans&quot;;font-size: 27.915px;font-style: normal;font-weight: 400;line-height: 140%; "
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
                                                                                                                                           <div class=""
                                                                                                                                                style="    color: #393939;font-family: &quot;Noto Sans&quot;;font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%; "
                                                                                                                                           >
                                                                                                                                               ${d1}
                                                                                                                                           </div>
                                                                                                                                       </div>`;
                                                                                    }).join('')}
                                                                                                                                   </div>`;
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
                                                                                                                       <div class="position-absolute  w-100 d-flex align-items-center justify-content-center" style="bottom: 40px;">
                                                                                                                         <div class=""
                                                                                                                                style="     background: linear-gradient(143deg, #FFB400 -22.7%, #FF6C02 114.57%);color: #FFF;display: flex;flex-direction: column;justify-content: center;align-items: center;gap: 10px;cursor:pointer;box-shadow: 5px 5px 10px 0px rgba(0, 0, 0, 0.20);border-radius: 100px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 1.6px;text-align: center;     padding: 11px 40px;font-size: 16px; "
onclick="${gvc.event(() => __awaiter(this, void 0, void 0, function* () {
                                                                                    const key = dd.sku;
                                                                                    const saasConfig = window.parent.saasConfig;
                                                                                    const product = (yield BaseApi.create({
                                                                                        url: saasConfig.config.url +
                                                                                            `/api-public/v1/ec/product?${(() => {
                                                                                                let par = [`sku=`];
                                                                                                return par.join('&');
                                                                                            })()}`,
                                                                                        type: 'GET',
                                                                                        headers: {
                                                                                            'Content-Type': 'application/json',
                                                                                            'g-app': encodeURIComponent(window.parent.glitterBase),
                                                                                        },
                                                                                    })).response.data[0];
                                                                                    BaseApi.create({
                                                                                        url: saasConfig.config.url + `/api-public/v1/ec/checkout`,
                                                                                        type: 'POST',
                                                                                        headers: {
                                                                                            'Content-Type': 'application/json',
                                                                                            'g-app': window.parent.glitterBase,
                                                                                            Authorization: GlobalUser.saas_token,
                                                                                        },
                                                                                        data: JSON.stringify({
                                                                                            "line_items": [
                                                                                                {
                                                                                                    "id": (product).id,
                                                                                                    "spec": product.content.variants.find((dd) => {
                                                                                                        return dd.sku === key;
                                                                                                    }).spec,
                                                                                                    "count": 1
                                                                                                }
                                                                                            ],
                                                                                            "return_url": location.href
                                                                                        }),
                                                                                    }).then((res) => {
                                                                                        $('body').html(res.response.form);
                                                                                        document.querySelector('#submit').click();
                                                                                    });
                                                                                }))}">
                                                                                                                               立即續費
                                                                                                                           </div>
</div>
                                                                                                                   </div>`;
                                                                            }).join('')}
                                                                                                               </div>
                                                                                                           </div>`;
                                                                        }, () => {
                                                                        }, 900, '方案續費');
                                                                    })}">續費</a>
                                                                                            <div class="dropdown-divider"></div>
                                                                                            <a class=" dropdown-item"
                                                                                               style=" "
                                                                                               onclick="${gvc.event(() => {
                                                                        EditorElem.openEditorDialog(gvc, (gvc) => {
                                                                            const appName = dd.theme_config.name || dd.appName;
                                                                            let deleteText = '';
                                                                            return `<div class="p-2">${[
                                                                                html `
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
                                                                                        deleteText = text;
                                                                                    }
                                                                                }),
                                                                                `<div class="d-flex align-items-center justify-content-end pt-2 border-top mt-2">
<button class="btn btn-danger btn-sm" onclick="${gvc.event(() => {
                                                                                    if (deleteText === appName) {
                                                                                        const dialog = new ShareDialog(gvc.glitter);
                                                                                        dialog.dataLoading({ visible: true });
                                                                                        ApiPageConfig.deleteApp(dd.appName).then((res) => {
                                                                                            dialog.dataLoading({ visible: false });
                                                                                            if (dd.appName === (window.appName)) {
                                                                                                const url = new URL(location.href);
                                                                                                location.href = url.href.replace(url.search, '');
                                                                                            }
                                                                                            else {
                                                                                                gvc.closeDialog();
                                                                                                refresh();
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                    else {
                                                                                        alert('輸入錯誤');
                                                                                    }
                                                                                })}">確認刪除</button>
</div>`
                                                                            ].join('')}</div>`;
                                                                        }, () => {
                                                                        }, 400, '刪除商店');
                                                                    })}"
                                                                                            >刪除商店</a>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div class=" btn btn-primary-c btn-sm"
                                                                                         style="margin-left: 10px;color: white;height: 28px; "
                                                                                         onclick="${gvc.event(() => {
                                                                        gvc.glitter.setUrlParameter('appName', dd.appName);
                                                                        location.reload();
                                                                    })}"
                                                                                    >
                                                                                        更換商店
                                                                                    </div>
                                                                                </div>`;
                                                                }).join('<div class="w-100 border-bottom"></div>');
                                                            }
                                                        },
                                                        divCreate: {
                                                            style: `max-height:600px;overflow-y:auto;`
                                                        }
                                                    };
                                                })}

                                                    </div>`;
                                            }
                                            else {
                                                return html `
                                                    <div style="width:400px;overflow-y: auto;"
                                                         class="bg-white shadow rounded-3 ">
                                                        <div class="w-100 d-flex align-items-center p-3 border-bottom">
                                                            <div onclick="${gvc.event(() => {
                                                    vm.type = 'list';
                                                    gvc.notifyDataChange(id);
                                                })}">
                                                                <i class="fa-solid fa-arrow-left fs-6"
                                                                   style="color:black;"></i>
                                                            </div>
                                                            <div class="fw-500 ms-2"
                                                                 style="color:black;">
                                                                新增商店
                                                            </div>

                                                            <div class="flex-fill"></div>

                                                            <i class="fa-regular fa-circle-xmark fs-5"
                                                               style="color:black;cursor:pointer;"
                                                               onclick="${gvc.event(() => {
                                                    gvc.closeDialog();
                                                })}"></i>
                                                        </div>
                                                        ${gvc.bindView(() => {
                                                    const id = gvc.glitter.getUUID();
                                                    const postMD = {
                                                        name: '',
                                                        appName: ''
                                                    };
                                                    return {
                                                        bind: id,
                                                        view: () => {
                                                            return html `
                                                                        <div class="px-3">
                                                                            ${[
                                                                EditorElem.editeInput({
                                                                    gvc: gvc,
                                                                    title: '商店名稱',
                                                                    placeHolder: `請輸入商店名稱`,
                                                                    default: postMD.name,
                                                                    callback: (text) => {
                                                                        postMD.name = text;
                                                                    }
                                                                }),
                                                                EditorElem.editeInput({
                                                                    gvc: gvc,
                                                                    title: '商店英文名稱',
                                                                    placeHolder: `請輸入商店英文名稱`,
                                                                    default: postMD.appName,
                                                                    callback: (text) => {
                                                                        postMD.appName = text;
                                                                    }
                                                                }),
                                                            ].join('')}
                                                                            <div class="w-100 btn my-3"
                                                                                 style="background:${EditorConfig.editor_layout.btn_background};color:white;"
                                                                                 onclick="${gvc.event(() => {
                                                                SaasFunction.createApp(gvc, postMD.appName, postMD.name, 'shop-template-clothing-v3');
                                                            })}">
                                                                                確認建立
                                                                            </div>
                                                                        </div>`;
                                                        },
                                                        divCreate: {
                                                            style: `max-height:600px;overflow-y:auto;`,
                                                            class: ``
                                                        }
                                                    };
                                                })}

                                                    </div>`;
                                            }
                                        }
                                    };
                                });
                            }, 'change_app');
                        })}">所有商店</a>
                                                        <div class="dropdown-divider"></div>
                                                        <a onclick="${gvc.event(() => {
                            GlobalUser.saas_token = '';
                            const url = new URL(location.href);
                            location.href = url.href.replace(url.search, '');
                        })}" class="dropdown-item">登出</a>
                                                    </div>`);
                    }));
                }, divCreate: {
                    class: `btn-group dropdown border-start ps-2`
                }
            };
        });
    }
}
class SaasFunction {
    static createApp(gvc, app_name, pick_name, refer_app) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const pass = /^[a-zA-Z0-9_-]+$/.test(app_name);
            if (!pass) {
                resolve(false);
                return;
            }
            const createAPP = refer_app;
            const appName = app_name;
            const glitter = window.glitter;
            const shareDialog = new ShareDialog(glitter);
            const html = String.raw;
            if (gvc.glitter.getCookieByName('glitterToken') === undefined) {
                shareDialog.errorMessage({ text: "請先登入" });
                return;
            }
            else {
                if (!appName) {
                    shareDialog.errorMessage({ text: "請輸入APP名稱" });
                    return;
                }
                const saasConfig = window.saasConfig;
                shareDialog.dataLoading({
                    visible: true
                });
                BaseApi.create({
                    "url": saasConfig.config.url + `/api/v1/app`,
                    "type": "POST",
                    "timeout": 0,
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": GlobalUser.saas_token
                    },
                    "data": JSON.stringify({
                        "domain": '',
                        "appName": encodeURIComponent(appName),
                        "copyApp": createAPP,
                        "brand": window.glitterBase,
                        "name": pick_name,
                        "copyWith": ["checkout", "manager_post", "user_post", "user", "public_config"]
                    })
                }).then((d2) => {
                    shareDialog.dataLoading({ visible: false });
                    if (d2.result) {
                        const url = new URL(location.href);
                        url.searchParams.set("type", "editor");
                        url.searchParams.set("page", "");
                        url.searchParams.set('function', 'backend-manger');
                        url.searchParams.set("appName", appName);
                        location.href = url.href;
                        resolve(true);
                    }
                    else {
                        shareDialog.errorMessage({ text: "創建失敗，此名稱已被使用!" });
                        resolve(false);
                    }
                });
            }
        }));
    }
}
