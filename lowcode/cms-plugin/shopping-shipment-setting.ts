import {GVC} from '../glitterBundle/GVController.js';
import {ShoppingProductSetting} from './shopping-product-setting.js';
import {ShareDialog} from '../glitterBundle/dialog/ShareDialog.js';
import {BgWidget} from '../backend-manager/bg-widget.js';
import {EditorElem} from '../glitterBundle/plugins/editor-elem.js';
import * as vm from "vm";

export class ShoppingShipmentSetting {
    public static main(gvc: GVC) {
        const saasConfig: {
            config: any;
            api: any;
        } = (window.parent as any).saasConfig;
        const html = String.raw;
        const dialog = new ShareDialog(gvc.glitter);
        let keyData: {
            basic_fee: number;
            weight: number;
        } = {
            basic_fee: 0,
            weight: 0,
        };

        let vm: {
            id: string,
            formData: any,
        } = {
            id: gvc.glitter.getUUID(),
            formData: []
        }

        let shipmentArray: {
            weight: [
                { key: number, value: number }
            ],
            volume: [
                { key: number, value: number }
            ],
            selectCalc: string,
        } = {
            weight: [
                {key: 0, value: 0}
            ],
            volume: [
                {key: 0, value: 0}
            ],
            selectCalc : "weight",

        }
        let data :any={}
        function save(next: () => void) {

            const dialog = new ShareDialog(gvc.glitter);
            dialog.dataLoading({ text: '設定中', visible: true });
            saasConfig.api.setPrivateConfig(saasConfig.config.appName, `glitter_shipment`, shipmentArray).then((r: { response: any; result: boolean }) => {
                dialog.dataLoading({ visible: false });
                if (r.response) {
                    next();
                } else {
                    dialog.errorMessage({ text: '設定失敗' });
                }
            });
        }

        return BgWidget.container(
            html`
                <div class="d-flex w-100 align-items-center mb-3 ">
                    ${BgWidget.title(`運費設定`)}
                    <div class="flex-fill"></div>
                    ${BgWidget.darkButton(
                            '儲存並更改',
                            gvc.event(() => {
                                save(() => {
                                    dialog.successMessage({
                                        text: '設定成功',
                                    });
                                });
                            })
                    )}
                </div>
                ${gvc.bindView(() => {
                    const id = gvc.glitter.getUUID();
                    return {
                        bind: id,
                        view: () => {
                            return new Promise(async (resolve, reject) => {
                                if (!data.response){
                                    data = await saasConfig.api.getPrivateConfig(saasConfig.config.appName, `glitter_shipment`);
                                    if (data.response.result[0]) {
                                        // keyData = data.response.result[0].value;
                                        if((Array.isArray(data.response.result[0].value.weight))){
                                            shipmentArray = data.response.result[0].value;
                                        }
                                    }
                                }
                                gvc.addStyle(`
                                    /* 隱藏 Chrome, Safari, Edge 的箭頭 */
                                    input[type=number]::-webkit-outer-spin-button,
                                    input[type=number]::-webkit-inner-spin-button {
                                        -webkit-appearance: none;
                                        margin: 0;
                                    }
                                    
                                    /* 隱藏 Firefox 的箭頭 */
                                    input[type=number] {
                                        -moz-appearance: textfield;
                                    }
                                `)

                                resolve(gvc.bindView({
                                    bind: "addShipment",
                                    view: () => {
                                        return BgWidget.container(
                                                [
                                                    BgWidget.container(html`
                                                        ${BgWidget.mainCard(html`
                                                            <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 18px;">
                                                                <div style="font-size: 16px;font-weight: 700;">
                                                                    依材積計算
                                                                </div>
                                                                <div style="display: flex;flex-direction: column;align-items: center;gap: 8px;align-self: stretch;">
                                                                    <div style="display: flex;align-items: flex-start;gap: 12px;align-self: stretch;font-size: 16px;font-weight: 400;">
                                                                        <div class="w-50">材積區間</div>
                                                                        <div class="w-50">運費</div>
                                                                    </div>
                                                                    <div style="display: flex;flex-direction: column;align-items: center;gap: 18px;align-self: stretch;gap:8px;">
                                                                        ${(() => {
                                                                            let temp = ``
                                                                            shipmentArray.volume.map((data,index) => {
                                                                                temp += html`
                                                                                    <div class="d-flex w-100 position-relative align-items-center"
                                                                                         style="">
                                                                                        <div class="flex-fill position-relative">
                                                                                            <input class="w-100"
                                                                                                   style="padding: 9px 18px;border-radius: 10px;height:40px;border: 1px solid #DDD;"
                                                                                                   type="number"
                                                                                                   placeholder="0"
                                                                                                   onchange="${gvc.event((e) => {
                                                                                                       data.key = e.value;
                                                                                                       gvc.notifyDataChange(id);
                                                                                                   })}"
                                                                                                   value="${data.key ?? ''}">
                                                                                            <div style="color: #8D8D8D;position: absolute;top:9px;right:18px;">
                                                                                                公分(含)以上
                                                                                            </div>
                                                                                        </div>
                                                                                        <div style="width:18px;"></div>
                                                                                        <div class="flex-fill position-relative">
                                                                                            <input class="w-100"
                                                                                                   style="padding: 9px 18px;border-radius: 10px;height:40px;border: 1px solid #DDD;"
                                                                                                   type="number"
                                                                                                   placeholder="0"
                                                                                                   onchange="${gvc.event((e) => {
                                                                                                       data.value = e.value;
                                                                                                       gvc.notifyDataChange(id);
                                                                                                   })}"
                                                                                                   value="${data.value ?? ''}">
                                                                                            <div style="color: #8D8D8D;position: absolute;top:9px;right:18px;">
                                                                                                元
                                                                                            </div>
                                                                                        </div>
                                                                                        
                                                                                        <div class="p-3 pe-0" style="cursor: pointer;" onclick="${gvc.event(()=>{
                                                                                            dialog.checkYesOrNot({
                                                                                                text : "是否要刪除",
                                                                                                callback:(response)=>{
                                                                                                    if (response){
                                                                                                        shipmentArray.volume.splice(index, 1);
                                                                                                        gvc.notifyDataChange(id)
                                                                                                    }
                                                                                                }
                                                                                            })

                                                                                        })}"><i class="fa-duotone fa-xmark"></i></div>
                                                                                    </div>

                                                                                `
                                                                            })
                                                                            return temp
                                                                        })()}

                                                                    </div>
                                                                </div>
                                                                <div class="w-100 d-flex align-items-center justify-content-center"
                                                                     style="color: #36B;font-size: 16px;font-weight: 400;cursor: pointer;"
                                                                     onclick="${gvc.event(() => {
                                                                         shipmentArray.volume.push({key: 0, value: 0});
                                                                         gvc.notifyDataChange('addShipment');
                                                                     })}">
                                                                    新增一個區間<i class="fa-solid fa-plus"
                                                                                   style="font-size: 16px;height: 14px;width: 14px;"></i>
                                                                </div>
                                                                <div style="display: flex;align-items: center;gap: 6px;align-self: stretch;font-size: 16px;cursor: pointer;"
                                                                     onclick="${gvc.event(() => {
                                                                         shipmentArray.selectCalc = "volume";
                                                                         gvc.notifyDataChange(id);
                                                                     })}">
                                                                    ${(() => {
                                                                        if (shipmentArray.selectCalc == "volume") {
                                                                            return `
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                                              <rect width="16" height="16" rx="3" fill="#393939"/>
                                                                              <path d="M4.5 8.5L7 11L11.5 5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                            </svg>
                                                                            新增商品時將套用此運費計算方式
                                                                            `
                                                                        } else {
                                                                            return `
                                                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <rect x="0.5" y="0.5" width="15" height="15" rx="2.5" stroke="#DDDDDD"/>
                                                                            </svg>
                                                                            新增商品時將套用此運費計算方式
                                                                            `
                                                                        }
                                                                    })()}
                                                                </div>
                                                            </div>
                                                        `)}
                                                        <div style="margin-bottom: 24px;"></div>
                                                        ${BgWidget.mainCard(html`
                                                            <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 18px;">
                                                                <div style="font-size: 16px;font-weight: 700;">
                                                                    依重量計算
                                                                </div>
                                                                <div style="display: flex;flex-direction: column;align-items: center;gap: 8px;align-self: stretch;">
                                                                    <div style="display: flex;align-items: flex-start;gap: 12px;align-self: stretch;font-size: 16px;font-weight: 400;">
                                                                        <div class="w-50">重量區間</div>
                                                                        <div class="w-50">運費</div>
                                                                    </div>
                                                                    <div style="display: flex;flex-direction: column;align-items: center;gap: 18px;align-self: stretch;gap:8px;">
                                                                        ${(() => {
                                                                            let temp = ``
                                                                            shipmentArray.weight.map((data,index) => {
                                                                                temp += html`
                                                                                    <div class="d-flex w-100 align-items-center"
                                                                                         style="position:relative;">
                                                                                        <div class="flex-fill position-relative" style="margin-right: 18px;">
                                                                                            <input class="w-100"
                                                                                                   style="padding: 9px 18px;border-radius: 10px;height:40px;border: 1px solid #DDD;"
                                                                                                   type="number"
                                                                                                   placeholder="0"
                                                                                                   onchange="${gvc.event((e) => {
                                                                                                       data.key = e.value;
                                                                                                       gvc.notifyDataChange(id);
                                                                                                   })}"
                                                                                                   value="${data.key ?? ''}">
                                                                                            <div style="color: #8D8D8D;position: absolute;top:9px;right:18px;">
                                                                                                公分(含)以上
                                                                                            </div>
                                                                                        </div>
                                                                                        <div class="flex-fill position-relative">
                                                                                            <input class="w-100"
                                                                                                   style="padding: 9px 18px;border-radius: 10px;height:40px;border: 1px solid #DDD;"
                                                                                                   type="number"
                                                                                                   placeholder="0"
                                                                                                   onchange="${gvc.event((e) => {
                                                                                                       data.value = e.value;
                                                                                                       gvc.notifyDataChange(id);
                                                                                                   })}"
                                                                                                   value="${data.value ?? ''}">
                                                                                            <div style="color: #8D8D8D;position: absolute;top:9px;right:18px;">
                                                                                                元
                                                                                            </div>
                                                                                        </div>
                                                                                        <div class="p-3 pe-0" style="cursor: pointer; onclick="${gvc.event(()=>{
                                                                                            dialog.checkYesOrNot({
                                                                                                text : "是否要刪除",
                                                                                                callback:(response)=>{
                                                                                                    if (response){
                                                                                                        shipmentArray.weight.splice(index, 1);
                                                                                                        gvc.notifyDataChange(id)
                                                                                                    }
                                                                                                }
                                                                                            })
                                                                                           
                                                                                        })}"><i class="fa-duotone fa-xmark"></i></div>
                                                                                    </div>

                                                                                `
                                                                            })
                                                                            return temp
                                                                        })()}

                                                                    </div>
                                                                </div>
                                                                <div class="w-100 d-flex align-items-center justify-content-center"
                                                                     style="color: #36B;font-size: 16px;font-weight: 400;cursor: pointer;"
                                                                     onclick="${gvc.event(() => {
                                                                         shipmentArray.weight.push({key: 0, value: 0});
                                                                         gvc.notifyDataChange('addShipment');
                                                                     })}">
                                                                    新增一個區間<i class="fa-solid fa-plus"
                                                                                   style="font-size: 16px;height: 14px;width: 14px;"></i>
                                                                </div>
                                                                <div style="display: flex;align-items: center;gap: 6px;align-self: stretch;font-size: 16px;cursor: pointer;"
                                                                     onclick="${gvc.event(() => {
                                                                         shipmentArray.selectCalc = "weight";
                                                                         gvc.notifyDataChange(id);
                                                                     })}">
                                                                    ${(() => {
                                                                        if (shipmentArray.selectCalc == "weight") {
                                                                            return `
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                                              <rect width="16" height="16" rx="3" fill="#393939"/>
                                                                              <path d="M4.5 8.5L7 11L11.5 5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                            </svg>
                                                                            新增商品時將套用此運費計算方式
                                                                            `
                                                                        } else {
                                                                            return `
                                                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <rect x="0.5" y="0.5" width="15" height="15" rx="2.5" stroke="#DDDDDD"/>
                                                                            </svg>
                                                                            新增商品時將套用此運費計算方式
                                                                            `
                                                                        }
                                                                    })()}
                                                                </div>
                                                            </div>


                                                        `)}
                                                    `, undefined, 'padding: 0; margin: 0 !important; width: 73.5%;')
                                                    , BgWidget.container(html`
                                                    ${BgWidget.mainCard(html`
                                                        <div style="gap: 18px;display: flex;flex-direction: column;">
                                                            <div style="font-size: 16px;font-weight: 700;">摘要</div>
                                                            <div style="font-size: 16px;font-weight: 400;">預設運費設定:
                                                                依${(shipmentArray.selectCalc == "weight"?"重量":"材積")}計算
                                                            </div>
                                                            <div style="width:100%;height:1px;background-color: #DDD"></div>
                                                            <div style="display: flex;flex-direction: column;gap: 12px;">
                                                                <div style="color:#393939;font-weight: 400;font-size: 16px;">
                                                                    依材積計算:
                                                                </div>
                                                                <div style="border-radius: 10px;border: 1px solid #DDD;color: #393939;font-weight: 400;font-size: 14px;padding: 20px;gap:12px;">
                                                                    ${(() => {
                                                                        let returnHTML = ``;
                                                                        shipmentArray.volume.map((data) => {
                                                                            returnHTML += html`
                                                                                <div class="">
                                                                                    <span style="font-size: 24px;">${data.key}</span>
                                                                                    公分(含)以上,運費
                                                                                    <span style="font-size: 24px;">${data.value}</span>
                                                                                    元
                                                                                </div>

                                                                            `
                                                                        })
                                                                        return returnHTML
                                                                    })()}
                                                                </div>
                                                            </div>
                                                            <div style="display: flex;flex-direction: column;gap: 12px;">
                                                                <div style="color:#393939;font-weight: 400;font-size: 16px;">
                                                                    依重量計算:
                                                                </div>
                                                                <div style="border-radius: 10px;border: 1px solid #DDD;color: #393939;font-weight: 400;font-size: 14px;padding: 20px;">
                                                                    ${(() => {
                                                                        let returnHTML = ``;
                                                                        shipmentArray.weight.map((data) => {
                                                                            returnHTML += html`
                                                                                <div class="">
                                                                                    <span style="font-size: 24px;">${data.key}</span>
                                                                                    公斤(含)以上,運費
                                                                                    <span style="font-size: 24px;">${data.value}</span>
                                                                                    元
                                                                                </div>

                                                                            `
                                                                        })
                                                                        return returnHTML
                                                                    })()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    `)}

                                                `, undefined, 'padding: 0; margin: 0 !important; width: 26.5%;min-width:300px;')
                                                ].join('')
                                                , undefined, `padding-bottom:240px;gap:24px;color:#393939;width:100%;color:#393939;display:flex;`)
                                    },
                                    divCreate: {class: `w-100`, style: ``}
                                }))
                                resolve(html`
                                    <div style="width:900px;max-width:100%;">
                                        ${BgWidget.card(
                                                [
                                                    html`
                                                        <div class="alert alert-info">總運費金額為 = 基本運費 + (
                                                            商品運費權重*每單位費用 )
                                                        </div>`,
                                                    EditorElem.editeInput({
                                                        gvc: gvc,
                                                        title: '基本運費',
                                                        default: `${keyData.basic_fee || 0}`,
                                                        callback: (text) => {
                                                            keyData.basic_fee = parseInt(text);
                                                        },
                                                        placeHolder: '請輸入基本運費',
                                                    }),
                                                    EditorElem.editeInput({
                                                        gvc: gvc,
                                                        title: '每單位費用',
                                                        default: `${keyData.weight || 0}`,
                                                        callback: (text) => {
                                                            keyData.weight = parseInt(text);
                                                        },
                                                        placeHolder: '請輸入每單位費用',
                                                    }),
                                                ].join('<div class="my-2"></div>')
                                        )}
                                    </div>`);
                            });
                        },
                        divCreate: {class: `d-flex flex-column flex-column-reverse  flex-md-row`, style: `gap:10px;`},
                    };
                })}
            `,
            900
        );
    }
}

(window as any).glitter.setModule(import.meta.url, ShoppingShipmentSetting);
