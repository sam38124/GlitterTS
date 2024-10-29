var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
export class ShoppingShipmentSetting {
    static main(gvc) {
        const saasConfig = window.parent.saasConfig;
        const html = String.raw;
        const dialog = new ShareDialog(gvc.glitter);
        const page_id = gvc.glitter.getUUID();
        let keyData = {
            basic_fee: 0,
            weight: 0,
        };
        let shipmentArray = {
            weight: [{ key: 0, value: 0 }],
            volume: [{ key: 0, value: 0 }],
            selectCalc: 'weight',
        };
        let data = {};
        let page = 'def';
        function save(next) {
            const dialog = new ShareDialog(gvc.glitter);
            dialog.dataLoading({ text: '設定中', visible: true });
            saasConfig.api
                .setPrivateConfig(saasConfig.config.appName, (() => {
                if (page === 'def') {
                    return `glitter_shipment`;
                }
                else {
                    return `glitter_shipment_${page}`;
                }
            })(), shipmentArray)
                .then((r) => {
                dialog.dataLoading({ visible: false });
                if (r.response) {
                    next();
                }
                else {
                    dialog.errorMessage({ text: '設定失敗' });
                }
            });
        }
        return (BgWidget.container(html `
                    <div class="title-container">
                        ${BgWidget.title('運費設定')}
                        <div class="flex-fill"></div>
                    </div>
                    ${gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        var _a;
                        const logistics_setting = ((_a = (yield saasConfig.api.getPrivateConfig(saasConfig.config.appName, 'logistics_setting')).response.result[0]) !== null && _a !== void 0 ? _a : { value: {} }).value;
                        resolve(BgWidget.tab([
                            {
                                title: '預設運費',
                                key: 'def',
                            },
                            ...(() => {
                                var _a;
                                return [
                                    {
                                        title: '一般宅配',
                                        key: 'normal',
                                    },
                                    {
                                        title: '全家店到店',
                                        key: 'FAMIC2C',
                                    },
                                    {
                                        title: '萊爾富店到店',
                                        key: 'HILIFEC2C',
                                    },
                                    {
                                        title: 'OK超商店到店',
                                        key: 'OKMARTC2C',
                                    },
                                    {
                                        title: '7-ELEVEN超商交貨便',
                                        key: 'UNIMARTC2C',
                                    },
                                    {
                                        title: '門市取貨',
                                        key: 'shop',
                                    },
                                ]
                                    .concat(((_a = logistics_setting.custom_delivery) !== null && _a !== void 0 ? _a : []).map((dd) => {
                                    return {
                                        title: dd.name,
                                        key: dd.id,
                                    };
                                }))
                                    .filter((d1) => {
                                    return logistics_setting.support.find((d2) => {
                                        return d2 === d1.key;
                                    });
                                });
                            })(),
                            ...(() => {
                                return [];
                            })(),
                        ], gvc, page, (text) => {
                            page = text;
                            data.response = undefined;
                            gvc.notifyDataChange([page_id, id]);
                        }, 'margin-bottom: 12px;'));
                    }));
                },
                divCreate: {
                    class: 'title-container',
                    style: 'overflow-x: auto;',
                },
            };
        })}
                    ${gvc.bindView(() => {
            return {
                bind: page_id,
                view: () => {
                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        if (!data.response) {
                            dialog.dataLoading({ visible: true });
                            shipmentArray = (yield ShoppingShipmentSetting.getShipmentData(page));
                            data.response = true;
                            dialog.dataLoading({ visible: false });
                        }
                        gvc.addStyle(`
                                        /* 隱藏 Chrome, Safari, Edge 的箭頭 */
                                        input[type='number']::-webkit-outer-spin-button,
                                        input[type='number']::-webkit-inner-spin-button {
                                            -webkit-appearance: none;
                                            margin: 0;
                                        }

                                        /* 隱藏 Firefox 的箭頭 */
                                        input[type='number'] {
                                            -moz-appearance: textfield;
                                        }
                                    `);
                        resolve(gvc.bindView({
                            bind: 'addShipment',
                            view: () => {
                                return BgWidget.container([
                                    BgWidget.container1x2({
                                        html: (() => {
                                            let view = [];
                                            if (page !== 'def') {
                                                view.push(BgWidget.mainCard(html `
                                                                                <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 18px;">
                                                                                    <div style="font-size: 16px;font-weight: 700;">運費計算方式</div>
                                                                                    ${EditorElem.select({
                                                    title: '',
                                                    def: shipmentArray.selectCalc === 'def' ? `def` : 'custom',
                                                    gvc: gvc,
                                                    array: [
                                                        {
                                                            title: '參照預設',
                                                            value: 'def',
                                                        },
                                                        {
                                                            title: '自定義',
                                                            value: 'custom',
                                                        },
                                                    ],
                                                    callback: (text) => {
                                                        if (text === 'def') {
                                                            shipmentArray.selectCalc = 'def';
                                                        }
                                                        else {
                                                            shipmentArray.selectCalc = 'weight';
                                                        }
                                                        gvc.notifyDataChange(page_id);
                                                    },
                                                })}
                                                                                </div>
                                                                            `));
                                            }
                                            if (shipmentArray.selectCalc !== 'def') {
                                                view = view.concat([
                                                    BgWidget.mainCard(html `
                                                                                <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 18px;">
                                                                                    <div class="w-100 guide4-3-1" style="font-size: 16px;font-weight: 700;">整份訂單的「總材積」計算</div>
                                                                                    <div
                                                                                        class="guide4-4"
                                                                                        style="display: flex;flex-direction: column;align-items: center;gap: 8px;align-self: stretch;"
                                                                                    >
                                                                                        <div
                                                                                            style="display: flex;align-items: flex-start;gap: 12px;align-self: stretch;font-size: 16px;font-weight: 400;"
                                                                                        >
                                                                                            <div style="width: 60%">材積區間</div>
                                                                                            <div style="width: 40%">運費</div>
                                                                                        </div>
                                                                                        <div style="display: flex;flex-direction: column;align-items: center;gap: 18px;align-self: stretch;gap:8px;">
                                                                                            ${(() => {
                                                        let temp = ``;
                                                        shipmentArray.volume.map((data, index) => {
                                                            var _a, _b;
                                                            temp += html `
                                                                                                        <div
                                                                                                            class="d-flex w-100 position-relative align-items-center"
                                                                                                            style="gap: ${document.body.clientWidth > 768 ? 18 : 6}px"
                                                                                                        >
                                                                                                            <div class="flex-fill position-relative" style="width: 60%">
                                                                                                                <input
                                                                                                                    class="w-100"
                                                                                                                    style="padding: 9px 18px;border-radius: 10px;height:40px;border: 1px solid #DDD;"
                                                                                                                    type="number"
                                                                                                                    placeholder="0"
                                                                                                                    onchange="${gvc.event((e) => {
                                                                data.key = e.value;
                                                                gvc.notifyDataChange(page_id);
                                                            })}"
                                                                                                                    value="${(_a = data.key) !== null && _a !== void 0 ? _a : ''}"
                                                                                                                />
                                                                                                                <div style="color: #8D8D8D;position: absolute;top:9px;right:18px;">
                                                                                                                    立方公分(含)以上
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div class="flex-fill position-relative" style="width: 35%">
                                                                                                                <input
                                                                                                                    class="w-100"
                                                                                                                    style="padding: 9px 18px;border-radius: 10px;height:40px;border: 1px solid #DDD;"
                                                                                                                    type="number"
                                                                                                                    placeholder="0"
                                                                                                                    onchange="${gvc.event((e) => {
                                                                data.value = e.value;
                                                                gvc.notifyDataChange(page_id);
                                                            })}"
                                                                                                                    value="${(_b = data.value) !== null && _b !== void 0 ? _b : ''}"
                                                                                                                />
                                                                                                                <div style="color: #8D8D8D;position: absolute;top:9px;right:18px;">元</div>
                                                                                                            </div>
                                                                                                            <div
                                                                                                                style="cursor: pointer; width: auto;"
                                                                                                                class="guide4-6"
                                                                                                                onclick="${gvc.event(() => {
                                                                if (data.value || data.key) {
                                                                    dialog.checkYesOrNot({
                                                                        text: '是否要刪除',
                                                                        callback: (response) => {
                                                                            if (response) {
                                                                                shipmentArray.volume.splice(index, 1);
                                                                                gvc.notifyDataChange(page_id);
                                                                            }
                                                                        },
                                                                    });
                                                                }
                                                                else {
                                                                    shipmentArray.volume.splice(index, 1);
                                                                    gvc.notifyDataChange(page_id);
                                                                }
                                                            })}"
                                                                                                            >
                                                                                                                <i class="fa-duotone fa-xmark"></i>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    `;
                                                        });
                                                        return temp;
                                                    })()}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div
                                                                                        class="w-100 d-flex align-items-center justify-content-center cursor_pointer guide4-5"
                                                                                        style="color: #36B; font-size: 16px; font-weight: 400;"
                                                                                        onclick="${gvc.event(() => {
                                                        shipmentArray.volume.push({
                                                            key: 0,
                                                            value: 0,
                                                        });
                                                        gvc.notifyDataChange('addShipment');
                                                    })}"
                                                                                    >
                                                                                        <div>新增一個區間</div>
                                                                                        <div>
                                                                                            <i class="fa-solid fa-plus ps-2" style="font-size: 16px; height: 14px; width: 14px;"></i>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div
                                                                                        style="display: flex;align-items: center;gap: 6px;align-self: stretch;font-size: 16px;cursor: pointer;"
                                                                                        class="guide4-7"
                                                                                        onclick="${gvc.event(() => {
                                                        shipmentArray.selectCalc = 'volume';
                                                        gvc.notifyDataChange(page_id);
                                                    })}"
                                                                                    >
                                                                                        ${(() => {
                                                        if (shipmentArray.selectCalc == 'volume') {
                                                            return html `
                                                                                                    <svg
                                                                                                        class="volumeSelect"
                                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                                        width="16"
                                                                                                        height="16"
                                                                                                        viewBox="0 0 16 16"
                                                                                                        fill="none"
                                                                                                    >
                                                                                                        <rect width="16" height="16" rx="3" fill="#393939" />
                                                                                                        <path
                                                                                                            d="M4.5 8.5L7 11L11.5 5"
                                                                                                            stroke="white"
                                                                                                            stroke-width="2"
                                                                                                            stroke-linecap="round"
                                                                                                            stroke-linejoin="round"
                                                                                                        />
                                                                                                    </svg>
                                                                                                    新增商品時將套用此運費計算方式
                                                                                                `;
                                                        }
                                                        else {
                                                            return html `
                                                                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                                        <rect x="0.5" y="0.5" width="15" height="15" rx="2.5" stroke="#DDDDDD" />
                                                                                                    </svg>
                                                                                                    新增商品時將套用此運費計算方式
                                                                                                `;
                                                        }
                                                    })()}
                                                                                    </div>
                                                                                </div>
                                                                            `),
                                                    BgWidget.mainCard(html `
                                                                                <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 18px;">
                                                                                    <div class="w-100 guide4-3-2" style="font-size: 16px;font-weight: 700;">整份訂單的「總重量」計算</div>
                                                                                    <div style="display: flex;flex-direction: column;align-items: center;gap: 8px;align-self: stretch;">
                                                                                        <div
                                                                                            style="display: flex;align-items: flex-start;gap: 12px;align-self: stretch;font-size: 16px;font-weight: 400;"
                                                                                        >
                                                                                            <div style="width: 60%">重量區間</div>
                                                                                            <div style="width: 40%">運費</div>
                                                                                        </div>
                                                                                        <div style="display: flex;flex-direction: column;align-items: center;gap: 18px;align-self: stretch;gap:8px;">
                                                                                            ${(() => {
                                                        let temp = ``;
                                                        shipmentArray.weight.map((data, index) => {
                                                            var _a, _b;
                                                            temp += html `
                                                                                                        <div
                                                                                                            class="d-flex w-100 align-items-center"
                                                                                                            style="position:relative; gap: ${document.body.clientWidth > 768 ? 18 : 6}px"
                                                                                                        >
                                                                                                            <div class="flex-fill position-relative" style="width: 60%">
                                                                                                                <input
                                                                                                                    class="w-100"
                                                                                                                    style="padding: 9px 18px;border-radius: 10px;height:40px;border: 1px solid #DDD;"
                                                                                                                    type="number"
                                                                                                                    placeholder="0"
                                                                                                                    onchange="${gvc.event((e) => {
                                                                data.key = e.value;
                                                                gvc.notifyDataChange(page_id);
                                                            })}"
                                                                                                                    value="${(_a = data.key) !== null && _a !== void 0 ? _a : ''}"
                                                                                                                />
                                                                                                                <div style="color: #8D8D8D;position: absolute;top:9px;right:18px;">公斤(含)以上</div>
                                                                                                            </div>
                                                                                                            <div class="flex-fill position-relative" style="width: 35%">
                                                                                                                <input
                                                                                                                    class="w-100"
                                                                                                                    style="padding: 9px 18px;border-radius: 10px;height:40px;border: 1px solid #DDD;"
                                                                                                                    type="number"
                                                                                                                    placeholder="0"
                                                                                                                    onchange="${gvc.event((e) => {
                                                                data.value = e.value;
                                                                gvc.notifyDataChange(page_id);
                                                            })}"
                                                                                                                    value="${(_b = data.value) !== null && _b !== void 0 ? _b : ''}"
                                                                                                                />
                                                                                                                <div style="color: #8D8D8D;position: absolute;top:9px;right:18px;">元</div>
                                                                                                            </div>
                                                                                                            <div
                                                                                                                style="cursor: pointer; width: auto"
                                                                                                                onclick="${gvc.event(() => {
                                                                dialog.checkYesOrNot({
                                                                    text: '是否要刪除',
                                                                    callback: (response) => {
                                                                        if (response) {
                                                                            shipmentArray.weight.splice(index, 1);
                                                                            gvc.notifyDataChange(page_id);
                                                                        }
                                                                    },
                                                                });
                                                            })}"
                                                                                                            >
                                                                                                                <i class="fa-duotone fa-xmark"></i>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    `;
                                                        });
                                                        return temp;
                                                    })()}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div
                                                                                        class="w-100 d-flex align-items-center justify-content-center cursor_pointer"
                                                                                        style="color: #36B; font-size: 16px; font-weight: 400;"
                                                                                        onclick="${gvc.event(() => {
                                                        shipmentArray.weight.push({
                                                            key: 0,
                                                            value: 0,
                                                        });
                                                        gvc.notifyDataChange('addShipment');
                                                    })}"
                                                                                    >
                                                                                        <div>新增一個區間</div>
                                                                                        <div>
                                                                                            <i class="fa-solid fa-plus ps-2" style="font-size: 16px; height: 14px; width: 14px;"></i>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div
                                                                                        style="display: flex;align-items: center;gap: 6px;align-self: stretch;font-size: 16px;cursor: pointer;"
                                                                                        onclick="${gvc.event(() => {
                                                        shipmentArray.selectCalc = 'weight';
                                                        gvc.notifyDataChange(page_id);
                                                    })}"
                                                                                    >
                                                                                        ${(() => {
                                                        if (shipmentArray.selectCalc == 'weight') {
                                                            return html `
                                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                                                                        <rect width="16" height="16" rx="3" fill="#393939" />
                                                                                                        <path
                                                                                                            d="M4.5 8.5L7 11L11.5 5"
                                                                                                            stroke="white"
                                                                                                            stroke-width="2"
                                                                                                            stroke-linecap="round"
                                                                                                            stroke-linejoin="round"
                                                                                                        />
                                                                                                    </svg>
                                                                                                    新增商品時將套用此運費計算方式
                                                                                                `;
                                                        }
                                                        else {
                                                            return html `
                                                                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                                        <rect x="0.5" y="0.5" width="15" height="15" rx="2.5" stroke="#DDDDDD" />
                                                                                                    </svg>
                                                                                                    新增商品時將套用此運費計算方式
                                                                                                `;
                                                        }
                                                    })()}
                                                                                    </div>
                                                                                </div>
                                                                            `),
                                                ]);
                                            }
                                            return view.join('<div style="margin-bottom: 24px;"></div>');
                                        })(),
                                        ratio: 65,
                                    }, {
                                        html: (() => {
                                            const id = gvc.glitter.getUUID();
                                            return gvc.bindView({
                                                bind: id,
                                                view: () => {
                                                    const ogShop = shipmentArray;
                                                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                                        const shipmentArray = ogShop.selectCalc !== 'def' ? ogShop : yield ShoppingShipmentSetting.getShipmentData('def');
                                                        resolve(`${BgWidget.mainCard(html `
                                                                                            <div style="gap: 18px;display: flex;flex-direction: column;">
                                                                                                <div style="font-size: 16px;font-weight: 700;">摘要</div>
                                                                                                <div style="font-size: 16px;font-weight: 400;">
                                                                                                    預設運費設定: 依${shipmentArray.selectCalc == 'weight' ? '重量' : '材積'} 計算
                                                                                                </div>
                                                                                                <div style="width:100%;height:1px;background-color: #DDD"></div>
                                                                                                <div style="display: flex;flex-direction: column;gap: 12px;">
                                                                                                    <div style="color:#393939;font-weight: 400;font-size: 16px;">依材積計算:</div>
                                                                                                    <div
                                                                                                        style="border-radius: 10px;border: 1px solid #DDD;color: #393939;font-weight: 400;font-size: 14px;padding: 20px;gap:12px;"
                                                                                                    >
                                                                                                        ${(() => {
                                                            let returnHTML = ``;
                                                            shipmentArray.volume.map((data) => {
                                                                returnHTML += html `
                                                                                                                    <div class="">
                                                                                                                        <span style="font-size: 24px;">${data.key}</span>
                                                                                                                        立方公分(含)以上,運費
                                                                                                                        <span style="font-size: 24px;">${data.value}</span>
                                                                                                                        元
                                                                                                                    </div>
                                                                                                                `;
                                                            });
                                                            return returnHTML;
                                                        })()}
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div style="display: flex;flex-direction: column;gap: 12px;">
                                                                                                    <div style="color:#393939;font-weight: 400;font-size: 16px;">依重量計算:</div>
                                                                                                    <div
                                                                                                        style="border-radius: 10px;border: 1px solid #DDD;color: #393939;font-weight: 400;font-size: 14px;padding: 20px;"
                                                                                                    >
                                                                                                        ${(() => {
                                                            let returnHTML = ``;
                                                            shipmentArray.weight.map((data) => {
                                                                returnHTML += html `
                                                                                                                    <div class="">
                                                                                                                        <span style="font-size: 24px;">${data.key}</span>
                                                                                                                        公斤(含)以上,運費
                                                                                                                        <span style="font-size: 24px;">${data.value}</span>
                                                                                                                        元
                                                                                                                    </div>
                                                                                                                `;
                                                            });
                                                            return returnHTML;
                                                        })()}
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        `)}`);
                                                    }));
                                                },
                                                divCreate: { class: `w-100 m-0 p-0 summary-card` },
                                            });
                                        })(),
                                        ratio: 35,
                                    }),
                                    BgWidget.mbContainer(240),
                                    html ` <div class="update-bar-container">
                                                            ${BgWidget.save(gvc.event(() => {
                                        save(() => {
                                            dialog.successMessage({
                                                text: '設定成功',
                                            });
                                        });
                                    }), '儲存', 'guide4-8')}
                                                        </div>`,
                                ].join(''));
                            },
                            divCreate: { class: `w-100`, style: `` },
                        }));
                    }));
                },
                divCreate: {
                    class: `d-flex flex-column flex-column-reverse flex-md-row`,
                    style: `gap:10px; padding: 0;`,
                },
            };
        })}
                `) + BgWidget.mbContainer(240));
    }
    static getShipmentData(page) {
        return __awaiter(this, void 0, void 0, function* () {
            let shipmentArray = {};
            const saasConfig = window.parent.saasConfig;
            const data = yield saasConfig.api.getPrivateConfig(saasConfig.config.appName, (() => {
                if (page === 'def') {
                    return `glitter_shipment`;
                }
                else {
                    return `glitter_shipment_${page}`;
                }
            })());
            if (data.response.result[0]) {
                if (Array.isArray(data.response.result[0].value.weight)) {
                    shipmentArray = data.response.result[0].value;
                }
            }
            else {
                if (page === 'def') {
                    shipmentArray = {
                        weight: [{ key: 0, value: 0 }],
                        volume: [{ key: 0, value: 0 }],
                        selectCalc: 'weight',
                    };
                }
                else {
                    shipmentArray = {
                        weight: [{ key: 0, value: 0 }],
                        volume: [{ key: 0, value: 0 }],
                        selectCalc: 'def',
                    };
                }
            }
            return shipmentArray;
        });
    }
}
window.glitter.setModule(import.meta.url, ShoppingShipmentSetting);
