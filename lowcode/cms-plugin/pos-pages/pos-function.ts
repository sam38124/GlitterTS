import {ShareDialog} from "../../glitterBundle/dialog/ShareDialog.js";
import {POSSetting} from "../POS-setting.js";
import {GVC} from "../../glitterBundle/GVController.js";
import {ApiUser} from "../../glitter-base/route/user.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";

const html = String.raw

export class PosFunction {
    //切換店員
    public static switchUser(gvc: GVC, user: any) {
function refresh(){
    gvc.recreateView()
}
        gvc.glitter.innerDialog((gvc) => {
            const c_vm = {
                text: '',
                id: gvc.glitter.getUUID()
            }
            return gvc.bindView(() => {
                return {
                    bind: c_vm.id,
                    view: () => {
                        return html`
                            <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 42px; display: inline-flex">
                                <div style="align-self: stretch; height: 100px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 18px; display: flex">
                                    <div style="align-self: stretch; justify-content: center; align-items: flex-start; gap: 16px; display: inline-flex">
                                        <div style="text-align: center"><span
                                                style="color: #FFB400; font-size: 42px; font-family: Lilita One; font-weight: 400; word-wrap: break-word">SHOPNE</span><span
                                                style="color: #FFB400; font-size: 42px; font-family: Lilita One; font-weight: 400; letter-spacing: 2.52px; word-wrap: break-word">X</span>
                                        </div>
                                        <div style="text-align: center; color: #8D8D8D; font-size: 42px; font-family: Lilita One; font-weight: 400; word-wrap: break-word">
                                            POS
                                        </div>
                                    </div>
                                    <div style="align-self: stretch; text-align: center; color: #393939; font-size: 24px; font-family: Noto Sans; font-weight: 700; line-height: 33.60px; letter-spacing: 2.40px; word-wrap: break-word">
                                        請輸入員工編號
                                    </div>
                                </div>
                                <div style="align-self: stretch; justify-content: center; align-items: center; gap: 20px; display: inline-flex">
                                    ${(() => {
                                        let view: any = []
                                        for (let a = 0; a < 6; a++) {
                                            if (c_vm.text.length > a) {
                                                view.push(`<div style="width: 18px; height: 18px; position: relative; background: #FFB400; border-radius: 30px"></div>`)
                                            } else {
                                                view.push(` <div style="width: 18px; height: 18px; position: relative; background: #B0B0B0; border-radius: 30px"></div>`)
                                            }
                                        }
                                        return view.join('')
                                    })()}
                                </div>
                                <div style="background: white; flex-direction: column; justify-content: flex-start; align-items: center; gap: 32px; display: flex">
                                    <div style="align-self: stretch; border-radius: 10px; flex-direction: column; justify-content: flex-start; align-items: center; display: flex;border: 1px solid #DDD;">
                                        ${[[1, 2, 3], [4, 5, 6], [7, 8, 9], ['取消', 0, '<i class="fa-regular fa-delete-left"></i>']].map((dd) => {

                                            return html`
                                                <div style="justify-content: flex-start; align-items: center; display: inline-flex">
                                                    ${dd.map((dd) => {
                                                        return `<div style="height:56px;width:95px;flex-direction: column; justify-content: center; align-items: center; gap: 10px; display: inline-flex" onclick="${
                                                                gvc.event(() => {
                                                                    if (dd === '取消') {
                                                                        gvc.closeDialog()
                                                                        return
                                                                    } else if (`${dd}`.includes(`fa-regular`)) {
                                                                        c_vm.text = c_vm.text.substring(0, c_vm.text.length - 1)
                                                                        gvc.notifyDataChange(c_vm.id)
                                                                        return
                                                                    }
                                                                    c_vm.text += dd
                                                                    const dialog = new ShareDialog(gvc.glitter)
                                                                    if (c_vm.text.length === 6) {
                                                                        dialog.dataLoading({visible: true});
                                                                        ApiUser.login({
                                                                            app_name: gvc.glitter.share.editorViewModel.app_config_original.appName,
                                                                            pin: c_vm.text,
                                                                            login_type: 'pin',
                                                                            token: GlobalUser.saas_token,
                                                                            user_id: user
                                                                        }).then(async (r) => {
                                                                            dialog.dataLoading({visible: false});
                                                                            if (r.result) {
                                                                                if (
                                                                                        (
                                                                                                await ApiUser.checkAdminAuth({
                                                                                                    app: gvc.glitter.getUrlParameter('app-id'),
                                                                                                    token: GlobalUser.saas_token,
                                                                                                })
                                                                                        ).response.result
                                                                                ) {
                                                                                    GlobalUser.saas_token = r.response.token;
                                                                                    gvc.closeDialog();
                                                                                    refresh()
                                                                                } else {
                                                                                    dialog.errorMessage({text: 'PIN碼輸入錯誤!'});
                                                                                }
                                                                            } else {
                                                                                dialog.errorMessage({text: 'PIN碼輸入錯誤!'});
                                                                            }
                                                                        });
                                                                    }
                                                                    gvc.notifyDataChange(c_vm.id)
                                                                })
                                                        }">
            <div style="align-self: stretch; text-align: center; color: #393939; font-size: 20px;  font-weight: 700; line-height: 28px; word-wrap: break-word">${dd}</div>
          </div>`
                                                    }).join('<div class="" style="border-right: 1px #DDDDDD solid;height:56px;"></div>')}
                                                </div>`
                                        }).join('<div class="" style="border-top: 1px #DDDDDD solid;height:1px; width: 100%;"></div>')}

                                    </div>
                                </div>
                            </div>`

                    },
                    divCreate: {
                        class: ``,
                        style: `width: 338px;  padding-left: 20px; padding-right: 20px; padding-top: 25px; padding-bottom: 25px; background: white; box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.15); border-radius: 20px; overflow: hidden; justify-content: center; align-items: center; gap: 10px; display: inline-flex`
                    }
                }
            })
        }, '')
    }
//切換店員
    public static selectUserSwitch(gvc: GVC) {
        const this_gvc=gvc
        gvc.glitter.innerDialog((gvc) => {
            const c_vm = {
                text: '',
                id: gvc.glitter.getUUID()
            }
            const mem_=gvc.glitter.share.member_auth_list.filter((dd: any) => {
                return `${dd.user}` !== `${POSSetting.config.who}`
            })
            return gvc.bindView(() => {
                return {
                    bind: c_vm.id,
                    view: () => {
                        return html`
                            <div class="w-100 position-absolute vw-100 vh-100" style="left: 0px;top:0px;z-index: 0;" onclick="${gvc.event(()=>{gvc.closeDialog()})}"></div>
                            <div class="w-100" style="flex-direction: column; justify-content: flex-start; align-items: flex-start;  display: inline-flex;z-index: 1;position: relative;" onclick="${gvc.event((e,event)=>{
                                event.stopPropagation()
                            })}">
                              
                               ${mem_.map((dd: any) => {
                                   const memberDD = dd;
                                   return html`
                                       
                                       <div
                                                                                    class=" d-flex align-items-center p-0 w-100"
                                                                                    style="cursor: pointer;gap:10px;"
                                                                                    onclick="${gvc.event(() => {
                                       PosFunction.switchUser(this_gvc, dd.user)
                                   })}">
                                           <img src="https://assets.imgix.net/~text?bg=7ED379&amp;txtclr=ffffff&amp;w=100&amp;h=100&amp;txtsize=40&amp;txt=${dd.config.name}&amp;txtfont=Helvetica&amp;txtalign=middle,center" class="rounded-circle" width="48" alt="undefined" style="width:40px;height:40px;">
                                           <div class="d-flex flex-column">
                                               <div>${dd.config.name}</div>
                                               <div>${dd.config.title} / ${dd.config.member_id}</div>
                                           </div>
                                           <div class="flex-fill"></div>
                                           <div class="ms-auto d-flex align-items-center justify-content-center border p-2 rounded-3 mt-2" style="text-align: center;
                                font-size: 16px;
                                font-style: normal;
                                font-weight: 700;
                                background: #393939;
                                color: white;
                                line-height: 140%;" onclick="${gvc.event(()=>{
                                              PosFunction.switchUser(gvc, dd.user)
                                           })}">
                                               選擇
                                           </div>     
                                                                            </div>
                                                                            `
                               }).join('<div class="my-2 w-100 border-top"></div>')}
                            </div>`

                    },
                    divCreate: {
                        class: ``,
                        style: `width: 338px;max-height:200px;overflow-y:auto;  padding-left: 20px; padding-right: 20px; padding-top: 25px; padding-bottom: 25px; background: white; box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.15); border-radius: 20px; overflow: hidden; justify-content: center; align-items: center; gap: 10px; display: inline-flex`
                    }
                }
            })
        }, '')
    }
    //切換門市
    public static selectStoreSwitch(gvc: GVC) {
        const this_gvc=gvc
        gvc.glitter.innerDialog((gvc) => {
            const c_vm = {
                text: '',
                id: gvc.glitter.getUUID()
            }

            return gvc.bindView(() => {
                return {
                    bind: c_vm.id,
                    view: () => {
                        return html`
                            <div class="w-100 position-absolute vw-100 vh-100" style="left: 0px;top:0px;z-index: 0;" onclick="${gvc.event(()=>{gvc.closeDialog()})}"></div>
                            <div class="w-100" style="flex-direction: column; justify-content: flex-start; align-items: flex-start;  display: inline-flex;z-index: 1;position: relative;" onclick="${gvc.event((e,event)=>{
                            event.stopPropagation()
                        })}">
                              
                               ${gvc.glitter.share.store_list.filter((dd:any)=>{
                                   return gvc.glitter.share.select_member.config.support_shop.includes(dd.id)
                               }).map((dd: any) => {
                            return html`
                                       
                                       <div
                                                                                    class=" d-flex align-items-center p-0 w-100"
                                                                                    style="cursor: pointer;gap:10px;"
                                                                                    onclick="${gvc.event(() => {
                                                                                        POSSetting.config.where_store=dd.id
                                gvc.closeDialog()
                            })}">
                                           <img src="https://assets.imgix.net/~text?bg=7ED379&amp;txtclr=ffffff&amp;w=100&amp;h=100&amp;txtsize=40&amp;txt=${dd.name}&amp;txtfont=Helvetica&amp;txtalign=middle,center" class="rounded-circle" width="48" alt="undefined" style="width:40px;height:40px;">
                                           <div class="d-flex flex-column">
                                               <div>${dd.name}</div>
                                           </div>
                                           <div class="flex-fill"></div>
                                           <div class="ms-auto d-flex align-items-center justify-content-center border p-2 rounded-3 mt-2" style="text-align: center;
                                font-size: 16px;
                                font-style: normal;
                                font-weight: 700;
                                background: #393939;
                                color: white;
                                line-height: 140%;" onclick="${gvc.event(()=>{
                                               this_gvc.recreateView()
                            })}">
                                               選擇
                                           </div>     
                                                                            </div>
                                                                            `
                        }).join('<div class="my-2 w-100 border-top"></div>')}
                            </div>`

                    },
                    divCreate: {
                        class: ``,
                        style: `width: 338px;max-height:200px;overflow-y:auto;  padding-left: 20px; padding-right: 20px; padding-top: 25px; padding-bottom: 25px; background: white; box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.15); border-radius: 20px; overflow: hidden; justify-content: center; align-items: center; gap: 10px; display: inline-flex`
                    }
                }
            })
        }, '')
    }
    //SetMoney
    public static setMoney(gvc: GVC, callback: (money: string) => void) {
        gvc.glitter.innerDialog((gvc) => {
            const c_vm = {
                text: '',
                id: gvc.glitter.getUUID()
            }
            return gvc.bindView(() => {
                return {
                    bind: c_vm.id,
                    view: () => {
                        return html`
                            <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 20px; display: inline-flex">
                                <div style="align-self: stretch; justify-content: center; align-items: flex-start; display: inline-flex">
                                    <div class="fw-bold" style="text-align: center; color: #585858; font-size: 28px;">
                                        輸入收款金額
                                    </div>
                                </div>
                                <div class="border w-100 p-3 rounded-3 border d-flex align-items-center justify-content-end"
                                     style="gap: 20px;">
                                    <span style="font-size:28px;">${c_vm.text || 0}</span>
                                </div>
                                <div style="background: white; flex-direction: column; justify-content: flex-start; align-items: center; gap: 32px; display: flex">
                                    <div style="align-self: stretch; border-radius: 10px; flex-direction: column; justify-content: flex-start; align-items: center; display: flex;border: 1px solid #DDD;">
                                        ${[[1, 2, 3], [4, 5, 6], [7, 8, 9], ['<i class="fa-regular fa-delete-left"></i>', 0, '確認']].map((dd) => {

                                            return html`
                                                <div style="justify-content: flex-start; align-items: center; display: inline-flex">
                                                    ${dd.map((dd) => {
                                                        return `<div style="height:56px;width:95px;flex-direction: column; justify-content: center; align-items: center; gap: 10px; display: inline-flex" onclick="${
                                                                gvc.event(() => {
                                                                    if (dd === '確認') {
                                                                        callback(c_vm.text)
                                                                        gvc.closeDialog()
                                                                        return
                                                                    } else if (dd === '取消') {
                                                                        gvc.closeDialog()
                                                                        return
                                                                    } else if (`${dd}`.includes(`fa-regular`)) {
                                                                        c_vm.text = c_vm.text.substring(0, c_vm.text.length - 1)
                                                                        gvc.notifyDataChange(c_vm.id)
                                                                        return
                                                                    }
                                                                    c_vm.text += dd
                                                                    gvc.notifyDataChange(c_vm.id)
                                                                })
                                                        }">
            <div style="align-self: stretch; text-align: center; color: #393939; font-size: 20px;  font-weight: 700; line-height: 28px; word-wrap: break-word">${dd}</div>
          </div>`
                                                    }).join('<div class="" style="border-right: 1px #DDDDDD solid;height:56px;"></div>')}
                                                </div>`
                                        }).join('<div class="" style="border-top: 1px #DDDDDD solid;height:1px; width: 100%;"></div>')}

                                    </div>
                                </div>
                            </div>`

                    },
                    divCreate: {
                        class: ``,
                        style: `width: 338px;  padding-left: 20px; padding-right: 20px; padding-top: 25px; padding-bottom: 25px; background: white; box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.15); border-radius: 20px; overflow: hidden; justify-content: center; align-items: center; gap: 10px; display: inline-flex`
                    }
                }
            })
        }, '')
    }
}