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
const html = String.raw;
export class ShoppingFinanceSetting {
    static main(gvc) {
        const dialog = new ShareDialog(gvc.glitter);
        const saasConfig = window.parent.saasConfig;
        let keyData = {
            MERCHANT_ID: 'MS350015371',
            HASH_KEY: 'yP9K0sXy1P2WcWfcbhcZDfHASdREcCz1',
            HASH_IV: 'C4AlT6GjEEr1Z9VP',
            ActionURL: 'https://core.newebpay.com/MPG/mpg_gateway',
            TYPE: 'newWebPay',
            payment_info_text: '',
        };
        const vm = {
            id: gvc.glitter.getUUID(),
            onBoxId: gvc.glitter.getUUID(),
            offBoxId: gvc.glitter.getUUID(),
            loading: true,
        };
        const onlinePayArray = [
            { key: 'newWebPay', name: '藍新金流' },
            { key: 'ecPay', name: '綠界金流' },
        ];
        const offlinePayArray = [
            { key: 'atm', name: 'ATM銀行轉帳', customerClass: 'guide2-3' },
            { key: 'line', name: 'LINE Pay' },
            { key: 'cash_on_delivery', name: '貨到付款' },
        ];
        const redDot = html ` <span class="red-dot">*</span>`;
        return BgWidget.container(html `
                ${[
            html ` <div class="title-container">
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
                        keyData.off_line_support = (_a = keyData.off_line_support) !== null && _a !== void 0 ? _a : {
                            line: false,
                            atm: false,
                            cash_on_delivery: false,
                        };
                        return [
                            BgWidget.mainCard(html ` <div class="tx_700">線上金流</div>
                                            ${BgWidget.grayNote('透過藍新或綠界服務商串接線上付款功能')} ${BgWidget.mbContainer(12)}
                                            ${BgWidget.multiCheckboxContainer(gvc, onlinePayArray, keyData.TYPE ? [keyData.TYPE] : [], (data) => {
                                switch (data[0]) {
                                    case 'newWebPay':
                                        keyData.TYPE = data[0];
                                        keyData.ActionURL = 'https://ccore.newebpay.com/MPG/mpg_gateway';
                                        break;
                                    case 'ecPay':
                                        keyData.TYPE = data[0];
                                        keyData.ActionURL = 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5';
                                        break;
                                    case undefined:
                                        keyData.TYPE = undefined;
                                        keyData.ActionURL = '';
                                        break;
                                }
                                gvc.notifyDataChange(vm.onBoxId);
                            }, { single: true, zeroOption: true })}
                                            ${gvc.bindView({
                                bind: vm.onBoxId,
                                view: () => {
                                    const payData = onlinePayArray.find((item) => item.key === keyData.TYPE);
                                    if (payData === undefined) {
                                        return '';
                                    }
                                    return html ` ${BgWidget.mbContainer(12)}
                                                        <div class="tx_700">設定</div>
                                                        ${BgWidget.mbContainer(12)}
                                                        ${BgWidget.openBoxContainer({
                                        gvc,
                                        tag: 'detail',
                                        title: payData.name + redDot,
                                        openOnInit: true,
                                        insideHTML: [
                                            BgWidget.inlineCheckBox({
                                                title: '串接路徑',
                                                gvc: gvc,
                                                def: keyData.ActionURL,
                                                array: (() => {
                                                    if (keyData.TYPE === 'newWebPay') {
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
                                                    keyData.ActionURL = text;
                                                },
                                            }),
                                            BgWidget.inlineCheckBox({
                                                title: '開通付款方式',
                                                gvc: gvc,
                                                def: ['credit', 'atm', 'web_atm', 'c_code', 'c_bar_code'].filter((dd) => {
                                                    return keyData[dd];
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
                                                        keyData[dd] = !!array.find((d1) => {
                                                            return d1 === dd;
                                                        });
                                                    });
                                                },
                                                type: 'multiple',
                                            }),
                                            BgWidget.editeInput({
                                                gvc: gvc,
                                                title: '特店編號',
                                                default: keyData.MERCHANT_ID,
                                                callback: (text) => {
                                                    keyData.MERCHANT_ID = text;
                                                },
                                                placeHolder: '請輸入特店編號',
                                            }),
                                            BgWidget.editeInput({
                                                gvc: gvc,
                                                title: 'HASH_KEY',
                                                default: keyData.HASH_KEY,
                                                callback: (text) => {
                                                    keyData.HASH_KEY = text;
                                                },
                                                placeHolder: '請輸入HASH_KEY',
                                            }),
                                            BgWidget.editeInput({
                                                gvc: gvc,
                                                title: 'HASH_IV',
                                                default: keyData.HASH_IV,
                                                callback: (text) => {
                                                    keyData.HASH_IV = text;
                                                },
                                                placeHolder: '請輸入HASH_IV',
                                            }),
                                        ].join(''),
                                    })}`;
                                },
                            })}`),
                            BgWidget.mainCard(html `
                                            <div class="tx_700">線下金流</div>
                                            ${BgWidget.grayNote('不執行線上付款，由店家自行與消費者商議付款方式')} ${BgWidget.mbContainer(12)}
                                            ${BgWidget.multiCheckboxContainer(gvc, offlinePayArray, offlinePayArray
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
                            }, { single: false })}
                                            ${gvc.bindView({
                                bind: vm.offBoxId,
                                view: () => {
                                    const payData = ['atm', 'line'].filter((key) => {
                                        return keyData.off_line_support[key];
                                    });
                                    if (payData.length == 0) {
                                        return '';
                                    }
                                    return html `
                                                        ${BgWidget.mbContainer(12)}
                                                        <div class="tx_700">付款資訊</div>
                                                        ${BgWidget.grayNote('於訂單確認頁面及通知郵件中顯示，告知顧客付款的銀行帳戶或其他付款說明')} ${BgWidget.mbContainer(12)}
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
                                                title: 'LINE Pay' + redDot,
                                                insideHTML: ShoppingFinanceSetting.line_pay(gvc, keyData),
                                                height: 700,
                                            });
                                        }
                                        return '';
                                    })
                                        .filter((str) => str.length > 0)
                                        .join(BgWidget.mbContainer(12))}
                                                    `;
                                },
                            })}
                                        `),
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
                                keyData = data.response.result[0].value;
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
            if (keyData.TYPE &&
                !['credit', 'atm', 'web_atm', 'c_code', 'c_bar_code'].some((dd) => {
                    return keyData[dd];
                })) {
                dialog.infoMessage({
                    text: html ` <div class="text-center">線上金流需至少選取<br />一種開通付款方式</div>`,
                });
                return;
            }
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
                <br /><img src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722924978722-Frame%205078.png" class="fr-fic fr-dii" style="width: 215px;" />&nbsp;<img
                    src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722924973580-Frame%205058.png"
                    class="fr-fic fr-dii"
                    style="width: 545px;"
                />
            </p>
            <p>
                <br />
            </p> `;
        keyData.payment_info_line_pay = (_a = keyData.payment_info_line_pay) !== null && _a !== void 0 ? _a : {
            text: '',
        };
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    var _a, _b;
                    return [
                        html ` <div class="d-flex justify-content-between mb-3">
                            <div class="tx_normal">付款說明</div>
                            ${BgWidget.blueNote('返回預設', gvc.event(() => {
                            keyData.payment_info_line_pay.text = defText;
                            gvc.notifyDataChange(id);
                        }))}
                        </div>`,
                        EditorElem.richText({
                            gvc: gvc,
                            def: (_b = (_a = keyData.payment_info_line_pay) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : '',
                            callback: (text) => {
                                keyData.payment_info_line_pay.text = text;
                            },
                        }),
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
                        html ` <div class="row w-100">
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
                            return html ` <div class="col-12 col-md-6 mb-2 pe-0 pe-md-2">
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
                        html ` <div class="my-2 px-1" style="display:flex;justify-content: space-between;">
                            <div class="tx_normal">付款說明</div>
                            ${BgWidget.blueNote('返回預設', gvc.event(() => {
                            keyData.payment_info_atm.text = defText;
                            gvc.notifyDataChange(id);
                        }))}
                        </div>`,
                        ``,
                        EditorElem.richText({
                            gvc: gvc,
                            def: (_b = (_a = keyData.payment_info_atm) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : '',
                            callback: (text) => {
                                keyData.payment_info_atm.text = text;
                            },
                        }),
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
            delivery: {},
        };
        saasConfig.api.getPrivateConfig(saasConfig.config.appName, 'logistics_setting').then((r) => {
            if (r.response.result[0]) {
                vm.data = r.response.result[0].value;
            }
            vm.loading = false;
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
                                                        insideHTML: html ` <div class="mt-2" style="white-space: normal;">
                                                                                ${BgWidget.alertInfo('', [
                                                            '1. 僅提供<b>「綠界C2C物流」</b>建立與追蹤',
                                                            '2. 可追蹤四大超商（7-ELEVEN、全家、萊爾富、OK超商）',
                                                            '3. 若無填寫物流追蹤設定，此功能將在結帳時忽略執行',
                                                            '4. 寄件人名稱請設定最多10字元（中文5個字, 英文10個字, 不得含指定特殊符號）',
                                                            '5. 寄件人手機應為09開頭的格式',
                                                        ])}
                                                                            </div>`,
                                                        height: 350,
                                                    }),
                                                    ...(() => {
                                                        vm.delivery.toggle = vm.delivery.toggle || 'false';
                                                        let array = [
                                                            BgWidget.inlineCheckBox({
                                                                title: '啟用狀態',
                                                                gvc: gvc,
                                                                def: vm.delivery.toggle,
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
                                                            }),
                                                        ];
                                                        if (vm.delivery.toggle === 'true') {
                                                            array = array.concat([
                                                                BgWidget.inlineCheckBox({
                                                                    title: '串接路徑',
                                                                    gvc: gvc,
                                                                    def: vm.delivery.Action,
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
                                                                }),
                                                                BgWidget.editeInput({
                                                                    gvc: gvc,
                                                                    title: '寄件人名稱',
                                                                    default: vm.delivery.SenderName,
                                                                    callback: (text) => {
                                                                        vm.delivery.SenderName = text;
                                                                    },
                                                                    placeHolder: '請輸入寄件人名稱 / 您的商家名稱',
                                                                }),
                                                                BgWidget.editeInput({
                                                                    gvc: gvc,
                                                                    title: '寄件人手機',
                                                                    default: vm.delivery.SenderCellPhone,
                                                                    callback: (text) => {
                                                                        vm.delivery.SenderCellPhone = text;
                                                                    },
                                                                    placeHolder: '請輸入寄件人手機 / 您的手機',
                                                                }),
                                                                BgWidget.editeInput({
                                                                    gvc: gvc,
                                                                    title: '特店編號',
                                                                    default: vm.delivery.MERCHANT_ID,
                                                                    callback: (text) => {
                                                                        vm.delivery.MERCHANT_ID = text;
                                                                    },
                                                                    placeHolder: '請輸入特店編號',
                                                                }),
                                                                BgWidget.editeInput({
                                                                    gvc: gvc,
                                                                    title: 'HASH KEY',
                                                                    default: vm.delivery.HASH_KEY,
                                                                    callback: (text) => {
                                                                        vm.delivery.HASH_KEY = text;
                                                                    },
                                                                    placeHolder: '請輸入 HASH KEY',
                                                                }),
                                                                BgWidget.editeInput({
                                                                    gvc: gvc,
                                                                    title: 'HASH IV',
                                                                    default: vm.delivery.HASH_IV,
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
                                                    if (res.result) {
                                                        vm.delivery = res.response.result[0].value;
                                                    }
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
                                        if (CheckInput.isEmpty(vm.delivery.SenderName) || !checkSenderPattern(vm.delivery.SenderName)) {
                                            dialog.infoMessage({
                                                text: html ` <div class="text-center">寄件人名稱請設定最多10字元<br />（中文5個字, 英文10個字,<br />不得含指定特殊符號）</div>`,
                                            });
                                            resolve(false);
                                            return;
                                        }
                                        if (CheckInput.isEmpty(vm.delivery.SenderCellPhone) || !checkPhonePattern(vm.delivery.SenderCellPhone)) {
                                            dialog.infoMessage({ text: '寄件人手機應為09開頭的手機格式' });
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
                                            title: html `<div class="tx_normal fw-bolder mt-2 d-flex flex-column" style="margin-bottom: 12px;">
                                                        自訂物流表單
                                                        <span class="" style="color:#8D8D8D;font-size: 12px;">當客戶選擇此物流時所需填寫的額外資料</span>
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
                                                    }),
                                                    form.view,
                                                ].join(BgWidget.mbContainer(12));
                                            },
                                            divCreate: {},
                                            onCreate: () => { },
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
                                        title: '黑貓 / 郵政',
                                        value: 'normal',
                                        src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716734353666-truck-light 1 (1).svg',
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
                                        title: '實體門市取貨',
                                        value: 'shop',
                                        type: 'font_awesome',
                                        src: `<i class="fa-duotone fa-solid fa-shop" style="font-size: 40px;"></i>`,
                                    },
                                ]
                                    .concat(((_a = vm.data.custom_delivery) !== null && _a !== void 0 ? _a : []).map((dd) => {
                                    return {
                                        title: dd.name,
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
                                            return html `<i
                                                                        class="fa-solid fa-pencil position-absolute"
                                                                        style="cursor:pointer;right:15px;top:15px;"
                                                                        onclick="${gvc.event(() => {
                                                updateCustomShipment({
                                                    function: 'replace',
                                                    data: vm.data.custom_delivery.find((d1) => {
                                                        return dd.value === d1.id;
                                                    }),
                                                });
                                            })}"
                                                                    ></i>`;
                                        }
                                        else {
                                            return ``;
                                        }
                                    })()}
                                                            <div style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 28px; display: inline-flex">
                                                                <div style="min-width: 46px;max-width: 46px;">${dd.type === 'font_awesome' ? dd.src : html `<img src="${dd.src}" />`}</div>
                                                                <div style="flex-direction: column; justify-content: center; align-items: flex-start; gap: 4px; display: inline-flex">
                                                                    <div class="tx_normal">${dd.title}</div>
                                                                    <div class="d-flex align-items-center" style="gap:4px;">
                                                                        <div class="tx_normal">
                                                                            ${vm.data.support.find((d1) => {
                                        return dd.value === d1;
                                    })
                                        ? `開啟`
                                        : `關閉`}
                                                                        </div>
                                                                        <div class="cursor_pointer form-check form-switch" style="margin-top: 10px;">
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
                                    html ` <div
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
                                                        <div class="fw-bold" style="align-self: stretch; justify-content: center; align-items: center; gap: 14px; display: inline-flex;color:#4D86DB;">
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
                        html ` <div class="tx_700">配送說明</div>`,
                        BgWidget.grayNote('於結帳頁面中顯示，告知顧客配送所需要注意的事項'),
                        BgWidget.mbContainer(18),
                        EditorElem.richText({
                            gvc: gvc,
                            def: vm.data.info,
                            callback: (text) => {
                                vm.data.info = text;
                                save();
                            },
                        }),
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
                                                                        <div class="d-flex flex-column" style="gap:18px;">
                                                                            <div class="tx_normal fw-bold">服務商選擇</div>
                                                                            ${[
                                                    {
                                                        title: html ` <div class="d-flex flex-column">
                                                                                        藍新發票
                                                                                        <span class="" style="color:#8D8D8D;font-size: 12px;">透過藍新服務商串接，於商品購買時，自動開立電子發票</span>
                                                                                    </div>`,
                                                        value: 'ezpay',
                                                    },
                                                    {
                                                        title: html ` <div class="d-flex flex-column">
                                                                                        綠界發票
                                                                                        <span class="" style="color:#8D8D8D;font-size: 12px;">透過綠界服務商串接，於商品購買時，自動開立電子發票</span>
                                                                                    </div>`,
                                                        value: 'ecpay',
                                                    },
                                                    {
                                                        title: html ` <div class="d-flex flex-column">
                                                                                        線下開立
                                                                                        <span class="" style="color:#8D8D8D;font-size: 12px;">顧客需填寫發票資訊，由店家自行開立發票</span>
                                                                                    </div>`,
                                                        value: 'off_line',
                                                    },
                                                    {
                                                        title: html ` <div class="d-flex flex-column">
                                                                                        不開立電子發票
                                                                                        <span class="" style="color:#8D8D8D;font-size: 12px;">顧客不需填寫發票資訊，不需開立電子發票</span>
                                                                                    </div>`,
                                                        value: 'nouse',
                                                    },
                                                ]
                                                    .map((dd) => {
                                                    return html ` <div>
                                                                                        ${[
                                                        html ` <div
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
                                                                                                <div class="tx_normal fw-normal">${dd.title}</div>
                                                                                            </div>`,
                                                        html ` <div class="d-flex position-relative mt-2" style="">
                                                                                                <div class="ms-2 border-end position-absolute h-100" style="left: 0px;"></div>
                                                                                                <div class="flex-fill " style="margin-left:30px;max-width: 518px;">
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
                    html ` <div class="update-bar-container">
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
}
window.glitter.setModule(import.meta.url, ShoppingFinanceSetting);
