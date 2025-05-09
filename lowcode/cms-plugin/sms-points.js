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
import { SmsPointsApi } from '../glitter-base/route/sms-points-api.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { AiPointsApi } from '../glitter-base/route/ai-points-api.js';
const html = String.raw;
export class SmsPoints {
    static main(gvc) {
        return [
            BgWidget.container([
                BgWidget.mainCard([
                    BgWidget.title('SMS Points'),
                    BgWidget.grayNote([`*透過SMS Points來進行手機簡訊發送`, `*1塊台幣可以換取10點SMS Points`, `*最少儲值金額500元`, `*SMS Points購買後無法退費，請購買前瞭解會員權益需知`]
                        .map((dd) => {
                        return `<div style="letter-spacing: 1.2px;">${dd}</div>`;
                    })
                        .join('')),
                    html ` <div class="d-flex align-items-center rounded-3" style="height:35px;width:100%;max-width: 500px;">
                                <div style="height:100%;background:var(--main-black-hover)" class="d-flex align-items-center justify-content-center text-white px-3">目前 SMS Points</div>
                                <div class="bgf6 d-flex align-items-center flex-fill h-100 ps-3 pe-2">
                                    ${gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        const vm = {
                            loading: true,
                            sum: 0,
                        };
                        SmsPointsApi.getSum({}).then((res) => {
                            vm.sum = parseInt(res.response.sum, 10);
                            vm.loading = false;
                            gvc.notifyDataChange(id);
                        });
                        return {
                            bind: id,
                            view: () => {
                                if (vm.loading) {
                                    return `<div class="h-100 d-flex align-items-center"><div class="spinner-border" style="height:20px;width: 20px;"></div></div>`;
                                }
                                else {
                                    return `${vm.sum.toLocaleString()}`;
                                }
                            },
                        };
                    })}
                                    <div class="flex-fill"></div>
                                    ${BgWidget.blueNote('儲值', gvc.event(() => {
                        SmsPoints.store(gvc);
                    }))}
                                </div>
                            </div>`,
                ].join(`<div class="my-2"></div>`)),
            ].join('')),
            BgWidget.mbContainer(24),
            SmsPoints.walletList(gvc),
        ].join('');
    }
    static walletList(gvc) {
        const glitter = gvc.glitter;
        const vm = {
            type: 'list',
            data: {},
            dataList: undefined,
            query: '',
            select: 'all',
        };
        const filterID = gvc.glitter.getUUID();
        return gvc.bindView(() => {
            const id = glitter.getUUID();
            const dialog = new ShareDialog(gvc.glitter);
            function refresh() {
                gvc.notifyDataChange(id);
            }
            return {
                bind: id,
                dataList: [{ obj: vm, key: 'type' }],
                view: () => {
                    if (vm.type === 'list') {
                        return BgWidget.container(BgWidget.card(html `
                                ${BgWidget.tab([
                            { title: '紀錄總覽', key: 'all' },
                            { title: '使用紀錄', key: 'cost' },
                            { title: '儲值紀錄', key: 'income' },
                        ], gvc, vm.select, (text) => {
                            vm.select = text;
                            gvc.notifyDataChange(id);
                        })}
                                ${BgWidget.tableV3({
                            gvc: gvc,
                            getData: (vmi) => {
                                const limit = 20;
                                SmsPointsApi.get({
                                    page: vmi.page - 1,
                                    limit: limit,
                                    search: vm.query || undefined,
                                    type: (() => {
                                        switch (vm.select) {
                                            case 'all':
                                                return undefined;
                                            case 'cost':
                                                return 'minus';
                                            case 'income':
                                                return 'plus';
                                        }
                                    })(),
                                }).then((data) => {
                                    function getDatalist() {
                                        return data.response.data.map((dd) => {
                                            var _a;
                                            return [
                                                {
                                                    key: '用戶名稱',
                                                    value: `<span class="fs-7">${(_a = (dd.userData && dd.userData.name)) !== null && _a !== void 0 ? _a : '資料異常'}</span>`,
                                                },
                                                {
                                                    key: '金流單號',
                                                    value: `<span class="fs-7">${dd.status === 2 ? `手動新增` : dd.orderID}</span>`,
                                                },
                                                {
                                                    key: '異動金額',
                                                    value: `${dd.money > 0 ? `<span class="fs-7 text-success">+ ${dd.money}</span>` : `<span class="fs-7 text-danger">- ${dd.money * -1}</span>`}`,
                                                },
                                                {
                                                    key: '異動原因',
                                                    value: `${dd.money > 0 ? `加值服務` : `簡訊發送至${(dd.note && dd.note.phone) || '-'}`}`,
                                                },
                                                {
                                                    key: '異動時間',
                                                    value: `<span class="fs-7">${glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd hh:mm')}</span>`,
                                                },
                                            ];
                                        });
                                    }
                                    vm.dataList = data.response.data;
                                    vmi.pageSize = Math.ceil(data.response.total / limit);
                                    vmi.originalData = vm.dataList;
                                    vmi.tableData = getDatalist();
                                    vmi.loading = false;
                                    vmi.callback();
                                });
                            },
                            rowClick: (data, index) => { },
                            filter: [],
                        })}
                            `));
                    }
                    else {
                        return ``;
                    }
                },
                divCreate: {},
            };
        });
    }
    static store(gvc) {
        return __awaiter(this, void 0, void 0, function* () {
            const dialog = new ShareDialog(gvc.glitter);
            dialog.dataLoading({ visible: true });
            const vm = {
                total: 500,
                note: {},
                return_url: window.parent.location.href,
                user_info: {
                    email: '',
                    invoice_type: 'me',
                    company: '',
                    gui_number: '',
                },
            };
            vm.user_info.email = vm.user_info.email || '';
            const dd = yield ApiUser.getPublicConfig('ai-points-store', 'manager');
            if (dd.response.value) {
                vm.user_info = dd.response.value;
            }
            dialog.dataLoading({ visible: false });
            BgWidget.settingDialog({
                gvc: gvc,
                title: '設定儲值金額',
                innerHTML: (gvc) => {
                    return `<div class="mt-n2">${[
                        BgWidget.select({
                            gvc: gvc,
                            callback: (text) => {
                                vm.total = parseInt(text);
                                gvc.recreateView();
                            },
                            options: [
                                { key: '500', value: '5,000點' },
                                { key: '1000', value: '10,000點' },
                                { key: '1500', value: '15,000點' },
                                { key: '2000', value: '20,000點' },
                            ],
                            default: `${vm.total}`,
                        }),
                        ...(() => {
                            if (vm.total) {
                                return [BgWidget.greenNote(`此次儲值可獲得SMS Points『 ${(vm.total * 10).toLocaleString()} 』`)];
                            }
                            else {
                                return [];
                            }
                        })(),
                        ...(() => {
                            if (gvc.glitter.deviceType !== gvc.glitter.deviceTypeEnum.Ios) {
                                return [
                                    BgWidget.editeInput({
                                        gvc: gvc,
                                        title: `發票寄送電子信箱`,
                                        placeHolder: '請輸入發票寄送電子信箱',
                                        callback: (text) => {
                                            vm.user_info.email = text;
                                        },
                                        type: 'email',
                                        default: vm.user_info.email,
                                    }),
                                    `<div class="tx_normal fw-normal" >發票開立方式</div>`,
                                    BgWidget.select({
                                        gvc: gvc,
                                        callback: (text) => {
                                            vm.user_info.invoice_type = text;
                                            gvc.recreateView();
                                        },
                                        options: [
                                            { key: 'me', value: '個人單位' },
                                            { key: 'company', value: '公司行號' },
                                        ],
                                        default: vm.user_info.invoice_type,
                                    }),
                                    ...(() => {
                                        if (vm.user_info.invoice_type === 'company') {
                                            return [
                                                BgWidget.editeInput({
                                                    gvc: gvc,
                                                    title: `發票抬頭`,
                                                    placeHolder: '請輸入發票抬頭',
                                                    callback: (text) => {
                                                        vm.user_info.company = text;
                                                    },
                                                    type: 'text',
                                                    default: `${vm.user_info.company}`,
                                                }),
                                                BgWidget.editeInput({
                                                    gvc: gvc,
                                                    title: `公司統一編號`,
                                                    placeHolder: '請輸入統一編號',
                                                    callback: (text) => {
                                                        vm.user_info.gui_number = text;
                                                    },
                                                    type: 'number',
                                                    default: `${vm.user_info.gui_number}`,
                                                }),
                                            ];
                                        }
                                        else {
                                            return [];
                                        }
                                    })(),
                                ];
                            }
                            else {
                                return [];
                            }
                        })(),
                    ].join(`<div class="my-2"></div>`)}</div>`;
                },
                footer_html: (gvc) => {
                    return [
                        BgWidget.cancel(gvc.event(() => {
                            gvc.closeDialog();
                        })),
                        BgWidget.save(gvc.event(() => __awaiter(this, void 0, void 0, function* () {
                            if (vm.user_info.invoice_type !== 'company') {
                                vm.user_info.company = '';
                                vm.user_info.gui_number = '';
                            }
                            if (gvc.glitter.deviceType !== gvc.glitter.deviceTypeEnum.Ios) {
                                if (vm.user_info.invoice_type === 'company' && !vm.user_info.company) {
                                    dialog.errorMessage({ text: '請確實填寫發票抬頭' });
                                    return;
                                }
                                else if (vm.user_info.invoice_type === 'company' && !vm.user_info.gui_number) {
                                    dialog.errorMessage({ text: '請確實填寫統一編號' });
                                    return;
                                }
                                else if (!vm.user_info.email) {
                                    dialog.errorMessage({ text: '請確實填寫信箱' });
                                    return;
                                }
                                else if (!BgWidget.isValidEmail(vm.user_info.email)) {
                                    dialog.errorMessage({ text: '請輸入有效信箱' });
                                    return;
                                }
                                else if (vm.user_info.invoice_type === 'company' && !BgWidget.isValidNumbers(vm.user_info.gui_number)) {
                                    dialog.errorMessage({ text: '請輸入有效統一編號' });
                                    return;
                                }
                            }
                            dialog.dataLoading({ visible: true });
                            yield ApiUser.setPublicConfig({
                                key: 'ai-points-store',
                                value: vm.user_info,
                                user_id: 'manager',
                            });
                            vm.note = {
                                invoice_data: vm.user_info,
                            };
                            dialog.dataLoading({ visible: true });
                            if (gvc.glitter.deviceType === gvc.glitter.deviceTypeEnum.Ios) {
                                gvc.glitter.runJsInterFace('in_app_product', {
                                    total: `sms_${vm.total}`,
                                }, (res) => __awaiter(this, void 0, void 0, function* () {
                                    if (res.receipt_data) {
                                        yield AiPointsApi.apple_webhook(res.receipt_data);
                                        window.parent.location.reload();
                                    }
                                    else {
                                        dialog.dataLoading({ visible: false });
                                        dialog.errorMessage({ text: '儲值失敗' });
                                    }
                                }));
                            }
                            else {
                                SmsPointsApi.store(vm).then((res) => __awaiter(this, void 0, void 0, function* () {
                                    dialog.dataLoading({ visible: false });
                                    if (res.response.form) {
                                        const id = gvc.glitter.getUUID();
                                        window.parent.$('body').append(`<div id="${id}" style="display: none;">${res.response.form}</div>`);
                                        window.parent.document.querySelector(`#${id} #submit`).click();
                                    }
                                    else {
                                        dialog.errorMessage({ text: '發生錯誤' });
                                    }
                                }));
                            }
                        }))),
                    ].join('');
                },
            });
            return;
        });
    }
}
window.glitter.setModule(import.meta.url, SmsPoints);
