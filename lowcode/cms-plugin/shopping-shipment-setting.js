var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ShareDialog } from "../dialog/ShareDialog.js";
import { BgWidget } from "../backend-manager/bg-widget.js";
import { EditorElem } from "../glitterBundle/plugins/editor-elem.js";
export class ShoppingShipmentSetting {
    static main(gvc) {
        const saasConfig = window.parent.saasConfig;
        const html = String.raw;
        const dialog = new ShareDialog(gvc.glitter);
        let keyData = {
            basic_fee: 0,
            weight: 0
        };
        function save(next) {
            const dialog = new ShareDialog(gvc.glitter);
            dialog.dataLoading({ text: '設定中', visible: true });
            saasConfig.api.setPrivateConfig(saasConfig.config.appName, `glitter_shipment`, keyData).then((r) => {
                dialog.dataLoading({ visible: false });
                if (r.response) {
                    next();
                }
                else {
                    dialog.errorMessage({ text: "設定失敗" });
                }
            });
        }
        return BgWidget.container(html `
            <div class="d-flex w-100 align-items-center mb-3 ">
                ${BgWidget.title(`運費設定`)}
                <div class="flex-fill"></div>
                <button class="btn btn-primary-c" style="height:38px;font-size: 14px;" onclick="${gvc.event(() => {
            save(() => {
                dialog.successMessage({
                    text: '設定成功'
                });
            });
        })}">儲存並更改
                </button>
            </div>
            ${gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        const data = yield saasConfig.api.getPrivateConfig(saasConfig.config.appName, `glitter_shipment`);
                        if (data.response.result[0]) {
                            keyData = data.response.result[0].value;
                        }
                        resolve(` <div style="width:900px;max-width:100%;"> ${BgWidget.card([
                            `<div class="alert alert-info">
總運費金額為 = 基本運費 + ( 商品運費權重*每單位費用 )
</div>`,
                            EditorElem.editeInput({
                                gvc: gvc,
                                title: '基本運費',
                                default: `${keyData.basic_fee || 0}`,
                                callback: (text) => {
                                    keyData.basic_fee = parseInt(text);
                                },
                                placeHolder: '請輸入基本運費'
                            }),
                            EditorElem.editeInput({
                                gvc: gvc,
                                title: '每單位費用',
                                default: `${keyData.weight || 0}`,
                                callback: (text) => {
                                    keyData.weight = parseInt(text);
                                },
                                placeHolder: '請輸入每單位費用'
                            })
                        ].join('<div class="my-2"></div>'))}
                </div>`);
                    }));
                },
                divCreate: { class: `d-flex flex-column flex-column-reverse  flex-md-row`, style: `gap:10px;` }
            };
        })}
        `, 900);
    }
}
window.glitter.setModule(import.meta.url, ShoppingShipmentSetting);
