import { GVC } from '../glitterBundle/GVController.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';

const html = String.raw;
export class PosCheckoutSetting {
    public static main(gvc: GVC) {
        return `<div>${PosCheckoutSetting.invoiceSetting(gvc)}</div>`;
    }

    public static paymentMethod() {}

    public static invoiceSetting(gvc: GVC) {
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
        const dialog = new ShareDialog(gvc.glitter);

        function save(next: () => void) {
            dialog.dataLoading({ visible: true, text: '請稍候...' });
            saasConfig.api.setPrivateConfig(saasConfig.config.appName, `invoice_setting`, vm.data).then((r: { response: any; result: boolean }) => {
                setTimeout(() => {
                    dialog.dataLoading({ visible: false, text: '請稍候...' });
                    if (r.response) {
                        next();
                    } else {
                        dialog.errorMessage({ text: '設定失敗' });
                    }
                }, 1000);
            });
        }

        return gvc.bindView({
            bind: vm.id,
            view: () => {
                return BgWidget.container(
                    html`
                        <div class="title-container">
                            ${BgWidget.title(`發票設定`)}
                            <div class="flex-fill"></div>
                        </div>
                        ${BgWidget.container(
                            [
                                BgWidget.mainCard(
                                    gvc.bindView(() => {
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
                                                                        <div class="d-flex flex-column" style="gap:18px;">
                                                                            ${[
                                                                                {
                                                                                    title: html` <div class="d-flex flex-column">
                                                                                        開立發票
                                                                                        <span class="" style="color:#8D8D8D;font-size: 12px;">串接綠界電子發票系統進行發票開立</span>
                                                                                    </div>`,
                                                                                    value: 'ecpay',
                                                                                },
                                                                                // {
                                                                                //     title: html` <div class="d-flex flex-column">
                                                                                //                     線下開立
                                                                                //                     <span class="" style="color:#8D8D8D;font-size: 12px;">顧客需填寫發票資訊，由店家自行開立發票</span>
                                                                                //                 </div>`,
                                                                                //     value: 'off_line',
                                                                                // },
                                                                                {
                                                                                    title: html` <div class="d-flex flex-column">不開立發票</div>`,
                                                                                    value: 'nouse',
                                                                                },
                                                                            ]
                                                                                .map((dd) => {
                                                                                    return html` <div>
                                                                                        ${[
                                                                                            html` <div
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
                                                                                            html` <div class="d-flex position-relative mt-2" style="">
                                                                                                <div class="ms-2 border-end position-absolute h-100" style="left: 0px;"></div>
                                                                                                <div class="flex-fill " style="margin-left:30px;max-width: 518px;">
                                                                                                    ${(() => {
                                                                                                        if (
                                                                                                            vm.data.fincial === 'nouse' ||
                                                                                                            vm.data.fincial === 'off_line' ||
                                                                                                            vm.data.fincial !== dd.value
                                                                                                        ) {
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
                                                                                                            ].join(html` <div class="" style="height: 12px;"></div>`);
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
                                            divCreate: {
                                                class: 'd-flex flex-column flex-column-reverse flex-md-row px-0',
                                                style: 'gap:10px;',
                                            },
                                        };
                                    })
                                ),
                                BgWidget.mbContainer(240),
                                html` <div class="update-bar-container">
                                    ${BgWidget.save(
                                        gvc.event(() => {
                                            save(() => {
                                                dialog.successMessage({ text: '設定成功' });
                                            });
                                        })
                                    )}
                                </div>`,
                            ].join('')
                        )}
                    `
                );
            },
        });
    }
}
(window as any).glitter.setModule(import.meta.url, PosCheckoutSetting);
