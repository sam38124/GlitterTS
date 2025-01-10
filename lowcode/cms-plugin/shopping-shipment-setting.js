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
import { ApiUser } from "../glitter-base/route/user.js";
import { CountryTw } from "../modules/country-language/country-tw.js";
export class ShoppingShipmentSetting {
    static main(obj) {
        const saasConfig = window.parent.saasConfig;
        const html = String.raw;
        const gvc = obj.gvc;
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
        let support_country = [];
        let page = obj.key;
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
        obj.save_event = () => {
            return new Promise((resolve, reject) => {
                if (obj.key === 'global_express') {
                    ApiUser.setPublicConfig({
                        key: 'global_express_country', user_id: 'manager', value: {
                            country: support_country
                        }
                    });
                }
                save(() => {
                    dialog.successMessage({
                        text: '設定成功',
                    });
                    resolve(true);
                });
            });
        };
        const vm = {
            loading_country: false,
            loading_shipment: false
        };
        function getCountry() {
            return __awaiter(this, void 0, void 0, function* () {
                if (obj.key === 'global_express') {
                    support_country = (yield ApiUser.getPublicConfig('global_express_country', 'manager')).response.value.country;
                    if (support_country[0]) {
                        page = `global_${support_country[0]}`;
                    }
                }
                vm.loading_country = true;
                gvc.notifyDataChange(page_id);
            });
        }
        let origin_data = JSON.stringify(shipmentArray);
        function getShipmentSetting() {
            return __awaiter(this, void 0, void 0, function* () {
                shipmentArray = (yield ShoppingShipmentSetting.getShipmentData(page));
                shipmentArray = (shipmentArray.selectCalc !== 'def' ? shipmentArray : yield ShoppingShipmentSetting.getShipmentData('def'));
                shipmentArray.selectCalc = 'custom';
                origin_data = JSON.stringify(shipmentArray);
                vm.loading_shipment = true;
                gvc.notifyDataChange(page_id);
            });
        }
        function initial() {
            return __awaiter(this, void 0, void 0, function* () {
                yield getCountry();
                yield getShipmentSetting();
            });
        }
        initial();
        return (gvc.bindView(() => {
            return {
                bind: page_id,
                view: () => {
                    if (!vm.loading_country || !vm.loading_shipment) {
                        return BgWidget.spinner();
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
                    let select_country = CountryTw.find((dd) => {
                        return `global_${dd.countryCode}` === page;
                    });
                    select_country = select_country && select_country.countryName;
                    return [
                        gvc.bindView({
                            bind: 'addShipment',
                            view: () => {
                                function refresh_country() {
                                    gvc.notifyDataChange(page_id);
                                }
                                return BgWidget.container([
                                    BgWidget.container1x2({
                                        html: (() => {
                                            let view = [];
                                            if (shipmentArray.selectCalc !== 'def') {
                                                if (obj.key === 'global_express') {
                                                    view.push(BgWidget.mainCard(html `
                                                                    <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 18px;">
                                                                        <div style="font-size: 16px;font-weight: 700;">
                                                                            支援配送國家
                                                                        </div>
                                                                        <div class="d-flex flex-wrap"
                                                                             style="gap:15px;">
                                                                            ${support_country.map((dd, index) => {
                                                        var _a;
                                                        return `<div class="px-3 py-1 text-white position-relative d-flex align-items-center justify-content-center" style="border-radius: 20px;background: #393939;cursor: pointer;min-width:100px;" onclick="${gvc.event(() => {
                                                            BgWidget.settingDialog({
                                                                gvc: gvc,
                                                                title: '國家設定',
                                                                innerHTML: (gvc) => {
                                                                    return html `
                                                                                                <div class="w-100 d-flex align-items-center justify-content-end"
                                                                                                     style="gap:10px;">
                                                                                                    ${BgWidget.danger(gvc.event(() => {
                                                                        support_country.splice(index, 1);
                                                                        if (support_country.length) {
                                                                            page = `global_${support_country[0]}`;
                                                                        }
                                                                        refresh_country();
                                                                        gvc.closeDialog();
                                                                    }), '刪除國家')}
                                                                                                </div>`;
                                                                },
                                                                footer_html: (gvc) => {
                                                                    return ``;
                                                                },
                                                                width: 200
                                                            });
                                                        })}">${(_a = CountryTw.find((d1) => {
                                                            return d1.countryCode === dd;
                                                        })) === null || _a === void 0 ? void 0 : _a.countryName}
</div>
`;
                                                    }).join('')}
                                                                            <div class="d-flex align-items-center">
                                                                                ${[((support_country.length !== CountryTw.length) ? html `
                                                                                    <div class=" d-flex align-items-center justify-content-center cursor_pointer"
                                                                                         style="color: #36B; font-size: 16px; font-weight: 400;"
                                                                                         onclick="${gvc.event(() => {
                                                            let add = '';
                                                            BgWidget.settingDialog({
                                                                gvc: gvc,
                                                                title: '新增國家',
                                                                innerHTML: (gvc) => {
                                                                    let can_select = CountryTw.filter((dd) => {
                                                                        return !support_country.includes(dd.countryCode);
                                                                    });
                                                                    add = can_select[0].countryCode;
                                                                    return [
                                                                        BgWidget.select({
                                                                            gvc: gvc,
                                                                            default: add,
                                                                            options: can_select.map((dd) => {
                                                                                return {
                                                                                    key: dd.countryCode,
                                                                                    value: dd.countryName
                                                                                };
                                                                            }),
                                                                            callback: (text) => {
                                                                                add = text;
                                                                            },
                                                                        })
                                                                    ].join('');
                                                                },
                                                                footer_html: (gvc) => {
                                                                    return BgWidget.save(gvc.event(() => {
                                                                        gvc.closeDialog();
                                                                        setTimeout(() => {
                                                                            support_country.push(add);
                                                                            page = `global_${add}`;
                                                                            refresh_country();
                                                                        }, 100);
                                                                    }), '新增');
                                                                },
                                                                width: 200
                                                            });
                                                        })}">
                                                                                        <div>新增國家</div>
                                                                                        <div class="d-flex align-items-center justify-content-center p-2">
                                                                                            <i class="fa-solid fa-plus fs-6"
                                                                                               style="font-size: 16px; "
                                                                                               aria-hidden="true"></i>
                                                                                        </div>
                                                                                    </div>
                                                                                ` : ``)].filter((dd) => {
                                                        return dd.trim();
                                                    }).join(``)}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                `));
                                                    if (support_country.length) {
                                                        view.push(BgWidget.mainCard(html `
                                                                    <div class="mb-2"
                                                                         style="font-size: 16px;font-weight: 700;">
                                                                        設定各國配送費用
                                                                    </div>
                                                                    ${BgWidget.select({
                                                            default: page,
                                                            gvc: gvc,
                                                            options: CountryTw.filter((dd) => {
                                                                return support_country.includes(dd.countryCode);
                                                            }).map((dd) => {
                                                                return {
                                                                    key: 'global_' + dd.countryCode,
                                                                    value: dd.countryName
                                                                };
                                                            }),
                                                            callback: (text) => {
                                                                function next() {
                                                                    page = text;
                                                                    getShipmentSetting();
                                                                }
                                                                if (origin_data !== JSON.stringify(shipmentArray)) {
                                                                    const dialog = new ShareDialog(gvc.glitter);
                                                                    dialog.checkYesOrNot({
                                                                        text: '內容已變更，是否儲存變更?',
                                                                        callback: (response) => {
                                                                            if (response) {
                                                                                save(() => {
                                                                                    next();
                                                                                });
                                                                            }
                                                                            else {
                                                                                next();
                                                                            }
                                                                        }
                                                                    });
                                                                }
                                                                else {
                                                                    next();
                                                                }
                                                            },
                                                        })}`));
                                                    }
                                                    else {
                                                        view.push(BgWidget.mainCard(`<div class="fw-500">請先設定支援國家，在設定運費資訊。</div>`));
                                                    }
                                                }
                                                if (support_country.length || obj.key !== 'global_express') {
                                                    view = view.concat([
                                                        BgWidget.mainCard(html `
                                                                    <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 18px;">
                                                                        <div class="w-100 guide4-3-1"
                                                                             style="font-size: 16px;font-weight: 700;">
                                                                            整份訂單的「總材積」計算
                                                                            ${(obj.key === 'global_express') ? BgWidget.warningInsignia(select_country) : ``}
                                                                        </div>
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
                                                                                                <div class="flex-fill position-relative"
                                                                                                     style="width: 60%">
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
                                                                                                <div class="flex-fill position-relative"
                                                                                                     style="width: 35%">
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
                                                                                                    <div style="color: #8D8D8D;position: absolute;top:9px;right:18px;">
                                                                                                        元
                                                                                                    </div>
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
                                                                                <i class="fa-solid fa-plus ps-2"
                                                                                   style="font-size: 16px; height: 14px; width: 14px;"></i>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                `),
                                                        BgWidget.mainCard(html `
                                                                    <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 18px;">
                                                                        <div class="w-100 guide4-3-2"
                                                                             style="font-size: 16px;font-weight: 700;">
                                                                            整份訂單的「總重量」計算    ${(obj.key === 'global_express') ? BgWidget.warningInsignia(select_country) : ``}
                                                                        </div>
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
                                                                                                <div class="flex-fill position-relative"
                                                                                                     style="width: 60%">
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
                                                                                                        公斤(含)以上
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div class="flex-fill position-relative"
                                                                                                     style="width: 35%">
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
                                                                                                    <div style="color: #8D8D8D;position: absolute;top:9px;right:18px;">
                                                                                                        元
                                                                                                    </div>
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
                                                                                <i class="fa-solid fa-plus ps-2"
                                                                                   style="font-size: 16px; height: 14px; width: 14px;"></i>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                `),
                                                    ]);
                                                }
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
                                                    if (!support_country.length && obj.key === 'global_express') {
                                                        return BgWidget.mainCard(`請先設定支援國家，在設定運費資訊。`);
                                                    }
                                                    const ogShop = shipmentArray;
                                                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                                        const shipmentArray = ogShop.selectCalc !== 'def' ? ogShop : yield ShoppingShipmentSetting.getShipmentData('def');
                                                        resolve(`${BgWidget.mainCard(html `
                                                                            <div style="gap: 18px;display: flex;flex-direction: column;">
                                                                                <div style="font-size: 16px;font-weight: 700;" >
                                                                                    摘要    ${(obj.key === 'global_express') ? BgWidget.warningInsignia(select_country) : ``}
                                                                                </div>
                                                                                <div style="display: flex;flex-direction: column;gap: 12px;">
                                                                                    <div style="color:#393939;font-weight: 400;font-size: 16px;">
                                                                                        依材積計算:
                                                                                    </div>
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
                                                                                    <div style="color:#393939;font-weight: 400;font-size: 16px;">
                                                                                        依重量計算:
                                                                                    </div>
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
                                ].join(''));
                            },
                            divCreate: { class: `w-100`, style: `` },
                        })
                    ].join('');
                },
                divCreate: {
                    class: `d-flex flex-column flex-column-reverse flex-md-row`,
                    style: `gap:10px; padding: 0;`,
                },
            };
        }));
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
