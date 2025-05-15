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
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
const html = String.raw;
export class PosCheckoutSetting {
    static main(gvc) {
        return `<div>${PosCheckoutSetting.invoiceSetting(gvc)}</div>`;
    }
    static paymentMethod() { }
    static invoiceSetting(gvc) {
        const saasConfig = window.parent.saasConfig;
        const glitter = window.glitter;
        const vm = {
            id: glitter.getUUID(),
            loading: true,
            data: {},
        };
        const dialog = new ShareDialog(gvc.glitter);
        function save(next) {
            dialog.dataLoading({ visible: true, text: '請稍候...' });
            saasConfig.api.setPrivateConfig(saasConfig.config.appName, `invoice_setting`, vm.data).then((r) => {
                setTimeout(() => {
                    dialog.dataLoading({ visible: false, text: '請稍候...' });
                    if (r.response) {
                        next();
                    }
                    else {
                        dialog.errorMessage({ text: '設定失敗' });
                    }
                }, 1000);
            });
        }
        return gvc.bindView({
            bind: vm.id,
            view: () => {
                return BgWidget.container(html `
                        <div class="title-container">
                            ${BgWidget.title(`發票設定`)}
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
                                                                            ${[
                                                    {
                                                        title: html ` <div class="d-flex flex-column">
                                                                                        開立發票
                                                                                        <span  style="color:#8D8D8D;font-size: 12px;">串接綠界電子發票系統進行發票開立</span>
                                                                                    </div>`,
                                                        value: 'ecpay',
                                                    },
                                                    {
                                                        title: html ` <div class="d-flex flex-column">不開立發票</div>`,
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
                                                        html ` <div class="d-flex position-relative mt-2" >
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
                                                                ].join(html ` <div  style="height: 12px;"></div>`);
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
window.glitter.setModule(import.meta.url, PosCheckoutSetting);
