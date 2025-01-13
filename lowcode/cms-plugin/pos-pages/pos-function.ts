import {ShareDialog} from "../../glitterBundle/dialog/ShareDialog.js";
import {POSSetting} from "../POS-setting.js";
import {GVC} from "../../glitterBundle/GVController.js";
import {ApiUser} from "../../glitter-base/route/user.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";
import {PosWidget} from "../pos-widget.js";
import {TempOrder} from "./temp-order.js";
import {PaymentPage} from "./payment-page.js";
import {OrderDetail} from "./models.js";
import {BgWidget} from "../../backend-manager/bg-widget.js";

const html = String.raw
const css = String.raw

export class PosFunction {
    //切換店員
    public static switchUser(gvc: GVC, user: any) {
        function refresh() {
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
                                        請輸入員工密碼
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
        const this_gvc = gvc
        gvc.glitter.innerDialog((gvc) => {
            const c_vm = {
                text: '',
                id: gvc.glitter.getUUID()
            }
            const mem_ = gvc.glitter.share.member_auth_list.filter((dd: any) => {
                return `${dd.user}` !== `${POSSetting.config.who}`
            })
            return gvc.bindView(() => {
                return {
                    bind: c_vm.id,
                    view: () => {
                        return html`
                            <div class="w-100 position-absolute vw-100 vh-100" style="left: 0px;top:0px;z-index: 0;"
                                 onclick="${gvc.event(() => {
                                     gvc.closeDialog()
                                 })}"></div>
                            <div class="w-100"
                                 style="flex-direction: column; justify-content: flex-start; align-items: flex-start;  display: inline-flex;z-index: 1;position: relative;"
                                 onclick="${gvc.event((e, event) => {
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
                                            <img src="https://assets.imgix.net/~text?bg=7ED379&amp;txtclr=ffffff&amp;w=100&amp;h=100&amp;txtsize=40&amp;txt=${dd.config.name}&amp;txtfont=Helvetica&amp;txtalign=middle,center"
                                                 class="rounded-circle" width="48" alt="undefined"
                                                 style="width:40px;height:40px;">
                                            <div class="d-flex flex-column">
                                                <div>${dd.config.name}</div>
                                                <div>${dd.config.title} / ${dd.config.member_id}</div>
                                            </div>
                                            <div class="flex-fill"></div>
                                            <div class="ms-auto d-flex align-items-center justify-content-center border p-2 rounded-3 mt-2"
                                                 style="text-align: center;
                                font-size: 16px;
                                font-style: normal;
                                font-weight: 700;
                                background: #393939;
                                color: white;
                                line-height: 140%;" onclick="${gvc.event(() => {
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
        const this_gvc = gvc
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
                            <div class="w-100 position-absolute vw-100 vh-100" style="left: 0px;top:0px;z-index: 0;"
                                 onclick="${gvc.event(() => {
                                     gvc.closeDialog()
                                 })}"></div>
                            <div class="w-100"
                                 style="flex-direction: column; justify-content: flex-start; align-items: flex-start;  display: inline-flex;z-index: 1;position: relative;"
                                 onclick="${gvc.event((e, event) => {
                                     event.stopPropagation()
                                 })}">

                                ${gvc.glitter.share.store_list.filter((dd: any) => {
                                    return gvc.glitter.share.select_member.config.support_shop.includes(dd.id)
                                }).map((dd: any) => {
                                    return html`

                                        <div
                                                class=" d-flex align-items-center p-0 w-100"
                                                style="cursor: pointer;gap:10px;"
                                                onclick="${gvc.event(() => {
                                                    POSSetting.config.where_store = dd.id
                                                    gvc.closeDialog()
                                                })}">
                                            <img src="https://assets.imgix.net/~text?bg=7ED379&amp;txtclr=ffffff&amp;w=100&amp;h=100&amp;txtsize=40&amp;txt=${dd.name}&amp;txtfont=Helvetica&amp;txtalign=middle,center"
                                                 class="rounded-circle" width="48" alt="undefined"
                                                 style="width:40px;height:40px;">
                                            <div class="d-flex flex-column">
                                                <div>${dd.name}</div>
                                            </div>
                                            <div class="flex-fill"></div>
                                            <div class="ms-auto d-flex align-items-center justify-content-center border p-2 rounded-3 mt-2"
                                                 style="text-align: center;
                                font-size: 16px;
                                font-style: normal;
                                font-weight: 700;
                                background: #393939;
                                color: white;
                                line-height: 140%;" onclick="${gvc.event(() => {
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
    public static setMoney(gvc: GVC, callback: (money: number) => void) {
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
                                                                        callback(parseInt(c_vm.text, 10))
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
        }, 'amslasks')
    }

    //SelectMultiple
    //選擇多種付款方式
    public static selectPaymentMethod(obj: {
        gvc: GVC,
        orderData: OrderDetail,
        callback: (data: any) => void
    }) {
        console.log(`obj.orderData=>`, obj.orderData)
        const paymentMethod = JSON.parse(JSON.stringify(obj.orderData.pos_info.payment))
        const dialog = new ShareDialog(obj.gvc.glitter)
        obj.gvc.glitter.innerDialog((gvc) => {
            return gvc.bindView(() => {
                const id = gvc.glitter.getUUID()
                return {
                    bind: id,
                    view: () => {
                        try {
                            return [
                                `<div class="d-flex align-items-end" style="color: #393939;
gap:10px;
font-size: 18px;
font-style: normal;
font-weight: 700;
line-height: normal;
letter-spacing: 0.72px;
text-transform: uppercase;
                                ">總金額${PosWidget.bigTitle('$' + obj.orderData.total.toLocaleString())}</div>`,
                                `<div class="d-flex align-items-center justify-content-center w-100 mt-lg-4 mt-3" style="">
<div class="d-flex" style="flex:94;">
${PosWidget.fontLight('付款方式')}
</div>
<div class="d-flex" style="flex:94;">
${PosWidget.fontLight('付款金額')}
</div>
<div class="d-flex" style="flex:68;">
${PosWidget.fontLight('付款狀態')}
</div>
<div class="d-flex" style="flex:34;">
</div>
</div>`,
                                paymentMethod.map((dd: any,index:number) => {
                                    return html`
                                        <div class="d-flex align-items-center justify-content-center w-100 mt-lg-4 mt-1"
                                             style="height:60px;">
                                            <div class="d-flex" style="flex:94;color:#36B;cursor: pointer;"
                                                 onclick="${gvc.event(() => {
                                                     PaymentPage.storeHistory(dd);
                                                     gvc.closeDialog()
                                                     localStorage.setItem('show_pos_page', 'payment')
                                                     gvc.glitter.share.reloadPosPage()
                                                 })}">
                                                ${(() => {
                                                    switch (dd.method) {
                                                        case 'cash':
                                                            return `現金`
                                                        case 'creditCard':
                                                            return `刷卡`
                                                        case 'line':
                                                            return `LINE PAY`
                                                    }
                                                })()}
                                            </div>
                                            <div class="d-flex" style="flex:94;">
                                                <input style="display: flex;width: calc(100% - 20px);padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;text-align: right;"
                                                       class="" value="${dd.total}"
                                                       onclick="${gvc.event(() => {
                                                           PosFunction.setMoney(gvc, (money) => {
                                                               dd.total = (money || 0)
                                                               gvc.notifyDataChange(id)
                                                           })
                                                       })}">
                                            </div>
                                            <div class="d-flex" style="flex:68;">
                                                尚未付款
                                            </div>
                                            <div class="d-flex" style="flex:34;">
                                                ${(paymentMethod.length > 1) ? `<i class="fa-solid fa-xmark fs-5" style="cursor: pointer;"
                                                   onclick="${gvc.event(() => {
                                                    paymentMethod.splice(index,1)
                                                    gvc.notifyDataChange(id)
                                                })}"></i>` : ``}
                                            </div>
                                        </div>`
                                }).join(''),
                                PosWidget.buttonSnow(`新增付款方式`, gvc.event(() => {
                                    PosFunction.selectPaymentMethodSingle(gvc, obj.orderData, (data) => {
                                        paymentMethod.push(data)
                                        gvc.notifyDataChange(id)
                                    })
                                })),
                                `<i class="fa-solid fa-xmark position-absolute fs-5" style="right: 20px;top:20px;cursor: pointer;" onclick="${gvc.event(() => {
                                    gvc.closeDialog()
                                })}"></i>`,
                                `<div class="d-flex align-items-center justify-content-end w-100" style="gap:10px;">
${BgWidget.cancel(gvc.event(() => {
                                    gvc.closeDialog()
                                }))}
${BgWidget.save(gvc.event(() => {
                                    obj.callback(paymentMethod)
                                    gvc.closeDialog()
                                }))}
</div>`
                            ].join('<div class="my-2"></div>')
                        } catch (e) {
                            return `${e}`
                        }

                    },
                    divCreate: {
                        class: `p-lg-5 p-2 py-3`, style: css`max-width: calc(100vw - 10px);
                            position: relative;
                            width: 546px;
                            max-height: calc(100vh - 100px);
                            overflow-y: auto;
                            border-radius: 10px;
                            background: #FFF;
                            display: flex;
                            align-items: center;
                            flex-direction: column;
                            justify-content: center;
                        `
                    }
                }
            })
        }, `qmwq`)
    }

    public static selectPaymentMethodSingle(gvc: GVC, orderDetail: any, callback: (method: any) => void) {
        let method = {
            method: 'cash',
            total: 0
        }
        gvc.glitter.innerDialog((gvc: GVC) => {
            return gvc.bindView(() => {
                const id = gvc.glitter.getUUID()
                return {
                    bind: id,
                    view: () => {
                        try {
                            return [
                                `<div class="d-flex align-items-end" style="color: #393939;
gap:10px;
font-size: 18px;
font-style: normal;
font-weight: 700;
line-height: normal;
letter-spacing: 0.72px;
text-transform: uppercase;
                                ">新增付款方式</div>`,
                                `<div class="w-100 d-flex align-items-center" style="gap:5px;">
${(() => {
                                    function drawIcon(black: boolean, type: string) {
                                        switch (type) {
                                            case 'cash':
                                                return html`
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                         width="28" height="28"
                                                         viewBox="0 0 28 28" fill="none">
                                                        <path
                                                                d="M9.625 4.8125C9.625 4.81797 9.63047 4.84531 9.65781 4.89453C9.69063 4.96016 9.76719 5.06406 9.91484 5.19531C9.93672 5.21172 9.95859 5.23359 9.98047 5.25C8.95781 5.27187 7.9625 5.34297 7.00547 5.47422L7 4.8125C7 3.82812 7.53047 3.04062 8.15391 2.47734C8.77734 1.91406 9.61406 1.46562 10.5328 1.11563C12.3813 0.410156 14.8477 0 17.5 0C20.1523 0 22.6187 0.410156 24.4617 1.11016C25.3805 1.46016 26.2172 1.90859 26.8406 2.47187C27.4641 3.03516 28 3.82812 28 4.8125V10.5V16.1875C28 17.1719 27.4695 17.9594 26.8461 18.5227C26.2227 19.0859 25.3859 19.5344 24.4672 19.8844C23.9422 20.0867 23.368 20.2617 22.7555 20.4094V17.6914C23.0344 17.6094 23.2914 17.5219 23.532 17.4289C24.2758 17.1445 24.7898 16.8383 25.0906 16.5703C25.2383 16.4391 25.3148 16.3352 25.3477 16.2695C25.3805 16.2094 25.3805 16.1875 25.3805 16.1875V13.8031C25.0906 13.9453 24.7844 14.0766 24.4672 14.1969C23.9422 14.3992 23.368 14.5742 22.7555 14.7219V12.0039C23.0344 11.9219 23.2914 11.8344 23.532 11.7414C24.2758 11.457 24.7898 11.1508 25.0906 10.8828C25.2383 10.7516 25.3148 10.6477 25.3477 10.582C25.375 10.5328 25.3805 10.5055 25.3805 10.5V8.11562C25.0906 8.25781 24.7844 8.38906 24.4672 8.50938C23.718 8.79375 22.8594 9.03438 21.9352 9.21484C21.6562 8.80469 21.3336 8.45469 21.0164 8.17031C20.4641 7.67266 19.8242 7.26797 19.157 6.93438C20.8906 6.80859 22.4 6.48594 23.532 6.05391C24.2758 5.76953 24.7898 5.46328 25.0906 5.19531C25.2383 5.06406 25.3148 4.96016 25.3477 4.89453C25.375 4.84531 25.3805 4.81797 25.3805 4.8125C25.3805 4.8125 25.3805 4.78516 25.3477 4.73047C25.3148 4.66484 25.2383 4.56094 25.0906 4.42969C24.7898 4.15625 24.2758 3.85 23.532 3.57109C22.05 3.00234 19.9172 2.625 17.5 2.625C15.0828 2.625 12.95 3.00234 11.4734 3.56562C10.7297 3.85 10.2156 4.15625 9.91484 4.42422C9.76719 4.55547 9.69063 4.65938 9.65781 4.725C9.625 4.78516 9.625 4.80703 9.625 4.80703V4.8125ZM2.625 11.8125C2.625 11.818 2.63047 11.8453 2.65781 11.8945C2.69062 11.9602 2.76719 12.0641 2.91484 12.1953C3.21563 12.4688 3.72969 12.775 4.47344 13.0539C5.95 13.6172 8.08281 13.9945 10.5 13.9945C12.9172 13.9945 15.05 13.6172 16.5266 13.0539C17.2703 12.7695 17.7844 12.4633 18.0852 12.1953C18.2328 12.0641 18.3094 11.9602 18.3422 11.8945C18.3695 11.8453 18.375 11.818 18.375 11.8125C18.375 11.8125 18.375 11.7852 18.3422 11.7305C18.3094 11.6648 18.2328 11.5609 18.0852 11.4297C17.7844 11.1562 17.2703 10.85 16.5266 10.5711C15.05 10.0078 12.9172 9.63047 10.5 9.63047C8.08281 9.63047 5.95 10.0078 4.47344 10.5711C3.72969 10.8555 3.21563 11.1617 2.91484 11.4297C2.76719 11.5609 2.69062 11.6648 2.65781 11.7305C2.625 11.7906 2.625 11.8125 2.625 11.8125ZM0 11.8125C0 10.8281 0.530469 10.0406 1.15391 9.47734C1.77734 8.91406 2.61406 8.46562 3.53281 8.11562C5.38125 7.41016 7.84766 7 10.5 7C13.1523 7 15.6187 7.41016 17.4617 8.11016C18.3805 8.46016 19.2172 8.90859 19.8406 9.47188C20.4641 10.0352 21 10.8281 21 11.8125V17.5V23.1875C21 24.1719 20.4695 24.9594 19.8461 25.5227C19.2227 26.0859 18.3859 26.5344 17.4672 26.8844C15.6187 27.5898 13.1523 28 10.5 28C7.84766 28 5.38125 27.5898 3.53828 26.8898C2.61953 26.5398 1.78828 26.0914 1.15938 25.5281C0.530469 24.9648 0 24.1719 0 23.1875V17.5V11.8125ZM18.375 17.5V15.1156C18.0852 15.2578 17.7789 15.3891 17.4617 15.5094C15.6187 16.2148 13.1523 16.625 10.5 16.625C7.84766 16.625 5.38125 16.2148 3.53828 15.5148C3.22109 15.3945 2.91484 15.2633 2.625 15.1211V17.5C2.625 17.5055 2.63047 17.5328 2.65781 17.582C2.69062 17.6477 2.76719 17.7516 2.91484 17.8828C3.21563 18.1562 3.72969 18.4625 4.47344 18.7414C5.95 19.3047 8.08281 19.682 10.5 19.682C12.9172 19.682 15.05 19.3047 16.5266 18.7414C17.2703 18.457 17.7844 18.1508 18.0852 17.8828C18.2328 17.7516 18.3094 17.6477 18.3422 17.582C18.3695 17.5328 18.375 17.5055 18.375 17.5ZM3.53828 21.2023C3.22109 21.082 2.91484 20.9508 2.625 20.8086V23.1875C2.625 23.1875 2.625 23.2148 2.65781 23.2695C2.69062 23.3352 2.76719 23.4391 2.91484 23.5703C3.21563 23.8438 3.72969 24.15 4.47344 24.4289C5.95 24.9922 8.08281 25.3695 10.5 25.3695C12.9172 25.3695 15.05 24.9922 16.5266 24.4289C17.2703 24.1445 17.7844 23.8383 18.0852 23.5703C18.2328 23.4391 18.3094 23.3352 18.3422 23.2695C18.375 23.2094 18.375 23.1875 18.375 23.1875V20.8031C18.0852 20.9453 17.7789 21.0766 17.4617 21.1969C15.6187 21.9023 13.1523 22.3125 10.5 22.3125C7.84766 22.3125 5.38125 21.9023 3.53828 21.2023Z"
                                                                fill="${black ? `#393939` : `#8D8D8D`}"
                                                        />
                                                    </svg>
                                                `;
                                            case 'creditCard':
                                                return html`
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                         width="28" height="28"
                                                         viewBox="0 0 28 28" fill="none">
                                                        <path
                                                                d="M24.8889 5.84375C25.3167 5.84375 25.6667 6.19531 25.6667 6.625V8.1875H2.33333V6.625C2.33333 6.19531 2.68333 5.84375 3.11111 5.84375H24.8889ZM25.6667 12.875V22.25C25.6667 22.6797 25.3167 23.0312 24.8889 23.0312H3.11111C2.68333 23.0312 2.33333 22.6797 2.33333 22.25V12.875H25.6667ZM3.11111 3.5C1.39514 3.5 0 4.90137 0 6.625V22.25C0 23.9736 1.39514 25.375 3.11111 25.375H24.8889C26.6049 25.375 28 23.9736 28 22.25V6.625C28 4.90137 26.6049 3.5 24.8889 3.5H3.11111ZM5.83333 18.3437C5.18681 18.3437 4.66667 18.8662 4.66667 19.5156C4.66667 20.165 5.18681 20.6875 5.83333 20.6875H8.16667C8.81319 20.6875 9.33333 20.165 9.33333 19.5156C9.33333 18.8662 8.81319 18.3437 8.16667 18.3437H5.83333ZM12.0556 18.3437C11.409 18.3437 10.8889 18.8662 10.8889 19.5156C10.8889 20.165 11.409 20.6875 12.0556 20.6875H17.5C18.1465 20.6875 18.6667 20.165 18.6667 19.5156C18.6667 18.8662 18.1465 18.3437 17.5 18.3437H12.0556Z"
                                                                fill="${black ? `#393939` : `#8D8D8D`}"
                                                        />
                                                    </svg>
                                                `;
                                            default:
                                                return html`
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                         viewBox="0 0 512 512">
                                                        <path
                                                                fill="${black ? `#393939` : `#8D8D8D`}"
                                                                d="M311 196.8v81.3c0 2.1-1.6 3.7-3.7 3.7h-13c-1.3 0-2.4-.7-3-1.5l-37.3-50.3v48.2c0 2.1-1.6 3.7-3.7 3.7h-13c-2.1 0-3.7-1.6-3.7-3.7V196.9c0-2.1 1.6-3.7 3.7-3.7h12.9c1.1 0 2.4 .6 3 1.6l37.3 50.3V196.9c0-2.1 1.6-3.7 3.7-3.7h13c2.1-.1 3.8 1.6 3.8 3.5zm-93.7-3.7h-13c-2.1 0-3.7 1.6-3.7 3.7v81.3c0 2.1 1.6 3.7 3.7 3.7h13c2.1 0 3.7-1.6 3.7-3.7V196.8c0-1.9-1.6-3.7-3.7-3.7zm-31.4 68.1H150.3V196.8c0-2.1-1.6-3.7-3.7-3.7h-13c-2.1 0-3.7 1.6-3.7 3.7v81.3c0 1 .3 1.8 1 2.5c.7 .6 1.5 1 2.5 1h52.2c2.1 0 3.7-1.6 3.7-3.7v-13c0-1.9-1.6-3.7-3.5-3.7zm193.7-68.1H327.3c-1.9 0-3.7 1.6-3.7 3.7v81.3c0 1.9 1.6 3.7 3.7 3.7h52.2c2.1 0 3.7-1.6 3.7-3.7V265c0-2.1-1.6-3.7-3.7-3.7H344V247.7h35.5c2.1 0 3.7-1.6 3.7-3.7V230.9c0-2.1-1.6-3.7-3.7-3.7H344V213.5h35.5c2.1 0 3.7-1.6 3.7-3.7v-13c-.1-1.9-1.7-3.7-3.7-3.7zM512 93.4V419.4c-.1 51.2-42.1 92.7-93.4 92.6H92.6C41.4 511.9-.1 469.8 0 418.6V92.6C.1 41.4 42.2-.1 93.4 0H419.4c51.2 .1 92.7 42.1 92.6 93.4zM441.6 233.5c0-83.4-83.7-151.3-186.4-151.3s-186.4 67.9-186.4 151.3c0 74.7 66.3 137.4 155.9 149.3c21.8 4.7 19.3 12.7 14.4 42.1c-.8 4.7-3.8 18.4 16.1 10.1s107.3-63.2 146.5-108.2c27-29.7 39.9-59.8 39.9-93.1z"
                                                        />
                                                    </svg>
                                                `;
                                        }
                                    }

                                    let btnArray = [
                                        {
                                            title: `現金`,
                                            value: 'cash',
                                            key: 'cash',
                                            event: () => {
                                                method = {
                                                    method: 'cash',
                                                    total: 0
                                                }
                                                gvc.notifyDataChange(id)
                                            },
                                        },
                                        {
                                            title: `刷卡`,
                                            value: 'creditCard',
                                            key: 'ut_credit_card',
                                            event: () => {
                                                method = {
                                                    method: 'creditCard',
                                                    total: 0
                                                }
                                                gvc.notifyDataChange(id)
                                            },
                                        },
                                        {
                                            title: `Line Pay`,
                                            value: 'line',
                                            key: 'line_pay_scan',
                                            event: () => {
                                                method = {
                                                    method: 'line',
                                                    total: 0
                                                }
                                                gvc.notifyDataChange(id)
                                            },
                                        },
                                    ].filter((dd) => {
                                        return (dd.key === 'cash') || (orderDetail.payment_setting.find((d1: any) => {
                                            return dd.key === d1.key
                                        }))
                                    });
                                    return btnArray
                                        .map((btn) => {
                                            return html`
                                                <div
                                                        style="flex:1;display: flex;flex-direction: column;justify-content: center;align-items: center;padding: 15px 15px;border-radius: 10px;background: #F6F6F6;${
                                                method.method === btn.value

                                                    ? `color:#393939;border-radius: 10px;border: 3px solid #393939;box-shadow: 2px 2px 15px 0px rgba(0, 0, 0, 0.20);`
                                                    : 'color:#8D8D8D;'}"
                                                        onclick="${gvc.event(() => {
                                                btn.event();
                                            })}"
                                                >
                                                    <div style="width: 28px;height: 28px;">
                                                        ${drawIcon(method.method === btn.value, btn.value)}
                                                    </div>
                                                    <div style="font-size: 16px;font-weight: 500;letter-spacing: 0.64px;">
                                                        ${btn.title}
                                                    </div>
                                                </div>
                                            `;
                                        })
                                        .join('');
                                })()}
</div>`,

                                `<i class="fa-solid fa-xmark position-absolute fs-5" style="right: 20px;top:20px;cursor: pointer;" onclick="${gvc.event(() => {
                                    gvc.closeDialog()
                                })}"></i>`,
                                `<div class="d-flex align-items-center justify-content-end w-100" style="gap:10px;">
${BgWidget.cancel(gvc.event(() => {
                                    gvc.closeDialog()
                                }))}
${BgWidget.save(gvc.event(() => {
                                    callback(method)
                                    gvc.closeDialog()
                                }))}
</div>`
                            ].join('<div class="my-2"></div>')
                        } catch (e) {
                            return `${e}`
                        }

                    },
                    divCreate: {
                        class: `p-lg-4 p-2 py-3`, style: css`max-width: calc(100vw - 10px);
                            position: relative;
                            width: 546px;
                            max-height: calc(100vh - 100px);
                            overflow-y: auto;
                            border-radius: 10px;
                            background: #FFF;
                            display: flex;
                            align-items: center;
                            flex-direction: column;
                            justify-content: center;
                        `
                    }
                }
            })
        }, `wqkwopq`)
    }

    //選擇暫存訂單
    public static selectTempOrder(gvc2: GVC) {
        const dialog = new ShareDialog(gvc2.glitter)
        if (!TempOrder.getTempOrders().length) {
            dialog.errorMessage({text: '尚無暫存訂單'})
            return
        }
        gvc2.glitter.innerDialog((gvc) => {
            return gvc.bindView(() => {
                const id = gvc.glitter.getUUID()
                return {
                    bind: id,
                    view: () => {
                        try {
                            return [
                                PosWidget.bigTitle('暫存訂單'),
                                `<div style="color: #8D8D8D; text-align: center; font-size: 16px;
                                    font-style: normal;
                                    font-weight: 400;
                                    margin-top: 8px;
                                    margin-bottom: 24px;
                                    line-height: normal;
                                ">請注意，暫存訂單將保留 1 天，逾時則需重新建立。</div>`,
                                `<div class="d-flex align-items-center justify-content-center w-100 mt-lg-4 mt-1" style="">
<div class="d-flex" style="flex:160;">
${PosWidget.fontBold('暫存時間')}
</div>
<div class="d-flex" style="flex:94;">
${PosWidget.fontBold('商品數量')}
</div>
<div class="d-flex" style="flex:54;">
${PosWidget.fontBold('總金額')}
</div>
<div class="d-flex" style="flex:34;">
</div>
</div>`,
                                TempOrder.getTempOrders().reverse().map((dd) => {
                                    return html`
                                        <div class="d-flex align-items-center justify-content-center w-100 mt-lg-4 mt-1"
                                             style="height:40px;">
                                            <div class="d-flex" style="flex:160;color:#36B;cursor: pointer;"
                                                 onclick="${gvc.event(() => {
                                                     PaymentPage.storeHistory(dd);
                                                     gvc.closeDialog()
                                                     localStorage.setItem('show_pos_page', 'payment')
                                                     gvc.glitter.share.reloadPosPage()
                                                 })}">
                                                ${gvc.glitter.ut.dateFormat(new Date(dd.reserve_date!!), 'yyyy-MM-dd hh:mm:ss')}
                                            </div>
                                            <div class="d-flex" style="flex:94;">
                                                ${dd.lineItems.map((dd) => {
                                                    return dd.count
                                                }).reduce((a, b) => a + b)}
                                            </div>
                                            <div class="d-flex" style="flex:54;">
                                                ${dd.subtotal.toLocaleString()}
                                            </div>
                                            <div class="d-flex" style="flex:34;">
                                                <i class="fa-solid fa-xmark fs-5" style="cursor: pointer;"
                                                   onclick="${gvc.event(() => {
                                                       TempOrder.removeTempOrders(dd.orderID!!)
                                                       gvc.glitter.share.reloadPosPage()
                                                       gvc.closeDialog()
                                                   })}"></i>
                                            </div>
                                        </div>`
                                }).join(''),
                                `<i class="fa-solid fa-xmark position-absolute fs-5" style="right: 20px;top:20px;cursor: pointer;" onclick="${gvc.event(() => {
                                    gvc.closeDialog()
                                })}"></i>`
                            ].join('')
                        } catch (e) {
                            return `${e}`
                        }

                    },
                    divCreate: {
                        class: `p-lg-5 p-2 py-3`, style: css`max-width: calc(100vw - 10px);
                            position: relative;
                            width: 846px;
                            max-height: calc(100vh - 100px);
                            overflow-y: auto;
                            border-radius: 10px;
                            background: #FFF;
                            display: flex;
                            align-items: center;
                            flex-direction: column;
                            justify-content: center;
                        `
                    }
                }
            })
        }, ``)
    }
}