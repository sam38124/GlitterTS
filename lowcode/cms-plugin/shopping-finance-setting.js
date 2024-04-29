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
        return ShoppingFinanceSetting.fin_setting(gvc) + ShoppingFinanceSetting.logistics_setting(gvc) + ShoppingFinanceSetting.invoice_setting(gvc);
    }
    static fin_setting(gvc) {
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
            const dialog = new ShareDialog(glitter);
            dialog.dataLoading({ text: '設定中', visible: true });
            saasConfig.api.setPrivateConfig(saasConfig.config.appName, `glitter_finance`, keyData).then((r) => {
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
                ${BgWidget.title(`金流設定`)}
                <div class="flex-fill"></div>
                <button class="btn btn-primary-c" style="height:38px;font-size: 14px;" onclick="${gvc.event(() => {
            save(() => {
                dialog.successMessage({
                    text: '設定成功'
                });
            });
        })}">儲存金流設定
                </button>
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
                                    return BgWidget.card([
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
                                    style: `width:900px;max-width:100%;`
                                }
                            };
                        }));
                    }));
                },
                divCreate: { class: `d-flex flex-column flex-column-reverse  flex-md-row`, style: `gap:10px;` }
            };
        })}
        `, 900);
    }
    static logistics_setting(gvc) {
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
                    return BgWidget.container(html `
                        <div class="d-flex w-100 align-items-center mb-3 ">
                            ${BgWidget.title(`物流設定`)}
                            <div class="flex-fill"></div>
                            <button class="btn btn-primary-c" style="height:38px;font-size: 14px;"
                                    onclick="${gvc.event(() => {
                        dialog.dataLoading({ text: '設定中', visible: true });
                        saasConfig.api.setPrivateConfig(saasConfig.config.appName, "logistics_setting", vm.data).then((r) => {
                            setTimeout(() => {
                                dialog.dataLoading({ visible: false });
                                if (r.response) {
                                    dialog.successMessage({ text: "設定成功" });
                                }
                                else {
                                    dialog.errorMessage({ text: "設定失敗" });
                                }
                            }, 1000);
                        });
                    })}">儲存物流設定
                            </button>
                        </div>
                        ${BgWidget.card(`
            ${(() => {
                        return gvc.bindView(() => {
                            const id = gvc.glitter.getUUID();
                            return {
                                bind: id,
                                view: () => {
                                    var _a;
                                    return EditorElem.checkBox({
                                        title: '選擇支援配送方式',
                                        gvc: gvc,
                                        def: (_a = vm.data.support) !== null && _a !== void 0 ? _a : [],
                                        array: [
                                            {
                                                title: '一般宅配', value: 'normal'
                                            },
                                            {
                                                title: '全家店到店', value: 'FAMIC2C'
                                            },
                                            {
                                                title: '萊爾富店到店', value: 'HILIFEC2C'
                                            }, {
                                                title: 'OK超商店到店', value: 'OKMARTC2C'
                                            }, {
                                                title: '7-ELEVEN超商交貨便', value: 'UNIMARTC2C'
                                            }
                                        ],
                                        callback: (text) => {
                                            vm.data.support = text;
                                        },
                                        type: 'multiple'
                                    });
                                },
                                divCreate: {}
                            };
                        });
                    })()}`)}
                    `, 900);
                },
                divCreate: {
                    class: `d-flex justify-content-center w-100 flex-column align-items-center `
                }
            };
        });
    }
    static invoice_setting(gvc) {
        const saasConfig = window.parent.saasConfig;
        const id = gvc.glitter.getUUID();
        const vm = {
            loading: true,
            data: {}
        };
        saasConfig.api.getPrivateConfig(saasConfig.config.appName, "invoice_setting").then((r) => {
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
                    return BgWidget.container(html `
                        <div class="d-flex w-100 align-items-center mb-3 ">
                            ${BgWidget.title(`電子發票設定`)}
                            <div class="flex-fill"></div>
                            <button class="btn btn-primary-c" style="height:38px;font-size: 14px;"
                                    onclick="${gvc.event(() => {
                        dialog.dataLoading({ text: '設定中', visible: true });
                        saasConfig.api.setPrivateConfig(saasConfig.config.appName, "invoice_setting", vm.data).then((r) => {
                            setTimeout(() => {
                                dialog.dataLoading({ visible: false });
                                if (r.response) {
                                    dialog.successMessage({ text: "設定成功" });
                                }
                                else {
                                    dialog.errorMessage({ text: "設定失敗" });
                                }
                            }, 1000);
                        });
                    })}">儲存發票設定
                            </button>
                        </div>
                        ${BgWidget.card(`
            ${(() => {
                        var _a, _b;
                        vm.data.fincial = (_a = vm.data.fincial) !== null && _a !== void 0 ? _a : "ezpay";
                        vm.data.point = (_b = vm.data.point) !== null && _b !== void 0 ? _b : "beta";
                        return gvc.map([
                            EditorElem.select({
                                title: "選擇開立方式",
                                gvc: gvc,
                                def: vm.data.fincial,
                                array: [
                                    { title: "藍新發票", value: "ezpay" },
                                    { title: "綠界發票", value: "ecpay" },
                                    { title: "不開立電子發票", value: "nouse" }
                                ],
                                callback: (text) => {
                                    vm.data.fincial = text;
                                }
                            }),
                            EditorElem.select({
                                title: "站點",
                                gvc: gvc,
                                def: vm.data.point,
                                array: [
                                    { title: "測試區", value: "beta" },
                                    { title: "正式區", value: "official" },
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
                            (() => {
                                var _a, _b, _c, _d, _e;
                                let html = ``;
                                if (vm.data.point === 'beta') {
                                    vm.data.whiteList = (_a = vm.data.whiteList) !== null && _a !== void 0 ? _a : [];
                                    vm.data.whiteListExpand = (_b = vm.data.whiteListExpand) !== null && _b !== void 0 ? _b : {};
                                }
                                return [
                                    EditorElem.editeInput({
                                        gvc: gvc,
                                        title: '特店編號',
                                        default: (_c = vm.data.merchNO) !== null && _c !== void 0 ? _c : "",
                                        type: "text",
                                        placeHolder: "請輸入特店編號",
                                        callback: (text) => {
                                            vm.data.merchNO = text;
                                        }
                                    }),
                                    EditorElem.editeInput({
                                        gvc: gvc,
                                        title: 'HashKey',
                                        default: (_d = vm.data.hashkey) !== null && _d !== void 0 ? _d : "",
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
                                    EditorElem.editeInput({
                                        gvc: gvc,
                                        title: 'HashIV',
                                        default: (_e = vm.data.hashiv) !== null && _e !== void 0 ? _e : "",
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
                                    }),
                                    html
                                ].join('');
                            })()
                        ]);
                    })()}`)}
                    `, 900);
                },
                divCreate: {
                    class: `d-flex justify-content-center w-100 flex-column align-items-center `
                }
            };
        });
    }
}
window.glitter.setModule(import.meta.url, ShoppingFinanceSetting);
