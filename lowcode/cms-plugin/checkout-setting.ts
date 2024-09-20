import {GVC} from "../glitterBundle/GVController.js";
import {BgWidget} from "../backend-manager/bg-widget.js";
import {ShareDialog} from "../glitterBundle/dialog/ShareDialog.js";
import {ApiUser} from "../glitter-base/route/user.js";

const html = String.raw

export class CheckoutSetting {
    public static main(gvc: GVC) {

const dialog=new ShareDialog(gvc.glitter)
        return gvc.bindView(()=>{
            const bind=gvc.glitter.getUUID()
            return {
                bind:bind,
                view:async ()=>{
                    const appData = (await ApiUser.getPublicConfig('store-information', 'manager')).response.value;
                    appData.support_pos_payment=appData.support_pos_payment ?? []
                    return `
    <div class="d-flex w-100 align-items-center my-3">
        ${BgWidget.title('結帳設定')}
        <div class="flex-fill"></div>
    </div>
    ${gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                return [
                                    {
                                        title: '列印收執聯',
                                        value: 'execution_slip',
                                        src: '<i class="fa-solid fa-box-archive fs-1"></i>',
                                    },
                                    {
                                        title: '取餐叫號',
                                        value: 'call_order',
                                        src: '<i class="fa-solid fa-bell fs-1"></i>',
                                    }
                                ]
                                    .map((dd) => {
                                        return html`<div class="col-12 col-md-4 mb-3 p-0 p-md-2">
                                                        <div
                                                            class="w-100"
                                                            style=" padding: 24px; background: white; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.08); border-radius: 10px; overflow: hidden; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 18px; display: inline-flex"
                                                        >
                                                            <div style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 28px; display: inline-flex">
                                                                ${dd.src}
                                                                <div style="flex-direction: column; justify-content: center; align-items: flex-start; gap: 4px; display: inline-flex">
                                                                    <div class="tx_normal">${dd.title}</div>
                                                                    <div class="d-flex align-items-center" style="gap:4px;">
                                                                        <div class="tx_normal">
                                                                            ${appData[dd.value]
                                            ? `開啟`
                                            : `關閉`}
                                                                        </div>
                                                                        <div class="cursor_pointer form-check form-switch" style="margin-top: 10px;">
                                                                            <input
                                                                                class=" form-check-input"
                                                                                style=" "
                                                                                type="checkbox"
                                                                                value=""
                                                                                onchange="${gvc.event((e, event) => {
                                                                                    appData[dd.value]=!appData[dd.value]
                                            gvc.notifyDataChange(id);
                                        })}"
                                                                                ${appData[dd.value]
                                            ? `checked`
                                            : ``}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>`;
                                    })
                                    .join('');
                            },
                            divCreate: {
                                class: 'row guide3-3 m-0',
                                style: '',
                            },
                        };
                    })}
<div class="update-bar-container">
                                    ${BgWidget.save(
                        gvc.event(() => {
                            dialog.dataLoading({visible:true})
                            ApiUser.setPublicConfig({
                                key:'store-information',user_id:'manager',
                                value:JSON.stringify(appData)
                            }).then((res)=>{
                                dialog.dataLoading({visible:false})
                                dialog.successMessage({text:'儲存成功'})
                            })
                        })
                    )}
                                </div>
`
                },
                divCreate:{
                    class:`mx-3`,style:``
                }
            }
        })
    }

    public static paymentMethod() {

    }
}

(window as any).glitter.setModule(import.meta.url, CheckoutSetting);