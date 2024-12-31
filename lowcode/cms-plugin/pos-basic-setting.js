var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BgWidget } from "../backend-manager/bg-widget.js";
import { ShareDialog } from "../glitterBundle/dialog/ShareDialog.js";
import { ApiUser } from "../glitter-base/route/user.js";
const html = String.raw;
export class PosBasicSetting {
    static main(gvc) {
        const dialog = new ShareDialog(gvc.glitter);
        return gvc.bindView(() => {
            const bind = gvc.glitter.getUUID();
            return {
                bind: bind,
                view: () => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const appData = (yield ApiUser.getPublicConfig('store-information', 'manager')).response.value;
                    appData.support_pos_payment = (_a = appData.support_pos_payment) !== null && _a !== void 0 ? _a : [];
                    return `<div class="my-3" style="color: #393939; font-size: 24px; font-weight: 700; word-wrap: break-word;">
        商店訊息
    </div>
    <div class="guide6-3 mt-0"
         style="width: 100%; padding: 24px; background: white; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.08); border-radius: 10px; overflow: hidden; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 18px; display: inline-flex;margin-top: 24px;"
    >
        <div class=""
             style="color: #393939; font-size: 16px;  font-weight: 700; word-wrap: break-word;"
        >商店基本資訊
        </div>
        <div class="w-100 row mx-n2">
            ${[
                        BgWidget.editeInput({
                            gvc: gvc,
                            title: '商店名稱',
                            default: appData.shop_name || '',
                            placeHolder: '請輸入商店名稱',
                            callback: (text) => {
                                appData.shop_name = text;
                            },
                        }),
                        BgWidget.editeInput({
                            gvc: gvc,
                            title: '公司統編',
                            default: appData.ubn || '',
                            placeHolder: '請輸入公司統編',
                            callback: (text) => {
                                appData.ubn = text;
                            },
                        }),
                    ].map((dd) => {
                        return `<div class="col-12 col-sm-6">${dd}</div>`;
                    }).join('')}
        </div>
    </div>
    <div class="d-flex w-100 align-items-center my-3">
        ${BgWidget.title('付款設定')}
        <div class="flex-fill"></div>
    </div>
    ${gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                return [
                                    {
                                        title: '現金付款',
                                        value: 'cash',
                                        src: '<i class="fa-regular fa-coins fs-1"></i>',
                                    },
                                    {
                                        title: '信用卡付款',
                                        value: 'creditCard',
                                        src: '<i class="fa-regular fa-credit-card fs-1"></i>',
                                    },
                                    {
                                        title: 'LINE PAY付款',
                                        value: 'line',
                                        src: '<i class="fa-brands fa-line fs-1"></i>',
                                    }
                                ]
                                    .map((dd) => {
                                    return html `<div class="col-12 col-md-4 mb-3 p-0 p-md-2">
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
                                                                            ${appData.support_pos_payment.find((d1) => {
                                        return dd.value === d1;
                                    })
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
                                        if (appData.support_pos_payment.find((d1) => {
                                            return dd.value === d1;
                                        })) {
                                            appData.support_pos_payment = appData.support_pos_payment.filter((d1) => {
                                                return dd.value !== d1;
                                            });
                                        }
                                        else {
                                            appData.support_pos_payment.push(dd.value);
                                        }
                                        gvc.notifyDataChange(id);
                                    })}"
                                                                                ${appData.support_pos_payment.find((d1) => {
                                        return dd.value === d1;
                                    })
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
                                    ${BgWidget.save(gvc.event(() => {
                        dialog.dataLoading({ visible: true });
                        ApiUser.setPublicConfig({
                            key: 'store-information', user_id: 'manager',
                            value: JSON.stringify(appData)
                        }).then((res) => {
                            dialog.dataLoading({ visible: false });
                            dialog.successMessage({ text: '儲存成功' });
                        });
                    }))}
                                </div>
`;
                }),
                divCreate: {
                    class: `mx-3`, style: ``
                }
            };
        });
    }
    static paymentMethod() {
    }
}
window.glitter.setModule(import.meta.url, PosBasicSetting);
