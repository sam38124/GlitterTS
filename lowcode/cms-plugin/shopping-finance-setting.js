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
export class ShoppingFinanceSetting {
    static main(gvc) {
        return ShoppingFinanceSetting.fin_setting(gvc, undefined);
    }
    static fin_setting(gvc, widget) {
        const saasConfig = window.parent.saasConfig;
        const glitter = window.glitter;
        const html = String.raw;
        const dialog = new ShareDialog(glitter);
        let keyData = {
            MERCHANT_ID: 'MS350015371',
            HASH_KEY: 'yP9K0sXy1P2WcWfcbhcZDfHASdREcCz1',
            HASH_IV: 'C4AlT6GjEEr1Z9VP',
            ActionURL: "https://core.newebpay.com/MPG/mpg_gateway",
            TYPE: 'newWebPay'
        };
        function save(next) {
            widget.event('loading', { visible: true, title: '請稍候...' });
            saasConfig.api.setPrivateConfig(saasConfig.config.appName, `glitter_finance`, keyData).then((r) => {
                setTimeout(() => {
                    widget.event('loading', { visible: false, title: '請稍候...' });
                    if (r.response) {
                        next();
                    }
                    else {
                        widget.event('error', { title: '設定失敗' });
                    }
                }, 1000);
            });
        }
        return BgWidget.container(html `
            <div class="d-flex w-100 align-items-center mb-3 ">
                ${BgWidget.title(`金流設定`)}
                <div class="flex-fill"></div>
            </div>
            ${gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        const data = yield saasConfig.api.getPrivateConfig(saasConfig.config.appName, `glitter_finance`);
                        if (data.response.result[0]) {
                            keyData = data.response.result[0].value;
                        }
                        keyData.TYPE = keyData.TYPE || 'newWebPay';
                        resolve(gvc.bindView(() => {
                            const id = gvc.glitter.getUUID();
                            return {
                                bind: id,
                                view: () => {
                                    return html `
                                            <div class="c_card d-flex flex-column" style="gap:18px;">
                                                <div class="t_39_16 fw-bold">金流選擇</div>
                                                ${[
                                        { title: '藍新金流', value: 'newWebPay' },
                                        { title: '綠界金流', value: 'ecPay' },
                                        { title: '線下付款', value: 'off_line' }
                                    ].map((dd) => {
                                        return `<div>${[
                                            html `
                                                            <div class="d-flex align-items-center cursor_it"
                                                                 style="gap:8px;" onclick="${gvc.event(() => {
                                                if (keyData.TYPE !== dd.value) {
                                                    keyData.TYPE = dd.value;
                                                    if (keyData.TYPE === 'newWebPay') {
                                                        keyData.ActionURL = 'https://ccore.newebpay.com/MPG/mpg_gateway';
                                                    }
                                                    else {
                                                        keyData.ActionURL = 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5';
                                                    }
                                                    gvc.notifyDataChange(id);
                                                }
                                            })}">
                                                                ${(keyData.TYPE === dd.value) ? `<i class="fa-sharp fa-solid fa-circle-dot cl_39"></i>` : ` <div class="c_39_checkbox"></div>`}
                                                                <div class="t_39_16 fw-normal">${dd.title}</div>
                                                            </div>`,
                                            html `
                                                            <div class="d-flex position-relative mt-2" style="">
                                                                <div class="ms-2 border-end position-absolute h-100"
                                                                     style="left: 0px;"></div>
                                                                <div class="flex-fill "
                                                                     style="margin-left:30px;max-width: 600px;">
                                                                    ${(() => {
                                                if (keyData.TYPE === 'off_line' || (keyData.TYPE !== dd.value)) {
                                                    return [].join('');
                                                }
                                                else {
                                                    return [
                                                        BgWidget.inlineCheckBox({
                                                            title: '金流站點',
                                                            gvc: gvc,
                                                            def: keyData.ActionURL,
                                                            array: (() => {
                                                                if (keyData.TYPE === 'newWebPay') {
                                                                    return [{
                                                                            title: '正式站',
                                                                            value: "https://core.newebpay.com/MPG/mpg_gateway"
                                                                        },
                                                                        {
                                                                            title: '測試站',
                                                                            value: "https://ccore.newebpay.com/MPG/mpg_gateway"
                                                                        }];
                                                                }
                                                                else {
                                                                    return [{
                                                                            title: '正式站',
                                                                            value: "https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5"
                                                                        },
                                                                        {
                                                                            title: '測試站',
                                                                            value: "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5"
                                                                        }];
                                                                }
                                                            })(),
                                                            callback: (text) => {
                                                                keyData.ActionURL = text;
                                                            }
                                                        }),
                                                        BgWidget.inlineCheckBox({
                                                            title: '開通付款方式',
                                                            gvc: gvc,
                                                            def: ['credit', 'atm', 'web_atm', 'c_code', 'c_bar_code'].filter((dd) => {
                                                                return keyData[dd];
                                                            }),
                                                            array: [{
                                                                    title: '信用卡',
                                                                    value: 'credit'
                                                                },
                                                                {
                                                                    title: '一般 ATM',
                                                                    value: 'atm'
                                                                },
                                                                {
                                                                    title: '網路 ATM',
                                                                    value: 'web_atm'
                                                                },
                                                                {
                                                                    title: '超商代碼',
                                                                    value: 'c_code'
                                                                },
                                                                {
                                                                    title: '超商條碼',
                                                                    value: 'c_bar_code'
                                                                }],
                                                            callback: (array) => {
                                                                ['credit', 'atm', 'web_atm', 'c_code', 'c_bar_code'].map((dd) => {
                                                                    keyData[dd] = !!(array.find((d1) => {
                                                                        return d1 === dd;
                                                                    }));
                                                                });
                                                            },
                                                            type: 'multiple'
                                                        }),
                                                        BgWidget.editeInput({
                                                            gvc: gvc,
                                                            title: '特店編號',
                                                            default: keyData.MERCHANT_ID,
                                                            callback: (text) => {
                                                                keyData.MERCHANT_ID = text;
                                                            },
                                                            placeHolder: '請輸入特店編號'
                                                        }),
                                                        BgWidget.editeInput({
                                                            gvc: gvc,
                                                            title: 'HASH_KEY',
                                                            default: keyData.HASH_KEY,
                                                            callback: (text) => {
                                                                keyData.HASH_KEY = text;
                                                            },
                                                            placeHolder: '請輸入HASH_KEY'
                                                        }),
                                                        BgWidget.editeInput({
                                                            gvc: gvc,
                                                            title: 'HASH_IV',
                                                            default: keyData.HASH_IV,
                                                            callback: (text) => {
                                                                keyData.HASH_IV = text;
                                                            },
                                                            placeHolder: '請輸入HASH_IV'
                                                        })
                                                    ].join('<div class="" style="height: 12px;"></div>');
                                                }
                                            })()}
                                                                </div>
                                                            </div>`
                                        ].join('')}</div>`;
                                    }).join('')}
                                                <div class="d-flex align-items-center justify-content-end">
                                                    <div class="bt_c39 cursor_it" onclick="${gvc.event(() => {
                                        save(() => {
                                            widget.event('success', { title: '設定成功' });
                                        });
                                    })}">儲存設定
                                                    </div>
                                                </div>
                                            </div>

                                        `;
                                    return BgWidget.card([
                                        `<div class="t_39_16 fw-bold">金流選擇</div>`,
                                        EditorElem.select({
                                            title: '金流選擇',
                                            gvc: gvc,
                                            def: keyData.TYPE,
                                            array: [
                                                { title: '藍新金流', value: 'newWebPay' },
                                                { title: '綠界金流', value: 'ecPay' },
                                                { title: '線下付款', value: 'off_line' }
                                            ],
                                            callback: (text) => {
                                                keyData.TYPE = text;
                                                if (keyData.TYPE === 'newWebPay') {
                                                    keyData.ActionURL = 'https://ccore.newebpay.com/MPG/mpg_gateway';
                                                }
                                                else {
                                                    keyData.ActionURL = 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5';
                                                }
                                                gvc.notifyDataChange(id);
                                            }
                                        }),
                                        (() => {
                                            if (keyData.TYPE === 'off_line') {
                                                return [].join('');
                                            }
                                            else {
                                                return [
                                                    EditorElem.select({
                                                        title: '金流站點',
                                                        gvc: gvc,
                                                        def: keyData.ActionURL,
                                                        array: (() => {
                                                            if (keyData.TYPE === 'newWebPay') {
                                                                return [{
                                                                        title: '正式站',
                                                                        value: "https://core.newebpay.com/MPG/mpg_gateway"
                                                                    },
                                                                    {
                                                                        title: '測試站',
                                                                        value: "https://ccore.newebpay.com/MPG/mpg_gateway"
                                                                    }];
                                                            }
                                                            else {
                                                                return [{
                                                                        title: '正式站',
                                                                        value: "https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5"
                                                                    },
                                                                    {
                                                                        title: '測試站',
                                                                        value: "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5"
                                                                    }];
                                                            }
                                                        })(),
                                                        callback: (text) => {
                                                            keyData.ActionURL = text;
                                                        }
                                                    }),
                                                    EditorElem.editeInput({
                                                        gvc: gvc,
                                                        title: '特店編號',
                                                        default: keyData.MERCHANT_ID,
                                                        callback: (text) => {
                                                            keyData.MERCHANT_ID = text;
                                                        },
                                                        placeHolder: '請輸入特店編號'
                                                    }),
                                                    EditorElem.editeInput({
                                                        gvc: gvc,
                                                        title: 'HASH_KEY',
                                                        default: keyData.HASH_KEY,
                                                        callback: (text) => {
                                                            keyData.HASH_KEY = text;
                                                        },
                                                        placeHolder: '請輸入HASH_KEY'
                                                    }),
                                                    EditorElem.editeInput({
                                                        gvc: gvc,
                                                        title: 'HASH_IV',
                                                        default: keyData.HASH_IV,
                                                        callback: (text) => {
                                                            keyData.HASH_IV = text;
                                                        },
                                                        placeHolder: '請輸入HASH_IV'
                                                    })
                                                ].join('');
                                            }
                                        })()
                                    ].join('<div class="my-2"></div>'));
                                },
                                divCreate: {
                                    style: ``,
                                    class: `w-100`
                                }
                            };
                        }));
                    }));
                },
                divCreate: { class: `d-flex flex-column flex-column-reverse  flex-md-row`, style: `gap:10px;` }
            };
        })}
        `, undefined, 'width:calc(100% - 56px);');
    }
    static logistics_setting(gvc, widget) {
        const saasConfig = window.parent.saasConfig;
        const id = gvc.glitter.getUUID();
        const vm = {
            loading: true,
            data: {}
        };
        saasConfig.api.getPrivateConfig(saasConfig.config.appName, "logistics_setting").then((r) => {
            if (r.response.result[0]) {
                vm.data = r.response.result[0].value;
            }
            vm.loading = false;
            gvc.notifyDataChange(id);
        });
        const html = String.raw;
        const dialog = new ShareDialog(gvc.glitter);
        return gvc.bindView(() => {
            return {
                bind: id,
                view: () => {
                    if (vm.loading) {
                        return html `
                            <div class="w-100 d-flex align-items-center justify-content-center">
                                <div class="spinner-border"></div>
                            </div>`;
                    }
                    vm.data.support = vm.data.support || [];
                    return BgWidget.container(html `
                        ${BgWidget.title('宅配設定')}
                        <div style="height: 24px;"></div>
                        ${gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                return [
                                    {
                                        title: '一般宅配', value: 'normal',
                                        src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716734353666-truck-light 1 (1).svg'
                                    },
                                    {
                                        title: '7-ELEVEN超商交貨便', value: 'UNIMARTC2C',
                                        src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716734544575-34f72af5b441738b1f65a0597c28d9cf (1).png'
                                    },
                                    {
                                        title: '全家店到店', value: 'FAMIC2C',
                                        src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716734396302-e970be63c9acb23e41cf80c77b7ca35b.jpeg'
                                    },
                                    {
                                        title: '萊爾富店到店', value: 'HILIFEC2C',
                                        src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716734423037-6e2664ad52332c40b4106868ada74646.png'
                                    }, {
                                        title: 'OK超商店到店', value: 'OKMARTC2C',
                                        src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716734510490-beb1c70f9e168b7bab198ea2bf226148.png'
                                    }
                                ].map((dd) => {
                                    return html `
                                            <div class="col-12 col-md-4 mb-3">
                                                <div class="w-100"
                                                     style=" padding: 24px; background: white; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.08); border-radius: 10px; overflow: hidden; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 18px; display: inline-flex">
                                                    <div style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 28px; display: inline-flex">
                                                        <img style="width: 46px;" src="${dd.src}">
                                                        <div style="flex-direction: column; justify-content: center; align-items: flex-start; gap: 4px; display: inline-flex">
                                                            <div class="t_39_16">${dd.title}</div>
                                                            <div class="d-flex align-items-center" style="gap:4px;">
                                                                <div class="t_39_16">
                                                                    ${(vm.data.support.find((d1) => {
                                        return dd.value === d1;
                                    })) ? `開啟` : `關閉`}
                                                                </div>
                                                                <div class="cursor_it form-check form-switch"
                                                                     style="     margin-top: 10px; ">
                                                                    <input class=" form-check-input" style=" "
                                                                           type="checkbox" value=""
                                                                           onchange="${gvc.event((e, event) => {
                                        if (vm.data.support.find((d1) => {
                                            return dd.value === d1;
                                        })) {
                                            vm.data.support = vm.data.support.filter((d1) => {
                                                return dd.value !== d1;
                                            });
                                        }
                                        else {
                                            vm.data.support.push(dd.value);
                                        }
                                        saasConfig.api.setPrivateConfig(saasConfig.config.appName, "logistics_setting", vm.data);
                                        gvc.notifyDataChange(id);
                                    })}" ${(vm.data.support.find((d1) => {
                                        return dd.value === d1;
                                    })) ? `checked` : ``}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        `;
                                }).join('');
                            },
                            divCreate: {
                                class: `row m-0 mx-n2`
                            }
                        };
                    })}
                    `, undefined, 'width:calc(100% - 56px);');
                },
                divCreate: {
                    class: `d-flex justify-content-center w-100 flex-column align-items-center `
                }
            };
        });
    }
    static invoice_setting_v2(gvc, widget) {
        const saasConfig = window.parent.saasConfig;
        const glitter = window.glitter;
        const html = String.raw;
        const vm = {
            loading: true,
            data: {}
        };
        function save(next) {
            widget.event('loading', { visible: true, title: '請稍候...' });
            saasConfig.api.setPrivateConfig(saasConfig.config.appName, `invoice_setting`, vm.data).then((r) => {
                setTimeout(() => {
                    widget.event('loading', { visible: false, title: '請稍候...' });
                    if (r.response) {
                        next();
                    }
                    else {
                        widget.event('error', { title: '設定失敗' });
                    }
                }, 1000);
            });
        }
        return BgWidget.container(html `
            <div class="d-flex w-100 align-items-center mb-3 ">
                ${BgWidget.title(`發票設定`)}
                <div class="flex-fill"></div>
            </div>
            ${gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        var _a, _b;
                        const data = yield saasConfig.api.getPrivateConfig(saasConfig.config.appName, `invoice_setting`);
                        if (data.response.result[0]) {
                            vm.data = data.response.result[0].value;
                        }
                        let html = String.raw;
                        if (vm.data.point === 'beta') {
                            vm.data.whiteList = (_a = vm.data.whiteList) !== null && _a !== void 0 ? _a : [];
                            vm.data.whiteListExpand = (_b = vm.data.whiteListExpand) !== null && _b !== void 0 ? _b : {};
                        }
                        resolve(gvc.bindView(() => {
                            var _a, _b;
                            vm.data.fincial = (_a = vm.data.fincial) !== null && _a !== void 0 ? _a : "ezpay";
                            vm.data.point = (_b = vm.data.point) !== null && _b !== void 0 ? _b : "beta";
                            const id = gvc.glitter.getUUID();
                            return {
                                bind: id,
                                view: () => {
                                    return html `
                                            <div class="c_card d-flex flex-column" style="gap:18px;">
                                                <div class="t_39_16 fw-bold">服務商選擇</div>
                                                ${[
                                        { title: "藍新發票", value: "ezpay" },
                                        { title: "綠界發票", value: "ecpay" },
                                        { title: "不開立電子發票", value: "nouse" }
                                    ].map((dd) => {
                                        return `<div>${[
                                            html `
                                                            <div class="d-flex align-items-center cursor_it"
                                                                 style="gap:8px;" onclick="${gvc.event(() => {
                                                vm.data.fincial = dd.value;
                                                gvc.notifyDataChange(id);
                                            })}">
                                                                ${(vm.data.fincial === dd.value) ? `<i class="fa-sharp fa-solid fa-circle-dot cl_39"></i>` : ` <div class="c_39_checkbox"></div>`}
                                                                <div class="t_39_16 fw-normal">${dd.title}</div>
                                                            </div>`,
                                            html `
                                                            <div class="d-flex position-relative mt-2" style="">
                                                                <div class="ms-2 border-end position-absolute h-100"
                                                                     style="left: 0px;"></div>
                                                                <div class="flex-fill "
                                                                     style="margin-left:30px;max-width: 518px;">
                                                                    ${(() => {
                                                var _a, _b, _c;
                                                if ((vm.data.fincial) === 'nouse' || (vm.data.fincial !== dd.value)) {
                                                    return [].join('');
                                                }
                                                else {
                                                    return [
                                                        BgWidget.inlineCheckBox({
                                                            title: "站點",
                                                            gvc: gvc,
                                                            def: vm.data.point,
                                                            array: [
                                                                {
                                                                    title: "測試區",
                                                                    value: "beta"
                                                                },
                                                                {
                                                                    title: "正式區",
                                                                    value: "official"
                                                                },
                                                            ],
                                                            callback: (text) => {
                                                                vm.data.point = text;
                                                                if (vm.data.point == 'beta') {
                                                                    vm.data.hashkey = vm.data.bhashkey;
                                                                    vm.data.hashiv = vm.data.bhashiv;
                                                                }
                                                                else {
                                                                    vm.data.hashkey = vm.data.ohashkey;
                                                                    vm.data.hashiv = vm.data.ohashiv;
                                                                }
                                                                gvc.notifyDataChange(id);
                                                            }
                                                        }),
                                                        BgWidget.editeInput({
                                                            gvc: gvc,
                                                            title: '特店編號',
                                                            default: (_a = vm.data.merchNO) !== null && _a !== void 0 ? _a : "",
                                                            type: "text",
                                                            placeHolder: "請輸入特店編號",
                                                            callback: (text) => {
                                                                vm.data.merchNO = text;
                                                            }
                                                        }),
                                                        BgWidget.editeInput({
                                                            gvc: gvc,
                                                            title: 'HashKey',
                                                            default: (_b = vm.data.hashkey) !== null && _b !== void 0 ? _b : "",
                                                            type: "text",
                                                            placeHolder: "請輸入HashKey",
                                                            callback: (text) => {
                                                                vm.data.hashkey = text;
                                                                if (vm.data.point == 'beta') {
                                                                    vm.data.bhashkey = text;
                                                                }
                                                                else {
                                                                    vm.data.ohashkey = text;
                                                                }
                                                            }
                                                        }),
                                                        BgWidget.editeInput({
                                                            gvc: gvc,
                                                            title: 'HashIV',
                                                            default: (_c = vm.data.hashiv) !== null && _c !== void 0 ? _c : "",
                                                            type: "text",
                                                            placeHolder: "請輸入HashIV",
                                                            callback: (text) => {
                                                                vm.data.hashiv = text;
                                                                if (vm.data.point == 'beta') {
                                                                    vm.data.bhashiv = text;
                                                                }
                                                                else {
                                                                    vm.data.ohashiv = text;
                                                                }
                                                            }
                                                        })
                                                    ].join('<div class="" style="height: 12px;"></div>');
                                                }
                                            })()}
                                                                </div>
                                                            </div>`
                                        ].join('')}</div>`;
                                    }).join('')}
                                                <div class="d-flex align-items-center justify-content-end">
                                                    <div class="bt_c39 cursor_it" onclick="${gvc.event(() => {
                                        save(() => {
                                            widget.event('success', { title: '設定成功' });
                                        });
                                    })}">儲存設定
                                                    </div>
                                                </div>
                                            </div>

                                        `;
                                },
                                divCreate: {
                                    style: ``,
                                    class: `w-100`
                                }
                            };
                        }));
                    }));
                },
                divCreate: { class: `d-flex flex-column flex-column-reverse  flex-md-row`, style: `gap:10px;` }
            };
        })}
        `, undefined, 'width:calc(100% - 56px);');
    }
}
window.glitter.setModule(import.meta.url, ShoppingFinanceSetting);