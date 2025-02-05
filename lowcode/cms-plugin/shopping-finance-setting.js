var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BgWidget } from '../backend-manager/bg-widget.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { ApiPageConfig } from '../api/pageConfig.js';
import { CheckInput } from '../modules/checkInput.js';
import { LanguageBackend } from './language-backend.js';
import { Tool } from '../modules/tool.js';
import { ProductAi } from './ai-generator/product-ai.js';
import { imageLibrary } from '../modules/image-library.js';
import { Language } from "../glitter-base/global/language.js";
import { ShoppingShipmentSetting } from "./shopping-shipment-setting.js";
const html = String.raw;
export class ShoppingFinanceSetting {
    static main(gvc) {
        const dialog = new ShareDialog(gvc.glitter);
        const saasConfig = window.parent.saasConfig;
        let keyData = {
            payment_info_custom: [],
        };
        const vm = {
            id: gvc.glitter.getUUID(),
            onBoxId: gvc.glitter.getUUID(),
            posBoxId: gvc.glitter.getUUID(),
            offBoxId: gvc.glitter.getUUID(),
            loading: true,
        };
        const onlinePayArray = [
            { key: 'newWebPay', name: '藍新金流' },
            { key: 'ecPay', name: '綠界金流' },
            { key: 'paypal', name: 'PayPal' },
            { key: 'line_pay', name: 'Line Pay' },
            { key: 'paynow', name: 'PayNow 立吉富' },
            { key: 'line_pay_scan', name: 'Line Pay', type: 'pos' },
            { key: 'ut_credit_card', name: '聯合信用卡', type: 'pos' },
        ];
        const redDot = html ` <span class="red-dot">*</span>`;
        function refresh() {
            gvc.notifyDataChange(vm.id);
        }
        function updateCustomFinance(obj) {
            const custom_finance = JSON.parse(JSON.stringify(obj.data || {
                id: gvc.glitter.getUUID(),
                name: '',
                text: '',
            }));
            let form = undefined;
            BgWidget.settingDialog({
                gvc: gvc,
                title: '新增自訂金流',
                innerHTML: (gvc) => {
                    form = BgWidget.customForm(gvc, [
                        {
                            title: html `
                                <div class="tx_normal fw-bolder mt-2 d-flex flex-column" style="margin-bottom: 12px;">
                                    自訂線下金流表單
                                    <span style="color:#8D8D8D;font-size: 12px;">當客戶選擇此付款方式時，所需填寫的額外資料</span>
                                </div>`,
                            key: `form_finance_${custom_finance.id}`,
                            no_padding: true,
                        },
                    ]);
                    return gvc.bindView((() => {
                        const id = gvc.glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                return [
                                    BgWidget.editeInput({
                                        gvc: gvc,
                                        title: '自訂金流名稱',
                                        default: custom_finance.name,
                                        callback: (text) => {
                                            custom_finance.name = text;
                                        },
                                        placeHolder: '請輸入自訂金流名稱',
                                        global_language: true
                                    }),
                                    form.view,
                                ].join(BgWidget.mbContainer(12));
                            },
                            divCreate: {},
                            onCreate: () => {
                            },
                        };
                    })());
                },
                footer_html: (gvc) => {
                    let array = [
                        BgWidget.save(gvc.event(() => {
                            return new Promise(() => __awaiter(this, void 0, void 0, function* () {
                                var _a;
                                const dialog = new ShareDialog(gvc.glitter);
                                if (!custom_finance.name) {
                                    dialog.errorMessage({ text: '請輸入金流名稱' });
                                    return;
                                }
                                keyData.payment_info_custom = (_a = keyData.payment_info_custom) !== null && _a !== void 0 ? _a : [];
                                if (obj.function === 'plus') {
                                    keyData.payment_info_custom.push(custom_finance);
                                }
                                else {
                                    keyData.payment_info_custom[keyData.payment_info_custom.findIndex((d1) => {
                                        return d1.id === custom_finance.id;
                                    })] = custom_finance;
                                }
                                dialog.dataLoading({ visible: true });
                                yield form.save();
                                saasConfig.api.setPrivateConfig(saasConfig.config.appName, 'glitter_finance', keyData);
                                dialog.dataLoading({ visible: false });
                                dialog.successMessage({ text: '設定成功' });
                                gvc.closeDialog();
                                refresh();
                            }));
                        })),
                    ];
                    if (obj.function === 'replace') {
                        array = [
                            BgWidget.danger(gvc.event(() => {
                                const dialog = new ShareDialog(gvc.glitter);
                                dialog.checkYesOrNot({
                                    text: '是否確認刪除？',
                                    callback: (response) => __awaiter(this, void 0, void 0, function* () {
                                        if (response) {
                                            keyData.payment_info_custom = keyData.payment_info_custom.filter((d1) => {
                                                return obj.data.id !== d1.id;
                                            });
                                            dialog.dataLoading({ visible: true });
                                            saasConfig.api.setPrivateConfig(saasConfig.config.appName, 'glitter_finance', keyData);
                                            dialog.dataLoading({ visible: false });
                                            gvc.closeDialog();
                                            refresh();
                                        }
                                    }),
                                });
                            })),
                        ].concat(array);
                    }
                    return array.join('');
                },
            });
        }
        return BgWidget.container(html `
                ${[
            html `
                        <div class="title-container">
                            ${BgWidget.title(`金流設定`)}
                            <div class="flex-fill"></div>
                        </div>`,
            gvc.bindView({
                bind: vm.id,
                view: () => {
                    var _a;
                    if (vm.loading) {
                        return BgWidget.spinner();
                    }
                    try {
                        keyData.off_line_support = (_a = keyData.off_line_support) !== null && _a !== void 0 ? _a : Object.assign({ line: false, atm: false, cash_on_delivery: false }, keyData.payment_info_custom.map((dd) => {
                            return {
                                [dd.id]: false,
                            };
                        }));
                        Object.keys(keyData.off_line_support).map((key) => {
                            if (['line', 'atm', 'cash_on_delivery'].includes(key) ||
                                keyData.payment_info_custom.some((item) => {
                                    return item.id === key;
                                })) {
                                return;
                            }
                            delete keyData.off_line_support[key];
                        });
                        return [
                            BgWidget.mainCard(html `
                                                <div class="tx_700">線上金流</div>
                                                ${BgWidget.grayNote('透過服務商串接線上付款功能')} ${BgWidget.mbContainer(12)}
                                                ${BgWidget.multiCheckboxContainer(gvc, onlinePayArray.filter((dd) => {
                                return dd.type !== 'pos';
                            }), (() => {
                                let array = [];
                                keyData.newWebPay.toggle && array.push('newWebPay');
                                keyData.ecPay.toggle && array.push('ecPay');
                                keyData.paypal.toggle && array.push('paypal');
                                keyData.line_pay.toggle && array.push('line_pay');
                                keyData.paynow.toggle && array.push('paynow');
                                return array;
                            })(), (data) => {
                                onlinePayArray.filter((dd) => {
                                    return dd.type !== 'pos';
                                }).map((dd) => {
                                    keyData[dd.key].toggle = data.includes(dd.key);
                                });
                                gvc.notifyDataChange(vm.onBoxId);
                            }, { single: false, zeroOption: true })}
                                                ${gvc.bindView({
                                bind: vm.onBoxId,
                                view: () => {
                                    const payData_List = onlinePayArray.filter((dd) => {
                                        return dd.type !== 'pos';
                                    }).filter((item) => {
                                        return keyData[item.key] && keyData[item.key].toggle;
                                    });
                                    if (!payData_List.length) {
                                        return '';
                                    }
                                    return [
                                        html `${BgWidget.mbContainer(12)}
                                                            <div class="tx_700">設定</div>
                                                            ${BgWidget.mbContainer(12)}`,
                                        payData_List
                                            .map((payData) => {
                                            const key_d = keyData[payData.key];
                                            switch (payData.key) {
                                                case 'newWebPay':
                                                case 'ecPay':
                                                    return html ` ${BgWidget.openBoxContainer({
                                                        gvc,
                                                        tag: 'detail',
                                                        title: payData.name + redDot,
                                                        openOnInit: false,
                                                        insideHTML: [
                                                            BgWidget.inlineCheckBox({
                                                                title: '串接路徑',
                                                                gvc: gvc,
                                                                def: key_d.ActionURL,
                                                                array: (() => {
                                                                    if (payData.key === 'newWebPay') {
                                                                        return [
                                                                            {
                                                                                title: '正式站',
                                                                                value: 'https://core.newebpay.com/MPG/mpg_gateway',
                                                                            },
                                                                            {
                                                                                title: '測試站',
                                                                                value: 'https://ccore.newebpay.com/MPG/mpg_gateway',
                                                                            },
                                                                        ];
                                                                    }
                                                                    else {
                                                                        return [
                                                                            {
                                                                                title: '正式站',
                                                                                value: 'https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5',
                                                                            },
                                                                            {
                                                                                title: '測試站',
                                                                                value: 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5',
                                                                            },
                                                                        ];
                                                                    }
                                                                })(),
                                                                callback: (text) => {
                                                                    key_d.ActionURL = text;
                                                                },
                                                            }),
                                                            BgWidget.inlineCheckBox({
                                                                title: '開通付款方式',
                                                                gvc: gvc,
                                                                def: ['credit', 'atm', 'web_atm', 'c_code', 'c_bar_code'].filter((dd) => {
                                                                    return key_d[dd];
                                                                }),
                                                                array: [
                                                                    {
                                                                        title: '信用卡',
                                                                        value: 'credit',
                                                                    },
                                                                    {
                                                                        title: '一般 ATM',
                                                                        value: 'atm',
                                                                    },
                                                                    {
                                                                        title: '網路 ATM',
                                                                        value: 'web_atm',
                                                                    },
                                                                    {
                                                                        title: '超商代碼',
                                                                        value: 'c_code',
                                                                    },
                                                                    {
                                                                        title: '超商條碼',
                                                                        value: 'c_bar_code',
                                                                    },
                                                                ],
                                                                callback: (array) => {
                                                                    ['credit', 'atm', 'web_atm', 'c_code', 'c_bar_code'].map((dd) => {
                                                                        key_d[dd] = !!array.find((d1) => {
                                                                            return d1 === dd;
                                                                        });
                                                                    });
                                                                },
                                                                type: 'multiple',
                                                            }),
                                                            BgWidget.editeInput({
                                                                gvc: gvc,
                                                                title: '特店編號',
                                                                default: key_d.MERCHANT_ID,
                                                                callback: (text) => {
                                                                    key_d.MERCHANT_ID = text;
                                                                },
                                                                placeHolder: '請輸入特店編號',
                                                            }),
                                                            BgWidget.editeInput({
                                                                gvc: gvc,
                                                                title: 'HASH_KEY',
                                                                default: key_d.HASH_KEY,
                                                                callback: (text) => {
                                                                    key_d.HASH_KEY = text;
                                                                },
                                                                placeHolder: '請輸入HASH_KEY',
                                                            }),
                                                            BgWidget.editeInput({
                                                                gvc: gvc,
                                                                title: 'HASH_IV',
                                                                default: key_d.HASH_IV,
                                                                callback: (text) => {
                                                                    key_d.HASH_IV = text;
                                                                },
                                                                placeHolder: '請輸入HASH_IV',
                                                            }),
                                                        ].join(''),
                                                    })}`;
                                                case 'paypal':
                                                    return html ` ${BgWidget.openBoxContainer({
                                                        gvc,
                                                        tag: 'detail',
                                                        title: payData.name + redDot,
                                                        openOnInit: false,
                                                        insideHTML: [
                                                            BgWidget.inlineCheckBox({
                                                                title: '串接路徑',
                                                                gvc: gvc,
                                                                def: `${keyData.paypal.BETA}`,
                                                                array: [
                                                                    {
                                                                        title: '正式站',
                                                                        value: `false`,
                                                                    },
                                                                    {
                                                                        title: '測試站',
                                                                        value: `true`,
                                                                    },
                                                                ],
                                                                callback: (text) => {
                                                                    keyData.paypal.BETA = text;
                                                                },
                                                            }),
                                                            BgWidget.editeInput({
                                                                gvc: gvc,
                                                                title: 'CLIENT_ID',
                                                                default: keyData.paypal.PAYPAL_CLIENT_ID,
                                                                callback: (text) => {
                                                                    keyData.paypal.PAYPAL_CLIENT_ID = text;
                                                                },
                                                                placeHolder: '請輸入CLIENT_ID',
                                                            }),
                                                            BgWidget.editeInput({
                                                                gvc: gvc,
                                                                title: 'SECRET',
                                                                default: keyData.paypal.PAYPAL_SECRET,
                                                                callback: (text) => {
                                                                    keyData.paypal.PAYPAL_SECRET = text;
                                                                },
                                                                placeHolder: '請輸入SECRET',
                                                            }),
                                                        ].join(''),
                                                    })}`;
                                                case 'line_pay':
                                                    return html ` ${BgWidget.openBoxContainer({
                                                        gvc,
                                                        tag: 'detail',
                                                        title: payData.name + redDot,
                                                        openOnInit: false,
                                                        insideHTML: [
                                                            BgWidget.inlineCheckBox({
                                                                title: '串接路徑',
                                                                gvc: gvc,
                                                                def: `${keyData.line_pay.BETA}`,
                                                                array: [
                                                                    {
                                                                        title: '正式站',
                                                                        value: `false`,
                                                                    },
                                                                    {
                                                                        title: '測試站',
                                                                        value: `true`,
                                                                    },
                                                                ],
                                                                callback: (text) => {
                                                                    keyData.line_pay.BETA = text;
                                                                },
                                                            }),
                                                            BgWidget.editeInput({
                                                                gvc: gvc,
                                                                title: 'CLIENT_ID',
                                                                default: keyData.line_pay.CLIENT_ID,
                                                                callback: (text) => {
                                                                    keyData.line_pay.CLIENT_ID = text;
                                                                },
                                                                placeHolder: '請輸入CLIENT_ID',
                                                            }),
                                                            BgWidget.editeInput({
                                                                gvc: gvc,
                                                                title: 'SECRET',
                                                                default: keyData.line_pay.SECRET,
                                                                callback: (text) => {
                                                                    keyData.line_pay.SECRET = text;
                                                                },
                                                                placeHolder: '請輸入SECRET',
                                                            }),
                                                        ].join(''),
                                                    })}`;
                                                case 'paynow':
                                                    return html ` ${BgWidget.openBoxContainer({
                                                        gvc,
                                                        tag: 'detail',
                                                        title: payData.name + redDot,
                                                        openOnInit: false,
                                                        insideHTML: [
                                                            BgWidget.inlineCheckBox({
                                                                title: '串接路徑',
                                                                gvc: gvc,
                                                                def: `${keyData.paynow.BETA}`,
                                                                array: [
                                                                    {
                                                                        title: '正式站',
                                                                        value: `false`,
                                                                    },
                                                                    {
                                                                        title: '測試站',
                                                                        value: `true`,
                                                                    },
                                                                ],
                                                                callback: (text) => {
                                                                    keyData.paynow.BETA = text;
                                                                },
                                                            }),
                                                            BgWidget.editeInput({
                                                                gvc: gvc,
                                                                title: 'public key',
                                                                default: keyData.paynow.public_key,
                                                                callback: (text) => {
                                                                    keyData.paynow.public_key = text;
                                                                },
                                                                placeHolder: '請輸入public key',
                                                            }),
                                                            BgWidget.editeInput({
                                                                gvc: gvc,
                                                                title: 'private key',
                                                                default: keyData.paynow.private_key,
                                                                callback: (text) => {
                                                                    keyData.paynow.private_key = text;
                                                                },
                                                                placeHolder: '請輸入private key',
                                                            })
                                                        ].join(''),
                                                    })}`;
                                            }
                                        })
                                            .join('<div class="my-2"></div>'),
                                    ].join('');
                                },
                            })}`),
                            BgWidget.mainCard(html `
                                                <div style="display: flex; gap: 14px;" class="align-items-center">
                                                    <div class="tx_700">線下金流</div>
                                                    <div class="flex-fill"></div>
                                                    ${BgWidget.grayButton('新增自訂金流', gvc.event(() => {
                                updateCustomFinance({ function: 'plus' });
                            }))}
                                                </div>

                                                ${BgWidget.grayNote('不執行線上付款，由店家自行與消費者商議付款方式')}

                                                ${BgWidget.mbContainer(12)}
                                                ${(() => {
                                const offlinePayArray = [
                                    { key: 'atm', name: 'ATM銀行轉帳', customerClass: 'guide2-3' },
                                    { key: 'line', name: 'LINE 轉帳' },
                                    { key: 'cash_on_delivery', name: '貨到付款' },
                                    ...keyData.payment_info_custom.map((dd) => {
                                        return {
                                            key: dd.id,
                                            name: html `${Language.getLanguageCustomText(dd.name)}
                                                                <i
                                                                        class="fa-solid fa-pencil cursor_pointer ms-1"
                                                                        onclick="${gvc.event((e, event) => {
                                                updateCustomFinance({
                                                    function: 'replace',
                                                    data: keyData.payment_info_custom.find((d1) => {
                                                        return dd.id === d1.id;
                                                    }),
                                                });
                                                event.stopPropagation();
                                                event.preventDefault();
                                            })}"
                                                                ></i>`,
                                        };
                                    }),
                                ];
                                return BgWidget.multiCheckboxContainer(gvc, offlinePayArray, offlinePayArray
                                    .slice()
                                    .filter((item) => {
                                    return keyData.off_line_support[item.key];
                                })
                                    .map((item) => {
                                    return item.key;
                                }), (data) => {
                                    offlinePayArray.map((item) => {
                                        keyData.off_line_support[item.key] = data.some((d) => {
                                            return d === item.key;
                                        });
                                    });
                                    gvc.notifyDataChange(vm.offBoxId);
                                }, { single: false });
                            })()}
                                                ${gvc.bindView({
                                bind: vm.offBoxId,
                                view: () => {
                                    const payData = [
                                        'atm',
                                        'line',
                                        ...keyData.payment_info_custom.map((dd) => {
                                            return dd.id;
                                        }),
                                    ].filter((key) => {
                                        return keyData.off_line_support[key];
                                    });
                                    if (payData.length == 0) {
                                        return '';
                                    }
                                    return html `
                                                            ${BgWidget.mbContainer(12)}
                                                            <div class="tx_700">付款資訊</div>
                                                            ${BgWidget.grayNote('於訂單確認頁面及通知郵件中顯示，告知顧客付款的銀行帳戶或其他付款說明')}${BgWidget.mbContainer(12)}
                                                            ${payData
                                        .map((key) => {
                                        if (key === 'atm') {
                                            return BgWidget.openBoxContainer({
                                                gvc,
                                                tag: 'detail',
                                                title: 'ATM銀行轉帳' + redDot,
                                                insideHTML: ShoppingFinanceSetting.atm(gvc, keyData),
                                                guideClass: 'guide2-4',
                                            });
                                        }
                                        if (key === 'line') {
                                            return BgWidget.openBoxContainer({
                                                gvc,
                                                tag: 'detail',
                                                title: 'LINE 轉帳' + redDot,
                                                insideHTML: ShoppingFinanceSetting.line_pay(gvc, keyData),
                                                height: 700,
                                            });
                                        }
                                        const i = keyData.payment_info_custom.findIndex((dd) => {
                                            return dd.id === key;
                                        });
                                        if (i === -1) {
                                            return '';
                                        }
                                        const customer = keyData.payment_info_custom[i];
                                        return BgWidget.openBoxContainer({
                                            gvc,
                                            tag: 'detail',
                                            title: `自訂金流：${Language.getLanguageCustomText(customer.name)}` + redDot,
                                            insideHTML: ShoppingFinanceSetting.customerText(gvc, keyData, i),
                                            height: 700,
                                        });
                                    })
                                        .filter((str) => str.length > 0)
                                        .join(BgWidget.mbContainer(12))}
                                                        `;
                                },
                            })}
                                            `),
                            BgWidget.mainCard(html `
                                                <div class="tx_700">POS金流設定</div>
                                                ${BgWidget.grayNote('設定實體店面所需串接的付款方式')} ${BgWidget.mbContainer(12)}
                                                ${BgWidget.multiCheckboxContainer(gvc, onlinePayArray.filter((dd) => {
                                return dd.type === 'pos';
                            }), (() => {
                                let array = [];
                                keyData.newWebPay.toggle && array.push('newWebPay');
                                keyData.ecPay.toggle && array.push('ecPay');
                                keyData.paypal.toggle && array.push('paypal');
                                keyData.line_pay.toggle && array.push('line_pay');
                                keyData.line_pay_scan.toggle && array.push('line_pay_scan');
                                keyData.ut_credit_card.toggle && array.push('ut_credit_card');
                                return array;
                            })(), (data) => {
                                onlinePayArray.filter((dd) => {
                                    return dd.type === 'pos';
                                }).map((dd) => {
                                    keyData[dd.key].toggle = data.includes(dd.key);
                                });
                                gvc.notifyDataChange(vm.posBoxId);
                            }, { single: false, zeroOption: true })}
                                                ${gvc.bindView({
                                bind: vm.posBoxId,
                                view: () => {
                                    const payData_List = onlinePayArray.filter((dd) => {
                                        return dd.type === 'pos';
                                    }).filter((item) => {
                                        return keyData[item.key] && keyData[item.key].toggle;
                                    });
                                    if (!payData_List.length) {
                                        return '';
                                    }
                                    return [
                                        html `${BgWidget.mbContainer(12)}
                                                            <div class="tx_700">設定</div>
                                                            ${BgWidget.mbContainer(12)}`,
                                        payData_List
                                            .map((payData) => {
                                            const key_d = keyData[payData.key];
                                            switch (payData.key) {
                                                case 'line_pay_scan':
                                                    return html ` ${BgWidget.openBoxContainer({
                                                        gvc,
                                                        tag: 'detail',
                                                        title: payData.name + redDot,
                                                        openOnInit: false,
                                                        insideHTML: [
                                                            BgWidget.inlineCheckBox({
                                                                title: '串接路徑',
                                                                gvc: gvc,
                                                                def: `${keyData.line_pay_scan.BETA}`,
                                                                array: [
                                                                    {
                                                                        title: '正式站',
                                                                        value: `false`,
                                                                    },
                                                                    {
                                                                        title: '測試站',
                                                                        value: `true`,
                                                                    },
                                                                ],
                                                                callback: (text) => {
                                                                    keyData.line_pay_scan.BETA = text;
                                                                },
                                                            }),
                                                            BgWidget.editeInput({
                                                                gvc: gvc,
                                                                title: 'CLIENT_ID',
                                                                default: keyData.line_pay_scan.CLIENT_ID,
                                                                callback: (text) => {
                                                                    keyData.line_pay_scan.CLIENT_ID = text;
                                                                },
                                                                placeHolder: '請輸入CLIENT_ID',
                                                            }),
                                                            BgWidget.editeInput({
                                                                gvc: gvc,
                                                                title: 'SECRET',
                                                                default: keyData.line_pay_scan.SECRET,
                                                                callback: (text) => {
                                                                    keyData.line_pay_scan.SECRET = text;
                                                                },
                                                                placeHolder: '請輸入SECRET',
                                                            }),
                                                        ].join(''),
                                                    })}`;
                                                case 'ut_credit_card':
                                                    return html ` ${BgWidget.openBoxContainer({
                                                        gvc,
                                                        tag: 'detail',
                                                        title: payData.name + redDot,
                                                        openOnInit: false,
                                                        insideHTML: [
                                                            BgWidget.editeInput({
                                                                gvc: gvc,
                                                                title: '刷卡機密碼',
                                                                default: keyData.ut_credit_card.pwd,
                                                                callback: (text) => {
                                                                    keyData.ut_credit_card.pwd = text;
                                                                },
                                                                placeHolder: '請輸入刷卡機密碼',
                                                            })
                                                        ].join(''),
                                                    })}`;
                                            }
                                        })
                                            .join('<div class="my-2"></div>'),
                                    ].join('');
                                },
                            })}`)
                        ].join(BgWidget.mbContainer(24));
                    }
                    catch (e) {
                        console.error(e);
                        return `${e}`;
                    }
                },
                onCreate: () => {
                    if (vm.loading) {
                        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                            const data = yield saasConfig.api.getPrivateConfig(saasConfig.config.appName, 'glitter_finance');
                            if (data.response.result[0]) {
                                keyData = Object.assign(Object.assign({}, keyData), data.response.result[0].value);
                            }
                            resolve();
                        })).then(() => {
                            vm.loading = false;
                            gvc.notifyDataChange(vm.id);
                        });
                    }
                    else {
                        const handleBeforeUnload = (e) => {
                            e.preventDefault();
                            e.returnValue = '您確定要離開金流設定嗎？您將會失去未儲存的更改。';
                        };
                        window.parent.document.addEventListener('beforeunload', handleBeforeUnload);
                    }
                },
            }),
        ].join(BgWidget.mbContainer(24))}
                ${BgWidget.mbContainer(240)}
                <div class="update-bar-container">
                    ${BgWidget.save(gvc.event(() => {
            dialog.dataLoading({ visible: true });
            saasConfig.api.setPrivateConfig(saasConfig.config.appName, 'glitter_finance', keyData).then((r) => {
                setTimeout(() => {
                    dialog.dataLoading({ visible: false });
                    if (r.response) {
                        dialog.successMessage({ text: '設定成功' });
                    }
                    else {
                        dialog.errorMessage({ text: '設定失敗' });
                    }
                }, 300);
            });
        }), '儲存', 'guide2-6')}
                </div>
            `);
    }
    static line_pay(gvc, keyData) {
        var _a;
        const defText = html `<p>您選擇了線下Line Pay付款。請完成付款後，提供證明截圖(圖一)，或是照著(圖二)的流程擷取『付款詳細資訊』並上傳，以便我們核款。&nbsp;</p>
        <p>
            <br/><img src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722924978722-Frame%205078.png"
                      class="fr-fic fr-dii" style="width: 215px;"/>&nbsp;<img
                src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722924973580-Frame%205058.png"
                class="fr-fic fr-dii"
                style="width: 545px;"
        />
        </p>
        <p>
            <br/>
        </p> `;
        keyData.payment_info_line_pay = (_a = keyData.payment_info_line_pay) !== null && _a !== void 0 ? _a : {
            text: '',
        };
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    var _a;
                    return [
                        html `
                            <div class="d-flex justify-content-between mb-3">
                                <div class="tx_normal">付款說明</div>
                                ${BgWidget.blueNote('返回預設', gvc.event(() => {
                            keyData.payment_info_line_pay.text = defText;
                            gvc.notifyDataChange(id);
                        }))}
                            </div>`,
                        BgWidget.richTextEditor({
                            gvc: gvc,
                            content: (_a = keyData.payment_info_line_pay.text) !== null && _a !== void 0 ? _a : '',
                            callback: (content) => {
                                keyData.payment_info_line_pay.text = content;
                            },
                            title: '付款說明'
                        })
                    ].join('');
                },
            };
        });
    }
    static customerText(gvc, keyData, id) {
        keyData.payment_info_custom[id] = Object.assign({ text: '' }, keyData.payment_info_custom[id]);
        return gvc.bindView(() => {
            const view_id = gvc.glitter.getUUID();
            return {
                bind: view_id,
                view: () => {
                    return [
                        html `
                            <div class="d-flex justify-content-between mb-3">
                                <div class="tx_normal">付款說明</div>
                            </div>`,
                        BgWidget.richTextEditor({
                            gvc: gvc,
                            content: keyData.payment_info_custom[id].text,
                            callback: (content) => {
                                keyData.payment_info_custom[id].text = content;
                            },
                            title: '付款說明'
                        })
                    ].join('');
                },
            };
        });
    }
    static atm(gvc, keyData) {
        var _a;
        const defText = html `<p>當日下單匯款，隔日出貨，後天到貨。</p>
        <p>若有需要統一編號 請提早告知</p>
        <p>------------------------------------------------------------------</p>
        <p>＊採臨櫃匯款者，電匯單上匯款人姓名與聯絡電話請務必填寫。</p> `;
        keyData.payment_info_atm =
            (_a = keyData.payment_info_atm) !== null && _a !== void 0 ? _a : {
                bank_account: '',
                bank_code: '',
                bank_name: '',
                bank_user: '',
            };
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    var _a, _b;
                    return [
                        html `
                            <div class="row w-100">
                                ${[
                            {
                                key: 'bank_code',
                                title: '銀行代號',
                            },
                            {
                                key: 'bank_name',
                                title: '銀行名稱',
                            },
                            {
                                key: 'bank_user',
                                title: '銀行戶名',
                            },
                            {
                                key: 'bank_account',
                                title: '銀行帳號',
                            },
                        ]
                            .map((dd) => {
                            return html `
                                                <div class="col-12 col-md-6 mb-2 pe-0 pe-md-2">
                                                    <div class="w-100 mb-1">
                                                        <span style="color: #393939; font-size: 16px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word">${dd.title}</span>
                                                        <span style="color: #E80000; font-size: 16px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word">*</span>
                                                    </div>
                                                    <input
                                                            class="form-control w-100"
                                                            placeholder="請輸入${dd.title}"
                                                            value="${keyData.payment_info_atm[dd.key]}"
                                                            onchange="${gvc.event((e, event) => {
                                keyData.payment_info_atm[dd.key] = e.value;
                            })}"
                                                    />
                                                </div>`;
                        })
                            .join('')}
                            </div>`,
                        html `
                            <div class="my-2 px-1" style="display:flex;justify-content: space-between;">
                                <div class="tx_normal">付款說明</div>
                                ${BgWidget.blueNote('返回預設', gvc.event(() => {
                            keyData.payment_info_atm.text = defText;
                            gvc.notifyDataChange(id);
                        }))}
                            </div>`,
                        ``,
                        BgWidget.richTextEditor({
                            gvc: gvc,
                            content: (_b = (_a = keyData.payment_info_atm) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : '',
                            callback: (content) => {
                                keyData.payment_info_atm.text = content;
                                gvc.notifyDataChange(id);
                            },
                            title: '付款說明'
                        })
                    ].join('');
                },
                divCreate: { class: 'guide2-5' },
            };
        });
    }
    static logistics_setting(gvc, widget) {
        const saasConfig = window.parent.saasConfig;
        const vm = {
            id: gvc.glitter.getUUID(),
            loading: true,
            data: {},
            delivery: {
                Action: 'test',
                toggle: 'false',
                HASH_IV: '',
                HASH_KEY: '',
                SenderName: '',
                MERCHANT_ID: '',
                SenderCellPhone: '',
                SenderAddress: '',
            },
            language: window.parent.store_info.language_setting.def,
        };
        saasConfig.api.getPrivateConfig(saasConfig.config.appName, 'logistics_setting').then((r) => {
            if (r.response.result[0]) {
                vm.data = r.response.result[0].value;
            }
            vm.loading = false;
            if (!vm.data.language_data) {
                vm.data.language_data = {
                    'en-US': { info: '' },
                    'zh-CN': { info: '' },
                    'zh-TW': { info: vm.data.info || '' },
                };
            }
            gvc.notifyDataChange(vm.id);
        });
        function save() {
            saasConfig.api.setPrivateConfig(saasConfig.config.appName, 'logistics_setting', vm.data);
        }
        return gvc.bindView(() => {
            return {
                bind: vm.id,
                view: () => {
                    if (vm.loading) {
                        return BgWidget.spinner();
                    }
                    vm.data.support = vm.data.support || [];
                    const language_data = vm.data.language_data[vm.language];
                    vm.data.info = vm.data.info || '';
                    vm.data.form = vm.data.form || [];
                    return BgWidget.container(html `
                            <div class="title-container">
                                ${BgWidget.title('配送設定')}
                                <div class="flex-fill"></div>
                                ${BgWidget.grayButton('物流追蹤設定', gvc.event(() => {
                        BgWidget.dialog({
                            gvc: gvc,
                            title: '物流追蹤設定',
                            innerHTML: (gvc) => {
                                return gvc.bindView((() => {
                                    const id = gvc.glitter.getUUID();
                                    let loading = true;
                                    return {
                                        bind: id,
                                        view: () => {
                                            if (loading) {
                                                return BgWidget.spinner();
                                            }
                                            else {
                                                return [
                                                    BgWidget.openBoxContainer({
                                                        gvc,
                                                        tag: 'delivery_alert_info',
                                                        title: '注意事項',
                                                        insideHTML: html `
                                                                                        <div class="mt-2"
                                                                                             style="white-space: normal;">
                                                                                            ${BgWidget.alertInfo('', [
                                                            '1. 僅提供<b>「綠界C2C物流」</b>建立與追蹤',
                                                            '2. 可追蹤四大超商（7-ELEVEN、全家、萊爾富、OK超商）',
                                                            '3. 若無填寫物流追蹤設定，此功能將在結帳時忽略執行',
                                                            '4. 寄件人名稱請設定最多10字元（中文5個字, 英文10個字, 不得含指定特殊符號）',
                                                            '5. 寄件人手機應為09開頭的格式',
                                                        ])}
                                                                                        </div>`,
                                                        height: document.body.clientWidth > 768 ? 300 : 385,
                                                    }),
                                                    ...(() => {
                                                        var _a, _b, _c, _d, _e, _f, _g, _h;
                                                        let array = [
                                                            BgWidget.inlineCheckBox({
                                                                title: '啟用狀態',
                                                                gvc: gvc,
                                                                def: (_a = vm.delivery.toggle) !== null && _a !== void 0 ? _a : 'false',
                                                                array: [
                                                                    {
                                                                        title: '關閉',
                                                                        value: 'false',
                                                                    },
                                                                    {
                                                                        title: '開啟',
                                                                        value: 'true',
                                                                    },
                                                                ],
                                                                callback: (text) => {
                                                                    vm.delivery.toggle = text;
                                                                    gvc.notifyDataChange(id);
                                                                },
                                                                type: 'single',
                                                            }),
                                                        ];
                                                        if (vm.delivery.toggle === 'true') {
                                                            array = array.concat([
                                                                BgWidget.inlineCheckBox({
                                                                    title: '串接路徑',
                                                                    gvc: gvc,
                                                                    def: (_b = vm.delivery.Action) !== null && _b !== void 0 ? _b : 'test',
                                                                    array: [
                                                                        {
                                                                            title: '正式站',
                                                                            value: 'main',
                                                                        },
                                                                        {
                                                                            title: '測試站',
                                                                            value: 'test',
                                                                        },
                                                                    ],
                                                                    callback: (text) => {
                                                                        vm.delivery.Action = text;
                                                                    },
                                                                    type: 'single',
                                                                }),
                                                                BgWidget.editeInput({
                                                                    gvc: gvc,
                                                                    title: '寄件人名稱',
                                                                    default: (_c = vm.delivery.SenderName) !== null && _c !== void 0 ? _c : '',
                                                                    callback: (text) => {
                                                                        vm.delivery.SenderName = text;
                                                                    },
                                                                    placeHolder: '請輸入寄件人名稱 / 您的商家名稱',
                                                                }),
                                                                BgWidget.editeInput({
                                                                    gvc: gvc,
                                                                    title: '寄件人手機',
                                                                    default: (_d = vm.delivery.SenderCellPhone) !== null && _d !== void 0 ? _d : '',
                                                                    callback: (text) => {
                                                                        vm.delivery.SenderCellPhone = text;
                                                                    },
                                                                    placeHolder: '請輸入寄件人手機 / 您的手機',
                                                                }),
                                                                BgWidget.editeInput({
                                                                    gvc: gvc,
                                                                    title: '寄件人地址',
                                                                    default: (_e = vm.delivery.SenderAddress) !== null && _e !== void 0 ? _e : '',
                                                                    callback: (text) => {
                                                                        vm.delivery.SenderAddress = text;
                                                                    },
                                                                    placeHolder: '請輸入寄件人地址 / 商家地址',
                                                                }),
                                                                BgWidget.editeInput({
                                                                    gvc: gvc,
                                                                    title: '特店編號',
                                                                    default: (_f = vm.delivery.MERCHANT_ID) !== null && _f !== void 0 ? _f : '',
                                                                    callback: (text) => {
                                                                        vm.delivery.MERCHANT_ID = text;
                                                                    },
                                                                    placeHolder: '請輸入特店編號',
                                                                }),
                                                                BgWidget.editeInput({
                                                                    gvc: gvc,
                                                                    title: 'HASH KEY',
                                                                    default: (_g = vm.delivery.HASH_KEY) !== null && _g !== void 0 ? _g : '',
                                                                    callback: (text) => {
                                                                        vm.delivery.HASH_KEY = text;
                                                                    },
                                                                    placeHolder: '請輸入 HASH KEY',
                                                                }),
                                                                BgWidget.editeInput({
                                                                    gvc: gvc,
                                                                    title: 'HASH IV',
                                                                    default: (_h = vm.delivery.HASH_IV) !== null && _h !== void 0 ? _h : '',
                                                                    callback: (text) => {
                                                                        vm.delivery.HASH_IV = text;
                                                                    },
                                                                    placeHolder: '請輸入 HASH IV',
                                                                }),
                                                            ]);
                                                        }
                                                        return array;
                                                    })(),
                                                ].join(BgWidget.mbContainer(12));
                                            }
                                        },
                                        divCreate: {},
                                        onCreate: () => {
                                            if (loading) {
                                                ApiPageConfig.getPrivateConfig(window.parent.appName, 'glitter_delivery').then((res) => {
                                                    vm.delivery = (() => {
                                                        try {
                                                            return res.response.result[0].value;
                                                        }
                                                        catch (error) {
                                                            return vm.delivery;
                                                        }
                                                    })();
                                                    loading = false;
                                                    gvc.notifyDataChange(id);
                                                });
                                            }
                                        },
                                    };
                                })());
                            },
                            save: {
                                text: '儲存',
                                event: () => {
                                    return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                                        const dialog = new ShareDialog(gvc.glitter);
                                        function checkSenderPattern(input) {
                                            const senderPattern = /^[\u4e00-\u9fa5]{2,5}|[a-zA-Z]{4,10}$/;
                                            return senderPattern.test(input);
                                        }
                                        function checkPhonePattern(input) {
                                            const phonePattern = /^09\d{8}$/;
                                            return phonePattern.test(input);
                                        }
                                        function checkAddressPattern(input) {
                                            const addressPattern = /^.{6,60}$/;
                                            return addressPattern.test(input);
                                        }
                                        if (CheckInput.isEmpty(vm.delivery.SenderName) || !checkSenderPattern(vm.delivery.SenderName)) {
                                            dialog.infoMessage({
                                                text: html `
                                                                        <div class="text-center">寄件人名稱請設定最多10字元<br/>（中文5個字,
                                                                            英文10個字,<br/>不得含指定特殊符號）
                                                                        </div>`,
                                            });
                                            resolve(false);
                                            return;
                                        }
                                        if (CheckInput.isEmpty(vm.delivery.SenderCellPhone) || !checkPhonePattern(vm.delivery.SenderCellPhone)) {
                                            dialog.infoMessage({ text: '寄件人手機應為09開頭的手機格式' });
                                            resolve(false);
                                            return;
                                        }
                                        if (!vm.delivery.SenderAddress || !checkAddressPattern(vm.delivery.SenderAddress)) {
                                            dialog.infoMessage({
                                                text: html `
                                                                        <div class="text-center">
                                                                            請輸入正確的寄件人地址<br/>（中文6~60個字）
                                                                        </div>`
                                            });
                                            resolve(false);
                                            return;
                                        }
                                        ApiPageConfig.setPrivateConfigV2({
                                            key: 'glitter_delivery',
                                            value: JSON.stringify(vm.delivery),
                                            appName: saasConfig.config.appName,
                                        }).then((r) => {
                                            dialog.dataLoading({ visible: false });
                                            if (r.response) {
                                                dialog.successMessage({ text: '設定成功' });
                                            }
                                            else {
                                                dialog.errorMessage({ text: '設定失敗' });
                                            }
                                            resolve(true);
                                        });
                                    }));
                                },
                            },
                            cancel: {},
                        });
                    }))}
                            </div>
                            ${gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        function refresh() {
                            gvc.notifyDataChange(id);
                        }
                        function updateCustomShipment(obj) {
                            const custom_delivery = JSON.parse(JSON.stringify(obj.data || {
                                name: '',
                                id: gvc.glitter.getUUID(),
                            }));
                            let form = undefined;
                            BgWidget.settingDialog({
                                gvc: gvc,
                                title: '新增自訂物流',
                                innerHTML: (gvc) => {
                                    form = BgWidget.customForm(gvc, [
                                        {
                                            title: html `
                                                        <div class="tx_normal fw-bolder mt-2 d-flex flex-column"
                                                             style="margin-bottom: 12px;">
                                                            自訂物流表單
                                                            <span style="color:#8D8D8D;font-size: 12px;">當客戶選擇此物流時所需填寫的額外資料</span>
                                                        </div>`,
                                            key: `form_delivery_${custom_delivery.id}`,
                                            no_padding: true,
                                        },
                                    ]);
                                    return gvc.bindView((() => {
                                        const id = gvc.glitter.getUUID();
                                        return {
                                            bind: id,
                                            view: () => {
                                                return [
                                                    BgWidget.editeInput({
                                                        gvc: gvc,
                                                        title: '自訂物流名稱',
                                                        default: custom_delivery.name,
                                                        callback: (text) => {
                                                            custom_delivery.name = text;
                                                        },
                                                        placeHolder: '請輸入自訂物流名稱',
                                                        global_language: true
                                                    }),
                                                    form.view,
                                                ].join(BgWidget.mbContainer(12));
                                            },
                                            divCreate: {},
                                            onCreate: () => {
                                            },
                                        };
                                    })());
                                },
                                footer_html: (gvc) => {
                                    let array = [
                                        BgWidget.save(gvc.event(() => {
                                            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                                                var _a;
                                                const dialog = new ShareDialog(gvc.glitter);
                                                if (!custom_delivery.name) {
                                                    dialog.errorMessage({ text: `請輸入物流名稱!` });
                                                    return;
                                                }
                                                vm.data.custom_delivery = (_a = vm.data.custom_delivery) !== null && _a !== void 0 ? _a : [];
                                                if (obj.function === 'plus') {
                                                    vm.data.custom_delivery.push(custom_delivery);
                                                }
                                                else {
                                                    vm.data.custom_delivery[vm.data.custom_delivery.findIndex((d1) => {
                                                        return d1.id === custom_delivery.id;
                                                    })] = custom_delivery;
                                                }
                                                dialog.dataLoading({ visible: true });
                                                yield form.save();
                                                yield saasConfig.api.setPrivateConfig(saasConfig.config.appName, 'logistics_setting', vm.data);
                                                dialog.dataLoading({ visible: false });
                                                dialog.successMessage({ text: '設定成功' });
                                                gvc.closeDialog();
                                                refresh();
                                            }));
                                        })),
                                    ];
                                    if (obj.function === 'replace') {
                                        array = [
                                            BgWidget.danger(gvc.event(() => {
                                                const dialog = new ShareDialog(gvc.glitter);
                                                dialog.checkYesOrNot({
                                                    text: '是否確認刪除?',
                                                    callback: (response) => __awaiter(this, void 0, void 0, function* () {
                                                        if (response) {
                                                            vm.data.custom_delivery = vm.data.custom_delivery.filter((d1) => {
                                                                return obj.data.id !== d1.id;
                                                            });
                                                            dialog.dataLoading({ visible: true });
                                                            yield saasConfig.api.setPrivateConfig(saasConfig.config.appName, 'logistics_setting', vm.data);
                                                            dialog.dataLoading({ visible: false });
                                                            refresh();
                                                            gvc.closeDialog();
                                                        }
                                                    }),
                                                });
                                            })),
                                        ].concat(array);
                                    }
                                    return array.join('');
                                },
                            });
                        }
                        return {
                            bind: id,
                            view: () => {
                                var _a;
                                return [
                                    {
                                        title: '中華郵政',
                                        value: 'normal',
                                        src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/Chunghwa_Post_Logo.svg.png',
                                    },
                                    {
                                        title: '黑貓到府',
                                        value: 'black_cat',
                                        src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/w644 (1).jpeg',
                                    },
                                    {
                                        title: '7-ELEVEN超商交貨便',
                                        value: 'UNIMARTC2C',
                                        src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716734544575-34f72af5b441738b1f65a0597c28d9cf (1).png',
                                    },
                                    {
                                        title: '全家店到店',
                                        value: 'FAMIC2C',
                                        src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716734396302-e970be63c9acb23e41cf80c77b7ca35b.jpeg',
                                    },
                                    {
                                        title: '萊爾富店到店',
                                        value: 'HILIFEC2C',
                                        src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716734423037-6e2664ad52332c40b4106868ada74646.png',
                                    },
                                    {
                                        title: 'OK超商店到店',
                                        value: 'OKMARTC2C',
                                        src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716734510490-beb1c70f9e168b7bab198ea2bf226148.png',
                                    },
                                    {
                                        title: '國際快遞',
                                        value: 'global_express',
                                        type: 'font_awesome',
                                        src: `<i class="fa-sharp fa-regular fa-earth-americas" style="font-size: 35px;color:#1d59c0;"></i>`,
                                    },
                                    {
                                        title: '實體門市取貨',
                                        value: 'shop',
                                        type: 'font_awesome',
                                        src: `<i class="fa-duotone fa-solid fa-shop" style="font-size: 35px;color:#319e49;"></i>`,
                                    }
                                ]
                                    .concat(((_a = vm.data.custom_delivery) !== null && _a !== void 0 ? _a : []).map((dd) => {
                                    return {
                                        title: Language.getLanguageCustomText(dd.name),
                                        value: dd.id,
                                        custom: true,
                                        type: 'font_awesome',
                                        src: `<i class="fa-regular fa-puzzle-piece-simple fs-4"></i>`,
                                    };
                                }))
                                    .map((dd) => {
                                    return html `
                                                        <div class="col-12 col-md-4 p-0 p-md-2">
                                                            <div
                                                                    class="w-100 position-relative main-card"
                                                                    style="padding: 24px 32px; background: white; overflow: hidden; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 18px; display: inline-flex;"
                                                            >
                                                                ${(() => {
                                        if (dd.custom) {
                                            return html `
                                                                            <div class="position-absolute d-flex" style="cursor:pointer;right:15px;top:15px;gap:5px;">
                                                                                ${BgWidget.customButton({
                                                button: {
                                                    color: 'gray',
                                                    size: 'sm'
                                                },
                                                text: {
                                                    name: `物流設定`
                                                },
                                                event: gvc.event(() => {
                                                    updateCustomShipment({
                                                        function: 'replace',
                                                        data: vm.data.custom_delivery.find((d1) => {
                                                            return dd.value === d1.id;
                                                        }),
                                                    });
                                                })
                                            })}
                                                                                ${BgWidget.customButton({
                                                button: {
                                                    color: 'gray',
                                                    size: 'sm'
                                                },
                                                text: {
                                                    name: `運費設定`
                                                },
                                                event: gvc.event(() => {
                                                    const vm = {
                                                        gvc: gvc,
                                                        key: dd.value,
                                                        save_event: () => {
                                                            return new Promise((resolve, reject) => {
                                                                resolve(true);
                                                            });
                                                        }
                                                    };
                                                    BgWidget.settingDialog({
                                                        gvc: gvc,
                                                        width: 1200,
                                                        height: document.body.clientHeight - 100,
                                                        title: `『 ${dd.title} 』運費設定`,
                                                        d_main_style: document.body.clientWidth < 768 ? 'padding:0px !important;' : ``,
                                                        innerHTML: (gvc) => {
                                                            vm.gvc = gvc;
                                                            return ShoppingShipmentSetting.main(vm);
                                                        },
                                                        footer_html: (gvc) => {
                                                            return [BgWidget.cancel(gvc.event(() => {
                                                                    gvc.closeDialog();
                                                                })), BgWidget.save(gvc.event(() => {
                                                                    vm.save_event().then(() => {
                                                                    });
                                                                }))].join('');
                                                        }
                                                    });
                                                })
                                            })}
                                                                            </div>
                                                                           `;
                                        }
                                        else {
                                            return html `
                                                                            <div class="position-absolute fw-500"
                                                                                 style="cursor:pointer;right:15px;top:15px;">
                                                                                ${BgWidget.customButton({
                                                button: {
                                                    color: 'gray',
                                                    size: 'sm'
                                                },
                                                text: {
                                                    name: `運費設定`
                                                },
                                                event: gvc.event(() => {
                                                    const vm = {
                                                        gvc: gvc,
                                                        key: dd.value,
                                                        save_event: () => {
                                                            return new Promise((resolve, reject) => {
                                                                resolve(true);
                                                            });
                                                        }
                                                    };
                                                    BgWidget.settingDialog({
                                                        gvc: gvc,
                                                        width: 1200,
                                                        height: document.body.clientHeight - 100,
                                                        title: `『 ${dd.title} 』運費設定`,
                                                        d_main_style: document.body.clientWidth < 768 ? 'padding:0px !important;' : ``,
                                                        innerHTML: (gvc) => {
                                                            vm.gvc = gvc;
                                                            return ShoppingShipmentSetting.main(vm);
                                                        },
                                                        footer_html: (gvc) => {
                                                            return [BgWidget.cancel(gvc.event(() => {
                                                                    gvc.closeDialog();
                                                                })), BgWidget.save(gvc.event(() => {
                                                                    vm.save_event().then(() => {
                                                                    });
                                                                }))].join('');
                                                        }
                                                    });
                                                })
                                            })}
                                                                            </div>`;
                                        }
                                    })()}
                                                                <div style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 28px; display: inline-flex">
                                                                    <div style="min-width: 46px;max-width: 46px;">
                                                                        ${dd.type === 'font_awesome' ? dd.src : html `
                                                                            <img src="${dd.src}"/>`}
                                                                    </div>
                                                                    <div style="flex-direction: column; justify-content: center; align-items: flex-start; gap: 4px; display: inline-flex">
                                                                        <div class="tx_normal">${dd.title}</div>
                                                                        <div class="d-flex align-items-center"
                                                                             style="gap:4px;">
                                                                            <div class="tx_normal">
                                                                                ${vm.data.support.find((d1) => {
                                        return dd.value === d1;
                                    })
                                        ? `開啟`
                                        : `關閉`}
                                                                            </div>
                                                                            <div class="cursor_pointer form-check form-switch"
                                                                                 style="margin-top: 10px;">
                                                                                <input
                                                                                        class="form-check-input"
                                                                                        type="checkbox"
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
                                        gvc.notifyDataChange(id);
                                    })}"
                                                                                        ${vm.data.support.find((d1) => {
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
                                                        </div>
                                                        ${document.body.clientWidth > 768 ? '' : BgWidget.mbContainer(8)}
                                                    `;
                                })
                                    .concat([
                                    html `
                                                        <div
                                                                class="col-12 col-md-4 p-0 p-md-2"
                                                                style="cursor: pointer;"
                                                                onclick="${gvc.event(() => {
                                        updateCustomShipment({ function: 'plus' });
                                    })}"
                                                        >
                                                            <div
                                                                    class="w-100 main-card"
                                                                    style="min-height:121px;padding: 24px; background: white; overflow: hidden; flex-direction: column; justify-content: center; align-items: center; gap: 18px; display: inline-flex"
                                                            >
                                                                <div class="fw-bold"
                                                                     style="align-self: stretch; justify-content: center; align-items: center; gap: 14px; display: inline-flex;color:#4D86DB;">
                                                                    <i class="fa-regular fa-circle-plus fs-5"></i>
                                                                    <div class="fs-5">新增自訂物流</div>
                                                                </div>
                                                            </div>
                                                        </div>`,
                                ])
                                    .join('');
                            },
                            divCreate: {
                                class: 'row guide3-3 mt-3 px-1',
                            },
                        };
                    })}
                            ${BgWidget.mbContainer(12)}
                            ${BgWidget.mainCard([
                        html `
                                            <div class="title-container px-0">
                                                <div class="d-flex d-md-block gap-2 align-items-center">
                                                    <div class="tx_700">
                                                            配送說明${BgWidget.languageInsignia(vm.language, 'margin-left:5px;')}
                                                    </div>
                                                    ${document.body.clientWidth > 768
                            ? BgWidget.grayNote('於結帳頁面中顯示，告知顧客配送所需要注意的事項')
                            : BgWidget.iconButton({
                                icon: 'info',
                                event: gvc.event(() => {
                                    BgWidget.jumpAlert({
                                        gvc,
                                        text: '於結帳頁面中顯示，告知顧客配送所需要注意的事項',
                                        justify: 'top',
                                        align: 'center',
                                        width: 220,
                                    });
                                }),
                            })}
                                                </div>
                                                <div class="flex-fill"></div>
                                                ${LanguageBackend.switchBtn({
                            gvc: gvc,
                            language: vm.language,
                            callback: (language) => {
                                vm.language = language;
                                gvc.notifyDataChange(vm.id);
                            },
                        })}
                                            </div>`,
                        ,
                        BgWidget.mbContainer(18),
                        html `
                                            <div class="guide3-4">
                                                ${gvc.bindView((() => {
                            const id = gvc.glitter.getUUID();
                            return {
                                bind: id,
                                view: () => {
                                    return html `
                                                                        <div
                                                                                class="d-flex justify-content-between align-items-center gap-3 mb-1"
                                                                                style="cursor: pointer;"
                                                                                onclick="${gvc.event(() => {
                                        const originContent = `${language_data.info}`;
                                        BgWidget.fullDialog({
                                            gvc: gvc,
                                            title: (gvc2) => {
                                                return `<div class="d-flex align-items-center" style="gap:10px;">${'配送資訊' +
                                                    BgWidget.aiChatButton({
                                                        gvc: gvc2,
                                                        select: 'writer',
                                                        click: () => {
                                                            ProductAi.generateRichText(gvc, (text) => {
                                                                language_data.info += text;
                                                                gvc.notifyDataChange(vm.id);
                                                                gvc2.recreateView();
                                                            });
                                                        },
                                                    })}</div>`;
                                            },
                                            innerHTML: (gvc2) => {
                                                return html `
                                                                                                <div>
                                                                                                    ${EditorElem.richText({
                                                    gvc: gvc2,
                                                    def: language_data.info,
                                                    setHeight: '100vh',
                                                    hiddenBorder: true,
                                                    insertImageEvent: (editor) => {
                                                        const mark = `{{${Tool.randomString(8)}}}`;
                                                        editor.selection.setAtEnd(editor.$el.get(0));
                                                        editor.html.insert(mark);
                                                        editor.undo.saveStep();
                                                        imageLibrary.selectImageLibrary(gvc, (urlArray) => {
                                                            if (urlArray.length > 0) {
                                                                const imgHTML = urlArray
                                                                    .map((url) => {
                                                                    return html `
                                                                                                                                            <img src="${url.data}"/>`;
                                                                })
                                                                    .join('');
                                                                editor.html.set(editor.html.get(0).replace(mark, html `
                                                                                                                                        <div class="d-flex flex-column">
                                                                                                                                            ${imgHTML}
                                                                                                                                        </div>`));
                                                                editor.undo.saveStep();
                                                            }
                                                            else {
                                                                const dialog = new ShareDialog(gvc.glitter);
                                                                dialog.errorMessage({ text: '請選擇至少一張圖片' });
                                                            }
                                                        }, html `
                                                                                                                        <div class="d-flex flex-column"
                                                                                                                             style="border-radius: 10px 10px 0px 0px;background: #F2F2F2;">
                                                                                                                            圖片庫
                                                                                                                        </div>`, {
                                                            mul: true,
                                                            cancelEvent: () => {
                                                                editor.html.set(editor.html.get(0).replace(mark, ''));
                                                                editor.undo.saveStep();
                                                            },
                                                        });
                                                    },
                                                    callback: (text) => {
                                                        language_data.info = text;
                                                    },
                                                    rich_height: `calc(${window.parent.innerHeight}px - 70px - 58px - 49px - 64px - 40px + ${document.body.clientWidth < 800 ? `70` : `0`}px)`,
                                                })}
                                                                                                </div>`;
                                            },
                                            footer_html: (gvc2) => {
                                                return [
                                                    BgWidget.cancel(gvc2.event(() => {
                                                        language_data.info = originContent;
                                                        gvc2.closeDialog();
                                                    })),
                                                    BgWidget.save(gvc2.event(() => {
                                                        gvc2.closeDialog();
                                                        gvc.notifyDataChange(id);
                                                    })),
                                                ].join('');
                                            },
                                            closeCallback: () => {
                                                language_data.info = originContent;
                                            },
                                        });
                                    })}"
                                                                        >
                                                                            ${(() => {
                                        const text = gvc.glitter.utText.removeTag(language_data.info);
                                        return BgWidget.richTextView(Tool.truncateString(text, 100));
                                    })()}
                                                                        </div>`;
                                },
                            };
                        })())}
                                            </div>`,
                    ].join(''))}
                            <div style="width: 100%;padding: 14px 16px;background: #FFF; display: flex;justify-content: end;position: fixed;bottom: 0;right: 0;z-index:1;gap:14px;">
                                ${BgWidget.save(gvc.event(() => __awaiter(this, void 0, void 0, function* () {
                        yield widget.event('loading', { visible: true });
                        save();
                        yield widget.event('loading', { visible: false });
                        yield widget.event('success', { title: '儲存成功' });
                    })), '儲存', 'guide3-5')}
                            </div>
                            ${BgWidget.mbContainer(240)}
                        `);
                },
                divCreate: {
                    class: `d-flex justify-content-center w-100 flex-column align-items-center `,
                },
            };
        });
    }
    static invoice_setting_v2(gvc, widget) {
        const saasConfig = window.parent.saasConfig;
        const glitter = window.glitter;
        const vm = {
            id: glitter.getUUID(),
            loading: true,
            data: {},
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
        return gvc.bindView({
            bind: vm.id,
            view: () => {
                return BgWidget.container(html `
                        <div class="title-container">
                            ${BgWidget.title('發票設定')}
                            <div class="flex-fill"></div>
                        </div>
                        ${BgWidget.container([
                    BgWidget.mainCard(gvc.bindView(() => {
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
                                    if (vm.data.point === 'beta') {
                                        vm.data.whiteList = (_a = vm.data.whiteList) !== null && _a !== void 0 ? _a : [];
                                        vm.data.whiteListExpand = (_b = vm.data.whiteListExpand) !== null && _b !== void 0 ? _b : {};
                                    }
                                    resolve(gvc.bindView(() => {
                                        var _a, _b;
                                        vm.data.fincial = (_a = vm.data.fincial) !== null && _a !== void 0 ? _a : 'ezpay';
                                        vm.data.point = (_b = vm.data.point) !== null && _b !== void 0 ? _b : 'beta';
                                        const id = gvc.glitter.getUUID();
                                        return {
                                            bind: id,
                                            view: () => {
                                                return html `
                                                                                    <div class="d-flex flex-column"
                                                                                         style="gap:18px;">
                                                                                        <div class="tx_normal fw-bold">
                                                                                            服務商選擇
                                                                                        </div>
                                                                                        ${[
                                                    {
                                                        title: html `
                                                                                                    <div class="d-flex flex-column">
                                                                                                        綠界發票
                                                                                                        <span style="color:#8D8D8D;font-size: 12px;">透過綠界服務商串接，於商品購買時，自動開立電子發票</span>
                                                                                                    </div>`,
                                                        value: 'ecpay',
                                                    },
                                                    {
                                                        title: html `
                                                                                                    <div class="d-flex flex-column">
                                                                                                        線下開立
                                                                                                        <span style="color:#8D8D8D;font-size: 12px;">顧客需填寫發票資訊，由店家自行開立發票</span>
                                                                                                    </div>`,
                                                        value: 'off_line',
                                                    },
                                                    {
                                                        title: html `
                                                                                                    <div class="d-flex flex-column">
                                                                                                        不開立電子發票
                                                                                                        <span style="color:#8D8D8D;font-size: 12px;">顧客不需填寫發票資訊，不需開立電子發票</span>
                                                                                                    </div>`,
                                                        value: 'nouse',
                                                    },
                                                ]
                                                    .map((dd) => {
                                                    return html `
                                                                                                        <div>
                                                                                                            ${[
                                                        html `
                                                                                                                    <div
                                                                                                                            class="d-flex align-items-center cursor_pointer"
                                                                                                                            style="gap:8px;"
                                                                                                                            onclick="${gvc.event(() => {
                                                            vm.data.fincial = dd.value;
                                                            gvc.notifyDataChange(id);
                                                        })}"
                                                                                                                    >
                                                                                                                        ${vm.data.fincial === dd.value
                                                            ? `<i class="fa-sharp fa-solid fa-circle-dot color39"></i>`
                                                            : ` <div class="c_39_checkbox"></div>`}
                                                                                                                        <div class="tx_normal fw-normal">
                                                                                                                            ${dd.title}
                                                                                                                        </div>
                                                                                                                    </div>`,
                                                        html `
                                                                                                                    <div class="d-flex position-relative mt-2">
                                                                                                                        <div class="ms-2 border-end position-absolute h-100"
                                                                                                                             style="left: 0px;"></div>
                                                                                                                        <div class="flex-fill "
                                                                                                                             style="margin-left:30px;max-width: 518px;">
                                                                                                                            ${(() => {
                                                            var _a, _b, _c;
                                                            if (vm.data.fincial === 'nouse' ||
                                                                vm.data.fincial === 'off_line' ||
                                                                vm.data.fincial !== dd.value) {
                                                                return [].join('');
                                                            }
                                                            else {
                                                                return [
                                                                    BgWidget.inlineCheckBox({
                                                                        title: '站點',
                                                                        gvc: gvc,
                                                                        def: vm.data.point,
                                                                        array: [
                                                                            {
                                                                                title: '測試區',
                                                                                value: 'beta',
                                                                            },
                                                                            {
                                                                                title: '正式區',
                                                                                value: 'official',
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
                                                                        },
                                                                    }),
                                                                    BgWidget.editeInput({
                                                                        gvc: gvc,
                                                                        title: '特店編號',
                                                                        default: (_a = vm.data.merchNO) !== null && _a !== void 0 ? _a : '',
                                                                        type: 'text',
                                                                        placeHolder: '請輸入特店編號',
                                                                        callback: (text) => {
                                                                            vm.data.merchNO = text;
                                                                        },
                                                                    }),
                                                                    BgWidget.editeInput({
                                                                        gvc: gvc,
                                                                        title: 'HashKey',
                                                                        default: (_b = vm.data.hashkey) !== null && _b !== void 0 ? _b : '',
                                                                        type: 'text',
                                                                        placeHolder: '請輸入HashKey',
                                                                        callback: (text) => {
                                                                            vm.data.hashkey = text;
                                                                            if (vm.data.point == 'beta') {
                                                                                vm.data.bhashkey = text;
                                                                            }
                                                                            else {
                                                                                vm.data.ohashkey = text;
                                                                            }
                                                                        },
                                                                    }),
                                                                    BgWidget.editeInput({
                                                                        gvc: gvc,
                                                                        title: 'HashIV',
                                                                        default: (_c = vm.data.hashiv) !== null && _c !== void 0 ? _c : '',
                                                                        type: 'text',
                                                                        placeHolder: '請輸入HashIV',
                                                                        callback: (text) => {
                                                                            vm.data.hashiv = text;
                                                                            if (vm.data.point == 'beta') {
                                                                                vm.data.bhashiv = text;
                                                                            }
                                                                            else {
                                                                                vm.data.ohashiv = text;
                                                                            }
                                                                        },
                                                                    }),
                                                                ].join(BgWidget.mbContainer(12));
                                                            }
                                                        })()}
                                                                                                                        </div>
                                                                                                                    </div>`,
                                                    ].join('')}
                                                                                                        </div>`;
                                                })
                                                    .join('')}
                                                                                    </div>
                                                                                `;
                                            },
                                            divCreate: {
                                                style: ``,
                                                class: `w-100`,
                                            },
                                        };
                                    }));
                                }));
                            },
                            divCreate: {
                                class: 'd-flex flex-column flex-column-reverse flex-md-row px-0',
                                style: 'gap:10px;',
                            },
                        };
                    })),
                    BgWidget.mbContainer(240),
                    html `
                                        <div class="update-bar-container">
                                            ${BgWidget.save(gvc.event(() => {
                        save(() => {
                            const dialog = new ShareDialog(gvc.glitter);
                            dialog.successMessage({ text: '設定成功' });
                        });
                    }))}
                                        </div>`,
                ].join(''))}
                    `);
            },
        });
    }
    static removeUndefined(originParams) {
        const params = Object.fromEntries(Object.entries(originParams).filter(([_, value]) => value !== undefined));
        return params;
    }
}
window.glitter.setModule(import.meta.url, ShoppingFinanceSetting);
