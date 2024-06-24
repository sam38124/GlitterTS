import { ShareDialog } from '../dialog/ShareDialog.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { GVC } from '../glitterBundle/GVController.js';

const html = String.raw;

export class ShoppingFinanceSetting {
    public static main(gvc: GVC) {
        return ShoppingFinanceSetting.fin_setting(gvc, undefined);
    }

    public static fin_setting(gvc: GVC, widget: any) {
        const saasConfig: { config: any; api: any } = (window.parent as any).saasConfig;
        const glitter = (window as any).glitter;
        const dialog = new ShareDialog(glitter);
        let keyData: {
            MERCHANT_ID: string;
            HASH_KEY: string;
            HASH_IV: string;
            ActionURL: string;
            credit?: boolean;
            atm?: boolean;
            web_atm?: boolean;
            c_code?: boolean;
            c_bar_code?: boolean;
            TYPE?: 'newWebPay' | 'ecPay';
        } = {
            MERCHANT_ID: 'MS350015371',
            HASH_KEY: 'yP9K0sXy1P2WcWfcbhcZDfHASdREcCz1',
            HASH_IV: 'C4AlT6GjEEr1Z9VP',
            ActionURL: 'https://core.newebpay.com/MPG/mpg_gateway',
            TYPE: 'newWebPay',
        };
        const vm = {
            id: gvc.glitter.getUUID(),
        };

        function save(next: () => void) {
            widget.event('loading', { visible: true, title: '請稍候...' });
            saasConfig.api.setPrivateConfig(saasConfig.config.appName, `glitter_finance`, keyData).then((r: { response: any; result: boolean }) => {
                setTimeout(() => {
                    widget.event('loading', { visible: false, title: '請稍候...' });
                    if (r.response) {
                        next();
                    } else {
                        widget.event('error', { title: '設定失敗' });
                    }
                }, 1000);
            });
        }

        return gvc.bindView({
            bind: vm.id,
            view: () => {
                return BgWidget.container(
                    html`
                        <div class="d-flex w-100 align-items-center">
                            ${BgWidget.title(`金流設定`)}
                            <div class="flex-fill"></div>
                        </div>
                        ${gvc.bindView(() => {
                            const id = gvc.glitter.getUUID();
                            return {
                                bind: id,
                                view: () => {
                                    return new Promise(async (resolve, reject) => {
                                        const data = await saasConfig.api.getPrivateConfig(saasConfig.config.appName, `glitter_finance`);
                                        if (data.response.result[0]) {
                                            keyData = data.response.result[0].value;
                                        }
                                        keyData.TYPE = keyData.TYPE || 'newWebPay';
                                        resolve(
                                            gvc.bindView(() => {
                                                const id = gvc.glitter.getUUID();
                                                return {
                                                    bind: id,
                                                    view: () => {
                                                        return html`
                                                            <div class="c_card d-flex flex-column" style="gap:18px;">
                                                                <div class="tx_normal fw-bold">金流選擇</div>
                                                                ${[
                                                                    {
                                                                        title: html`<div class="d-flex flex-column">
                                                                            藍新金流
                                                                            <span class="" style="color:#8D8D8D;font-size: 12px;">透過藍新服務商串接線上付款功能</span>
                                                                        </div>`,
                                                                        value: 'newWebPay',
                                                                    },
                                                                    {
                                                                        title: html`<div class="d-flex flex-column">
                                                                            綠界金流
                                                                            <span class="" style="color:#8D8D8D;font-size: 12px;">透過綠界服務商串接線上付款功能</span>
                                                                        </div>`,
                                                                        value: 'ecPay',
                                                                    },
                                                                    {
                                                                        title: html`<div class="d-flex flex-column">
                                                                            線下付款
                                                                            <span class="" style="color:#8D8D8D;font-size: 12px;">不執行線上付款，由店家自行與消費者商議付款方式</span>
                                                                        </div>`,
                                                                        value: 'off_line',
                                                                    },
                                                                ]
                                                                    .map((dd) => {
                                                                        return html`<div>
                                                                            ${[
                                                                                html` <div
                                                                                    class="d-flex align-items-center cursor_it"
                                                                                    style="gap:8px;"
                                                                                    onclick="${gvc.event(() => {
                                                                                        if (keyData.TYPE !== dd.value) {
                                                                                            keyData.TYPE = dd.value as any;
                                                                                            if (keyData.TYPE === 'newWebPay') {
                                                                                                keyData.ActionURL = 'https://ccore.newebpay.com/MPG/mpg_gateway';
                                                                                            } else {
                                                                                                keyData.ActionURL = 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5';
                                                                                            }
                                                                                            gvc.notifyDataChange(id);
                                                                                        }
                                                                                    })}"
                                                                                >
                                                                                    ${keyData.TYPE === dd.value
                                                                                        ? `<i class="fa-sharp fa-solid fa-circle-dot cl_39"></i>`
                                                                                        : ` <div class="c_39_checkbox"></div>`}
                                                                                    <div class="tx_normal fw-normal">${dd.title}</div>
                                                                                </div>`,
                                                                                html` <div class="d-flex position-relative mt-2" style="">
                                                                                    <div class="ms-2 border-end position-absolute h-100" style="left: 0px;"></div>
                                                                                    <div class="flex-fill " style="margin-left:30px;max-width: 600px;">
                                                                                        ${(() => {
                                                                                            if ((keyData.TYPE as any) === 'off_line' || keyData.TYPE !== dd.value) {
                                                                                                return [].join('');
                                                                                            } else {
                                                                                                return [
                                                                                                    BgWidget.inlineCheckBox({
                                                                                                        title: '金流站點',
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
                                                                                                            } else {
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
                                                                                                        callback: (text: any) => {
                                                                                                            keyData.ActionURL = text;
                                                                                                        },
                                                                                                    }),

                                                                                                    BgWidget.inlineCheckBox({
                                                                                                        title: '開通付款方式',
                                                                                                        gvc: gvc,
                                                                                                        def: ['credit', 'atm', 'web_atm', 'c_code', 'c_bar_code'].filter((dd) => {
                                                                                                            return (keyData as any)[dd];
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
                                                                                                        callback: (array: any) => {
                                                                                                            ['credit', 'atm', 'web_atm', 'c_code', 'c_bar_code'].map((dd) => {
                                                                                                                (keyData as any)[dd] = !!array.find((d1: string) => {
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
                                                                                                ].join('<div class="" style="height: 12px;"></div>');
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
                                            })
                                        );
                                    });
                                },
                                divCreate: { class: `d-flex flex-column flex-column-reverse flex-md-row`, style: `gap:10px; margin-top: 24px;` },
                            };
                        })}
                        <div class="update-bar-container">
                            ${BgWidget.save(
                                gvc.event(() => {
                                    save(() => {
                                        widget.event('success', { title: '設定成功' });
                                    });
                                })
                            )}
                        </div>
                    `,
                    BgWidget.getContainerWidth()
                );
            },
        });
    }

    public static logistics_setting(gvc: GVC, widget: any) {
        const saasConfig: {
            config: any;
            api: any;
        } = (window.parent as any).saasConfig;
        const vm: {
            id: string;
            loading: boolean;
            data: any;
        } = {
            id: gvc.glitter.getUUID(),
            loading: true,
            data: {},
        };
        saasConfig.api.getPrivateConfig(saasConfig.config.appName, 'logistics_setting').then((r: { response: any; result: boolean }) => {
            if (r.response.result[0]) {
                vm.data = r.response.result[0].value;
            }
            vm.loading = false;
            gvc.notifyDataChange(vm.id);
        });
        const dialog = new ShareDialog(gvc.glitter);
        return gvc.bindView(() => {
            return {
                bind: vm.id,
                view: () => {
                    if (vm.loading) {
                        return html` <div class="w-100 d-flex align-items-center justify-content-center">
                            <div class="spinner-border"></div>
                        </div>`;
                    }
                    vm.data.support = vm.data.support || [];
                    return BgWidget.container(
                        html`
                            ${BgWidget.title('宅配設定')}
                            ${gvc.bindView(() => {
                                const id = gvc.glitter.getUUID();
                                return {
                                    bind: id,
                                    view: () => {
                                        return [
                                            {
                                                title: '一般宅配',
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
                                        ]
                                            .map((dd) => {
                                                return html`
                                                    <div class="col-12 col-md-4 mb-3">
                                                        <div
                                                            class="w-100"
                                                            style=" padding: 24px; background: white; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.08); border-radius: 10px; overflow: hidden; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 18px; display: inline-flex"
                                                        >
                                                            <div style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 28px; display: inline-flex">
                                                                <img style="width: 46px;" src="${dd.src}" />
                                                                <div style="flex-direction: column; justify-content: center; align-items: flex-start; gap: 4px; display: inline-flex">
                                                                    <div class="tx_normal">${dd.title}</div>
                                                                    <div class="d-flex align-items-center" style="gap:4px;">
                                                                        <div class="tx_normal">
                                                                            ${vm.data.support.find((d1: any) => {
                                                                                return dd.value === d1;
                                                                            })
                                                                                ? `開啟`
                                                                                : `關閉`}
                                                                        </div>
                                                                        <div class="cursor_it form-check form-switch" style="margin-top: 10px;">
                                                                            <input
                                                                                class=" form-check-input"
                                                                                style=" "
                                                                                type="checkbox"
                                                                                value=""
                                                                                onchange="${gvc.event((e, event) => {
                                                                                    if (
                                                                                        vm.data.support.find((d1: any) => {
                                                                                            return dd.value === d1;
                                                                                        })
                                                                                    ) {
                                                                                        vm.data.support = vm.data.support.filter((d1: any) => {
                                                                                            return dd.value !== d1;
                                                                                        });
                                                                                    } else {
                                                                                        vm.data.support.push(dd.value);
                                                                                    }

                                                                                    saasConfig.api.setPrivateConfig(saasConfig.config.appName, 'logistics_setting', vm.data);
                                                                                    gvc.notifyDataChange(id);
                                                                                })}"
                                                                                ${vm.data.support.find((d1: any) => {
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
                                                `;
                                            })
                                            .join('');
                                    },
                                    divCreate: {
                                        class: 'row',
                                        style: 'margin-top: 24px;',
                                    },
                                };
                            })}
                        `,
                        BgWidget.getContainerWidth()
                    );
                },
                divCreate: {
                    class: `d-flex justify-content-center w-100 flex-column align-items-center `,
                },
            };
        });
    }

    public static invoice_setting_v2(gvc: GVC, widget: any) {
        const saasConfig: {
            config: any;
            api: any;
        } = (window.parent as any).saasConfig;
        const glitter = (window as any).glitter;
        const vm: {
            id: string;
            loading: boolean;
            data: any;
        } = {
            id: glitter.getUUID(),
            loading: true,
            data: {},
        };

        function save(next: () => void) {
            widget.event('loading', { visible: true, title: '請稍候...' });
            saasConfig.api.setPrivateConfig(saasConfig.config.appName, `invoice_setting`, vm.data).then((r: { response: any; result: boolean }) => {
                setTimeout(() => {
                    widget.event('loading', { visible: false, title: '請稍候...' });
                    if (r.response) {
                        next();
                    } else {
                        widget.event('error', { title: '設定失敗' });
                    }
                }, 1000);
            });
        }

        return gvc.bindView({
            bind: vm.id,
            view: () => {
                return BgWidget.container(
                    html`
                        <div class="d-flex w-100 align-items-center mb-3 ">
                            ${BgWidget.title(`發票設定`)}
                            <div class="flex-fill"></div>
                        </div>
                        ${gvc.bindView(() => {
                            const id = gvc.glitter.getUUID();
                            return {
                                bind: id,
                                view: () => {
                                    return new Promise(async (resolve, reject) => {
                                        const data = await saasConfig.api.getPrivateConfig(saasConfig.config.appName, `invoice_setting`);
                                        if (data.response.result[0]) {
                                            vm.data = data.response.result[0].value;
                                        }
                                        if (vm.data.point === 'beta') {
                                            vm.data.whiteList = vm.data.whiteList ?? [];
                                            vm.data.whiteListExpand = vm.data.whiteListExpand ?? {};
                                        }
                                        resolve(
                                            gvc.bindView(() => {
                                                vm.data.fincial = vm.data.fincial ?? 'ezpay';
                                                vm.data.point = vm.data.point ?? 'beta';
                                                const id = gvc.glitter.getUUID();
                                                return {
                                                    bind: id,
                                                    view: () => {
                                                        return html`
                                                            <div class="c_card d-flex flex-column" style="gap:18px;">
                                                                <div class="tx_normal fw-bold">服務商選擇</div>
                                                                ${[
                                                                    {
                                                                        title: html`<div class="d-flex flex-column">
                                                                            藍新發票
                                                                            <span class="" style="color:#8D8D8D;font-size: 12px;">透過藍新服務商串接，於商品購買時，自動開立電子發票</span>
                                                                        </div>`,
                                                                        value: 'ezpay',
                                                                    },
                                                                    {
                                                                        title: html`<div class="d-flex flex-column">
                                                                            綠界發票
                                                                            <span class="" style="color:#8D8D8D;font-size: 12px;">透過綠界服務商串接，於商品購買時，自動開立電子發票</span>
                                                                        </div>`,
                                                                        value: 'ecpay',
                                                                    },
                                                                    {
                                                                        title: html`<div class="d-flex flex-column">
                                                                            線下開立
                                                                            <span class="" style="color:#8D8D8D;font-size: 12px;">顧客需填寫發票資訊，由店家自行開立發票</span>
                                                                        </div>`,
                                                                        value: 'off_line',
                                                                    },
                                                                    {
                                                                        title: html`<div class="d-flex flex-column">
                                                                            不開立電子發票
                                                                            <span class="" style="color:#8D8D8D;font-size: 12px;">顧客不需填寫發票資訊，不需開立電子發票</span>
                                                                        </div>`,
                                                                        value: 'nouse',
                                                                    },
                                                                ]
                                                                    .map((dd) => {
                                                                        return html`<div>
                                                                            ${[
                                                                                html` <div
                                                                                    class="d-flex align-items-center cursor_it"
                                                                                    style="gap:8px;"
                                                                                    onclick="${gvc.event(() => {
                                                                                        vm.data.fincial = dd.value;
                                                                                        gvc.notifyDataChange(id);
                                                                                    })}"
                                                                                >
                                                                                    ${vm.data.fincial === dd.value
                                                                                        ? `<i class="fa-sharp fa-solid fa-circle-dot cl_39"></i>`
                                                                                        : ` <div class="c_39_checkbox"></div>`}
                                                                                    <div class="tx_normal fw-normal">${dd.title}</div>
                                                                                </div>`,
                                                                                html` <div class="d-flex position-relative mt-2" style="">
                                                                                    <div class="ms-2 border-end position-absolute h-100" style="left: 0px;"></div>
                                                                                    <div class="flex-fill " style="margin-left:30px;max-width: 518px;">
                                                                                        ${(() => {
                                                                                            if (vm.data.fincial === 'nouse' || vm.data.fincial === 'off_line' || vm.data.fincial !== dd.value) {
                                                                                                return [].join('');
                                                                                            } else {
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
                                                                                                            } else {
                                                                                                                vm.data.hashkey = vm.data.ohashkey;
                                                                                                                vm.data.hashiv = vm.data.ohashiv;
                                                                                                            }
                                                                                                            gvc.notifyDataChange(id);
                                                                                                        },
                                                                                                    }),
                                                                                                    BgWidget.editeInput({
                                                                                                        gvc: gvc,
                                                                                                        title: '特店編號',
                                                                                                        default: vm.data.merchNO ?? '',
                                                                                                        type: 'text',
                                                                                                        placeHolder: '請輸入特店編號',
                                                                                                        callback: (text) => {
                                                                                                            vm.data.merchNO = text;
                                                                                                        },
                                                                                                    }),
                                                                                                    BgWidget.editeInput({
                                                                                                        gvc: gvc,
                                                                                                        title: 'HashKey',
                                                                                                        default: vm.data.hashkey ?? '',
                                                                                                        type: 'text',
                                                                                                        placeHolder: '請輸入HashKey',
                                                                                                        callback: (text) => {
                                                                                                            vm.data.hashkey = text;
                                                                                                            if (vm.data.point == 'beta') {
                                                                                                                vm.data.bhashkey = text;
                                                                                                            } else {
                                                                                                                vm.data.ohashkey = text;
                                                                                                            }
                                                                                                        },
                                                                                                    }),
                                                                                                    BgWidget.editeInput({
                                                                                                        gvc: gvc,
                                                                                                        title: 'HashIV',
                                                                                                        default: vm.data.hashiv ?? '',
                                                                                                        type: 'text',
                                                                                                        placeHolder: '請輸入HashIV',
                                                                                                        callback: (text) => {
                                                                                                            vm.data.hashiv = text;
                                                                                                            if (vm.data.point == 'beta') {
                                                                                                                vm.data.bhashiv = text;
                                                                                                            } else {
                                                                                                                vm.data.ohashiv = text;
                                                                                                            }
                                                                                                        },
                                                                                                    }),
                                                                                                ].join(html`<div class="" style="height: 12px;"></div>`);
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
                                            })
                                        );
                                    });
                                },
                                divCreate: { class: `d-flex flex-column flex-column-reverse  flex-md-row`, style: `gap:10px;` },
                            };
                        })}

                        <div class="update-bar-container">
                            ${BgWidget.save(
                                gvc.event(() => {
                                    save(() => {
                                        widget.event('success', { title: '設定成功' });
                                    });
                                })
                            )}
                        </div>
                    `,
                    BgWidget.getContainerWidth()
                );
            },
        });
    }
}

(window as any).glitter.setModule(import.meta.url, ShoppingFinanceSetting);
